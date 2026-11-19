# Plano de Implementação: Baseline Responsivo da Home

**Branch**: `003-home-responsive-baseline` | **Data**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

**Entrada**: especificação da feature em `specs/003-home-responsive-baseline/spec.md`.

## Resumo

Título Home 2026-11-11: reprodução mostrou index com novo título, mas DocumentMetadata substitui
o title por STATIC_METADATA após mount. Corrigir somente títulos PT/EN da rota / nessa fonte;
syncPageMetadata já atualiza title/og:title/twitter:title e remove duplicatas. Verificar browser
e navegação de ida/volta sem alterar roteamento ou index do usuário; sem testes/gates.

Controles/alinhamentos 2026-11-11: editar alinhamento existente do cabeçalho de Projetos,
centralizar somente introdução de Serviços e extrair estilo CSS compartilhado carousel-control
do padrão de Depoimentos. Hero usa variante de tinta branca; Princípios adota chevrons iguais
aos depoimentos e remove caixas/bordas antigas. Sem mudança de eventos/estado; inspeção
visual e toggles em browser, sem testes/gates.

Nav/títulos 2026-11-11: token próprio da navegação reproduz inset atual da Home; padding no
header-container compensa 12px do fundo mobile, ações fixas usam mesmo right. Centralizar
somente cabeçalho editorial de Princípios; trocar título PT/EN de Projetos e remover lead.
Verificar alinhamento real do logo/menu/ações e ausência de subtítulo/overflow, sem testes.

Duplicação lateral 2026-11-11: derivar --section-content-inset = 2×inset base em escopos
locais, usar no padding/margens do breakout e aplicar ao padding-inline de Sobre (incluindo
âncora horizontal do café desktop). Hero continua usando somente inset base. Depoimentos
recebe text-align/justify-items/content center nos blocos e aspas; heading/filete start.
Preservar estrutura/JS e inspecionar 320–1920px, Header/Hero e largura integral do marquee.

Unificação com Sobre 2026-11-11: ajustar token de inset das seções selecionadas para o mesmo
padding já existente no about-template (24/32/clamp40–72). Incluir Projetos e safe-gutter
local do Hero, sem tocar Header/Sobre. Marquee usa margens negativas do inset real por lado,
retomado somente na toolbar, para liberar os cards até as bordas do viewport. Verificar
medidas de conteúdo versus Sobre, molduras de Projetos e largura integral do marquee.

Revisão localizada 2026-11-11: definir --section-edge-inset apenas em habilidades/depoimentos/
contato da Home e footer-restored, com quatro breakpoints. Aplicar padding-inline nos respectivos
containers internos, sem alterar section-container/header-container globais. Um padding no
container de Serviços atende também Princípios; footer usa seletor específico que substitui
o padding mobile de 8px sem somar. Remover em Contato offsets internos de width/auto margin.
Comparar geometria de Header/Sobre/Projetos e dimensões dos cards com baseline renderizado,
além de alinhamento, reflow e overflow em cinco viewports. Sem testes/gates.

Frame lateral 2026-11-11: section-container/header-container usam width 100%, margem lateral
zero; remover regra duplicada da Home e caps de conteúdo/header, zerar gutters e remover
overrides responsivos que os restauram. Hero/Sobre seguem largura integral; Serviços e palco
de Depoimentos perdem caps externos. sizes dos projetos acompanha 100vw. Nenhuma mudança
nos paddings internos de cards/formulário ou nos ritmos verticais. Inspeção sem testes/gates.

Marquee de princípios 2026-11-11: remover lógica de abertura dos dropdowns e substituir por
componente React com Pointer Events, captura após intenção horizontal, medição ResizeObserver
e requestAnimationFrame ativo somente em movimento. Dois grupos iguais e módulo pela largura
de um grupo garantem loop; cópia inert/aria-hidden. Velocidade amostrada do gesto (px/s),
limite 2200px/s e decaimento exponencial de 0.75s até base 26px/s na direção escolhida.
Pausa/foco/redução suspendem ticker; controles fazem avanço manual nesses estados. Preservar
textos/fundo e localizar somente instruções/controles novos. Inspecionar sem testes/gates.

Sincronização 2026-11-11: Quote publica quantidade de linhas medida; Testimonials calcula
300+(linhas-1)*100ms, libera atividade somente após a medição e propaga duração/conclusão.
Autoria redistribui stagger para terminar no mesmo instante; pixels normalizam seus atrasos
aleatórios para 0..duração-80ms. Conclusão do quote fixa todos os estados finais, inclusive
após resize. CSS mantém último estado estável antes do fim. Inspeção dirigida, sem testes.

Refino 2026-11-11: remover somente span nominal do link LinkedIn e trocar escala de atrasos
de 920 para 680ms no componente de pixels. Preservar aria-label nominal e demais comportamentos;
inspeção renderizada dirigida, sem testes/gates.

Iteração pixel 2026-11-11: componente de picture preserva source/img e usa máscara SVG local
12×12, sem canvas, novas mídias ou dependências. Borda/seed sorteados na ativação após mount
para evitar divergência de hidratação; distância da borda e jitter determinam atrasos.
CSS steps revela células, atividade pausa e movimento reduzido remove máscara. Remover
propriedade/keyframe radial anterior; inspecionar desktop/mobile sem testes/gates.

Iteração radial 2026-11-11: animar propriedade CSS registrada de ângulo 0deg→360deg em
conic-gradient como máscara dos picture de autoria. Metadados de seleção/atividade existentes
controlam início, reinício e pausa, sem nova mídia/dependência ou re-render por frame.
Imagens mantêm geometrias/alt e movimento reduzido elimina máscara. Inspeção visual dirigida,
sem testes/gates nesta iteração.

Iteração de autoria 2026-11-11: aplicar o mesmo keyframe fadeIn aos campos textuais existentes,
com índices consecutivos somente entre campos presentes. Componente leve preserva elementos
semânticos e links via cloneElement, sem duplicar conteúdo. Remover animação do container
testimonial-editorial-side para deixar imagens estáticas. Inspecionar estados e redução de
movimento; testes/gates adiados conforme solicitação persistente.

Refino posterior de 2026-11-11: usar base flex de 11rem para resumos e flex-grow 0→1 no ativo.
Altura total soma painel aberto, dois resumos e gaps, mantendo limite estável ao alternar.
Metadados e ações ficam sempre visíveis; somente indicador de clique permanece restrito ao
ativo. Ajustar contraste dos resumos e manter foco dos links, vídeos e animação existentes.

Correção visual posterior em 2026-11-11: acordeão de banners horizontais em coluna em todos os
breakpoints, flex-grow 6:1:1 (75/12.5/12.5%), altura total estável e primeiro painel aberto.
Remover clones/rolagem do carrossel e metadados verticais, manter vídeos e estado de intenção
independente, links reais, foco/setas e toque para expandir. A inspeção substitui a evidência
da orientação anterior; nenhum teste/gate nesta iteração.

Iteração 2026-11-11: adaptar o comportamento de AccordionGallery ao Projects existente com
estado React de painel expandido separado da intenção de vídeo. CSS flex-grow 3:1:1 equivale
a 60% da largura útil para três cards; transição 600ms cubic-bezier(0.165,0.84,0.44,1)
aproxima power3.out sem GSAP. Foco/setas usam os links reais e toque expande antes de navegar
no desktop. Preservar mobile/tablet e todos os dados. Inspecionar sem testes/gates.

Consolidar a Home na ordem Hero → Sobre → Projetos → Habilidades → Depoimentos → Contato, preservar
os comportamentos aprovados fora desse fluxo e substituir a prévia legada de processo por uma seção
Habilidades tipográfica, responsiva e interativa. A implementação reutilizará `DeferredSection`,
`SectionShell`, o dicionário PT/EN e os testes Playwright existentes; os dados das 18 capacidades,
sete tecnologias e relações serão estáticos e tipados no frontend, sem nova dependência, mídia ou
integração externa. O trabalho também corrige os contratos responsivos legados da Home e atualiza os
testes que ainda esperam Trajetória ou a composição anterior.

## Contexto Técnico

**Linguagem/versão**: TypeScript 5.8 em modo estrito, ESM; React 19.2  
**Dependências principais**: Vite 8, TanStack Router, Tailwind CSS 4, Motion 12, React Icons/Lucide  
**Armazenamento**: N/A — conteúdo e mapa de relações são dados estáticos versionados no frontend  
**Testes**: ESLint, TypeScript (`tsc --noEmit`), Playwright 1.61, axe-core; builds Vite do frontend e da API  
**Plataforma-alvo**: navegadores modernos, com suíte principal Chromium e smoke cross-browser WebKit;
frontend estático no Cloudflare Pages  
**Tipo de projeto**: SPA web com API Node separada, não alterada por esta feature  
**Metas de desempenho**: manter interação responsiva sem layout shift perceptível; carga fria e
rolagem sem intenção explícita abaixo de 272,51 kB, com meta interna de 250 kB  
**Restrições**: WCAG 2.2 AA; PT/EN; temas claro/escuro; teclado, toque, hover e movimento reduzido;
320–1920 px; sem dependências novas; sem requisição automática de vídeo; sem editar
`src/routeTree.gen.ts`  
**Escala/escopo**: uma Home com seis seções principais, três grupos de Habilidades, 18 capacidades,
sete tecnologias, seis depoimentos em composição editorial reta com autoria identificada e os
breakpoints-alvo 320, 360, 390, 412, 640, 768, 1023, 1440 e 1920 px

## Verificação da Constituição

_Gate pré-pesquisa e revalidado após o design da Fase 1._

