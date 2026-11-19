import {
  HeadContent,
  Outlet,
  createRootRoute,
  useRouter,
  type ErrorComponentProps,
} from "@tanstack/react-router";

import { useApp } from "@/i18n/AppContext";
import { AccessibilityWidget } from "@/components/layout/AccessibilityWidget";
import { DeferredCustomCursor } from "@/components/layout/DeferredCustomCursor";
import { DocumentMetadata } from "@/components/layout/DocumentMetadata";
import { MomentumScroll } from "@/components/layout/MomentumScroll";
import { PagePreparation } from "@/components/layout/PagePreparation";
import { useEffect } from "react";
import { PAGE_PREPARATION_ERROR_EVENT } from "@/lib/page-readiness";

function NotFoundComponent() {
  const { t } = useApp();
  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-dvh items-center justify-center bg-background px-4 outline-none"
    >
      <div className="max-w-md text-center">
        <p className="meta-text text-muted-foreground">{t.errors.notFoundKicker}</p>
        <h1 className="page-title mt-4 text-foreground">{t.errors.notFoundTitle}</h1>
        <p className="body-copy mt-3 text-muted-foreground">{t.errors.notFoundBody}</p>
        <a
          href="/"
          data-cursor-open={t.cursor.destinations.home}
          className="ui-control-text mt-6 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-background"
        >
          {t.errors.notFoundCta}
        </a>
      </div>
    </main>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  const { t } = useApp();
  useEffect(() => {
    window.dispatchEvent(new Event(PAGE_PREPARATION_ERROR_EVENT));
  }, []);

  return (
    <main
      id="main"
      tabIndex={-1}
      className="flex min-h-dvh items-center justify-center bg-background px-4 outline-none"
    >
      <div className="max-w-md text-center">
        <h1 className="page-title text-foreground">{t.errors.boundaryTitle}</h1>
        <p className="body-copy mt-3 text-muted-foreground">{t.errors.boundaryBody}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="ui-control-text inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-background"
          >
            {t.errors.boundaryRetry}
          </button>
          <a
            href="/"
            data-cursor-open={t.cursor.destinations.home}
            className="ui-control-text inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-3 text-foreground"
          >
            {t.errors.boundaryHome}
          </a>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "author", content: "Guilherme Ferreira" },
      { property: "og:site_name", content: "Guilherme Ferreira" },
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
      <DocumentMetadata />
      <MomentumScroll />
      <GlobalSkipLink />
      <Outlet />
      <AccessibilityWidget />
      <DeferredCustomCursor />
      <PagePreparation />
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
