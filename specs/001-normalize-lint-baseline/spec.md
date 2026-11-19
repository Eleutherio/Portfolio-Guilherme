# Feature Specification: Baseline Global de Qualidade Estática

**Feature Branch**: `não criada — hook de branch não configurado`

**Created**: 2026-09-28

**Status**: Draft

**Input**: User description: "normalize the lint baseline and globally enable unused code rules."

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Gate parte de um baseline limpo (Priority: P1)

Como pessoa mantenedora, quero que o gate oficial de qualidade estática seja aprovado sobre o
estado válido do repositório para distinguir regressões novas de resíduos históricos.

**Why this priority**: Sem um baseline limpo, o gate não pode bloquear regressões de forma
confiável e sua execução deixa de orientar contribuidores.

**Independent Test**: Executar o gate oficial sobre uma cópia limpa do conjunto aprovado e
confirmar que ele termina sem diagnósticos, sem alterar o comportamento observável do produto.

**Acceptance Scenarios**:

1. **Given** um conjunto aprovado sem mudanças locais, **When** o gate oficial é executado,
   **Then** a execução termina com sucesso e apresenta zero erros e zero avisos.
2. **Given** arquivos equivalentes com convenções de quebra de linha dos ambientes suportados,
   **When** o gate é executado, **Then** o resultado de aprovação é o mesmo.
3. **Given** artefatos locais, temporários ou gerados fora do código mantido,
   **When** o gate é executado, **Then** esses artefatos não produzem falsos bloqueios.

---

### User Story 2 - Código não utilizado bloqueia regressões (Priority: P2)

Como pessoa contribuidora, quero receber um diagnóstico claro ao introduzir código não utilizado
para removê-lo antes que a mudança seja integrada.

**Why this priority**: Código morto oculta intenção, aumenta custo de manutenção e pode indicar uma
implementação incompleta.

**Independent Test**: Introduzir separadamente um import, uma variável e um parâmetro não utilizados
em código mantido e confirmar que cada caso bloqueia o gate; remover cada ocorrência e confirmar
que o gate volta a passar.

**Acceptance Scenarios**:

1. **Given** um import não utilizado em código mantido, **When** o gate é executado,
   **Then** a execução falha e identifica a localização da ocorrência.
2. **Given** uma variável ou parâmetro não utilizado, **When** o gate é executado,
   **Then** a execução falha com diagnóstico acionável.
3. **Given** que todas as ocorrências foram removidas, **When** o gate é executado novamente,
   **Then** a execução é aprovada.
4. **Given** uma exceção necessária e justificada, **When** o gate é executado,
   **Then** somente o menor escopo explicitamente autorizado fica isento.

---

### User Story 3 - Resultado consistente para equipe e automação (Priority: P3)

Como pessoa revisora, quero que a verificação local e a automação compartilhem o mesmo contrato para
que uma mudança aprovada localmente não falhe posteriormente por diferenças irrelevantes de ambiente.

**Why this priority**: Consistência reduz retrabalho e torna o resultado do gate reproduzível.

**Independent Test**: Executar o mesmo conjunto em dois ambientes suportados com convenções
diferentes e confirmar que arquivos mantidos, exclusões e diagnósticos produzem a mesma decisão.

**Acceptance Scenarios**:

1. **Given** o mesmo conteúdo mantido em dois ambientes suportados, **When** o gate é executado,
   **Then** ambos produzem a mesma decisão de aprovação ou reprovação.
2. **Given** uma exclusão necessária, **When** uma pessoa revisora consulta o escopo do gate,
   **Then** encontra a justificativa e o limite exato da exclusão.
3. **Given** um arquivo mantido novo, **When** ele entra no escopo do produto,
   **Then** passa automaticamente pelas mesmas regras globais.

### Edge Cases

- Arquivos gerados contêm construções que seriam inválidas para código mantido.
- Um parâmetro é exigido por um contrato externo, embora seu valor não seja consumido.
- Imports usados apenas como tipos são confundidos com imports sem uso.
- Um arquivo local de diagnóstico existe dentro do repositório, mas não pertence ao produto.
- O mesmo conteúdo é materializado com convenções distintas de quebra de linha.
- Uma supressão ampla encobre ocorrências que não justificam exceção.
- Scripts, configurações e testes fora da pasta principal de código também contêm código não usado.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O gate oficial de qualidade estática DEVE partir de zero erros e zero avisos no
  conjunto aprovado do repositório.
