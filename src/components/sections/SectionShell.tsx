import { motion } from "motion/react";
import type { ReactNode } from "react";

type Props = {
  id: string;
  /** two-digit section index, e.g. "01" — rendered as timecode 00:01 */
  number: string;
  label: string;
  sublabel?: string;
  /** Optional descriptive lead below the title. */
  lead?: string;
  children: ReactNode;
  /** Replace the default header with custom markup. */
  headerSlot?: ReactNode;
};

export function SectionShell({ id, number, label, sublabel, lead, children, headerSlot }: Props) {
  const kicker = sublabel?.replace(/^\/\/\s*/, "");

  return (
    <section id={id} className="relative">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformOrigin: "left" }}
        className="h-px w-full bg-hairline"
        aria-hidden="true"
      />

      <div className="section-container py-16 md:py-24">
        {headerSlot ? (
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="mb-10 md:mb-14"
          >
            {headerSlot}
          </motion.header>
        ) : (
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
          >
            <p className="section-number font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              00:{number}
              {kicker ? <span className="text-muted-foreground"> · {kicker}</span> : null}
            </p>
            <h2 className="mt-3 font-display text-2xl font-medium leading-[1.05] tracking-[-0.035em] text-foreground md:text-3xl lg:text-4xl">
              {label}
            </h2>
            {lead ? (
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {lead}
              </p>
            ) : null}
          </motion.header>
        )}

        <div className="md:grid md:grid-cols-12 md:gap-8">{children}</div>
      </div>
    </section>
  );
}

