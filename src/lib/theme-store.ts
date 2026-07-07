import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
const STORAGE_KEY = "procion:theme";

function readInitial(): Theme {
  if (typeof window === "undefined") return "light";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

let theme: Theme = readInitial();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function apply(next: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", next === "dark");
  root.style.colorScheme = next;
}

if (typeof window !== "undefined") apply(theme);

export const themeStore = {
  get: () => theme,
  set: (v: Theme) => {
    theme = v;
    try {
      window.localStorage.setItem(STORAGE_KEY, v);
    } catch {}
    apply(v);
    emit();
  },
  toggle: () => themeStore.set(theme === "dark" ? "light" : "dark"),
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useTheme() {
  return useSyncExternalStore(
    themeStore.subscribe,
    themeStore.get,
    () => "light" as Theme,
  );
}
