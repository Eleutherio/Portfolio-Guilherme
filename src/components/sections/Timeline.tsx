import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Award,
  Calendar,
  Code2,
  GraduationCap,
  Heart,
  Key,
  LifeBuoy,
  Rocket,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

import { useApp } from "@/i18n/AppContext";
import { projectSummaries } from "@/content/project-summaries";

const DRAG_THRESHOLD = 60;

// Ícones por índice do item — a ordem casa com dictionary.pt/en.timeline.items
const ITEM_ICONS: LucideIcon[] = [
  Code2, // ONE / primeiro contato
  Heart, // ADEVIC / voluntariado
  GraduationCap, // Graduação ADS
  LifeBuoy, // Residência TIC55 — nivelamento
  Rocket, // GrenGame
  Key, // Abriu Chaveiro
];

// Tags técnicas por índice — não vão para i18n porque são nomes técnicos
const ITEM_TAGS: string[][] = [
  ["Lógica", "POO", "Java", "Git"],
  ["HTML", "CSS", "A11y", "UX"],
  ["Python", "JavaScript", "SQL", "Git", "POO"],
  ["Suporte", "Troubleshooting", "Docs"],
  ["React", "Django", "DRF", "PostgreSQL", "PWA"],
  ["TanStack Start", "TypeScript", "SEO", "Brevo"],
];

function parseStartYear(period: string): number | null {
  const m = period.match(/\d{4}/);
  return m ? Number(m[0]) : null;
}

function isAward(type: string): boolean {
  return /graduaç|programa|certifica|residência|residencia|nivelamento|degree|program|certification|residency|leveling/i.test(
    type,
  );
}

