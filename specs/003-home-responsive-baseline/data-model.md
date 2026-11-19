# Modelo de Dados: Baseline Responsivo da Home

Esta feature não cria persistência. O modelo descreve dados estáticos do frontend e estado efêmero
da interface.

## Entidades

### `CapabilityGroup`

Representa uma coluna semântica do painel.

| Campo           | Tipo                                                                   | Regra                                                                     |
| --------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `id`            | `engineering-development \| product-communication \| method-execution` | Único e estável.                                                          |
| `labelKey`      | chave de tradução                                                      | Existe em PT e EN.                                                        |
| `capabilityIds` | `CapabilityId[]`                                                       | Exatamente seis, na ordem editorial aprovada.                             |
| `technologyIds` | `TechnologyId[]`                                                       | Somente Engenharia possui as sete tecnologias; demais podem ficar vazios. |

**Invariantes**:

- Há exatamente três grupos.
- A ordem é Engenharia e Desenvolvimento → Produto e Comunicação → Método e Execução.
- Cada capacidade pertence a um único grupo.

### `Capability`

Representa uma competência interativa.

| Campo            | Tipo                               | Regra                                                        |
| ---------------- | ---------------------------------- | ------------------------------------------------------------ |
| `id`             | união literal `CapabilityId`       | Único, estável e independente do idioma.                     |
| `groupId`        | `CapabilityGroup["id"]`            | Referencia um grupo existente.                               |
| `labelKey`       | chave de tradução                  | Rótulo PT/EN não vazio.                                      |
| `descriptionKey` | chave de tradução                  | Explicação concreta PT/EN não vazia.                         |
| `relatedIds`     | `(CapabilityId \| TechnologyId)[]` | Entre duas e quatro referências únicas, sem autorreferência. |

**Invariantes**:

- Existem exatamente 18 capacidades, seis por grupo.
- Toda referência aponta para entidade existente.
- O mapa não é todos-para-todos.
- `security-privacy` relaciona no mínimo `lgpd`, `requirements-analysis` e
  `review-validation`.

### `Technology`

Representa uma tecnologia de apoio não interativa.

| Campo   | Tipo                                                                    | Regra                                       |
| ------- | ----------------------------------------------------------------------- | ------------------------------------------- |
| `id`    | `java \| python \| react \| django-rest \| render \| mysql \| supabase` | Único.                                      |
| `label` | `string`                                                                | Nome próprio da tecnologia, igual em PT/EN. |

**Invariantes**:

- Existem exatamente sete tecnologias.
- Tecnologia não possui descrição contextual nem estado `aria-expanded`.
- Tecnologia só recebe destaque secundário quando seu ID aparece em `relatedIds`.

### `LocalizedSkillsContent`

Conteúdo visível mantido no dicionário por idioma.

| Campo          | Tipo                              | Regra                                                      |
| -------------- | --------------------------------- | ---------------------------------------------------------- |
| `title`        | `string`                          | Heading da seção.                                          |
| `subtitle`     | `string`                          | Contexto curto, com voz pessoal.                           |
| `groups`       | registro por `CapabilityGroup.id` | Título acessível de cada grupo.                            |
| `capabilities` | registro por `CapabilityId`       | Rótulo e descrição de cada capacidade.                     |
| `interaction`  | objeto                            | Rótulos acessíveis de abrir, fechar, relação e tecnologia. |

**Invariantes**:

- PT e EN possuem as mesmas chaves estruturais.
- Descrições evitam níveis, percentuais, superlativos e afirmações não comprovadas.

### `SkillsInteractionState`

Estado efêmero local ao componente.

| Campo                | Tipo                                     | Estado inicial |
| -------------------- | ---------------------------------------- | -------------- |
| `activeCapabilityId` | `CapabilityId \| null`                   | `null`         |
| `activationMode`     | `pointer \| focus \| persistent \| null` | `null`         |

## Estados derivados

Para cada capacidade ou tecnologia:

- `primary`: ID igual a `activeCapabilityId`.
- `related`: ID aparece em `relatedIds` da capacidade ativa.
- `muted`: existe capacidade ativa e o ID não é principal nem relacionado.
- `idle`: não existe capacidade ativa.

Os estados devem ser comunicados por combinação de peso, marcador/contorno e texto acessível; cor ou
opacidade isoladas não são suficientes.

## Transições

```text
idle
  ├─ pointerenter(capacidade) → active(pointer)
  ├─ focus(capacidade)        → active(focus)
  └─ click/touch(capacidade)  → active(persistent)

active(pointer)
  ├─ pointerenter(outra) → active(pointer, outra)
  ├─ pointerleave(painel) → idle
  └─ click/touch(item)    → active(persistent, item)

active(focus)
  ├─ focus(outra)         → active(focus, outra)
  ├─ focusout(painel)     → idle
  └─ click/touch(item)    → active(persistent, item)

active(persistent)
  ├─ click(item ativo)    → idle
  ├─ click(outro item)    → active(persistent, outro)
  ├─ Escape               → idle, foco permanece no acionador
  └─ interação externa    → idle
```

Hover não deve cancelar uma seleção persistente até que haja uma ação explícita equivalente. A
implementação pode simplificar a detecção de modo, desde que o comportamento observável do contrato
seja preservado.

## Conteúdo canônico

### Engenharia e Desenvolvimento

1. Desenvolvimento Full-Stack
2. APIs REST e Integrações
3. Modelagem de Dados
4. Deploy e Cloud
5. Segurança e Privacidade
6. Performance e Qualidade

Tecnologias: Java, Python, React, Django REST, MySQL, Supabase e Render.

### Produto e Comunicação

1. Análise de Requisitos
2. Negócio ↔ Tecnologia
3. Documentação
4. Análise de Produto
5. LGPD
6. Performance e Conversão

### Método e Execução

1. Spec-Driven Development
2. Estruturação de Problemas
3. Planejamento de Implementação
4. Decomposição de Escopo
5. Desenvolvimento com LLMs
6. Revisão e Validação
