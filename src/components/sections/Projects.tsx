import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ExternalLink, Pause, Play } from "lucide-react";
import { ImageCover } from "@/components/ImageCover";
import { ProjectInteractionHint } from "@/components/ProjectInteractionHint";
import { useViewportActivity } from "@/components/ViewportActivity";
import { GithubIcon } from "@/components/icons/Brand";
import {
  getLocalizedProjectSummaries,
  type LocalizedProjectSummary,
} from "@/content/project-summaries";
import { useApp } from "@/i18n/AppContext";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { SectionShell } from "./SectionShell";

function ProjectPreviewVideo({ src, enabled }: { src: string; enabled: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const viewportActive = useViewportActivity();
  const shouldLoad = enabled && viewportActive;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    setReady(false);
    if (!shouldLoad) {
      video.pause();
      return;
    }

    let cancelled = false;
    let frameCallback = 0;
    if (video.getAttribute("src") !== src) {
      video.src = src;
    }
    // Skip the recordings' blank opening frame on desktop.
    video.currentTime = window.matchMedia("(min-width: 64rem)").matches ? 0.1 : 0;

    void video
      .play()
      .then(() => {
        if (cancelled) return;
        if (typeof video.requestVideoFrameCallback === "function") {
          frameCallback = video.requestVideoFrameCallback(() => {
            if (!cancelled) setReady(true);
          });
        } else {
          setReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) setReady(false);
      });

    return () => {
      cancelled = true;
      if (frameCallback) video.cancelVideoFrameCallback(frameCallback);
      video.pause();
    };
  }, [shouldLoad, src]);

  return (
    <video
      ref={videoRef}
      src={enabled ? src : undefined}
      muted
      loop
      playsInline
      preload={enabled ? "auto" : "none"}
      aria-hidden="true"
      onError={() => setReady(false)}
      data-preview-ready={ready && shouldLoad ? "true" : "false"}
      className={`project-showcase-video absolute inset-0 z-10 block h-full w-full object-contain transition-opacity duration-300 motion-reduce:transition-none ${
        ready && shouldLoad ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}

type ProjectCardProps = {
  project: LocalizedProjectSummary;
  instanceId: string;
  active: boolean;
  playbackEnabled: boolean;
  onPreviewIntent: () => void;
  onPreviewEnd: () => void;
  onPlaybackToggle: () => void;
};

function ProjectCard({
  project,
  instanceId,
  active,
  playbackEnabled,
  onPreviewIntent,
  onPreviewEnd,
  onPlaybackToggle,
}: ProjectCardProps) {
  const { t } = useApp();
  const lastTouchPointerAtRef = useRef(Number.NEGATIVE_INFINITY);
  const projectDestination = t.cursor.destinations.project + " " + project.title;
  const repositoryDestination = t.cursor.destinations.repository + " " + project.title;
  const sizes = "100vw";

  return (
    <li
      data-project-card={instanceId}
      data-project-variant="showcase"
      data-project-active={active ? "true" : "false"}
      className="project-showcase-card min-w-0"
      onPointerDownCapture={(event) => {
        if (event.pointerType === "touch") lastTouchPointerAtRef.current = performance.now();
      }}
      onFocusCapture={() => {
        if (performance.now() - lastTouchPointerAtRef.current >= 1_000) onPreviewIntent();
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) onPreviewEnd();
      }}
      onClickCapture={(event) => {
        if (
          !active &&
          performance.now() - lastTouchPointerAtRef.current < 1_000 &&
          (event.target as HTMLElement).closest("[data-project-preview]")
        ) {
          event.preventDefault();
          onPreviewIntent();
        }
      }}
      onKeyDown={(event) => {
        if (!(event.target as HTMLElement).matches("[data-project-preview]")) return;
        const direction =
          event.key === "ArrowRight" || event.key === "ArrowDown"
            ? 1
            : event.key === "ArrowLeft" || event.key === "ArrowUp"
              ? -1
              : 0;
        if (!direction) return;
        event.preventDefault();
        const links = Array.from(
          event.currentTarget.parentElement!.querySelectorAll<HTMLAnchorElement>(
            ":scope > [data-project-card] [data-project-preview]",
          ),
        );
        const index = links.indexOf(event.target as HTMLAnchorElement);
        links[(index + direction + links.length) % links.length]?.focus({ preventScroll: true });
      }}
    >
      <article className="project-showcase-link relative isolate block w-full overflow-hidden border border-white/10 bg-surface">
        <ImageCover
          image={project.gridCoverImage}
          desktopImage={project.coverImage}
          alt=""
          sizes={sizes}
          className="absolute inset-0 block h-full w-full"
          imgClassName={
            "project-showcase-image h-full w-full object-cover " +
            (project.imageFocus ?? "object-center")
          }
        />
        {project.previewVideoSrc ? (
          <ProjectPreviewVideo src={project.previewVideoSrc} enabled={playbackEnabled} />
        ) : null}
        <span className="project-showcase-overlay absolute inset-0 z-20" aria-hidden="true" />
        <ProjectInteractionHint
          swipeLabel={t.projects.swipeHint}
          clickLabel={t.projects.clickHint}
          active={active}
          swipeEnabled={false}
        />

        <h3 className="sr-only">{project.title}</h3>
        <ul className="sr-only" aria-label={t.projects.typeLabel}>
          {project.badges.map((badge) => (
            <li key={badge}>{badge}</li>
          ))}
        </ul>
        <div
          aria-hidden="true"
          className="project-showcase-meta pointer-events-none absolute inset-0 z-30 text-white"
        >
          <div className="project-showcase-meta-layer project-showcase-meta-layer--horizontal">
            <span className="project-showcase-title-text">{project.title}</span>
            <div className="project-showcase-badges flex flex-wrap items-center">
              {project.badges.map((badge) => (
                <span key={badge} className="project-showcase-badge">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="project-showcase-actions pointer-events-auto absolute z-30 flex items-center gap-1">
          {project.previewVideoSrc ? (
            <button
              type="button"
              data-project-video-control
              aria-label={`${playbackEnabled ? t.hero.video.pause : t.hero.video.play} — ${project.title}`}
              aria-pressed={playbackEnabled}
              onClick={onPlaybackToggle}
              className="project-showcase-action touch-target grid place-items-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white"
            >
              {playbackEnabled ? (
                <Pause className="h-[1.125rem] w-[1.125rem]" />
              ) : (
                <Play className="h-[1.125rem] w-[1.125rem]" />
              )}
            </button>
          ) : null}
          {project.demoUrl && project.demoUrl !== "#" ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-open={projectDestination}
              aria-label={t.projects.demo + " — " + project.title}
              className="project-showcase-action touch-target grid place-items-center rounded-full text-white/75 transition-colors hover:text-white focus-visible:text-white"
            >
              <ExternalLink className="h-[1.125rem] w-[1.125rem]" aria-hidden="true" />
            </a>
          ) : null}
          {project.repoUrl && project.repoUrl !== "#" ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor-open={repositoryDestination}
              aria-label={t.projects.repo + " — " + project.title}
              className="project-showcase-action touch-target grid place-items-center rounded-full text-white/75 transition-colors hover:text-white focus-visible:text-white"
            >
              <GithubIcon className="h-[1.125rem] w-[1.125rem]" />
            </a>
          ) : null}
        </div>
        <Link
          to="/projetos/$slug"
          params={{ slug: project.slug }}
          data-project-preview
          aria-current={active ? "true" : undefined}
          data-cursor-tooltip="media"
          data-cursor-open={projectDestination}
          aria-label={t.projects.caseStudy + " — " + project.title}
          className="absolute inset-0 z-[25] rounded-[inherit] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
        />
      </article>
    </li>
  );
}

export function Projects() {
  const { t, lang } = useApp();
  const reducedMotion = usePrefersReducedMotion();
  const projects = getLocalizedProjectSummaries(lang);
  const [hydrated, setHydrated] = useState(false);
  const [expandedInstance, setExpandedInstance] = useState<string>(projects[0]!.slug);
  const [playingInstance, setPlayingInstance] = useState<string | null>(null);
  const hoveredInstanceRef = useRef<string | null>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const [mobileScroll, setMobileScroll] = useState(false);
  const [centeredInstance, setCenteredInstance] = useState<string | null>(null);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 47.999rem)");
    let frame = 0;
    const update = () => {
      frame = 0;
      setMobileScroll(mobile.matches);
      if (!mobile.matches) return;
      const center = window.innerHeight / 2;
      const cards = gridRef.current?.querySelectorAll<HTMLElement>("[data-project-card]");
      const card = Array.from(cards ?? []).find((element) => {
        const rect = element.getBoundingClientRect();
        return rect.top <= center && rect.bottom >= center;
      });
      setCenteredInstance(card?.dataset.projectCard ?? null);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    mobile.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      mobile.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <SectionShell id="projetos" label={t.projects.title} headerVariant="showcase">
      <div className="md:col-span-12" data-projects-hydrated={hydrated}>
        <ul
          ref={gridRef}
          data-project-grid
          data-projects-active="true"
          className="projects-showcase"
          onPointerMove={(event) => {
            if (mobileScroll || event.pointerType === "touch") return;
            const card = (event.target as HTMLElement).closest<HTMLElement>("[data-project-card]");
            if (!card) return;
            if (card.dataset.projectCard) setExpandedInstance(card.dataset.projectCard);
            if (
              event.isTrusted &&
              event.pointerType === "mouse" &&
              !reducedMotion &&
              window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
              hoveredInstanceRef.current !== card.dataset.projectCard
            ) {
              hoveredInstanceRef.current = card.dataset.projectCard ?? null;
              setPlayingInstance(hoveredInstanceRef.current);
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType === "mouse") {
              hoveredInstanceRef.current = null;
              setPlayingInstance(null);
            }
          }}
        >
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={project}
              instanceId={project.slug}
              active={(mobileScroll ? centeredInstance : expandedInstance) === project.slug}
              playbackEnabled={playingInstance === project.slug}
              onPlaybackToggle={() =>
                setPlayingInstance((current) => (current === project.slug ? null : project.slug))
              }
              onPreviewIntent={() => {
                if (mobileScroll) setCenteredInstance(project.slug);
                setExpandedInstance(project.slug);
              }}
              onPreviewEnd={() => {
                setPlayingInstance((current) => (current === project.slug ? null : current));
              }}
            />
          ))}
        </ul>
      </div>
    </SectionShell>
  );
}
