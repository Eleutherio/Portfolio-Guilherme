import { ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Quote } from "lucide-react";

import { LinkedinIcon } from "@/components/icons/Brand";
import alecsandraWorkplace from "@/assets/testimonials/workplaces/alecsandra-klatt-martins-workplace.avif";
import brunaWorkplace from "@/assets/testimonials/workplaces/bruna-vizzotto-workplace.avif";
import leonardoWorkplace from "@/assets/testimonials/workplaces/leonardo-alvarez-pereira-gomes-workplace.avif";
import marthaWorkplace from "@/assets/testimonials/workplaces/martha-izabel-workplace.avif";
import tainaraWorkplace from "@/assets/testimonials/workplaces/tainara-conrad-bassani-workplace.avif";
import { testimonials } from "@/content/linkedin-recommendations";
import { useElementActivity } from "@/hooks/use-element-activity";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { useApp } from "@/i18n/AppContext";
import { TestimonialQuoteText } from "@/components/TestimonialQuoteText";
import { TestimonialAuthorDetails } from "@/components/TestimonialAuthorDetails";
import { TestimonialPixelImage } from "@/components/TestimonialPixelImage";

const MIN_AUTOPLAY_DURATION = 9000;
const MAX_AUTOPLAY_DURATION = 45000;
const READING_WORDS_PER_MINUTE = 180;
const READING_ORIENTATION_TIME = 2000;
const workplaceByTestimonialId: Record<string, { src: string; width: number; height: number }> = {
  "alecsandra-klatt-martins": { src: alecsandraWorkplace, width: 400, height: 400 },
  "bruna-vizzotto": { src: brunaWorkplace, width: 400, height: 400 },
  "leonardo-alvarez-pereira-gomes-2026-07-17": {
    src: leonardoWorkplace,
    width: 624,
    height: 624,
  },
  "leonardo-alvarez-pereira-gomes-2026-08-21": {
    src: leonardoWorkplace,
    width: 624,
    height: 624,
  },
  "martha-izabel-di-franco-machado": { src: marthaWorkplace, width: 400, height: 400 },
  "tainara-conrad-bassani": { src: tainaraWorkplace, width: 400, height: 400 },
};

const getQuoteScale = (length: number) =>
  length > 800
    ? "text-[clamp(0.9rem,0.85vw,1.05rem)] leading-[1.55]"
    : length > 600
      ? "text-[clamp(0.95rem,1vw,1.15rem)] leading-[1.5]"
      : length > 350
        ? "text-[clamp(1rem,1.15vw,1.3rem)] leading-[1.48]"
        : "text-[clamp(1.05rem,1.35vw,1.5rem)] leading-[1.42]";

const splitQuoteIntoParagraphs = (quote: string) => {
  const sentences = quote.split(/(?<=[.!?])\s+/u);

  return sentences.reduce<string[]>((paragraphs, sentence) => {
    const current = paragraphs[paragraphs.length - 1];

    if (!current || current.length + sentence.length + 1 > 260) {
      paragraphs.push(sentence);
    } else {
      paragraphs[paragraphs.length - 1] = `${current} ${sentence}`;
    }

    return paragraphs;
  }, []);
};

const getReadingDuration = (quote: string) => {
  const wordCount = quote.trim().split(/\s+/u).filter(Boolean).length;
  const readingTime = (wordCount / READING_WORDS_PER_MINUTE) * 60_000;

  return Math.min(
    MAX_AUTOPLAY_DURATION,
    Math.max(MIN_AUTOPLAY_DURATION, Math.round(readingTime + READING_ORIENTATION_TIME)),
  );
};

