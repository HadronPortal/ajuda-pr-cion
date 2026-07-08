import { useState } from "react";
import { toast } from "sonner";
import {
  CalendarClock,
  ChevronRight,
  FileText,
  FolderKanban,
  History,
  UserRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  SupportTicket,
  TicketPriority,
  TicketStatus,
} from "@/lib/support-tickets-data";
import type { PastAttendance } from "@/lib/tickets-store";

const statusTone: Record<TicketStatus, string> = {
  Atrasado: "bg-destructive/12 text-destructive border-destructive/20",
  "Em Aberto": "bg-primary/12 text-primary border-primary/20",
  Ocupado:
    "bg-[#fff1d6] text-[#b66a00] border-[#ffd78a] dark:bg-[#4d3516] dark:text-[#ffd28a] dark:border-[#7a5520]",
  "Em andamento":
    "bg-[#e8f3ff] text-[#246cb5] border-[#bfddff] dark:bg-[#17314e] dark:text-[#9dcaff] dark:border-[#24527d]",
  "Aguardando cliente":
    "bg-[#f2eaff] text-[#7253bd] border-[#d9c9ff] dark:bg-[#2e2549] dark:text-[#c7b8ff] dark:border-[#4b3a78]",
  "Com especialista":
    "bg-[#e7faf1] text-[#1f9860] border-[#bdeed6] dark:bg-[#14382b] dark:text-[#8ee8be] dark:border-[#226447]",
  Agendamento:
    "bg-[#fff8dd] text-[#9c7610] border-[#f4df85] dark:bg-[#403817] dark:text-[#f3d66d] dark:border-[#695b22]",
  Finalizado: "bg-success/12 text-success border-success/20",
  Cancelado: "bg-muted text-muted-foreground border-border",
};

const priorityTone: Record<TicketPriority, string> = {
  Alta: "bg-destructive/12 text-destructive border-destructive/20",
  Media: "bg-warning/16 text-warning-foreground border-warning/30",
  Baixa: "bg-muted text-muted-foreground border-border",
};

function formatCompact(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })} ${d.toLocaleTimeString(
    "pt-BR",
    { hour: "2-digit", minute: "2-digit" },
  )}`;
}

export function TicketHistoryModal({
  open,
  onOpenChange,
  ticket,
  historyItems,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ticket: SupportTicket | null;
  historyItems: PastAttendance[];
}) {
  const [showAll, setShowAll] = useState(false);

  if (!ticket) return null;

  const shown = showAll ? historyItems : historyItems.slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:w-[calc(100vw-2rem)] md:w-[900px] lg:w-[980px]">
        <DialogTitle className="sr-only">
          Histórico do chamado {ticket.protocol}
        </DialogTitle>

        <header className="shrink-0 border-b border-border bg-card px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <History className="h-4 w-4" />
                </span>
                <h2 className="text-[17px] font-bold text-foreground">Histórico</h2>
              </div>
              <p className="mt-1 truncate text-[12px] text-muted-foreground">
                <span className="font-mono font-semibold text-foreground">
                  {ticket.protocol}
                </span>
                {" · "}
                <span className="font-semibold text-foreground">
                  {ticket.clientCode}
                </span>
                {" · "}
                {ticket.clientName}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Status:
            </span>
            <Badge
              className={cn(
                "rounded-md border px-3 py-1 text-[12px] font-bold uppercase tracking-wide",
                statusTone[ticket.status],
              )}
            >
              {ticket.status}
            </Badge>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-muted/30 px-5 py-5 md:px-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold text-foreground">
                Atendimentos
              </span>
              <span className="text-[11px] text-muted-foreground">
                ({historyItems.length})
              </span>
            </div>
            {historyItems.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="cursor-pointer text-[12px] font-semibold text-primary hover:underline"
              >
                {showAll ? "Recolher" : "Ver todos"}
              </button>
            )}
          </div>

          <ul className="divide-y divide-border rounded-xl border border-border bg-card">
            {shown.length === 0 && (
              <li className="px-3 py-6 text-center text-[12px] text-muted-foreground">
                Sem atendimentos anteriores para este cliente.
              </li>
            )}
            {shown.map((h) => (
              <li
                key={h.id}
                className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-3"
              >
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <span
                    className="truncate text-[12.5px] font-semibold uppercase tracking-wide text-foreground"
                    title={h.title}
                  >
                    {h.title}
                  </span>
                  <Badge
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase",
                      statusTone[h.status],
                    )}
                  >
                    {h.status}
                  </Badge>
                </div>
                <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                  <FolderKanban className="h-3 w-3" />
                  <span className="truncate">{h.module}</span>
                </div>
                <Badge
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                    priorityTone[h.priority],
                  )}
                >
                  {h.priority}
                </Badge>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-foreground">
                  <UserRound className="h-3 w-3" />
                  {h.operator}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <CalendarClock className="h-3 w-3" />
                  {formatCompact(h.date)}
                </span>
                <span className="font-mono text-[10.5px] text-muted-foreground">
                  ID {h.protocol}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    toast.info(`Abrir ${h.protocol}`, {
                      description: "Integração com detalhe será feita pela API.",
                    })
                  }
                  className="inline-flex cursor-pointer items-center gap-0.5 text-[11px] font-semibold text-primary hover:underline"
                >
                  Ver chamado
                  <ChevronRight className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
