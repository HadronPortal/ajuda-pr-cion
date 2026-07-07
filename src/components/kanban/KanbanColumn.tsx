import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CirclePlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { KanbanCardItem } from "./KanbanCard";
import type { KanbanCard, KanbanColumn } from "@/lib/kanban-data";

const columnTints: Record<string, string> = {
  "a-fazer": "bg-sky-50/70 dark:bg-sky-500/5",
  "em-andamento": "bg-amber-50/70 dark:bg-amber-400/5",
  concluido: "bg-emerald-50/70 dark:bg-emerald-500/5",
  arquivado: "bg-violet-50/50 dark:bg-violet-500/5",
};


export function KanbanColumnView({
  column,
  cards,
  onCardClick,
  onArchiveCard,
  onAddCard,
}: {
  column: KanbanColumn;
  cards: KanbanCard[];
  onCardClick: (card: KanbanCard) => void;
  onArchiveCard: (card: KanbanCard) => void;
  onAddCard: (columnId: KanbanColumn["id"]) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return (
    <section
      className={cn(
        "flex min-h-[610px] w-full min-w-0 shrink-0 flex-col rounded-2xl px-3 py-3 md:w-[318px] md:min-w-[318px] md:mx-1.5 md:px-4 md:py-4",
        columnTints[column.id] ?? "bg-muted/40",
      )}
    >
      <div className="mb-4 flex h-9 items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[13px] font-bold text-[#8c91b1]">{column.title}</h2>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#f2f4fa] px-1.5 text-[10px] font-bold text-[#9298b5]">
            {cards.length}
          </span>
        </div>
        <button
          onClick={() => onAddCard(column.id)}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-1.5 py-1 text-[11px] font-semibold text-foreground transition hover:bg-accent hover:text-primary"
          aria-label="Adicionar tarefa"
        >
          <CirclePlus className="h-3.5 w-3.5" />
          Nova tarefa
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-xl border border-dashed border-transparent transition-colors",
          isOver && "border-primary/40 bg-primary/5",
        )}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-4">
            {cards.map((c) => (
              <KanbanCardItem
                key={c.id}
                card={c}
                onClick={() => onCardClick(c)}
                onArchive={onArchiveCard}
              />
            ))}
          </div>
        </SortableContext>

        {cards.length === 0 && (
          <button
            onClick={() => onAddCard(column.id)}
            className="mt-1 flex min-h-[150px] w-full cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#e7ebf4] text-xs font-semibold text-muted-foreground transition hover:border-primary/35 hover:bg-accent/50 hover:text-primary"
          >
            Criar primeiro card
          </button>
        )}
      </div>
    </section>
  );
}
