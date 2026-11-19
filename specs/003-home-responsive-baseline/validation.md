# Validação — baseline responsivo da Home

## CTA da navegação somente no estado ativo — 2026-11-11

CTA desktop agora usa a mesma condição headerControlsVisible dos demais controles; removida
regra antiga que mantinha CTA recolhida com opacity 0.68. Sem botão/alvo invisível quando
inativa. Navegação e handlers de foco/hover/contato preservados.

Inspeção desktop 1440px: CTA count 0 inativa, visível ao hover na nav e ao mover para a CTA,
count 0 ao sair; foco por teclado na marca mostra CTA, blur para main remove. Mobile 375px
com toque: menu open/expanded true e botão contato com display block, visibility visible e
altura 44px. A primeira consulta usava o rótulo desktop Entre em contato; o rótulo mobile
correto é contato. Captura mobile inspecionada: tmp/nav-cta-mobile-open.png.
Nenhum teste executado; gates adiados.

## Navegação com metade do inset — 2026-11-11

Token da nav reduzido para 24/32/clamp40–72px; compensação dos 12px do fundo mobile preservada.
Removido offset de -32px dos links desktop pequeno, agora desnecessário. Seções não mudaram.
Inspeção em 375/768/1024/1920px: logo em x=24/32/40.953/72px e borda direita simétrica;
Serviços permaneceu x=48/64/81.906/144px. Em 1024px, gap entre links e ações 25.48px.
Overflow horizontal zero. Captura inspecionada: tmp/nav-half-inset-1920.png.
Nenhum teste executado; gates adiados.

## Override do título da Home corrigido — 2026-11-11

Causa reproduzida: index já continha Portfólio - Guilherme Ferreira Eleuthério, mas após
mount o título/og:title ainda eram Guilherme Ferreira Eleutherio — Desenvolvedor full-stack.
STATIC_METADATA de DocumentMetadata.tsx é a fonte runtime por rota/idioma e sobrescrevia o
fallback. Corrigidos apenas títulos PT/EN da Home; index do usuário não foi modificado.

Inspeção Chromium: Home PT com título solicitado e titleCount 1; og:title e twitter:title
iguais. Sobre manteve seu título próprio. Retorno à Home e troca real de idioma com reload
confirmaram Portfolio - Guilherme Ferreira Eleuthério em EN, um único title e metadata social
coerente. Script: tmp/inspect-home-title-fixed.mjs. A inspeção aguarda metadata social para
não confundir o title inicial do index com conclusão do efeito React. Nenhum teste executado;
gates adiados.

## Introdução de Serviços centralizada verticalmente — 2026-11-11

Aplicado align-self center no bloco editorial, mantendo alinhamento horizontal e grid/stack.
Inspeção em 1440px confirmou centros verticais idênticos de introdução e serviços:
3327.28125px; overflow horizontal zero. Captura inspecionada:
tmp/services-intro-vertical-center.png. Nenhum teste executado; gates adiados.

## Projetos à esquerda, Serviços centralizados e controles uniformes — 2026-11-11

Cabeçalho de Projetos usa start/left e margem inline zero. Bloco editorial de Serviços
centraliza título/intro/filete e CTA na própria coluna, mantendo a grade de ofertas intacta.
Estilo compartilhado carousel-control/alias de Depoimentos aplicado a Hero e Princípios:
44×44px, ícones 16px/stroke 1.5, transparente, border/radius 0 e foco visível. Hero mantém
contraste branco sobre vídeo; Princípios adota os chevrons dos depoimentos. Eventos inalterados.

Inspeção em 375/1440px: Projetos left, Serviços center e centro do CTA coincidente com centro
da coluna (offset 0). Sete controles por página com as mesmas medidas/ausência de fundo,
borda e raio; zero overflow horizontal ou erros de runtime. Pausa de Princípios mudou
aria-pressed para true; próximo depoimento mudou Bruna para Leonardo. Inspeção específica do
Hero aguardou reprodução: paused false/status playing → clique → paused true/status paused,
com aria-label Pausar vídeo → Retomar vídeo. Capturas inspecionadas: tmp/services-centered-intro-1440.png,
tmp/unified-principles-controls-1440.png e tmp/projects-left-heading-1440.png.
Evidência em tmp/unified-carousel-controls-evidence.json; complemento do Hero em
 tmp/inspect-hero-shared-control.mjs. Nenhum teste executado; gates adiados.

## Nav com inset da Home e revisão de títulos — 2026-11-11

Nav/ações receberam token lateral 48/64/clamp80–144px, com compensação dos 12px do fundo
mobile. Princípios centraliza título/filete/intro, mantendo marquee full-width. Projetos usa
antigo subtítulo como título PT/EN; lead e mobileLead obsoletos removidos, sem texto duplicado.

Inspeção em 320/375/768/1024/1440/1920px: logo com x=48/48/64/81.906/115.188/144px, igual à
Home; menu mobile fecha na borda simétrica e painel aberto usa os mesmos insets. Ações desktop
terminam na borda direita do conteúdo. Princípios com título/intro text-align center e centros
coincidentes com viewport/2; marquee x=0 e width=viewport. Subtítulo de Projetos ausente em todas
as larguras. Sem overflow horizontal ou erros de runtime.

Em 1024px, inspeção específica revelou sobreposição inicial de 15.47px entre links e ações.
Correção final usa offset de 32px à esquerda nos links entre 1024–1199px, preservando espaçamento
interno e alvos; gap medido passou a 16.53px. Captura final inspecionada:
tmp/nav-home-aligned-1024.png. Também inspecionados nav 1920px e Princípios 375px.
Troca real para EN confirmou título traduzido e zero subtítulos; geometria geral sem overflow.
Evidência em tmp/nav-heading-copy-evidence.json, scripts tmp/inspect-nav-*.mjs e capturas
 tmp/principles-centered-heading-*.png. Nenhum teste executado; gates adiados.

## Insets dobrados e centralização dos depoimentos — 2026-11-11

Inset aplicado deriva de 2×base: 48px mobile, 64px tablet e clamp(80px,8vw,144px) desktop.
Sobre recebe padding-inline correspondente e âncora horizontal do café desktop; vertical
não é dobrado. Hero usa somente o inset base para proteger o título; Header não foi editado.
Marquee mantém breakout full-bleed e toolbar com inset atualizado. Depoimentos centraliza
texto, aspas, mídia e dados de autoria nas colunas existentes; título/filete ficam à esquerda.
Sem mudanças de conteúdo, tipografia, cores ou JS/animações.

Inspeção em 320/375/768/1024/1440/1920px: Sobre/Serviços/Projetos/Contato com x iguais a
48/48/64/81.906/115.188/144px, Footer com padding equivalente. Header e retângulo do título
Hero idênticos à baseline nas cinco larguras com registro anterior (375–1920px). Em todas,
marquee x=0 e largura integral, overflow horizontal zero, nenhum erro de runtime. Computed
styles confirmam quote/autoria text-align center, imagens justify-content center e aspas
justify-self center, com título text-align left. Footer/controles e campos visíveis dentro
do viewport; único input offscreen registrado é o honeypot original em x=-10000, preservado.

Capturas inspecionadas: tmp/doubled-spacing-testimonials-1920.png e
 tmp/doubled-spacing-footer-375.png. Evidência: tmp/doubled-spacing-evidence.json e
 tmp/inspect-doubled-spacing.mjs. Nenhum teste executado; demais gates continuam adiados.

## Insets de Sobre e marquee de Princípios full-width — 2026-11-11

Referência real do about-template reaproveitada: 24px mobile, 32px tablet e
clamp(40px,4vw,72px) no desktop. Aplicada ao texto do Hero, molduras de Projetos,
Serviços/Princípios, Depoimentos, Contato e Footer. Sobre/Header permanecem intactos.
Marquee usa margens negativas equivalentes ao inset real para liberar viewport até as
bordas; só toolbar retoma o alinhamento editorial. Sem max-width global ou mudança de JS.

Inspeção em 375/768/1024/1440/1920px: conteúdo de Sobre/Hero/Serviços/Princípios/Projetos/
Depoimentos/Contato apresentou x idêntico de 24/32/40.953/57.594/72px; padding do Footer
24/32/40.96/57.6/72px, com arredondamento normal de pixels fracionários. Em todas as larguras,
viewport do marquee com x=0 e width exatamente igual ao viewport. Header e Sobre com
geometria idêntica à baseline; dimensões dos cards do marquee também inalteradas. Zero
overflow horizontal e erros de runtime. Capturas inspecionadas:
tmp/about-aligned-principles-1920.png e tmp/about-aligned-projects-375.png.
Evidência: tmp/about-aligned-sections-evidence.json e tmp/inspect-about-aligned-sections.mjs.
Nenhum teste executado; gates consolidados continuam adiados.

