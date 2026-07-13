import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  ArrowLeftRight,
  Copy,
  Eye,
  EyeOff,
  MoreVertical,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { KanbanCardItem } from "./KanbanCard";
import type { KanbanCard, KanbanColumn } from "@/lib/kanban-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const columnMeta: Record<string, { dot: string; text: string }> = {
  "a-fazer": { dot: "bg-sky-400", text: "text-sky-300" },
  "em-andamento": { dot: "bg-amber-400", text: "text-amber-300" },
  concluido: { dot: "bg-blue-400", text: "text-blue-300" },
  homologacao: { dot: "bg-violet-400", text: "text-violet-300" },
  arquivado: { dot: "bg-emerald-400", text: "text-emerald-300" },
};

export function KanbanColumnView({
  column,
  columns,
  cards,
  onCardClick,
  onArchiveCard,
  onAddCard,
  onDeleteColumn,
  canDeleteColumn = true,
  onCopyColumn,
  onMoveColumn,
  canMoveLeft = false,
  canMoveRight = false,
  isFollowing = false,
  onToggleFollow,
}: {
  column: KanbanColumn;
  columns: KanbanColumn[];
  cards: KanbanCard[];
  onCardClick: (card: KanbanCard) => void;
  onArchiveCard: (card: KanbanCard) => void;
  onAddCard: (columnId: KanbanColumn["id"]) => void;
  onDeleteColumn?: (column: KanbanColumn) => void;
  canDeleteColumn?: boolean;
  onCopyColumn?: (column: KanbanColumn) => void;
  onMoveColumn?: (column: KanbanColumn, direction: "left" | "right") => void;
  canMoveLeft?: boolean;
  canMoveRight?: boolean;
  isFollowing?: boolean;
  onToggleFollow?: (column: KanbanColumn) => void;
}) {

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });
  const meta = columnMeta[column.id] ?? columnMeta["a-fazer"];

  return (
    <section className="relative flex min-h-[470px] w-[270px] shrink-0 flex-col rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-white/7 dark:bg-white/[0.045] dark:shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
      <div className="mb-3 flex h-7 items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className={cn("h-2 w-2 shrink-0 rounded-full", meta.dot)} />
          <h2 className={cn("truncate text-[11px] font-black", meta.text)}>{column.title}</h2>
          <span className="grid h-5 min-w-5 place-items-center rounded-full bg-slate-100 px-1.5 text-[10px] font-black text-slate-600 dark:bg-white/8 dark:text-slate-300">
            {cards.length}
          </span>
          {isFollowing && (
            <span
              title="Você está seguindo esta lista"
              className="grid h-5 w-5 place-items-center rounded-full bg-violet-500/15 text-violet-600 dark:text-violet-300"
            >
              <Eye className="h-3 w-3" />
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="grid h-6 w-6 cursor-pointer place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/7 dark:hover:text-white"
                aria-label={`Ações da lista ${column.title}`}
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Ações da lista
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => onAddCard(column.id)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar cartão
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => onCopyColumn?.(column)}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copiar lista
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="cursor-pointer">
                  <ArrowLeftRight className="mr-2 h-4 w-4" />
                  Mover lista
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    disabled={!canMoveLeft}
                    onSelect={() => onMoveColumn?.(column, "left")}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Mover para a esquerda
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    disabled={!canMoveRight}
                    onSelect={() => onMoveColumn?.(column, "right")}
                  >
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Mover para a direita
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => onToggleFollow?.(column)}
              >
                {isFollowing ? (
                  <>
                    <EyeOff className="mr-2 h-4 w-4" />
                    Deixar de seguir
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    Seguir
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-rose-600 focus:text-rose-600 dark:text-rose-400"
                disabled={!canDeleteColumn}
                onSelect={() => onDeleteColumn?.(column)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Excluir lista
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 rounded-lg border border-dashed border-transparent transition-colors",
          isOver && "border-primary/50 bg-primary/10",
        )}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2.5">
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

        <button
          onClick={() => onAddCard(column.id)}
          className="mt-2 flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/7 dark:hover:text-white"
        >
          <Plus className="h-3 w-3" />
          Adicionar um cartão
        </button>
      </div>
    </section>
  );
}
