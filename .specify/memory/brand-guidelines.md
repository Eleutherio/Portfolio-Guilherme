# Diretrizes de Marca e Identidade Visual — guifer.tech

**Versão do guia**: 1.1.0  
**Auditoria-base**: 2026-10-12  
**Escopo verificado**: Home, Sobre, cases, Privacidade, Acessibilidade, estados de erro,
header, footer, metadados sociais e ícones da aplicação.

## 1. Papel deste documento

Este documento descreve a identidade visual efetivamente implementada no projeto. Ele é a
referência canônica para consultar fontes, cores, marca, composição, componentes, imagens e
movimento. `src/styles.css` continua sendo a fonte executável dos tokens.

Mudanças de identidade não devem ser feitas apenas neste guia: precisam ser registradas na feature
ativa do Spec Kit, implementadas nos tokens/componentes correspondentes e então refletidas aqui.
A constituição prevalece em qualquer conflito, especialmente nos requisitos de acessibilidade,
sustentabilidade e preservação de escopo.

## 2. Síntese da identidade

A identidade do guifer.tech combina quatro atributos:

- **técnica**: estrutura clara, dados tabulares, filetes, grids e linguagem funcional;
- **editorial**: títulos amplos, ritmo por espaço negativo e hierarquia tipográfica forte;
- **humana**: fotografia real, texto direto em primeira pessoa e superfícies de papel;
- **contida**: azul usado como acento, animações curtas e ausência de ornamentação gratuita.

A impressão geral deve ser de precisão acessível, não de interface corporativa genérica nem de
portfólio carregado de efeitos.

## 3. Sistema de marca

### 3.1 Wordmark principal

O wordmark canônico é `guifer.tech`, sempre em minúsculas e sem espaço.

| Parte    | Construção                                               |
| -------- | -------------------------------------------------------- |
| `gui`    | dentro de círculo preenchido pela cor corrente           |
| `fer`    | DM Sans, peso 700                                        |
| `.tech`  | DM Sans, peso 300                                        |
| conjunto | tracking `-0.055em`, linha única, capitalização original |

No header, o tamanho implementado é `11.5px`; o círculo de `gui` mede `22px`. No footer, a marca acima dos badges usa `clamp(2.5rem, 6vw, 5.5rem)` e círculo proporcional de `1.913em`. O alvo
interativo permanece com pelo menos `44 × 44px`, independentemente do tamanho óptico da marca.

O header pode apresentar somente `gui` quando recolhido. Ao ganhar hover ou foco, o sufixo
`fer.tech` aparece com transição discreta. Essa versão recolhida é um estado funcional do wordmark,
não uma segunda assinatura.

Regras:

- não converter para caixa alta;
- não alterar a relação de pesos 700/300;
- não aplicar gradiente dentro do wordmark;
- não separar `.tech` em outra linha;
- usar o componente `GuiferWordmark`, evitando redesenhos locais;
- sobre o vídeo, usar branco com o negativo interno azul-marinho; em superfícies comuns, usar os
  tokens de primeiro plano e fundo do tema.

### 3.2 Monograma de aplicação

Favicons e ícones instaláveis usam um `g` minúsculo claro sobre círculo azul-marinho. Esse monograma
é reservado a formatos pequenos ou quadrados: favicon, apple-touch icon e ícone PWA. Em interfaces
onde `guifer.tech` é legível, o wordmark principal tem prioridade.

O arquivo-fonte atual é `public/favicon.png`; variantes de 16, 32, 48, 180, 192 e 512px são geradas
pelo pipeline do projeto.

## 4. Tipografia

Todas as fontes principais são servidas localmente em WOFF2. A interface não depende de Google
Fonts em tempo de execução.

| Papel                  | Família canônica       |    Peso | Uso                                                      |
| ---------------------- | ---------------------- | ------: | -------------------------------------------------------- |
| Título geral           | DM Sans Subset         |     500 | `h1`–`h6`, títulos editoriais e de conteúdo              |
| Display do Hero        | DM Sans Subset         |     600 | chamada principal do Hero                                |
| Texto editorial        | DM Sans Subset         |     400 | depoimentos e destaque nominal de Sobre                  |
| Corpo                  | Space Grotesk Variable |     400 | parágrafos, introduções e campos                         |
| Interface              | Space Grotesk Variable |     500 | botões, navegação e controles acionáveis                 |
| Metadado               | Space Grotesk Variable |     400 | labels, tags, autoria, datas e contexto                  |
| Ênfase em linha        | Space Grotesk Variable |     500 | destaque semântico dentro do corpo                       |
| Indicador numérico     | Space Grotesk Variable |     400 | estatísticas e anos, sempre com `tabular-nums`           |
| Código                 | monospace do sistema   |     400 | apenas código e terminal; realce sintático pode usar 500 |
| Wordmark `guifer.tech` | DM Sans Subset         | 700/300 | `guifer` em 700 e `.tech` em 300                         |

### 4.1 Hierarquia

| Papel               | Mobile | Desktop | Especificação                              |
| ------------------- | -----: | ------: | ------------------------------------------ |
| Título de página    |   30px |    48px | DM Sans 500, `1.06`, tracking `-0.035em`   |
| Título de seção     |   27px |    38px | DM Sans 500, `1.12`, tracking `-0.03em`    |
| Título de conteúdo  |   20px |    24px | DM Sans 500, `1.20`, tracking `-0.02em`    |
| Introdução de seção |   16px |    18px | Space Grotesk 400, `1.55`, tracking normal |
| Corpo               |   15px |    16px | Space Grotesk 400, `1.60`, tracking normal |
| Metadado/tag        |   12px |    12px | Space Grotesk 400, `1.45`, tracking normal |
| Controle de UI      |   13px |    13px | Space Grotesk 500, `1.30`, tracking normal |

