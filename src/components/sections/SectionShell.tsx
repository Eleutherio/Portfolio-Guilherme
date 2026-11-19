import type { ReactNode } from "react";
import { ViewportActivityProvider } from "@/components/ViewportActivity";
import { useElementActivity } from "@/hooks/use-element-activity";

type SectionHeadingVariant =
  | "split"
  | "editorial"
  | "centered"
  | "sequence"
  | "showcase"
  | "capabilities"
  | "capability-cards";

type Props = {
  id: string;
  label: string;
  /** Optional descriptive lead below the title. */
  lead?: ReactNode;
  /** Optional content aligned with the title and lead in the section header. */
  headerAside?: ReactNode;
  children: ReactNode;
  /** Semantic heading level mapped to the shared page or section title role. */
  headingLevel?: 1 | 2;
  headerVariant?: SectionHeadingVariant;
  headerSpacing?: "default" | "tight";
  compact?: boolean;
  hideHeading?: boolean;
};

type SectionHeadingProps = {
  id: string;
  label: string;
  lead?: ReactNode;
  aside?: ReactNode;
  headingLevel?: 1 | 2;
  variant?: SectionHeadingVariant;
  spacing?: "default" | "tight";
  compact?: boolean;
};

function SectionHeading({
  id,
  label,
  lead,
  aside,
  headingLevel = 2,
  variant = "split",
  spacing = "default",
  compact = false,
}: SectionHeadingProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const titleRoleClass = headingLevel === 1 ? "page-title" : "section-title";

  return (
    <header
      className={
        variant === "showcase" || variant === "capabilities"
          ? "mb-0"
          : spacing === "tight"
            ? "mb-[calc(var(--responsive-mobile-unit)*1.5)] md:mb-8"
            : compact
              ? "mb-[calc(var(--responsive-mobile-unit)*2)] md:mb-10"
              : "mb-[calc(var(--responsive-mobile-unit)*2.5)] md:mb-14"
      }
    >
      {variant === "capability-cards" ? (
        <div className="capabilities-card-header">
          <Heading id={`${id}-heading`} tabIndex={-1} className="capabilities-title outline-none">
            {label}
          </Heading>
          <span className="capabilities-rule" aria-hidden="true" />
          {lead ? <p className="capabilities-intro">{lead}</p> : null}
        </div>
      ) : variant === "capabilities" ? (
        <div className="capabilities-layout">
          <div className="capabilities-narrative">
            <Heading id={`${id}-heading`} tabIndex={-1} className="capabilities-title outline-none">
              {label}
            </Heading>
            <span className="capabilities-rule" aria-hidden="true" />
            {lead ? <p className="capabilities-intro">{lead}</p> : null}
          </div>
          {aside ? <div className="capabilities-content">{aside}</div> : null}
        </div>
      ) : variant === "showcase" ? (
        <div className={aside ? "section-editorial-layout" : undefined}>
          <div className="section-editorial-header">
            <Heading
              id={`${id}-heading`}
              tabIndex={-1}
              className="section-editorial-title section-editorial-title--wrap outline-none"
            >
              {label}
            </Heading>
            <span className="section-editorial-rule" aria-hidden="true" />
            {lead ? <p className="section-editorial-intro">{lead}</p> : null}
          </div>
          {aside ? <div className="min-w-0">{aside}</div> : null}
        </div>
      ) : variant === "centered" ? (
        <div className="mx-auto max-w-3xl text-center">
          <Heading
            id={`${id}-heading`}
            tabIndex={-1}
            className={`${titleRoleClass} text-foreground outline-none`}
          >
            {label}
          </Heading>
          <span
            aria-hidden="true"
            className="mx-auto mt-5 block h-0.5 w-10 rounded-full bg-[image:var(--gradient-brand)]"
          />
          {lead ? (
            <p className="section-intro mx-auto mt-5 max-w-2xl text-muted-foreground">{lead}</p>
          ) : null}
        </div>
      ) : variant === "editorial" ? (
        <div>
          <div className="md:ml-[16.666667%]">
            <Heading
              id={`${id}-heading`}
              tabIndex={-1}
              className={`${titleRoleClass} max-w-3xl text-foreground outline-none`}
            >
              {label}
            </Heading>
          </div>
        </div>
      ) : (
        <>
          <div
            className={`grid gap-4 ${
              aside
                ? "md:grid-cols-[minmax(0,0.65fr)_minmax(0,0.8fr)_minmax(15rem,0.55fr)] md:items-start md:gap-8"
                : lead
                  ? `${
                      variant === "sequence"
                        ? "md:grid-cols-[minmax(0,1.1fr)_minmax(22rem,0.9fr)] md:gap-8"
                        : "md:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)] md:gap-10"
                    } ${variant === "sequence" ? "md:items-center" : "md:items-end"}`
                  : ""
            }`}
          >
            <Heading
              id={`${id}-heading`}
              tabIndex={-1}
              className={`${titleRoleClass} max-w-4xl text-foreground outline-none`}
            >
              {label}
            </Heading>
            {lead ? (
              <p
                data-section-lead
                className="section-intro max-w-xl text-muted-foreground md:border-l md:border-hairline md:pl-6"
              >
                {lead}
              </p>
            ) : null}
            {aside ? <div className="min-w-0">{aside}</div> : null}
          </div>
        </>
      )}
    </header>
  );
}

export function SectionShell({
  id,
  label,
  lead,
  headerAside,
  children,
  headingLevel = 2,
  headerVariant = "split",
  headerSpacing = "default",
  compact = false,
  hideHeading = false,
}: Props) {
  const { ref, active } = useElementActivity<HTMLElement>();
  const HiddenHeading = headingLevel === 1 ? "h1" : "h2";

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={`${id}-heading`}
      data-runtime-activity={active ? "active" : "paused"}
      className="relative"
    >
      <ViewportActivityProvider active={active}>
        <div
          style={{ transformOrigin: "left" }}
          className="section-rule-reveal h-px w-full bg-hairline"
          aria-hidden="true"
        />

        <div
          className={`section-container section-start-spacing ${
            compact
              ? "pb-[calc(var(--responsive-mobile-unit)*2)] md:pb-12"
              : "pb-[calc(var(--responsive-mobile-unit)*2.5)] md:pb-24"
          }`}
        >
          {hideHeading ? (
            <HiddenHeading id={`${id}-heading`} tabIndex={-1} className="sr-only">
              {label}
            </HiddenHeading>
          ) : (
            <SectionHeading
              id={id}
              label={label}
              lead={lead}
              aside={headerAside}
              headingLevel={headingLevel}
              variant={headerVariant}
              spacing={headerSpacing}
              compact={compact}
            />
          )}

          <div className="md:grid md:grid-cols-12 md:gap-8">{children}</div>
        </div>
      </ViewportActivityProvider>
    </section>
  );
}
