# Avaliação de conformidade WCAG 2.2 AA

**Status:** em andamento — este documento ainda não constitui declaração de conformidade.

**Início da avaliação:** 20 de julho de 2026

**Referencial:** [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) e [WCAG-EM](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/)

> Este arquivo define escopo, método e condição de declaração. Tarefas, prioridades e validações abertas ficam exclusivamente em `.agente/backlog.md`.

## Escopo

- `https://guifer.tech/`
- `https://guifer.tech/sobre`
- `https://guifer.tech/projetos/grengame`
- `https://guifer.tech/projetos/abriu-chaveiro`
- `https://guifer.tech/projetos/martha-izabel`
- `https://guifer.tech/acessibilidade`
- `https://guifer.tech/privacidade`
- Processo completo de envio do formulário de contato

Os endpoints de API, o sitemap e os documentos disponibilizados para download não fazem parte da declaração. O currículo em PDF permanece identificado como documento separado e sua acessibilidade é acompanhada como melhoria independente, sem bloquear a avaliação das páginas HTML.

## Tecnologias e suporte esperado

- HTML, CSS, JavaScript, React e WAI-ARIA.
- Chrome, Edge e Firefox atuais em Windows.
- Safari atual em iOS e Chrome atual em Android.
- NVDA com Chrome e Firefox/Edge; TalkBack ou VoiceOver em dispositivo real.
- `accessible-web-widget` 1.5.3 como recurso complementar, sem dependência para satisfazer critérios WCAG.

## Evidências automatizadas

| Verificação | Estado | Critério de aceite |
| --- | --- | --- |
| ESLint | Última rodada consolidada aprovada em 24/08/2026 | Sem erros |
| TypeScript (`tsc --noEmit`) | Última rodada consolidada aprovada em 24/08/2026 | Sem erros |
| Build de produção | Última rodada consolidada aprovada em 24/08/2026 | Build concluído |
| Playwright + axe-core WCAG A/AA | Última rodada consolidada em 24/08/2026: 131/131 | Zero violações automáticas fora das exceções manuais conhecidas |
| Reflow 320–1440 px | Aprovado na home | Sem overflow bidirecional indevido nas seis larguras testadas |
| Forced Colors emulado | Aprovado | Estrutura e nomes acessíveis preservados; teste manual permanece obrigatório |

Os relatórios brutos, traces e screenshots ficam em diretórios ignorados pelo Git.

### Cobertura automatizada registrada

- Matriz de rotas em português/inglês, claro/escuro e desktop/mobile.
- Menu mobile, timeline, carrossel, widget aberto, persistência, reset e quatro perfis.
- Validação client-side e estados de sucesso, 422, 429, 500 e reCAPTCHA indisponível do formulário.
- Reflow em 320, 375, 500, 768, 1024 e 1440 px, Forced Colors emulado e espaçamento textual.
- O gate falha para qualquer `incomplete` axe não revisado. Resultados de `color-contrast` causados por gradientes, pseudo-elementos ou sobreposições continuam separados para decisão manual.

Os estados HTTP do formulário são simulados no navegador para validar a interface acessível. Isso não substitui testes de integração com Brevo, Google reCAPTCHA e Supabase em preview autorizado.

### Contraste de gradientes, sobreposições e estados — 24/08/2026

A verificação combinou Axe (`color-contrast`) nas oito rotas, nos temas claro e escuro, com cálculo manual pela luminância relativa definida na WCAG. O Axe não encontrou violações. Na home, os resultados inconclusivos ocorreram somente porque a ferramenta não determina fundos com gradiente; cada cor foi então comparada aos dois extremos e às superfícies intermediárias, adotando-se sempre a menor razão.

| Elemento ou estado | Tema claro | Tema escuro | Critério aplicado |
| --- | ---: | ---: | --- |
| Texto principal sobre superfícies | 14,39:1 | 13,49:1 | 4,5:1 |
| Texto secundário sobre superfícies | 4,84:1 | 6,76:1 | 4,5:1 |
| Texto em gradiente, pior extremo | 5,03:1 | 5,95:1 | 4,5:1 |
| Mensagens de erro do formulário | 5,01:1 | 6,17:1 | 4,5:1 |
| Mensagens de sucesso | 4,70:1 | 7,02:1 | 4,5:1 |
| Texto dos botões, pior extremo do gradiente | 5,68:1 | 7,16:1 | 4,5:1 |
| Limites visuais dos campos, pior superfície | 3,56:1 | 3,12:1 | 3:1 |
| Metadados dos depoimentos com 60% de opacidade | 6,21:1 | 4,66:1 | 4,5:1 |
| Texto secundário do rodapé | 7,10:1 | 8,13:1 | 4,5:1 |
| Caixa textual do cursor sobre o pior fundo possível | 6,02:1 | 6,02:1 | 4,5:1 |

