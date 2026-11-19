import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "@/i18n/AppContext";
import { usePageRevealed } from "@/lib/page-readiness";
import { scrollWithMomentum } from "@/components/layout/MomentumScroll";
import { useTheme } from "@/lib/theme";
import { LanguageToggle } from "@/components/LanguageToggle";
import { GuiferWordmark } from "@/components/GuiferWordmark";
import { VerticalSwap } from "@/components/VerticalSwap";
import {
  DEFERRED_SECTION_LOADED_EVENT,
  LOAD_DEFERRED_SECTION_EVENT,
} from "@/components/sections/DeferredSection";

const sections = [
  { id: "home", key: "inicio" as const, cursorKey: "home" as const },
  { id: "sobre", key: "sobre" as const, cursorKey: "about" as const },
  { id: "projetos", key: "projetos" as const, cursorKey: "projects" as const },
  {
    id: "habilidades",
    key: "habilidades" as const,
    cursorKey: "capabilities" as const,
  },
  {
    id: "depoimentos",
    key: "depoimentos" as const,
    cursorKey: "testimonials" as const,
  },
];

export function Header() {
  const pageRevealed = usePageRevealed();
  const { t, lang, toggleLang } = useApp();
  const { theme, toggle: toggleTheme } = useTheme();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locationHash = useRouterState({ select: (s) => s.location.hash });
  const [open, setOpen] = useState(false);
  const [mobileViewport, setMobileViewport] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const [hidden, setHidden] = useState(true);
  const headerRef = useRef<HTMLElement>(null);
  const headerActionsRef = useRef<HTMLDivElement>(null);
  const pointerWithinHeaderRef = useRef(false);
  const pointerWithinActionsRef = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const pendingSectionFocusCleanupRef = useRef<(() => void) | null>(null);
  const themeActionLabel = theme === "dark" ? t.toggles.themeToLight : t.toggles.themeToDark;
  const headerControlsVisible = !hidden || open;
  const headerSurfaceVisible = mobileViewport ? open : headerControlsVisible;

  const collapseWhenCompositeInactive = () => {
    window.requestAnimationFrame(() => {
      const focused = document.activeElement;
      if (
        pointerWithinHeaderRef.current ||
        pointerWithinActionsRef.current ||
        (focused instanceof Node &&
          (headerRef.current?.contains(focused) || headerActionsRef.current?.contains(focused)))
      ) {
        return;
      }
      setOpen(false);
      setHidden(true);
    });
  };

  useEffect(() => {
    const collapseOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        (headerRef.current?.contains(target) || headerActionsRef.current?.contains(target))
      ) {
        return;
      }
      setOpen(false);
      setHidden(true);
    };

    window.addEventListener("pointerdown", collapseOnOutsidePointer);
    return () => window.removeEventListener("pointerdown", collapseOnOutsidePointer);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setHidden(true);

      if (open) {
        menuButtonRef.current?.focus({ preventScroll: true });
        window.requestAnimationFrame(() => setHidden(true));
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const syncHeaderMode = () => {
      setMobileViewport(!desktopQuery.matches);
      if (desktopQuery.matches) setOpen(false);
    };

    syncHeaderMode();
    desktopQuery.addEventListener("change", syncHeaderMode);
    return () => desktopQuery.removeEventListener("change", syncHeaderMode);
  }, []);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let animationFrame = 0;

    const syncVisibilityWithScroll = () => {
      animationFrame = 0;
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - previousScrollY;

      if (Math.abs(delta) < 8) return;

      if (!window.matchMedia("(min-width: 1024px)").matches) {
        setOpen(false);
        setHidden(true);
        previousScrollY = currentScrollY;
        return;
      }

      if (delta > 0) {
        setOpen(false);
        const focused = document.activeElement;
        const compositeIsActive =
          pointerWithinHeaderRef.current ||
          pointerWithinActionsRef.current ||
          (focused instanceof Node &&
            (headerRef.current?.contains(focused) || headerActionsRef.current?.contains(focused)));
        if (!compositeIsActive) setHidden(true);
      } else {
        setHidden(false);
      }

      previousScrollY = currentScrollY;
    };

    const onScroll = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(syncVisibilityWithScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, []);

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
      const height = Math.ceil(header.getBoundingClientRect().bottom);
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
    if (pathname !== "/" || !id || !pageRevealed) return;

    const focusDestination = () => {
      const heading = document.getElementById(`${id}-heading`) ?? document.getElementById(id);
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
  }, [locationHash, pathname, pageRevealed]);

  const goToSection = (id: string) => {
    pendingSectionFocusCleanupRef.current?.();
    pendingSectionFocusCleanupRef.current = null;
    if (pathname !== "/") {
      navigate({ to: "/", hash: id });
      return;
    }
    const orderedIds = [...sections.map((section) => section.id), "contato"];
    const targetIndex = orderedIds.indexOf(id);
    const requiredIds = targetIndex >= 0 ? orderedIds.slice(0, targetIndex + 1) : [id];
    const isReady = (sectionId: string) => Boolean(document.getElementById(`${sectionId}-heading`));
    let scheduled = false;
    let cancelled = false;
    let layoutFrame = 0;
    let scrollFrame = 0;
    const cleanup = () => {
      cancelled = true;
      window.removeEventListener(DEFERRED_SECTION_LOADED_EVENT, scrollWhenReady);
      window.cancelAnimationFrame(layoutFrame);
      window.cancelAnimationFrame(scrollFrame);
    };
    const scrollWhenReady = () => {
      if (scheduled || !requiredIds.every(isReady)) return;
      scheduled = true;
      void document.fonts.ready.then(() => {
        if (cancelled) return;
        layoutFrame = window.requestAnimationFrame(() => {
          scrollFrame = window.requestAnimationFrame(() => {
            cleanup();
            pendingSectionFocusCleanupRef.current = null;
            const el = document.getElementById(id);
            if (!el) return;
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            if (!scrollWithMomentum(el, reducedMotion)) {
              el.scrollIntoView({ behavior: reducedMotion ? "instant" : "smooth", block: "start" });
            }
            history.replaceState(null, "", `#${id}`);
            document.getElementById(`${id}-heading`)?.focus({ preventScroll: true });
          });
        });
      });
    };
    pendingSectionFocusCleanupRef.current = cleanup;
    window.addEventListener(DEFERRED_SECTION_LOADED_EVENT, scrollWhenReady);
    for (const sectionId of requiredIds) {
      if (!isReady(sectionId)) {
        window.dispatchEvent(new CustomEvent(LOAD_DEFERRED_SECTION_EVENT, { detail: sectionId }));
      }
    }
    scrollWhenReady();
  };

  const selectSection = (id: string) => {
    if (!open) {
      goToSection(id);
      return;
    }

    setOpen(false);
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => goToSection(id));
    });
  };

  useEffect(() => {
    if (pathname !== "/") return;
    const ids = [...sections.map((s) => s.id), "contato"];
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
    <>
      <header
        ref={headerRef}
        data-header-expanded={headerControlsVisible ? "true" : "false"}
        data-mobile-menu-open={open ? "true" : "false"}
        onFocusCapture={() => {
          setHidden(false);
        }}
        onBlurCapture={collapseWhenCompositeInactive}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          pointerWithinHeaderRef.current = true;
          setHidden(false);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          pointerWithinHeaderRef.current = false;
          if (!open) collapseWhenCompositeInactive();
        }}
        onPointerDown={(event) => {
          if (
            event.pointerType !== "mouse" &&
            hidden &&
            !(event.target as HTMLElement).closest("a")
          ) {
            setHidden(false);
          }
        }}
        className="fixed inset-x-3 top-3 z-40 rounded-xl md:inset-x-0 md:top-0 md:rounded-none"
      >
        <div
          aria-hidden="true"
          data-header-surface
          className={`pointer-events-none absolute inset-0 rounded-xl bg-background/85 shadow-sm backdrop-blur-md transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none md:rounded-none md:shadow-none ${
            headerSurfaceVisible ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
          }`}
        />

        <div className="header-container mobile-header-container relative z-10 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 py-2 md:py-3.5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:gap-x-5">
          <Link
            to="/"
            aria-label={t.a11y.homeLink}
            aria-hidden={mobileViewport && !open}
            tabIndex={mobileViewport && !open ? -1 : undefined}
            data-cursor-open={t.cursor.destinations.home}
            className={`header-wordmark-glass touch-target header-brand-link mobile-header-brand-link flex w-fit min-w-11 shrink-0 items-center justify-start justify-self-start pl-3 text-[11.5px] transition-[color,opacity] duration-300 md:min-w-0 md:pl-0 lg:visible lg:opacity-100 ${
              open ? "visible opacity-100" : "invisible opacity-0"
            } ${
              pathname === "/" && !headerControlsVisible
                ? "text-white [--wordmark-negative:#172033]"
                : "text-foreground"
            }`}
          >
            <GuiferWordmark
              animateSuffix
              suffixExpanded={mobileViewport ? open : headerControlsVisible}
            />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            aria-expanded={open}
            aria-controls="primary-navigation-panel"
            className="header-mobile-menu-trigger grid h-11 w-11 place-items-center rounded-md text-foreground transition-colors duration-200 ease-out motion-reduce:transition-none lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>

          <div
            id="primary-navigation-panel"
            data-header-right
            data-mobile-open={open ? "true" : "false"}
            aria-hidden={!headerControlsVisible}
            inert={!headerControlsVisible}
            className={`col-span-2 flex min-w-0 flex-col gap-3 transition-[opacity,translate] duration-200 ease-out motion-reduce:transition-none lg:pointer-events-none lg:absolute lg:inset-0 lg:grid lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center lg:gap-2 lg:py-0 ${
              open ? "mt-0 border-t border-hairline py-0" : "mt-0 border-t border-transparent py-1"
            }`}
          >
            <nav
              aria-label={t.a11y.primaryNavigation}
              className={`min-w-0 flex-col items-center gap-1 py-3 transition-transform duration-200 ease-out motion-reduce:transition-none lg:col-start-2 lg:row-start-1 lg:flex lg:flex-row lg:items-center lg:justify-center lg:gap-[clamp(0.125rem,0.6vw,0.5rem)] lg:py-0 ${
                open ? "flex" : "hidden"
              } ${
                !headerControlsVisible
                  ? "lg:pointer-events-none lg:-translate-y-1 lg:invisible"
                  : "lg:pointer-events-auto lg:translate-y-0 lg:visible"
              }`}
            >
              {sections.map((s) => {
                const active = activeId === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => selectSection(s.id)}
                    data-cursor-open={t.cursor.destinations[s.cursorKey]}
                    aria-current={active ? "page" : undefined}
                    className={`ui-control-text touch-target w-full rounded-md px-2 py-3 text-center transition-colors lg:w-auto lg:rounded-sm lg:px-1.5 lg:py-2 lg:text-left lg:whitespace-nowrap xl:px-2 ${
                      active
                        ? "text-accent"
                        : "text-foreground hover:bg-surface lg:text-muted-foreground lg:hover:bg-transparent lg:hover:text-foreground"
                    }`}
                  >
                    {t.nav[s.key]}
                  </button>
                );
              })}
              <button
                type="button"
                onClick={() => selectSection("contato")}
                data-cursor-open={t.cursor.destinations.contact}
                aria-current={activeId === "contato" ? "page" : undefined}
                className={`ui-control-text touch-target w-full rounded-md px-2 py-3 text-center transition-colors lg:hidden ${
                  activeId === "contato" ? "text-accent" : "text-foreground hover:bg-surface"
                }`}
              >
                {t.nav.contato}
              </button>
            </nav>

            <div
              className={`flex-row items-center justify-center gap-2 lg:hidden ${open ? "flex" : "hidden"}`}
              data-mobile-menu-actions
            >
              <div className="flex w-full items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  aria-label={themeActionLabel}
                  title={themeActionLabel}
                  className="header-switch-control touch-target grid h-11 w-11 place-items-center border-0 bg-transparent transition-colors"
                >
                  <VerticalSwap swapKey={theme} className="h-3.5 w-3.5">
                    {theme === "dark" ? (
                      <Sun className="h-3.5 w-3.5" />
                    ) : (
                      <Moon className="h-3.5 w-3.5" />
                    )}
                  </VerticalSwap>
                </button>
                <LanguageToggle lang={lang} onToggle={toggleLang} ariaLabel={t.toggles.langLabel} />
              </div>
            </div>

            <div
              aria-hidden="true"
              data-header-actions-space
              className="hidden shrink-0 lg:col-start-3 lg:row-start-1 lg:block lg:h-9 lg:w-0"
            />
          </div>
        </div>
      </header>
      <div
        ref={headerActionsRef}
        data-header-actions
        data-header-expanded={headerControlsVisible ? "true" : "false"}
        onFocusCapture={() => setHidden(false)}
        onBlurCapture={collapseWhenCompositeInactive}
        onPointerEnter={(event) => {
          if (event.pointerType !== "mouse") return;
          pointerWithinActionsRef.current = true;
          setHidden(false);
        }}
        onPointerLeave={(event) => {
          if (event.pointerType !== "mouse") return;
          pointerWithinActionsRef.current = false;
          if (!open) collapseWhenCompositeInactive();
        }}
        className={`fixed right-0 z-40 hidden w-fit shrink-0 items-center gap-2 transition-[top] duration-200 ease-out motion-reduce:transition-none lg:top-[0.46875rem] lg:flex ${
          open ? "top-[23rem]" : "top-[4.3125rem]"
        }`}
      >
        {headerControlsVisible ? (
          <div data-header-switches className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={themeActionLabel}
              title={themeActionLabel}
              className="header-switch-control header-static-control touch-target grid h-11 w-11 place-items-center border-0 bg-transparent transition-colors lg:h-9 lg:w-9"
            >
              <VerticalSwap swapKey={theme} className="h-3.5 w-3.5">
                {theme === "dark" ? (
                  <Sun className="h-3.5 w-3.5" />
                ) : (
                  <Moon className="h-3.5 w-3.5" />
                )}
              </VerticalSwap>
            </button>
            <LanguageToggle lang={lang} onToggle={toggleLang} ariaLabel={t.toggles.langLabel} />
          </div>
        ) : null}
        {headerControlsVisible ? (
          <button
            type="button"
            onClick={() => selectSection("contato")}
            data-cursor-open={t.cursor.destinations.contact}
            className="ui-control-text header-glass-surface header-static-control header-contact-cta touch-target inline-flex h-11 shrink-0 items-center justify-center rounded-sm px-3 lg:h-9 lg:px-4"
          >
            <span>{t.nav.talk}</span>
          </button>
        ) : null}
      </div>
    </>
  );
}
