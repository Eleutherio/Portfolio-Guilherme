import { useEffect } from "react";

type WidgetOptions = {
  position: "bottom-right";
  offset: [number, number];
  size: string;
  lang: "pt" | "en";
};

type WidgetWindow = Window & {
  AccessibleWebWidgetOptions?: Partial<WidgetOptions>;
};

export function AccessibilityWidget() {
  useEffect(() => {
    if (document.getElementById("acc-widget-host")) return;

    let storedLanguage: string | null = null;
    try {
      storedLanguage = window.localStorage.getItem("gf-lang");
    } catch {
      // The widget falls back to the document/browser language when storage is unavailable.
    }

    const widgetWindow = window as WidgetWindow;
    widgetWindow.AccessibleWebWidgetOptions = {
      ...widgetWindow.AccessibleWebWidgetOptions,
      position: "bottom-right",
      offset: [24, 24],
      size: "44px",
      lang: storedLanguage === "en" ? "en" : "pt",
    };

    void import("accessible-web-widget").catch(() => {
      // The site remains fully usable if the complementary widget cannot load.
    });
  }, []);

  return null;
}