export function Testimonials() {
  const { t, lang } = useApp();
  const reducedMotion = usePrefersReducedMotion();
  const { ref: sectionRef, active } = useElementActivity<HTMLElement>();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [pointerPaused, setPointerPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [autoplayPaused, setAutoplayPaused] = useState(false);
  const [interactionPauseOverridden, setInteractionPauseOverridden] = useState(false);
  const [autoplayVersion, setAutoplayVersion] = useState(0);
  const [quoteOverflowing, setQuoteOverflowing] = useState(false);
  const [quoteAtEnd, setQuoteAtEnd] = useState(true);
  const quoteViewportRef = useRef<HTMLDivElement | null>(null);
  const [revealedQuote, setRevealedQuote] = useState<string | null>(null);
  const [revealTiming, setRevealTiming] = useState<{ key: string; duration: number } | null>(null);
  const currentQuoteKey = `${testimonials[index].id}:${lang}`;
  const revealDuration = revealTiming?.key === currentQuoteKey ? revealTiming.duration : 300;
  const animationActive = active && (reducedMotion || revealTiming?.key === currentQuoteKey);
  const revealComplete = revealedQuote === currentQuoteKey;
  const handleRevealMeasure = useCallback((key: string, lineCount: number) => {
    const duration = 300 + Math.max(0, lineCount - 1) * 100;
    setRevealTiming((previous) =>
      previous?.key === key && previous.duration === duration ? previous : { key, duration },
    );
  }, []);
  const handleRevealComplete = useCallback((key: string) => setRevealedQuote(key), []);
  useEffect(() => setRevealedQuote(null), [index, lang, reducedMotion]);

  const updateQuoteScrollState = useCallback(() => {
    const viewport = quoteViewportRef.current;
    if (!viewport) return;

    const overflowing = viewport.scrollHeight - viewport.clientHeight > 2;
    const atEnd =
      !overflowing || viewport.scrollTop + viewport.clientHeight >= viewport.scrollHeight - 2;
    setQuoteOverflowing(overflowing);
    setQuoteAtEnd(atEnd);
  }, []);

  useEffect(() => {
    const viewport = quoteViewportRef.current;
    if (!viewport) return;

    viewport.scrollTop = 0;
    setQuoteAtEnd(false);
    const animationFrame = window.requestAnimationFrame(updateQuoteScrollState);
    const resizeObserver = new ResizeObserver(updateQuoteScrollState);
    resizeObserver.observe(viewport);
    if (viewport.firstElementChild) resizeObserver.observe(viewport.firstElementChild);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [index, lang, updateQuoteScrollState]);

  useEffect(() => {
    const interactionPaused = !interactionPauseOverridden && (pointerPaused || focusPaused);
    if (
      !active ||
      reducedMotion ||
      interactionPaused ||
      autoplayPaused ||
      revealedQuote !== currentQuoteKey
    )
      return;

    const quote = testimonials[index].quote[lang];
    const timeout = window.setTimeout(() => {
      setDirection(1);
      setIndex((currentIndex) => (currentIndex + 1) % testimonials.length);
    }, getReadingDuration(quote));

    return () => window.clearTimeout(timeout);
  }, [
    active,
    autoplayPaused,
    autoplayVersion,
    focusPaused,
    index,
    interactionPauseOverridden,
    lang,
    pointerPaused,
    reducedMotion,
    revealedQuote,
    currentQuoteKey,
  ]);

  const selectRelative = (offset: -1 | 1) => {
    setDirection(offset);
    setIndex((currentIndex) => (currentIndex + offset + testimonials.length) % testimonials.length);
    setAutoplayPaused(true);
    setInteractionPauseOverridden(false);
    setAutoplayVersion((version) => version + 1);
  };

  const selectIndex = (targetIndex: number) => {
    if (targetIndex === index) return;

    setDirection(targetIndex > index ? 1 : -1);
    setIndex(targetIndex);
    setAutoplayPaused(true);
    setInteractionPauseOverridden(false);
    setAutoplayVersion((version) => version + 1);
  };

  const toggleAutoplay = () => {
    if (autoplayPaused) {
      setAutoplayPaused(false);
      setFocusPaused(false);
      setPointerPaused(false);
      setInteractionPauseOverridden(true);
      setAutoplayVersion((version) => version + 1);
      return;
    }

    setAutoplayPaused(true);
    setInteractionPauseOverridden(false);
  };

  return (
    <section
      ref={sectionRef}
      id="depoimentos"
      aria-labelledby="depoimentos-heading"
      aria-roledescription={t.testimonials.carouselLabel}
      data-runtime-activity={active ? "active" : "paused"}
      onPointerEnter={() => setPointerPaused(true)}
      onPointerLeave={() => {
        setPointerPaused(false);
        setInteractionPauseOverridden(false);
      }}
      onFocusCapture={(event) => {
        if (!(event.target as HTMLElement).classList.contains("testimonial-editorial-autoplay")) {
          setInteractionPauseOverridden(false);
        }
        setFocusPaused(true);
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusPaused(false);
          setInteractionPauseOverridden(false);
        }
      }}
      className="relative text-foreground"
    >
      <div className="section-container section-start-spacing flex flex-col pb-[clamp(2.5rem,4vw,4.5rem)]">
        <header className="section-editorial-header">
          <h2
            id="depoimentos-heading"
            tabIndex={-1}
            className="section-editorial-title outline-none"
          >
            {t.testimonials.title}
          </h2>
          <span className="section-editorial-rule" aria-hidden="true" />
        </header>

        <div
          className="testimonial-editorial-stage"
          aria-live={
            reducedMotion || autoplayPaused || (!interactionPauseOverridden && focusPaused)
              ? "polite"
              : "off"
          }
          aria-atomic="true"
        >
          {testimonials.map((current, testimonialIndex) => {
            const selected = testimonialIndex === index;
            const workplace = workplaceByTestimonialId[current.id];
            const quote = current.quote[lang];
            const quoteParagraphs = splitQuoteIntoParagraphs(quote);

            return (
              <figure
                key={current.id}
                data-direction={direction}
                className={`${selected ? "testimonial-slide" : "invisible pointer-events-none"} testimonial-editorial-card`}
                aria-hidden={!selected ? true : undefined}
                aria-label={`${testimonialIndex + 1} / ${testimonials.length}`}
                data-autoplay-duration={getReadingDuration(quote)}
              >
                <blockquote className="testimonial-editorial-quote">
                  <Quote
                    className="testimonial-editorial-quote-mark"
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                  <div
                    className="testimonial-editorial-quote-scroll-shell"
                    data-overflowing={selected && quoteOverflowing ? "true" : undefined}
                  >
                    <div
                      ref={selected ? quoteViewportRef : undefined}
                      className="testimonial-editorial-quote-scroll"
                      tabIndex={selected && quoteOverflowing ? 0 : undefined}
                      role={selected && quoteOverflowing ? "region" : undefined}
                      aria-label={
                        selected && quoteOverflowing ? t.testimonials.scrollQuoteLabel : undefined
                      }
                      onScroll={(event) => {
                        updateQuoteScrollState();
                        if (event.nativeEvent.isTrusted && event.currentTarget.scrollTop > 0) {
                          setAutoplayPaused(true);
                          setInteractionPauseOverridden(false);
                        }
                      }}
                    >
                      <TestimonialQuoteText
                        className={`${getQuoteScale(quote.length)} editorial-text testimonial-editorial-copy`}
                        paragraphs={quoteParagraphs}
                        selected={selected}
                        active={animationActive}
                        reducedMotion={reducedMotion}
                        revealKey={`${current.id}:${lang}`}
                        onComplete={handleRevealComplete}
                        onMeasure={handleRevealMeasure}
                      />
                      <Quote
                        className="testimonial-editorial-quote-mark testimonial-editorial-quote-mark--end"
                        strokeWidth={1.6}
                        aria-hidden="true"
                      />
                    </div>
                    {selected && quoteOverflowing ? (
                      <span
                        className="testimonial-editorial-scroll-cue"
                        data-visible={!quoteAtEnd ? "true" : undefined}
                        aria-hidden="true"
                      >
                        <ChevronDown className="testimonial-editorial-scroll-cue-icon" />
                      </span>
                    ) : null}
                  </div>
                </blockquote>

                <figcaption className="testimonial-editorial-side">
                  <div className="testimonial-editorial-media">
                    {workplace ? (
                      <TestimonialPixelImage
                        className="testimonial-editorial-workplace"
                        selected={selected}
                        active={animationActive}
                        reducedMotion={reducedMotion}
                        duration={revealDuration}
                        complete={selected && revealComplete}
                      >
                        <img
                          src={selected ? workplace.src : undefined}
                          alt={t.testimonials.workplaceBrandAlt.replace("{name}", current.name)}
                          width={workplace.width}
                          height={workplace.height}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </TestimonialPixelImage>
                    ) : (
                      <span className="testimonial-editorial-workplace" />
                    )}

                    <TestimonialPixelImage
                      className="testimonial-editorial-portrait"
                      selected={selected}
                      active={animationActive}
                      reducedMotion={reducedMotion}
                      duration={revealDuration}
                      complete={selected && revealComplete}
                    >
                      <source
                        type="image/avif"
                        srcSet={selected ? current.image.avif : undefined}
                        sizes="(max-width: 767px) 96px, (max-width: 1100px) 88px, (max-width: 1600px) 8vw, 128px"
                      />
                      <source
                        type="image/webp"
                        srcSet={selected ? current.image.webp : undefined}
                        sizes="(max-width: 767px) 96px, (max-width: 1100px) 88px, (max-width: 1600px) 8vw, 128px"
                      />
                      <img
                        src={selected ? current.image.fallback : undefined}
                        alt={t.testimonials.photoAlt.replace("{name}", current.name)}
                        width={192}
                        height={192}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </TestimonialPixelImage>
                  </div>

                  <div className="testimonial-editorial-author">
                    <TestimonialAuthorDetails
                      key={`${current.id}:${lang}`}
                      selected={selected}
                      active={animationActive}
                      reducedMotion={reducedMotion}
                      duration={revealDuration}
                      complete={selected && revealComplete}
                    >
                      <span className="testimonial-editorial-author-label">
                        {t.testimonials.authorLabel}
                      </span>
                      <span className="testimonial-editorial-author-name-row">
                        <strong>{current.name}</strong>
                        <a
                          href={current.linkedinUrl}
                          target="_blank"
                          rel="noreferrer noopener"
                          tabIndex={selected ? undefined : -1}
                          data-cursor-open={`${t.cursor.destinations.linkedin}: ${current.name}`}
                          aria-label={t.testimonials.linkedinLabel.replace("{name}", current.name)}
                          className="testimonial-editorial-link"
                        >
                          <LinkedinIcon className="h-4 w-4" />
                        </a>
                      </span>
                      {current.role ? <span>{current.role[lang]}</span> : null}
                      <span>{current.company}</span>
                      {current.date ? (
                        <time dateTime={current.date.iso}>{current.date[lang]}</time>
                      ) : null}
                      {current.sourceNote ? <span>{current.sourceNote[lang]}</span> : null}
                    </TestimonialAuthorDetails>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div data-testimonials-controls className="testimonial-editorial-controls">
          <button
            type="button"
            onClick={() => selectRelative(-1)}
            className="testimonial-editorial-control"
            aria-label={t.testimonials.previousLabel}
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <div
            role="group"
            aria-label={`${t.testimonials.carouselLabel}: ${index + 1} / ${testimonials.length}`}
            className="testimonial-editorial-progress"
          >
            {testimonials.map((recommendation, recommendationIndex) => {
              const selected = recommendationIndex === index;

              return (
                <button
                  key={recommendation.id}
                  type="button"
                  onClick={() => selectIndex(recommendationIndex)}
                  className="testimonial-editorial-progress-segment"
                  data-current={selected ? "true" : undefined}
                  aria-label={t.testimonials.selectLabel.replace(
                    "{number}",
                    String(recommendationIndex + 1),
                  )}
                  aria-current={selected ? "true" : undefined}
                >
                  <span aria-hidden="true" />
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => selectRelative(1)}
            className="testimonial-editorial-control"
            aria-label={t.testimonials.nextLabel}
          >
            <ChevronRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={toggleAutoplay}
            className="testimonial-editorial-control testimonial-editorial-autoplay"
            aria-label={
              autoplayPaused
                ? t.testimonials.resumeAutoplayLabel
                : t.testimonials.pauseAutoplayLabel
            }
          >
            {autoplayPaused ? (
              <Play aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <Pause aria-hidden="true" className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
