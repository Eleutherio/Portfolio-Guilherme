import { createFileRoute } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/i18n/AppContext";

const TITLE = "Acessibilidade — Guilherme Ferreira Eleutherio";
const DESCRIPTION =
  "Status e escopo da avaliação de acessibilidade WCAG 2.2 AA do portfólio de Guilherme Ferreira.";
const LAST_UPDATED = "2026-07-20";

export const Route = createFileRoute("/acessibilidade")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/acessibilidade" }],
  }),
  component: AccessibilityPage,
});

function AccessibilityPage() {
  const { t, lang } = useApp();
  const content = t.accessibility;
  const formattedDate = new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en-US", {
    dateStyle: "long",
    timeZone: "UTC",
  }).format(new Date(`${LAST_UPDATED}T00:00:00Z`));

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <div className="h-[64px] shrink-0" aria-hidden="true" />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <section aria-labelledby="accessibility-heading" className="border-b border-hairline">
          <div className="section-container py-14 md:py-24">
            <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
              {content.kicker}
            </p>
            <h1
              id="accessibility-heading"
              className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-5xl"
            >
              {content.title}
            </h1>
            <div className="mt-7 inline-flex items-center gap-2 rounded-md border border-[var(--control-border)] bg-surface px-3 py-2 font-mono text-xs text-foreground">
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
              <span>
                <span className="sr-only">{content.statusLabel}: </span>
                {content.status}
              </span>
            </div>
            <p className="mt-7 max-w-3xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {content.intro}
            </p>
          </div>
        </section>

        <div className="section-container grid grid-cols-1 gap-10 py-14 md:grid-cols-2 md:gap-12 md:py-20">
          <InfoSection title={content.commitmentTitle}>
            <p>{content.commitmentBody}</p>
          </InfoSection>

          <InfoSection title={content.scopeTitle}>
            <AccessibleList items={content.scopeItems} />
          </InfoSection>

          <InfoSection title={content.methodsTitle}>
            <AccessibleList items={content.methodsItems} />
          </InfoSection>

          <InfoSection title={content.limitationsTitle}>
            <p>{content.limitationsBody}</p>
          </InfoSection>

          <section aria-labelledby="accessibility-feedback" className="md:col-span-2">
            <div className="card-surface card-surface--accent p-6 md:p-8">
              <h2
                id="accessibility-feedback"
                className="font-display text-2xl font-medium tracking-[-0.025em] text-foreground"
              >
                {content.feedbackTitle}
              </h2>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">
                {content.feedbackBody}
              </p>
              <a
                href="mailto:contato@guifer.tech?subject=Acessibilidade%20do%20guifer.tech"
                className="btn-outline mt-6 w-full sm:w-auto"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                <span>{content.feedbackCta}</span>
              </a>
            </div>
          </section>

          <p className="font-mono text-xs text-muted-foreground md:col-span-2">
            {content.updatedLabel}: <time dateTime={LAST_UPDATED}>{formattedDate}</time>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline pt-6">
      <h2 className="font-display text-xl font-medium tracking-[-0.025em] text-foreground">
        {title}
      </h2>
      <div className="mt-4 leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

function AccessibleList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3">
          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
