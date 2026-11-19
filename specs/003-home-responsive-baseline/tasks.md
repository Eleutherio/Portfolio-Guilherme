---
description: "Tarefas de implementação do baseline responsivo da Home"
---

# Tarefas: Baseline Responsivo da Home

**Entrada**: documentos de design em `specs/003-home-responsive-baseline/`

**Pré-requisitos**: `plan.md`, `spec.md`, `research.md`, `data-model.md`,
`contracts/home-responsive-ui.md` e `quickstart.md`

**Testes**: obrigatórios porque esta feature altera comportamento observável, acessibilidade,
responsividade, contratos de foco/hash e corrige regressões de testes legados. Testes de regressão
devem ser escritos e confirmados como falhos antes das respectivas correções.

**Organização**: as tarefas estão agrupadas por história de usuário para permitir implementação e
validação independentes.

## Formato: `[ID] [P?] [Story] Descrição`

- **[P]**: pode ser executada em paralelo por afetar arquivos diferentes e não depender de tarefa
  incompleta.
- **[Story]**: identifica a história de usuário correspondente.
- Todos os caminhos são relativos à raiz do repositório.

## Fase 1: Setup do suporte compartilhado

**Objetivo**: preparar constantes e utilitários de teste usados por mais de uma história sem alterar
o comportamento do produto.

- [x] T001 Definir os IDs canônicos das seis seções da Home e a matriz reutilizável de viewports 320, 360, 390, 412, 640, 768, 1023, 1440 e 1920 px em `e2e/support/portfolio.ts` e `e2e/support/responsive.ts`

---

## Fase 2: Fundação bloqueante

**Objetivo**: permitir que qualquer história solicite e aguarde a nova seção adiada pelos mesmos
mecanismos usados nas demais seções.

**⚠️ CRÍTICO**: concluir esta fase antes das histórias de usuário.

- [x] T002 Estender o carregador compartilhado da Home para disparar `portfolio:load-deferred-section` para `habilidades` e aguardar `#habilidades-heading` em `e2e/support/portfolio.ts`

**Checkpoint**: o harness consegue carregar e localizar todas as seis seções da Home.

---

## Fase 3: História de Usuário 1 — Percorrer a Home em ordem coerente (Prioridade: P1) 🎯 MVP

**Objetivo**: entregar a ordem Hero → Sobre → Projetos → Habilidades → Depoimentos → Contato com
scroll, hash, foco e alternativa linear para movimento reduzido.

**Teste independente**: abrir a Home, percorrer os seis destinos por DOM, scroll, hash e teclado nos
breakpoints-alvo e repetir com `prefers-reduced-motion: reduce`.

### Testes da História 1

- [x] T003 [P] [US1] Adicionar regressões para ordem dos seis IDs, carregamento por `/#habilidades`, foco em `#habilidades-heading`, ausência de `#trajetoria` e fluxo linear com movimento reduzido em `e2e/responsiveness.spec.ts`
- [x] T004 [P] [US1] Substituir as expectativas legadas da antiga Trajetória por verificações da ordem atual, quatro indicadores incorporados em Sobre e ausência de conteúdo bloqueado em `e2e/dynamic-content.spec.ts`

### Implementação da História 1

- [x] T005 [US1] Fixar em `src/routes/index.tsx` a ordem `#home`, `#sobre`, `#projetos`, `#habilidades`, `#depoimentos`, `#contato`, mantendo Habilidades adiada entre Projetos e Depoimentos e sem reintroduzir Trajetória
- [x] T006 [US1] Tornar `habilidades` o ID e o heading canônicos da seção, preservando temporariamente o conteúdo funcional existente até a História 4, em `src/components/sections/Skills.tsx`
- [x] T007 [US1] Ajustar a sobreposição e os offsets de scroll/foco para que Sobre e Projetos não bloqueiem destinos e para que movimento reduzido use fluxo linear em `src/styles.css`
- [x] T008 [US1] Executar as regressões da História 1 em `e2e/responsiveness.spec.ts` e `e2e/dynamic-content.spec.ts` e confirmar ordem, hash, foco e movimento reduzido

**Checkpoint**: a estrutura da Home é navegável e testável independentemente do conteúdo final de
Habilidades.

---

## Fase 4: História de Usuário 2 — Ler conteúdo responsivo sem desperdício de espaço (Prioridade: P1)

**Objetivo**: consolidar reflow, gutters, alturas naturais, superfícies e controles da Home entre
320 e 1920 px sem corte, colisão ou overflow horizontal.

**Teste independente**: executar o inventário responsivo em 320, 360, 390, 412, 640, 768, 1023,
1440 e 1920 px, incluindo PT/EN, claro/escuro, teclado, DPR 1/2/3 e a referência 412×915.

### Testes da História 2

- [ ] T009 [P] [US2] Adicionar regressões para gutters fluidos, alturas naturais, seis depoimentos estáveis e ausência de colisão em Projetos/cases entre 768 e 1023 px em `e2e/responsiveness.spec.ts`
- [ ] T010 [P] [US2] Trocar o baseline visual `timeline-tablet` por um baseline da Home atual e cobrir overflow, cortes, alvos de 44×44 px e colisão de controles nos viewports-alvo em `e2e/responsive-inventory.spec.ts`
- [ ] T011 [P] [US2] Provar operação sem hover, alinhamento amplo do cabeçalho de Contato, FAQ à esquerda do formulário e reflow móvel na mesma ordem semântica em `e2e/responsive-inputs.spec.ts` e `e2e/interface-contact.spec.ts`
- [ ] T012 [P] [US2] Preservar proporção, `picture`, `srcset`, `sizes` e seleção adequada a DPR 1/2/3 para Sobre, Projetos e Depoimentos em `e2e/responsive-media.spec.ts`
- [ ] T013 [P] [US2] Provar compactação do Footer abaixo de 768 px sem quebra de navegação, contatos, badges ou tooltips em `e2e/footer-infrastructure.spec.ts`

### Implementação da História 2

- [ ] T014 [US2] Consolidar gutters compartilhados, espaçamento fluido, altura natural das seções secundárias e superfícies sólidas de `#sobre`, `#projetos` e `#depoimentos`, preservando blur somente em `#contato`, em `src/styles.css`
- [ ] T015 [P] [US2] Corrigir reflow e colisões de títulos, mídia, metadados e ações dos cards entre 768 e 1023 px sem alterar conteúdo em `src/components/sections/Projects.tsx`
- [ ] T016 [P] [US2] Preservar seis itens, controles centralizados, progressão acessível e altura estável sem cortes em `src/components/sections/Testimonials.tsx`
- [ ] T017 [P] [US2] Garantir que Contato alinhe título, introdução e contatos principais em telas amplas, apresente o FAQ à esquerda do formulário e preserve a ordem visual e de foco definida no contrato em telas estreitas em `src/components/sections/Contact.tsx`
- [ ] T018 [P] [US2] Compactar navegação, contatos, infraestrutura, vitais e badges abaixo de 768 px sem reduzir legibilidade ou alvos de toque em `src/components/layout/Footer.tsx`
- [ ] T019 [US2] Definir em `src/styles.css` regras de breakpoint para `[data-project-grid]`, carrossel de `#depoimentos`, ordem de `#contato` e `.footer-grid` em 640, 768 e 1024 px, sem largura fixa, `100svh` nas seções secundárias ou overflow horizontal
- [ ] T020 [US2] Executar as regressões da História 2 em `e2e/responsiveness.spec.ts`, `e2e/responsive-inventory.spec.ts`, `e2e/responsive-inputs.spec.ts`, `e2e/interface-contact.spec.ts`, `e2e/responsive-media.spec.ts` e `e2e/footer-infrastructure.spec.ts`

**Checkpoint**: a Home completa reflui sem overflow ou controles inalcançáveis nos viewports-alvo.

---

## Fase 5: História de Usuário 3 — Compreender a seção Sobre (Prioridade: P2)

**Objetivo**: preservar heading acessível e texto aprovado, ampliar/centralizar os parágrafos,
inverter a hierarquia cromática dos quatro indicadores, aplicar Space Grotesk aos valores e
substituir o mosaico pelo retrato responsivo fornecido.

**Teste independente**: carregar somente Sobre, validar heading, texto centralizado, quatro
indicadores, retrato único, proporções e largura útil entre 320 e 1023 px em PT/EN, claro/escuro e
teclado.

### Testes da História 3

- [x] T021 [P] [US3] Atualizar as regressões da Home para exigir heading acessível oculto, texto PT/EN ampliado e centralizado, quatro indicadores com valores em Space Grotesk/cor de primeiro plano e rótulos no azul de destaque, além de um único retrato, em `e2e/dynamic-content.spec.ts`
- [x] T022 [P] [US3] Cobrir largura útil, ausência de distorção, dimensões intrínsecas e seleção AVIF responsiva do retrato em DPR 1/2 entre 320 e 1023 px em `e2e/responsive-media.spec.ts` e `e2e/responsiveness.spec.ts`

### Implementação da História 3

- [x] T023 [US3] Consolidar em `src/components/sections/About.tsx` o heading acessível oculto, quatro indicadores com valores `font-sans font-normal text-foreground` e rótulos `text-accent`, texto maior/centralizado e retrato único sem reintroduzir o rótulo visual “Sobre”
- [x] T024 [US3] Integrar o retrato e suas variantes em `src/content/about-mosaic.ts`, `src/i18n/dictionary.ts`, `scripts/generate-responsive-images.mjs` e `src/assets/about/`, ajustando em `src/styles.css` somente proporção, largura e espaços necessários para evitar distorção, corte e recurso subdimensionado
- [x] T025 [US3] Executar as regressões da História 3 em `e2e/dynamic-content.spec.ts` e `e2e/responsive-media.spec.ts` nos idiomas e temas definidos no teste independente

### Extensão aprovada da História 3

- [x] T041 [P] [US3] Atualizar as regressões de Sobre para exigir o recorte transparente mais recente, textura fotográfica de papel amassado em toda a superfície, altura exata de `100svh` e contenção de indicadores, texto, CTA e retrato em 320×568, 412×915 e 1440×900 em `e2e/dynamic-content.spec.ts`, `e2e/responsive-media.spec.ts` e `e2e/responsiveness.spec.ts`
- [x] T042 [US3] Substituir o retrato anterior pelo PNG transparente fornecido, gerar variantes AVIF/WebP com alfa, integrar uma textura fotográfica otimizada de papel amassado e reorganizar `src/components/sections/About.tsx` e `src/styles.css` para a composição de um viewport sem alterar outras seções
- [x] T043 [US3] Executar regressões, inspeção renderizada mobile/desktop, lint direcionado, typecheck, build e gate A+ da extensão de Sobre

