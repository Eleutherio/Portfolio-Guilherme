# Contexto Operacional do Projeto

Este documento é a referência canônica do Spec Kit para fatos técnicos mutáveis, comandos de
validação e limites operacionais do projeto. A constituição prevalece em caso de conflito.

## Stack e implantação

- Gerenciador de pacotes: npm.
- Linguagem: TypeScript em modo estrito, com módulos ESM.
- Frontend: SPA React 19 construída com Vite 8, TanStack Router e Tailwind CSS 4.
- Artefato estático do frontend: `dist/client`.
- Hospedagem do frontend: Cloudflare Pages.
- API: serviço Node separado baseado em `node:http`.
- Entrada da API: `server/index.ts`.
- Bundle da API: `dist-api/server.js`.
- Hospedagem da API: Render.

## Fronteiras de segurança e dados

- O backend acessa o Supabase com `SUPABASE_SERVICE_ROLE_KEY`. O cliente administrativo ignora RLS,
  não pode ser importado pelo frontend e sua credencial não pode aparecer em variáveis `VITE_*`.
- O acesso de `anon` e `authenticated` à escrita em `coffee_taps` e às RPCs operacionais está
  revogado. Persistência e rate limits passam pela API com `service_role`.
- O formulário de contato não persiste mensagens no banco. A API valida e limita a entrada, aplica
  honeypot, rate limit e reCAPTCHA v3 e envia a mensagem por Brevo SMTP.
- O rate limit transforma o endereço do cliente em HMAC-SHA-256 antes da persistência.
- No Render, somente um `CF-Connecting-IP` válido e sobrescrito pela borda Cloudflare define o
  bucket. Ausência ou invalidade desse valor falha fechado.
- A rotina diária do Supabase remove hashes de rate limit após 7 dias, anonimiza identificadores do
  contador de cafés após 30 dias e remove registros de execução após 90 dias.

## Artefatos gerados

- `src/routeTree.gen.ts` é gerado pelo plugin do TanStack Router e não deve ser editado manualmente.

## Identidade visual

- A referência canônica descritiva de marca é `.specify/memory/brand-guidelines.md`.
- `src/styles.css` é a fonte executável de fontes, cores, raios, sombras, layout e movimento.
- Mudanças de identidade devem ser registradas na feature ativa do Spec Kit antes da implementação;
  o guia deve ser atualizado no mesmo escopo para não divergir do produto renderizado.

## Comandos oficiais de validação

- Ciclo Spec Kit completo:
  `specify workflow run portfolio-sdd --input spec="<descrição da mudança>"`.

- Lint: `npm run lint`.
- Typecheck: `npm run typecheck`.
- Testes da API: `npm run test:api`.
- Build: `npm run build`.
- Acessibilidade e browser: `npm run test:a11y`.
- Orçamento de carbono: `npm run carbon:check`.

O workflow oficial executa esses comandos como gates finais separados. Qualquer código de saída
diferente de zero interrompe o fluxo.

## Sustentabilidade

- Metodologia vigente: Digital Carbon Rating baseado no SWDM v4.
- Limite A+: no máximo 272,51 kB transferidos durante carga fria e rolagem sem interação explícita.
- Meta interna: 250 kB, para absorver variações de medição.
- Por pedido explícito de 2026-11-11, a Home prepara seções/imagens/vídeos antes de liberar o loader
  e solicita autoplay mudo do Hero em todos os dispositivos após a revelação. Isso substitui a
  política anterior de mídia somente por intenção, sem alterar os limites numéricos acima;
  conformidade com orçamento/carbono permanece pendente de avaliação consolidada, sem afirmação A+.
- `npm run carbon:check` deve rodar sobre o conjunto final imediatamente antes de staging ou commit.
- O resultado público pós-deploy complementa, mas não substitui, o gate local.

Em 2026-11-18 o usuário substituiu a política de preload integral/autoplay por posters e
vídeos somente após play explícito. Widget/cursor/diálogo/scroll suave carregam sob demanda;
preferências prévias de acessibilidade continuam restauradas. A decisão anterior de 2026-11-11
fica substituída. O limite 272510 bytes e a meta 250000 bytes permanecem.

Pedido posterior de 2026-11-18 autoriza hover real do mouse nos Projetos como intenção de play
desktop. Sair/trocar card pausa; foco, scroll e eventos sintéticos não iniciam mídia. Mobile e
movimento reduzido mantêm controle explícito; Hero mantém play explícito.

O limite só pode mudar quando a metodologia oficial mudar. A alteração deve registrar fonte,
impacto e decisão nos artefatos do Spec Kit; o orçamento não pode ser aumentado, desativado ou
contornado silenciosamente.

### Origem do gate

Em 2026-08-23, a home regrediu de A para C após a introdução de previews em vídeo. A reprodução
mediu 534.776 bytes na carga fria e 1.718.649 bytes com Cases em foco; 1.171.135 bytes pertenciam ao
preview do GrenGame.

Revisar este contexto quando o Website Carbon ou o Digital Carbon Rating substituir o SWDM v4,
alterar os limites A+ ou disponibilizar uma API oficial estável capaz de validar diretamente um
build ainda não publicado.

## Gate local antes de commits

- Ativar/reinstalar no checkout: `npm run hooks:install` (core.hooksPath local `.githooks`).
  O instalador preserva hooks customizados existentes e solicita integração manual em conflito.
- Preparação antes de staging: `npm run commit:check`; inclui lint, typecheck, testes API,
  testes do gate, builds, E2E completo e carbono. Falha interrompe o fluxo; carbono deve passar
  sobre o conjunto final imediatamente antes de staging, conforme a constituição.
- `git commit` executa automaticamente `.githooks/pre-commit`: todos os E2E rodam sobre cópia
  temporária do índice Git. Mudanças não preparadas são preservadas. Preparar os manifestos
  compatíveis com a instalação (`npm ci`) antes de commitar.
- O runner usa porta própria e servidor novo, proíbe testes `.only` e atualização de snapshots,
  e bloqueia erros/sinais/mudança concorrente do índice. Falhas mantêm relatórios em
  `tmp/commit-e2e-*`; nenhum commit é criado pelo instalador ou pelos testes do hook.
- Browsers necessários: `npx playwright install chromium webkit`. Diagnóstico do mecanismo:
  `npm run test:commit-gate`. Artefatos locais `tmp/` são ignorados por Git/lint/Prettier.
- Hooks são proteção local: Git permite desativá-los com `--no-verify` ou mudar hooksPath.
  A CI continua sendo o gate compartilhado; não usar bypass para apresentar falhas como sucesso.
