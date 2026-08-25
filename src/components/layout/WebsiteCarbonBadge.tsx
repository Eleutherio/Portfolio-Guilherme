import { useEffect, useState, type CSSProperties } from "react";

type Language = "pt" | "en";
type CarbonGrade = "A+" | "A" | "B" | "C" | "D" | "E" | "F";

type CarbonResult = {
  grade: CarbonGrade;
  carbon?: number;
  cleanerThan?: number;
  measuredAt?: number;
  lastAttemptAt: number;
  source: "published" | "api";
};

type BadgeStatus = "unavailable" | "refreshing" | "ready" | "stale";

const REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
const TARGET_URL = "https://guifer.tech/";
const PUBLISHED_REPORT_URL = "https://www.websitecarbon.com/website/guifer-tech/";
const CACHE_KEY = `website-carbon:grade:${TARGET_URL}`;

// Cores da escala visual A+–F exibida no relatório oficial do Website Carbon.
const GRADE_COLORS: Record<CarbonGrade, string> = {
  "A+": "#00f5bd",
  A: "#54f56f",
  B: "#9bfb35",
  C: "#caff00",
  D: "#f5f000",
  E: "#ffb800",
  F: "#ff2028",
};

// Limites oficiais do Digital Carbon Rating para o SWDM v4.
const GRADE_THRESHOLDS: ReadonlyArray<readonly [CarbonGrade, number]> = [
  ["A+", 0.04],
  ["A", 0.079],
  ["B", 0.145],
  ["C", 0.209],
  ["D", 0.278],
  ["E", 0.359],
];

function isCarbonGrade(value: unknown): value is CarbonGrade {
  return ["A+", "A", "B", "C", "D", "E", "F"].includes(String(value));
}

function gradeFromCarbon(carbon: number): CarbonGrade {
  return GRADE_THRESHOLDS.find(([, limit]) => carbon <= limit)?.[0] ?? "F";
}

function readStoredResult(): CarbonResult | null {
  try {
    const stored = window.localStorage.getItem(CACHE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as Partial<CarbonResult> & { cachedAt?: unknown };
    if (parsed.source !== "api") {
      window.localStorage.removeItem(CACHE_KEY);
      return null;
    }

    const carbon = parsed.carbon === undefined ? undefined : Number(parsed.carbon);
    const cleanerThan = parsed.cleanerThan === undefined ? undefined : Number(parsed.cleanerThan);
    const hasCarbon = typeof carbon === "number" && Number.isFinite(carbon);
    const hasCleanerThan = typeof cleanerThan === "number" && Number.isFinite(cleanerThan);
    const grade = isCarbonGrade(parsed.grade)
      ? parsed.grade
      : hasCarbon
        ? gradeFromCarbon(carbon)
        : null;

    if (!grade) return null;

    const lastAttemptAt = Number(parsed.lastAttemptAt ?? parsed.cachedAt ?? 0);
    const measuredAt = Number(parsed.measuredAt ?? parsed.cachedAt ?? 0);

    return {
      grade,
      carbon: hasCarbon ? carbon : undefined,
      cleanerThan: hasCleanerThan ? cleanerThan : undefined,
      measuredAt: Number.isFinite(measuredAt) && measuredAt > 0 ? measuredAt : undefined,
      lastAttemptAt: Number.isFinite(lastAttemptAt) ? lastAttemptAt : 0,
      source: "api",
    };
  } catch {
    return null;
  }
}

function storeResult(result: CarbonResult) {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(result));
  } catch {
    // A badge continua funcional sem persistência quando o storage está bloqueado.
  }
}

const copy = {
  pt: {
    grade: (grade: CarbonGrade) => `Nota ${grade}`,
    published: "Última nota publicada",
    refreshing: "Atualizando a nota diária…",
    stale: "Última nota armazenada · nova tentativa em até 24 horas",
    unavailable: "Medição temporariamente indisponível",
    emission: (carbon: string) => `${carbon} g de CO₂/visita`,
    cleanerThan: (percentage: number) => `Mais limpa que ${percentage}% das páginas testadas`,
    open: "Abrir Website Carbon",
  },
  en: {
    grade: (grade: CarbonGrade) => `Grade ${grade}`,
    published: "Last published grade",
    refreshing: "Updating the daily grade…",
    stale: "Last stored grade · retrying within 24 hours",
    unavailable: "Measurement temporarily unavailable",
    emission: (carbon: string) => `${carbon} g of CO₂/view`,
    cleanerThan: (percentage: number) => `Cleaner than ${percentage}% of pages tested`,
    open: "Open Website Carbon",
  },
} as const;

