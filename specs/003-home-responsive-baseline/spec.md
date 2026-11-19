# Feature Specification: Baseline Responsivo da Home

**Feature Branch**: `003-home-responsive-baseline`

**Created**: 2026-09-29

**Status**: Draft

**Input**: Migração dos requisitos legados de composição e responsividade da Home.

## Clarifications

### Session 2026-11-11 — CTA da nav acompanha estado ativo

- Ocultar CTA Entre em contato/Get in touch quando a navegação estiver recolhida/inativa.
  Renderizar junto aos demais controles quando expandida por hover/foco/abertura, sem
  deixar alvo invisível ou foco de teclado oculto. Preservar navegação ao formulário e mobile.

### Session 2026-11-11 — nav com metade do inset lateral

- Reduzir somente inset da navegação/ações pela metade: 24px mobile, 32px tablet e
  clamp(40px,4vw,72px) desktop. Seções permanecem com insets atuais. Remover compensação
  horizontal dos links desktop pequeno se a largura recuperada dispensar o ajuste.

### Session 2026-11-11 — título da Home coerente com index

- Respeitar o título desejado pelo usuário: “Portfólio - Guilherme Ferreira Eleuthério”
  no runtime PT da Home, com “Portfolio - Guilherme Ferreira Eleuthério” em EN. O index
  já foi alterado pelo usuário e deve permanecer intacto. Preservar títulos específicos das
  outras rotas; og:title/twitter:title acompanham a fonte de metadata existente. Sem testes.

### Session 2026-11-11 — centralização vertical da introdução de Serviços

- Centralizar verticalmente o bloco título/introdução/CTA de Serviços ao lado da grade de
  ofertas, mantendo centralização horizontal e stack responsivo. Sem alterar outros blocos.

### Session 2026-11-11 — alinhamentos e controles uniformes

- Alinhar título/filete de Projetos à esquerda. Centralizar título, introdução, filete e CTA
  do bloco editorial de Serviços dentro da coluna atual, sem centralizar a grade de ofertas.
- Uniformizar controles de anterior/próximo/play/pause de Hero, Princípios e Depoimentos
  pelo padrão de Depoimentos: ícones de 16px/stroke 1.5, área 44px, sem caixa/círculo/fundo,
  foco visível e cor adequada ao fundo (clara sobre vídeo). Manter posições, aria-labels,
  navegação e reprodução; links/CTAs de navegação textual não mudam. Sem testes/gates.

### Session 2026-11-11 — nav alinhada e títulos revisados

- Alinhar conteúdo da navegação e ações desktop ao inset atual da Home: 48px mobile,
  64px tablet, clamp(80px,8vw,144px) desktop. Preservar fundo flutuante mobile e compensar
  seu inset próprio para não acumular espaços. Título do Hero permanece intacto.
- Centralizar horizontalmente título, filete e introdução de Princípios; marquee continua
  full-width. Projetos usa “Cases selecionados que detalham o contexto, as escolhas feitas
  e as entregas finais de cada projeto.” como título, sem subtítulo. Traduzir EN e remover
  campos de introdução obsoletos. Preservar conteúdo/interações dos cards. Sem testes/gates.

### Session 2026-11-11 — insets dobrados e alinhamento central dos depoimentos

- Dobrar os insets atuais das seções de conteúdo/rodapé, incluindo Sobre e Projetos:
  48px mobile, 64px tablet e clamp(80px,8vw,144px) desktop. Preservar Header/Navegação
  e título do Hero (posição/largura atuais), sem dobrar seu gutter. Preservar marquee
  de Princípios full-width; toolbar acompanha o novo inset. Sem limite global de largura.
- Em Depoimentos, centralizar horizontalmente texto, aspas, imagens e dados/links de autoria
  dentro da composição atual, mantendo colunas desktop e stack mobile. Título/filete ficam
  alinhados à esquerda. Preservar conteúdo, animações, controles e redução de movimento.
  Inspecionar reflow/overflow e geometria dos elementos protegidos, sem testes/gates.

### Session 2026-11-11 — espaçamento de Sobre como referência e marquee full-bleed

- Igualar os insets de conteúdo das seções da Home e Footer ao padding atual de Sobre:
  24px mobile, 32px de 768 a 1023px e clamp(40px,4vw,72px) no desktop. Incluir texto do
  Hero e molduras de Projetos. Preservar composição de Sobre e Header independente.
- Título/introdução de Princípios seguem esse alinhamento, mas viewport dos cards do
  marquee deve ser full-width, x=0 até a borda oposta, sem inset. Toolbar permanece alinhada
  ao conteúdo. Não reintroduzir limite de largura/centralização global nem padding duplicado.
  Preservar textos, mídias, dimensões dos cards do marquee e interações. Inspecionar sem testes.

### Session 2026-11-11 — alinhamento lateral localizado conforme revisão anexada

- Restaurar organização horizontal somente em Serviços/Princípios, Depoimentos, Contato e
  Footer, sem recriar max-width, centralização global ou padding universal. Escala local:
  16px até 767px, 24px entre 768–1023px, 32px entre 1024–1439px e 40px a partir de 1440px.
  Fundos e containers externos continuam com largura integral; aplicar um único inset interno.
- Header/Navegação, Sobre e Projetos ficam excluídos: preservar geometria e composição.
  Manter conteúdo, fontes, cores, animações, grids e dimensões dos cards. Serviços e título
  de Princípios compartilham referência lateral; preservar onda/fundo mobile full-bleed.
- Contato mantém proporções/stack de colunas, mas remove centralização/limite extra do bloco
  editorial e largura 95% do formulário para evitar offsets acumulados. Footer mantém colunas,
  conteúdo e fundo integral. Inspecionar 375/768/1024/1440/1920px e comparar excluídos antes/depois.
  Sem novas dependências/refactors; testes/gates continuam adiados nesta iteração visual.

### Session 2026-11-11 — remoção do frame lateral global

- Remover limite compartilhado de 75rem e gutters laterais da Home, páginas internas,
  Header e Footer. Containers passam a ocupar 100% da largura disponível; Hero/Sobre
  não devem reintroduzir a moldura. Remover também os limites externos de Serviços e
  palco de Depoimentos que impediriam expansão das seções. Preservar padding interno
  de componentes, medidas de leitura e conteúdo. Sem alterar espaçamento vertical.
  Inspecionar geometria/overflow em mobile e desktop; testes/gates seguem adiados.

### Session 2026-11-11 — marquee dos princípios com inércia

- Substituir dropdowns de Princípios por cards de título/descrição sempre visíveis num
  marquee horizontal infinito, inspirado em https://codepen.io/sj-jay/pen/JjxORaL.
  Preservar integralmente os seis conteúdos PT/EN, hierarquia e fundo/onda da seção.
- Arrastar com mouse/toque em ambos os sentidos, deslocamento 1:1 e velocidade proporcional
  à força do gesto. Ao soltar, manter impulso na direção escolhida, decaindo suavemente
  até velocidade automática constante nessa direção, sem saltos na emenda do loop.
- Incluir pausa/retomada, anterior/próximo e teclado; não bloquear rolagem vertical mobile.
  Cópia visual do loop fica fora da árvore acessível. Movimento reduzido desativa autoplay
  e inércia, preservando navegação manual. Pausar fora de vista, com foco de leitura ou aba
  oculta. Sem novas dependências; sem testes/gates nesta iteração, com inspeção renderizada.

### Session 2026-11-11 — título de depoimentos sem subtítulo

- Usar “Alguns depoimentos de quem conhece o meu trabalho.” como título de Depoimentos e
  remover o subtítulo duplicado. EN usa “A few testimonials from people who know my work.”
  sem subtítulo. Preservar filete e demais conteúdos/efeitos.

### Session 2026-11-11 — duração compartilhada de todos os efeitos

- Usar a revelação do texto principal como referência: duração total = 300ms + 100ms por
  linha após a primeira. Quote, campos de autoria e ambas as imagens devem iniciar juntos
  e concluir nesse mesmo intervalo por depoimento/viewport. Distribuir campos e pixels
  nesse intervalo, sem alterar o fade original do quote. Aguardar medição antes de iniciar,
  pausar juntos fora da seção, manter estado final ao redimensionar e respeitar redução.

### Session 2026-11-11 — LinkedIn compacto e pixels mais rápidos

- Remover nome visível dentro do link LinkedIn, mantendo ícone, URL e nome acessível.
  Reduzir o limite de atrasos dos pixels de 920ms para 680ms (conclusão em cerca de 720ms),
  preservando borda aleatória, padrão e redução de movimento. Sem testes nesta iteração.

### Session 2026-11-11 — pixels a partir de borda aleatória

- Substituir o wipe horário das imagens dos depoimentos por revelação em pixels quadrados.
  Cada retrato/marca escolhe uma borda aleatória por ativação (superior, inferior, esquerda
  ou direita); pequenos blocos revelam progressivamente a imagem a partir dessa borda,
  com variação local na ordem, em aproximadamente 1s. Preservar imagens, layout e fades
  textuais. Pausar fora da seção, reiniciar na troca e mostrar tudo com movimento reduzido.

### Session 2026-11-11 — revelação radial das imagens dos depoimentos

- Substituir a exigência anterior de imagens estáticas por revelação em fatia radial,
  partindo das 12 horas e avançando no sentido horário até mostrar integralmente retrato
  e marca profissional. Aplicar ao chegar à seção e a cada troca de depoimento, sem girar
  a imagem nem alterar dimensão, recorte ou layout. Duração suave de 1s; pausar fora da seção.
  Preservar fades textuais e conteúdo acessível. Movimento reduzido mostra imagens completas.

### Session 2026-11-11 — fade nos dados de autoria

- Estender o fade dos depoimentos aos dados textuais do depoente (rótulo, nome/LinkedIn,
  cargo, empresa, data e procedência quando presentes), em ordem de leitura: 300ms ease
  forwards, stagger 100ms. Preservar conteúdo, tipografia, links e geometria. Não animar
  retratos, marcas ou seu container. Reiniciar na troca de depoimento/idioma, pausar fora
  da seção e apresentar tudo imediatamente sob movimento reduzido. Sem testes nesta iteração.

### Session 2026-11-11 — dados visíveis nos painéis recolhidos

- Painéis recolhidos precisam reservar altura suficiente para nome, badges e links sempre
  visíveis e utilizáveis. Manter conteúdo horizontal e expansão suave; proporção fixa 75%
  deixa de ser requisito quando conflitar com legibilidade. A galeria reserva a altura de
  um painel expandido e dois resumos de pelo menos 11rem, preservando sua altura na troca.
  Links secundários ficam acessíveis por teclado também nos painéis recolhidos.

### Session 2026-11-11 — correção para banners horizontais empilhados

- A imagem mais recente esclarece a orientação: cards largos horizontais empilhados, com
  expansão na altura em todos os dispositivos, substituindo linha desktop/carrossel mobile.
  Primeiro aberto inicialmente, aproximadamente 75% da altura útil; demais faixas 12.5%.
  Remover faixa escura vertical e duplicação vertical de títulos/badges. Manter informações
  horizontais, indicadores de clique, mídias e links no painel aberto. Demais regras de
  interação e preservação de conteúdo continuam válidas. Esta decisão substitui T308.

### Session 2026-11-11 — acordeão dos projetos

- Adaptar somente o funcionamento React do AccordionGallery anexado: em desktop (>=1024px),
  um painel permanece expandido, inicialmente o terceiro, com 60% da largura útil e transição
  de 600ms power3.out. Hover, foco e setas nos links principais transferem a expansão;
  sair da galeria não recolhe o painel. Movimento reduzido aplica o estado sem transição.
- Preservar integralmente conteúdo, títulos, badges, imagens, vídeos, URLs, estilos das mídias,
  indicadores e comportamento de reprodução. Manter grade tablet e carrossel mobile existentes.
  Não importar dados demonstrativos, grayscale, tilt, parallax ou estilos visuais do anexo.
  Sem nova dependência; inspeção renderizada na iteração, testes/gates permanecem adiados.

### Session 2026-10-24

- Q: Como a galeria de Projetos deve reproduzir a nova referência visual? → A: Preservar cabeçalho,
  convite final, ordem, dados, traduções, rotas e mídias, substituindo somente as linhas editoriais
  alternadas por três cards verticais lado a lado no desktop. Cada card usa mídia em toda a
  superfície, gradiente cinematográfico, categoria e título no canto inferior esquerdo e indicador
  circular sutil no canto superior direito, alternando de play para clique durante hover/foco. Os
  detalhes incluem links iconográficos de preview e GitHub quando disponíveis. Hover ou foco amplia
  o card no layout e inicia seu vídeo adiado sem recorte ampliado; tablet usa duas colunas, mobile
  empilha e movimento reduzido mantém posters estáticos.
- Q: Como o conteúdo da Home deve ser centralizado horizontalmente? → A: Restaurar o mesmo frame
  global centralizado da versão publicada em `guifer.tech`, com largura máxima de `75rem`, margens
  laterais automáticas, gutters responsivos compartilhados e safe areas. Superfícies, fundos e mídia
  full-bleed permanecem fora desse limite quando já previsto pela seção.
- Q: O Header e o Footer devem seguir esse mesmo enquadramento? → A: O Header preserva seu container
  independente. O Footer usa o frame global e duas faixas: selos à esquerda com links legais,
  navegação e Core Web Vitals à direita no topo; marca e autoria à esquerda com localização e hora
  local à direita na base.
- Q: O título principal do Hero deve seguir o frame global centralizado? → A: Não. O conteúdo textual
  do Hero preserva seu frame fluido independente, sem limite máximo, com gutter próprio responsivo e
  alinhamento à esquerda. As demais seções continuam no frame global centralizado.
- Q: Como refinar a tipografia e os controles do Footer? → A: Padronizar espaçamentos e entrelinhas,
  aproximar rótulos e valores de Vitals, renomear o título para “Core Web Vitals” e preservar o
  respiro entre título e dados. Usar “Explore a página”/“Explore the page” e listar Início/Home,
  Sobre/About, Projetos/Projects, Habilidades/Capabilities, Depoimentos/Testimonials e
  Contato/Contact. Remover o agradecimento, o bloco de conexões e seus ícones; mover os selos para o
  espaço liberado e alinhá-los à esquerda; mover a assinatura para a antiga posição dos selos;
  apresentar Privacidade/Privacy e Acessibilidade/Accessibility por extenso acima do único divisor,
  diretamente antes da faixa de localização e hora local.
- Q: Como alinhar os blocos informativos à direita do Footer? → A: Em telas amplas, Explore a
  página e Core Web Vitals permanecem em duas colunas agrupadas junto ao limite direito do container.
  Privacidade e Acessibilidade ficam juntas em uma única linha alinhada à direita sob esse grupo e
  próxima ao divisor. Os selos Green Hosting e Website Carbon permanecem lado a lado. Em telas
  estreitas, os blocos mantêm a ordem natural de leitura.

### Session 2026-10-22

- Q: Como deve funcionar temporariamente o parallax do cabeçalho visual da Home? → A: Manter a
  implementação disponível, porém pausada. Hero, Sobre e Projetos seguem o fluxo normal da página,
  sem manter o Hero em posição sticky durante a rolagem.

### Session 2026-10-21

- Q: O que substitui a seção Processo e o FAQ associado? → A: Uma seção editorial de Competências,
  sem funil em etapas, FAQ, cards decorativos, mídia ou CTA adicional. Em telas amplas, a composição
  usa aproximadamente `40%/60%`: narrativa à esquerda e três linhas de competência à direita. Em
  telas estreitas, o conteúdo reflui para uma coluna, permanece integralmente visível e não depende
  de interação. Esta decisão substitui todos os requisitos anteriores conflitantes de Habilidades.

### Session 2026-10-20

- Q: Onde o FAQ deve ficar após o refinamento de Contato? → A: Mover integralmente o FAQ para a
  seção Habilidades, visualmente identificada como “Processo”, abaixo do processo de três etapas.
  Preservar o cabeçalho, os contatos principais e o formulário da seção Contato sem remover
  conteúdo.
- Q: Como reorganizar a apresentação de Contato? → A: Apresentar à esquerda um convite editorial,
  texto sobre disponibilidade e contatos diretos; à direita, apresentar o formulário sem marcador
  acima dos campos, preservando integralmente seus campos e localização PT-BR/EN-US.

### Session 2026-10-15

- Q: Onde posicionar o contato principal e as perguntas frequentes? → A: Na seção Contato, alinhar
  título, texto introdutório e bloco de contato principal na mesma linha em telas amplas. Posicionar
  a lista editorial recolhível com exatamente cinco perguntas e respostas à esquerda do
  formulário. O formulário deve ser discretamente mais estreito, com respiro entre as colunas e
  filetes do FAQ coerentes com as linhas dos campos. Em larguras estreitas, empilhar os blocos nessa
  mesma ordem sem overflow.
