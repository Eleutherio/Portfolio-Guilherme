import { useEffect, useState, type CSSProperties } from "react";
import { fetchWebsiteCarbonResult } from "@/lib/api-client";
import {
  WEBSITE_CARBON_SNAPSHOT,
  isWebsiteCarbonResult,
  type CarbonGrade,
  type WebsiteCarbonResult,
} from "@/lib/website-carbon";

type Language = "pt" | "en";

const PUBLISHED_REPORT_URL = "https://www.websitecarbon.com/website/guifer-tech/";
const LEGACY_CACHE_KEYS = [
  "website-carbon:grade:https://guifer.tech/",
  "website-carbon:v2:grade:https://guifer.tech/",
] as const;

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

const copy = {
  pt: {
    grade: (grade: CarbonGrade) => `Nota ${grade}`,
    updatedAt: (date: string) => `Atualizado em ${date}`,
    emission: (carbon: string) => `${carbon} g de CO₂/visita`,
    cleanerThan: (percentage: number) => `Mais limpa que ${percentage}% das páginas testadas`,
    open: "Abrir Website Carbon",
  },
  en: {
    grade: (grade: CarbonGrade) => `Grade ${grade}`,
    updatedAt: (date: string) => `Updated on ${date}`,
    emission: (carbon: string) => `${carbon} g of CO₂/view`,
    cleanerThan: (percentage: number) => `Cleaner than ${percentage}% of pages tested`,
    open: "Open Website Carbon",
  },
} as const;

function formatUpdatedAt(timestamp: string, lang: Language) {
  return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(timestamp));
}

function clearLegacyBrowserCache() {
  try {
    for (const key of LEGACY_CACHE_KEYS) window.localStorage.removeItem(key);
  } catch {
    // A remoção é apenas uma migração; a badge não depende do Web Storage.
  }
}

export function WebsiteCarbonBadge({ active, lang }: { active: boolean; lang: Language }) {
  const [result, setResult] = useState<WebsiteCarbonResult>(WEBSITE_CARBON_SNAPSHOT);
  const labels = copy[lang];

  useEffect(() => {
    if (!active) return;
    clearLegacyBrowserCache();

    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") return;

    const controller = new AbortController();
    void fetchWebsiteCarbonResult(controller.signal)
      .then((nextResult) => {
        if (isWebsiteCarbonResult(nextResult)) setResult(nextResult);
      })
      .catch(() => {
        // O snapshot publicado continua visível se a API própria estiver indisponível.
      });

    return () => controller.abort();
  }, [active]);

  const primary = labels.grade(result.grade);
  const carbon =
    result.carbon !== undefined
      ? new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 3,
        }).format(result.carbon)
      : null;
  const measurement =
    carbon && result.cleanerThan !== undefined
      ? {
          emission: labels.emission(carbon),
          cleanerThan: labels.cleanerThan(result.cleanerThan),
        }
      : null;
  const updatedAtLabel = labels.updatedAt(formatUpdatedAt(result.updatedAt, lang));
  const gradeStyle = {
    "--carbon-grade": GRADE_COLORS[result.grade],
  } as CSSProperties;

  return (
    <a
      href={PUBLISHED_REPORT_URL}
      target="_blank"
      rel="noreferrer noopener"
      data-cursor-open={labels.open}
      aria-label={`${primary}. ${measurement?.emission ? `${measurement.emission}. ` : ""}${measurement?.cleanerThan ? `${measurement.cleanerThan}. ` : ""}${updatedAtLabel}`}
      className="group inline-flex max-w-full flex-col items-center text-center font-sans text-[10px] leading-[1.15] no-underline"
      style={gradeStyle}
    >
      <span className="inline-flex max-w-full items-stretch">
        <span className="inline-flex min-h-8 items-center justify-center rounded-l-sm border-2 border-[var(--carbon-grade)] bg-[var(--carbon-grade)] px-2 py-1 font-bold text-[#0e11a8]">
          {result.grade}
        </span>
        <span className="inline-flex min-h-8 min-w-[8.6rem] items-center justify-center border-y-2 border-[var(--carbon-grade)] bg-white px-2 py-1 text-[#0e11a8]">
          {measurement?.emission ?? updatedAtLabel}
        </span>
        <span className="inline-flex min-h-8 items-center justify-center rounded-r-sm border-2 border-l-0 border-[var(--carbon-grade)] bg-[#0e11a8] px-2 py-1 font-bold text-white">
          Website Carbon
        </span>
      </span>
      {measurement ? (
        <span aria-live="polite" className="mt-1 text-[10px] text-foreground/85">
          {measurement.cleanerThan} · {updatedAtLabel}
        </span>
      ) : null}
    </a>
  );
}