Regras tipográficas:

- headings usam peso 500 por padrão; o display do Hero usa 600 e sua linha-resumo usa 500;
- corpo e metadados usam 400; botões, navegação e controles acionáveis usam 500;
- depoimentos e texto editorial usam DM Sans 400;
- números de indicadores usam Space Grotesk, peso normal e `tabular-nums`;
- identificadores decorativos, eyebrows e kickers numéricos não são exibidos antes dos
  títulos de seção;
- a capitalização pertence ao conteúdo: a interface não força caixa alta;
- siglas permanecem em caixa alta quando semanticamente corretas, como `API`, `LGPD` e `WCAG`;
- largura de leitura usa `--type-measure-body: 40rem`, exposta por `--layout-prose-max`;
- `src/styles.css` concentra famílias, pesos, escala, entrelinhas, tracking e medidas nos tokens
  `--type-*`; componentes consomem os papéis semânticos em vez de declarar pesos paralelos;
- `.hero-code` e `.code-text` preservam monospace real apenas para código e terminal. Conteúdo não
  técnico usa os papéis de corpo, metadado ou interface.

### 4.2 Exceções tipográficas

O selo Website Carbon preserva os pesos 700/600 exigidos por sua composição visual de terceiro.
O wordmark preserva 700/300 conforme o contrato da marca. Código e terminal preservam monospace.
Essas exceções não autorizam o uso dos mesmos pesos ou famílias em conteúdo comum.

`Caveat Subset`, seu asset, sua dependência e `--font-title` foram removidos por não possuírem
consumidor renderizado.

## 5. Arquitetura de cor

O projeto possui dois escopos cromáticos deliberados:

1. **Portfólio Paper & Steel**: Home, `/sobre` e `/projetos/:slug`;
2. **Interface global**: Privacidade, Acessibilidade e páginas de erro.

Os papéis semânticos permanecem os mesmos nos dois escopos: `background`, `surface`, `foreground`,
`muted`, `border`, `accent`, `ring`, `success` e `destructive`.

### 5.1 Paleta do portfólio — Paper & Steel

| Papel                   | Tema claro | Tema escuro | Uso                           |
| ----------------------- | ---------- | ----------- | ----------------------------- |
| Fundo                   | `#F7F6F2`  | `#0E131B`   | base das páginas              |
| Fundo alternativo       | `#F2F1ED`  | `#121923`   | alternância de seção          |
| Superfície              | `#FCFBF8`  | `#171F2A`   | painéis e controles           |
| Superfície elevada/card | `#FFFFFF`  | `#1B2531`   | cards                         |
| Texto principal         | `#172033`  | `#F2EFE8`   | títulos e conteúdo principal  |
| Texto secundário        | `#626A75`  | `#A4ACB7`   | descrições e metadados        |
| Borda/hairline          | `#DDDAD3`  | `#2A3542`   | divisórias de 1px             |
| Borda de controle       | `#7A7F87`  | `#66717E`   | inputs e controles            |
| Azul principal          | `#244A73`  | `#78A5CE`   | links, foco, ícones e acentos |
| Azul secundário         | `#3C6A96`  | `#A3C2DD`   | gradiente e acento secundário |
| Azul suave              | `#E8EEF4`  | `#1C3348`   | destaque de baixa ênfase      |
| Sucesso                 | `#187A55`  | `#4FC38C`   | confirmação real              |
| Erro                    | `#B93843`  | `#FF7A84`   | falha ou validação            |

Contrastes medidos em sRGB para os pares principais:

| Par                        |   Claro |  Escuro |
| -------------------------- | ------: | ------: |
| texto principal / fundo    | 15.04:1 | 16.22:1 |
| texto secundário / fundo   |  5.06:1 |  8.13:1 |
| azul principal / fundo     |  8.44:1 |  7.16:1 |
| texto sobre azul principal |  9.12:1 |  7.16:1 |

### 5.2 Paleta global

Os valores canônicos são OKLCH; o hex abaixo é aproximação sRGB para referência visual.

| Papel            | Claro                    | Hex aprox. | Escuro                  | Hex aprox. |
| ---------------- | ------------------------ | ---------- | ----------------------- | ---------- |
| Fundo            | `oklch(0.985 0.006 262)` | `#F8FAFE`  | `oklch(0.14 0.02 265)`  | `#060911`  |
| Superfície       | `oklch(0.97 0.008 262)`  | `#F2F5FB`  | `oklch(0.19 0.03 265)`  | `#0D1321`  |
| Superfície 2     | `oklch(0.95 0.01 262)`   | `#EBEFF5`  | `oklch(0.23 0.035 265)` | `#151D2D`  |
| Texto            | `oklch(0.18 0.02 265)`   | `#0D111B`  | `oklch(0.97 0.008 265)` | `#F2F5FB`  |
| Texto secundário | `oklch(0.39 0.025 265)`  | `#3E4553`  | `oklch(0.72 0.03 265)`  | `#9BA5B8`  |
| Borda            | `oklch(0.88 0.015 268)`  | `#D3D7E2`  | `oklch(0.3 0.035 265)`  | `#252E40`  |
| Acento           | `oklch(0.5 0.19 258)`    | `#005CCC`  | `oklch(0.72 0.16 258)`  | `#61A4FF`  |
| Acento 2         | `oklch(0.55 0.22 295)`   | `#8047E1`  | `oklch(0.72 0.18 295)`  | `#AE89FF`  |

