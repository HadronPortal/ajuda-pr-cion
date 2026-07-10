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

const priorityMeta: Record<
  string,
  {
    label: string;
    rail: string;
    glow: string;
    badge: string;
    progress: string;
    orb: string;
  }
> = {
  Baixa: {
    label: "Baixa",
    rail: "from-emerald-300 via-emerald-400 to-cyan-300",
    glow: "group-hover:shadow-[0_22px_42px_rgba(34,197,94,0.16)]",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-200 dark:ring-emerald-400/20",
    progress: "from-emerald-300 via-emerald-400 to-cyan-300",
    orb: "bg-emerald-300/30 text-emerald-700 dark:bg-emerald-300/15 dark:text-emerald-200",
  },
  "MÃ©dia": {
    label: "MÃ©dia",
    rail: "from-cyan-300 via-sky-400 to-blue-500",
    glow: "group-hover:shadow-[0_22px_42px_rgba(14,165,233,0.18)]",
    badge: "bg-cyan-50 text-cyan-700 ring-cyan-200 dark:bg-cyan-500/12 dark:text-cyan-200 dark:ring-cyan-400/20",
    progress: "from-cyan-300 via-sky-400 to-blue-500",
    orb: "bg-cyan-300/25 text-cyan-700 dark:bg-cyan-300/15 dark:text-cyan-200",
  },
  Alta: {
    label: "Alta",
    rail: "from-amber-300 via-orange-400 to-rose-400",
    glow: "group-hover:shadow-[0_22px_42px_rgba(245,158,11,0.18)]",
    badge: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/12 dark:text-amber-200 dark:ring-amber-400/20",
    progress: "from-amber-300 via-orange-400 to-rose-400",
    orb: "bg-amber-300/25 text-amber-800 dark:bg-amber-300/15 dark:text-amber-200",
  },
  "CrÃ­tica": {
    label: "CrÃ­tica",
    rail: "from-rose-400 via-red-400 to-fuchsia-400",
    glow: "group-hover:shadow-[0_22px_42px_rgba(244,63,94,0.20)]",
    badge: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/12 dark:text-rose-200 dark:ring-rose-400/20",
    progress: "from-rose-400 via-red-400 to-fuchsia-400",
    orb: "bg-rose-300/25 text-rose-700 dark:bg-rose-300/15 dark:text-rose-200",
  },
};

const dueTone = {
  danger: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/12 dark:text-rose-200 dark:ring-rose-400/20",
  warn: "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-500/12 dark:text-amber-200 dark:ring-amber-400/20",
  muted: "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-white/8 dark:text-slate-300 dark:ring-white/10",
};

