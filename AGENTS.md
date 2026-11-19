# Bootstrap do Codex

Este arquivo não é uma fonte normativa. O projeto usa exclusivamente o Spec Kit como método de
trabalho.

Antes de atuar no repositório:

1. Leia `.specify/memory/constitution.md` e `.specify/memory/project-context.md`.
2. Para um ciclo completo, execute
   `specify workflow run portfolio-sdd --input spec="<descrição da mudança>"`.
   Para uma etapa isolada, use a skill `$speckit-*` correspondente.
3. Use os artefatos da feature ativa em `specs/`; `.specify/feature.json` indica a feature local
   quando estiver presente.
4. Em caso de conflito, a constituição prevalece. Registre decisões e requisitos no Spec Kit, não
   neste arquivo.

O workflow `portfolio-sdd` é o fluxo padrão:

`$speckit-specify` → `$speckit-clarify` quando necessário → `$speckit-plan` → `$speckit-tasks` →
`$speckit-analyze` → `$speckit-implement` → `$speckit-converge` → gates finais do workflow.

Use `$speckit-constitution` somente para governança e `$speckit-checklist` para verificar a qualidade
dos requisitos. Este bootstrap NÃO DEVE duplicar regras, comandos, backlog ou decisões do projeto.
