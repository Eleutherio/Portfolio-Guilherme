# Pesquisa: Baseline Responsivo da Home

## Decisão 1 — Reutilizar a arquitetura de seções adiadas

**Decisão**: manter `DeferredSection` e o carregamento dinâmico da rota Home, inserindo Habilidades
entre Projetos e Depoimentos com o ID canônico `habilidades`.

**Motivo**: a estrutura atual já contém foco por hash, hidratação por proximidade e contenção de
falha. Reutilizá-la preserva desempenho e evita uma segunda estratégia de carregamento.

**Alternativas consideradas**:

- Importar Habilidades de forma síncrona: rejeitado por aumentar a carga inicial sem benefício.
- Manter `processo` como ID: rejeitado porque a seção aprovada é mais ampla que o processo e o nome
  não representa capacidades e tecnologias.
- Criar uma rota independente: rejeitado porque o requisito é a sequência da Home.

## Decisão 2 — Catálogo estático, tipado e separado do texto traduzível

**Decisão**: guardar IDs, grupos, tecnologias e relações em `src/content/capabilities.ts`; guardar
títulos, descrições e rótulos em `src/i18n/dictionary.ts`.

**Motivo**: o mapa relacional é domínio estável e verificável, enquanto o texto varia por idioma.
Essa separação impede divergência estrutural entre PT e EN sem criar infraestrutura de conteúdo.

**Alternativas consideradas**:

- Duplicar toda a estrutura dentro de cada idioma: rejeitado porque permite relações diferentes por
  tradução e dificulta provar a cardinalidade 2–4.
- Buscar conteúdo de CMS ou API: rejeitado por ampliar arquitetura, custo e superfície de falha.
- Declarar tudo dentro de `Skills.tsx`: rejeitado porque mistura domínio, tradução e renderização.

## Decisão 3 — Botões semânticos e um estado ativo

**Decisão**: cada capacidade será um `button` com `aria-expanded` e `aria-controls`; um único
`activeCapabilityId` controla popover e destaques. Tecnologias serão conteúdo estático não focável.

**Motivo**: botões oferecem teclado, toque e semântica nativos. Um estado único mantém equivalência
entre entradas e impede múltiplos popovers conflitantes.

**Alternativas consideradas**:

- `div` com listeners: rejeitado por exigir recriar semântica e teclado.
- Tooltip exclusivo de hover: rejeitado por excluir toque e não sustentar conteúdo contextual.
- Tornar tecnologias interativas: rejeitado explicitamente pela spec.

## Decisão 4 — Popover contextual controlado pela seção

**Decisão**: implementar o popover no módulo de Habilidades, ancorado logicamente à capacidade
ativa e contido pelo painel. Em desktop, hover/foco apresenta conteúdo; em toque/clique, a seleção é
persistente até alternância, Escape ou ação fora do painel. Escape fecha sem mover o foco.

**Motivo**: o repositório possui Radix Tooltip, mas o conteúdo exigido é interativo por clique/toque
e precisa de estado persistente. Um controlador local simples atende o contrato sem adicionar
dependência nem forçar um dialog modal.

**Alternativas consideradas**:

- Reusar tooltip simples para todos os modos: rejeitado porque tooltips não modelam bem alternância
  persistente por toque.
- Abrir modal no celular: rejeitado por alterar a experiência e a leitura da seção sem necessidade.
- Posicionar um popover independente por item: rejeitado por multiplicar estado e risco de overflow.

## Decisão 5 — Relações explícitas, não inferidas

**Decisão**: cada uma das 18 capacidades terá de duas a quatro relações declaradas por ID, podendo
apontar para capacidades de outro grupo e tecnologias. O exemplo Segurança e Privacidade inclui
LGPD, Análise de Requisitos e Revisão e Validação; tecnologia só entra quando houver nexo real.

**Motivo**: relações explícitas são revisáveis, testáveis e impedem o efeito indiscriminado de
destacar tudo.

**Alternativas consideradas**:

- Inferir por tags em tempo de execução: rejeitado porque torna o resultado opaco e pode exceder a
  cardinalidade aprovada.
