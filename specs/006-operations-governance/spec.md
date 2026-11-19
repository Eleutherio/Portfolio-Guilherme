# Feature Specification: Operações e Governança Periódica

**Feature Branch**: `006-operations-governance`

**Created**: 2026-09-29

**Status**: Draft

**Input**: Migração das obrigações legadas de rollback, dependências, privacidade, produção e segredos.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Recuperar uma publicação com segurança (Priority: P1)

Como proprietário, quero comprovar rollback coordenado de frontend, API e dados antes de depender do
procedimento em produção.

**Why this priority**: Uma reversão não testada amplia indisponibilidade e risco de dados.

**Independent Test**: Reverter entre dois artefatos compatíveis em ambiente controlado e registrar
tempos e resultados sem segredos.

**Acceptance Scenarios**:

1. **Given** dois artefatos compatíveis, **When** o rollback completo é exercitado, **Then** frontend,
   API e dados retornam a um estado coerente e verificável.

---

### User Story 2 - Comprovar privacidade operacional (Priority: P1)

Como titular ou responsável pelo projeto, quero limites de retenção e revisões periódicas confirmados
nos serviços externos sem expor PII.

**Why this priority**: A implementação local não comprova configurações efetivas de fornecedores.

**Independent Test**: Conferir retenção da Brevo, caixa postal, saúde autenticada e registro da
revisão trimestral.

**Acceptance Scenarios**:

1. **Given** acesso administrativo autorizado, **When** a retenção é revisada, **Then** logs/previews
   respeitam 30 dias, caixa postal 12 meses e saúde informa estado atual.
2. **Given** uma revisão trimestral, **When** o resultado é registrado, **Then** não contém PII ou
   segredos.

---

### User Story 3 - Manter dependências e credenciais governadas (Priority: P2)

Como mantenedor, quero revisar dependências anualmente e rotacionar credenciais no prazo sem inserir
segredos no repositório.

**Why this priority**: Reduz exposição prolongada e risco de cadeia de suprimentos.

**Independent Test**: Confirmar decisão anual de dependências e evidência externa da rotação até a
data estabelecida.

**Acceptance Scenarios**:

1. **Given** a revisão anual, **When** dependências, licenças e inventário são avaliados, **Then** a
   decisão e data são registradas sem versionar relatório gerado.
2. **Given** 21/07/2027 como prazo máximo, **When** credenciais são rotacionadas, **Then** todos os
   serviços permanecem operacionais e nenhum segredo entra no histórico.

---

### User Story 4 - Confirmar contato em produção (Priority: P1)

Como proprietário, quero executar um smoke humano do formulário para comprovar entrega real e logs
sem conteúdo pessoal.

**Why this priority**: reCAPTCHA e entrega externa não são plenamente comprovados por automação.

**Independent Test**: Usar navegador comum na versão candidata atual, enviar mensagem e verificar
resposta, e-mail e correlação de log.

**Acceptance Scenarios**:

1. **Given** a versão candidata publicada, **When** uma mensagem válida é enviada, **Then** há resposta
   202, entrega HTML/texto, Reply-To e idioma corretos, com log contendo somente identificador seguro.

### Edge Cases

- Falha parcial de rollback não pode ser registrada como sucesso.
- Evidências operacionais não podem conter mensagem, endereço, token ou credencial.
- Rotação deve considerar dependências entre chaves para evitar indisponibilidade.
- Smoke deve usar a versão candidata atual, não um SHA legado fixo.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O rollback DEVE ser exercitado para frontend, API e migração compensatória usando dois
  artefatos compatíveis, com tempos e resultados registrados.
- **FR-002**: Dependências, licenças e SBOM DEVEM receber revisão anual; somente decisão e data podem
  ser preservadas como evidência versionada.
- **FR-003**: Retenção externa DEVE limitar logs/previews da Brevo a 30 dias e caixa postal a 12
  meses, com revisão mensal ativa.
- **FR-004**: A saúde autenticada DEVE informar que a retenção de privacidade está atual.
- **FR-005**: Fornecedores, retenção, direitos e segurança DEVEM receber revisão trimestral sem PII.
- **FR-006**: Cada versão candidata relevante DEVE permitir smoke humano do contato com resposta,
  entrega, Reply-To, idioma e log correlacionável validados.
- **FR-007**: O log do smoke NÃO DEVE conter dados da mensagem e DEVE limitar-se ao resultado e ao
  identificador seguro da requisição.
- **FR-008**: Credenciais de Brevo, GitHub, Supabase, reCAPTCHA, keep-alive e HMACs DEVEM ser revistas
  e rotacionadas até 2027-07-21.
- **FR-009**: Evidências de rotação DEVEM permanecer fora do repositório e não podem expor segredos.
- **FR-010**: Após publicação e respeitada a janela da ferramenta oficial, a Home DEVE receber nova
  medição pública do Website Carbon; nota, emissão por visita, percentil e estimativa de transferência
  disponíveis DEVEM ser registrados e comparados à linha de base local.

## Legacy Traceability

| Legacy ID  | Disposition                                                               |
| ---------- | ------------------------------------------------------------------------- |
| OPS-02     | Ativo em FR-001                                                           |
| DEP-02     | Ativo em FR-002                                                           |
| LGPD-02    | Ativo em FR-003/FR-004                                                    |
| LGPD-03    | Ativo em FR-005                                                           |
| QA-04      | Incorporado em FR-006/FR-007 e atualizado para a versão candidata vigente |
| SEC-ROT-01 | Ativo em FR-008/FR-009                                                    |

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Um rollback completo entre dois artefatos compatíveis termina com todos os serviços
  coerentes e tempos registrados.
- **SC-002**: 100% das evidências preservadas não contêm PII nem segredos.
- **SC-003**: Retenção externa e revisão trimestral apresentam estado atual em todas as verificações.
- **SC-004**: Todas as credenciais listadas possuem rotação confirmada até 2027-07-21.
- **SC-005**: Cada rodada pública de carbono registra todos os indicadores disponibilizados e uma
  comparação explícita com o gate local correspondente.

## Assumptions

- Ações em painéis externos serão executadas manualmente por pessoa autorizada.
- Identificadores de releases antigos são contexto histórico, não alvo operacional atual.
