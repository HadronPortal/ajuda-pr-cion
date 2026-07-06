import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { KanbanCardItem } from "./KanbanCard";
import type { KanbanCard, KanbanColumn } from "@/lib/kanban-data";

export function KanbanColumnView({
  column,
  cards,
  onCardClick,
  onAddCard,
}: {
  column: KanbanColumn;
  cards: KanbanCard[];
  onCardClick: (card: KanbanCard) => void;
  onAddCard: (columnId: KanbanColumn["id"]) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <div className="flex flex-col min-w-[300px] w-[300px] shrink-0 snap-start">
      <div className="flex items-center justify-between px-1 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold truncate">{column.title}</span>
          <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {cards.length}
          </span>
        </div>
        <button
          onClick={() => onAddCard(column.id)}
          className="text-muted-foreground hover:text-foreground transition"
          aria-label="Adicionar card"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-xl border border-border/60 bg-muted/40 p-2 transition-colors min-h-[200px]",
          isOver && "bg-primary/5 border-primary/40",
        )}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
            {cards.map((c) => (
              <KanbanCardItem key={c.id} card={c} onClick={() => onCardClick(c)} />
            ))}
          </div>
        </SortableContext>

        <button
          onClick={() => onAddCard(column.id)}
          className="mt-2.5 w-full flex items-center justify-center gap-1.5 rounded-lg border border-dashed border-border py-2 text-xs text-muted-foreground hover:bg-card hover:text-foreground transition"
        >
          <Plus className="h-3.5 w-3.5" /> Novo card
        </button>
      </div>
    </div>
  );
}
