# Data Model: Baseline do Hero e Cabeçalho

Esta feature não cria banco, tabela ou persistência. O modelo descreve apenas estados de interface e
os contratos remotos já existentes.

## HeroMediaState

| Campo             | Valores                                                 | Regra                                                                            |
| ----------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `intent`          | `none`, `trusted-input`, `media-opt-in`                 | `trusted-input` vem do primeiro input real; reduced motion exige `media-opt-in`. |
| `status`          | `static`, `loading`, `playing`, `paused`, `unavailable` | `static` não possui `src` nem request de mídia.                                  |
| `reducedMotion`   | boolean                                                 | Vem da media query; impede qualquer início não solicitado.                       |
| `heroActive`      | boolean                                                 | Fora de atividade, um vídeo iniciado deve pausar.                                |
| `documentVisible` | boolean                                                 | Aba oculta não pode manter reprodução.                                           |

### Transições

```text
static --primeiro input confiável e movimento normal--> loading --canplay/play resolvido--> playing
static --controle “Reproduzir vídeo” em movimento reduzido--> loading
loading --erro/play rejeitado--> unavailable
playing --pausar/hero inativo/aba oculta--> paused
paused --retomar e visível--> playing
unavailable --nova interação permitida--> loading
```

### Invariantes

- `intent=none` implica ausência de `src` e de request `Media`.
- Apenas eventos `isTrusted` de teclado, `pointerover`, pointer/toque ou wheel geram `trusted-input`;
  hover real no Hero ou no cabeçalho é uma transição válida.
- Nenhuma transição depende apenas de montagem, viewport, scroll programático ou evento sintético.
- Com movimento reduzido, `trusted-input` não carrega nem reproduz; somente o acionamento acessível
  de “Reproduzir vídeo” gera `media-opt-in` e permite a carga.
- O MP4 permanece decorativo (`aria-hidden`) e sem conteúdo essencial.
- Poster e vídeo ocupam a mesma caixa; mudar o estado não altera o layout.

## HeaderInteractionState

| Campo                    | Valores                                | Regra                                               |
| ------------------------ | -------------------------------------- | --------------------------------------------------- |
| `visibility`             | `collapsed`, `expanded`                | Inicia em `collapsed`.                              |
| `mobileMenu`             | `closed`, `open`                       | `open` implica `expanded`.                          |
| `activeSection`          | `home`, `sobre`, `projetos`, `contato` | Continua derivado por interseção.                   |
| `focusWithinComposite`   | boolean                                | Considera Header e grupo de ações como um composto. |
| `pointerWithinComposite` | boolean                                | Considera a área útil e as ações persistentes.      |

### Transições relevantes

```text
collapsed --hover/foco/toque na área útil/scroll para cima--> expanded
expanded --saída completa de hover e foco--> collapsed
expanded --clique externo/scroll para baixo/Escape--> collapsed
closed --botão de menu--> open
open --Escape/seleção/clique externo/breakpoint desktop--> closed
```

### Invariantes

- Marca e CTA permanecem utilizáveis nos dois estados.
- Switches e navegação ficam indisponíveis quando recolhidos.
- Somente a marca navega para Home; a área útil vazia nunca navega.
- A transição de foco não move foco programaticamente, exceto Escape no menu móvel, que retorna ao
  botão já previsto.

## GithubCommitState

| Estado        | Dados                     | Apresentação                          |
| ------------- | ------------------------- | ------------------------------------- |
| `loading`     | nenhum                    | label localizada de carregamento      |
| `ready`       | `total >= 0`, `source=api | fallback`                             | total localizado; zero é válido |
| `unavailable` | nenhum                    | label localizada de indisponibilidade |

### Invariantes

- `source=fallback` só pode existir em DEV ou teste.
- Produção nunca inventa contagem.
- O estado é exibido no rodapé e não no Hero.
- O destino continua `https://github.com/Eleutherio` com abertura externa segura.
