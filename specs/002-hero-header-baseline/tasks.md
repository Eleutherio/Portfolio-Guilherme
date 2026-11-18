---
description: "Tarefas de implementação do baseline do Hero e cabeçalho"
---

# Tasks: Baseline do Hero e Cabeçalho

**Input**: Design documents from `specs/002-hero-header-baseline/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/hero-header-ui.md`
e `quickstart.md`

**Tests**: Todas as histórias alteram comportamento observável, acessibilidade, responsividade ou
integração remota. Os testes de regressão devem ser escritos e confirmados como falhando contra a
implementação atual antes das respectivas mudanças de produto.

**Organization**: As tarefas são agrupadas por história para permitir implementação e validação
independentes. A feature 001 precisa deixar o lint global verde antes dos gates finais, mas sua
correção não pertence ao escopo desta lista.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: pode executar em paralelo por atuar em arquivos distintos e não depender de tarefa ainda
  incompleta.
- **[Story]**: vincula a tarefa a uma história de `spec.md`.
- Todos os caminhos são relativos à raiz do repositório.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar que a infraestrutura existente já atende ao plano.

Não há inicialização, dependência, banco ou estrutura nova a criar. React, Playwright, axe, Sharp,
hooks de preferência e o gate de carbono já existem; adicionar dependências é proibido pelo plano.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Identificar pré-requisitos compartilhados entre histórias.

Não há implementação fundacional bloqueante. US1, US2 e US3 usam componentes independentes e podem
começar após a análise cruzada dos artefatos. A convergência final continua compartilhada.

**Checkpoint**: Artefatos aprovados e histórias liberadas para execução independente.

---

## Phase 3: User Story 1 — Ler a proposta profissional sem ruído (Priority: P1) 🎯 MVP

**Goal**: Manter copy, faixa e hierarquia legíveis sobre o vídeo, com poster inicial de boa qualidade,
ativação por primeiro input confiável, movimento reduzido e orçamento de carbono preservados.

**Independent Test**: Abrir a Home na matriz representativa definida no contrato; comprovar copy,
faixa, ausência de sociais/contraste dinâmico e ausência de request `Media` antes de input real. Sem
movimento reduzido, teclado, pointer/toque e wheel devem carregar e iniciar o vídeo automaticamente;
com movimento reduzido, interações genéricas mantêm o poster e somente o controle acessível
“Reproduzir vídeo” inicia a mídia.

### Tests for User Story 1

- [x] T001 [P] [US1] Criar regressões de copy, faixa preta 55% com blur 12 px e aresta reta, DM Sans local, ausência de overflow, contraste dinâmico, commits e sociais conforme a matriz representativa de `specs/002-hero-header-baseline/contracts/hero-header-ui.md` em `e2e/hero-header.spec.ts`
- [x] T002 [P] [US1] Criar regressões de mídia provando ausência de request antes de input, ativação por `keydown`, `pointerover` no Hero e no cabeçalho, `pointerdown`, `touchstart` e `wheel` confiáveis, não ativação por viewport/scroll programático/evento sintético, pausa fora do Hero/aba oculta e fluxo de movimento reduzido em `e2e/responsive-media.spec.ts`
- [x] T003 [P] [US1] Substituir expectativas legadas de Sora, Caveat, terminal, currículo, café e botões antigos por DM Sans, copy/faixa atuais e inventário 320/412/768/1024/1440 em `e2e/responsiveness.spec.ts`

### Implementation for User Story 1

- [x] T004 [P] [US1] Gerar deterministicamente do frame preto inicial do próprio vídeo em `0,0 s`, antes do aparecimento da cena do notebook e usando apenas Playwright/Sharp já instalados, `src/assets/hero/hero-background-poster-1200w.avif` com no máximo 45 kB, mesmas dimensões e recorte e sem transição perceptível para o início do MP4 em 1440 px
- [x] T005 [US1] Implementar em `src/components/sections/Hero.tsx` o estado `intent=none|trusted-input|media-opt-in` e `status=static|loading|playing|paused|unavailable`, deixando o vídeo sem `src` e com `preload="none"` até input permitido, removendo listeners após ativação e preservando `object-cover`, `muted`, `loop`, `playsInline` e ausência de filtros
- [x] T006 [US1] Integrar `src/hooks/use-prefers-reduced-motion.ts` em `src/components/sections/Hero.tsx` para impedir carga por interação genérica sob movimento reduzido, exibir antes da ativação o controle acessível “Reproduzir vídeo”, pausar fora de atividade/aba oculta e manter pausa/retomada acessível depois da ativação
- [x] T007 [US1] Adicionar labels PT/EN de “Reproduzir vídeo” e de pausar/retomar em `src/i18n/dictionary.ts` e estilizar o controle discreto com foco visível e alvo de toque mínimo de 44 px em `src/styles.css`, sem alterar a faixa ou introduzir contraste dinâmico
- [x] T008 [US1] Atualizar comparações visuais do Hero em 320/PT/escuro e 1440/EN/claro, cobrindo poster, faixa, copy e controle sem colisões, em `e2e/visual-regression.spec.ts` e `e2e/__screenshots__/visual-regression.spec.ts/chromium/`
- [x] T009 [US1] Executar a validação independente de US1 definida em `specs/002-hero-header-baseline/quickstart.md` e registrar qualquer divergência de poster, mídia ou geometria antes do checkpoint

