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
  const label = lang === "pt" ? "EN" : "BR";
  const isDesktop = variant === "desktop";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      className={`
        grid place-items-center rounded-full font-sans font-medium tracking-[-0.01em]
        text-muted-foreground transition-colors hover:bg-background hover:text-foreground
        ${isDesktop ? "h-9 min-w-9 px-2 text-xs" : "h-11 min-w-14 px-3 text-xs"}
      `}
    >
      {label}
    </button>
  );
}
