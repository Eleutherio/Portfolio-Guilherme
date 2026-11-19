# Feature Specification: Baseline do Hero e Cabeçalho

**Feature Branch**: `002-hero-header-baseline`

**Created**: 2026-09-29

**Status**: Draft

**Input**: Migração dos requisitos legados do Hero e do cabeçalho para o Spec Kit.

## Clarifications

### Session 2026-09-29

- Q: Como o vídeo deve iniciar quando a preferência de movimento reduzido estiver ativa? → A: O
  poster permanece estático até o visitante acionar um controle acessível “Reproduzir vídeo”; após
  a ativação, permanece disponível um controle de pausar/retomar.
- Q: Qual frame e qual qualidade devem definir o poster inicial? → A: Usar o frame preto inicial do
  próprio vídeo em `0,0 s`, antes do aparecimento da cena do notebook, preservando dimensões e
  recorte e sem inventar um placeholder externo ao MP4.
- Q: A validação deve executar todas as combinações de viewport, idioma e tema? → A: Não; usar
  uma matriz representativa que cubra cada viewport e distribua PT/EN e claro/escuro, com comparação
  visual completa nos extremos de 320 e 1440 px.
- Q: Quando a reprodução automática do vídeo deve ocorrer? → A: Nenhuma requisição ou
  reprodução ocorre antes de input confiável; sem movimento reduzido, o primeiro input confiável
  carrega o MP4 e inicia sua reprodução automaticamente.

### Session 2026-10-01

- Q: Hover real deve contar como input para iniciar o vídeo? → A: Sim. Sem movimento reduzido, o
  primeiro `pointerover` confiável, inclusive sobre qualquer área do cabeçalho, carrega o MP4 e
  inicia a reprodução; eventos sintéticos, montagem e entrada no viewport continuam excluídos.
- Q: Onde deve ficar o controle de reprodução? → A: No canto inferior direito do Hero, alinhado e
  posicionado imediatamente abaixo do botão flutuante de acessibilidade, sem sobreposição.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Ler a proposta profissional sem ruído (Priority: P1)

Como visitante, quero compreender a proposta profissional no primeiro bloco da página mesmo quando
o vídeo alternar entre quadros claros e escuros.

**Why this priority**: É a primeira mensagem da experiência e precisa permanecer legível.

**Independent Test**: Percorrer o vídeo em PT/EN e nos viewports suportados, verificando texto,
hierarquia, faixa de contraste e ausência de conteúdo social no Hero.

**Acceptance Scenarios**:

1. **Given** a Home aberta, **When** o vídeo muda de luminosidade, **Then** título e subtítulo
   permanecem legíveis sobre uma faixa escura estática sem contraste dinâmico.
2. **Given** qualquer idioma suportado, **When** o Hero é exibido, **Then** a mensagem aprovada está
   completa, alinhada à esquerda e sem corte ou overflow.

---

### User Story 2 - Usar o cabeçalho recolhível (Priority: P1)

Como visitante, quero acessar marca, navegação, tema, idioma e contato sem que o cabeçalho esconda o
vídeo ou produza mudanças bruscas.

**Why this priority**: O cabeçalho controla a navegação global e precisa funcionar por mouse,
teclado, toque e scroll.

**Independent Test**: Validar recolhimento, expansão, direção do scroll, foco, Escape, idioma, tema
e CTA em mobile e desktop.

**Acceptance Scenarios**:

1. **Given** o cabeçalho recolhido, **When** o visitante interage com a marca ou área útil,
   **Then** a navegação aparece pela transição atual de 200 ms `ease-out`, sem salto visual, mudança
   de layout ou faixa adicionada ao fluxo da página; com movimento reduzido, a transição é removida.
2. **Given** o cabeçalho expandido, **When** o visitante sai da área, rola para baixo ou usa Escape,
   **Then** ele recolhe preservando marca e CTA utilizáveis.

---

### User Story 3 - Acessar ações preservadas fora do Hero (Priority: P2)

