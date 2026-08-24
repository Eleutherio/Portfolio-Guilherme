import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { useApp } from "@/i18n/AppContext";
import { useLiveMetrics } from "@/lib/useLiveMetrics";
import {
  useInfrastructureStatus,
  type InfrastructureAvailability,
} from "@/lib/useInfrastructureStatus";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "@tanstack/react-router";
import { PrivacyNoticeDialog } from "@/components/privacy/PrivacyNoticeDialog";
import { useElementActivity } from "@/hooks/use-element-activity";
import { GuiferWordmark } from "@/components/GuiferWordmark";
import { WebsiteCarbonBadge } from "@/components/layout/WebsiteCarbonBadge";

function useClock(locale: string, active: boolean) {
  const [time, setTime] = useState("");

  useEffect(() => {
    if (!active) return;

    const formatTime = () =>
      new Date().toLocaleTimeString(locale, {
        timeZone: "America/Sao_Paulo",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

    setTime(formatTime());
    const interval = window.setInterval(() => setTime(formatTime()), 30_000);
    return () => window.clearInterval(interval);
  }, [active, locale]);

  return time;
}

export function Footer() {
  const { t, lang } = useApp();
  const year = new Date().getFullYear();
  const { ref, active } = useElementActivity<HTMLElement>();
  const time = useClock(lang === "pt" ? "pt-BR" : "en-US", active);
  const { metrics, status } = useLiveMetrics(active);
  const infrastructure = useInfrastructureStatus(active);
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
      ref={ref}
      data-runtime-activity={active ? "active" : "paused"}
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
          ["--wordmark-negative" as string]: "var(--footer-bg)",
        } as CSSProperties
      }
      data-scroll-lock
    >
      <div className="section-container py-12 md:py-16">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 xl:grid-cols-12 xl:gap-x-6">
          {/* Brand */}
          <div className="min-w-0 sm:col-span-2 xl:col-span-4 xl:pr-10">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <Link
                to="/"
                aria-label={t.a11y.homeLink}
                data-cursor-open={t.cursor.destinations.home}
                className="inline-flex text-[11.5px] text-foreground"
              >
                <GuiferWordmark />
              </Link>
              <span className="font-sans text-[11px] tracking-normal text-muted-foreground">
                © {year} Guilherme Eleuthério
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav aria-label={t.footer.navigationLabel} className="xl:col-span-2">
            <p className="mb-3 font-sans text-sm font-medium text-foreground">
              {t.footer.navigationLabel}
            </p>
            <ul className="space-y-2 font-sans text-[13px] text-muted-foreground">
              <li>
                <a
                  href="/#projetos"
                  data-cursor-open={t.cursor.destinations.projects}
                  className="transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  {t.nav.projetos}
                </a>
              </li>
              <li>
                <a
                  href="/#sobre"
                  data-cursor-open={t.cursor.destinations.about}
                  className="transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  {t.nav.sobre}
                </a>
              </li>
              <li>
                <a
                  href="/#contato"
                  data-cursor-open={t.cursor.destinations.contact}
                  className="transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  {t.nav.contato}
                </a>
              </li>
            </ul>
          </nav>

          {/* Connections */}
          <nav aria-label={t.footer.connectLabel} className="xl:col-span-2">
            <p className="mb-3 font-sans text-sm font-medium text-foreground">
              {t.footer.connectLabel}
            </p>
            <ul className="space-y-2 font-sans text-[13px] text-muted-foreground">
              <li>
                <a
                  href="https://github.com/Eleutherio"
                  data-cursor-open={t.cursor.destinations.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/guifer-dev/"
                  data-cursor-open={t.cursor.destinations.linkedin}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="mailto:contato@guifer.tech"
                  data-cursor-open={t.cursor.destinations.email}
                  className="transition-colors hover:text-foreground focus-visible:text-foreground"
                >
                  E-mail
                </a>
              </li>
            </ul>
          </nav>

          {/* Infra column */}
          <div className="font-sans text-xs leading-[1.8] text-muted-foreground xl:col-span-2">
            <p className="mb-3 text-sm font-medium tracking-normal text-foreground">
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
          <div className="font-sans text-xs leading-[1.8] text-muted-foreground xl:col-span-2 xl:min-w-[170px]">
            <div className="mb-3">
              <span className="text-sm font-medium tracking-normal text-foreground">
                {t.footer.vitalsLabel}
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

        <div className="mt-10 border-t border-border pt-7 md:mt-12 md:pt-8">
          <div className="flex flex-wrap items-center gap-4">
            <img
              src="https://app.greenweb.org/api/v3/greencheckimage/guifer.tech?nocache=true"
              alt="This website runs on green hosting - verified by thegreenwebfoundation.org"
              width={200}
              height={95}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="h-auto w-[170px] max-w-full"
            />
            <WebsiteCarbonBadge active={active} lang={lang} />
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-5 font-sans text-[11px] tracking-normal text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>
            Porto Alegre — BRT · {t.footer.localTimeLabel}:{" "}
            <span className="tabular-nums text-foreground/85" suppressHydrationWarning>
              {time || "--:--"}
            </span>
          </span>
          <nav
            aria-label={t.footer.legalLabel}
            className="flex flex-wrap items-center gap-x-2 gap-y-1"
          >
            <Link
              to="/acessibilidade"
              data-cursor-open={t.cursor.destinations.accessibility}
              className="rounded-sm underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-current focus-visible:text-foreground focus-visible:decoration-current"
            >
              {t.footer.accessibility}
            </Link>
            <span aria-hidden="true">·</span>
            <PrivacyNoticeDialog triggerClassName="rounded-sm underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-current focus-visible:text-foreground focus-visible:decoration-current">
              {t.footer.privacy}
            </PrivacyNoticeDialog>
          </nav>
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
