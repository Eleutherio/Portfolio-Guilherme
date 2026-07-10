import grengameCover from "@/assets/projects/grengame-cover.webp";
import abriuChaveiroCover from "@/assets/projects/abriu-chaveiro-cover.webp";
import marthaIzabelCover from "@/assets/projects/martha-izabel-cover.webp";
import type { ResponsiveImage } from "@/components/ImageCover";
import type { Lang } from "@/i18n/dictionary";

export type ProjectCaseSlug = "grengame" | "abriu-chaveiro" | "martha-izabel";

type ProjectSummaryLocale = {
  category: string;
  title: string;
  coverAlt: string;
  cardSummary: string;
  cardProblem: string;
  cardSolution: string;
  projectType: string;
  oneLineSummary: string;
  evidence: string[];
  highlights?: string[];
};

export type ProjectSummaryDefinition = {
  id: string;
  slug: ProjectCaseSlug;
  coverSrc: string;
  coverImage: ResponsiveImage;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  imageFocus?: string;
  locale: Record<Lang, ProjectSummaryLocale>;
};

export type LocalizedProjectSummary = Omit<ProjectSummaryDefinition, "locale"> & ProjectSummaryLocale;

const buildImage = (fallback: string): ResponsiveImage => ({
  fallback,
  width: 1200,
  height: 900,
});