| Princípio/gate                                | Estado | Evidência no plano                                                                                                                  |
| --------------------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| I. Segurança e Privacidade por Fronteira      | PASSA  | Não há entrada não confiável, segredo, persistência nem alteração da API; conteúdo é estático no frontend.                          |
| II. Arquitetura Explícita e Escopo Preservado | PASSA  | A feature permanece na SPA, preserva API e contratos fora da Home e não edita artefatos gerados.                                    |
| III. Qualidade em Duas Fases                  | PASSA  | Inspeção renderizada é prevista durante a iteração; lint, formatação verificada, typecheck, testes e builds compõem a finalização.  |
| IV. Testes Orientados a Risco                 | PASSA  | Relações, paridade de entrada, ordem, foco, contraste, reflow e breakpoints terão provas Playwright/axe direcionadas.               |
| V. Simplicidade e Manutenção Incremental      | PASSA  | Dados tipados e componentes existentes são reutilizados; não há dependência, serviço ou abstração genérica nova.                    |
| VI. Acessibilidade                            | PASSA  | O contrato cobre semântica, foco, Escape, toque, 44×44 px, contraste AA, informação não baseada apenas em cor e movimento reduzido. |
| VII. Sustentabilidade                         | PASSA  | A seção é tipográfica, sem mídia nova; carregamento continua adiado e o gate `carbon:check` permanece obrigatório.                  |
| VIII. Resiliência e Observabilidade           | PASSA  | Não há integração externa nova; falhas da seção adiada continuam contidas pelo mecanismo existente.                                 |

**Resultado pós-design**: nenhum desvio constitucional ou exceção necessária. O PDF externo não é
dependência operacional: suas decisões aprovadas estão registradas na spec e nos contratos desta
feature.

## Estrutura do Projeto

### Documentação desta feature

```text
specs/003-home-responsive-baseline/
├── spec.md
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── home-responsive-ui.md
└── tasks.md                 # gerado posteriormente por $speckit-tasks
```

### Código-fonte afetado

```text
src/
├── components/
│   ├── layout/
│   │   └── Footer.tsx
│   └── sections/
│       ├── About.tsx
│       ├── Contact.tsx
│       ├── DeferredSection.tsx
│       ├── Projects.tsx
│       ├── SectionShell.tsx
│       ├── Skills.tsx
│       └── Testimonials.tsx
├── content/
│   └── capabilities.ts      # catálogo e mapa tipados, sem texto traduzível
├── i18n/
│   └── dictionary.ts        # rótulos e explicações PT/EN
├── routes/
│   └── index.tsx
└── styles.css

e2e/
├── contrast.spec.ts
├── dynamic-content.spec.ts
├── interface-contact.spec.ts
├── responsive-inputs.spec.ts
├── responsive-inventory.spec.ts
├── responsive-media.spec.ts
├── responsiveness.spec.ts
├── support/
│   ├── portfolio.ts
│   └── responsive.ts
└── visual-regression.spec.ts
```

**Decisão de estrutura**: manter a SPA existente e refatorar `Skills.tsx` no próprio módulo. O catálogo
relacional fica em `src/content/capabilities.ts` porque é dado de produto estático e compartilhável,
enquanto todo texto visível permanece em `src/i18n/dictionary.ts`. Mudanças em About, Projetos,
Depoimentos, Contato e Footer devem se limitar aos requisitos responsivos comprovados pelos testes;
não haverá refatoração transversal.

## Estratégia de Implementação

### Fase A — fluxo estrutural e contrato de seção

1. Fixar a ordem DOM e os IDs canônicos, usando `habilidades` para a nova seção e mantendo o
   carregamento adiado entre Projetos e Depoimentos.
2. Atualizar o carregador de testes para hidratar Habilidades e substituir referências legadas a
   `#trajetoria`/`#processo` somente onde o contrato aprovado mudou.
3. Preservar a sobreposição Hero/Sobre/Projetos existente, com fluxo linear sob
   `prefers-reduced-motion`, garantindo que hash e foco não sejam encobertos.

### Fase B — Habilidades e conteúdo aprovado

1. Definir IDs estáveis para três grupos, 18 capacidades e sete tecnologias; cada capacidade terá
   exatamente duas a quatro relações explícitas e uma chave de conteúdo PT/EN.
2. Construir o painel escuro arredondado em três, duas e uma coluna, nessa ordem semântica, sem
   ilustração decorativa nem dependência do PDF original.
3. Renderizar capacidades como botões semânticos com área mínima de 44×44 px. Hover, foco e
   clique/toque selecionarão a mesma capacidade e apresentarão a mesma explicação contextual.
4. Manter um único estado `activeCapabilityId`; Escape fecha o popover sem deslocar o foco, saída de
   hover fecha apenas o estado originado por ponteiro e clique/toque permite alternância estável.
5. Expor estado principal, relacionado e neutro por atributos de dados e sinais além da cor. Aplicar
   atenuação somente com token que preserve 4.5:1 para texto normal; se 50% ou 35% falhar, usar o
   menor grau de atenuação permitido pelo contraste.
6. Tecnologias serão texto de apoio não focável e sem popover; poderão receber apenas o estado
   relacionado conforme o mapa estático.

### Fase C — consolidação responsiva da Home

1. Preservar o conteúdo atual aprovado de Sobre e seus quatro indicadores, remover a fotografia,
   centralizar horizontalmente saudação, parágrafos e CTA e aplicar aos números Space Grotesk com a
   hierarquia cromática invertida solicitada. Dividir a seção em `70%/30%` e apresentar no painel
   direito somente um indicador por vez, acima do contador de cafés, com embaralhamento e digitação
   reutilizados de `ScrambleText`, sem carrossel nem controles de navegação.
   Reutilizar o contador de cafés na base central desse painel e mover o download do currículo para
   a direita do CTA de trajetória, sem manter cópias no rodapé. Abaixo dos CTAs, apresentar a stack
   de trabalho centralizada em linhas editoriais de Front-end, Back-end, Bancos de dados e
   Infraestrutura e ferramentas, com o conjunto aprovado de tecnologias, logos e cores oficiais sem
   superfície de badge. Agrupar indicador e contador no painel direito, com o indicador diretamente
   acima do café e o conjunto alinhado ao centro vertical da stack.
   Remover numeração e peso forte das categorias, manter tecnologias em linha única alinhada à
   esquerda e ancorar o centro do contador de cafés ao divisor inferior da última categoria.
2. Fazer Sobre ocupar ao menos `115svh`, com composição interna fluida. Usar no painel esquerdo a
   superfície principal do tema ativo com granulação procedural sutil e sem recurso raster adicional;
   no painel direito, usar um meio-tom da mesma polaridade do tema sem linhas. As demais seções
   secundárias continuam com
   altura natural. Tornar a textura grip tape perceptível sem elevar o gradiente de baixo contraste.
   Integrar o retrato com fones como fundo decorativo AVIF/WebP do painel direito, usando `cover`,
   opacidade de `26%` e nenhum recuo lateral.
3. Restaurar na Home o frame global centralizado com largura máxima de `75rem`, margens laterais
   automáticas, gutters responsivos compartilhados e safe areas. Preservar superfícies, fundos e
   mídia full-bleed de Hero e Projetos, além dos containers independentes do header e das subpáginas.
   Manter o conteúdo textual do Hero em seu frame fluido próprio, sem limite máximo e alinhado à
   esquerda. Validar os breakpoints da spec.
4. Manter fundos sólidos em Sobre, Projetos e Depoimentos; Contato continua sendo a única seção com
   superfície transparente e blur.
5. Corrigir colisões de cases em 768–1023 px e compactação do Footer apenas quando a evidência de
   teste/renderização demonstrar necessidade. Em Contato, agrupar marcador, convite editorial,
   introdução e contatos principais em uma coluna à esquerda do formulário discretamente mais
   estreito, com mensagem autoral localizada em PT-BR e EN-US. Mover o
   FAQ recolhível de cinco itens integralmente para Habilidades, abaixo do processo de três etapas,
   preservando conteúdo, filetes, interação e ordem semântica no reflow estreito.
6. Preservar `picture`, transparência, proporções e seleção DPR; gerar somente as variantes
   responsivas necessárias para o novo retrato, sem servir o PNG-fonte diretamente ao navegador.
7. Substituir somente a galeria de Projetos por três cards verticais editoriais no desktop, usando
   Flexbox para expansão horizontal por hover/foco sem alterar a largura total. Manter poster e vídeo
   no mesmo card, carregar e reproduzir apenas a prévia ativa, preservar o card inteiro como link para
   o case e refluir para duas colunas no tablet e uma no mobile. Cabeçalho, convite final, dados,
   rotas, ordem, traduções, tokens e páginas de case permanecem inalterados.
8. Preservar o container independente do Header e reorganizar o Footer em duas faixas separadas por
   um único divisor: selos, links legais, navegação e Core Web Vitals no topo; marca, autoria,
   localização e hora local na base. Remover agradecimento e conexões, padronizar ritmo e entrelinha,
   alinhar Website Carbon à esquerda, compactar os pares de Vitals sem eliminar o respiro após o
   título, listar as seis seções da Home e posicionar os links legais por extenso acima do divisor e
   da localização. Manter cores e reflow existentes.

### Fase D — provas e convergência

1. Atualizar testes legados que ainda esperam Trajetória, processo ilustrado ou composição anterior
   de Sobre, sem relaxar inventário de overflow, foco ou contraste.
2. Adicionar prova dedicada para 18 capacidades, três grupos, sete tecnologias, relações 2–4,
   paridade mouse/teclado/toque, Escape, foco, PT/EN, temas e 3/2/1 colunas.
3. Executar inspeção renderizada em 320×568, 412×915, 768×1024, 1023×600, 1440×900 e 1920×1080,
   incluindo estados padrão, ativo e movimento reduzido.
4. Na finalização, executar `npm run lint`, `npm run typecheck`, `npm run test:api`,
   `npm run test:a11y`, `npm run build` e, imediatamente antes de staging/commit,
   `npm run carbon:check`. Qualquer falha bloqueia a conclusão e deve ser corrigida sem ampliar o
   escopo silenciosamente.