### Correção de compatibilidade do acesso local

- [x] T044 [US2] Adicionar regressão e fallback sem dependência para que a Home inicialize por HTTP em endereços da rede local quando `crypto.randomUUID` não estiver disponível, mantendo UUID v4 válido para o contador de cafés em `e2e/hero-stats.spec.ts` e `src/components/hero/HeroStats.tsx`

### Nova composição editorial de Sobre

- [x] T045 [US3] Substituir o recorte transparente pela fotografia integral fornecida, gerar variantes AVIF/WebP de alta qualidade e reorganizar Sobre em linha superior 50/50 para texto e imagem, com os quatro indicadores em uma faixa inferior de largura total, sem alterar o conteúdo PT/EN
- [x] T047 [US3] Preservar o enquadramento integral da fotografia sem crop e aplicar uma moldura autoral discreta com o azul de destaque da identidade visual
- [x] T048 [US2] Para avaliação visual temporária, remover a centralização automática global de `section-container`, preservando o gutter seguro esquerdo e sem alterar alinhamentos internos ou o cabeçalho
- [x] T049 [US2] Encerrar o experimento T048 e restaurar `margin-inline: auto` em `section-container` para recuperar centralização e distribuição responsiva do espaço lateral
- [x] T050 [US2] Remover somente na Home o limite máximo e os gutters laterais do container compartilhado, permitindo largura total sem alterar header, subpáginas, safe areas ou alinhamentos internos específicos
- [x] T051 [US2] Refinar T050 com gutter mínimo de 1rem/2rem e contenção visual em Sobre, Habilidades, Depoimentos e Contato, mantendo Hero e Projetos full-bleed e sem alterar header ou subpáginas
- [x] T052 [US2] Aplicar o frame lateral a todo o conteúdo da Home, com gutter de 1,25rem no mobile e fluido de 2,5rem a 4,5rem no desktop, mantendo apenas superfícies, fundos e mídia de Hero e Projetos full-bleed
- [x] T053 [US3] Substituir a fotografia de Sobre pelo retrato com fones em variantes AVIF/WebP, simplificar a moldura, atualizar a saudação e o nome em PT/EN com hierarquia de peso e centralizar verticalmente o CTA na coluna textual
- [x] T054 [US3] Reduzir a escala da linha do nome, limitar a fotografia à borda inferior do CTA em desktop e tornar a textura de Sobre nítida e repetida, sem blur ou ampliação excessiva
- [x] T055 [US3] Remover fotografia, moldura e assets sem uso de Sobre, centralizar texto e CTA e substituir a textura por linhas horizontais finas e muito sutis geradas em CSS
- [x] T056 [US3] Suavizar somente as linhas decorativas do fundo de Sobre com blur muito sutil de `0.35px`, preservando texto, CTA e indicadores nítidos
- [x] T057 [US3] Remover o divisor superior próprio da faixa de indicadores de Sobre sem alterar seu espaçamento nem as linhas decorativas do fundo
- [x] T058 [US2] Alinhar largura, espessura e cor do divisor superior de Projetos ao divisor inferior da seção e atualizar em PT/EN o texto aprovado de Sobre com saudação em peso normal
- [x] T059 [US3] Reorganizar os quatro indicadores ampliados de Sobre em uma coluna vertical à direita do conteúdo textual, preservando conteúdo, cores, tipografia e fundo
- [x] T060 [US3] Ampliar e distribuir uniformemente o espaçamento vertical entre os indicadores de Sobre e alinhar os limites das colunas de texto/CTA e indicadores na composição horizontal
- [x] T061 [US3] Centralizar texto e indicadores em duas colunas com gap e converter os quatro indicadores em carrossel vertical infinito de três itens visíveis, com arraste direto, teclado e sem efeitos de extremidade
- [x] T062 [US3] Animar automaticamente o carrossel vertical enquanto Sobre estiver ativa, preservar a direção definida por arraste/teclado e oferecer pausa/reprodução com redução de movimento respeitada
- [x] T063 [US3] Substituir o avanço temporizado por scroll velocity marquee contínuo, fazendo velocidade e direção responderem à rolagem, ao arraste direto e ao teclado sem perder o loop infinito de três itens visíveis
- [x] T064 [US3] Aumentar discretamente o blur das linhas decorativas do fundo de Sobre de `0.35px` para `0.6px`, mantendo conteúdo e controles nítidos
- [x] T065 [US3] Reduzir o intervalo das linhas decorativas de Sobre de `48px` para `36px` e aumentar seu blur isolado para `1px`, suavizando a textura sem afetar o conteúdo
- [x] T066 [US3] Dividir Sobre em painéis temáticos `70%/30%`, restringir as linhas ao painel direito e desabilitar sem remover a animação do carrossel, exibindo os quatro indicadores em linhas estáticas com número e rótulo lado a lado
- [x] T067 [US3] Integrar o retrato com fones como fundo decorativo AVIF/WebP do painel direito de `30%`, com `26%` de opacidade, cobertura `cover` e sem recuos laterais
- [x] T068 [US3] Mover as linhas horizontais do painel direito de `30%` para o painel esquerdo de `70%`, preservando retrato, opacidade, cores e indicadores
- [x] T069 [US3] Separar os controles reutilizáveis de currículo e cafés, mover o contador para o centro inferior do painel direito e posicionar o download à direita do CTA de trajetória, removendo suas cópias do rodapé
- [x] T070 [US3] Restaurar a apresentação original do download do currículo como link textual com ícone, sem borda e com rótulo visível, mantendo apenas sua nova posição à direita do CTA
- [x] T071 [US3] Refinar a hierarquia tipográfica de Sobre com saudação e nome menores, corpo maior e ênfase azul restrita ao nome e ao papel profissional, mantendo os indicadores no painel direito após avaliar a alternativa inferior
- [x] T072 [US3] Criar um snapshot restaurável da composição de Sobre anterior à mudança dos indicadores, incluindo componentes, estilos, traduções, mídia e artefatos normativos relacionados
- [x] T073 [US3] Mover os quatro indicadores para uma linha horizontal na base do painel esquerdo de `70%`, bem abaixo dos CTAs e alinhada verticalmente ao contador de cafés, permitindo crescimento natural apenas em viewports excepcionalmente baixos para evitar sobreposição
- [x] T074 [US3] Substituir a frase final de Sobre por “Meu trabalho é traduzir tecnologia em soluções para as pessoas.” e atualizar seu equivalente semântico em inglês sem alterar os demais textos
- [x] T075 [US3] Substituir no Hero a frase “Meu trabalho é traduzir tecnologia em soluções para as pessoas.” por “Acredito que a tecnologia deve ampliar o que somos capazes de fazer.” com equivalente em inglês e remover integralmente o primeiro texto de Sobre
- [x] T076 [US3] Consolidar “Olá! eu me chamo Guilherme Eleutherio.” como uma única linha estrutural em Sobre e impedir a quebra da frase sobre tecnologia no Hero a partir de `640px`, preservando reflow seguro em telas menores
- [x] T077 [US3] Ajustar o painel direito de `30%` de Sobre para um meio-tom claro no tema claro e escuro no tema escuro, preservando contraste local, retrato, linhas e composição
- [x] T078 [US3] Reativar nos indicadores o carrossel horizontal infinito com scroll velocity marquee, três itens visíveis em telas amplas e dois em telas estreitas, arraste horizontal, teclado, pausa e redução de movimento, dobrando a escala dos números em relação à composição estática anterior
- [x] T079 [US3] Substituir as linhas do painel esquerdo de `70%` por granulação procedural minimalista, limitar o carrossel a dois indicadores visíveis e ampliar Sobre para no mínimo `115svh`, permitindo crescimento natural para evitar cortes
- [ ] T046 [P] [US3] Após aprovação visual, atualizar regressões responsivas e de mídia, inspecionar mobile/desktop em ambos os temas e executar os gates consolidados da feature

**Checkpoint**: Sobre comunica texto, indicadores e fotografia sem depender da antiga Trajetória.

---

### Extensão editorial de Projetos

