import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { ThemeProvider } from "@/lib/theme";
import { AppProvider, useApp } from "@/i18n/AppContext";

function NotFoundComponent() {
  const { t } = useApp();
  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
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
          className="mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 font-display text-sm font-medium text-background"
        >
          {t.errors.notFoundCta}
        </a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useApp();

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
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
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 font-display text-sm font-medium text-foreground"
          >
            {t.errors.boundaryHome}
          </a>
        </div>
      </div>
    </div>
  );
}

const PERSON_JSONLD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Guilherme Ferreira",
  jobTitle: "Full Stack Software Developer",
  url: "/",
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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0a0a14" },
      { name: "author", content: "Guilherme Ferreira" },
      { property: "og:site_name", content: "Guilherme Ferreira" },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(PERSON_JSONLD),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <Outlet />
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
