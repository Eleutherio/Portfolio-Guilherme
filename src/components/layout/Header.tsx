import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/i18n/AppContext";
import { useTheme } from "@/lib/theme";
import { LanguageToggle } from "@/components/LanguageToggle";
import { GuiferWordmark } from "@/components/GuiferWordmark";
import {
  DEFERRED_SECTION_LOADED_EVENT,
  LOAD_DEFERRED_SECTION_EVENT,
} from "@/components/sections/DeferredSection";

const sections = [
  { id: "sobre", key: "sobre" as const, cursorKey: "about" as const },
  { id: "projetos", key: "projetos" as const, cursorKey: "projects" as const },
  { id: "contato", key: "contato" as const, cursorKey: "contact" as const },
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
  const lastYRef = useRef(0);
  const logoHoverRevealRef = useRef(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pendingSectionFocusCleanupRef = useRef<(() => void) | null>(null);
  const themeActionLabel = theme === "dark" ? t.toggles.themeToLight : t.toggles.themeToDark;
  const ThemeActionIcon = theme === "dark" ? Sun : Moon;
  const headerControlsVisible = !hidden || hoverReveal;

  useEffect(() => {
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
        } else if (open || headerRef.current?.contains(document.activeElement)) {
          setHidden(false);
          setHoverReveal(false);
        } else if (y > last && y > 120) {
          setHidden(true);
          setHoverReveal(false);
        } else if (y < last) {
          setHidden(false);
          setHoverReveal(false);
        }
        lastYRef.current = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

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

  useEffect(
    () => () => {
      pendingSectionFocusCleanupRef.current?.();
    },
    [],
  );

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

    const focusDestination = () => {
      const heading = document.getElementById(`${id}-heading`);
      if (heading) {
        heading.focus({ preventScroll: true });
        return true;
      }
      return false;
    };
    if (focusDestination()) return;

    const onLoaded = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) return;
      window.requestAnimationFrame(focusDestination);
    };

    window.addEventListener(DEFERRED_SECTION_LOADED_EVENT, onLoaded);
    window.dispatchEvent(new CustomEvent(LOAD_DEFERRED_SECTION_EVENT, { detail: id }));
    return () => window.removeEventListener(DEFERRED_SECTION_LOADED_EVENT, onLoaded);
  }, [locationHash, pathname]);

  const goToSection = (id: string) => {
    pendingSectionFocusCleanupRef.current?.();
    pendingSectionFocusCleanupRef.current = null;
    if (pathname !== "/") {
      navigate({ to: "/", hash: id });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
      const heading = document.getElementById(`${id}-heading`);
      if (heading) {
        window.requestAnimationFrame(() => heading.focus({ preventScroll: true }));
        return;
      }
    }

    const focusWhenLoaded = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) return;
      pendingSectionFocusCleanupRef.current?.();
      pendingSectionFocusCleanupRef.current = null;
      window.requestAnimationFrame(() => {
        if (window.location.hash !== `#${id}`) return;
        document.getElementById(`${id}-heading`)?.focus({ preventScroll: true });
      });
    };
    const cleanup = () =>
      window.removeEventListener(DEFERRED_SECTION_LOADED_EVENT, focusWhenLoaded);
    pendingSectionFocusCleanupRef.current = cleanup;
    window.addEventListener(DEFERRED_SECTION_LOADED_EVENT, focusWhenLoaded);
    window.dispatchEvent(new CustomEvent(LOAD_DEFERRED_SECTION_EVENT, { detail: id }));
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
    const observeSections = () => {
      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    };
    observeSections();
    window.addEventListener(DEFERRED_SECTION_LOADED_EVENT, observeSections);
    return () => {
      observer.disconnect();
      window.removeEventListener(DEFERRED_SECTION_LOADED_EVENT, observeSections);
    };
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
      className={`fixed inset-x-0 top-0 z-40 transition-[background-color,backdrop-filter] duration-300 ease-out ${
        headerControlsVisible
          ? "bg-background/80 backdrop-blur-md"
          : "pointer-events-none bg-transparent backdrop-blur-none"
      }`}
    >
      <div className="header-container flex items-center justify-between gap-3 py-3.5 md:grid md:grid-cols-2 lg:gap-5">
        <Link
          to="/"
          aria-label={t.a11y.homeLink}
          data-cursor-open={t.cursor.destinations.home}
          onMouseEnter={() => {
            if (!hidden) return;
            logoHoverRevealRef.current = true;
            setHoverReveal(true);
          }}
          onMouseLeave={() => {
            if (!logoHoverRevealRef.current) return;
            logoHoverRevealRef.current = false;
            if (hidden) setHoverReveal(false);
          }}
          className="pointer-events-auto -ml-6 flex shrink-0 items-center text-[11.5px] text-foreground"
        >
          <GuiferWordmark animateSuffix suffixExpanded={headerControlsVisible} />
        </Link>

        <div
          data-header-right
          className={`hidden min-w-0 items-center justify-end gap-2 transition-[opacity,transform] duration-300 ease-out md:flex ${
            !headerControlsVisible
              ? "pointer-events-none -translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          <nav
            aria-label={t.a11y.primaryNavigation}
            className="flex min-w-0 items-center justify-start gap-[clamp(0.25rem,1vw,0.75rem)]"
          >
            {sections.map((s) => {
              const active = activeId === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goToSection(s.id)}
                  data-cursor-open={t.cursor.destinations[s.cursorKey]}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-sm px-2 py-2 font-sans text-[clamp(12px,1vw,13px)] font-medium tracking-[-0.01em] transition-colors whitespace-nowrap ${
                    active ? "text-accent" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.nav[s.key]}
                </button>
              );
            })}
          </nav>

          <div
            data-header-switches
            className="flex shrink-0 items-center gap-0.5 rounded-full border border-hairline/80 bg-surface/50 p-0.5"
          >
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={themeActionLabel}
              title={themeActionLabel}
              className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
            >
              <ThemeActionIcon className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            <LanguageToggle
              lang={lang}
              onToggle={toggleLang}
              ariaLabel={t.toggles.langLabel}
              variant="desktop"
            />
          </div>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          className={`grid h-11 w-11 place-items-center rounded-md text-foreground transition-[opacity,transform] duration-300 ease-out md:hidden ${
            !headerControlsVisible
              ? "pointer-events-none -translate-y-2 opacity-0"
              : "translate-y-0 opacity-100"
          }`}
        >
          {open ? (
            <X className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Menu className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div className="bg-background md:hidden">
          <nav
            id="mobile-navigation"
            aria-label={t.a11y.mobileNavigation}
            className="header-container flex flex-col gap-1 py-4"
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
                data-cursor-open={t.cursor.destinations[s.cursorKey]}
                className="rounded-md px-2 py-3 text-left font-sans text-sm tracking-[-0.01em] text-foreground transition-colors hover:bg-surface"
              >
                {t.nav[s.key]}
              </button>
            ))}

            <div className="mt-3 flex w-fit items-center gap-0.5 rounded-full border border-hairline/80 bg-surface/50 p-0.5">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label={themeActionLabel}
                title={themeActionLabel}
                className="grid h-11 w-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                <ThemeActionIcon className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              <LanguageToggle
                lang={lang}
                onToggle={toggleLang}
                ariaLabel={t.toggles.langLabel}
                variant="mobile"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
