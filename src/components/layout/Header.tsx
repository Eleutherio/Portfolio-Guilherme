import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/i18n/AppContext";
import { useTheme } from "@/lib/theme";
import { LanguageToggle } from "@/components/LanguageToggle";

const sections = [
  { id: "sobre", key: "sobre" as const },
  { id: "trajetoria", key: "trajetoria" as const },
  { id: "projetos", key: "projetos" as const },
  { id: "processo", key: "processo" as const },
  { id: "contato", key: "contato" as const },
];

export function Header() {
  const { t, lang, toggleLang } = useApp();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locationHash = useRouterState({ select: (s) => s.location.hash });
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [hidden, setHidden] = useState(false);
  const [hoverReveal, setHoverReveal] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const lastYRef = useRef(0);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const themeActionLabel = theme === "dark" ? t.toggles.themeToLight : t.toggles.themeToDark;
  const ThemeActionIcon = theme === "dark" ? Sun : Moon;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

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
        if (y < 8) {
          setHidden(false);
          setHoverReveal(false);
        } else if (open) {
          setHidden(false);
          setHoverReveal(false);
        } else if (y > last && y > 120) setHidden(true);
        else if (y < last) {
          setHidden(false);
          setHoverReveal(false);
        }
        lastYRef.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [reducedMotion, open]);

  useEffect(() => {
    if (!hidden || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const revealNearTop = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && event.clientY <= 16) setHoverReveal(true);
    };

    window.addEventListener("pointermove", revealNearTop, { passive: true });
    return () => window.removeEventListener("pointermove", revealNearTop);
  }, [hidden]);

  useEffect(() => {
    if (!open) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header || open) return;

    const syncHeaderHeight = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--site-header-height", `${height}px`);
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
    };
  }, [lang, open]);

  useEffect(() => {
    const id = locationHash.replace(/^#/, "");
    if (pathname !== "/" || !id) return;

    let frame = 0;
    let attempts = 0;
    const focusDestination = () => {
      const heading = document.getElementById(`${id}-heading`);
      if (heading) {
        heading.focus({ preventScroll: true });
        return;
      }
      if (attempts++ < 60) frame = window.requestAnimationFrame(focusDestination);
    };

    frame = window.requestAnimationFrame(focusDestination);
    return () => window.cancelAnimationFrame(frame);
  }, [locationHash, pathname]);

  const goToSection = (id: string) => {
    if (pathname !== "/") {
      navigate({ to: "/", hash: id });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      window.requestAnimationFrame(() => {
        document.getElementById(`${id}-heading`)?.focus({ preventScroll: true });
      });
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
      ref={headerRef}
      onFocusCapture={() => {
        setHidden(false);
        setHoverReveal(false);
      }}
      onMouseLeave={() => {
        if (hidden) setHoverReveal(false);
      }}
      className={`fixed inset-x-0 top-0 z-40 border-b border-hairline/70 bg-background/80 backdrop-blur-md transition-transform duration-300 ease-out focus-within:translate-y-0 focus-within:duration-0 ${hidden && !hoverReveal ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="section-container flex items-center justify-between gap-3 py-3.5 lg:gap-5">
        <Link
          to="/"
          aria-label={t.a11y.homeLink}
          className="group flex shrink-0 items-center gap-2.5 text-foreground"
        >
          <span className="font-mono text-[13px] font-medium tracking-tight text-foreground">
            <span className="text-accent">{"{"}</span>
            <span className="mx-0.5">GF</span>
            <span className="text-accent">{"}"}</span>
            <span className="ml-1.5 hidden font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground xl:inline">
              guifer.tech
            </span>
          </span>
        </Link>

        <nav
          aria-label={t.a11y.primaryNavigation}
          className="hidden min-w-0 flex-1 items-center justify-center gap-[clamp(0.25rem,1vw,0.75rem)] md:flex"
        >
          {sections.map((s) => {
            const active = activeId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSection(s.id)}
                aria-current={active ? "page" : undefined}
                className={`rounded-sm px-2 py-2 font-mono text-[clamp(9px,1.15vw,11px)] uppercase tracking-[clamp(0.12em,0.25vw,0.25em)] transition-colors whitespace-nowrap ${
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.nav[s.key]}
              </button>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeActionLabel}
            title={themeActionLabel}
            className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-md text-foreground transition-colors hover:bg-surface hover:text-accent"
          >
            <ThemeActionIcon className="h-4 w-4" aria-hidden="true" />
          </button>
          <LanguageToggle
            lang={lang}
            onToggle={toggleLang}
            ariaLabel={t.toggles.langLabel}
            variant="desktop"
          />
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className="grid h-11 w-11 place-items-center rounded-md text-foreground md:hidden"
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div className="border-t border-hairline bg-background md:hidden">
          <nav
            id="mobile-navigation"
            aria-label={t.a11y.mobileNavigation}
            className="section-container flex flex-col gap-1 py-4"
          >
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  window.requestAnimationFrame(() => {
                    window.requestAnimationFrame(() => goToSection(s.id));
                  });
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
                type="button"
                onClick={toggleTheme}
                aria-label={themeActionLabel}
                title={themeActionLabel}
                className="grid h-11 w-11 min-h-11 min-w-11 place-items-center rounded-md border border-border text-foreground"
              >
                <ThemeActionIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