### 5.3 Uso de cor

- azul comunica ação, foco, link e estrutura; não deve preencher grandes áreas sem necessidade;
- neutros quentes dominam o portfólio claro; neutros azulados dominam o tema escuro;
- verde é reservado a sucesso, vermelho a erro e âmbar a atenção real;
- gradiente de marca é `accent → accent-2` em 135° e aparece somente em acentos pequenos;
- seleção de texto usa `accent` com `accent-foreground`;
- anéis de foco usam `ring`, nunca são removidos sem alternativa equivalente;
- cores oficiais de tecnologias ficam restritas ao ícone dentro de `TechnologyBadge`;
- cores próprias dos produtos podem aparecer dentro de screenshots e áreas editoriais do case, sem
  redefinir os controles do portfólio.

### 5.4 Contextos especiais

- **Hero em vídeo**: texto e ícones brancos; banda preta a 55% com blur; nenhum contraste dinâmico.
  Preparar o vídeo atrás do loader e iniciar reprodução muda inline após a revelação, em mobile
  e desktop; movimento reduzido mantém poster. Pausa manual e suspensão fora de vista permanecem.
- **Header sobre mídia**: superfícies pretas a 55%, blur de 12px e texto branco a 78%; o CTA
  recolhido recebe borda `#78A5CE`.
- **Depoimentos**: superfície acompanha a polaridade ativa (`background`) e conteúdo usa
  `foreground`; aspas e filete usam o azul escuro `#244A73` no tema claro e o azul claro `#78A5CE`
  no tema escuro. Abaixo de `48rem`, o título longo usa `22–24px`, preservando texto e família,
  para reduzir quebras; no desktop, mantém a escala compartilhada de seção.
- **Projetos e Depoimentos**: compartilham o mesmo cabeçalho editorial, composto por título de
  seção e filete azul curto, sem subtítulo ou marcador decorativo e com reflow sem overflow.
  Projetos usa “Cases selecionados que detalham o contexto, as escolhas feitas e as entregas
  finais de cada projeto.” como título alinhado à esquerda, com tradução EN equivalente.
- **Contato**: única seção principal com vidro translúcido; blur de 20px e saturação de 120%.
  Em telas amplas, o convite editorial, a introdução e os contatos principais formam uma coluna à
  esquerda; o formulário aparece sem marcador na coluna direita, ocupa 95% da largura disponível e
  permanece discretamente mais estreito.
  Contatos diretos usam filete vertical e linhas uniformes de ícone e texto, sem sublinhado, para
  e-mail, telefone, LinkedIn e GitHub. Título, introdução e contato principal compartilham a mesma
  margem esquerda, mantêm texto alinhado à esquerda e usam os papéis tipográficos compartilhados.
  A coluna esquerda se centraliza verticalmente em relação ao formulário e
  permanece livre de ornamentos animados.
  O convite usa DM Sans em peso 500; introdução, contatos, campos, avisos e estados usam Space
  Grotesk em pesos 400/500. No mobile, a coluna editorial precede o formulário e ambos permanecem
  alinhados à esquerda.
- **Serviços e Princípios de desenvolvimento**: substituem o antigo conteúdo de Competências. O frame interno
  fluido de `100%` contém introdução à esquerda e quatro serviços concretos em grade `2×2` à direita:
  websites/aplicações web, integrações/automações, SEO/indexação orgânica e suporte em TI. O
  segundo bloco usa respiro sem divisores externos, com título, introdução e seis práticas em
  marquee horizontal infinito, sem repetir ofertas. A hierarquia usa os papéis compartilhados da Home: títulos editoriais
  de seção (`38px` desktop / `27px` mobile) e introduções (`18px` / `16px`). Nas grades, títulos
  de conteúdo usam escala local de `18px` com entrelinha `1.35` no desktop e mantêm `20px` no mobile;
  descrições usam `15px`. Famílias, pesos e tracking seguem os tokens compartilhados. Essa exceção
  mantém proporção com as colunas estreitas e não altera a escala das demais seções.
  A composição é aberta, com filetes discretos e acentos azuis curtos. A introdução à esquerda
  centraliza horizontalmente título, texto, filete e CTA dentro da própria coluna e alinha
  verticalmente o conjunto ao centro da grade de serviços; a grade de
  ofertas preserva alinhamento à esquerda.
  A introdução
  termina com o botão primário Entre em contato, `28px` abaixo do texto, substituindo a antiga
  ilustração. O CTA é compacto no desktop e fluido no mobile; aponta para `#contact-form`, com
  rolagem suave e foco no formulário, sem abrir teclado. Os quatro serviços à direita são somente
  texto. Abaixo de `48rem`, Princípios usa a superfície normal do tema, sem faixa azul ou onda.
  O texto de serviços e CTA fecham a própria seção, 24px abaixo do prompt de exploração.
  Em Princípios de desenvolvimento, os seis itens usam cards com título e descrição sempre
  abertos, sem dropdowns. O marquee move a `26px/s`; arraste 1:1 em ambos os sentidos aplica
  impulso proporcional à velocidade do gesto, com decaimento exponencial de `0.75s` até a base
  na direção escolhida. Loop por largura do grupo, com cópia visual inert/aria-hidden.
  Controles de direção e pausa, setas/Home/espaço e foco visível permitem leitura manual.
  Ao pausar ou usar movimento reduzido, navegação manual alinha um card inteiro; redução
  desativa autoplay/inércia. Fora de vista, aba oculta ou foco de leitura suspendem o movimento.
  Mobile preserva rolagem vertical; cards usam largura fluida de até `84vw` e textos originais.
