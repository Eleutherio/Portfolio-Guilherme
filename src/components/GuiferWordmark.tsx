import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { useReducedMotion } from "@/lib/motion";

import { ScrambleText } from "@/components/ScrambleText";

type GuiferWordmarkProps = HTMLAttributes<HTMLSpanElement> & {
  animateSuffix?: boolean;
  suffixExpanded?: boolean;
};

export function GuiferWordmark({
  animateSuffix = false,
  suffixExpanded = true,
  className,
  ...props
}: GuiferWordmarkProps) {
  const reducedMotion = useReducedMotion();
  const [suffixVisible, setSuffixVisible] = useState(!animateSuffix);
  const initialRevealCompletedRef = useRef(!animateSuffix);

  useEffect(() => {
    if (!animateSuffix) {
      setSuffixVisible(true);
      return;
    }

    if (reducedMotion) {
      initialRevealCompletedRef.current = true;
      setSuffixVisible(suffixExpanded);
      return;
    }

    if (!suffixExpanded) {
      setSuffixVisible(false);
      return;
    }

    const revealDelay = initialRevealCompletedRef.current ? 0 : 300;
    const revealTimer = window.setTimeout(() => {
      initialRevealCompletedRef.current = true;
      setSuffixVisible(true);
    }, revealDelay);
    return () => window.clearTimeout(revealTimer);
  }, [animateSuffix, reducedMotion, suffixExpanded]);

  return (
    <span
      data-wordmark="guifer.tech"
      className={`inline-flex items-center font-display leading-none tracking-[-0.055em] normal-case${className ? ` ${className}` : ""}`}
      {...props}
    >
      <span data-wordmark-part="guifer" className="inline-flex items-center font-bold">
        <span
          data-wordmark-part="gui"
          className="grid size-5.5 shrink-0 place-items-center rounded-full bg-current"
        >
          <span style={{ color: "var(--wordmark-negative, var(--background))" }}>gui</span>
        </span>
        {animateSuffix ? (
          <ScrambleText
            text={suffixVisible ? "fer.tech" : ""}
            renderDisplayed={(displayed) => (
              <>
                <span>{displayed.slice(0, 3)}</span>
                <span data-wordmark-part="tech" className="font-light">
                  {displayed.slice(3)}
                </span>
              </>
            )}
          />
        ) : (
          <>
            <span>fer</span>
            <span data-wordmark-part="tech" className="font-light">
              .tech
            </span>
          </>
        )}
      </span>
    </span>
  );
}
