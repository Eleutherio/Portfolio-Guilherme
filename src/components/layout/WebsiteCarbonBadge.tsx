import { useEffect, useMemo, useState } from "react";

type Language = "pt" | "en";

type CarbonResult = {
  carbon: number;
  cleanerThan: number;
  cachedAt: number;
};

type BadgeStatus = "idle" | "loading" | "ready" | "local" | "unavailable";

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

const copy = {
  pt: {
    measuring: "Medindo CO₂…",
    local: "Disponível na versão publicada",
    unavailable: "Medição indisponível no momento",
    cleaner: (percentage: number) => `Mais limpo que ${percentage}% das páginas testadas`,
    emissions: (carbon: number) => `${carbon} g de CO₂/visita`,
    open: "Abrir Website Carbon",
  },
  en: {
    measuring: "Measuring CO₂…",
    local: "Available on the published website",
    unavailable: "Measurement currently unavailable",
    cleaner: (percentage: number) => `Cleaner than ${percentage}% of pages tested`,
    emissions: (carbon: number) => `${carbon} g of CO₂/view`,
    open: "Open Website Carbon",
  },
} as const;

export function WebsiteCarbonBadge({ active, lang }: { active: boolean; lang: Language }) {
  const [status, setStatus] = useState<BadgeStatus>("idle");
  const [result, setResult] = useState<CarbonResult | null>(null);
  const labels = copy[lang];

  const targetUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${window.location.pathname}`;
  }, []);

  useEffect(() => {
    if (!active || !targetUrl) return;

    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      setStatus("local");
      return;
    }

    const cacheKey = `website-carbon:${targetUrl}`;
    try {
      const cached = window.localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as CarbonResult;
        if (
          Number.isFinite(parsed.carbon) &&
          Number.isFinite(parsed.cleanerThan) &&
          Date.now() - parsed.cachedAt < CACHE_DURATION_MS
        ) {
          setResult(parsed);
          setStatus("ready");
          return;
        }
      }
    } catch {
      try {
        window.localStorage.removeItem(cacheKey);
      } catch {
        // O armazenamento local pode estar bloqueado sem impedir a medição.
      }
    }

    const controller = new AbortController();
    setStatus("loading");

    void fetch(`https://api.websitecarbon.com/b?url=${encodeURIComponent(targetUrl)}`, {
      signal: controller.signal,
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
          carbon,
          cleanerThan: Math.round(cleanerThan),
          cachedAt: Date.now(),
        };
        setResult(nextResult);
        setStatus("ready");
        try {
          window.localStorage.setItem(cacheKey, JSON.stringify(nextResult));
        } catch {
          // A badge continua funcional quando o armazenamento local estiver indisponível.
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setStatus("unavailable");
      });

    return () => controller.abort();
  }, [active, targetUrl]);

  const primary =
    status === "ready" && result
      ? labels.emissions(result.carbon)
      : status === "local"
        ? labels.local
        : status === "unavailable"
          ? labels.unavailable
          : labels.measuring;
  const secondary =
    status === "ready" && result ? labels.cleaner(result.cleanerThan) : "Website Carbon";

  return (
    <a
      href="https://www.websitecarbon.com/"
      target="_blank"
      rel="noreferrer noopener"
      data-cursor-open={labels.open}
      aria-label={`${primary}. ${secondary}`}
      className="group inline-flex max-w-full flex-col items-center text-center font-sans text-[10px] leading-[1.15] no-underline"
    >
      <span className="inline-flex max-w-full items-stretch">
        <span className="inline-flex min-h-8 min-w-[9.5rem] items-center justify-center rounded-l-sm border-2 border-[#00ffbc] bg-white px-2 py-1 text-[#0e11a8]">
          {primary}
        </span>
        <span className="inline-flex min-h-8 items-center justify-center rounded-r-sm border-2 border-l-0 border-[#00ffbc] bg-[#00ffbc] px-2 py-1 font-bold text-[#0e11a8]">
          Website Carbon
        </span>
      </span>
      <span aria-live="polite" className="mt-1 text-[10px] text-foreground/85">
        {secondary}
      </span>
    </a>
  );
}