- [x] T080 [US2] Reorganizar somente o primeiro projeto em destaque em duas colunas editoriais no desktop, mantendo badges abaixo do preview, conteúdo e ações à direita e preservando os formatos e comportamentos atuais de botões, links e mídia
- [x] T081 [US3] Refinar a textura procedural do painel esquerdo de `70%` de Sobre para uma aparência irregular inspirada em grip tape, com gradiente tonal de baixo contraste e sem recurso raster adicional
- [x] T082 [US3] Reforçar discretamente a textura grip tape do painel esquerdo, remover o carrossel e seus controles e apresentar um indicador por vez acima do contador de cafés com o efeito reutilizável de embaralhamento e digitação, preservando semântica e movimento reduzido
- [x] T083 [US3] Adicionar abaixo dos CTAs de Sobre uma lista editorial não recolhível com cinco perguntas e respostas PT/EN sobre o trabalho, lado a lado em telas amplas e com reflow contido no painel esquerdo de `70%`
- [x] T084 [US2] Mover o FAQ de cinco itens para a coluna esquerda de Contato e alinhar o bloco de contato principal com o título e o texto introdutório no cabeçalho amplo, preservando PT/EN e reflow semântico
- [x] T085 [US2] Tornar os itens do FAQ de Contato recolhíveis, harmonizar seus divisores com as linhas do formulário e estreitar a coluna do formulário com maior respiro entre os blocos
- [x] T086 [US3] Adicionar abaixo dos CTAs de Sobre a stack Java, Python, React, Django REST, Render, MySQL e Supabase em composição editorial sutil, preservando logos e cores de marca sem tratamento de badge
- [x] T087 [US3] Reorganizar a stack de Sobre em linhas editoriais numeradas de Front-end, Back-end, Banco de dados e Softwares, preservando os logos sem badges
- [x] T088 [US3] Atualizar e centralizar a stack aprovada de Front-end, Back-end, Bancos de dados e Infraestrutura e ferramentas no painel esquerdo, agrupando o indicador diretamente acima do contador de cafés no painel direito
- [x] T089 [US3] Alinhar o contador de cafés ao divisor final da stack, impedir quebra das tecnologias, alinhá-las à esquerda e remover numeração e peso forte das categorias
- [x] T090 [US3] Igualar fonte, peso e cor dos rótulos de categoria ao título da stack e impedir quebra de linha nesses rótulos
- [x] T091 [US3] Aproximar verticalmente introdução/CTAs e stack no centro da composição de Sobre, substituindo o vazio excessivo por espaçamento fluido controlado
- [x] T092 [US3] Corrigir T091 distribuindo respiro flexível equivalente acima, entre e abaixo dos blocos de introdução/CTAs e stack, sem uni-los no centro
- [x] T093 [US2] Reformular Depoimentos como composição editorial de citação e autoria em painéis retos, com abertura natural PT/EN, nome, vínculo e fotografia, preservando os seis itens e o carrossel acessível
- [x] T094 [US2] Refinar cada depoimento como mosaico reto: citação no grande painel esquerdo, organização e retrato preenchendo tiles contíguos no quadrante superior direito e autoria ocupando o painel inferior direito, sem imagens flutuantes
- [x] T095 [US2] Remover caixas, fundos e bordas dos três blocos de Depoimentos, separar as aspas em linhas acima e abaixo da citação, circularizar retrato e contexto profissional lado a lado e alinhar a autoria à esquerda logo abaixo
- [x] T096 [US2] Reduzir proporcionalmente título, mídias, tipografia, altura e respiros de Depoimentos para a escala das demais seções, alinhar citações à esquerda, dividi-las em parágrafos e aplicar fonte menor aos relatos longos sem alterar ou truncar o conteúdo
- [x] T097 [US2] Remover slides inativos do fluxo de layout e compactar margens entre abertura, relato e seletor, evitando que depoimentos curtos reservem a altura do relato mais longo
- [x] T098 [US2] Fazer os parágrafos dos depoimentos ocuparem toda a largura útil do bloco de citação, preservando agrupamento por frases, estrofes e entrelinhas legíveis
- [x] T099 [US2] Trocar a hierarquia textual para “Nas próprias palavras delas.”/“Pessoas com quem trabalhei” em PT e equivalentes em EN, e recolocar slides inativos na célula de medição para estabilizar a altura sem deslocar o seletor
- [x] T100 [US2] Substituir a mídia genérica de contexto pelas identidades visuais fornecidas para Bruna, Leonardo, Martha e Alecsandra, associadas por depoimento, mantendo o registro da Unisinos como fallback para Tainara
- [x] T101 [US2] Encurtar a abertura para “Nas palavras delas.”, manter “Pessoas com quem trabalhei” em uma linha e remover a inversão temática de Depoimentos, preservando azul escuro no tema claro e azul claro no tema escuro para aspas e filete
- [x] T102 [US2] Associar a identidade visual do Senac ao depoimento de Tainara e remover do componente o fallback genérico de contexto profissional, agora sem uso
- [x] T103 [US2] Adicionar cargos de Martha, Tainara, Alecsandra e Bruna aos metadados de autoria, corrigir o vínculo de Tainara para SENAC Brasil e identificar os dois feedbacks de Leonardo como provenientes da plataforma Feedz
- [x] T104 [US2] Localizar em PT/EN os cargos adicionados e a nota de procedência do Feedz, separando também cargo e organização nos dois depoimentos de Leonardo para responder corretamente à troca de idioma
- [x] T105 [US2] Completar a localização PT/EN de Depoimentos com versões bilíngues dos seis relatos e datas localizadas dos feedbacks de Leonardo, preservando nomes próprios e organizações
- [x] T106 [US2] Adicionar a cada autoria um link compacto e seguro para o LinkedIn, alinhado à direita com ícone de marca, primeiro nome, cursor contextual e rótulo acessível em PT/EN
- [x] T107 [US2] Reposicionar o link do LinkedIn junto ao nome da autoria, aplicar azul temático ao ícone e texto e remover o hover em formato de badge, mantendo apenas variação cromática
- [x] T108 [US2] Consolidar Depoimentos com regressões de conteúdo bilíngue, links externos, altura estável, reflow mobile, mídia responsiva, polaridade temática, contraste, acessibilidade e baselines visuais desktop/mobile
- [x] T109 [US2] Uniformizar todos os projetos com a composição editorial do primeiro item e alternar preview e conteúdo entre esquerda e direita no desktop, preservando preview, badges e conteúdo nessa ordem no mobile
- [x] T110 [US2] Completar o cabeçalho de Projetos com rótulo, título e texto de apoio autorais em PT-BR e EN-US, seguindo a hierarquia das demais seções da Home
- [x] T111 [US2] Remover o marcador numérico do título do FAQ e igualar sua tipografia ao título da stack de tecnologias em Sobre, preservando a hierarquia das perguntas e respostas
- [x] T112 [US2] Refinar tipografia, pesos, respiro e composição responsiva de Contato conforme o MIV, preservando integralmente contatos, FAQ, campos, avisos, estados e ações existentes
- [x] T113 [US4] Mover integralmente o FAQ recolhível de Contato para Habilidades, abaixo do processo de três etapas, preservando conteúdo PT/EN, interação, estilo e o formulário de Contato
- [x] T114 [US2] Reorganizar Contato em composição editorial de duas colunas, com convite, disponibilidade e contatos à esquerda e formulário preservado à direita, incluindo cópia autoral equivalente em PT-BR e EN-US conforme o MIV
- [x] T115 [US2] Refinar o marcador e o fechamento do convite de Contato para “Entre em contato”/“Get in touch”, preservando quebra natural e equivalência PT-BR/EN-US
- [x] T116 [US2] Aplicar quebra sintática deliberada ao convite de Contato e espaços inseparáveis nos pares gramaticais curtos em PT-BR, espelhando o ritmo editorial em EN-US
- [x] T117 [US2] Adicionar assinatura tipográfica circular PT-BR/EN-US abaixo dos contatos principais, centralizada, temática, com rotação horária e fallback estático para redução de movimento
- [x] T118 [US2] Reorganizar Contato principal com filete vertical, e-mail e telefone em linhas e LinkedIn/GitHub circulares; ampliar a tipografia da assinatura circular, igualá-la ao marcador da seção e usar cor clara no tema escuro
- [x] T119 [US2] Fechar o anel tipográfico da assinatura de Contato, substituir os separadores por bullets e remover o ponto central sem alterar movimento, tema ou localização
- [x] T120 [US2] Uniformizar o respiro inseparável ao redor de todos os bullets da assinatura circular, inclusive na junção entre parcerias/partnerships e projetos/projects
- [x] T121 [US2] Mover “Entre em contato”/“Get in touch” para o topo do formulário e reposicionar a assinatura circular como efeito decorativo atrás do canto superior esquerdo do convite principal
- [x] T122 [US2] Reservar espaço próprio para a assinatura circular ao lado do convite no desktop e acima dele no mobile, eliminando qualquer sobreposição com texto
- [x] T123 [US2] Corrigir a assinatura circular para não reservar espaço: centralizá-la atrás do início do convite e mascarar tudo exceto a porção externa ao limite esquerdo do título
- [x] T124 [US2] Substituir o recorte lateral incorreto pela máscara da própria caixa do título, mantendo a assinatura centrada atrás de “Vamos” e visível somente nos arcos externos
- [x] T125 [US2] Desfazer a integração entre assinatura circular e título, restaurar o título simples e recolocar a assinatura centralizada abaixo do contato principal
- [x] T126 [US2] Reduzir ligeiramente a assinatura circular, posicioná-la à direita do rótulo de contato principal e centralizar a composição esquerda e seus textos nos dois eixos
- [x] T127 [US2] Reposicionar a assinatura circular à direita do conjunto de elementos do contato principal, mantendo o rótulo isolado acima
- [x] T128 [US2] Restaurar o alinhamento à esquerda dos textos da composição de Contato sem alterar sua centralização estrutural nem a posição da assinatura circular
- [x] T129 [US2] Reorganizar título, introdução e contato principal de Contato em uma largura compartilhada, mantendo a mesma margem esquerda sem alterar formulário ou assinatura circular
- [x] T130 [US2] Remover sublinhados de e-mail e telefone, uniformizar seus ícones vetoriais e apresentar LinkedIn/GitHub sem fundos circulares, alinhados à esquerda e com hover somente cromático
- [x] T131 [US2] Integrar LinkedIn e GitHub às linhas do contato principal com texto visível, replicando alinhamento, tipografia e espaçamento de e-mail e telefone
- [x] T132 [US2] Reduzir o intervalo entre o rótulo de contato principal e sua lista, ampliando levemente e uniformizando o respiro entre as quatro linhas de contato
- [x] T133 [US2] Alterar o marcador do formulário para “comece por aqui”/“start here” em minúsculas e exigir consentimento explícito no aviso de privacidade e reCAPTCHA antes de permitir o envio
- [x] T134 [US2] Remover o marcador do formulário, reduzir sua largura em 5%, tornar o consentimento menor e discreto, esmaecer o envio bloqueado e aplicar hover azul uniforme aos contatos principais
- [x] T135 [US2] Remover integralmente a assinatura circular de Contato e ampliar em 10% o conjunto de título, introdução e contatos da coluna esquerda sem exceder sua largura disponível
- [x] T136 [US2] Padronizar o cabeçalho de Projetos com a mesma estrutura editorial de Depoimentos, compartilhando marcador, título, filete, apoio e comportamento responsivo sem alterar os cards
- [x] T137 [US2] Atualizar os marcadores editoriais para “cases selecionados”/“selected cases” em Projetos e “Alguns depoimentos”/“A few testimonials” em Depoimentos
- [x] T138 [US2] Centralizar verticalmente o convite final e o botão de Projetos por meio de espaçamento superior e inferior equivalente, preservando distribuição horizontal e reflow móvel
- [x] T139 [US1] Pausar por estado explícito o parallax do Hero na Home, preservando sua implementação para retomada posterior e mantendo Hero, Sobre e Projetos em fluxo linear

---

## Fase 6: História de Usuário 4 — Entender capacidades e forma de trabalho (Prioridade: P2)

**Objetivo**: substituir o processo ilustrado e o FAQ por uma seção editorial bilíngue de
Competências, com narrativa e três linhas sempre visíveis.

**Teste independente**: em PT/EN e nos dois temas, confirmar a composição `40%/60%` no desktop,
reflow para uma coluna entre 320 px e 412 px, conteúdo integralmente visível e ausência de elementos
do processo e FAQ substituídos.

### Testes da História 4

- [ ] T026 [P] [US4] Criar regressão estrutural para cópias PT/EN, ordem das três linhas e ausência do processo ilustrado, FAQ, acordeão, popover e CTA adicional em `e2e/skills.spec.ts`
- [ ] T027 [P] [US4] Adicionar prova de contraste, temas claro/escuro, semântica e conteúdo integralmente legível sem interação em `e2e/contrast.spec.ts`
- [ ] T028 [P] [US4] Adicionar prova do grid `40%/60%` no desktop e reflow para uma coluna em 320 px e 412 px, sem overflow ou corte, em `e2e/responsive-inputs.spec.ts`

### Modelo e conteúdo da História 4

- [x] T029 [P] [US4] Substituir o conteúdo legado pelas cópias finais do guia para narrativa e três linhas em PT-BR/EN-US em `src/i18n/dictionary.ts`