## Revisão de alinhamento lateral por seção — 2026-11-11

Revisão anexada aplicada somente a Serviços/Princípios, Depoimentos, Contato e Footer.
Token --section-edge-inset restrito a essas seções: 16/24/32/40px em mobile/tablet/desktop
pequeno/grande. Containers e fundos mantêm largura integral; sem max-width, margem auto
ou padding universal. Um padding no container de Serviços alinha também Princípios/marquee.
Footer substitui seu padding mobile de 8px, sem acumular. Fontes, cores, cópia e JS não mudaram.

Contato perdeu recuos cumulativos: bloco editorial agora ocupa a coluna, sem limite/auto
margin; formulário ocupa 100% da própria coluna. Primeira medição mostrou overhang interno
no tablet: wrapper com 12 colunas de 0px mais onze gaps de 32px impunha mínimo de 352px
numa coluna de 344px. Removidos somente gaps internos redundantes e min-width automático;
gap externo/proporção de colunas permanecem. Formulário continua empilhado no mobile.

Comparação renderizada antes/depois em 375/768/1024/1440/1920px confirmou:
- insets de 16/24/32/40/40px em todos os quatro containers afetados;
- Serviços, Princípios/marquee, título de Depoimentos e título de Contato compartilham x do inset;
- borda direita do formulário em 359/744/992/1400/1880px, exatamente viewport menos inset;
- Header, Sobre (incluindo template interno), Projetos e seus três cards com geometria idêntica;
- largura/altura dos cards de Princípios idênticas e overflow horizontal zero nas cinco larguras.

Footer em 375/1920px mantém background full-width, padding 16/40px e nenhum link/botão/texto/
imagem além do viewport. Selo Green Web externo foi bloqueado na inspeção e usou fallback
local existente; URL/componente preservados. Capturas inspecionadas: Serviços 1920px, Contato
375/1920px, Depoimentos 1920px e Footer 375px em tmp/local-section-spacing-*.png.

Baseline/evidência: tmp/section-edge-spacing-before.json, tmp/section-edge-spacing-after.json,
tmp/local-section-spacing-summary.json e tmp/inspect-local-section-edges.mjs. Nenhum teste,
lint, typecheck ou build executado; gates consolidados continuam adiados nesta iteração.

## Containers sem frame lateral global — 2026-11-11

Removidos limites 75rem/82.5rem, gutters laterais responsivos e regra duplicada da Home.
section-container/header-container usam width 100% e margem inline zero. Hero/Sobre não
reintroduzem gutters; Serviços e palco de Depoimentos perdem caps externos. sizes dos banners
agora informa 100vw. Ações desktop do Header passam a right 0, removendo referência ao token
antigo. Paddings internos de cards/componentes e espaçamento vertical preservados.

Inspeção em 320/1440/1920px: seis containers da Home e Footer mediram exatamente a largura
do viewport, left 0; Serviços e palco de Depoimentos também. Header desktop e suas ações
terminam em x=1440; Header mobile mantém seu posicionamento flutuante próprio dentro da
largura disponível. Sobre interna em 1440px e containers visíveis do case GrenGame também
ocupam largura integral. Privacidade em 320px e Acessibilidade em 1440px foram medidas após
aguardar conteúdo lazy visível: dois containers em cada, width igual ao viewport/left 0.
Nenhum overflow horizontal ou erro de runtime nos cenários registrados.

Capturas desktop e mobile inspecionadas: tmp/full-width-home-projects-1440.png e
 tmp/full-width-home-projects-320.png. Evidência geral em tmp/global-full-width-evidence.jsonl;
complementos em tmp/inspect-full-width-lazy-pages.mjs e tmp/inspect-full-width-header-actions.mjs.
Nenhum teste executado; demais gates adiados.

## Marquee infinito de Princípios com arraste e inércia — 2026-11-11

Removidos dropdowns/observers de abertura. Os seis títulos/descrições PT/EN permanecem integrais
em cards sempre abertos, com loop por módulo de largura e cópia inert/aria-hidden. Implementação
React/Pointer Events/requestAnimationFrame sem dependências novas, inspirada no CodePen indicado:
https://codepen.io/sj-jay/pen/JjxORaL. Base 26px/s, velocidade proporcional ao gesto, teto 2200px/s
e decaimento exponencial 0.75s na direção escolhida. Direção/pausa e teclado localizados.

Inspeção renderizada em 1440/320px confirmou seis itens originais, seis cópias ocultas à árvore
acessível, nenhum aria-expanded e zero overflow horizontal/runtime errors. Drag direito soltou
com aproximadamente +410/+419px/s e retornou a +25.6/+26.2px/s após 5.5s; drag esquerdo mostrou
aproximadamente -595/-575px/s. Pausa mediu 0px/s. Redução em 320px manteve 0px/s e navegação manual.
Avanço manual inclui gap e alinha o card inteiro; em 320px, borda do segundo card coincidiu com
borda do viewport em 12.42px após Home/ArrowRight. Capturas desktop/mobile inspecionadas:
tmp/principles-marquee-1440-no-preference.png e tmp/principles-marquee-mobile-touch.png.

CDP touch real identificou lostpointercapture propagado do texto filho ao transferir captura
para o viewport, encerrando cedo o gesto. Handler corrigido para reagir somente à perda do
próprio viewport. Reinspeção touch: gesto suave +103px/s, gesto forte -469px/s; swipe vertical
rolou a página 125px e não deixou estado de arraste preso. Evidência geral em
tmp/principles-marquee-evidence.jsonl; scripts de inspeção em tmp/inspect-principles-marquee*.mjs.
Nenhum teste, lint, typecheck ou build executado; gates consolidados permanecem adiados.

## Duração compartilhada dos efeitos de depoimentos — 2026-11-11

Quote publica quantidade de linhas; duração total mantém 300+(linhas-1)*100ms. Atividade
aguarda medição antes de liberar todos os efeitos. Autoria distribui os delays para seu
último fade concluir nesse intervalo; pixels normalizam ordem aleatória para 0..total-80ms.
Keyframe final estável em 99% evita lacunas de arredondamento. Conclusão do quote fixa autoria
e remove máscaras, impedindo reabertura visual após resize. Conteúdo/layout preservados.

Inspeção Chromium comparou delay + duração máximos por grupo: em 1440px, Tainara (5 linhas)
quote/autoria/imagens = 700/700/700/700ms; Bruna (11 linhas) = 1300ms em todos. Em 320px,
Tainara (9 linhas) = 1100ms e Bruna (23 linhas) = 2500ms em todos. Ao concluir, quote complete,
autoria integral e imagens sem máscara; zero overflow horizontal/erros de runtime. Redução em
320px manteve quote static, autoria integral e máscaras none. Captura inspecionada:
tmp/testimonial-synced-1440-no-preference.png. Evidência em tmp/testimonial-synced-evidence.jsonl.
Nenhum teste executado; gates adiados.

## LinkedIn somente ícone e pixels acelerados — 2026-11-11

Removido span com primeiro nome no link LinkedIn; aria-label completo e destino preservados.
Escala dos atrasos reduzida de 920 para 680ms, mantendo padrão e animação de células.
Inspeção em 1440px: link sem texto visível com aria-label nominal válido; ambas as imagens
com 144 pixels visíveis aos 800ms e atrasos máximos observados de 635/655ms. Captura
inspecionada: tmp/testimonial-linkedin-icon-faster-pixels.png. Nenhum teste executado;
gates adiados.

## Revelação em pixels por borda aleatória — 2026-11-11

TestimonialPixelImage preserva picture/source/img e aplica máscara SVG 12×12 local. Borda e
seed são escolhidos após mount a cada ativação, independentemente para marca/retrato. Atrasos
combinam distância à borda e jitter; células surgem em steps, total aproximado de 1s. Removida
máscara cônica/propriedade radial. Atividade pausa; movimento reduzido não aplica máscara.

Primeira inspeção detectou arredondamento do fim de steps em parte das células: animações
terminavam com progress ligeiramente inferior a 1 e mantinham opacity 0. Corrigido mantendo
opacity 1 desde o keyframe intermediário até o final. crispEdges elimina costuras da grade.

Reinspeção em 1440/320px mostrou 21–29 células visíveis por imagem na fase inicial e todas as
144 ao concluir. Novas ativações sortearam bordas variadas. Dimensões preservadas, sem overflow
horizontal ou erros de runtime. Em 320px com movimento reduzido, máscara none e 144 células
visíveis imediatamente. Capturas inspecionadas: tmp/testimonial-pixels-complete-1440-no-preference.png
e tmp/testimonial-pixels-partial-320-no-preference.png. Evidência em
tmp/testimonial-pixels-evidence.jsonl. Nenhum teste executado; gates adiados.

