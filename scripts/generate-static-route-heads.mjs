import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.join(root, "dist", "client");
const sourceHtml = await readFile(path.join(outputDirectory, "index.html"), "utf8");
const origin = "https://guifer.tech";
const sharedImage = "/social/guifer-tech.jpg";

const routes = [
  {
    path: "/",
    title: "Guilherme Ferreira Eleutherio — Desenvolvedor full-stack",
    description:
      "Desenvolvedor full-stack focado em aplicações web seguras, escaláveis e manuteníveis com React, TypeScript, Django e PostgreSQL.",
    type: "website",
    image: sharedImage,
    imageAlt: "guifer.tech — portfólio pessoal de desenvolvimento de software.",
  },
  {
    path: "/sobre",
    title: "Sobre — Guilherme Ferreira Eleutherio",
    description:
      "A pessoa por trás do código: trajetória, formação e experiências que orientam meu trabalho como desenvolvedor de software.",
    type: "profile",
    image: sharedImage,
    imageAlt: "guifer.tech — portfólio pessoal de desenvolvimento de software.",
  },
  {
    path: "/privacidade",
    title: "Privacidade — Guilherme Ferreira Eleutherio",
    description:
      "Aviso de privacidade do guifer.tech: dados tratados, finalidades, bases legais, fornecedores, retenção e direitos.",
    type: "website",
    image: sharedImage,
    imageAlt: "guifer.tech — portfólio pessoal de desenvolvimento de software.",
  },
  {
    path: "/acessibilidade",
    title: "Acessibilidade — Guilherme Ferreira Eleutherio",
    description:
      "Status e escopo da avaliação de acessibilidade WCAG 2.2 AA do portfólio de Guilherme Ferreira.",
    type: "website",
    image: sharedImage,
    imageAlt: "guifer.tech — portfólio pessoal de desenvolvimento de software.",
  },
  {
    path: "/projetos/grengame",
    title: "GrenGame — Guilherme Ferreira",
    description:
      "Plataforma gamificada para treinamentos corporativos, publicada como showcase de portfólio a partir de um projeto desenvolvido na Residência TIC55.",
    type: "article",
    image: "/social/grengame.jpg",
    imageAlt: "GrenGame — guifer.tech",
  },
  {
    path: "/projetos/abriu-chaveiro",
    title: "Landing page para chaveiro 24h — Guilherme Ferreira",
    description:
      "Landing page para um serviço local de chaveiro 24h, desenhada para transformar buscas urgentes em contato imediato, reforçando confiança, presença orgânica e conversão.",
    type: "article",
    image: "/social/abriu-chaveiro.jpg",
    imageAlt: "Landing page para chaveiro 24h — guifer.tech",
  },
  {
    path: "/projetos/martha-izabel",
    title: "Portfólio de marca pessoal — Guilherme Ferreira",
    description:
      "Site institucional e portfólio para uma estrategista de conteúdo, unindo posicionamento, conversão e identidade de marca.",
    type: "article",
    image: "/social/martha-izabel.jpg",
    imageAlt: "Portfólio de marca pessoal — guifer.tech",
  },
];

const escapeAttribute = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const metaName = (name, content) =>
  `<meta data-static-head name="${name}" content="${escapeAttribute(content)}">`;
const metaProperty = (property, content) =>
  `<meta data-static-head property="${property}" content="${escapeAttribute(content)}">`;

for (const route of routes) {
  const url = new URL(route.path, `${origin}/`).href;
  const image = new URL(route.image, `${origin}/`).href;
  const tags = [
    metaName("description", route.description),
    metaProperty("og:site_name", "Guilherme Ferreira"),
    metaProperty("og:locale", "pt_BR"),
    metaProperty("og:title", route.title),
    metaProperty("og:description", route.description),
    metaProperty("og:type", route.type),
    metaProperty("og:url", url),
    metaProperty("og:image", image),
    metaProperty("og:image:secure_url", image),
    metaProperty("og:image:type", "image/jpeg"),
    metaProperty("og:image:width", "1200"),
    metaProperty("og:image:height", "630"),
    metaProperty("og:image:alt", route.imageAlt),
    metaName("twitter:card", "summary_large_image"),
    metaName("twitter:title", route.title),
    metaName("twitter:description", route.description),
    metaName("twitter:image", image),
    metaName("twitter:image:alt", route.imageAlt),
    `<link data-static-head rel="canonical" href="${url}">`,
  ].join("\n    ");

  const html = sourceHtml
    .replace(/<title>.*?<\/title>/s, `<title>${route.title}</title>`)
    .replace("</head>", `    ${tags}\n  </head>`);
  const destination =
    route.path === "/"
      ? path.join(outputDirectory, "index.html")
      : path.join(outputDirectory, `${route.path.slice(1)}.html`);

  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

console.log(`Metadados sociais estáticos gerados para ${routes.length} rotas.`);
