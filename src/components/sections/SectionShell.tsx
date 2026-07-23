import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export type SectionHeadingVariant = "split" | "editorial" | "rail" | "centered" | "sequence";

type Props = {
  id: string;
  /** Compatibilidade temporária durante a migração dos cabeçalhos. */
  number?: string;
  label: string;
  titleSegments?: string[];
  sublabel?: string;
  /** Optional descriptive lead below the title. */
  lead?: string;
  children: ReactNode;
  /** Replace the default header with custom markup. */
  headerSlot?: ReactNode;
  /** Semantic heading level without changing the visual style. */
  headingLevel?: 1 | 2;
  headerVariant?: SectionHeadingVariant;
  compact?: boolean;
};

type SectionHeadingProps = {
  id: string;
  label: string;
  titleSegments?: string[];
  sublabel?: string;
  lead?: string;
  headingLevel?: 1 | 2;
  variant?: SectionHeadingVariant;
  compact?: boolean;
};

export function SectionHeading({
  id,
  label,
  titleSegments,
  sublabel,
  lead,
  headingLevel = 2,
  variant = "split",
  compact = false,
}: SectionHeadingProps) {
  const kicker = sublabel?.replace(/^\/\/\s*/, "");
  const Heading = headingLevel === 1 ? "h1" : "h2";

  return (
    <motion.header
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
      className={compact ? "mb-8 md:mb-10" : "mb-10 md:mb-14"}
    >
      {variant === "rail" ? (
        <div className="grid gap-4 border-t border-hairline py-5 md:grid-cols-12 md:items-center md:gap-8 md:py-6">
          <div className="flex items-center gap-3 md:col-span-3">
            <span aria-hidden="true" className="h-px w-8 bg-accent" />
            {kicker ? (
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
                {kicker}
              </p>
            ) : null}
          </div>
          <Heading
            id={`${id}-heading`}
            tabIndex={-1}
            className="font-display text-2xl font-medium leading-[1.08] tracking-[-0.035em] text-foreground outline-none md:col-span-9 md:text-3xl lg:text-4xl"
          >
            {label}
          </Heading>
        </div>
      ) : variant === "centered" ? (
        <div className="mx-auto max-w-3xl text-center">
          {kicker ? (
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
              {kicker}
            </p>
          ) : null}
          <span
            aria-hidden="true"
            className="mx-auto mt-3 block h-0.5 w-10 rounded-full bg-[image:var(--gradient-brand)]"
          />
          <Heading
            id={`${id}-heading`}
            tabIndex={-1}
            className="mt-5 font-display text-2xl font-medium leading-[1.08] tracking-[-0.035em] text-foreground outline-none md:text-3xl lg:text-4xl"
          >
            {label}
          </Heading>
        </div>
      ) : variant === "editorial" ? (
        <div>
          {kicker ? (
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-0.5 w-8 bg-accent" />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
                {kicker}
              </p>
            </div>
          ) : null}
          <div className="mt-5 md:ml-[16.666667%]">
            <Heading
              id={`${id}-heading`}
              tabIndex={-1}
              className="max-w-3xl font-display text-2xl font-medium leading-[1.08] tracking-[-0.035em] text-foreground outline-none md:text-3xl lg:text-4xl"
            >
              {label}
            </Heading>
          </div>
        </div>
      ) : (
        <>
          {kicker ? (
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-0.5 w-8 rounded-full bg-[image:var(--gradient-brand)] md:w-12"
              />
              <p className="font-mono text-[11px] font-medium uppercase tracking-[0.24em] text-accent">
                {kicker}
              </p>
            </div>
          ) : null}

          <div
            className={`mt-5 grid gap-5 ${
              lead
                ? `md:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)] md:gap-10 ${
                    variant === "sequence" ? "md:items-center" : "md:items-end"
                  }`
                : ""
            }`}
          >
            <Heading
              id={`${id}-heading`}
              tabIndex={-1}
              className={`max-w-4xl font-display text-2xl font-medium leading-[1.08] tracking-[-0.035em] text-foreground outline-none md:text-3xl ${
                compact ? "lg:text-[2.125rem]" : "lg:text-4xl"
              } ${variant === "sequence" ? "text-center" : ""}`}
            >
              {variant === "sequence" && titleSegments && titleSegments.length > 0 ? (
                <>
                  <span className="sr-only">{label}</span>
                  <span
                    aria-hidden="true"
                    className="inline-flex w-full flex-wrap items-center justify-center gap-x-2.5 gap-y-2 md:gap-x-3.5"
                  >
                    {titleSegments.map((segment, index) => (
                      <span key={segment} className="contents">
                        {index > 0 ? (
                          <ArrowRight
                            className={`h-5 w-5 shrink-0 md:h-6 md:w-6 ${
                              index === titleSegments.length - 1
                                ? "text-accent"
                                : "text-muted-foreground"
                            }`}
                            strokeWidth={1.75}
                          />
                        ) : null}
                        <span
                          className={
                            index === titleSegments.length - 1
                              ? "text-gradient font-semibold"
                              : index === 1
                                ? "text-accent"
                                : "text-foreground"
                          }
                        >
                          {segment}
                        </span>
                      </span>
                    ))}
                  </span>
                </>
              ) : (
                label
              )}
            </Heading>
            {lead ? (
              <p
                className={`max-w-xl leading-relaxed text-muted-foreground md:border-l md:border-hairline md:pl-6 ${
                  compact ? "text-sm" : "text-base"
                }`}
              >
                {lead}
              </p>
            ) : null}
          </div>
        </>
      )}
    </motion.header>
  );
}

export function SectionShell({
  id,
  label,
  titleSegments,
  sublabel,
  lead,
  children,
  headerSlot,
  headingLevel = 2,
  headerVariant = "split",
  compact = false,
}: Props) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="relative">
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformOrigin: "left" }}
        className="h-px w-full bg-hairline"
        aria-hidden="true"
      />

      <div className={`section-container ${compact ? "py-10 md:py-12" : "py-14 md:py-24"}`}>
        {headerSlot ? (
          <motion.header
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className={compact ? "mb-8 md:mb-10" : "mb-10 md:mb-14"}
          >
            {headerSlot}
          </motion.header>
        ) : (
          <SectionHeading
            id={id}
            label={label}
            titleSegments={titleSegments}
            sublabel={sublabel}
            lead={lead}
            headingLevel={headingLevel}
            variant={headerVariant}
            compact={compact}
          />
        )}

        <div className="md:grid md:grid-cols-12 md:gap-8">{children}</div>
      </div>
    </section>
  );
}
