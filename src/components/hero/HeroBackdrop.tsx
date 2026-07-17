import { useLiveMetrics } from "@/lib/useLiveMetrics";

// Static ambient snippet — replaces the previous `?raw` import of the Hero
// source, which shipped the full file as a string to the client.
import { heroCodeSnippet as heroSource } from "@/content/hero-code-snippet";

/**
 * Static ambient code panel + dotted grid. No mouse spotlight, no masking.
 * The Hero text content sits on the right side of the layout.
 */

function highlight(line: string, key: number) {
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
            ? "text-[var(--code-syntax-1)]"
            : p.c === "str"
              ? "text-[var(--code-syntax-2)]"
              : p.c === "com"
                ? "text-[color:var(--code-comment)] italic"
                : p.c === "punc"
                  ? "text-muted-foreground"
                  : "text-foreground/80";
        return (
          <span key={i} className={cls}>
            {p.t}
          </span>
        );
      })}
    </span>
  );
}

function SourcePanel() {
  const lines = heroSource.split("\n");

  return (
    <div
      className="pointer-events-none absolute inset-y-0 right-0 hidden overflow-hidden md:block md:w-[46%] lg:w-[48%]"
      style={{
        maskImage: "linear-gradient(to left, black 0%, black 94%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to left, black 0%, black 94%, transparent 100%)",
        opacity: 0.75,
      }}
    >
      <div className="absolute inset-0 overflow-hidden px-6 py-14 font-mono text-[10.5px] leading-[1.55] lg:px-8 lg:text-[11.5px]">
        <div className="grid grid-cols-[2.4rem_minmax(0,1fr)] gap-x-3">
          <div className="select-none text-right text-muted-foreground/55 tabular-nums">
            {lines.map((_, i) => (
              <div key={i}>{String(i + 1).padStart(2, "0")}</div>
            ))}
          </div>
          <pre className="min-w-0 overflow-hidden whitespace-pre">
            {lines.map((l, i) => (
              <div key={i}>{l.length === 0 ? "\u00A0" : highlight(l, i)}</div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function BenchmarksPanel() {
  const { metrics, status } = useLiveMetrics();
  return (
    <div className="space-y-8 font-mono text-[11px] leading-[1.9] text-muted-foreground md:text-[12px]">
      <div>
        <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70">
          <span>web vitals</span>
          <span className="inline-flex items-center gap-1.5 text-accent">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
            live
          </span>
        </div>
        <div className="space-y-1.5">
          {metrics.map((m) => (
            <div key={m.k} className="grid grid-cols-[2.4rem_4.5rem_1fr_3rem] items-center gap-3">
              <span className="text-foreground/75">{m.k}</span>
              <span className="tabular-nums text-foreground/85">{m.v}</span>
              <span className="relative h-px w-full bg-hairline">
                <span
                  className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-700 ease-out"
                  style={{ width: `${m.pct}%` }}
                />
              </span>
              <span
                className={`text-right text-[10px] uppercase tracking-[0.2em] ${
                  m.tag === "good"
                    ? "text-accent"
                    : m.tag === "fair"
                      ? "text-foreground/70"
                      : m.tag === "poor"
                        ? "text-foreground/60"
                        : "text-muted-foreground/60"
                }`}
              >
                {m.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 text-[10px] uppercase tracking-[0.35em] text-muted-foreground/70">
          heartbeat
        </div>
        <dl className="space-y-1">
          {[
            { k: "status", v: status.status, dot: true },
            { k: "ping", v: status.ping },
            { k: "uptime", v: status.uptime },
            { k: "fps", v: status.fps },
          ].map((row) => (
            <div key={row.k} className="grid grid-cols-[6rem_1fr] gap-3">
              <dt className="text-muted-foreground/70">{row.k}</dt>
              <dd className="flex items-center gap-2 tabular-nums text-foreground/80">
                {row.dot && (
                  <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                )}
                {row.v}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.45]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "var(--color-hairline)",
          maskImage: "radial-gradient(ellipse 80% 65% at 50% 45%, black 35%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 65% at 50% 45%, black 35%, transparent 75%)",
        }}
      />
      <SourcePanel />
    </div>
  );
}