### Fase E — arquitetura tipográfica consolidada

1. Centralizar em `src/styles.css` os tokens de família, peso, escala, entrelinha, tracking e medida
   de leitura; manter nos componentes apenas os papéis semânticos necessários ao contexto.
2. Migrar Home, Sobre, cases, Header, Footer, formulários e páginas informativas para os papéis de
   título geral, display, editorial, corpo, interface, metadado, ênfase e indicador numérico.
3. Preservar como exceções documentadas o wordmark, o selo Website Carbon e monospace restrito a
   código/terminal; remover Caveat e declarações sem consumidor.
4. Provar a migração nos breakpoints, idiomas, temas e zoom definidos em FR-032 antes dos gates
   consolidados, sem alterar layout, conteúdo ou interação.

## Rastreamento de Complexidade

### Fade por linha conforme CSS fornecido — 2026-11-11

Substituir máscara/RAF por camada visual aria-hidden com linhas reais medidas no texto semântico
original. Preservar os parágrafos no fluxo e posicionar a camada visual sobre eles com o mesmo gap;
aplicar o snippet de fade de 300ms com stagger global de 100ms e line-height 1.55. Pausar animações
fora de vista, redesenhar linhas em resize/fontes e liberar leitura do carrossel no animationend
da última linha. Movimento reduzido mostra somente texto semântico, sem camada animada.

### Revelação vertical por linha dos depoimentos — 2026-11-11

Extrair TestimonialQuoteText mantendo parágrafos semânticos originais. Medir linhas por Range
após seleção/fontes e em resize; aplicar máscara opaca com borda que desce sobre cada linha,
sequenciada por requestAnimationFrame a 500ms + 80ms, sem alterar fluxo/tamanho. Cancelar RAF
e observers ao trocar/desmontar, pausar quando inativo e exibir tudo sob movimento reduzido.
Retirar fade do card inteiro, preservando entrada apenas do painel de autoria. Carrossel aguarda
callback de conclusão antes de iniciar seu tempo de leitura. Inspecionar ritmo/reflow/controle
em mobile/desktop, sem testes/gates.

### Rodapé restaurado e onda da faixa de Princípios — 2026-11-11

Restaurar estrutura footer-primary-grid/footer-middle com selos e wordmark, mantendo links e
métricas sem caixas por overrides locais footer-restored. Reutilizar relatório ambiental gráfico,
privacidade, links e relógio. A tentativa textual T304 foi substituída por esta composição.
No mobile, recortar visualmente o final da faixa de Princípios com pseudo-elemento de 24–32px,
usando máscara SVG estática e background do tema dentro do padding inferior existente. Não alterar
altura, margens ou conteúdo. Inspecionar ambos os resultados em mobile/desktop e nos dois temas.

### Rodapé textual com conteúdo integral — 2026-11-11

Recompor Footer em cabeçalho de localização/horário, grade de navegação e Core Web Vitals,
relatórios ambientais textuais e base de marca/copyright/legais. Eliminar imports/render de
ícones e trocar wordmark gráfico por identidade textual. Adicionar apresentação text ao
WebsiteCarbonBadge preservando grade, emissão, comparação, data e URL. Usar classes site-footer
para evitar regras antigas de botões mobile, mantendo foco/áreas de toque. Inspecionar 320/390/1440px,
idiomas, conteúdo e ações; manter testes/gates adiados.

### Home sem divisores entre seções — 2026-11-11

Ocultar section-rule-reveal somente no escopo home-visual e zerar a borda superior do footer
nesse mesmo escopo. Remover regras locais redundantes de largura/posição dos divisores da Home,
sem alterar SectionShell compartilhado com outras páginas nem linhas internas. Inspecionar
visibilidade e preservação de acentos/ritmo em mobile e desktop, sem testes/gates.

### Intervalos mobile de 84px e revelação individual dos princípios — 2026-11-11

Sobrescrever somente o token mobile --home-section-start para 5.25rem, reutilizando a divisão
em metades da faixa de Princípios. Observar o botão de cada DevelopmentPrinciple abaixo de 48rem,
após page-revealed; abrir uma vez e desconectar ao entrar na viewport com margem inferior de 96px.
Manter transição existente, prioridade manual e observador desktop do título em Skills.
Medir intervalos reais e verificar abertura progressiva/sem reabertura, sem testes/gates.

### CTA de Serviços para o formulário — 2026-11-11

Remover ServicesIllustration do render/import de Skills e inserir âncora primária com texto
nav.talk, usando scrollWithMomentum e fallback nativo para o formulário já preparado. Manter
hash #contact-form e foco no próprio formulário com tabindex -1, sem forçar foco em campo/teclado.
Usar ID do formulário como destino para evitar que a interceptação global de âncoras do Lenis
redirecione ao topo da seção. Header deve aceitar o destino pelo próprio ID quando não há heading.
Aplicar respiro de 28px ao CTA e scroll-margin ao formulário. Inspecionar desktop/mobile sem testes.

### Prompts sequenciais com pausa entre ciclos — 2026-11-11

Usar sequências constantes mobile/desktop com duração por etapa em `ProjectInteractionHint`.
Remover a introdução simultânea: uma única fase é renderizada por vez; a pausa de `10s` ocorre
após ambas as mensagens mobile. Manter timers condicionados à atividade e tamanho intrínseco.

### CTAs Sobre: currículo mobile e botão desktop compacto — 2026-11-11

Reutilizar o contrato do link PDF dentro da faixa mobile de CTAs, com layout em coluna, gap de
12px e alinhamento central. Aplicar btn-primary w-fit ao link desktop de Sobre, mantendo o texto
existente e a escala padrão de controle. Conferir mobile 320/412px e desktop 1440px em PT/EN.

### Indicadores com leitura inicial e ritmo de 10 segundos — 2026-11-11

Substituir o ciclo CSS de `8s` por estados explícitos em `ProjectInteractionHint`, iniciando com
os dois prompts mobile, depois avançando a cada `10s` apenas enquanto ativo e visível. Usar
largura intrínseca, ícones de `28px` e padding uniforme. Animar dimensões medidas com Web Animations
e entrada do conteúdo com CSS; cancelar animações/timers ao sair ou desmontar. Desktop usa somente
clique; movimento reduzido conserva os prompts sem timers. Inspecionar geometria e intervalos.

### Bootstrap com prontidão real e efeitos por chegada — 2026-11-11

Montar todas as seções da Home diretamente, preservando conteúdo e gates de atividade. Adicionar
coordenador React de preparo no root: aguardar router ocioso, tarefas iniciais registradas,
fontes, decode de imagens (incluindo slides ocultos) e canplay do Hero. Forçar imagens lazy a
eager durante preparo; usar fallback local para erros/timeouts. Loader externo reage a evento de
pronto, bloqueia interação/scroll e libera evento de revelação após o fade. Gatilhos JS de viewport
e CSS aguardam revelação. Hero prepara sem reproduzir atrás do loader e inicia após revelação
em qualquer viewport; respeitar movimento reduzido e falhas de autoplay. Validar com recursos
atrasados/falhos em inspeção de browser, sem executar testes, build ou gates nesta rodada.

### Indicadores de interação autorais nos cards — 2026-11-11

Extrair `ProjectInteractionHint` com SVGs próprios e duas fases na mesma cápsula. CSS coordena
largura, opacidade, deslocamento e microanimações do gesto; animação mobile roda somente no card
ativo, desktop expande a legenda de clique por estado ativo/foco. Movimento reduzido mostra
legendas estáticas sem animação. Remover indicador legado/play e localizar dois prompts.

### Aplicação do idioma somente após reload — 2026-11-11

Adicionar opção `applyImmediately` à persistência de idioma, mantendo comportamento imediato
como padrão da API. `AppProvider` salva com `applyImmediately: false` e recarrega. Assim,
`publish` não altera estado/documento antes do unload; bootstrap existente lê `gf-lang` no novo
documento. Inspecionar beforeunload e navegação nos controles mobile/desktop.

### Navegação suave com seções adiadas — 2026-11-11

Reprodução mobile fria encontrou scroll calculado com documento de `1571px`, crescendo a `7150px`
durante o trajeto: destino Contato terminou mais de `4700px` abaixo da viewport. Em Header,
solicitar módulos até o destino e aguardar headings presentes antes de dois frames de layout,
cancelando listener/frames ao trocar seleção ou desmontar. Recalcular dimensões Lenis antes de
scrollTo; preservar fallback nativo, foco sem scroll e preferência de movimento reduzido.

### Reload na troca de idioma — 2026-11-11

Centralizar em `AppProvider.setLang`: ignorar seleção idêntica, persistir pela API de preferências
existente e chamar `window.location.reload()`. Manter o mesmo callback nos controles mobile e
desktop e conferir preferência/document.lang após uma navegação real do browser.

### Controles mobile e autoplay do Hero — 2026-11-11

Aplicar dimensões mobile no escopo da Home para CTAs e links sociais de Sobre/Contato; manter
ritmo interno existente. Corrigir cores explícitas dos links/ícones do rodapé para a paleta local
clara sobre fundo escuro. Introduzir intenção `mobile-autoplay` no Hero em efeito de montagem,
sem aguardar input e respeitando movimento reduzido. Reutilizar load/play e controles existentes.
Inspecionar tamanhos, contraste claro/escuro e reprodução em contexto mobile sem input.

### Separação cromática de Princípios no mobile — 2026-11-10

Abaixo de `48rem`, aplicar faixa full-bleed com pseudo-elemento e token `accent-soft` no bloco
Princípios. Usar metade do intervalo como margem superior e metade como padding superior/inferior;
reduzir a entrada de Depoimentos para a metade restante. Manter `56px` entre composições e
respeitar ambos os temas sem novos divisores, mudança de copy ou alteração desktop.

### Introdução Sobre mais baixa no mobile — 2026-11-10

