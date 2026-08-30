import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { absoluteSiteUrl, socialImageMeta } from "@/lib/seo";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteSiteUrl("/privacidade") },
      ...socialImageMeta("/social/guifer-tech.jpg"),
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/privacidade") }],
  }),
  component: lazyRouteComponent(() => import("@/pages/PrivacyPage"), "PrivacyPage"),
});
