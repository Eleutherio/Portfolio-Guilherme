import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AboutAlbum } from "@/components/sections/AboutAlbum";
import { NextSteps } from "@/components/sections/NextSteps";
import { useApp } from "@/i18n/AppContext";
import firstAboutAlbumImage from "@/assets/about/unisinos-campus.jpg";

const TITLE = "Sobre — Guilherme Ferreira Eleutherio";
const DESCRIPTION =
  "A pessoa por trás do código: trajetória, formação e experiências que orientam meu trabalho como desenvolvedor de software.";

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
      { rel: "preload", as: "image", href: firstAboutAlbumImage, fetchPriority: "high" },
    ],
  }),
  component: SobrePage,
});

function SobrePage() {
  const { t } = useApp();
  return (
    <div className="portfolio-visual flex min-h-dvh flex-col bg-background">
      <Header />
      <div className="site-header-spacer shrink-0" aria-hidden="true" />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <div className="section-container pt-10 md:pt-14">
          <Link
            to="/"
            data-cursor-open={t.cursor.destinations.home}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            {t.about.backHome}
          </Link>
        </div>
        <AboutAlbum />
        <NextSteps />
      </main>
      <Footer />
    </div>
  );
}
