import { useState } from "react";
import { toast } from "sonner";
import { CalendarClock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { ticketsStore } from "@/lib/tickets-store";
import type { SupportTicket } from "@/lib/support-tickets-data";

const EVENT_TYPES = [
  "Reunião",
  "Retorno ao cliente",
  "Follow-up",
  "Visita técnica",
  "Análise interna",
];

const RESPONSIBLES = [
  "PRCSUZ",
  "PRCROG",
  "PRCMAR",
  "PRCLCZ",
  "PRCPED",
];

function preventOutsideClose(e: Event) {
  e.preventDefault();
}

export function ScheduleEventModal({
  open,
  onOpenChange,
  ticket,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ticket: SupportTicket;
}) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState(EVENT_TYPES[0]);
  const [responsible, setResponsible] = useState(RESPONSIBLES[0]);
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(true);

  const reset = () => {
    setTitle("");
    setDate("");
    setTime("");
    setType(EVENT_TYPES[0]);
    setResponsible(RESPONSIBLES[0]);
    setDescription("");
    setReminder(true);
  };

  const submit = () => {
    if (!title.trim() || !date || !time || !type || !responsible) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    ticketsStore.scheduleEvent(ticket.id, {
      title: title.trim(),
      date,
      time,
      type,
      responsible,
      description: description.trim() || undefined,
      reminder,
    });
    toast.success("Evento agendado", {
      description: `${title.trim()} · ${date} ${time}`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={preventOutsideClose}
        onInteractOutside={preventOutsideClose}
        onEscapeKeyDown={preventOutsideClose}
        className="flex max-h-[90vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 sm:w-[calc(100vw-2rem)] md:w-[600px] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Agendar evento {ticket.protocol}</DialogTitle>

        <DetailModalHeader
          icon={CalendarClock}
          title="Agendar evento"
          protocol={ticket.protocol}
          onClose={() => onOpenChange(false)}
          meta={
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold text-primary">{ticket.clientCode}</span>
              <span aria-hidden className="text-border">·</span>
              <span className="truncate text-foreground">{ticket.clientName}</span>
            </span>
          }
        />

        <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4 md:px-6">
          <div>
            <Label className="mb-1.5 block text-[12.5px] font-medium">
              Título do evento <span className="text-destructive">*</span>
            </Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Reunião de alinhamento fiscal"
              maxLength={120}
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-[12.5px] font-medium">
                Data <span className="text-destructive">*</span>
              </Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label className="mb-1.5 block text-[12.5px] font-medium">
                Horário <span className="text-destructive">*</span>
              </Label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1.5 block text-[12.5px] font-medium">
                Tipo do evento <span className="text-destructive">*</span>
              </Label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <Label className="mb-1.5 block text-[12.5px] font-medium">
                Responsável <span className="text-destructive">*</span>
              </Label>
              <select
                value={responsible}
                onChange={(e) => setResponsible(e.target.value)}
                className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
              >
                {RESPONSIBLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-[12.5px] font-medium">
              Descrição / observação
            </Label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Detalhes complementares do evento..."
              className="min-h-[90px] w-full resize-none rounded-md border border-input bg-background p-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-border bg-card px-3 py-2.5">
            <Checkbox
              checked={reminder}
              onCheckedChange={(v) => setReminder(v === true)}
              className="mt-0.5 cursor-pointer"
            />
            <span className="text-[12.5px] text-foreground">
              Gerar lembrete próximo ao horário do evento
            </span>
          </label>
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-border bg-card px-5 py-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-lg"
          >
            Cancelar
          </Button>
          <Button onClick={submit} className="cursor-pointer rounded-lg">
            <CalendarClock className="mr-1.5 h-4 w-4" />
            Agendar evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
