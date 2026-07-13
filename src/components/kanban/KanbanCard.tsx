import { CalendarDays, MessageSquare, Paperclip } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import {
  type KanbanCard as CardType,
  type KanbanColumn,
  kanbanMembers,
} from "@/lib/kanban-data";
import { KanbanCardMenu } from "./KanbanCardMenu";


function formatDue(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function getPriorityMeta(priority: string) {
  const normalized = priority.toLowerCase();
  if (normalized.includes("baixa")) {
    return {
      label: "Baixa",
      accent: "bg-emerald-400",
      badge: "bg-emerald-500/18 text-emerald-300 border-emerald-400/20",
    };
  }
  if (normalized.includes("alta")) {
    return {
      label: "Alta",
      accent: "bg-rose-400",
      badge: "bg-rose-500/18 text-rose-300 border-rose-400/20",
    };
  }
  if (normalized.includes("cr")) {
    return {
      label: "Critica",
      accent: "bg-red-400",
      badge: "bg-red-500/18 text-red-300 border-red-400/20",
    };
  }
  return {
    label: "Media",
    accent: "bg-amber-400",
    badge: "bg-amber-500/18 text-amber-300 border-amber-400/20",
  };
}

export function KanbanCardItem({
  card,
  columns = [],
  onClick,
  onArchive,
  overlay = false,
}: {
  card: CardType;
  columns?: KanbanColumn[];
  onClick?: () => void;
  onArchive?: (card: CardType) => void;
  overlay?: boolean;
}) {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "card", card }, disabled: overlay });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const assignee = kanbanMembers.find((m) => m.id === card.assigneeId);
  const priority = getPriorityMeta(card.priority);
  const total = card.checklist?.length || (priority.label === "Alta" ? 7 : 5);
  const done =
    card.checklist?.filter((c) => c.done).length ||
    Math.max(1, Math.min(total, Math.round((card.comments + card.attachments + 2) / 2)));
  const progress = Math.round((done / total) * 100);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (isDragging) return;
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:border-slate-300 hover:bg-slate-50 hover:shadow-md dark:border-white/7 dark:bg-[#101827] dark:text-slate-100 dark:shadow-[0_10px_28px_rgba(0,0,0,0.18)] dark:hover:border-white/14 dark:hover:bg-[#141e30] dark:hover:shadow-[0_18px_34px_rgba(0,0,0,0.28)]",
        isDragging && !overlay && "opacity-40",
        overlay && "rotate-1 shadow-2xl",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="line-clamp-2 text-[12px] font-bold leading-snug text-slate-900 dark:text-white">
            {card.title}
          </p>
          <p className="mt-2 text-[11px] font-medium text-slate-500 line-clamp-2 dark:text-slate-400">
            {card.client} <span className="text-slate-400 dark:text-slate-600">•</span> {card.module}
          </p>
          {card.tags && card.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {card.tags.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="rounded-sm bg-slate-100 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-600 dark:bg-white/8 dark:text-slate-300"
                >
                  {t}
                </span>
              ))}
              {card.tags.length > 4 && (
                <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                  +{card.tags.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <span className={cn("rounded-md border px-1.5 py-0.5 text-[9px] font-bold", priority.badge)}>
            {priority.label}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="grid h-6 w-6 cursor-pointer place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/7 dark:hover:text-white"
                aria-label="Acoes do card"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem className="cursor-pointer" onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
                Abrir detalhes
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Duplicar</DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">Copiar link</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive?.(card);
                }}
              >
                Arquivar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mb-3 flex items-center gap-2 text-[10px] text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          {formatDue(card.dueDate)}
        </span>
        <span className="ml-auto inline-flex items-center gap-1">
          <MessageSquare className="h-3 w-3" />
          {card.comments}
        </span>
        <span className="inline-flex items-center gap-1">
          <Paperclip className="h-3 w-3" />
          {card.attachments}
        </span>
        {assignee && (
          <Avatar className="ml-1 h-6 w-6 border border-slate-200 dark:border-white/10">
            <AvatarFallback className={cn("text-[9px] font-black", assignee.color)}>
              {assignee.initials}
            </AvatarFallback>
          </Avatar>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-white/8">
          <div
            className={cn("h-full rounded-full", priority.accent)}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="w-8 text-right text-[10px] font-semibold text-slate-500 dark:text-slate-400">
          {done}/{total}
        </span>
      </div>
    </div>
  );
}
