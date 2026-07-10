# MIV — Manual de Identidade Visual

Documento único da identidade visual do projeto. Toda regra de cor, fonte,
raio, sombra e utilitário aqui descrita tem exatamente **uma fonte da
verdade**: `src/styles.css`. Componentes consomem tokens semânticos — nunca
valores literais.

---

## 1. Como trocar a identidade visual em 5 minutos

Todo o MIV vive em `src/styles.css` no bloco marcado como **MIV — TOKENS DE
MARCA**. Para trocar de identidade:

1. Abra `src/styles.css`.
2. No bloco `@theme inline` (linhas ~26–61): altere fontes (`--font-*`) e
   raios (`--radius-*`) se quiser.
3. No bloco `:root, .light` (paleta clara) e `.dark` (paleta escura):
   - Troque os valores das cores (`--background`, `--surface`, `--foreground`,
     `--muted`, `--muted-foreground`, `--border`, `--hairline`, `--accent`,
     `--accent-2`, `--accent-soft`, `--accent-foreground`, `--ring`).
   - Troque os gradientes (`--gradient-brand`, `--gradient-brand-soft`).
   - Ajuste sombras (`--shadow-card`, `--shadow-card-hover`) se necessário.
4. Se trocar de fonte: atualize os `@import "@fontsource-variable/..."` no
   topo de `src/styles.css` e as strings de `--font-display`/`--font-sans`
   dentro de `@theme inline`. Nada mais.
5. Recarregue o preview. Nenhum componente precisa ser editado.

> **Regra de ouro:** se você abriu um `.tsx` para trocar cor ou fonte, parou
> na camada errada. Volte para `src/styles.css`.

---

## 2. Tipografia

| Token            | Família                             | Uso                                     |
| ---------------- | ----------------------------------- | --------------------------------------- |
| `--font-display` | Space Grotesk Variable              | Títulos (`h1`–`h6`), botões             |
| `--font-sans`    | Inter Variable (fallback DM Sans)   | Corpo de texto, UI geral                |
| `--font-mono`    | System monospace (SF Mono, Menlo)   | Timecodes, metadados, chips             |

**Pesos em uso**

- `400` — corpo de texto
- `500` — botões, labels, títulos de card
- `600` — títulos de seção (`h1`–`h6`, aplicado via `@layer base`)

**Escala tipográfica (Tailwind)**

| Papel                     | Classes                                          |
| ------------------------- | ------------------------------------------------ |
| Heading de seção          | `text-2xl md:text-3xl lg:text-4xl`               |
| Heading de card           | `text-lg md:text-xl`                             |
| Lead / parágrafo          | `text-base leading-relaxed`                      |
| Meta / mono (kicker, chip)| `text-[11px] uppercase tracking-[0.25em]`        |

**Regras**

- `letter-spacing: -0.025em` em todos os headings (via `@layer base`).
- `font-feature-settings: "ss01", "cv11"` no `body`.
- Números tabulares (`tabular-nums`) em stats e timestamps.
- **Nunca** hardcodar `font-family` em componente — use as classes
  `font-display`, `font-sans`, `font-mono`.

---

## 3. Paleta — Paper & Steel

Dois temas: `light` (padrão) e `dark`. Ambos definidos em `src/styles.css`.
Todos os valores em OKLCH para preservar contraste perceptual em qualquer
transformação de matiz.

| Token                    | Uso                                                     |
| ------------------------ | ------------------------------------------------------- |
| `--background`           | Fundo global da página                                  |
| `--surface`              | Cartões, painéis, superfícies elevadas                  |
| `--surface-2`            | Inner-cards, superfícies dentro de cartões              |
| `--foreground`           | Texto principal                                         |
| `--muted`                | Fundo de campos discretos                               |
| `--muted-foreground`     | Texto secundário, metadados                             |
| `--border`               | Bordas de controles (input, botão)                      |
| `--hairline`             | Divisórias 1px, bordas de card                          |
| `--accent`               | Cor primária de marca (azul brand)                      |
| `--accent-2`             | Segunda cor do gradiente de marca (violeta)             |
| `--accent-soft`          | Fundo suave de destaque (pills, ilustrações)            |
| `--accent-foreground`    | Texto/ícone sobre superfícies em `--accent`             |
| `--ring`                 | Focus ring (a11y)                                       |

**Contraste**

- Texto principal → sempre sobre `--background` ou `--surface`.
- Texto/ícone sobre `--accent` → sempre `--accent-foreground`.

**Classes Tailwind derivadas** (geradas automaticamente a partir dos tokens)

`bg-background`, `bg-surface`, `bg-surface-2`, `bg-muted`, `bg-accent`,
`text-foreground`, `text-muted-foreground`, `text-accent`,
`text-accent-foreground`, `border-hairline`, `border-border`, `ring-ring`, etc.

---

## 4. Gradientes

| Token                     | Definição                                         | Uso                                          |
| ------------------------- | ------------------------------------------------- | -------------------------------------------- |
| `--gradient-brand`        | `linear-gradient(135deg, accent, accent-2)`       | `.text-gradient`, `.btn-primary`, filetes    |
| `--gradient-brand-soft`   | Mesmo gradiente com alfa 0.10–0.14                | Halos decorativos, backgrounds translúcidos  |

**Não use** gradiente de marca em fundos de seção grandes — ele é reservado
para acentos pontuais (botão primário, texto de destaque, filete no topo de
cartão via `card-surface--accent`).