### Implementação da História 4

- [x] T030 [US4] Refatorar `src/components/sections/Skills.tsx` para a composição textual sempre visível e remover o processo ilustrado e o FAQ da seção
- [x] T031 [US4] Adicionar ao `SectionShell` a variante editorial de Competências e implementar grid, filetes, tipografia e reflow com tokens do MIV em `src/styles.css`
- [ ] T032 [US4] Adicionar baseline renderizado de Habilidades em desktop e 412×915 sem substituir provas semânticas em `e2e/visual-regression.spec.ts`
- [ ] T033 [US4] Executar as regressões de Habilidades em `e2e/skills.spec.ts`, `e2e/contrast.spec.ts`, `e2e/responsive-inputs.spec.ts` e `e2e/visual-regression.spec.ts`

**Checkpoint**: Habilidades está completa, traduzida, acessível e responsiva sem depender de mídia ou
do PDF externo.

---

## Fase 7: Polimento e preocupações transversais

**Objetivo**: remover resíduos de contrato legado, inspecionar visualmente e concluir todos os gates
constitucionais.

- [ ] T036 Remover referências residuais da Home a `#trajetoria`, `#processo` e ao processo ilustrado, sem apagar componentes ainda usados por outras rotas, em `src/routes/index.tsx`, `src/components/sections/Skills.tsx` e `e2e/`
- [ ] T037 Inspecionar os estados padrão e ativo em 320×568, 412×915, 768×1024, 1023×600, 1440×900 e 1920×1080, PT/EN, claro/escuro e movimento reduzido, registrando resultados e eventuais pendências em `specs/003-home-responsive-baseline/validation.md`
- [ ] T038 Executar `npx prettier --check .`, `npm run lint` e `npm run typecheck` sobre `src/`, `e2e/` e `specs/003-home-responsive-baseline/`, corrigindo todo erro antes de avançar
- [ ] T039 Executar `npm run test:api`, `npm run test:a11y` e `npm run build` para validar `server/`, `src/` e `e2e/`, sem relaxar testes fora do escopo
- [ ] T040 Executar `npm run carbon:check` sobre o build final imediatamente antes do primeiro staging ou commit e registrar o resultado A+ em `specs/003-home-responsive-baseline/validation.md`

---

## Dependências e ordem de execução

### Dependências entre fases

- **Fase 1 — Setup**: inicia imediatamente.
- **Fase 2 — Fundação**: depende de T001 e bloqueia as histórias.
- **História 1 (Fase 3)**: depende de T002 e estabelece a ordem/IDs usados pelas demais histórias.
- **História 2 (Fase 4)**: depende da História 1 para medir a Home com a composição final de seções.
- **História 3 (Fase 5)**: depende da História 1; pode ser executada em paralelo à História 2 se os
  responsáveis coordenarem alterações em `src/styles.css` e arquivos de teste compartilhados.
- **História 4 (Fase 6)**: depende da História 1 e de T002; é funcionalmente independente das
  correções de Sobre, Contato e Footer, mas deve integrar a matriz responsiva da História 2.
- **Fase 7 — Polimento**: depende de todas as histórias incluídas no release.

### Dependências dentro de cada história

- Escrever e confirmar as regressões antes da implementação correspondente.
- Na História 4, T029 e T030 podem avançar em paralelo após T026–T028; T031 depende de ambas.
- T032 depende de T031; T033 pode começar após T029 e deve convergir com T031–T032.
- Baselines visuais e validações finais só ocorrem depois do comportamento estar implementado.
- Nenhuma tarefa autoriza alterar contratos fora da Home ou editar `src/routeTree.gen.ts`.

### Grafo resumido

```text
T001 → T002 → US1 → ┬→ US2 ─┐
                    ├→ US3 ─┼→ Polimento e gates
                    └→ US4 ─┘
```

## Oportunidades de paralelização

### História 1

```text
T003: regressões de ordem/hash em e2e/responsiveness.spec.ts
T004: migração da Trajetória em e2e/dynamic-content.spec.ts
```

### História 2

```text
T009–T013: contratos responsivo, inventário, entradas, mídia e Footer em arquivos distintos
T015–T018: Projetos, Depoimentos, Contato e Footer em componentes distintos após os testes
```

### História 3

```text
T021: contrato de conteúdo em e2e/dynamic-content.spec.ts
T022: contrato de mídia em e2e/responsive-media.spec.ts
```

### História 4

```text
T026–T028: interação, contraste e reflow em arquivos de teste distintos
T029: catálogo relacional em src/content/capabilities.ts
T030: conteúdo PT/EN em src/i18n/dictionary.ts
```

## Estratégia de implementação

### MVP primeiro — somente História 1

1. Concluir T001–T002.
2. Escrever T003–T004 e confirmar que reproduzem os contratos ausentes/legados.
3. Implementar T005–T007.
4. Executar T008 e parar para validar a navegação estrutural independentemente.

### Entrega incremental

1. **US1**: ordem, IDs, hash, foco e movimento reduzido.
2. **US2**: baseline responsivo completo e estabilidade das seções existentes.
3. **US3**: Sobre consolidada e livre da antiga Trajetória.
4. **US4**: Habilidades final com conteúdo e interação aprovados.
5. **Polimento**: inspeção renderizada, gates completos e carbono antes de commit.

## Notas

- `[P]` significa arquivo distinto e ausência de dependência pendente, não autorização para gerar
  conflitos no mesmo worktree.
- Testes de regressão devem falhar pelo motivo esperado antes da correção.
- A inspeção renderizada não substitui lint, typecheck, testes, build ou carbono.
- Não adicionar dependências, mídia ou integração externa fora da exceção explícita de Lenis em
  FR-037.
- Preservar todo comportamento fora dos requisitos FR-001–FR-037.

## Fase 8: Sistema tipográfico por papéis

- [x] T041 Consolidar tokens responsivos de página, seção, conteúdo, introdução, corpo,
      metadado e controle em `src/styles.css`, preservando as exceções nomeadas do Hero, cases,
      depoimentos e indicador `+960h`
- [x] T042 Migrar Home, Sobre, cases, navegação, Footer, Privacidade e Acessibilidade para os papéis
      compartilhados sem alterar grids, IDs, ordem, mídias ou comportamento
- [x] T043 Remover identificadores decorativos e as chaves localizadas que existiam somente para
      alimentá-los, preservando metadados semânticos e as traduções PT-BR/EN-US
- [ ] T044 Validar os papéis tipográficos, reflow natural e ausência de clipping em 320px, 390px,
      412px, desktop e zoom de 200%, nos dois idiomas e temas
- [ ] T045 Executar lint, typecheck, testes e build somente quando o ciclo de design for declarado
      concluído pelo responsável do projeto
- [x] T140 Restaurar peso 400 nos links comuns do Footer e dos avisos do formulário, preservando
      peso 500 nos rótulos e controles de ação, em `src/components/layout/Footer.tsx` e `src/styles.css`

## Fase 9: Competências em cards horizontais

- [x] T046 Substituir o conteúdo PT-BR e EN-US de Competências pelas três áreas aprovadas, incluindo
      o link acessível para Spec-Driven Development, em `src/i18n/dictionary.ts`
- [x] T047 Centralizar o cabeçalho e reorganizar as três competências como cards horizontais iguais,
      com reflow para uma coluna em telas estreitas, em `src/components/sections/Skills.tsx`,
      `src/components/sections/SectionShell.tsx` e `src/styles.css`
- [ ] T048 Inspecionar o reflow, a legibilidade e o link da seção em 320px, 390px, 412px e desktop,
      nos dois idiomas e temas, durante a finalização consolidada

## Fase 10: Consolidação arquitetural da tipografia

- [x] T141 Auditar famílias, pesos, tamanhos, entrelinhas, tracking e medidas de leitura na Home,
      Sobre, cases, Header, Footer, formulários e páginas informativas
- [x] T142 Centralizar tokens e papéis semânticos em `src/styles.css`, migrando componentes sem
      alterar layout, conteúdo, traduções, temas ou interações
- [x] T143 Corrigir Depoimentos para DM Sans 400, nome destacado de Sobre para 400, metadados para
      Space Grotesk 400, estados de formulário para 500 e indicadores numéricos para Space Grotesk 400
- [x] T148 Corrigir a lista de Core Web Vitals do Footer para LCP, INP e CLS e reorganizar o
      fechamento com agradecimento, localização, fuso e hora local dinâmica, preservando os links
      legais e o reflow móvel em PT-BR e EN-US
- [ ] T149 Validar o Footer atualizado em mobile/desktop, PT-BR/EN-US e claro/escuro quando o ciclo
      de design for declarado concluído
- [x] T150 Atualizar a apresentação pessoal e o CTA de trajetória de Sobre com as cópias aprovadas
      em PT-BR e EN-US, preservando a composição existente
- [ ] T151 Validar o reflow das novas cópias de Sobre nos dois idiomas quando o ciclo de design for
      declarado concluído
- [x] T152 Remover do Footer os indicadores de infraestrutura e a duração da sessão ativa,
      redistribuindo marca, navegação, conexões e Core Web Vitals no grid responsivo existente
- [ ] T153 Validar a nova composição do Footer em mobile/desktop, PT-BR/EN-US, temas claro/escuro e
      zoom de 200% quando o ciclo de design for declarado concluído
- [x] T154 Restaurar somente a estrutura espacial de referência do Footer, preservando integralmente
      cores, hierarquia tipográfica e conteúdo atual
- [ ] T155 Validar o reflow da estrutura restaurada em mobile/desktop quando o ciclo de design for
      declarado concluído
- [x] T156 Restaurar a regra global explícita de espaçamento lateral da Home no container
      compartilhado, preservando gutters responsivos, safe areas e superfícies full-bleed
- [ ] T157 Validar o espaçamento lateral compartilhado da Home em mobile e desktop quando o ciclo
      de design for declarado concluído
- [x] T158 Restaurar na Home o frame global centralizado de `75rem`, removendo os overrides locais
      de largura e gutter sem alterar superfícies, fundos ou mídia full-bleed
- [ ] T159 Validar a centralização do conteúdo da Home contra a referência publicada em desktop e
      mobile quando o ciclo de design for declarado concluído
- [x] T160 Preservar o container independente do Header e reorganizar o Footer nas três faixas da
      referência fornecida, sem alterar conteúdo, cores ou hierarquia tipográfica
- [ ] T161 Validar o reflow da nova estrutura do Footer em mobile e desktop quando o ciclo de design
      for declarado concluído
- [x] T162 Padronizar ritmo e entrelinha do Footer, compactar Vitals, localizar os novos títulos,
      trocar textos de conexão por ícones acessíveis e inverter a ênfase do fechamento
