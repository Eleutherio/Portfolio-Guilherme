import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

import { useApp } from "@/i18n/AppContext";

export function NextSteps() {
  const { t } = useApp();

  return (
    <section aria-label={t.nextSteps.title} className="relative border-t border-hairline">
      <div className="section-container py-16 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
              {t.nextSteps.kicker}
            </p>
            <h2 className="mt-2 font-display text-2xl font-medium leading-[1.05] tracking-[-0.03em] text-foreground md:text-3xl lg:text-4xl">
              {t.nextSteps.title}
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
              {t.nextSteps.subtitle}
            </p>
          </div>

          <ul className="md:col-span-7 md:pl-4">
            {t.nextSteps.items.map((item, i) => {
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
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-5 w-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
                  />
                </div>
              );
              return (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <a href={item.href} className="group block">
                    {content}
                  </a>
                </motion.li>

              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
