import type { CSSProperties, ElementType } from "react";
import { Code2, Search } from "lucide-react";
import {
  SiCss,
  SiDjango,
  SiFramer,
  SiHtml5,
  SiJavascript,
  SiPostgresql,
  SiReact,
  SiServerless,
  SiShadcnui,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";

type TechnologyMeta = {
  Icon: ElementType;
  light: string;
  dark?: string;
};

const TECHNOLOGIES: Record<string, TechnologyMeta> = {
  react: { Icon: SiReact, light: "#149eca", dark: "#61dafb" },
  typescript: { Icon: SiTypescript, light: "#3178c6", dark: "#77aee8" },
  vite: { Icon: SiVite, light: "#646cff", dark: "#9499ff" },
  django: { Icon: SiDjango, light: "#0c4b33", dark: "#44b78b" },
  drf: { Icon: SiDjango, light: "#a30000", dark: "#ff7777" },
  postgresql: { Icon: SiPostgresql, light: "#4169e1", dark: "#84a1ff" },
  html: { Icon: SiHtml5, light: "#e34f26", dark: "#ff7a59" },
  css: { Icon: SiCss, light: "#1572b6", dark: "#65b8ec" },
  javascript: { Icon: SiJavascript, light: "#9a8100", dark: "#f7df1e" },
  serverless: { Icon: SiServerless, light: "#d63f39", dark: "#fd5750" },
  seo: { Icon: Search, light: "#0b786f", dark: "#52c7b8" },
  vercel: { Icon: SiVercel, light: "#18212b", dark: "#f4f1ea" },
  tailwindcss: { Icon: SiTailwindcss, light: "#078aa8", dark: "#38bdf8" },
  shadcnui: { Icon: SiShadcnui, light: "#18212b", dark: "#f4f1ea" },
  framermotion: { Icon: SiFramer, light: "#0055ff", dark: "#8cacff" },
};

function normalizeTechnology(label: string) {
  const normalized = label.toLowerCase().replace(/[\s./_-]+/g, "");
  if (normalized.startsWith("react")) return "react";
  return normalized;
}

export function TechnologyBadge({ label }: { label: string }) {
  const meta = TECHNOLOGIES[normalizeTechnology(label)];
  const Icon = meta?.Icon ?? Code2;

  return (
    <span
      className="technology-badge"
      style={
        {
          "--tech-color-light": meta?.light,
          "--tech-color-dark": meta?.dark ?? meta?.light,
        } as CSSProperties
      }
    >
      <Icon className="technology-badge__icon h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