export function WebsiteCarbonBadge({ active, lang }: { active: boolean; lang: Language }) {
  const [status, setStatus] = useState<BadgeStatus>("unavailable");
  const [result, setResult] = useState<CarbonResult | null>(null);
  const labels = copy[lang];

  useEffect(() => {
    if (!active) return;

    const storedResult = readStoredResult();
    setResult(storedResult);

    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      setStatus(storedResult ? "stale" : "unavailable");
      return;
    }

    if (storedResult && Date.now() - storedResult.lastAttemptAt < REFRESH_INTERVAL_MS) {
      setStatus("ready");
      return;
    }

    const controller = new AbortController();
    setStatus(storedResult ? "stale" : "refreshing");

    void fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(TARGET_URL)}`, {
      signal: controller.signal,
      cache: "no-store",
      referrerPolicy: "no-referrer",
    })
      .then((response) => {
        if (!response.ok) throw new Error("Website Carbon API unavailable");
        return response.json() as Promise<{ c?: number | string; p?: number | string }>;
      })
      .then((payload) => {
        const carbon = Number(payload.c);
        const cleanerThan = Number(payload.p);
        if (!Number.isFinite(carbon) || !Number.isFinite(cleanerThan)) {
          throw new Error("Invalid Website Carbon response");
        }

        const nextResult: CarbonResult = {
          grade: gradeFromCarbon(carbon),
          carbon,
          cleanerThan: Math.round(cleanerThan),
          measuredAt: Date.now(),
          lastAttemptAt: Date.now(),
          source: "api",
        };
        setResult(nextResult);
        setStatus("ready");
        storeResult(nextResult);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;

        if (storedResult) {
          const preservedResult: CarbonResult = {
            ...storedResult,
            lastAttemptAt: Date.now(),
          };
          setResult(preservedResult);
          setStatus("stale");
          storeResult(preservedResult);
          return;
        }

        setResult(null);
        setStatus("unavailable");
      });

    return () => controller.abort();
  }, [active]);

  const primary = result ? labels.grade(result.grade) : labels.unavailable;
  const carbon =
    result?.carbon !== undefined
      ? new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3,
        }).format(result.carbon)
      : null;
  const measurement =
    carbon && result?.cleanerThan !== undefined
      ? {
          emission: labels.emission(carbon),
          cleanerThan: labels.cleanerThan(result.cleanerThan),
        }
      : null;
  const statusLabel = {
    unavailable: labels.unavailable,
    refreshing: labels.refreshing,
    ready: labels.published,
    stale: labels.stale,
  }[status];
  const gradeStyle = {
    "--carbon-grade": result ? GRADE_COLORS[result.grade] : "var(--footer-muted)",
  } as CSSProperties;

  return (
    <a
      href={PUBLISHED_REPORT_URL}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor-open={labels.open}
      aria-label={
        result
          ? `${primary}. ${measurement?.emission ?? statusLabel}. ${measurement?.cleanerThan ?? ""}`
          : statusLabel
      }
      className="group inline-flex max-w-full flex-col items-center text-center font-sans text-[10px] leading-[1.15] no-underline"
      style={gradeStyle}
    >
      <span className="inline-flex max-w-full items-stretch">
        <span className="inline-flex min-h-8 items-center justify-center rounded-l-sm border-2 border-[var(--carbon-grade)] bg-[var(--carbon-grade)] px-2 py-1 font-bold text-[#0e11a8]">
          {result?.grade ?? "—"}
        </span>
        <span className="inline-flex min-h-8 min-w-[8.6rem] items-center justify-center border-y-2 border-[var(--carbon-grade)] bg-white px-2 py-1 text-[#0e11a8]">
          {measurement?.emission ?? statusLabel}
        </span>
        <span className="inline-flex min-h-8 items-center justify-center rounded-r-sm border-2 border-l-0 border-[var(--carbon-grade)] bg-[#0e11a8] px-2 py-1 font-bold text-white">
          Website Carbon
        </span>
      </span>
      <span aria-live="polite" className="mt-1 text-[10px] text-foreground/85">
        {measurement?.cleanerThan ?? statusLabel}
      </span>
      <span className="sr-only">{statusLabel}</span>
    </a>
  );
}
