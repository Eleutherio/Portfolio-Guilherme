import { VerticalSwap } from "@/components/VerticalSwap";

type Lang = "pt" | "en";

interface LanguageToggleProps {
  lang: Lang;
  onToggle: () => void;
  ariaLabel: string;
}

export function LanguageToggle({ lang, onToggle, ariaLabel }: LanguageToggleProps) {
  const label = lang === "pt" ? "ENG/US" : "PT/BR";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={ariaLabel}
      className={`
        header-locale-control header-switch-control header-static-control touch-target grid place-items-center border-0 bg-transparent
        ui-control-text transition-colors
        h-11 w-[4.625rem] px-2 lg:h-9
      `}
    >
      <VerticalSwap swapKey={label} className="min-w-[6ch] leading-none">
        {label}
      </VerticalSwap>
    </button>
  );
}
