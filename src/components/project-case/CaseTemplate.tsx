import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useApp } from "@/i18n/AppContext";
import {
  getLocalizedProjectCaseBySlug,
  type LocalizedProjectCase,
} from "@/content/project-case-details";
import { getLocalizedProjectSummaries } from "@/content/project-summaries";
import { GithubIcon } from "@/components/icons/Brand";
import { TechnologyBadge } from "@/components/TechnologyBadge";
import { CaseNextSteps } from "@/components/project-case/CaseNextSteps";
import { CaseContactPrompt } from "@/components/project-case/CaseContactPrompt";
import { Route } from "@/routes/projetos.$slug";

export function CaseTemplate() {
  const { t, lang } = useApp();
  const { slug } = Route.useParams();
  const data = getLocalizedProjectCaseBySlug(slug, lang);
  if (!data) return null;

  const allProjects = getLocalizedProjectSummaries(lang);
  const idx = allProjects.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? allProjects[idx - 1] : null;
  const next = idx < allProjects.length - 1 ? allProjects[idx + 1] : null;

  return (
    <article className="case-study">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-hairline">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-70 blur-3xl"
          style={{ background: "var(--gradient-brand-soft)" }}
        />
        <div className="section-container pt-10 md:pt-14">
          <Link
            to="/"
            hash="projetos"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            {t.caseStudy.back}
          </Link>
        </div>

        <div className="section-container grid grid-cols-1 gap-8 pb-14 pt-8 md:grid-cols-12 md:gap-8 md:pb-24 md:pt-16">
          <div className="md:col-span-7">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">
              {data.id} · {data.category}
            </p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mt-5 font-display text-3xl font-semibold leading-[1.05] tracking-[-0.03em] text-foreground sm:text-4xl md:text-6xl"
            >
              {data.title}
            </motion.h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              {data.cardSummary}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {data.demoUrl && data.demoUrl !== "#" && (
                <a
                  href={data.demoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-primary group w-full sm:w-auto"
                >
                  <ExternalLink className="h-4 w-4" />
                  {t.projects.demo}
                </a>
              )}
              {data.repoUrl && data.repoUrl !== "#" && (
                <a
                  href={data.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="btn-outline group w-full sm:w-auto"
                >
                  <GithubIcon className="h-4 w-4" />
                  {t.projects.repo}
                </a>
              )}
            </div>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <dl className="card-surface card-surface--accent space-y-6 p-6 md:p-7">
              <Meta label={t.caseStudy.stackLabel}>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {data.stack.map((technology) => (
                    <li key={technology}>
                      <TechnologyBadge label={technology} />
                    </li>
                  ))}
                </ul>
              </Meta>
            </dl>
          </aside>
        </div>

        <div className="section-container pb-16 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="card-surface aspect-[16/10]"
          >
            <img
              src={data.coverSrc}
              alt={data.coverAlt}
              width={1600}
              height={1000}
              loading="lazy"
              decoding="async"
              className={`h-full w-full object-cover ${data.imageFocus ?? "object-center"} ${slug === "grengame" ? "max-md:scale-[1.35]" : ""}`}
            />
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <CaseBlock number="01" title={t.caseStudy.contextTitle}>
        <CaseItem label={t.caseStudy.contextProblem}>{data.context.problem}</CaseItem>
        <CaseItem label={t.caseStudy.contextAudience}>{data.context.audience}</CaseItem>
        <CaseItem label={t.caseStudy.contextImportance}>{data.context.importance}</CaseItem>
      </CaseBlock>

      <CaseBlock number="02" title={t.caseStudy.solutionTitle}>
        <CaseItem label={t.caseStudy.solutionProduct}>{data.solution.product}</CaseItem>
        <CaseItem label={t.caseStudy.solutionTechnical}>{data.solution.technical}</CaseItem>
        <CaseItem label={t.caseStudy.solutionArchitecture}>{data.solution.architecture}</CaseItem>
      </CaseBlock>

      <CaseBlock number="03" title={t.caseStudy.executionTitle}>
        <CaseItem label={t.caseStudy.executionChallenges}>{data.execution.challenges}</CaseItem>
        <CaseItem label={t.caseStudy.executionTradeoffs}>{data.execution.tradeoffs}</CaseItem>
        <CaseItem label={t.caseStudy.executionHindsight}>{data.execution.hindsight}</CaseItem>
      </CaseBlock>

      <CaseBlock number="04" title={t.caseStudy.resultTitle}>
        <CaseItem label={t.caseStudy.resultImpact}>{data.result.impact}</CaseItem>
        <CaseItem label={t.caseStudy.resultGains}>{data.result.gains}</CaseItem>
      </CaseBlock>

      <CaseBlock number="05" title={t.caseStudy.closingTitle}>
        <CaseItem label={t.caseStudy.closingNextSteps}>{data.closing.nextSteps}</CaseItem>
      </CaseBlock>

      {/* Contact prompt */}
      <CaseContactPrompt t={t} />

      {/* Next steps */}
      <CaseNextSteps prev={prev} next={next} t={t} />
    </article>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-foreground">{children}</dd>
    </div>
  );
}

function CaseBlock({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-hairline">
      <div className="section-container grid grid-cols-1 gap-8 py-12 md:grid-cols-12 md:gap-8 md:py-24">
        <div className="md:col-span-3">
          <p className="section-number text-gradient text-4xl md:text-5xl">{number}</p>
          <h2 className="mt-4 font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="space-y-10 md:col-span-8 md:col-start-5">{children}</div>
      </div>
    </section>
  );
}

function CaseItem({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 text-base leading-relaxed text-foreground sm:text-lg">{children}</p>
    </div>
  );
}
