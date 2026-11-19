# Proposta de commits — 2026-11-18

**Estado:** aprovado pelo usuário em 2026-11-18. Autorizados staging e criação de C1–C5 na ordem abaixo, com dispensa E2E pontual. Push e publicação permanecem fora do escopo.
**Base:** `5673027` na branch `test/baseline-responsiva`.
**Inventário:** 426 caminhos anteriores à proposta; 317 caminhos propostos, incluindo este documento. Cada caminho tem um único destino. A seleção não usa `git add .`.

## Workflow existente e ordem de execução

Fontes normativas: [constituição](../../.specify/memory/constitution.md),
[contexto operacional](../../.specify/memory/project-context.md) e
[workflow portfolio-sdd](../../.specify/workflows/portfolio-sdd.yml).
Mecanismos conferidos: `package.json`, `.githooks/pre-commit`,
`scripts/pre-commit-e2e.mjs`, `playwright.config.ts` e `.github/workflows/quality.yml`.
`core.hooksPath` já aponta para `.githooks`.

1. Revisar e aprovar os cinco grupos e suas mensagens. O vídeo do Hero já está otimizado; esta etapa altera somente a proposta.
2. Conforme a dispensa E2E solicitada pelo usuário, executar separadamente `npm run lint`, `npm run typecheck`, `npm run test:api`, `npm run test:commit-gate` e `npm run build`. Não usar `npm run commit:check` neste lote, pois ele repetiria E2E. Executar `npm run carbon:check` por último.
3. Somente após sucesso, preparar C1 por caminhos explícitos. Carbono precisa concluir imediatamente antes do primeiro staging; qualquer edição posterior exige nova validação aplicável.
4. Inspecionar o diff preparado e manter cada commit compilável. Não repetir E2E no hook para os cinco commits deste lote; a dispensa abaixo registra a cobertura existente e o risco dos snapshots intermediários.
5. Criar os commits somente após aprovação, em ordem, com mensagens PT-BR. Aplicar a dispensa por invocação, sem modificar permanentemente `.githooks`, scripts, CI ou `core.hooksPath`. Qualquer falha nos gates mantidos interrompe o fluxo.
6. Repetir a revisão do índice a cada commit. Ao concluir o lote, o fluxo E2E padrão continua vigente. Push e publicação não fazem parte desta aprovação.

Aprovação recebida. Executar os gates mantidos antes de staging; registrar resultados nos logs locais da execução. Os resultados E2E reaproveitados permanecem identificados abaixo.

## Dispensa E2E autorizada somente para este lote

- **Responsável e autorização:** Guilherme, por pedido explícito de não repetir o gate já executado, em 2026-11-18.
- **Motivo:** aproveitar a suíte completa e as verificações direcionadas já concluídas durante esta sessão.
- **Escopo:** não repetir `npm run test:a11y` na preparação nem o runner E2E pre-commit durante C1–C5. Testes unitários do mecanismo (`test:commit-gate`) permanecem no fluxo; não são a execução da suíte de browser da aplicação.
- **Evidência existente:** 310/310 E2E na rodada integral (`tmp/e2e-carbon-complete.log`); posteriormente 25/25 de mídia e screenshots (`tmp/e2e-editor-final.log`) e 19/19 de mídia após otimizar o Hero (`tmp/e2e-hero-optimized.log`). Os resultados se sobrepõem e não são somados como uma única execução.
- **Limite da evidência e risco aceito:** a suíte integral antecede as últimas correções; os snapshots intermediários de C1–C5 não foram comprovados individualmente pelo E2E. Registrar a execução como dispensada, sem declarar aprovação E2E de cada commit.
- **Aplicação aprovada:** conferir que `.githooks` contém somente o hook E2E e usar `git -c core.hooksPath=tmp/commit-without-e2e commit ...` para cada commit aprovado, com diretório temporário vazio, ignorado pelo Git. O override vale somente para a invocação; a configuração permanente continua `.githooks`. Se surgirem outros hooks, preservar suas verificações e ajustar a aplicação da dispensa.
- **Gates mantidos:** lint, typecheck, API, testes do mecanismo, build, revisão de staging e carbono imediatamente antes do primeiro staging. CI permanece intacta.
- **Validade:** termina ao concluir C1–C5; alterações adicionais de código, dependências ou mídia fora do inventário aprovado exigem reavaliar a dispensa. Correções dos gates mantidos entram nessa revisão. Não autoriza publicação ou push.

