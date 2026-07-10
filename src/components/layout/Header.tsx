import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useApp } from "@/i18n/AppContext";
import { useTheme } from "@/lib/theme";
import { LanguageToggle } from "@/components/LanguageToggle";


const sections = [
  { id: "tecnologias", key: "tecnologias" as const },
  { id: "projetos", key: "projetos" as const },
  { id: "trajetoria", key: "trajetoria" as const },
  { id: "contato", key: "contato" as const },
];


export function Header() {
  const { t, lang, toggleLang } = useApp();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [hidden, setHidden] = useState(false);
  const lastYRef = useRef(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    lastYRef.current = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const last = lastYRef.current;
        if (y < 8) setHidden(false);
        else if (open) setHidden(false);
        else if (y > last && y > 120) setHidden(true);
        else if (y < last) setHidden(false);
        lastYRef.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion, open]);

  const goToSection = (id: string) => {
    if (pathname !== "/") {
      navigate({ to: "/", hash: id });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    }
  };

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = ["home", ...sections.map((s) => s.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [pathname]);


  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 border-b border-hairline/70 bg-background/80 backdrop-blur-md transition-transform duration-300 ease-out ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="section-container flex items-center justify-between gap-4 py-3.5">
        <Link
          to="/"
          aria-label="Guilherme Ferreira — início"
          className="group flex items-center gap-2.5 text-foreground"
        >
          <span className="font-mono text-[13px] font-medium tracking-tight text-foreground">
            <span className="text-accent">{"{"}</span>
            <span className="mx-0.5">GF</span>
            <span className="text-accent">{"}"}</span>
            <span className="ml-1.5 hidden font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground sm:inline">
              guifer.tech
            </span>
          </span>
        </Link>

        <nav aria-label="primary" className="hidden items-center gap-7 md:flex">
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSection(s.id)}
                aria-current={active ? "page" : undefined}
                className={`font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.nav[s.key]}
              </button>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggleTheme}
            aria-label={theme === "dark" ? t.toggles.themeToLight : t.toggles.themeToDark}
            className="relative grid h-9 w-9 place-items-center overflow-hidden text-foreground transition-colors hover:text-accent"
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.span
                  key="moon"
                  initial={{ y: -18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -18, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute inset-0 grid place-items-center"
                >
                  <Moon className="h-4 w-4" aria-hidden="true" />
                </motion.span>
              ) : (
                <motion.span
                  key="sun"
                  initial={{ y: 18, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 18, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
                  className="absolute inset-0 grid place-items-center"
                >
                  <Sun className="h-4 w-4" aria-hidden="true" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <LanguageToggle
            lang={lang}
            onToggle={toggleLang}
            ariaLabel={t.toggles.langLabel}
            variant="desktop"
          />
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={t.nav.menu}
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-md text-foreground md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-background md:hidden">
          <nav aria-label="mobile" className="section-container flex flex-col gap-1 py-4">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  goToSection(s.id);
                }}
                className="rounded-md px-2 py-3 text-left font-mono text-sm uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-surface"
              >
                {t.nav[s.key]}
              </button>
            ))}

            <div className="mt-2 flex gap-2">
              <LanguageToggle
                lang={lang}
                onToggle={toggleLang}
                ariaLabel={t.toggles.langLabel}
                variant="mobile"
              />
              <button
                onClick={toggleTheme}
                aria-label={theme === "dark" ? t.toggles.themeToLight : t.toggles.themeToDark}
                className="grid h-11 w-11 min-h-11 min-w-11 place-items-center rounded-md border border-border text-foreground"
              >
                {theme === "dark"
                  ? <Sun className="h-4 w-4" aria-hidden="true" />
                  : <Moon className="h-4 w-4" aria-hidden="true" />}
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