- **FR-002**: Todo código mantido de primeira parte DEVE estar incluído no escopo global do gate,
  independentemente de sua área funcional.
- **FR-003**: O gate DEVE detectar imports, variáveis e parâmetros não utilizados em todas as
  categorias de código mantido às quais essas construções se aplicam.
- **FR-004**: Cada diagnóstico DEVE identificar a ocorrência e permitir que uma pessoa contribuidora
  encontre sua origem em uma única execução.
- **FR-005**: Artefatos gerados, saídas de build, relatórios e diagnósticos locais DEVEM ser excluídos
  somente por regras explícitas e delimitadas.
- **FR-006**: Toda exclusão ou supressão necessária em código mantido DEVE possuir justificativa
  verificável e abranger o menor escopo possível.
- **FR-007**: O resultado do gate DEVE ser consistente entre os ambientes de desenvolvimento e
  automação suportados, inclusive diante de convenções distintas de quebra de linha.
- **FR-008**: A normalização do baseline NÃO DEVE alterar comportamento observável, contratos,
  conteúdo público ou fluxos do produto.
- **FR-009**: Código mantido adicionado após a normalização DEVE entrar no escopo global sem exigir
  cadastro individual.
- **FR-010**: A automação de integração DEVE aplicar o mesmo contrato de aprovação usado localmente.
- **FR-011**: A normalização NÃO DEVE ocultar diagnósticos existentes por meio de desativação global,
  redução de severidade ou exclusão ampla de código mantido.
- **FR-012**: Artefatos gerados DEVEM permanecer sob responsabilidade de seu gerador e NÃO DEVEM ser
  alterados manualmente apenas para satisfazer o gate.

### Scope Boundaries

**In scope**:

- Normalizar todos os diagnósticos que atualmente impedem um baseline limpo.
- Aplicar regras de código não utilizado a todo código mantido de primeira parte.
- Tornar exclusões explícitas, mínimas e justificadas.
- Garantir decisão consistente nos ambientes suportados.
- Comprovar que a normalização não altera o comportamento do produto.

**Out of scope**:

- Refatorar módulos apenas por tamanho, estilo arquitetural ou preferência pessoal.
- Alterar funcionalidades, interface, contratos públicos ou conteúdo do portfólio.
- Reescrever artefatos gerados manualmente.
- Introduzir metas de cobertura de testes não relacionadas ao comportamento preservado.
- Tratar automação de fronteiras de segurança ou ampliar a estratégia de testes frontend,
  que pertencem a especificações independentes.

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: O conjunto aprovado registra zero erros e zero avisos em 100% das execuções do gate
  oficial realizadas sobre uma cópia limpa.
- **SC-002**: Casos representativos de import, variável e parâmetro não utilizados são detectados
  em 100% das categorias aplicáveis e deixam de bloquear após sua remoção.
- **SC-003**: Dois ambientes suportados com convenções distintas produzem a mesma decisão para o
  mesmo conteúdo em 100% dos cenários de aceitação.
- **SC-004**: 100% dos arquivos mantidos estão cobertos pelo escopo global ou por uma exclusão
  explícita, delimitada e justificada.
- **SC-005**: Uma pessoa contribuidora consegue localizar cada ocorrência reportada a partir de uma
  única execução, sem investigação adicional sobre qual arquivo originou o diagnóstico.
- **SC-006**: A suíte de regressão aplicável preserva 100% dos comportamentos e contratos existentes
  após a normalização.
- **SC-007**: O feedback completo do gate permanece disponível em até 2 minutos em condições
  normais de desenvolvimento.

## Assumptions

- A feature é uma mudança de qualidade interna e não altera a experiência de visitantes.
- O conjunto aprovado no encerramento da feature será usado como baseline, não estados locais
  intermediários.
- Artefatos gerados, saídas de build e arquivos locais de agentes não são código mantido do produto.
- Parâmetros exigidos por contratos externos podem usar uma exceção mínima e documentada quando não
  houver alternativa sem alterar o contrato.
- O projeto já possui um gate oficial de qualidade estática e automação capazes de executar o
  contrato resultante.
- A estratégia de testes existente é suficiente para comprovar ausência de regressão funcional
  nesta mudança estritamente mecânica.