- [x] T163 Restaurar o frame fluido independente do conteúdo textual do Hero, sem limite máximo e
      alinhado à esquerda, preservando o frame global das demais seções e o container do Header
- [ ] T164 Validar Footer e Hero em mobile/desktop, PT-BR/EN-US e temas claro/escuro quando o ciclo
      de design for declarado concluído
- [x] T165 Remover agradecimento e conexões do Footer, mover os selos para a primeira faixa e a
      assinatura para a segunda faixa e reduzir a composição a um único divisor interno
- [ ] T166 Validar a composição final de duas faixas do Footer em mobile e desktop quando o ciclo de
      design for declarado concluído
- [x] T167 Alinhar Website Carbon à esquerda, renomear Vitals para Core Web Vitals com respiro,
      listar as seis seções da Home e posicionar links legais por extenso acima do divisor
- [ ] T168 Validar inventário, ordem, alinhamento e reflow do Footer em mobile/desktop e PT-BR/EN-US
      quando o ciclo de design for declarado concluído
- [x] T169 Manter Navegação e Core Web Vitals nas duas colunas superiores à direita, posicionar
      todo o grupo junto ao limite direito, alinhar Privacidade/Acessibilidade à direita e manter os
      selos lado a lado
- [x] T170 Refatorar somente a galeria de Projetos para três cards verticais responsivos com mídia
      integral, gradiente, raio padronizado, maior respiro após o cabeçalho, badges localizados,
      indicador play/clique menor, centralizado e com animação sutil, links iconográficos de preview
      e GitHub e expansão lenta e estável com vídeo em hover/foco, sem oscilação causada pelo próprio
      reflow e com enquadramento individual sem barras laterais; atualizar o cabeçalho editorial e
      renomear o case de portfólio profissional em PT-BR e EN-US
- [x] T171 Remover o overscan adicional dos previews de Projetos e substituir os glifos de aspas dos
      Depoimentos por símbolos vetoriais consistentes, menores e posicionados em linhas próprias
      acima e abaixo do texto citado
- [x] T172 Usar o ícone de marca do WhatsApp em toda entrada telefônica visível da seção Contato
- [x] T173 Padronizar os cabeçalhos visíveis da Home na ordem título, linha separadora e subtítulo,
      preservando o bloco de contato principal ao lado do cabeçalho de Contato
- [x] T174 Restaurar na Home a composição anterior de Sobre com título centralizado, retrato atual
      único à esquerda e narrativa com CTA à direita, removendo ferramentas e painéis auxiliares e
      preservando tokens tipográficos, raio padrão e reflow responsivo
- [x] T175 Implementar rolagem global com inércia em todas as rotas por um único controlador Lenis,
      integrar âncoras e controles programáticos, preservar toque e diálogos nativos e respeitar
      `prefers-reduced-motion`
- [ ] T176 Validar rolagem por roda, teclado, toque, âncoras, restauração de rota, diálogos e
      movimento reduzido em desktop e mobile durante a finalização consolidada
- [x] T177 Remover o título visual da seção Sobre na Home e apresentar o retrato transparente atual
      como recorte integral sem fundo, moldura, raio, sombra ou corte, preservando heading oculto,
      narrativa, CTA e reflow responsivo
- [ ] T178 Validar o recorte transparente e o reflow de Sobre em mobile e desktop, claro/escuro e
      PT-BR/EN-US durante a finalização consolidada
- [x] T179 Reescrever a chamada da Home para Sobre a partir da carta de apresentação, com marcador,
      título pessoal, parágrafo curto e CTA bilíngues, preservando o recorte transparente e os papéis
      tipográficos existentes
- [ ] T180 Validar a nova chamada de Sobre em PT-BR/EN-US, claro/escuro, mobile e desktop durante a
      finalização consolidada
- [x] T181 Reestruturar Sobre na Home conforme a referência editorial fornecida, usando o novo
      recorte transparente, apresentação sobreposta, trilho de CTAs e links sociais com conteúdo já
      existente e reflow responsivo
- [ ] T182 Validar a composição de Sobre em PT-BR/EN-US, claro/escuro, mobile e desktop durante a
      finalização consolidada
- [x] T183 Ampliar discretamente o retrato de Sobre, ancorar sua base ao divisor de Projetos e
      substituir a narrativa por conteúdo factual sobre ProUni, programas de tecnologia e atuação em
      aplicações digitais nos dois idiomas
- [x] T184 Remover fundo, borda e cantos arredondados da composição de Sobre e substituir os CTAs
      com seta pelos botões padrão do projeto
- [x] T185 Converter os CTAs de Sobre em links textuais sem setas, preservar o papel `page-title`,
      destacar a função full stack com o acento da marca e remover a chamada de curiosidade
- [x] T186 Ajustar a apresentação para “Olá, eu sou o Guilherme Eleuthério, / Desenvolvedor
      Full-stack”, restaurar a hierarquia de corpo e controle no trilho e reutilizar `link-ink` sem
      efeitos exclusivos nos CTAs
- [x] T187 Corrigir a medida do título para preservar as duas linhas previstas em desktop e impedir
      que a regra global de headings substitua o tamanho de controle dos títulos do trilho
- [x] T188 Aplicar à apresentação de Sobre a sequência editorial de Projetos — título, divisor e
      introdução — e corrigir o trilho para títulos `content-title` sobre descrições `body-copy`
- [x] T189 Atualizar o título e o apoio de Projetos em PT-BR e EN-US e centralizar horizontalmente o
      cabeçalho editorial completo sem alterar a galeria
- [x] T190 Atualizar o cabeçalho de Competências em PT-BR e EN-US para “E além disso, o que mais
      posso oferecer?” e aprendizado focado na prática, centralizando o bloco com texto e divisor
      alinhados à esquerda
- [x] T191 Preservar no destaque “Desenvolvedor Full-stack” o primeiro plano escuro do acento no
      tema escuro, impedindo que a regra editorial posterior substitua a cor local
- [x] T192 Implementar a transição cromática do fundo da Home vinculada à rolagem com CSS
      Scroll-driven Animations, tokens Paper & Steel, fallback estático e redução de movimento
- [x] T193 Simplificar o conteúdo de Competências em três colunas editoriais de altura natural,
      removendo superfícies, bordas, raios e sombras sem alterar título, introdução ou conteúdo
- [x] T194 Remover das três competências as listas suplementares de tópicos em PT-BR e EN-US,
      preservando títulos, descrições e o link de SDD
- [x] T195 Substituir o capítulo de curiosidades da página Sobre pelos quatro indicadores de
      trajetória removidos da Home, preservando localização, hierarquia numérica e reflow responsivo
- [x] T196 Remover animação e máscaras do retrato de Sobre na Home e aplicar ao título e à introdução
      o embaralhamento com digitação compartilhado do wordmark, preservando PT-BR, EN-US e movimento
      reduzido em `src/components/sections/About.tsx` e `src/styles.css`
- [x] T197 Substituir o controle circular de avanço de Sobre pelo contador de cafés compartilhado,
      precedido pelo convite localizado em PT-BR e EN-US, preservando interação, estados remotos,
      acessibilidade e reflow em `src/components/sections/About.tsx`, `src/i18n/dictionary.ts` e
      `src/styles.css`
- [x] T198 Substituir o bloco “Meu trabalho” de Sobre pelo resumo profissional localizado e converter
      seu CTA textual no download direto do currículo PDF existente, preservando integralmente o
      design em `src/components/sections/About.tsx` e `src/i18n/dictionary.ts`
- [x] T199 Restaurar no wordmark animado do Header o embaralhamento e a digitação de `fer.tech`,
      preservando tipografia, instâncias estáticas e o fallback sem animação para movimento reduzido
      em `src/components/GuiferWordmark.tsx`
- [x] T200 Expandir o Header para os seis destinos da Home, estabilizar o reflow bilíngue pelo
      breakpoint responsivo amplo, simplificar os controles de idioma e tema e atualizar o CTA de
      contato em `src/components/layout/Header.tsx`, `src/components/LanguageToggle.tsx`,
      `src/i18n/dictionary.ts` e `src/styles.css`
- [x] T201 Remover o link redundante de Contato da navegação, reduzir a ênfase dos rótulos de idioma
      e eliminar a borda azul do CTA recolhido, preservando Contato como destino observado e o CTA
      como controle exclusivo em `src/components/layout/Header.tsx`,
      `src/components/LanguageToggle.tsx` e `src/styles.css`
- [x] T202 Alinhar ao lado esquerdo do container o bloco de título, divisor e introdução de
      Competências, preservando texto, tipografia e as três colunas editoriais em `src/styles.css`
- [x] T203 Remover de Projetos o convite final e seu CTA e integrar visualmente Projetos e
      Habilidades por fundo contínuo, sem divisor ou espaçamento residual, em
      `src/components/sections/Projects.tsx` e `src/styles.css`
- [x] T204 Atualizar as cópias localizadas de Depoimentos, dos diferenciais de IA e curiosidade e de
      Contato, incluindo o novo rótulo dos canais, em `src/i18n/dictionary.ts` e
      `src/components/sections/Contact.tsx`
- [x] T205 Adicionar explicação localizada em hover e foco ao contador compartilhado de cafés,
      preservando sua lógica de contagem e o acesso após o registro, em
      `src/components/hero/HeroStats.tsx` e `src/i18n/dictionary.ts`
- [x] T206 Atualizar o título e a introdução localizados de Depoimentos em PT-BR e EN-US, sem alterar
      estrutura, tipografia ou layout, em `src/i18n/dictionary.ts`
- [x] T207 Deslocar verticalmente para cima o título e o subtítulo de apresentação de Sobre sem
      alterar largura ou quebras e centralizar os links sociais, adicionando WhatsApp com o ícone de marca existente, em
      `src/components/sections/About.tsx` e `src/styles.css`
- [x] T208 Atualizar o título e o subtítulo localizados da apresentação de Sobre e alinhar à esquerda
      os três links sociais, preservando retrato, tipografia e animação, em
      `src/i18n/dictionary.ts` e `src/styles.css`
- [x] T209 Ampliar discretamente a expansão ativa dos cards de Projetos e preservar integralmente o
      quadro dos previews sobre seus posters, sem aparência de zoom, em `src/styles.css`
- [x] T210 Ajustar a expansão ativa de Projetos para a proporção 50/25/25 e adicionar poster
      desfocado com contraste localizado sob o título, preservando o preview integral e nítido, em
      `src/styles.css`
- [x] T211 Corrigir a expansão ativa de Projetos para dois terços da galeria e remover integralmente
      o painel adicional aplicado ao título, preservando somente o poster desfocado, em
      `src/styles.css`