- **Footer**: sempre escuro, com fundo azul-marinho e texto claro, em ambos os temas. Mantém
  composição com selos gráficos ambientais, marca, copyright, horário/localização e legais;
  navegação e Web Vitals usam texto simples sem caixas ou ícones decorativos.
- **Website Carbon**: conserva a escala oficial A+–F e seu azul institucional; não é paleta de marca.

## 6. Gradientes, elevação e raios

### Gradientes

- `--gradient-brand`: acento principal → acento secundário, 135°;
- `--gradient-brand-soft`: mesma direção com alfa baixo;
- usos aprovados: botão primário, filete de 2px, marcador curto e halo editorial;
- não usar como fundo integral de seção.
- a Home pode transicionar seu fundo compartilhado conforme a rolagem usando somente `background`,
  `home-alternate` e uma mistura contida de `accent-soft`; essa transição não equivale ao gradiente
  de marca, preserva as superfícies próprias das seções e se torna estática com movimento reduzido.

### Elevação

Cards usam sombra curta e discreta em repouso. Hover amplia a sombra e aproxima a borda do azul de
marca. Elevação nunca substitui hierarquia, borda ou espaçamento.

### Raios

| Token         |        Valor | Uso                                    |
| ------------- | -----------: | -------------------------------------- |
| `--radius-sm` |          4px | botões, switches e badges compactos    |
| `--radius-md` |          8px | inputs e controles médios              |
| `--radius-lg` |         12px | cards                                  |
| `--radius-xl` |         16px | superfícies maiores                    |
| círculo/pill  | 999px ou 50% | chips, retratos e controles circulares |

## 7. Layout e composição

- conteúdo geral: containers compartilhados usam `100%` da largura disponível, sem limite global
  de largura nem gutters laterais; margens horizontais globais são zero;
- header: conteúdo e ações usam metade do inset da Home (24/32/clamp40–72px). O fundo flutuante
  mobile mantém seu posicionamento, com padding interno compensado para não acumular recuos.
  Links desktop mantêm alinhamento central, sem deslocamento compensatório;
- CTA desktop Entre em contato/Get in touch acompanha o estado expandido da navegação:
  ausente quando recolhida, aparece junto aos demais controles por hover/foco/abertura.
  Não mantém alvo ou foco invisível no estado inativo; contato do menu mobile permanece.
- Home e páginas internas: Hero/Sobre, Serviços, Projetos, palco de Depoimentos e Footer
  acompanham a largura disponível. Paddings internos de componentes e medidas de leitura
  permanecem locais; espaçamento vertical não muda por esta regra;
- alinhamento de conteúdo usa o dobro da referência anterior: `48px` até 767px, `64px`
  de 768–1023px e `clamp(80px, 8vw, 144px)` a partir de 1024px em Sobre, molduras de
  Projetos, Serviços, título/introdução de Princípios, Depoimentos, Contato e Footer,
  sem max-width/centralização global ou padding duplicado. O título do Hero conserva a
  geometria anterior e mantém o inset base de 24/32/clamp40–72px.
  Sobre altera somente padding lateral e âncora lateral do café desktop, sem dobrar espaço vertical.
  O track do marquee de Princípios rompe o inset até as
  bordas do viewport, sem espaço lateral; a toolbar continua alinhada ao conteúdo.
  Título, filete e introdução de Princípios ficam centralizados horizontalmente.
  Em Contato, introdução e formulário
  ocupam suas colunas sem recuos percentuais adicionais ou gaps de grid interno redundantes;
- Depoimentos mantém colunas desktop e stack mobile, com texto/aspas/imagens/dados de autoria
  centralizados horizontalmente em seus blocos; título e filete permanecem à esquerda.
- referência mobile: `412 × 915`; compatibilidade mínima verificada em `320 × 568`;
- grids usam 12 colunas no desktop e reflow natural no mobile;
- espaço negativo é parte da identidade e deve separar blocos editoriais;
- o loader representa preparo real: todas as seções já montadas, imagens dos estados ocultos
  decodificadas, fontes prontas, dados iniciais resolvidos ou com fallback e vídeos com buffer
  reproduzível. Somente após esse preparo há fade e liberação da interação; efeitos por chegada
  não carregam a seção. Falhas usam fallback local ou recuperação explícita, sem sucesso simulado;
- na Home, o intervalo entre composições usa `clamp(3.5rem, 6vw, 6rem)` (`56–96px`) no desktop;
  abaixo de `48rem`, usa `84px`, aumento de 50% sobre os antigos `56px`. O intervalo é aplicado
  somente no início do próximo bloco. Serviços → Princípios segue o mesmo valor; evitar
  padding inferior acumulado e altura mínima de viewport fora do Hero, inclusive em 1920px ou mais;
