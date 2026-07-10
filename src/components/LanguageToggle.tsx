import { useState, useCallback } from "react";

function BrazilFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect width="32" height="24" fill="#009C3B" rx="2" />
      <polygon points="16,3 29,12 16,21 3,12" fill="#FFDF00" />
      <circle cx="16" cy="12" r="5.5" fill="#002776" />
      <path
        d="M11.5 12c0 0 2-1.8 4.5-1.8s4.5 1.8 4.5 1.8-2 1.2-4.5 1.2-4.5-1.2-4.5-1.2z"
        fill="white"
        opacity="0.9"
      />
    </svg>
  );
}

function UsaFlag({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 24" className={className} aria-hidden="true">
      <rect width="32" height="24" fill="white" rx="2" />
      <g fill="#BF0A30">
        <rect y="0" width="32" height="1.85" />
        <rect y="3.7" width="32" height="1.85" />
        <rect y="7.4" width="32" height="1.85" />
        <rect y="11.1" width="32" height="1.85" />
        <rect y="14.8" width="32" height="1.85" />
        <rect y="18.5" width="32" height="1.85" />
        <rect y="22.2" width="32" height="1.85" />
      </g>
      <rect width="14" height="13" fill="#002868" rx="1" />
      <g fill="white">
        <circle cx="2.5" cy="2.2" r="0.6" />
        <circle cx="5.5" cy="2.2" r="0.6" />
        <circle cx="8.5" cy="2.2" r="0.6" />
        <circle cx="11.5" cy="2.2" r="0.6" />
        <circle cx="4" cy="4.4" r="0.6" />
        <circle cx="7" cy="4.4" r="0.6" />
        <circle cx="10" cy="4.4" r="0.6" />
        <circle cx="2.5" cy="6.6" r="0.6" />
        <circle cx="5.5" cy="6.6" r="0.6" />
        <circle cx="8.5" cy="6.6" r="0.6" />
        <circle cx="11.5" cy="6.6" r="0.6" />
        <circle cx="4" cy="8.8" r="0.6" />
        <circle cx="7" cy="8.8" r="0.6" />
        <circle cx="10" cy="8.8" r="0.6" />
        <circle cx="2.5" cy="11" r="0.6" />
        <circle cx="5.5" cy="11" r="0.6" />
        <circle cx="8.5" cy="11" r="0.6" />
        <circle cx="11.5" cy="11" r="0.6" />
      </g>
    </svg>
  );
}

type Lang = "pt" | "en";

interface LanguageToggleProps {
  lang: Lang;
  onToggle: () => void;
  ariaLabel: string;
  variant?: "desktop" | "mobile";
}

export function LanguageToggle({
  lang,
  onToggle,
  ariaLabel,
  variant = "desktop",
}: LanguageToggleProps) {
  const [popping, setPopping] = useState(false);

  const handleClick = useCallback(() => {
    setPopping(true);
    onToggle();
    const t = setTimeout(() => setPopping(false), 550);
    return () => clearTimeout(t);
  }, [onToggle]);

  const targetFlag = lang === "pt" ? "usa" : "brazil";
  const label = lang === "pt" ? "EN" : "BR";

  const isDesktop = variant === "desktop";

  return (
    <button
      onClick={handleClick}
      aria-label={ariaLabel}
      className={`
        relative isolate overflow-hidden rounded-md border border-hairline
        font-mono uppercase tracking-[0.3em] text-foreground
        transition-colors hover:border-accent hover:text-accent
        ${isDesktop ? "px-2.5 py-1.5 text-[11px]" : "flex-1 px-3 py-3 text-xs min-h-11"}
      `}
    >
      <span className="relative z-10">{label}</span>

      {targetFlag === "brazil" && (
        <BrazilFlag
          className={`
            pointer-events-none absolute inset-0 z-0 h-full w-full object-cover
            ${popping ? "animate-flag-pop" : "opacity-0"}
          `}
        />
      )}
      {targetFlag === "usa" && (
        <UsaFlag
          className={`
            pointer-events-none absolute inset-0 z-0 h-full w-full object-cover
            ${popping ? "animate-flag-pop" : "opacity-0"}
          `}
        />
      )}
    </button>
  );
}
