import { useEffect, useId, useRef, useState } from "react";
import { Download } from "lucide-react";
import { fetchCoffeeCount, fetchGithubYearStats, submitCoffeeTap } from "@/lib/api-client";
import { useApp } from "@/i18n/AppContext";
import { registerInitialTask } from "@/lib/page-readiness";
import { CoffeeIcon, type CoffeeState } from "@/components/hero/CoffeeIcon";
import { GithubIcon } from "@/components/icons/Brand";
import {
  resolveUnavailableGithubStats,
  type GithubCommitState,
} from "@/components/hero/github-commit-state";

const VISITOR_KEY = "gf_visitor_id";
const TAPPED_KEY = "gf_coffee_tapped";

type RemoteValue<T> =
  { status: "loading" } | { status: "ready"; value: T } | { status: "unavailable" };

type GithubCommitLinkProps = { className?: string };
type ResumeDownloadLinkProps = { className?: string; labelClassName?: string };
type CoffeeCounterProps = { className?: string };

function createVisitorId(): string {
  if (typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  const bytes = window.crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));

  return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`;
}

function ensureVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = createVisitorId();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function GithubCommitLink({ className = "" }: GithubCommitLinkProps) {
  const { t, lang } = useApp();
  const s = t.hero.stats;
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const [githubStats, setGithubStats] = useState<GithubCommitState>({
    status: "loading",
  });

  useEffect(() => {
    let active = true;
    void registerInitialTask(
      fetchGithubYearStats()
        .then((result) => {
          if (!active) return;
          setGithubStats(
            result.status === "ready"
              ? { status: "ready", value: { total: result.total, source: "api" } }
              : resolveUnavailableGithubStats(import.meta.env.DEV),
          );
        })
        .catch(() => {
          if (active) setGithubStats(resolveUnavailableGithubStats(import.meta.env.DEV));
        }),
    );

    return () => {
      active = false;
    };
  }, []);

  const accessibleLabel =
    githubStats.status === "ready"
      ? `${githubStats.value.total.toLocaleString(locale)} ${s.commitsLabel}`
      : githubStats.status === "loading"
        ? s.commitsLoading
        : s.commitsUnavailable;

  return (
    <a
      href="https://github.com/Eleutherio"
      data-cursor-open={t.cursor.destinations.github}
      target="_blank"
      rel="noreferrer noopener"
      aria-label={accessibleLabel}
      data-github-stats-source={
        githubStats.status === "ready" ? githubStats.value.source : githubStats.status
      }
      className={className}
    >
      <GithubIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
      {githubStats.status === "ready" ? (
        <span>
          <span className="tabular-nums text-foreground">
            {githubStats.value.total.toLocaleString(locale)}
          </span>
          <span className="hidden sm:inline"> {s.commitsLabel}</span>
        </span>
      ) : (
        <span aria-live="polite">
          <span className="sm:hidden">{githubStats.status === "loading" ? "..." : "-"}</span>
          <span className="hidden sm:inline">
            {githubStats.status === "loading" ? s.commitsLoading : s.commitsUnavailable}
          </span>
        </span>
      )}
    </a>
  );
}

export function ResumeDownloadLink({
  className = "",
  labelClassName = "",
}: ResumeDownloadLinkProps) {
  const { t } = useApp();

  return (
    <a
      href={t.hero.resumeUrl}
      data-cursor-open={t.cursor.destinations.resume}
      data-resume-download
      download="Guilherme-Eleutherio-Curriculo.pdf"
      type="application/pdf"
      aria-label={t.hero.cta2}
      className={className}
    >
      <Download className="h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
      <span className={labelClassName}>{t.hero.cta2}</span>
    </a>
  );
}

export function CoffeeCounter({ className = "" }: CoffeeCounterProps) {
  const tooltipId = useId();
  const [tooltipHovered, setTooltipHovered] = useState(false);
  const [tooltipFocused, setTooltipFocused] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const tooltipOpen = !tooltipDismissed && (tooltipHovered || tooltipFocused);
  const { t, lang } = useApp();
  const s = t.hero.stats;
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const [tapped, setTapped] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [coffeeState, setCoffeeState] = useState<CoffeeState>("idle");
  const [coffeeCount, setCoffeeCount] = useState<RemoteValue<number>>({ status: "loading" });
  const [tapPending, setTapPending] = useState(false);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    let active = true;
    setVisitorId(ensureVisitorId());
    setTapped(window.localStorage.getItem(TAPPED_KEY) === "1");

    void registerInitialTask(
      fetchCoffeeCount()
        .then((result) => {
          if (active) setCoffeeCount({ status: "ready", value: result.count });
        })
        .catch(() => {
          if (active) setCoffeeCount({ status: "unavailable" });
        }),
    );

    const timers = timersRef.current;
    return () => {
      active = false;
      timers.forEach(clearTimeout);
    };
  }, []);

  const runTapAnimation = () => {
    if (tapped || !visitorId || tapPending) return;
    setCoffeeState("filling");
    const t1 = setTimeout(() => setCoffeeState("tipping"), 350);
    const t2 = setTimeout(() => {
      setTapPending(true);
      void submitCoffeeTap(visitorId)
        .then((result) => {
          setCoffeeCount({ status: "ready", value: result.count });
          window.localStorage.setItem(TAPPED_KEY, "1");
          setTapped(true);
        })
        .catch(() => {
          void fetchCoffeeCount()
            .then((result) => setCoffeeCount({ status: "ready", value: result.count }))
            .catch(() => setCoffeeCount({ status: "unavailable" }));
        })
        .finally(() => setTapPending(false));
    }, 550);
    const t3 = setTimeout(() => setCoffeeState("idle"), 850);
    timersRef.current.push(t1, t2, t3);
  };

  const interactionUnavailable = tapped || !visitorId || tapPending;

  return (
    <span
      className="relative inline-flex max-w-full"
      onPointerEnter={() => {
        setTooltipHovered(true);
        setTooltipDismissed(false);
      }}
      onPointerLeave={() => setTooltipHovered(false)}
    >
      <button
        type="button"
        data-coffee-counter
        aria-describedby={tooltipOpen ? tooltipId : undefined}
        onFocus={() => {
          setTooltipFocused(true);
          setTooltipDismissed(false);
        }}
        onBlur={() => setTooltipFocused(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setTooltipDismissed(true);
        }}
        onClick={runTapAnimation}
        aria-disabled={interactionUnavailable}
        aria-label={tapped ? s.coffeeThanks : s.coffeeOffer}
        className={`ui-control-text touch-target inline-flex max-w-full items-center justify-center gap-1.5 rounded-sm text-center text-muted-foreground transition-colors ${
          interactionUnavailable
            ? "cursor-default opacity-80"
            : "cursor-pointer hover:text-foreground"
        } ${className}`}
      >
        <span className="shrink-0 text-accent">
          <CoffeeIcon state={coffeeState} />
        </span>
        {coffeeCount.status === "ready" ? (
          <span className="inline-flex min-w-0 items-baseline gap-1">
            <span className="relative inline-block min-w-[1ch] shrink-0 overflow-hidden font-normal tabular-nums text-foreground">
              <span key={coffeeCount.value} className="coffee-count-reveal inline-block">
                {coffeeCount.value.toLocaleString(locale)}
              </span>
            </span>
            <span>{coffeeCount.value === 1 ? s.coffeeSingular : s.coffeePlural}</span>
          </span>
        ) : (
          <span className="min-w-0 leading-tight" aria-live="polite">
            {coffeeCount.status === "loading" ? s.coffeeLoading : s.coffeeUnavailable}
          </span>
        )}
      </button>
      {tooltipOpen && (
        <span
          id={tooltipId}
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 w-max max-w-[min(18rem,calc(100vw-2rem))] -translate-x-1/2 rounded-md border border-hairline bg-background px-3 py-2 text-center text-xs leading-relaxed text-foreground shadow-lg"
        >
          {s.coffeeExplanation}
        </span>
      )}
    </span>
  );
}
