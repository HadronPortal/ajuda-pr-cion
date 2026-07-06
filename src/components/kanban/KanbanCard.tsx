import { MessageSquare, Paperclip, Calendar, AlertOctagon } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  type KanbanCard as CardType,
  kanbanMembers,
  priorityMeta,
  typeMeta,
} from "@/lib/kanban-data";

function formatDue(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const dateStr = d.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
  if (diff === 0) return { label: "Hoje · " + dateStr, tone: "warn" as const };
  if (diff === 1) return { label: "Amanhã · " + dateStr, tone: "warn" as const };
  if (diff < 0) return { label: `Atrasado · ${dateStr}`, tone: "danger" as const };
  if (diff <= 3) return { label: `${diff}d · ${dateStr}`, tone: "warn" as const };
  return { label: dateStr, tone: "muted" as const };
}

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
  const pMeta = priorityMeta[card.priority];
  const due = formatDue(card.dueDate);
  const isCritical = card.priority === "Crítica";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={(e) => {
        // Ignore clicks that come from a drag
        if (isDragging) return;
        e.stopPropagation();
        onClick?.();
      }}
      className={cn(
        "group relative rounded-lg border border-border bg-card p-3 shadow-sm cursor-pointer",
        "hover:border-primary/40 hover:shadow-md transition-all duration-150",
        isCritical && "border-destructive/30",
        isDragging && !overlay && "opacity-40",
        overlay && "shadow-xl rotate-1",
      )}
    >
      {isCritical && (
        <div className="absolute inset-y-0 left-0 w-0.5 rounded-l-lg bg-destructive" />
      )}

      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-medium text-muted-foreground">{card.id}</span>
        <div className="flex items-center gap-1.5">
          {isCritical && <AlertOctagon className="h-3 w-3 text-destructive" />}
          <Badge className={cn("text-[10px] px-1.5 py-0 font-medium", typeMeta[card.type])}>
            {card.type}
          </Badge>
        </div>
      </div>

      <p className="text-sm font-medium leading-snug mb-2 line-clamp-2">{card.title}</p>

      <div className="flex items-center gap-1.5 flex-wrap mb-2">
        {card.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            className="text-[10px] px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground"
          >
            #{t}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2 text-[11px] text-muted-foreground mb-2">
        <span className="truncate">{card.client}</span>
        <span className="shrink-0 text-[10px]">{card.module}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border/60">
        <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <span className={cn("h-1.5 w-1.5 rounded-full", pMeta.dot)} />
            {card.priority}
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1",
              due.tone === "danger" && "text-destructive font-medium",
              due.tone === "warn" && "text-warning-foreground",
            )}
          >
            <Calendar className="h-3 w-3" />
            {due.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {card.comments > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
              <MessageSquare className="h-3 w-3" />
              {card.comments}
            </span>
          )}
          {card.attachments > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
              <Paperclip className="h-3 w-3" />
              {card.attachments}
            </span>
          )}
          {assignee && (
            <Avatar className="h-6 w-6">
              <AvatarFallback className={cn("text-[10px] font-semibold", assignee.color)}>
                {assignee.initials}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </div>
  );
}
