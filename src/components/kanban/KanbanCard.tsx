import { MessageSquare, MoreHorizontal, Paperclip, Sparkles } from "lucide-react";
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
  if (diff < 0) return { label: dateStr, tone: "danger" as const };
  if (diff <= 3) return { label: dateStr, tone: "warn" as const };
  return { label: dateStr, tone: "muted" as const };
}

const progressTone: Record<string, string> = {
  Baixa: "bg-[#86e3b5]",
  Média: "bg-[#0b97c4]",
  Alta: "bg-[#ffbe55]",
  Crítica: "bg-[#ff6b7a]",
};

const dueTone = {
  danger: "bg-[#ffe8eb] text-[#fb5166]",
  warn: "bg-[#fff4d8] text-[#c47a13]",
  muted: "bg-[#eef5ff] text-[#6677a3]",
};

const priorityLabel: Record<string, string> = {
  Baixa: "Baixa",
  Média: "Média",
  Alta: "Alta",
  Crítica: "Crítica",
};

export function KanbanCardItem({
  card,
  onClick,
  overlay = false,
}: {
  card: CardType;
  onClick?: () => void;
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
  const shownAssignees = allAssignees.slice(0, 2);
  const extraAssignees = Math.max(0, allAssignees.length - shownAssignees.length);

  const due = formatDue(card.dueDate);
  const total = card.checklist?.length ?? 0;
  const done = card.checklist?.filter((c) => c.done).length ?? 0;
  const syntheticTotal = total || (card.priority === "Crítica" ? 8 : card.priority === "Alta" ? 7 : 6);
  const syntheticDone = total ? done : Math.max(1, Math.min(syntheticTotal, Math.round((card.comments + card.attachments + 2) / 2)));
  const progress = Math.round((syntheticDone / syntheticTotal) * 100);

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
        "group relative cursor-pointer rounded-[10px] border border-[#e9edf6] bg-white p-4 shadow-[0_8px_22px_rgba(25,29,51,0.035)] transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_18px_34px_rgba(11,151,196,0.10)]",
        isDragging && !overlay && "opacity-40",
        overlay && "rotate-1 shadow-2xl",
      )}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="line-clamp-2 text-[13.5px] font-bold leading-snug text-[#25293b]">
            {card.title}
          </p>
          <p className="mt-1 truncate text-[11px] font-medium text-[#8b91ad]">
            {card.client} · {card.module}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[#eef1f8] text-[#9aa0bb] transition hover:border-primary/30 hover:bg-accent hover:text-primary"
              aria-label="Ações do card"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
              Abrir detalhes
            </DropdownMenuItem>
            <DropdownMenuItem>Duplicar</DropdownMenuItem>
            <DropdownMenuItem>Copiar link</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              Arquivar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#9298b5]">
            <Sparkles className="h-3 w-3" />
            Progress
          </span>
          <span className="text-[12px] font-semibold tabular-nums text-[#31364d]">
            {syntheticDone}/{syntheticTotal}
          </span>
        </div>
        <div className="h-[3px] overflow-hidden rounded-full bg-[#edf0f5]">
          <div
            className={cn("h-full rounded-full transition-all", progressTone[card.priority])}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            "inline-flex h-7 items-center rounded-md px-2.5 text-[10.5px] font-semibold",
            dueTone[due.tone],
          )}
        >
          {due.label}
        </span>

        <div className="flex min-w-0 items-center gap-2">
          <div className="hidden items-center gap-2 xl:flex">
            {card.comments > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8b91ad]">
                <MessageSquare className="h-3.5 w-3.5" />
                {card.comments}
              </span>
            )}
            {card.attachments > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8b91ad]">
                <Paperclip className="h-3.5 w-3.5" />
                {card.attachments}
              </span>
            )}
          </div>
          <div className="flex -space-x-2">
            {shownAssignees.map((m) => (
              <Avatar key={m.id} className="h-7 w-7 border-2 border-white">
                <AvatarFallback className={cn("text-[10px] font-bold", m.color)}>
                  {m.initials}
                </AvatarFallback>
              </Avatar>
            ))}
            {extraAssignees > 0 && (
              <div className="grid h-7 w-7 place-items-center rounded-md bg-[#f0f2f8] text-[10px] font-bold text-[#8b91ad] ring-2 ring-white">
                +{extraAssignees}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#f1f3f8] pt-2">
        <span className="truncate text-[10.5px] font-semibold uppercase tracking-wide text-primary">
          {card.type}
        </span>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10px] font-bold",
            card.priority === "Crítica" && "bg-[#ffe8eb] text-[#fb5166]",
            card.priority === "Alta" && "bg-[#fff4d8] text-[#c47a13]",
            card.priority === "Média" && "bg-[#e8f7fc] text-primary",
            card.priority === "Baixa" && "bg-[#eafaf1] text-[#23a061]",
          )}
        >
          {priorityLabel[card.priority]}
        </span>
      </div>
    </div>
  );
}
