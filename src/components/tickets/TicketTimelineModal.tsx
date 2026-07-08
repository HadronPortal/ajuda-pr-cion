import { useEffect, useMemo, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Info,
  MessageSquare,
  Paperclip,
  PlayCircle,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { SupportTicket } from "@/lib/support-tickets-data";
import type { TicketEvent } from "@/lib/tickets-store";

const kindIcon: Record<TicketEvent["kind"], typeof Info> = {
  created: MessageSquare,
  attached: Paperclip,
  assumed: UserPlus,
  attend: PlayCircle,
  status: ShieldCheck,
  message: Send,
  note: FileText,
  closed: CheckCircle2,
};

const kindLabel: Record<TicketEvent["kind"], string> = {
  created: "Chamado criado",
  attached: "Arquivo anexado",
  assumed: "Chamado assumido",
  attend: "Atendimento iniciado",
  status: "Status alterado",
  message: "Retorno enviado",
  note: "Nota interna",
  closed: "Chamado encerrado",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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

  const [active, setActive] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (open) setActive(Math.max(0, sorted.length - 1));
  }, [open, sorted.length]);

  useEffect(() => {
    const el = dotRefs.current[active];
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [active]);

  const current = sorted[active];
  const canPrev = active > 0;
  const canNext = active < sorted.length - 1;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:w-[calc(100vw-2rem)] md:w-[820px] lg:w-[920px]">
        <DialogTitle className="sr-only">Timeline do chamado {ticket.protocol}</DialogTitle>

        <header className="shrink-0 border-b border-border bg-card px-5 py-4 md:px-6">
          <h2 className="text-[16px] font-bold text-foreground">Timeline do chamado</h2>
          <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">{ticket.protocol}</span>
            {" · "}
            {ticket.subject}
            {" · "}
            {ticket.clientName}
          </p>
        </header>

        <div className="flex-1 min-h-0 overflow-y-auto bg-muted/30 px-5 py-6 md:px-8">
          {sorted.length === 0 ? (
            <p className="py-16 text-center text-[13px] text-muted-foreground">
              Nenhum evento registrado ainda.
            </p>
          ) : (
            <>
              {/* Horizontal rail */}
              <div className="relative">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => canPrev && setActive((i) => i - 1)}
                    disabled={!canPrev}
                    aria-label="Evento anterior"
                    className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <div
                    ref={railRef}
                    className="relative flex-1 overflow-x-auto pb-2"
                  >
                    <div className="relative min-w-full px-4">
                      {/* Line */}
                      <div className="absolute left-4 right-4 top-[42px] h-px bg-border" />
                      <div
                        className="absolute top-[42px] h-px bg-primary transition-all"
                        style={{
                          left: 16,
                          width:
                            sorted.length > 1
                              ? `calc(${(active / (sorted.length - 1)) * 100}% * ((100% - 32px) / 100%))`
                              : 0,
                        }}
                      />
                      <ul
                        className="relative flex items-start justify-between gap-6"
                        style={{ minWidth: `${sorted.length * 110}px` }}
                      >
                        {sorted.map((ev, idx) => {
                          const isActive = idx === active;
                          const isPast = idx < active;
                          return (
                            <li
                              key={ev.id}
                              className="flex min-w-[90px] flex-col items-center"
                            >
                              <span
                                className={cn(
                                  "mb-2 text-[10.5px] font-semibold uppercase tracking-wide",
                                  isActive ? "text-primary" : "text-muted-foreground",
                                )}
                              >
                                {formatDate(ev.when)}
                              </span>
                              <button
                                ref={(el) => {
                                  dotRefs.current[idx] = el;
                                }}
                                type="button"
                                onClick={() => setActive(idx)}
                                aria-label={kindLabel[ev.kind]}
                                className={cn(
                                  "relative z-10 grid h-5 w-5 cursor-pointer place-items-center rounded-full border-2 bg-background transition",
                                  isActive
                                    ? "border-primary ring-4 ring-primary/20"
                                    : isPast
                                      ? "border-primary bg-primary"
                                      : "border-border hover:border-primary/60",
                                )}
                              >
                                {isActive && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                )}
                              </button>
                              <span
                                className={cn(
                                  "mt-2 max-w-[110px] truncate text-center text-[11px] font-medium",
                                  isActive ? "text-foreground" : "text-muted-foreground",
                                )}
                              >
                                {kindLabel[ev.kind]}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => canNext && setActive((i) => i + 1)}
                    disabled={!canNext}
                    aria-label="Próximo evento"
                    className="grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Event detail */}
              {current && (
                <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-[0_6px_18px_rgba(25,29,51,0.05)]">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      {(() => {
                        const Icon = kindIcon[current.kind];
                        return <Icon className="h-5 w-5" />;
                      })()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="text-[15px] font-bold text-foreground">
                          {kindLabel[current.kind]}
                        </h3>
                        <span className="text-[11.5px] text-muted-foreground">
                          {formatDateTime(current.when)}
                        </span>
                      </div>
                      <p className="mt-1 text-[13px] leading-relaxed text-foreground">
                        {current.description}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-semibold text-foreground">
                          Operador: {current.actor}
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium capitalize text-muted-foreground">
                          {current.actorType}
                        </span>
                        <span className="ml-auto text-[11px] text-muted-foreground">
                          Evento {active + 1} de {sorted.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
