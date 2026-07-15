import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { SupportTicket } from "@/lib/support-tickets-data";
import type { TicketEvent } from "@/lib/tickets-store";
import { TicketTimelineList } from "./TicketTimelineList";

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
          <TicketTimelineList events={events} variant="full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