- [x] T212 Orientar verticalmente somente os títulos dos cards de Projetos nos estados inicial e
      recolhido, mantê-los horizontais e sem quebra no estado ativo e ancorar as tags no topo direito
      sem alterar os ícones de preview e GitHub, em `src/components/sections/Projects.tsx` e
      `src/styles.css`
- [x] T213 Mover as tags para uma faixa externa acima de cada card, centralizar integralmente os
      títulos verticais e aplicar crossfade sutil para o título horizontal ativo sem alterar os
      ícones, em `src/components/sections/Projects.tsx` e `src/styles.css`
- [x] T214 Alinhar os títulos verticais ao recuo esquerdo dos cards, preservando centralização
      vertical, crossfade e estados ativos, em `src/styles.css`
- [x] T215 Compactar e deslocar para baixo o grupo de título horizontal e ícones do card ativo,
      mantendo-o integralmente na faixa escura inferior e fora do preview, em `src/styles.css`
- [x] T216 Mover as tags para abaixo do título nos grupos visualmente vertical e horizontal,
      preservando semântica, crossfade e a linha independente de ícones, em
      `src/components/sections/Projects.tsx` e `src/styles.css`
- [x] T217 Aplicar orientação vertical ao grupo de tags somente no estado vertical do card,
      preservando a orientação horizontal no estado ativo, em `src/styles.css`
- [x] T218 Posicionar as tags verticais em uma coluna separada à esquerda do título vertical,
      preservando o grupo horizontal abaixo do título ativo, em `src/styles.css`
- [x] T219 Alinhar o início das colunas verticais de título e tags em uma linha comum próxima ao
      topo dos cards, sem alterar os ícones ou o alinhamento lateral, em `src/styles.css`
- [x] T220 Aplicar aos cards verticais de Projetos uma faixa escura e desfocada equivalente à faixa
      de título do Hero, removendo-a no estado horizontal ativo sem alterar os ícones, em
      `src/components/sections/Projects.tsx` e `src/styles.css`
- [x] T221 Reduzir responsivamente o recuo horizontal do título, das tags e dos ícones inferiores
      quando o card atingir a largura mínima recolhida, mantendo todos dentro da faixa desfocada sem
      alterar seus eixos verticais, em `src/styles.css`
- [x] T222 Reorganizar exclusivamente o Header móvel para manter o hambúrguer sempre visível e mover
      idioma, tema e CTA de Contato para dentro do painel, sem alterar o Header desktop, em
      `src/components/layout/Header.tsx` e `src/styles.css`
- [x] T223 Refinar o layout do menu móvel mantendo o wordmark em sua linha superior aberta e
      distribuindo navegação, utilidades e CTA em grupos responsivos, sem alterar elementos nem o
      Header desktop, em `src/components/layout/Header.tsx` e `src/styles.css`
- [x] T224 Remover no mobile a revelação do Header por rolagem para cima e manter o wordmark visível
      exclusivamente dentro do menu expandido, preservando o hambúrguer e o Header desktop, em
      `src/components/layout/Header.tsx`
- [x] T225 Compactar o painel móvel à altura natural, centralizar os destinos e alinhar tema, idioma
      e CTA de Contato em uma única linha sem o espaçador inferior legado, em
      `src/components/layout/Header.tsx` e `src/styles.css`
- [x] T226 Converter o CTA móvel de Contato no último item centralizado da navegação, após
      Depoimentos, e manter apenas tema e idioma na linha de utilidades, sem alterar o Header
      desktop, em `src/components/layout/Header.tsx`
- [x] T227 Distribuir tema e idioma nas extremidades esquerda e direita da linha de utilidades móvel
      e aplicar a ambos uma aparência sutil e consistente de botão, em
      `src/components/layout/Header.tsx` e `src/styles.css`
- [x] T228 Adicionar respiro lateral à linha de botões móvel, afastando ambos os controles das bordas
      sem alterar o espaçamento vertical ou o divisor, em `src/styles.css`
- [x] T229 Estender a superfície do título do Hero por toda a largura móvel e reduzir discretamente
      sua altura por meio dos espaçamentos responsivos existentes, preservando desktop, em
      `src/components/sections/Hero.tsx` e `src/styles.css`
- [x] T144 Remover Caveat de CSS, assets, dependências e pipeline; preservar e documentar monospace
      somente em código/terminal, wordmark 700/300 e Website Carbon 700/600
- [x] T145 Atualizar o MIV e os artefatos da feature com a arquitetura tipográfica, escala,
      exceções e critérios de aceite consolidados
- [x] T230 Separar a visibilidade da superfície do Header mobile do estado de revelação do Header
      desktop, removendo a barra escura residual ao fechar o menu e preservando somente o acionador
      hambúrguer, em `src/components/layout/Header.tsx`
- [x] T231 Reorganizar exclusivamente o fluxo móvel da seção Sobre para posicionar o retrato antes
      do conteúdo textual, impedir sobreposição dos divisores e padronizar o ritmo vertical sem
      alterar tablet ou desktop, em `src/styles.css`
- [x] T232 Restaurar no mobile a sobreposição da apresentação pessoal sobre o retrato por uma camada
      de grid, aplicar fade inferior e reduzir o respiro superior, mantendo os divisores dos detalhes
      após a imagem e preservando tablet e desktop, em `src/styles.css`
- [x] T233 Remover o respiro móvel adicional de `32px` acima do retrato de Sobre, mantendo apenas a
      distância segura do Header e preservando fade, sobreposição textual e layouts maiores, em
      `src/styles.css`
- [x] T234 Implementar preloader inicial independente do bundle React, com superfície full-screen
      desfocada, wordmark embaralhado/digitado, mensagem de carga, redução de movimento e remoção no
      evento nativo `load`, em `index.html`, `public/preloader.css` e `public/preloader.js`
- [x] T235 Substituir o texto simples do preloader pela estrutura oficial do wordmark, mantendo o
      círculo `gui` estático e aplicando embaralhamento/digitação somente ao sufixo `fer.tech`, em
      `index.html`, `public/preloader.css` e `public/preloader.js`
- [x] T236 Igualar o tamanho da mensagem ao wordmark do preloader e adicionar reticências com efeito
      de digitação sem layout shift e com fallback estático para movimento reduzido, em
      `index.html` e `public/preloader.css`
- [x] T237 Reduzir “Please wait” e suas reticências para metade do tamanho de “Loading.” no
      preloader, preservando alinhamento e animação, em `index.html` e `public/preloader.css`
- [x] T238 Uniformizar o tamanho reduzido de “Loading.” e “Please wait”, adicionar espaço fixo entre
      as frases e substituir o recorte das reticências por três pontos sequenciais sem layout shift,
      em `index.html` e `public/preloader.css`
- [x] T239 Converter somente no mobile a galeria de Projetos em carrossel manual de um card por snap
      e adicionar pressão longa com cancelamento por movimento para reproduzir a prévia enquanto
      pressionada, acompanhada de ícone e descrição acessível, em
      `src/components/sections/Projects.tsx`, `src/styles.css` e `src/i18n/dictionary.ts`
- [x] T240 Substituir no carrossel móvel a pressão longa por autoplay da prévia do card central e
      implementar loop infinito bidirecional com clones de fronteira inacessíveis e normalização
      instantânea, preservando o swipe manual e o desktop, em
      `src/components/sections/Projects.tsx`, `src/styles.css` e `src/i18n/dictionary.ts`
- [x] T241 Simplificar somente no mobile a seção Sobre, ocultando os dois artigos de detalhe,
      adicionando CTA primário localizado para `/sobre` e ampliando/centralizando os ícones sociais,
      preservando tablet e desktop, em `src/components/sections/About.tsx`, `src/styles.css` e
      `src/i18n/dictionary.ts`
- [x] T242 Posicionar no mobile o CTA de Sobre abaixo de um divisor integral e centralizar botão,
      título social e ícones, preservando tablet e desktop, em
      `src/components/sections/About.tsx` e `src/styles.css`
- [x] T243 Substituir somente no mobile o subtítulo editorial de Projetos por uma instrução
      localizada de swipe e abertura do card, preservando a cópia original em tablet/desktop, em
      `src/components/sections/Projects.tsx`, `src/components/sections/SectionShell.tsx` e
      `src/i18n/dictionary.ts`
- [x] T244 Centralizar no mobile o cabeçalho e a autoria de Depoimentos e corrigir o seletor para uma
      única linha com anterior, seis segmentos, próximo e autoplay funcionais, preservando desktop,
      em `src/styles.css`
- [x] T245 Compactar somente no mobile a distância entre citação e autoria em Depoimentos usando
      linhas de conteúdo agrupadas no início e gap de `0.25rem`, preservando desktop, em
      `src/styles.css`
- [x] T246 Aumentar discretamente o respiro entre introdução e depoimento no mobile e excluir slides
      inativos do cálculo de altura para aproximar o seletor do conteúdo ativo, preservando desktop,
      em `src/styles.css`
- [x] T247 Padronizar no mobile o ritmo interno de Depoimentos em `0.75rem` entre citação, autoria e
      seletor, preservando o respiro hierárquico do cabeçalho e o desktop, em `src/styles.css`
- [x] T248 Reorganizar somente no mobile o rótulo e os quatro links de Contato como um bloco
      centralizado de ícones horizontais após o formulário, com alvos acessíveis, separação para toque
      e ritmo consistente, preservando a lista textual no desktop, em
      `src/components/sections/Contact.tsx` e `src/styles.css`
- [x] T249 Reorganizar somente no mobile o Footer em blocos compactos com badges empilhados fora da
      superfície, navegação iconográfica `2 × 3` e controles legais como os únicos elementos com
      fundo arredondado de botão, painel horizontal de Core Web Vitals e fechamento compacto,
      preservando conteúdo, interações e desktop, em `src/components/layout/Footer.tsx` e
      `src/styles.css`
- [x] T250 Acrescentar respiro lateral discreto ao Footer mobile e remover fundo, borda, raio e
      divisores do grupo de Core Web Vitals, mantendo as três métricas sobre o fundo natural e
      preservando desktop, em `src/styles.css`
- [x] T251 Reordenar somente no mobile os links legais para antes de Core Web Vitals e mover os
      badges para o encerramento do Footer, empilhados e centralizados, sem duplicar conteúdo ou
      alterar desktop, em `src/styles.css`
- [x] T252 Centralizar somente no mobile as linhas de localização e horário e de wordmark e copyright
      no fechamento do Footer, preservando conteúdo, ritmo e alinhamento desktop, em `src/styles.css`
- [x] T253 Limitar no mobile depoimentos longos a uma região rolável com fade e seta de continuidade,
      pausar autoplay após rolagem manual e substituir o intervalo fixo por duração calculada pelo
      total de palavras, preservando relatos curtos, autoria e controles, em
      `src/components/sections/Testimonials.tsx`, `src/styles.css` e `src/i18n/dictionary.ts`
