import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

type Props = {
  paragraphs: string[];
  className: string;
  selected: boolean;
  active: boolean;
  reducedMotion: boolean;
  revealKey: string;
  onComplete: (key: string) => void;
  onMeasure: (key: string, lineCount: number) => void;
};

function measureParagraphLines(element: HTMLElement): string[][] {
  return [...element.querySelectorAll<HTMLParagraphElement>(":scope > p")].map((paragraph) => {
    const node = paragraph.firstChild;
    const text = paragraph.textContent ?? "";
    if (!node || node.nodeType !== Node.TEXT_NODE) return [text];
    const range = document.createRange();
    const result: string[] = [];
    let lineTop: number | undefined;
    let lineStart = 0;
    let lineEnd = 0;
    for (const word of text.matchAll(/\S+/gu)) {
      const start = word.index;
      const end = start + word[0].length;
      range.setStart(node, start);
      range.setEnd(node, end);
      const top = range.getBoundingClientRect().top;
      if (lineTop === undefined) {
        lineTop = top;
        lineStart = start;
      } else if (Math.abs(top - lineTop) > 1) {
        result.push(text.slice(lineStart, lineEnd));
        lineTop = top;
        lineStart = start;
      }
      lineEnd = end;
    }
    if (lineEnd > lineStart) result.push(text.slice(lineStart, lineEnd));
    return result;
  });
}

export function TestimonialQuoteText({
  paragraphs,
  className,
  selected,
  active,
  reducedMotion,
  revealKey,
  onComplete,
  onMeasure,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[][]>([]);
  const [complete, setComplete] = useState(false);
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    setComplete(false);
    setLines([]);
    if (!selected || reducedMotion) {
      if (selected) onCompleteRef.current(revealKey);
      return;
    }
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      const next = measureParagraphLines(element);
      onMeasure(
        revealKey,
        next.reduce((total, paragraph) => total + paragraph.length, 0),
      );
      setLines((previous) => (JSON.stringify(previous) === JSON.stringify(next) ? previous : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    void document.fonts.ready.then(measure);
    return () => {
      disposed = true;
      observer.disconnect();
    };
  }, [selected, reducedMotion, revealKey, onMeasure]);

  const lineCount = lines.reduce((total, paragraph) => total + paragraph.length, 0);
  const visual = selected && !reducedMotion && lineCount > 0;
  let lineIndex = 0;
  return (
    <div
      ref={ref}
      className={`${className} testimonial-line-reveal fade-by-line${visual ? " visivel" : ""}`}
      data-line-reveal={
        !selected
          ? "inactive"
          : reducedMotion
            ? "static"
            : complete
              ? "complete"
              : active
                ? "running"
                : "paused"
      }
      data-line-count={lineCount}
      data-line-active={active ? "true" : "false"}
      data-has-lines={visual ? "true" : "false"}
    >
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="testimonial-line-source">
          {paragraph}
        </p>
      ))}
      {visual && (
        <div aria-hidden="true" className="testimonial-line-overlay">
          {lines.map((paragraph, paragraphIndex) => (
            <p key={paragraphIndex}>
              {paragraph.map((line) => {
                const index = lineIndex++;
                return (
                  <span
                    key={`${index}-${line}`}
                    className="linha"
                    style={{ "--i": index } as CSSProperties}
                    onAnimationEnd={(event) => {
                      if (event.animationName !== "fadeIn" || index !== lineCount - 1 || !selected)
                        return;
                      setComplete(true);
                      onCompleteRef.current(revealKey);
                    }}
                  >
                    {line}
                  </span>
                );
              })}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