No breakpoint abaixo de `48rem`, substituir `margin-block: 0 1.5rem` por `margin-block: 0` em
`.about-template__intro`. O alinhamento ao final da linha do retrato desloca o bloco `24px` para
baixo sem transform visual, sem mover a foto ou alterar o fluxo das seções seguintes.

### Ritmo vertical uniforme da Home — 2026-11-10

Unificar `--home-section-start` em `clamp(3.5rem, 6vw, 6rem)`. Remover overrides de entrada
de Sobre, Serviços e Depoimentos, paddings inferiores das composições principais e alturas
mínimas/margens automáticas das seções não Hero a partir de 1920px. Serviços mantém entrada
única; overview não tem padding inferior e Princípios recebe somente a entrada compartilhada.
Manter Contato com respiro inferior antes do rodapé. Medir limites das composições e confirmar
ausência de acúmulo no intervalo Princípios → Depoimentos em 360/768/1440/1920px, sem testes.

### Loader sem deslocamento durante bootstrap — 2026-11-10

Diagnóstico renderizado identificou deslocamento de `24px` nos dois eixos quando o reset global
altera o overlay de content-box para border-box; a fonte aumenta a largura mínima do sufixo em
`ch`, causando deslocamento horizontal adicional. Definir border-box no overlay em `preloader.css`
e largura fixa de `4em` para o sufixo, sem alterar fontes, timers ou animações. Comparar geometria
antes/depois da chegada do CSS e da fonte em 360/1440px, com carregamento atrasado para inspeção.

### Proporção dos itens de Serviços e Princípios no desktop — 2026-11-10

Definir os tokens locais de título de conteúdo (`18px`), entrelinha (`1.35`) e corpo (`15px`)
apenas em `.services-section__item`, dentro de `min-width: 48rem`. Redefinir também o alias
`--heading-content-size`, usado pelo reset de headings, para evitar divergência de cascata.
Preservar tipografia editorial principal e mobile. Inspecionar PT/EN em desktop e reflow mobile.

### Refinamentos mobile de Serviços, Princípios e Depoimentos — 2026-11-10

Restringir o observador de entrada dos princípios à media query `min-width: 48rem`, acompanhando
mudanças de breakpoint e limpando observadores/listeners. Reutilizar o estado inicial fechado e o
controle por toque. Aplicar somente abaixo desse breakpoint largura de 90% à arte e título de
Depoimentos de `22–24px`. Inspecionar 320/360/412px e confirmar preservação em 768/1440px, sem testes.

### Hierarquia tipográfica compartilhada em Serviços e Princípios — 2026-11-10

Aplicar os papéis existentes `section-editorial-title`, `section-editorial-intro`, `content-title`
e `body-copy` nos componentes, removendo overrides de fontes/tamanhos/pesos/entrelinhas/tracking
do CSS local. Reutilizar o filete editorial e manter classes locais somente para composição,
espaçamento e disclosure. Comparar os estilos computados com Projetos e entre serviços/princípios
em desktop e mobile, sem executar testes/gates.

### Ilustração única na introdução de Serviços — 2026-11-10

Substituir `ServiceIllustration` e suas quatro cenas por `ServicesIllustration`, SVG sem personagens
com dispositivos/ferramentas conectados. Renderizar somente após o parágrafo da coluna esquerda,
remover metadados de arte por serviço e o alinhamento flex exclusivo das artes antigas. Preservar
variáveis locais de tema e dimensões fluidas. Inspecionar localização, ausência de arte nos itens,
temas e viewport estreito sem executar testes/gates.

### Introdução dos princípios por entrada na viewport — 2026-11-10

Observar o título de Princípios em `Skills.tsx` com `IntersectionObserver` e desconectar após a
primeira interseção. Acionar abertura escalonada de cada disclosure, cancelável por interação
manual e sem repetição. Simplificar `DevelopmentPrinciple` para um estado de abertura, removendo
hover/foco como gatilhos; preservar botão nativo, ARIA e Escape. Usar chaves estáveis por posição
para conservar o controle manual entre traduções; em movimento reduzido, eliminar o intervalo.
Inspecionar entrada, clique, ausência de hover/foco e toque sem executar testes/gates.

### Disclosures dos princípios — 2026-11-10

Extrair `DevelopmentPrinciple` com botão semântico, ids por `useId`, estados de hover/foco/fixação
por clique e fechamento por Escape. Animar o painel por grid `0fr → 1fr` com overflow contido e
opacidade, mantendo `aria-hidden` e `inert` coerentes. Aplicar o componente apenas à lista inferior
em `Skills.tsx`; preservar textos e ilustrações. Inspecionar hover, teclado e toque com animação
normal/reduzida; testes e gates permanecem adiados.

### Quatro ilustrações autorais de Serviços — 2026-11-10

Criar `ServiceIllustration.tsx` com quatro cenas SVG e elementos compartilhados de personagem,
plataforma e material. Prefixar os ids de gradientes com `useId`, evitar texto embutido e animação,
e usar variáveis locais para adaptar papel/filetes ao tema. Associar cada serviço a um identificador
estável no dicionário PT/EN e renderizar a arte abaixo da descrição em `Skills.tsx`. Manter os
textos intactos; usar flex para alinhar as artes na base das células e dimensões fluidas. Inspecionar
desktop e tela estreita sem executar testes ou gates nesta rodada.

### Revisão de capitalização e acentos — 2026-11-10

Revisar o dicionário, catálogo de projetos, cargos de autoria de Depoimentos, legendas de Sobre e
títulos de páginas/metadados. Aplicar caixa de frase aos títulos autorais e preservar nomes
próprios, marcas, cursos oficiais e siglas. Corrigir o plural de LLMs, meses portugueses e frases
do formulário sem reescrever os depoimentos/citações. Inspeção renderizada direcionada de Home,
Princípios e título de Privacidade, com testes e gates adiados na iteração rápida.

### Restauração dos três cards expansíveis — 2026-11-10

Reconstruir `ProjectCard` e o CSS de showcase a partir da apresentação anterior registrada em
T211–T221 e do código inspecionado antes da migração para banners. Restaurar o modelo flex desktop
com fatores `2 / 0.5 / 0.5`, metadados em duas orientações e faixa desfocada de repouso; reativar
grade tablet e carrossel móvel com clones de continuidade. Reutilizar o player atual para aguardar
frame e concluir fade antes de liberar `src`, sem carregar vídeo na entrada automática do carrossel.
Preservar as outras seções e as remoções de conteúdo já solicitadas. Inspecionar os estados de
repouso/ativo em desktop; não executar testes ou gates nesta rodada.

### Revisão de voz e redundância de Serviços — 2026-11-09

Usar a apresentação pessoal de Sobre, os resumos dos três projetos e a voz textual do MIV como
referência: trabalho prático, entendimento de contexto e responsabilidade pessoal. Reescrever
`t.skills` em PT/EN, distinguindo serviços oferecidos de práticas de trabalho; recuperar suporte
em TI já descrito no histórico público da Home. Reduzir oito tópicos repetidos para seis e adaptar
somente a grade inferior para três colunas. Inspeção visual desktop em ambos os idiomas/temas;
testes e gates permanecem adiados por solicitação explícita.

### Ícones de stack nos projetos — 2026-11-09

Inserir `TechnologyIcon` para cada entrada de `project.stack` dentro do bloco de ações existente,
em lista com `flex-wrap` acima de `ProjectActions`. Reusar as cores/glyphs temáticos atuais e estender
o cursor com `data-cursor-label` para rótulos informativos sem prefixo de navegação. Preservar os
demais blocos e conteúdo. Inspeção renderizada direcionada, sem testes/gates nesta rodada.

### Serviços e Mais do que código — 2026-11-09

Substituir o conteúdo de `Skills.tsx` por uma seção estática sem dependências novas, preservando o
id `habilidades` e o carregamento adiado. Usar headings semânticos para os dois blocos e listas de
quatro serviços e oito práticas. Substituir `t.skills` em PT/EN pelo conteúdo integral do mockup e
tradução equivalente. Adicionar CSS restrito a `services-section`, com frame máximo de 1110px,
introdução lateral, grades 2×2 e 4×2, linhas finas e reflow para duas/uma coluna. Inspecionar em
1400px, registrando evidência separada dos testes e gates adiados.

### Restauração da composição editorial alternada — 2026-11-09

Usar `a72824b:src/components/sections/Projects.tsx` como referência verificável para mídia, badges,
detalhes, ações e convite final, aplicando a alternância registrada em T109 a todos os projetos.
Substituir o carrossel/grade de banners por uma lista de linhas editoriais, com inversão visual
dos itens pares a partir de 1024px e empilhamento em telas menores. Remover o CSS exclusivo da
galeria substituída, restaurar os limites globais de conteúdo e manter o preview adiado e o fade.
Inspecionar desktop e registrar o resultado; validações automatizadas ficam pendentes.

### Iteração desktop de Projetos — 2026-11-09

1. Reutilizar `ProjectCard`, os assets e o carregamento de preview por intenção existentes.
2. Acrescentar contexto curto localizado PT/EN ao catálogo e conteúdo de overlay no componente.
3. Substituir apenas o bloco CSS de desktop (`min-width: 64rem`) por grade estável de duas colunas,
   frames `1.28:1`, badges superiores e conteúdo centralizado com ações na base.
4. Inspecionar os estados de capa e hover no desktop; manter validações automatizadas adiadas até
   solicitação de finalização e preservar o CSS mobile/tablet.
5. Refinamento de mídia: gerar posters AVIF/WebP diretamente dos vídeos com
   `node scripts/generate-project-preview-posters.mjs`, em `0.1s` e resolução nativa. Usar esses
   posters apenas no desktop via `ImageCover.desktopImage`; manter sources móveis existentes.
   Preencher o frame com mídia centralizada e escala proporcional (`cover`), aguardar frame apresentado e remover `src` somente
   após o crossfade de saída (`320ms`), sem alterar o frame externo ou os badges.
