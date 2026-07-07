import { MessageSquare, Paperclip, MoreHorizontal, Calendar } from "lucide-react";
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
  typeMeta,
} from "@/lib/kanban-data";

function formatDue(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  if (diff < 0) return { label: `Atrasado · ${dateStr}`, tone: "danger" as const };
  if (diff === 0) return { label: "Hoje · " + dateStr, tone: "warn" as const };
  if (diff === 1) return { label: "Amanhã · " + dateStr, tone: "warn" as const };
  if (diff <= 3) return { label: `${diff}d · ${dateStr}`, tone: "warn" as const };
  return { label: dateStr, tone: "muted" as const };
}

const priorityBar: Record<string, string> = {
  Baixa: "bg-muted-foreground/30",
  Média: "bg-primary/70",
  Alta: "bg-warning",
  Crítica: "bg-destructive",
};

const priorityAccent: Record<string, string> = {
  Baixa: "bg-muted-foreground/40",
  Média: "bg-primary",
  Alta: "bg-warning",
  Crítica: "bg-destructive",
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
  const shownAssignees = allAssignees.slice(0, 3);
  const extraAssignees = Math.max(0, allAssignees.length - shownAssignees.length);

  const due = formatDue(card.dueDate);
  const total = card.checklist?.length ?? 0;
  const done = card.checklist?.filter((c) => c.done).length ?? 0;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

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
        "group relative overflow-hidden rounded-xl border border-border/80 bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_1px_3px_rgba(15,23,42,0.03)] cursor-pointer",
        "hover:border-primary/30 hover:shadow-[0_4px_12px_rgba(11,151,196,0.10)] hover:-translate-y-0.5 transition-all duration-200",
        isDragging && !overlay && "opacity-40",
        overlay && "shadow-xl rotate-1",
      )}
    >
      {/* Priority accent bar */}
      <div className={cn("absolute inset-y-0 left-0 w-1", priorityAccent[card.priority])} />

      <div className="p-3.5 pl-4">
        {/* Top row: type + menu */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span
            className={cn(
              "inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md tracking-wide",
              typeMeta[card.type],
            )}
          >
            {card.type}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="opacity-0 group-hover:opacity-100 focus:opacity-100 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition"
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

        {/* Title */}
        <p className="text-[13.5px] font-semibold leading-snug text-foreground line-clamp-2 mb-1">
          {card.title}
        </p>

        {/* Subtitle: client · module */}
        <p className="text-[11px] text-muted-foreground truncate mb-3">
          {card.client} · {card.module}
        </p>

        {/* Progress */}
        {total > 0 && (
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Progresso
              </span>
              <span className="text-[10.5px] font-semibold text-foreground/80">
                {done}/{total}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", priorityBar[card.priority])}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer: date pill + avatars + counts */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10.5px] font-medium px-2 py-1 rounded-md",
              due.tone === "danger" && "bg-destructive/10 text-destructive",
              due.tone === "warn" && "bg-warning/20 text-warning-foreground",
              due.tone === "muted" && "bg-muted text-muted-foreground",
            )}
          >
            <Calendar className="h-3 w-3" />
            {due.label}
          </span>

          <div className="flex items-center gap-2.5">
            {card.comments > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <MessageSquare className="h-3.5 w-3.5" />
                {card.comments}
              </span>
            )}
            {card.attachments > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <Paperclip className="h-3.5 w-3.5" />
                {card.attachments}
              </span>
            )}
            <div className="flex -space-x-1.5">
              {shownAssignees.map((m) => (
                <Avatar key={m.id} className="h-6 w-6 ring-2 ring-card">
                  <AvatarFallback className={cn("text-[9.5px] font-semibold", m.color)}>
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              {extraAssignees > 0 && (
                <div className="grid h-6 w-6 place-items-center rounded-full bg-muted text-[9.5px] font-semibold text-muted-foreground ring-2 ring-card">
                  +{extraAssignees}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