- Q: Como refinar o fundo e a apresentação dos indicadores de Sobre? → A: Tornar a textura grip
  tape do painel esquerdo de `70%` mais perceptível sem aumentar materialmente o gradiente tonal;
  remover integralmente o carrossel e seus controles; apresentar um indicador por vez no painel
  direito, acima do contador de cafés, alternando valor e rótulo com o efeito reutilizável de
  embaralhamento e digitação, estático sob `prefers-reduced-motion`.
- Q: Como refinar a hierarquia tipográfica e a ênfase cromática de Sobre? → A: Reduzir a escala
  da saudação e do nome, ampliar o corpo para leitura confortável e limitar o azul de destaque ao
  nome e ao papel profissional.
- Q: Como apresentar a stack de trabalho em Sobre? → A: Centralizar no painel esquerdo de `70%`,
  abaixo dos CTAs, “Tecnologias que uso no meu trabalho:” e seu equivalente em inglês. Separar em
  Front-end (React, TypeScript, JavaScript, Tailwind CSS), Back-end (Java, Python, Django REST), Bancos
  de dados (PostgreSQL, MySQL) e Infraestrutura e ferramentas (Docker, Git, Supabase, Render). Usar
  glifos e cores originais sem badges, fundos ou caixas, com hierarquia subordinada ao título.
  Remover numeração e negrito dos rótulos; categorias DEVEM usar a mesma fonte, peso e cor do
  título da stack e não podem quebrar linha. Tecnologias DEVEM permanecer em uma única linha,
  alinhadas à esquerda, com rolagem horizontal apenas quando a largura estreita exigir.
- Q: Onde posicionar os quatro indicadores de Sobre? → A: Distribuí-los horizontalmente na base do
  painel esquerdo de `70%`, bem abaixo dos CTAs e alinhados verticalmente ao contador de cafés do
  painel direito. Em viewports excepcionalmente baixos, permitir que a seção cresça naturalmente
  além de `100svh` para impedir sobreposição ou corte de conteúdo.
- Q: Onde ficam as frases sobre o papel da tecnologia? → A: O Hero deve usar “Acredito que a
  tecnologia deve ampliar o que somos capazes de fazer.” e seu equivalente em inglês. Remover
  completamente de Sobre a frase “Meu trabalho é traduzir tecnologia em soluções para as pessoas.”
  e seu equivalente, sem substituí-los por outro parágrafo.
- Q: Como apresentar o título de Sobre e a segunda linha do Hero? → A: Usar “Olá! eu me chamo
  Guilherme Eleutherio.” em uma única linha estrutural, com equivalente em inglês. Manter a frase
  sobre tecnologia do Hero sem quebra a partir de `640px`; abaixo disso, permitir reflow somente
  para preservar legibilidade e impedir overflow horizontal.
- Q: Qual tonalidade o painel direito de `30%` deve usar? → A: Usar um meio-tom claro no tema claro
  e um meio-tom escuro no tema escuro, mantendo distinção em relação ao painel principal sem inverter
  a polaridade temática.
- Q: Como os indicadores devem voltar a se mover? → A: Reativar o carrossel horizontal infinito com
  três itens visíveis em telas amplas e dois em telas estreitas, usando scroll velocity marquee e
  mantendo resposta à rolagem, arraste e teclado,
  pausa manual e redução de movimento. Dobrar a escala visual dos números em relação à composição
  estática anterior.
- Q: Como refinar a superfície, o recorte do carrossel e a altura de Sobre? → A: Substituir as linhas
  do painel esquerdo de `70%` por uma granulação procedural, minimalista e elegante; mostrar somente
  dois indicadores por vez em todas as larguras; e ampliar a seção para `115svh`, preservando altura
  natural maior quando necessária para impedir qualquer corte de texto ou controles.
- Q: Como apresentar o primeiro projeto em destaque? → A: Usar uma composição editorial em duas
  colunas no desktop, com preview à esquerda e metadado do projeto, título, resumo e ações à direita. As
  badges DEVEM permanecer imediatamente abaixo do preview e os botões/links DEVEM preservar seu
  formato e comportamento atuais. Em telas menores, os blocos devem empilhar sem alterar sua ordem.
- Q: Qual deve ser a aparência da textura do painel esquerdo de Sobre? → A: Usar uma textura
  procedural irregular inspirada em grip tape, acompanhada por um gradiente tonal de contraste muito
  baixo. Evitar pontos regulares, padrões evidentes ou ruído que prejudique a leitura.

### Session 2026-10-14

- Q: Como deve funcionar o frame lateral da Home? → A: Remover somente na Home o limite máximo do
  container compartilhado e aplicar a todas as seções um gutter mínimo de 1,25rem no mobile e
  fluido de 2,5rem a 4,5rem a partir de 768px. Superfícies, fundos e mídia de Hero e Projetos podem
  permanecer full-bleed, mas seu conteúdo deve respeitar o mesmo frame. Preservar safe areas,
  containers das subpáginas e alinhamento independente do header.
- Q: Como atualizar a apresentação principal de Sobre? → A: Substituir a fotografia pela imagem de
  Guilherme usando fones de ouvido, preservar o quadro integral em variantes AVIF/WebP, simplificar
  a moldura para filetes e cantos discretos, usar “Olá! Seja bem-vindo.”/“Hello! Welcome.” seguido
  de “Meu nome é Guilherme Eleutherio.”/“My name is Guilherme Eleutherio.” em peso mais leve e
  centralizar verticalmente o CTA no espaço restante da coluna textual.
- Q: Como refinar a proporção entre texto, CTA e fotografia em Sobre? → A: Reduzir apenas a linha do
  nome, manter o CTA no centro vertical do espaço disponível e encerrar a fotografia na mesma linha
  inferior do botão em desktop. A textura de fundo deve permanecer nítida, sem blur ou ampliação que
  suavize artificialmente o papel.
- Q: Qual é a composição final de Sobre? → A: Remover completamente a fotografia, centralizar
  horizontalmente saudação, texto e CTA e substituir a textura de papel por linhas horizontais
  finas e muito sutis, com blur mínimo restrito ao plano de fundo. Os quatro indicadores permanecem
  na faixa inferior.
- Q: Como dividir a superfície e apresentar os indicadores de Sobre? → A: Dividir a largura em
  `70%/30%`: o painel esquerdo usa a superfície principal do tema ativo e concentra as linhas sutis,
  enquanto o painel direito ocupa `30%` e usa um meio-tom da mesma polaridade do tema. Manter o
  carrossel horizontal infinito ativo, com três itens visíveis em telas amplas, dois em telas
  estreitas, scroll velocity marquee e resposta à
  rolagem, ao arraste e ao teclado. Usar o retrato com
  fones fornecido como camada decorativa de fundo desse painel direito, com opacidade, cobertura
  integral e sem recuos laterais. Posicionar o contador de cafés no centro horizontal da base do
  painel direito e o download do currículo imediatamente à direita do CTA de trajetória.

### Session 2026-10-12

- Q: Como a nova composição da seção Sobre deve organizar texto, fotografia e indicadores? → A:
  Preservar o conteúdo textual aprovado, mas adotar a referência apenas como direção de layout:
  metade esquerda para texto editorial alinhado à esquerda, metade direita para a nova fotografia
  integral fornecida e uma faixa inferior de largura total para os quatro indicadores ampliados. A
  fotografia deve preservar o quadro completo, sem recorte, dentro de uma moldura autoral discreta e
  usar variantes responsivas de alta qualidade; o recorte transparente anterior deve ser removido
  quando deixar de ter uso.

### Session 2026-10-06

- Q: Como a seção Sobre deve apresentar imagem, texto e indicadores? → A: Substituir o mosaico de
  quatro fotos pelo retrato fornecido de Guilherme falando ao microfone; ampliar e centralizar o
  conteúdo textual; inverter a hierarquia cromática dos indicadores para valores na cor de primeiro
  plano e rótulos no azul de destaque; usar nos valores a fonte Space Grotesk já aplicada ao corpo da
  Home, em vez da fonte de títulos.
- Q: Como a revisão do retrato e da superfície de Sobre deve ocupar a tela? → A: Trocar o retrato
  anterior pelo recorte PNG transparente fornecido, aplicar uma textura fotográfica minimalista de
  papel amassado em toda a superfície e fazer a seção ocupar exatamente um viewport (`100svh`) em
  condições normais, com todos os elementos alcançáveis, sem corte ou overflow.

- Q: A nova seção Habilidades deve apresentar capacidades profissionais, tecnologias ou o processo
  de trabalho existente? → A: Combinar capacidades, tecnologias representativas e processo de
  trabalho em uma seção organizada, com texto fiel à comunicação pessoal de Guilherme e sem
  linguagem genérica associada a conteúdo automatizado; a composição visual e a interação foram
  posteriormente definidas pela referência em PDF nesta mesma sessão.
- Q: Quais grupos devem organizar as capacidades profissionais da seção Habilidades? → A: Stack de
  trabalho com Java, Python, React, Django REST, Render, MySQL e Supabase; trabalho com IA baseado em
  Spec-Driven Development e conhecimento de análise, documentação, planejamento e execução com
  LLMs; comunicação e análise de produto com verificações de segurança, LGPD, performance e
  conversão para pequenas e médias empresas.
- Q: Como o conteúdo, o layout e as relações da seção Habilidades devem ser apresentados? → A: Seguir
  a referência do PDF aprovado: painel escuro arredondado de composição tipográfica, organizado em
  Engenharia e Desenvolvimento, Produto e Comunicação e Método e Execução; ao interagir com uma
  capacidade por hover, foco ou toque, exibir popover contextual, destacar de duas a quatro relações
  relevantes e reduzir a presença dos demais itens sem violar contraste WCAG AA.
- Q: Como o painel de três colunas deve se adaptar a tablets e celulares? → A: Usar três colunas no
  desktop, duas no tablet e uma coluna empilhada no celular, preservando hierarquia, conteúdo e
  interações sem rolagem horizontal.
- Q: Quais itens devem abrir popover contextual e ativar o destaque de relações? → A: Todas as 18
  capacidades são interativas; as tecnologias permanecem como conteúdo de apoio, podem receber
  destaque secundário quando relacionadas e não abrem popovers independentes.

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Percorrer a Home em ordem coerente (Priority: P1)

Como visitante, quero navegar do Hero para Sobre, Projetos, Habilidades, Depoimentos e Contato em
uma sequência clara, sem saltos ou sobreposições que bloqueiem conteúdo.

**Why this priority**: A ordem e o fluxo determinam a compreensão do portfólio.

**Independent Test**: Percorrer a Home por scroll, hash e teclado em todos os breakpoints-alvo.

**Acceptance Scenarios**:

1. **Given** a Home carregada, **When** o visitante percorre a página, **Then** as seções aparecem na
   ordem Hero → Sobre → Projetos → Habilidades → Depoimentos → Contato.
2. **Given** movimento reduzido, **When** o visitante navega pela Home, **Then** o fluxo permanece
   linear e totalmente operável.

---

### User Story 2 - Ler conteúdo responsivo sem desperdício de espaço (Priority: P1)

Como visitante em celular, tablet ou tela ampla, quero conteúdo legível e proporcional sem cortes,
colisões ou vazios excessivos.

**Why this priority**: A maior parte dos itens migrados trata de estabilidade responsiva acumulada.

**Independent Test**: Comparar a composição em 320, 360, 390, 412, 640, 768, 1023, 1440 e 1920 px.

**Acceptance Scenarios**:

1. **Given** qualquer viewport suportado, **When** a página reflui, **Then** containers, títulos,
   mídia, carrosséis e controles permanecem visíveis e operáveis.
2. **Given** 412×915 px, **When** a Home é exibida, **Then** a referência visual é preservada sem
   transformar 412 px ou 915 px em dimensões fixas.

---

### User Story 3 - Compreender a seção Sobre (Priority: P2)

Como visitante, quero conhecer Guilherme por texto e indicadores em uma composição editorial
centralizada e legível.

**Why this priority**: A seção concentra conteúdo profissional e provas quantitativas.

**Independent Test**: Validar heading acessível, texto editorial centralizado, indicadores, linhas
horizontais sutis e altura exata de um viewport em PT/EN, ambos os temas e viewports curto/largo.

**Acceptance Scenarios**:

1. **Given** navegação para Sobre, **When** o foco alcança a seção, **Then** existe heading acessível
   mesmo sem o rótulo visual “Sobre”.
2. **Given** a seção em qualquer viewport suportado, **When** seu conteúdo é exibido, **Then** não há
   fotografia de conteúdo, texto e CTA ficam centralizados no painel esquerdo de `70%` e um único
   indicador visual ocupa o painel direito acima do contador de cafés.
3. **Given** qualquer tema suportado, **When** os indicadores são apresentados um por vez, **Then**
   seus valores usam a cor de primeiro plano e Space Grotesk, seus rótulos usam o azul de destaque
   e o conjunto fica acima do contador de cafés.
4. **Given** o conteúdo textual de Sobre, **When** a seção reflui, **Then** seus parágrafos permanecem
   ampliados, centralizados e legíveis sem invadir o painel direito.
5. **Given** qualquer viewport de referência em condições normais de texto, **When** Sobre é exibida,
   **Then** sua superfície mede ao menos `115svh`, a granulação fica restrita ao painel esquerdo e
   texto, indicadores e CTA permanecem contidos e alcançáveis.
6. **Given** os controles auxiliares de Sobre, **When** a seção é exibida, **Then** o contador de
   cafés fica centralizado horizontalmente na base do painel direito e o download do currículo fica
   à direita do CTA de trajetória, preservando sua apresentação original de link textual com ícone,
   sem borda de botão, sem ocultar o rótulo e sem duplicação no rodapé.

---

### User Story 4 - Entender capacidades e forma de trabalho (Priority: P2)

Como visitante, quero compreender o que Guilherme consegue construir, como ele entende uma solução
e como conduz sua evolução sem depender de interação ou de listas genéricas.

**Why this priority**: A seção conecta o posicionamento profissional às competências e à forma como
o trabalho é conduzido.

**Independent Test**: Validar em PT/EN que Competências apresenta integralmente a narrativa e as três
linhas Construir, Compreender e Evoluir, com a mesma ordem semântica em desktop e mobile.

**Acceptance Scenarios**:

1. **Given** navegação para Habilidades, **When** o visitante percorre a seção, **Then** encontra uma
   narrativa editorial seguida pelas três competências Engenharia e desenvolvimento, Produto e
   comunicação e Método e execução.
2. **Given** qualquer idioma suportado, **When** o conteúdo é exibido, **Then** o texto mantém a voz
   pessoal aprovada, evita superlativos genéricos e não usa níveis de domínio sem evidência.
3. **Given** a seção completa, **When** o visitante a lê sem hover, foco ou toque, **Then** títulos,
   descrições e rótulos das três competências permanecem visíveis por inteiro.
4. **Given** um viewport entre 320 px e desktop amplo, **When** Habilidades reflui, **Then** a
   composição muda de duas colunas assimétricas para uma coluna sem rolagem horizontal, corte ou
   mudança da ordem do conteúdo.

### Edge Cases

- Conteúdo traduzido mais longo não pode colidir com colunas ou controles.
- Depoimentos de alturas diferentes não podem causar salto significativo.
- Hash e foco não podem ser encobertos por elementos fixos.
- O widget de acessibilidade não pode cobrir metadados ou controles.
- Habilidades não pode ocultar conteúdo essencial atrás de hover, foco, toque, acordeão ou animação.
- Traduções mais longas devem manter narrativa e linhas de competência dentro da largura disponível.

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: O container compartilhado da Home DEVE usar o frame global centralizado, com largura
  máxima de `75rem`, margens laterais automáticas, gutters responsivos compartilhados e safe areas.
  O conteúdo de todas as seções da Home DEVE permanecer contido nesse frame. Superfícies, fundos e
  mídia de Hero e Projetos PODEM permanecer full-bleed. O conteúdo textual do Hero DEVE preservar
  seu frame fluido independente, sem limite máximo, com gutter próprio responsivo e alinhamento à
  esquerda; as demais seções permanecem no frame comum. O divisor superior de Projetos DEVE
  usar a mesma largura, espessura e cor do divisor inferior da seção. Subpáginas e header DEVEM
  manter seus próprios containers.
- **FR-002**: A ordem da Home DEVE ser Hero, Sobre, Projetos, Habilidades, Depoimentos e Contato.
- **FR-003**: Sobre, Projetos e Depoimentos DEVEM usar fundos sólidos; somente Contato pode manter
  superfície transparente com blur.
