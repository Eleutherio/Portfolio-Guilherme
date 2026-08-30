import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CaseTemplate } from "@/components/project-case/CaseTemplate";
import { MotionBoundary } from "@/components/MotionBoundary";
import { absoluteSiteUrl } from "@/lib/seo";

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
    const pageUrl = absoluteSiteUrl(`/projetos/${summary.slug}`);
    const imageUrl = absoluteSiteUrl(summary.coverSrc);
    const title = `${pt.title} — Guilherme Ferreira`;
    return {
      meta: [
        { title },
        { name: "description", content: pt.cardSummary },
        { property: "og:title", content: title },
        { property: "og:description", content: pt.cardSummary },
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
        { property: "og:image", content: imageUrl },
        { property: "og:image:secure_url", content: imageUrl },
        { property: "og:image:type", content: "image/webp" },
        { property: "og:image:width", content: String(summary.coverImage.width) },
        { property: "og:image:height", content: String(summary.coverImage.height) },
        { property: "og:image:alt", content: pt.coverAlt },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: pt.cardSummary },
        { name: "twitter:image", content: imageUrl },
        { name: "twitter:image:alt", content: pt.coverAlt },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
    };
  },
  component: ProjectCase,
});

function ProjectCase() {
  return (
    <MotionBoundary>
      <div className="portfolio-visual project-case-visual flex min-h-dvh flex-col bg-background">
        <Header />
        <div className="site-header-spacer shrink-0" aria-hidden="true" />
        <main id="main" tabIndex={-1} className="flex-1 overflow-x-clip outline-none">
          <CaseTemplate />
        </main>
        <Footer />
      </div>
    </MotionBoundary>
  );
}
