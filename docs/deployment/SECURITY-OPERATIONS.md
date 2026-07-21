# Operação de segurança

Este documento fecha os controles operacionais de `SEC-01` a `SEC-04`. Ele não deve conter credenciais, headers brutos de e-mail, endereços pessoais, payloads de contato ou cópias de logs com dados pessoais.

## Confiança do endereço do cliente

O serviço Node recebe conexões somente pelo balanceador público do Render. Em produção, `CLIENT_IP_SOURCE=render` fixa o primeiro valor IP válido de `X-Forwarded-For` como fonte do rate limit. `CF-Connecting-IP`, valores posteriores do encadeamento e headers alternativos não selecionam o bucket. Ausência ou valor inválido falha fechado.

No desenvolvimento, `CLIENT_IP_SOURCE=direct` usa somente o endereço do socket. A aplicação transforma o IP em HMAC antes de chamar o Supabase e não registra o endereço bruto.

Depois de publicar a API e no início de uma janela limpa de 15 minutos, execute:

```powershell
$env:IP_SPOOF_TEST_API_URL="https://guifer-api.onrender.com"
npm run security:ip-spoof
Remove-Item Env:IP_SPOOF_TEST_API_URL
```

O teste envia apenas JSON inválido, alterna valores reservados de documentação em `X-Forwarded-For` e deve receber `422` antes de `429`. Ele não envia e-mail, mas consome temporariamente o rate limit do IP executor.

## Headers defensivos

O frontend publica CSP bloqueante, `frame-ancestors 'none'`, HSTS de um ano com subdomínios, COOP `same-origin` e CORP `same-origin`. A CSP permite somente os scripts, frames e conexões do reCAPTCHA, a API do portfólio e os recursos empacotados localmente.

A API publica uma CSP sem conteúdo ativo, `frame-ancestors 'none'`, HSTS de um ano, COOP, CORP, Permissions Policy, Referrer Policy, `nosniff` e bloqueio de frames.

`Cross-Origin-Embedder-Policy` não é habilitado: o reCAPTCHA depende de frames e recursos de terceiro que não participam do isolamento exigido por COEP. HSTS não usa `preload`; qualquer inclusão futura nessa lista exige auditoria separada de todos os subdomínios.

## Evidência do canal de contato

O teste controlado de 20 de julho de 2026 confirmou:

- DKIM do domínio `guifer.tech`, seletor `brevo2`: `pass`;
- DMARC alinhado com `guifer.tech`: `pass`, mantendo a política atual `p=none`;
- SPF na entrega original e depois do encaminhamento SRS: `pass`;
- ARC no encaminhamento Cloudflare Email Routing para a caixa final: `pass`;
- `Reply-To` preservado com o nome e endereço informados pelo visitante;
- `Return-Path` reescrito por SRS no encaminhamento, como esperado.

Os headers brutos e o corpo da mensagem não integram o repositório. Para encerrar uma verificação futura, copie apenas o valor de `X-Contact-Request-ID`, localize a requisição correspondente no Render e confirme que os logs contêm somente rota, status, duração, request ID e categoria. Nome, e-mail, assunto, mensagem, token e IP não podem aparecer.

## Política anual de credenciais

**Marco inicial:** 21 de julho de 2026.
**Próxima revisão e rotação obrigatória:** até 21 de julho de 2027.
**Responsável:** controlador e mantenedor do portfólio.
**Registro:** gerenciador de senhas, com data de criação, última rotação e próxima revisão; nunca no repositório.

Todas as credenciais são rotacionadas uma vez por ano. Antecipe a rotação somente diante de exposição real ou suspeita, comprometimento de conta ou dispositivo, ou mudança da pessoa responsável.

| Credencial             | Armazenamento                        | Requisito e validação                                                                                                                    |
| ---------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| Brevo SMTP             | Secret do Render                     | Chave Standard de 64 caracteres, exclusiva para `guifer-api`; validar envio real e entrega                                               |
| GitHub GraphQL         | Secret do Render                     | PAT fine-grained pessoal, expiração anual, somente repositórios públicos em leitura e nenhuma permissão adicional; validar `/api/github` |
| Supabase               | Secret do Render                     | Chave dedicada `sb_secret_` para a API; validar `/health/dependencies`, café e rate limit                                                |
| reCAPTCHA              | Secret do Render e site key do Pages | Par exclusivo de produção; validar token, hostname, ação e score com um contato real                                                     |
| Keep-alive             | Secrets do Render e GitHub Actions   | Valor aleatório de pelo menos 32 caracteres e idêntico nos dois destinos; validar execução manual do workflow                            |
| HMAC de contato e café | Secrets do Render                    | Valores independentes com pelo menos 32 caracteres; validar `422`/`429` e café; a rotação reinicia a continuidade dos buckets atuais     |

### Procedimento comum

1. Crie a nova credencial no provedor sem revogar a atual.
2. Registre criação, expiração e próxima revisão no gerenciador de senhas.
3. Atualize o secret no Render, Cloudflare Pages ou GitHub Actions, conforme a tabela.
4. Publique somente o componente afetado e execute a validação indicada.
5. Confirme logs sem PII e funcionamento dos health checks.
6. Revogue a credencial anterior no provedor.
7. Registre o resultado e a data da revogação.

Para o reCAPTCHA, configure primeiro o novo secret em `RECAPTCHA_SECRET_KEY` e mantenha o antigo temporariamente em `RECAPTCHA_SECRET_KEY_PREVIOUS`. Depois publique a nova site key no Pages, valide um contato real e remova a variável anterior. O formulário tenta a chave primária antes da chave temporária.

Para o keep-alive, atualize Render e GitHub Actions na mesma janela e execute o workflow manualmente. Uma falha transitória durante a troca não autoriza manter duas chaves.

## Dependências, licenças e SBOM

Execute na revisão anual e antes de releases relevantes:

```powershell
npm ci
npm run security:audit
New-Item -ItemType Directory -Force security-reports
npm run security:sbom > security-reports/sbom.cdx.json
```

O diretório `security-reports/` é ignorado pelo Git. Revise vulnerabilidades, componentes sem licença declarada e licenças novas ou incompatíveis. Registre apenas a data, o responsável e a decisão no controle operacional; não versione o inventário gerado.

### Revisão inicial

Em 21 de julho de 2026, `npm audit` encontrou zero vulnerabilidades conhecidas. O SBOM CycloneDX registrou 443 componentes e nenhuma dependência sem licença declarada. Foram observadas as licenças `0BSD`, `Apache-2.0`, `BlueOak-1.0.0`, `BSD-2-Clause`, `BSD-3-Clause`, `CC-BY-4.0`, `ISC`, `MIT`, `MIT AND ISC`, `MIT-0`, `MPL-2.0`, `OFL-1.1`, `Python-2.0` e `Unlicense`, sem bloqueador identificado para a distribuição atual do portfólio.

## Referências operacionais

- [Render: Web Services](https://render.com/docs/web-services)
- [Cloudflare Pages: headers](https://developers.cloudflare.com/pages/configuration/headers/)
- [Google reCAPTCHA: CSP](https://developers.google.com/recaptcha/docs/faq)
- [Brevo: chaves SMTP](https://help.brevo.com/hc/en-us/articles/7959631848850-Create-and-manage-your-SMTP-keys)
- [Supabase: chaves de API](https://supabase.com/docs/guides/getting-started/api-keys)
- [GitHub: fine-grained PAT](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