## Revelação radial horária das imagens de autoria — 2026-11-11

Máscara conic-gradient sobre ambos os picture, com propriedade de ângulo registrada e
interpolada de 0deg a 360deg em 1s. Início nas 12 horas, sentido horário, seleção reinicia
e atividade controla pausa. Retrato e marca mantêm dimensão, recorte e alt; nenhum transform
é aplicado. Fades de quote/autoria não foram alterados. Movimento reduzido remove máscara.

Inspeção Chromium em 1440/320px: ambas as máscaras mediram aproximadamente 85deg no primeiro
registro e 360deg ao concluir, duração 1s, transform none e tamanhos constantes (115.19px
no desktop, 88px no mobile). Redução de movimento em 320px: animation-name none e máscara
none. Sem overflow horizontal ou erros de runtime. Captura radial parcial inspecionada:
tmp/testimonial-radial-partial-1440-no-preference.png; demais registros em
tmp/testimonial-radial-evidence.jsonl. Nenhum teste executado; gates adiados.

## Fade nos dados textuais do depoente — 2026-11-11

TestimonialAuthorDetails mantém os elementos semânticos existentes e aplica índices apenas aos
campos presentes. Mesmo keyframe fadeIn, 300ms ease e stagger 100ms; seleção/idioma reiniciam,
atividade pausa e movimento reduzido apresenta texto integral. Removida animação do container
editorial-side para não afetar retrato nem marca. Conteúdo, tipografia e LinkedIn preservados.

Inspeção em 320/1440px confirmou duração 0.3s e atrasos 0/0.1/0.2/0.3s, opacidades graduais
no início e 1 ao concluir; trocar pessoa reinicia a sequência. Container, picture e imagens
com animation-name none e imagens com opacity 1 durante o efeito. Movimento reduzido em 320px
manteve todo texto visível. Zero overflow horizontal e erros de runtime nos cenários completos.
Na primeira captura desktop, a seção estava fora da área ativa após scroll programático; uma
inspeção dirigida aguardou data-active=true e confirmou início e conclusão normalmente.
Capturas inspecionadas: tmp/testimonial-author-fade-320-no-preference.png e
tmp/testimonial-author-fade-desktop-complete.png. Nenhum teste executado; gates adiados.

## Resumos de projeto legíveis no estado recolhido — 2026-11-11

Base flex dos painéis recolhidos fixada em 11rem (176px), com espaço restante para o ativo.
Altura da galeria soma painel aberto + dois resumos + gaps. Metadados horizontais e ações
permanecem visíveis; links não recebem mais tabIndex -1. Gradiente dos resumos reforça o
contraste sem alterar imagens, texto, destinos ou vídeos. Indicador permanece no ativo.

Inspeção em 320/768/1440px confirmou nome, badges e ações inteiramente dentro dos painéis,
opacity 1, visibility visible, links com tabIndex 0 e zero overflow horizontal. Altura de
cada resumo: 176px. Alturas totais permaneceram 824/728/936px antes e depois da troca de
painel. Em desktop, painel aberto mediu 544px. Captura inspecionada:
tmp/project-readable-collapsed-gallery-1440.png. Nenhum teste executado; gates adiados.

## Banners horizontais em acordeão vertical — 2026-11-11

Corrigida a interpretação do layout conforme screenshot: banners largos empilhados em todos os
breakpoints, primeiro aberto e flex-grow 6:1:1. Removidos clones, rolagem lateral e versão vertical
dos metadados/faixa. Títulos/badges horizontais, links, mídias e reprodução preservados. Links
secundários recolhidos ficam fora do foco; link principal mantém foco/setas para expandir.
Mobile usa a introdução editorial já existente em vez da instrução incompatível de deslize.
Sizes atualizado para a largura real dos banners, sem substituir os arquivos de imagem.

Inspeção renderizada: em 1440px todos os cards mediram 1200px de largura, com alturas 522/87/87px;
em 1024px, largura 960px e alturas 386.5/64.42/64.42px; em 412px, largura 380px e alturas
462/77/77px. Foco/setas transferem expansão; saída mantém painel; primeiro toque no recolhido
abre sem navegar. Movimento reduzido usa transição 0s. Zero overflow horizontal e erros de
runtime nos cenários inspecionados. Capturas desktop e mobile inspecionadas:
tmp/project-horizontal-banners-1440-no-preference.png e
tmp/project-horizontal-banners-412-no-preference.png. Nenhum teste executado; gates adiados.

## Acordeão React dos projetos — 2026-11-11

Adaptado somente o comportamento do AccordionGallery fornecido, sem dados demonstrativos ou
GSAP. Painel expandido persistente separado da intenção de vídeo; proporção flex 3:1:1,
600ms e aproximação CSS de power3.out. Conteúdo, imagens, vídeos e destinos preservados.
Mobile mantém carrossel, tablet mantém grade. Checklist de requisitos: 16/16 completos.

Inspeção renderizada em 1440px mediu 688.91/229.64/229.64px, equivalentes a 60/20/20% da
largura útil. Terceiro painel aberto inicialmente; hover transfere expansão, saída mantém
estado, setas focam/expandem o próximo link real. Em 1024px com toque, primeiro tap abriu
sem navegar; larguras 552/184/184px. Em 412px, carrossel preservado com cards de 380px.
Movimento reduzido em 1440px manteve estados com transição 0s. Sem overflow horizontal ou
erros de runtime nos cenários inspecionados. Screenshot desktop inspecionado:
tmp/project-accordion-1440-no-preference.png. Nenhum teste executado; gates adiados.

## Fade por linha conforme CSS fornecido — 2026-11-11

Substituída a cortina por opacity 0→1 com duração de 300ms ease forwards e atraso
calc(var(--i) * 0.1s), entrelinha 1.55. O escalonamento permite sobreposição dos fades,
conforme o exemplo mais recente. Texto original permanece semântico; camada visual usa
aria-hidden. Última linha concluída libera a contagem de leitura do carrossel.

Inspeção renderizada em 412px e 1440px confirmou duração 0.3s, atrasos 0/0.1/0.2/0.3/0.4s,
texto idêntico ao original, alturas dos parágrafos visuais iguais às do texto fonte e máscara
removida. Troca de pessoa reinicia a sequência. Em 320px com movimento reduzido, texto integral
sem camada animada. Sem overflow horizontal ou erros de runtime. Capturas em
tmp/provided-line-fade-412.png e tmp/provided-line-fade-1440.png; captura mobile inspecionada.
Nenhum teste executado; demais gates continuam adiados.

## Rodapé restaurado parcialmente e onda mobile de Princípios — 2026-11-11

Restauradas composição footer-primary-grid/footer-middle, marca original, selos gráficos,
legais e relógio/localização. Navegação de seis links e as três métricas permanecem textuais,
sem caixas, bordas ou ícones. Dados, descrições acessíveis, URLs e diálogo de privacidade
preservados. Removidos estilos e variante textual transitórios da iteração T304 substituída.

Faixa mobile de Princípios termina em máscara SVG ondulada de 24–32px, usando background do
tema dentro do padding existente. Em 390px, a onda mede 24px e acompanha claro/escuro; em
1440px não há máscara/alteração desktop. Intervalo atual de conteúdo permaneceu 164px mobile
e 86.39px desktop; o token de espaçamento existente nesta rodada não foi alterado.

Inspeção renderizada em 390px claro/escuro e 1440px claro: marca/selos presentes, links e
métricas transparentes com borda 0px, zero SVGs na navegação/métricas, zero overflow horizontal
e nenhum erro de runtime. Privacidade abriu em todos os casos. Imagem externa do selo Green Web
foi bloqueada pelo ambiente e usou o fallback local existente; a URL original foi restaurada no
componente e o relatório mantém seu destino original. Website Carbon mantém grade, data e comparação.
Screenshots inspecionados: `tmp/principles-wave-390-light.png`, `tmp/principles-wave-390-dark.png`,
`tmp/restored-footer-390-light.png` e `tmp/restored-footer-1440-light.png`.
Nenhum teste executado; demais gates continuam adiados.

## Remoção dos divisores entre seções — 2026-11-11

CSS da Home oculta os divisores section-rule-reveal e remove a borda superior do rodapé,
preservando o componente compartilhado para outras páginas. Regras de largura/posição específicas
dos divisores da Home foram removidas. Espaçamento e componentes internos não foram alterados.

