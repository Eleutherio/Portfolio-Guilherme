import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "@/lib/motion";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { CaseContactPrompt } from "@/components/project-case/CaseContactPrompt";
import { CaseNextSteps } from "@/components/project-case/CaseNextSteps";
import { TechnologyBadge } from "@/components/TechnologyBadge";
import { GRENGAME_DEMO_URL, grengameCaseMedia } from "@/content/grengame-case-study";
import type { LocalizedProjectCase } from "@/content/project-case-details";
import type { LocalizedProjectSummary } from "@/content/project-summaries";
import type { Dict } from "@/i18n/dictionary";

type GrengameCaseStudyProps = {
  data: LocalizedProjectCase;
  prev: LocalizedProjectSummary | null;
  next: LocalizedProjectSummary | null;
  t: Dict;
};

type CaseSectionLink = {
  id: string;
  label: string;
  cursorOpen: string;
};

const trackedSectionIds = [
  "grengame-overview",
  "grengame-context",
  "grengame-problem",
  "grengame-process",
  "grengame-outcomes",
] as const;

export function GrengameCaseStudy({ data, prev, next, t }: GrengameCaseStudyProps) {
  const reducedMotion = useReducedMotion();
  const copy = t.caseStudy.grengame;
  const [activeSection, setActiveSection] =
    useState<(typeof trackedSectionIds)[number]>("grengame-overview");
  const navigation: CaseSectionLink[] = [
    {
      id: "grengame-overview",
      label: copy.navigation.overview,
      cursorOpen: `${t.cursor.destinations.section} ${copy.navigation.overview}`,
    },
    {
      id: "grengame-context",
      label: copy.navigation.context,
      cursorOpen: `${t.cursor.destinations.section} ${copy.navigation.context}`,
    },
    {
      id: "grengame-problem",
      label: copy.navigation.problem,
      cursorOpen: `${t.cursor.destinations.section} ${copy.navigation.problem}`,
    },
    {
      id: "grengame-process",
      label: copy.navigation.process,
      cursorOpen: `${t.cursor.destinations.section} ${copy.navigation.process}`,
    },
    {
      id: "grengame-outcomes",
      label: copy.navigation.outcomes,
      cursorOpen: `${t.cursor.destinations.section} ${copy.navigation.outcomes}`,
    },
  ];

  useEffect(() => {
    const sections = trackedSectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection) {
          setActiveSection(visibleSection.target.id as (typeof trackedSectionIds)[number]);
        }
      },
      { rootMargin: "-24% 0px -58% 0px", threshold: [0, 0.15, 0.4] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <article className="case-study case-study--grengame bg-background">
      <DesktopCaseIndex
        sections={navigation}
        label={copy.navigationLabel}
        activeSection={activeSection}
      />

      <section
        id="grengame-overview"
        className="scroll-mt-[calc(var(--site-header-height)+2rem)] border-b border-hairline"
      >
        <div className="section-container py-10 md:py-14">
          <div className="xl:ml-[150px] xl:max-w-[930px]">
            <Link
              to="/"
              hash="projetos"
              data-cursor-open={t.cursor.destinations.projects}
              className="ui-control-text inline-flex min-h-11 items-center gap-2 text-muted-foreground transition-colors hover:text-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              {t.caseStudy.back}
            </Link>

            <div className="pb-12 pt-12 md:pb-16 md:pt-20">
              <p className="meta-text text-accent">
                {data.id} · {data.category}
              </p>
              <motion.h1
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: reducedMotion ? 0 : 0.65 }}
                className="heading-display mt-5 max-w-4xl text-foreground"
              >
                {data.title}
              </motion.h1>
              <p className="section-intro mt-4 max-w-3xl text-muted-foreground">
                {data.cardSummary}
              </p>
            </div>

            <motion.figure
              initial={reducedMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.08 }}
              className="aspect-[16/9] overflow-hidden rounded-md border border-hairline bg-surface"
            >
              <img
                src={data.coverSrc}
                alt={data.coverAlt}
                width={1600}
                height={900}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="h-full w-full object-cover object-center"
              />
            </motion.figure>

            <dl className="grid border-b border-hairline sm:grid-cols-2 md:grid-cols-12">
              <CaseMeta className="border-b border-hairline py-6 sm:border-r md:col-span-3 md:border-b-0 md:pr-6">
                <dt>{t.projects.typeLabel}</dt>
                <dd>{data.projectType}</dd>
              </CaseMeta>

              <CaseMeta className="border-b border-hairline py-6 sm:pl-6 md:col-span-5 md:border-b-0 md:border-r md:border-hairline md:px-6">
                <dt>{t.caseStudy.stackLabel}</dt>
                <dd>
                  <ul className="flex flex-wrap gap-1.5">
                    {data.stack.map((technology) => (
                      <li key={technology}>
                        <TechnologyBadge label={technology} />
                      </li>
                    ))}
                  </ul>
                </dd>
              </CaseMeta>

              <CaseMeta className="py-6 sm:col-span-2 md:col-span-4 md:pl-6">
                <dt>{t.projects.evidenceLabel}</dt>
                <dd>
                  <ul className="space-y-1.5">
                    {data.evidence.map((evidence) => (
                      <li key={evidence} className="flex items-start gap-2">
                        <span
                          aria-hidden="true"
                          className="mt-[0.7em] h-px w-3 shrink-0 bg-accent"
                        />
                        <span>{evidence}</span>
                      </li>
                    ))}
                  </ul>
                </dd>
              </CaseMeta>
            </dl>

            <a
              href={GRENGAME_DEMO_URL}
              data-cursor-open={`${t.cursor.destinations.project} ${data.title}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 flex min-h-28 items-center justify-between gap-6 rounded-md bg-accent px-6 py-6 text-accent-foreground transition-colors hover:bg-accent/90 md:mt-10 md:px-8"
            >
              <span>
                <span className="meta-text block opacity-80">{copy.directMeta}</span>
                <span className="content-title mt-2 block">{copy.directCta}</span>
              </span>
              <ExternalLink
                className="h-6 w-6 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>
      </section>

      <MobileCaseIndex
        sections={navigation}
        label={copy.navigationLabel}
        activeSection={activeSection}
      />

      <div className="border-b border-hairline">
        <div className="section-container">
          <div className="xl:ml-[150px] xl:max-w-[930px]">
            <EditorialSection id="grengame-context" title={t.caseStudy.contextTitle}>
              <div className="grid gap-10 md:grid-cols-2 md:gap-14">
                <ProseBlock label={t.caseStudy.contextAudience}>{data.context.audience}</ProseBlock>
                <ProseBlock label={t.caseStudy.contextImportance}>
                  {data.context.importance}
                </ProseBlock>
              </div>
            </EditorialSection>

            <EditorialSection id="grengame-problem" title={copy.problemTitle}>
              <p className="section-intro max-w-4xl border-l-2 border-accent py-2 pl-6 text-foreground md:pl-8">
                {data.context.problem}
              </p>
            </EditorialSection>

            <EditorialSection id="grengame-solution" title={t.caseStudy.solutionTitle}>
              <p className="section-intro max-w-3xl text-foreground">{data.solution.product}</p>

              <div className="mt-12 grid border-y border-hairline md:grid-cols-2">
                <InsightBlock label={t.caseStudy.solutionTechnical} className="md:border-r">
                  {data.solution.technical}
                </InsightBlock>
                <InsightBlock label={t.caseStudy.solutionArchitecture}>
                  {data.solution.architecture}
                </InsightBlock>
              </div>
            </EditorialSection>

            <EditorialSection id="grengame-process" title={t.caseStudy.executionTitle}>
              <ProcessRow number="01" label={t.caseStudy.executionChallenges}>
                {data.execution.challenges}
              </ProcessRow>
              <ProcessRow number="02" label={t.caseStudy.executionTradeoffs}>
                {data.execution.tradeoffs}
              </ProcessRow>
              <ProcessRow number="03" label={t.caseStudy.executionHindsight} last>
                {data.execution.hindsight}
              </ProcessRow>
            </EditorialSection>

            <EditorialSection id="grengame-documentation" title={copy.documentationTitle}>
              <div
                className="grid border-l border-t border-hairline md:grid-cols-2"
                role="group"
                aria-label={copy.documentationLabel}
              >
                <DocumentationFigure
                  number="01"
                  media={grengameCaseMedia.classroom}
                  alt={copy.media.classroom.alt}
                  caption={copy.media.classroom.caption}
                  fit="cover"
                />
                <DocumentationFigure
                  number="02"
                  media={grengameCaseMedia.passwordReset}
                  alt={copy.media.passwordReset.alt}
                  caption={copy.media.passwordReset.caption}
                  fit="cover"
                />
                <DocumentationFigure
                  number="03"
                  media={grengameCaseMedia.navigation}
                  alt={copy.media.navigation.alt}
                  caption={copy.media.navigation.caption}
                  fit="contain"
                />
                <DocumentationFigure
                  number="04"
                  media={grengameCaseMedia.presentation}
                  alt={copy.media.presentation.alt}
                  caption={copy.media.presentation.caption}
                  fit="contain"
                />
              </div>
            </EditorialSection>

            <EditorialSection id="grengame-outcomes" title={t.caseStudy.resultTitle}>
              <p className="section-intro max-w-4xl border-l-2 border-accent py-2 pl-6 text-foreground md:pl-8">
                {data.result.impact}
              </p>

              <div className="mt-12 border-y border-hairline py-8 md:ml-auto md:max-w-2xl md:py-10">
                <p className="meta-text text-accent">{t.caseStudy.resultGains}</p>
                <p className="body-copy mt-4 text-foreground">{data.result.gains}</p>
              </div>
            </EditorialSection>

            <EditorialSection id="grengame-closing" title={t.caseStudy.closingTitle} last>
              <div className="grid gap-4 md:grid-cols-12 md:gap-10">
                <p className="meta-text text-accent md:col-span-3">
                  {t.caseStudy.closingNextSteps}
                </p>
                <p className="body-copy text-foreground md:col-span-9">{data.closing.nextSteps}</p>
              </div>
            </EditorialSection>
          </div>
        </div>
      </div>

      <CaseContactPrompt t={t} />
      <CaseNextSteps prev={prev} next={next} t={t} />
    </article>
  );
}

function CaseMeta({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={`case-meta ${className ?? ""}`}>{children}</div>;
}

function DesktopCaseIndex({
  sections,
  label,
  activeSection,
}: {
  sections: CaseSectionLink[];
  label: string;
  activeSection: string;
}) {
  return (
    <nav
      aria-label={label}
      className="fixed left-8 top-1/2 z-20 hidden w-44 -translate-y-1/2 xl:block"
    >
      <ol className="space-y-4">
        {sections.map((section) => {
          const active = activeSection === section.id;

          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                data-cursor-open={section.cursorOpen}
                aria-current={active ? "location" : undefined}
                className={`ui-control-text touch-target group flex min-h-8 items-center gap-3 transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-px shrink-0 bg-accent transition-[width] ${active ? "w-5" : "w-0 group-hover:w-3"}`}
                />
                <span>{section.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function MobileCaseIndex({
  sections,
  label,
  activeSection,
}: {
  sections: CaseSectionLink[];
  label: string;
  activeSection: string;
}) {
  return (
    <nav
      aria-label={label}
      className="sticky top-[var(--site-header-height)] z-20 border-b border-hairline bg-background/95 backdrop-blur-sm xl:hidden"
    >
      <ol className="section-container flex snap-x gap-7 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const active = activeSection === section.id;

          return (
            <li key={section.id} className="shrink-0 snap-start">
              <a
                href={`#${section.id}`}
                data-cursor-open={section.cursorOpen}
                aria-current={active ? "location" : undefined}
                className={`ui-control-text flex min-h-11 items-center gap-2 border-b transition-colors ${
                  active
                    ? "border-accent text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {section.label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function EditorialSection({
  id,
  title,
  children,
  last = false,
}: {
  id: string;
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scroll-mt-[calc(var(--site-header-height)+4rem)] py-20 md:py-28 ${last ? "" : "border-b border-hairline"}`}
    >
      <header className="mb-12 md:mb-16">
        <h2 className="section-title case-study-editorial-heading min-w-0 text-foreground">
          {title}
        </h2>
      </header>
      {children}
    </section>
  );
}

function ProseBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="meta-text text-accent">{label}</p>
      <p className="body-copy mt-4 text-foreground">{children}</p>
    </div>
  );
}

function InsightBlock({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-hairline py-8 md:px-8 md:py-10 ${className ?? ""}`}>
      <p className="meta-text text-accent">{label}</p>
      <p className="body-copy mt-4 text-foreground">{children}</p>
    </div>
  );
}

function ProcessRow({
  number,
  label,
  children,
  last = false,
}: {
  number: string;
  label: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={`grid gap-5 py-9 md:grid-cols-12 md:gap-10 md:py-11 ${last ? "" : "border-b border-hairline"}`}
    >
      <div className="md:col-span-4">
        <p className="meta-text text-muted-foreground">{number}</p>
        <h3 className="content-title mt-3 text-foreground">{label}</h3>
      </div>
      <p className="body-copy text-foreground md:col-span-8">{children}</p>
    </div>
  );
}

function DocumentationFigure({
  number,
  media,
  alt,
  caption,
  fit,
}: {
  number: string;
  media: { src: string; width: number; height: number };
  alt: string;
  caption: string;
  fit: "cover" | "contain";
}) {
  return (
    <figure className="border-b border-r border-hairline p-4 md:p-5">
      <div className="aspect-[4/3] overflow-hidden bg-surface-2">
        <img
          src={media.src}
          alt={alt}
          width={media.width}
          height={media.height}
          loading="lazy"
          decoding="async"
          className={`h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        />
      </div>
      <figcaption className="flex min-h-24 gap-4 pt-5">
        <span className="meta-text text-accent">{number}</span>
        <span className="meta-text text-foreground">{caption}</span>
      </figcaption>
    </figure>
  );
}
