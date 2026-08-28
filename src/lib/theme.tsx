import { createContext, useCallback, useContext, type ReactNode } from "react";
import { setThemePreference, usePreferences, type ThemePreference } from "./preferences";

type Theme = ThemePreference;

type ThemeContextValue = {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = usePreferences();

  const setTheme = useCallback((next: Theme) => {
    setThemePreference(next);
  }, []);
  const toggle = useCallback(
    () => setTheme(theme === "dark" ? "light" : "dark"),
    [setTheme, theme],
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