- divisórias usam hairlines de 1px; blocos não devem depender de caixas em excesso;
- na Home, limites entre seções e borda superior do rodapé não usam divisores horizontais;
  separar por espaço/fundo, preservando filetes curtos dos títulos e linhas internas dos componentes;
- em Projetos, banners horizontais empilhados usam acordeão React em todos os breakpoints:
  primeiro aberto inicialmente; resumos recolhidos reservam ao menos `11rem` para nome, badges
  e links sempre visíveis. O painel aberto recebe o espaço restante; a altura total da galeria
  soma um painel aberto, dois resumos e gaps para permanecer estável durante a troca.
  Hover/foco/setas transferem a expansão em 600ms com curva de saída quártica; sair mantém o painel aberto.
  Toque em um painel recolhido expande antes de navegar; movimento reduzido elimina a transição.
  Não há faixa nem metadados verticais; título/badges e links horizontais aparecem em todos os painéis.
  Resumos usam gradiente escuro para contraste; seus links continuam acessíveis por teclado.
  O vídeo é integral sobre o poster
  desfocado, com ícones de site/GitHub na base, cápsula de interação superior e caixa do cursor no
  link do card. Painel aberto usa altura `clamp(22rem, 38vw, 34rem)` e no mobile
  `clamp(22rem, 62svh, 28rem)`. Vídeos são preparados no carregamento inicial e reproduzem por intenção;
  movimento reduzido mantém posters sem animação e evita carregar vídeos.
  A cápsula substitui o play: SVG autoral de clique evolui para legenda PT/EN durante `3.5s`,
  seguido de pausa compacta de `10s` antes de repetir, somente no card ativo; movimento reduzido
  mantém apenas clique estático. A cápsula usa largura intrínseca, ícones de `28px` e grupos
  centralizados com padding simétrico; desktop mostra somente clique.
  Indicadores não capturam ponteiro, pausam fora de vista e usam legendas estáticas sob movimento
  reduzido, com contraste claro sobre superfície azul-marinho translúcida.
  Não há linha numerada nem convite final para Contato;
- textos corridos não ultrapassam aproximadamente 40rem.

Na Home, o Hero usa composição de viewport. Sobre e as demais seções devem crescer pela
altura natural do conteúdo. A ordem estrutural atual é Hero → Sobre → Projetos → Habilidades →
Depoimentos → Contato → Footer.

## 8. Padrões de componente

Depoimentos revelam cada linha renderizada com fade de `300ms ease forwards`, escalonado
em `100ms`, e entrelinha `1.55`, conforme CSS fornecido. O texto semântico permanece no fluxo;
as linhas visuais são uma camada sem leitura assistiva duplicada. A contagem de leitura começa
após a última linha terminar. Movimento reduzido apresenta o texto completo sem animação.
Todos os efeitos do depoimento compartilham a duração total medida no quote:
`300ms + (linhas - 1) × 100ms`. A medição libera o início conjunto; conclusão fixa o estado final.
Dados textuais de autoria usam o mesmo fade de `300ms`, com stagger redistribuído entre campos
presentes para concluir junto do quote, de cima para baixo (rótulo, nome/LinkedIn, cargo,
empresa, data e procedência).
Links e tipografia originais permanecem; trocar depoimento/idioma reinicia a sequência e sair
da seção pausa o efeito. Retratos e marcas profissionais revelam em pixels quadrados numa
grade `12×12`, partindo de uma borda aleatória por imagem/ativação, durante o mesmo intervalo
total do quote. Os atrasos são normalizados para terminar junto do texto, independentemente
da borda sorteada ou tamanho do depoimento.
A ordem combina distância da borda e variação local, sem girar ou deslocar a imagem.
Seleção reinicia e atividade pausa a revelação; movimento reduzido mostra a imagem integral.
O container de autoria permanece sem animação para preservar o efeito de cada elemento.
O link LinkedIn da autoria mostra somente o ícone, preservando nome completo no aria-label.

### Botões

Controles de mídia/carrossel de Hero, Princípios e Depoimentos compartilham o padrão discreto
dos depoimentos: área `44×44px`, ícone `16px` com stroke `1.5`, fundo transparente e sem
borda/círculo/sombra. Navegação usa chevrons; play/pause mantém ícones e labels de estado.
Foco usa outline visível. Hero usa tinta branca sobre mídia para preservar contraste;
demais controles usam foreground do tema. Posição e comportamento de cada controle permanecem.

**Primário**: Space Grotesk 13px/500, altura mínima 44px, raio 4px, gradiente de marca e texto branco.
No hover torna-se transparente, com texto e borda azuis.

**Outline**: fundo transparente, borda e texto em azul. No hover recebe gradiente e texto branco.

Botões não usam caixa alta e nunca ficam abaixo de 44px em entradas por toque.
Na Home mobile, CTAs principais usam altura mínima de `56px`, texto de `16px` e largura disponível;
links sociais de Sobre/Contato usam área de `52×52px` com ícones de `26px`. Controles do rodapé
usam texto e ícones de `footer-foreground`, evitando herdar o acento escuro do tema claro.
Em Sobre, o CTA desktop de conhecer a trajetória usa o mesmo botão primário com gradiente do
mobile, mas mantém altura padrão de `44px` e largura pelo conteúdo. No mobile, o link do currículo
PDF fica centralizado `12px` abaixo de Saiba mais sobre mim, preservando o estilo discreto do
download desktop e a área de toque acessível.