Inspeção renderizada em 360/1440px confirmou os três divisores com display none e altura zero,
footer com borda superior 0px, filetes dos títulos mantidos em 2px e linhas de itens em 1px.
Sem overflow horizontal. Screenshot mobile inspecionado: `tmp/section-dividers-removed-360.png`;
evidência desktop em `tmp/section-dividers-removed-1440.png`. Nenhum teste executado; gates adiados.

## Espaçamento mobile +50% e abertura por chegada dos princípios — 2026-11-11

Token mobile de intervalo aumentado de `56px` para `84px` abaixo de `48rem`, incluindo ambas
as metades da faixa de Princípios. Medição renderizada dos seis intervalos de conteúdo confirmou
`84px` em 320/360/412px; desktop preservado em 768px (`56px`), 1440px (`86.39px`) e 1920px (`96px`).
Nenhuma largura apresentou overflow horizontal.

Cada DevelopmentPrinciple observa seu próprio botão no mobile após page-revealed, abre uma vez
ao entrar na área de leitura e preserva prioridade manual. Inspeção com toque em 412px confirmou
seis itens fechados antes de chegar, abertura progressiva durante scroll (primeiro, depois três,
depois cinco e finalmente seis), transição de altura `260ms` e opacidade `180ms`. Primeiro item
fechado manualmente permaneceu fechado ao sair e voltar. Nenhum erro de runtime.
Screenshot inspecionado: `tmp/mobile-principles-scroll-reveal.png`. Movimento reduzido reutiliza
a supressão de transições existente; observador desktop do título permanece inalterado.
Nenhum teste executado; demais gates continuam adiados.

## CTA Serviços para o formulário — 2026-11-11

Substituída a ilustração renderizada por botão primário com nav.talk, preservando PT/EN,
ofertas e Princípios. CTA aponta para o ID real contact-form, usa o controlador de rolagem e
fallback nativo, atualiza hash e foca o formulário com tabindex -1, sem focar campo. Header aceita
foco pelo próprio ID quando não há heading correspondente, evitando redirecionar foco à seção.
Destino direto também evita que a interceptação global de âncoras Lenis substitua o alvo pela seção.

Inspeção renderizada em 320/412px PT e 1440px PT/EN: zero artes na seção; botão mobile com altura
56px e largura disponível; desktop `149.39×44px` PT e `117.63×44px` EN. Cliques navegaram para
`#contact-form`, deixaram o formulário visível e focado em todos os casos, com e sem movimento
reduzido; nenhum input recebeu foco. Sem overflow horizontal nem erros de runtime.
Screenshots inspecionados: `tmp/services-cta-412-pt.png` e `tmp/services-cta-1440-pt.png`.
Nenhum teste executado; demais gates permanecem adiados.

## Prompts sequenciais, sem simultaneidade — 2026-11-11

Mobile: deslize por `3.5s` → clique por `3.5s` → ícone compacto por `10s` → reinício.
Desktop usa clique e pausa compacta; movimento reduzido mantém somente clique estático.
Cada estado renderiza exatamente uma fase, conservando ícones de `28px`, largura intrínseca,
alinhamento central e transição de dimensões existente.

Inspeção temporal no browser em 390px PT confirmou swipe-text inicial, click-text seguinte,
click-icon durante pausa (ainda compacto após nove segundos) e retorno a swipe-text após o
intervalo. Sempre uma única linha/fase. Inspeções em 320px EN/movimento reduzido e 1440px EN
confirmaram somente clique, sem overflow nem erros de runtime. Screenshot inspecionado:
`tmp/hint-sequential-click.png`. Nenhum teste executado; demais gates continuam adiados.

## Currículo mobile e CTA Sobre desktop compacto — 2026-11-11

Adicionado o mesmo link de download PDF do desktop à faixa mobile, abaixo do CTA Sobre, com
gap de `12px` e alinhamento central. Reutilizados texto PT/EN, `/curriculo.pdf`, atributo download,
nome do arquivo, tipo PDF, rótulo acessível e classes do link desktop. CTA desktop recebeu
btn-primary w-fit, mantendo copy e largura pelo conteúdo.

Inspeção renderizada em 320/412px PT e 1440px PT/EN: botão mobile mantém `56px` de altura e
largura disponível; link PDF mede `44px` de altura por área de toque e tem as mesmas classes do
desktop. Botão desktop mede `203.81×44px` em PT e `160.98×44px` em EN, com gradiente compartilhado.
Sem overflow horizontal. Download mobile real concluiu com nome
`Guilherme-Eleutherio-Curriculo.pdf` e sem falha. Screenshots inspecionados:
`tmp/about-ctas-412.png` e `tmp/about-ctas-1440.png`, além da variante 320px.
Nenhum teste executado; demais gates continuam adiados.

## Loader com preparo real e indicadores com ritmo de leitura — 2026-11-11

Home monta Sobre, Projetos, Serviços/Princípios, Depoimentos, Contato e Rodapé sem DeferredSection.
Todos os retratos/logos dos seis depoimentos já estão no DOM. `PagePreparation` aguarda tarefas
iniciais (incluindo estados ready/unavailable do contador), fontes, decode de imagens selecionadas
para a viewport e buffer reproduzível dos vídeos; Hero não inicia atrás do loader. Root permanece
inert/aria-busy e scroll bloqueado até preparo + fade. Efeitos de atividade/viewport aguardam
`page-revealed`; vídeos de projeto mantêm o buffer e só reproduzem por intenção. Cursor desktop,
BackToTop, widget de acessibilidade e código do aviso de privacidade são preparados antes da
interação inicial. O cursor só ativa após revelação; o widget externo fica oculto durante preparo.

Loader externo deixa de usar window.load como sucesso; usa evento explícito de preparo e libera
evento de revelação somente ao remover a sobreposição. Imagens falhas usam SVG local decodificado;
vídeo falho mantém poster/controle de retry. Falha crítica ou prazo global de 45s mostra recarga,
sem marcar sucesso; não há atraso fictício para completar o carregamento.

Inspeção com recursos atrasados em 390px: window.load em `421ms`, preparo em `7438ms` e revelação
em `7663ms`. Durante preparo, seis seções montadas, root inert, Hero pausado e contador ainda em
loading; ao concluir, 18 imagens prontas + uma imagem externa com fallback local, seis vídeos
preparados e nenhum placeholder. Hero começou somente após revelação. Desktop claro e escuro/EN
também reproduziram automaticamente; Princípios estava fechado antes de chegar e abriu os seis
itens somente na chegada. Troca de depoimento não iniciou requisições de imagem em nenhuma rodada.

Falhas simuladas de imagens/vídeo: fallbacks decodificados antes da liberação, Hero indisponível
com poster e sem erro de runtime. Falha simulada também no SVG de fallback: loader mostrou retry,
continuou bloqueando interação e não declarou preparo; após recarga com recurso restaurado,
preparo/revelação concluíram e root foi liberado. Movimento reduzido manteve posters, sem src
de vídeo. Reload PT → EN reaplicou a preparação e terminou com documento em inglês. Sem overflow
horizontal nas inspeções. Evidências: `tmp/readiness-*.png`, `tmp/loader-recovery.png` e scripts
de inspeção em `tmp/inspect-page-preparation.mjs`, `tmp/inspect-readiness-delays.mjs` e
`tmp/inspect-loader-recovery.mjs`.

Indicadores: primeiro estado mostra ambos os prompts no mobile e somente clique no desktop;
mudanças seguintes ocorrem a cada `10s` enquanto o card está ativo e visível. Inspeção temporal
do browser confirmou intro antes de 10s, swipe-icon após 10s e swipe-text após 20s. Ícones medem
`28px`; cápsula inicial PT mede `192.22px`, estado compacto `54px`, legenda de deslize `170.02px`.
Padding do grupo de clique e estados individuais é `12px` nos dois lados; primeira linha da
introdução também ficou simétrica (`23.09/23.11px`). Em 320px EN/movimento reduzido e 1440px EN,
texto estático/inicial centralizado, sem overflow nem erros de runtime. Screenshots inspecionados:
`tmp/hint-initial-390.png`, `tmp/hint-compact-new.png`, `tmp/hint-text-new.png` e variantes 320/1440.

Removido prefixo de texto acidental que tornava About.tsx inválido; cópia preservada em
`tmp/about-source-prefix-recovered.txt`, sem executar as instruções contidas nesse texto.
Nenhum teste, lint, typecheck, build ou gate de carbono foi executado. O carregamento antecipado
amplia a transferência inicial: não há afirmação de manutenção do orçamento A+ nesta iteração.
Vídeos são preparados com buffer para reprodução, sem exigir download integral de todo o arquivo.

