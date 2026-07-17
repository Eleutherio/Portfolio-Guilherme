import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useApp } from "@/i18n/AppContext";

type Phase = "typing" | "pausing" | "deleting";

const TYPE_MS = 95;
const TYPE_JITTER_MS = 55;
const DELETE_MS = 55;
const HOLD_MS = 2400;
const BETWEEN_MS = 400;

type Ctx = {
  word1: string;
  word2: string;
  full1: string;
  full2: string;
  prefersReduced: boolean;
};

const HeroCarouselCtx = createContext<Ctx | null>(null);

/** Auto-advancing typewriter. Cycles through items on its own. Reports the
 *  current item index so callers can react on cycle completion. */
function useTypewriter(items: string[], prefersReduced: boolean) {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState<string>(prefersReduced ? (items[0] ?? "") : "");
  const [phase, setPhase] = useState<Phase>("typing");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayed(items[0] ?? "");
      return;
    }
    const current = items[idx] ?? "";
    const schedule = (fn: () => void, ms: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(fn, ms);
    };

    if (phase === "typing") {
      if (displayed.length < current.length) {
        schedule(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          TYPE_MS + Math.random() * TYPE_JITTER_MS,
        );
      } else {
        schedule(() => setPhase("pausing"), 0);
      }
    } else if (phase === "pausing") {
      schedule(() => setPhase(items.length > 1 ? "deleting" : "pausing"), HOLD_MS);
    } else if (phase === "deleting") {
      if (displayed.length > 0) {
        schedule(() => setDisplayed(displayed.slice(0, -1)), DELETE_MS);
      } else {
        schedule(() => {
          setIdx((prev) => (prev + 1) % items.length);
          setPhase("typing");
        }, BETWEEN_MS);
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, phase, idx, items, prefersReduced]);

  // Reset when language switches items
  useEffect(() => {
    setIdx(0);
    setDisplayed(prefersReduced ? (items[0] ?? "") : "");
    setPhase("typing");
  }, [items, prefersReduced]);

  return { displayed, full: items[idx] ?? "", idx };
}

/** Controlled typewriter — never advances on its own. Deletes and retypes when
 *  `targetIdx` changes; otherwise stays at the full current word. */
function useControlledTypewriter(items: string[], targetIdx: number, prefersReduced: boolean) {
  const [currentIdx, setCurrentIdx] = useState(targetIdx);
  const [displayed, setDisplayed] = useState<string>(
    prefersReduced ? (items[targetIdx] ?? "") : "",
  );
  const [phase, setPhase] = useState<Phase>("typing");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset on language switch
  useEffect(() => {
    setCurrentIdx(targetIdx);
    setDisplayed(prefersReduced ? (items[targetIdx] ?? "") : "");
    setPhase("typing");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, prefersReduced]);

  useEffect(() => {
    if (prefersReduced) {
      setDisplayed(items[targetIdx] ?? "");
      return;
    }
    const target = items[targetIdx] ?? "";
    const current = items[currentIdx] ?? "";
    const schedule = (fn: () => void, ms: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(fn, ms);
    };

    // If target changed, delete first (unless already empty)
    if (targetIdx !== currentIdx) {
      if (displayed.length > 0) {
        schedule(() => setDisplayed(displayed.slice(0, -1)), DELETE_MS);
      } else {
        schedule(() => {
          setCurrentIdx(targetIdx);
          setPhase("typing");
        }, BETWEEN_MS);
      }
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }

    // Same target
    if (phase === "typing") {
      if (displayed.length < current.length) {
        schedule(
          () => setDisplayed(current.slice(0, displayed.length + 1)),
          TYPE_MS + Math.random() * TYPE_JITTER_MS,
        );
      } else {
        schedule(() => setPhase("pausing"), 0);
      }
    }
    // pausing: idle until targetIdx changes

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [displayed, phase, currentIdx, targetIdx, items, prefersReduced]);

  return { displayed, full: items[currentIdx] ?? "" };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function HeroCarouselProvider({ children }: { children: ReactNode }) {
  const { t } = useApp();
  const prefersReduced = usePrefersReducedMotion();

  const c1 = t.hero.carousel1;
  const c2 = t.hero.carousel2;
  const items1 = c1 && c1.length > 0 ? c1 : ["aplicativo"];
  const items2 = c2 && c2.length > 0 ? c2 : ["arquitetura escalável & tecnologia moderna"];

  // Pillar drives everything — auto typewriter
  const { displayed: word2, full: full2, idx: idx2 } = useTypewriter(items2, prefersReduced);

  // Count pillar cycles: bump when idx2 transitions back to 0 (after > 0)
  const [pillarCycles, setPillarCycles] = useState(0);
  const prevIdx2Ref = useRef(idx2);
  useEffect(() => {
    if (prevIdx2Ref.current !== idx2 && idx2 === 0) {
      setPillarCycles((c) => c + 1);
    }
    prevIdx2Ref.current = idx2;
  }, [idx2]);

  // Kind derived from pillar cycle count
  const targetIdx1 = pillarCycles % items1.length;
  const { displayed: word1, full: full1 } = useControlledTypewriter(
    items1,
    targetIdx1,
    prefersReduced,
  );

  return (
    <HeroCarouselCtx.Provider value={{ word1, word2, full1, full2, prefersReduced }}>
      {children}
    </HeroCarouselCtx.Provider>
  );
}

export function useHeroCarousel() {
  const ctx = useContext(HeroCarouselCtx);
  if (!ctx) {
    return { word1: "", word2: "", full1: "", full2: "", prefersReduced: true };
  }
  return ctx;
}