6. Restaurar a caixa do cursor com opt-in `data-cursor-tooltip="media"` no link sobreposto, sem
   exigir que ele contenha os elementos visuais do card.

Não há violações a justificar. A solução não adiciona projeto, dependência, serviço, persistência ou
abstração arquitetural.

### Espaçamento entre seções — 2026-11-12

Aplicar a skill speckit-implement na feature ativa. O runner portfolio-sdd foi tentado e falhou
antes de gerar artefatos por modelo indisponível. Introduzir --home-section-gap como o dobro
de --home-section-start e usar somente no padding de entrada das seções principais, incluindo
os overrides de Sobre e a metade mobile de Depoimentos. Manter o token original nas composições
internas e na saída de Contato. Comparar geometria antes/depois em 320/412/768/1440px e
inspecionar screenshots. Iteração rápida: gates consolidados ficam pendentes, sem staging/commit.
Análise: escopo restrito a CSS, sem mudanças em contratos, dados ou acessibilidade semântica.

Evidência T328: padding de entrada duplicado em 320/412/768/1440px; Hero e Princípios internos
inalterados; nenhum overflow horizontal. Screenshots desktop/mobile inspecionados em tmp/.
Convergência direcionada sem trabalho funcional restante. Prettier --check sinaliza os quatro
arquivos alterados; formatação global e lint/typecheck/build/testes/carbono ficam pendentes
para finalização consolidada, evitando reformatar o trabalho existente nesta iteração.

### Composição editorial de Sobre — 2026-11-12

Reorganizar About.tsx em texto/ações/redes/café e figure; trocar o CSS legado de sobreposição por
grade de duas colunas em desktop e pilha mobile. Reutilizar assets responsivos e copy PT/EN,
remover labels intermediárias e CTAs duplicados mobile; manter aria-label/heading semântico oculto.
Fundo do retrato usa foreground (inversão de tema); imagem cover com foco superior corta na cintura.
Inspecionar 320/412/768/1440, temas e idioma EN, teclado/download/navegação e redução de movimento.
Análise: alteração isolada de composição sem novos contratos/dependências, compatível com MIV.
Iteração rápida via speckit-implement; gates consolidados permanecem pendentes, sem commit/deploy.

Evidência T329: inspeção renderizada após saída real do loader em 320/412/768/1440px, temas
claro/escuro e redução de movimento. Retrato quadrado (224/316/273,47/512px), à direita a partir
de 768px e abaixo no mobile; fundo #172033 / #F2EFE8; sem overflow ou erros de página. Screenshots
em tmp/about-layout-*.png e geometria em tmp/about-layout-geometry.json. Download por Enter
confirmado com nome Guilherme-Eleutherio-Curriculo.pdf; CTA navega a /sobre; idioma EN conferido.
Café preservado com estado indisponível da API local. Diretrizes MIV atualizadas para a composição.
Convergência direcionada: requisitos implementados; sem pendências funcionais desta tarefa.
Lint, formatação consolidada, typecheck, build, testes e carbono permanecem pendentes para
finalização consolidada; nenhuma publicação, staging ou commit realizados.

### Correção de contraste de Sobre — 2026-11-12

O seletor geral de superfícies contém transparência, mas Sobre já herda uma regra mais específica; a
inspeção anterior usava apenas movimento reduzido. O estado reportado não se reproduziu no preview atual. Reforçar o mesmo background-color explícito
de Projetos/Serviços também em Sobre, preservando foreground no quadrado da foto. Verificar
alternância claro/escuro/claro com movimento normal. Iteração rápida, gates consolidados pendentes.

Evidência T330: fundo explícito aplicado à seção e ao container, sem alterar a foto. Alternância
claro/escuro/claro com movimento normal: Sobre e Projetos usam #F7F6F2 / #0E131B; foto usa
#172033 / #F2EFE8. Screenshot escuro inspecionado em tmp/about-theme-after-dark.png. A falha
original não foi reproduzida antes da mudança no preview atual; a correção explicita o fundo
no container de conteúdo e elimina dependência de camadas subjacentes. Gates consolidados
permanecem pendentes. Sem mudanças de layout ou do comportamento do café/CTAs/download.

### Contraste explícito de Sobre — 2026-11-12

Após nova captura do usuário, substituir dependência de herança do fundo de Sobre por seletores
explícitos em seção/container/grade. Reutilizar os valores canônicos MIV, com foto invertida.
O preview local anterior não reproduz a captura; nenhuma sessão conectada disponível para
inspecionar o browser do usuário. Verificar alternância pelo handler real do botão e inspecionar
as cores de todas as camadas. Iteração rápida: gates consolidados permanecem pendentes.

Evidência T331: controle React real de tema acionado em claro/escuro/claro, movimento normal.
Sobre escuro e Projetos: rgb(14,19,27); texto: rgb(242,239,232); foto: rgb(242,239,232).
Claro: seção rgb(247,246,242), texto/foto rgb(23,32,51). Screenshot escuro inspecionado em
tmp/about-theme-explicit-dark.png. Fonte executável alterada: regras explícitas de superfície
por tema e tokens locais de texto em styles.css. Não há sessão de browser do usuário conectada;
verificação referente ao preview localhost:5173. Gates consolidados permanecem pendentes.

Diagnóstico T331 após identificação da URL: usuário acessa http://192.168.0.24:5173/ e confirmou
que localhost mostra o resultado correto. Respostas CSS atuais dos dois endereços possuem SHA256
idêntico (8B4B05724A5C7C358DAC35C0A54824EF1CA2F49B277BB3CFB8BE7FCAF444DF6A).
Inspeção renderizada também na URL LAN, com controle de tema real, confirma fundo #0E131B,
texto #F2EFE8 e foto clara no escuro. Não é diferença atual de código servido por host; estado
antigo do browser é hipótese, não causa comprovada. Preferências localStorage são por origem.
Nenhuma alteração adicional de implementação necessária nesta comparação.

### Centralização do conteúdo de Sobre — 2026-11-12

Via speckit-implement, aplicar text-align/justify-items ao conteúdo e à introdução, e centralizar
as linhas flexíveis de ações/redes/café. Inspeção renderizada na URL LAN em desktop/mobile;
iteração rápida, gates consolidados pendentes. Sem novos componentes ou dependências.

Evidência T332: screenshots renderizados em 412/1440px, claro/escuro, na URL LAN inspecionados;
texto/ações/café centralizados, retrato preservado e nenhum overflow/erro de página. Gates
consolidados permanecem pendentes.

### Ajustes exclusivos mobile — 2026-11-12

Executar via speckit-implement na feature ativa. Foto ocupa primeira linha por CSS mobile.
Agrupar copy/CTA Serviços em um único elemento e posicioná-lo no final do DOM mobile via matchMedia, preservando ordem de leitura/foco; desktop mantém a posição atual.
Projetos usa matchMedia móvel e listener scroll com requestAnimationFrame: ativar card que
contém o centro da viewport, preservando altura total do acordeão para evitar deslocamento.
Reutilizar player e estado de interação desktop; pausar saída e respeitar movimento reduzido.
Inspecionar URL LAN em 320/412/768/1440px e rolagem direta/reversa. Iteração rápida, gates pendentes.

Evidência T333–T335: URL LAN inspecionada em 320/412/768/1440px, sem overflow/erros de página.
Em mobile retrato precede saudação e fechamento Serviços fica após toolbar; >=768px conserva
ordem original. Rolagem nos cards 0/1/2/1/0: apenas um expandido com 448px e vídeo reproduzindo;
saída recolhe todos a 176px e pausa os três vídeos. Movimento reduzido mantém vídeos pausados.
CTA final foca contact-form. Screenshots em tmp/mobile-order-*.png inspecionados após aguardar
revelação do texto. Convergência direcionada sem trabalho funcional restante; testes/lint/
typecheck/build/carbono permanecem pendentes para finalização consolidada. Sem commit/deploy.

### Fechamento interno de Princípios no mobile — 2026-11-12

Via speckit-implement, mover o fechamento condicional mobile para dentro de knowledge e remover
os pseudo-elementos que pintam azul/onda. Reduzir margem do fechamento a 1.5rem e manter
padding da seção. Inspecionar LAN, claro/escuro, mobile/desktop e destino/foco do CTA.
Iteração rápida: gates consolidados pendentes.

Evidência T336: LAN em 320 claro/412 escuro/1440 escuro; fechamento dentro de knowledge somente
em mobile, distância de 24px após toolbar; ::before/::after sem conteúdo, sem azul/onda e sem
overflow. Screenshots tmp/principles-closing-*.png inspecionados. CTA foca contact-form nas três
larguras. Desktop mantém fechamento na introdução. Gates consolidados continuam pendentes.

### Intervalo Projetos–Serviços mobile — 2026-11-12

Via speckit-implement, diminuir altura do acordeão sem card ativo para soma dos três cards
recolhidos e gaps; reduzir padding superior de Serviços de 328px para 64px. Inspecionar distância
renderizada e rolagem reversa na LAN; gates consolidados pendentes nesta iteração rápida.

Evidência T337: distância renderizada do fim do último card ao título Serviços = 64px em
320/412px, reserva vazia = 0 e sem overflow. Desktop mantém padding 172.8px em 1440px.
Rolagem 0/1/2/1/0 preserva expansão/reprodução, saída recolhe e pausa, movimento reduzido
pausa vídeos. Screenshot tmp/project-service-gap-412.png inspecionado. Gates consolidados
seguem pendentes; sem staging/commit/deploy.

### Reserva de expansão como único intervalo mobile — 2026-11-12

Via speckit-implement, remover regra que encurta acordeão sem card ativo e zerar padding superior
mobile de Serviços. Confirmar que intervalo coincide exclusivamente com reserva do acordeão.
Iteração rápida; gates consolidados pendentes.

