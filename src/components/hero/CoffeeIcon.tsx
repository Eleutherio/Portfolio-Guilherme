import { motion, useReducedMotion, AnimatePresence } from "motion/react";

export type CoffeeState = "idle" | "filling" | "tipping";

/**
 * Small coffee mug SVG with animated steam (idle) and a fill→tip sequence on tap.
 * Dimensions match a ~14px inline glyph.
 */
export function CoffeeIcon({
  state = "idle",
  className,
}: {
  state?: CoffeeState;
  className?: string;
}) {
  const reduced = useReducedMotion();

  // Animate rotation of the whole mug when tipping
  const cupTransform =
    state === "tipping" && !reduced ? { rotate: -22, x: 1 } : { rotate: 0, x: 0 };

  // Coffee liquid height inside cup (baseline y=13, max top y=6 → h=7)
  const targetH = state === "idle" ? 3 : state === "filling" ? 7 : 0;

  return (
    <svg
      viewBox="0 0 20 20"
      width="18"
      height="18"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Steam */}
      {!reduced && (
        <g opacity="0.85">
          <motion.path
            d="M7 3.5 C 7 2.5, 8 2.5, 8 1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M10 3.5 C 10 2.5, 11 2.5, 11 1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          />
          <motion.path
            d="M13 3.5 C 13 2.5, 14 2.5, 14 1.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: [0, 1, 1], opacity: [0, 0.9, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          />
        </g>
      )}

      <motion.g
        animate={cupTransform}
        transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformOrigin: "6px 15px" }}
      >
        {/* Cup body */}
        <path d="M5 6 H14 V13 A2 2 0 0 1 12 15 H7 A2 2 0 0 1 5 13 Z" />
        {/* Handle */}
        <path d="M14 8 H16 A2 2 0 0 1 16 12 H14" />
        {/* Coffee liquid — clipped inside cup */}
        <AnimatePresence>
          {targetH > 0 && (
            <motion.rect
              key="liquid"
              x="6"
              width="7"
              rx="0.5"
              fill="currentColor"
              stroke="none"
              initial={{ y: 13, height: 0 }}
              animate={{ y: 13 - targetH, height: targetH }}
              exit={{ y: 13, height: 0 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          )}
        </AnimatePresence>
      </motion.g>
    </svg>
  );
}