- **FR-004**: A implementação de sobreposição Hero/Projetos DEVE permanecer disponível, mas pausada.
  Enquanto pausada, Hero, Sobre e Projetos DEVEM seguir o fluxo linear, preservando links, foco e
  hash sem posicionamento sticky do Hero. Uma eventual reativação DEVE continuar oferecendo fluxo
  linear para movimento reduzido.
- **FR-005**: A seção Sobre DEVE preservar heading acessível e quatro indicadores ampliados sem
  negrito; os valores DEVEM usar a cor de primeiro plano e Space Grotesk, e os rótulos DEVEM usar o
  azul de destaque. A apresentação DEVE usar a saudação e o nome aprovados em PT/EN, com saudação em
  peso normal e nome em peso tipográfico mais leve e escala inferior. Saudação e nome DEVEM usar
  escala contida em relação ao corpo ampliado; o azul de destaque DEVE enfatizar somente o nome e o
  papel profissional, sem colorir parágrafos inteiros. O texto em português DEVE usar
  “Olá, sou Guilherme Eleuthério, um desenvolvedor full stack com experiência em análise,
  planejamento e desenvolvimento de produtos digitais.” e o CTA “Conhecer minha trajetória”, com
  os equivalentes semânticos “Hello, I’m Guilherme Eleuthério, a full-stack developer with
  experience in the analysis, planning, and development of digital products.” e “Explore my
  journey” em inglês. Sobre NÃO DEVE exibir “Meu trabalho é traduzir tecnologia em soluções para as pessoas.”
  nem seu equivalente em inglês. Saudação,
  textos e CTA DEVEM ficar centralizados horizontalmente, sem fotografia. A seção DEVE ser dividida
  em duas colunas de `70%/30%`: a coluna esquerda usa a superfície principal do tema ativo, e a
  direita usa um meio-tom claro no tema claro e escuro no tema escuro. Os quatro indicadores DEVEM
  permanecer semanticamente disponíveis, mas a apresentação visual DEVE mostrar apenas um por vez
  no painel direito, acima do contador de cafés. Valor e rótulo DEVEM alternar com o componente
  reutilizável de embaralhamento e digitação; sob `prefers-reduced-motion`, o primeiro indicador
  DEVE permanecer estático. O carrossel, marquee, arraste, navegação por setas e controle de pausa
  NÃO DEVEM permanecer. Os números DEVEM manter o dobro da escala da composição estática anterior.
  Uma textura procedural irregular inspirada em grip tape, mais perceptível que a variação anterior,
  com gradiente tonal ainda de contraste muito baixo e sem recurso raster adicional, DEVE cobrir
  somente o painel esquerdo de `70%`, sem padrão repetitivo evidente nem comprometimento de
  contraste. O retrato com fones DEVE
  compor o fundo do
  painel direito como mídia decorativa responsiva em AVIF/WebP, com `26%` de opacidade, cobertura
  `cover` e limites laterais coincidentes com os limites do painel de `30%`. O contador de cafés
  DEVE reutilizar sua lógica atual no centro horizontal inferior desse painel. O download do
  currículo DEVE reutilizar o arquivo, nome de download e rótulo acessível atuais, posicionado à
  direita do CTA de trajetória; em larguras estreitas, PODE exibir apenas o ícone visual, mantendo
  o nome acessível completo. Em viewports excepcionalmente baixos, Sobre PODE ultrapassar
  `100svh` para preservar leitura, alcance e separação entre conteúdo e indicadores. A stack DEVE
  aparecer centralizada abaixo dos CTAs no painel esquerdo, com as categorias e tecnologias
  aprovadas, logos e cores de marca sem tratamento de badge e hierarquia visual subordinada ao
  título de Sobre. No painel direito, o indicador visual DEVE ficar diretamente acima do contador
  de cafés, e o centro vertical do contador DEVE coincidir exatamente com o divisor inferior da
  última linha da stack. O bloco de introdução e CTAs e o bloco da stack DEVEM usar três faixas
  flexíveis equivalentes de respiro — acima, entre e abaixo dos blocos — evitando tanto o vazio
  excessivo superior quanto a aproximação indevida dos dois conjuntos no centro.
- **FR-006**: A Home NÃO DEVE exibir a antiga seção Trajetória; seus quatro indicadores DEVEM
  permanecer incorporados em Sobre.
- **FR-007**: A referência 412×915 DEVE orientar proporção e espaçamento, mantendo compatibilidade em
  320 px sem largura ou altura fixa.
- **FR-008**: Projetos, Habilidades, Depoimentos e Contato DEVEM usar altura natural e espaçamento
  fluido, sem altura de viewport obrigatória. Sobre é a única exceção: DEVE medir ao menos `115svh`
  em condições normais e crescer naturalmente quando necessário para evitar corte, overflow ou
  controle inalcançável nos viewports de referência.
- **FR-009**: Depoimentos DEVEM manter seis itens legíveis, controles centralizados, progressão
  acessível e uma área de conteúdo com altura estável definida pelo maior relato, impedindo salto ou
  redimensionamento durante a troca. A apresentação DEVE usar “Pessoas com quem trabalhei” como
  título principal em uma única linha e “Alguns depoimentos” como abertura em PT, com equivalentes
  em EN,
  preservar tom editorial natural e organizar cada item em blocos de citação, mídia e autoria, com
  nome, cargo, vínculo profissional e fotografia quando disponíveis. Relatos, cargos, datas e notas
  de procedência DEVEM acompanhar o idioma ativo. Feedbacks oriundos do Feedz DEVEM identificar essa procedência
  junto aos metadados da autoria. Cada autoria DEVE oferecer um link externo seguro para o LinkedIn,
  próximo ao nome, com ícone azul e primeiro nome, rótulo acessível localizado, alvo mínimo de toque
  e hover restrito à variação de cor, sem superfície de badge.
  A composição DEVE usar tipografia e
  azul do MIV, sem alegar verificação externa não comprovada.
  Em telas amplas, a citação DEVE ocupar o grande bloco esquerdo diretamente sobre o fundo da seção,
  sem caixa, borda ou moldura, com aspas em linhas próprias acima e abaixo do texto. O bloco superior
  direito DEVE apresentar lado a lado duas mídias circulares, retrato e contexto profissional,
  sem moldura, fundo ou borda. A autoria DEVE aparecer logo abaixo, alinhada à esquerda e igualmente
  livre de caixa, borda ou fundo. A mídia de contexto DEVE usar a identidade visual do local de
  trabalho associada a cada pessoa autora.
  A superfície DEVE acompanhar o tema ativo, sem inversão: clara no tema claro e escura no tema
  escuro. Aspas e filete DEVEM usar o azul escuro do MIV no tema claro e o azul claro no tema escuro.
  Escala tipográfica, mídias, espaçamento e altura DEVEM permanecer proporcionais
  às demais seções da Home; o depoimento DEVE ser alinhado à esquerda, e textos longos DEVEM usar
  parágrafos e redução progressiva de fonte sem truncamento. Cada parágrafo DEVE aproveitar toda a
  largura útil do bloco de citação, mantendo agrupamento por frases e respiro entre estrofes.
- **FR-010**: Títulos e conteúdo dos cases entre 768 e 1023 px NÃO PODEM colidir.
- **FR-011**: Contato DEVE organizar convite editorial, texto de disponibilidade e bloco de contato
  principal em uma coluna à esquerda do formulário em telas amplas. O formulário DEVE ocupar a
  coluna direita sem marcador acima dos campos. O texto DEVE
  comunicar disponibilidade para projetos, oportunidades profissionais, dúvidas e parcerias em
  PT-BR e EN-US, com voz profissional e acolhedora. Título, introdução e contato principal DEVEM
  formar uma composição centralizada horizontal e verticalmente na coluna esquerda, compartilhar a
  mesma largura e margem esquerda, manter o texto alinhado à esquerda e usar os papéis tipográficos
  compartilhados. A coluna esquerda NÃO DEVE exibir assinatura circular ou spinner. O contato principal
  DEVE usar filete vertical e linhas uniformes de ícone e texto, sem sublinhado, para e-mail,
  telefone, LinkedIn e GitHub, compartilhando alinhamento, tipografia e espaçamento.
  O formulário NÃO DEVE exibir marcador acima dos campos e DEVE ocupar 95% da largura disponível em
  sua coluna. O aviso de privacidade e reCAPTCHA DEVE possuir caixa de consentimento obrigatória,
  visualmente pequena e discreta; o envio DEVE permanecer bloqueado e visualmente esmaecido enquanto
  ela não estiver selecionada. Todas as linhas do contato principal DEVEM usar azul do MIV no hover
  e no foco visível.
  O cabeçalho, os contatos principais e o formulário DEVEM seguir a hierarquia do MIV: títulos
  em DM Sans, corpo, metadados, links, campos e estados em Space Grotesk, pesos 400/500 e azul
  restrito a ação, foco e estrutura. O formulário DEVE ser discretamente mais estreito e usar linhas
  visualmente coerentes com os demais divisores editoriais. Em larguras estreitas, a coluna editorial
  DEVE preceder o formulário, preservando todo o conteúdo, estados de envio, ordem de foco, leitura
  sem overflow e alvos de toque.
- **FR-012**: Footer abaixo de 768 px DEVE compactar navegação, contatos e badges sem alongamento,
  quebra indevida ou perda de leitura.
- **FR-013**: Mídia responsiva DEVE preservar proporção e selecionar recursos adequados a DPR 1/2/3.
- **FR-014**: Toda composição DEVE funcionar em PT/EN, claro/escuro, teclado e movimento reduzido.
- **FR-015**: Habilidades DEVE ser substituída por uma seção editorial de Competências que responda o
  que Guilherme constrói, como compreende uma solução e como melhora o que entrega, sem CTA adicional.
- **FR-016**: A seção DEVE usar as cópias finais localizadas em PT-BR e EN-US para título,
  introdução, três competências, descrições e links, sem texto visível fixado fora do
  dicionário.
- **FR-017**: O conteúdo DEVE apresentar exatamente três colunas editoriais, nesta ordem: IA aplicada ao
  desenvolvimento, Tecnologia além do navegador e Perfil curioso, cada um com título, um ou mais
  parágrafos e sem listas suplementares de tópicos. A referência a Spec-Driven Development DEVE ser
  um link acessível para a fonte indicada no conteúdo.
- **FR-018**: Em telas amplas, o bloco de título e introdução DEVE ficar alinhado ao lado esquerdo
  do container no topo, com o texto e o divisor alinhados à esquerda, seguido por três colunas de mesma largura
  organizadas em uma única linha horizontal. As colunas DEVEM ter altura natural e composição aberta,
  sem superfície, borda, raio, sombra, ícones, ilustrações ou mídia decorativa.
- **FR-019**: Em telas estreitas, a composição DEVE refluir para uma coluna com título e
  introdução antes dos três blocos editoriais de largura total, sem overflow entre 320 px e 412 px.
- **FR-020**: Todo o conteúdo da seção DEVE permanecer visível sem hover, foco, toque, acordeão,
  popover ou animação. Nenhuma interação PODE revelar informação essencial.
- **FR-021**: A seção DEVE reutilizar `SectionShell`, tokens semânticos, tipografia e filetes do MIV,
  acompanhar os temas claro e escuro e respeitar movimento reduzido sem adicionar dependências.
- **FR-022**: A Home DEVE inicializar em acesso local por HTTP via endereço de rede, mesmo quando
  `crypto.randomUUID` não estiver disponível, preservando um identificador de visitante em formato
  UUID v4 aceito pelo contrato do contador de cafés.
- **FR-023**: A galeria de Projetos DEVE apresentar três cards verticais de mesma largura em uma
  única linha no desktop, com mídia `cover` em toda a superfície, cantos amplos, gradiente escuro
  progressivo, categoria e título no canto inferior esquerdo e indicador circular coerente com a
  disponibilidade de vídeo no canto superior direito. O raio DEVE reutilizar o token de cards do
  projeto, o indicador DEVE ser visualmente sutil e trocar play por clique durante hover/foco, e os
  detalhes DEVEM oferecer badges localizados acima do título e ícones acessíveis de preview e GitHub
  quando seus destinos existirem. Hover ou foco DEVE expandir de forma lenta e suave
  horizontalmente o card no fluxo, com o card ativo ocupando dois terços da largura útil e cada
  irmão ocupando um sexto, sem alterar a largura total, e iniciar somente o vídeo desse card, sem alternar
  repetidamente o estado quando a
  própria transição deslocar os limites dos cards sob um ponteiro parado. O preview DEVE preservar o
  quadro integral, usando uma versão desfocada e escurecida do poster como preenchimento da
  superfície restante em vez de aplicar corte equivalente a zoom. O título DEVE permanecer em
  contraste sem receber painel, borda ou fundo próprio. Cada preview PODE definir enquadramento próprio para
  manter o conteúdo principal visível e preencher toda a área sem barras laterais,
  de forma muda, inline, em loop e sem ocultar o poster antes de estar pronto. A saída DEVE restaurar
  larguras e poster. Tablet DEVE usar duas colunas e mobile uma coluna, preservando rota, ordem,
  conteúdo interno, traduções e acesso sem hover. Movimento reduzido DEVE manter larguras iguais e
  posters estáticos. Descrições, tecnologias, ações auxiliares e badges permanecem no modelo de dados
  e nas páginas de case, mas NÃO DEVEM aparecer permanentemente sobre os cards da Home.
- **FR-024**: O cabeçalho de Projetos DEVE apresentar uma hierarquia de dois níveis coerente com
  as demais seções da Home: o título “Um pouco do que já coloquei em prática.” e o apoio
  “Cases selecionados que detalham o contexto, as escolhas feitas e as entregas finais de cada
  projeto.”, com equivalentes semânticos em inglês dos Estados Unidos. O texto DEVE preservar a voz
  pessoal do portfólio e evitar descrições genéricas. Estrutura, escala, espaçamento e filete DEVEM
  reproduzir o cabeçalho editorial de Depoimentos e permanecer centralizados horizontalmente; o
  título PODE quebrar responsivamente para evitar overflow sem alterar a ordem dos elementos.
- **FR-025**: O convite final de Projetos e seu botão DEVEM compartilhar o mesmo centro vertical. O
  espaço entre o divisor superior e o conteúdo DEVE ser equivalente ao espaço entre o conteúdo e o
  limite inferior da seção, preservando a distribuição horizontal em telas amplas e o empilhamento
  responsivo existente.
- **FR-026**: Todo o portfólio DEVE usar DM Sans 500 para títulos gerais, DM Sans 600 para display do
  Hero, DM Sans 400 para texto editorial e Space Grotesk 400/500 para introduções, corpo,
  metadados, ênfases e controles, com os seguintes papéis responsivos: título de página
  30/48px, título de seção 27/38px, título de conteúdo 20/24px, introdução 16/18px, corpo 15/16px,
  metadado 12px e controle 13px. Metadados e links comuns do Footer e dos avisos do formulário
  DEVEM usar peso 400, preservando peso 500 em ênfases, rótulos de coluna e controles de ação.
  Indicadores numéricos DEVEM usar Space Grotesk 400 com algarismos tabulares. Os line-heights,
  trackings e limites de leitura DEVEM seguir o MIV.
- **FR-027**: Identificadores decorativos, eyebrows, kickers numéricos e seus espaçamentos residuais
  NÃO DEVEM aparecer antes de títulos na Home, em Sobre, nos cases, em Privacidade ou em
  Acessibilidade. Metadados semânticos de projeto, formulários, autoria, navegação e listas DEVEM ser
  preservados.
- **FR-028**: A migração tipográfica NÃO PODE alterar ordem de leitura, níveis semânticos de
  headings, IDs, âncoras, cópias, traduções, grids, colunas, gutters, paddings de seção, imagens,
  animações ou funcionalidade. Apenas espaçamentos internos entre elementos textuais podem reagir.
- **FR-029**: `src/styles.css` DEVE ser a fonte executável única das famílias, pesos, escala,
  entrelinhas, tracking e medidas de leitura. Componentes DEVEM consumir papéis semânticos e NÃO
  PODEM manter um sistema tipográfico paralelo por seletores amplos ou pesos locais redundantes.
- **FR-030**: O wordmark `guifer.tech` DEVE preservar DM Sans 700 em `guifer` e DM Sans 300 em
  `.tech`. O selo Website Carbon PODE preservar pesos 700/600 como exceção de terceiro documentada.
- **FR-031**: Monospace DEVE permanecer restrito a conteúdo funcional de código/terminal por papéis
  explícitos. Caveat, `--font-title`, seu asset e sua dependência DEVEM ser removidos enquanto não
  houver consumidor renderizado aprovado.
- **FR-032**: A consolidação DEVE ser verificada na Home, Sobre, cases, Header, Footer, formulários e
  páginas informativas em 320, 412, 768 e 1440 px, PT-BR/EN-US, claro/escuro e zoom de 200%, sem
  clipping, overflow, quebra indevida, perda de contraste ou regressão de foco.
