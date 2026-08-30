import { useSyncExternalStore } from "react";

export type ThemePreference = "dark" | "light";
export type LanguagePreference = "en" | "pt";

type Preferences = Readonly<{
  language: LanguagePreference;
  theme: ThemePreference;
}>;

const LANGUAGE_STORAGE_KEY = "gf-lang";
const THEME_STORAGE_KEY = "gf-theme";
const DEFAULT_PREFERENCES: Preferences = Object.freeze({ language: "pt", theme: "light" });
const listeners = new Set<() => void>();

let snapshot = readStoredPreferences(DEFAULT_PREFERENCES);
let storageListenerAttached = false;

function readStoredPreferences(fallback: Preferences): Preferences {
  if (typeof window === "undefined") return fallback;

  try {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

    return {
      language: storedLanguage === "en" || storedLanguage === "pt" ? storedLanguage : "pt",
      theme: storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light",
    };
  } catch {
    return fallback;
  }
}

function applyPreferencesToDocument(preferences: Preferences) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.lang = preferences.language === "pt" ? "pt-BR" : "en";
  root.classList.toggle("dark", preferences.theme === "dark");
  root.classList.toggle("light", preferences.theme === "light");
  root.style.colorScheme = preferences.theme;
}

function publish(next: Preferences) {
  if (next.language === snapshot.language && next.theme === snapshot.theme) return;

  snapshot = Object.freeze(next);
  applyPreferencesToDocument(snapshot);
  listeners.forEach((listener) => listener());
}

function handleStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== LANGUAGE_STORAGE_KEY && event.key !== THEME_STORAGE_KEY) {
    return;
  }

  publish(readStoredPreferences(snapshot));
}

function subscribe(listener: () => void) {
  listeners.add(listener);

  if (!storageListenerAttached && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
    storageListenerAttached = true;
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && storageListenerAttached && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
      storageListenerAttached = false;
    }
  };
}

function setPreference<Key extends keyof Preferences>(key: Key, value: Preferences[Key]) {
  const next = { ...snapshot, [key]: value };

  try {
    window.localStorage.setItem(
      key === "language" ? LANGUAGE_STORAGE_KEY : THEME_STORAGE_KEY,
      value,
    );
  } catch {
    // A preferência continua válida durante a sessão quando o Web Storage não está disponível.
  }

  publish(next);
}

export function initializePreferences() {
  snapshot = Object.freeze(readStoredPreferences(snapshot));
  applyPreferencesToDocument(snapshot);
}

export function usePreferences() {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => DEFAULT_PREFERENCES,
  );
}

export function setLanguagePreference(language: LanguagePreference) {
  setPreference("language", language);
}

export function setThemePreference(theme: ThemePreference) {
  setPreference("theme", theme);
}
