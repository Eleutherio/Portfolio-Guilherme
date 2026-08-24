import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useReducedMotion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/Brand";
import { ImageCover } from "@/components/ImageCover";
import { ScrambleText } from "@/components/ScrambleText";
import { TechnologyIcon } from "@/components/TechnologyBadge";
import { useViewportActivity } from "@/components/ViewportActivity";
import { useApp } from "@/i18n/AppContext";
import {
  getLocalizedProjectSummaries,
  type LocalizedProjectSummary,
} from "@/content/project-summaries";
import { SectionShell } from "./SectionShell";

type ProjectMediaProps = {
  project: LocalizedProjectSummary;
  active: boolean;
  eager: boolean;
};

function ProjectPreviewVideo({
  src,
  poster,
  active,
}: {
  src: string;
  poster: string;
  active: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const viewportActive = useViewportActivity();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (!active || !viewportActive) {
      video.pause();
      return;
    }

    void video.play().catch(() => {
      // O poster permanece visível caso o navegador bloqueie a reprodução automática.
    });
  }, [active, viewportActive]);

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload={active ? "metadata" : "none"}
      aria-hidden="true"
      className="absolute inset-0 block h-full w-full object-contain"
    />
  );
}

function ProjectMedia({ project, active, eager }: ProjectMediaProps) {
  const { t } = useApp();
  const projectDestination = `${t.cursor.destinations.project} ${project.title}`;

  return (
    <div
      className={`flex h-full w-[min(100%,800px)] flex-col justify-start transition-[filter,opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        active
          ? "scale-100 opacity-100 blur-0"
          : "pointer-events-none scale-[0.98] opacity-0 blur-0"
      }`}
    >
      <Link
        to="/projetos/$slug"
        params={{ slug: project.slug }}
        data-cursor-open={projectDestination}
        aria-label={`${t.projects.openPreview} — ${project.title}`}
        aria-current={active ? "true" : undefined}
        tabIndex={active ? 0 : -1}
        style={{
          aspectRatio: `${project.coverImage.width} / ${project.coverImage.height}`,
          borderRadius: 0,
        }}
        className="card-surface card-surface--accent card-surface--static relative block w-full overflow-hidden"
      >
        {project.previewVideoSrc ? (
          <ProjectPreviewVideo
            src={project.previewVideoSrc}
            poster={project.coverSrc}
            active={active}
          />
        ) : (
          <ImageCover
            image={project.coverImage}
            alt={project.coverAlt}
            sizes="(max-width: 1024px) calc(100vw - 6rem), 800px"
            eager={eager}
            fetchPriority={eager ? "high" : undefined}
            className="absolute inset-0 block h-full w-full"
            imgClassName="h-full w-full object-contain"
          />
        )}
      </Link>

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        {project.projectType.split("/").map((type) => {
          const label = type.trim();
          return (
            <span
              key={label}
              className="rounded-sm bg-surface px-2.5 py-1 font-display text-xs leading-none text-muted-foreground"
            >
              {label}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function ProjectDetails({ project }: { project: LocalizedProjectSummary }) {
  const { t } = useApp();
  const projectDestination = `${t.cursor.destinations.project} ${project.title}`;
  const repositoryDestination = `${t.cursor.destinations.repository} ${project.title}`;

  return (
    <article className="w-full max-w-2xl">
      <h3 className="h-16 min-w-0 font-display text-3xl font-medium leading-[1.02] tracking-[-0.03em] text-foreground md:h-20 md:text-4xl">
        <Link
          to="/projetos/$slug"
          params={{ slug: project.slug }}
          data-cursor-open={projectDestination}
          className="transition-colors hover:text-accent"
        >
          <ScrambleText text={project.title} />
        </Link>
      </h3>

      <p
        data-project-description
        className="mt-4 h-28 max-w-xl text-base leading-relaxed text-foreground/80 sm:h-24 md:text-lg lg:h-52 xl:h-40"
      >
        <ScrambleText text={project.oneLineSummary} />
      </p>

      <ul
        data-project-stack
        className="mt-5 flex flex-wrap items-center gap-1"
        aria-label={t.caseStudy.stackLabel}
      >
        {project.stack.map((technology) => (
          <li key={technology}>
            <TechnologyIcon label={technology} />
          </li>
        ))}
      </ul>

      <div data-project-actions className="mt-5 flex flex-wrap items-center gap-1.5">
        <Link
          to="/projetos/$slug"
          params={{ slug: project.slug }}
          data-cursor-open={projectDestination}
          className="btn-outline inline-flex"
        >
          <span>{t.projects.caseStudy}</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>

        {project.repoUrl && project.repoUrl !== "#" ? (
          <a
            href={project.repoUrl}
            data-cursor-open={repositoryDestination}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${t.projects.repo} — ${project.title}`}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-accent"
          >
            <GithubIcon className="h-4 w-4" />
          </a>
        ) : null}
        {project.demoUrl && project.demoUrl !== "#" ? (
          <a
            href={project.demoUrl}
            data-cursor-open={projectDestination}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`${t.projects.live} — ${project.title}`}
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-accent"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>
    </article>
  );
}

export function Projects() {
  const { t, lang } = useApp();
  const projects = getLocalizedProjectSummaries(lang);
  const reducedMotion = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
  const scrollFrameRef = useRef(0);
  const settleTimerRef = useRef<number | null>(null);
  const physicalIndexRef = useRef(projects.length);
  const [index, setIndex] = useState(0);
  const [physicalIndex, setPhysicalIndex] = useState(projects.length);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(
    () => () => {
      if (scrollFrameRef.current) window.cancelAnimationFrame(scrollFrameRef.current);
      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
    },
    [],
  );

  const total = projects.length;
  const loopedProjects = [...projects, ...projects, ...projects];
  const current = projects[index];

  const setScrollTopInstantly = (rail: HTMLDivElement, top: number) => {
    const previousScrollBehavior = rail.style.scrollBehavior;
    rail.style.scrollBehavior = "auto";
    rail.scrollTop = top;
    rail.style.scrollBehavior = previousScrollBehavior;
  };

  const syncFocusedProject = () => {
    if (scrollFrameRef.current) return;

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      scrollFrameRef.current = 0;
      const rail = railRef.current;
      if (!rail) return;

      const railRect = rail.getBoundingClientRect();
      const focusLine = railRect.top + rail.clientHeight / 2;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      slideRefs.current.forEach((slide, itemIndex) => {
        if (!slide) return;
        const slideRect = slide.getBoundingClientRect();
        const center = slideRect.top + slideRect.height / 2;
        const distance = Math.abs(center - focusLine);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = itemIndex;
        }
      });

      setPhysicalIndex(closestIndex);
      physicalIndexRef.current = closestIndex;
      setIndex(closestIndex % total);

      if (settleTimerRef.current) window.clearTimeout(settleTimerRef.current);
      settleTimerRef.current = window.setTimeout(() => {
        if (closestIndex >= total && closestIndex < total * 2) return;
        const normalizedIndex = total + (closestIndex % total);
        const normalizedSlide = slideRefs.current[normalizedIndex];
        if (!normalizedSlide) return;

        const normalizedRailRect = rail.getBoundingClientRect();
        const normalizedSlideRect = normalizedSlide.getBoundingClientRect();
        const normalizedTop =
          rail.scrollTop +
          normalizedSlideRect.top -
          normalizedRailRect.top -
          (rail.clientHeight - normalizedSlideRect.height) / 2;

        setScrollTopInstantly(rail, normalizedTop);
        physicalIndexRef.current = normalizedIndex;
        setPhysicalIndex(normalizedIndex);
      }, 140);
    });
  };

  const scrollToPhysical = (nextPhysicalIndex: number, behavior?: ScrollBehavior) => {
    const rail = railRef.current;
    const slide = slideRefs.current[nextPhysicalIndex];
    if (!rail || !slide) return;

    const railRect = rail.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const slideTop = rail.scrollTop + slideRect.top - railRect.top;
    const top = slideTop - (rail.clientHeight - slideRect.height) / 2;
    const resolvedBehavior = behavior ?? (reducedMotion ? "auto" : "smooth");

    if (resolvedBehavior === "auto") {
      setScrollTopInstantly(rail, top);
      return;
    }

    rail.scrollTo({ top, behavior: resolvedBehavior });
  };

  const move = (step: -1 | 1) => {
    const nextPhysicalIndex = physicalIndexRef.current + step;
    physicalIndexRef.current = nextPhysicalIndex;
    scrollToPhysical(nextPhysicalIndex);
  };

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      physicalIndexRef.current = total;
      scrollToPhysical(total, "auto");
    });
    return () => window.cancelAnimationFrame(frame);
    // O ciclo central é posicionado uma única vez; idioma não altera a quantidade de projetos.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const handleRailKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowUp") {
      event.preventDefault();
      move(-1);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      move(1);
    }
  };

  const ctaText =
    lang === "pt"
      ? "Ficou interessado em algum destes cases ou quer tirar alguma dúvida?"
      : "Interested in any of these cases or have a question?";
  const ctaLabel = lang === "pt" ? "Entrar em contato" : "Get in touch";
  const railLabel = lang === "pt" ? "Carrossel vertical de projetos" : "Vertical project carousel";

  return (
    <SectionShell
      id="projetos"
      label={t.projects.subtitle}
      lead={t.projects.lead}
      headerVariant="sequence"
      headerSpacing="tight"
    >
      <div className="md:col-span-12" data-projects-hydrated={hydrated}>
        <div className="grid gap-10 pb-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(17rem,0.65fr)] lg:items-start lg:pb-10">
          <div className="grid min-w-0 grid-cols-[44px_minmax(0,1fr)] gap-2 sm:gap-4">
            <div
              ref={railRef}
              role="region"
              aria-label={railLabel}
              tabIndex={0}
              onScroll={syncFocusedProject}
              onKeyDown={handleRailKeyDown}
              className="projects-carousel__rail col-start-2 row-start-1 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-background"
            >
              <div className="projects-carousel__track">
                {loopedProjects.map((project, itemIndex) => (
                  <div
                    key={`${Math.floor(itemIndex / total)}-${project.slug}`}
                    ref={(node) => {
                      slideRefs.current[itemIndex] = node;
                    }}
                    aria-hidden={itemIndex !== physicalIndex}
                    className="projects-carousel__slide"
                  >
                    <ProjectMedia
                      project={project}
                      active={itemIndex === physicalIndex}
                      eager={itemIndex === total}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="col-start-1 row-start-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label={t.projects.paginationPrev}
                  className="group grid h-9 w-9 place-items-center text-muted-foreground transition-colors hover:text-accent"
                >
                  <ChevronUp
                    className="h-5 w-5 transition-transform group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>

                <span
                  aria-hidden="true"
                  className="block shrink-0"
                  style={{ height: `${projects.length * 2}rem` }}
                />

                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label={t.projects.paginationNext}
                  className="group grid h-9 w-9 place-items-center text-muted-foreground transition-colors hover:text-accent"
                >
                  <ChevronDown
                    className="h-5 w-5 transition-transform group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="w-full lg:pt-[calc((var(--projects-rail-height)-var(--projects-slide-height))/2)]">
            <ProjectDetails project={current} />
          </div>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <p className="prose-measure text-sm text-muted-foreground md:text-base">{ctaText}</p>
          <a
            href="#contato"
            data-cursor-open={t.cursor.destinations.contact}
            className="btn-primary group w-full !py-2.5 !text-[13px] sm:w-auto"
          >
            <span>{ctaLabel}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
