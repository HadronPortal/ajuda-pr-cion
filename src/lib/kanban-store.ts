import { useSyncExternalStore } from "react";
import { initialCards, type KanbanCard } from "./kanban-data";

let cards: KanbanCard[] = [...initialCards];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

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
    kanbanStore.getSnapshot,
  );
}
