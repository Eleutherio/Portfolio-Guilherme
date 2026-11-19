# Quickstart: validar o Hero e o Cabeçalho

## Pré-requisitos

- Dependências instaladas com `npm install`.
- Feature ativa apontando para `specs/002-hero-header-baseline`.
- Browsers do Playwright disponíveis.

## 1. Verificação estrutural direcionada

```powershell
npx playwright test e2e/hero-header.spec.ts e2e/hero-stats.spec.ts e2e/responsive-media.spec.ts --project=chromium
```

Resultado esperado:

- Hero contém apenas copy e controle da mídia, sem commits ou sociais;
- Header inicia recolhido e cumpre hover, foco, toque, scroll, clique externo e Escape;
- vídeo não faz request antes de input real, inicia após teclado/hover/pointer/toque/wheel, inclusive
  por hover no cabeçalho, e respeita movimento reduzido;
- contador do GitHub cobre carregamento, zero e indisponibilidade no rodapé.

## 2. Responsividade, acessibilidade e aparência

```powershell
npx playwright test e2e/responsiveness.spec.ts e2e/responsive-inputs.spec.ts e2e/brand.spec.ts e2e/visual-regression.spec.ts --project=chromium
```

Confirmar a matriz representativa 320/PT/escuro, 412/EN/claro, 768/PT/claro, 1024/EN/escuro e
1440/EN/claro. Inspecionar os snapshots de 320 e 1440 para copy, faixa, aresta direita, alinhamento,
CTA e ausência de colisões.

## 3. Smoke cross-browser

```powershell
npx playwright test e2e/cross-browser.spec.ts --project=webkit-smoke
```

O smoke comprova estrutura no WebKit; não substitui inspeção em hardware Apple real.

## 4. Gates finais do repositório

```powershell
npm run lint
npm run typecheck
npm run test:api
npm run build
npm run test:a11y
npm run carbon:check
```

Resultado esperado: todos encerram com código `0`; o carbono relata no máximo 272,51 kB, idealmente
até 250 kB, e nenhuma requisição ou reprodução de mídia antes de input confiável. A baseline global
de lint deve permanecer verde, incluindo as regras de código não utilizado.

## Inspeção manual obrigatória

1. Abrir a Home sem interagir e confirmar que o poster usa o frame preto inicial do próprio vídeo em
   `0,0 s`, antes do aparecimento da cena do notebook, e mantém a faixa legível e o Header recolhido
   sem transição perceptível para o início do MP4 em 1440 px.
2. Reabrir a Home e testar separadamente teclado, pointer/toque e wheel como primeira interação;
   confirmar que o vídeo inicia sem um clique dedicado.
3. Percorrer frames claros/escuros e confirmar legibilidade constante; pausar e retomar pelo controle.
4. Navegar por Tab, Shift+Tab e Escape sem perder foco ou deixar controles intermediários visíveis.
5. Repetir com movimento reduzido: interações genéricas mantêm o poster, e somente o controle
   acessível “Reproduzir vídeo” inicia a mídia; depois, pausar/retomar permanece disponível.
6. Confirmar que somente a marca leva à Home e que “Vamos conversar” leva ao contato.
