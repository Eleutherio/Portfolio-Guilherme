import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { dictionary, type Dict, type Lang } from "./dictionary";

type AppContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: Dict;
};

const AppContext = createContext<AppContextValue | null>(null);
const STORAGE_KEY = "gf-lang";

const listeners = new Set<() => void>();

function readStoredLanguage(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "pt" || stored === "en") return stored;
  } catch {
    /* ignore unavailable storage */
  }
  return "pt";
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function emitChange() {
  listeners.forEach((listener) => listener());
}

export function AppProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore<Lang>(subscribe, readStoredLanguage, () => "pt");

  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
    emitChange();
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
