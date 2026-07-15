import { useState } from "react";
import { PastAttendanceDetailModal } from "./PastAttendanceDetailModal";
import { TicketHistoryList } from "./TicketHistoryList";
import { History, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  SupportTicket,
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
  const [selected, setSelected] = useState<PastAttendance | null>(null);

  if (!ticket) return null;

  const shown = showAll ? historyItems : historyItems.slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-h-[calc(100vh-2rem)] w-[calc(100vw-2rem)] max-w-[760px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">
          Histórico do chamado {ticket.protocol}
        </DialogTitle>

        <header className="relative shrink-0 border-b border-border bg-card px-5 py-4 md:px-7 md:py-5">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="absolute right-3 top-3 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex flex-wrap items-start gap-3 pr-10">
            <span
              aria-hidden
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
            >
              <History className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] font-medium leading-tight text-foreground">
                Histórico
              </h2>
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
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

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide",
                    statusTone[ticket.status],
                  )}
                >
                  {ticket.status}
                </Badge>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-muted/30 px-4 py-5 md:px-6">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-baseline gap-1.5">
              <span className="text-[13px] font-bold text-foreground">
                Atendimentos
              </span>
              <span className="text-[12px] font-medium text-muted-foreground">
                ({historyItems.length})
              </span>
            </div>
            {historyItems.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAll((v) => !v)}
                className="cursor-pointer text-[12px] font-medium text-primary hover:underline"
              >
                {showAll ? "Recolher" : "Ver todos"}
              </button>
            )}
          </div>

          <TicketHistoryList items={shown} onSelect={setSelected} timeline />
        </div>
      </DialogContent>
      <PastAttendanceDetailModal
        open={selected !== null}
        onOpenChange={(v) => !v && setSelected(null)}
        attendance={selected}
        ticket={ticket}
      />
    </Dialog>
  );
}

