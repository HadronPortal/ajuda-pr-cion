import { useEffect, useMemo, useState, type ReactNode } from "react";
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
import { modulesMap, moduleOptions, splitModule } from "@/lib/modules-map";
import {
  useVehicles,
  useReservations,
  hasReservationConflict,
  createReservation,
  getActiveReservationsByVehicle,
  VEHICLE_STATUS_LABEL,
  type Vehicle,
} from "@/lib/fleet-store";

const EVENT_TYPES = ["Visita", "Reunião remota", "Reunião PRC"];
const RESPONSIBLES = ["PRCSUZ", "PRCROG", "PRCMAR", "PRCLCZ", "PRCPED", "PRCGGC"];
const NO_VEHICLE = "__none__";
const selectClass =
  "h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring";
const preventOutsideClose = (event: Event) => event.preventDefault();

type VehicleAvailability =
  | { key: "disponivel"; label: "Disponível"; conflict?: undefined }
  | { key: "em_uso"; label: "Em uso"; conflict?: undefined }
  | { key: "indisponivel"; label: "Indisponível"; conflict?: undefined }
  | { key: "pre_agendado"; label: "Pré-agendado"; conflict?: boolean };

function combineDateTime(date: string, time: string): string | null {
  if (!date || !time) return null;
  return `${date}T${time}:00`;
}

function evaluateVehicle(
  vehicle: Vehicle,
  windowStart: string | null,
  windowEnd: string | null,
): VehicleAvailability {
  if (vehicle.status === "manutencao") return { key: "indisponivel", label: "Indisponível" };
  if (vehicle.status === "em_uso") return { key: "em_uso", label: "Em uso" };
  const reservations = getActiveReservationsByVehicle(vehicle.id);
  if (reservations.length === 0) return { key: "disponivel", label: "Disponível" };
  if (!windowStart || !windowEnd) {
    // Reservado em algum outro horário — deixamos como pré-agendado sem definir conflito.
    return { key: "pre_agendado", label: "Pré-agendado", conflict: false };
  }
  const conflict = hasReservationConflict(vehicle.id, windowStart, windowEnd);
  return { key: "pre_agendado", label: "Pré-agendado", conflict: !!conflict };
}

