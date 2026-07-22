# Privacidade e retenção operacional

Este documento transforma os prazos publicados em `/privacidade` em controles verificáveis. Ele deve ser revisado sempre que um fornecedor, plano ou finalidade mudar.

## Matriz de retenção

| Dado ou evidência                  | Local                      | Prazo                                      | Controle                                           |
| ---------------------------------- | -------------------------- | ------------------------------------------ | -------------------------------------------------- |
| Chave HMAC de rate limit           | Supabase                   | 7 dias                                     | Exclusão diária por `privacy-retention-daily`      |
| Identificador do contador de cafés | Supabase                   | 30 dias                                    | Anonimização diária; o total agregado é preservado |
| Evidência das rotinas de retenção  | Supabase                   | 90 dias                                    | Exclusão na própria rotina diária                  |
| Conteúdo de mensagens recebidas    | Caixa de e-mail de destino | 12 meses após a última interação relevante | Revisão e exclusão mensal                          |
| Eventos e previews transacionais   | Brevo                      | 30 dias                                    | Regra de retenção da conta Brevo                   |
| Logs da aplicação                  | Render Hobby               | 7 dias                                     | Retenção do plano; a aplicação não exporta logs    |
| Logs de API e banco                | Supabase Free              | 1 dia                                      | Retenção do plano; não há Log Drain                |
| Preferências locais                | Navegador do visitante     | Até limpeza ou restauração                 | Controle do próprio navegador/widget               |

Exceções ao descarte só podem ocorrer quando necessárias para obrigação legal ou exercício regular de direitos. A justificativa e o novo prazo devem ser registrados fora dos logs públicos do projeto.

## Banco e cron

A migration `20260720213000_privacy_retention.sql`:

1. permite remover `visitor_id` sem remover a linha contabilizada;
2. cria `privacy_retention_runs`, sem dados do visitante;
3. cria `enforce_privacy_retention()`;
4. agenda `privacy-retention-daily` para `03:17 UTC`;
5. executa a primeira limpeza durante a migration;
6. expõe `get_privacy_retention_status()` somente para a service role.

Aplicar a migration antes de publicar a versão da API que consulta o status de retenção.

### Verificação após a migration

Execute no SQL Editor ou pela conexão administrativa:

```sql
select jobid, jobname, schedule, active, command
from cron.job
where jobname = 'privacy-retention-daily';

select ran_at, rate_limit_rows_deleted, coffee_identifiers_anonymized
from public.privacy_retention_runs
order by ran_at desc
limit 10;

select * from public.get_privacy_retention_status();
```

O resultado esperado é um job ativo, ao menos uma execução registrada e `is_current = true`. O endpoint autenticado `/health/dependencies` deve retornar `privacyRetention: "current"`.

## Brevo

Na área de logs transacionais da Brevo, configure a retenção de logs e previews para **30 dias**. Não exporte esses eventos para armazenamento próprio.

Depois de salvar:

1. registre a data da configuração;
2. confirme que o domínio continua autenticado;
3. envie uma mensagem controlada;
4. valide entrega, `Reply-To`, DKIM e DMARC;
5. não copie o conteúdo recebido para relatórios ou logs técnicos.

A Brevo informa que eventos podem ser mantidos sem limite quando a conta possui menos de 10 milhões de eventos se uma regra personalizada não estiver configurada. Portanto, a configuração de 30 dias é requisito de aceite, não apenas recomendação.

## Caixa de e-mail

O site não persiste mensagens no banco. A cópia recebida na caixa de destino deve ser revisada mensalmente:

1. localizar mensagens com assunto iniciado por `[guifer.tech]`;
2. manter somente conversas com interação relevante nos últimos 12 meses;
3. eliminar mensagens vencidas também da lixeira;
4. registrar apenas data da revisão e quantidade excluída, sem nome, e-mail ou assunto;
5. conservar uma mensagem por prazo maior somente com justificativa legal documentada.

Se o provedor permitir regra automática baseada em rótulo/pasta e idade, prefira a automação. A revisão mensal continua necessária para verificar se a regra permanece ativa.

## Logs e minimização

- A aplicação não registra corpo do formulário, nome, e-mail ou mensagem.
- Não habilitar streaming de logs sem uma análise de necessidade e retenção.
- Não inserir payloads pessoais em issues, Actions, screenshots ou relatórios de erro.
- Revalidar os prazos dos planos Render e Supabase a cada mudança de plano.

## Solicitações de titulares

O canal publicado é `contato@guifer.tech`. Ao receber uma solicitação:

1. confirmar identidade de forma proporcional;
2. localizar dados na caixa de e-mail e nos fornecedores aplicáveis;
3. responder de forma clara e gratuita;
4. executar correção, acesso, anonimização ou eliminação quando cabível;
5. registrar somente o necessário para demonstrar atendimento;
6. informar eventual fundamento de conservação.

## Revisão periódica

Revisar trimestralmente:

- execução e histórico do cron;
- regra de retenção da Brevo;
- mensagens vencidas na caixa postal;
- mudanças de plano e retenção dos provedores;
- fornecedores, finalidades, bases legais e links publicados;
- coerência entre este documento e `/privacidade`.

## Referências

- [LGPD — Lei nº 13.709/2018](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709compilado.htm)
- [Aviso de Privacidade da ANPD](https://www.gov.br/anpd/pt-br/acesso-a-informacao/aviso-de-privacidade)
- [Direitos dos titulares — ANPD](https://www.gov.br/anpd/pt-br/assuntos/titular-de-dados-1)
- [Supabase Cron](https://supabase.com/docs/guides/cron)
- [Render — retenção de logs](https://render.com/docs/logging#retention-period)
- [Brevo — retenção de eventos](https://help.brevo.com/hc/pt/articles/19317424653586-Sobre-a-nova-pol%C3%ADtica-de-reten%C3%A7%C3%A3o-de-dados)