## Sequência proposta

| Ordem | Mensagem PT-BR                                                   | Caminhos |
| ----- | ---------------------------------------------------------------- | -------: |
| C1    | `build: prepara dependências e gates de commit`                  |       16 |
| C2    | `chore(spec): consolida governança e especificações`             |       65 |
| C3    | `feat(portfolio): reorganiza a interface e a mídia responsiva`   |      230 |
| C4    | `fix(carbono): aguarda o preparo da página antes de medir`       |        3 |
| C5    | `chore(editor): configura Tailwind e amplia a checagem de tipos` |        3 |

### C1 — build: prepara dependências e gates de commit

Prepara Lenis e DM Sans, mantém o gerador de fontes compatível com as dependências e acrescenta scripts de preparação, hook E2E, validação na CI e isolamento de servidor/cache. Padroniza finais de linha e exclusões de artefatos locais.

Os dois manifestos entram completos no primeiro commit, mantendo dependências e lockfile alinhados e compatíveis com o contrato do hook padrão. Os arquivos locais de Sora/Caveat só serão removidos em C3, junto à troca efetiva de tipografia. As novas dependências não ativam rolagem nem mudam a interface em C1.

<details>
<summary>Arquivos exatos (16)</summary>

- `.gitattributes`
- `.githooks/pre-commit`
- `.github/workflows/quality.yml`
- `.gitignore`
- `.prettierignore`
- `.prettierrc`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `scripts/assets/fonts/DM-Sans-OFL.txt`
- `scripts/assets/fonts/dm-sans-latin-wght-normal.woff2`
- `scripts/generate-font-subsets.mjs`
- `scripts/install-git-hooks.mjs`
- `scripts/pre-commit-e2e.mjs`
- `scripts/pre-commit-e2e.test.mjs`
- `vite.config.ts`

</details>

### C2 — chore(spec): consolida governança e especificações

Versiona constituição, contexto operacional, identidade visual, workflow Spec Kit, skills, templates e especificações. Atualiza os runbooks para apontarem às specs responsáveis e inclui esta proposta.

Mantém governança e rastreabilidade em um escopo próprio. As specs também preservam trabalho pendente; versionar uma tarefa não significa declará-la implementada.

<details>
<summary>Arquivos exatos (65)</summary>

- `.agents/skills/speckit-analyze/SKILL.md`
- `.agents/skills/speckit-checklist/SKILL.md`
- `.agents/skills/speckit-clarify/SKILL.md`
- `.agents/skills/speckit-constitution/SKILL.md`
- `.agents/skills/speckit-converge/SKILL.md`
- `.agents/skills/speckit-implement/SKILL.md`
- `.agents/skills/speckit-plan/SKILL.md`
- `.agents/skills/speckit-specify/SKILL.md`
- `.agents/skills/speckit-tasks/SKILL.md`
- `.agents/skills/speckit-taskstoissues/SKILL.md`
- `.specify/.gitignore`
- `.specify/init-options.json`
- `.specify/integration.json`
- `.specify/integrations/codex.manifest.json`
- `.specify/integrations/speckit.manifest.json`
- `.specify/memory/.constitution-template.json`
- `.specify/memory/brand-guidelines.md`
- `.specify/memory/constitution.md`
- `.specify/memory/project-context.md`
- `.specify/scripts/powershell/check-prerequisites.ps1`
- `.specify/scripts/powershell/common.ps1`
- `.specify/scripts/powershell/create-new-feature.ps1`
- `.specify/scripts/powershell/resolve-template.ps1`
- `.specify/scripts/powershell/setup-plan.ps1`
- `.specify/scripts/powershell/setup-tasks.ps1`
- `.specify/templates/checklist-template.md`
- `.specify/templates/constitution-template.md`
- `.specify/templates/plan-template.md`
- `.specify/templates/spec-template.md`
- `.specify/templates/tasks-template.md`
- `.specify/workflows/portfolio-sdd.yml`
- `.specify/workflows/portfolio-sdd/workflow.yml`
- `.specify/workflows/speckit/workflow.yml`
- `AGENTS.md`
- `docs/deployment/PRIVACY-RETENTION.md`
- `docs/deployment/SECURITY-OPERATIONS.md`
- `specs/001-normalize-lint-baseline/checklists/requirements.md`
- `specs/001-normalize-lint-baseline/spec.md`
- `specs/002-hero-header-baseline/checklists/requirements.md`
- `specs/002-hero-header-baseline/contracts/hero-header-ui.md`
- `specs/002-hero-header-baseline/data-model.md`
- `specs/002-hero-header-baseline/plan.md`
- `specs/002-hero-header-baseline/quickstart.md`
- `specs/002-hero-header-baseline/research.md`
- `specs/002-hero-header-baseline/spec.md`
- `specs/002-hero-header-baseline/tasks.md`
- `specs/003-home-responsive-baseline/checklists/requirements.md`
- `specs/003-home-responsive-baseline/commit-plan.md`
- `specs/003-home-responsive-baseline/contracts/home-responsive-ui.md`
- `specs/003-home-responsive-baseline/data-model.md`
- `specs/003-home-responsive-baseline/plan.md`
- `specs/003-home-responsive-baseline/quickstart.md`
- `specs/003-home-responsive-baseline/research.md`
- `specs/003-home-responsive-baseline/spec.md`
- `specs/003-home-responsive-baseline/tasks.md`
- `specs/003-home-responsive-baseline/validation.md`
- `specs/004-cross-route-experience/checklists/requirements.md`
- `specs/004-cross-route-experience/spec.md`
- `specs/005-discovery-documentation/checklists/requirements.md`
- `specs/005-discovery-documentation/spec.md`
- `specs/006-operations-governance/checklists/requirements.md`
- `specs/006-operations-governance/spec.md`
- `specs/007-accessibility-approvals/checklists/requirements.md`
- `specs/007-accessibility-approvals/spec.md`
- `specs/legacy-migration-index.md`

