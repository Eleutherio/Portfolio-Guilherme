import { Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useApp } from "@/i18n/AppContext";
import { HeroCarouselProvider } from "@/components/hero/HeroCarouselContext";
import { useElementActivity } from "@/hooks/use-element-activity";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import heroBackgroundVideo from "@/assets/hero/hero-background.mp4";
import heroBackgroundPoster from "@/assets/hero/hero-background-poster-1200w.avif";
import { usePageRevealed } from "@/lib/page-readiness";

type MediaIntent = "none" | "media-opt-in";
type MediaStatus = "static" | "loading" | "playing" | "paused" | "unavailable";

function HighlightHeadline({ text, grad }: { text: string; grad: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => {
        const idx = line.indexOf(grad);
        const isProfessionalSummary = i === lines.length - 1;
        const content =
          idx === -1 ? (
            line
          ) : (
            <>
              {line.slice(0, idx)}
              <span className="max-sm:block">
                <span className="text-gradient">{grad}</span>
                {line.slice(idx + grad.length)}
              </span>
            </>
          );
        return (
          <span
            key={i}
            className={`block ${
              isProfessionalSummary
                ? "display-summary mt-3 max-w-[var(--type-measure-body)] text-[clamp(0.85rem,1.32vw,1.0625rem)] leading-[var(--type-leading-summary)] [letter-spacing:var(--type-tracking-compact)] text-muted-foreground sm:whitespace-nowrap"
                : "display-heading [letter-spacing:var(--type-tracking-display)]"
            }`}
          >
            {content}
          </span>
        );
      })}
    </>
  );
}

export function Hero() {
  const { t } = useApp();
  const { ref, active } = useElementActivity<HTMLElement>();
  const prefersReducedMotion = usePrefersReducedMotion();
  const revealed = usePageRevealed();
  const videoRef = useRef<HTMLVideoElement>(null);
  const userPausedRef = useRef(false);
  const [intent, setIntent] = useState<MediaIntent>("none");
  const [status, setStatus] = useState<MediaStatus>("static");
  const shouldLoadVideo = intent === "media-opt-in";

  const activateVideo = useCallback((nextIntent: Exclude<MediaIntent, "none">) => {
    userPausedRef.current = false;
    setIntent(nextIntent);
    setStatus("loading");
  }, []);

  useEffect(() => {
    if (!revealed || intent === "none") return;
    const video = videoRef.current;
    if (!video) return;

    const syncPlaybackWithActivity = () => {
      if (
        !active ||
        document.visibilityState === "hidden" ||
        (prefersReducedMotion && intent !== "media-opt-in")
      ) {
        if (!video.paused) video.pause();
        return;
      }
      if (!userPausedRef.current && video.paused) {
        void video.play().catch(() => setStatus("unavailable"));
      }
    };

    syncPlaybackWithActivity();
    document.addEventListener("visibilitychange", syncPlaybackWithActivity);
    return () => document.removeEventListener("visibilitychange", syncPlaybackWithActivity);
  }, [active, intent, prefersReducedMotion, revealed]);

  const togglePlayback = () => {
    if (intent === "none") {
      activateVideo("media-opt-in");
      return;
    }

    const video = videoRef.current;
    if (!video) return;
    if (status !== "playing") {
      userPausedRef.current = false;
      setStatus("loading");
      void video.play().catch(() => setStatus("unavailable"));
    } else {
      userPausedRef.current = true;
      setStatus("paused");
      video.pause();
    }
  };

  const controlLabel =
    intent === "none"
      ? t.hero.video.play
      : status === "playing"
        ? t.hero.video.pause
        : status === "unavailable"
          ? t.hero.video.retry
          : t.hero.video.resume;

  return (
    <HeroCarouselProvider active={active}>
      <section
        ref={ref}
        id="home"
        aria-labelledby="home-heading"
        data-runtime-activity={active ? "active" : "paused"}
        className="relative isolate flex min-h-[calc(100svh-var(--site-header-height))] flex-col overflow-x-clip bg-background"
      >
        <video
          ref={videoRef}
          aria-hidden="true"
          data-media-intent={intent}
          data-media-status={status}
          className="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover"
          src={shouldLoadVideo ? heroBackgroundVideo : undefined}
          poster={heroBackgroundPoster}
          muted
          loop
          playsInline
          preload={shouldLoadVideo ? "auto" : "none"}
          tabIndex={-1}
          onPlaying={() => {
            if (userPausedRef.current) {
              videoRef.current?.pause();
              return;
            }
            setStatus("playing");
          }}
          onPause={() => setStatus((current) => (current === "unavailable" ? current : "paused"))}
          onError={() => setStatus("unavailable")}
        />

        {
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={controlLabel}
            title={controlLabel}
            data-hero-video-control
            className="carousel-control carousel-control--on-media touch-target absolute right-6 bottom-7 z-20"
          >
            {status === "playing" ? (
              <Pause className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        }

        <div className="hero-video-content section-container relative flex min-h-[calc(100svh-var(--site-header-height))] flex-1 flex-col justify-end pt-[var(--responsive-mobile-unit)] pb-[calc(var(--responsive-mobile-unit)*6)] sm:pt-6 sm:pb-28 md:min-h-0 md:py-20 lg:py-8">
          <div data-hero-content-band className="hero-content-band relative">
            <div
              aria-hidden="true"
              className="hero-content-band__surface pointer-events-none absolute top-0 right-0 bottom-[calc(var(--responsive-mobile-unit)*-6)] w-screen rounded-none bg-black/55 backdrop-blur-md sm:-bottom-28 md:-bottom-20 lg:-bottom-8"
            />

            <div className="hero-content-band__content relative w-full pt-[calc(var(--responsive-mobile-unit)*6)] sm:pt-28 md:pt-20 lg:pt-8">
              <div className="min-w-0 lg:pr-2">
                <div className="max-w-[40rem]">
                  <h1
                    id="home-heading"
                    tabIndex={-1}
                    className="display-heading text-balance leading-[var(--type-leading-display)] [letter-spacing:var(--type-tracking-section)] text-foreground outline-none"
                    style={{
                      fontSize: "var(--hero-heading-size, clamp(1.5rem, 2.72vw, 2.34rem))",
                    }}
                  >
                    <HighlightHeadline text={t.hero.headline} grad={t.hero.headlineHighlight} />
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </HeroCarouselProvider>
  );
}
