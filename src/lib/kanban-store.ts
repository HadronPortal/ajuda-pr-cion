import { useSyncExternalStore } from "react";
import { initialCards, type KanbanCard } from "./kanban-data";
import { saveKanbanCard, deleteKanbanCard } from "./kanban-api";

let cards: KanbanCard[] = [...initialCards];
const listeners = new Set<() => void>();

const emit = () => {
  listeners.forEach((l) => l());
};

const persistCard = (card: KanbanCard) =>
  saveKanbanCard({
    data: {
      id: card.id || undefined,
      columnId: card.columnId,
      title: card.title,
      description: card.description ?? card.summary,
      priority: card.priority,
      dueDate: card.dueDate,
      archived: Boolean(card.archived),
      tags: card.tags,
      memberIds: card.participants?.length ? card.participants : [card.assigneeId],
      client: card.client,
      module: card.module,
      type: card.type,
      summary: card.summary,
      checklist: card.checklist,
      commentsList: card.commentsList,
      attachmentsList: card.attachmentsList,
      activity: card.activity,
    },
  });

export const kanbanStore = {
  getSnapshot: () => cards,
  subscribe: (l: () => void) => {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  hydrate: (nextCards: KanbanCard[]) => {
    cards = nextCards;
    emit();
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
    void persistCard(withId).then(({ id }) => {
      cards = cards.map((item) => (item.id === withId.id ? { ...item, id } : item));
      emit();
    });
    return withId;
  },
  updateCard: (card: KanbanCard) => {
    cards = cards.map((c) => (c.id === card.id ? card : c));
    emit();
    void persistCard(card);
  },
  deleteCard: (id: string) => {
    cards = cards.filter((c) => c.id !== id);
    emit();
    if (/^[0-9a-f-]{36}$/i.test(id)) void deleteKanbanCard({ data: { id } });
  },
};

export function useKanbanCards() {
  return useSyncExternalStore(
    kanbanStore.subscribe,
    kanbanStore.getSnapshot,
    () => initialCards,
  );
}
