# Deploy: Cloudflare Pages, Render e Supabase

## Arquitetura

- Frontend: SPA React estática no Cloudflare Pages, sem SSR e sem prerender.
- Backend: serviço Node no Render.
- Banco e rate limit persistente: Supabase.
- E-mail: Brevo SMTP pela porta `2525`.
- Proteção do formulário: Google reCAPTCHA v3.
- Keep-alive: script independente executado pelo GitHub Actions.

## Ordem recomendada

1. Preparar o Supabase e aplicar as migrations.
2. Verificar domínio/remetente e criar credencial SMTP no Brevo.
3. Criar as chaves do reCAPTCHA v3.
4. Criar e validar o backend no Render.
5. Criar o frontend no Cloudflare Pages.
6. Configurar domínio, origens e hostnames finais.
7. Configurar e testar o keep-alive no GitHub Actions.

Os controles de IP, headers, e-mail, rotação anual e SBOM estão detalhados em [SECURITY-OPERATIONS.md](./SECURITY-OPERATIONS.md).

## 1. Supabase

Crie um projeto Free e aplique, na ordem, todos os arquivos de `supabase/migrations/`. A última migration remove a gravação pública em `coffee_taps` e cria `app_healthcheck()`, acessível somente pelo backend com a service role.

Copie para o Render:

- `SUPABASE_URL`;
- `SUPABASE_SERVICE_ROLE_KEY`.

Nunca configure a service role no Cloudflare Pages ou em qualquer variável iniciada por `VITE_`.

## 2. Brevo

Autentique o domínio ou verifique o remetente usado em `CONTACT_EMAIL_FROM`. Gere uma chave SMTP, não uma API key comum.

No Render, configure:

- `BREVO_SMTP_HOST=smtp-relay.brevo.com`;
- `BREVO_SMTP_PORT=2525`;
- `BREVO_SMTP_USER`;
- `BREVO_SMTP_KEY`;
- `CONTACT_EMAIL_FROM`;
- `CONTACT_EMAIL_TO`.

A porta `2525` é necessária no plano Free do Render porque as portas SMTP `25`, `465` e `587` são bloqueadas.

## 3. reCAPTCHA

Crie uma chave reCAPTCHA v3 e autorize os hostnames de produção. Configure:

- Cloudflare Pages: `VITE_RECAPTCHA_SITE_KEY`;
- Render: `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_MIN_SCORE` e `RECAPTCHA_ALLOWED_HOSTNAMES`.

Inclua temporariamente o hostname `pages.dev` correspondente se o formulário precisar ser testado antes de o domínio final estar ativo. Não use curingas nas origens da API.

## 4. Render

Crie um Blueprint a partir do `render.yaml`. O deploy automático está desligado; cada publicação deve ser iniciada conscientemente no painel.

Além dos valores já declarados no Blueprint, preencha os campos marcados como secretos:

- `SUPABASE_URL`;
- `SUPABASE_SERVICE_ROLE_KEY`;
- `BREVO_SMTP_USER`;
- `BREVO_SMTP_KEY`;
- `CONTACT_EMAIL_FROM`;
- `CONTACT_EMAIL_TO`;
- `RECAPTCHA_SECRET_KEY`;
- `GITHUB_TOKEN`;
- `KEEP_ALIVE_SECRET`, com pelo menos 32 caracteres.

Revise `API_ALLOWED_ORIGINS`, `CONTACT_ALLOWED_ORIGINS` e `RECAPTCHA_ALLOWED_HOSTNAMES` quando os domínios finais forem conhecidos.

Mantenha `CLIENT_IP_SOURCE=render`. Esse valor fixa o primeiro IP válido de `X-Forwarded-For` como a única fonte do rate limit; não substitua por um header controlado pelo cliente. `RECAPTCHA_SECRET_KEY_PREVIOUS` não faz parte do Blueprint permanente: crie a variável manualmente apenas durante a janela de rotação descrita no guia de segurança e remova-a ao final.

O Render usa `GET /health/live` como health check. Essa rota não consulta serviços externos, portanto uma indisponibilidade do Supabase não provoca reinício do processo Node.

## 5. Cloudflare Pages

Conecte o repositório e use:

- Framework preset: `None` ou `Vite`;
- Build command: `npm ci && npm run build:pages`;
- Build output directory: `dist/client`;
- Node.js: `22`;
- Root directory: raiz do repositório.

Variáveis de produção:

- `VITE_API_URL=https://SEU-SERVICO.onrender.com`;
- `VITE_RECAPTCHA_SITE_KEY`.

Os arquivos `_redirects` e `_headers` são copiados de `public/`. O primeiro implementa o fallback da SPA; o segundo adiciona headers de segurança e cache para os assets versionados.

## 6. Keep-alive no GitHub Actions

O workflow `.github/workflows/keep-alive.yml` roda a cada 10 minutos e também aceita execução manual. Ele executa `scripts/keep-alive.mjs` em duas etapas:

1. chama `/health/live` com retentativas para acordar o Render;
2. chama `/health/dependencies` com autenticação, executando uma consulta real no Supabase.

No repositório do GitHub, configure:

- Actions variable `KEEP_ALIVE_API_URL` com a URL HTTPS do Render;
- Actions secret `KEEP_ALIVE_SECRET` exatamente igual ao valor configurado no Render.

Execute o workflow manualmente depois do primeiro deploy e confirme as duas mensagens de sucesso. O agendamento reduz fortemente a chance de cold start, mas não é garantia de disponibilidade: execuções agendadas podem atrasar ou ser descartadas sob carga, e workflows agendados de repositórios públicos sem atividade podem ser desativados após 60 dias.

## 7. Smoke test de produção

Após cada deploy:

1. confirme `GET /health/live` com status `200`;
2. execute manualmente o workflow de keep-alive;
3. abra todas as rotas diretamente e atualize a página para validar o fallback da SPA;
4. envie um contato real e confirme entrega, Reply-To e ausência de dados pessoais nos logs;
5. valide café e métricas do GitHub;
6. confirme `robots.txt`, `sitemap.xml`, currículo e headers HTTP;
7. rode novamente lint, typecheck, build e testes automatizados;
8. confirme CSP, HSTS, COOP e CORP no frontend e na API;
9. execute `npm run security:ip-spoof` conforme o guia de segurança.

## Limitações conhecidas do plano gratuito

- O Render Free pode suspender um serviço após 15 minutos sem tráfego e pode reiniciá-lo independentemente do keep-alive.
- Manter uma instância ativa consome as horas gratuitas mensais do workspace.
- O Supabase Free pode pausar projetos com pouca atividade; a chamada a `app_healthcheck()` existe para produzir atividade real de banco.
- A rota inexistente de uma SPA estática é renderizada corretamente no cliente, mas o fallback do Pages responde HTTP `200`, não `404`.

## Referências operacionais

- [Cloudflare Pages: redirects](https://developers.cloudflare.com/pages/configuration/redirects/)
- [Cloudflare Pages: headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Render: serviços gratuitos](https://render.com/docs/free)
- [Render: especificação de Blueprints](https://render.com/docs/blueprint-spec)
- [Supabase: pausa de projetos](https://supabase.com/docs/guides/platform/free-project-pausing)
- [GitHub Actions: sintaxe de agendamento](https://docs.github.com/actions/reference/workflows-and-actions/workflow-syntax#onschedule)
