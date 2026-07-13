import { useSyncExternalStore } from "react";
import { initialCards, type KanbanCard } from "./kanban-data";

const STORAGE_KEY = "procion-kanban-cards";

function loadInitial(): KanbanCard[] {
  if (typeof window === "undefined") return [...initialCards];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...initialCards];
    const parsed = JSON.parse(raw) as KanbanCard[];
    if (!Array.isArray(parsed) || parsed.length === 0) return [...initialCards];
    return parsed;
  } catch {
    return [...initialCards];
  }
}

let cards: KanbanCard[] = loadInitial();
const listeners = new Set<() => void>();

function persist() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch {
    /* ignore quota */
  }
}

const emit = () => {
  persist();
  listeners.forEach((l) => l());
};

export const kanbanStore = {
  getSnapshot: () => cards,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  setCards: (updater: (prev: KanbanCard[]) => KanbanCard[]) => {
    cards = updater(cards);
    emit();
  },
  addCard: (card: KanbanCard) => {
    const nextId =
      "PRC-" +
      (Math.max(
        0,
        ...cards.map((c) => parseInt(c.id.replace(/\D/g, ""), 10) || 0),
      ) + 1);
    const withId = card.id ? card : { ...card, id: nextId };
    cards = [...cards, withId];
    emit();
    return withId;
  },
  updateCard: (card: KanbanCard) => {
    cards = cards.map((c) => (c.id === card.id ? card : c));
    emit();
  },
  deleteCard: (id: string) => {
    cards = cards.filter((c) => c.id !== id);
    emit();
  },
};

export function useKanbanCards() {
  return useSyncExternalStore(
    kanbanStore.subscribe,
    kanbanStore.getSnapshot,
    () => initialCards,
  );
}
