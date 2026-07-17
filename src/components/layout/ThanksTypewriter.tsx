import { useEffect, useRef, useState } from "react";
import { useApp } from "@/i18n/AppContext";

const STORAGE_KEY = "gf.thanks.lastShown";
const TYPE_MS = 70;
const TYPE_JITTER_MS = 45;
const DELETE_MS = 40;
const HOLD_TOTAL_MS = 5000;

type Phase = "typing" | "holding" | "deleting" | "done";

export function ThanksTypewriter() {
  const { t } = useApp();
  const message = (t.footer as { thanksMessage?: string }).thanksMessage ?? "";
  const [allowed, setAllowed] = useState(false);
  const [displayed, setDisplayed] = useState("");
  const [phase, setPhase] = useState<Phase>("typing");
  const startedAtRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedRef = useRef(false);

  // Check localStorage once, and reduced-motion preference
  useEffect(() => {
    if (typeof window === "undefined") return;
    const today = new Date().toISOString().slice(0, 10);
    try {
      const last = window.localStorage.getItem(STORAGE_KEY);
      if (last === today) return;
      window.localStorage.setItem(STORAGE_KEY, today);
    } catch {
      // ignore storage errors
    }
    reducedRef.current = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    startedAtRef.current = Date.now();
    setAllowed(true);
    if (reducedRef.current) {
      setDisplayed(message);
      setPhase("holding");
    }
  }, [message]);

  // Drive typing/holding/deleting
  useEffect(() => {
    if (!allowed || phase === "done") return;
    const schedule = (fn: () => void, ms: number) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(fn, ms);
    };

    if (phase === "typing") {
      if (reducedRef.current) return;
      if (displayed.length < message.length) {
        schedule(
          () => setDisplayed(message.slice(0, displayed.length + 1)),
          TYPE_MS + Math.random() * TYPE_JITTER_MS,
        );
      } else {
        setPhase("holding");
      }
    } else if (phase === "holding") {
      const elapsed = Date.now() - startedAtRef.current;
      const remaining = Math.max(0, HOLD_TOTAL_MS - elapsed);
      schedule(() => setPhase("deleting"), remaining);
    } else if (phase === "deleting") {
      if (reducedRef.current) {
        setPhase("done");
        setDisplayed("");
        return;
      }
      if (displayed.length > 0) {
        schedule(() => setDisplayed(displayed.slice(0, -1)), DELETE_MS);
      } else {
        setPhase("done");
      }
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [allowed, phase, displayed, message]);

  if (!allowed || phase === "done") return null;

  return (
    <p
      className="font-display text-xl font-medium tracking-[-0.02em] md:text-2xl"
      style={{ color: "var(--footer-foreground)" }}
      aria-live="polite"
    >
      <span>{displayed}</span>
      <span className="tw-caret" aria-hidden="true">
        _
      </span>
    </p>
  );
}