export const projectSummaries: ProjectSummaryDefinition[] = [
  {
    id: "01",
    slug: "grengame",
    coverSrc: grengameCover,
    coverImage: buildImage(grengameCover),
    stack: ["React", "TypeScript", "Vite", "Django", "DRF", "PostgreSQL"],
    repoUrl: "#",
    demoUrl: "#",
    imageFocus: "object-center",
    locale: {
      pt: {
        category: "plataforma lms",
        title: "GrenGame",
        coverAlt: "Tela da plataforma GrenGame.",
        cardSummary:
          "Plataforma gamificada para treinamentos corporativos, publicada como showcase de portfólio a partir de um projeto desenvolvido na Residência TIC55.",
        cardProblem:
          "Treinamentos longos e pouco engajadores resultam em baixa retenção de conteúdo e nenhum controle real sobre o progresso de quem está aprendendo.",
        cardSolution:
          "Experiência web modular com fluxos administrativos, autenticação JWT e backend Django REST conectado a PostgreSQL. Frontend em React + Vite focado em clareza de navegação e separação de responsabilidades.",
        projectType: "Plataforma LMS / Sistema de treinamento gamificado",
        oneLineSummary:
          "Plataforma de treinamento corporativo gamificada com autenticação, trilhas de aprendizado, tracking de progresso e fluxos administrativos.",
        evidence: [
          "Fluxo autenticado de usuário",
          "Separação backend/API",
          "Lógica de tracking de progresso",
        ],
      },
      en: {
        category: "lms platform",
        title: "GrenGame",
        coverAlt: "GrenGame platform screen.",
        cardSummary:
          "Gamified platform for corporate training, published as a portfolio showcase based on a project built during the TIC55 Residency.",
        cardProblem:
          "Long, low-engagement training leads to poor content retention and no real visibility into learners' progress.",
        cardSolution:
          "Modular web experience with admin flows, JWT auth and a Django REST backend connected to PostgreSQL. React + Vite frontend focused on navigation clarity and separation of concerns.",
        projectType: "LMS platform / Gamified training system",
        oneLineSummary:
          "Gamified corporate training platform with authentication, learning paths, progress tracking and admin-oriented flows.",
        evidence: [
          "Authenticated user flow",
          "Backend/API separation",
          "Progress tracking logic",
        ],
      },
    },
  },
  {
    id: "02",
    slug: "abriu-chaveiro",
    coverSrc: abriuChaveiroCover,
    coverImage: buildImage(abriuChaveiroCover),
    stack: ["HTML", "CSS", "JavaScript", "Serverless", "SEO", "Vercel"],
    repoUrl: "https://github.com/Eleutherio/Abriuchaveiro",
    demoUrl: "https://abriuchaveiro.vercel.app/",
    imageFocus: "object-[center_44%]",
    locale: {
      pt: {
        category: "landing page",
        title: "Landing page para chaveiro 24h",
        coverAlt: "Site institucional da Abriu Chaveiro.",
        cardSummary:
          "Landing page para um serviço local de chaveiro 24h, desenhada para transformar buscas urgentes em contato imediato, reforçando confiança, presença orgânica e conversão.",
        cardProblem:
          "Negócio local sem presença digital perdia clientes para concorrentes encontrados primeiro no Google e sem canal direto de contato.",
        cardSolution:
          "Site estático em HTML/CSS/JS com API serverless para envio de contato, integração com serviços externos, foco em SEO e estrutura preparada para evolução futura para backend em Flask.",
        highlights: ["SEO local", "CTA imediato", "Contato direto", "Performance"],
        projectType: "Landing page / Serviço local 24h",
        oneLineSummary:
          "Landing page para chaveiro 24h focada em converter buscas urgentes em contato imediato.",
        evidence: [
          "API serverless de contato",
          "SEO local otimizado",
          "Performance e mobile-first",
        ],
      },
      en: {
        category: "landing page",
        title: "24/7 locksmith landing page",
        coverAlt: "Abriu Chaveiro institutional website.",
        cardSummary:
          "Landing page for a local 24/7 locksmith service, designed to turn urgent searches into immediate contact while reinforcing trust, organic presence, and conversion.",
        cardProblem:
          "A local business with no digital presence kept losing customers to competitors found first on Google and had no direct contact channel.",
        cardSolution:
          "Static site in HTML/CSS/JS with a serverless contact API, third-party integrations, SEO focus, and structure ready to evolve into a Flask backend.",
        highlights: ["Local SEO", "Immediate CTA", "Direct contact", "Performance"],
        projectType: "Landing page / Local 24/7 service",
        oneLineSummary:
          "24/7 locksmith landing page focused on turning urgent searches into immediate contact.",
        evidence: [
          "Serverless contact API",
          "Optimized local SEO",
          "Performance and mobile-first",
        ],
      },
    },
  },
  {
    id: "03",
    slug: "martha-izabel",
    coverSrc: marthaIzabelCover,
    coverImage: buildImage(marthaIzabelCover),
    stack: ["React 18", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "framer-motion"],
    repoUrl: "https://github.com/Eleutherio/projeto-martha-izabel",
    demoUrl: "https://marthaizabel.com.br/",
    imageFocus: "object-center",
    locale: {
      pt: {
        category: "landing page 2-step",
        title: "Portfólio de marca pessoal",
        coverAlt: "Hero do portfólio profissional de Martha Izabel.",
        cardSummary:
          "Site institucional e portfólio para uma estrategista de conteúdo, unindo posicionamento, conversão e identidade de marca. Cada decisão técnica sustenta o posicionamento da profissional: acolhedor, humano e estratégico.",
        cardProblem:
          "A marca precisava consolidar identidade visual e presença digital em uma vitrine que transmitisse autoridade, prova social e facilidade de contato.",
        cardSolution:
          "Estruturei uma experiência com prova social, arquitetura de conversão, SEO on-page e formulário protegido, conectando branding, captação e credibilidade em um único produto.",
        highlights: ["SEO técnico", "Design system", "Formulário seguro", "Acessibilidade"],
        projectType: "Landing page 2-step / Marca pessoal",
        oneLineSummary:
          "Site de marca pessoal com prova social, arquitetura de conversão e formulário protegido.",
        evidence: [
          "Design system reutilizável",
          "SEO técnico on-page",
          "Formulário com anti-spam",
        ],
      },
      en: {
        category: "2-step landing page",
        title: "Personal brand portfolio",
        coverAlt: "Hero section from Martha Izabel's professional portfolio.",
        cardSummary:
          "Institutional website and portfolio for a content strategist, combining positioning, conversion, and brand identity. Each technical decision reinforces the professional's positioning: warm, human, and strategic.",
        cardProblem:
          "The personal brand needed a stronger visual identity and digital presence through a showcase capable of conveying authority, social proof, and easier contact.",
        cardSolution:
          "I structured an experience with social proof, conversion architecture, on-page SEO, and a protected contact form, connecting branding, lead capture, and credibility in one product.",
        highlights: ["Technical SEO", "Design system", "Secure form", "Accessibility"],
        projectType: "2-step landing page / Personal brand",
        oneLineSummary:
          "Personal brand site with social proof, conversion architecture and a protected contact form.",
        evidence: [
          "Reusable design system",
          "On-page technical SEO",
          "Anti-spam contact form",
        ],
      },
    },
  },
];

export const getProjectCasePath = (slug: ProjectCaseSlug) => `/projetos/${slug}`;

export const localizeProjectSummary = (project: ProjectSummaryDefinition, lang: Lang): LocalizedProjectSummary => ({
  id: project.id,
  slug: project.slug,
  coverSrc: project.coverSrc,
  coverImage: project.coverImage,
  stack: project.stack,
  repoUrl: project.repoUrl,
  demoUrl: project.demoUrl,
  imageFocus: project.imageFocus,
  ...project.locale[lang],
});

export const getLocalizedProjectSummaries = (lang: Lang): LocalizedProjectSummary[] =>
  projectSummaries.map((project) => localizeProjectSummary(project, lang));

export const findProjectSummaryBySlug = (slug: string) => projectSummaries.find((project) => project.slug === slug);
