# Release, observação e rollback

Este runbook coordena o frontend no Cloudflare Pages, a API no Render e as migrations do Supabase. Ele não autoriza armazenar credenciais, valores de variáveis, dumps, payloads de contato ou logs com dados pessoais no repositório.

## Contratos da implantação

- O Cloudflare Pages acompanha `main` e injeta `CF_PAGES_COMMIT_SHA` durante o build. O artefato publica esse valor em `/release.json` com `Cache-Control: no-store`.
- O Render permanece com deploy automático desligado e fornece `RENDER_GIT_COMMIT` em runtime. A API publica esse valor em `/health/live`.
- As operações deste runbook usam `supabase@2.110.0`. Uma atualização da CLI exige revisar os comandos, repetir o ensaio de backup/restauração e atualizar a versão em todos os exemplos antes da release.
- Cada plataforma deve corresponder ao SHA completo anotado no registro. Em uma release coordenada os dois alvos normalmente são iguais; um rollback isolado pode deixá-los temporariamente diferentes. `npm run release:verify` falha diante de divergência do alvo registrado, qualquer redirecionamento, cache indevido ou contrato inválido.
- Migrations de produção avançam somente por novos arquivos. Não edite uma migration já aplicada, não use `db reset --linked` em produção e não altere o histórico para simular rollback.
- Toda mudança de banco deve manter a versão anterior da API funcional durante a janela de implantação. Remoções e renomeações exigem ao menos duas releases: expandir, migrar consumidores e somente depois contrair.
- Todo frontend publicado deve funcionar com a API que já está em produção, e toda API nova deve continuar aceitando o frontend anterior durante a janela. Um commit que quebre qualquer direção dessa compatibilidade não pode seguir diretamente para `main`.

### Mudanças de contrato

Como o push em `main` inicia o Pages antes do deploy manual do Render, mudanças incompatíveis de endpoint ou payload são divididas:

1. migration aditiva, quando necessária;
2. API que aceite simultaneamente os contratos antigo e novo, mantendo o frontend inalterado;
3. frontend que passe a usar o contrato novo;
4. somente em release posterior, remoção do contrato e schema antigos.

Cada fase possui SHA, verificações e registro próprios. Se a compatibilidade temporária não for possível, pause o deploy automático do Pages e aprove uma janela explícita de indisponibilidade antes do push; não aceite uma quebra silenciosa.

## Registro obrigatório

Abra uma seção por release no controle operacional privado ou em uma issue restrita. Registre nomes de variáveis alteradas, nunca valores. Use este modelo:

```md
## AAAA-MM-DD — <SHA completo>

- Responsável:
- Commit anterior — Pages / Render:
- Commit alvo — Pages / Render:
- Migrations pendentes e última migration confirmada:
- Project ref do Supabase confirmado:
- Alvo do ensaio de restauração — local ou project ref descartável, nunca produção:
- Variáveis alteradas — Cloudflare / Render / GitHub, somente nomes:
- Backup lógico prévio — necessário? localização externa e checksum:
- Ordem e horário — Pages / Supabase / Render:
- Verificação de release — URL da execução do GitHub Actions:
- Smoke — domínio, health, contato, café, GitHub, headers e retenção:
- Alertas — Render e GitHub confirmados:
- Janela de observação — início, fim e duração:
- Sinais consultados — Pages, Render Events/logs, Actions e health:
- Resultado observado — normal, incidente ou não executado:
- Resultado e desvios:
- Rollback — não necessário / alvo e resultado:
```

O histórico do workflow `Verify production release` é evidência complementar do SHA e horário, mas não substitui o registro das migrations, variáveis e verificações manuais.

## Pré-release

1. Confirme que o alvo é `main`, está publicado no repositório remoto e anote o SHA completo com `git rev-parse HEAD`.
2. Antes de qualquer leitura ou escrita remota, vincule o CLI ao projeto de produção versionado em `supabase/config.toml` e confira o vínculo local:

   ```powershell
   $productionProjectRef = "nqbqeynrudkzyumimpuk"
   npx supabase@2.110.0 link --project-ref $productionProjectRef
   $linkedProjectRef = (Get-Content "supabase/.temp/project-ref" -Raw).Trim()
   if ($linkedProjectRef -ne $productionProjectRef) { throw "O Supabase CLI não está vinculado ao projeto de produção esperado." }
   ```

   Registre o project ref confirmado. Repita essa conferência na mesma sessão, imediatamente antes de `db dump`, `db push` ou uma restauração de incidente em produção; um vínculo antigo não autoriza operar outro projeto. O ensaio de restauração usa a guarda separada abaixo e nunca aponta para produção.

