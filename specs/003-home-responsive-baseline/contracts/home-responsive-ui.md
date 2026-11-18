# Contrato de Interface: Home Responsiva e Habilidades

## 1. Ordem e destinos

A Home expõe, nessa ordem de DOM e leitura:

1. `#home`
2. `#sobre`
3. `#projetos`
4. `#habilidades`
5. `#depoimentos`
6. `#contato`

Cada destino possui heading focalizável com ID `<secao>-heading`. Navegação por hash deve solicitar
a seção adiada, posicioná-la sem cobertura do cabeçalho e mover o foco para o heading. O ID legado
`#trajetoria` não integra a Home. `#processo` deixa de ser o destino canônico da seção nova.

## 2. Estrutura de Habilidades

- A seção usa `aria-labelledby="habilidades-heading"`.
- O painel possui três grupos semanticamente identificáveis em PT e EN.
- Cada grupo contém seis capacidades na ordem do modelo de dados.
- Engenharia também apresenta as sete tecnologias como conteúdo de apoio.
- O painel usa três colunas a partir do breakpoint desktop, duas no tablet e uma no celular.
- A ordem do DOM nunca muda para produzir o reflow.

## 3. Acionadores e popover

Cada capacidade:

- é um botão com alvo mínimo de 44×44 px;
- possui `aria-expanded` coerente com o estado ativo;
- referencia a explicação por `aria-controls`;
- abre o mesmo conteúdo por hover, foco e toque/clique;
- não depende de cor para indicar seleção ou relação.

O popover:

- contém o nome e a explicação da capacidade ativa;
- permanece dentro da viewport entre 320 e 1920 px;
- não encobre permanentemente o acionador nem cria rolagem horizontal;
- fecha com Escape sem perda ou salto de foco;
- fecha por alternância do mesmo botão ou ação fora do painel no modo persistente;
- não funciona como modal e não prende o foco.

Tecnologias não são botões, não recebem `tabindex` e não abrem popover.

## 4. Relações

Ao ativar uma capacidade:

- o item principal recebe estado `primary`;
- de duas a quatro entidades declaradas recebem estado `related`;
- demais entidades podem receber estado `muted`;
- o estado relacionado pode incluir tecnologia, mas sempre deriva do mapa estático;
- nenhum algoritmo pode transformar o mapa em relação todos-para-todos.

O estado `muted` preserva contraste WCAG AA. A faixa visual desejada de 35–50% somente é usada se a
cor composta final mantiver pelo menos 4.5:1 para texto normal; caso contrário, o token deve ser mais
forte. Principal e relacionado também usam peso, marcador ou contorno para não depender só de cor.

## 5. Responsividade da Home

Nos viewports 320, 360, 390, 412, 640, 768, 1023, 1440 e 1920 px:

- não há overflow horizontal do documento, corte de conteúdo ou controle inalcançável;
- títulos traduzidos não colidem com conteúdo ou controles;
- Projetos, Habilidades, Depoimentos e Contato usam altura natural;
- Sobre mede ao menos `115svh`, mantém heading acessível, texto ampliado/centralizado e quatro
  indicadores semanticamente disponíveis. Visualmente, apresenta um indicador por vez acima do
  contador de cafés, com valores em primeiro plano/Space Grotesk e rótulos no azul de destaque;
  texto, indicador, CTA e retrato decorativo permanecem dentro dos limites da seção;
- a stack de trabalho aparece centralizada abaixo dos CTAs de Sobre, separada em Front-end, Back-end,
  Bancos de dados e Infraestrutura e ferramentas com as treze tecnologias aprovadas; logos e cores
  de marca permanecem sem badges, em escala editorial subordinada ao título e com reflow sem rolagem
  horizontal; no painel direito, o indicador fica diretamente acima do contador de cafés e o conjunto
  se alinha à stack; categorias não usam numeração nem peso forte, tecnologias permanecem em linha
  única alinhada à esquerda e o centro do contador coincide com o divisor inferior final;