Evidência T338: 320/412px, intervalo = reserva do acordeão = 272px; padding de entrada = 0px,
sem overflow. Desktop preservado em 1440px. Screenshot LAN inspecionado; gates pendentes.

### Rodapé: marca ampla e linha institucional — 2026-11-12

Via speckit-implement, agrupar marca ampliada e selos na coluna esquerda. Mover nav legal à
linha final com LocalTime/copyright em grade 1fr/auto/1fr no desktop e pilha mobile. Usar somente
GuiferWordmark com tamanho responsivo e círculo proporcional. Atualizar MIV para escala footer.
Inspecionar LAN em 320/412/768/1440/1920px, temas e geometria central. Gates consolidados pendentes.

Evidência T339: LAN em 320/412/768/1440/1920px, sem overflow/erros de página. Desktop: hora e
links legais na mesma linha (delta y = 0), copyright centrado no container com erro <0.01px.
Wordmark acima dos badges, largura 203px mobile e 439–447px desktop, círculo proporcional.
Linha institucional empilha e fica após navegação/métricas no mobile. Privacidade abre e fecha
por Escape. Screenshots tmp/footer-layout-*.png inspecionados; selo remoto Green Web carregou
fallback na inspeção local, sem alteração de URL/contrato. Hora mantém Intl America/Sao_Paulo.
Convergência direcionada sem pendências funcionais; gates consolidados permanecem pendentes.

### Cores do rodapé por tema — 2026-11-12

Via speckit-implement, alinhar tokens footer globais à paleta ativa e valores Paper & Steel
claros aos demais componentes. Remover superfície branca translúcida local, herdando o token
MIV. Inspecionar claro/escuro desktop/mobile na LAN, alternância e cores de texto/marca.
Iteração rápida, gates consolidados pendentes.

Evidência T340: LAN, 412/1440px, claro/escuro: fundo, texto principal e secundário computados
correspondem exatamente aos hex MIV da spec. Sem overflow ou erros de página; marca/negativo
contrastantes e copyright central preservado. Privacidade abre e fecha por Escape nos dois
temas. Screenshots tmp/footer-light-_.png e tmp/footer-dark-_.png inspecionados. Gates de
finalização consolidada permanecem pendentes; sem commit/deploy.

### Wordmark do Footer: efeito e acabamento — 2026-11-12

Via speckit-implement, reutilizar GuiferWordmark animateSuffix em overlay aria-hidden montado
no hover/foco. Marca estática mantém geometria e nome; overlay não participa do layout. Manter
ciclo compartilhado com Header e comportamento reduzido. Usar color-mix sólido tonal com
foreground/footer-bg e opacity 1; preservar fontes/tamanhos. Inspecionar LAN nos dois temas,
hover repetido, foco, geometria e movimento reduzido. Gates consolidados pendentes.

Evidência T341: LAN em 1440 claro/escuro e 412 escuro; hover repetido produz caracteres
intermediários e retorna a fer.tech; largura/altura do link com delta 0 em todas as amostras.
Opacity computada 1 e cor tonal sólida nos dois temas. Foco monta animação; movimento reduzido
remove overlay e mantém marca inteira. Screenshots tmp/footer-scramble-*.png inspecionados.
Gates consolidados permanecem pendentes; sem alteração de comportamento do Header.

### Decrypted Text no wordmark Footer — 2026-11-12

Via speckit-implement, adaptar o efeito scramble/hover padrão do React Bits DecryptedText,
fonte https://github.com/DavidHDev/react-bits/blob/main/src/ts-default/TextAnimations/DecryptedText/DecryptedText.tsx.
Componente pequeno dedicado usa pool/50ms/10 iterações originais, sem importar opções de flip,
loop ou medição de canvas não utilizadas. GuiferWordmark aceita texto visual descriptografado
opcional, mantendo semântica/layout normais fora do overlay. Camada estática mantém caixa do link.
Validar hover repetido, foco/redução, tamanho e temas na LAN. Gates consolidados pendentes.

Evidência T342: LAN, 1440 claro/escuro e 412 escuro. Duas entradas hover por contexto produzem
strings aleatórias de 11 caracteres e resolvem para guifer.tech, com delta de largura/altura 0.
Focus ativa overlay; reduced motion desmonta overlay e mantém marca completa. Opacity 1 e cores
anteriores preservadas. Screenshot em execução tmp/footer-decrypted-dark-1440.png inspecionado.
Nenhuma dependência nova ou alteração do efeito do Header; gates consolidados pendentes.

### Decrypted contínuo e sem recorte — 2026-11-12

Via speckit-implement, manter intervalo até desmontagem do overlay. O clipping foi localizado
em overflow-hidden da camada e de cada célula. Remover ambos e ajustar glifo pela razão entre
largura disponível e natural (scaleX, centralizado), seguindo a estratégia da referência React Bits.
Inspecionar duração >1s, saída/foco/redução e glifos completos nos dois temas, sem alterar dimensões.
Gates consolidados pendentes nesta iteração rápida.

Evidência T343: LAN 1440 claro/escuro e 412 escuro. Scrambling continua após 1.9s, repetido
em duas entradas por contexto; saída desmonta overlay e restaura a marca. Largura/altura do
link têm delta 0; glyph clipping removido nas duas camadas, glifos ajustados com scaleX.
Screenshot durante execução inspecionado. Movimento reduzido mantém marca completa, overlay 0;
a inspeção aguarda aplicação real da preferência em vez de supor atualização em 100ms.
Gates consolidados pendentes nesta iteração rápida.

### Scramble localizado com inércia — 2026-11-12

Via speckit-implement, armazenar posição em ref, medir células e animar janela de três índices
centrada no mais próximo. Timeout de 50ms desacelera até 200ms na cauda de 650ms, reduzindo
região até zero. Reentrada cancela parada; Footer mantém overlay na cauda. Inspecionar LAN.
Iteração rápida, gates consolidados pendentes.

Evidência T344: LAN 1440px, cursor nos índices 0/5/10 modifica apenas 0–2/4–6/8–10.
Cauda permanece aos 100ms e termina antes de 750ms; tamanho do link com delta 0. Movimento
reduzido mantém marca estática. Screenshot tmp/footer-local-scramble.png inspecionado sem
clipping. Gates consolidados pendentes.

### Ordem marca/selos do Footer — 2026-11-12

Via speckit-implement, inverter ordem DOM dos dois blocos e remover order mobile antigo dos
badges. Inspecionar mobile/desktop na LAN; gates consolidados pendentes.

Evidência T345: LAN em 412/1440px, badges acima do wordmark, sem overflow/erros. Copyright
centrado e Privacidade funcional. Screenshot desktop inspecionado. Gates consolidados pendentes.

### Reversão da ordem do Footer — 2026-11-12

Via speckit-implement, restaurar ordem DOM logo/badges e order mobile anterior. Nenhuma outra
mudança revertida; validação visual direcionada, gates consolidados pendentes.

Evidência T346: LAN 412/1440px confirma logo acima dos badges, sem overflow/erros. Somente a
ordem de T345 foi revertida; efeitos/cores/tamanhos permanecem. Gates consolidados pendentes.

### Redução discreta da marca Footer — 2026-11-12

Via speckit-implement, escalar limites e valor fluido do clamp por 0.9: 2.25rem/5.4vw/4.95rem.
Círculo em em acompanha proporcionalmente. Inspecionar mobile/desktop na LAN; gates pendentes.

Evidência T347: LAN, 412/1440px, logo mede 182.875/395.031px (redução de 10%); acima dos badges,
sem overflow/erros. Screenshot desktop inspecionado. Gates consolidados pendentes.

### Agradecimento e marca compacta no Footer — 2026-11-12

Via speckit-implement, trocar bloco grande por p section-editorial-intro, localizado no dicionário.
Agrupar Link/GuiferWordmark completo de 11.5px e círculo 22px com copyright. Preservar marca estática;
remover decrypt/tail/pointer da marca grande e seu componente sem consumidor. Inspecionar LAN mobile,
desktop e dois idiomas; gates consolidados pendentes.

Evidência T348: LAN 320/412/1440px em PT escuro e 1440px EN claro. Agradecimento usa
16px mobile/18px desktop, acima dos selos; marca compacta mede 58.42px, círculo 22px e fonte
11.5px, imediatamente antes do copyright. Grupo centralizado com delta 0; reflow mobile sem
overflow/erros. Privacidade funcional. Screenshot desktop/mobile inspecionado. Camada decrypt
exclusiva da antiga marca removida, Header preservado. Gates consolidados pendentes.

### Acabamento do agradecimento — 2026-11-12

Via speckit-implement, atualizar pontuação PT/EN e sobrescrever tamanho/cor somente footer-thanks.
Inspecionar LAN mobile/desktop. Gates consolidados pendentes nesta iteração rápida.

Evidência T349: LAN 320/412/1440px, agradecimento com exclamação, tamanho computado
19.2/21.6px, sem overflow/erros. Screenshot desktop inspecionado. Gates consolidados pendentes.

### Intervalo Serviços–Princípios desktop — 2026-11-17

Via speckit-implement na feature ativa, sobrescrever padding-block-start de knowledge com
--home-section-gap em min-width:64rem. Comparar distância renderizada ao padding de Contato
em 1024/1440/1920px, e confirmar 412/768px inalterados. Sem alteração estrutural ou de conteúdo.
Inspeção LAN bloqueada por ERR_NETWORK_ACCESS_DENIED; usar localhost para validação renderizada.
Iteração rápida: gates consolidados pendentes, sem commit/deploy.

Evidência T350: localhost em 1024/1440/1920px: intervalo passa de 61.44/86.39/96px para
122.88/172.80/192px, igual ao padding de entrada de Contato (diferença <0.01px). Em 412/768px
mantém 164/56px. Nenhum overflow; screenshot desktop inspecionado em
tmp/services-principles-spacing-desktop.png. Gates consolidados permanecem pendentes.

### Gate E2E antes de commits — 2026-11-17

