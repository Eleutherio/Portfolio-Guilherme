import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { DevelopmentPrinciple } from "@/components/DevelopmentPrinciple";
import { useElementActivity } from "@/hooks/use-element-activity";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const BASE_SPEED = 26;
const MAX_SPEED = 2200;
const DECAY_SECONDS = 0.75;

type Props = {
  items: readonly { title: string; description: string }[];
  label: string;
  controls: {
    drag: string;
    keyboard: string;
    previous: string;
    next: string;
    pause: string;
    resume: string;
    carousel: string;
  };
};

export function DevelopmentPrinciplesMarquee({ items, label, controls }: Props) {
  const { ref, active } = useElementActivity<HTMLDivElement>();
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLUListElement>(null);
  const widthRef = useRef(0);
  const positionRef = useRef(0);
  const directionRef = useRef(-1);
  const velocityRef = useRef(-BASE_SPEED);
  const drag = useRef({
    pointer: null as number | null,
    startX: 0,
    startY: 0,
    x: 0,
    time: 0,
    velocity: 0,
    moved: false,
  });
  const id = useId();
  const blocked = paused || focusPaused || reducedMotion;

  const paint = useCallback(() => {
    const width = widthRef.current;
    if (!width || !trackRef.current) return;
    positionRef.current = -(((-positionRef.current % width) + width) % width);
    trackRef.current.style.transform = `translate3d(${positionRef.current}px, 0, 0)`;
  }, []);

  useLayoutEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const width = group.getBoundingClientRect().width;
      if (widthRef.current) positionRef.current *= width / widthRef.current;
      widthRef.current = width;
      paint();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(group);
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [items, paint]);

  useEffect(() => {
    if (!active || blocked) {
      velocityRef.current = blocked ? 0 : directionRef.current * BASE_SPEED;
      return;
    }
    let frame = 0;
    let previous = 0;
    const tick = (time: number) => {
      const delta = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time;
      if (drag.current.pointer === null) {
        const target = directionRef.current * BASE_SPEED;
        velocityRef.current =
          target + (velocityRef.current - target) * Math.exp(-delta / DECAY_SECONDS);
        if (Math.abs(velocityRef.current - target) < 0.05) velocityRef.current = target;
        positionRef.current += velocityRef.current * delta;
        paint();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, blocked, paint]);

  const travel = (direction: number) => {
    directionRef.current = direction;
    if (blocked) {
      const step = widthRef.current / items.length || 320;
      const slot = -positionRef.current / step;
      positionRef.current = -(direction < 0 ? Math.floor(slot + 1) : Math.ceil(slot - 1)) * step;
      paint();
    } else velocityRef.current = direction * 650;
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>, cancelled = false) => {
    const state = drag.current;
    if (state.pointer !== event.pointerId) return;
    state.pointer = null;
    event.currentTarget.removeAttribute("data-dragging");
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
    if (state.moved && !cancelled) {
      const velocity = performance.now() - state.time > 100 ? 0 : state.velocity;
      directionRef.current = Math.sign(velocity || state.x - state.startX) || directionRef.current;
      velocityRef.current = blocked
        ? 0
        : directionRef.current * Math.max(BASE_SPEED, Math.min(MAX_SPEED, Math.abs(velocity)));
    } else velocityRef.current = blocked ? 0 : directionRef.current * BASE_SPEED;
  };

  return (
    <div
      ref={ref}
      className="principles-marquee"
      data-motion={active && !blocked ? "running" : "paused"}
    >
      <div
        id={`${id}-viewport`}
        className="principles-marquee__viewport"
        role="region"
        aria-roledescription={controls.carousel}
        aria-label={label}
        aria-describedby={`${id}-hint`}
        tabIndex={0}
        onFocus={() => setFocusPaused(true)}
        onBlur={() => setFocusPaused(false)}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            travel(event.key === "ArrowLeft" ? 1 : -1);
          } else if (event.key === " " && !reducedMotion) {
            event.preventDefault();
            setPaused((value) => !value);
          } else if (event.key === "Home") {
            event.preventDefault();
            positionRef.current = 0;
            paint();
          }
        }}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          if (event.pointerType === "mouse") {
            event.preventDefault();
            event.currentTarget.setPointerCapture(event.pointerId);
          }
          drag.current = {
            pointer: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            x: event.clientX,
            time: performance.now(),
            velocity: 0,
            moved: false,
          };
        }}
        onPointerMove={(event) => {
          const state = drag.current;
          if (state.pointer !== event.pointerId) return;
          if (!state.moved) {
            const x = event.clientX - state.startX;
            const y = event.clientY - state.startY;
            if (Math.abs(y) > 6 && Math.abs(y) > Math.abs(x)) {
              finishDrag(event, true);
              return;
            }
            if (Math.abs(x) < 6) return;
            state.moved = true;
            event.currentTarget.setPointerCapture(event.pointerId);
            event.currentTarget.dataset.dragging = "true";
          }
          if (event.cancelable) event.preventDefault();
          const now = performance.now();
          const delta = event.clientX - state.x;
          const elapsed = Math.max(now - state.time, 8);
          state.velocity =
            state.velocity * 0.3 +
            Math.max(-MAX_SPEED, Math.min(MAX_SPEED, (delta / elapsed) * 1000)) * 0.7;
          state.x = event.clientX;
          state.time = now;
          positionRef.current += delta;
          paint();
        }}
        onPointerUp={(event) => finishDrag(event)}
        onPointerCancel={(event) => finishDrag(event, true)}
        onLostPointerCapture={(event) => {
          if (event.target === event.currentTarget) finishDrag(event, true);
        }}
      >
        <div ref={trackRef} className="principles-marquee__track">
          {[false, true].map((clone) => (
            <ul
              key={String(clone)}
              ref={clone ? undefined : groupRef}
              className="principles-marquee__group"
              aria-hidden={clone ? true : undefined}
              inert={clone ? true : undefined}
            >
              {items.map((item) => (
                <DevelopmentPrinciple key={item.title} {...item} />
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div className="principles-marquee__toolbar">
        <p id={`${id}-hint`} className="principles-marquee__hint">
          {controls.drag}
          <span className="sr-only"> {controls.keyboard}</span>
        </p>
        <div className="principles-marquee__controls">
          <button
            type="button"
            className="principles-marquee__control carousel-control"
            aria-label={controls.previous}
            aria-controls={`${id}-viewport`}
            onClick={() => travel(1)}
          >
            <ChevronLeft aria-hidden="true" />
          </button>
          {!reducedMotion && (
            <button
              type="button"
              className="principles-marquee__control carousel-control"
              aria-label={paused ? controls.resume : controls.pause}
              aria-pressed={paused}
              aria-controls={`${id}-viewport`}
              onClick={() => setPaused((value) => !value)}
            >
              {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
            </button>
          )}
          <button
            type="button"
            className="principles-marquee__control carousel-control"
            aria-label={controls.next}
            aria-controls={`${id}-viewport`}
            onClick={() => travel(-1)}
          >
            <ChevronRight aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
