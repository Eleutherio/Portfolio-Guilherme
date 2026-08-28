import { createContext, useCallback, useContext, type ReactNode } from "react";
import { setLanguagePreference, usePreferences } from "@/lib/preferences";
import { dictionary, type Dict, type Lang } from "./dictionary";

type AppContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: Dict;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { language: lang } = usePreferences();

  const setLang = useCallback((next: Lang) => {
    setLanguagePreference(next);
  }, []);

  const value: AppContextValue = {
    lang,
    setLang,
    toggleLang: () => setLang(lang === "pt" ? "en" : "pt"),
    t: dictionary[lang],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
