import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionary, type Dict, type Lang } from "./dictionary";

type AppContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: Dict;
};

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = "gf-lang";

function readInitial(): Lang {
  if (typeof window === "undefined") return "pt";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "pt" || stored === "en") return stored;
  return "pt";
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("pt");

  useEffect(() => {
    setLangState(readInitial());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  const value: AppContextValue = {
    lang,
    setLang: setLangState,
    toggleLang: () => setLangState((p) => (p === "pt" ? "en" : "pt")),
    t: dictionary[lang],
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
