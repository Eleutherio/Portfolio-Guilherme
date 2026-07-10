import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CaseTemplate } from "@/components/project-case/CaseTemplate";
import { getProjectCaseDefinitionBySlug } from "@/content/project-case-details";

export const Route = createFileRoute("/projetos/$slug")({
  loader: ({ params }) => {
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
    <div className="min-h-dvh bg-background">
      <Header />
      <main id="main" className="overflow-x-clip">
        <CaseTemplate />
      </main>
      <Footer />
    </div>
  );
}
