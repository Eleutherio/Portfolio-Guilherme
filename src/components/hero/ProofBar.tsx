import { motion, useReducedMotion } from "motion/react";
import { useApp } from "@/i18n/AppContext";

export function ProofBar() {
  const { t } = useApp();
  const reduced = useReducedMotion();
  const items = t.hero.proofBar ?? [];

  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className="border-y border-hairline bg-surface/40"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 gap-px divide-y divide-hairline md:grid-cols-4 md:divide-x md:divide-y-0">
          {items.map((text, i) => (
            <div key={i} className="flex items-center justify-center py-6 md:py-8">
              <span className="text-center font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
