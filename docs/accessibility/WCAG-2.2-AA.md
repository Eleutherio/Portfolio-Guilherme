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
| ESLint | Última rodada consolidada aprovada em 24/08/2026 | Sem erros |
| TypeScript (`tsc --noEmit`) | Última rodada consolidada aprovada em 24/08/2026 | Sem erros |
| Build de produção | Última rodada consolidada aprovada em 24/08/2026 | Build concluído |
| Playwright + axe-core WCAG A/AA | Última rodada consolidada: 128/128 | Zero violações automáticas fora das exceções manuais conhecidas |
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

## Matriz de avaliação manual

- Português e inglês; temas claro e escuro.
- Viewports de 320, 375, 500, 768, 1024 e 1440 px; retrato e paisagem.
- Zoom real de 200%, regras de espaçamento textual e Windows Forced Colors.
- Menu mobile, carrossel de projetos, timeline, formulário e mensagens de erro/sucesso.
- Widget fechado, aberto, quatro perfis, controles individuais, persistência e reset.
- reCAPTCHA indisponível e respostas 422, 429 e 500.
- PDF: título, idioma, tags, headings, ordem de leitura, links e textos alternativos.

## Declaração

A declaração WCAG 2.2 nível AA somente substituirá esta seção quando todos os critérios A e AA aplicáveis estiverem aprovados em todas as páginas, processos e variações responsivas do escopo, e os itens `A11Y-*` correspondentes tiverem saído do backlog para o histórico.
