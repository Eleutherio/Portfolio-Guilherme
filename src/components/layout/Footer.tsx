import { useEffect, useState, type CSSProperties } from "react";
import { useApp } from "@/i18n/AppContext";
import { useLiveMetrics } from "@/lib/useLiveMetrics";
import { Link } from "@tanstack/react-router";
import { DeferredPrivacyNoticeDialog } from "@/components/privacy/DeferredPrivacyNoticeDialog";
import { useElementActivity } from "@/hooks/use-element-activity";
import { WebsiteCarbonBadge } from "@/components/layout/WebsiteCarbonBadge";
import { GuiferWordmark } from "@/components/GuiferWordmark";
import { Accessibility as AccessibilityIcon, ShieldCheck } from "lucide-react";

const GREEN_HOSTING_REPORT_URL =
  "https://www.thegreenwebfoundation.org/green-web-check/?url=guifer.tech";
const CORE_WEB_VITALS = new Set(["LCP", "INP", "CLS"]);

export function Footer() {
  const { t, lang } = useApp();
  const year = new Date().getFullYear();
  const { ref, active } = useElementActivity<HTMLElement>();
  const { metrics } = useLiveMetrics(active);
  const descriptions: Record<string, string> = {
    LCP: t.footer.vitalsExplain.LCP,
    INP: t.footer.vitalsExplain.INP,
    CLS: t.footer.vitalsExplain.CLS,
  };
  const navigation = [
    { href: "/#home", label: t.footer.home, cursor: t.cursor.destinations.home },
    { href: "/#sobre", label: t.nav.sobre, cursor: t.cursor.destinations.about },
    { href: "/#projetos", label: t.nav.projetos, cursor: t.cursor.destinations.projects },
    {
      href: "/#habilidades",
      label: t.footer.skills,
      cursor: `${t.cursor.destinations.section} ${t.footer.skills}`,
    },
    {
      href: "/#depoimentos",
      label: t.footer.testimonials,
      cursor: `${t.cursor.destinations.section} ${t.footer.testimonials}`,
    },
    { href: "/#contato", label: t.nav.contato, cursor: t.cursor.destinations.contact },
  ];

  return (
    <footer
      ref={ref}
      className="footer-restored"
      data-runtime-activity={active ? "active" : "paused"}
      data-scroll-lock
      style={
        {
          backgroundColor: "var(--footer-bg)",
          color: "var(--footer-foreground)",
          borderColor: "var(--footer-hairline)",
          "--foreground": "var(--footer-foreground)",
          "--muted-foreground": "var(--footer-muted)",
          "--hairline": "var(--footer-hairline)",
          "--border": "var(--footer-hairline)",
          "--wordmark-negative": "var(--footer-bg)",
        } as CSSProperties
      }
    >
      <div className="section-container py-12 md:py-16">
        <div className="footer-primary-grid grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 xl:grid-cols-12 xl:gap-x-6">
          <div className="footer-identity min-w-0 sm:col-span-2 xl:col-span-7 xl:pr-10">
            <p className="footer-thanks section-editorial-intro">{t.footer.thanks}</p>
            <div className="footer-badges footer-badges-primary flex min-w-0 flex-wrap items-center gap-4 sm:flex-nowrap">
              <a
                href={GREEN_HOSTING_REPORT_URL}
                target="_blank"
                rel="noreferrer noopener"
                data-cursor-open={t.cursor.destinations.greenHosting}
                className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <img
                  src="/images/green-hosting.webp"
                  alt={t.footer.greenHostingBadgeAlt}
                  width={200}
                  height={95}
                  loading="eager"
                  fetchPriority="low"
                  decoding="async"
                  referrerPolicy="no-referrer"
                  className="h-auto w-[170px] max-w-full"
                />
              </a>
              <WebsiteCarbonBadge active={active} lang={lang} />
            </div>
          </div>
          <div className="footer-right-group grid min-w-0 gap-x-12 gap-y-8 sm:col-span-2 sm:grid-cols-2 xl:col-span-5 xl:col-start-8 xl:w-fit xl:justify-self-end">
            <nav aria-label={t.footer.navigationLabel}>
              <p className="ui-control-text mb-2 text-foreground">{t.footer.navigationLabel}</p>
              <ul className="footer-link-list footer-restored__links">
                {navigation.map((item) => (
                  <li key={item.href}>
                    <a href={item.href} data-cursor-open={item.cursor}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="footer-vitals">
              <div className="footer-vitals-header mb-3">
                <span className="footer-vitals-title ui-control-text text-foreground">
                  {t.footer.vitalsLabel}
                </span>
              </div>
              <ul className="footer-restored__vitals">
                {metrics
                  .filter((metric) => CORE_WEB_VITALS.has(metric.k))
                  .map((metric) => (
                    <VitalRow
                      key={metric.k}
                      label={metric.k}
                      value={metric.v}
                      description={descriptions[metric.k]}
                    />
                  ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-institutional-row">
          <LocalTime
            active={active}
            lang={lang}
            location={t.footer.location}
            label={t.footer.localTimeLabel}
          />
          <div className="footer-copyright">
            <Link
              to="/"
              aria-label={t.a11y.homeLink}
              data-cursor-open={t.cursor.destinations.home}
              className="footer-wordmark touch-target inline-flex items-center"
            >
              <GuiferWordmark />
            </Link>
            <span className="meta-text text-muted-foreground">© {year} Guilherme Eleuthério</span>
          </div>
          <nav
            aria-label={t.footer.legalLabel}
            className="footer-legal-block col-span-1 justify-self-stretch sm:col-span-2"
          >
            <div className="meta-text footer-legal-nav flex flex-wrap items-center justify-end gap-x-4 gap-y-1 text-muted-foreground">
              <DeferredPrivacyNoticeDialog triggerClassName="touch-target inline-flex items-center rounded-sm underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-current focus-visible:text-foreground focus-visible:decoration-current">
                <ShieldCheck className="footer-legal-icon" aria-hidden="true" />
                <span>{t.footer.privacy}</span>
              </DeferredPrivacyNoticeDialog>
              <Link
                to="/acessibilidade"
                data-cursor-open={t.cursor.destinations.accessibility}
                className="touch-target inline-flex items-center rounded-sm underline decoration-transparent underline-offset-4 transition-colors hover:text-foreground hover:decoration-current focus-visible:text-foreground focus-visible:decoration-current"
              >
                <AccessibilityIcon className="footer-legal-icon" aria-hidden="true" />
                <span>{t.footer.accessibility}</span>
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </footer>
  );
}
function LocalTime({
  active,
  lang,
  location,
  label,
}: {
  active: boolean;
  lang: string;
  location: string;
  label: string;
}) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const update = () => setNow(new Date());
    update();
    const interval = window.setInterval(update, 30_000);
    return () => window.clearInterval(interval);
  }, [active]);
  const formatted = new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-GB", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(now);
  return (
    <p className="meta-text footer-local-time max-w-full lg:whitespace-nowrap">
      {location} — BRT · {label}: <time dateTime={now.toISOString()}>{formatted}</time>
    </p>
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
    <li className="footer-restored__metric-row">
      <button
        type="button"
        className="footer-restored__metric"
        aria-label={`${label}: ${value}. ${description}`}
      >
        <span>{label}</span>
        <span>{value}</span>
      </button>
      <span aria-hidden="true" className="footer-restored__tooltip">
        {description}
      </span>
    </li>
  );
}