export function Timeline() {
  const { t } = useApp();
  const items = t.timeline.items;
  const reduced = useReducedMotion();

  const [active, setActive] = useState(items.length > 2 ? 2 : 0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [hydrated, setHydrated] = useState(false);
  const trackRef = useRef<HTMLOListElement>(null);
  const previousLabel = t.a11y.timelinePrevious;
  const nextLabel = t.a11y.timelineNext;

  useEffect(() => setHydrated(true), []);

  const stats = useMemo(() => {
    const years = items.map((i) => parseStartYear(i.period)).filter((n): n is number => n != null);
    const startYear = years.length ? Math.min(...years) : new Date().getFullYear();
    const endYear = new Date().getFullYear();
    return {
      years: Math.max(1, endYear - startYear),
      projects: projectSummaries.length,
      awards: items.filter((i) => isAward(i.type)).length,
      rangeLabel: `${startYear} → ${Math.max(endYear, ...years)}`,
    };
  }, [items]);

  const go = useCallback(
    (next: number, dir: 1 | -1) => {
      const clamped = Math.max(0, Math.min(items.length - 1, next));
      setDirection(dir);
      setActive(clamped);
    },
    [items.length],
  );

  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const track = trackRef.current;
    const tab = document.getElementById(`timeline-tab-${active}`);
    const item = tab?.parentElement;
    if (!track || !item) return;

    const left = item.offsetLeft - (track.clientWidth - item.clientWidth) / 2;
    track.scrollTo({ left: Math.max(0, left), behavior: reduced ? "auto" : "smooth" });
  }, [active, reduced]);

  const focusTab = (next: number) => {
    window.requestAnimationFrame(() => {
      document.getElementById(`timeline-tab-${next}`)?.focus();
    });
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      const next = Math.min(items.length - 1, active + 1);
      go(next, 1);
      focusTab(next);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      const next = Math.max(0, active - 1);
      go(next, -1);
      focusTab(next);
    } else if (e.key === "Home") {
      e.preventDefault();
      go(0, -1);
      focusTab(0);
    } else if (e.key === "End") {
      e.preventDefault();
      const next = items.length - 1;
      go(next, 1);
      focusTab(next);
    }
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -DRAG_THRESHOLD) go(active + 1, 1);
    else if (info.offset.x > DRAG_THRESHOLD) go(active - 1, -1);
  };

  const current = items[active];
  const currentTags = ITEM_TAGS[active] ?? [];
  const isCurrent = /presente|present/i.test(current.period);
  const badgeLabel = isCurrent ? t.timeline.currentLabel : current.type.split("·")[0].trim();

  return (
    <section
      id="trajetoria"
      aria-labelledby="trajetoria-heading"
      className="relative"
      data-timeline-hydrated={hydrated}
    >
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
        style={{ transformOrigin: "left" }}
        className="relative h-px w-full bg-hairline"
        aria-hidden="true"
      />

      <div className="section-container relative py-14 md:py-24">
        {/* Header centralizado — padrão MIV */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto mb-10 max-w-3xl text-center md:mb-14"
        >
          <p className="section-number font-mono text-[11px] uppercase tracking-[0.3em] text-accent">
            00:02<span className="text-muted-foreground"> · {t.timeline.subtitle}</span>
          </p>
          <h2
            id="trajetoria-heading"
            tabIndex={-1}
            className="mt-3 font-display text-2xl font-medium leading-[1.05] tracking-[-0.035em] text-foreground outline-none md:text-3xl lg:text-4xl"
          >
            {t.timeline.title}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t.timeline.lead}</p>
        </motion.header>

        {/* Trilho horizontal */}
        <div className="relative mt-10 md:mt-14">
          <div className="relative flex items-center gap-3 md:gap-4">
            {/* seta esquerda */}
            <button
              type="button"
              onClick={() => {
                go(active - 1, -1);
              }}
              disabled={active === 0}
              aria-label={previousLabel}
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-hairline bg-surface text-muted-foreground shadow-sm transition-colors hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 md:grid"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>

            {/* trilho */}
            <div className="relative min-w-0 flex-1">
              <span
                aria-hidden="true"
                className="absolute left-0 right-0 top-6 h-px bg-hairline md:top-7"
              />
              <span
                aria-hidden="true"
                className="absolute left-0 top-6 h-px bg-accent transition-[width] duration-500 ease-out md:top-7"
                style={{
                  width: items.length > 1 ? `${(active / (items.length - 1)) * 100}%` : "0%",
                }}
              />

              <ol
                ref={trackRef}
                role="tablist"
                aria-label={t.timeline.title}
                onKeyDown={onKeyDown}
                className="relative z-10 flex items-start justify-between gap-2 overflow-x-auto scroll-smooth outline-none [scrollbar-width:none] focus-visible:ring-2 focus-visible:ring-accent/60 md:overflow-visible [&::-webkit-scrollbar]:hidden"
              >
                {items.map((item, i) => {
                  const Icon = ITEM_ICONS[i] ?? Sparkles;
                  const isActive = i === active;
                  return (
                    <li
                      key={`${item.period}-${item.title}`}
                      role="presentation"
                      className="flex min-w-[96px] flex-1 shrink-0 flex-col items-center gap-2 md:min-w-0"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-controls={`timeline-panel-${i}`}
                        id={`timeline-tab-${i}`}
                        tabIndex={isActive ? 0 : -1}
                        onClick={() => {
                          go(i, i > active ? 1 : -1);
                        }}
                        aria-label={`${item.period} — ${item.title}`}
                        className={`group relative grid place-items-center rounded-full outline-none transition-all focus-visible:ring-2 focus-visible:ring-accent/70 ${
                          isActive ? "h-12 w-12 md:h-14 md:w-14" : "h-11 w-11"
                        }`}
                        style={
                          isActive
                            ? {
                                backgroundImage: "var(--gradient-brand)",
                                boxShadow:
                                  "0 10px 30px -10px color-mix(in oklab, var(--color-accent) 60%, transparent)",
                              }
                            : undefined
                        }
                      >
                        <span
                          aria-hidden="true"
                          className={
                            isActive
                              ? "absolute inset-0 rounded-full ring-4 ring-background"
                              : "absolute inset-0 rounded-full border border-hairline bg-surface transition-colors group-hover:border-accent/60"
                          }
                        />
                        <Icon
                          className={`relative z-10 transition-colors ${
                            isActive
                              ? "h-5 w-5 text-accent-foreground md:h-6 md:w-6"
                              : "h-4 w-4 text-muted-foreground group-hover:text-foreground"
                          }`}
                          strokeWidth={isActive ? 2 : 1.75}
                        />
                      </button>

                      <span
                        aria-hidden="true"
                        className={`mt-1 h-1.5 w-1.5 rounded-full ${
                          isActive ? "bg-accent" : "bg-muted-foreground/40"
                        }`}
                      />

                      <span
                        className={`mt-1 text-sm font-semibold tabular-nums transition-colors ${
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.period.split("—")[0].trim()}
                      </span>
                      <span
                        className={`px-1 text-center text-[11px] leading-snug transition-colors ${
                          isActive ? "text-accent" : "text-muted-foreground"
                        }`}
                      >
                        {item.title}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* seta direita */}
            <button
              type="button"
              onClick={() => {
                go(active + 1, 1);
              }}
              disabled={active === items.length - 1}
              aria-label={nextLabel}
              className="hidden h-10 w-10 shrink-0 place-items-center rounded-full border border-hairline bg-surface text-muted-foreground shadow-sm transition-colors hover:border-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 md:grid"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div
            role="group"
            className="mt-4 flex items-center justify-center gap-4 md:hidden"
            aria-label={t.a11y.timelinePosition(active + 1, items.length)}
          >
            <button
              type="button"
              onClick={() => {
                go(active - 1, -1);
              }}
              disabled={active === 0}
              aria-label={previousLabel}
              className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-surface text-muted-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <span className="min-w-12 text-center font-mono text-xs tabular-nums text-muted-foreground">
              <span className="text-foreground">{active + 1}</span> / {items.length}
            </span>
            <button
              type="button"
              onClick={() => {
                go(active + 1, 1);
              }}
              disabled={active === items.length - 1}
              aria-label={nextLabel}
              className="grid h-11 w-11 place-items-center rounded-full border border-hairline bg-surface text-muted-foreground shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Card do marco ativo */}
          <div className="relative mt-10 min-h-[300px] md:min-h-[280px]">
            <AnimatePresence mode="wait" initial={false} custom={direction}>
              <motion.article
                key={active}
                id={`timeline-panel-${active}`}
                role="tabpanel"
                aria-labelledby={`timeline-tab-${active}`}
                custom={direction}
                initial={reduced ? { opacity: 0 } : { opacity: 0, x: direction * 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, x: direction * -40 }}
                transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
                drag={reduced ? false : "x"}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={onDragEnd}
                className="card-surface card-surface--accent max-md:touch-pan-y cursor-grab rounded-2xl p-5 active:cursor-grabbing md:p-8"
              >
                <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto] md:items-start md:gap-8">
                  <div className="min-w-0">
                    <span
                      className={`inline-flex items-center rounded-md px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] ${
                        isCurrent
                          ? "text-accent-foreground"
                          : "border border-hairline bg-surface text-muted-foreground"
                      }`}
                      style={isCurrent ? { backgroundImage: "var(--gradient-brand)" } : undefined}
                    >
                      {badgeLabel}
                    </span>
                    <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.22em] text-accent">
                      {current.org}
                    </p>
                    <h3 className="mt-1.5 font-display text-lg font-medium leading-snug text-foreground md:text-xl">
                      {current.title}
                    </h3>
                    <p className="prose-measure mt-3 leading-relaxed text-muted-foreground">
                      {current.description}
                    </p>

                    {currentTags.length > 0 && (
                      <ul className="mt-5 flex flex-wrap gap-2">
                        {currentTags.map((tag) => (
                          <li
                            key={tag}
                            className="rounded-md border border-hairline bg-surface px-2.5 py-1 text-xs text-foreground"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}

                    {current.evidence && current.evidence.length > 0 && (
                      <div className="mt-6">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                          {t.timeline.evidenceLabel}
                        </p>
                        <ul className="mt-2 space-y-1.5">
                          {current.evidence.map((ev) => (
                            <li
                              key={ev}
                              className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground"
                            >
                              <span
                                aria-hidden="true"
                                className="mt-2 h-px w-3 shrink-0 bg-accent"
                              />
                              <span>{ev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-start rounded-full border border-hairline bg-surface/70 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground md:self-start">
                    <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{current.period}</span>
                  </div>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>
        </div>

        {/* CTA Sobre mim + stats no rodapé com linha tracejada */}
        <div className="mt-10 flex justify-center md:mt-14">
          <Link to="/sobre" className="btn-outline group w-full sm:w-auto">
            <span>{t.whyHire.aboutCta}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <span
            aria-hidden="true"
            className="w-full max-w-md border-t border-dashed border-hairline"
          />
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            <Stat icon={Award} value={stats.years} label={t.timeline.stats.years} />
            <Divider />
            <Stat icon={Code2} value={stats.projects} label={t.timeline.stats.projects} />
            <Divider />
            <Stat icon={TrendingUp} value={stats.awards} label={t.timeline.stats.awards} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ icon: Icon, value, label }: { icon: LucideIcon; value: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <Icon className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
      <span className="font-semibold tabular-nums text-foreground">{value}</span>
      <span>{label}</span>
    </span>
  );
}

function Divider() {
  return <span aria-hidden="true" className="h-1 w-1 rounded-full bg-muted-foreground/40" />;
}