3. Identifique os SHAs atualmente publicados nos painéis do Pages e Render e a última migration remota com `npx supabase@2.110.0 migration list`.
4. Liste migrations entre o commit publicado e o alvo. Classifique cada uma como aditiva/compatível ou destrutiva/incompatível.
5. Para qualquer mudança destrutiva ou transformação de dados, gere antes dumps separados de schema, dados e roles fora do repositório. O comando padrão não inclui dados nem roles. Use um diretório externo criptografado e execute, somente após reconfirmar o project ref:

   ```powershell
   npx supabase@2.110.0 db dump --linked --file "<backup-externo>/schema.sql"
   npx supabase@2.110.0 db dump --linked --data-only --use-copy --file "<backup-externo>/data.sql"
   npx supabase@2.110.0 db dump --linked --role-only --file "<backup-externo>/roles.sql"
   Get-FileHash "<backup-externo>/schema.sql", "<backup-externo>/data.sql", "<backup-externo>/roles.sql" -Algorithm SHA256
   ```

   Restaure os três arquivos em um banco local descartável ou em um projeto criado para o ensaio e valide contagens e invariantes antes de liberar a produção. Se usar um projeto remoto descartável, troque e confira explicitamente o vínculo antes da restauração:

   ```powershell
   $productionProjectRef = "nqbqeynrudkzyumimpuk"
   $disposableProjectRef = "<project-ref-descartavel>"
   if ($disposableProjectRef -eq $productionProjectRef) { throw "O ensaio de restauração não pode usar produção." }
   npx supabase@2.110.0 link --project-ref $disposableProjectRef
   $linkedProjectRef = (Get-Content "supabase/.temp/project-ref" -Raw).Trim()
   if ($linkedProjectRef -ne $disposableProjectRef -or $linkedProjectRef -eq $productionProjectRef) { throw "O alvo descartável não foi confirmado." }
   ```

   Registre o alvo descartável sem credenciais. Ao concluir o ensaio, vincule novamente o CLI ao project ref de produção e repita a conferência antes de prosseguir. O plano Free não oferece backup automático restaurável; sem dumps completos, checksums e ensaio de restauração aprovados, a release destrutiva não prossegue.

6. Compare somente os nomes e a presença das variáveis com `render.yaml` e com a seção de deploy. Segredos nunca entram no registro.
7. Execute:

   ```powershell
   npm ci
   npm run lint
   npm run typecheck
   npm run test:api
   npm run test:a11y
   npm run build
   npm run security:audit
   ```

## Publicação

1. Faça push do SHA alvo para `main`. Isso inicia o Pages; acompanhe o build e registre o deployment ID.
2. Se houver migrations, reconfirme o project ref conforme a pré-release e só então aplique-as em ordem com `npx supabase@2.110.0 db push`. Confirme novamente `npx supabase@2.110.0 migration list` e os testes operacionais específicos da migration.
3. No Render, escolha manualmente o mesmo SHA alvo. Não use outro commit disponível em `main`. Aguarde build, health check e troca da instância; registre o deploy ID.
4. Aguarde o Pages concluir e execute localmente:

```powershell
$env:RELEASE_FRONTEND_COMMIT=(git rev-parse HEAD)
$env:RELEASE_API_COMMIT=(git rev-parse HEAD)
npm run release:verify
Remove-Item Env:RELEASE_FRONTEND_COMMIT
Remove-Item Env:RELEASE_API_COMMIT
```

Para produzir evidência no GitHub Actions, dispare o evento contra o workflow versionado em `main`:

```powershell
$frontendCommit = git rev-parse HEAD
$apiCommit = git rev-parse HEAD
@{
  event_type = "verify-production-release"
  client_payload = @{
    frontend_commit = $frontendCommit
    api_commit = $apiCommit
  }
} | ConvertTo-Json | gh api --method POST "repos/{owner}/{repo}/dispatches" --input -
```

Em rollback isolado, informe em cada campo o SHA efetivamente publicado. O workflow é carregado da branch padrão, faz checkout explícito de `main` e rejeita alvos que não pertençam ao histórico de `main`.

