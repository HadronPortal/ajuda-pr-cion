import { useMemo } from "react";
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Paperclip,
  PlayCircle,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { SupportTicket } from "@/lib/support-tickets-data";
import type { TicketEvent } from "@/lib/tickets-store";

const eventPresentation: Record<
  TicketEvent["kind"],
  { label: string; color: string; softColor: string; icon: typeof FileText }
> = {
  created: {
    label: "Chamado criado",
    color: "#8b5bd6",
    softColor: "rgba(139, 91, 214, 0.24)",
    icon: MessageSquare,
  },
  attached: {
    label: "Arquivo anexado",
    color: "#f59b45",
    softColor: "rgba(245, 155, 69, 0.24)",
    icon: Paperclip,
  },
  assumed: {
    label: "Chamado assumido",
    color: "#47b985",
    softColor: "rgba(71, 185, 133, 0.24)",
    icon: UserPlus,
  },
  attend: {
    label: "Atendimento iniciado",
    color: "#38a6d9",
    softColor: "rgba(56, 166, 217, 0.24)",
    icon: PlayCircle,
  },
  status: {
    label: "Status alterado",
    color: "#e04d87",
    softColor: "rgba(224, 77, 135, 0.24)",
    icon: ShieldCheck,
  },
  message: {
    label: "Retorno enviado",
    color: "#5877d8",
    softColor: "rgba(88, 119, 216, 0.24)",
    icon: Send,
  },
  note: {
    label: "Nota interna",
    color: "#d79531",
    softColor: "rgba(215, 149, 49, 0.24)",
    icon: FileText,
  },
  closed: {
    label: "Chamado encerrado",
    color: "#20ad74",
    softColor: "rgba(32, 173, 116, 0.24)",
    icon: CheckCircle2,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TicketTimelineModal({
  open,
  onOpenChange,
  ticket,
  events,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ticket: SupportTicket;
  events: TicketEvent[];
}) {
  const sorted = useMemo(
    () =>
      [...events].sort(
        (a, b) => new Date(a.when).getTime() - new Date(b.when).getTime(),
      ),
    [events],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:w-[calc(100vw-2rem)] md:w-[760px] lg:w-[860px]">
        <DialogTitle className="sr-only">
          Timeline completa do chamado {ticket.protocol}
        </DialogTitle>

        <header className="shrink-0 border-b border-border bg-card px-5 py-4 pr-14 md:px-7">
          <h2 className="text-[17px] font-medium text-foreground">Timeline completa</h2>
          <p className="mt-1 truncate text-[12px] text-muted-foreground">
            <span className="font-mono text-foreground">{ticket.protocol}</span>
            {" · "}
            {ticket.subject}
            {" · "}
            {ticket.clientName}
          </p>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto bg-card px-4 py-7 sm:px-7 md:px-10">
          {sorted.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-muted-foreground">
              Nenhum evento registrado ainda.
            </p>
          ) : (
            <ol className="mx-auto max-w-[720px]">
              {sorted.map((event, index) => {
                const presentation = eventPresentation[event.kind];
                const Icon = presentation.icon;
                const isLast = index === sorted.length - 1;

                return (
                  <li
                    key={event.id}
                    className="relative grid min-h-[132px] grid-cols-[76px_minmax(0,1fr)] gap-4 sm:grid-cols-[94px_minmax(0,1fr)] sm:gap-6"
                  >
                    {!isLast && (
                      <span
                        aria-hidden
                        className="absolute left-[37px] top-[66px] h-[calc(100%-42px)] w-[3px] -translate-x-1/2 rounded-full sm:left-[47px]"
                        style={{ backgroundColor: presentation.softColor }}
                      />
                    )}

                    <div className="relative flex justify-center pt-1">
                      <span
                        aria-hidden
                        className="absolute top-0 h-[76px] w-[76px] rounded-full border-[7px] sm:h-[88px] sm:w-[88px]"
                        style={{ borderColor: presentation.softColor }}
                      />
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-[8px] h-2.5 w-2.5 -translate-x-1/2 rounded-full"
                        style={{ backgroundColor: presentation.color }}
                      />
                      <span
                        className="relative mt-[19px] grid h-10 w-10 place-items-center rounded-full text-white shadow-sm sm:mt-[22px] sm:h-11 sm:w-11"
                        style={{ backgroundColor: presentation.color }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-[72px] h-2 w-2 -translate-x-1/2 rounded-full sm:top-[84px]"
                        style={{ backgroundColor: presentation.color }}
                      />
                    </div>

                    <article className="min-w-0 pb-8 pt-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="inline-flex min-w-[112px] items-center justify-center rounded-full px-3 py-1 text-[11px] font-medium text-white shadow-sm"
                          style={{ backgroundColor: presentation.color }}
                        >
                          {formatDate(event.when)}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {formatTime(event.when)}
                        </span>
                      </div>

                      <h3
                        className="mt-3 text-[12px] font-semibold uppercase tracking-normal"
                        style={{ color: presentation.color }}
                      >
                        {presentation.label}
                      </h3>
                      <p className="mt-1 text-[13px] leading-5 text-foreground">
                        {event.description}
                      </p>
                      <p className="mt-1.5 text-[11.5px] text-muted-foreground">
                        {event.actor} · {event.actorType}
                      </p>
                    </article>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
