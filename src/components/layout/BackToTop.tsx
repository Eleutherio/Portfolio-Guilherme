import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useApp } from "@/i18n/AppContext";

export function BackToTop() {
  const { t } = useApp();
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          data-back-to-top
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
          aria-label={t.toggles.backToTop}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed bottom-6 left-6 z-50 grid h-11 w-11 place-items-center rounded-full border border-hairline/60 bg-[oklch(0.99_0.006_262_/_0.55)] text-foreground shadow-lg backdrop-blur-md transition-colors hover:bg-[oklch(0.99_0.006_262_/_0.8)] dark:bg-[oklch(0.22_0.03_265_/_0.55)] dark:hover:bg-[oklch(0.28_0.035_265_/_0.75)]"
        >
          <ChevronUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
