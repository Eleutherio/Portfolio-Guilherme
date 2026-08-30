import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { absoluteSiteUrl } from "@/lib/seo";

const TITLE = "Privacidade — Guilherme Ferreira Eleutherio";
const DESCRIPTION =
  "Aviso de privacidade do guifer.tech: dados tratados, finalidades, bases legais, fornecedores, retenção e direitos.";

export const Route = createFileRoute("/privacidade")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteSiteUrl("/privacidade") },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: absoluteSiteUrl("/privacidade") }],
  }),
  component: lazyRouteComponent(() => import("@/pages/PrivacyPage"), "PrivacyPage"),
});
