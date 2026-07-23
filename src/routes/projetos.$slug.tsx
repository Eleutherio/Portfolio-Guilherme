import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CaseTemplate } from "@/components/project-case/CaseTemplate";

export const Route = createFileRoute("/projetos/$slug")({
  loader: async ({ params }) => {
    const { getProjectCaseDefinitionBySlug } = await import("@/content/project-case-details");
    const data = getProjectCaseDefinitionBySlug(params.slug);
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [] };
    const { summary } = loaderData;
    const pt = summary.locale.pt;
    return {
      meta: [
        { title: `${pt.title} — Guilherme Ferreira` },
        { name: "description", content: pt.cardSummary },
        { property: "og:title", content: `${pt.title} — Guilherme Ferreira` },
        { property: "og:description", content: pt.cardSummary },
        { property: "og:type", content: "article" },
        { property: "og:image", content: summary.coverSrc },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: summary.coverSrc },
      ],
    };
  },
  component: ProjectCase,
});

function ProjectCase() {
  return (
    <div className="portfolio-visual flex min-h-dvh flex-col bg-background">
      <Header />
      <div className="site-header-spacer shrink-0" aria-hidden="true" />
      <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
        <CaseTemplate />
      </main>
      <Footer />
    </div>
  );
}
