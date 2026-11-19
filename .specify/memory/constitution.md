# Portfólio Pessoal Constitution

## Core Principles

### I. Segurança e Privacidade por Fronteira

Segredos, credenciais administrativas e operações privilegiadas DEVEM permanecer exclusivamente
no backend. Dados não confiáveis DEVEM ser validados, limitados e normalizados antes do uso.
Privilégios DEVEM ser mínimos, e controles críticos de autenticação, autorização, origem,
rate limit e identidade do cliente DEVEM falhar fechados quando sua evidência não for confiável.

Dados pessoais, segredos e conteúdo de mensagens NÃO DEVEM aparecer em logs. Dados operacionais
DEVEM possuir retenção finita, anonimização ou remoção documentada. As fronteiras entre cliente e
servidor, a exposição de segredos e os controles de acesso DEVEM possuir verificações automatizadas.
Esse princípio existe para reduzir abuso, vazamento de credenciais e retenção desnecessária.

### II. Arquitetura Explícita e Escopo Preservado

Frontend e API DEVEM continuar como artefatos independentes, com responsabilidades, builds e
implantações separados. Responsabilidades NÃO DEVEM atravessar essas fronteiras sem decisão
arquitetural documentada, análise de impacto e migração incremental. Artefatos gerados DEVEM ser
modificados apenas pelas ferramentas responsáveis por sua geração.

Cada mudança DEVE preservar comportamentos e contratos fora do escopo aprovado. Antes de decisões
estruturais, código, testes e integrações afetados DEVEM ser examinados. Requisitos, restrições,
exceções e procedimentos normativos do projeto DEVEM estar registrados nos artefatos do Spec Kit.
`AGENTS.md`, documentação geral, comentários e mensagens de conversa NÃO PODEM criar uma regra de
projeto independente ou substituir a autoridade normativa do Spec Kit. Isso mantém um único método
de trabalho sem congelar a evolução técnica.

### III. Qualidade em Duas Fases

O desenvolvimento DEVE distinguir iteração rápida de finalização consolidada. Na iteração rápida,
validações demoradas PODEM ser adiadas quando a pendência for registrada, o resultado permanecer
inspecionável e nenhum risco de segurança, perda de dados ou dano irreversível for introduzido.
Mudanças visuais DEVEM receber inspeção renderizada direcionada antes de serem apresentadas como
prontas.

Na finalização consolidada, lint, formatação, typecheck, testes e builds aplicáveis DEVEM concluir
sem erros antes de commit ou release. Código novo e existente NÃO DEVE manter imports, variáveis ou
parâmetros inutilizados. `any`, suppressions e exclusões de análise exigem justificativa verificável;
artefatos gerados PODEM ser excluídos quando a exclusão estiver explicitamente configurada.

### IV. Testes Orientados a Risco

Cada comportamento alterado DEVE ser provado no menor nível de teste confiável. Regras
determinísticas DEVEM preferir testes unitários ou de componente; contratos e integrações DEVEM usar
testes de integração; E2E DEVE ser reservado a fluxos completos, acessibilidade, responsividade e
comportamentos dependentes da integração real do browser.

Correções de regressão DEVEM incluir um teste capaz de reproduzir a falha no nível adequado. Fluxos
críticos DEVEM cobrir sucesso, falha e fronteiras relevantes. Cobertura percentual NÃO DEVE ser
adotada como meta isolada; a evidência exigida é a proteção do comportamento e do risco reais.

### V. Simplicidade, Coesão e Manutenção Incremental

A solução mais simples compatível com os requisitos e contratos atuais DEVE ser preferida. Novas
abstrações, dependências e infraestrutura exigem benefício concreto demonstrável. Reuso NÃO DEVE
ocultar diferenças de domínio, aumentar acoplamento ou reduzir clareza.

Arquivos NÃO DEVEM ser divididos apenas por quantidade de linhas. Extrações DEVEM ocorrer quando
existirem responsabilidades independentes, repetição significativa ou benefício concreto de teste
e manutenção. Código estável NÃO DEVE ser refatorado sem motivo relacionado ao trabalho em curso.
Esse princípio evita tanto módulos monolíticos quanto fragmentação artificial.

### VI. Acessibilidade é Requisito do Produto

Interfaces DEVEM atender à WCAG 2.2 nível AA no escopo aplicável. Teclado, foco, semântica,
contraste, reflow, redução de movimento e compatibilidade com tecnologias assistivas DEVEM compor
os critérios de aceite de toda mudança de interface.