A caixa do cursor é suplementar e fica fora da árvore de acessibilidade, mas também satisfaz contraste textual no pior caso, calculado sobre branco após a composição da transparência. O modal de privacidade usa superfície sólida; o escurecimento atrás dele é decorativo e não altera o contraste interno.

As animações de entrada e troca são transitórias: o conteúdo textual termina em opacidade total, não oferece estado persistente com contraste reduzido e permanece disponível após o movimento. Com `prefers-reduced-motion: reduce`, as animações CSS são removidas e os componentes de movimento apresentam diretamente o conteúdo final. Controles desabilitados estão cobertos pela exceção de componentes inativos do critério 1.4.3; conteúdo decorativo com opacidade reduzida não transmite informação por cor.

O teste direcionado `WCAG 2.2 AA — contraste manual dos gradientes` protege os pares de tokens textuais, extremos dos botões, limites dos controles, rodapé e transparência dos depoimentos contra regressões.

## Matriz de avaliação manual

- Português e inglês; temas claro e escuro.
- Viewports de 320, 375, 500, 768, 1024 e 1440 px; retrato e paisagem.
- Zoom real de 200%, regras de espaçamento textual e Windows Forced Colors.
- Menu mobile, carrossel de projetos, timeline, formulário e mensagens de erro/sucesso.
- Widget fechado, aberto, quatro perfis, controles individuais, persistência e reset.
- reCAPTCHA indisponível e respostas 422, 429 e 500.

### Evidências direcionadas da matriz manual — 24/08/2026

- **Teclado:** 16 combinações de oito rotas em desktop e mobile, com 488 paradas de foco, sem controles desabilitados alcançados nem ciclo de foco. Uma ocorrência dinâmica no rodapé foi repetida isoladamente e aprovada após a estabilização da rolagem suave.
- **NVDA 2026.1.1 + Chrome:** leitura real em Windows confirmou título da página, `h1`, landmarks, links de navegação, controles do carrossel, campos obrigatórios e multilinha, botões, currículo e controles dos depoimentos; 18 paradas amostradas mantiveram foco visível e sem aprisionamento.
- **Zoom real de 200%:** Chrome em Windows, com zoom do navegador aplicado por teclado e `devicePixelRatio` efetivo de 2,5 (escala do Windows de 1,25 × zoom 2), aprovou as oito rotas sem overflow horizontal e sem violações Axe.
- **Orientação e perfis móveis emulados:** WebKit com perfil iPhone 15 e Chromium com perfil Pixel 7, em retrato e paisagem, aprovaram 32/32 combinações de oito rotas após a estabilização das animações, sem overflow horizontal nem violações Axe.
- **Forced Colors:** a emulação do navegador permanece aprovada. A tentativa de aferição por Windows High Contrast real não foi aceita como evidência porque o navegador não expôs `forced-colors: active`; o estado do sistema foi restaurado após o ensaio.
- **ASES:** a ferramenta oficial foi alcançada e o formulário de avaliação foi conferido, mas a emissão do relatório exige resolução interativa do reCAPTCHA. Não foi produzido resultado automatizado equivalente.

As emulações de iPhone e Pixel verificam layout, orientação, semântica e motor de renderização, mas **não equivalem a hardware real nem executam VoiceOver ou TalkBack reais**. Permanecem abertos o relatório do ASES, NVDA com Firefox ou Edge, leitor de tela mobile e Windows High Contrast real; por isso o status continua “em andamento”. A rota inexistente integra somente os testes de robustez e não o escopo da futura declaração.

## Declaração

A declaração WCAG 2.2 nível AA somente substituirá esta seção quando todos os critérios A e AA aplicáveis estiverem aprovados em todas as páginas, processos e variações responsivas do escopo, e as pendências de acessibilidade correspondentes à interface tiverem saído do backlog para o histórico.
