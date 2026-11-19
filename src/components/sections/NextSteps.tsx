import { motion } from "@/lib/motion";
import { ArrowUpRight } from "lucide-react";

import { useApp } from "@/i18n/AppContext";

export function NextSteps() {
  const { t } = useApp();
  const cursorDestinationFor = (href: string) => {
    if (href.includes("#projetos")) return t.cursor.destinations.projects;
    if (href.includes("#contato")) return t.cursor.destinations.contact;
    return t.cursor.destinations.home;
  };

  return (
    <section aria-label={t.nextSteps.title} className="relative border-t border-hairline">
      <div className="section-container py-16 md:py-24">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:items-end md:gap-10">
          <div className="md:col-span-5">
            <h2 className="section-title text-foreground">{t.nextSteps.title}</h2>
            <p className="section-intro mt-4 max-w-md text-muted-foreground">
              {t.nextSteps.subtitle}
            </p>
          </div>

          <ul className="md:col-span-7 md:pl-4">
            {t.nextSteps.items.map((item, i) => {
              const content = (
                <div className="flex items-center justify-between gap-4 border-t border-hairline py-5 transition-colors last:border-b hover:border-accent/60">
                  <div className="min-w-0">
                    <p className="meta-text text-muted-foreground">
                      {String(i + 1).padStart(2, "0")} · {item.meta}
                    </p>
                    <p className="content-title mt-1.5 text-foreground group-hover:text-accent">
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
                  <a
                    href={item.href}
                    data-cursor-open={cursorDestinationFor(item.href)}
                    className="group block"
                  >
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
