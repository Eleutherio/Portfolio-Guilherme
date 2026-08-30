import { useEffect, useRef, useState } from "react";
import { GitCommit } from "lucide-react";
import { fetchCoffeeCount, fetchGithubYearStats, submitCoffeeTap } from "@/lib/api-client";
import { useApp } from "@/i18n/AppContext";
import { CoffeeIcon, type CoffeeState } from "@/components/hero/CoffeeIcon";

const VISITOR_KEY = "gf_visitor_id";
const TAPPED_KEY = "gf_coffee_tapped";

type RemoteValue<T> =
  { status: "loading" } | { status: "ready"; value: T } | { status: "unavailable" };

function ensureVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function HeroStats() {
  const { t, lang } = useApp();
  const s = t.hero.stats;
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const [tapped, setTapped] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [coffeeState, setCoffeeState] = useState<CoffeeState>("idle");
  const [githubStats, setGithubStats] = useState<RemoteValue<{ total: number; year: number }>>({
    status: "loading",
  });
  const [coffeeCount, setCoffeeCount] = useState<RemoteValue<number>>({ status: "loading" });
  const [tapPending, setTapPending] = useState(false);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    let active = true;
    setVisitorId(ensureVisitorId());
    setTapped(window.localStorage.getItem(TAPPED_KEY) === "1");

    void fetchGithubYearStats()
      .then((result) => {
        if (!active) return;
        setGithubStats(
          result.status === "ready"
            ? { status: "ready", value: result }
            : { status: "unavailable" },
        );
      })
      .catch(() => {
        if (active) setGithubStats({ status: "unavailable" });
      });
    void fetchCoffeeCount()
      .then((result) => {
        if (active) setCoffeeCount({ status: "ready", value: result.count });
      })
      .catch(() => {
        if (active) setCoffeeCount({ status: "unavailable" });
      });

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

  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-x-3 gap-y-2 font-mono text-[12px] text-muted-foreground sm:justify-center sm:text-[13px]">
      <a
        href="https://github.com/Eleutherio"
        data-cursor-open={t.cursor.destinations.github}
        target="_blank"
        rel="noreferrer noopener"
        className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <GitCommit className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        {githubStats.status === "ready" ? (
          <span>
            <span className="tabular-nums text-foreground">
              {githubStats.value.total.toLocaleString(locale)}
            </span>{" "}
            {s.commitsLabel}
          </span>
        ) : (
          <span aria-live="polite">
            {githubStats.status === "loading" ? s.commitsLoading : s.commitsUnavailable}
          </span>
        )}
      </a>
      <span aria-hidden="true" className="text-muted-foreground/50">
        ·
      </span>
      <span className="tabular-nums text-foreground">
        {githubStats.status === "ready" ? githubStats.value.year : new Date().getFullYear()}
      </span>
      <span aria-hidden="true" className="text-muted-foreground/50">
        ·
      </span>
      <button
        type="button"
        onClick={runTapAnimation}
        disabled={tapped || !visitorId || tapPending}
        aria-label={tapped ? s.coffeeThanks : s.coffeeOffer}
        title={tapped ? s.coffeeThanksIcon : s.coffeeOffer}
        className={`inline-flex items-center gap-1.5 transition-colors ${
          tapped ? "cursor-default opacity-80" : "cursor-pointer hover:text-foreground"
        }`}
      >
        <span className="text-accent">
          <CoffeeIcon state={coffeeState} />
        </span>
        {coffeeCount.status === "ready" ? (
          <span className="inline-flex items-baseline gap-1">
            <span className="relative inline-block min-w-[1ch] overflow-hidden tabular-nums text-foreground">
              <span key={coffeeCount.value} className="coffee-count-reveal inline-block">
                {coffeeCount.value.toLocaleString(locale)}
              </span>
            </span>
            <span>{coffeeCount.value === 1 ? s.coffeeSingular : s.coffeePlural}</span>
          </span>
        ) : (
          <span aria-live="polite">
            {coffeeCount.status === "loading" ? s.coffeeLoading : s.coffeeUnavailable}
          </span>
        )}
      </button>
    </div>
  );
}
