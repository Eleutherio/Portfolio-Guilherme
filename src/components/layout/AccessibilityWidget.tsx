import { Accessibility } from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "@/i18n/AppContext";

type WidgetOptions = {
  position: "bottom-right";
  offset: [number, number];
  size: string;
  lang: "pt" | "en";
};

type WidgetWindow = Window & {
  AccessibleWebWidgetOptions?: Partial<WidgetOptions>;
  AccessibleWebWidget?: {
    instance?: { open: () => void };
  };
};

let widgetImport: Promise<unknown> | null = null;

function importWidget() {
  widgetImport ??= import("accessible-web-widget").catch((error: unknown) => {
    widgetImport = null;
    throw error;
  });
  return widgetImport;
}

function configureWidget(lang: "pt" | "en") {
  const widgetWindow = window as WidgetWindow;
  widgetWindow.AccessibleWebWidgetOptions = {
    ...widgetWindow.AccessibleWebWidgetOptions,
    position: "bottom-right",
    offset: [24, 80],
    size: "44px",
    lang,
  };
  return widgetWindow;
}

export function AccessibilityWidget() {
  const { lang, t } = useApp();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(
    () => typeof document !== "undefined" && Boolean(document.getElementById("acc-widget-host")),
  );
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loaded) return;
    let saved = false;
    try {
      saved = Boolean(localStorage.getItem("accweb"));
    } catch {
      /* Cookie fallback below. */
    }
    if (!saved && !document.cookie.split(";").some((value) => value.trim().startsWith("accweb=")))
      return;
    let cancelled = false;
    configureWidget(lang);
    void importWidget()
      .then(() => {
        if (!cancelled) setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [lang, loaded]);

  const loadAndOpen = async () => {
    if (loading) return;
    setLoading(true);
    setFailed(false);

    const widgetWindow = configureWidget(lang);

    try {
      await importWidget();
      setLoaded(true);
      window.requestAnimationFrame(() => {
        const host = document.getElementById("acc-widget-host");
        const nativeTrigger = (host?.shadowRoot ?? host)?.querySelector<HTMLButtonElement>(
          "#accessibilityWidget",
        );
        if (nativeTrigger) nativeTrigger.click();
        else widgetWindow.AccessibleWebWidget?.instance?.open();
      });
    } catch {
      setFailed(true);
      setLoading(false);
    }
  };

  if (loaded) return null;

  return (
    <>
      <button
        id="accessibility-widget-launcher"
        data-custom-cursor-native
        type="button"
        onClick={() => void loadAndOpen()}
        disabled={loading}
        aria-busy={loading}
        className="fixed bottom-20 right-6 z-40 grid h-11 w-11 place-items-center rounded-full border border-hairline bg-foreground text-background shadow-lg transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-wait disabled:opacity-70"
        aria-label={t.footer.accessibility}
      >
        <Accessibility className="h-5 w-5" aria-hidden="true" />
      </button>
      {failed && (
        <span className="sr-only" role="status" aria-live="polite">
          {lang === "pt"
            ? "Não foi possível carregar o menu de acessibilidade. Tente novamente."
            : "The accessibility menu could not be loaded. Try again."}
        </span>
      )}
    </>
  );
}
