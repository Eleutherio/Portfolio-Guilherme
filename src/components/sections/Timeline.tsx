import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

import { ScrambleText } from "@/components/ScrambleText";
import { useApp } from "@/i18n/AppContext";
import { useElementActivity } from "@/hooks/use-element-activity";

const ENGLISH_LEVELS = ["A1", "A2", "B1", "B2", "C1"];

type AnimatedValueProps = {
  active: boolean;
  reducedMotion: boolean;
  target: number;
  start?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

function AnimatedValue({
  active,
  reducedMotion,
  target,
  start = 0,
  prefix = "",
  suffix = "",
  duration = 1200,
}: AnimatedValueProps) {
  const [displayed, setDisplayed] = useState(start);
  const displayedRef = useRef(start);
  const completedRef = useRef(false);

  useEffect(() => {
    displayedRef.current = start;
    completedRef.current = false;
    setDisplayed(start);
  }, [start, target]);

  useEffect(() => {
    if (!active || completedRef.current) return;

    if (reducedMotion) {
      displayedRef.current = target;
      completedRef.current = true;
      setDisplayed(target);
      return;
    }

    const from = displayedRef.current;
    const fullDistance = Math.abs(target - start);
    const remainingDistance = Math.abs(target - from);

    if (remainingDistance === 0) {
      completedRef.current = true;
      return;
    }

    const remainingDuration = duration * (remainingDistance / Math.max(1, fullDistance));
    let animationFrame = 0;
    let startedAt = 0;

    const animate = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / remainingDuration);
      const easedProgress = 1 - (1 - progress) ** 3;
      const nextValue = Math.round(from + (target - from) * easedProgress);
      displayedRef.current = nextValue;
      setDisplayed(nextValue);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        displayedRef.current = target;
        completedRef.current = true;
        setDisplayed(target);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [active, duration, reducedMotion, start, target]);

  return (
    <>
      <span className="sr-only">{`${prefix}${target}${suffix}`}</span>
      <span aria-hidden="true">{`${prefix}${displayed}${suffix}`}</span>
    </>
  );
}

function AnimatedEnglishLevel({
  active,
  reducedMotion,
}: {
  active: boolean;
  reducedMotion: boolean;
}) {
  const [levelIndex, setLevelIndex] = useState(0);
  const levelIndexRef = useRef(0);
  const completedRef = useRef(false);
  const finalIndex = ENGLISH_LEVELS.length - 1;

  useEffect(() => {
    if (!active || completedRef.current) return;

    if (reducedMotion) {
      levelIndexRef.current = finalIndex;
      completedRef.current = true;
      setLevelIndex(finalIndex);
      return;
    }

    const from = levelIndexRef.current;
    const remainingLevels = finalIndex - from;

    if (remainingLevels <= 0) {
      completedRef.current = true;
      return;
    }

    let animationFrame = 0;
    let startedAt = 0;
    const duration = 1000 * (remainingLevels / finalIndex);

    const animate = (timestamp: number) => {
      if (!startedAt) startedAt = timestamp;
      const progress = Math.min(1, (timestamp - startedAt) / duration);
      const nextIndex = Math.min(finalIndex, from + Math.floor(progress * (remainingLevels + 1)));
      levelIndexRef.current = nextIndex;
      setLevelIndex(nextIndex);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(animate);
      } else {
        levelIndexRef.current = finalIndex;
        completedRef.current = true;
        setLevelIndex(finalIndex);
      }
    };

    animationFrame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [active, finalIndex, reducedMotion]);

  return (
    <>
      <span className="sr-only">C1</span>
      <span aria-hidden="true">{ENGLISH_LEVELS[levelIndex]}</span>
    </>
  );
}

export function Timeline() {
  const { t } = useApp();
  const { ref: sectionRef, active: animationActive } = useElementActivity<HTMLElement>();
  const reducedMotion = Boolean(useReducedMotion());
  const items = t.timeline.items;
  const groups: Array<{ year: string; items: Array<(typeof items)[number]> }> = [];

  items.forEach((item) => {
    const year = item.period.match(/\d{4}/)?.[0] ?? item.period;
    const group = groups.find((candidate) => candidate.year === year);

    if (group) {
      group.items.push(item);
    } else {
      groups.push({ year, items: [item] });
    }
  });

  const stats = [
    {
      kind: "count" as const,
      target: 960,
      prefix: "+",
      suffix: "h",
      label: t.timeline.stats.trainingHours,
    },
    {
      kind: "count" as const,
      target: 3,
      prefix: "",
      suffix: "",
      label: t.timeline.stats.trainingPrograms,
    },
    {
      kind: "count" as const,
      target: 2,
      prefix: "",
      suffix: "",
      label: t.timeline.stats.professionalExperiences,
    },
    { kind: "level" as const, label: t.timeline.stats.englishLevel },
  ];

  return (
    <section
      ref={sectionRef}
      id="trajetoria"
      aria-labelledby="trajetoria-heading"
      data-runtime-activity={animationActive ? "active" : "paused"}
      className="relative"
    >
      <div className="section-container py-14 md:py-20">
        <header className="flex flex-col">
          <h2
            id="trajetoria-heading"
            tabIndex={-1}
            className="section-title order-2 mt-12 text-center text-foreground outline-none md:mt-16"
          >
            {t.timeline.title}
          </h2>

          <ul className="order-1 grid grid-cols-1 gap-y-2 md:grid-cols-4 md:gap-x-6">
            {stats.map((stat) => (
              <li
                key={stat.label}
                className="flex min-h-14 min-w-0 flex-col items-center justify-start gap-2 text-center"
              >
                <strong className="shrink-0 text-center font-display text-[3.25rem] font-light leading-none tracking-[-0.055em] text-accent tabular-nums md:text-[4rem]">
                  {stat.kind === "count" ? (
                    <AnimatedValue
                      active={animationActive}
                      reducedMotion={reducedMotion}
                      target={stat.target}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                    />
                  ) : (
                    <AnimatedEnglishLevel active={animationActive} reducedMotion={reducedMotion} />
                  )}
                </strong>
                <span className="grid max-w-48 text-sm leading-snug text-muted-foreground md:text-[15px]">
                  <span aria-hidden="true" className="invisible col-start-1 row-start-1">
                    {stat.label}
                  </span>
                  <span className="col-start-1 row-start-1">
                    <ScrambleText text={stat.label} active={animationActive} />
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </header>

        <ol
          aria-label={t.timeline.title}
          tabIndex={0}
          className="mt-16 grid snap-x snap-mandatory auto-cols-[minmax(17rem,84vw)] grid-flow-col gap-0 overflow-x-auto [scrollbar-width:thin] md:mt-20 md:auto-cols-fr md:overflow-visible"
        >
          {groups.map((group, groupIndex) => (
            <li key={group.year} className="grid snap-start grid-rows-[auto_1fr] py-7 md:py-9">
              <time className="block w-full text-left font-display text-[2rem] font-light leading-none tracking-[-0.055em] text-foreground tabular-nums md:text-[2.25rem]">
                <AnimatedValue
                  active={animationActive}
                  reducedMotion={reducedMotion}
                  start={2000}
                  target={Number(group.year)}
                  duration={1500}
                />
              </time>

              <div className="grid auto-rows-fr">
                {group.items.map((item, itemIndex) => {
                  const usesInverseTheme = (groupIndex + itemIndex) % 2 === 0;

                  return (
                    <article
                      key={`${item.period}-${item.title}`}
                      className={usesInverseTheme ? "bg-foreground p-5 md:p-6" : "p-5 md:p-6"}
                    >
                      <p
                        className={`font-mono text-[10px] tracking-[0.16em] ${
                          usesInverseTheme ? "text-background/65" : "text-muted-foreground"
                        }`}
                      >
                        {item.type}
                      </p>

                      <h3
                        className={`mt-3 font-display text-xl font-medium leading-tight tracking-[-0.025em] md:text-2xl ${
                          usesInverseTheme ? "text-background" : "text-foreground"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={`mt-2 text-sm font-medium leading-relaxed ${
                          usesInverseTheme ? "text-background/85" : "text-accent"
                        }`}
                      >
                        {item.org}
                      </p>
                      <p
                        className={`mt-4 text-sm leading-relaxed ${
                          usesInverseTheme ? "text-background/70" : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
