import { useEffect, useRef, useState } from "react";
import { GitCommit } from "lucide-react";
import { AnimatePresence, motion } from "@/lib/motion";
import {
  fetchCoffeeCount,
  fetchGithubYearStats,
  submitCoffeeTap,
  type GithubYearStats,
} from "@/lib/api-client";
import { useApp } from "@/i18n/AppContext";
import { CoffeeIcon, type CoffeeState } from "@/components/hero/CoffeeIcon";

const VISITOR_KEY = "gf_visitor_id";
const TAPPED_KEY = "gf_coffee_tapped";

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
  const [githubStats, setGithubStats] = useState<GithubYearStats>(null);
  const [coffeeCount, setCoffeeCount] = useState(0);
  const [tapPending, setTapPending] = useState(false);
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    let active = true;
    setVisitorId(ensureVisitorId());
    setTapped(window.localStorage.getItem(TAPPED_KEY) === "1");

    void fetchGithubYearStats()
      .then((result) => {
        if (active) setGithubStats(result);
      })
      .catch(() => {});
    void fetchCoffeeCount()
      .then((result) => {
        if (active) setCoffeeCount(result.count);
      })
      .catch(() => {});

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
      setCoffeeCount((current) => current + 1);
      setTapPending(true);
      void submitCoffeeTap(visitorId)
        .then((result) => {
          setCoffeeCount(result.count);
          window.localStorage.setItem(TAPPED_KEY, "1");
          setTapped(true);
        })
        .catch(() => {
          void fetchCoffeeCount()
            .then((result) => setCoffeeCount(result.count))
            .catch(() => {});
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
        <span>
          <span className="tabular-nums text-foreground">
            {githubStats ? githubStats.total.toLocaleString(locale) : "—"}
          </span>{" "}
          {s.commitsLabel}
        </span>
      </a>
      <span aria-hidden="true" className="text-muted-foreground/50">
        ·
      </span>
      <span className="tabular-nums text-foreground">
        {githubStats ? githubStats.year : new Date().getFullYear()}
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
        <span className="inline-flex items-baseline gap-1">
          <span className="relative inline-block min-w-[1ch] overflow-hidden tabular-nums text-foreground">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={coffeeCount}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="inline-block"
              >
                {coffeeCount.toLocaleString(locale)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span>{coffeeCount === 1 ? s.coffeeSingular : s.coffeePlural}</span>
        </span>
      </button>
    </div>
  );
}
