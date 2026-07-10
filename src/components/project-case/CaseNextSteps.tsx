import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, ArrowUpRight, FolderOpen, Home } from "lucide-react";

import type { LocalizedProjectSummary } from "@/content/project-summaries";
import type { Dict } from "@/i18n/dictionary";

type CaseNextStepsProps = {
  prev: LocalizedProjectSummary | null;
  next: LocalizedProjectSummary | null;
  t: Dict;
};

type StepItem = {
  icon: React.ReactNode;
  meta: string;
  label: string;
  to: string;
  params?: { slug: string };
  hash?: string;
};

export function CaseNextSteps({ prev, next, t }: CaseNextStepsProps) {
  const steps: StepItem[] = [
    {
      icon: <ArrowLeft className="h-5 w-5 shrink-0" aria-hidden="true" />,
      meta: prev ? t.caseStudy.nextSteps.metaPrev : t.caseStudy.nextSteps.metaHome,
      label: prev ? prev.title : t.caseStudy.nextSteps.home,
      to: prev ? "/projetos/$slug" : "/",
      params: prev ? { slug: prev.slug } : undefined,
    },
    {
      icon: <ArrowUpRight className="h-5 w-5 shrink-0" aria-hidden="true" />,
      meta: next ? t.caseStudy.nextSteps.metaNext : t.caseStudy.nextSteps.metaHome,
      label: next ? next.title : t.caseStudy.nextSteps.home,
      to: next ? "/projetos/$slug" : "/",
      params: next ? { slug: next.slug } : undefined,
    },
    {
      icon: <FolderOpen className="h-5 w-5 shrink-0" aria-hidden="true" />,
      meta: t.caseStudy.nextSteps.metaAll,
      label: t.caseStudy.nextSteps.all,
      to: "/",
      hash: "projetos",
    },
  ];

  return (
    <section aria-label={t.caseStudy.nextSteps.title} className="relative border-t border-hairline">
      <div className="section-container py-14 md:py-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {t.caseStudy.nextSteps.kicker}
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground md:text-3xl lg:text-4xl">
              {t.caseStudy.nextSteps.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {t.caseStudy.nextSteps.subtitle}
            </p>
          </div>

          <ul className="md:col-span-7 md:pl-4">
            {steps.map((item, i) => {
              const content = (
                <div className="flex items-center justify-between gap-4 border-t border-hairline py-5 transition-colors last:border-b hover:border-accent/60">
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · {item.meta}
                    </p>
                    <p className="mt-1.5 font-display text-lg font-medium tracking-[-0.01em] text-foreground group-hover:text-accent md:text-xl">
                      {item.label}
                    </p>
                  </div>
                  <span className="text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent">
                    {item.icon}
                  </span>
                </div>
              );

              return (
                <motion.li
                  key={`${item.label}-${i}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link
                    to={item.to}
                    params={item.params}
                    hash={item.hash}
                    className="group block"
                  >
                    {content}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