5. Execute `npm run security:production`, o workflow de keep-alive e os probes específicos da release.
6. Valide o domínio canônico e rotas diretas, `/health/status`, contato real e entrega, café, métricas do GitHub, headers e retenção autenticada. Registre apenas o request ID do contato e o resultado da inspeção sem PII.
7. Mantenha uma janela de observação que cubra ao menos três execuções do keep-alive. Registre início e fim, consulte o deployment do Pages, Events/logs do Render, execuções do GitHub Actions e health no começo e no final. Preencha o resultado real; `não executado` não encerra a release.

Se qualquer etapa falhar antes da troca do Render, não avance. O Pages pode ser revertido isoladamente para o deployment anterior enquanto banco e API permanecem na versão compatível anterior.

## Rollback de aplicação

1. Declare o incidente no registro e identifique o último SHA comprovadamente saudável em ambas as plataformas.
2. Reverta primeiro o Pages pelo menu do deployment de produção anterior, reduzindo o risco de o frontend novo chamar um contrato antigo.
3. No Render, use `Rollback` no deploy saudável compatível. O rollback reutiliza o artefato e a configuração daquele deploy; domínio e disco continuam com o estado atual.
4. Execute `npm run release:verify` com os SHAs efetivos de cada plataforma, depois health, domínio e um smoke que não produza dados. Só execute contato real se o incidente envolver esse fluxo.
5. Corrija a causa em um novo commit. Não force `main` para trás nem reescreva histórico compartilhado.

## Rollback de banco

- Migration aditiva e compatível: mantenha o schema avançado e reverta apenas Pages/Render. Esta é a resposta preferencial.
- Schema incorreto sem perda de dados: crie e revise uma nova migration compensatória, teste-a localmente, reconfirme o project ref de produção e aplique-a com `db push`. Produção sempre avança no histórico.
- Transformação ou remoção de dados: interrompa a release. Restaure somente a partir de dump verificado, depois de reconfirmar o project ref de produção, e com aprovação explícita, aceitando downtime e o ponto de perda documentado.
- Nunca use `supabase migration repair` para desfazer SQL: esse comando altera apenas o histórico. Nunca execute `supabase db reset --linked` contra produção.

No plano Free, a recuperação depende dos dumps lógicos externos feitos antes de mudanças destrutivas. Dumps podem conter dados pessoais e devem permanecer criptografados, com acesso restrito e retenção definida fora do Git.

## Alertas e observação

- Render: habilite notificações por e-mail para falha de deploy, instância indisponível e recuperação. O health check `/health/live` impede a troca para uma instância que não inicia corretamente.
- GitHub: mantenha notificações de Actions para workflows com falha. O keep-alive testa API e Supabase; `Verify production release` registra o alinhamento dos commits.
- Cloudflare: acompanhe o build do deployment alvo e mantenha as notificações de falha de Pages habilitadas na conta.
- Uma falha de dependência exige consulta a `/health/status`, execução autenticada de `/health/dependencies` e inspeção dos eventos do provedor antes de reiniciar ou reimplantar.

Não introduza serviço pago de observabilidade enquanto esses sinais forem proporcionais ao tráfego do portfólio. Reavalie se houver perda de incidentes, necessidade de SLA ou aumento de uso.

## Exercício de rollback

Execute após a primeira release que adotar este runbook e depois de mudanças estruturais de implantação:

1. escolha dois deployments consecutivos e compatíveis;
2. reverta Pages e Render ao SHA anterior;
3. comprove o SHA com `release:verify` e valide health/domínio;
4. republique o SHA atual e repita a verificação;
5. em banco local descartável, aplique uma migration aditiva de exercício e uma migration compensatória;
6. registre tempos, falhas, deployment IDs e resultado.

Não provoque restauração destrutiva no banco de produção apenas para cumprir o exercício. A evidência do banco deve vir do ambiente local ou de staging; produção usa o procedimento compensatório somente diante de incidente real.

## Referências

- [Cloudflare Pages: rollbacks](https://developers.cloudflare.com/pages/configuration/rollbacks/)
- [Cloudflare Pages: variáveis de build](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [Render: rollbacks](https://render.com/docs/rollbacks)
- [Render: variáveis padrão](https://render.com/docs/environment-variables)
- [Render: health checks](https://render.com/docs/health-checks)
- [Supabase: deploy de migrations](https://supabase.com/docs/guides/deployment/database-migrations)
- [Supabase: backups](https://supabase.com/docs/guides/platform/backups)
- [Supabase: migrations compensatórias](https://supabase.com/docs/guides/local-development/declarative-database-schemas#rolling-back-a-schema-change)
