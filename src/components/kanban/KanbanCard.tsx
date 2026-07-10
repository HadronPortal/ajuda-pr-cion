import {
  CalendarDays,
  CheckCircle2,
  FileStack,
  Gauge,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Sparkles,
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
  type KanbanCard as CardType,
  kanbanMembers,
} from "@/lib/kanban-data";

function formatDue(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  if (diff < 0) return { label: dateStr, caption: "atrasado", tone: "danger" as const };
  if (diff === 0) return { label: dateStr, caption: "hoje", tone: "warn" as const };
  if (diff <= 3) return { label: dateStr, caption: `${diff} dias`, tone: "warn" as const };
  return { label: dateStr, caption: `${diff} dias`, tone: "muted" as const };
}

function getPriorityMeta(priority: string) {
  const normalized = priority.toLowerCase();

  if (normalized.includes("baixa")) {
    return {
      label: "Baixa",
      accent: "bg-emerald-400",
      badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-300/20",
      orb: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/12 dark:text-emerald-200",
    };
  }

  if (normalized.includes("alta")) {
    return {
      label: "Alta",
      accent: "bg-amber-400",
      badge: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-300/20",
      orb: "bg-amber-100 text-amber-800 dark:bg-amber-400/12 dark:text-amber-200",
    };
  }

  if (normalized.includes("cr")) {
    return {
      label: "Crítica",
      accent: "bg-rose-500",
      badge: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-300/20",
      orb: "bg-rose-100 text-rose-700 dark:bg-rose-400/12 dark:text-rose-200",
    };
  }

  return {
    label: "Média",
    accent: "bg-sky-400",
    badge: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-200 dark:ring-sky-300/20",
    orb: "bg-sky-100 text-sky-700 dark:bg-sky-400/12 dark:text-sky-200",
  };
}

const dueTone = {
  danger: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-300/20",
  warn: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-300/20",
  muted: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/7 dark:text-slate-300 dark:ring-white/10",
};

function getTypeTone(type: string) {
  const normalized = type.toLowerCase();
  if (normalized.includes("bug")) return "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-400/10 dark:text-rose-200 dark:ring-rose-300/20";
  if (normalized.includes("melhoria")) return "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-400/10 dark:text-emerald-200 dark:ring-emerald-300/20";
  if (normalized.includes("implanta")) return "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-400/10 dark:text-indigo-200 dark:ring-indigo-300/20";
  if (normalized.includes("documenta")) return "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/7 dark:text-slate-200 dark:ring-white/10";
  return "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-400/10 dark:text-sky-200 dark:ring-sky-300/20";
}