</details>

### C3 — feat(portfolio): reorganiza a interface e a mídia responsiva

Atualiza tipografia, temas, navegação, Sobre, Projetos, Serviços, Princípios, Depoimentos, Contato e rodapé. Integra preparo da página, mídia por intenção, previews por hover, recursos sob demanda e imagens/fontes otimizadas. Inclui geradores, traduções, testes correspondentes e snapshots.

É o maior commit por dependência real: styles.css, dictionary.ts, dados de projetos, componentes e contratos E2E mudaram juntos. Manter testes e interface no mesmo commit preserva os contratos para a CI e futuras execuções. O ESLint mais estrito entra aqui com as correções do código existente. O vídeo do Hero já foi otimizado, conforme resolução registrada abaixo.

<details>
<summary>Arquivos exatos (230)</summary>

- `docs/accessibility/WCAG-2.2-AA.md`
- `e2e/__screenshots__/visual-regression.spec.ts/chromium/accessibility-header-mobile-dark-win32.png`
- `e2e/__screenshots__/visual-regression.spec.ts/chromium/case-grengame-desktop.png`
- `e2e/__screenshots__/visual-regression.spec.ts/chromium/home-desktop.png`
- `e2e/__screenshots__/visual-regression.spec.ts/chromium/home-mobile-dark.png`
- `e2e/__screenshots__/visual-regression.spec.ts/chromium/privacy-header-desktop.png`
- `e2e/__screenshots__/visual-regression.spec.ts/chromium/testimonials-desktop-light.png`
- `e2e/__screenshots__/visual-regression.spec.ts/chromium/testimonials-mobile-dark.png`
- `e2e/brand.spec.ts`
- `e2e/contrast.spec.ts`
- `e2e/cross-browser.spec.ts`
- `e2e/cursor.spec.ts`
- `e2e/dynamic-content.spec.ts`
- `e2e/footer-infrastructure.spec.ts`
- `e2e/hero-header.spec.ts`
- `e2e/hero-stats.spec.ts`
- `e2e/interface-contact.spec.ts`
- `e2e/on-demand-loading.spec.ts`
- `e2e/preferences.spec.ts`
- `e2e/responsive-inputs.spec.ts`
- `e2e/responsive-inventory.spec.ts`
- `e2e/responsive-media.spec.ts`
- `e2e/responsiveness.spec.ts`
- `e2e/seo.spec.ts`
- `e2e/support/portfolio.ts`
- `e2e/support/responsive.ts`
- `e2e/support/screenshot.css`
- `e2e/typography.spec.ts`
- `e2e/visual-regression.spec.ts`
- `eslint.config.js`
- `index.html`
- `public/images/green-hosting.webp`
- `public/images/media-unavailable.svg`
- `public/preloader.css`
- `public/preloader.js`
- `scripts/assets/green-hosting.png`
- `scripts/generate-hero-poster.mjs`
- `scripts/generate-hosting-badge.mjs`
- `scripts/generate-project-preview-posters.mjs`
- `scripts/generate-responsive-images.mjs`
- `scripts/generate-workplace-images.mjs`
- `src/assets/about/about-mosaic-campus.jpg`
- `src/assets/about/about-mosaic-cat.jpg`
- `src/assets/about/about-mosaic-classroom.jpg`
- `src/assets/about/about-mosaic-kit.jpg`
- `src/assets/about/about-speaking-cutout-480w.avif`
- `src/assets/about/about-speaking-cutout-480w.webp`
- `src/assets/about/about-speaking-cutout-512w.avif`
- `src/assets/about/about-speaking-cutout-512w.webp`
- `src/assets/about/about-speaking-cutout-720w.avif`
- `src/assets/about/about-speaking-cutout-720w.webp`
- `src/assets/about/about-speaking-cutout-960w.avif`
- `src/assets/about/about-speaking-cutout-960w.webp`
- `src/assets/about/about-speaking-cutout.png`
- `src/assets/about/grengame-presentation-portrait-200w.avif`
- `src/assets/about/grengame-presentation-portrait-240w.avif`
- `src/assets/about/grengame-presentation-portrait-320w.avif`
- `src/assets/about/grengame-presentation-portrait-400w.avif`
- `src/assets/about/grengame-presentation-portrait-480w.avif`
- `src/assets/about/grengame-presentation-portrait-640w.avif`
- `src/assets/about/grengame-presentation-portrait-800w.avif`
- `src/assets/about/hardware-workbench-200w.avif`
- `src/assets/about/hardware-workbench-240w.avif`
- `src/assets/about/hardware-workbench-320w.avif`
- `src/assets/about/hardware-workbench-400w.avif`
- `src/assets/about/hardware-workbench-480w.avif`
- `src/assets/about/unisinos-campus-200w.avif`
- `src/assets/about/unisinos-campus-240w.avif`
- `src/assets/about/unisinos-campus-320w.avif`
- `src/assets/about/unisinos-campus-400w.avif`
- `src/assets/about/unisinos-campus-480w.avif`
- `src/assets/about/unisinos-campus-640w.avif`
- `src/assets/about/unisinos-campus-800w.avif`
- `src/assets/fonts/caveat-signature-600.woff2`
- `src/assets/fonts/dm-sans-heading.woff2`
- `src/assets/fonts/sora-heading-500.woff2`
- `src/assets/fonts/space-grotesk-body.woff2`
- `src/assets/hero/guilherme-speaking.jpg`
- `src/assets/hero/hero-background-poster-1200w.avif`
- `src/assets/hero/hero-background.mp4`
- `src/assets/projects/abriu-chaveiro-cover-1200w.avif`
- `src/assets/projects/abriu-chaveiro-cover-1200w.webp`
- `src/assets/projects/abriu-chaveiro-cover-1600w.avif`
- `src/assets/projects/abriu-chaveiro-cover-1600w.webp`
- `src/assets/projects/abriu-chaveiro-cover-400w.avif`
- `src/assets/projects/abriu-chaveiro-cover-600w.avif`
- `src/assets/projects/abriu-chaveiro-cover-600w.webp`
- `src/assets/projects/abriu-chaveiro-cover-800w.avif`
- `src/assets/projects/abriu-chaveiro-cover-grid-1200w.avif`
- `src/assets/projects/abriu-chaveiro-cover-grid-1200w.webp`
- `src/assets/projects/abriu-chaveiro-cover-grid-400w.avif`
- `src/assets/projects/abriu-chaveiro-cover-grid-400w.webp`
- `src/assets/projects/abriu-chaveiro-cover-grid-600w.avif`
- `src/assets/projects/abriu-chaveiro-cover-grid-600w.webp`
- `src/assets/projects/abriu-chaveiro-cover-grid-800w.avif`
- `src/assets/projects/abriu-chaveiro-cover-grid-800w.webp`
- `src/assets/projects/abriu-chaveiro-preview-poster.avif`
- `src/assets/projects/abriu-chaveiro-preview-poster.webp`
- `src/assets/projects/grengame-cover-1200w.avif`
- `src/assets/projects/grengame-cover-1200w.webp`
- `src/assets/projects/grengame-cover-1600w.avif`
- `src/assets/projects/grengame-cover-1600w.webp`
- `src/assets/projects/grengame-cover-400w.avif`
- `src/assets/projects/grengame-cover-600w.avif`
- `src/assets/projects/grengame-cover-600w.webp`
- `src/assets/projects/grengame-cover-800w.avif`
- `src/assets/projects/grengame-cover-grid-1000w.avif`
- `src/assets/projects/grengame-cover-grid-1000w.webp`
- `src/assets/projects/grengame-cover-grid-1600w.avif`
- `src/assets/projects/grengame-cover-grid-1600w.webp`
- `src/assets/projects/grengame-cover-grid-400w.avif`
- `src/assets/projects/grengame-cover-grid-400w.webp`
- `src/assets/projects/grengame-cover-grid-800w.avif`
- `src/assets/projects/grengame-cover-grid-800w.webp`
- `src/assets/projects/grengame-preview-poster.avif`
- `src/assets/projects/grengame-preview-poster.webp`
- `src/assets/projects/martha-izabel-cover-1200w.avif`
- `src/assets/projects/martha-izabel-cover-1200w.webp`
- `src/assets/projects/martha-izabel-cover-1600w.avif`
- `src/assets/projects/martha-izabel-cover-1600w.webp`
- `src/assets/projects/martha-izabel-cover-400w.avif`
- `src/assets/projects/martha-izabel-cover-600w.avif`
- `src/assets/projects/martha-izabel-cover-600w.webp`
- `src/assets/projects/martha-izabel-cover-800w.avif`
- `src/assets/projects/martha-izabel-cover-grid-1200w.avif`
- `src/assets/projects/martha-izabel-cover-grid-1200w.webp`
- `src/assets/projects/martha-izabel-cover-grid-400w.avif`
- `src/assets/projects/martha-izabel-cover-grid-400w.webp`
- `src/assets/projects/martha-izabel-cover-grid-600w.avif`
- `src/assets/projects/martha-izabel-cover-grid-600w.webp`
- `src/assets/projects/martha-izabel-cover-grid-800w.avif`
- `src/assets/projects/martha-izabel-cover-grid-800w.webp`
- `src/assets/projects/martha-izabel-preview-poster.avif`
- `src/assets/projects/martha-izabel-preview-poster.webp`
- `src/assets/testimonials/alecsandra-klatt-martins-128w.avif`
- `src/assets/testimonials/alecsandra-klatt-martins-128w.webp`
- `src/assets/testimonials/alecsandra-klatt-martins-192w.avif`
- `src/assets/testimonials/alecsandra-klatt-martins-192w.webp`
- `src/assets/testimonials/alecsandra-klatt-martins-96w.avif`
- `src/assets/testimonials/bruna-vizzotto-128w.avif`
- `src/assets/testimonials/bruna-vizzotto-128w.webp`
- `src/assets/testimonials/bruna-vizzotto-192w.avif`
- `src/assets/testimonials/bruna-vizzotto-192w.webp`
- `src/assets/testimonials/bruna-vizzotto-96w.avif`
- `src/assets/testimonials/leonardo-alvarez-pereira-gomes-128w.avif`
- `src/assets/testimonials/leonardo-alvarez-pereira-gomes-128w.webp`
- `src/assets/testimonials/leonardo-alvarez-pereira-gomes-192w.avif`
- `src/assets/testimonials/leonardo-alvarez-pereira-gomes-192w.webp`
- `src/assets/testimonials/leonardo-alvarez-pereira-gomes-96w.avif`
- `src/assets/testimonials/martha-izabel-128w.avif`
- `src/assets/testimonials/martha-izabel-128w.webp`
- `src/assets/testimonials/martha-izabel-192w.avif`
- `src/assets/testimonials/martha-izabel-192w.webp`
- `src/assets/testimonials/martha-izabel-96w.avif`
- `src/assets/testimonials/tainara-conrad-bassani-128w.avif`
- `src/assets/testimonials/tainara-conrad-bassani-128w.webp`
- `src/assets/testimonials/tainara-conrad-bassani-192w.avif`
- `src/assets/testimonials/tainara-conrad-bassani-192w.webp`
- `src/assets/testimonials/tainara-conrad-bassani-96w.avif`
- `src/assets/testimonials/workplaces/alecsandra-klatt-martins-workplace.avif`
- `src/assets/testimonials/workplaces/alecsandra-klatt-martins-workplace.jpg`
- `src/assets/testimonials/workplaces/bruna-vizzotto-workplace.avif`
- `src/assets/testimonials/workplaces/bruna-vizzotto-workplace.jpg`
- `src/assets/testimonials/workplaces/leonardo-alvarez-pereira-gomes-workplace.avif`
- `src/assets/testimonials/workplaces/leonardo-alvarez-pereira-gomes-workplace.jpg`
- `src/assets/testimonials/workplaces/martha-izabel-workplace.avif`
- `src/assets/testimonials/workplaces/martha-izabel-workplace.jpg`
- `src/assets/testimonials/workplaces/tainara-conrad-bassani-workplace.avif`
- `src/assets/testimonials/workplaces/tainara-conrad-bassani-workplace.jpg`
- `src/components/DevelopmentPrinciple.tsx`
- `src/components/DevelopmentPrinciplesMarquee.tsx`
- `src/components/GuiferWordmark.tsx`
- `src/components/ImageCover.tsx`
- `src/components/LanguageToggle.tsx`
- `src/components/ProjectInteractionHint.tsx`
- `src/components/TechnologyBadge.tsx`
- `src/components/TestimonialAuthorDetails.tsx`
- `src/components/TestimonialPixelImage.tsx`
- `src/components/TestimonialQuoteText.tsx`
- `src/components/VerticalSwap.tsx`
- `src/components/hero/HeroBackdrop.tsx`
- `src/components/hero/HeroStats.tsx`
- `src/components/hero/ProofBar.tsx`
- `src/components/hero/github-commit-state.ts`
- `src/components/icons/Brand.tsx`
- `src/components/layout/AccessibilityWidget.tsx`
- `src/components/layout/BackToTop.tsx`
- `src/components/layout/CustomCursor.tsx`
- `src/components/layout/DeferredCustomCursor.tsx`
- `src/components/layout/DocumentMetadata.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/Header.tsx`
- `src/components/layout/MomentumScroll.tsx`
- `src/components/layout/PagePreparation.tsx`
- `src/components/layout/WebsiteCarbonBadge.tsx`
- `src/components/privacy/DeferredPrivacyNoticeDialog.tsx`
- `src/components/privacy/PrivacyNoticeDialog.tsx`
- `src/components/project-case/CaseContactPrompt.tsx`
- `src/components/project-case/CaseNextSteps.tsx`
- `src/components/project-case/CaseTemplate.tsx`
- `src/components/project-case/GrengameCaseStudy.tsx`
- `src/components/sections/About.tsx`
- `src/components/sections/AboutAlbum.tsx`
- `src/components/sections/Contact.tsx`
- `src/components/sections/ContactFaq.tsx`
- `src/components/sections/Hero.tsx`
- `src/components/sections/NextSteps.tsx`
- `src/components/sections/Projects.tsx`
- `src/components/sections/SectionShell.tsx`
- `src/components/sections/Skills.tsx`
- `src/components/sections/Testimonials.tsx`
- `src/components/sections/Timeline.tsx`
- `src/components/sections/WhyHire.tsx`
- `src/components/timeline/MobileTimelineCarousel.tsx`
- `src/components/ui/dialog.tsx`
- `src/content/about-album.ts`
- `src/content/linkedin-recommendations.ts`
- `src/content/project-summaries.ts`
- `src/hooks/use-element-activity.ts`
- `src/hooks/use-mobile.tsx`
- `src/i18n/AppContext.tsx`
- `src/i18n/dictionary.ts`
- `src/lib/page-readiness.ts`
- `src/lib/preferences.ts`
- `src/pages/AccessibilityPage.tsx`
- `src/pages/PrivacyPage.tsx`
- `src/routes/__root.tsx`
- `src/routes/index.tsx`
- `src/routes/sobre.tsx`
- `src/styles.css`

