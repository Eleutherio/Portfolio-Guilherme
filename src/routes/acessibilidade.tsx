import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { absoluteSiteUrl } from "@/lib/seo";

const TITLE = "Acessibilidade — Guilherme Ferreira Eleutherio";
const DESCRIPTION =
  "Status e escopo da avaliação de acessibilidade WCAG 2.2 AA do portfólio de Guilherme Ferreira.";

export const Route = createFileRoute("/acessibilidade")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteSiteUrl("/acessibilidade") },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/acessibilidade") }],
  }),
  component: lazyRouteComponent(() => import("@/pages/AccessibilityPage"), "AccessibilityPage"),
});
