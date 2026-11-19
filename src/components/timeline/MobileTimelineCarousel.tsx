import { useEffect, useRef, useState } from "react";

type TimelineItem = {
  period: string;
  type: string;
  org: string;
  title: string;
  description: string;
};

type MobileTimelineCarouselProps = {
  active: boolean;
  reducedMotion: boolean;
  title: string;
  items: TimelineItem[];
};

const COPIES = [0, 1, 2] as const;
const AUTO_ADVANCE_INTERVAL_MS = 9_000;
const LOOP_SETTLE_MS = 700;
const RESUME_DELAY_MS = 2_400;

function getYear(period: string) {
  return period.match(/\d{4}/)?.[0] ?? period;
}

function getLoopMetrics(element: HTMLOListElement) {
  const first = element.querySelector<HTMLElement>('[data-timeline-copy="0"]');
  const middle = element.querySelector<HTMLElement>('[data-timeline-copy="1"]');
  if (!first || !middle) return null;

  return {
    middleStart: middle.offsetLeft,
    cycleWidth: middle.offsetLeft - first.offsetLeft,
  };
}

function getCardStep(element: HTMLOListElement) {
  const [first, second] = Array.from(element.children) as HTMLElement[];
  return first && second ? second.offsetLeft - first.offsetLeft : element.clientWidth;
}

function normalizeLoopPosition(element: HTMLOListElement) {
  const metrics = getLoopMetrics(element);
  if (!metrics || metrics.cycleWidth <= 0) return 0;

  const lowerLimit = metrics.middleStart - metrics.cycleWidth / 2;
  const upperLimit = metrics.middleStart + metrics.cycleWidth / 2;

  if (element.scrollLeft < lowerLimit) {
    element.scrollLeft += metrics.cycleWidth;
    return metrics.cycleWidth;
  } else if (element.scrollLeft > upperLimit) {
    element.scrollLeft -= metrics.cycleWidth;
    return -metrics.cycleWidth;
  }

  return 0;
}

export function MobileTimelineCarousel({
  active,
  reducedMotion,
  title,
  items,
}: MobileTimelineCarouselProps) {
  const railRef = useRef<HTMLOListElement>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [interacting, setInteracting] = useState(false);

  const clearResumeTimer = () => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };

  const pauseForInteraction = () => {
    clearResumeTimer();
    setInteracting(true);
    resumeTimerRef.current = setTimeout(() => {
      setInteracting(false);
      resumeTimerRef.current = null;
    }, RESUME_DELAY_MS);
  };

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const alignToMiddleCopy = () => {
      const metrics = getLoopMetrics(rail);
      if (metrics) rail.scrollLeft = metrics.middleStart;
    };

    const animationFrame = window.requestAnimationFrame(alignToMiddleCopy);
    const resizeObserver = new ResizeObserver(alignToMiddleCopy);
    resizeObserver.observe(rail);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
    };
  }, [items]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail || !active || reducedMotion || interacting) return;

    let settleTimer = 0;
    const advanceTimer = window.setInterval(() => {
      rail.scrollBy({ left: getCardStep(rail), behavior: "smooth" });
      settleTimer = window.setTimeout(() => normalizeLoopPosition(rail), LOOP_SETTLE_MS);
    }, AUTO_ADVANCE_INTERVAL_MS);

    return () => {
      window.clearInterval(advanceTimer);
      window.clearTimeout(settleTimer);
    };
  }, [active, interacting, reducedMotion]);

  useEffect(() => () => clearResumeTimer(), []);

  const moveOneCard = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    pauseForInteraction();
    rail.scrollBy({ left: direction * getCardStep(rail), behavior: "smooth" });
  };

  return (
    <ol
      ref={railRef}
      aria-label={title}
      aria-live="off"
      data-timeline-mobile-carousel
      tabIndex={0}
      onBlur={pauseForInteraction}
      onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        moveOneCard(event.key === "ArrowLeft" ? -1 : 1);
      }}
      onPointerDown={() => {
        clearResumeTimer();
        setInteracting(true);
      }}
      onPointerUp={pauseForInteraction}
      onPointerCancel={pauseForInteraction}
      onScroll={(event) => {
        normalizeLoopPosition(event.currentTarget);
      }}
      onWheel={pauseForInteraction}
      className="mt-[clamp(1.5rem,3.333333vw,3rem)] grid touch-pan-x snap-x snap-mandatory auto-cols-[100%] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] max-[412px]:mt-[calc(var(--responsive-mobile-unit)*1.5)] md:hidden [&::-webkit-scrollbar]:hidden"
    >
      {COPIES.flatMap((copy) =>
        items.map((item, itemIndex) => {
          const accessibleCopy = copy === 1;
          const usesInverseTheme = itemIndex % 2 === 0;

          return (
            <li
              key={`${copy}-${item.period}-${item.title}`}
              data-timeline-copy={itemIndex === 0 ? copy : undefined}
              aria-hidden={accessibleCopy ? undefined : true}
              className="grid snap-center grid-rows-[auto_1fr] gap-3"
            >
              <time className="numeric-indicator block text-left text-[max(1.5rem,calc(var(--responsive-mobile-unit)*2))] leading-none [letter-spacing:var(--type-tracking-numeric)] text-foreground">
                {getYear(item.period)}
              </time>

              <article
                className={`min-h-[calc(var(--responsive-mobile-unit)*21)] p-[max(1rem,calc(var(--responsive-mobile-unit)*1.25))] sm:aspect-square sm:min-h-0 ${
                  usesInverseTheme ? "bg-foreground" : "border border-hairline bg-background"
                }`}
              >
                <p
                  className={`meta-text ${
                    usesInverseTheme ? "text-background/65" : "text-muted-foreground"
                  }`}
                >
                  {item.type}
                </p>
                <h3
                  className={`content-title mt-3 ${
                    usesInverseTheme ? "text-background" : "text-foreground"
                  }`}
                >
                  {item.title}
                </h3>
                <p
                  className={`body-copy inline-emphasis mt-2 ${
                    usesInverseTheme ? "text-background/85" : "text-accent"
                  }`}
                >
                  {item.org}
                </p>
                <p
                  className={`body-copy mt-4 ${
                    usesInverseTheme ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  {item.description}
                </p>
              </article>
            </li>
          );
        }),
      )}
    </ol>
  );
}
