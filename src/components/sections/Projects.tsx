import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, ArrowUpRight, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/Brand";
import { ImageCover } from "@/components/ImageCover";
import { useApp } from "@/i18n/AppContext";
import {
  getLocalizedProjectSummaries,
  type LocalizedProjectSummary,
} from "@/content/project-summaries";
import { SectionShell } from "./SectionShell";

function ProjectRow({ p, eager }: { p: LocalizedProjectSummary; eager: boolean }) {
  const { t } = useApp();
  const reducedMotion = useReducedMotion();

  return (
    <article className="relative">
      <div className="grid grid-cols-1 gap-6 py-8 md:grid-cols-[340px_1fr] md:gap-8 md:py-12">
        {/* Cover */}
        <div>
          <Link
            to="/projetos/$slug"
            params={{ slug: p.slug }}
            aria-label={`${t.projects.openPreview} — ${p.title}`}
            className="card-surface card-surface--accent group relative block aspect-[4/3] w-full overflow-hidden"
          >
            <ImageCover
              image={p.coverImage}
              alt={p.coverAlt}
              sizes="(max-width: 768px) 100vw, 340px"
              eager={eager}
              fetchPriority={eager ? "high" : undefined}
              className="absolute inset-0 block h-full w-full"
              imgClassName={`h-full w-full object-cover ${p.imageFocus ?? "object-center"} ${
                reducedMotion
                  ? ""
                  : "transition-[filter,transform] duration-500 ease-out group-hover:scale-[1.02] group-hover:blur-md group-hover:brightness-75"
              }`}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 grid place-items-center bg-background/20 opacity-0 transition-opacity duration-400 ease-out group-hover:opacity-100"
            >
              <span className="inline-flex items-center gap-2 border border-foreground/80 bg-background/70 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.3em] text-foreground backdrop-blur-sm">
                {t.projects.openPreview}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="md:pl-2">
          <div className="flex items-start justify-between gap-4">
            <p className="min-w-0 truncate font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {p.id} · {p.projectType}
            </p>
            <div className="flex shrink-0 items-center gap-1">
              {p.repoUrl && p.repoUrl !== "#" && (
                <a
                  href={p.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${t.projects.repo} — ${p.title}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-accent"
                >
                  <GithubIcon className="h-4 w-4" />
                </a>
              )}
              {p.demoUrl && p.demoUrl !== "#" && (
                <a
                  href={p.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`${t.projects.live} — ${p.title}`}
                  className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-accent"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>

          <h3 className="mt-5 font-display text-2xl font-medium leading-[1.1] tracking-[-0.03em] text-foreground md:text-3xl">
            <Link
              to="/projetos/$slug"
              params={{ slug: p.slug }}
              className="transition-colors hover:text-accent"
            >
              {p.title}
            </Link>
          </h3>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/80">
            {p.oneLineSummary}
          </p>

          {/* Technical evidence */}
          <div className="mt-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {t.projects.evidenceLabel}
            </p>
            <ul className="mt-3 space-y-1.5">
              {p.evidence.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground">
                  <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack */}
          <div className="mt-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
              {t.projects.stackLabel}
            </p>
            <p className="mt-2 font-mono text-xs text-foreground">
              {p.stack.join("  •  ")}
            </p>
          </div>

          {/* Links */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/projetos/$slug"
              params={{ slug: p.slug }}
              className="btn-outline inline-flex"
            >
              <span>{t.projects.caseStudy}</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            {p.repoUrl && p.repoUrl !== "#" && (
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <GithubIcon className="h-3.5 w-3.5" />
                {t.projects.repo}
              </a>
            )}
            {p.demoUrl && p.demoUrl !== "#" && (
              <a
                href={p.demoUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {t.projects.live}
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Projects() {
  const { t, lang } = useApp();
  const projects = getLocalizedProjectSummaries(lang);
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);

  const total = projects.length;
  const current = projects[index];
  const prevLabel = lang === "pt" ? "anterior" : "previous";
  const nextLabel = lang === "pt" ? "próximo" : "next";
  const goToLabel = (i: number) =>
    lang === "pt" ? `Ir para projeto ${i + 1}` : `Go to project ${i + 1}`;

  const go = (next: number) => {
    if (next < 0 || next > total - 1 || next === index) return;
    setDirection(next > index ? 1 : -1);
    setIndex(next);
  };
  const prev = () => go(index - 1);
  const next = () => go(index + 1);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const offset = info.offset.y;
    const velocity = info.velocity.y;
    if (offset < -60 || velocity < -500) next();
    else if (offset > 60 || velocity > 500) prev();
  };

  const ctaText =
    lang === "pt"
      ? "Ficou interessado em algum destes cases ou quer tirar alguma dúvida?"
      : "Interested in any of these cases or have a question?";
  const ctaLabel = lang === "pt" ? "Entrar em contato" : "Get in touch";

  const enterY = direction === 1 ? 40 : -40;
  const exitY = direction === 1 ? -40 : 40;

  return (
    <SectionShell id="projetos" number="02" label={t.projects.title} sublabel={t.projects.subtitle}>
      <div className="md:col-span-12">
        {/* Controles anterior/próximo */}
        <div className="flex items-center justify-between gap-4 pb-3">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            aria-label={prevLabel}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{prevLabel}</span>
          </button>
          <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={next}
            disabled={index === total - 1}
            aria-label={nextLabel}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <span>{nextLabel}</span>
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        {/* Card + paginação lateral */}
        <div className="relative border-t border-hairline">
          <div className="relative overflow-hidden pr-6 md:pr-10">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={current.slug}
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: enterY }}
                animate={reducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: exitY }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                drag={reducedMotion ? false : "y"}
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                className="touch-pan-y"
              >
                <ProjectRow p={current} eager={index === 0} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicador de paginação (bolinhas) — direita, centralizado */}
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden items-center md:flex">
            <ul className="pointer-events-auto flex flex-col gap-2.5">
              {projects.map((p, i) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={goToLabel(i)}
                    aria-current={i === index ? "true" : undefined}
                    className={`block h-1.5 w-1.5 rounded-full transition-all ${
                      i === index
                        ? "scale-125 bg-accent"
                        : "bg-hairline hover:bg-muted-foreground"
                    }`}
                  />
                </li>
              ))}
            </ul>
          </div>

          {/* Bolinhas mobile — centralizadas abaixo */}
          <div className="mt-4 flex items-center justify-center gap-2 md:hidden">
            {projects.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => go(i)}
                aria-label={goToLabel(i)}
                aria-current={i === index ? "true" : undefined}
                className={`block h-1.5 w-1.5 rounded-full transition-all ${
                  i === index
                    ? "scale-125 bg-accent"
                    : "bg-hairline hover:bg-muted-foreground"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <p className="prose-measure text-sm text-muted-foreground md:text-base">
            {ctaText}
          </p>
          <a href="#contato" className="btn-primary group !py-2.5 !text-[13px]">
            <span>{ctaLabel}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </SectionShell>
  );
}