- **FR-033**: O Footer DEVE identificar LCP, INP e CLS como os três Core Web Vitals e apresentar no
  fechamento a localização em Porto Alegre, RS, o fuso BRT e a hora local dinâmica. Acessibilidade e
  Privacidade DEVEM continuar disponíveis, e o fechamento DEVE refluir sem overflow ou perda de
  leitura em telas estreitas, com toda a cópia localizada em PT-BR e EN-US.
- **FR-034**: O Footer NÃO DEVE exibir indicadores de infraestrutura nem dados de duração da sessão
  ativa. Marca, navegação, Core Web Vitals, selos, links legais, localização e hora local DEVEM ser
  preservados e reorganizados com hierarquia tipográfica coerente e reflow responsivo sem overflow.
  O agradecimento e o bloco de conexões NÃO DEVEM ser exibidos.
- **FR-035**: O Footer DEVE seguir a estrutura espacial da referência fornecida sem alterar cores,
  hierarquia tipográfica ou os conteúdos remanescentes: selos à esquerda e links legais, Navegação e
  Core Web Vitals distribuídos à direita na primeira faixa; Privacidade e Acessibilidade por extenso
  no encerramento dessa faixa, acima do divisor e da localização; marca e autoria à esquerda e
  localização com hora local à direita na segunda faixa. As duas faixas DEVEM ser separadas por um
  único divisor interno. Em telas estreitas, os mesmos elementos DEVEM refluir sem overflow. O Header
  DEVE preservar seu container e alinhamento independentes do frame global de conteúdo.
- **FR-036**: O Footer DEVE usar espaçamento e entrelinha consistentes, aproximar os pares de rótulo
  e valor de Core Web Vitals, preservar respiro entre o título “Core Web Vitals” e seus dados,
  alinhar o conteúdo do Website Carbon à esquerda e apresentar “Explore a página”/“Explore the page”
  com links para todas as seis seções da Home em PT-BR e EN-US. Em telas amplas, Navegação e Core Web
  Vitals DEVEM permanecer em duas colunas agrupadas junto ao limite direito; Privacidade e
  Acessibilidade DEVEM ocupar uma única linha alinhada à direita abaixo do grupo e próxima ao
  divisor. Green Hosting e Website Carbon DEVEM permanecer lado a lado.
- **FR-037**: Todas as rotas do portfólio DEVEM compartilhar rolagem vertical com inércia suave para
  entradas de roda em dispositivos compatíveis. Âncoras, restauração de rolagem, controles de
  navegação e retorno ao topo DEVEM usar o mesmo controlador sem alterar offsets de seções. A
  rolagem por toque e de áreas aninhadas DEVE permanecer nativa, e a suavização DEVE ser desativada
  quando `prefers-reduced-motion: reduce` estiver ativo. A dependência Lenis é autorizada somente
  para este comportamento global e DEVE permanecer subordinada ao orçamento de carbono vigente.
- **FR-038**: A seção Sobre da Home NÃO DEVE exibir o título “Quem sou, o que faço e por quê” nem
  reservar espaço visual para ele. Um heading curto e oculto DEVE preservar a identificação
  semântica da seção. O retrato com transparência DEVE permanecer como recorte integral sem corte
  `cover`, moldura, borda, raio, sombra ou cor de fundo próprios; a superfície editorial que contém
  a composição é regida por FR-040 e o reflow para uma coluna DEVE ser preservado.
- **FR-039**: A narrativa curta de Sobre na Home DEVE derivar da carta de apresentação fornecida e
  despertar interesse pela página completa sem reproduzir currículo, formação ou programas em
  lista. O bloco Sobre DEVE apresentar marcador, título pessoal, um único parágrafo factual sobre a
  bolsa ProUni, a participação em programas de tecnologia e informação e a atuação no planejamento e
  desenvolvimento de aplicações digitais, além do CTA de trajetória em PT-BR e EN-US; o resumo de
  trabalho adjacente é regido por FR-040. Ambos DEVEM reutilizar exclusivamente os papéis
  tipográficos, cores, controles e estrutura responsiva existentes no projeto.
- **FR-040**: A seção Sobre da Home DEVE reproduzir a composição da referência fornecida: retrato
  transparente integral centralizado e ancorado à base, apresentação pessoal sobreposta à esquerda,
  trilho à direita com Sobre, Meu trabalho e links sociais, CTAs para a página Sobre e para Projetos
  e controle circular de avanço. Todo texto e destino DEVEM reutilizar fatos, traduções e links já
  existentes no portfólio, sem conteúdo fictício. A composição NÃO DEVE possuir fundo de card,
  borda ou cantos arredondados; os dois CTAs DEVEM ser links textuais sem moldura, fundo ou ícones de
  seta e reutilizar o tratamento global `link-ink`, sem efeito exclusivo da seção. A apresentação
  DEVE repetir a hierarquia editorial de Projetos: “Olá, eu sou o Guilherme Eleuthério,” como título,
  seguido da linha de acento e de “Desenvolvedor Full-stack” como introdução; a função permanece
  destacada com o acento da marca, usando o primeiro plano escuro do acento no tema escuro, e a
  chamada “Curiosidade que virou caminho” NÃO DEVE ser exibida.
  Os títulos do trilho DEVEM usar `content-title` e os parágrafos, `body-copy`. Em telas estreitas,
  os mesmos elementos DEVEM refluir em ordem legível, sem overflow.
- **FR-041**: O fundo compartilhado das seções da Home DEVE transicionar de forma contínua conforme
  o progresso vertical da página, usando somente `background`, `home-alternate` e uma mistura
  contida de `accent-soft` da paleta Paper & Steel. A implementação DEVE usar Scroll-driven
  Animations em CSS, sem listener de rolagem ou nova dependência, preservar as superfícies próprias
  do Hero e de Sobre e oferecer o gradiente estático atual como fallback. Com
  `prefers-reduced-motion: reduce`, a transição vinculada à rolagem DEVE permanecer desativada.
- **FR-042**: Na página dedicada Sobre, o capítulo final DEVE substituir “Curiosidades sobre mim”
  pelos quatro indicadores de trajetória anteriormente usados na Home: `+960h` de formação
  complementar, `3` programas de formação e certificação, `2` experiências profissionais e nível
  `C1` de inglês técnico. Os rótulos DEVEM permanecer localizados em PT-BR e EN-US, usar a hierarquia
  numérica existente e refluir sem overflow.
- **FR-043**: Na seção Sobre da Home, o retrato recortado DEVE permanecer integral e estático, sem
  animação de entrada nem máscaras de gradiente. O título pessoal e a introdução profissional DEVEM
  reutilizar o efeito compartilhado de embaralhamento e digitação do wordmark `guifer.tech`, mantendo
  o texto final localizado e ficando estáticos quando `prefers-reduced-motion: reduce` estiver ativo.
- **FR-044**: Na seção Sobre da Home, o controle circular de avanço DEVE ser substituído pelo contador
  de cafés existente, precedido por “Visitante? Pegue um café!” em PT-BR e “Visitor? Grab a coffee!”
  em EN-US. A implementação DEVE reutilizar integralmente o comportamento, os estados remotos, a
  prevenção de repetição por visitante e os rótulos acessíveis do contador compartilhado.
- **FR-045**: No trilho direito de Sobre na Home, o bloco antes dedicado a “Meu trabalho” DEVE ser
  substituído pelo resumo profissional localizado, informando que a trajetória profissional e
  educacional foi detalhada em um currículo PDF. O CTA DEVE preservar o tratamento visual existente
  e baixar diretamente `/curriculo.pdf` com o mesmo nome de arquivo usado pelo download do Hero.
- **FR-046**: O wordmark `guifer.tech` animado do Header DEVE restaurar o embaralhamento e a digitação
  de `fer.tech` ao expandir, reutilizando `ScrambleText` e preservando os pesos e o tracking vigentes.
  Em movimento reduzido, o sufixo DEVE alternar diretamente entre os estados completo e recolhido,
  sem animação intermediária. Instâncias estáticas do wordmark, como a do Footer, NÃO DEVEM mudar.
- **FR-047**: O Header da Home DEVE listar, na ordem do documento, Início, Sobre, Projetos,
  Habilidades e Depoimentos nos dois idiomas, mantendo Contato exclusivamente no CTA dedicado. Os
  controles de idioma e tema DEVEM permanecer sem superfície própria, exibindo somente o ícone de
  tema e o destino localizado `PT/BR` ou `ENG/US`; o rótulo de idioma DEVE usar tratamento visual
  secundário, e a troca de idioma NÃO DEVE causar quebra, sobreposição ou reflow destrutivo do
  Header. O CTA final DEVE usar exatamente `Entre em contato` em PT-BR e `Get in Touch` em EN-US;
  quando o restante da navegação estiver recolhido, ele DEVE permanecer sem borda azul e com ênfase
  visual reduzida.
- **FR-048**: Projetos NÃO DEVE exibir o convite final sobre interesse nos cases nem o CTA de
  contato associado. Projetos e Habilidades DEVEM formar uma continuidade visual com a mesma cor de
  fundo, sem divisor entre as duas seções nem espaçamento duplicado produzido pelo fechamento
  removido, preservando IDs, headings e ordem semântica independentes.
- **FR-049**: As cópias de Depoimentos, Competências e Contato DEVEM usar os textos aprovados e suas
  traduções equivalentes em EN-US. Contato DEVE apresentar o rótulo localizado de descoberta dos
  canais (`Você também me encontra em:` / `You can also find me on:`) sem alterar sua estrutura.
- **FR-050**: O contador de cafés DEVE explicar, em hover e foco de teclado, que seu valor representa
  o total de visitantes que pegaram um café. A explicação DEVE ser localizada em PT-BR e EN-US,
  continuar acessível depois que o visitante registrar seu café e NÃO DEVE alterar a lógica de
  contagem existente.
- **FR-051**: O cabeçalho de Depoimentos DEVE apresentar a pergunta sobre o que as pessoas dizem a
  respeito do trabalho e uma introdução que identifique os relatos como depoimentos de profissionais
  com quem houve colaboração em projetos e desafios, com equivalência em PT-BR e EN-US.
- **FR-052**: Na seção Sobre da Home, o bloco formado pelo título e pelo subtítulo de apresentação
  DEVE preservar largura e quebras configuradas e ser deslocado verticalmente para cima, sem se
  sobrepor visualmente ao braço do retrato em telas amplas. O grupo “Minhas redes sociais” DEVE
  apresentar LinkedIn, GitHub e WhatsApp em uma única linha alinhada à esquerda,
  preservando alvos acessíveis e traduções.
- **FR-053**: A apresentação de Sobre DEVE usar “Olá, eu me chamo Guilherme Eleuthério” e “Sou
  Desenvolvedor Full-stack” em PT-BR, com conteúdo semanticamente equivalente em EN-US, sem alterar
  os papéis tipográficos ou a animação existente.
- **FR-054**: A expansão horizontal de Projetos DEVE conceder dois terços da largura útil da galeria
  ao card ativo e um sexto a cada card recolhido. Os vídeos DEVEM usar a resolução nativa disponível, preservar
  sua proporção e permanecer integralmente visíveis sobre um poster desfocado e escurecido, sem
  `cover`, overscan ou transformação de escala. O conteúdo textual do card ativo NÃO DEVE receber
  painel, borda, raio ou fundo adicional.
- **FR-055**: Os títulos dos cards de Projetos DEVEM usar orientação vertical no estado inicial e
  nos cards recolhidos, mudando somente o título do card ativo para orientação horizontal em uma
  única linha por uma transição sutil de opacidade e deslocamento. O título vertical DEVE permanecer
  centralizado verticalmente, alinhado ao recuo esquerdo e integralmente visível. Os ícones de preview e GitHub NÃO DEVEM mudar
  de orientação, dimensão ou posição vertical. As tags DEVEM aparecer imediatamente abaixo do título
  correspondente. No estado recolhido, as tags DEVEM acompanhar a orientação vertical em uma
  coluna separada imediatamente à esquerda do título; no estado ativo, DEVEM retornar à orientação
  horizontal abaixo do título. O início das colunas verticais de título e tags DEVE compartilhar
  o mesmo alinhamento horizontal próximo à borda superior de todos os cards, sem alterar a posição
  dos ícones inferiores.
  No card ativo, o título horizontal e os ícones DEVEM formar um grupo compacto inteiramente contido
  na faixa escura inferior, sem sobrepor a área nítida do preview.
- **FR-056**: Cada card de Projeto em orientação vertical DEVE apresentar atrás das colunas de
  título e tags uma faixa escura vertical com a mesma superfície translúcida e o mesmo desfoque da
  faixa de título do Hero. A faixa DEVE ocupar a altura do card, desaparecer junto da mudança para
  a orientação horizontal ativa e NÃO DEVE alterar os ícones inferiores nem receber borda ou raio
  próprios.
- **FR-057**: Quando um card de Projeto atingir sua largura mínima recolhida em desktop, as colunas
  verticais de título e tags e a linha inferior de ícones DEVEM reduzir conjuntamente o recuo
  esquerdo para permanecer integralmente dentro da faixa escura desfocada. Esse ajuste DEVE ser
  exclusivamente horizontal, sem alterar altura, orientação, dimensões ou o estado ativo.
- **FR-058**: Em larguras móveis, o acionador do menu hambúrguer DEVE permanecer sempre visível e
  operável, inclusive quando os demais controles do Header estiverem recolhidos. O wordmark
  `guifer.tech` NÃO DEVE aparecer no estado fechado e DEVE permanecer na linha superior do próprio
  painel quando aberto, ao lado oposto do acionador de fechamento. A rolagem para cima NÃO DEVE
  revelar controles adicionais no Header móvel. Navegação, idioma, tema e CTA de Contato DEVEM ser
  reorganizados dentro do painel sem adicionar, remover ou duplicar elementos interativos. O Header
  desktop NÃO DEVE ser alterado.
- **FR-059**: No painel móvel aberto, os destinos de seção DEVEM ficar centralizados horizontalmente.
  Contato DEVE aparecer como o último destino, imediatamente após Depoimentos e com o mesmo padrão
  visual dos demais itens, em vez de um CTA separado. Tema e idioma DEVEM compartilhar uma única
  linha centralizada. A altura do painel DEVE resultar do conteúdo, sem altura mínima ou espaçador
  legado inferior, preservando apenas o respiro regular do container.
- **FR-060**: Na linha de utilidades do menu móvel, o seletor de tema DEVE ficar alinhado à borda
  esquerda e o seletor de idioma à borda direita. Ambos DEVEM usar a mesma aparência sutil de botão,
  com superfície, borda, raio e hover derivados dos tokens existentes, sem alterar rótulos, ícones
  ou comportamento.
- **FR-061**: A linha de utilidades do menu móvel DEVE manter respiro horizontal nas duas laterais,
  afastando os botões das bordas do painel expandido sem alterar o espaço vertical, o divisor ou a
  distribuição dos controles em extremidades opostas.
- **FR-062**: Em viewports móveis, a superfície escura e desfocada atrás do título do Hero DEVE
  ocupar exatamente toda a largura do viewport, sem deslocamento lateral ou overflow. Sua altura
  DEVE ser discretamente reduzida pelo uso de seis unidades responsivas no respiro superior e
  inferior, preservando conteúdo, contraste e composição a partir de `sm`.

- **FR-063**: No mobile, a superfície escura e desfocada do cabeçalho de navegação DEVE aparecer
  somente enquanto o menu hambúrguer estiver aberto. Ao fechar o menu, nenhuma barra ou superfície
  residual do cabeçalho desktop DEVE permanecer visível; apenas o acionador hambúrguer mantém sua
  superfície própria, sem alterar o comportamento desktop.

- **FR-064**: Em viewports móveis abaixo de `48rem`, o retrato da seção Sobre DEVE participar do
  fluxo vertical antes da apresentação textual, preservando o recorte e o conteúdo existentes.
  Título, divisor, subtítulo e divisores dos blocos de detalhe DEVEM começar somente após o limite
  inferior do retrato, com ritmo vertical consistente e sem alterar a composição tablet/desktop.

- **FR-065**: No mobile, o retrato e a apresentação textual da seção Sobre DEVEM compartilhar a
  mesma camada de layout, com título, divisor e função sobrepostos à parte inferior do retrato. O
  retrato DEVE receber fade inferior para preservar legibilidade, enquanto os divisores dos detalhes
  permanecem fora da área da imagem; o respiro superior móvel DEVE ser discretamente reduzido.

- **FR-066**: No mobile, o espaço anterior ao retrato da seção Sobre DEVE usar somente a distância
  segura de `69px` do Header, sem o respiro adicional anterior, preservando a sobreposição textual,
  o fade do retrato e os demais breakpoints.

