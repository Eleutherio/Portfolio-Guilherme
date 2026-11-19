# Feature Specification: Experiência Consistente entre Rotas

**Feature Branch**: `004-cross-route-experience`

**Created**: 2026-09-29

**Status**: Draft

**Input**: Migração das melhorias legadas de estados globais e responsividade entre rotas.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Recuperar-se de erros de navegação (Priority: P1)

Como visitante, quero entender erros 403, 404 e 500 e encontrar uma ação segura para continuar.

**Why this priority**: Falhas sem orientação interrompem completamente a navegação.

**Independent Test**: Abrir cada estado em PT/EN e verificar status, mensagem, ações, tema e foco.

**Acceptance Scenarios**:

1. **Given** uma rota inexistente, **When** ela é aberta, **Then** o visitante vê o estado 404 e pode
   retornar à Home.
2. **Given** uma falha recuperável, **When** o estado 500 aparece, **Then** uma nova tentativa é
   oferecida sem expor detalhes internos.

---

### User Story 2 - Perceber carregamento estável (Priority: P1)

Como visitante, quero feedback de carregamento apenas enquanto a próxima composição ainda não está
pronta, sem flashes ou bloqueio infinito.

**Why this priority**: Transições incompletas afetam confiança e acessibilidade.

**Independent Test**: Simular chunks lentos, recursos indisponíveis, timeout e movimento reduzido.

**Acceptance Scenarios**:

1. **Given** uma transição rápida, **When** a rota fica pronta, **Then** não ocorre flash indevido.
2. **Given** falha ou timeout, **When** a espera termina, **Then** o indicador encerra em estado
   controlado e a navegação continua possível.

---

### User Story 3 - Ler rotas secundárias em telas intermediárias (Priority: P2)

Como visitante em celular ou tablet, quero Privacidade, Acessibilidade e cases com hierarquia e
metadados legíveis.

**Why this priority**: Essas rotas possuem composições específicas que ainda precisam de refinamento.

**Independent Test**: Validar 320–1023 px com PT/EN, temas e widget de acessibilidade visível.

**Acceptance Scenarios**:

1. **Given** a página de Privacidade em tablet, **When** houver largura útil, **Then** tratamentos são
   organizados em duas colunas legíveis.
2. **Given** o case GrenGame, **When** exibido até 1023 px, **Then** badges e evidências não são
   comprimidos nem cobertos.

### Edge Cases

- Ocultar a barra visual não pode desativar scroll por teclado, touch ou tecnologia assistiva.
- Timeout de carregamento não pode deixar `aria-busy` permanente.
- Textos longos traduzidos não podem romper grids intermediários.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Estados 403, 404 e 500 DEVEM compartilhar um padrão visual e variar status, título,
  descrição e ações pertinentes.
- **FR-002**: Estados de erro DEVEM funcionar em PT/EN, ambos os temas, teclado e leitores de tela,
  sem expor detalhes internos.
- **FR-003**: O carregamento global DEVE aparecer somente quando a composição não puder ser exibida
  de forma estável e DEVE encerrar em sucesso, falha ou timeout controlado.
- **FR-004**: O carregamento DEVE respeitar movimento reduzido, acessibilidade e orçamento de carbono.
- **FR-005**: A barra vertical PODE ficar visualmente oculta, mas todos os mecanismos de rolagem,
  hash, foco e acesso ao conteúdo DEVEM permanecer funcionais em navegadores suportados.
- **FR-006**: Tratamentos de Privacidade entre 768 e 1023 px DEVEM usar duas colunas quando houver
  largura útil sem comprimir o texto.
- **FR-007**: Metadados do GrenGame entre 320 e 1023 px DEVEM preservar badges, evidências e área do
  widget de acessibilidade.
- **FR-008**: Subtítulos de Acessibilidade entre 768 e 1023 px DEVEM preservar hierarquia e equilíbrio
  da composição em duas colunas.

## Legacy Traceability

| Legacy ID       | Disposition            |
| --------------- | ---------------------- |
| UX-ERROS-01     | Ativo em FR-001/FR-002 |
| UX-LOADING-01   | Ativo em FR-003/FR-004 |
| UX-SCROLLBAR-01 | Ativo em FR-005        |
| RESP-15         | Ativo em FR-006        |
| RESP-16         | Ativo em FR-007        |
| RESP-18         | Ativo em FR-008        |

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Os três estados de erro apresentam status e recuperação corretos em 100% das variantes.
- **SC-002**: Nenhum cenário de sucesso, falha ou timeout deixa o carregamento ativo indefinidamente.
- **SC-003**: Todo conteúdo permanece alcançável por roda, touch e teclado com a barra oculta.
- **SC-004**: As três rotas secundárias não apresentam colisão ou conteúdo coberto entre 320 e
  1023 px.

## Assumptions

- A ocultação da barra é cosmética e será abandonada se reduzir acessibilidade em navegador suportado.
