# Feature Specification: Descoberta e Documentação do Projeto

**Feature Branch**: `005-discovery-documentation`

**Created**: 2026-09-29

**Status**: Draft

**Input**: Migração das pendências legadas de SEO, padronização e documentação.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Compartilhar páginas com preview correto (Priority: P1)

Como proprietário, quero que páginas públicas gerem cards sociais corretos no domínio canônico.

**Why this priority**: Previews incorretos prejudicam descoberta e credibilidade pública.

**Independent Test**: Inspecionar HTML publicado e validar Home, Sobre, Privacidade, Acessibilidade e
cases nas ferramentas de LinkedIn e Facebook.

**Acceptance Scenarios**:

1. **Given** uma página publicada, **When** uma rede social cria o card, **Then** usa URL absoluta e
   imagem 1200×630 da página correta.

---

### User Story 2 - Preparar o projeto de forma reproduzível (Priority: P1)

Como pessoa contribuidora, quero documentação objetiva e finais de linha consistentes para preparar,
validar e operar o projeto sem diffs artificiais.

**Why this priority**: Reprodutibilidade reduz erros de ambiente e manutenção.

**Independent Test**: Realizar checkout em Windows e CI Linux, seguir o README e confirmar ausência
de diffs CRLF/LF.

**Acceptance Scenarios**:

1. **Given** um checkout novo, **When** os arquivos são abertos e formatados, **Then** nenhum diff de
   final de linha é criado.
2. **Given** uma pessoa nova, **When** segue o README, **Then** encontra instalação, arquitetura,
   variáveis, testes, segurança, deploy e rollback.

---

### User Story 3 - Consultar identidade visual vigente (Priority: P2)

Como mantenedor, quero que o MIV descreva a implementação atual para evitar decisões baseadas em
tokens ou larguras antigas.

**Why this priority**: A documentação visual orienta futuras mudanças de interface.

**Independent Test**: Comparar MIV e implementação em containers, tipografia e tokens.

**Acceptance Scenarios**:

1. **Given** o MIV aberto, **When** seus valores são comparados ao produto, **Then** containers e
   tokens descritos correspondem ao estado vigente.

### Edge Cases

- Cache social antigo precisa ser distinguido de metadado incorreto.
- Configuração de final de linha deve funcionar independentemente de `core.autocrlf`.
- Documentação não pode incluir segredos nem valores reais de credenciais.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: Home, Sobre, Privacidade, Acessibilidade e cases DEVEM publicar URLs sociais absolutas
  e imagens 1200×630 válidas no domínio canônico.
- **FR-002**: Cards DEVEM ser confirmados após publicação no LinkedIn Post Inspector e Facebook
  Sharing Debugger, incluindo atualização de cache.
- **FR-003**: LF DEVE ser o final de linha canônico para arquivos-texto versionados em todos os
  ambientes suportados.
- **FR-004**: Renormalização DEVE ocorrer isoladamente e sem mudança funcional, com validação local e
  em CI.
- **FR-005**: O README principal DEVE cobrir instalação, arquitetura, configuração, testes,
  segurança, deploy e rollback sem expor segredos.
- **FR-006**: O MIV DEVE refletir containers, exceções fluidas, tipografia e tokens vigentes.

## Legacy Traceability

| Legacy ID | Disposition            |
| --------- | ---------------------- |
| SEO-05    | Ativo em FR-001/FR-002 |
| DEVX-01   | Ativo em FR-003/FR-004 |
| DOC-01    | Ativo em FR-005        |
| DOC-02    | Ativo em FR-006        |

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: 100% das rotas listadas exibem card correto nas duas ferramentas sociais.
- **SC-002**: Checkouts em Windows e Linux produzem zero diffs exclusivos de final de linha.
- **SC-003**: Todas as sete áreas obrigatórias do README são localizáveis sem conhecimento prévio.
- **SC-004**: A auditoria do MIV encontra zero divergências nos valores explicitamente documentados.

## Assumptions

- Validação de previews exige que a versão correspondente já esteja publicada.
