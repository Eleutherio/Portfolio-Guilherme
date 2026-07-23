import { lazy, Suspense } from "react";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { useApp } from "@/i18n/AppContext";
import { HeroCarouselProvider } from "@/components/hero/HeroCarouselContext";

const HeroStats = lazy(() =>
  import("@/components/hero/HeroStats").then((m) => ({ default: m.HeroStats })),
);
const TerminalCard = lazy(() =>
  import("@/components/hero/TerminalCard").then((m) => ({ default: m.TerminalCard })),
);

function HighlightHeadline({ text, grad }: { text: string; grad: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const idx = line.indexOf(grad);
        const isGreeting = i === 0;
        const isProfessionalSummary = i === lines.length - 1;
        const content =
          idx === -1 ? (
            line
          ) : (
            <>
              {line.slice(0, idx)}
              <span className="max-sm:block">
                <span className="text-gradient">{grad}</span>
                {line.slice(idx + grad.length)}
              </span>
            </>
          );
        return (
          <span
            key={i}
            className={
              isGreeting
                ? "mb-4 block font-mono text-[11px] font-medium uppercase leading-relaxed tracking-[0.22em] text-muted-foreground"
                : `block${
                    isProfessionalSummary
                      ? " mt-2 max-w-[31rem] font-sans text-[clamp(1rem,1.55vw,1.25rem)] font-medium leading-[1.4] tracking-[-0.01em] text-muted-foreground"
                      : ""
                  }`
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

  return (
    <HeroCarouselProvider>
      <section
        id="home"
        aria-labelledby="home-heading"
        className="relative isolate flex min-h-[calc(100svh-64px)] flex-col overflow-x-clip overflow-y-visible bg-background md:min-h-[680px] md:overflow-hidden lg:min-h-[640px]"
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.35]"
            style={{
              backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              color: "var(--color-hairline)",
              maskImage: "radial-gradient(ellipse 80% 65% at 30% 40%, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 65% at 30% 40%, black 30%, transparent 75%)",
            }}
          />
          <div
            className="absolute -top-32 -right-32 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl"
            style={{ background: "var(--gradient-brand-soft)" }}
          />
        </div>

        <div className="section-container relative z-10 flex flex-1 flex-col justify-center py-10 md:py-16 lg:py-14">
          <div className="grid w-full grid-cols-1 items-center lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:gap-14 xl:gap-20">
            <div className="min-w-0 lg:py-6 lg:pr-2">
              <div className="max-w-[38rem]">
                <h1
                  id="home-heading"
                  tabIndex={-1}
                  className="font-display font-semibold leading-[1.05] tracking-[-0.03em] text-foreground text-balance outline-none"
                  style={{ fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)" }}
                >
                  <HighlightHeadline text={t.hero.headline} grad={t.hero.headlineHighlight} />
                </h1>

                <div className="mt-9 md:mt-10">
                  <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                    <a
                      href="#projetos"
                      className="btn-primary px-5 text-center sm:whitespace-nowrap"
                    >
                      <span>{t.hero.cta1}</span>
                      <ArrowDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </a>
                    <a
                      href="#contato"
                      className="btn-outline px-5 text-center sm:whitespace-nowrap"
                    >
                      <span>{t.hero.cta3}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                    </a>
                  </div>

                  <a
                    href={t.hero.resumeUrl}
                    download="Guilherme-Eleutherio-Curriculo.pdf"
                    type="application/pdf"
                    className="group mt-3 inline-flex w-fit items-center gap-2 rounded-sm py-2 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
                  >
                    <Download
                      className="h-4 w-4 shrink-0 transition-transform group-hover:translate-y-0.5"
                      aria-hidden="true"
                    />
                    <span>{t.hero.cta2}</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="hidden min-w-0 items-center justify-end lg:flex">
              <div className="relative w-full max-w-[34rem] border-l border-hairline/70 pl-7 xl:pl-9">
                <div
                  aria-hidden="true"
                  className="absolute top-0 -left-px h-24 w-px bg-gradient-to-b from-accent via-accent/45 to-transparent"
                />
                <Suspense fallback={<div className="min-h-[22rem]" aria-hidden="true" />}>
                  <TerminalCard />
                </Suspense>
              </div>
            </div>
          </div>

          <div className="mt-12 w-full border-t border-hairline/80 pt-4 lg:mt-14">
            <div className="min-h-7">
              <Suspense fallback={null}>
                <HeroStats />
              </Suspense>
            </div>
          </div>
        </div>
      </section>
    </HeroCarouselProvider>
  );
}
