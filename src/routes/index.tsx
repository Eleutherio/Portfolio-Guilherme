import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { useApp } from "@/i18n/AppContext";

import { Hero } from "@/components/sections/Hero";

const About = lazy(() => import("@/components/sections/About").then((m) => ({ default: m.About })));
const Skills = lazy(() =>
  import("@/components/sections/Skills").then((m) => ({ default: m.Skills })),
);
const Projects = lazy(() =>
  import("@/components/sections/Projects").then((m) => ({ default: m.Projects })),
);
const Timeline = lazy(() =>
  import("@/components/sections/Timeline").then((m) => ({ default: m.Timeline })),
);
const Contact = lazy(() =>
  import("@/components/sections/Contact").then((m) => ({ default: m.Contact })),
);
const Footer = lazy(() =>
  import("@/components/layout/Footer").then((m) => ({ default: m.Footer })),
);
const BackToTop = lazy(() =>
  import("@/components/layout/BackToTop").then((m) => ({ default: m.BackToTop })),
);

const TITLE = "Guilherme Ferreira Eleutherio — Full-stack Developer";
const DESCRIPTION =
  "Full-stack developer focused on secure, scalable and maintainable web applications using React, TypeScript, Django and PostgreSQL.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const { t } = useApp();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-foreground focus:px-4 focus:py-2 focus:text-background"
      >
        {t.a11y.skipToContent}
      </a>
      <Header />
      <div className="h-[64px] shrink-0" aria-hidden="true" />
      <main id="main" className="flex-1 overflow-x-clip [&_section]:scroll-mt-20">
        <div id="home">
          <Hero />
        </div>
        <Suspense fallback={null}>
          <About />
          <Timeline />
          <Projects />
          <Skills />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
        <BackToTop />
      </Suspense>
    </div>
  );
}