**Checkpoint**: US1 funciona e pode ser demonstrada sem depender das alterações do cabeçalho ou do
contador de commits.

---

## Phase 4: User Story 2 — Usar o cabeçalho recolhível (Priority: P1)

**Goal**: Preservar o cabeçalho recolhido e sobreposto, completando Escape e saída total de foco sem
regredir hover, toque, scroll, marca, CTA, navegação, tema ou idioma.

**Independent Test**: Em mobile e desktop, validar estado inicial recolhido; expansão por hover,
foco, toque e scroll para cima; recolhimento por saída completa, scroll para baixo, clique externo e
Escape; marca/CTA persistentes; switches/nav ocultos e não focáveis quando recolhidos; marca como
único destino Home.

### Tests for User Story 2

- [x] T010 [US2] Acrescentar regressões do contrato completo de estado, foco, Escape, clique externo, toque, direção do scroll, transição de 200 ms `ease-out` sem mudança de layout e removida sob movimento reduzido, CTA persistente, switches ocultos e marca como único link Home em `e2e/hero-header.spec.ts`
- [x] T011 [P] [US2] Substituir a expectativa legada de cabeçalho inicialmente expandido e classes antigas pelas transições aprovadas em `e2e/dynamic-content.spec.ts`
- [x] T012 [P] [US2] Atualizar a expectativa legada de superfície `rounded-full` e manter as provas de árvore semântica, gutters e wordmark em `e2e/brand.spec.ts`
- [x] T013 [P] [US2] Alinhar as provas de alvos de 44 px, emulação touch/coarse e conteúdo atual do cabeçalho em `e2e/responsive-inputs.spec.ts`

### Implementation for User Story 2

- [x] T014 [US2] Corrigir `src/components/layout/Header.tsx` para Escape fechar o menu móvel e recolher em todos os breakpoints, preservando retorno de foco ao botão somente quando o menu estava aberto
- [x] T015 [US2] Implementar em `src/components/layout/Header.tsx` o recolhimento quando foco e ponteiro saírem completamente do composto Header + ações, sem substituir hover, toque, clique externo ou direção do scroll e sem tornar áreas vazias navegáveis
- [x] T016 [US2] Executar os cenários independentes de cabeçalho de `specs/002-hero-header-baseline/quickstart.md` conforme a matriz representativa de `specs/002-hero-header-baseline/contracts/hero-header-ui.md`, repetindo em movimento normal e reduzido somente os cenários afetados por essa preferência

**Checkpoint**: US2 funciona de modo independente e preserva a única árvore semântica existente.

---

## Phase 5: User Story 3 — Acessar ações preservadas fora do Hero (Priority: P2)

**Goal**: Exibir os estados reais de commits no link GitHub do rodapé, preservar destinos sociais
existentes e manter essas ações ausentes do Hero.

**Independent Test**: Com a origem GitHub controlada, rolar até o rodapé e validar loading, zero,
sucesso e indisponibilidade; confirmar fallback numérico apenas em DEV/teste, destino externo seguro e
nenhum commit/ícone social dentro de `#home`.

### Tests for User Story 3

- [x] T017 [US3] Reorientar as regressões de loading, zero válido e indisponibilidade para o link GitHub do rodapé, acrescentar sucesso e fonte `api|fallback`, e provar ausência de commits/sociais em `#home` em `e2e/hero-stats.spec.ts`
- [x] T018 [P] [US3] Confirmar preservação dos destinos GitHub, LinkedIn, WhatsApp e e-mail fora do Hero sem duplicar a lógica do contador em `e2e/interface-contact.spec.ts`

### Implementation for User Story 3

