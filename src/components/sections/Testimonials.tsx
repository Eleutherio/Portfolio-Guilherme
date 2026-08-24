import { AnimatePresence, motion, useReducedMotion } from "@/lib/motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import { linkedInRecommendations } from "@/content/linkedin-recommendations";
import { useElementActivity } from "@/hooks/use-element-activity";
import { useApp } from "@/i18n/AppContext";

const AUTOPLAY_INTERVAL = 9000;

export function Testimonials() {
  const { t } = useApp();
  const reducedMotion = Boolean(useReducedMotion());
  const { ref: sectionRef, active } = useElementActivity<HTMLElement>();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [autoplayVersion, setAutoplayVersion] = useState(0);
  const current = linkedInRecommendations[index];
  const quoteScale =
    current.quote.length > 600
      ? "text-[clamp(1.05rem,1.35vw,1.5rem)] leading-[1.22]"
      : "text-[clamp(1.3rem,2vw,2.25rem)] leading-[1.14]";

  useEffect(() => {
    if (!active || reducedMotion || pointerPaused || focusPaused) return;

    const interval = window.setInterval(() => {
      setDirection(1);
      setIndex((currentIndex) => (currentIndex + 1) % linkedInRecommendations.length);
    }, AUTOPLAY_INTERVAL);

    return () => window.clearInterval(interval);
  }, [active, autoplayVersion, focusPaused, pointerPaused, reducedMotion]);

  const selectRelative = (offset: -1 | 1) => {
    setDirection(offset);
    setIndex(
      (currentIndex) =>
        (currentIndex + offset + linkedInRecommendations.length) % linkedInRecommendations.length,
    );
    setAutoplayVersion((version) => version + 1);
  };

  const selectIndex = (targetIndex: number) => {
    if (targetIndex === index) return;

    setDirection(targetIndex > index ? 1 : -1);
    setIndex(targetIndex);
    setAutoplayVersion((version) => version + 1);
  };

  return (
    <section
      ref={sectionRef}
      id="depoimentos"
      aria-labelledby="depoimentos-heading"
      aria-roledescription={t.testimonials.carouselLabel}
      onPointerEnter={() => setPointerPaused(true)}
      onPointerLeave={() => setPointerPaused(false)}
      onFocusCapture={() => setFocusPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusPaused(false);
        }
      }}
      className="relative text-background"
    >
      <div className="flex flex-1 bg-foreground">
        <div className="section-container flex min-h-[82svh] flex-col py-14 md:py-20">
          <h2
            id="depoimentos-heading"
            tabIndex={-1}
            className="section-title text-background outline-none"
          >
            {t.testimonials.title}
          </h2>

          <div className="flex flex-1 flex-col justify-center py-14 md:py-16">
            <AnimatePresence initial={false} mode="wait" custom={direction}>
              <motion.figure
                key={current.id}
                custom={direction}
                initial={reducedMotion ? false : { opacity: 0, x: direction * 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: direction * -28 }}
                transition={{ duration: reducedMotion ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="mx-auto grid h-[37rem] w-full max-w-5xl grid-rows-[1fr_auto] gap-10 max-[360px]:h-[42rem] lg:h-[20.5rem] lg:gap-12"
                aria-label={`${index + 1} / ${linkedInRecommendations.length}`}
              >
                <blockquote
                  className={`${quoteScale} self-center text-center tracking-[-0.04em] text-background`}
                >
                  <span aria-hidden="true">“</span>
                  {current.quote}
                  <span aria-hidden="true">”</span>
                </blockquote>

                <figcaption className="flex items-center justify-start gap-4">
                  <picture className="h-16 w-16 shrink-0">
                    <source type="image/avif" srcSet={current.image.avif} />
                    <source type="image/webp" srcSet={current.image.webp} />
                    <img
                      src={current.image.fallback}
                      alt={t.testimonials.photoAlt.replace("{name}", current.name)}
                      width={96}
                      height={96}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  </picture>

                  <span className="min-w-0">
                    <strong className="block text-base font-medium leading-tight text-background md:text-lg">
                      {current.name}
                    </strong>
                    <span className="mt-1 block text-sm text-background/60 md:text-base">
                      {current.company}
                    </span>
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>

          <div
            data-testimonials-controls
            className="flex items-center justify-center md:justify-end"
          >
            <button
              type="button"
              onClick={() => selectRelative(-1)}
              className="inline-grid h-11 w-11 place-items-center text-background/70 transition-colors hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
              aria-label={t.testimonials.previousLabel}
            >
              <ChevronLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            </button>

            <div
              className="flex items-center"
              role="group"
              aria-label={`${index + 1} / ${linkedInRecommendations.length}`}
            >
              {linkedInRecommendations.map((recommendation, recommendationIndex) => {
                const selected = recommendationIndex === index;

                return (
                  <button
                    key={recommendation.id}
                    type="button"
                    onClick={() => selectIndex(recommendationIndex)}
                    className="group grid h-11 w-11 place-items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
                    aria-label={t.testimonials.selectLabel.replace(
                      "{number}",
                      String(recommendationIndex + 1),
                    )}
                    aria-current={selected ? "true" : undefined}
                  >
                    <span
                      aria-hidden="true"
                      className={`h-2 w-2 rounded-full border border-background transition-colors ${
                        selected
                          ? "bg-background"
                          : "bg-transparent opacity-45 group-hover:opacity-100"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => selectRelative(1)}
              className="inline-grid h-11 w-11 place-items-center text-background/70 transition-colors hover:text-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-background focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
              aria-label={t.testimonials.nextLabel}
            >
              <ChevronRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