- [x] T254 Remover o ícone decorativo de Core Web Vitals, encurtar a introdução localizada de Contato
      e converter os quatro canais em links apenas por ícone numa linha horizontal em todos os
      breakpoints, preservando acessibilidade e destinos, em `src/components/layout/Footer.tsx`,
      `src/components/sections/Contact.tsx`, `src/i18n/dictionary.ts` e `src/styles.css`
- [x] T255 Estabilizar no mobile as linhas de citação e autoria dos seis Depoimentos para impedir que
      seletor e seção seguinte mudem de posição entre relatos curtos e longos, mantendo a rolagem
      interna e os indicadores do conteúdo excedente, em `src/styles.css`
- [x] T256 Igualar no mobile o respiro entre divisor e CTA de Sobre ao intervalo entre ícones sociais
      e contador de cafés, usando `3rem` sem alterar os demais breakpoints, em `src/styles.css`
- [ ] T146 Validar reflow, contraste, foco e zoom em 320, 412, 768 e 1440 px, PT-BR/EN-US e temas
      claro/escuro, registrando evidências em `specs/003-home-responsive-baseline/validation.md`
- [ ] T147 Executar Prettier, lint, typecheck, testes de API/browser/acessibilidade, build e gate de
      carbono, corrigindo regressões do escopo antes de concluir
- [x] T148 Atualizar a segunda frase do Hero PT-BR para “Programação, Análise de software e serviços
      de TI.” e EN para “Programming, software analysis and IT services.” em `src/i18n/dictionary.ts`, sincronizar a expectativa em
      `e2e/hero-header.spec.ts` e validar copy e reflow no browser.
- [x] T257 Atualizar a introdução de Contato e o título e subtítulo de Depoimentos em PT-BR/EN-US
      em `src/i18n/dictionary.ts`, corrigindo a grafia de “qualquer dúvida”.
      Depoimentos usa “Meu trabalho também é contado por quem esteve ao meu lado.” e
      “Alguns depoimentos de quem conhece o meu trabalho.”, com tradução em EN-US.
- [x] T258 Atualizar o título de Contato para “Vamos conversar?” e a introdução para “Fique à vontade
      para falar sobre algum projeto ou tirar qualquer dúvida. Estou aberto para novas oportunidades.”,
      com tradução EN-US; manter o ponto final junto ao botão de Aviso de Privacidade e validar
      a geometria em PT/EN a 320, 412, 768 e 1440 px, com inspeção renderizada direcionada.
- [x] T259 Implementar a grade desktop de Projetos com duas colunas e frames `1.28:1`, badges no
      canto superior direito, vídeo por intenção, overlay com título/descrição/contexto e ícones na
      base; preservar mobile/tablet em `Projects.tsx`, `project-summaries.ts` e `styles.css`.
- [x] T260 Inspecionar visualmente capa e hover em desktop; manter testes e gates automatizados
      pendentes por solicitação explícita do usuário nesta iteração.
- [x] T261 Expandir a seção e grade desktop de Projetos para toda a largura, removendo gaps, bordas
      e raios dos frames; restaurar o estilo original dos badges mantendo a posição superior direita.
- [x] T262 Melhorar a mídia desktop de Projetos: sources de maior qualidade, enquadramento integral
      e centralizado, primeiro frame decodificado antes do fade e liberação do vídeo após fade de saída.
      Inspecionar no browser, mantendo testes e gates adiados por solicitação do usuário.
- [x] T263 Preencher os frames desktop sem barras ou distorção com imagem e vídeo em `cover`,
      preservando posters nítidos e crossfade; restaurar a caixa do cursor sobre o link do card e
      inspecionar no browser, sem executar testes ou gates nesta iteração.
- [x] T264 Restaurar a composição editorial de T109 com referência no checkpoint `a72824b`: uma
      linha por projeto, alternância desktop, proporção natural da mídia, badges inferiores,
      detalhes/links visíveis e convite final localizado; restaurar frame global e remover banners.
- [x] T265 Inspecionar a restauração editorial em desktop e registrar fidelidade e limitações;
      manter testes, lint, typecheck, build e demais gates adiados até finalização solicitada.
- [x] T266 Remover o convite final e botão de Contato da seção Projetos e a linha numerada de
      categoria de todos os projetos, em PT-BR/EN-US, preservando a composição editorial alternada.
- [x] T267 Substituir integralmente Habilidades pelo mockup de Serviços e Mais do que código,
      incluindo conteúdo PT/EN, layout tipográfico, grades, divisores e reflow em `Skills.tsx`,
      `dictionary.ts` e `styles.css`; inspecionar no desktop sem executar testes/gates nesta rodada.
- [x] T268 Adicionar ícones coloridos da stack acima das ações de cada projeto, reutilizar a caixa
      do cursor para o nome da tecnologia e inspecionar responsividade sem alterar o conteúdo.
- [x] T269 Estabilizar a caixa do cursor e seu tamanho entre ícones da mesma stack, incluindo gaps;
      encurtar a introdução de Serviços a um parágrafo em PT/EN e inspecionar sem testes/gates.
- [x] T270 Revisar a copy de Serviços e “Como eu trabalho” a partir da linguagem da Home e dos
      projetos, remover redundâncias, adaptar PT/EN e reduzir a grade inferior a seis práticas;
      inspecionar sem executar testes ou gates.
- [x] T271 Atualizar título e introdução do bloco para Princípios de desenvolvimento em PT/EN,
      corrigindo “profissionais” e preservando os seis itens e o layout.
- [x] T272 Atualizar a introdução de Serviços com a copy solicitada sobre serviços em TI e sistemas,
      em PT-BR e EN-US, sem alterar o layout.
- [x] T273 Restaurar os três cards expansíveis anteriores conforme T211–T221, incluindo faixa
      vertical, metadados, indicador, vídeo por intenção e estados responsivos; inspecionar sem testes.
- [x] T274 Aplicar os seis pares de substituição de títulos e descrições do PDF “Entender o problema”
      em Princípios de desenvolvimento, preservando layout e atualizando a versão EN-US.
- [x] T275 Revisar acentos e capitalização da Home PT-BR, uniformizar títulos autorais do site em
      caixa de frase e preservar nomes próprios/siglas/citações, com inspeção e sem testes/gates.
- [x] T276 Aplicar as quatro substituições de Serviços em PT/EN, incluindo SEO e indexação orgânica,
      corrigindo acentos/capitalização e preservando layout e demais conteúdos.
- [x] T277 Criar e integrar quatro ilustrações SVG autorais para os serviços, com personagem,
      cenas específicas, paleta coordenada, temas e dimensionamento fluido; inspecionar sem testes.
- [x] T278 Converter os seis princípios em disclosures suaves por hover/foco no desktop e por
      toque no mobile, com semântica, Escape e movimento reduzido; inspecionar sem testes/gates.
- [x] T279 Abrir os princípios em sequência na primeira chegada à seção, remover hover/foco como
      gatilhos e manter controle por clique/toque/teclado com prioridade manual; inspecionar sem testes.
- [x] T280 Substituir as quatro artes de serviços por uma ilustração SVG única, sem pessoas ou
      rostos, sob a introdução na coluna esquerda; preservar copy e princípios e inspecionar sem testes.
- [x] T281 Recolorir a ilustração de Serviços exclusivamente com tokens do projeto, preservando
      desenho e layout; inspecionar nos dois temas sem executar testes/gates.
- [x] T282 Remover os divisores externos acima e abaixo de Princípios de desenvolvimento,
      preservando espaçamento, filete curto e linhas/interações dos itens.
- [x] T283 Alinhar títulos, introduções, subtítulos e descrições de Serviços/Princípios aos papéis
      tipográficos compartilhados da Home, removendo overrides locais e inspecionando reflow sem testes.
- [x] T284 Reduzir a arte de Serviços e as quebras do título de Depoimentos apenas no mobile;
      manter Princípios inicialmente recolhidos até toque e preservar a entrada no desktop, sem testes.
- [x] T285 Reduzir a escala dos títulos e descrições dos itens de Serviços/Princípios no desktop,
      preservando cabeçalhos principais e mobile; inspecionar proporção e reflow sem testes/gates.
- [x] T286 Corrigir deslocamento do wordmark do loader após CSS/fonte, tornando box-sizing e
      largura do sufixo estáveis desde a primeira pintura; inspecionar bootstrap sem testes/gates.
- [x] T287 Unificar o ritmo vertical entre as seções da Home, incluindo Serviços → Princípios,
      removendo paddings acumulados e altura mínima extra-wide; medir desktop/mobile sem testes.
- [x] T288 Baixar a introdução Sobre em 24px somente no mobile para aproveitar a região clara
      do fade do retrato, preservando desktop e espaçamento externo; inspecionar sem testes.
- [x] T289 Distinguir Princípios de Serviços por faixa suave de fundo somente no mobile,
      preservando o ritmo entre conteúdos, temas e disclosures; inspecionar sem testes/gates.
- [x] T290 Ampliar CTAs e links sociais mobile, corrigir contraste dos controles do rodapé e
      ativar autoplay mudo do Hero mobile com movimento reduzido respeitado; inspecionar sem testes.
- [x] T291 Recarregar a página atual após salvar outro idioma pelos controles mobile/desktop,
      preservando tema e URL; inspecionar navegação real sem testes/gates.
- [x] T292 Suavizar a navegação mobile aguardando layout das seções adiadas antes do scroll,
      atualizar dimensões Lenis e preservar foco/hash/cancelamento; inspecionar sem testes/gates.
- [x] T293 Persistir idioma sem publicar no documento atual antes do reload; aplicar seleção
      somente no bootstrap seguinte e inspecionar a ordem mobile/desktop sem testes/gates.
- [x] T294 Substituir play dos cards por indicadores SVG autorais de deslize/clique, com legendas
      PT/EN e transições coordenadas, preservando links/carrossel e movimento reduzido; inspecionar.
- [x] T295 Montar antecipadamente seções e todos os estados de imagens da Home; coordenar
      fontes, decode, vídeo e dados iniciais antes de concluir o loader, com fallback/recuperação.
- [x] T296 Separar preparo de efeitos: atividade/entradas só após revelação, Hero com autoplay
      em todos os dispositivos e preload real, preservando movimento reduzido e pausa manual.
- [x] T297 Inspecionar prontidão com assets atrasados/falhos, mobile/desktop, troca de idioma,
      chegada a seções e vídeo; registrar limitações e gates adiados, sem executar testes.
- [x] T298 Iniciar indicadores com prompts completos, espaçar mudanças em 10s, centralizar
      conteúdo e ampliar ícones eliminando largura vazia; inspecionar sem testes/gates.
