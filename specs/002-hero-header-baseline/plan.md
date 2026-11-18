# Implementation Plan: Baseline do Hero e Cabeçalho

**Branch**: `002-hero-header-baseline` | **Date**: 2026-09-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-hero-header-baseline/spec.md`

## Summary

Consolidar o Hero e o cabeçalho já existentes sem reconstruí-los: preservar a faixa escura, a copy,
a árvore adaptativa do cabeçalho, a marca e o CTA persistentes; eliminar as lacunas de intenção de
mídia, movimento reduzido, Escape e saída completa de foco. O vídeo continuará sendo o asset atual e,
sem movimento reduzido, receberá `src` e iniciará após o primeiro gesto confiável do usuário em
qualquer parte da página. O contador de commits será
desacoplado nominalmente do Hero e exibido no link do GitHub no rodapé, mantendo as redes sociais nos
destinos já existentes. Testes legados conflitantes serão atualizados para comprovar a spec atual.

## Technical Context

**Language/Version**: TypeScript 5.8 em modo estrito, ESM, React 19

**Primary Dependencies**: Vite 8, TanStack Router, Tailwind CSS 4, Lucide React, contexto local de
idioma/tema; nenhuma dependência nova planejada

**Storage**: Sem persistência nova; preferências já usam `localStorage`, e commits continuam vindo da
API existente `/api/github`

**Testing**: Playwright 1.61, axe-core, ESLint + Prettier, TypeScript, builds Vite e gate local de
carbono

**Target Platform**: SPA estática no Cloudflare Pages; Chromium como matriz principal e WebKit como
smoke test; viewports de 320 a 1920 px

**Project Type**: Aplicação web com frontend estático e API implantada separadamente

**Performance Goals**: zero requisições `Media` na carga fria e rolagem sem intenção explícita;
transferência total de até 272,51 kB, com meta de 250 kB; ativação do vídeo sem mudança de layout

**Constraints**: preservar o MP4 atual de 169.200.241 bytes sem recompressão nesta feature; poster
AVIF de até 45 kB com qualidade visual aprovada em 1440 px; WCAG 2.2 AA; alvos de toque de 44 px;
Hero/Header sem contraste dinâmico; vídeo estático até o primeiro input confiável e respeito a
`prefers-reduced-motion`; nenhum relaxamento do orçamento de carbono

**Scale/Scope**: Hero e cabeçalho globais da Home, integração pontual do contador no rodapé, copy
PT/EN e testes específicos em 320, 412, 768, 1024 e 1440 px

## Constitution Check

_GATE: aprovado antes da pesquisa e revalidado após o desenho._

- **Segurança e privacidade**: aprovado. Nenhum segredo, dado pessoal ou novo caminho privilegiado;
  o cliente de commits continua consumindo apenas a API pública já existente.
- **Arquitetura e escopo**: aprovado. Frontend e API permanecem separados; não há mudança em
  `routeTree.gen.ts`; o desenho parte do working tree atual e preserva navegação diferida, contato,
  café, currículo e seções fora do escopo.
- **Qualidade e testes**: aprovado com obrigação de finalização. Expectativas E2E obsoletas serão
  substituídas por provas da spec. A baseline de lint atualmente vermelha é trabalho da feature 001
  e continua bloqueando commit até ser corrigida; esta feature não poderá contornar esse gate.
- **Testes orientados a risco**: aprovado. Estado e transições serão provados em Playwright, e o
  orçamento será provado pelo gate de carbono existente.
- **Simplicidade**: aprovado. Sem dependência nova e sem refatoração ampla; extrações ficam limitadas
  ao controle coeso da mídia e ao contador que deixou de pertencer ao Hero.
- **Acessibilidade**: aprovado. Teclado, foco, Escape, toque, nomes acessíveis, reflow, contraste,
  movimento reduzido e inspeção visual integram os critérios de validação.
- **Sustentabilidade**: aprovado. Nenhuma requisição ou reprodução do MP4 ocorre antes de input
  confiável; sem movimento reduzido, o primeiro input confiável carrega o arquivo e inicia a reprodução
  automaticamente. Os limites de 272,51/250 kB permanecem inalterados.
- **Resiliência e observabilidade**: aprovado. Os estados `loading`, `ready` e `unavailable` do
  contador e o fallback exclusivo de desenvolvimento são preservados.

### Reavaliação pós-desenho

O contrato de interface e o modelo de estados não criam nova fronteira de dados, dependência ou
exceção constitucional. A ativação explícita do vídeo resolve o conflito crítico encontrado entre a
implementação atual e o gate de carbono. Não há violação a justificar em Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/002-hero-header-baseline/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── hero-header-ui.md
└── tasks.md                 # gerado posteriormente por $speckit-tasks
```

### Source Code (repository root)

```text
src/
├── assets/hero/
│   ├── hero-background.mp4
│   └── hero-background-poster-1200w.avif
├── components/
│   ├── hero/
│   │   └── HeroStats.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── sections/
│       └── Hero.tsx
├── hooks/
│   └── use-prefers-reduced-motion.ts
├── i18n/
│   └── dictionary.ts
└── styles.css

e2e/
├── hero-header.spec.ts      # novo contrato específico da feature
├── hero-stats.spec.ts
├── brand.spec.ts
├── dynamic-content.spec.ts
├── preferences.spec.ts
├── responsiveness.spec.ts
├── responsive-inputs.spec.ts
├── responsive-media.spec.ts
└── visual-regression.spec.ts

scripts/
└── verify-carbon-budget.mjs
```

