import { motion, useReducedMotion } from "motion/react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { useApp } from "@/i18n/AppContext";
import { HeroStats } from "@/components/hero/HeroStats";
import { TerminalCard } from "@/components/hero/TerminalCard";
import { RotatingTagline } from "@/components/hero/RotatingTagline";
import { HeroCarouselProvider } from "@/components/hero/HeroCarouselContext";

function HighlightHeadline({ text, grad }: { text: string; grad: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const idx = line.indexOf(grad);
        const isGreeting = i === 0;
        const content =
          idx === -1 ? (
            line
          ) : (
            <>
              {line.slice(0, idx)}
              <span className="text-gradient">{grad}</span>
              {line.slice(idx + grad.length)}
            </>
          );
        return (
          <span
            key={i}
            className={
              isGreeting
                ? "block text-[0.55em] font-medium tracking-tight text-muted-foreground"
                : "block"
            }
          >
            {content}
          </span>
        );
      })}
    </>
  );
}


export function Hero() {
  const { t } = useApp();
  const reduced = useReducedMotion();

  return (
    <HeroCarouselProvider>
    <section
      id="home"
      className="relative isolate flex h-full min-h-[720px] flex-col overflow-hidden bg-background md:min-h-[680px] lg:min-h-[640px]"
    >
      {/* Subtle grid + gradient wash */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            color: "var(--color-hairline)",
            maskImage:
              "radial-gradient(ellipse 80% 65% at 30% 40%, black 30%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 65% at 30% 40%, black 30%, transparent 75%)",
          }}
        />
        <div
          className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--gradient-brand-soft)" }}
        />
      </div>

      <div className="section-container relative z-10 flex flex-1 items-center py-12 md:py-16">
        <div className="grid w-full grid-cols-12 items-start gap-8 lg:gap-12">
          {/* Left — content */}
          <div className="col-span-12 lg:col-span-6">
            <motion.div
              initial={reduced ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="max-w-xl"
            >
              <motion.h1
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
                className="font-display font-semibold leading-[1.05] tracking-[-0.03em] text-foreground text-balance"
                style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)" }}
              >
                <HighlightHeadline text={t.hero.headline} grad={t.hero.headlineHighlight} />
              </motion.h1>

              <motion.div
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: reduced ? 0 : 0.35 }}
                className="min-h-[6.25rem] md:min-h-[5.5rem]"
              >
                <RotatingTagline />
              </motion.div>

              <motion.div
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: reduced ? 0 : 0.55 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <a href="#projetos" className="btn-primary">
                  <span>{t.hero.cta1}</span>
                  <ArrowDown className="h-4 w-4" aria-hidden="true" />
                </a>
                <a
                  href={t.hero.resumeUrl}
                  download
                  className="btn-outline"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>{t.hero.cta2}</span>
                </a>
                <a href="#contato" className="btn-outline">
                  <span>{t.hero.cta3}</span>
                  <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                </a>
              </motion.div>

              <motion.div
                initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: reduced ? 0 : 0.8 }}
                className="mt-6"
              >
                <HeroStats />
              </motion.div>
            </motion.div>
          </div>

          {/* Right — terminal card */}
          <motion.div
            initial={reduced ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: reduced ? 0 : 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="col-span-12 lg:col-span-6"
          >
            <TerminalCard />
            <div className="mt-4 flex items-center justify-end gap-2 text-muted-foreground lg:hidden">
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="font-mono text-[10px] uppercase tracking-[0.3em]">scroll</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    </HeroCarouselProvider>
  );
}
