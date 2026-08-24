import { motion } from "motion/react";
import type { ReactNode } from "react";
import { ViewportActivityProvider } from "@/components/ViewportActivity";
import { useElementActivity } from "@/hooks/use-element-activity";

type SectionHeadingVariant = "split" | "editorial" | "centered" | "sequence";

type Props = {
  id: string;
  label: string;
  sublabel?: string;
  /** Optional descriptive lead below the title. */
  lead?: string;
  children: ReactNode;
  /** Semantic heading level without changing the visual style. */
  headingLevel?: 1 | 2;
  headerVariant?: SectionHeadingVariant;
  headerSpacing?: "default" | "tight";
  compact?: boolean;
};

type SectionHeadingProps = {
  id: string;
  label: string;
  sublabel?: string;
  lead?: string;
  headingLevel?: 1 | 2;
  variant?: SectionHeadingVariant;
  spacing?: "default" | "tight";
  compact?: boolean;
};

function SectionHeading({
  id,
  label,
  sublabel,
  lead,
  headingLevel = 2,
  variant = "split",
  spacing = "default",
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
      className={
        spacing === "tight" ? "mb-6 md:mb-8" : compact ? "mb-8 md:mb-10" : "mb-10 md:mb-14"
      }
    >
      {variant === "centered" ? (
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
            className="section-title mt-5 text-foreground outline-none"
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
              className="section-title max-w-3xl text-foreground outline-none"
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
              className={`section-title max-w-4xl text-foreground outline-none ${
                variant === "sequence" ? "text-center" : ""
              }`}
            >
              {label}
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
  sublabel,
  lead,
  children,
  headingLevel = 2,
  headerVariant = "split",
  headerSpacing = "default",
  compact = false,
}: Props) {
  const { ref, active } = useElementActivity<HTMLElement>();

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      data-runtime-activity={active ? "active" : "paused"}
      className="relative"
    >
      <ViewportActivityProvider active={active}>
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
          <SectionHeading
            id={id}
            label={label}
            sublabel={sublabel}
            lead={lead}
            headingLevel={headingLevel}
            variant={headerVariant}
            spacing={headerSpacing}
            compact={compact}
          />

          <div className="md:grid md:grid-cols-12 md:gap-8">{children}</div>
        </div>
      </ViewportActivityProvider>
    </section>
  );
}