</details>

### C4 — fix(carbono): aguarda o preparo da página antes de medir

Substitui networkidle pela prontidão explícita da página, preserva limites e contabilização e acrescenta testes com transferência contínua e loader pendente.

Depende das flags de preparo introduzidas em C3. A correção do medidor é independente da redução de bytes da interface e merece histórico próprio.

<details>
<summary>Arquivos exatos (3)</summary>

- `scripts/carbon-page-readiness.mjs`
- `scripts/carbon-page-readiness.test.mjs`
- `scripts/verify-carbon-budget.mjs`

</details>

### C5 — chore(editor): configura Tailwind e amplia a checagem de tipos

Associa styles.css ao modo Tailwind no VS Code, recomenda as extensões e inclui os arquivos E2E no typecheck.

Os callbacks tipados e as opções corretas de Playwright já acompanham seus testes em C3; esta etapa passa a verificá-los pelo comando oficial. A validação CSS permanece ativa.

<details>
<summary>Arquivos exatos (3)</summary>

- `.vscode/extensions.json`
- `.vscode/settings.json`
- `tsconfig.json`

</details>

## Vídeo do Hero — bloqueador resolvido

`src/assets/hero/hero-background.mp4` foi reduzido de 169200241 para 16995293 bytes (17,0 MB; 16,2 MiB), abaixo dos limites de Git e Cloudflare Pages. Original preservado em `tmp/media-originals/hero-background.original.mp4`, ignorado pelo Git. Mantidos conteúdo, proporção e duração; saída H.264 720p/30fps, sem áudio e com faststart.

