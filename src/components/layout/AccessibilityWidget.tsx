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
const WIDGET_STORAGE_KEY = "accweb";

function importWidget() {
  widgetImport ??= import("accessible-web-widget").catch((error: unknown) => {
    widgetImport = null;
    throw error;
  });
  return widgetImport;
}

function readStoredWidgetConfig() {
  try {
    const stored = window.localStorage.getItem(WIDGET_STORAGE_KEY);
    if (stored) return stored;
  } catch {
    /* The widget falls back to its cookie when Web Storage is unavailable. */
  }

  try {
    const cookieName = `${WIDGET_STORAGE_KEY}=`;
    const cookie = document.cookie
      .split(";")
      .map((entry) => entry.trim())
      .find((entry) => entry.startsWith(cookieName));
    return cookie ? decodeURIComponent(cookie.slice(cookieName.length)) : null;
  } catch {
    return null;
  }
}

function hasStoredPreferences() {
  try {
    const stored = readStoredWidgetConfig();
    if (!stored) return false;
    const states = (JSON.parse(stored) as { states?: Record<string, unknown> }).states;
    return Object.values(states ?? {}).some((value) => {
      if (typeof value === "boolean") return value;
      if (typeof value === "number") return value > 0;
      return typeof value === "string" && value.length > 0;
    });
  } catch {
    return false;
  }
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
    if (loaded || !hasStoredPreferences()) return;
    let active = true;
    setLoading(true);
    configureWidget(lang);
    void importWidget().then(
      () => {
        if (active) setLoaded(true);
      },
      () => {
        if (!active) return;
        setFailed(true);
        setLoading(false);
      },
    );
    return () => {
      active = false;
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
        const nativeTrigger = document.querySelector<HTMLButtonElement>(
          "#acc-widget-host #accessibilityWidget",
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
