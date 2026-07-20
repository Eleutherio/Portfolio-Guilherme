# Avaliação de conformidade WCAG 2.2 AA

**Status:** em andamento — este documento ainda não constitui declaração de conformidade.

**Início da avaliação:** 20 de julho de 2026

**Referencial:** [Web Content Accessibility Guidelines 2.2](https://www.w3.org/TR/WCAG22/) e [WCAG-EM](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/)

## Escopo

- `https://guifer.tech/`
- `https://guifer.tech/sobre`
- `https://guifer.tech/projetos/grengame`
- `https://guifer.tech/projetos/abriu-chaveiro`
- `https://guifer.tech/projetos/martha-izabel`
- `https://guifer.tech/acessibilidade`
- `https://guifer.tech/curriculo.pdf`
- Processo completo de envio do formulário de contato

Os endpoints de API e o sitemap não são páginas de conteúdo e não fazem parte da declaração.

## Tecnologias e suporte esperado

- HTML, CSS, JavaScript, React e WAI-ARIA.
- Chrome, Edge e Firefox atuais em Windows.
- Safari atual em iOS e Chrome atual em Android.
- NVDA com Chrome e Firefox/Edge; TalkBack ou VoiceOver em dispositivo real.
- `accessible-web-widget` 1.5.3 como recurso complementar, sem dependência para satisfazer critérios WCAG.

## Evidências automatizadas

| Verificação | Estado | Critério de aceite |
| --- | --- | --- |
| ESLint | Aprovado em 20/07/2026 | Sem erros |
| TypeScript (`tsc --noEmit`) | Aprovado em 20/07/2026 | Sem erros |
| Build de produção | Aprovado em 20/07/2026 | Build concluído; avisos não relacionados permanecem documentados |
| Playwright + axe-core WCAG A/AA | 79/79 aprovados | Zero violações e zero `incomplete` inesperados |
| Reflow 320–1440 px | Aprovado na home | Sem overflow bidirecional indevido nas seis larguras testadas |
| Forced Colors emulado | Aprovado | Estrutura e nomes acessíveis preservados; teste manual permanece obrigatório |
| ASES por URI publicada | Bloqueado até preview | Zero erros; alertas justificados |

Os relatórios brutos, traces e screenshots ficam em diretórios ignorados pelo Git.

### Cobertura automatizada registrada

- 56 combinações de sete rotas, português/inglês, claro/escuro e desktop/mobile.
- Menu mobile, timeline, carrossel, widget aberto, persistência, reset e quatro perfis.
- Validação client-side e estados de sucesso, 422, 429, 500 e reCAPTCHA indisponível do formulário.
- Reflow em 320, 375, 500, 768, 1024 e 1440 px, Forced Colors emulado e espaçamento textual.
- O gate falha para qualquer `incomplete` axe não revisado. Resultados de `color-contrast` causados por gradientes, pseudo-elementos ou sobreposições continuam separados para decisão manual.

Os estados HTTP do formulário são simulados no navegador para validar a interface acessível. Isso não substitui testes de integração com Brevo, Google reCAPTCHA e Supabase em preview autorizado.

## Matriz manual WCAG 2.2 A e AA

| Grupo | Testes | Estado |
| --- | --- | --- |
| 1.1–1.3 Perceptível | Alternativas textuais, estrutura, relações e ordem de leitura | Pendente |
| 1.4 Distinguível | Contraste, zoom 200%, reflow, espaçamento e hover/foco | Pendente |
| 2.1 Operável por teclado | Tab, Shift+Tab, Enter, Espaço, Escape e setas | Pendente |
| 2.2–2.3 Tempo e movimento | Sem autoplay; redução de movimento e flashes | Pendente |
| 2.4 Navegável | Títulos, landmarks, skip link e foco não encoberto | Pendente |
| 2.5 Modalidades de entrada | Gestos alternativos, cancelamento e alvos de 24 px | Pendente |
| 3.1–3.2 Compreensível | Idioma, consistência e comportamento previsível | Pendente |
| 3.3 Assistência de entrada | Labels, erros, sugestões e reenvio do formulário | Pendente |
| 4.1 Robusto | Nome, função, valor e mensagens de status | Pendente |

## Estados obrigatórios

- Português e inglês; temas claro e escuro.
- Viewports de 320, 375, 500, 768, 1024 e 1440 px; retrato e paisagem.
- Zoom real de 200%, regras de espaçamento textual e Windows Forced Colors.
- Menu mobile, carrossel de projetos, timeline, formulário e mensagens de erro/sucesso.
- Widget fechado, aberto, quatro perfis, controles individuais, persistência e reset.
- reCAPTCHA indisponível e respostas 422, 429 e 500.
- PDF: título, idioma, tags, headings, ordem de leitura, links e textos alternativos.

## Bloqueadores da declaração

- Execução do ASES contra uma URL publicada ou preview autorizado.
- Testes com NVDA e pelo menos um leitor de tela mobile em dispositivo real.
- Teste manual de zoom real de 200% e orientação.
- Validação assistiva da ordem de leitura, headings, links e alternativas do currículo PDF; a estrutura marcada, idioma e metadados já foram detectados.
- Revisão manual dos resultados `color-contrast` inconclusivos do axe.
- Teste de integração real dos estados do contato em preview autorizado.

## Declaração

A declaração WCAG 2.2 nível AA somente substituirá esta seção quando todos os critérios A e AA aplicáveis estiverem aprovados em todas as páginas, processos e variações responsivas do escopo.