Via speckit-implement e revisão, adicionar .githooks/pre-commit, instalador local não destrutivo,
runner do índice e testes Node com repositórios descartáveis sem commits reais. Snapshot por
checkout-index, node_modules via junction, manifestos preparados iguais à instalação corrente;
CLI Playwright com porta própria, sem reuse, sem .only/update snapshots e timeout global 25min.
Expor hooks:install, test:commit-gate e commit:check. Falhas guardam diagnóstico em tmp; sucessos
limpam somente snapshot verificado. Corrigir tipo inferido de expandedInstance, formatação e
fixture compartilhada que ainda esperava launcher anterior ao widget carregado. Não atualizar
baselines ou enfraquecer asserts. Instalar hook no repo atual, sem staging/commit/push.

Evidência T351/T352 — 2026-11-17:

- core.hooksPath=.githooks instalado localmente, sem staging/commit/push. Invocação real de
  git hook run pre-commit bloqueia package.json fora do índice, confirmando fail-closed.
- 12/12 testes do mecanismo passam, incluindo índice vs working tree, falha/sinal, mudança
  concorrente, manifestos e preservação de pre-commit/pre-push/commit-msg/prepare-commit-msg.
- Revisão detectou preservação insuficiente de hooks legados; corrigido e testado. CI inclui
  testes do gate. 304 E2E são descobertos com flags reais de proibição de .only/update.
- Lint/typecheck verdes; API 71/71 e builds frontend/API verdes. Duas smoke E2E passam fora
  do sandbox Windows (teardown de árvore de processos é restrito no sandbox).
- Entrada completa E2E executada com parada diagnóstica após três falhas: 3 falhas em brand,
  1 interrompido, 299 não executados, 1 passou. Não é aprovação da suíte. Há expectativas
  desatualizadas de navegação/rodapé/projetos e contraste insuficiente no agradecimento tonal.
- Carbono falha por timeout de networkidle em 60s, também fora do sandbox; nenhum staging
  autorizado pelo gate. Não foi aumentado limite nem removida verificação.
- Setup do gate concluído; prontidão para commit depende da correção dos bloqueadores reais.
  Logs de execução em tmp/gate-*.log. Nenhuma atualização de snapshots para ocultar falhas.

### Consolidação E2E — 2026-11-17

Aplicar investigar-falha e speckit-implement. Reproduzir cada falha, separar contratos obsoletos
de regressões e dividir testes por áreas sem alterações concorrentes de suporte/source. Preservar
layouts aprovados exceto contraste obrigatório. Executar testes direcionados, inspecionar diffs
visuais antes de renovar screenshots e concluir suíte completa. Sem commits/staging neste passo.

Diagnóstico e correções T353/T354 — 2026-11-17:

- Vite observava HTML gerado em `tmp/**/traces/resources`, disparando reloads durante os testes;
  excluir somente `tmp/**` do watcher e isolar cache de dependências por E2E_PORT.
- Esperar preloader concluído e aceitar launcher ou widget já carregado na fixture compartilhada.
  Auditoria axe aguarda revelações finitas; mídia com revisão manual exige muted/volume zero.
- Preservar leitura/reflow, teclado e contraste ao atualizar contratos dos layouts aprovados.
  Preferências não são semeadas novamente no teste de persistência após reload de idioma.
  Carousel usa relógio instalado antes do timer e duração de leitura real, após reveal completo.
- Corrigir alvos LinkedIn/footer para 44px, separar indicadores/controles dos depoimentos até
  400px e permitir que badge Carbon encolha sem corte em 320px. Número de cafés usa peso 400.
- Inventário reconhece recorte de carousel transformado somente com região nomeada, foco e
  botões aria-controls; teste adicional comprova alcance de todos os seis cards por teclado.
- Playwright usa stylePath, não opção style ignorada. Baselines renovados após inspeção dos
  diffs dos layouts aprovados; confirmação posterior sem updates: 7/7 visuais + carousel passam.
- Testes direcionados de preferências/touch/timer: 12/12. Testes do hook: 12/12; API: 71/71.
  Lint, typecheck e builds frontend/API passam. Suíte E2E consolidada ainda em andamento.

Complementos da consolidação:

- Hash inicial aguardava conteúdo, porém tentava focar sob `#root[inert]`; Header passa a
  aguardar `usePageRevealed`. Testes de hash direto Serviços/Contato comprovam a correção.
- Mapeamento de teclado percorre `shadowRoot.activeElement` do widget, evitando medir host
  sem caixa visual em vez do botão efetivamente focado. Testes mobile/desktop passam.
- Links legais mobile nas páginas internas tinham texto secundário sobre superfície misturada
  com contraste 3.37:1; aplicar `--footer-foreground` também fora da Home.
- Fontes de projetos distinguem banner 1600w e grid 1200w/1600w conforme cada mídia existente;
  vídeos preparados permanecem mudos/pausados em movimento reduzido. Stub de play usa mídia
  local válida para evitar erro nativo de rede competindo com resultado simulado.
- Hero permanece visível no overlap de Sobre; teste de pausa sai até Serviços e comprova
  `data-runtime-activity=paused`. Menu consecutivo valida foco sob movimento reduzido;
  teste de navegação confirma heading visível/focado sem impor antigo offset fixo de 8px.
- Inspeção renderizada em 320px escuro e 1440px claro: agradecimento legível, badge contido,
  alvos dos depoimentos separados e overflow horizontal zero. Evidência em tmp/e2e-*.png.
- Execução final integral iniciada com E2E_COMMIT_GATE=1 e porta 4350; 302 testes descobertos,
  servidor próprio sem reuso, zero retries, sem atualização de snapshots.

Resultado da primeira execução integral: 301/302 passaram (18.1min). O teste restante usava
`Abrir menu` sem exact e colidia com `Abrir Menu de Acessibilidade`. Corrigir seletor, semear
preferências apenas inicialmente e atualizar copy aprovada no fluxo de reload PT/EN; teste
direcionado passa. Nova confirmação integral iniciada na porta 4352 com quatro workers,
sem retries/updates. Lint, typecheck e build final continuam verdes.

Carbono final: a medição do build conclui e reprova por quatro vídeos antes de intenção e
177433.9kB acima do limite A+ (272.51kB). Não aumentar orçamento nem remover gate; staging e
commit continuam bloqueados por sustentabilidade mesmo com reparos E2E. Evidência em
`tmp/e2e-carbon-final.log`. Esta medição substitui o timeout de networkidle observado antes.

Na confirmação com quatro workers, o teste Carbon com sete reloads integrais excedeu 60s.
Separar cada nota A+–F em caso independente, mantendo asserts de resposta/cor e o orçamento
original por teste. Não elevar timeout nem adicionar retry. O teste central mantém resposta,
localização e texto legal. A suíte passa a descobrir 309 casos; nova execução integral
fail-fast em `tmp/e2e-final-complete.log`, com servidor novo e sem updates.

Resultado final T353/T354 — 2026-11-17:

- Suíte integral: **309/309 passaram em 11.7min**, Chromium e smoke WebKit. Exit code 0.
  E2E_COMMIT_GATE=1, quatro workers, servidor próprio na porta 4352, sem retries, skips novos
  ou atualização de snapshots. Os sete baselines visuais passam sem updates.
- Lint/typecheck verdes; validação específica dos últimos testes alterados também verde.
  API 71/71, mecanismo pre-commit 12/12 e build final frontend/API verdes.
- core.hooksPath continua `.githooks`. Índice Git vazio; nenhum staging, commit ou push.
- E2E concluído. Prontidão para commit permanece bloqueada pelo carbono: 177706.4kB
  transferidos para limite 272.51kB, quatro vídeos automáticos. Não alterar mídia/política
  aprovada nem orçamento neste reparo E2E; gate permanece obrigatório antes de staging.
- Evidências: `tmp/e2e-final-complete.log`, `tmp/e2e-carbon-final.log`, `tmp/e2e-build-final.log`,
  `tmp/e2e-final-lint-confirmed.log`, `tmp/e2e-final-type-confirmed.log`,
  `tmp/e2e-final-api.log` e `tmp/e2e-final-hook-tests.log`.

### Prontidão do gate carbono — 2026-11-18

T355/T356: dois retries falharam em networkidle antes de medir. Substituir navegação por
domcontentloaded e aguardar flags existentes pagePrepared/pageRevealed, main presente e loader
removido, com limite finito de 60s. Preservar contabilização, scroll completo e limites A+.
Teste real Chromium (`node --test scripts/carbon-page-readiness.test.mjs`) passa com stream
HTTP contínuo e comprova rejeição enquanto loader/flags não permitem medir. Lint direcionado
passa. Gate oficial conclui medição: 177706.4kB / 272.51kB, quatro vídeos automáticos;
561.5kB sem mídia. Hero sozinho transfere 169200.2kB. Resultado continua exit 1 por orçamento,
sem timeout. Evidência: tmp/carbon-gate-readiness-fix.log. Para aprovação real será necessário
reduzir carregamento automático de mídia e carga inicial de JS/widget/imagens, conciliando
com pedido anterior de preparo completo/autoplay; nenhuma mudança visual ou de mídia aplicada.

### Implementação de carga sob demanda — 2026-11-18

Após aprovação, T357/T358 removem src/preload de vídeos até controles de play explícitos;
hover/foco/scroll mantêm expansão sem mídia. Widget mantém launcher e restaura perfis prévios
de accweb localStorage/cookie. Diálogo carrega por import com erro local e link alternativo;
cursor aguarda ponteiro e Lenis aguarda wheel/touchmove confiável. Preloader prepara somente
imagens/poster inicialmente visíveis e fontes, ignorando slides ocultos/sem src.

Remover dependência Radix do tooltip de café com foco/hover independentes e Escape; os dois
achados de revisão (preferências e erro local do diálogo) foram corrigidos, assim como tooltip
e slides sem src. Checklist existente16/16. Plano investigado por planejador; revisão revisor.

