import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { BackToTop } from "@/components/layout/BackToTop";
import { About } from "@/components/sections/About";
import { Projects } from "@/components/sections/Projects";
import { Skills } from "@/components/sections/Skills";
import { Testimonials } from "@/components/sections/Testimonials";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

import { Hero } from "@/components/sections/Hero";
import { absoluteSiteUrl, socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteSiteUrl() },
      ...socialImageMeta("/social/guifer-tech.jpg"),
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl() }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="home-visual flex min-h-dvh flex-col bg-background">
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <div className="home-projects-parallax" data-parallax-paused="true">
          <Hero />
          <About />
          <Projects />
        </div>
        <Skills />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