Autorizado pelo pedido posterior de correção do vídeo. Reprodução real, seek e pausa passam no Chromium; suíte de mídia 19/19 e carbono oficial aprovados. A versão otimizada permanece em C3. A proposta de commits foi aprovada em 2026-11-18.

## Fora dos commits propostos

### Estado local e cópias de segurança (25)

Backups, execuções de workflow, registro local de instalação e lock permanecem no disco. Não versionar logs nem cópias integrais da árvore como parte da feature. Propor exclusões locais específicas no fluxo aprovado, sem apagar o conteúdo.

<details>
<summary>Caminhos locais</summary>

- `.specify/.workflow-install.lock`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/.specify/memory/brand-guidelines.md`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/README.md`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/specs/003-home-responsive-baseline/spec.md`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/specs/003-home-responsive-baseline/tasks.md`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/src/assets/about/about-panel-portrait-640w.avif`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/src/assets/about/about-panel-portrait-640w.webp`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/src/components/hero/HeroStats.tsx`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/src/components/sections/About.tsx`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/src/components/sections/AboutStatsCarousel.tsx`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/src/i18n/dictionary.ts`
- `.specify/backups/about-2026-10-15-before-horizontal-stats/src/styles.css`
- `.specify/workflows/runs/56864a6e/inputs.json`
- `.specify/workflows/runs/56864a6e/log.jsonl`
- `.specify/workflows/runs/56864a6e/state.json`
- `.specify/workflows/runs/56864a6e/workflow.yml`
- `.specify/workflows/runs/71508687/inputs.json`
- `.specify/workflows/runs/71508687/log.jsonl`
- `.specify/workflows/runs/71508687/state.json`
- `.specify/workflows/runs/71508687/workflow.yml`
- `.specify/workflows/runs/d3650e2b/inputs.json`
- `.specify/workflows/runs/d3650e2b/log.jsonl`
- `.specify/workflows/runs/d3650e2b/state.json`
- `.specify/workflows/runs/d3650e2b/workflow.yml`
- `.specify/workflows/workflow-registry.json`

