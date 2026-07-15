import {
  CalendarClock,
  ChevronRight,
  FileText,
  Folder,
  UserRound,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
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

const priorityChip: Record<TicketPriority, string> = {
  Alta: "bg-destructive/12 text-destructive border-destructive/25",
  Media:
    "bg-[#fff4d1] text-[#8a6300] border-[#f2d97a] dark:bg-[#3a2f10] dark:text-[#f3d66d] dark:border-[#5c4a1c]",
  Baixa: "bg-muted text-muted-foreground border-border",
};

const priorityAccent: Record<TicketPriority, string> = {
  Alta: "bg-destructive",
  Media: "bg-[#e8b53a] dark:bg-[#d1a02b]",
  Baixa: "bg-muted-foreground/40",
};

const priorityIconWrap: Record<TicketPriority, string> = {
  Alta: "bg-destructive/12 text-destructive ring-1 ring-destructive/25",
  Media:
    "bg-[#fff4d1] text-[#8a6300] ring-1 ring-[#f2d97a] dark:bg-[#3a2f10] dark:text-[#f3d66d] dark:ring-[#5c4a1c]",
  Baixa: "bg-primary/10 text-primary ring-1 ring-primary/20",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TicketHistoryList({
  items,
  onSelect,
  compact = false,
}: {
  items: PastAttendance[];
  onSelect: (item: PastAttendance) => void;
  compact?: boolean;
}) {
  const cols = compact
    ? "md:grid-cols-[minmax(0,1fr)_90px_110px_120px_140px_100px]"
    : "md:grid-cols-[minmax(0,1fr)_100px_120px_130px_150px_110px]";

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-3 py-6 text-center text-[12px] text-muted-foreground">
        Sem atendimentos anteriores para este cliente.
      </div>
    );
  }

  return (
    <>
      {/* Cabeçalho de colunas — desktop */}
      <div
        className={cn(
          "mb-2 hidden gap-3 pl-4 pr-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground md:grid",
          cols,
        )}
      >
        <span>Chamado</span>
        <span>Prioridade</span>
        <span>Atendente</span>
        <span>Data / Hora</span>
        <span>ID do chamado</span>
        <span className="text-right">Ações</span>
      </div>

      <ul className="space-y-2">
        {items.map((h) => (
          <li
            key={h.id}
            className="relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_0_rgba(15,23,42,0.03)] transition hover:border-primary/30 hover:shadow-[0_4px_18px_rgba(25,29,51,0.06)]"
          >
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-0 h-full w-1",
                priorityAccent[h.priority],
              )}
            />

            <div
              className={cn(
                "grid grid-cols-1 items-center gap-3 pl-4 pr-3 py-3",
                cols,
              )}
            >
              {/* Chamado */}
              <div className="flex min-w-0 items-start gap-2.5">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center text-muted-foreground"
                  aria-hidden
                >
                  <FileText className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className="truncate text-[12px] font-medium uppercase tracking-wide text-foreground"
                      title={h.title}
                    >
                      {h.title}
                    </span>
                    <Badge
                      className={cn(
                        "shrink-0 rounded-full border px-1.5 py-0 text-[9.5px] font-semibold uppercase tracking-wide",
                        statusTone[h.status],
                      )}
                    >
                      {h.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 inline-flex min-w-0 items-center gap-1 text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
                    <Folder className="h-3 w-3 shrink-0" />
                    <span className="truncate">{h.module}</span>
                  </p>
                </div>
              </div>

              {/* Prioridade */}
              <div className="md:justify-self-start">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide",
                    priorityChip[h.priority],
                  )}
                >
                  {h.priority}
                </span>
              </div>

              {/* Atendente */}
              <div className="flex min-w-0 items-center gap-1.5 text-[11.5px] font-medium text-foreground">
                <span
                  aria-hidden
                  className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/12 text-primary"
                >
                  <UserRound className="h-3 w-3" />
                </span>
                <span className="truncate">{h.operator}</span>
              </div>

              {/* Data / hora */}
              <div className="flex min-w-0 items-center gap-1.5 text-[11px] text-muted-foreground">
                <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                <div className="leading-tight">
                  <p className="font-semibold text-foreground">
                    {formatDate(h.date)}
                  </p>
                  <p>{formatTime(h.date)}</p>
                </div>
              </div>

              {/* ID */}
              <div className="min-w-0 text-[10.5px] font-medium text-muted-foreground">
                <p className="truncate font-mono">
                  <span className="font-semibold uppercase tracking-wide text-muted-foreground/80 md:hidden">
                    ID{" "}
                  </span>
                  {h.protocol}
                </p>
              </div>

              {/* Ver chamado */}
              <button
                type="button"
                onClick={() => onSelect(h)}
                className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-[11px] font-medium text-primary transition hover:bg-primary/20 md:justify-self-end"
              >
                Ver chamado
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
