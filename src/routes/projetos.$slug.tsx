import { createFileRoute, notFound } from "@tanstack/react-router";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CaseTemplate } from "@/components/project-case/CaseTemplate";
import { MotionBoundary } from "@/components/MotionBoundary";
import { absoluteSiteUrl, socialImageMeta } from "@/lib/seo";
import { useApp } from "@/i18n/AppContext";
import { useDocumentPageMetadata } from "@/components/layout/DocumentMetadata";

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
    const pageUrl = absoluteSiteUrl(`/projetos/${summary.slug}`);
    return {
      meta: [
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
        ...socialImageMeta(`/social/${summary.slug}.jpg`),
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
    };
  },
  component: ProjectCase,
});

function ProjectCase() {
  const { lang } = useApp();
  const { summary } = Route.useLoaderData();
  const locale = summary.locale[lang];
  useDocumentPageMetadata({
    title: `${locale.title} — Guilherme Ferreira`,
    description: locale.cardSummary,
    imageAlt: `${locale.title} — guifer.tech`,
  });

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
