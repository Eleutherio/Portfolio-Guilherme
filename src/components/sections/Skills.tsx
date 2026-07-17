import { Fragment } from "react";
import { motion } from "motion/react";
import { RefreshCw, ShieldCheck, Target, Users, type LucideIcon } from "lucide-react";
import { useApp } from "@/i18n/AppContext";
import { SectionShell } from "./SectionShell";
import { ProcessIllustration } from "./process/ProcessIllustration";
import { ProcessConnector } from "./process/ProcessConnector";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  users: Users,
  target: Target,
  shield: ShieldCheck,
  refresh: RefreshCw,
};

const STEP_VARIANTS = ["discovery", "build", "delivery"] as const;

export function Skills() {
  const { t } = useApp();
  const { steps, pillars, title, subtitle, lead } = t.skills;

  return (
    <SectionShell id="processo" number="04" label={title} sublabel={subtitle} lead={lead}>
      <div className="md:col-span-12">
        {/* Grid de etapas com conectores */}
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1fr_auto_1fr_auto_1fr] md:gap-4">
          {steps.map((step, i) => (
            <Fragment key={step.title}>
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                className="flex flex-col items-center text-center"
              >
                <ProcessIllustration variant={STEP_VARIANTS[i] ?? "discovery"} />

                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {step.kicker}
                </p>
                <h3 className="mt-2 font-display text-xl font-medium leading-snug tracking-[-0.01em] text-foreground md:text-2xl">
                  {step.title}
                </h3>
                <p className="prose-measure mt-3 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
                <ul className="mt-5 flex flex-wrap justify-center gap-1.5">
                  {step.tags.map((tag) => (
                    <li key={tag} className="chip">
                      {tag}
                    </li>
                  ))}
                </ul>
              </motion.article>
              {i < steps.length - 1 && (
                <div className="hidden self-center px-2 md:block" aria-hidden="true">
                  <ProcessConnector />
                </div>
              )}
            </Fragment>
          ))}
        </div>

        {/* Rodapé de pilares */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
          className="card-surface mt-14 grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:mt-20 md:p-8 lg:grid-cols-4"
        >
          {pillars.map((pillar) => {
            const Icon = PILLAR_ICONS[pillar.icon] ?? Users;
            return (
              <div key={pillar.title} className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
                  <Icon className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="font-display text-sm font-medium text-foreground">{pillar.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </SectionShell>
  );
}
