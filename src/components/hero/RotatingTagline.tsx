import { useHeroCarousel } from "@/components/hero/HeroCarouselContext";
import { useApp } from "@/i18n/AppContext";

export function RotatingTagline() {
  const { word1, word2, prefersReduced } = useHeroCarousel();
  const { t } = useApp();

  return (
    <p className="prose-measure mt-6 text-[16px] leading-relaxed text-muted-foreground md:text-[18px]">
      <span className="text-foreground">{t.hero.taglinePrefix} </span>
      <span className="inline">
        <span className="text-foreground font-medium">{word1}</span>
        {!prefersReduced && <span className="tw-caret" aria-hidden="true">_</span>}
      </span>
      <span className="text-foreground"> {t.hero.taglineJoin} </span>
      <span className="inline">
        <span className="text-gradient font-medium">{word2}</span>
        {!prefersReduced && <span className="tw-caret" aria-hidden="true">_</span>}
      </span>
    </p>
  );
}