export function ScheduleEventModal({
  open,
  onOpenChange,
  ticket,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  ticket: SupportTicket;
}) {
  const vehicles = useVehicles();
  useReservations(); // re-render on reservation changes
  const defaults = useMemo(() => splitModule(ticket.module), [ticket.module]);
  const [type, setType] = useState(EVENT_TYPES[1]);
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [responsible, setResponsible] = useState(ticket.owner || RESPONSIBLES[0]);
  const [guests, setGuests] = useState("");
  const [vehicleId, setVehicleId] = useState(NO_VEHICLE);
  const [module, setModule] = useState(defaults.module);
  const [submodule, setSubmodule] = useState(defaults.submodule);
  const [description, setDescription] = useState("");
  const [reminder, setReminder] = useState(true);

  const availableSubs = modulesMap[module] ?? [];
  const windowStart = combineDateTime(date, startTime);
  const windowEnd = combineDateTime(date, endTime);
  const windowValid = !!(windowStart && windowEnd && windowEnd > windowStart);

  const vehicleAvailability = useMemo(() => {
    const map = new Map<string, VehicleAvailability>();
    for (const v of vehicles) {
      map.set(v.id, evaluateVehicle(v, windowValid ? windowStart : null, windowValid ? windowEnd : null));
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles, windowStart, windowEnd, windowValid]);

  useEffect(() => {
    // Se o veículo escolhido virou incompatível (conflito ou indisponível), limpa.
    if (vehicleId === NO_VEHICLE) return;
    const info = vehicleAvailability.get(vehicleId);
    if (!info) return;
    if (info.key === "em_uso" || info.key === "indisponivel" || (info.key === "pre_agendado" && info.conflict)) {
      setVehicleId(NO_VEHICLE);
      toast.info("Veículo indisponível no período selecionado. Escolha outro.");
    }
  }, [vehicleAvailability, vehicleId]);

  const changeModule = (value: string) => {
    setModule(value);
    const subs = modulesMap[value] ?? [];
    if (!subs.includes(submodule)) setSubmodule(subs[0] ?? "");
  };

  const reset = () => {
    setType(EVENT_TYPES[1]); setDate(""); setStartTime(""); setEndTime("");
    setResponsible(ticket.owner || RESPONSIBLES[0]); setGuests(""); setVehicleId(NO_VEHICLE);
    setModule(defaults.module); setSubmodule(defaults.submodule);
    setDescription(""); setReminder(true);
  };

  const submit = () => {
    if (!date || !startTime || !endTime || !responsible || !module || !submodule) {
      toast.error("Preencha os campos obrigatórios."); return;
    }
    if (endTime <= startTime) { toast.error("O horário final deve ser posterior ao inicial."); return; }

    let vehicleLabel: string | undefined;
    let reservationId: string | undefined;

    if (vehicleId !== NO_VEHICLE) {
      const vehicle = vehicles.find((v) => v.id === vehicleId);
      if (!vehicle) { toast.error("Veículo não encontrado."); return; }
      if (!windowStart || !windowEnd) { toast.error("Informe data e horários para reservar veículo."); return; }
      const info = vehicleAvailability.get(vehicleId);
      if (info && (info.key === "em_uso" || info.key === "indisponivel")) {
        toast.error("Veículo indisponível para reserva."); return;
      }
      const created = createReservation({
        vehicleId: vehicle.id,
        operatorId: responsible,
        startAt: windowStart,
        endAt: windowEnd,
        ticketId: ticket.id,
        customerId: ticket.clientCode,
        destination: `${ticket.clientCode || "—"} · ${ticket.clientName || "Cliente não vinculado"}`,
      });
      if ("error" in created) {
        toast.error("Conflito de agenda para o veículo escolhido.", {
          description: `Já existe pré-reserva de ${new Date(created.conflict.startAt).toLocaleString("pt-BR")} até ${new Date(created.conflict.endAt).toLocaleString("pt-BR")}.`,
        });
        return;
      }
      reservationId = created.id;
      vehicleLabel = `${vehicle.model} · ${vehicle.plate}`;
    }

    ticketsStore.scheduleEvent(ticket.id, {
      type, date, startTime, endTime, responsible,
      guests: guests.trim() || undefined,
      vehicle: vehicleLabel,
      module, submodule, description: description.trim() || undefined, reminder,
    });
    toast.success("Evento agendado", {
      description: `${date} · ${startTime} às ${endTime}${reservationId ? " · veículo pré-agendado" : ""}`,
    });
    reset(); onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={preventOutsideClose}
        onInteractOutside={preventOutsideClose}
        onEscapeKeyDown={preventOutsideClose}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        className="flex w-[calc(100vw-2rem)] max-w-[940px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Agendar evento {ticket.protocol}</DialogTitle>
        <DetailModalHeader
          icon={CalendarClock}
          title="Agendar evento"
          protocol={ticket.protocol}
          onClose={() => onOpenChange(false)}
          meta={
            <span className="inline-flex items-center gap-1">
              <span className="text-primary">{ticket.clientCode || "—"}</span>
              <span className="text-border">·</span>
              <span>{ticket.clientName || "Cliente não vinculado"}</span>
            </span>
          }
        />
        <div className="flex-1 space-y-2.5 overflow-y-auto bg-card px-5 py-3 md:px-6">
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="Tipo do evento" required>
              <select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>
                {EVENT_TYPES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Responsável" required>
              <select value={responsible} onChange={(e) => setResponsible(e.target.value)} className={selectClass}>
                {RESPONSIBLES.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-3">
            <Field label="Data" required>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                className="cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </Field>
            <Field label="Início" required>
              <div
                className="relative cursor-pointer"
                onClick={(e) => {
                  const input = e.currentTarget.querySelector("input") as HTMLInputElement | null;
                  input?.showPicker?.();
                }}
              >
                <Clock3 className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="cursor-pointer pl-8 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
            </Field>
            <Field label="Término" required>
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
                className="cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"
              />
            </Field>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field label="Módulo" required>
              <select value={module} onChange={(e) => changeModule(e.target.value)} className={selectClass}>
                {moduleOptions.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Submódulo" required>
              <select value={submodule} onChange={(e) => setSubmodule(e.target.value)} className={selectClass} disabled={availableSubs.length === 0}>
                {availableSubs.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
          </div>
          <div className={type === "Visita" ? "grid gap-2.5 sm:grid-cols-2" : "grid gap-2.5"}>
            <Field label="Convidados">
              <div className="relative">
                <Users className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input className="pl-8" value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="Nomes ou e-mails, separados por vírgula" />
              </div>
            </Field>
            {type === "Visita" && (
              <Field label="Veículo">
                <div className="relative">
                  <Car className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <select
                    value={vehicleId}
                    onChange={(e) => setVehicleId(e.target.value)}
                    className={`${selectClass} pl-8`}
                  >
                    <option value={NO_VEHICLE}>Não definido</option>
                    {vehicles.map((vehicle) => {
                      const info = vehicleAvailability.get(vehicle.id);
                      const label = info?.label ?? VEHICLE_STATUS_LABEL[vehicle.status];
                      const disabled =
                        info?.key === "em_uso" ||
                        info?.key === "indisponivel" ||
                        (info?.key === "pre_agendado" && info.conflict === true);
                      return (
                        <option key={vehicle.id} value={vehicle.id} disabled={disabled}>
                          {vehicle.model} · {vehicle.plate} — {label}
                          {disabled ? " (indisponível)" : ""}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {vehicleId !== NO_VEHICLE && (() => {
                  const info = vehicleAvailability.get(vehicleId);
                  if (info?.key === "pre_agendado" && info.conflict) {
                    return (
                      <p className="mt-1 text-[11px] text-destructive">
                        Conflito com outra pré-reserva no período informado.
                      </p>
                    );
                  }
                  return null;
                })()}
              </Field>
            )}
          </div>
          <Field label="Observações">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              maxLength={700}
              placeholder="Objetivo, orientações e informações para o atendimento..."
              className="min-h-[64px] w-full resize-none rounded-md border border-input bg-background p-2.5 text-[13px] outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>
        </div>
        <DialogFooter className="flex shrink-0 items-center justify-between gap-3 border-t border-border bg-card px-5 py-2.5 sm:justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-[11.5px] text-muted-foreground">
            <Checkbox checked={reminder} onCheckedChange={(value) => setReminder(value === true)} className="h-4 w-4 cursor-pointer" />
            Gerar lembrete
          </label>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button>
            <Button onClick={submit} className="cursor-pointer"><CalendarClock className="mr-1.5 h-4 w-4" />Agendar evento</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-[12.5px] font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}
