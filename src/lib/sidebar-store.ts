import { useSyncExternalStore } from "react";

const STORAGE_KEY = "procion:sidebar-collapsed";

function readInitial(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

let collapsed = readInitial();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function persist() {
  try {
    window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
  } catch {}
}

export const sidebarStore = {
  get: () => collapsed,
  set: (v: boolean) => {
    collapsed = v;
    persist();
    emit();
  },
  toggle: () => {
    collapsed = !collapsed;
    persist();
    emit();
  },
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
};

export function useSidebarCollapsed() {
  return useSyncExternalStore(sidebarStore.subscribe, sidebarStore.get, () => false);
}
