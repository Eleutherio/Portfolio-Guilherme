import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { GitCommit } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { getGithubYearStats } from "@/lib/github.functions";
import { getCoffeeCount, tapCoffee } from "@/lib/coffee.functions";
import { useApp } from "@/i18n/AppContext";
import { CoffeeIcon, type CoffeeState } from "@/components/hero/CoffeeIcon";

const VISITOR_KEY = "gf_visitor_id";
const TAPPED_KEY = "gf_coffee_tapped";

function ensureVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = (crypto as Crypto).randomUUID();
    window.localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export function HeroStats() {
  const { t, lang } = useApp();
  const s = t.hero.stats;
  const locale = lang === "pt" ? "pt-BR" : "en-US";
  const qc = useQueryClient();
  const [tapped, setTapped] = useState(false);
  const [visitorId, setVisitorId] = useState("");
  const [coffeeState, setCoffeeState] = useState<CoffeeState>("idle");
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  useEffect(() => {
    setVisitorId(ensureVisitorId());
    setTapped(window.localStorage.getItem(TAPPED_KEY) === "1");
    const timers = timersRef.current;
    return () => {
      timers.forEach(clearTimeout);
    };
  }, []);

  const github = useServerFn(getGithubYearStats);
  const coffeeCount = useServerFn(getCoffeeCount);
  const tap = useServerFn(tapCoffee);

  const gh = useQuery({
    queryKey: ["gh-year"],
    queryFn: () => github(),
    staleTime: 10 * 60_000,
  });

  const coffee = useQuery({
    queryKey: ["coffee-count"],
    queryFn: () => coffeeCount(),
    staleTime: 30_000,
  });

  const tapMutation = useMutation({
    mutationFn: async () => tap({ data: { visitorId } }),
    onSuccess: (res) => {
      qc.setQueryData(["coffee-count"], res);
      window.localStorage.setItem(TAPPED_KEY, "1");
      setTapped(true);
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ["coffee-count"] });
    },
  });

  const runTapAnimation = () => {
    if (tapped || !visitorId || tapMutation.isPending) return;
    // fill → tip → increment + fire mutation
    setCoffeeState("filling");
    const t1 = setTimeout(() => setCoffeeState("tipping"), 350);
    const t2 = setTimeout(() => {
      // Optimistic bump + real call — count animates via AnimatePresence key swap.
      const prev = qc.getQueryData<{ count: number }>(["coffee-count"]);
      qc.setQueryData(["coffee-count"], { count: (prev?.count ?? 0) + 1 });
      tapMutation.mutate();
    }, 550);
    const t3 = setTimeout(() => setCoffeeState("idle"), 850);
    timersRef.current.push(t1, t2, t3);
  };

  const coffeeCountValue = coffee.data?.count ?? 0;

  return (
    <div className="flex w-full flex-wrap items-center justify-start gap-x-3 gap-y-2 font-mono text-[12px] text-muted-foreground sm:justify-center sm:text-[13px]">
      <a
        href="https://github.com/Eleutherio"
        target="_blank"
        rel="noreferrer noopener"
        className="group inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
      >
        <GitCommit className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
        <span>
          <span className="tabular-nums text-foreground">
            {gh.data ? gh.data.total.toLocaleString(locale) : "—"}
          </span>{" "}
          {s.commitsLabel}
        </span>
      </a>
      <span aria-hidden="true" className="text-muted-foreground/50">
        ·
      </span>
      <span className="tabular-nums text-foreground">
        {gh.data ? gh.data.year : new Date().getFullYear()}
      </span>
      <span aria-hidden="true" className="text-muted-foreground/50">
        ·
      </span>
      <button
        type="button"
        onClick={runTapAnimation}
        disabled={tapped || !visitorId || tapMutation.isPending}
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
          <span className="relative inline-block min-w-[1ch] tabular-nums text-foreground overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={coffeeCountValue}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
                className="inline-block"
              >
                {coffeeCountValue.toLocaleString(locale)}
              </motion.span>
            </AnimatePresence>
          </span>
          <span>{coffeeCountValue === 1 ? s.coffeeSingular : s.coffeePlural}</span>
        </span>
      </button>
    </div>
  );
}