</details>

### Arquivos sem diff de conteúdo (46)

O status marca estes arquivos, mas `git diff` não apresenta mudança de conteúdo. Não criar commits de API, segurança ou deploy baseados apenas nesses marcadores. Reavaliar os marcadores após aplicar os caminhos aprovados e a política LF; não reverter arquivos para limpar status.

<details>
<summary>Caminhos sem diff de conteúdo</summary>

- `.github/dependabot.yml`
- `.github/workflows/keep-alive.yml`
- `config/client-env.ts`
- `config/environment-error.ts`
- `docs/deployment/CLOUDFLARE-PAGES-RENDER.md`
- `docs/deployment/RELEASE-ROLLBACK.md`
- `e2e/route-matrix.spec.ts`
- `public/preferences-init.js`
- `public/site.webmanifest`
- `render.yaml`
- `scripts/generate-app-icons.mjs`
- `scripts/generate-social-images.mjs`
- `scripts/generate-static-route-heads.mjs`
- `scripts/github-operations-issues.mjs`
- `scripts/github-operations-issues.test.mjs`
- `scripts/verify-production-security.mjs`
- `scripts/verify-render-ip-spoofing.mjs`
- `scripts/verify-static-route-heads.mjs`
- `server/app.test.ts`
- `server/app.ts`
- `server/env.test.ts`
- `server/env.ts`
- `server/index.ts`
- `server/release.ts`
- `server/request-context.ts`
- `server/services/coffee.test.ts`
- `server/services/coffee.ts`
- `server/services/github.test.ts`
- `server/services/github.ts`
- `server/services/health.test.ts`
- `server/services/health.ts`
- `server/test-support/environment.ts`
- `src/integrations/supabase/client.server.ts`
- `src/lib/api-client.ts`
- `src/lib/contact-email.server.ts`
- `src/lib/contact-handler.server.ts`
- `src/lib/contact-rate-limit.server.ts`
- `src/lib/contact-recaptcha.server.ts`
- `src/lib/external-contracts.server.test.ts`
- `src/lib/recaptcha.ts`
- `src/lib/seo.ts`
- `src/lib/theme.tsx`
- `src/main.tsx`
- `src/routes/acessibilidade.tsx`
- `src/routes/privacidade.tsx`
- `src/routes/projetos.$slug.tsx`