## Indicadores autorais de deslize e clique nos projetos — 2026-11-11

Removido o indicador legado de play. `ProjectInteractionHint` usa SVGs próprios: trilho com
setas e marcador móvel para swipe; cursor com onda de pressão para clique. Cápsula escura
translúcida alterna expansão, legenda e troca de ícone em ciclo mobile de `8s`; desktop revela
somente clique ao ativar o card. Copy PT/EN adicionada. Animações pausam fora da viewport e,
no mobile, em cards inativos; movimento reduzido mantém legendas estáticas sem ciclos.

Inspeção renderizada em 360px PT, 320px EN/movimento reduzido e 1440px EN: cinco indicadores
(três projetos e dois clones), nenhum indicador legado, pointer-events none, sem erros de runtime
ou overflow horizontal. Fases de swipe/clique e estado desktop inspecionados em screenshots
`tmp/project-hint-swipe.png`, `tmp/project-hint-click.png`, `tmp/project-hint-1440.png` e
`tmp/project-hint-320.png`. Gesto horizontal mudou o card ativo de GrenGame para Abriu Chaveiro;
links de case abriram `/projetos/abriu-chaveiro` e `/projetos/grengame`.
Nenhum teste executado; demais gates continuam adiados.

## Idioma aplicado somente no novo documento — 2026-11-11

`setLanguagePreference` aceita `applyImmediately`; AppProvider usa `false` antes de reload.
Preferência é salva sem executar publish ou alterar DOM/estado do documento antigo. Bootstrap
existente aplica a seleção no novo carregamento.

Inspeção real em 360/1440px, nos dois sentidos: beforeunload manteve `pt-BR` com `gf-lang=en`,
ou `en` com `gf-lang=pt`; somente após navegação de tipo reload, document.lang mudou para
`en` ou `pt-BR`, respectivamente. Tema, query e hash preservados nos quatro casos.
Nenhum teste executado; demais gates permanecem adiados.

## Navegação mobile suave com layout adiado — 2026-11-11

Reprodução fria do menu mobile → Contato demonstrou cálculo prematuro: o documento crescia de
`1571px` para `7150px` durante a animação, terminando com Contato mais de `4700px` abaixo da viewport.
Header agora solicita as seções até o destino, aguarda headings/fontes e dois frames de layout;
Lenis recalcula dimensões antes da navegação. Listener e frames são cancelados por nova seleção
ou desmontagem; foco usa preventScroll e hash é mantido. Toque nativo permanece sem syncTouch.

Inspeção interativa em 390px com toque: navegação fria completou movimento em 79 amostras de
scroll, com Contato a `7.56px` do topo para scroll-margin esperado de `8px`, foco no heading e
hash `#contato`. Em movimento reduzido, mesma posição com uma única mudança de scroll, sem
animação. Inspeção desktop confirmou uso contínuo do controlador animado; sua abertura automática
de Princípios continua alterando a posição de Contato durante trajetos frios longos, comportamento
fora do recorte mobile desta rodada. Nenhum teste executado; demais gates continuam adiados.

## Reload após troca de idioma — 2026-11-11

`AppProvider.setLang` persiste a nova preferência e recarrega a página atual; seleção idêntica
retorna sem reload. Os controles existentes mobile/desktop usam a mesma implementação.
Inspeção interativa em 360/1440px confirmou PT → EN → PT com navegação do tipo `reload`,
`document.lang` correto (`en`/`pt-BR`) e preferência `gf-lang` persistida. Tema escuro, query
`?language-inspection=1` e hash `#home` foram preservados nos quatro reloads.
Nenhum teste executado; demais gates continuam adiados.

## CTAs, links sociais, rodapé e autoplay mobile — 2026-11-11

CTAs da Home abaixo de `48rem` usam altura mínima `56px`, fonte `16px` e largura disponível.
Links sociais usam `52×52px` e ícones `26px`. Rodapé mobile mantém botões de navegação `64px`,
amplia legais para `52px` e usa `footer-foreground` (`#f2efe8`) no texto/ícones, corrigindo a
herança do acento azul escuro sobre fundo escuro no tema claro.

Hero recebe intenção `mobile-autoplay` sem input abaixo de `48rem`, mantendo mute, inline, loop,
pausa manual, controle de atividade e fallback. Inspeção sem interação em 320/claro e 412/escuro
registrou status playing, tempo avançando e muted/playsInline verdadeiros. Pausa manual funcionou.
Em 360px com movimento reduzido, o vídeo ficou sem src, pausado e com poster; em 1440px a política
desktop foi preservada (sem src antes de intenção). Sem erros de runtime e sem overflow horizontal.

Screenshots inspecionados: `tmp/mobile-larger-buttons.png` e `tmp/footer-mobile-contrast.png`.
Nenhum teste executado; lint, typecheck, builds e demais gates continuam adiados.

## Separação mobile de Princípios e posição da introdução Sobre — 2026-11-10

Princípios agora ocupa faixa full-bleed em `accent-soft`, com fundo `#e8eef4` no claro e `#1c3348`
no escuro. Inspeção renderizada em 360px confirmou distinção de Serviços e os seis disclosures
inicialmente recolhidos. Screenshots inspecionados: `tmp/principles-background-light.png` e
`tmp/principles-background-dark.png`. Conteúdo e desktop preservados.

Medição dos seis intervalos da Home em 320/360/412/768/1440/1920px confirmou os mesmos valores
da rodada anterior (`56px`, `86.39px` e `96px`), sem overflow horizontal. A faixa divide o espaço
em metades para conservar os limites de conteúdo entre Serviços, Princípios e Depoimentos.

Sobre: comparação renderizada com o CSS anterior confirmou deslocamento de `24px` para baixo
em 320/360/412px, `0px` em 1440px e ausência de overflow. Alteração limitada à margem inferior
da introdução mobile; retrato e desktop preservados. Evidência: `tmp/about-title-lower-mobile.png`.
Nenhum teste executado; demais gates continuam adiados.

## Ritmo vertical uniforme entre as seções — 2026-11-10

Removidos paddings acumulados de Serviços/Princípios/Depoimentos e altura mínima com margens
automáticas fora do Hero em 1920px. Todas as entradas usam `--home-section-start`, agora definido
como `clamp(3.5rem, 6vw, 6rem)`. Divisores existentes ficam posicionados sem consumir altura no fluxo.
Contato mantém respiro inferior com o mesmo token antes do rodapé; composição interna preservada.

Medição renderizada de seis intervalos (Hero → Sobre → Projetos → Serviços → Princípios →
Depoimentos → Contato): todos medem `56px` em 320/360/412/768px, `86.39px` em 1440px e `96px`
em 1920px. Em Contato, o limite superior é o menor topo entre cabeçalho e formulário, mantendo
o alinhamento vertical editorial aprovado no desktop. Sem overflow horizontal em todas as larguras.
O intervalo Princípios → Depoimentos, antes de aproximadamente `272px` em 1440px, passou a `86.39px`.
Screenshots inspecionados: `tmp/section-spacing-desktop.png` e `tmp/section-spacing-mobile.png`.
Nenhum teste executado; lint, typecheck, builds e demais gates continuam adiados.

## Estabilidade do wordmark do loader — 2026-11-10

Reprodução com CSS/bootstrap e fontes atrasados: overlay inicial media `408×848px` numa viewport
`360×800px`, pois padding de `24px` era somado à caixa. A chegada do reset border-box deslocava
o logo em `−24px` nos dois eixos. A largura do sufixo em `6.1ch` também mudava após carregar
Space Grotesk, causando deslocamento adicional de `−5.33px` em mobile e `−8.88px` no desktop.

Correção mínima em `public/preloader.css`: box-sizing explícito no overlay e sufixo com largura
fixa de `4em`. Inspeção renderizada em 360/1440px confirmou posições idênticas da marca antes e
depois do reset e da fonte; círculo em `(108.56, 362.84)` e `(600.94, 342.73)`, respectivamente.
Loader removido normalmente após load, sem alteração dos timers/scramble. Screenshot mobile
inspecionado em `tmp/loader-stable-360.png`; desktop em `tmp/loader-stable-1440.png`.
Nenhum teste executado; demais gates continuam adiados para finalização consolidada.

## Proporção desktop dos itens de Serviços e Princípios — 2026-11-10

Escala local aplicada a partir de `48rem`: títulos dos itens passam de `24px` para `18px`,
com entrelinha `24.3px`; descrições passam de `16px` para `15px`, com entrelinha `24px`.
Cabeçalhos de seção continuam em `38px` e introduções em `18px`. Conteúdo e interações preservados.

