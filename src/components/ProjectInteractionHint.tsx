import { useViewportActivity } from "@/components/ViewportActivity";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

type Props = { swipeLabel: string; clickLabel: string; active: boolean; swipeEnabled: boolean };
const MOBILE_STAGES = [
  { stage: "swipe-text", duration: 3500 },
  { stage: "click-text", duration: 3500 },
  { stage: "click-icon", duration: 10_000 },
] as const;
const DESKTOP_STAGES = [
  { stage: "click-text", duration: 3500 },
  { stage: "click-icon", duration: 10_000 },
] as const;

export function ProjectInteractionHint({ swipeLabel, clickLabel, active, swipeEnabled }: Props) {
  const viewportActive = useViewportActivity();
  const reducedMotion = usePrefersReducedMotion();
  const [step, setStep] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const previousSize = useRef<{ width: number; height: number } | null>(null);
  const stages = swipeEnabled ? MOBILE_STAGES : DESKTOP_STAGES;
  const current = stages[step % stages.length]!;
  const stage = reducedMotion ? "click-text" : current.stage;
  const showSwipe = stage === "swipe-text";
  const showClick = !showSwipe;
  const showText = stage.endsWith("text");

  useEffect(() => {
    if (!viewportActive || !active || reducedMotion) return;
    const timer = window.setTimeout(
      () => setStep((previous) => (previous + 1) % stages.length),
      current.duration,
    );
    return () => window.clearTimeout(timer);
  }, [active, viewportActive, reducedMotion, step, stages, current.duration]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    const { width, height } = element.getBoundingClientRect();
    const previous = previousSize.current;
    previousSize.current = { width, height };
    if (
      !previous ||
      reducedMotion ||
      !viewportActive ||
      !previous.width ||
      (previous.width === width && previous.height === height)
    )
      return;
    const animation = element.animate(
      [
        { width: `${previous.width}px`, height: `${previous.height}px` },
        { width: `${width}px`, height: `${height}px` },
      ],
      { duration: 650, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
    );
    return () => animation.cancel();
  }, [stage, swipeEnabled, reducedMotion, viewportActive]);

  return (
    <span
      ref={ref}
      className="project-interaction-hint"
      data-hint-stage={stage}
      data-hint-visible={viewportActive && active ? "true" : "false"}
      aria-hidden="true"
    >
      <span key={stage} className="project-interaction-hint__content">
        {showSwipe && (
          <span className="project-interaction-hint__phase project-interaction-hint__phase--swipe">
            <svg viewBox="0 0 28 28" fill="none" className="project-interaction-hint__icon">
              <path
                d="m6 10-4 4 4 4m16-8 4 4-4 4M3 14h22"
                className="project-interaction-hint__track"
              />
              <g className="project-interaction-hint__swipe-mark">
                <rect
                  x="9"
                  y="8"
                  width="10"
                  height="12"
                  rx="5"
                  className="project-interaction-hint__thumb"
                />
                <path d="M14 11v3" />
              </g>
            </svg>
            {showText && <span className="project-interaction-hint__label">{swipeLabel}</span>}
          </span>
        )}
        {showClick && (
          <span className="project-interaction-hint__phase project-interaction-hint__phase--click">
            <svg viewBox="0 0 28 28" fill="none" className="project-interaction-hint__icon">
              <circle cx="10" cy="9" r="5" className="project-interaction-hint__ripple" />
              <path
                d="m10 8 2.2 15 3.7-4.2 3.6 6 3-1.8-3.6-5.8 5.5-1.1L10 8Z"
                className="project-interaction-hint__cursor"
              />
            </svg>
            {showText && <span className="project-interaction-hint__label">{clickLabel}</span>}
          </span>
        )}
      </span>
    </span>
  );
}
