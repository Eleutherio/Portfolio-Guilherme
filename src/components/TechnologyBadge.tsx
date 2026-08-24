import type { CSSProperties, SVGProps } from "react";

type TechnologyKind =
  | "react"
  | "typescript"
  | "vite"
  | "django"
  | "postgresql"
  | "html"
  | "css"
  | "javascript"
  | "serverless"
  | "seo"
  | "vercel"
  | "tailwindcss"
  | "shadcnui"
  | "framermotion"
  | "code";

type TechnologyMeta = {
  kind: TechnologyKind;
  light: string;
  dark?: string;
};

const TECHNOLOGIES: Record<string, TechnologyMeta> = {
  react: { kind: "react", light: "#149eca", dark: "#61dafb" },
  typescript: { kind: "typescript", light: "#3178c6", dark: "#77aee8" },
  vite: { kind: "vite", light: "#646cff", dark: "#9499ff" },
  django: { kind: "django", light: "#0c4b33", dark: "#44b78b" },
  drf: { kind: "django", light: "#a30000", dark: "#ff7777" },
  postgresql: { kind: "postgresql", light: "#4169e1", dark: "#84a1ff" },
  html: { kind: "html", light: "#e34f26", dark: "#ff7a59" },
  css: { kind: "css", light: "#1572b6", dark: "#65b8ec" },
  javascript: { kind: "javascript", light: "#9a8100", dark: "#f7df1e" },
  serverless: { kind: "serverless", light: "#d63f39", dark: "#fd5750" },
  seo: { kind: "seo", light: "#0b786f", dark: "#52c7b8" },
  vercel: { kind: "vercel", light: "#18212b", dark: "#f4f1ea" },
  tailwindcss: { kind: "tailwindcss", light: "#078aa8", dark: "#38bdf8" },
  shadcnui: { kind: "shadcnui", light: "#18212b", dark: "#f4f1ea" },
  framermotion: { kind: "framermotion", light: "#0055ff", dark: "#8cacff" },
};

function normalizeTechnology(label: string) {
  const normalized = label.toLowerCase().replace(/[\s./_-]+/g, "");
  if (normalized.startsWith("react")) return "react";
  return normalized;
}

function TechnologyGlyph({ kind, ...props }: SVGProps<SVGSVGElement> & { kind: TechnologyKind }) {
  const shared = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };

  if (kind === "react") {
    return (
      <svg {...shared}>
        <ellipse cx="12" cy="12" rx="10" ry="4.1" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4.1" transform="rotate(120 12 12)" />
        <circle cx="12" cy="12" r="1.7" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (kind === "typescript" || kind === "javascript" || kind === "django") {
    const label = kind === "typescript" ? "TS" : kind === "javascript" ? "JS" : "dj";
    return (
      <svg {...shared}>
        <rect x="2.5" y="2.5" width="19" height="19" rx="2" />
        <text
          x="12"
          y="15.4"
          fill="currentColor"
          stroke="none"
          textAnchor="middle"
          fontSize="9"
          fontWeight="700"
        >
          {label}
        </text>
      </svg>
    );
  }

  if (kind === "vite") {
    return (
      <svg {...shared} fill="currentColor" stroke="none">
        <path d="M13 2 4.5 12h6L9.8 22 19.5 9.5h-6.2z" />
      </svg>
    );
  }

  if (kind === "postgresql") {
    return (
      <svg {...shared}>
        <ellipse cx="12" cy="5" rx="7.5" ry="3" />
        <path d="M4.5 5v7c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V5M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6" />
      </svg>
    );
  }

  if (kind === "html" || kind === "css") {
    const detail =
      kind === "html"
        ? "M8 7h8l-.5 4H9l.4 4 2.6.7 2.6-.7.2-2"
        : "M8 7h8l-.5 4-6 .1-.4 4 2.9.7 2.7-.8";
    return (
      <svg {...shared}>
        <path d="M4 2h16l-1.5 17L12 22l-6.5-3z" />
        <path d={detail} />
      </svg>
    );
  }

  if (kind === "serverless") {
    return (
      <svg {...shared} fill="currentColor" stroke="none">
        <path d="M2 4h9L9.5 8H2zm11 0h9v4H11.5zM2 10h6.8l-1.5 4H2zm8.8 0H22v4H9.3zM2 16h4.5L5 20H2zm6.5 0H22v4H7z" />
      </svg>
    );
  }

  if (kind === "seo") {
    return (
      <svg {...shared}>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
      </svg>
    );
  }

  if (kind === "vercel") {
    return (
      <svg {...shared} fill="currentColor" stroke="none">
        <path d="m12 3 10 18H2z" />
      </svg>
    );
  }

  if (kind === "tailwindcss") {
    return (
      <svg {...shared}>
        <path d="M2 9c3-4 6-4 9 0s6 4 11 0M2 15c3-4 6-4 9 0s6 4 11 0" />
      </svg>
    );
  }

  if (kind === "shadcnui") {
    return (
      <svg {...shared}>
        <path d="m5 19 14-14M11 21l10-10" />
      </svg>
    );
  }

  if (kind === "framermotion") {
    return (
      <svg {...shared} fill="currentColor" stroke="none">
        <path d="M5 2h14v7h-7l7 7H5zm0 14h7v6z" />
      </svg>
    );
  }

  return (
    <svg {...shared}>
      <path d="m9 7-5 5 5 5m6-10 5 5-5 5" />
    </svg>
  );
}

function technologyStyle(meta: TechnologyMeta | undefined) {
  return {
    "--tech-color-light": meta?.light,
    "--tech-color-dark": meta?.dark ?? meta?.light,
  } as CSSProperties;
}

export function TechnologyBadge({ label }: { label: string }) {
  const meta = TECHNOLOGIES[normalizeTechnology(label)];

  return (
    <span className="technology-badge" style={technologyStyle(meta)}>
      <TechnologyGlyph
        kind={meta?.kind ?? "code"}
        className="technology-badge__icon h-4 w-4 shrink-0"
      />
      <span>{label}</span>
    </span>
  );
}

export function TechnologyIcon({ label }: { label: string }) {
  const meta = TECHNOLOGIES[normalizeTechnology(label)];

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className="inline-grid h-7 w-7 place-items-center"
      style={technologyStyle(meta)}
    >
      <TechnologyGlyph
        kind={meta?.kind ?? "code"}
        className="technology-badge__icon h-[18px] w-[18px]"
      />
    </span>
  );
}
