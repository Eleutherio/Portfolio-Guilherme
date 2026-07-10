// Static ambient snippet shown as the Hero's background code layer.
// Kept small on purpose — the goal is texture, not a full source dump.
export const heroCodeSnippet = `import { motion, useReducedMotion } from "motion/react";
import { useApp } from "@/i18n/AppContext";

export function Hero() {
  const { t } = useApp();
  const reduced = useReducedMotion();

  const headline = {
    lead: t.hero.headlineLead,
    emph: [t.hero.headlineEmph1, t.hero.headlineEmph2],
    conj: t.hero.headlineConj,
  } as const;

  return (
    <section id="home" className="relative isolate overflow-hidden">
      <HeroBackdrop />
      <div className="section-container relative z-10">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <motion.h1
              initial={reduced ? {} : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, ease: [0.2, 0.8, 0.2, 1] }}
              className="font-display font-medium leading-[1.04] tracking-tight"
            >
              {headline.lead}{" "}
              <em>{headline.emph[0]}</em> {headline.conj}{" "}
              <em>{headline.emph[1]}</em>
              <span className="text-accent">.</span>
            </motion.h1>

            <p className="mt-6 text-muted-foreground">{t.hero.tagline}</p>

            <div className="mt-8 flex flex-wrap gap-6">
              <a href="#projetos" className="link-ink">{t.hero.cta1} ↓</a>
              <a href="#contato" className="link-ink">{t.hero.cta2} →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;
