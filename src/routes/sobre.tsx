import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { About } from "@/components/sections/About";
import { NextSteps } from "@/components/sections/NextSteps";
import { useApp } from "@/i18n/AppContext";
import profileImg from "@/assets/guilherme-profile.jpg";

const TITLE = "Sobre — Guilherme Ferreira Eleutherio";
const DESCRIPTION =
  "A pessoa por trás do código: trajetória, forma de trabalho e o que me move como desenvolvedor full-stack.";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "/sobre" },
      { rel: "preload", as: "image", href: profileImg, fetchPriority: "high" },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  const { t } = useApp();
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <Header />
      <div className="h-[64px] shrink-0" aria-hidden="true" />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <div className="section-container pt-10 md:pt-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t.about.backHome}
          </Link>
        </div>
        <About headingLevel={1} />
        <NextSteps />
      </main>
      <Footer />
    </div>
  );
}
