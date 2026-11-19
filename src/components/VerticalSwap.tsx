import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface VerticalSwapProps {
  swapKey: string;
  children: ReactNode;
  className?: string;
}

interface SwapItem {
  key: string;
  content: ReactNode;
}

export function VerticalSwap({ swapKey, children, className = "" }: VerticalSwapProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [active, setActive] = useState<SwapItem>({ key: swapKey, content: children });
  const [outgoing, setOutgoing] = useState<SwapItem | null>(null);
  const activeRef = useRef(active);

  useEffect(() => {
    if (activeRef.current.key === swapKey) return;

    const previous = activeRef.current;
    const next = { key: swapKey, content: children };
    activeRef.current = next;
    setOutgoing(prefersReducedMotion ? null : previous);
    setActive(next);
  }, [children, prefersReducedMotion, swapKey]);

  return (
    <span aria-hidden="true" className={`header-vertical-swap ${className}`}>
      {outgoing ? (
        <span
          key={`out-${outgoing.key}`}
          className="header-vertical-swap__item header-vertical-swap__item--outgoing"
          onAnimationEnd={() => setOutgoing(null)}
        >
          {outgoing.content}
        </span>
      ) : null}
      <span
        key={active.key}
        className={`header-vertical-swap__item ${outgoing ? "header-vertical-swap__item--incoming" : ""}`}
      >
        {active.content}
      </span>
    </span>
  );
}
