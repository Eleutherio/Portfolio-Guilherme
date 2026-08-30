import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { DeferredBackToTop } from "@/components/layout/DeferredBackToTop";
import { DeferredSection } from "@/components/sections/DeferredSection";

import { Hero } from "@/components/sections/Hero";
import { absoluteSiteUrl, socialImageMeta } from "@/lib/seo";

const loadAbout = () => import("@/components/sections/About").then((m) => ({ default: m.About }));
const loadTestimonials = () =>
  import("@/components/sections/Testimonials").then((m) => ({ default: m.Testimonials }));
const loadProjects = () =>
  import("@/components/sections/Projects").then((m) => ({ default: m.Projects }));
const loadTimeline = () =>
  import("@/components/sections/Timeline").then((m) => ({ default: m.Timeline }));
const loadContact = () =>
  import("@/components/sections/Contact").then((m) => ({ default: m.Contact }));
const loadFooter = () => import("@/components/layout/Footer").then((m) => ({ default: m.Footer }));
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
      <div className="home-header-spacer shrink-0" aria-hidden="true" />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <Hero />
        <DeferredSection id="projetos" load={loadProjects} />
        <DeferredSection id="depoimentos" load={loadTestimonials} />
        <DeferredSection id="trajetoria" load={loadTimeline} />
        <DeferredSection id="sobre" load={loadAbout} />
        <DeferredSection id="contato" load={loadContact} />
      </main>
      <DeferredSection
        id="rodape"
        load={loadFooter}
        placeholderClassName="min-h-[28rem]"
        rootMargin="6000px 0px"
      />
      <DeferredBackToTop />
    </div>
  );
}