- **FR-067**: A aplicação DEVE apresentar, antes da conclusão da carga inicial do navegador, um
  preloader full-screen com blur, `guifer.tech` centralizado e a mensagem “Loading. Please wait.”.
  O wordmark DEVE alternar de forma intermitente entre embaralhamento e digitação, respeitar
  `prefers-reduced-motion` e permanecer estático nesse modo. O preloader DEVE encerrar no evento
  nativo `load`, sem duração mínima artificial, dependência nova ou requisição de mídia adicional.

- **FR-068**: O wordmark do preloader DEVE reproduzir a assinatura oficial do projeto, com `gui`
  dentro do círculo, `fer` em peso forte e `.tech` em peso leve. Somente o sufixo `fer.tech` DEVE
  participar do embaralhamento e da digitação, mantendo o círculo `gui` estável.

- **FR-069**: A mensagem do preloader DEVE usar o mesmo tamanho responsivo do wordmark e terminar
  com reticências digitadas ciclicamente, reservando a largura dos três pontos para evitar mudança
  de layout. Em movimento reduzido, as reticências DEVEM permanecer estáticas.

- **FR-070**: Na mensagem do preloader, “Loading.” DEVE manter o tamanho do wordmark, enquanto
  “Please wait” e suas reticências DEVEM usar exatamente metade desse tamanho, preservando a linha
  de base e o efeito de digitação.

- **FR-071**: “Loading.” e “Please wait” DEVEM compartilhar o mesmo tamanho reduzido, separados por
  um intervalo visível e estável. As três reticências DEVEM aparecer individualmente em sequência,
  reservando `3ch` para impedir deslocamento do texto.

- **FR-072**: A galeria de Projetos abaixo de `48rem` DEVE apresentar exatamente um card por
  viewport interno e permitir navegação manual por swipe horizontal com scroll snap, sem rotação ou
  avanço automático. Manter pressionado por `450ms` sobre um card com vídeo DEVE iniciar sua prévia
  somente enquanto o contato permanecer ativo; movimento superior a `10px`, soltura, cancelamento
  ou saída DEVEM cancelar o gesto e interromper a prévia. Um ícone de mão DEVE comunicar o gesto no
  mobile, sem alterar os ícones ou o comportamento desktop.

- **FR-073**: O requisito FR-072 fica substituído: no carrossel móvel de Projetos não DEVE existir
  gesto, rótulo ou ícone de pressão longa. A prévia do card mais próximo ao centro do viewport
  interno DEVE reproduzir automaticamente, exceto sob `prefers-reduced-motion`. O swipe manual DEVE
  funcionar continuamente nos dois sentidos por clones de fronteira não navegáveis e normalização
  instantânea para o card real equivalente, sem avanço temporizado ou transição automática.

- **FR-074**: A seção Sobre da Home abaixo de `48rem` NÃO DEVE exibir os artigos “Um pouco sobre
  mim” e “Meu resumo profissional”, nem seus textos e links. Em seu lugar DEVE existir um único
  botão primário interno para `/sobre`, localizado como “Saiba mais sobre mim” e “Learn more about
  me”. Os links sociais DEVEM permanecer, com ícones discretamente maiores, centralizados
  horizontalmente e preservando áreas de toque mínimas de `44px`. Desktop e tablet NÃO DEVEM mudar.

- **FR-075**: No mobile, o CTA de Sobre DEVE aparecer centralizado em uma linha própria imediatamente
  abaixo de um divisor de largura total. O título de redes sociais e seus ícones DEVEM ficar
  centralizados horizontalmente, sem adicionar um segundo divisor ou alterar tablet/desktop.

- **FR-076**: O subtítulo de Projetos abaixo de `48rem` DEVE orientar a interação manual do
  carrossel com a cópia localizada aprovada sobre deslizar lateralmente e abrir o card. O subtítulo
  editorial original DEVE permanecer em tablet e desktop, sem duplicação visual ou semântica.

- **FR-077**: Na seção Depoimentos abaixo de `48rem`, título, divisor e subtítulo DEVEM ficar
  centralizados horizontalmente. Mídias de autoria, nome, cargo, empresa e metadados DEVEM
  compartilhar o mesmo eixo central. O seletor DEVE manter anterior, seis segmentos, próximo e
  autoplay em uma única linha funcional, sem quebra, mantendo alvos laterais de `44px` e segmentos
  de ao menos `24px` em 320px.

- **FR-078**: No mobile, as linhas implícitas do card de Depoimentos DEVEM ter altura de conteúdo e
  ficar agrupadas no início do card, impedindo que a altura do maior depoimento crie espaço entre a
  citação atual e sua autoria. O intervalo intencional entre citação e autoria DEVE ser de `0.25rem`.

- **FR-079**: No mobile, o espaço entre o cabeçalho editorial de Depoimentos e o card ativo DEVE ser
  de `1.5rem`. Slides inativos NÃO DEVEM participar do cálculo de altura do palco, garantindo que o
  seletor siga o conteúdo visível com apenas sua margem compacta existente, sem o vazio causado pelo
  depoimento mais alto.

- **FR-080**: No mobile, os intervalos entre citação e autoria, mídias e dados da autoria, e conteúdo
  ativo e seletor DEVEM compartilhar o token local de `0.75rem`. O intervalo hierárquico entre o
  cabeçalho da seção e o depoimento DEVE permanecer em `1.5rem`.

- **FR-081**: No mobile, o bloco de contato principal do cabeçalho NÃO DEVE participar do layout. Seu
  rótulo, e-mail, WhatsApp, LinkedIn e GitHub DEVEM formar um bloco centralizado após o formulário,
  com os quatro links apresentados apenas por ícone em uma única linha horizontal. Esses links DEVEM
  possuir nomes acessíveis, espaçamento suficiente e alvos de toque de ao menos `44px`; o formulário e
  o novo bloco social DEVEM compartilhar o mesmo ritmo de espaçamento, sem alterar a composição desktop.

- **FR-082**: Abaixo de `640px`, o Footer DEVE adotar uma composição compacta em blocos sem alterar
  conteúdo ou desktop: todos os grupos DEVEM permanecer diretamente sobre o fundo natural do Footer,
  sem uma superfície envolvente; somente os seis destinos da navegação e os dois links legais DEVEM
  usar superfícies de botão com cor distinta, borda e cantos arredondados. Os badges DEVEM permanecer
  empilhados; Core Web Vitals, em painel horizontal de três métricas; e assinatura e horário local,
  após um único divisor. A composição NÃO DEVE gerar overflow horizontal em 320px e DEVE manter foco,
  semântica e tooltips existentes.

- **FR-083**: Abaixo de `640px`, o conteúdo do Footer DEVE receber `0.5rem` adicional de respiro
  lateral interno. O grupo de Core Web Vitals DEVE manter as três métricas na mesma linha diretamente
  sobre o fundo natural do Footer, sem fundo próprio, borda envolvente, cantos arredondados ou
  separadores internos, preservando seus controles e descrições acessíveis.

- **FR-084**: Abaixo de `640px`, a ordem visual do Footer DEVE ser navegação, links de Privacidade e
  Acessibilidade, Core Web Vitals, fechamento com localização e assinatura, e badges como último
  grupo. Localização, horário, wordmark e copyright DEVEM compartilhar alinhamento central. Os dois
  badges DEVEM ficar empilhados e centralizados horizontalmente. Essa reordenação NÃO DEVE duplicar
  conteúdo, alterar a ordem desktop nem modificar os destinos ou interações existentes.

- **FR-085**: No mobile, depoimentos cujo conteúdo exceda a área legível DEVEM usar uma região de
  rolagem vertical limitada, com fade inferior e seta descendente enquanto houver conteúdo abaixo.
  A região DEVE ser acessível por teclado quando houver overflow, remover o indicador ao atingir o
  final e pausar a rotação após rolagem manual. A duração automática de cada depoimento DEVE ser
  calculada pelo total de palavras a `180 ppm`, acrescida de `2s` de orientação e limitada entre `9s`
  e `45s`, reiniciando a cada troca sem alterar a navegação manual. No mobile, as linhas da citação e
  da autoria DEVEM possuir alturas estáveis de `clamp(20rem, 39svh, 22.5rem)` e `19rem`,
  respectivamente, para que seletor, limite da seção e conteúdo seguinte não mudem de posição entre
  relatos curtos e longos.

- **FR-086**: O Footer NÃO DEVE exibir ícone decorativo antes do rótulo Core Web Vitals, preservando
  o controle informativo e as métricas. A introdução de Contato DEVE conter somente a frase sobre
  desenvolver projeto, integrar equipe ou trocar ideias e abertura a novas oportunidades, localizada
  em PT-BR e EN-US. Os quatro canais sob “Você também me encontra em” DEVEM ser links apenas por
  ícone, em uma única linha horizontal, com nomes acessíveis e alvos de `44px` em todos os breakpoints.

- **FR-087**: No mobile, o intervalo entre o divisor superior de Sobre e o CTA “Saiba mais sobre mim”
  DEVE ser de `3rem`, igual ao intervalo renderizado entre o bloco de ícones sociais e o contador de
  cafés. Nenhum outro espaçamento de Sobre ou layout a partir de `768px` DEVE ser alterado.

## Legacy Traceability

| Legacy ID                   | Disposition                                                            |
| --------------------------- | ---------------------------------------------------------------------- |
| QA-HOME-LARGURA-CONTEUDO-01 | Ativo em FR-001                                                        |
| QA-HOME-ORDEM-SOBRE-01      | Ativo em FR-002                                                        |
| QA-SOBRE-CONTEUDO-01        | Ativo em FR-005                                                        |
| QA-HOME-BLUR-01             | Ativo em FR-003                                                        |
| QA-HERO-SOBRE-VISUAL-01     | Parcialmente incorporado em FR-005/FR-006; Hero visual foi substituído |
| QA-PARALLAX-HOME-01         | Ativo em FR-004                                                        |
| QA-FOOTER-MOBILE-01         | Incorporado e atualizado por FR-012                                    |
| QA-CONTATO-MOBILE-01        | Ativo em FR-011                                                        |
| QA-MOBILE-REFERENCIA-01     | Ativo em FR-007                                                        |
| QA-ESPACAMENTO-01           | Ativo em FR-008 e substitui a altura obrigatória antiga                |
| QA-RESP-01                  | Consolidado em FR-005 a FR-014                                         |
| QA-DEPOIMENTOS-01           | Ativo em FR-009                                                        |
| RESP-11                     | Ativo em FR-010                                                        |
| RESP-14                     | Ativo em FR-005                                                        |
| RESP-17                     | Ativo em FR-012                                                        |

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Nenhum viewport-alvo apresenta overflow horizontal, conteúdo cortado ou controle
  inalcançável.
- **SC-002**: As seis seções principais mantêm a ordem correta por DOM, visual, hash e foco.
- **SC-003**: Os seis depoimentos podem ser percorridos em uma área de conteúdo com altura constante,
  sem deslocar o seletor ou redimensionar a seção durante a troca.
- **SC-004**: Todos os alvos de toque relevantes medem pelo menos 44×44 px.
- **SC-005**: Em PT e EN, as três competências apresentam título, descrição e rótulos
  integralmente visíveis sem interação.
- **SC-006**: Em telas amplas, a seção usa composição aproximada de `40%/60%`; entre 320 px e 412 px,
  reflui para uma coluna sem overflow ou conteúdo cortado.
- **SC-007**: Habilidades não contém FAQ, processo em três etapas, acordeão, popover, CTA adicional,
  cards decorativos, mídia ou informação dependente de animação.
- **SC-008**: Sobre mede o mesmo que `window.innerHeight` nos viewports de referência, com tolerância
  máxima de 1 px, e todos os seus elementos visíveis permanecem dentro dos limites da seção.
- **SC-009**: Ao remover `crypto.randomUUID` do ambiente do browser, a Home continua visível e o
  contador de cafés envia um UUID v4 válido sem dependência adicional.
- **SC-010**: Em todas as rotas, a roda produz desaceleração contínua sem interromper teclado,
  âncoras, restauração de posição ou rolagem interna de diálogos; com movimento reduzido, a mesma
  matriz usa rolagem imediata sem inércia adicionada.
- **SC-011**: Na Home, Sobre apresenta um único recorte transparente integral do retrato sem fundo,
  frame ou sombra próprios e sem corte `cover`; a superfície editorial, a apresentação sobreposta e
  o trilho de CTAs seguem a composição definida em FR-040.
- **SC-012**: Em PT-BR e EN-US, a narrativa curta de Sobre comunica a bolsa ProUni, a participação em
  programas de tecnologia e informação e a atuação em aplicações digitais em um único parágrafo,
  conduzindo ao CTA da página Sobre sem introduzir nova regra tipográfica.
- **SC-013**: Em desktop, a apresentação pessoal permanece sobreposta ao retrato e os três blocos de
  ação formam um trilho à direita; em mobile, retrato, apresentação, CTAs e links sociais permanecem
  integralmente visíveis, acionáveis e sem overflow horizontal em PT-BR e EN-US. Nenhum fundo,
  borda ou raio de card envolve a composição, os CTAs são textuais sem setas e o papel tipográfico do
  título permanece preservado com destaque exclusivo para a função profissional.
- **SC-014**: Em navegador compatível, o fundo das seções transparentes da Home apresenta valores
  cromáticos distintos no início, meio e fim da rolagem sem alterar contraste, layout ou ordem das
  seções; sem suporte ou com movimento reduzido, permanece um gradiente estático legível.
- **SC-015**: O capítulo final de `/sobre` exibe exatamente quatro indicadores em ambos os idiomas,
  em quatro colunas no desktop e duas colunas em larguras estreitas, sem manter a lista de
  curiosidades anterior.
- **SC-016**: Na Home, o retrato de Sobre não recebe animação ou sobreposição cromática; título e
  introdução completam o embaralhamento e a digitação com o conteúdo final correto em PT-BR e EN-US,
  sem movimento quando a preferência de redução estiver ativa.
- **SC-017**: Na Home, Sobre não exibe o antigo controle circular de avanço e apresenta o convite
  localizado imediatamente antes de um único contador de cafés acionável, sem overflow no desktop
  ou em larguras estreitas.
- **SC-018**: Em PT-BR e EN-US, o segundo bloco do trilho de Sobre apresenta título e descrição do
  resumo profissional; seu link mantém o estilo textual existente e inicia o download do currículo
  PDF, sem navegar para Projetos.
- **SC-019**: Ao revelar o Header, `fer.tech` passa por caracteres intermediários antes de concluir o
  texto correto; com movimento reduzido não há caracteres intermediários, e o wordmark estático do
  Footer continua completo e sem animação.
- **SC-020**: Em PT-BR e EN-US, o Header expõe cinco links de seção e um CTA exclusivo de Contato
  sem quebra ou sobreposição; em desktop os links permanecem em uma linha e, abaixo do breakpoint
  amplo, usam o menu responsivo. Idioma e tema não possuem fundo próprio, os rótulos secundários de
  idioma são `PT/BR` e `ENG/US`, e o CTA de contato preserva o texto solicitado em cada idioma,
  sem borda azul e com menor ênfase no estado recolhido.
- **SC-021**: Em PT-BR e EN-US, nenhuma cópia ou controle do convite final de Projetos permanece no
  DOM; o fundo calculado de Projetos e Habilidades é idêntico, e a transição entre elas não apresenta
  divisor nem o espaçamento residual do bloco removido.
- **SC-022**: Em PT-BR e EN-US, Depoimentos, o primeiro e o terceiro diferenciais e Contato exibem
  integralmente as novas cópias localizadas, sem texto antigo residual ou alteração de layout.
- **SC-023**: Em PT-BR e EN-US, hover ou foco de teclado no contador de cafés exibe uma explicação
  localizada de que o número representa o total de visitantes que pegaram um café, inclusive após
  o registro do café, enquanto o envio e a contagem permanecem inalterados.
- **SC-024**: Em PT-BR e EN-US, o cabeçalho de Depoimentos exibe integralmente o novo título e a nova
  introdução, sem alterar sua estrutura, hierarquia tipográfica ou layout.
- **SC-025**: Entre 1024 e 1920 px, o título mantém as duas linhas aprovadas e o subtítulo permanece
  integral, ambos posicionados acima da área visível do braço; em todos os breakpoints, os três
  ícones sociais permanecem alinhados à esquerda, sem overflow e com nomes acessíveis.
- **SC-026**: Em PT-BR e EN-US, título e subtítulo de apresentação exibem integralmente as novas
  cópias localizadas sem alterar tipografia, animação ou hierarquia.
