import { useMemo, useState, type ReactNode } from "react";
import { CalendarClock, Car, Clock3, Users } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { ticketsStore } from "@/lib/tickets-store";
import type { SupportTicket } from "@/lib/support-tickets-data";

const EVENT_TYPES = ["Visita", "Reunião remota", "Reunião PRC"];
const RESPONSIBLES = ["PRCSUZ", "PRCROG", "PRCMAR", "PRCLCZ", "PRCPED", "PRCGGC"];
const VEHICLES = ["Não definido", "Veículo 01", "Veículo 02", "Veículo 03"];
const selectClass = "h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring";
const preventOutsideClose = (event: Event) => event.preventDefault();

export function ScheduleEventModal({ open, onOpenChange, ticket }: { open: boolean; onOpenChange: (value: boolean) => void; ticket: SupportTicket }) {
  const defaultModule = useMemo(() => ticket.module.split(" - ")[0] || ticket.module, [ticket.module]);
  const defaultSubmodule = useMemo(() => ticket.module.split(" - ").slice(1).join(" - ") || "Geral", [ticket.module]);
  const [type, setType] = useState(EVENT_TYPES[1]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [responsible, setResponsible] = useState(ticket.owner || RESPONSIBLES[0]);
  const [guests, setGuests] = useState("");
  const [vehicle, setVehicle] = useState(VEHICLES[0]);
  const [module, setModule] = useState(defaultModule);
  const [submodule, setSubmodule] = useState(defaultSubmodule);
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(true);

  const reset = () => {
    setType(EVENT_TYPES[1]); setDate(""); setStartTime(""); setEndTime("");
    setResponsible(ticket.owner || RESPONSIBLES[0]); setGuests(""); setVehicle(VEHICLES[0]);
    setModule(defaultModule); setSubmodule(defaultSubmodule); setDescription(""); setReminder(true);
  };
  const submit = () => {
    if (!date || !startTime || !endTime || !responsible || !module || !submodule) {
      toast.error("Preencha os campos obrigatórios."); return;
    }
    if (endTime <= startTime) { toast.error("O horário final deve ser posterior ao inicial."); return; }
    ticketsStore.scheduleEvent(ticket.id, {
      type, date, startTime, endTime, responsible,
      guests: guests.trim() || undefined,
      vehicle: type === "Visita" && vehicle !== VEHICLES[0] ? vehicle : undefined,
      module, submodule, description: description.trim() || undefined, reminder,
    });
    toast.success("Evento agendado", { description: `${date} · ${startTime} às ${endTime}` });
    reset(); onOpenChange(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent onPointerDownOutside={preventOutsideClose} onInteractOutside={preventOutsideClose} onEscapeKeyDown={preventOutsideClose} style={{ maxHeight: "calc(100vh - 2rem)" }} className="flex w-[calc(100vw-2rem)] max-w-[940px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden">
      <DialogTitle className="sr-only">Agendar evento {ticket.protocol}</DialogTitle>
      <DetailModalHeader icon={CalendarClock} title="Agendar evento" protocol={ticket.protocol} onClose={() => onOpenChange(false)} meta={<span className="inline-flex items-center gap-1"><span className="text-primary">{ticket.clientCode}</span><span className="text-border">·</span><span>{ticket.clientName}</span></span>} />
      <div className="flex-1 space-y-2.5 overflow-y-auto bg-card px-5 py-3 md:px-6">
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field label="Tipo do evento" required><select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>{EVENT_TYPES.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Responsável" required><select value={responsible} onChange={(e) => setResponsible(e.target.value)} className={selectClass}>{RESPONSIBLES.map((item) => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          <Field label="Data" required><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Field label="Início" required><div className="relative"><Clock3 className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-8" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} /></div></Field>
          <Field label="Término" required><Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} /></Field>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field label="Módulo" required><Input value={module} onChange={(e) => setModule(e.target.value)} /></Field>
          <Field label="Submódulo" required><Input value={submodule} onChange={(e) => setSubmodule(e.target.value)} /></Field>
        </div>
        <div className={type === "Visita" ? "grid gap-2.5 sm:grid-cols-2" : "grid gap-2.5"}>
          <Field label="Convidados"><div className="relative"><Users className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input className="pl-8" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Nomes ou e-mails, separados por vírgula" /></div></Field>
          {type === "Visita" && <Field label="Veículo"><div className="relative"><Car className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={`${selectClass} pl-8`}>{VEHICLES.map((item) => <option key={item}>{item}</option>)}</select></div></Field>}
        </div>
        <Field label="Observações"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} maxLength={700} placeholder="Objetivo, orientações e informações para o atendimento..." className="min-h-[64px] w-full resize-none rounded-md border border-input bg-background p-2.5 text-[13px] outline-none focus:ring-2 focus:ring-ring" /></Field>
      </div>
      <DialogFooter className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-card px-5 py-2.5 sm:justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-[11.5px] text-muted-foreground">
          <Checkbox checked={reminder} onCheckedChange={(value) => setReminder(value === true)} className="h-4 w-4 cursor-pointer"/>
          Gerar lembrete
        </label>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button>
          <Button onClick={submit} className="cursor-pointer"><CalendarClock className="mr-1.5 h-4 w-4"/>Agendar evento</Button>
        </div>
      </DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <div><Label className="mb-1.5 block text-[12.5px] font-medium">{label}{required && <span className="text-destructive"> *</span>}</Label>{children}</div>;
}