- Projetos mantém conteúdo e hierarquia entre 768 e 1023 px;
- Habilidades apresenta o FAQ de cinco pares recolhíveis em largura integral abaixo do processo de
  três etapas, preservando conteúdo, divisores, ordem de foco e leitura em PT/EN;
- Depoimentos mantém seis itens, área de conteúdo com altura estável definida pelo maior relato e
  controles centralizados, sem deslocamento do seletor durante a troca; cada item separa
  citação e autoria sem caixas ou molduras, identifica nome e vínculo profissional, apresenta retrato e
  contexto profissional como mídias circulares lado a lado, usando a identidade visual associada a
  cada pessoa, e posiciona a autoria alinhada à esquerda
  diretamente abaixo; a citação usa toda a largura útil de seu bloco, preservando parágrafos e linhas
  legíveis; o título principal permanece em uma linha; a superfície acompanha o tema ativo, com azul
  escuro para aspas/filete no tema claro e azul claro no tema escuro; em telas estreitas, empilha os
  blocos sem alterar a ordem semântica;
- em Contato, convite editorial, introdução e contatos principais formam a coluna esquerda em telas
  amplas, enquanto o formulário sem marcador permanece discretamente mais estreito e alinhado à direita;
  a mensagem cobre projetos, oportunidades profissionais, dúvidas e parcerias em PT/EN;
  o contato principal usa filete vertical e linhas uniformes de ícone e texto, sem sublinhado, para
  e-mail, telefone, LinkedIn e GitHub;
  o formulário não exibe marcador, ocupa 95% da coluna e exige consentimento explícito por uma caixa
  pequena e discreta no aviso de privacidade e reCAPTCHA antes de habilitar o envio; enquanto
  bloqueado, o botão permanece visualmente esmaecido;
  título, introdução e contato principal ficam centralizados nos dois eixos da coluna esquerda,
  compartilham a mesma margem, mantêm texto alinhado à esquerda e recebem ampliação uniforme de 10%;
  a coluna esquerda não exibe assinatura circular nem spinner;
- abaixo de 768 px, o FAQ permanece após o processo em Habilidades, e o cabeçalho de Contato,
  convite editorial, introdução, contatos principais e formulário empilham nessa ordem, sem
  rolagem horizontal e preservando a ordem de foco;
- abaixo de 768 px, Footer compacta conteúdo sem alongamento indevido;
- alvos interativos relevantes medem pelo menos 44×44 px.

## 6. Superfícies, tema e movimento

- Sobre, Projetos e Depoimentos usam superfícies sólidas. O painel esquerdo de Sobre adiciona uma
  textura procedural grip tape perceptível, sem recurso raster, com gradiente tonal de contraste
  muito baixo e subordinado aos tokens de tema.
- Contato é a única seção principal autorizada a manter transparência com blur.
- O painel de Habilidades permanece escuro e legível em ambos os temas.
- PT e EN oferecem a mesma estrutura e interação.
- Com `prefers-reduced-motion: reduce`, conteúdo e interações permanecem completos, transições não
  essenciais são removidas, o primeiro indicador de Sobre permanece estático e a sobreposição
  Hero/Home adota fluxo linear.

## 7. Carregamento e sustentabilidade

- Habilidades continua sendo chunk adiado.
- Nenhuma fotografia, ilustração, vídeo, fonte ou dependência nova é exigida pela seção.
- O PDF de referência não é servido pelo produto.
- Carga fria e rolagem sem intenção explícita permanecem dentro de 272,51 kB, com meta de 250 kB.

## 8. Critérios automatizáveis

Os testes devem provar:

1. ordem dos seis IDs por posição no DOM;
2. existência de três grupos, 18 botões e sete tecnologias;
3. cardinalidade de duas a quatro relações por capacidade;
4. ausência de botão/popover em tecnologias;
5. paridade de conteúdo em hover, foco e toque/clique;
6. Escape, foco e fechamento externo;
7. reflow 3/2/1 e ausência de overflow;
8. contraste e axe em PT/EN, claro/escuro e movimento reduzido;
9. preservação dos contratos responsivos das demais seções.
