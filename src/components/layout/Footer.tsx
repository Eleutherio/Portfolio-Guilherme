import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/Brand";
import { ThanksTypewriter } from "@/components/layout/ThanksTypewriter";
import { useApp } from "@/i18n/AppContext";
import { useLiveMetrics } from "@/lib/useLiveMetrics";
import {
  useInfrastructureStatus,
  type InfrastructureAvailability,
} from "@/lib/useInfrastructureStatus";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import { PrivacyNoticeDialog } from "@/components/privacy/PrivacyNoticeDialog";

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
  const infrastructure = useInfrastructureStatus();
  const infrastructureItems = [
    {
      label: t.footer.backend,
      status: infrastructure.services.backend,
      description: t.footer.infrastructureExplain.backend,
    },
    {
      label: t.footer.database,
      status: infrastructure.services.database,
      description: t.footer.infrastructureExplain.database,
    },
    {
      label: t.footer.mail,
      status: infrastructure.services.smtp,
      description: t.footer.infrastructureExplain.smtp,
    },
    {
      label: t.footer.captcha,
      status: infrastructure.services.recaptcha,
      description: t.footer.infrastructureExplain.recaptcha,
    },
  ];
  const vitalDescriptions: Record<string, string> = {
    LCP: t.footer.vitalsExplain.LCP,
    INP: t.footer.vitalsExplain.INP,
    CLS: t.footer.vitalsExplain.CLS,
    FPS: t.footer.vitalsExplain.FPS,
    session: t.footer.vitalsExplain.session,
  };

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
              <span className="text-foreground tabular-nums" suppressHydrationWarning>
                <span className="sr-only">{t.footer.localTimeAria}: </span>
                {time || "--:--"}
              </span>
            </div>

            <nav aria-label={t.a11y.socialNavigation} className="flex items-center gap-1.5">
              <a
                href="https://github.com/Eleutherio"
                aria-label="GitHub"
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent md:h-8 md:w-8"
              >
                <GithubIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/guifer-dev/"
                aria-label="LinkedIn"
                target="_blank"
                rel="noreferrer noopener"
                className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent md:h-8 md:w-8"
              >
                <LinkedinIcon className="h-3.5 w-3.5" />
              </a>
              <a
                href="mailto:contato@guifer.tech"
                aria-label="Email"
                className="grid h-11 w-11 place-items-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent md:h-8 md:w-8"
              >
                <Mail className="h-3.5 w-3.5" />
              </a>
            </nav>
          </div>

          <p className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            <span>
              {t.footer.rights} · © {year}
            </span>
            <span aria-hidden="true">·</span>
            <Link
              to="/acessibilidade"
              className="rounded-sm underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-current focus-visible:text-foreground focus-visible:decoration-current"
            >
              {t.footer.accessibility}
            </Link>
            <span aria-hidden="true">·</span>
            <PrivacyNoticeDialog triggerClassName="rounded-sm underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-current focus-visible:text-foreground focus-visible:decoration-current">
              {t.footer.privacy}
            </PrivacyNoticeDialog>
          </p>
        </div>

        {/* Infra column */}
        <div className="font-mono text-[10px] leading-[1.9] text-muted-foreground">
          <p className="mb-2 uppercase tracking-[0.3em] text-muted-foreground/80">
            {t.footer.infraLabel}
          </p>
          <TooltipProvider delayDuration={200}>
            <ul className="space-y-1">
              {infrastructureItems.map((item) => (
                <InfrastructureRow
                  key={item.label}
                  label={item.label}
                  status={item.status}
                  statusLabel={t.footer.serviceStatus[item.status]}
                  description={item.description}
                />
              ))}
            </ul>
          </TooltipProvider>
        </div>

        {/* Vitals column */}
        <div className="font-mono text-[10px] leading-[1.9] text-muted-foreground lg:min-w-[180px]">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="uppercase tracking-[0.3em] text-muted-foreground/80">
              {t.footer.vitalsLabel}
            </span>
            <span className="inline-flex items-center gap-1.5 uppercase tracking-[0.25em] text-muted-foreground">
              <span className="relative inline-flex h-1.5 w-1.5">
                <span className="relative inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" />
              </span>
              {t.footer.vitalsScope}
            </span>
          </div>

          <TooltipProvider delayDuration={200}>
            <ul className="space-y-1">
              {metrics.map((metric) => (
                <VitalRow
                  key={metric.k}
                  label={metric.k}
                  value={metric.v}
                  description={vitalDescriptions[metric.k]}
                />
              ))}
              <VitalRow
                label={t.footer.uptimeLabel}
                value={status.uptime}
                description={vitalDescriptions.session}
              />
            </ul>
          </TooltipProvider>
        </div>
      </div>
    </footer>
  );
}

function VitalRow({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex min-h-6 w-full items-center justify-between gap-3 rounded-sm text-left outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${label}: ${value}. ${description}`}
          >
            <span className="text-muted-foreground/80">{label}</span>
            <span className="tabular-nums text-foreground/85">{value}</span>
          </button>
        </TooltipTrigger>
        <StatusTooltipContent>{description}</StatusTooltipContent>
      </Tooltip>
    </li>
  );
}

function InfrastructureRow({
  label,
  status,
  statusLabel,
  description,
}: {
  label: string;
  status: InfrastructureAvailability;
  statusLabel: string;
  description: string;
}) {
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="flex min-h-6 w-full items-center gap-2 rounded-sm text-left text-foreground/85 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`${label}: ${statusLabel}. ${description}`}
          >
            <ServiceStatusDot status={status} />
            <span>{label}</span>
          </button>
        </TooltipTrigger>
        <StatusTooltipContent>
          <span className="font-medium text-foreground">
            {label}: {statusLabel}.
          </span>{" "}
          {description}
        </StatusTooltipContent>
      </Tooltip>
    </li>
  );
}

function StatusTooltipContent({ children }: { children: ReactNode }) {
  return (
    <TooltipContent
      side="left"
      className="max-w-[min(20rem,calc(100vw-2rem))] border border-hairline bg-surface font-sans text-[11px] leading-relaxed text-foreground"
    >
      {children}
    </TooltipContent>
  );
}

function ServiceStatusDot({ status }: { status: InfrastructureAvailability }) {
  const color =
    status === "operational"
      ? "bg-emerald-500"
      : status === "unavailable"
        ? "bg-red-500"
        : "bg-muted-foreground";

  return (
    <span aria-hidden="true" className="relative inline-flex h-2 w-2 shrink-0">
      {status === "operational" && (
        <span className={`absolute inset-0 animate-ping rounded-full ${color} opacity-60`} />
      )}
      <span className={`relative inline-block h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}