### Links

Links editoriais usam `link-ink`: sublinhado de 1px que recolhe no hover e texto que migra para o
azul. Links de navegação podem usar apenas mudança de cor quando o contexto já comunica interação.
Links comuns do Footer e dos avisos do formulário usam Space Grotesk em peso 400; os rótulos de
coluna e os controles de ação permanecem em 500.

### Cards

`card-surface` combina fundo neutro, borda hairline, raio de 12px e sombra discreta. A variante
`card-surface--accent` acrescenta filete superior de 2px. Não aplicar cor de produto ao chrome do
card.

### Chips e tecnologias

Chips são pills neutras no papel de metadado, em 12px/500. Em tecnologias reconhecidas, apenas o ícone de 16px recebe a cor
oficial; fundo, texto e borda continuam integrados ao tema.

### Formulários

Inputs são transparentes, usam Space Grotesk em peso 400 e borda inferior. Foco usa azul; erro usa
`destructive`. Labels usam o papel de metadado em Space Grotesk 12px/400, line-height `1.45`, e a
capitalização definida pelo conteúdo. Textos de privacidade, erro e estado mantêm escala secundária
sem reduzir legibilidade.

## 9. Fotografia, vídeo e textura

- fotografia deve parecer documental e real, ligada à trajetória ou ao trabalho;
- screenshots de produto permanecem nítidos e podem conservar suas cores originais;
- Sobre da Home usa texto editorial à esquerda e a fotografia atual de Guilherme apresentando
  um projeto à direita, com recorte na cintura e fundo quadrado em `foreground`: escuro no tema
  claro e claro no tema escuro. A foto conserva suas cores documentais e variantes AVIF/WebP;
- a composição de Sobre cresce naturalmente com o conteúdo e empilha retrato/texto em mobile,
  sem overlays, títulos visíveis “Sobre mim” ou painéis temáticos adicionais;
- saudação/nome usam o papel de título editorial; o papel profissional usa azul de acento;
  descrições usam corpo e texto secundário. Fontes e pesos seguem os tokens MIV existentes;
- trajetória e currículo PDF permanecem acessíveis em todos os tamanhos, seguidos das redes
  sociais e do convite/contador de cafés. A ação de currículo mantém a apresentação de link;
- a página `/sobre` combina fotografia editorial, bordas finas e legendas discretas;
- o Hero usa vídeo monocromático como fundo integral, sem filtro visual adicional da interface;
- poster e variantes responsivas devem preservar a composição sem aumentar o orçamento de carbono;
- imagens decorativas devem permanecer subordinadas ao texto e possuir alternativa apropriada
  quando comunicarem conteúdo.

## 10. Movimento e interação

| Tipo               | Duração de referência | Curva                            |
| ------------------ | --------------------: | -------------------------------- |
| feedback mínimo    |             100–220ms | ease-out                         |
| hover/estado       |             250–350ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| entrada de seção   |             500–600ms | mesma curva                      |
| desenho de divisor |              até 1.1s | mesma curva                      |

Movimento deve explicar estado, continuidade ou direção. Não usar animação como decoração contínua.
`prefers-reduced-motion: reduce` remove transições não essenciais, scroll suave, parallax e
animações de entrada. Hover nunca pode ser a única forma de revelar informação ou ação.

## 11. Aplicação por rota

| Superfície                       | Escopo        | Características dominantes                                                                                   |
| -------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------ |
| Home `/`                         | Paper & Steel | Hero preto/branco, papel na Sobre, cards neutros, depoimentos editoriais sem molduras e coerentes com o tema |
| Sobre `/sobre`                   | Paper & Steel | álbum editorial, fotografia, numeração e filetes azuis                                                       |
| Cases `/projetos/:slug`          | Paper & Steel | títulos grandes, dados editoriais, screenshots com cor própria                                               |
| Privacidade `/privacidade`       | global        | leitura longa, fundo frio claro/escuro, azul mais vivo                                                       |
| Acessibilidade `/acessibilidade` | global        | estado técnico, painéis informativos e sinalização semântica                                                 |
| Erro/404                         | global        | composição central, CTA inverso e texto direto                                                               |

O case GrenGame possui tratamento editorial próprio e navegação lateral, mas mantém tipografia,
neutros, azul estrutural, header e footer do sistema.

## 12. Acessibilidade obrigatória

- WCAG 2.2 AA é requisito, não recomendação;
- texto comum deve atingir 4.5:1 e texto grande 3:1;
- foco visível usa contorno de 2px e offset de 2px;
- alvos por toque medem pelo menos `44 × 44px`;
- cor nunca é o único sinal de estado;
- zoom, reflow e conteúdo traduzido não podem causar corte ou overflow;
- `forced-colors` deve preservar marca legível e controles operáveis;
- animações respeitam movimento reduzido;
- ícones decorativos usam `aria-hidden`; ações recebem nome acessível;
- o widget de acessibilidade não substitui a acessibilidade nativa da interface.

## 13. Metadados e presença externa

Cards sociais usam 1200 × 630px, fundo `#0E131B`, texto `#F2EFE8`, azul `#78A5CE` e texto secundário
`#A4ACB7`. Cases podem usar fotografia de produto sob overlay escuro. O wordmark permanece no canto
superior esquerdo.