- **SC-027**: Em desktop, o card ativo ocupa dois terços da largura útil da galeria e mede quatro
  vezes cada card recolhido, sem alterar a largura total; cada preview 1280×606–614 permanece
  integralmente visível e sem aparência de zoom durante a reprodução, com poster desfocado ao fundo
  e sem painel adicional sob o título.
- **SC-028**: Antes da interação e nos cards recolhidos, somente os títulos aparecem na vertical;
  eles permanecem centralizados verticalmente, alinhados à esquerda e sem corte. O card ativo apresenta seu título horizontal sem quebra
  por crossfade discreto, enquanto as tags acompanham o título e permanecem diretamente abaixo dele, e os
  ícones de preview e GitHub preservam sua composição original. No estado ativo, título e ícones
  permanecem próximos e abaixo do preview, sem colisão visual.
- **SC-029**: Nos estados inicial e recolhido, cada card de Projeto exibe uma única faixa vertical
  com `bg-black/55` e `backdrop-blur-md` atrás do título e das tags; no card ativo a faixa não fica
  visível, enquanto título horizontal, tags e ícones preservam a composição existente.
- **SC-030**: Com um card ativo em desktop, cada card recolhido mantém título, tags e ambos os ícones
  integralmente dentro da faixa vertical, com recuo esquerdo comum de `1rem`; seus limites verticais
  permanecem idênticos aos do estado inicial e nenhum elemento invade a área externa da faixa.
- **SC-031**: Entre 320 px e 1023 px, o acionador do menu permanece visível nos estados fechado,
  aberto e recolhido por rolagem; no estado fechado nenhum wordmark fica visível, inclusive após
  rolagem para cima. Ao abrir, o wordmark aparece na linha superior e navegação, idioma, tema e CTA
  de Contato ocupam grupos internos legíveis e responsivos. Ao fechar, os controles internos deixam
  de ser navegáveis e não existe segunda instância móvel fora do painel.
- **SC-032**: Entre 320 px e 1023 px, os seis destinos ficam centralizados, com Contato imediatamente
  após Depoimentos, e tema e idioma permanecem juntos em uma única linha sem quebra ou overflow. O
  painel termina imediatamente após essa linha com o espaçamento regular, sem a área vazia adicional
  anterior.
- **SC-033**: Entre 320 px e 1023 px, tema e idioma ocupam extremidades opostas da mesma linha e
  apresentam superfícies de botão visualmente equivalentes, integralmente contidas no painel e sem
  overflow nos dois idiomas e temas.
- **SC-034**: Entre 320 px e 1023 px, a área de utilidades aplica `0.75rem` de padding em cada lateral,
  mantendo ambos os botões afastados das bordas, sem introduzir intervalo vertical adicional ou
  alterar a altura natural do painel.
- **SC-035**: Em 320 px e 412 px, a superfície do título do Hero começa em `x = 0`, termina na largura
  exata do viewport e não cria overflow horizontal; o bloco fica menor que a versão anterior sem
  cortar título, resumo ou controle de vídeo, e o layout desktop permanece inalterado.

- **SC-036**: Em 320 px e 412 px, abrir e fechar repetidamente o menu remove por completo a barra
  escura do painel após o fechamento, mantendo visível somente o botão hambúrguer; em desktop, a
  superfície do cabeçalho continua respondendo ao estado de visibilidade existente.

- **SC-037**: Em 320 px e 412 px, nenhum divisor da seção Sobre cruza a área renderizada do retrato;
  há respiro regular entre retrato, apresentação, detalhes, links e redes sociais, sem overflow
  horizontal, corte de conteúdo ou mudança de ordem semântica.

- **SC-038**: Em 320 px e 412 px, a apresentação pessoal aparece sobre o fade inferior do retrato,
  os divisores dos blocos seguintes começam após o limite do retrato e o espaço acima da imagem é
  menor que na versão anterior, sem overflow ou alteração dos layouts tablet e desktop.

- **SC-039**: Em 320 px e 412 px, o retrato começa `32px` mais próximo do início da seção do que na
  versão anterior e mantém distância segura do acionador do menu, sem alterar fade, conteúdo,
  divisores ou causar overflow horizontal.

- **SC-040**: Durante uma carga inicial limitada, o preloader permanece visível até `window.load`,
  exibe o wordmark e a mensagem aprovados e depois deixa de bloquear interação em até `220ms`; com
  movimento reduzido o texto permanece estático e a remoção ocorre sem transição.

- **SC-041**: Durante a carga inicial, o preloader apresenta a mesma estrutura visual do componente
  `GuiferWordmark`; o círculo `gui` não se altera durante a animação e os pesos distintos de `fer` e
  `.tech` permanecem reconhecíveis nos temas claro e escuro.

- **SC-042**: Em 320 px, 412 px e desktop, wordmark e mensagem do preloader apresentam o mesmo
  tamanho computado; as reticências alternam sem deslocar o conteúdo e ficam estáticas sob
  `prefers-reduced-motion`.

- **SC-043**: Em todos os breakpoints, o tamanho computado de “Please wait...” corresponde a `50%`
  do tamanho de “Loading.”, sem quebra indesejada ou overflow horizontal.

- **SC-044**: A linha de estado do preloader mantém tamanho uniforme e espaço perceptível entre as
  duas frases; durante cada ciclo são visíveis sucessivamente um, dois e três pontos, sem mudança na
  largura total e com os três pontos estáticos em movimento reduzido.

- **SC-045**: Em 320 px e 412 px, cada snap exibe um único card completo e o usuário alcança os três
  cards por swipe, sem transição automática. Um toque curto preserva a navegação do case, um swipe
  não ativa vídeo e uma pressão estacionária de `450ms` inicia a prévia até a soltura, sem abrir menu
  contextual ou navegar acidentalmente.

- **SC-046**: Em 320 px e 412 px, o primeiro card inicia em foco e reproduz sua prévia; ao arrastar
  para a direita ou esquerda, o novo card central assume a reprodução e o anterior para. Partindo
  do primeiro card é possível alcançar o último pela esquerda, e partindo do último alcançar o
  primeiro pela direita, sem salto visual, links duplicados focáveis ou rotação automática.

- **SC-047**: Em 320 px e 412 px, nenhum texto ou link dos dois artigos removidos aparece; o novo
  botão abre a rota interna `/sobre`, e LinkedIn, GitHub e WhatsApp ficam centralizados com glyphs de
  `1.35rem` dentro de alvos de `44px`. Em 768 px e 1440 px, os dois artigos originais continuam
  visíveis e o CTA móvel permanece oculto.

- **SC-048**: Em 320 px e 412 px, o divisor precede visualmente o botão, o centro do botão coincide
  com o centro do conteúdo e o título “Minhas redes sociais”/“My social networks” compartilha esse
  mesmo eixo com os três ícones.

- **SC-049**: Em 320 px e 412 px, somente a instrução móvel de swipe e clique fica visível; em
  768 px e 1440 px, somente o subtítulo editorial original fica visível, nos dois idiomas.

- **SC-050**: Em 320 px e 412 px, cabeçalho e autoria de Depoimentos estão centralizados; os quatro
  grupos do seletor possuem a mesma coordenada vertical, os seis segmentos permanecem numa linha e
  anterior, próximo, seleção direta e pausa/reprodução atualizam corretamente o carrossel.

- **SC-051**: Em 320 px e 412 px, para todos os depoimentos, o bloco de autoria começa no máximo
  `0.25rem` após o limite da citação, desconsiderando o padding inferior interno de `0.25rem`, sem
  sobreposição ou mudança no desktop.

- **SC-052**: Em 320 px e 412 px, trocar entre todos os depoimentos faz o seletor acompanhar a altura
  natural do card ativo; não existe grande área vazia entre autoria e controles, enquanto o respiro
  entre subtítulo da seção e citação aumenta para `1.5rem`.

- **SC-053**: Em 320 px e 412 px, os três intervalos internos principais de Depoimentos computam
  `12px`, enquanto o cabeçalho mantém `24px`, sem criar nova área vazia ou alterar desktop.

- **SC-054**: Em 320 px e 412 px, o contato principal deixa o cabeçalho e seu rótulo aparece
  centralizado após o formulário, seguido por e-mail, WhatsApp, LinkedIn e GitHub sem texto em uma
  única linha centralizada, com alvos de `44px`, separação consistente e sem overflow; em 768 px ou
  mais, a lista original de quatro contatos e seu rótulo permanecem visíveis, e o bloco móvel não
  participa do layout.

- **SC-055**: Em 320px e 412px, o Footer apresenta os badges sem borda ou superfície envolvente,
  seis destinos em grade `2 × 3` e dois links legais paralelos como os únicos blocos com fundo de
  botão e cantos arredondados, além de três métricas na mesma linha e fechamento sem cortes ou
  overflow; todos os controles interativos medem ao menos `44px`. Em 640px ou mais, a estrutura
  desktop anterior permanece inalterada.

- **SC-056**: Em 320px e 412px, o conteúdo do Footer possui `8px` adicionais de respiro em cada lado
  e as três métricas de Core Web Vitals permanecem alinhadas horizontalmente sem qualquer superfície,
  borda ou divisor próprio, sem overflow e sem alteração a partir de 640px.

- **SC-057**: Em 320px e 412px, Privacidade e Acessibilidade aparecem imediatamente antes de Core Web
  Vitals, enquanto Green Hosting e Website Carbon formam o último grupo do Footer, empilhados e com o
  mesmo eixo central; localização, horário, wordmark e copyright também estão centralizados sem
  overflow. Em 640px ou mais, a ordem e os alinhamentos anteriores permanecem inalterados.

- **SC-058**: Em 320px e 412px, depoimentos curtos permanecem sem indicador e os longos preservam a
  altura máxima da citação, permitem rolagem até o fechamento, exibem fade e seta somente enquanto há
  conteúdo abaixo e pausam após rolagem manual. Cada slide expõe duração entre `9000` e `45000` ms,
  crescente conforme seu total de palavras. Ao percorrer os seis relatos, card, seletor e início de
  Contato mantêm a mesma coordenada vertical, sem quebra de autoria ou correção manual de rolagem.

- **SC-060**: Em 320px e 412px, o espaço do divisor ao CTA mobile de Sobre e o espaço dos ícones
  sociais ao contador de cafés computam ambos `48px`; em 768px ou mais, o CTA mobile continua oculto
  e o layout existente permanece inalterado.

- **SC-059**: Em mobile e desktop, Core Web Vitals não possui ícone antes do título; Contato exibe a
  introdução curta localizada sem a chamada adicional; e e-mail, WhatsApp, LinkedIn e GitHub aparecem
  apenas como quatro ícones horizontais, com rótulos acessíveis, alvos de `44px` e sem overflow.

## Assumptions

- Animação final fornecida pelo usuário em 2026-11-11 substitui a cortina vertical anterior:
  usar fade-by-line/linha/visivel, line-height 1.55, fadeIn de `0.3s ease forwards` e atraso
  `calc(var(--i) * 0.1s)` por linha real. Esse stagger permite sobreposição entre fades, conforme
  o snippet aprovado, substituindo a exigência anterior de conclusão sequencial. Manter texto
  semântico único para leitura assistiva, geometria/scroll e alternativa estática reduzida.

- Animação dos depoimentos esclarecida em 2026-11-11: cada linha real deve ser descoberta de cima
  para baixo, em toda sua largura, sem fade nem revelação por caracteres. Próxima linha somente
  após concluir a anterior, com `500ms` de descoberta + `80ms` de respiro. Repetir para cada pessoa,
  preservar parágrafos/layout/texto semântico e scroll interno mobile. Pausar fora de vista,
  respeitar movimento reduzido e iniciar tempo de leitura do carrossel só após terminar o texto.

- Restauração parcial do rodapé solicitada em 2026-11-11: recuperar composição anterior, selos
  gráficos, wordmark, horário/localização e legais; conservar navegação e Web Vitals como texto
  simples sem caixas/ícones, conforme a última iteração. Todo conteúdo e ações permanecem.
- Transição de fundo solicitada em 2026-11-11: o limite inferior da faixa mobile de Princípios
  deve terminar em onda suave com as cores existentes, preservando o intervalo atual e sem
  sobrepor texto. Desktop e demais limites permanecem como estão; sem animação decorativa contínua.

- Rodapé textual solicitado em 2026-11-11: adotar composição aberta da referência, com localização
  no topo, navegação e métricas em duas colunas e marca/copyright + links legais na base. Remover
  ícones decorativos, caixas, bordas e aparência de botão. Preservar todo o conteúdo atual, destinos,
  descrições de métricas, horário BRT, dados ambientais e seus links; representar selos como texto
  completo, sem gráficos. Não copiar localização, redes ou faixa de prêmio da referência.
  Manter temas/PT/EN, áreas de toque e foco acessível; inspecionar sem testes/gates.

- Divisores entre seções removidos por solicitação de 2026-11-11: a Home não deve exibir linhas
  horizontais nos limites entre seções, incluindo a borda superior do rodapé, em mobile/desktop.
  Preservar filetes curtos dos títulos, linhas internas de itens/campos/rodapé e intervalos atuais.
  Inspecionar renderização sem executar testes/gates.

- Espaçamento e chegada mobile solicitados em 2026-11-11: aumentar todos os intervalos entre
  seções em 50%, de `56px` para `84px`, somente abaixo de `48rem`, incluindo a separação
  Serviços → Princípios e Princípios → Depoimentos. Cada princípio deve abrir suavemente uma
  única vez quando seu próprio título entrar na área de leitura, após revelar a página.
  Preservar cliques/toques, decisões manuais, movimento reduzido e comportamento desktop.

- CTA em Serviços solicitado em 2026-11-11: substituir a ilustração pela ação Entre em contato
  abaixo da descrição geral. Reutilizar botão primário e texto PT/EN existente, compacto no desktop
  e fluido no mobile. Levar diretamente ao formulário com rolagem suave, hash `#contact-form` e foco
  programático sem abrir teclado; respeitar movimento reduzido. Preservar ofertas e Princípios.

- Sequência dos prompts esclarecida em 2026-11-11: nunca exibir ambas as mensagens juntas.
  Mobile mostra deslize por `3.5s`, depois clique por `3.5s`, depois apenas ícone por `10s` antes
  de reiniciar. Desktop usa mensagem de clique e pausa compacta; movimento reduzido mantém apenas
  a mensagem de clique estática. Preservar tamanho, centralização e transições já aprovados.

- CTAs de Sobre ajustados em 2026-11-11: no mobile, incluir o download do currículo PDF abaixo
  de Saiba mais sobre mim, reutilizando URL, download, texto PT/EN e estilo discreto do link desktop.
  No desktop, o link de conhecer Sobre adota btn-primary, mantendo largura pelo conteúdo e altura
  compacta padrão; não aplicar largura total ou dimensões mobile ao desktop. Preservar restante
  do conteúdo e espaçamento externo; inspecionar sem testes/gates.

- Ritmo dos indicadores corrigido em 2026-11-11: na primeira chegada de cada card mobile,
  mostrar os dois prompts completos. Depois, mudar o estado somente a cada `10s`, alternando
  ícones compactos e legendas. Cápsula deve abraçar conteúdo, com padding simétrico, grupo
  centralizado e ícones de `28px`, sem largura vazia à direita. Preservar transições suaves,
  pausa fora de vista/em cards inativos e versão estática de movimento reduzido.

- Preparação integral solicitada em 2026-11-11: o loader só deve terminar após a página inicial
  completa estar montada, fontes prontas, imagens de todos os estados decodificadas, consultas
  iniciais resolvidas ou com fallback e vídeo do Hero pronto. Seções não aguardam chegada para
  carregar código/conteúdo; somente efeitos dependem da viewport. Após revelar a página, solicitar
  autoplay mudo inline em mobile e desktop, preservando movimento reduzido e controles. Falhas
  de mídia devem usar fallback local pronto; erros fatais exibem recuperação sem falso sucesso.
  O estado pronto deve ser explícito, não condicionado apenas a load ou a atraso decorativo.
  Testes/gates continuam adiados; a política anterior de orçamento/carregamento precisará de
  avaliação consolidada, sem declarar manutenção de A+ para o novo carregamento antecipado.

- Indicadores autorais dos projetos solicitados em 2026-11-11: substituir o ícone de play por
  cápsula de gesto, com SVGs próprios de deslocamento horizontal e clique. No mobile, alternar
  ícone e texto de deslize/clique com transição fluida, somente no card ativo; desktop usa a
  indicação de clique sem sugerir swipe inexistente. Prompts PT/EN, área não interativa sem
  interferência em swipe/links, contraste sobre mídia e alternativa estática com movimento
  reduzido. Preservar layout/copy dos projetos e inspecionar animação sem executar testes/gates.