- [x] T019 [US3] Renomear `HeroGithubLink` para `GithubCommitLink`, preservar `loading|ready|unavailable`, total inteiro `>= 0`, `source=api|fallback` e fallback `128` somente em DEV/teste, e remover o agrupador social órfão sem alterar `FooterResumeCoffee` em `src/components/hero/HeroStats.tsx`
- [x] T020 [US3] Substituir somente o link GitHub simples da coluna de conexões pelo `GithubCommitLink`, mantendo LinkedIn/e-mail, café, currículo e infraestrutura intactos em `src/components/layout/Footer.tsx`
- [x] T021 [US3] Executar os cenários independentes de commits e redes de `specs/002-hero-header-baseline/quickstart.md`, incluindo produção sem fallback fictício

**Checkpoint**: US3 funciona no rodapé sem dependência visual de US1 ou US2 e sem ações sociais no
Hero.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Consolidar as histórias e executar os gates sem ampliar o escopo.

- [x] T022 [P] Verificar que `package.json` e `package-lock.json` não receberam dependência nova e que nenhum uso de `DynamicContrast` foi introduzido no Hero/Header descritos em `specs/002-hero-header-baseline/plan.md`
- [x] T023 Executar toda a matriz automatizada e a inspeção manual descritas em `specs/002-hero-header-baseline/quickstart.md`, incluindo Chromium, WebKit smoke, poster em 1440 px e frames claros/escuros do vídeo
- [ ] T024 Executar `npm run lint`, `npm run typecheck`, `npm run test:api`, `npm run build` e `npm run test:a11y` conforme `specs/002-hero-header-baseline/quickstart.md`; interromper a finalização se a baseline da feature 001 ainda estiver vermelha
  - Gate executado em 2026-10-01: lint, typecheck, API e build verdes; a execução integral de test:a11y registrou 241 testes verdes e 37 falhas. Os cenários ligados a esta feature foram corrigidos e revalidados de forma direcionada; a repetição integral permanece bloqueada por contratos legados de Sobre, depoimentos, Contato, SEO e contraste global do tema claro.
  - Gate reexecutado em 2026-10-03: lint, typecheck, 71 testes de API e build verdes; a execução integral de test:a11y registrou 266 testes verdes e 14 falhas. Os cenários de Hero, cabeçalho, contador e mídia desta feature permaneceram verdes; a finalização continua bloqueada por contratos de conteúdo dinâmico/Sobre/depoimentos, rodapé, contraste do Contato, baseline responsiva da trajetória e título SEO de case.
