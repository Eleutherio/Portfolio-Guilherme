import { HeadContent, Outlet, createRootRoute, useRouter } from "@tanstack/react-router";

import { useApp } from "@/i18n/AppContext";
import { AccessibilityWidget } from "@/components/layout/AccessibilityWidget";
import { DeferredCustomCursor } from "@/components/layout/DeferredCustomCursor";
import { absoluteSiteUrl } from "@/lib/seo";

function NotFoundComponent() {
  const { t } = useApp();
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-dvh items-center justify-center bg-background px-4 outline-none"
    >
      <div className="max-w-md text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {t.errors.notFoundKicker}
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-foreground">
          {t.errors.notFoundTitle}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{t.errors.notFoundBody}</p>
        <a
          href="/"
          data-cursor-open={t.cursor.destinations.home}
          className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 font-display text-sm font-medium text-background"
        >
          {t.errors.notFoundCta}
        </a>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useApp();

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-dvh items-center justify-center bg-background px-4 outline-none"
    >
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          {t.errors.boundaryTitle}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">{t.errors.boundaryBody}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 font-display text-sm font-medium text-background"
          >
            {t.errors.boundaryRetry}
          </button>
          <a
            href="/"
            data-cursor-open={t.cursor.destinations.home}
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 font-display text-sm font-medium text-foreground"
          >
            {t.errors.boundaryHome}
          </a>
        </div>
      </div>
    </main>
  );
}

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Guilherme Ferreira",
  jobTitle: "Full Stack Software Developer",
  url: absoluteSiteUrl(),
  address: {
    "@type": "PostalAddress",
    addressLocality: "Porto Alegre",
    addressRegion: "RS",
    addressCountry: "BR",
  },
  knowsAbout: [
    "Software Architecture",
    "Full Stack Development",
    "React",
    "TypeScript",
    "Java",
    "Spring Boot",
  ],
};

const PERSON_JSONLD_CONTENT = JSON.stringify(PERSON_JSONLD).replaceAll("<", "\\u003c");

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { title: "Guilherme Ferreira Eleutherio — Full-stack Developer" },
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0a14" },
      { name: "author", content: "Guilherme Ferreira" },
      { property: "og:site_name", content: "Guilherme Ferreira" },
      { property: "og:locale", content: "pt_BR" },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  return (
    <>
      <HeadContent />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: PERSON_JSONLD_CONTENT }}
      />
      <GlobalSkipLink />
      <Outlet />
      <AccessibilityWidget />
      <DeferredCustomCursor />
    </>
  );
}

function GlobalSkipLink() {
  const { t } = useApp();

  return (
    <a
      href="#main"
      data-cursor-open={t.cursor.destinations.content}
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
    >
      {t.a11y.skipToContent}
    </a>
  );
}
