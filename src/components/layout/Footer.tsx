import { useEffect, useState, type CSSProperties } from "react";
import { Info, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/Brand";
import { ThanksTypewriter } from "@/components/layout/ThanksTypewriter";
import { useApp } from "@/i18n/AppContext";
import { useLiveMetrics } from "@/lib/useLiveMetrics";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

function useClock(locale: string) {
  const [time, setTime] = useState<string>("");
  useEffect(() => {
    const fmt = () =>
      new Date().toLocaleTimeString(locale, {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    setTime(fmt());
    const id = window.setInterval(() => setTime(fmt()), 30_000);
    return () => window.clearInterval(id);
  }, [locale]);
  return time;
}

export function Footer() {
  const { t, lang } = useApp();
  const year = new Date().getFullYear();
  const time = useClock(lang === "pt" ? "pt-BR" : "en-US");
  const { metrics, status } = useLiveMetrics();

  return (
    <footer
      className="border-t"
      style={
        {
          backgroundColor: "var(--footer-bg)",
          color: "var(--footer-foreground)",
          borderColor: "var(--footer-hairline)",
          // Scope-local overrides so descendant tokens inherit the footer palette
          ["--foreground" as string]: "var(--footer-foreground)",
          ["--muted-foreground" as string]: "var(--footer-muted)",
          ["--hairline" as string]: "var(--footer-hairline)",
          ["--border" as string]: "var(--footer-hairline)",
          ["--surface" as string]: "color-mix(in oklab, var(--footer-bg) 85%, white 15%)",
        } as CSSProperties
      }
      data-scroll-lock
    >
      <div className="section-container grid grid-cols-1 gap-8 py-12 md:py-16 lg:grid-cols-[1.4fr_auto_auto] lg:items-start">
        {/* Headline + clock + social */}
        <div className="min-w-0">
          <ThanksTypewriter />

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Porto Alegre — BRT ·{" "}
              <span
                className="text-foreground tabular-nums"
                aria-label={t.footer.localTimeAria}
                suppressHydrationWarning
              >
                {time || "--:--"}
              </span>
            </div>

            <nav aria-label="social" className="flex items-center gap-1.5">
              <a
                href="https://github.com/Eleutherio"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/guifer-dev/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="mailto:contato@guifer.tech"
                aria-label="Email"
                className="grid h-8 w-8 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </nav>
          </div>

          <p className="mt-5 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {t.footer.rights} · © {year}
          </p>
        </div>

        {/* Infra column */}
        <div className="font-mono text-[10px] leading-[1.9] text-muted-foreground">
          <p className="mb-2 uppercase tracking-[0.3em] text-muted-foreground/70">
            {t.footer.infraLabel}
          </p>
          <ul className="space-y-1">
            <li className="text-foreground/85">{t.footer.hosting}</li>
            <li className="text-foreground/85">{t.footer.backend}</li>
            <li className="text-foreground/85">{t.footer.mail}</li>
            <li className="text-foreground/85">{t.footer.captcha}</li>
          </ul>
        </div>

        {/* Vitals column */}
        <div className="font-mono text-[10px] leading-[1.9] text-muted-foreground lg:min-w-[180px]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 uppercase tracking-[0.3em] text-muted-foreground/70">
              {t.footer.vitalsLabel}
              <Popover>
                <PopoverTrigger
                  aria-label={t.footer.vitalsExplainTitle}
                  className="inline-grid h-4 w-4 place-items-center rounded-full text-muted-foreground/60 transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  <Info className="h-3 w-3" />
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  align="end"
                  className="w-72 border border-hairline bg-surface text-xs"
                >
                  <p className="mb-2 font-display text-sm font-medium tracking-tight text-foreground">
                    {t.footer.vitalsExplainTitle}
                  </p>
                  <ul className="space-y-2 font-sans text-[11px] leading-relaxed text-muted-foreground">
                    <li>
                      <span className="font-mono text-foreground">LCP</span> —{" "}
                      {t.footer.vitalsExplain.LCP}
                    </li>
                    <li>
                      <span className="font-mono text-foreground">INP</span> —{" "}
                      {t.footer.vitalsExplain.INP}
                    </li>
                    <li>
                      <span className="font-mono text-foreground">CLS</span> —{" "}
                      {t.footer.vitalsExplain.CLS}
                    </li>
                    <li>
                      <span className="font-mono text-foreground">FPS</span> —{" "}
                      {t.footer.vitalsExplain.FPS}
                    </li>
                  </ul>
                </PopoverContent>
              </Popover>
            </span>
            <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.25em] text-emerald-500">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              live
            </span>
          </div>

          <ul className="space-y-1">
            {metrics.map((m) => (
              <li key={m.k} className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground/70">{m.k}</span>
                <span className="tabular-nums text-foreground/85">{m.v}</span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground/70">{t.footer.pingLabel}</span>
              <span className="tabular-nums text-foreground/85">{status.ping}</span>
            </li>
            <li className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground/70">{t.footer.uptimeLabel}</span>
              <span className="tabular-nums text-foreground/85">{status.uptime}</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
