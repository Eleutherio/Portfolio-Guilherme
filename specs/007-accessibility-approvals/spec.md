# Feature Specification: Evidências de Acessibilidade e Aprovações

**Feature Branch**: `007-accessibility-approvals`

**Created**: 2026-09-29

**Status**: Draft

**Input**: Migração das validações manuais legadas de acessibilidade, identidade e direção visual.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Confiar na declaração de acessibilidade (Priority: P1)

Como pessoa com deficiência, quero que a declaração WCAG seja sustentada por evidências manuais em
tecnologias assistivas e configurações reais.

**Why this priority**: A conformidade não pode ser declarada somente por automação.

**Independent Test**: Completar ASES, leitores de tela desktop/mobile e alto contraste real nas rotas
HTML incluídas.

**Acceptance Scenarios**:

1. **Given** as rotas HTML do escopo, **When** as verificações externas são concluídas, **Then** cada
   ambiente possui resultado registrado e achados resolvidos ou explicitamente aceitos.
2. **Given** evidência ainda incompleta, **When** a declaração é publicada, **Then** ela permanece
   marcada como avaliação em andamento.

---

### User Story 2 - Usar um currículo PDF acessível (Priority: P2)

Como pessoa que utiliza leitor de PDF, quero navegar pelo currículo com idioma, ordem de leitura,
headings, alternativas e links corretos.

**Why this priority**: O documento é independente da conformidade HTML, mas é uma entrega pública.

**Independent Test**: Validar as três páginas em PAC/Acrobat e leitor compatível.

**Acceptance Scenarios**:

1. **Given** o currículo aberto em leitor de PDF, **When** a pessoa percorre estrutura, figuras e
   links, **Then** a ordem e os nomes correspondem ao conteúdo visual.

---

### User Story 3 - Encontrar identidade profissional consistente (Priority: P2)

Como visitante ou mecanismo de busca, quero nome e cargo consistentes em todos os conteúdos PT/EN.

**Why this priority**: Divergências prejudicam compreensão, acessibilidade e descoberta.

**Independent Test**: Comparar conteúdo visível, alternativas, títulos, links acessíveis, dados
estruturados e metadados sociais após decisão do proprietário.

**Acceptance Scenarios**:

1. **Given** a identidade canônica aprovada, **When** qualquer superfície é consultada, **Then** nome
   e cargo usam a mesma formulação correspondente ao idioma.

---

### User Story 4 - Aprovar a direção visual responsiva (Priority: P2)

Como proprietário, quero revisar a composição final em celulares e tablets antes de encerrar a
estabilização visual.

**Why this priority**: Automação não decide qualidade editorial ou equilíbrio visual.

**Independent Test**: Inspecionar mobile estreito/largo e tablet após os ajustes responsivos.

**Acceptance Scenarios**:

1. **Given** os intervalos auditados, **When** a rodada final é revisada, **Then** ordem, proporção,
   alinhamento, carrosséis e respiro recebem decisão explícita.

### Edge Cases

- Documentos para download não podem ser implicitamente incluídos na declaração HTML.
- ASES dependente de reCAPTCHA precisa ser executado por pessoa em ambiente compatível.
- Evidência emulada não substitui alto contraste e leitor mobile reais quando exigidos.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: A declaração WCAG 2.2 AA das rotas HTML DEVE permanecer “em andamento” até concluir
  ASES, NVDA com navegador adicional, TalkBack ou VoiceOver e Windows High Contrast real.
- **FR-002**: Resultados manuais DEVEM identificar ambiente, escopo, data, achados e decisão sem PII.
- **FR-003**: O currículo PDF DEVE possuir idioma e metadados coerentes, ordem de leitura aprovada,
  headings sem salto inicial, alternativas adequadas e quatro links corretos.
- **FR-004**: O currículo DEVE ser aprovado por ferramenta de análise de PDF e leitor compatível,
  permanecendo fora da declaração WCAG das páginas HTML.
- **FR-005**: Nome e cargo canônicos DEVEM ser aprovados pelo proprietário e aplicados de forma
  consistente em conteúdo, alternativas, títulos, links, dados estruturados e metadados PT/EN.
- **FR-006**: Mobile estreito, mobile largo e tablet DEVEM receber aprovação visual explícita após os
  ajustes responsivos aplicáveis.
- **FR-007**: A aprovação visual DEVE avaliar ordem, proporção, alinhamento, carrosséis e respiro;
  telas maiores podem permanecer em rodada manual separada.

## Legacy Traceability

| Legacy ID | Disposition            |
| --------- | ---------------------- |
| A11Y-03   | Ativo em FR-001/FR-002 |
| A11Y-02   | Ativo em FR-003/FR-004 |
| UX-03     | Ativo em FR-005        |
| RESP-07   | Ativo em FR-006/FR-007 |

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% dos ambientes manuais exigidos possuem evidência e decisão registradas.
- **SC-002**: O currículo conclui as verificações estruturais nas três páginas e nos quatro links.
- **SC-003**: Zero divergências de nome ou cargo permanecem nas superfícies auditadas em cada idioma.
- **SC-004**: Todos os intervalos mobile/tablet recebem aprovação ou uma lista explícita de achados.

## Assumptions

- O proprietário fornecerá decisões editoriais e acesso a dispositivos ou painéis externos.
- Evidências sensíveis permanecem fora do repositório; somente resultado e data são registrados.
- O proprietário não possui hardware Apple real; validações estruturais usam WebKit quando
  aplicável, sem alegar que isso comprova reprodução de mídia ou VoiceOver em dispositivo real.