`theme-color` em runtime acompanha `#F7F6F2` no tema claro e `#0E131B` no escuro. O manifest usa
`#F2F1ED` como fundo de instalação e um fundo escuro de bootstrap.

## 14. Voz visual e textual

- títulos curtos, diretos e concretos;
- títulos autorais usam caixa de frase: inicial maiúscula e nomes comuns em minúscula, preservando
  nomes próprios, marcas, cursos oficiais e siglas. A mesma convenção vale para os títulos EN-US;
- cargos usam nomes comuns em minúscula dentro da frase; meses em português ficam em minúscula.
  Não converter texto globalmente por CSS nem alterar citações literais para impor capitalização;
- texto em primeira pessoa quando descreve trabalho ou processo;
- evitar superlativos, percentuais de habilidade e afirmações sem evidência;
- preferir verbos de ação e explicar impacto para pessoas ou negócio;
- português e inglês devem preservar intenção e hierarquia, não tradução palavra por palavra;
- a identidade não usa jargão de IA como substituto de explicação profissional.
- em Serviços, descrever o que Guilherme pode fazer; em Princípios de desenvolvimento, explicar decisões e
  cuidados concretos em primeira pessoa. IA aparece como apoio com revisão e responsabilidade
  pessoal, sem promessas genéricas de resultado ou repetição dos mesmos temas nos dois blocos.

## 15. Regras de implementação

1. Usar tokens semânticos; não escolher cor por aparência isolada.
2. Alterar fontes, cores, raios e sombras primeiro em `src/styles.css`.
3. Reutilizar `GuiferWordmark`, `SectionShell`, `TechnologyBadge`, `btn-primary`, `btn-outline`,
   `card-surface`, `chip` e `link-ink` antes de criar variantes.
4. Manter cores literais somente quando pertencem a uma exceção documentada: Hero/header sobre
   vídeo, cores oficiais de tecnologias, Website Carbon, status semântico ou imagem de produto.
5. Não adicionar dependência de fonte ou CDN sem decisão registrada e impacto de carbono medido.
6. Alterações visuais devem ser verificadas em tema claro/escuro, PT/EN, mobile/desktop, teclado e
   movimento reduzido.

## 16. Achados da auditoria e pendências conhecidas

Os itens abaixo descrevem o estado atual; não autorizam correção fora de uma feature aprovada.

| Estado      | Achado                                                                      | Consequência                                              |
| ----------- | --------------------------------------------------------------------------- | --------------------------------------------------------- |
| alinhado    | Home, Sobre e cases compartilham Paper & Steel                              | continuidade visual entre portfólio e conteúdo profundo   |
| alinhado    | DM Sans + Space Grotesk estão locais e subsetadas                           | consistência, privacidade e menor custo de rede           |
| alinhado    | wordmark e capitalização possuem regressões E2E                             | menor risco de deriva da marca                            |
| intencional | páginas utilitárias usam a paleta global OKLCH                              | aparência mais técnica e fria que o portfólio             |
| resolvido   | Caveat e `--font-title` foram removidos após auditoria de consumidores      | apenas as duas famílias canônicas são transferidas        |
| intencional | monospace permanece restrito a `.hero-code` e `.code-text`                  | código mantém distinção funcional                         |
| exceção     | Website Carbon preserva pesos 700/600 do selo de terceiro                   | fidelidade ao componente externo                          |
| resíduo     | `DynamicContrast` e CSS correspondente não têm consumidor                   | não integra a identidade atual                            |
| divergência | imagens sociais ainda usam Space Grotesk nos títulos                        | títulos externos não repetem DM Sans do site              |
| divergência | `index.html`/manifest usam `#0A0A14`, enquanto o dark runtime usa `#0E131B` | pequena mudança de cor durante bootstrap/instalação       |
| exceção     | favicon usa `g`, enquanto o wordmark recolhido usa `gui`                    | exige manter clara a distinção entre monograma e wordmark |

## 17. Checklist de revisão de marca

- [ ] A rota usa o escopo cromático correto.
- [ ] Títulos usam DM Sans; corpo e interface usam Space Grotesk.
- [ ] O wordmark não foi redesenhado nem capitalizado.
- [ ] A ação principal usa o padrão de botão existente.
- [ ] Cores literais possuem exceção documentada.
- [ ] Texto, foco e estados atingem WCAG 2.2 AA.
- [ ] A composição funciona em 320px, 412px e desktop.
- [ ] Tema claro e escuro mantêm a mesma hierarquia.
- [ ] Movimento reduzido preserva todo o conteúdo e interação.
- [ ] Imagens têm proporção, recorte e alternativa adequados.
- [ ] A alteração não ultrapassa o orçamento de carbono.

## 18. Mapa de fontes executáveis

| Assunto                                      | Fonte executável                                       |
| -------------------------------------------- | ------------------------------------------------------ |
| fontes, tokens, layout, utilitários e motion | `src/styles.css`                                       |
| wordmark                                     | `src/components/GuiferWordmark.tsx`                    |
| ícones sociais                               | `src/components/icons/Brand.tsx`                       |
| cores de tecnologias                         | `src/components/TechnologyBadge.tsx`                   |
| header                                       | `src/components/layout/Header.tsx`                     |
| footer                                       | `src/components/layout/Footer.tsx`                     |
| metadados e theme-color                      | `src/components/layout/DocumentMetadata.tsx`           |
| favicon e ícones                             | `public/favicon.png`, `scripts/generate-app-icons.mjs` |
| cards sociais                                | `scripts/generate-social-images.mjs`                   |
| regressões de marca                          | `e2e/brand.spec.ts`, `e2e/contrast.spec.ts`            |

