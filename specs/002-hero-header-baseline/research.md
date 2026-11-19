# Research: Baseline do Hero e Cabeçalho

## Decisão 1 — Planejar sobre a implementação existente

**Decision**: tratar o working tree atual como baseline, preservando a composição visual e alterando
somente lacunas comprovadas contra `spec.md`.

**Rationale**: copy, faixa, DM Sans, estado inicial recolhido, superfícies estáticas, switches e CTA
já estão implementados. Reconstruir esses elementos aumentaria regressões e violaria a preservação de
escopo.

**Alternatives considered**: reescrever Hero/Header a partir da spec; restaurar expectativas dos
testes antigos. Ambas foram rejeitadas porque os testes contêm contratos superados e a maior parte do
produto atual já representa a decisão final.

## Decisão 2 — Vídeo após a primeira interação confiável

**Decision**: manter o `<video>` decorativo sem `src`, com `preload="none"` e o poster
`hero-background-poster-1200w.avif`, derivado deterministicamente do frame preto inicial do próprio
vídeo em `0,0 s`, antes do aparecimento da cena do notebook, limitado a 45 kB e aprovado visualmente
em 1440 px. Sem movimento reduzido, o primeiro `keydown`, `pointerover`, `pointerdown`,
`touchstart` ou `wheel` confiável em qualquer parte do documento atribui o MP4 e inicia sua
reprodução automaticamente. Hover real no Hero ou em qualquer área do cabeçalho é válido. Um
controle discreto de pausar/retomar fica disponível depois da ativação.

**Rationale**: o arquivo atual tem 169.200.241 bytes. `src` imediato, `autoPlay` e `preload="auto"`
violam FR-004 e o gate que rejeita qualquer resposta `Media` sem intenção. Eventos confiáveis de
entrada são testáveis, não exigem um clique dedicado no vídeo e permitem distinguir atividade humana
de montagem, viewport, rolagem programática e eventos sintéticos. A inclusão posterior de hover
prioriza o início fluido em desktop, aceitando que a transferência pesada possa começar com a mera
entrada intencional do ponteiro na página.

**Alternatives considered**:

- exigir clique dedicado para ativar o vídeo: rejeitado pela decisão de iniciar após qualquer gesto
  real do usuário;
- iniciar por entrada no viewport: rejeitado por não demonstrar atividade humana; hover real foi
  posteriormente aceito como input confiável complementar, sem substituir toque ou teclado;
- remover ou recomprimir o vídeo: rejeitado porque mudaria o asset/qualidade fora do escopo;
- autoplay sob conexão rápida: rejeitado por contrariar o gate constitucional.

## Decisão 3 — Movimento reduzido e atividade do documento

**Decision**: usar a preferência já exposta por `use-prefers-reduced-motion.ts` para manter o estado
estático após interações genéricas. Somente o controle acessível “Reproduzir vídeo”, disponível antes
da ativação, pode iniciar nesse modo. Depois de iniciado, manter pausar/retomar disponível e pausar
quando o Hero estiver fora de atividade ou a aba estiver oculta.

**Rationale**: a preferência não deve ser anulada por uma interação sem relação com mídia, e vídeo
invisível não deve consumir recursos. O controle específico preserva autonomia e WCAG 2.2 AA.

**Alternatives considered**: nunca permitir vídeo em reduced motion; manter reprodução fora do
viewport. A primeira remove controle do usuário, e a segunda desperdiça energia.

## Decisão 4 — Manter a máquina atual do cabeçalho e fechar duas lacunas

**Decision**: conservar a coordenação atual entre `header` e ações fixed, acrescentando recolhimento
por Escape em todos os breakpoints e por saída completa de foco.

**Rationale**: scroll, hover, toque, clique externo, menu móvel, marca e CTA já funcionam na mesma
árvore semântica. As lacunas comprovadas são específicas: Escape só age quando `open=true`, e foco
expande sem uma transição equivalente ao deixar ambos os grupos.

**Alternatives considered**: fundir os dois elementos fixed ou adotar uma máquina de estados externa.
Rejeitado por ampliar o escopo e arriscar posicionamento/semântica já válidos.

## Decisão 5 — Contador de commits no rodapé

**Decision**: substituir o link GitHub simples da coluna “Conexões” pelo contador reutilizável, sem
alterar os demais atalhos sociais.

**Rationale**: o rodapé já contém o destino GitHub, é carregado fora do Hero e evita uma terceira
ocorrência das redes. A lógica existente já diferencia loading, zero, sucesso e indisponibilidade;
fallback numérico só existe em DEV.

**Alternatives considered**: Contato, cabeçalho ou retorno ao Hero. Contato já possui links de contato
sem métricas; cabeçalho deve permanecer leve; o Hero é expressamente proibido pela spec.

## Decisão 6 — Testes específicos e remoção de expectativas superadas

**Decision**: criar uma suíte focal `hero-header.spec.ts`, reutilizar helpers responsivos e atualizar
testes antigos em vez de alterar o produto para fazê-los passar.

**Rationale**: a infraestrutura Playwright já cobre axe, teclado, toque e inventário de viewports,
mas faltam provas da faixa, copy, estados do header e mídia. Há expectativas explícitas por Sora,
conteúdo antigo do Hero, commits no Hero e Header inicialmente expandido.

**Alternatives considered**: somente snapshots; duplicar toda a matriz PT/EN × tema × viewport em
cada cenário. Snapshots isolados não provam interação, e a matriz completa seria lenta e redundante.

## Decisão 7 — Nenhuma dependência nova

**Decision**: usar React, APIs nativas de mídia/visibilidade, hooks existentes, Tailwind e Playwright.

**Rationale**: o problema é pequeno, já possui infraestrutura e não justifica biblioteca de player,
máquina de estados ou detecção de contraste.

**Alternatives considered**: player de vídeo de terceiros ou biblioteca de state machine. Rejeitados
por peso, superfície de manutenção e ausência de benefício necessário.