Inspeção renderizada em 1400px, PT-BR/claro e EN-US/escuro: títulos mais contidos nas grades,
sem erros de runtime. Comparação em 320/412px confirmou tipografia mobile preservada (`20px`
nos títulos dos itens, `15px` no corpo, `27px` nos títulos principais), sem overflow horizontal.
Evidências: `tmp/services-mockup-desktop.png` e `tmp/services-mockup-english-dark.png`.
Nenhum teste executado; lint, typecheck, builds e demais gates permanecem adiados.

## Refinamentos mobile de Serviços, Princípios e Depoimentos — 2026-11-10

Arte centralizada a 90% abaixo de `48rem`; título longo de Depoimentos com escala local de
`22–24px`, sem alterar copy. O observador de entrada dos princípios atua somente no desktop;
mobile começa com os seis painéis fechados e mantém abertura/fechamento por toque.

Inspeção renderizada em 320/360/412/768/1440px: nenhum overflow horizontal. Arte mobile passou
de `295.14/332.03/380px` para `265.63/298.83/342px`. Título PT-BR passou de três para duas linhas
em 360/412px, mantendo três em 320px; EN-US usa três linhas em 360px. Seis painéis permanecem
fechados após chegada no mobile; primeiro toque abre e segundo fecha. Em 768/1440px, os seis
continuam abrindo na entrada, título mantém `38px` e dimensões da arte não mudam.
Screenshots: `tmp/mobile-services-refined.png`, `tmp/mobile-principles-refined.png` e
`tmp/mobile-testimonials-refined.png`. Nenhum teste executado; demais gates continuam adiados.

**Data**: 2026-10-16  
**Recorte consolidado**: seção Depoimentos

## Resultado do recorte

A seção Depoimentos está concluída dentro do escopo visual aprovado. A consolidação preservou a
composição editorial, os seis relatos, a localização PT/EN, os vínculos de autoria, as imagens de
contexto profissional e os links seguros para o LinkedIn.

Os ajustes finais incluíram:

- alvos de toque de pelo menos 44 × 44 px, com seletor 3 × 2 em viewports estreitas;
- altura estável durante a troca de relatos, inclusive em 320 e 375 px;
- ausência de overflow horizontal e de cortes entre citação e autoria;
- imagens de autoria com `srcset` AVIF/WebP adequado a DPR 1, 2 e 3;
- polaridade temática, contraste, autoplay, pausa por interação e movimento reduzido;
- controle explícito para pausar/retomar a rotação e anúncio educado das trocas manuais;
- compensação do cabeçalho fixo ao navegar diretamente para a seção;
- baselines visuais em desktop claro e mobile escuro.

## Evidências executadas

| Verificação                                                                                                   | Resultado                                                                                                                                 |
| ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Suite focada de Depoimentos (conteúdo, PT/EN, links, altura, touch, mídia, contraste, axe e regressão visual) | **24 aprovados**                                                                                                                          |
| `npm run lint`                                                                                                | **Aprovado**                                                                                                                              |
| `npm run typecheck`                                                                                           | **Aprovado**                                                                                                                              |
| `npm run test:api`                                                                                            | **71 aprovados**                                                                                                                          |
| `npm run build`                                                                                               | **Aprovado** para frontend e API                                                                                                          |
| `npm run test:a11y`                                                                                           | **249 aprovados e 39 falhas** na execução integral; as duas falhas relacionadas a Depoimentos foram corrigidas e revalidadas isoladamente |
| `npm run carbon:check`                                                                                        | **Reprovado**: 352,2 kB medidos para limite A+ de 272,5 kB                                                                                |

## Pendências fora do recorte

A execução integral ainda contém expectativas legadas ou trabalho incompleto em Hero, Sobre,
Projetos, Footer, metadados de case e baselines gerais da Home. Essas falhas não foram mascaradas nem
corrigidas durante a consolidação de Depoimentos para evitar alteração de layouts já fora deste
recorte.

O gate de carbono também permanece globalmente bloqueado. Os maiores recursos contabilizados são o
bundle principal (103,9 kB), uma imagem da seção Sobre (49,8 kB) e bibliotecas compartilhadas; o
primeiro contexto profissional visível em Depoimentos soma 19,6 kB e o retrato responsivo soma 1,4
kB. Como a redução necessária é de 79,7 kB, a correção exige uma rodada de otimização da Home como um
todo, não apenas desta seção.

## Decisão

Depoimentos pode ser considerado **concluído no escopo da seção**. A feature 003 completa ainda não
está elegível para staging ou commit pelos gates constitucionais enquanto a suite integral e o
orçamento A+ não estiverem verdes.

## Iteração de Projetos desktop — 2026-11-09

- Escopo: grade com duas colunas a partir de 1024px, frames `1.28:1`, badges superiores, overlay
  com descrição/contexto localizados e ações na base. CSS mobile/tablet preservado.
- Inspeção renderizada direcionada, sem executar suíte de testes: Chromium em 1440×1000 e
  1024×900, PT-BR/claro. Capas e estado ativo inspecionados nos arquivos
  `tmp/projects-desktop-idle.png`, `tmp/projects-desktop-hover.png` e `tmp/projects-desktop-1024.png`.
- Em 1440px, os três frames mediram `591 × 461.71875px` (`1.28:1`), com as mesmas coordenadas e
  dimensões antes e durante hover. O preview ativo estava em reprodução (`paused: false`,
  `readyState: 4`); após saída, ficou pausado e sem `src`. Sem erros de runtime nesta inspeção.
- Em 1024px, `scrollWidth` e `clientWidth` mediram ambos `1024px`; conteúdo do overlay coube no frame.
- Pendentes por solicitação explícita: testes, lint, formatação automatizada, typecheck, builds e
  carbono. EN-US, temas alternativos, navegação por teclado, movimento reduzido e demais larguras
  devem ser incluídos na finalização consolidada. Esta evidência não conclui os gates globais.

### Refinamento de largura e badges — 2026-11-09

Inspeção renderizada desktop repetida após remover o limite global da seção, os gaps, as bordas e
os raios dos frames e restaurar o estilo original dos badges. Em 1440px, os frames medem
`720 × 562.5px` (`1.28:1`), com o primeiro em `x=0`, o segundo em `x=720` e a segunda linha
imediatamente após a primeira. Dimensões e posições permanecem iguais no hover. Em 1024px, não há
overflow horizontal (`scrollWidth=clientWidth=1024`). Preview reproduz em hover e pausa ao sair;
sem erros de runtime na inspeção. Os screenshots desktop acima foram atualizados. Testes, lint,
typecheck, build e demais gates continuam adiados.

### Enquadramento, nitidez e crossfade de mídia — 2026-11-09

- Causa: `cover` ampliava/recortava mídias panorâmicas nos frames `1.28:1`; sources grid usavam
  compressão elevada, e capas/vídeos tinham proporções e escalas diferentes. Remover `src`
  imediatamente na saída interrompia o fade antes de concluído.
- Correção: posters desktop extraídos dos vídeos em `0.1s`, resolução nativa de `1280px`, AVIF
  qualidade 65 / WebP qualidade 90. Os três AVIF somam 78.240 bytes. Desktop usa `contain` para
  ambos os meios, centralizados sobre fundo escuro. O poster permanece sob o vídeo, que aparece
  somente após um frame apresentado; na saída, pausa imediatamente e libera `src` após `320ms`.
- Geração: `node scripts/generate-project-preview-posters.mjs`. Esse comando gera assets; não é
  uma suíte de testes. Mobile/tablet preservam sources grid e posicionamento anteriores.
- Inspeção renderizada desktop: os três players carregaram posters AVIF correspondentes, com
  `object-fit: contain` em imagem e vídeo. Vídeos de GrenGame, Abriu Chaveiro e Martha Izabel
  medem respectivamente `1280×606`, `1280×612` e `1280×614`; todos apresentaram frames. Após
  saída e `400ms`, o preview ficou pausado e sem `src`. Nenhum erro de runtime foi observado.
- Em 1440px, frames continuam `720×562.5px`, sem alteração geométrica ao hover; em 1024px,
  `scrollWidth=clientWidth=1024`. Screenshots desktop atualizados nos caminhos já registrados.
- Testes, lint, typecheck, build, carbono e validação cross-browser permanecem adiados conforme
  solicitado; a resolução dos vídeos existentes limita o detalhe disponível em telas maiores.

### Preenchimento integral e caixa do cursor — 2026-11-09

