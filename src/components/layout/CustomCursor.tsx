import { useEffect, useRef } from "react";

import { useApp } from "@/i18n/AppContext";

const FINE_POINTER_QUERY = "(hover: hover) and (pointer: fine)";
const FORCED_COLORS_QUERY = "(forced-colors: active)";
const PRINT_QUERY = "print";
const NATIVE_ZONE_SELECTOR =
  "iframe, [data-custom-cursor-native], #accessibility-widget-launcher, #acc-widget-host";
const INTERACTIVE_SELECTOR = [
  "a[href]",
  "button:not(:disabled)",
  "input:not(:disabled)",
  "textarea:not(:disabled)",
  "select:not(:disabled)",
  "audio[controls]",
  "video[controls]",
  "[contenteditable='true']",
  "summary",
  "label[for]",
  "[role='button']:not([aria-disabled='true'])",
  "[role='link']:not([aria-disabled='true'])",
  "[role='checkbox']:not([aria-disabled='true'])",
  "[role='radio']:not([aria-disabled='true'])",
  "[role='switch']:not([aria-disabled='true'])",
  "[role='tab']:not([aria-disabled='true'])",
  "[data-cursor-interactive]",
].join(", ");
const NAVIGATION_SELECTOR =
  "[data-cursor-open], a[href], [role='link']:not([aria-disabled='true'])";
const VISUAL_BUTTON_SELECTOR = ".btn-primary, .btn-outline, [data-cursor-tooltip='button']";
const MAGNETIC_BUTTON_SELECTOR = ".btn-primary, .btn-outline";
const MAGNETIC_MAX_X = 14;
const MAGNETIC_MAX_Y = 8;
const TOOLTIP_OFFSET = 14;
const VIEWPORT_GUTTER = 8;
const MAX_FALLBACK_LENGTH = 56;

function isDisabled(element: HTMLElement | null) {
  if (!element) return false;
  if (element.getAttribute("aria-disabled") === "true") return true;
  return "disabled" in element && Boolean((element as HTMLButtonElement).disabled);
}

function compactLabel(value: string | null | undefined) {
  const label = value?.replace(/\s+/g, " ").trim();
  if (!label) return null;
  if (label.length <= MAX_FALLBACK_LENGTH) return label;
  return `${label.slice(0, MAX_FALLBACK_LENGTH - 1).trimEnd()}…`;
}

function navigationDestination(
  element: HTMLElement,
  fallbacks: { email: string; external: string },
) {
  const explicit = compactLabel(element.dataset.cursorOpen);
  if (explicit) return explicit;

  const accessibleName = compactLabel(element.getAttribute("aria-label"));
  if (accessibleName) return accessibleName;

  const visibleText = compactLabel(element.textContent);
  if (visibleText) return visibleText;

  const href = element.getAttribute("href");
  if (!href) return fallbacks.external;
  if (href.startsWith("mailto:")) return fallbacks.email;

  try {
    const url = new URL(href, window.location.href);
    return compactLabel(url.hostname.replace(/^www\./, "")) ?? fallbacks.external;
  } catch {
    return fallbacks.external;
  }
}

function canShowNavigationTooltip(navigation: HTMLElement) {
  if (navigation.closest("header, footer")) return false;
  if (navigation.matches(VISUAL_BUTTON_SELECTOR)) return true;
  return Boolean(navigation.querySelector("img, picture, video"));
}

