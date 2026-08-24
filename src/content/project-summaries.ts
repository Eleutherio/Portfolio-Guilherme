import grengameCover from "@/assets/projects/grengame-cover.webp";
import grengamePreview from "@/assets/projects/grengame-preview.mp4";
import abriuChaveiroCover from "@/assets/projects/abriu-chaveiro-cover.webp";
import abriuChaveiroPreview from "@/assets/projects/abriu-chaveiro-preview.mp4";
import marthaIzabelCover from "@/assets/projects/martha-izabel-cover.webp";
import marthaIzabelPreview from "@/assets/projects/martha-izabel-preview.mp4";
import type { ResponsiveImage } from "@/components/ImageCover";
import type { Lang } from "@/i18n/dictionary";

export type ProjectCaseSlug = "grengame" | "abriu-chaveiro" | "martha-izabel";

type ProjectSummaryLocale = {
  category: string;
  title: string;
  coverAlt: string;
  cardSummary: string;
  projectType: string;
  oneLineSummary: string;
  evidence: string[];
};

type ProjectSummaryDefinition = {
  id: string;
  slug: ProjectCaseSlug;
  coverSrc: string;
  coverImage: ResponsiveImage;
  previewVideoSrc?: string;
  stack: string[];
  repoUrl?: string;
  demoUrl?: string;
  imageFocus?: string;
  locale: Record<Lang, ProjectSummaryLocale>;
};

export type LocalizedProjectSummary = Omit<ProjectSummaryDefinition, "locale"> &
  ProjectSummaryLocale;

const buildImage = (fallback: string, width: number, height: number): ResponsiveImage => ({
  fallback,
  width,
  height,
});

const projectSummaries: ProjectSummaryDefinition[] = [
  {
    id: "01",
    slug: "grengame",
    coverSrc: grengameCover,
    coverImage: buildImage(grengameCover, 1680, 826),
    previewVideoSrc: grengamePreview,
    stack: ["React", "TypeScript", "Vite", "Django", "DRF", "PostgreSQL"],
    repoUrl: "https://github.com/Eleutherio/TIC55-grengame-showcase",
    demoUrl: "https://tic55-grengame-showcase.pages.dev/login",
    imageFocus: "object-center",
    locale: {
      pt: {
        category: "plataforma lms",
        title: "GrenGame",
        coverAlt: "Tela da plataforma GrenGame.",
        cardSummary:
          "Plataforma gamificada para treinamentos corporativos, publicada como showcase de portfólio a partir de um projeto desenvolvido na Residência TIC55.",
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
        projectType: "LMS platform / Gamified training system",
        oneLineSummary:
          "Gamified corporate training platform with authentication, learning paths, progress tracking and admin-oriented flows.",
        evidence: ["Authenticated user flow", "Backend/API separation", "Progress tracking logic"],
      },
    },
  },
  {
    id: "02",
    slug: "abriu-chaveiro",
    coverSrc: abriuChaveiroCover,
    coverImage: buildImage(abriuChaveiroCover, 1680, 751),
    previewVideoSrc: abriuChaveiroPreview,
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
        projectType: "Landing page / Local 24/7 service",
        oneLineSummary:
          "24/7 locksmith landing page focused on turning urgent searches into immediate contact.",
        evidence: ["Serverless contact API", "Optimized local SEO", "Performance and mobile-first"],
      },
    },
  },
  {
    id: "03",
    slug: "martha-izabel",
    coverSrc: marthaIzabelCover,
    coverImage: buildImage(marthaIzabelCover, 1680, 836),
    previewVideoSrc: marthaIzabelPreview,
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
        projectType: "Landing page 2-step / Marca pessoal",
        oneLineSummary:
          "Site de marca pessoal com prova social, arquitetura de conversão e formulário protegido.",
        evidence: ["Design system reutilizável", "SEO técnico on-page", "Formulário com anti-spam"],
      },
      en: {
        category: "2-step landing page",
        title: "Personal brand portfolio",
        coverAlt: "Hero section from Martha Izabel's professional portfolio.",
        cardSummary:
          "Institutional website and portfolio for a content strategist, combining positioning, conversion, and brand identity. Each technical decision reinforces the professional's positioning: warm, human, and strategic.",
        projectType: "2-step landing page / Personal brand",
        oneLineSummary:
          "Personal brand site with social proof, conversion architecture and a protected contact form.",
        evidence: ["Reusable design system", "On-page technical SEO", "Anti-spam contact form"],
      },
    },
  },
];

const localizeProjectSummary = (
  project: ProjectSummaryDefinition,
  lang: Lang,
): LocalizedProjectSummary => ({
  id: project.id,
  slug: project.slug,
  coverSrc: project.coverSrc,
  coverImage: project.coverImage,
  previewVideoSrc: project.previewVideoSrc,
  stack: project.stack,
  repoUrl: project.repoUrl,
  demoUrl: project.demoUrl,
  imageFocus: project.imageFocus,
  ...project.locale[lang],
});

export const getLocalizedProjectSummaries = (lang: Lang): LocalizedProjectSummary[] =>
  projectSummaries.map((project) => localizeProjectSummary(project, lang));

export const findProjectSummaryBySlug = (slug: string) =>
  projectSummaries.find((project) => project.slug === slug);