Medições intermediárias: 177706.4kB →374kB →291.8kB →280kB →273.8kB →269.9kB. Última medição
aprova A+, sem vídeos automáticos, abaixo272.51kB, acima da meta250kB. Limites inalterados.
Geradores preservam originais: generate-responsive-images (covers AVIF28, cutout30 e512w),
generate-font-subsets (faixas declaradas), generate-workplace-images e generate-hosting-badge.
SnapshotPNG hospedagem foi obtido da API existente; relatório de verificação continua ao vivo.

Inspeção em1365/375 sem overflow; sete baselines visuais passam sem updates. Testes novos
comprovam widget por teclado, tooltip e erro do chunk de privacidade. API71/71 e hook12/12 verdes.
T359/T360 pendentes da suíte integral final e medição sobre conjunto final.

Resultado final T357–T360: 310/310 E2E passam em8.7min, Chromium+smoke WebKit, quatro workers,
servidor próprio4411, zero retries/skips novos/updates. Sete screenshots passam sem alteração de
baseline. Remover autoplay nativo redundante do Hero eliminou corrida com play/pausa imperativos;
retry explícito sob movimento reduzido também passa. Capa de projeto desfoca somente quando um
frame real de vídeo está pronto, preservando poster nítido antes do play.

Lint/typecheck, API71/71, hook12/12 e builds frontend/API passam. Carbono final oficial exit0:
269.9kB /272.5kB, zero vídeos automáticos e26 recursos. Meta interna250kB ainda não atingida;
margem para limite obrigatório é ~2.6kB. Evidências: tmp/e2e-carbon-complete.log,
tmp/carbon-final-approved.log, tmp/carbon-final-build.log, tmp/carbon-final-lint.log,
tmp/carbon-final-types.log, tmp/carbon-api-tests.log e tmp/carbon-hook-tests.log.
Inspeção1365/375 confirma fotos/capas/selos legíveis e overflow zero. Nenhum staging/commit/push.

T361 — Hover de Projetos em desktop: movimento real do mouse dentro do card inicia play uma
vez por entrada/card; ref do card sob ponteiro mantém pausa manual sem reinício por movimentos
entre imagem e controles. Saída do grid pausa; troca de card pausa anterior. Pointer enter
isolado de scroll, foco, toque e eventos sintéticos não iniciam mídia. Movimento reduzido/mobile
mantêm botão de play; Hero inalterado. Testes direcionados5/5 (incluindo H.264 real), lint e
typecheck passam. Carbono oficial final exit0,270.0kB/272.5kB, sem requisições automáticas.
Logs: tmp/e2e-project-hover-fixed.log, tmp/carbon-project-hover-final.log,
tmp/project-hover-types-final.log. Suíte integral não repetida nesta alteração localizada.

### Diagnósticos do editor — 2026-11-18

T362 reproduz exatamente 29 diagnósticos no servidor CSS instalado do VS Code: 27 avisos de
diretivas Tailwind e dois erros ao interpretar `source(none)` no import. Preservar a sintaxe
válida do Tailwind v4 e associar exclusivamente `src/styles.css` ao modo `tailwindcss` em
`.vscode/settings.json`. Recomendar a extensão oficial e instalá-la no editor local. O servidor
da extensão retorna zero diagnósticos; controle negativo em memória com `color: ;` continua
produzindo erro, comprovando validação ativa. CSS emitido e layout não foram alterados.

T363 inclui `e2e/**/*.ts` no typecheck e corrige 18 erros antes não cobertos pelo comando:
tipagem de elementos de mídia/imagem, comparação de posição com elemento anulável e opção
de movimento reduzido em `contextOptions` do Playwright. Chamadas `page.emulateMedia` mantêm
seu contrato próprio. Sem `any`, suppressions ou exclusões adicionais.

Lint, typecheck ampliado, formatação de `src/styles.css` e builds frontend/API passam.
Chromium direcionado: 25/25 testes, incluindo sete snapshots sem atualização de baseline,
em 53,4s na porta isolada 4415. Tentativas anteriores tiveram lock EPERM no cache Vite e
timeout de infraestrutura; execução final com acesso normal de processos concluiu sem falha.
Evidências: `tmp/vscode-css-diagnostics.json`, `tmp/vscode-tailwind-diagnostics.json`,
`tmp/vscode-tailwind-invalid-diagnostics.json`, `tmp/e2e-editor-final.log` e
`tmp/editor-diagnostics-build.log`. Nenhum staging, commit ou push.

### Organização dos commits — 2026-11-18

Pedido do usuário: estudar o fluxo existente e apresentar commits semânticos, concisos e
lógicos, com mensagens PT-BR e descrições técnicas simples, antes de staging ou commit.
A [proposta de commits](./commit-plan.md) registra ordem, dependências, caminhos exatos,
material reservado e o bloqueador de tamanho do vídeo do Hero. Aguardando aprovação do
usuário; organização não constitui autorização para executar commits ou converter a mídia.

### Otimização do vídeo Hero — 2026-11-18

Autorização posterior do usuário permite corrigir o vídeo, mantendo commits sob aprovação.
Original 169200241 bytes, H.264 1920×1080 a 60fps, 74,722s, áudio AAC; backup preservado em
`tmp/media-originals/hero-background.original.mp4`, ignorado pelo Git. FFmpeg local produz
16995293 bytes: H.264 High/3.1, yuv420p, 1280×720 a 30fps, 74,7s, sem áudio e faststart.
Preservar poster, import e controles; duração difere apenas pela quantização de um frame.
Comando: `ffmpeg -i <original> -map 0:v:0 -an -vf scale=1280:-2,fps=30 -c:v libx264
-preset slow -crf 23 -maxrate 2M -bufsize 4M -profile:v high -level:v 3.1 -pix_fmt yuv420p
-movflags +faststart -map_metadata -1 <saída>`.

Comparação visual do frame em 30s preserva enquadramento e detalhes do fundo. Teste Chromium
real comprova limite de publicação, ausência de src antes de play, decodificação, avanço,
seek e pausa. Suíte de mídia 19/19 passa; typecheck e lint do teste passam. Build frontend
e carbono oficial passam, sem requisições automáticas de vídeo. Logs:
`tmp/e2e-hero-optimized.log`, `tmp/carbon-hero-optimized.log`, `tmp/hero-video-encode.log`.
Inspeção: `tmp/hero-quality-comparison.jpg`. Sem staging, commit ou push.

### Revisão da proposta de commits — 2026-11-18

Usuário autoriza dispensar repetição do E2E neste lote, mantendo revisão/aprovação antes
de commitar. Atualizar commit-plan.md com dispensa limitada a C1–C5, evidências existentes,
risco dos snapshots intermediários e expiração. Demais gates permanecem; carbono executa
imediatamente antes do primeiro staging. Sem alteração permanente de hooks, scripts ou CI.
Nenhum E2E, staging ou commit executado nesta etapa de organização.

### Aprovação do lote — 2026-11-18

Usuário aprovou C1–C5 e a dispensa E2E pontual. Executar gates restantes, carbono por último,
staging explícito e commits PT-BR na ordem aprovada. Preservar configuração permanente dos
hooks e materiais reservados; push não autorizado. Evidências desta execução ficam em
`tmp/approved-commit-*.log`; o histórico Git registra os hashes dos cinco commits.

### Correção do timeout de instalação CI — 2026-11-19

Investigar execução 44381918795, job 135101333691: instalação dos engines permaneceu em APT
de 20:15:43Z a 20:40:25Z, transferindo 126 MB do mirror Ubuntu us-east-2.ec2.archive.ubuntu.com.
O timeout de 25 minutos cancelou o job antes de carbono/E2E; não houve falha de asserção.
Log local: `tmp/ci-browser-install-timeout.log`.

Usar container oficial `mcr.microsoft.com/playwright:v1.61.1-noble`, compatível com lockfile,
fixado ao digest verificado no registro Microsoft em 2026-11-19:
`sha256:cf0daee9b994042e011bc29f20cdff1a9f682a039b43fcd738f7d8a9d3bcd9d6`.
Documentação oficial https://playwright.dev/docs/docker confirma browsers e bibliotecas de
sistema pré-instalados; `npm ci` continua instalando a dependência do projeto. IPC host segue
recomendação para Chromium. Smoke de lançamento Chromium/WebKit limita prontidão a dois
minutos e detecta imagem incompatível antes dos gates. Nomes dos checks e limite 25min intactos.
Sem alteração de branch protection. Não aumentar timeout nem dispensar carbono/E2E.

Validação local: YAML interpretado com js-yaml; imagem corresponde ao Playwright 1.61.1 do
lockfile, nomes/limites/comandos dos gates preservados e nenhuma instalação Playwright/APT
restante no job. Script exato do workflow executado localmente: Chromium 149.0.7827.55 e
WebKit 26.5 lançam e encerram com sucesso. Formatação aprovada. Docker não está instalado
neste Windows; execução da imagem Linux e run remoto continuam pendentes de publicação.
Proposta de commit único para revisão do usuário: `fix(ci): usa browsers pré-instalados no Playwright`.
Arquivos: `.github/workflows/quality.yml` e spec/plan/tasks da feature ativa. Usuário aprovou
esse commit e push ao PR25 contra main. Preservar proteção e gates remotos. Reavaliada a
dispensa de repetição E2E local solicitada pelo usuário: esta correção altera apenas YAML e
documentação; prontidão dos dois browsers foi comprovada localmente, mas só a CI Linux
valida o container. Dispensar runner E2E local nesta invocação, mantendo lint/typecheck,
API, testes do mecanismo, build e carbono antes do staging. Risco: sem nova suíte Windows;
nenhum comportamento de produto foi alterado. Responsável: Guilherme; dispensa expira
neste commit corretivo e não dispensa E2E remoto. Logs: `tmp/ci-fix-approved-*.log`.