O refinamento seguinte substitui `contain` por `cover` em imagem e vídeo desktop, centralizados e
sem alterar proporções: os frames ficam inteiramente cobertos, sem barras de enquadramento. Os
posters AVIF/WebP na resolução nativa e o crossfade com vídeo decodificado permanecem. O link do
card recebeu `data-cursor-tooltip="media"`, reconhecido pelo cursor mesmo sem mídia descendente.

Inspeção renderizada em 1440px confirmou a caixa “Abrir o projeto GrenGame” ao hover, preenchimento
dos três frames e geometria estável (`720×562.5px`). Os três players apresentaram vídeo; todos os
pares de mídia computaram `cover`. Em 1024px, não houve overflow horizontal. Sem erros de runtime
observados. Screenshots desktop atualizados; testes e gates continuam adiados.

## Restauração editorial alternada — 2026-11-09

Referência: markup de mídia, badges, detalhes e ações recuperado do checkpoint Git `a72824b`, com
alternância aplicada aos três itens conforme T109. O checkpoint contém o primeiro item editorial;
a versão inteira alternada foi reconstruída a partir desse markup e do requisito registrado.
O frame global foi restaurado. Refinamento seguinte removeu o convite final com botão de Contato
e a linha numerada de categoria de todos os projetos, nos dois idiomas.

Inspeção renderizada em 1440px: mídia de GrenGame em `x=120`, descrição em `x=874.55`; Abriu Chaveiro
com descrição em `x=120` e mídia em `x=651.83`; terceiro item repete a orientação do primeiro.
Previews medem aproximadamente `668px` de largura, preservando a proporção natural. Badges ficam
abaixo da mídia nos três itens. Hover reproduz vídeo e mostra “Abrir o projeto GrenGame”. Em 1024px,
`scrollWidth=clientWidth=1024`. Sem erros de runtime observados. Screenshots:
`tmp/projects-editorial-restored.png`, `tmp/projects-editorial-hover.png` e
`tmp/projects-editorial-1024.png`. Testes, lint, typecheck, build e gates globais permanecem adiados.

## Substituição por Serviços e Mais do que código — 2026-11-09

Referência visual: `C:/Users/Guilherme/Downloads/mockup_secao_portfolio.png`, inspecionada antes da
implementação. O conteúdo anterior foi substituído integralmente pelos dois blocos, quatro serviços
e oito práticas, com texto PT-BR do mockup e tradução EN-US. Implementação estática em HTML/CSS,
sem mídia adicional nem novas dependências; `#habilidades` preservado para navegação/carregamento.

Inspeção renderizada em Chromium a `1400×1150`: frame interno de `1110px` em `x=145`, conforme a
referência, altura total de aproximadamente `1123.58px`. Grade superior `2×2` e inferior `4×2`,
tipografia e divisores inspecionados em PT-BR/claro e EN-US/escuro; contagem de quatro serviços e
oito práticas confirmada no DOM, sem erros de runtime observados. Evidências:
`tmp/services-mockup-desktop.png` e `tmp/services-mockup-english-dark.png`.

Testes, lint, typecheck, build, carbono e validação ampliada de acessibilidade/reflow permanecem
adiados por solicitação do usuário. Esta inspeção visual não substitui esses gates.

## Ícones de stack em Projetos — 2026-11-09

Adicionada lista flexível dos seis ícones de `project.stack` acima das ações de cada projeto,
reutilizando `TechnologyIcon` e suas cores temáticas. Nenhum título, descrição, badge ou destino
foi alterado. `data-cursor-label` exibe somente o nome da tecnologia na caixa contextual existente;
`role="img"` e `aria-label` preservam o nome acessível, sem simular ação navegável.

Inspeção renderizada em 1440px confirmou as três linhas de seis ícones e a caixa de hover com
“React”, “HTML” e “React 18”, respectivamente. A composição alternada e a posição das colunas
permaneceram; em 1024px e 412px, `scrollWidth` coincidiu com a largura do viewport. Sem erros de
runtime observados. Evidência: `tmp/projects-stack-tooltip.png`. Testes, lint, typecheck, build e
demais gates permanecem adiados conforme a fase de iteração rápida.

## Transição entre ícones e introdução curta — 2026-11-09

Agrupamento explícito de rótulos mantém o tooltip ao atravessar gaps da mesma stack. A largura é
calculada pelo maior nome do grupo; a lista ocupa somente a largura dos ícones. Serviços mantém
apenas o primeiro parágrafo em PT/EN. Na inspeção renderizada, React → gap → TypeScript preservou
tooltip visível, cursor de seta oculto e largura de `72px` nas três posições; somente o nome mudou
ao entrar no ícone seguinte. Sem erros de runtime ou overflow em 1024px/412px. Evidência:
`tmp/projects-stack-stable-tooltip.png`. Testes e gates continuam adiados.

## Revisão de voz de Serviços e Como eu trabalho — 2026-11-09

Análise baseada na apresentação e trajetória de Sobre, na chamada de Contato, nos três resumos de
projetos e na seção de voz textual do MIV. A copy anterior repetia IA, performance, acessibilidade e
integrações em ambos os blocos. A nova redação diferencia ofertas concretas (quatro serviços) de
cuidados na execução (seis práticas), com primeira pessoa e sem superlativos ou promessas de
conformidade. Suporte em TI retoma uma atividade já descrita na apresentação do usuário e no Hero.

“Mais do que código” passa a “Como eu trabalho” / “How I work”. A grade inferior muda de quatro
para três colunas no desktop, preservando duas linhas e o reflow existente. Tradução EN-US mantém
intenção e tom, sem exigir equivalência literal.

Inspeção renderizada em `1400×1150`, PT-BR/claro e EN-US/escuro: frame de `1110px` em `x=145`, quatro
serviços e seis práticas presentes, textos e divisores legíveis e sem erros de runtime observados.
Screenshots atualizados em `tmp/services-mockup-desktop.png` e
`tmp/services-mockup-english-dark.png`. Nenhum teste foi executado. Lint, typecheck, build, carbono
e validações ampliadas permanecem adiados nesta iteração.

## Restauração dos três cards expansíveis — 2026-11-10

Reconstruída a apresentação anterior aos banners com referência em T211–T221 e no código
inspecionado antes daquela migração: três cards verticais, faixa escura/desfocada à esquerda,
títulos/badges verticais no repouso, indicador circular e expansão ativa com título horizontal
e links na base. O player mantém fade seguro e as capas desktop usam os sources AVIF de 1600px.
Descrições/stack continuam nos dados; não aparecem como blocos editoriais neste layout. Demais
seções e remoções anteriores de linha numerada/convite final foram preservadas.

Inspeção renderizada Chromium em 1440px: larguras iniciais de aproximadamente `382.73px`, altura
`633.59px`; no hover, ativo `765.47px` e vizinhos `191.36px` cada, confirmando proporção `2 / 0.5 /
0.5` na largura útil. Os três previews apresentaram frames após hover nos cards estabilizados;
na saída, reprodução pausada e `src` liberado após o fade. Em 1024px, não houve overflow horizontal
(`scrollWidth=clientWidth=1024`). Sem erros de runtime observados. Evidências atualizadas:
`tmp/projects-desktop-idle.png`, `tmp/projects-desktop-hover.png`, `tmp/projects-desktop-1024.png`.

Tablet/carrossel mobile foram restaurados no código, com ativação visual inicial sem request
automático de vídeo; inspeção ampliada desses modos e de teclado/movimento reduzido permanece
pendente. Testes, lint, typecheck, build e gates globais não foram executados nesta rodada.

## Copy de Princípios de desenvolvimento pelo PDF — 2026-11-10

Os seis pares antes/depois foram extraídos do PDF fornecido “Entender o problema.pdf” e aplicados
ao dicionário PT-BR, com tradução EN-US. Nenhuma orientação operacional foi inferida do documento.
Layout e demais seções preservados; os textos mais longos refluem na grade existente.

Inspeção renderizada em 1400px, PT-BR/claro e EN-US/escuro: seis princípios e quatro serviços
presentes, frame interno de 1110px, sem erros de runtime observados. Screenshot PT-BR inspecionado
em `tmp/services-mockup-desktop.png`; versão EN-US em `tmp/services-mockup-english-dark.png`.
Nenhum teste executado; demais gates continuam adiados.

## Hierarquia tipográfica de Serviços e Princípios — 2026-11-10

Substituídas as escalas próprias do mockup pelos quatro papéis tipográficos compartilhados.
Títulos editoriais, introduções, nomes dos itens e descrições usam os mesmos tokens e classes
da Home; filetes curtos também reutilizam o estilo editorial. Copy, arte, grade e comportamento
dos disclosures preservados; divisores externos não foram reintroduzidos.

