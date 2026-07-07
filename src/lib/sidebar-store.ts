import { useSyncExternalStore } from "react";

let collapsed = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const sidebarStore = {
  get: () => collapsed,
  set: (v: boolean) => {
    collapsed = v;
    emit();
  },
  toggle: () => {
    collapsed = !collapsed;
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
  return useSyncExternalStore(sidebarStore.subscribe, sidebarStore.get, sidebarStore.get);
}
