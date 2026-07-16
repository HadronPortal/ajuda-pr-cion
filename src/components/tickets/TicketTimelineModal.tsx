import { Clock } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
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
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:w-[calc(100vw-2rem)] md:w-[760px] lg:w-[860px] [&>button]:hidden">
        <DialogTitle className="sr-only">
          Timeline completa do chamado {ticket.protocol}
        </DialogTitle>

        <DetailModalHeader
          icon={Clock}
          title="Timeline completa"
          protocol={ticket.protocol}
          onClose={() => onOpenChange(false)}
          meta={
            <>
              <span className="truncate text-foreground">{ticket.subject}</span>
              <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
              <span className="inline-flex items-center gap-1">
                <span className="font-semibold text-primary">{ticket.clientCode}</span>
                <span aria-hidden className="text-border">·</span>
                <span className="truncate text-foreground">{ticket.clientName}</span>
              </span>
            </>
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto bg-card px-4 py-7 sm:px-7 md:px-10">
          <TicketTimelineList events={events} variant="full" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