Como visitante, quero encontrar contato e ações sociais em destinos adequados sem duplicação de
lógica ou informação fictícia.

**Why this priority**: Os componentes foram retirados do Hero, mas seus destinos e estados ainda
possuem valor.

**Independent Test**: Confirmar ausência no Hero, preservação dos destinos e estados remotos e um
único local acessível para cada ação quando seu novo destino for definido.

**Acceptance Scenarios**:

1. **Given** a Home carregada, **When** o visitante percorre o Hero, **Then** commits e ícones sociais
   não aparecem dentro dele.
2. **Given** indisponibilidade da origem de commits, **When** a ação for exibida em outro local,
   **Then** produção não apresenta contagem fictícia.

### Edge Cases

- Viewports de 320 px não podem produzir colisão entre marca, CTA ou texto do Hero.
- Trocas rápidas de tema e idioma não podem duplicar foco ou deixar conteúdo intermediário visível.
- Movimento reduzido deve remover deslocamentos sem ocultar controles.
- Mídia pesada não pode ser requisitada ou reproduzida antes de input confiável; sem movimento
  reduzido, deve carregar e iniciar automaticamente após o primeiro input confiável, incluindo
  hover real de mouse ou caneta sobre o Hero ou o cabeçalho.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O Hero DEVE exibir “Inovação, Estratégia e Desenvolvimento de Software.” e “Meu
  trabalho é traduzir tecnologia em soluções para as pessoas.”, com equivalentes ingleses aprovados.
- **FR-002**: O bloco textual DEVE usar uma faixa preta a 55%, blur de 12 px, aresta direita reta,
  extensão até a borda esquerda e espaçamento vertical equilibrado.
- **FR-003**: Hero, cabeçalho e controles NÃO DEVEM usar contraste dinâmico por pixel.
- **FR-004**: O vídeo do Hero DEVE cobrir a área sem filtros adicionais. Sem movimento reduzido, seu
  carregamento e reprodução DEVEM iniciar após o primeiro evento confiável de teclado,
  `pointerover`, pointer/toque ou wheel gerado pelo usuário; o hover real sobre qualquer área do
  documento, inclusive o cabeçalho, conta como intenção, enquanto montagem, entrada no viewport,
  rolagem programática e eventos sintéticos NÃO contam. Com movimento reduzido, o poster DEVE permanecer estático até o visitante
  acionar um controle acessível “Reproduzir vídeo”, disponível antes da ativação; depois de iniciado,
  um controle acessível de pausar/retomar DEVE permanecer disponível. Em todos os casos, o orçamento
  de carbono DEVE ser respeitado. O controle DEVE permanecer no canto inferior direito do Hero,
  alinhado e imediatamente abaixo do botão flutuante de acessibilidade, sem sobreposição.
- **FR-005**: O cabeçalho DEVE iniciar recolhido e sobreposto, sem ocupar espaço ou pintar uma faixa
  invisível sobre o Hero.
- **FR-006**: A marca DEVE ser o único destino para a Home; áreas vazias do cabeçalho não podem
  navegar.
- **FR-007**: O cabeçalho DEVE aparecer ao rolar para cima, ocultar-se ao rolar para baixo e preservar
  operações por hover, foco, toque, clique externo e Escape.
- **FR-008**: Tema e idioma DEVEM compartilhar uma superfície sem fresta, manter transição vertical
  e ficar ocultos quando o cabeçalho estiver recolhido.
- **FR-009**: O CTA de contato DEVE permanecer disponível quando recolhido, sem seta, com fundo
  escuro desfocado e destaque azul `#78a5ce` nesse estado.
- **FR-010**: Navegação central e ações à direita DEVEM permanecer utilizáveis em PT/EN, claro/escuro
  e com movimento reduzido.
- **FR-011**: Títulos DEVEM usar DM Sans local sem requisições externas de fonte ou mudança de layout.
- **FR-012**: Commits e atalhos sociais NÃO DEVEM ser renderizados no Hero; sua lógica e destinos
  DEVEM permanecer reutilizáveis até definição do novo local.