Automação DEVE cobrir regras mecanicamente verificáveis. Mudanças visuais ou interativas materiais
DEVEM receber inspeção manual direcionada nos aspectos que automação não comprova. Acessibilidade
NÃO DEVE ser removida, ocultada ou enfraquecida apenas para simplificar a implementação.

### VII. Sustentabilidade é um Gate

A home DEVE permanecer na faixa A+ do Digital Carbon Rating e respeitar o orçamento operacional
vigente documentado nesta constituição. Mídia pesada NÃO DEVE ser requisitada automaticamente antes
de intenção explícita quando isso violar o orçamento. O gate local de carbono DEVE concluir com
sucesso antes de qualquer staging ou commit.

Limites somente PODEM mudar quando a metodologia oficial mudar, com fonte, impacto e decisão
registrados em um artefato do Spec Kit. A medição pública pós-deploy complementa, mas NÃO substitui,
o gate local. Esse princípio transforma sustentabilidade em restrição verificável, não em objetivo
opcional.

### VIII. Resiliência e Observabilidade Proporcionais

Integrações externas DEVEM possuir timeouts, erros contidos e degradação segura quando o conteúdo
não for crítico. Requisições relevantes DEVEM ser correlacionáveis por identificadores que não
revelem dados pessoais. Logs DEVEM registrar categoria, resultado e contexto operacional mínimo,
sem conteúdo sensível.

Liveness, dependências e estado operacional DEVEM permanecer distinguíveis. Controles críticos de
segurança DEVEM falhar fechados; conteúdo auxiliar PODE falhar de forma segura e explícita. Uma
plataforma externa de observabilidade NÃO é obrigatória enquanto as evidências atuais atenderem ao
risco e à escala do projeto.

## Fonte Normativa e Contexto Operacional Canônico

O Spec Kit é o método único de trabalho deste projeto. A autoridade normativa é distribuída apenas
entre os seguintes artefatos, em ordem de precedência:

1. `.specify/memory/constitution.md` para princípios, invariantes e governança duradouros;
2. artefatos da feature ativa em `specs/` para escopo, requisitos, decisões, plano e tarefas que
   estejam em conformidade com esta constituição;
3. templates, workflows e extensões versionados em `.specify/` para o processo executável.

Manifests, código, configuração, CI e documentação PODEM comprovar fatos técnicos ou executar gates,
mas NÃO PODEM introduzir requisitos normativos que não estejam representados nos artefatos acima.
Quando uma evidência técnica divergir do contexto registrado, a divergência DEVE ser apresentada e
o artefato normativo aplicável DEVE ser corrigido antes de a decisão ser tratada como consolidada.

`AGENTS.md` DEVE funcionar somente como bootstrap para o Codex: identificar o Spec Kit como método
obrigatório, apontar para esta constituição e orientar a seleção do comando `$speckit-*` adequado.
Ele NÃO DEVE duplicar princípios, requisitos, comandos, gates, backlog ou decisões de arquitetura.

O contexto operacional canônico atual é:

- O projeto usa npm, TypeScript em modo estrito e módulos ESM.
- O frontend é uma SPA React 19 construída com Vite 8, TanStack Router e Tailwind CSS 4; o artefato
  estático é gerado em `dist/client` e publicado no Cloudflare Pages.
- A API é um serviço Node separado, baseado em `node:http`; o bundle de `server/index.ts` é gerado
  em `dist-api/server.js` e implantado separadamente no Render.
- Os comandos oficiais são `npm run lint`, `npm run typecheck`, `npm run test:api`,
  `npm run test:a11y`, `npm run build` e `npm run carbon:check`.
- A home DEVE transferir no máximo 272,51 kB durante carga fria e rolagem sem interação explícita,
  com meta interna de 250 kB e sem requisições automáticas de vídeo.
- O orçamento segue o Digital Carbon Rating baseado no SWDM v4. Alterações de metodologia ou limite
  exigem emenda normativa com fonte, impacto e decisão registrados no Spec Kit.

## Invariantes de Arquitetura e Produto

- O frontend DEVE permanecer implantável como artefato estático e separado da API.
- A API DEVE concentrar integrações privilegiadas, persistência e controles que dependem de segredos.
- Builds, contratos e destinos de implantação do frontend e da API DEVEM permanecer explícitos e
  verificáveis de forma independente.
- O cliente administrativo do Supabase usa `SUPABASE_SERVICE_ROLE_KEY`, ignora RLS e NÃO PODE ser
  importado pelo frontend nem exposto em variáveis `VITE_*`.
