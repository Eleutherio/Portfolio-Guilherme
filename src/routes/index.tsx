import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/layout/BackToTop";
import { useApp } from "@/i18n/AppContext";

import { Hero } from "@/components/sections/Hero";
import { ProofBar } from "@/components/hero/ProofBar";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Timeline } from "@/components/sections/Timeline";
import { WhyHire } from "@/components/sections/WhyHire";
import { Contact } from "@/components/sections/Contact";


import profileImg from "@/assets/guilherme-profile.jpg";

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
    links: [
      { rel: "canonical", href: "/" },
      // Preload the LCP-candidate portrait so it decodes early.
      { rel: "preload", as: "image", href: profileImg, fetchpriority: "high" },
    ],
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
        <div id="home"><Hero /></div>
        <ProofBar />
        <Skills />
        <Projects />
        <Timeline />
        <WhyHire />
        <Contact />

      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