- **FR-013**: Estados remotos de commits DEVEM distinguir carregamento, sucesso e indisponibilidade;
  fallback numérico só pode existir em desenvolvimento ou teste.
- **FR-014**: Alvos interativos DEVEM possuir foco visível, nomes acessíveis e pelo menos 44 px em
  contextos de toque.

## Legacy Traceability

| Legacy ID                        | Disposition                                                                    |
| -------------------------------- | ------------------------------------------------------------------------------ |
| QA-HERO-FAIXA-ESCURA-01          | Ativo em FR-002 e FR-003                                                       |
| QA-HERO-COPY-01                  | Ativo em FR-001                                                                |
| QA-HERO-ESPACAMENTO-TRADUCAO-01  | Ativo em FR-001 e FR-002                                                       |
| QA-HEADER-BLUR-ESTATICO-01       | Ativo em FR-003, FR-008 e FR-009                                               |
| QA-HEADER-CTA-RECOLHIDO-01       | Ativo em FR-009                                                                |
| HERO-SOCIAIS-REPOSICIONAR-01     | Ativo em FR-012 e FR-013                                                       |
| QA-HERO-CONTRASTE-DINAMICO-01    | Substituído por QA-HERO-FAIXA-ESCURA-01                                        |
| QA-NAV-CONTRASTE-REUTILIZAVEL-01 | Substituído por QA-HERO-FAIXA-ESCURA-01                                        |
| QA-NAV-SWAPS-01                  | Ativo em FR-008                                                                |
| QA-NAV-GLASS-PERSISTENTE-01      | Parcialmente substituído; estado final em FR-003, FR-008 e FR-009              |
| QA-NAV-CENTRO-CTA-01             | Ativo em FR-010                                                                |
| QA-NAV-INTERACAO-01              | Ativo em FR-006 e FR-007                                                       |
| QA-HERO-HIERARQUIA-01            | Substituído pela mensagem final de FR-001                                      |
| QA-TIPOGRAFIA-DM-SANS-01         | Ativo em FR-011                                                                |
| QA-HERO-RODAPE-01                | Substituído pela remoção das ações do Hero e FR-012                            |
| QA-HERO-BASE-01                  | Substituído pela composição final de FR-001 e FR-002                           |
| QA-HEADER-RECOLHIDO-01           | Ativo em FR-005 e FR-007                                                       |
| QA-HERO-VIDEO-01                 | Incorporado com ajuste constitucional em FR-004                                |
| QA-HERO-ACOES-01                 | Substituído pela remoção das ações do Hero; lógica preservada em FR-012/FR-013 |
| QA-HERO-FOTO-01                  | Substituído pelo vídeo do Hero                                                 |

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Os requisitos finais são aprovados por uma matriz representativa que cobre 320, 412,
  768, 1024 e 1440 px, distribui PT/EN e temas claro/escuro e realiza comparação visual completa em
  320 e 1440 px, sem overflow ou conteúdo inacessível.
- **SC-002**: Nenhuma instância de contraste dinâmico permanece no Hero ou cabeçalho.
- **SC-003**: 100% das ações interativas podem ser operadas por teclado e toque.
- **SC-004**: A carga fria e rolagem sem intenção permanecem dentro do orçamento A+ vigente.

## Assumptions

- O contador de commits será exibido no link do GitHub no rodapé; os atalhos sociais permanecem nos
  destinos existentes em Contato e Rodapé, sem reintrodução no Hero.
- O poster inicial será um AVIF de até 45 kB derivado do frame preto inicial do próprio vídeo em
  `0,0 s`, antes do aparecimento da cena do notebook. Deverá preservar dimensões e recorte e produzir
  uma transição imperceptível para o início do vídeo na inspeção em 1440 px.
- Decisões posteriores registradas nesta spec prevalecem sobre requisitos legados conflitantes.
