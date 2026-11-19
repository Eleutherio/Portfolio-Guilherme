import { useId, useLayoutEffect, useState, type CSSProperties, type ReactNode } from "react";

const GRID = 12;
const EDGES = ["top", "right", "bottom", "left"] as const;

type Props = {
  children: ReactNode;
  className: string;
  selected: boolean;
  active: boolean;
  reducedMotion: boolean;
  duration: number;
  complete: boolean;
};

export function TestimonialPixelImage({
  children,
  className,
  selected,
  active,
  reducedMotion,
  duration,
  complete,
}: Props) {
  const maskId = `testimonial-pixels-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [pattern, setPattern] = useState({ edge: 0, seed: 0 });
  const reveal = selected && !reducedMotion && !complete;

  useLayoutEffect(() => {
    if (reveal) setPattern({ edge: Math.floor(Math.random() * 4), seed: Math.random() * 10_000 });
  }, [reveal]);

  const weights = Array.from({ length: GRID * GRID }, (_, index) => {
    const row = Math.floor(index / GRID);
    const column = index % GRID;
    const distance = [row, GRID - 1 - column, GRID - 1 - row, column][pattern.edge]! / (GRID - 1);
    const noise = Math.sin(index * 127.1 + pattern.seed * 311.7) * 43758.5453;
    return distance * 0.72 + (noise - Math.floor(noise)) * 0.28;
  });
  const first = Math.min(...weights);
  const spread = Math.max(...weights) - first;

  return (
    <>
      <picture
        className={className}
        data-pixel-edge={EDGES[pattern.edge]}
        style={
          reveal
            ? { maskImage: `url("#${maskId}")`, WebkitMaskImage: `url("#${maskId}")` }
            : undefined
        }
      >
        {children}
      </picture>
      <svg
        className="testimonial-pixel-mask"
        width="0"
        height="0"
        aria-hidden="true"
        focusable="false"
        data-reveal={reveal ? "true" : "false"}
        data-active={active ? "true" : "false"}
      >
        <defs>
          <mask
            id={maskId}
            maskUnits="objectBoundingBox"
            maskContentUnits="objectBoundingBox"
            x="0"
            y="0"
            width="1"
            height="1"
          >
            {Array.from({ length: GRID * GRID }, (_, index) => {
              const row = Math.floor(index / GRID);
              const column = index % GRID;
              const delay = ((weights[index]! - first) / spread) * Math.max(0, duration - 80);
              return (
                <rect
                  key={`${pattern.seed}:${index}`}
                  x={column / GRID}
                  y={row / GRID}
                  width={1 / GRID + 0.001}
                  height={1 / GRID + 0.001}
                  fill="white"
                  style={{ "--pixel-delay": `${delay}ms` } as CSSProperties}
                />
              );
            })}
          </mask>
        </defs>
      </svg>
    </>
  );
}