### Rodapé acompanha o tema — atualização de 2026-11-12

O Footer usa a superfície e contraste do tema ativo. Paper & Steel claro: fundo #F7F6F2,
texto #172033, secundário #626A75 e filetes #DDDAD3. Escuro: fundo #0E131B, texto #F2EFE8,
secundário #A4ACB7 e filetes #2A3542. Marca e negativo do círculo invertem com o tema;
controles/links seguem foreground e acento MIV. Páginas globais herdam a paleta global ativa.

### Marca tonal no Footer — atualização de 2026-11-12

O wordmark do rodapé mantém escala/proporções e usa cor sólida tonal (`color-mix` de 16% de
footer-foreground sobre footer-bg), com opacity 1, conforme referência fornecida. O restante
do conteúdo preserva contraste MIV. Hover/foco reexecuta a digitação/scramble compartilhada com
Header em camada visual sem alterar a caixa reservada. Em repouso e sob movimento reduzido,
a marca fica completa e estática; foco visível e nome acessível permanecem contrastantes/estáveis.

### Decrypted Text no Footer — atualização de 2026-11-12

A interação do wordmark Footer substitui a digitação anterior por Decrypted Text, adaptado do
React Bits: todas as letras trocam por caracteres aleatórios a cada 50ms e voltam ao original
na décima iteração. Hover/foco repete o efeito. Círculo, escala, pesos e acabamento tonal sólidos
permanecem. A marca do Header conserva seu comportamento anterior. Movimento reduzido mantém
wordmark completo estático e não monta camada animada.

### Decrypted contínuo no Footer — atualização de 2026-11-12

Por refinamento do usuário, scrambling permanece ativo durante todo hover/foco, sem terminar
ao atingir dez iterações. Saída restaura marca inteira imediatamente. Glifos aleatórios são
centralizados e ajustados horizontalmente ao espaço original, sem overflow-hidden ou recortes.
Dimensões reservadas, cores, Header e movimento reduzido continuam preservados.

### Área localizada e inércia da marca — atualização de 2026-11-12

No Footer, scrambling afeta somente três caracteres consecutivos próximos ao cursor; o restante
da marca permanece legível. Saída tem desaceleração de 650ms e reduz a região até parar. Teclado
usa a região central; movimento reduzido mantém texto estático. Cores/proporções preservadas.

### Ordem dos blocos do Footer — atualização de 2026-11-12

Os badges aparecem acima do wordmark no mobile e desktop; escala e interações da marca
permanecem. Esta ordem substitui descrições anteriores de marca acima dos badges.

### Ordem restaurada do Footer — atualização de 2026-11-12

A pedido de desfazer a última alteração, a marca volta a aparecer acima dos badges no mobile
e desktop. Esta decisão substitui a inversão descrita na atualização anterior.

### Escala reduzida do wordmark Footer — atualização de 2026-11-12

A marca do Footer passa a usar clamp(2.25rem, 5.4vw, 4.95rem), redução de 10% na escala anterior.
Círculo proporcional de 1.913em, cores e interação permanecem.

### Agradecimento e assinatura compacta — atualização de 2026-11-12

O Footer substitui a marca grande por Obrigado pela visita./Thanks for visiting., usando papel
de introdução (16/18px) e medida de leitura compartilhada. Na linha institucional, marca completa
compacta de 11.5px e círculo 22px precede copyright no grupo central. Sob telas estreitas o grupo
pode quebrar linha. Efeitos da antiga marca grande foram removidos; Header mantém sua interação.
Esta decisão substitui escala/acabamento/decrypt anteriormente descritos para a marca grande.

### Agradecimento tonal — atualização de 2026-11-12

Footer usa Obrigado pela visita!/Thanks for visiting!, tamanho 120% da introdução (19.2/21.6px)
e acabamento sólido tonal da antiga marca: 16% footer-foreground sobre footer-bg, opacity 1.
A assinatura compacta e os demais textos mantêm seus tamanhos e contraste.

### Contraste do agradecimento — atualização de 2026-11-17

Por exigência WCAG AA da constituição, o agradecimento usa `--footer-muted`, texto secundário
MIV com contraste mínimo de 4.5:1 nos dois temas, substituindo a mistura tonal de 16%.
Escala, posição e opacidade 1 permanecem. Links curtos do rodapé e LinkedIn dos depoimentos
mantêm área mínima de 44 × 44px; até 400px, controles dos depoimentos distribuem botões e
indicadores em duas linhas para impedir sobreposição de alvos.

### Mídia sob demanda — 2026-11-18

Posters substituem autoplay inicial; controles explícitos de play/pausa em Hero e Projetos
preservam layout e tokens. DM Sans usa somente pesos 400–600 exigidos pelos papéis existentes;
Space Grotesk mantém 300–700. Imagens regeneradas preservam dimensões/proporções e originais.
Retrato inclui 512w para refletir largura renderizada (~490px em 1365px), evitando fonte720w.
Marcas de autoria usam AVIF256px; slides ocultos carregam imagens somente quando selecionados.
Selo hospedagem preserva texto e link de verificação vivo, com snapshot WebP local otimizado.