</details>

### Material sem consumo na interface atual (39)

Reservado para revisão, preservado no disco. Os componentes/export não têm importadores atuais; o retrato antigo é usado apenas pelo módulo sem consumidor, e as variantes do mosaico e do painel não aparecem em imports atuais. A foto original do retrato e as quatro fotos originais do mosaico permanecem em C3 por serem entradas do gerador responsivo; suas variantes derivadas sem uso ficam reservadas. A exclusão deste grupo não autoriza apagar o material. Novas referências antes do staging exigem atualizar o inventário.

<details>
<summary>Caminhos reservados</summary>

- `src/assets/about/about-mosaic-campus-240w.avif`
- `src/assets/about/about-mosaic-campus-240w.webp`
- `src/assets/about/about-mosaic-campus-400w.avif`
- `src/assets/about/about-mosaic-campus-400w.webp`
- `src/assets/about/about-mosaic-campus-640w.avif`
- `src/assets/about/about-mosaic-campus-640w.webp`
- `src/assets/about/about-mosaic-cat-240w.avif`
- `src/assets/about/about-mosaic-cat-240w.webp`
- `src/assets/about/about-mosaic-cat-400w.avif`
- `src/assets/about/about-mosaic-cat-400w.webp`
- `src/assets/about/about-mosaic-cat-640w.avif`
- `src/assets/about/about-mosaic-cat-640w.webp`
- `src/assets/about/about-mosaic-classroom-240w.avif`
- `src/assets/about/about-mosaic-classroom-240w.webp`
- `src/assets/about/about-mosaic-classroom-400w.avif`
- `src/assets/about/about-mosaic-classroom-400w.webp`
- `src/assets/about/about-mosaic-classroom-640w.avif`
- `src/assets/about/about-mosaic-classroom-640w.webp`
- `src/assets/about/about-mosaic-kit-240w.avif`
- `src/assets/about/about-mosaic-kit-240w.webp`
- `src/assets/about/about-mosaic-kit-400w.avif`
- `src/assets/about/about-mosaic-kit-400w.webp`
- `src/assets/about/about-mosaic-kit-640w.avif`
- `src/assets/about/about-mosaic-kit-640w.webp`
- `src/assets/about/about-panel-portrait-640w.avif`
- `src/assets/about/about-panel-portrait-640w.webp`
- `src/assets/hero/guilherme-speaking-1200w.avif`
- `src/assets/hero/guilherme-speaking-1200w.webp`
- `src/assets/hero/guilherme-speaking-480w.avif`
- `src/assets/hero/guilherme-speaking-480w.webp`
- `src/assets/hero/guilherme-speaking-800w.avif`
- `src/assets/hero/guilherme-speaking-800w.webp`
- `src/assets/hero/guilherme-speaking-960w.avif`
- `src/assets/hero/guilherme-speaking-960w.webp`
- `src/components/DynamicContrast.tsx`
- `src/components/ServicesIllustration.tsx`
- `src/components/sections/AboutStatsDisplay.tsx`
- `src/components/sections/AboutTechStack.tsx`
- `src/content/hero-image.ts`

</details>
