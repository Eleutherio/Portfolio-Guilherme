# Quickstart: Baseline Responsivo da Home

## Pré-requisitos

- Node e npm compatíveis com o lockfile do repositório.
- Dependências já instaladas com `npm install` ou `npm ci` conforme o ambiente.
- Feature ativa: `003-home-responsive-baseline` em `.specify/feature.json`.

Não instalar dependência adicional para esta feature.

## Executar localmente

```powershell
npm run dev
```

Abrir `http://localhost:5173/` e confirmar a ordem:

```text
Hero → Sobre → Projetos → Habilidades → Depoimentos → Contato
```

## Inspeção funcional direcionada

1. Abrir `/#habilidades` e confirmar carregamento adiado, scroll e foco no heading.
2. Em cada grupo, acionar capacidades por hover, Tab/Enter e toque/clique.
3. Confirmar que o popover mostra a mesma explicação nos três modos.
4. Confirmar duas a quatro relações, sem transformar tecnologias em botões.
5. Pressionar Escape e verificar que o popover fecha sem deslocar o foco.
6. Alternar PT/EN, claro/escuro e movimento reduzido.
7. Repetir em 320×568, 412×915, 768×1024, 1023×600, 1440×900 e 1920×1080.

## Validação rápida durante implementação

Executar primeiro os arquivos diretamente afetados:

```powershell
npx playwright test e2e/dynamic-content.spec.ts e2e/responsiveness.spec.ts e2e/responsive-inventory.spec.ts e2e/contrast.spec.ts
```

Também executar:

```powershell
npm run lint
npm run typecheck
```

Inspeção renderizada deve ser registrada separadamente dos resultados automatizados; screenshot
isolado não comprova foco, semântica ou contraste.

## Finalização consolidada

```powershell
npm run lint
npm run typecheck
npm run test:api
npm run test:a11y
npm run build
npm run carbon:check
```

`npm run carbon:check` deve usar o conjunto final e ocorrer imediatamente antes do primeiro staging
ou commit. Qualquer comando com saída diferente de zero bloqueia a conclusão.

## Evidência mínima esperada

- resultados verdes dos gates aplicáveis;
- inspeção desktop e mobile dos estados padrão e ativo;
- PT e EN em ambos os temas;
- teclado, toque e hover;
- `prefers-reduced-motion: reduce`;
- nenhum overflow entre 320 e 1920 px;
- orçamento de carbono A+ comprovado.