export function CustomCursor() {
  const { t } = useApp();
  const cursorRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const tooltip = tooltipRef.current;
    if (!cursor || !tooltip) return;

    const finePointer = window.matchMedia(FINE_POINTER_QUERY);
    const forcedColors = window.matchMedia(FORCED_COLORS_QUERY);
    const print = window.matchMedia(PRINT_QUERY);
    let enabled = false;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;
    let magneticButton: HTMLElement | null = null;
    let magneticCenterX = 0;
    let magneticCenterY = 0;
    let magneticHalfWidth = 1;
    let magneticHalfHeight = 1;

    const resetMagneticButton = () => {
      if (!magneticButton) return;
      magneticButton.dataset.magneticActive = "false";
      magneticButton.style.setProperty("--magnetic-x", "0px");
      magneticButton.style.setProperty("--magnetic-y", "0px");
      magneticButton = null;
    };

    const syncMagneticButton = (element: Element | null) => {
      const next = element?.closest<HTMLElement>(MAGNETIC_BUTTON_SELECTOR) ?? null;
      const enabledTarget = next && !isDisabled(next) ? next : null;
      if (enabledTarget === magneticButton) return;
      resetMagneticButton();
      magneticButton = enabledTarget;
      if (!magneticButton) return;

      const rect = magneticButton.getBoundingClientRect();
      const transformValue = window.getComputedStyle(magneticButton).transform;
      const transform =
        transformValue === "none" ? new DOMMatrixReadOnly() : new DOMMatrixReadOnly(transformValue);
      magneticCenterX = rect.left + rect.width / 2 - transform.m41;
      magneticCenterY = rect.top + rect.height / 2 - transform.m42;
      magneticHalfWidth = Math.max(1, rect.width / 2);
      magneticHalfHeight = Math.max(1, rect.height / 2);
      magneticButton.dataset.magneticActive = "true";
    };

    const placeMagneticButton = () => {
      if (!magneticButton?.isConnected) {
        resetMagneticButton();
        return;
      }

      const normalizedX = (pointerX - magneticCenterX) / magneticHalfWidth;
      const normalizedY = (pointerY - magneticCenterY) / magneticHalfHeight;
      const offsetX = Math.max(
        -MAGNETIC_MAX_X,
        Math.min(MAGNETIC_MAX_X, normalizedX * MAGNETIC_MAX_X),
      );
      const offsetY = Math.max(
        -MAGNETIC_MAX_Y,
        Math.min(MAGNETIC_MAX_Y, normalizedY * MAGNETIC_MAX_Y),
      );

      magneticButton.style.setProperty("--magnetic-x", `${offsetX.toFixed(2)}px`);
      magneticButton.style.setProperty("--magnetic-y", `${offsetY.toFixed(2)}px`);
    };

    const setTooltipVisible = (visible: boolean) => {
      cursor.dataset.labelVisible = String(visible);
      tooltip.dataset.visible = String(visible);
      if (!visible) tooltip.textContent = "";
    };

    const hide = () => {
      resetMagneticButton();
      cursor.dataset.visible = "false";
      cursor.dataset.interactive = "false";
      cursor.dataset.pressed = "false";
      setTooltipVisible(false);
    };

    const placeElements = () => {
      frame = 0;
      cursor.style.transform = `translate3d(${pointerX}px, ${pointerY}px, 0)`;
      placeMagneticButton();

      if (tooltip.dataset.visible !== "true") return;
      const width = tooltip.offsetWidth;
      const height = tooltip.offsetHeight;
      const maxX = Math.max(VIEWPORT_GUTTER, window.innerWidth - width - VIEWPORT_GUTTER);
      const maxY = Math.max(VIEWPORT_GUTTER, window.innerHeight - height - VIEWPORT_GUTTER);
      const placeLeft = pointerX + TOOLTIP_OFFSET + width > window.innerWidth - VIEWPORT_GUTTER;
      const placeAbove = pointerY + TOOLTIP_OFFSET + height > window.innerHeight - VIEWPORT_GUTTER;
      const desiredX = placeLeft ? pointerX - TOOLTIP_OFFSET - width : pointerX + TOOLTIP_OFFSET;
      const desiredY = placeAbove ? pointerY - TOOLTIP_OFFSET - height : pointerY + TOOLTIP_OFFSET;

      tooltip.dataset.horizontal = placeLeft ? "left" : "right";
      tooltip.dataset.vertical = placeAbove ? "above" : "below";
      tooltip.style.left = `${Math.min(maxX, Math.max(VIEWPORT_GUTTER, desiredX))}px`;
      tooltip.style.top = `${Math.min(maxY, Math.max(VIEWPORT_GUTTER, desiredY))}px`;
    };

    const schedulePlacement = () => {
      if (!frame) frame = window.requestAnimationFrame(placeElements);
    };

    const syncTarget = (target: EventTarget | null) => {
      const element = target instanceof Element ? target : null;
      if (!element || element.closest(NATIVE_ZONE_SELECTOR)) {
        hide();
        return;
      }
      syncMagneticButton(element);

      const interactive = element.closest<HTMLElement>(INTERACTIVE_SELECTOR);
      const disabled = isDisabled(interactive);
      cursor.dataset.visible = "true";
      cursor.dataset.interactive = String(Boolean(interactive && !disabled));

      const navigation = element.closest<HTMLElement>(NAVIGATION_SELECTOR);
      if (!navigation || isDisabled(navigation) || !canShowNavigationTooltip(navigation)) {
        setTooltipVisible(false);
        return;
      }

      const destination = navigationDestination(navigation, {
        email: t.cursor.destinations.email,
        external: t.cursor.destinations.external,
      });
      tooltip.textContent = `${t.cursor.open} ${destination}`;
      cursor.dataset.visible = "false";
      setTooltipVisible(true);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") {
        hide();
        return;
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
      syncTarget(event.target);
      schedulePlacement();
    };

    const onPointerOver = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse") return;
      syncTarget(event.target);
      schedulePlacement();
    };

    const onPointerDown = (event: PointerEvent) => {
      if (!enabled || event.pointerType !== "mouse" || cursor.dataset.visible !== "true") return;
      cursor.dataset.pressed = "true";
    };

    const onPointerUp = () => {
      cursor.dataset.pressed = "false";
    };

    const syncEnabled = () => {
      enabled = finePointer.matches && !forcedColors.matches && !print.matches;
      document.documentElement.dataset.customCursor = enabled ? "active" : "inactive";
      if (!enabled) hide();
    };

    const onVisibilityChange = () => {
      if (document.visibilityState !== "visible") hide();
    };

    syncEnabled();
    finePointer.addEventListener("change", syncEnabled);
    forcedColors.addEventListener("change", syncEnabled);
    print.addEventListener("change", syncEnabled);
    document.addEventListener("pointermove", onPointerMove, { passive: true, capture: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true, capture: true });
    document.addEventListener("pointerdown", onPointerDown, { passive: true, capture: true });
    document.addEventListener("pointerup", onPointerUp, { passive: true, capture: true });
    document.documentElement.addEventListener("pointerleave", hide, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", hide);
    window.addEventListener("resize", schedulePlacement, { passive: true });

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resetMagneticButton();
      finePointer.removeEventListener("change", syncEnabled);
      forcedColors.removeEventListener("change", syncEnabled);
      print.removeEventListener("change", syncEnabled);
      document.removeEventListener("pointermove", onPointerMove, true);
      document.removeEventListener("pointerover", onPointerOver, true);
      document.removeEventListener("pointerdown", onPointerDown, true);
      document.removeEventListener("pointerup", onPointerUp, true);
      document.documentElement.removeEventListener("pointerleave", hide);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", hide);
      window.removeEventListener("resize", schedulePlacement);
      delete document.documentElement.dataset.customCursor;
    };
  }, [t.cursor.destinations.email, t.cursor.destinations.external, t.cursor.open]);

  return (
    <>
      <div
        ref={cursorRef}
        id="custom-cursor"
        className="custom-cursor"
        data-visible="false"
        data-interactive="false"
        data-pressed="false"
        data-label-visible="false"
        aria-hidden="true"
      >
        <div className="custom-cursor__visual">
          <svg
            className="custom-cursor__chevron"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            aria-hidden="true"
          >
            <path d="M2.05 1.25c3.85.8 9.45 2.8 12.3 4.1 1.2.55 1.17 1.43.01 2-1.41.7-4.31.85-5.31 2.6l-2.7 4.6c-.63 1.07-1.62 1.03-2.17-.1L.95 2.7C.57 1.32 1 .98 2.05 1.25Z" />
          </svg>
        </div>
      </div>
      <div
        ref={tooltipRef}
        id="custom-cursor-tooltip"
        className="custom-cursor-tooltip"
        data-visible="false"
        aria-hidden="true"
      />
    </>
  );
}