Inspeção renderizada PT-BR/claro e EN-US/escuro em 1400px. Comparação de estilos computados mostrou
igualdade de tamanho/peso/entrelinha/tracking entre títulos de Projetos, Serviços e Princípios:
`38px / 500 / 42.56px / -1.14px`, e entre introduções: `18px / 400 / 27.9px / normal`. Títulos dos
serviços e gatilhos dos princípios mediram `24px / 500 / 28.8px / -0.48px`; descrições mediram
`16px / 400 / 25.6px / normal`. Em 412px/320px, os papéis correspondentes mediram `27/16/20/15px`,
respectivamente, sem overflow horizontal. Evidências: `tmp/services-mockup-desktop.png`,
`tmp/services-mockup-english-dark.png`; inspeção em `tmp/inspect-services-type.mjs`.
Nenhum teste executado; lint, typecheck, build e demais gates permanecem adiados.

## Revisão de maiúsculas e acentuação — 2026-11-10

Revisados dicionário PT-BR, títulos e cargos da Home, nomes de projetos compartilhados com os
cases, títulos de Privacidade, metadados e legendas de Sobre. Padronizados em caixa de frase os
títulos autorais, como “Briefing inicial”, “Uso de inteligência artificial”, “Portfólio profissional”
e “Aviso de privacidade”; cargos e meses portugueses foram ajustados. Corrigidos “LLM’s” para
“LLMs” e inícios de frases completas do formulário, com alinhamento editorial EN-US. Os acentos
existentes em “Princípios”, “análise”, “proteção”, “público”, “privacidade” e demais textos revistos
foram preservados conforme a grafia aplicável. Nenhuma grafia de marca, nome pessoal, sigla ou
citação literal foi normalizada automaticamente.

Inspeção renderizada de Princípios em 1400px (PT-BR/claro e EN-US/escuro) sem erros de runtime;
layout preservado. Leitura do DOM da Home confirmou “Sou desenvolvedor full-stack”, “Portfólio
profissional” e “Enviar mensagem”; `/privacidade` confirmou o H1 “Aviso de privacidade”. Evidências:
`tmp/services-mockup-desktop.png`, `tmp/services-mockup-english-dark.png`,
`tmp/copy-review-privacy.png`. Testes, lint, typecheck, build e demais gates permanecem adiados.

## Substituições dos quatro serviços — 2026-11-10

Aplicadas as descrições fornecidas pelo usuário e equivalentes EN-US. Títulos atualizados para
Websites e aplicações de web e Análise de SEO e indexação orgânica; Integrações e automações e
Suporte em TI preservam os nomes. Corrigidos acento em “portfólios”, capitalização de termos comuns
e separação de frases na descrição de integrações. Sem mudança no CSS, na introdução ou nos
princípios. Textos maiores aumentam naturalmente a altura do bloco.

Inspeção renderizada em 1400px, PT-BR/claro e EN-US/escuro: quatro serviços e seis princípios
presentes, textos refluem na grade existente e nenhum erro de runtime observado. Evidências
atualizadas em `tmp/services-mockup-desktop.png` e `tmp/services-mockup-english-dark.png`.
Nenhum teste executado; demais gates permanecem adiados.

## Ilustrações autorais dos quatro serviços — 2026-11-10

Criadas quatro cenas SVG em `ServiceIllustration.tsx`, sem biblioteca de arte nem requisições de
imagem: construção de website com componente e tela móvel, conexão de checkout/chat/pedido,
investigação de busca com lupa e manutenção de computador com placa/memória. Personagem, chão
isométrico e materiais são compartilhados; gradientes possuem ids únicos e a paleta local se
adapta ao tema. Artes decorativas ficam abaixo das descrições e se alinham na base de cada linha,
sem modificar copy ou Princípios. Identificadores estáveis associam serviço e arte nos dois idiomas.

Inspeção renderizada em 1400px (PT-BR/claro e EN-US/escuro): quatro cenas presentes e sem erros de
runtime. Inspeção em 412px e 320px: largura do documento igual ao viewport; SVGs mediram,
respectivamente, `348×222.33px` e `256×163.55px`, mantendo proporção. Evidências:
`tmp/service-illustrations-preview.png`, `tmp/service-illustration-mobile.png` e screenshots da
seção em `tmp/services-mockup-desktop.png` / `tmp/services-mockup-english-dark.png`.
Testes, lint, typecheck, build e gates globais permanecem adiados nesta iteração.

## Disclosures de Princípios de desenvolvimento — 2026-11-10

Criado `DevelopmentPrinciple` com botão semântico, ids únicos, hover/foco e alternância por toque,
`aria-expanded`, `aria-controls`, `aria-hidden` e `inert` sincronizados. Escape recolhe o painel.
Descrição anima por grid `0fr → 1fr` e opacidade em até `260ms`; conteúdo fechado fica sem altura
e fora da leitura assistiva. Títulos, descrições, ordem, Serviços e ilustrações não foram alterados.

Inspeção renderizada em Chromium: no desktop, o primeiro painel passou de `0px` para `104.375px`
em hover/foco e voltou a `0px` na saída/Escape, com estados ARIA e inert coerentes. Em contexto
mobile com toque a 412px, primeiro toque abriu e segundo fechou; sem overflow horizontal ou erros
de runtime observados. Movimento reduzido computou transição efetivamente instantânea (`0.00001s`,
conforme regra global de acessibilidade). Evidências: `tmp/principles-dropdowns-closed.png`,
`tmp/principles-dropdowns-hover.png` e `tmp/principles-dropdowns-mobile.png`.
Testes, lint, typecheck, build e demais gates continuam adiados.

## Revelação de entrada e controle manual dos princípios — 2026-11-10

Observação única do título inicia abertura dos seis painéis a intervalos de `100ms`. Hover e mero
foco não abrem mais; botão nativo alterna por clique/toque/Enter/Espaço e Escape fecha. Interação
manual impede qualquer abertura posterior agendada, com estado preservado entre traduções.
Movimento reduzido abre sem escalonamento; não há alteração de texto, serviços ou ilustrações.

Inspeção renderizada Chromium em 1440px: antes da chegada, seis itens recolhidos; após entrada,
amostras mostraram 1, depois 3, depois 6 itens abertos. Após fechar manualmente, hover e foco
mantiveram o item fechado, Enter abriu, Escape fechou e retornar à seção não repetiu a introdução.
Em contexto touch de 412px com movimento reduzido, os seis abriram imediatamente; toque fechou e
toque seguinte reabriu o primeiro. Nenhum erro de runtime observado. Evidências:
`tmp/principles-entry-reveal.png` e `tmp/principles-entry-mobile.png`.
Nenhum teste ou gate automatizado executado nesta rodada; finalização consolidada permanece pendente.

## Ilustração única de Serviços sem personagens — 2026-11-10

Removidas as quatro cenas e o componente anterior com personagens. Criado `ServicesIllustration`
com laptop/browser, dispositivo móvel, infraestrutura, memória e busca conectados. Há uma única
arte sob a descrição geral na coluna esquerda; nenhum SVG nos itens individuais. Copy e interação
de Princípios preservadas; ids, tema e semântica decorativa permanecem no SVG estático.

Inspeção renderizada em 1400px, PT-BR/claro e EN-US/escuro, sem erros de runtime. DOM confirmou uma
arte na introdução e zero nos itens. Em 412px/320px, a largura do documento coincide com a viewport;
arte mede `348×243.59px` e `256×179.19px`, respectivamente. Evidências:
`tmp/services-overview-preview.png`, `tmp/service-illustration-mobile.png`,
`tmp/services-mockup-desktop.png` e `tmp/services-mockup-english-dark.png`.
Nenhum teste executado; lint, typecheck, build e demais gates continuam adiados.

## Paleta do projeto na ilustração de Serviços — 2026-11-10

Substituídas todas as cores literais do SVG e variáveis locais por referências aos tokens
semânticos existentes. Gradientes usam `accent-2 → accent` e `accent-soft → surface-2`; os demais
materiais usam superfícies, primeiro plano, texto secundário, borda e azuis do tema. Removida a
paleta ilustrativa independente e a duplicação de cores para tema escuro. Desenho/layout preservados.

Inspeção renderizada PT-BR/claro e EN-US/escuro confirmou aplicação dos azuis e neutros do projeto,
sem erros de runtime. Posição única na introdução e dimensões em 412px/320px permanecem iguais,
sem overflow horizontal. Preview atualizado em `tmp/services-overview-preview.png`; screenshots
da seção em `tmp/services-mockup-desktop.png` e `tmp/services-mockup-english-dark.png`.
Nenhum teste executado; demais gates continuam adiados.