**Structure Decision**: manter a SPA atual e sua única árvore semântica de cabeçalho. A lógica de
visibilidade permanece em `Header.tsx`; a ativação do vídeo fica coesa ao Hero, usando o hook de
movimento reduzido existente; o contador reutilizável continua próximo de `HeroStats.tsx` durante a
mudança mínima, mas passa a ser nomeado pelo domínio GitHub e consumido pelo `Footer`. Uma extração
física adicional só será feita se necessária para satisfazer as regras de código não utilizado.

## Implementation Approach

### 1. Preservar a composição aprovada do Hero

- Manter copy PT e EN atual, alinhamento à esquerda, DM Sans local, faixa preta a 55%, blur de 12 px,
  aresta direita reta e extensão até a borda esquerda.
- Manter o MP4 sem filtros e com `object-cover`; não recomprimir nem substituir o arquivo.
- Remover do caminho inicial `src`, `autoPlay` e `preload="auto"`. Renderizar
  `hero-background-poster-1200w.avif`, derivado deterministicamente do frame preto inicial do próprio
  vídeo em `0,0 s`, antes do aparecimento da cena do notebook, limitado a 45 kB e preservando
  dimensões e recorte, sem transição perceptível em 1440 px e sem alterar as dimensões do Hero.
- Sem movimento reduzido, observar uma única vez eventos confiáveis de `keydown`, `pointerover`,
  `pointerdown`, `touchstart` e `wheel` no documento. O primeiro evento real, inclusive hover de
  mouse ou caneta no Hero ou no cabeçalho, atribui `src`, chama `play()` e remove todos os listeners;
  montagem, viewport, scroll programático e eventos sintéticos não ativam.
- Depois da ativação, oferecer controle discreto e acessível de pausar/retomar, exigido para movimento
  contínuo, sem condicionar o início normal a um clique específico no vídeo.
- Em movimento reduzido, permanecer estático após interações genéricas e exibir antes da ativação
  um controle acessível “Reproduzir vídeo”; carregar somente após esse acionamento, manter disponível
  o controle de pausar/retomar e pausar quando o Hero estiver inativo ou o documento ficar oculto.

### 2. Completar a máquina de interação do cabeçalho

- Preservar `hidden=true`, posicionamento `fixed`, marca e CTA persistentes, switches agrupados e
  navegação central.
- Preservar a transição atual de 200 ms `ease-out` ao revelar/recolher, sem salto visual ou mudança de
  layout, e removê-la quando movimento reduzido estiver ativo.
- Fazer Escape recolher também no desktop, não apenas fechar o menu móvel.
- Recolher quando o foco sair completamente de header + ações, sem interferir no hover e sem roubar
  o foco do controle que o usuário escolheu.
- Manter a marca como único link para Home; a área vazia continua servindo apenas para revelar em
  toque. Clique externo, direção do scroll e redução de movimento conservam a lógica atual.

### 3. Dar destino ao contador sem reintroduzi-lo no Hero

- Substituir o link GitHub simples da coluna de conexões do rodapé pelo contador reutilizável.
- Preservar `loading`, zero válido, sucesso, indisponibilidade e fallback `128` apenas em DEV/teste.
- Manter LinkedIn, WhatsApp, GitHub e e-mail nos destinos já existentes em Contato/Rodapé; não criar
  novo bloco social nem reintroduzir qualquer ação no Hero.
- Não alterar o contador de cafés nem o download de currículo nesta feature.

### 4. Alinhar provas automatizadas ao contrato atual

- Criar `e2e/hero-header.spec.ts` para copy, faixa, ausência de contraste dinâmico/social, estado
  inicial recolhido, hover, foco, toque, Escape, clique externo, scroll, CTA e switches.
- Exercitar a matriz representativa 320/PT/escuro, 412/EN/claro, 768/PT/claro, 1024/EN/escuro e
  1440/EN/claro, usando o inventário responsivo existente. Comparar visualmente os extremos de 320 e
  1440 px e validar movimento normal e reduzido sem multiplicar desnecessariamente toda a suíte.
- Atualizar testes legados que ainda esperam Header expandido, borda arredondada antiga, Sora/Caveat,
  terminal, botões, café ou commits dentro do Hero.
- Direcionar `hero-stats.spec.ts` ao rodapé e provar também que `#home` não contém commits ou sociais.
- Provar ausência de request do MP4 antes de input confiável, request/reprodução após cada família de
  input, incluindo hover real no Hero e no cabeçalho, e não ativação por viewport, scroll
  programático ou evento sintético. Em movimento
  reduzido, provar poster estático até o acionamento do controle acessível “Reproduzir vídeo” e manter
  `verify-carbon-budget.mjs` sem relaxar limites.
- Adicionar comparação visual focalizada ao menos em 320 e 1440 px; os demais tamanhos usam
  medições determinísticas de overflow, geometria e visibilidade.

## Complexity Tracking

Nenhuma violação constitucional ou complexidade adicional requer justificativa.