const typeTone: Record<string, string> = {
  Suporte: "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/12 dark:text-sky-200 dark:ring-sky-400/20",
  Melhoria: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/12 dark:text-emerald-200 dark:ring-emerald-400/20",
  Bug: "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/12 dark:text-rose-200 dark:ring-rose-400/20",
  "ImplantaÃ§Ã£o": "bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/12 dark:text-indigo-200 dark:ring-indigo-400/20",
  "DocumentaÃ§Ã£o": "bg-slate-100 text-slate-700 ring-slate-200 dark:bg-white/8 dark:text-slate-200 dark:ring-white/10",
};

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
  const syntheticTotal = total || (card.priority === "CrÃ­tica" ? 8 : card.priority === "Alta" ? 7 : 6);
  const syntheticDone = total ? done : Math.max(1, Math.min(syntheticTotal, Math.round((card.comments + card.attachments + 2) / 2)));
  const progress = Math.round((syntheticDone / syntheticTotal) * 100);
  const priority = priorityMeta[card.priority] ?? priorityMeta.Baixa;
  const tags = card.tags?.slice(0, 2) ?? [];

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
        "group relative isolate cursor-pointer overflow-hidden rounded-[18px] border border-white/70 bg-white/86 p-4 shadow-[0_18px_38px_rgba(15,23,42,0.08)] backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-[#1e263d]/88 dark:shadow-[0_18px_42px_rgba(0,0,0,0.22)]",
        "before:absolute before:inset-x-4 before:top-0 before:h-px before:bg-white/80 before:content-[''] dark:before:bg-white/20",
        "after:absolute after:-right-14 after:-top-14 after:h-32 after:w-32 after:rounded-full after:bg-primary/10 after:blur-2xl after:transition group-hover:after:scale-125 dark:after:bg-cyan-300/10",
        "hover:-translate-y-1 hover:rotate-[0.35deg] hover:border-primary/25",
        priority.glow,
        isDragging && !overlay && "opacity-40",
        overlay && "rotate-2 scale-[1.02] shadow-2xl",
      )}
    >
      <div className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", priority.rail)} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.9),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.68),transparent_42%)] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(255,255,255,0.09),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.06),transparent_46%)]" />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <div className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-2xl shadow-inner ring-1 ring-white/70 dark:ring-white/10", priority.orb)}>
            <FileStack className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="line-clamp-2 text-[14px] font-extrabold leading-snug text-foreground">
              {card.title}
            </p>
            <p className="mt-1 truncate text-[11px] font-semibold text-muted-foreground">
              {card.client}
            </p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-xl border border-white/70 bg-white/70 text-[#7f879f] shadow-sm transition hover:border-primary/30 hover:bg-primary/10 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              aria-label="AÃ§Ãµes do card"
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

      <div className="mb-4 grid grid-cols-[1fr_auto] items-center gap-3 rounded-2xl border border-slate-200/65 bg-white/62 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] dark:border-white/10 dark:bg-white/[0.045]">
        <div className="min-w-0">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-muted-foreground">
              <Gauge className="h-3.5 w-3.5 text-primary" />
              AvanÃ§o
            </span>
            <span className="text-[12px] font-black tabular-nums text-foreground">
              {progress}%
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r shadow-[0_0_18px_rgba(14,165,233,0.28)] transition-all", priority.progress)}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-950 text-white shadow-[0_12px_28px_rgba(15,23,42,0.22)] dark:bg-white dark:text-slate-950">
          <div className="text-center leading-none">
            <div className="text-base font-black tabular-nums">{syntheticDone}</div>
            <div className="mt-1 text-[9px] font-bold text-white/65 dark:text-slate-500">/{syntheticTotal}</div>
          </div>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        <span className={cn("inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[10.5px] font-bold ring-1", typeTone[card.type])}>
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
        <div className={cn("rounded-2xl px-3 py-2 ring-1", dueTone[due.tone])}>
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
            <CalendarDays className="h-3 w-3" />
            Prazo
          </div>
          <div className="mt-1 text-[12px] font-black">{due.label}</div>
          <div className="text-[10px] font-semibold opacity-75">{due.caption}</div>
        </div>
        <div className="rounded-2xl bg-slate-100 px-3 py-2 text-slate-600 ring-1 ring-slate-200 dark:bg-white/7 dark:text-slate-300 dark:ring-white/10">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
            <CheckCircle2 className="h-3 w-3 text-emerald-500" />
            Checklist
          </div>
          <div className="mt-1 text-[12px] font-black text-foreground">{syntheticDone}/{syntheticTotal}</div>
          <div className="text-[10px] font-semibold text-muted-foreground">itens</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3 dark:border-white/10">
        <div className="flex -space-x-2">
          {shownAssignees.map((m) => (
            <Avatar key={m.id} className="h-8 w-8 border-2 border-white shadow-sm dark:border-[#1e263d]">
              <AvatarFallback className={cn("text-[10px] font-black", m.color)}>
                {m.initials}
              </AvatarFallback>
            </Avatar>
          ))}
          {extraAssignees > 0 && (
            <div className="grid h-8 w-8 place-items-center rounded-full bg-slate-100 text-[10px] font-black text-muted-foreground ring-2 ring-white dark:bg-white/10 dark:ring-[#1e263d]">
              +{extraAssignees}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {card.comments > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-muted-foreground dark:bg-white/7">
              <MessageSquare className="h-3.5 w-3.5" />
              {card.comments}
            </span>
          )}
          {card.attachments > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-muted-foreground dark:bg-white/7">
              <Paperclip className="h-3.5 w-3.5" />
              {card.attachments}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
