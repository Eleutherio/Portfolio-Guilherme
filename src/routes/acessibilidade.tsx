import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { absoluteSiteUrl, socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/acessibilidade")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteSiteUrl("/acessibilidade") },
      ...socialImageMeta("/social/guifer-tech.jpg"),
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/acessibilidade") }],
  }),
  component: lazyRouteComponent(() => import("@/pages/AccessibilityPage"), "AccessibilityPage"),
});
