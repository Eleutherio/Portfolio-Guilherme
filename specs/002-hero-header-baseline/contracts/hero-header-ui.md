# UI Contract: Hero e Cabeçalho

## Hero

### Conteúdo

| Idioma | Título                                              | Subtítulo                                                          |
| ------ | --------------------------------------------------- | ------------------------------------------------------------------ |
| PT     | Inovação, Estratégia e Desenvolvimento de Software. | Meu trabalho é traduzir tecnologia em soluções para as pessoas.    |
| EN     | Innovation, Strategy, and Software Development.     | My work is to turn technology into solutions that work for people. |

- O conteúdo é alinhado à esquerda, usa DM Sans local e não pode cortar ou transbordar.
- Commits, café, currículo e ícones sociais não pertencem ao Hero.

### Faixa

- Preto a 55%, `backdrop-filter: blur(12px)` e sem `mix-blend-mode`/contraste dinâmico.
- Começa na borda esquerda da viewport, termina após o conteúdo e possui aresta direita reta.
- Espaçamento superior e inferior visualmente equivalentes.

### Mídia

- Estado inicial: `hero-background-poster-1200w.avif` de até 45 kB e qualidade visual aprovada em
  1440 px, `<video>` sem `src`, `preload="none"` e nenhuma resposta `Media`.
- Sem movimento reduzido, o primeiro `keydown`, `pointerover`, `pointerdown`, `touchstart` ou `wheel`
  confiável em qualquer parte do documento carrega e inicia o vídeo; hover real no Hero ou em
  qualquer área do cabeçalho é válido, e os listeners são removidos após a ativação.
- Montagem, viewport, scroll programático e eventos sintéticos não podem ativar a mídia.
- Após ativação, o vídeo atual usa `object-cover`, `muted`, `loop` e `playsInline`, sem filtro, e
  oferece um controle discreto de pausar/retomar com alvo mínimo de 44 px em toque e foco visível.
- O controle de reprodução fica no canto inferior direito do Hero, alinhado ao botão flutuante de
  acessibilidade e 8 px abaixo dele, sem sobreposição.
- Movimento reduzido permanece no poster após interações genéricas e apresenta antes da ativação
  um controle acessível “Reproduzir vídeo”; depois do acionamento, o controle de pausar/retomar permanece
  disponível.
- Fora do Hero ou com a aba oculta, a reprodução pausa.

## Cabeçalho

| Evento                            | Recolhido           | Expandido            |
| --------------------------------- | ------------------- | -------------------- |
| Estado inicial                    | permanece recolhido | n/a                  |
| Hover na marca/área útil          | expande             | permanece            |
| Foco em qualquer controle         | expande             | permanece            |
| Toque em área vazia útil          | expande             | permanece            |
| Scroll para cima                  | expande             | permanece            |
| Scroll para baixo                 | permanece           | recolhe              |
| Clique fora                       | permanece           | recolhe              |
| Escape                            | permanece           | fecha menu e recolhe |
| Saída completa de ponteiro e foco | permanece           | recolhe              |

### Persistência e destinos

- A marca e “Vamos conversar” permanecem visíveis e utilizáveis quando recolhidos.
- Tema, idioma e navegação central ficam ocultos e não focáveis quando recolhidos.
- Somente a marca navega para `/`; a área vazia não possui ação de navegação.
- O CTA não possui seta e aponta para a seção `#contato` pelo fluxo já existente.
- Switches compartilham uma única superfície sem fresta; CTA e superfícies usam preto 55% e blur de
  12 px, sem contraste dinâmico.
- CTA recolhido usa destaque `#78a5ce`.

## Contador e redes

- O link GitHub do rodapé exibe `loading`, total (incluindo zero) ou indisponibilidade.
- Produção não mostra fallback numérico.
- Contato e rodapé preservam seus destinos sociais existentes.
- Nenhum desses elementos pode reaparecer dentro de `#home`.

## Matriz mínima de aceite

| Viewport | Idioma | Tema   | Comparação visual completa |
| -------- | ------ | ------ | -------------------------- |
| 320 px   | PT     | escuro | sim                        |
| 412 px   | EN     | claro  | não                        |
| 768 px   | PT     | claro  | não                        |
| 1024 px  | EN     | escuro | não                        |
| 1440 px  | EN     | claro  | sim                        |

- Entrada: teclado, mouse e toque/coarse pointer.
- Preferências: movimento normal e reduzido.
- O poster usa o frame preto inicial do próprio vídeo em `0,0 s`, antes do aparecimento da cena do
  notebook, e não pode apresentar transição perceptível para o início do MP4 em 1440 px.