- Ordem da troca de idioma corrigida em 2026-11-11: salvar a nova preferência sem publicar estado
  ou alterar `document.lang` no documento atual. Recarregar primeiro; somente o bootstrap do novo
  documento deve aplicar o idioma selecionado enquanto o loader está visível. Preservar tema e URL
  em mobile/desktop. Inspecionar idioma antes do unload e após reload, sem executar testes/gates.

- Navegação mobile suave solicitada em 2026-11-11: antes de animar para uma seção, carregar o
  destino e os blocos anteriores para evitar mudanças de altura durante o trajeto. Recalcular
  dimensões do controlador de scroll após renderização; preservar fechamento do menu, hash, foco,
  cancelamento por nova seleção e movimento reduzido. Inspecionar navegação fria mobile/desktop,
  sem executar testes/gates; não alterar a rolagem nativa por toque.

- Troca de idioma solicitada em 2026-11-11: ao selecionar outro idioma em qualquer viewport,
  salvar a preferência e recarregar a página atual. Preservar rota, query e hash, assim como o
  tema; selecionar o idioma já ativo não exige reload. Inspecionar mobile/desktop sem testes/gates.

- Ajustes mobile solicitados em 2026-11-11: CTAs principais com altura mínima de `56px`, texto
  de `16px` e largura disponível; links sociais com área de `52×52px` e ícones de `26px`.
  Rodapé mantém tema escuro e usa texto/ícones claros em seus botões, inclusive no tema claro.
  Hero inicia vídeo mudo inline automaticamente abaixo de `48rem`, sem aguardar interação,
  preservando preferência de movimento reduzido, pausa manual, fallback e suspensão fora de vista.
  Desktop conserva política de intenção e dimensões. Inspecionar sem executar testes/gates.

- Separação visual mobile solicitada em 2026-11-10: Princípios deve ocupar uma faixa suave de
  `accent-soft` em toda a largura, distinguindo-o de Serviços sem cards ou novos divisores.
  Preservar alinhamentos, conteúdo e disclosures recolhidos. Dividir o intervalo compartilhado
  em metades ao redor da faixa, mantendo `56px` entre conteúdos em mobile e desktop inalterado.

- Contraste da introdução Sobre no mobile solicitado em 2026-11-10: deslocar o bloco de título,
  filete e cargo `24px` para baixo, sobre a região mais clara do fade da foto, removendo somente
  sua margem inferior na primeira linha da grade. Preservar desktop, retrato, copy e ritmo entre
  seções; inspecionar renderização mobile sem testes/gates.

- Ritmo vertical uniforme solicitado em 2026-11-10: os blocos Sobre, Projetos, Serviços,
  Princípios, Depoimentos e Contato devem usar um único intervalo responsivo de `56–96px`
  (`clamp(3.5rem, 6vw, 6rem)`) entre suas composições. Cada intervalo pertence ao início do bloco
  seguinte; não acumular padding inferior, superior e margem automática. Manter Hero com altura
  de viewport, remover a altura mínima de viewport das demais seções em telas largas e preservar
  espaçamentos internos, grades, conteúdo e interações. Incluir a transição interna Serviços →
  Princípios. Inspecionar distâncias renderizadas em mobile, tablet e desktop; testes/gates adiados.

- Estabilidade do loader solicitada em 2026-11-10: o wordmark deve manter a posição desde a
  primeira pintura até o fade, inclusive antes do CSS principal e durante a troca de fonte.
  O CSS independente do loader deve definir seu box-sizing e reservar largura de sufixo em `em`,
  sem depender do reset global ou da métrica `ch`. Preservar aparência, scramble e conclusão.
  Reproduzir carregamento escalonado e inspecionar mobile/desktop sem executar testes/gates.

- Correção de proporção desktop solicitada em 2026-11-10: a partir de `48rem`, títulos dos itens
  de Serviços e Princípios usam `18px`, com entrelinha `1.35`; descrições usam `15px`, com entrelinha
  de corpo existente. A escala local substitui o tamanho de conteúdo `24px` inadequado às grades,
  preservando famílias, pesos, títulos principais, introduções, copy, mobile e disclosures.
  Inspecionar os dois idiomas e manter testes/gates adiados durante a iteração visual.

- Refinamentos mobile solicitados em 2026-11-10: abaixo de `48rem`, reduzir a ilustração geral de
  Serviços para 90% da largura disponível e centralizá-la; manter Princípios recolhidos até toque,
  sem abertura por entrada na viewport. Conservar a sequência de entrada no desktop e o controle
  manual acessível. O título de Depoimentos mantém a copy e usa escala local de `22–24px` no mobile
  para reduzir quebras. Preservar desktop e inspecionar renderização sem executar testes/gates.

- Hierarquia tipográfica solicitada em 2026-11-10: Serviços e Princípios de desenvolvimento devem
  adotar os papéis existentes da Home. Usar `section-editorial-title` nos títulos, `section-editorial-intro`
  nos textos de apoio, `content-title` nos nomes dos serviços/princípios e `body-copy` nas descrições.
  Remover tamanhos, pesos, entrelinhas e tracking próprios derivados do mockup, incluindo a redução
  especial dos títulos dos princípios. Filetes curtos usam o mesmo acento editorial. Preservar
  conteúdo, posição da arte, grades, divisores externos removidos e comportamento dos disclosures.
  Verificar reflow dos títulos longos e dos textos nos dois idiomas. Testes/gates continuam adiados.

- Refinamento solicitado em 2026-11-10: remover os divisores horizontais externos imediatamente
  acima do título de Princípios de desenvolvimento e abaixo de seus itens. Preservar o respiro,
  o filete curto do título, os filetes dos disclosures e suas interações. Testes/gates adiados.

- Paleta solicitada em 2026-11-10: a ilustração única de Serviços deve usar exclusivamente os
  tokens de cor do projeto (`accent`, `accent-2`, `accent-soft`, `accent-foreground`, `surface-2`,
  `foreground`, `muted-foreground`, `border`). Remover cores literais e a paleta ilustrativa local
  anterior; gradientes usam somente os tokens e acompanham automaticamente o tema. Preservar
  desenho, tamanho, posição e demais conteúdo/interações. Testes e gates continuam adiados.

- Refinamento de ilustração solicitado em 2026-11-10: remover as quatro artes individuais e seus
  personagens. Criar uma única ilustração SVG de serviços de TI abaixo da descrição geral de
  Serviços, na coluna esquerda: estação de trabalho com website, dispositivos, infraestrutura,
  conexão e busca. Não incluir rostos nem figuras humanas/humanoides. Manter paleta coordenada,
  perspectiva leve, nitidez vetorial e adaptação aos temas; preservar as descrições à direita e
  toda a interação de Princípios. Em mobile, arte acompanha a introdução antes da lista de serviços.
  Testes e gates permanecem adiados nesta iteração.

- Refinamento de Princípios solicitado em 2026-11-10: na primeira chegada ao título da seção,
  abrir os seis painéis em sequência com intervalo de `100ms`, preservando a transição suave.
  Manter os painéis abertos ao final e não repetir a introdução ao voltar pela rolagem. Remover
  abertura por hover e por mero foco; depois da introdução, clique/toque ou ativação por Enter/Espaço
  controla cada item, com Escape para fechar. Interação manual prevalece sobre qualquer abertura
  agendada e deve persistir ao mudar idioma. Movimento reduzido abre sem escalonamento e sem
  animação perceptível. Preservar textos, serviços, artes e semântica; testes e gates adiados.

- Interação solicitada em 2026-11-10: os seis Princípios de desenvolvimento passam a disclosures
  inicialmente recolhidos. Hover com ponteiro fino ou foco de teclado abre a descrição; saída de
  hover/foco fecha quando não fixado por clique. Clique/toque alterna o item e Escape o recolhe.
  Em mobile, usar abertura por toque, sem expansão automática durante rolagem. Preservar títulos,
  descrições, ordem e grade responsiva; usar chevron discreto, transição de altura/opacidade suave,
  foco visível, alvo de pelo menos 44px e `aria-expanded`/`aria-controls`. Conteúdo fechado deve
  ficar fora da navegação/leitura assistiva; movimento reduzido elimina transições. Serviços e
  ilustrações permanecem intactos. Testes e gates seguem adiados na iteração rápida.

- Ilustrações solicitadas em 2026-11-10: adicionar abaixo da descrição de cada serviço uma arte
  original em estilo vetorial, com formas limpas, personagem estilizado, perspectiva levemente
  isométrica, cores vibrantes e gradientes suaves. Criar quatro cenas específicas e coordenadas:
  montagem de website, conexão entre ferramentas, investigação de busca e manutenção de computador.
  Usar SVG autoral estático, sem imagens de banco, rótulos embutidos ou nova dependência. A paleta
  vibrante fica restrita às ilustrações, como exceção editorial aos estados semânticos da interface.
  Preservar copy, navegação e Princípios. Adaptar as artes aos dois temas e ao espaço disponível,
  mantê-las decorativas para leitores de tela e alinhar as artes de cada linha sem cortar textos.
  Testes e gates continuam adiados; realizar inspeção renderizada direcionada.

- Substituições de Serviços solicitadas em 2026-11-10: usar “Websites e aplicações de web”,
  “Integrações e automações”, “Análise de SEO e indexação orgânica” e “Suporte em TI”, com as
  descrições fornecidas pelo usuário e equivalentes naturais EN-US. Corrigir “portfólios” e manter
  “landing pages”/“e-commerce” em minúscula, preservando marcas como WhatsApp e Google. O terceiro
  serviço passa a tratar de investigação de presença na busca e plano de otimização, sem promessa
  de posicionamento. Preservar introdução, Princípios de desenvolvimento e layout. Testes adiados.

- Revisão linguística solicitada em 2026-11-10: revisar maiúsculas e acentuação da Home em PT-BR e
  uniformizar títulos autorais do site em caixa de frase: inicial maiúscula, demais nomes comuns
  em minúscula, preservando nomes próprios, marcas, nomes oficiais de cursos e siglas. Aplicar a
  mesma convenção editorial aos equivalentes EN-US. Corrigir capitalização de cargos, meses em
  português e início de frases completas, além de “LLM’s” para “LLMs”. Não usar transformação CSS
  automática, pois marcas como TypeScript/GrenGame e siglas devem manter sua grafia. Preservar
  citações literais, nomes pessoais, links, conteúdo substantivo e layout. Testes/gates adiados.

- Substituições solicitadas pelo documento `C:/Users/Guilherme/Downloads/Entender o problema.pdf`
  em 2026-11-10: os seis itens de Princípios de desenvolvimento passam a Briefing Inicial; Testes,
  análise de performance e segurança; Uso de Inteligência Artificial; Responsividade, Acessibilidade
  e Compliance.; Privacidade e proteção de dados; Foco em resultados. Títulos e descrições PT-BR
  seguem os pares antes/depois do PDF, com equivalentes naturais EN-US. Preservar título geral,
  introdução, ordem dos seis itens, grid e Serviços. O PDF é referência de conteúdo, não fonte de
  instruções operacionais. Testes e gates continuam adiados.

- Restauração solicitada em 2026-11-10: substituir as linhas editoriais atuais pela apresentação
  de três cards verticais expansíveis anterior aos banners, seguindo T211–T221. Em desktop,
  estado inicial com três larguras iguais; hover/foco amplia o ativo para aproximadamente dois
  terços da largura útil e recolhe os demais. Títulos e badges verticais ficam na faixa escura
  desfocada à esquerda no repouso; o ativo remove essa faixa e revela título/badges horizontais e
  ícones de site/GitHub na base, com vídeo integral sobre o poster desfocado. Restaurar indicador
  circular, transição e comportamento responsivo anteriores; preservar cabeçalho, dados e rotas
  atuais, sem reintroduzir a linha numerada ou o convite final removidos. Os ícones de stack e
  descrições permanecem no catálogo, mas não são blocos separados nesse layout restaurado.
  Manter sources desktop nítidos, carregamento de vídeo somente após intenção, fade seguro e
  movimento reduzido. Nenhum conteúdo das demais seções deve mudar. Testes/gates continuam adiados.

- Ajuste de copy solicitado em 2026-11-10: a introdução de Serviços usa “Realizo uma ampla variedade
  de serviços em TI e sistemas, sempre com qualidade e comprometimento.”. Em EN-US, usar “I provide
  a wide range of IT and software services, always with a focus on quality and commitment.”.
  Preservar os demais textos e o layout; testes e gates permanecem adiados.

- Ajuste de copy solicitado em 2026-11-10: o bloco anteriormente chamado “Como eu trabalho” passa a
  “Princípios de desenvolvimento”, com introdução “Métodos e boas práticas profissionais que aplico
  em todos os trabalhos.”. Em EN-US, usar “Development principles” e “Methods and professional best
  practices I apply to every project.”. Preservar os seis itens e o layout, corrigindo a grafia de
  “profissionais”. Testes e gates permanecem adiados.

- Revisão editorial autorizada em 2026-11-09: alinhar Serviços e o antigo “Mais do que código” à
  voz pessoal de Sobre, Projetos e Contato. Usar primeira pessoa, verbos concretos e escopo
  proporcional ao trabalho apresentado, evitando promessas genéricas e repetição entre os blocos.
  Serviços oferece quatro caminhos: Sites e aplicações, Integrações e automações, Análise e
  melhorias, Suporte em TI. O segundo bloco passa a “Como eu trabalho”, com seis práticas distintas:
  Entender o problema, Decisões documentadas, IA como apoio, Interfaces acessíveis, Cuidado com os
  dados e Simplicidade no código. Reunir conceitos redundantes de tecnologias modernas/código limpo;
  explicar acessibilidade e privacidade como práticas concretas, sem alegações de certificação ou
  conformidade garantida. Grade inferior passa a `3×2` no desktop, preservando reflow e versão EN-US
  natural. Não alterar os demais conteúdos da Home. Não executar testes nesta rodada.

- Refinamento de cursor e Serviços solicitado em 2026-11-09: ao percorrer os ícones da mesma stack,
  manter a caixa contextual visível inclusive nos intervalos, com largura estável determinada pelo
  maior nome da linha. Atualizar somente o nome ao entrar no ícone seguinte; ao sair do grupo,
  restaurar o comportamento normal do cursor. O grupo não deve ocupar a largura vazia da coluna.
  Em Serviços, manter apenas “Desenvolvo soluções digitais que combinam tecnologia, experiência de
  uso e atenção aos detalhes.” na introdução, com tradução equivalente EN-US, removendo o segundo
  parágrafo. Demais conteúdo e layout permanecem; testes/gates continuam adiados.

- Refinamento de Projetos solicitado em 2026-11-09: adicionar uma linha de ícones coloridos da stack
  de cada projeto imediatamente acima do botão de case e dos links existentes, conforme referência.
  Usar `project.stack` e `TechnologyIcon` existentes, sem alterar títulos, descrições, badges,
  destinos, ordem ou composição editorial alternada. A linha deve permitir quebra responsiva.
  Hover em cada ícone mostra somente o nome da tecnologia na caixa contextual já usada nas capas;
  expor o mesmo nome por `aria-label`, sem apresentar o ícone informativo como link ou botão.
  Testes e gates permanecem adiados na iteração rápida.

- Substituição integral de Habilidades solicitada em 2026-11-09: reproduzir o mockup
  `C:/Users/Guilherme/Downloads/mockup_secao_portfolio.png` com dois blocos tipográficos. “Serviços”
  apresenta introdução em dois parágrafos à esquerda e grade 2×2 à direita: Desenvolvimento web,
  IA e automações, Análise e performance, Acessibilidade e privacidade. Após divisor, “Mais do que
  código” apresenta introdução e grade 4×2: AI & LLMs, Documentação, Tecnologias modernas,
  Análise e performance, Acessibilidade, LGPD e segurança, Arquitetura e integrações, Código limpo.
  Textos PT-BR seguem o mockup integralmente, com versão equivalente EN-US. Preservar `#habilidades`
  para navegação, contraste nos temas e reflow sem overflow; não manter os três cards/conteúdos
  antigos, links de SDD, ícones ou interações adicionais. Usar texto/linhas CSS, sem imagem de fundo.
  A referência usa frame de 1110px em viewport 1400px, títulos de 28px, serviços de 18px e grade
  inferior de 16px; o bloco inferior tem título próprio e divisores horizontais discretos.
  Testes e gates continuam adiados nesta iteração rápida.

- Restauração solicitada em 2026-11-09: a composição editorial alternada de T109 substitui os
  refinamentos posteriores de banners/cards. Restaurar uma linha por projeto, com preview natural
  à esquerda e descrição/ações à direita; inverter as colunas nos itens pares do desktop. Badges de
  tipo ficam imediatamente abaixo da mídia. Reutilizar o markup editorial recuperado do checkpoint
  Git `a72824b`, os dados localizados e os destinos atuais; restaurar o frame global de conteúdo,
  o botão de case e os links de repositório/site. Não exibir a linha numerada de categoria em nenhum
  projeto nem o convite final com botão para Contato, conforme refinamento solicitado. Em telas estreitas,
  empilhar mídia, badges e detalhes nessa ordem. Manter reprodução por intenção, movimento reduzido,
  caixa do cursor e fade seguro. Esta decisão prevalece sobre a grade full-width `1.28:1` anterior.
  Testes e gates continuam adiados durante a iteração rápida.