export function KanbanCardItem({
  card,
  onClick,
  onArchive,
  overlay = false,
}: {
  card: CardType;
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
  const participants = (card.participants ?? [])
    .map((id) => kanbanMembers.find((m) => m.id === id))
    .filter(Boolean) as typeof kanbanMembers;
  const allAssignees = [assignee, ...participants.filter((p) => p.id !== assignee?.id)].filter(Boolean) as typeof kanbanMembers;
  const shownAssignees = allAssignees.slice(0, 3);
  const extraAssignees = Math.max(0, allAssignees.length - shownAssignees.length);

  const due = formatDue(card.dueDate);
  const total = card.checklist?.length ?? 0;
  const done = card.checklist?.filter((c) => c.done).length ?? 0;
  const priority = getPriorityMeta(card.priority);
  const syntheticTotal = total || (priority.label === "Crítica" ? 8 : priority.label === "Alta" ? 7 : 6);
  const syntheticDone = total ? done : Math.max(1, Math.min(syntheticTotal, Math.round((card.comments + card.attachments + 2) / 2)));
  const progress = Math.round((syntheticDone / syntheticTotal) * 100);
  const tags = card.tags?.slice(0, 2) ?? [];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group/card relative z-0 h-[300px] transition-[z-index] hover:z-50",
        isDragging && !overlay && "opacity-40",
        overlay && "z-50",
      )}
    >
      <div
      {...attributes}
      {...listeners}
      onClick={(e) => {
        if (isDragging) return;
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "group absolute inset-x-0 top-0 z-0 flex h-[300px] cursor-pointer flex-col overflow-hidden rounded-[16px] border border-slate-200/80 bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.075)] transition-[height,transform,border-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform dark:border-white/10 dark:bg-[#24212d] dark:shadow-[0_18px_42px_rgba(0,0,0,0.24)]",
        "hover:z-50 hover:h-[388px] hover:-translate-y-4 hover:border-primary/25 hover:shadow-[0_30px_56px_rgba(15,23,42,0.16)] dark:hover:shadow-[0_32px_60px_rgba(0,0,0,0.36)]",
        overlay && "shadow-2xl",
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1", priority.accent)} />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl ring-1 ring-black/5 dark:ring-white/10", priority.orb)}>
            <FileStack className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-[14px] font-extrabold leading-snug text-foreground dark:text-white">
              {card.title}
            </p>
            <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground dark:text-slate-400">
              {card.client}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white text-[#7f879f] shadow-sm transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              aria-label="Ações do card"
            >
              <MoreHorizontal className="h-4 w-4" />
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

      <div className="mb-4 rounded-xl border border-slate-200/70 bg-slate-50 p-3 dark:border-white/10 dark:bg-[#1f1c27]">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground dark:text-slate-400">
            <Gauge className="h-3.5 w-3.5 text-primary" />
            Avanço
          </span>
          <span className="text-[12px] font-black tabular-nums text-foreground dark:text-white">
            {progress}%
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-white/10">
          <div
            className={cn("h-full rounded-full transition-all", priority.accent)}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-4 flex h-[62px] flex-wrap content-start gap-1.5 overflow-hidden">
        <span className={cn("inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[10.5px] font-bold ring-1", getTypeTone(card.type))}>
          <Sparkles className="h-3 w-3" />
          {card.type}
        </span>
        <span className={cn("inline-flex h-7 items-center rounded-full px-2.5 text-[10.5px] font-bold ring-1", priority.badge)}>
          {priority.label}
        </span>
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex h-7 max-w-[110px] items-center rounded-full bg-slate-100 px-2.5 text-[10px] font-bold text-slate-600 ring-1 ring-slate-200 dark:bg-white/7 dark:text-slate-300 dark:ring-white/10"
          >
            <span className="truncate">#{tag}</span>
          </span>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className={cn("rounded-xl px-3 py-2 ring-1", dueTone[due.tone])}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
            <CalendarDays className="h-3 w-3" />
            Prazo
          </div>
          <div className="mt-1 text-[12px] font-black">{due.label}</div>
          <div className="text-[10px] font-semibold opacity-75">{due.caption}</div>
        </div>
        <div className="rounded-xl bg-slate-100 px-3 py-2 text-slate-600 ring-1 ring-slate-200 dark:bg-white/7 dark:text-slate-300 dark:ring-white/10">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            Checklist
          </div>
          <div className="mt-1 text-[12px] font-black text-foreground dark:text-white">{syntheticDone}/{syntheticTotal}</div>
          <div className="text-[10px] font-semibold text-muted-foreground dark:text-slate-400">itens</div>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3 dark:border-white/10">
        <div className="flex -space-x-2">
          {shownAssignees.map((m) => (
            <Avatar key={m.id} className="h-8 w-8 border-2 border-white shadow-sm dark:border-[#24212d]">
              <AvatarFallback className={cn("text-[10px] font-black", m.color)}>
                {m.initials}
              </AvatarFallback>
            </Avatar>
          ))}
          {extraAssignees > 0 && (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-[10px] font-black text-muted-foreground ring-2 ring-white dark:bg-white/10 dark:ring-[#24212d]">
              +{extraAssignees}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {card.comments > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-muted-foreground dark:bg-white/7 dark:text-slate-300">
              <MessageSquare className="h-3.5 w-3.5" />
              {card.comments}
            </span>
          )}
          {card.attachments > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-muted-foreground dark:bg-white/7 dark:text-slate-300">
              <Paperclip className="h-3.5 w-3.5" />
              {card.attachments}
            </span>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