- O acesso de `anon` e `authenticated` à escrita em `coffee_taps` e às RPCs operacionais DEVE
  permanecer revogado; persistência e rate limits DEVEM passar pela API com `service_role`.
- O formulário de contato NÃO DEVE persistir mensagens no banco. A API DEVE validar e limitar a
  entrada, aplicar honeypot, rate limit e reCAPTCHA v3 e enviar a mensagem por Brevo SMTP.
- O rate limit DEVE transformar o endereço do cliente em HMAC-SHA-256 antes da persistência. No
  Render, somente um `CF-Connecting-IP` válido e sobrescrito pela Cloudflare PODE definir o bucket;
  ausência ou invalidade DEVE falhar fechada.
- A retenção diária do Supabase DEVE remover hashes de rate limit após 7 dias, anonimizar
  identificadores do contador de cafés após 30 dias e remover registros de execução após 90 dias.
- `src/routeTree.gen.ts` é gerado pelo plugin do TanStack Router e NÃO DEVE ser editado manualmente.
- Limites de retenção, anonimização, rate limit, origens permitidas e sustentabilidade somente PODEM
  mudar por emenda ou por uma feature Spec Kit que atualize explicitamente a fonte normativa.

## Fluxo de Desenvolvimento e Gates de Qualidade

1. Todo trabalho que altere comportamento, arquitetura, operação ou governança DEVE ser conduzido
   pelo comando `$speckit-*` correspondente e pelos artefatos da feature ativa.
2. Requisito, escopo e comportamento existente DEVEM ser identificados antes da edição.
3. Decisões estruturais DEVEM ser precedidas por evidência do código, testes e contratos afetados.
4. Na iteração rápida, a mudança DEVE permanecer mínima, inspecionável e registrada quando houver
   validações adiadas.
5. Na finalização consolidada, testes proporcionais ao risco e todos os gates aplicáveis DEVEM ser
   executados sobre o conjunto aprovado.
6. `npm run lint`, `npm run typecheck`, testes e builds aplicáveis DEVEM estar verdes antes de commit
   ou release.
7. Fronteiras críticas de segurança DEVEM possuir enforcement automático e incremental.
8. `npm run carbon:check` DEVE ser executado sobre o conjunto final imediatamente antes do primeiro
   staging de cada fluxo de commit e concluir com código de saída `0`.
9. Falha no gate de carbono DEVE interromper o fluxo antes de staging ou commit; o limite NÃO PODE
   ser aumentado, desativado ou contornado silenciosamente.
10. Falhas em qualquer outro gate aplicável DEVEM interromper o fluxo, salvo exceção válida segundo
    a governança abaixo.
11. Release DEVE preservar contratos, fronteiras de implantação, segurança e evidência do artefato
    efetivamente publicado.

## Governance

Esta constituição prevalece sobre qualquer outra orientação do projeto. Especificações, planos,
tarefas, templates, workflows e extensões do Spec Kit DEVEM permanecer compatíveis com ela.
`AGENTS.md`, documentação, CI, manifests e comentários são adaptadores, evidências ou mecanismos de
execução; em conflito normativo, NÃO PODEM prevalecer sobre esta constituição nem criar uma exceção
implícita.

Toda emenda DEVE registrar motivação, impacto, compatibilidade e migração necessária. A versão segue
SemVer: MAJOR para remoção ou redefinição incompatível de governança; MINOR para novo princípio,
seção ou expansão material compatível; PATCH para esclarecimento sem mudança semântica. A data de
ratificação original permanece fixa e `Last Amended` muda em toda emenda ratificada.

Exceções DEVEM registrar motivo, risco, responsável, escopo e condição ou data de remoção em um
artefato do Spec Kit. Exceções NÃO PODEM expor segredos, enfraquecer integridade de dados, contornar
fronteiras críticas de segurança ou autorizar staging ou commit sem comprovação do orçamento de
sustentabilidade. Toda revisão de especificação, plano, tarefas, código e release DEVE verificar os
princípios aplicáveis sem impor cerimônia desproporcional ao risco.

Regras encontradas fora do Spec Kit DEVEM ser tratadas como candidatas à migração, não como nova
autoridade. Até sua migração ou descarte explícito, elas NÃO PODEM ser apagadas quando isso causar
perda de requisitos, histórico ou trabalho pendente.

**Version**: 3.0.0 | **Ratified**: 2026-09-28 | **Last Amended**: 2026-09-29