- [x] T299 Adicionar currículo PDF abaixo do CTA Sobre mobile com estilo do link desktop;
      transformar CTA desktop em botão primário compacto e inspecionar sem testes/gates.
- [x] T300 Mostrar prompts de deslize/clique em sequência, nunca simultâneos, com pausa de
      10s após o ciclo; preservar dimensões/transições e inspecionar sem testes/gates.
- [x] T301 Substituir arte de Serviços por CTA Entre em contato que navega e foca o formulário,
      com rolagem suave e texto PT/EN; inspecionar responsividade e navegação sem testes/gates.
- [x] T302 Ampliar intervalos mobile em 50% para 84px e autoexpandir cada princípio ao entrar
      na área de leitura, respeitando decisões manuais e desktop; inspecionar sem testes/gates.
- [x] T303 Remover todos os divisores entre seções da Home e borda superior do rodapé,
      preservando linhas internas, filetes curtos e ritmo responsivo; inspecionar sem testes/gates.
- [x] T304 Iteração textual do rodapé interrompida e substituída pela restauração parcial T305;
      nenhuma remoção de conteúdo foi mantida.
- [x] T305 Restaurar composição/selos/marca do rodapé, mantendo navegação e Web Vitals textuais;
      preservar conteúdo e ações e inspecionar sem testes/gates.
- [x] T306 Aplicar onda suave no final do fundo mobile de Princípios, preservando cores, texto
      e intervalos existentes; inspecionar temas e desktop sem testes/gates.
- [x] T307 Aplicar o CSS de fade por linha fornecido pelo usuário (300ms + stagger 100ms),
      substituindo a cortina anterior; preservar texto/layout/redução de movimento e leitura.
- [x] T308 Adaptar somente o acordeão React do anexo aos cards existentes, com painel persistente,
      proporção 60%, transição 600ms, foco/setas/toque e movimento reduzido; preservar mídias,
      dados, reprodução, grade tablet e carrossel mobile. Inspecionar sem testes/gates.
- [x] T309 Corrigir orientação conforme screenshot: banners horizontais empilhados, primeiro
      painel aberto, expansão vertical 75%, sem conteúdo/faixa verticais; preservar dados e
      mídias, adaptar toque e verificar mobile/desktop sem testes/gates.
- [x] T310 Reservar altura legível nos painéis recolhidos e manter nome/badges/links sempre
      visíveis e acessíveis; preservar acordeão/mídias e inspecionar sem testes/gates.
- [x] T311 Estender fade 300ms/stagger 100ms aos dados textuais da autoria, preservando
      semântica/layout e imagens estáticas; inspecionar desktop/mobile/redução sem testes.
- [x] T312 Revelar retratos e marcas profissionais em fatia radial horária de 1s, preservando
      layout/fades de texto e redução de movimento; inspecionar sem testes/gates.
- [x] T313 Substituir wipe radial por pixels partindo de borda aleatória por imagem/ativação,
      preservar conteúdo/layout/fades e redução; inspecionar sem testes/gates.
- [x] T314 Remover nome do link LinkedIn preservando nome acessível e acelerar pixels para
      cerca de 720ms; inspecionar sem testes/gates.
- [x] T315 Sincronizar quote, autoria e pixels pela duração real das linhas do texto,
      aguardar medição e preservar pausa/estado final/redução; inspecionar sem testes/gates.
- [x] T316 Promover subtítulo de Depoimentos a título PT/EN e remover subtítulo duplicado,
      preservando restante da seção; sem testes/gates nesta edição textual.
- [x] T317 Substituir dropdowns de Princípios por marquee infinito bidirecional com arraste,
      sensibilidade à velocidade, inércia e retorno à velocidade normal; preservar conteúdo,
      semântica/redução/mobile e inspecionar sem testes/gates.
- [x] T318 Remover frame/gutters globais e caps externos da Home/páginas/Header/Footer,
      preservar componentes e inspecionar largura/overflow sem testes/gates.
- [x] T319 Aplicar insets locais 16/24/32/40px em Serviços/Princípios, Depoimentos, Contato e
      Footer; eliminar offsets cumulativos do Contato, preservar Header/Sobre/Projetos e
      inspecionar cinco viewports e geometria antes/depois, sem testes/gates.
- [x] T320 Usar insets de Sobre em todas as seções de conteúdo, incluindo Hero/Projetos;
      liberar marquee de Princípios full-width, preservar demais comportamentos e
      inspecionar geometria sem testes/gates.
- [x] T321 Dobrar insets de conteúdo preservando Header/título Hero, manter marquee full-width
      e centralizar conteúdo de Depoimentos exceto título; inspecionar sem testes/gates.
- [x] T322 Alinhar nav ao inset da Home, centralizar título/intro de Princípios e promover
      subtítulo de Projetos ao título PT/EN sem duplicação; inspecionar sem testes/gates.
- [x] T323 Alinhar Projetos à esquerda, centralizar bloco editorial de Serviços e uniformizar
      controles de reprodução/navegação pelo padrão de Depoimentos; inspecionar sem testes/gates.
- [x] T324 Centralizar verticalmente a introdução/CTA de Serviços na linha da grade,
      preservando stack mobile e demais estilos; sem testes/gates.
- [x] T325 Corrigir override do título da Home em DocumentMetadata para o título do index
      desejado, mantendo EN e metadata social coerentes; verificar sem testes/gates.
- [x] T326 Reduzir inset lateral da navegação pela metade, preservando seções e verificar
      alinhamento/ausência de colisão sem testes/gates.
- [x] T327 Ocultar CTA da nav quando recolhida, seguindo estado dos demais controles;
      verificar hover/foco e mobile sem testes/gates.
- [x] T328 Dobrar o padding de entrada das seções principais após Hero com token dedicado,
      preservar espaçamento interno e verificar geometria/screenshot em 320/412/768/1440px.
- [x] T329 Reorganizar Sobre conforme referência, foto quadrada à direita com recorte na cintura
      e fundo invertido por tema, sem título visível; preservar ações/café e inspecionar reflow/temas.
- [x] T330 Aplicar fundo normal do tema a Sobre, manter inversão apenas na foto e inspecionar
      alternância de tema com movimento normal, além da composição mobile/desktop existente.
- [x] T331 Aplicar regras explícitas por tema à superfície de Sobre e tokens de texto escuro,
      preservando inversão exclusiva do retrato; verificar alternância real do controle de tema.
- [x] T332 Centralizar textos e ações na coluna de Sobre, preservando retrato/temas/reflow.
- [x] T333 Mover foto de Sobre acima da saudação somente em mobile.
- [x] T334 Ativar expansão/reprodução dos Projetos pelo centro da viewport mobile e pausar saída.
- [x] T335 Mover copy/CTA Serviços ao final após prompt mobile; inspecionar escopo e responsividade.
- [x] T336 Inserir fechamento mobile dentro de Princípios após prompt, remover azul/onda
      e inspecionar superfície/posição/CTA sem alterar desktop.
- [x] T337 Remover reserva de expansão sem card ativo e reduzir entrada Serviços a 64px mobile;
      inspecionar distância/rolagem, preservando desktop.
- [x] T338 Restaurar reserva de expansão e zerar entrada adicional de Serviços no mobile.
- [x] T339 Ampliar marca acima dos badges e alinhar hora/copyright/legal na mesma linha desktop,
      preservando responsividade/ações e inspecionando geometria.
- [x] T340 Aplicar fundo e texto MIV do tema ativo ao Footer e verificar contraste/renderização.
- [x] T341 Aplicar acabamento tonal sólido e replay scramble no hover/foco da marca do Footer,
      sem modificar tamanho/proporções e respeitando redução de movimento.
- [x] T342 Substituir efeito Footer por React Bits Decrypted Text preservando marca/layout/temas.
- [x] T343 Manter decrypt durante hover/foco e ajustar glifos às células sem clipping.
- [x] T344 Limitar scramble a três caracteres perto do cursor e adicionar cauda de 650ms.
- [x] T345 Inverter marca e badges do Footer, mantendo badges acima em todos os tamanhos.
- [x] T346 Desfazer T345 e restaurar logo acima dos badges, sem reverter outras alterações.
- [x] T347 Reduzir marca Footer em 10%, preservando proporções/interações e inspecionando layout.
- [x] T348 Substituir marca grande por agradecimento discreto e inserir marca nav junto ao copyright.
- [x] T349 Aplicar exclamação, escala 120% e acabamento tonal sólido ao agradecimento Footer.
- [x] T350 Igualar intervalo Serviços–Princípios ao das seções principais somente >=1024px;
      comparar geometria e preservar mobile/tablet.
- [x] T351 Configurar hook E2E sobre índice isolado, testar caminhos de bloqueio/sucesso e instalar.
- [x] T352 Registrar comandos e resultados da preparação; manter falhas reais como bloqueadores.
- [x] T353 Corrigir contratos E2E obsoletos e regressões reais na Home/Header/Projetos/Footer.
- [x] T354 Validar baselines visuais e concluir suíte E2E completa sem falhas.
- [x] T355 Substituir networkidle por prontidão explícita no gate carbono e testar stream/loader.
- [x] T356 Reexecutar gate carbono e registrar medição real sem alterar orçamento/mídia.
- [x] T357 Restaurar mídia sob intenção explícita e widget sob demanda, preservando expansão/UI.
- [x] T358 Adiar preparo de imagens/JS não essencial e reduzir transferências até limite A+.
- [x] T359 Atualizar contratos de mídia/preparo/widget e verificar fluxo real, a11y e visual.
- [x] T360 Executar gates finais e registrar medição carbono, sem staging/commit.
- [x] T361 Reproduzir previews por hover desktop real, pausar saída e verificar carbono/reflow.
- [x] T362 Corrigir modo de linguagem de styles.css e validar os 29 diagnósticos do VS Code.
- [x] T363 Corrigir tipagem E2E e incluí-la no typecheck; verificar lint/build e screenshots.
- [x] T364 Estudar fluxo de commits e apresentar proposta PT-BR com grupos, arquivos e bloqueadores,
      preservando índice e aguardando aprovação antes da execução.
- [x] T365 Otimizar vídeo Hero abaixo de 25 MiB, preservar original e verificar reprodução/carbono.
- [x] T366 Revisar proposta de commits com dispensa E2E pontual autorizada, preservar demais gates
      e aguardar aprovação dos cinco grupos antes de staging ou commit.
- [x] T367 Substituir instalação APT por imagem oficial Playwright compatível, verificar engines
      e validar contrato do workflow.
- [ ] T368 Após aprovação do commit corretivo, publicar no PR destinado à main e verificar
      execução Linux completa sem timeout de instalação, preservando gates existentes.