- [x] T025 Executar `npm run carbon:check` sobre o conjunto final imediatamente antes de qualquer staging, confirmar até 272,51 kB, meta de 250 kB e zero mídia antes de intenção conforme `specs/002-hero-header-baseline/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup e Foundational (Phases 1–2)**: não exigem alteração; liberam as histórias após
  `$speckit-analyze` sem achados críticos.
- **US1 (Phase 3)**: pode começar imediatamente após análise; testes T001–T003 precedem T004–T008.
- **US2 (Phase 4)**: pode começar após análise, em paralelo com US1; testes T010–T013 precedem
  T014–T015.
- **US3 (Phase 5)**: pode começar após análise, em paralelo com US1/US2; T017–T018 precedem
  T019–T020.
- **Polish (Phase 6)**: depende das histórias escolhidas estarem concluídas; T025 é obrigatoriamente o
  último gate antes de staging.

### User Story Dependencies

- **US1 (P1)**: independente; controla somente Hero, mídia, poster e suas provas.
- **US2 (P1)**: independente; controla somente Header e suas provas.
- **US3 (P2)**: independente; reutiliza a API atual e move a apresentação do contador ao Footer.
- **Dependência externa de finalização**: a feature 001 deve normalizar a baseline global para T024
  passar; isso não bloqueia a implementação e os testes direcionados das três histórias.

### Within Each User Story

- Confirmar que a regressão falha antes de alterar o produto.
- Implementar somente depois de fixar a evidência esperada.
- Não atualizar snapshots para esconder divergências não explicadas.
- Completar a validação independente antes de marcar a história como concluída.
- Preservar arquivos e comportamentos fora dos caminhos listados.

### Parallel Opportunities

- T001, T002 e T003 atuam em arquivos distintos e podem definir as provas de US1 em paralelo.
- T004 pode gerar o poster enquanto T001–T003 são escritos, mas sua aprovação visual precede T008.
- T011, T012 e T013 podem ser atualizados em paralelo antes de T014–T015.
- T018 pode ser executada em paralelo com T017; ambas precedem a integração T019–T020.
- US1, US2 e US3 podem ser implementadas em paralelo após `$speckit-analyze`, respeitando os arquivos
  compartilhados `e2e/hero-header.spec.ts` e `e2e/visual-regression.spec.ts`.

---

## Parallel Example: User Story 1

```text
Task T001: criar provas visuais/semânticas em e2e/hero-header.spec.ts
Task T002: criar provas de intenção de mídia em e2e/responsive-media.spec.ts
Task T003: remover expectativas legadas em e2e/responsiveness.spec.ts
Task T004: gerar src/assets/hero/hero-background-poster-1200w.avif
```

## Parallel Example: User Story 2

```text
Task T011: atualizar e2e/dynamic-content.spec.ts
Task T012: atualizar e2e/brand.spec.ts
Task T013: atualizar e2e/responsive-inputs.spec.ts
```

## Parallel Example: User Story 3

```text
Task T017: atualizar e2e/hero-stats.spec.ts
Task T018: confirmar destinos em e2e/interface-contact.spec.ts
```

---

## Implementation Strategy

### MVP First

1. Executar `$speckit-analyze` e resolver achados críticos.
2. Completar T001–T009 para entregar US1.
3. Parar e validar US1 independentemente.
4. Para um incremento P1 completo, adicionar T010–T016 de US2 antes de demonstração consolidada.

### Incremental Delivery

1. US1 entrega copy, faixa, poster, vídeo e carbono.
2. US2 consolida as interações globais do cabeçalho.
3. US3 entrega commits no rodapé sem contaminar o Hero.
4. T022–T025 consolidam regressões, acessibilidade, build e sustentabilidade.

### Parallel Team Strategy

Com múltiplos executores após a análise:

- Executor A: T001–T009 (US1).
- Executor B: T010–T016 (US2).
- Executor C: T017–T021 (US3).
- Integração conjunta: T022–T025.

## Notes

- `[P]` identifica somente tarefas sem conflito de arquivo ou dependência incompleta.
- Nenhuma tarefa autoriza alteração do orçamento, relaxamento dos gates ou nova dependência.
- `src/routeTree.gen.ts` não pertence ao escopo e não pode ser editado manualmente.
- Commits podem ser feitos por história ou grupo lógico somente depois dos gates aplicáveis.

---

## Phase 7: Convergence

- [x] T026 CRITICAL: concluir ou integrar a normalização global de lint da feature 001 e comprovar `npm run lint` verde antes da finalização desta feature per Constitution III e T024 (contradicts)
- [x] T027 corrigir a ativação em `src/components/sections/Hero.tsx` para que eventos sintéticos não removam listeners e somente o primeiro input confiável remova todas as escutas, acrescentando a regressão correspondente em `e2e/responsive-media.spec.ts` per FR-004 (partial)
- [x] T028 coordenar `focusWithinComposite` e `pointerWithinComposite` em `src/components/layout/Header.tsx` para recolher apenas quando foco e ponteiro tiverem saído completamente de Header + ações, com regressão em `e2e/hero-header.spec.ts` per FR-007 e US2/AC2 (partial)
- [x] T029 alinhar os dois cenários falhos de `e2e/responsiveness.spec.ts` ao cabeçalho sobreposto e recolhível, reabrindo o menu por uma interação disponível e comprovando destino visível e foco mais recente sem exigir foco em controle oculto ou offset obsoleto per plan: alinhar provas automatizadas e SC-003 (partial)
- [x] T030 cobrir em `e2e/hero-stats.spec.ts` sucesso não zero com `source=api` e indisponibilidade em build de produção sem fallback numérico, preservando loading e zero já provados per FR-013 e US3/AC2 (missing)
- [x] T031 remover a nova dependência `@fontsource-variable/dm-sans` dos manifests e adaptar a geração do subset para preservar DM Sans local sem dependência adicional per plan: nenhuma dependência nova, T022 e Constitution V (contradicts)
- [x] T032 executar `npm run carbon:check` sobre o conjunto final corrigido imediatamente antes do primeiro staging, comprovando até 272,51 kB, meta de 250 kB e zero mídia antes de intenção per SC-004, Constitution VII e T025 (partial)
- [x] T033 permitir nova tentativa acessível a partir de `status=unavailable` no controle do Hero e provar a transição `unavailable -> loading` sem loop automático per data-model: HeroMediaState (partial)
- [x] T034 remover `allowScripts` não solicitado e reverter atualizações transitivas do `package-lock.json` sem relação com a feature, preservando somente mudanças de manifesto rastreáveis per plan: escopo e dependências (unrequested)
- [x] T035 executar o smoke WebKit e a inspeção manual restante em 320/1440 px, frames claros/escuros, teclado, toque, foco, movimento reduzido e poster, registrando qualquer divergência antes dos gates finais per T023, SC-001 e SC-003 (partial)