---

## 5. Sombras & elevação

| Token                  | Uso                                     |
| ---------------------- | --------------------------------------- |
| `--shadow-card`        | Repouso de qualquer `card-surface`      |
| `--shadow-card-hover`  | Hover / interação em `card-surface`     |

Sombras de botão são derivadas via `color-mix(... var(--color-accent))` — não
existem valores literais de cor em sombras dentro dos utilitários.

---

## 6. Raios

| Token          | Valor | Uso                                   |
| -------------- | ----- | ------------------------------------- |
| `--radius-sm`  | 4px   | Chips inline, badges                  |
| `--radius-md`  | 8px   | Botões, inputs                        |
| `--radius-lg`  | 12px  | Cartões                               |
| `--radius-xl`  | 16px  | Superfícies grandes                   |

---

## 7. Superfícies & bordas

- `bg-surface` — todo cartão.
- `bg-surface-2` — cartão dentro de cartão.
- `border-hairline` — divisória 1px (padrão do site).
- `border-border` — borda de controle (input, botão outline).

---

## 8. Utilitários canônicos

Definidos em `src/styles.css` na seção **UTILITÁRIOS DERIVADOS**. Componentes
novos **compõem** esses utilitários; não redefinem estilo próprio.

| Utilitário                | Papel                                                |
| ------------------------- | ---------------------------------------------------- |
| `section-container`       | Larguras padrão (`min(100% - 2rem, 1080px)`)         |
| `section-number`          | Timecode monoespaçado (`00:03`)                      |
| `prose-measure`           | Largura confortável de leitura (~640px)              |
| `hairline-draw`           | Divisória animada entre seções                       |
| `link-ink`                | Link com sublinhado tipo "tinta"                     |
| `card-surface`            | Cartão base (borda hairline + sombra + hover)        |
| `card-surface--accent`    | Cartão com filete gradiente no topo                  |
| `chip`                    | Chip mono uppercase para stack tokens                |
| `text-gradient`           | Texto em gradiente de marca                          |
| `btn-primary`             | Botão sólido em gradiente de marca                   |
| `btn-outline`             | Botão outline em `--border`                          |

---

## 9. Motion

- Curva padrão: `cubic-bezier(0.2, 0.8, 0.2, 1)`.
- Durações: 0.25s (micro), 0.35s (hover/estado), 0.5–0.6s (entrada de seção),
  1.1s (draw de divisórias).
- Respeitar `prefers-reduced-motion` — regra global em `src/styles.css`
  reduz qualquer animação para 0.01ms.

---

## 10. Regras de conformidade (checklist de revisão)

Não faça em componentes (`.tsx`, `.jsx`, CSS de componente):

- ❌ `text-white`, `text-black`, `bg-white`, `bg-black`
- ❌ `bg-[#...]`, `text-[#...]`, `border-[#...]`
- ❌ Hex, `rgb()`, `hsl()`, `oklch()` literais
- ❌ `linear-gradient(...)` inline com cores literais
- ❌ `font-family: "..."` fora de `@theme inline`

Faça sempre:

- ✅ `bg-surface`, `bg-background`, `bg-accent`
- ✅ `text-foreground`, `text-muted-foreground`, `text-accent`
- ✅ `border-hairline`, `border-border`
- ✅ `backgroundImage: "var(--gradient-brand)"` quando precisar de gradiente
- ✅ Classes `font-display` / `font-sans` / `font-mono`

Ícones lucide seguem a mesma regra: `text-accent`, `text-muted-foreground`
ou `text-foreground` — nunca `text-white`/`text-black`.

**Exceções permitidas** (documentadas no código):

- Bandeiras nacionais em `LanguageToggle.tsx` (cores oficiais).
- Meta tag `theme-color` no `<head>` (não é CSS de componente).

---

## 11. Fluxo para criar uma nova identidade visual

1. Faça um branch: `feat/miv-<nome-da-identidade>`.
2. Em `src/styles.css`, dentro do bloco **MIV — TOKENS DE MARCA**:
   - Substitua os valores em `:root, .light` e `.dark`.
   - Se quiser trocar as fontes: troque os `@import` no topo do arquivo e
     as strings de `--font-display`/`--font-sans` no `@theme inline`.
3. Rode o preview e verifique:
   - Contraste texto/fundo (foreground sobre background e sobre surface).
   - Contraste texto sobre accent (foreground-on-accent).
   - Botão primário legível (`btn-primary`).
   - Focus ring visível (`ring-ring`) sobre todas as superfícies.
4. Não abra nenhum `.tsx`. Se precisar, o MIV atual está incompleto — abra
   uma issue antes de fazer o override em componente.

---

## Referência rápida — Onde está o quê

| Você quer trocar…                | Vá para                                          |
| -------------------------------- | ------------------------------------------------ |
| Cor primária de marca            | `--accent` (e `--accent-2` para gradiente)       |
| Fundo do site                    | `--background`                                   |
| Fonte dos títulos                | `--font-display` + `@import` no topo             |
| Fonte do corpo                   | `--font-sans` + `@import` no topo                |
| Raio dos cartões                 | `--radius-lg`                                    |
| Sombra dos cartões               | `--shadow-card`, `--shadow-card-hover`           |
| Cor do footer                    | `--footer-bg`, `--footer-foreground`             |
| Realce da sintaxe do terminal    | `--code-syntax-1`, `--code-syntax-2`             |
