# Índice de Migração do Backlog Legado

**Migrado em**: 2026-09-29
**Origem**: backlog local legado, aposentado após esta migração
**Cobertura**: 55 de 55 IDs, sem ausências ou duplicações

Este arquivo apenas roteia os itens legados para suas especificações. Requisitos ativos, decisões
de substituição e critérios de sucesso pertencem às specs vinculadas, não a este índice.

| Feature                                     | Escopo                                       | IDs migrados                                                           | Quantidade |
| ------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------- | ---------: |
| [002](002-hero-header-baseline/spec.md)     | Hero e cabeçalho                             | QA-HERO-FAIXA-ESCURA-01 até QA-HERO-FOTO-01 conforme tabela da spec    |         20 |
| [003](003-home-responsive-baseline/spec.md) | Home e baseline responsivo                   | QA-HOME-LARGURA-CONTEUDO-01 até RESP-17 conforme tabela da spec        |         15 |
| [004](004-cross-route-experience/spec.md)   | Estados globais e rotas secundárias          | UX-ERROS-01, UX-LOADING-01, UX-SCROLLBAR-01, RESP-15, RESP-16, RESP-18 |          6 |
| [005](005-discovery-documentation/spec.md)  | SEO, padronização e documentação             | SEO-05, DEVX-01, DOC-01, DOC-02                                        |          4 |
| [006](006-operations-governance/spec.md)    | Operações, privacidade e segurança periódica | OPS-02, DEP-02, LGPD-02, LGPD-03, QA-04, SEC-ROT-01                    |          6 |
| [007](007-accessibility-approvals/spec.md)  | Evidências manuais e aprovações              | A11Y-03, A11Y-02, UX-03, RESP-07                                       |          4 |

## Regras da migração

- Um ID legado aparece em exatamente uma tabela `Legacy Traceability`.
- Item substituído permanece rastreável, mas não gera requisito conflitante.
- `[gate:commit]` não foi transportado como bloqueio global; cada requisito passa pelos gates do
  workflow `portfolio-sdd` da própria feature.
- Dependências externas ou manuais permanecem explícitas nas specs correspondentes.
- O backlog de origem foi removido após a verificação mecânica de cobertura integral.