- Direção de Projetos solicitada em 2026-11-09: em desktop (`1024px` ou mais), substituir os cards
  expansíveis por uma grade de duas colunas, com frames de proporção `1.28:1` conforme as referências.
  A capa é exibida no frame; badges ficam no canto superior direito. Hover e foco revelam título,
  descrição do produto, contexto de criação e os ícones de case, site e repositório na base, sobre
  vídeo com overlay escuro. A geometria não muda na interação. Vídeos carregam somente após intenção,
  pausam ao sair e respeitam movimento reduzido; falha mantém a capa. Mobile/tablet permanecem no
  comportamento atual. Esta rodada é iteração rápida: testes, lint, typecheck e build ficam adiados
  por solicitação do usuário; inspeção renderizada desktop deve ser registrada separadamente.
  Refinamento: a seção e a galeria desktop ocupam toda a largura disponível, sem o limite global
  de conteúdo ou gutters laterais. Os frames são contíguos, sem gaps, bordas ou cantos arredondados.
  Badges preservam fonte, cor e estilo originais; somente a posição superior direita muda.
  Refinamento de mídia: priorizar enquadramento integral e nitidez em desktop, usando os sources de
  maior qualidade, com posters extraídos dos próprios vídeos em AVIF/WebP, na resolução nativa de
  `1280px` e no mesmo timestamp inicial (`0.1s`) do player desktop. Imagem e vídeo usam `cover`,
  centralizados e com escala proporcional, preenchendo o frame `1.28:1` sem barras ou distorção.
  O excedente panorâmico é recortado para preencher o frame. A capa permanece até o primeiro frame
  decodificado; saída faz crossfade antes de remover o source do vídeo. Reentrada reinicia o vídeo;
  falha conserva a capa. Preservar os sources leves e enquadramento anteriores no mobile/tablet.
  O link sobreposto ao card deve exibir a caixa personalizada do cursor com o destino localizado,
  mesmo com os elementos de mídia fora do link, por opt-in explícito `data-cursor-tooltip="media"`.

- Ajuste de copy solicitado em 2026-11-09: Contato usa “Fique à vontade para falar sobre algum
  projeto ou tirar qualquer dúvida. Estou aberto para novas oportunidades.”; Depoimentos usa o título
  “Meu trabalho também é contado por quem esteve ao meu lado.” e a introdução “Alguns depoimentos
  de quem conhece o meu trabalho.”. As três mensagens possuem tradução natural em EN-US no
  dicionário existente, preservando os componentes e seus estilos. O título de Contato usa
  “Vamos conversar?” em PT-BR e “Shall we talk?” em EN-US. O ponto final do aviso de consentimento
  deve permanecer na mesma linha do botão de Aviso de Privacidade, com reflow do restante do texto.

- Ajuste de copy solicitado em 2026-11-09: a segunda frase do Hero em PT-BR deve ser exatamente
  “Programação, Análise de software e serviços de TI.”; em EN, deve ser
  “Programming, software analysis and IT services.”, preservando a primeira frase e a estrutura existente.

- “Header” na decisão de ordem corresponde ao Hero como primeiro bloco de conteúdo; o cabeçalho de
  navegação permanece global e não integra a sequência das seções.
- O guia `guifer_capabilities_implementation_guide.pdf`, fornecido em 2026-10-21, substitui as
  referências anteriores de Habilidades quanto a conteúdo, estrutura e interação. Cores e fontes do
  PDF são apenas referenciais; os tokens e a tipografia do MIV do projeto prevalecem.
- O guia `guifer_tech_typographic_system_codex_guide_en.pdf`, fornecido em 2026-10-22, substitui as
  escalas tipográficas e os identificadores decorativos anteriores; suas regras de layout preservado
  continuam subordinadas à constituição e ao MIV atualizado.
- A direção visual de 412×915 é referência proporcional, não screenshot rígido.
- Requisitos mais recentes desta spec prevalecem sobre layouts anteriores conflitantes.

### Espaçamento entre seções — 2026-11-12

Dobrar o espaçamento vertical de entrada das seções principais após o Hero em todos os
breakpoints. Preservar espaçamento interno, insets laterais, conteúdo, navegação e movimento
reduzido. O padding superior computado de Sobre, Projetos, Serviços, Depoimentos e Contato deve
ser exatamente duas vezes o anterior, inclusive a exceção mobile de Depoimentos. Hero e o
espaçamento interno de Princípios permanecem estáveis; não deve surgir overflow horizontal.

### Composição editorial de Sobre — 2026-11-12

A referência visual passa a orientar uma composição simples com apresentação e texto à esquerda
e a foto atual à direita no desktop. O retrato deve ser recortado na cintura em um fundo quadrado,
escuro no tema claro e claro no tema escuro. Não exibir título de seção “Sobre mim” ou equivalente;
preservar nome/apresentação, CTAs, download PDF, redes e contador de cafés. Usar a hierarquia
MIV de fontes/cores. Em mobile, empilhar texto e retrato sem sobreposição ou overflow, preservando
todas as ações. Manter espaçamento duplicado entre seções. Recorte visual via CSS, sem nova mídia.

### Correção de contraste de Sobre — 2026-11-12

Sobre deve usar o mesmo fundo explícito por tema de Projetos/Serviços, inclusive após alternância
de tema com movimento normal. Somente o quadrado da foto inverte o fundo; conteúdo e controles
seguem os tokens normais do tema. Não depender de superfície animada/transparente para contraste.

### Contraste explícito de Sobre — 2026-11-12

A captura do usuário continua mostrando fundo claro no tema escuro. A seção, container e grade
Sobre devem usar explicitamente o fundo MIV #0E131B no escuro e #F7F6F2 no claro; somente o
retrato inverte. Texto escuro segue foreground #F2EFE8, secundário #A4ACB7 e acento #78A5CE.

### Centralização do conteúdo de Sobre — 2026-11-12

Centralizar horizontalmente textos, CTAs, download, redes e café dentro da coluna de conteúdo
Sobre, preservando foto à direita no desktop, reflow mobile, identidade visual e contraste.

### Ajustes exclusivos mobile — 2026-11-12

Abaixo de 768px: retrato de Sobre precede a saudação; cada card de Projetos expande e reproduz
vídeo mudo ao cruzar o centro vertical da viewport, recolhe e pausa ao sair; apenas um ativo.
Movimento reduzido mantém capas sem autoplay. Em Serviços, parágrafo introdutório e CTA ficam
no final, após o prompt de exploração dos Princípios. Preservar desktop/tablet a partir de 768px,
links, teclado, foto/temas e conteúdo PT/EN. Evitar loops de expansão e overflow horizontal.

### Fechamento interno de Princípios no mobile — 2026-11-12

Em mobile, o texto de serviços e CTA ficam dentro da seção Princípios, logo após o marquee e
seu prompt de exploração. Remover o fundo azul e a divisão em onda; usar a superfície normal
do tema. Preservar posição desktop, links e contraste.

### Intervalo Projetos–Serviços mobile — 2026-11-12

Reduzir o vazio entre último projeto e Serviços somente abaixo de 768px. Quando nenhum card
está expandido, eliminar a reserva vertical de expansão. Aplicar 64px de entrada em Serviços;
preservar desktop, expansão/reprodução pelo centro e demais intervalos.

### Reserva de expansão como único intervalo mobile — 2026-11-12

Substituir T337: manter a altura reservada à expansão dos cards de Projetos e remover todo
padding superior adicional de Serviços no mobile. Desktop e comportamento dos cards preservados.

### Rodapé: marca ampla e linha institucional — 2026-11-12

Ampliar wordmark guifer.tech acima dos badges preservando proporção/círculo e pesos da marca.
Na linha dos links Privacidade/Acessibilidade, colocar localização/horário vivo à esquerda e
copyright centralizado horizontalmente no rodapé. Links à direita em desktop; reflow legível
sem overflow mobile. Preservar navegação, métricas, selos e ações. Hora continua dinâmica em BRT.

### Cores do rodapé por tema — 2026-11-12

O fundo do Footer deve seguir o tema selecionado em vez de manter painel escuro no tema claro.
Na Home: claro #F7F6F2 com texto #172033 e secundário #626A75; escuro #0E131B com texto #F2EFE8
e secundário #A4ACB7. Bordas seguem MIV. Preservar contraste de marca, links, foco e controles.

### Wordmark do Footer: efeito e acabamento — 2026-11-12

Manter tamanho/proporção atuais da marca. Aparência sólida e discreta como referência: cor tonal
muted misturada ao fundo do tema, opacity 1. No hover e foco, repetir a revelação scramble/digitação
do sufixo existente no Header; repouso mantém marca inteira. Reservar dimensões durante animação,
nome acessível estável, toque sem hover obrigatório e movimento reduzido sem scrambling.

### Decrypted Text no wordmark Footer — 2026-11-12

Substituir digitação anterior pelo efeito React Bits Decrypted Text no hover/foco: caracteres
aleatórios em todas as letras, resolvendo para guifer.tech após dez iterações de 50ms. Sem
apagamento/revelação por largura. Preservar geometria, círculo, pesos, cor tonal e Header.
Nome acessível estável, repetição por interação, cancelamento na saída e movimento reduzido.

### Decrypted contínuo e sem recorte — 2026-11-12

Substituir limite de dez iterações: manter scrambling a cada 50ms por toda a duração de hover/foco,
restaurar marca na saída e cancelar timer. Nenhum glifo aleatório pode ser cortado; ajustar largura
do glifo à célula original e remover clipping da camada. Preservar caixa, círculo e redução.

### Scramble localizado com inércia — 2026-11-12

Limitar área animada a três caracteres consecutivos próximos ao cursor, seguindo seu movimento.
Saída de hover/foco desacelera durante 650ms e reduz região progressivamente até restaurar marca.
Teclado usa região central; preservar tamanho, cores, glifos completos e redução de movimento.

### Ordem marca/selos do Footer — 2026-11-12

Inverter os blocos: badges acima da marca no Footer, mobile e desktop. Preservar escala,
cores, interações e demais elementos.

### Reversão da ordem do Footer — 2026-11-12

Desfazer somente T345: restaurar logo acima dos badges, preservando demais mudanças.

### Redução discreta da marca Footer — 2026-11-12

Reduzir escala do wordmark Footer em 10%, mantendo proporções, posição, cores e animação.

### Agradecimento e marca compacta no Footer — 2026-11-12

Substituir wordmark grande por mensagem localizada Obrigado pela visita./Thanks for visiting.,
com papel tipográfico de introdução/subtítulo e largura de leitura correspondente. Inserir marca
compacta como na navegação imediatamente antes do copyright, no mesmo grupo centralizado.
Preservar badges, temas, links, horário e reflow. Remover interação exclusiva da marca grande.

### Acabamento do agradecimento — 2026-11-12

Usar Obrigado pela visita! e Thanks for visiting!, aumentar tamanho em 20% sobre introdução
(19.2px mobile / 21.6px desktop) e aplicar acabamento tonal sólido da antiga marca grande:
16% foreground sobre footer-bg, opacity 1. Preservar posição, assinatura compacta e demais textos.

### Intervalo Serviços–Princípios desktop — 2026-11-17

A partir de 1024px, aumentar o intervalo entre a grade Serviços e o título Princípios de
desenvolvimento para o mesmo espaço de entrada das demais seções principais. Preservar
texto, introdução, marquee e espaçamento interno; abaixo de 1024px manter geometria anterior.

### Gate E2E antes de commits — 2026-11-17

Preparar fluxo de commits sem criar commit nesta execução. O hook pre-commit deve executar toda
a suíte E2E sobre snapshot isolado do índice, bloqueando falhas, erros/sinais, teste exclusivo,
atualização de snapshots ou alteração concorrente do índice. Não alterar working tree/staging.
Servidor/porta próprios, sem reutilizar dev server. Preservar hooks existentes e registrar
instalação local. Os demais gates constitucionais, incluindo carbono antes de staging, continuam
obrigatórios. Artefatos temporários de inspeção em tmp não fazem parte do produto nem do lint.

### Consolidação E2E — 2026-11-17

Atualizar contratos E2E para layouts aprovados da Home/rodapé/header, preservando verificações
funcionais, responsivas e WCAG. Falhas reais exigem correção de produto; não ocultar com skips,
relaxamento arbitrário ou baselines cegos. O agradecimento é texto semântico e deve usar texto
secundário MIV legível (substitui mistura 16% solicitada anteriormente por exigência WCAG AA).

### Prontidão do gate carbono — 2026-11-18

Após timeouts repetidos de networkidle, aguardar DOM e sinal existente de página preparada e
revelada com main montado e loader removido. Preservar timeout finito, contabilização integral,
rolagem e rejeição de vídeos automáticos/orçamento excedido. Testar stream contínuo e bloqueio
com loader presente. Otimização de mídia permanece separada desta correção do medidor.

### Carga sob demanda e orçamento A+ — 2026-11-18

Aprovação explícita do usuário: substituir preparo integral/autoplay por posters iniciais e
reprodução somente por controle explícito (clique/teclado), inclusive nos projetos. Scroll,
hover, foco e eventos sintéticos não baixam vídeos. Preservar expansão dos cards, layout,
conteúdo, idiomas/temas, redução de movimento e teclado. Widget completo carrega ao acionar
launcher acessível sempre disponível; imagens fora da dobra e JS não essencial são adiados.
Gate carbono deve medir carga fria + scroll sem intenção e respeitar 272510 bytes, sem mudar
limites/contabilização. Comprovar ausência de requests de mídia antes de play, reprodução e
pausa explícitas, widget sob demanda, reflow e inspeção visual mobile/desktop.

### Hover de previews — 2026-11-18

Pedido posterior autoriza hover real do mouse sobre a imagem/vídeo do card como intenção de
reprodução em desktop. Iniciar somente ao entrar, pausar ao sair/trocar card; preservar botão
play/pausa, opt-in mobile e movimento reduzido. Scroll, foco e eventos sintéticos não iniciam
download. Carga fria continua sem src de vídeo e dentro do orçamento existente.

### Diagnósticos do editor — 2026-11-18

Corrigir os 29 diagnósticos reproduzidos no servidor CSS do VS Code por interpretar Tailwind v4
como CSS padrão: associar somente src/styles.css ao modo Tailwind e prover extensão oficial,
sem desativar validação nem alterar CSS emitido. Incluir E2E no typecheck e corrigir tipagem de
elementos, opções Playwright e acesso anulável. Preservar comportamento e layout.

### Vídeo do Hero publicável — 2026-11-18

Otimizar o MP4 do Hero para menos de 25 MiB, preservando duração, proporção e conteúdo.
Manter reprodução H.264 compatível, poster e play explícito; remover áudio do fundo mudo.
Preservar original local ignorado pelo Git. Validar reprodução real e gate carbono.

### Dispensa E2E do lote de commits — 2026-11-18

Por solicitação explícita do usuário, reutilizar evidências E2E já concluídas e dispensar
nova execução na preparação e no pre-commit somente para C1–C5 da proposta de commits.
Responsável: Guilherme. Motivo: evitar repetição dos testes já executados nesta sessão.
Risco: cobertura integral anterior às últimas correções e ausência de E2E individual sobre
snapshots intermediários. Escopo, evidências, mecanismo e expiração constam em
[commit-plan.md](./commit-plan.md). Manter demais gates, carbono antes do staging e CI.
A dispensa expira ao concluir o lote; mudanças fora do inventário exigem reavaliação.
Criação dos commits continua condicionada à aprovação da proposta pelo usuário.

### Instalação dos browsers na CI — 2026-11-19

Eliminar instalação APT durante o job de browser, cuja transferência de 126 MB consumiu
24m42s e provocou cancelamento pelo limite de 25 minutos. Utilizar imagem oficial Playwright
com browsers e dependências instalados, versão compatível com o lockfile e digest fixado.
Verificar lançamento de Chromium e WebKit com timeout finito antes dos gates existentes.
Preservar nomes dos checks obrigatórios, limite do job, carbono e suíte E2E.

### Referências visuais por plataforma — 2026-11-19

Atualizar referência Linux de acessibilidade para o layout/tipografia já aprovados e manter
referências Windows/Linux próprias para Depoimentos mobile, cuja rasterização de texto difere.
Usar capturas Linux revisadas do container fixado na CI; preservar referência Windows e
tolerância de 1,5%, sem skips novos, alterações de UI ou atualização automática de snapshots.
