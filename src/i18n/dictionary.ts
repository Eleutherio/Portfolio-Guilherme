export type Lang = "pt" | "en";

export const dictionary = {
  pt: {
    nav: {
      inicio: "início",
      sobre: "sobre",
      projetos: "projetos",
      habilidades: "habilidades",
      depoimentos: "depoimentos",
      processo: "processo",
      tecnologias: "tecnologias",
      trajetoria: "trajetória",
      contratar: "contratar",
      contato: "contato",
      talk: "Entre em contato",
      menu: "Menu",
    },
    cursor: {
      open: "Abrir",
      destinations: {
        home: "a página inicial",
        about: "minha trajetória",
        projects: "meus projetos",
        capabilities: "minhas habilidades",
        testimonials: "os depoimentos",
        contact: "a seção de contato",
        accessibility: "a página de acessibilidade",
        privacy: "o aviso de privacidade",
        resume: "meu currículo",
        email: "uma nova mensagem de e-mail",
        whatsapp: "uma conversa no WhatsApp",
        github: "meu perfil no GitHub",
        linkedin: "meu perfil no LinkedIn",
        greenHosting: "a verificação de hospedagem verde",
        project: "o projeto",
        photo: "a foto",
        repository: "o repositório de",
        section: "a seção:",
        googlePrivacy: "a Política de Privacidade do Google",
        googleTerms: "os Termos de Serviço do Google",
        content: "o conteúdo principal",
        external: "o link externo",
      },
    },
    hero: {
      headline:
        "Tecnologia para conectar pessoas, ideias e negócios.\nProgramação, análise de software e serviços de TI.",
      headlineHighlight: "Guilherme Eleuthério",
      carousel1: ["sistemas", "websites", "aplicativos"],
      carousel2: [
        "arquitetura escalável & tecnologia moderna",
        "responsividade & acessibilidade",
        "segurança & normas da LGPD",
      ],
      cta1: "Ver projetos",
      cta2: "Baixar currículo (PDF)",
      cta3: "Entre em contato",
      resumeUrl: "/curriculo.pdf",
      video: {
        play: "Reproduzir vídeo",
        pause: "Pausar vídeo",
        resume: "Retomar vídeo",
        unavailable: "Vídeo indisponível",
        retry: "Tentar reproduzir o vídeo novamente",
      },
      proofBar: [
        "Foco full-stack",
        "React / TypeScript / Django",
        "Case studies de portfólio",
        "Aberto a estágio / vagas júnior",
      ],
      stats: {
        commitsLabel: "commits",
        commitsLoading: "carregando commits",
        commitsUnavailable: "commits indisponíveis",
        coffeeOffer: "Oferecer um café",
        coffeeThanks: "Obrigado pelo café",
        coffeeThanksIcon: "Obrigado pelo café ☕",
        coffeeExplanation: "Total de visitantes que pegaram um café.",
        coffeeSingular: "café",
        coffeePlural: "cafés",
        coffeeLoading: "carregando cafés",
        coffeeUnavailable: "cafés indisponíveis",
      },
    },

    about: {
      title: "Quem sou, o que faço e por quê",
      photos: {
        label: "Registros da minha formação e vida pessoal",
        currentAlt: "Guilherme Eleuthério usando fones de ouvido.",
        featuredAlt: "Guilherme apresentando o projeto GrenGame com um microfone.",
        workbenchAlt: "Notebooks desmontados durante a recuperação após a enchente.",
        campusAlt: "Fachada iluminada do Espaço Unisinos durante a noite.",
        classroomAlt: "Encontro da Residência TIC55 em uma sala da Unisinos.",
        kitAlt: "Kit da Residência TIC55 com mochila, notebook, caderno e periféricos.",
        catAlt: "Gata preta deitada em uma caixa de madeira.",
      },
      greeting: "Olá, eu me chamo",
      introductionName: "Guilherme Eleuthério",
      profileRole: "Sou desenvolvedor full-stack",
      teaserLabel: "Um pouco sobre mim",
      teaserBody:
        "Sou bolsista do ProUni, participei de diversos programas de desenvolvimento em tecnologia e informação e atuo no planejamento e desenvolvimento de aplicações digitais.",
      workLabel: "Meu resumo profissional",
      resumeSummary:
        "Detalhei minha trajetória profissional e educacional em um currículo para download em PDF.",
      socialLabel: "Minhas redes sociais",
      mobileLearnMore: "Saiba mais sobre mim",
      coffeeInvite: "Visitante? Pegue um café!",
      techStackTitle: "Tecnologias que uso no meu trabalho:",
      techStackCategories: {
        frontend: "Front-end",
        backend: "Back-end",
        database: "Bancos de dados",
        software: "Infraestrutura e ferramentas",
      },
      statsLabel: "Indicadores de trajetória",
      story: {
        albumLabel: "Álbum de fotos",
        selectorLabel: "Selecionar foto",
        showPhotoLabel: "Exibir foto",
        photoPosition: "Foto {current} de {total}.",
        chapterTitles: [
          "Educação e formação",
          "Tecnologia desde cedo",
          "Responsabilidade profissional",
          "Objetivo profissional",
        ],
        paragraphs: [
          "Minha trajetória começou na escola pública e sempre foi norteada pela educação e pelo comprometimento, que hoje são os dois pilares da minha vida. Atualmente, curso Análise e Desenvolvimento de Sistemas na Unisinos por meio do ProUni e venho complementando essa formação com projetos práticos, cursos e experiências que consigo conquistar.",
          "Desde muito novo, eu já gostava de tecnologia. Por volta de 2010, desmontava computadores DDR2, quebrava — muito — a cabeça tentando instalar programas de computador e tentando fazer a internet de modem ficar mais rápida. Desde então, sou a pessoa da minha família que resolve tudo o que tange à tecnologia. Não importa se é um notebook ou uma panela elétrica: aparentemente, é tudo TI, rs.",
          "Foi assumindo responsabilidades desde cedo que hoje percebo a importância de um olhar mais crítico sobre o trabalho que realizo: analisar por que e como fazemos, entender o contexto antes de produzir, jamais pular etapas e sempre manter o objetivo de produzir qualidade, segurança e valor alinhados às expectativas das pessoas.",
        ],
        quoteIntro:
          "Isso me remete a algo que ouvi de um professor durante uma aula da graduação e nunca mais esqueci:",
        quote:
          "O Desenvolvedor de Software tem tanta responsabilidade quanto o Médico, o Juiz ou o Policial: é ele quem trabalha para evitar uma pane em um sistema de ABS, nos aviônicos de uma aeronave ou no marcapasso de alguma pessoa… e é importante vocês entenderem isso.",
        closing:
          "Por fim, meu maior objetivo é me tornar um profissional de excelência técnica e interpessoal, assumindo responsabilidades cada vez maiores e realizando um trabalho do qual eu possa me orgulhar, tanto pela qualidade daquilo que entrego quanto pela forma como trato as pessoas durante o caminho.",
      },
      learnMore: "Conhecer minha trajetória",
      backHome: "voltar para o início",
    },

    projects: {
      featured: "destaque",
      title:
        "Cases selecionados que detalham o contexto, as escolhas feitas e as entregas finais de cada projeto.",
      repo: "repositório",
      demo: "ver projeto",
      typeLabel: "tipo",
      evidenceLabel: "evidências técnicas",
      openPreview: "Abrir projeto",
      swipeHint: "Deslize para o lado",
      clickHint: "Clique para saber mais",
      caseStudy: "Ver case study",
      live: "Ver ao vivo",
    },
    caseStudy: {
      back: "ver todos os cases",
      stackLabel: "stack",
      grengame: {
        directCta: "Acessar demonstração",
        directMeta: "demonstração pública",
        navigationLabel: "Navegação do case GrenGame",
        overview: "Visão geral",
        problemTitle: "O problema",
        documentationTitle: "Documentação",
        documentationLabel: "documentação do projeto",
        navigation: {
          overview: "visão geral",
          context: "contexto",
          problem: "problema",
          process: "processo",
          outcomes: "resultado",
        },
        media: {
          classroom: {
            alt: "Sala de aula da Residência TIC55 com participantes trabalhando em notebooks.",
            caption: "Atividade presencial durante a Residência TIC55.",
          },
          passwordReset: {
            alt: "Protótipo do GrenGame exibindo o fluxo de redefinição de senha com código de verificação.",
            caption: "Protótipo do fluxo de redefinição de senha do GrenGame.",
          },
          navigation: {
            alt: "Interface do GrenGame com o menu de cursos, progresso, ranking, perfil e relatórios.",
            caption: "Navegação principal do GrenGame durante o desenvolvimento.",
          },
          presentation: {
            alt: "Guilherme apresentando o projeto GrenGame com um microfone.",
            caption: "Apresentação do GrenGame na etapa final da Residência TIC55. - março/2026",
          },
        },
      },
      contextTitle: "Contexto",
      contextProblem: "Qual era o problema",
      contextAudience: "Para quem era",
      contextImportance: "Por que o projeto importava",
      solutionTitle: "Solução",
      solutionProduct: "Decisões de produto",
      solutionTechnical: "Decisões técnicas",
      solutionArchitecture: "Arquitetura ou fluxo principal",
      executionTitle: "Execução",
      executionChallenges: "Desafios reais",
      executionTradeoffs: "Trade-offs",
      executionHindsight: "O que eu faria diferente hoje",
      resultTitle: "Resultado",
      resultImpact: "Impacto percebido",
      resultGains: "Ganhos em conversão, SEO, clareza, performance ou organização",
      closingTitle: "Encerramento",
      closingNextSteps: "Próximos passos",
      contactPrompt: {
        text: "Ficou interessado em algum destes cases ou quer tirar alguma dúvida?",
        cta: "Entrar em contato",
      },
      nextSteps: {
        title: "Continue explorando",
        subtitle: "Três caminhos para seguir a conversa.",
        metaPrev: "case anterior",
        metaNext: "próximo case",
        metaAll: "todos os cases",
        metaHome: "voltar ao início",
        all: "Ver todos os cases",
        home: "Voltar ao início",
      },
    },
    skills: {
      title: "Serviços",
      intro: [
        "Realizo uma ampla variedade de serviços em TI e sistemas, sempre com qualidade e comprometimento.",
      ],
      services: [
        {
          title: "Websites e aplicações de web",
          description:
            "Criação de websites comerciais, locais, portfólios, landing pages e aplicações web em geral, sempre observando o melhor formato e tecnologia para cada caso.",
        },
        {
          title: "Integrações e automações",
          description:
            "Sou apto a integrar diversos sistemas, como um checkout, o WhatsApp ou um e-commerce. Basta me dizer o que precisa. Também posso oferecer automações nesses processos e reduzir trabalhos manuais.",
        },
        {
          title: "Análise de SEO e indexação orgânica",
          description:
            "Seu negócio não aparece na busca do Google? Existem vários fatores para que isso possa estar acontecendo. Investigo de ponta a ponta o seu site e proponho um plano de ação para otimizá-lo.",
        },
        {
          title: "Suporte em TI",
          description:
            "Te ajudo com manutenção de computadores, instalação de programas e orientação na escolha de equipamentos.",
        },
      ],
      knowledgeTitle: "Princípios de desenvolvimento",
      marquee: {
        drag: "Arraste para explorar",
        keyboard: "Use as setas para navegar e a barra de espaço para pausar.",
        previous: "Ver princípios anteriores",
        next: "Ver próximos princípios",
        pause: "Pausar movimento dos princípios",
        resume: "Retomar movimento dos princípios",
        carousel: "carrossel",
      },
      knowledgeIntro: "Métodos e boas práticas profissionais que aplico em todos os trabalhos.",
      knowledge: [
        {
          title: "Briefing inicial",
          description:
            "Procuro entender o que você deseja resolver, entender o contexto do seu negócio, e onde exatamente devemos trabalhar. Tudo através de uma reunião ou um documento de briefing.",
        },
        {
          title: "Testes, análise de performance e segurança",
          description:
            "Estudo constantemente melhorias para aplicar em meus trabalhos. Cada etapa de desenvolvimento é estudada, aplicada, testada e documentada.",
        },
        {
          title: "Uso de inteligência artificial",
          description:
            "Entendo como LLMs funcionam e como extrair o máximo dessas ferramentas. No contexto de trabalho, utilizo fluxos já testados para otimizar o tempo e entregar melhor qualidade.",
        },
        {
          title: "Responsividade, acessibilidade e compliance",
          description:
            "Seja em projetos novos ou em produção, analiso e apresento melhorias de usabilidade com foco nos seus usuários, sempre dentro da realidade do seu negócio.",
        },
        {
          title: "Privacidade e proteção de dados",
          description:
            "Realizo adequação às leis da LGPD no Brasil ou GDPR na Europa. Garanto transparência do uso de dados coletados, integridade das informações e aplico gestão de consentimento pelo usuário.",
        },
        {
          title: "Foco em resultados",
          description:
            "Sigo um fluxo de trabalho focado em entregas e validações, sempre mantendo alinhada a expectativa com as entregas.",
        },
      ],
    },

    testimonials: {
      title: "Alguns depoimentos de quem conhece o meu trabalho.",
      authorLabel: "Autoria",
      workplaceBrandAlt: "Identidade visual do local de trabalho de {name}",
      carouselLabel: "carrossel de depoimentos",
      previousLabel: "Exibir depoimento anterior",
      nextLabel: "Exibir próximo depoimento",
      pauseAutoplayLabel: "Pausar rotação automática dos depoimentos",
      resumeAutoplayLabel: "Retomar rotação automática dos depoimentos",
      scrollQuoteLabel: "Depoimento longo. Role para continuar lendo.",
      selectLabel: "Exibir depoimento {number}",
      photoAlt: "Foto de {name}",
      linkedinLabel: "Abrir o perfil de {name} no LinkedIn",
    },

    timeline: {
      title: "Trajetória",
      stats: {
        trainingHours: "de formação complementar",
        trainingPrograms: "programas de formação e certificação",
        professionalExperiences: "experiências profissionais",
        englishLevel: "inglês técnico",
      },
      items: [
        {
          period: "2023",
          type: "programa de educação · 290h",
          org: "Programa Oracle Next Education (ONE) — Alura & Oracle",
          title: "Primeiro contato com programação",
          description:
            "Primeiro contato estruturado com programação junto ao time LATAM da Alura, cobrindo algoritmo, lógica, POO e inglês aplicado à tecnologia.",
          evidence: [
            "Base sólida em lógica e POO",
            "Leitura técnica em inglês",
            "Hábito de estudo estruturado e contínuo",
          ],
        },
        {
          period: "2023",
          type: "trabalho voluntário",
          org: "ADEVIC — Associação dos Deficientes Visuais de Canoas",
          title: "Reformulação da página de doações",
          description:
            "Reformulei a página de doações da ONG aplicando boas práticas de acessibilidade digital, reorganizando código legado e refinando o visual com noções de design e usabilidade.",
          evidence: [
            "Refactor de código legado",
            "Aplicação de acessibilidade digital",
            "Melhorias visuais guiadas por UX",
          ],
        },
        {
          period: "2025 — presente",
          type: "graduação",
          org: "Universidade do Vale do Rio dos Sinos — Unisinos",
          title: "Análise e Desenvolvimento de Sistemas",
          description:
            "Graduação tecnológica focada em concepção e execução de todas as etapas do desenvolvimento, da análise de requisitos à documentação.",
          evidence: [
            "Fundamentos de engenharia de software",
            "Modelagem e análise de requisitos",
            "Documentação técnica de projetos",
          ],
        },
        {
          period: "2025",
          type: "etapa de nivelamento · 180h",
          org: "Residência TIC55 — Unisinos, Brisa & MCTI / Gov.",
          title: "Apoio à recuperação do Rio Grande do Sul",
          description:
            "Atuei em ambiente prático de apoio, lidando com demandas reais de usuários, rotinas de troubleshooting e comunicação operacional durante a etapa de nivelamento da residência.",
          evidence: [
            "Diagnóstico de problemas sob pressão",
            "Prática de suporte a usuários",
            "Documentação e rotina de escalonamento",
          ],
        },
        {
          period: "2026",
          type: "projeto · 480h",
          org: "Residência TIC55 — Unisinos, Brisa & MCTI / Gov.",
          title: "GrenGame — imersão prática",
          description:
            "Selecionado entre os 50 melhores candidatos para a imersão prática. Seis meses de desenvolvimento end-to-end com orientação presencial, construindo uma PWA gamificada de treinamentos corporativos para empresa parceira.",
          evidence: [
            "Desenvolvimento fullstack end-to-end",
            "Atuação como product owner",
            "Code review em equipe",
          ],
        },
        {
          period: "2026",
          type: "projeto",
          org: "Cliente real",
          title: "Abriu Chaveiro & Cia",
          description:
            "Site institucional para cliente real, focado em presença digital com prova social, SEO orgânico e e-mail transacional de orçamentos.",
          evidence: [
            "SEO local on-page",
            "API serverless de contato",
            "Performance e mobile-first",
          ],
        },
      ],
    },
    whyHire: {
      tag: "Por que me contratar",
      titleA: "Por que escolher alguém que pensa além do código?",
      reasons: [
        {
          label: "código & arquitetura",
          title: "Código sustentável",
          text: "Priorizo estrutura clara, nomes previsíveis e componentes reutilizáveis para que o projeto evolua sem virar frágil.",
        },
        {
          label: "produto & processo",
          title: "Visão de produto e processo",
          text: "Penso além da tela: fluxo de usuário, casos-limite, documentação, manutenibilidade e restrições de entrega.",
        },
        {
          label: "IA no dia a dia",
          title: "Uso responsável de IA",
          text: "Uso IA para acelerar pesquisa, refactor e validação, mantendo ownership técnico sobre as decisões finais.",
        },
      ],
    },

    contact: {
      title: "Vamos conversar?",
      lead: "Fique à vontade para falar sobre algum projeto ou tirar qualquer dúvida. Estou aberto para novas oportunidades.",
      primaryLabel: "Você também me encontra em:",
      formAriaLabel: "Formulário de contato",
      faq: {
        title: "Perguntas frequentes",
        items: [
          {
            question: "Que tipo de projeto você desenvolve?",
            answer:
              "Aplicações web e soluções digitais de ponta a ponta, da interface às APIs e aos dados.",
          },
          {
            question: "Você trabalha com projetos já existentes?",
            answer:
              "Sim. Analiso a base atual, documento riscos e evoluo o produto sem exigir uma reconstrução completa.",
          },
          {
            question: "Como você organiza o desenvolvimento?",
            answer:
              "Trabalho com especificações, planejamento e entregas verificáveis para manter escopo, decisões e progresso claros.",
          },
          {
            question: "Como segurança e LGPD entram no projeto?",
            answer:
              "Reviso coleta de dados, acessos, validações e retenção desde o planejamento, conforme o risco e o contexto do negócio.",
          },
          {
            question: "Para quem seu trabalho é indicado?",
            answer:
              "Principalmente para pequenas e médias empresas que precisam transformar necessidades reais em soluções digitais claras e sustentáveis.",
          },
        ],
      },
      form: {
        name: "// seu nome",
        namePh: "Como você se chama?",
        email: "// seu e-mail",
        emailPh: "exemplo@exemplo.com",
        subject: "// assunto (opcional)",
        subjectPh: "Sobre o que vamos tratar?",
        message: "// mensagem",
        messagePh: "Escreva a sua mensagem...",
        submit: "Enviar mensagem",
        submitting: "Enviando…",
        success: "Mensagem enviada. Respondo em breve.",
        error: "Algo deu errado. Tente de novo ou me chame no WhatsApp.",
        recaptchaNotice: "Protegido por reCAPTCHA.",
        recaptchaPrivacy: "Política de Privacidade do Google",
        recaptchaJoin: "e os",
        recaptchaTerms: "Termos de Serviço se aplicam",
        sitePrivacyPrefix: "Ao enviar, você declara estar ciente do",
        sitePrivacy: "Aviso de privacidade",
      },
    },
    footer: {
      localTimeLabel: "Hora local",
      thanks: "Obrigado pela visita!",
      location: "Brasil - Porto Alegre, RS",
      navigationLabel: "Explore a página",
      home: "início",
      skills: "habilidades",
      testimonials: "depoimentos",
      legalLabel: "Informações legais",
      accessibility: "Acessibilidade",
      privacy: "Privacidade",
      greenHostingBadgeAlt: "Este site usa hospedagem verde, verificada pela Green Web Foundation",
      vitalsLabel: "Core Web Vitals",
      infraLabel: "infra",
      uptimeLabel: "sessão",
      backend: "Backend",
      database: "Database",
      mail: "SMTP service",
      captcha: "reCAPTCHA v3",
      serviceStatus: {
        checking: "verificando",
        operational: "operacional",
        unavailable: "indisponível",
      },
      infrastructureExplain: {
        backend: "Indica se a API do site está respondendo normalmente.",
        database: "Indica se o armazenamento e a leitura de dados estão disponíveis.",
        smtp: "Indica se o serviço responsável pelo envio de mensagens está disponível.",
        recaptcha: "Indica se a proteção contra envios automatizados está disponível.",
      },
      vitalsExplain: {
        LCP: "Mede quanto tempo leva para o maior elemento visível aparecer. Um bom resultado fica abaixo de 2,5 segundos.",
        INP: "Mede o tempo de resposta da interface à interação mais lenta. Um bom resultado fica abaixo de 200 milissegundos.",
        CLS: "Mede mudanças inesperadas de posição dos elementos. Um bom resultado fica abaixo de 0,1.",
        FPS: "Mede a fluidez da animação em quadros por segundo. O objetivo é 60.",
        session:
          "Mostra há quanto tempo esta página está aberta nesta aba. Não indica disponibilidade do servidor.",
      },
    },

    a11y: {
      skipToContent: "Pular para o conteúdo",
      homeLink: "Guilherme Ferreira — início",
      primaryNavigation: "Navegação principal",
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
    },
    accessibility: {
      title: "Acessibilidade",
      statusLabel: "Status da avaliação",
      status: "Avaliação WCAG 2.2 AA em andamento",
      intro:
        "Este portfólio está passando por uma avaliação formal de acessibilidade. A conformidade ainda não é declarada enquanto existirem testes manuais ou automatizados pendentes.",
      commitmentTitle: "Compromisso",
      commitmentBody:
        "A interface deve funcionar por padrão com teclado, leitores de tela, ampliação, alto contraste e diferentes dispositivos. O menu de acessibilidade é complementar e não substitui esses requisitos.",
      scopeTitle: "Escopo avaliado",
      scopeItems: [
        "Páginas inicial, sobre, acessibilidade e privacidade",
        "Cases GrenGame, Abriu Chaveiro e Martha Izabel",
        "Formulário de contato e seus estados",
        "Menu de acessibilidade e variações responsivas",
      ],
      methodsTitle: "Métodos de avaliação",
      methodsItems: [
        "axe-core e ASES",
        "Navegação completa por teclado",
        "NVDA, TalkBack ou VoiceOver",
        "Zoom de 200%, reflow e espaçamento textual",
        "Forced Colors, temas e redução de movimento",
      ],
      limitationsTitle: "Pendências atuais",
      limitationsBody:
        "ASES na URL publicada, validação em leitores de tela e dispositivos reais e revisão manual de todos os critérios A e AA. O currículo em PDF é um documento separado, fora deste escopo, e sua acessibilidade permanece como melhoria independente.",
      feedbackTitle: "Encontrou uma barreira?",
      feedbackBody:
        "Descreva a página, o dispositivo e a dificuldade encontrada. Isso ajuda a reproduzir e corrigir o problema.",
      feedbackCta: "Relatar barreira por e-mail",
      updatedLabel: "Última atualização",
    },
    errors: {
      notFoundKicker: "404",
      notFoundTitle: "Página não encontrada",
      notFoundBody: "Essa rota não existe ou foi movida.",
      notFoundCta: "Voltar para o início",
      boundaryTitle: "Essa página não carregou",
      boundaryBody: "Algo deu errado. Você pode tentar novamente ou voltar ao início.",
      boundaryRetry: "Tentar de novo",
      boundaryHome: "Início",
    },

    nextSteps: {
      title: "Continue explorando",
      subtitle: "Três caminhos para seguir a conversa.",
      items: [
        { label: "Ver projetos", href: "/#projetos", meta: "case studies" },
        { label: "Voltar ao início", href: "/", meta: "home" },
        { label: "Entrar em contato", href: "/#contato", meta: "contato" },
      ],
    },
    toggles: {
      langLabel: "Mudar idioma",
      themeToLight: "Mudar para tema claro",
      themeToDark: "Mudar para tema escuro",
      backToTop: "Voltar ao topo",
    },
  },
  en: {
    nav: {
      inicio: "home",
      sobre: "about",
      projetos: "projects",
      habilidades: "capabilities",
      depoimentos: "testimonials",
      processo: "process",
      tecnologias: "stack",
      trajetoria: "journey",
      contratar: "hire_me",
      contato: "contact",
      talk: "Get in touch",
      menu: "Menu",
    },
    cursor: {
      open: "Open",
      destinations: {
        home: "the home page",
        about: "my story",
        projects: "my projects",
        capabilities: "my capabilities",
        testimonials: "the testimonials",
        contact: "the contact section",
        accessibility: "the accessibility page",
        privacy: "the privacy notice",
        resume: "my résumé",
        email: "a new email message",
        whatsapp: "a WhatsApp conversation",
        github: "my GitHub profile",
        linkedin: "my LinkedIn profile",
        greenHosting: "the green-hosting verification",
        project: "project",
        photo: "photo",
        repository: "the repository for",
        section: "the section:",
        googlePrivacy: "Google's Privacy Policy",
        googleTerms: "Google's Terms of Service",
        content: "the main content",
        external: "the external link",
      },
    },
    hero: {
      headline:
        "Innovation, strategy, and software development.\nProgramming, software analysis and IT services.",
      headlineHighlight: "Guilherme Eleuthério",
      carousel1: ["systems", "websites", "apps"],
      carousel2: [
        "scalable architecture & modern technology",
        "responsiveness & accessibility",
        "security & LGPD compliance",
      ],
      cta1: "View projects",
      cta2: "Download resume (PDF)",
      cta3: "Contact me",
      resumeUrl: "/curriculo.pdf",
      video: {
        play: "Play video",
        pause: "Pause video",
        resume: "Resume video",
        unavailable: "Video unavailable",
        retry: "Retry video playback",
      },
      proofBar: [
        "Full-stack focus",
        "React / TypeScript / Django",
        "Portfolio case studies",
        "Open to internship / junior roles",
      ],
      stats: {
        commitsLabel: "commits",
        commitsLoading: "loading commits",
        commitsUnavailable: "commits unavailable",
        coffeeOffer: "Buy me a coffee",
        coffeeThanks: "Thanks for the coffee",
        coffeeThanksIcon: "Thanks for the coffee ☕",
        coffeeExplanation: "Total visitors who grabbed a coffee.",
        coffeeSingular: "coffee",
        coffeePlural: "coffees",
        coffeeLoading: "loading coffees",
        coffeeUnavailable: "coffees unavailable",
      },
    },

    about: {
      title: "Who I am, what I do, and why",
      photos: {
        label: "Moments from my education and personal life",
        currentAlt: "Guilherme Eleuthério wearing headphones.",
        featuredAlt: "Guilherme presenting the GrenGame project with a microphone.",
        workbenchAlt: "Disassembled laptops during recovery work after the flood.",
        campusAlt: "Illuminated facade of Espaço Unisinos at night.",
        classroomAlt: "TIC55 Residency meeting in a classroom at Unisinos.",
        kitAlt: "TIC55 Residency kit with a backpack, laptop, notebook and peripherals.",
        catAlt: "Black cat lying in a wooden box.",
      },
      greeting: "Hello, my name is",
      introductionName: "Guilherme Eleuthério",
      profileRole: "I am a full-stack developer",
      teaserLabel: "A little about me",
      teaserBody:
        "I am a ProUni scholarship recipient, have participated in various technology and information development programs, and work on the planning and development of digital applications.",
      workLabel: "My professional summary",
      resumeSummary:
        "I detailed my professional and educational journey in a résumé available for download as a PDF.",
      socialLabel: "My social networks",
      mobileLearnMore: "Learn more about me",
      coffeeInvite: "Visitor? Grab a coffee!",
      techStackTitle: "Technologies I use in my work:",
      techStackCategories: {
        frontend: "Frontend",
        backend: "Backend",
        database: "Databases",
        software: "Infrastructure and tools",
      },
      statsLabel: "Journey indicators",
      story: {
        albumLabel: "Photo album",
        selectorLabel: "Select photo",
        showPhotoLabel: "Show photo",
        photoPosition: "Photo {current} of {total}.",
        chapterTitles: [
          "Education and learning",
          "Technology from an early age",
          "Professional responsibility",
          "Professional goal",
        ],
        paragraphs: [
          "My journey began in public school and has always been guided by education and commitment, which are now the two pillars of my life. I am currently studying Systems Analysis and Development at Unisinos through ProUni, while complementing my degree with practical projects, courses and every experience I am able to pursue.",
          "I have been interested in technology from a very young age. Around 2010, I was taking apart DDR2 computers, spending a lot of time trying to install software and looking for ways to make my modem internet connection faster. Since then, I have been the person in my family who solves anything related to technology. It does not matter whether it is a laptop or an electric cooker: apparently, it is all IT.",
          "Taking on responsibilities from an early age made me realize the importance of looking critically at the work I do: examining why and how things are done, understanding the context before producing, never skipping steps and always aiming to deliver quality, security and value aligned with people's expectations.",
        ],
        quoteIntro:
          "That reminds me of something one of my university professors said and that I have never forgotten:",
        quote:
          "A software developer carries as much responsibility as a doctor, a judge or a police officer. Developers work to prevent failures in an ABS system, an aircraft's avionics or a person's pacemaker… and it is important that you understand that.",
        closing:
          "Ultimately, my main goal is to become a professional known for both technical and interpersonal excellence, taking on increasingly greater responsibilities and doing work I can be proud of, both for the quality of what I deliver and for the way I treat people along the way.",
      },
      learnMore: "Explore my journey",
      backHome: "back to home",
    },

    projects: {
      featured: "featured",
      title:
        "Selected case studies detailing the context, the choices made, and the final deliverables for each project.",
      repo: "repository",
      demo: "view project",
      typeLabel: "type",
      evidenceLabel: "technical evidence",
      openPreview: "Open project",
      swipeHint: "Swipe to the side",
      clickHint: "Click to learn more",
      caseStudy: "View case study",
      live: "Live demo",
    },
    caseStudy: {
      back: "view all cases",
      stackLabel: "stack",
      grengame: {
        directCta: "Open live demo",
        directMeta: "public demonstration",
        navigationLabel: "GrenGame case study navigation",
        overview: "Overview",
        problemTitle: "The problem",
        documentationTitle: "Documentation",
        documentationLabel: "project documentation",
        navigation: {
          overview: "overview",
          context: "context",
          problem: "problem",
          process: "process",
          outcomes: "outcomes",
        },
        media: {
          classroom: {
            alt: "TIC55 Residency classroom with participants working on laptops.",
            caption: "In-person activity during the TIC55 Residency.",
          },
          passwordReset: {
            alt: "GrenGame prototype showing the password reset flow with a verification code.",
            caption: "Prototype of the GrenGame password reset flow.",
          },
          navigation: {
            alt: "GrenGame interface with courses, progress, ranking, profile, and reports navigation.",
            caption: "GrenGame main navigation during development.",
          },
          presentation: {
            alt: "Guilherme presenting the GrenGame project with a microphone.",
            caption:
              "GrenGame presentation in the final stage of the TIC55 Residency. - March/2026",
          },
        },
      },
      contextTitle: "Context",
      contextProblem: "What was the problem",
      contextAudience: "Who it was for",
      contextImportance: "Why the project mattered",
      solutionTitle: "Solution",
      solutionProduct: "Product decisions",
      solutionTechnical: "Technical decisions",
      solutionArchitecture: "Architecture or main flow",
      executionTitle: "Execution",
      executionChallenges: "Real challenges",
      executionTradeoffs: "Trade-offs",
      executionHindsight: "What I would do differently today",
      resultTitle: "Result",
      resultImpact: "Perceived impact",
      resultGains: "Gains in conversion, SEO, clarity, performance, or organization",
      closingTitle: "Closing",
      closingNextSteps: "Next steps",
      contactPrompt: {
        text: "Interested in any of these cases or have a question?",
        cta: "Get in touch",
      },
      nextSteps: {
        title: "Keep exploring",
        subtitle: "Three ways to continue the conversation.",
        metaPrev: "previous case",
        metaNext: "next case",
        metaAll: "all cases",
        metaHome: "back to home",
        all: "View all cases",
        home: "Back to home",
      },
    },
    skills: {
      title: "Services",
      intro: [
        "I provide a wide range of IT and software services, always with a focus on quality and commitment.",
      ],
      services: [
        {
          title: "Websites and web applications",
          description:
            "Business websites, local business sites, portfolios, landing pages, and web applications, with the format and technology best suited to each project.",
        },
        {
          title: "Integrations and automation",
          description:
            "I can integrate a variety of systems, such as a checkout, WhatsApp, or an e-commerce platform. Just tell me what you need. I can also automate these processes to reduce manual work.",
        },
        {
          title: "SEO and organic indexing analysis",
          description:
            "Is your business missing from Google search results? There are several possible reasons. I review your website from end to end and propose an action plan to optimize it.",
        },
        {
          title: "IT support",
          description:
            "I can help you with computer maintenance, software installation, and choosing equipment.",
        },
      ],
      knowledgeTitle: "Development principles",
      marquee: {
        drag: "Drag to explore",
        keyboard: "Use the arrow keys to navigate and the space bar to pause.",
        previous: "View previous principles",
        next: "View next principles",
        pause: "Pause principles motion",
        resume: "Resume principles motion",
        carousel: "carousel",
      },
      knowledgeIntro: "Methods and professional best practices I apply to every project.",
      knowledge: [
        {
          title: "Initial briefing",
          description:
            "I start by understanding what you want to solve, the context of your business, and exactly where we need to focus. We work through this in a meeting or a briefing document.",
        },
        {
          title: "Testing, performance analysis, and security",
          description:
            "I continually research improvements to apply to my work. Each stage of development is studied, implemented, tested, and documented.",
        },
        {
          title: "Using artificial intelligence",
          description:
            "I understand how LLMs work and how to get the most out of these tools. In my work, I use established workflows to save time and deliver better quality.",
        },
        {
          title: "Responsive design, accessibility, and compliance",
          description:
            "For both new projects and live products, I analyze and propose usability improvements focused on your users, always taking your business context into account.",
        },
        {
          title: "Privacy and data protection",
          description:
            "I adapt projects to Brazil’s LGPD or Europe’s GDPR. I ensure transparency about how collected data is used, maintain information integrity, and implement user consent management.",
        },
        {
          title: "Focus on results",
          description:
            "I follow a workflow focused on deliverables and validation, keeping expectations aligned with what is delivered.",
        },
      ],
    },

    testimonials: {
      title: "A few testimonials from people who know my work.",
      authorLabel: "Author",
      workplaceBrandAlt: "Visual identity of {name}’s workplace",
      carouselLabel: "testimonial carousel",
      previousLabel: "Show previous testimonial",
      nextLabel: "Show next testimonial",
      pauseAutoplayLabel: "Pause automatic testimonial rotation",
      resumeAutoplayLabel: "Resume automatic testimonial rotation",
      scrollQuoteLabel: "Long testimonial. Scroll to continue reading.",
      selectLabel: "Show testimonial {number}",
      photoAlt: "Photo of {name}",
      linkedinLabel: "Open {name}’s LinkedIn profile",
    },

    timeline: {
      title: "Journey",
      stats: {
        trainingHours: "of complementary training",
        trainingPrograms: "training and certification programs",
        professionalExperiences: "professional experiences",
        englishLevel: "technical English",
      },
      items: [
        {
          period: "2023",
          type: "education program · 290h",
          org: "Oracle Next Education (ONE) — Alura & Oracle",
          title: "First contact with programming",
          description:
            "Structured first contact with programming with Alura's LATAM team, covering algorithms, logic, OOP and tech-applied English.",
          evidence: [
            "Solid foundation in logic and OOP",
            "Technical reading in English",
            "Structured, continuous study habit",
          ],
        },
        {
          period: "2023",
          type: "volunteer work",
          org: "ADEVIC — Visually Impaired Association of Canoas",
          title: "Donations page redesign",
          description:
            "Redesigned the NGO's donations page applying digital accessibility best practices, reorganizing legacy code and refining the visuals with design and usability principles.",
          evidence: [
            "Legacy code refactor",
            "Digital accessibility applied",
            "Visual improvements guided by UX",
          ],
        },
        {
          period: "2025 — present",
          type: "degree",
          org: "Universidade do Vale do Rio dos Sinos — Unisinos",
          title: "Systems Analysis & Development",
          description:
            "Tech degree focused on conception and execution of every development stage, from requirements analysis to documentation.",
          evidence: [
            "Software engineering fundamentals",
            "Requirements modeling and analysis",
            "Technical project documentation",
          ],
        },
        {
          period: "2025",
          type: "leveling stage · 180h",
          org: "TIC55 Residency — Unisinos, Brisa & MCTI / Gov.",
          title: "Rio Grande do Sul recovery support",
          description:
            "Worked in a practical support environment during the residency leveling stage, handling real user issues, troubleshooting routines and operational communication.",
          evidence: [
            "Problem diagnosis under pressure",
            "User-facing support practice",
            "Documentation and escalation habits",
          ],
        },
        {
          period: "2026",
          type: "project · 480h",
          org: "TIC55 Residency — Unisinos, Brisa & MCTI / Gov.",
          title: "GrenGame — practical immersion",
          description:
            "Selected among the top 50 candidates for the practical immersion. Six months of end-to-end development with on-site mentoring, building a gamified PWA for corporate training for a partner company.",
          evidence: [
            "End-to-end fullstack development",
            "Acted as Product Owner",
            "Team code review",
          ],
        },
        {
          period: "2026",
          type: "project",
          org: "Real client",
          title: "Abriu Chaveiro & Cia",
          description:
            "Institutional website for a real client, focused on digital presence with social proof, organic SEO and transactional quote emails.",
          evidence: ["Local on-page SEO", "Serverless contact API", "Performance and mobile-first"],
        },
      ],
    },
    whyHire: {
      tag: "Why hire me",
      titleA: "Why choose someone who thinks beyond the code?",
      reasons: [
        {
          label: "code & architecture",
          title: "Sustainable code",
          text: "I prioritize clear structure, predictable naming and reusable components so projects can evolve without becoming fragile.",
        },
        {
          label: "product & process",
          title: "Product & process mindset",
          text: "I think beyond screens: user flow, edge cases, documentation, maintainability and delivery constraints.",
        },
        {
          label: "AI day-to-day",
          title: "Responsible use of AI",
          text: "I use AI to speed up research, refactoring and validation while keeping technical ownership over final decisions.",
        },
      ],
    },

    contact: {
      title: "Shall we talk?",
      lead: "Feel free to reach out to discuss a project or ask any questions. I’m open to new opportunities.",
      primaryLabel: "You can also find me on:",
      formAriaLabel: "Contact form",
      faq: {
        title: "Frequently asked questions",
        items: [
          {
            question: "What kind of projects do you build?",
            answer:
              "End-to-end web applications and digital solutions, from interfaces to APIs and data.",
          },
          {
            question: "Do you work with existing projects?",
            answer:
              "Yes. I assess the current codebase, document risks and evolve the product without requiring a complete rebuild.",
          },
          {
            question: "How do you organize development?",
            answer:
              "I use specifications, planning and verifiable deliveries to keep scope, decisions and progress clear.",
          },
          {
            question: "How do security and privacy fit into a project?",
            answer:
              "I review data collection, access, validation and retention from planning onward, according to the business context and risk.",
          },
          {
            question: "Who is your work best suited for?",
            answer:
              "Especially small and medium-sized businesses that need to turn real needs into clear, sustainable digital solutions.",
          },
        ],
      },
      form: {
        name: "// your name",
        namePh: "What should I call you?",
        email: "// your email",
        emailPh: "you@example.com",
        subject: "// subject (optional)",
        subjectPh: "What should we talk about?",
        message: "// message",
        messagePh: "What's the challenge? Tell me everything.",
        submit: "Send message",
        submitting: "Sending…",
        success: "Message sent. I'll get back to you soon.",
        error: "Something went wrong. Try again or message me on WhatsApp.",
        recaptchaNotice: "Protected by reCAPTCHA.",
        recaptchaPrivacy: "Google’s Privacy Policy",
        recaptchaJoin: "and",
        recaptchaTerms: "Terms of Service apply",
        sitePrivacyPrefix: "By submitting, you acknowledge that you are aware of the",
        sitePrivacy: "Privacy notice",
      },
    },
    footer: {
      localTimeLabel: "Local time",
      thanks: "Thanks for visiting!",
      location: "Brazil - Porto Alegre, RS",
      navigationLabel: "Explore the page",
      home: "home",
      skills: "capabilities",
      testimonials: "testimonials",
      legalLabel: "Legal information",
      accessibility: "Accessibility",
      privacy: "Privacy",
      greenHostingBadgeAlt: "This website uses green hosting, verified by the Green Web Foundation",
      vitalsLabel: "Core Web Vitals",
      infraLabel: "infra",
      uptimeLabel: "session",
      backend: "Backend",
      database: "Database",
      mail: "SMTP service",
      captcha: "reCAPTCHA v3",
      serviceStatus: {
        checking: "checking",
        operational: "operational",
        unavailable: "unavailable",
      },
      infrastructureExplain: {
        backend: "Indicates whether the website API is responding normally.",
        database: "Indicates whether data storage and retrieval are available.",
        smtp: "Indicates whether the service responsible for sending messages is available.",
        recaptcha: "Indicates whether protection against automated submissions is available.",
      },
      vitalsExplain: {
        LCP: "Measures how long the largest visible element takes to appear. A good result is below 2.5 seconds.",
        INP: "Measures how quickly the interface responds to its slowest interaction. A good result is below 200 milliseconds.",
        CLS: "Measures unexpected changes in the position of page elements. A good result is below 0.1.",
        FPS: "Measures animation smoothness in frames per second. The target is 60.",
        session:
          "Shows how long this page has been open in this tab. It does not indicate server availability.",
      },
    },

    a11y: {
      skipToContent: "Skip to content",
      homeLink: "Guilherme Ferreira — home",
      primaryNavigation: "Primary navigation",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    accessibility: {
      title: "Accessibility",
      statusLabel: "Evaluation status",
      status: "WCAG 2.2 AA evaluation in progress",
      intro:
        "This portfolio is undergoing a formal accessibility evaluation. Conformance is not claimed while automated or manual tests remain pending.",
      commitmentTitle: "Commitment",
      commitmentBody:
        "The interface must work by default with keyboards, screen readers, magnification, high contrast and different devices. The accessibility menu is complementary and does not replace these requirements.",
      scopeTitle: "Evaluation scope",
      scopeItems: [
        "Home, about, accessibility and privacy pages",
        "GrenGame, Abriu Chaveiro and Martha Izabel case studies",
        "Contact form and its states",
        "Accessibility menu and responsive variations",
      ],
      methodsTitle: "Evaluation methods",
      methodsItems: [
        "axe-core and ASES",
        "Complete keyboard navigation",
        "NVDA, TalkBack or VoiceOver",
        "200% zoom, reflow and text spacing",
        "Forced Colors, themes and reduced motion",
      ],
      limitationsTitle: "Current pending checks",
      limitationsBody:
        "ASES against the published URL, validation with screen readers and real devices, and manual review of every Level A and AA criterion. The PDF resume is a separate document outside this scope, and its accessibility remains an independent improvement.",
      feedbackTitle: "Found a barrier?",
      feedbackBody:
        "Describe the page, device and difficulty you encountered. This helps reproduce and fix the problem.",
      feedbackCta: "Report a barrier by email",
      updatedLabel: "Last updated",
    },
    errors: {
      notFoundKicker: "404",
      notFoundTitle: "Page not found",
      notFoundBody: "This route doesn't exist or has moved.",
      notFoundCta: "Back to home",
      boundaryTitle: "This page failed to load",
      boundaryBody: "Something went wrong. You can retry or go back home.",
      boundaryRetry: "Try again",
      boundaryHome: "Home",
    },

    nextSteps: {
      title: "Keep exploring",
      subtitle: "Three ways to continue the conversation.",
      items: [
        { label: "View projects", href: "/#projetos", meta: "case studies" },
        { label: "Back to home", href: "/", meta: "home" },
        { label: "Get in touch", href: "/#contato", meta: "contact" },
      ],
    },
    toggles: {
      langLabel: "Switch language",
      themeToLight: "Switch to light theme",
      themeToDark: "Switch to dark theme",
      backToTop: "Back to top",
    },
  },
};

export type Dict = (typeof dictionary)["pt"];
