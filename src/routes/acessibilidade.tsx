import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

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
    ],
    links: [{ rel: "canonical", href: "/acessibilidade" }],
  }),
  component: lazyRouteComponent(() => import("@/pages/AccessibilityPage"), "AccessibilityPage"),
});
