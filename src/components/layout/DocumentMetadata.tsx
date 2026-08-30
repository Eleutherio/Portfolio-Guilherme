import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";

import { useApp } from "@/i18n/AppContext";
import type { Lang } from "@/i18n/dictionary";
import { useTheme } from "@/lib/theme";
import { absoluteSiteUrl } from "@/lib/seo";

type PageMetadata = {
  title: string;
  description: string;
  imageAlt?: string;
};

const STATIC_METADATA: Record<string, Record<Lang, PageMetadata>> = {
  "/": {
    pt: {
      title: "Guilherme Ferreira Eleutherio — Desenvolvedor full-stack",
      description:
        "Desenvolvedor full-stack focado em aplicações web seguras, escaláveis e manuteníveis com React, TypeScript, Django e PostgreSQL.",
      imageAlt: "guifer.tech — portfólio pessoal de desenvolvimento de software.",
    },
    en: {
      title: "Guilherme Ferreira Eleutherio — Full-stack Developer",
      description:
        "Full-stack developer focused on secure, scalable and maintainable web applications using React, TypeScript, Django and PostgreSQL.",
      imageAlt: "guifer.tech — personal software development portfolio.",
    },
  },
  "/sobre": {
    pt: {
      title: "Sobre — Guilherme Ferreira Eleutherio",
      description:
        "A pessoa por trás do código: trajetória, formação e experiências que orientam meu trabalho como desenvolvedor de software.",
      imageAlt: "guifer.tech — portfólio pessoal de desenvolvimento de software.",
    },
    en: {
      title: "About — Guilherme Ferreira Eleutherio",
      description:
        "The person behind the code: the path, education and experiences that guide my work as a software developer.",
      imageAlt: "guifer.tech — personal software development portfolio.",
    },
  },
  "/privacidade": {
    pt: {
      title: "Privacidade — Guilherme Ferreira Eleutherio",
      description:
        "Aviso de privacidade do guifer.tech: dados tratados, finalidades, bases legais, fornecedores, retenção e direitos.",
      imageAlt: "guifer.tech — portfólio pessoal de desenvolvimento de software.",
    },
    en: {
      title: "Privacy — Guilherme Ferreira Eleutherio",
      description:
        "guifer.tech privacy notice: processed data, purposes, legal bases, providers, retention and rights.",
      imageAlt: "guifer.tech — personal software development portfolio.",
    },
  },
  "/acessibilidade": {
    pt: {
      title: "Acessibilidade — Guilherme Ferreira Eleutherio",
      description:
        "Status e escopo da avaliação de acessibilidade WCAG 2.2 AA do portfólio de Guilherme Ferreira.",
      imageAlt: "guifer.tech — portfólio pessoal de desenvolvimento de software.",
    },
    en: {
      title: "Accessibility — Guilherme Ferreira Eleutherio",
      description:
        "Status and scope of the WCAG 2.2 AA accessibility evaluation of Guilherme Ferreira's portfolio.",
      imageAlt: "guifer.tech — personal software development portfolio.",
    },
  },
};

function upsertMeta(selector: string, attributes: Record<string, string>, content: string) {
  const matches = [...document.head.querySelectorAll<HTMLMetaElement>(selector)];
  const element = matches.shift() ?? document.createElement("meta");

  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
  element.setAttribute("content", content);
  if (!element.isConnected) document.head.append(element);
  matches.forEach((duplicate) => duplicate.remove());
}

function syncPageMetadata(metadata: PageMetadata) {
  const titles = [...document.head.querySelectorAll("title")];
  const title = titles.shift() ?? document.createElement("title");
  title.textContent = metadata.title;
  if (!title.isConnected) document.head.append(title);
  titles.forEach((duplicate) => duplicate.remove());

  upsertMeta('meta[name="description"]', { name: "description" }, metadata.description);
  upsertMeta('meta[property="og:title"]', { property: "og:title" }, metadata.title);
  upsertMeta(
    'meta[property="og:description"]',
    { property: "og:description" },
    metadata.description,
  );
  upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, metadata.title);
  upsertMeta(
    'meta[name="twitter:description"]',
    { name: "twitter:description" },
    metadata.description,
  );
  if (metadata.imageAlt) {
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt" }, metadata.imageAlt);
    upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt" }, metadata.imageAlt);
  }
}

export function useDocumentPageMetadata(metadata: PageMetadata) {
  const { description, imageAlt, title } = metadata;
  useEffect(
    () => syncPageMetadata({ description, imageAlt, title }),
    [description, imageAlt, title],
  );
}

export function DocumentMetadata() {
  const { lang } = useApp();
  const { theme } = useTheme();
  const pathname = useLocation({ select: (location) => location.pathname });
  const metadata = STATIC_METADATA[pathname]?.[lang];

  useEffect(() => {
    if (metadata) syncPageMetadata(metadata);

    upsertMeta(
      'meta[property="og:locale"]',
      { property: "og:locale" },
      lang === "pt" ? "pt_BR" : "en_US",
    );
    upsertMeta(
      'meta[name="theme-color"]',
      { name: "theme-color" },
      theme === "dark" ? "#0e131b" : "#f7f6f2",
    );

    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: "Guilherme Ferreira",
      jobTitle:
        lang === "pt" ? "Desenvolvedor de software full-stack" : "Full-stack Software Developer",
      url: absoluteSiteUrl(),
      inLanguage: lang === "pt" ? "pt-BR" : "en",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Porto Alegre",
        addressRegion: "RS",
        addressCountry: "BR",
      },
      knowsAbout: [
        "Software Architecture",
        "Full Stack Development",
        "React",
        "TypeScript",
        "Java",
        "Spring Boot",
      ],
    };
    const scripts = [
      ...document.head.querySelectorAll<HTMLScriptElement>(
        'script[type="application/ld+json"][data-person-metadata]',
      ),
    ];
    const script = scripts.shift() ?? document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.personMetadata = "true";
    script.textContent = JSON.stringify(person).replaceAll("<", "\\u003c");
    if (!script.isConnected) document.head.append(script);
    scripts.forEach((duplicate) => duplicate.remove());
  }, [lang, metadata, theme]);

  return null;
}
