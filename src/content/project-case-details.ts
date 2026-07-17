import type { Lang } from "@/i18n/dictionary";
import {
  findProjectSummaryBySlug,
  getLocalizedProjectSummaries,
  type LocalizedProjectSummary,
  type ProjectCaseSlug,
} from "@/content/project-summaries";

type ProjectCaseLocale = {
  context: {
    problem: string;
    audience: string;
    importance: string;
  };
  solution: {
    product: string;
    technical: string;
    architecture: string;
  };
  execution: {
    challenges: string;
    tradeoffs: string;
    hindsight: string;
  };
  result: {
    impact: string;
    gains: string;
  };
  closing: {
    nextSteps: string;
  };
};

type ProjectCaseDefinition = {
  slug: ProjectCaseSlug;
  locale: Record<Lang, ProjectCaseLocale>;
};

export type LocalizedProjectCase = LocalizedProjectSummary & ProjectCaseLocale;

const projectCaseDetails: ProjectCaseDefinition[] = [
  {
    slug: "grengame",
    locale: {
      pt: {
        context: {
          problem:
            "Treinamentos corporativos longos e pouco interativos reduziam retenção de conteúdo e dificultavam a leitura real de progresso dos participantes.",
          audience:
            "Times internos que precisavam acompanhar jornadas de aprendizagem com mais clareza, autonomia administrativa e feedback contínuo.",
          importance:
            "O projeto precisava equilibrar motivação, organização de conteúdo e confiabilidade técnica sem transformar a experiência em um produto infantilizado.",
        },
        solution: {
          product:
            "A proposta foi estruturar uma plataforma gamificada com trilhas, autenticação, acompanhamento de progresso e visão administrativa consistente.",
          technical:
            "O frontend foi construído em React + Vite, enquanto o backend usou Django REST com JWT e PostgreSQL para garantir separação clara entre camadas e domínio.",
          architecture:
            "A arquitetura priorizou modularidade, clareza de navegação e componentes reaproveitáveis para permitir evolução gradual da plataforma.",
        },
        execution: {
          challenges:
            "O principal desafio foi traduzir uma lógica de aprendizagem em fluxos digitais simples, sem poluir a interface nem comprometer a manutenção.",
          tradeoffs:
            "Algumas decisões visuais e de escopo foram contidas para privilegiar estabilidade do fluxo principal e previsibilidade de implementação.",
          hindsight:
            "Em uma próxima iteração, eu aprofundaria métricas pedagógicas e estados de acompanhamento mais ricos para gestores e alunos.",
        },
        result: {
          impact:
            "O case consolidou um produto de portfólio que demonstra capacidade de conectar experiência, backend e modelagem de fluxo em um domínio menos trivial.",
          gains:
            "Além do ganho técnico, o projeto fortaleceu repertório em autenticação, organização de interface e estruturação de aplicações modulares.",
        },
        closing: {
          nextSteps:
            "Os próximos passos naturais seriam evoluir dashboards de acompanhamento, regras de progressão e mecanismos mais ricos de engajamento sem perder sobriedade.",
        },
      },
      en: {
        context: {
          problem:
            "Long, low-interaction corporate training reduced retention and made it hard to understand actual learner progress.",
          audience:
            "Internal teams that needed clearer learning journeys, administrative autonomy, and continuous feedback loops.",
          importance:
            "The product had to balance motivation, content structure, and technical reliability without turning the experience into something childish.",
        },
        solution: {
          product:
            "The proposal was a gamified platform with learning paths, authentication, progress tracking, and a consistent admin view.",
          technical:
            "The frontend was built with React + Vite, while the backend used Django REST with JWT and PostgreSQL for clear separation between layers and domain.",
          architecture:
            "The architecture prioritized modularity, navigation clarity, and reusable components to support gradual product evolution.",
        },
        execution: {
          challenges:
            "The main challenge was translating learning logic into simple digital flows without cluttering the interface or harming maintainability.",
          tradeoffs:
            "Some visual and scope decisions were intentionally restrained to protect the main flow and keep implementation predictable.",
          hindsight:
            "In a next iteration, I would deepen pedagogical metrics and richer tracking states for both managers and learners.",
        },
        result: {
          impact:
            "The case became a strong portfolio piece that shows the ability to connect product experience, backend, and flow modeling in a non-trivial domain.",
          gains:
            "Beyond the technical outcome, it strengthened my repertoire in authentication, interface structure, and modular application design.",
        },
        closing: {
          nextSteps:
            "Natural next steps would include richer tracking dashboards, progression rules, and more advanced engagement mechanics without losing restraint.",
        },
      },
    },
  },
  {
    slug: "abriu-chaveiro",
    locale: {
      pt: {
        context: {
          problem:
            "Um serviço local com demanda urgente perdia espaço nas buscas e não tinha uma presença digital capaz de converter intenção em contato imediato.",
          audience:
            "Pessoas procurando chaveiro 24h em contexto de urgência, com baixa tolerância a ruído, dúvida ou navegação desnecessária.",
          importance:
            "Nesse cenário, confiança, clareza e velocidade têm impacto direto na conversão, então a interface precisava ser objetiva desde o primeiro bloco.",
        },
        solution: {
          product:
            "A solução foi uma landing page direta, orientada a ação, com prova mínima de credibilidade e caminhos curtos para contato.",
          technical:
            "A implementação usou HTML, CSS e JavaScript com endpoint serverless para envio de contato e estrutura amigável para SEO local.",
          architecture:
            "A arquitetura foi pensada para ser enxuta, legível e fácil de manter, sem dependências excessivas para um produto de escopo controlado.",
        },
        execution: {
          challenges:
            "O desafio principal foi equilibrar simplicidade extrema com sinais suficientes de legitimidade para um serviço sensível e emergencial.",
          tradeoffs:
            "Optei por uma base estática e leve, priorizando performance e indexação, em vez de adicionar complexidade desnecessária cedo demais.",
          hindsight:
            "Com mais tempo, eu adicionaria camadas extras de prova social e uma instrumentação melhor de eventos para acompanhar conversão com mais precisão.",
        },
        result: {
          impact:
            "O projeto mostra capacidade de resolver um problema comercial real com foco em SEO, performance e redução de atrito no fluxo de contato.",
          gains:
            "Também reforçou o domínio de decisões pragmáticas para produtos pequenos, onde clareza operacional pesa mais que sofisticação visual.",
        },
        closing: {
          nextSteps:
            "Os próximos passos seriam amadurecer analytics, reforçar prova local e evoluir o backend conforme a operação exigisse mais automação.",
        },
      },
      en: {
        context: {
          problem:
            "A local urgent-service business was losing visibility in search and lacked a digital presence capable of turning intent into immediate contact.",
          audience:
            "People looking for a 24/7 locksmith in urgent situations, with very low tolerance for friction, doubt, or unnecessary navigation.",
          importance:
            "In this context, trust, clarity, and speed directly affect conversion, so the interface had to be objective from the first block.",
        },
        solution: {
          product:
            "The solution was a direct landing page focused on action, with lightweight credibility signals and short paths to contact.",
          technical:
            "The implementation used HTML, CSS, and JavaScript with a serverless contact endpoint and a structure friendly to local SEO.",
          architecture:
            "The architecture was designed to stay lean, readable, and maintainable, without excessive dependencies for a tightly scoped product.",
        },
        execution: {
          challenges:
            "The main challenge was balancing extreme simplicity with enough legitimacy cues for a sensitive, urgent service.",
          tradeoffs:
            "I chose a static and lightweight base, prioritizing performance and indexing over introducing unnecessary complexity too early.",
          hindsight:
            "With more time, I would add stronger social proof layers and better event instrumentation to measure conversion more precisely.",
        },
        result: {
          impact:
            "The project demonstrates the ability to solve a real business problem with focus on SEO, performance, and reduced friction in the contact flow.",
          gains:
            "It also reinforced pragmatic decision-making for small products where operational clarity matters more than visual sophistication.",
        },
        closing: {
          nextSteps:
            "The next steps would be maturing analytics, strengthening local proof, and evolving the backend as the operation required more automation.",
        },
      },
    },
  },
  {
    slug: "martha-izabel",
    locale: {
      pt: {
        context: {
          problem:
            "A marca precisava consolidar presença digital e identidade profissional em um site que transmitisse autoridade sem perder proximidade.",
          audience:
            "Clientes e parceiros em busca de uma estrategista de conteúdo com posicionamento claro, repertório e facilidade de contato.",
          importance:
            "Como o produto era a própria marca pessoal, cada detalhe precisava sustentar credibilidade, clareza de proposta e conversão.",
        },
        solution: {
          product:
            "Estruturei uma vitrine de marca pessoal com narrativa de posicionamento, prova social, serviços e fluxo de contato orientado à conversão.",
          technical:
            "A implementação usou React, TypeScript, Vite, Tailwind, shadcn/ui e framer-motion, com foco em consistência, performance e SEO on-page.",
          architecture:
            "O sistema foi organizado como uma interface modular, com blocos reutilizáveis e decisões visuais sustentadas por uma lógica de design system.",
        },
        execution: {
          challenges:
            "O principal desafio foi traduzir uma identidade acolhedora e humana em um produto digital com estrutura profissional e leitura rápida.",
          tradeoffs:
            "As escolhas visuais e de conteúdo foram calibradas para equilibrar calor humano e rigor de apresentação, evitando excesso decorativo.",
          hindsight:
            "Em uma próxima fase, eu aprofundaria experimentos de conteúdo e medição de conversão por seção para refinar ainda mais a jornada.",
        },
        result: {
          impact:
            "O case demonstra a capacidade de conectar branding, interface e conversão em um produto que serve tanto como vitrine quanto como ferramenta comercial.",
          gains:
            "Também consolidou repertório em design system, hierarquia narrativa, acessibilidade e modelagem de experiências de marca pessoal.",
        },
        closing: {
          nextSteps:
            "Os próximos passos naturais seriam expandir conteúdo estratégico, iterar formulários e evoluir mecanismos de prova social com base em uso real.",
        },
      },
      en: {
        context: {
          problem:
            "The brand needed a stronger digital presence and professional identity through a website that conveyed authority without losing warmth.",
          audience:
            "Clients and partners looking for a content strategist with clear positioning, strong repertoire, and accessible contact paths.",
          importance:
            "Because the product was the personal brand itself, every detail had to support credibility, clarity of offer, and conversion.",
        },
        solution: {
          product:
            "I structured a personal brand showcase with positioning narrative, social proof, service framing, and a conversion-oriented contact flow.",
          technical:
            "The implementation used React, TypeScript, Vite, Tailwind, shadcn/ui, and framer-motion, with focus on consistency, performance, and on-page SEO.",
          architecture:
            "The system was organized as a modular interface, with reusable blocks and visual decisions sustained by design-system logic.",
        },
        execution: {
          challenges:
            "The main challenge was translating a warm, human identity into a digital product with professional structure and fast reading.",
          tradeoffs:
            "Visual and content choices were calibrated to balance human warmth and presentation rigor, avoiding decorative excess.",
          hindsight:
            "In a next phase, I would deepen content experiments and section-level conversion measurement to refine the journey further.",
        },
        result: {
          impact:
            "The case demonstrates the ability to connect branding, interface, and conversion in a product that works both as a showcase and as a commercial tool.",
          gains:
            "It also consolidated experience in design systems, narrative hierarchy, accessibility, and personal-brand experience modeling.",
        },
        closing: {
          nextSteps:
            "Natural next steps would be expanding strategic content, iterating forms, and evolving social-proof mechanisms based on real usage.",
        },
      },
    },
  },
];

export const getLocalizedProjectCaseBySlug = (
  slug: string,
  lang: Lang,
): LocalizedProjectCase | undefined => {
  const summary = getLocalizedProjectSummaries(lang).find((project) => project.slug === slug);
  const detail = projectCaseDetails.find((project) => project.slug === slug);

  if (!summary || !detail) {
    return undefined;
  }

  return {
    ...summary,
    ...detail.locale[lang],
  };
};

export const getProjectCaseDefinitionBySlug = (slug: string) => {
  const summary = findProjectSummaryBySlug(slug);
  const detail = projectCaseDetails.find((project) => project.slug === slug);

  if (!summary || !detail) {
    return undefined;
  }

  return { summary, detail };
};