- Matriz todos-para-todos: rejeitada pela spec.

## Decisão 6 — Contraste por tokens, não por opacidade fixa

**Decisão**: definir estados visuais principal, relacionado e neutro com tokens próprios. A
atenuação visual será escolhida pela cor composta final; 35–50% é limite desejado, não obrigação
quando a composição cair abaixo de 4.5:1.

**Motivo**: aplicar `opacity` ao elemento inteiro altera texto e fundo simultaneamente e pode violar
WCAG AA. Tokens de cor preservam contraste e permitem diferenciar estados com peso, marcador e
contorno, não apenas cor.

**Alternativas consideradas**:

- `opacity: .35` universal: rejeitado por risco de contraste em ambos os temas.
- Ocultar itens não relacionados: rejeitado por perder contexto e estabilidade do layout.
- Efeito de contraste dinâmico por pixels: rejeitado por complexidade e ausência de requisito.

## Decisão 7 — Grid CSS 3/2/1 sem reordenar o DOM

**Decisão**: usar grid responsivo com três colunas no desktop, duas no tablet e uma no celular,
mantendo no DOM Engenharia → Produto → Método.

**Motivo**: cumpre reflow e leitura assistiva sem duplicação ou `order` visual divergente.

**Alternativas consideradas**:

- Carrossel horizontal no celular: rejeitado por criar rolagem horizontal e esconder conteúdo.
- Três colunas comprimidas no tablet: rejeitado por prejudicar leitura de PT/EN.
- Markup diferente por breakpoint: rejeitado por duplicação e risco de foco inconsistente.

## Decisão 8 — Superfícies e mídia preservadas

**Decisão**: Habilidades usa painel escuro nos dois temas; Sobre, Projetos e Depoimentos mantêm
fundos sólidos e Contato mantém blur. Sobre usa divisão `70%/30%`, textura procedural grip tape no
painel esquerdo e retrato decorativo otimizado no painel direito. Seus indicadores usam apresentação
unitária com embaralhamento e digitação, sem carrossel, e a seção mede ao menos `115svh`; as demais
seções mantêm altura natural.

**Motivo**: corresponde à referência aprovada, preserva o recorte transparente e mantém ambas as
mídias dentro do orçamento de carbono sem entregar diretamente os PNGs-fonte.

**Alternativas consideradas**:

- Servir o PNG original no About: rejeitado pelo custo de transferência e ausência de seleção por
  viewport/DPR.
- Servir a textura PNG original: rejeitado por custo de rede; a textura aprovada deve usar uma
  variante responsiva comprimida.
- Aplicar `100svh` a todas as seções secundárias: rejeitado; somente Sobre recebeu essa composição e
  as demais preservam altura natural para não cortar conteúdo variável.
- Reaproveitar as ilustrações discovery/build/delivery em Habilidades: rejeitado porque representam
  apenas o fluxo antigo e não as 18 capacidades.
- Copiar o PDF para o bundle: rejeitado; é referência de decisão, não ativo de produto.

## Decisão 9 — Estratégia de testes proporcional ao risco

**Decisão**: ampliar Playwright/axe para contrato da seção, entradas, foco, contraste, idiomas,
temas e matriz responsiva; atualizar o inventário visual que ainda aponta para Trajetória. Usar os
gates integrais existentes na conclusão.

**Motivo**: os riscos dependem de layout e integração real do browser. Testes E2E são adequados para
reflow, hover/foco/toque e acessibilidade, enquanto invariantes do mapa podem ser verificados no
mesmo contrato sem introduzir um runner unitário novo.

**Alternativas consideradas**:

- Validar apenas por screenshot: rejeitado por não provar semântica, foco ou cardinalidade.
- Adicionar Vitest: rejeitado porque não há necessidade proporcional para uma única estrutura
  estática e a feature proíbe dependências novas.

## Conclusão

Todas as incógnitas técnicas foram resolvidas. Não há pendência de esclarecimento, dependência
externa, alteração de API ou exceção constitucional para avançar ao detalhamento de tarefas.
