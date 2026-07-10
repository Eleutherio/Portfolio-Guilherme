import { Fragment } from "react";
import { useHeroCarousel } from "@/components/hero/HeroCarouselContext";

// Snippet reflete a estrutura real de src/components/sections/Hero.tsx
// com dois slots dinâmicos ligados ao subtítulo ao vivo.
const TEMPLATE = `// src/components/sections/Hero.tsx
import { motion, useReducedMotion } from "motion/react";
import { useApp } from "@/i18n/AppContext";

export function Hero() {
  const { t } = useApp();
  const reduced = useReducedMotion();

  const kind   = "{{word1}}";
  const pillar = "{{word2}}";

  return (
    <section id="home" className="relative isolate">
      <h1>{t.hero.headline}</h1>
      <p className="text-muted-foreground">
        O seu <em>{kind}</em>{" "}
        construído com <em>{pillar}</em>.
      </p>
      <a href="#projetos" className="btn-primary">
        {t.hero.cta1} ↓
      </a>
    </section>
  );
}`;

function highlightStatic(line: string, key: string | number) {
  const out: Array<{ t: string; c?: string }> = [];
  const commentIdx = line.indexOf("//");
  const codePart = commentIdx >= 0 ? line.slice(0, commentIdx) : line;
  const commentPart = commentIdx >= 0 ? line.slice(commentIdx) : "";

  const tokenRegex =
    /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|var|function|return|if|else|for|while|import|from|export|default|new|class|extends|true|false|null|undefined|async|await|type|interface)\b|[{}()[\];,.<>=+\-*/!?:&|])/g;

  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = tokenRegex.exec(codePart)) !== null) {
    if (m.index > last) out.push({ t: codePart.slice(last, m.index) });
    const tok = m[0];
    if (tok.startsWith('"') || tok.startsWith("'") || tok.startsWith("`"))
      out.push({ t: tok, c: "str" });
    else if (/^[a-z]/.test(tok)) out.push({ t: tok, c: "kw" });
    else out.push({ t: tok, c: "punc" });
    last = m.index + tok.length;
  }
  if (last < codePart.length) out.push({ t: codePart.slice(last) });
  if (commentPart) out.push({ t: commentPart, c: "com" });

  return (
    <span key={key}>
      {out.map((p, i) => {
        const cls =
          p.c === "kw"
            ? "text-[var(--code-syntax-1)] font-medium"
            : p.c === "str"
            ? "text-[var(--code-syntax-2)]"
            : p.c === "com"
            ? "text-[color:var(--code-comment)] italic"
            : p.c === "punc"
            ? "text-muted-foreground"
            : "text-foreground";
        return (
          <span key={i} className={cls}>
            {p.t}
          </span>
        );
      })}
    </span>
  );
}

function DynamicString({ value, showCaret }: { value: string; showCaret: boolean }) {
  return (
    <span>
      <span className="text-[var(--code-syntax-2)]">{`"${value}`}</span>
      {showCaret && <span className="tw-caret" aria-hidden="true">_</span>}
      <span className="text-[var(--code-syntax-2)]">{`"`}</span>
    </span>
  );
}

function renderLine(line: string, key: number, word1: string, word2: string, prefersReduced: boolean) {
  const slotRe = /\{\{word1\}\}|\{\{word2\}\}/g;
  if (!slotRe.test(line)) {
    return <div key={key}>{line.length === 0 ? "\u00A0" : highlightStatic(line, key)}</div>;
  }
  slotRe.lastIndex = 0;

  const parts: Array<React.ReactNode> = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let partIdx = 0;
  while ((m = slotRe.exec(line)) !== null) {
    // static prefix up to and INCLUDING the leading quote before the slot
    // The template uses "{{word1}}" — the surrounding quotes belong to the string literal;
    // we replace the entire `"{{word1}}"` region for correct highlighting.
    // Find the opening quote just before the match:
    const beforeSlot = line.slice(last, m.index);
    const quoteRel = beforeSlot.lastIndexOf('"');
    if (quoteRel === -1) {
      // no quote — just append prefix as static then value plain
      if (beforeSlot.length > 0) parts.push(highlightStatic(beforeSlot, `s${partIdx++}`));
      const value = m[0] === "{{word1}}" ? word1 : word2;
      parts.push(<span key={`v${partIdx++}`} className="text-[var(--code-syntax-2)]">{value}</span>);
    } else {
      const prefix = beforeSlot.slice(0, quoteRel);
      if (prefix.length > 0) parts.push(highlightStatic(prefix, `s${partIdx++}`));
      // consume the closing quote right after {{wordN}}
      const afterStart = m.index + m[0].length;
      const closingQuoteIdx = line.indexOf('"', afterStart);
      const value = m[0] === "{{word1}}" ? word1 : word2;
      parts.push(
        <DynamicString
          key={`v${partIdx++}`}
          value={value}
          showCaret={!prefersReduced}
        />,
      );
      last = closingQuoteIdx >= 0 ? closingQuoteIdx + 1 : afterStart;
      continue;
    }
    last = m.index + m[0].length;
  }
  if (last < line.length) parts.push(highlightStatic(line.slice(last), `s${partIdx++}`));

  return (
    <div key={key}>
      {parts.map((p, i) => (
        <Fragment key={i}>{p}</Fragment>
      ))}
    </div>
  );
}

export function TerminalCard() {
  const { word1, word2, prefersReduced } = useHeroCarousel();
  const lines = TEMPLATE.split("\n");

  return (
    <div className="font-mono text-[11.5px] leading-[1.65] md:text-[12.5px]">
      <div className="grid grid-cols-[2.2rem_minmax(0,1fr)] gap-x-3">
        <div className="select-none text-right text-muted-foreground/60 tabular-nums">
          {lines.map((_, i) => (
            <div key={i}>{String(i + 1).padStart(2, "0")}</div>
          ))}
        </div>
        <pre className="min-w-0 overflow-hidden whitespace-pre">
          {lines.map((l, i) => renderLine(l, i, word1, word2, prefersReduced))}
        </pre>
      </div>
    </div>
  );
}
