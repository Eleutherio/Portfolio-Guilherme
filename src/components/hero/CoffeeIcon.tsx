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
      <g className="coffee-steam" opacity="0.85">
        <path d="M7 3.5 C 7 2.5, 8 2.5, 8 1.5" />
        <path d="M10 3.5 C 10 2.5, 11 2.5, 11 1.5" style={{ animationDelay: "0.6s" }} />
        <path d="M13 3.5 C 13 2.5, 14 2.5, 14 1.5" style={{ animationDelay: "1.2s" }} />
      </g>

      <g className="coffee-cup" data-state={state} style={{ transformOrigin: "6px 15px" }}>
        {/* Cup body */}
        <path d="M5 6 H14 V13 A2 2 0 0 1 12 15 H7 A2 2 0 0 1 5 13 Z" />
        {/* Handle */}
        <path d="M14 8 H16 A2 2 0 0 1 16 12 H14" />
        {/* Coffee liquid — clipped inside cup */}
        {targetH > 0 && (
          <rect
            x="6"
            y={13 - targetH}
            width="7"
            height={targetH}
            rx="0.5"
            fill="currentColor"
            stroke="none"
            className="coffee-liquid"
          />
        )}
      </g>
    </svg>
  );
}
