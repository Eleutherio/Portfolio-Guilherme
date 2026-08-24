import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

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
    ],
    links: [{ rel: "canonical", href: "/privacidade" }],
  }),
  component: lazyRouteComponent(() => import("@/pages/PrivacyPage"), "PrivacyPage"),
});
