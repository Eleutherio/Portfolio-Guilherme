import { useHeroCarousel } from "@/components/hero/HeroCarouselContext";
import { useApp } from "@/i18n/AppContext";

function TypewriterBadge({
  value,
  items,
  prefersReduced,
  accent = false,
}: {
  value: string;
  items: string[];
  prefersReduced: boolean;
  accent?: boolean;
}) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-2.5 rounded-lg border px-3.5 py-2 shadow-sm backdrop-blur-sm transition-colors ${
        accent ? "border-accent/35 bg-accent-soft/55" : "border-hairline bg-surface/80"
      }`}
    >
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${accent ? "bg-accent" : "bg-muted-foreground/60"}`}
      />
      <span className="inline-grid min-w-0 leading-[1.35]">
        {items.map((item) => (
          <span
            key={item}
            aria-hidden="true"
            className="invisible col-start-1 row-start-1 break-words"
          >
            {item}
            {!prefersReduced && "_"}
          </span>
        ))}
        <span
          className={`col-start-1 row-start-1 min-w-0 break-words ${
            accent ? "text-gradient" : "text-foreground"
          }`}
        >
          {value}
          {!prefersReduced && (
            <span className="tw-caret" aria-hidden="true">
              _
            </span>
          )}
        </span>
      </span>
    </span>
  );
}

export function RotatingTagline() {
  const { word1, word2, prefersReduced } = useHeroCarousel();
  const { t } = useApp();

  return (
    <p className="mt-6 flex max-w-[34rem] flex-col items-start gap-2.5 font-sans text-[15px] font-medium md:text-[16px]">
      <TypewriterBadge value={word1} items={t.hero.carousel1} prefersReduced={prefersReduced} />
      <TypewriterBadge
        value={word2}
        items={t.hero.carousel2}
        prefersReduced={prefersReduced}
        accent
      />
    </p>
  );
}
