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
    return { label: "Baixa", accent: "bg-emerald-400", strip: "bg-emerald-500" };
  }
  if (normalized.includes("alta")) {
    return { label: "Alta", accent: "bg-rose-400", strip: "bg-orange-500" };
  }
  if (normalized.includes("cr")) {
    return { label: "Crítica", accent: "bg-red-500", strip: "bg-red-600" };
  }
  return { label: "Média", accent: "bg-amber-400", strip: "bg-yellow-400" };
}

const TAG_COLORS: { match: RegExp; className: string }[] = [
  { match: /fiscal|nf|sped|icms/i, className: "bg-sky-500" },
  { match: /financ|pix|boleto|comiss/i, className: "bg-emerald-500" },
  { match: /estoque|wms|log/i, className: "bg-indigo-500" },
  { match: /performance|bug/i, className: "bg-rose-500" },
  { match: /doc|api/i, className: "bg-violet-500" },
  { match: /ux|design|release/i, className: "bg-pink-500" },
  { match: /implant|migra|produ/i, className: "bg-teal-500" },
  { match: /seg|2fa|infra/i, className: "bg-amber-500" },
];

function getTagColor(tag: string) {
  return TAG_COLORS.find((t) => t.match.test(tag))?.className ?? "bg-slate-400";
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
      {/* Trello-style label strips */}
      <div className="mb-2 flex flex-wrap gap-1">
        <span
          title={`Prioridade: ${priority.label}`}
          className={cn("h-2 w-10 rounded-full", priority.strip)}
        />
        {card.tags?.slice(0, 6).map((t) => (
          <span
            key={t}
            title={t}
            className={cn("h-2 w-10 rounded-full opacity-90", getTagColor(t))}
          />
        ))}
      </div>

      <div className="mb-2 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="line-clamp-2 text-[12px] font-semibold leading-snug text-slate-900 dark:text-white">
            {card.title}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500 line-clamp-1 dark:text-slate-400">
            {card.client} <span className="text-slate-400 dark:text-slate-600">•</span> {card.module}
          </p>
        </div>
        <div className="flex shrink-0 items-center">
          <KanbanCardMenu
            card={card}
            columns={columns}
            onOpen={onClick}
            onArchive={onArchive}
          />
        </div>
      </div>

      <div className="flex items-center gap-3 text-[10px] text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center gap-1" title="Prazo">
          <CalendarDays className="h-3 w-3" />
          {formatDue(card.dueDate)}
        </span>
        {card.comments > 0 && (
          <span className="inline-flex items-center gap-1" title="Comentários">
            <MessageSquare className="h-3 w-3" />
            {card.comments}
          </span>
        )}
        {card.attachments > 0 && (
          <span className="inline-flex items-center gap-1" title="Anexos">
            <Paperclip className="h-3 w-3" />
            {card.attachments}
          </span>
        )}
        {card.checklist && card.checklist.length > 0 && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded px-1.5 py-0.5",
              progress === 100
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                : "text-slate-500 dark:text-slate-400",
            )}
            title="Checklist"
          >
            ☑ {done}/{total}
          </span>
        )}
        <span className="ml-auto flex items-center">
          {assignee && (
            <Avatar className="h-6 w-6 border border-slate-200 dark:border-white/10">
              <AvatarFallback className={cn("text-[9px] font-black", assignee.color)}>
                {assignee.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </span>
      </div>
  );
}
