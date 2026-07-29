import { useMemo, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CalendarDays,
  Car,
  ExternalLink,
  KeyRound,
  Link2,
  MapPin,
  Pencil,
  Ticket,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { cn } from "@/lib/utils";
import {
  EVENT_TONE_LABEL,
  EVENT_TONE_STYLES,
  TYPE_ICON,
  getEventTone,
  type CalendarEvent,
} from "@/lib/calendar-events";
import { formatFleetDateTime, getVehicleById, useUsages, useReservations } from "@/lib/fleet-store";
import { useTickets } from "@/lib/tickets-store";

const preventOutsideClose = (event: Event) => event.preventDefault();

function protocolFromTitle(title: string): string | undefined {
  const match = title.match(/(PRC-\d+)/i);
  return match ? match[1].toUpperCase() : undefined;
}

function formatDate(date: string) {
  const parsed = new Date(`${date}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function EventDetailsModal({
  event,
  open,
  onOpenChange,
  onEdit,
  onCancelEvent,
  canEdit = false,
  canCancel = false,
  onPickupVehicle,
}: {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (event: CalendarEvent) => void;
  onCancelEvent?: (event: CalendarEvent) => void;
  canEdit?: boolean;
  canCancel?: boolean;
  /** Disponível apenas quando existe veículo reservado e a retirada é possível. */
  onPickupVehicle?: (event: CalendarEvent) => void;
}) {
  const navigate = useNavigate();
  const tickets = useTickets();
  const usages = useUsages();
  const reservations = useReservations();

  const protocol = event ? (event.protocol ?? protocolFromTitle(event.title)) : undefined;
  const ticket = useMemo(() => {
    if (!event) return null;
    if (event.ticketId) return tickets.find((t) => t.id === event.ticketId) ?? null;
    if (protocol) return tickets.find((t) => t.protocol === protocol) ?? null;
    return null;
  }, [event, protocol, tickets]);

  const usage = event
    ? usages.find((u) => String(u.appointmentId) === String(event.id) && u.status !== "cancelado")
    : undefined;
  const reservation = event
    ? reservations.find((r) => String(r.eventId) === String(event.id) && r.status !== "cancelada")
    : undefined;

  if (!event) return null;

  const tone = getEventTone(event);
  const toneStyle = EVENT_TONE_STYLES[tone];
  const Icon = TYPE_ICON[event.type];

  const vehicle = getVehicleById(usage?.vehicleId ?? reservation?.vehicleId ?? event.vehicleId);
  const departureRef = usage?.departureAt ?? usage?.scheduledStartAt ?? reservation?.startAt;
  const returnRef = usage?.returnedAt ?? usage?.expectedReturnAt ?? reservation?.endAt;
  const guestLabels =
    event.guestList?.map((guest) =>
      guest.acronym ? `${guest.acronym} · ${guest.name}` : guest.name,
    ) ??
    event.guests ??
    [];

  const canPickup =
    Boolean(vehicle) &&
    Boolean(onPickupVehicle) &&
    (!usage || usage.status === "aguardando_retirada") &&
    tone !== "cancelled";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={preventOutsideClose}
        onInteractOutside={preventOutsideClose}
        style={{ maxHeight: "calc(100vh - 3rem)" }}
        className="flex w-[calc(100vw-2rem)] max-w-[680px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Detalhes do agendamento</DialogTitle>
        <DetailModalHeader
          dense
          icon={Icon}
          title={event.title}
          protocol={protocol ?? ticket?.protocol}
          onClose={() => onOpenChange(false)}
          meta={
            <>
              <span>{formatDate(event.date)}</span>
              <span>·</span>
              <span className="tabular-nums">
                {event.time} às {event.end}
              </span>
            </>
          }
          chips={
            <>
              <Badge variant="secondary" className="h-5 px-1.5 text-[10px]">
                {event.type}
              </Badge>
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-medium",
                  toneStyle.soft,
                  toneStyle.text,
                )}
              >
                {EVENT_TONE_LABEL[tone]}
              </span>
            </>
          }
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <Info icon={CalendarDays} label="Data">
              {formatDate(event.date)}
            </Info>
            <Info icon={CalendarDays} label="Horário">
              <span className="tabular-nums">
                {event.time} às {event.end}
              </span>
            </Info>
            <Info icon={UserRound} label="Responsável">
              {event.responsible || event.operator || "—"}
            </Info>
            <Info icon={Ticket} label="Origem">
              {event.origin}
            </Info>
            {(event.client || ticket?.clientName) && (
              <Info icon={UsersRound} label="Cliente / empresa" className="sm:col-span-2">
                {event.client ||
                  [ticket?.clientCode, ticket?.clientName].filter(Boolean).join(" · ")}
              </Info>
            )}
            {guestLabels.length > 0 && (
              <Info icon={UsersRound} label="Convidados" className="sm:col-span-2">
                <span className="flex flex-wrap gap-1">
                  {guestLabels.map((label) => (
                    <Badge key={label} variant="secondary" className="h-5 px-1.5 text-[10px]">
                      {label}
                    </Badge>
                  ))}
                </span>
              </Info>
            )}
            {event.address && (
              <Info icon={MapPin} label="Endereço" className="sm:col-span-2">
                {event.address}
              </Info>
            )}
            {event.meetingLink && (
              <Info icon={Link2} label="Link da reunião" className="sm:col-span-2">
                <a
                  href={event.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="cursor-pointer text-blue-600 no-underline hover:opacity-80 dark:text-blue-400"
                  onClick={(e) => e.stopPropagation()}
                >
                  {event.meetingLink}
                </a>
              </Info>
            )}
            {event.room && (
              <Info icon={MapPin} label="Sala">
                {event.room}
              </Info>
            )}
            {event.platform && (
              <Info icon={Link2} label="Plataforma">
                {event.platform}
              </Info>
            )}
            {event.description && (
              <Info icon={CalendarDays} label="Descrição e observações" className="sm:col-span-2">
                <span className="whitespace-pre-wrap">{event.description}</span>
              </Info>
            )}
            {vehicle && (
              <Info icon={Car} label="Veículo reservado" className="sm:col-span-2">
                {vehicle.model} · {vehicle.plate}
              </Info>
            )}
            {vehicle && (
              <>
                <Info icon={Car} label="Saída prevista">
                  {formatFleetDateTime(departureRef) || "—"}
                </Info>
                <Info icon={Car} label="Devolução prevista">
                  {formatFleetDateTime(returnRef) || "—"}
                </Info>
              </>
            )}
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2 border-t border-border bg-card px-5 py-3">
          {ticket && (
            <Button
              variant="outline"
              className="h-9 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onOpenChange(false);
                navigate({ to: "/chamados", search: { ticket: ticket.id } });
              }}
            >
              <ExternalLink className="mr-1.5 h-4 w-4" />
              Ver chamado
            </Button>
          )}
          {canPickup && (
            <Button
              className="h-9 cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
              onClick={(e) => {
                e.stopPropagation();
                onPickupVehicle?.(event);
              }}
            >
              <KeyRound className="mr-1.5 h-4 w-4" />
              Retirar veículo
            </Button>
          )}
          {canEdit && (
            <Button
              variant="outline"
              className="h-9 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(event);
              }}
            >
              <Pencil className="mr-1.5 h-4 w-4" />
              Editar agendamento
            </Button>
          )}
          {canCancel && (
            <Button
              variant="outline"
              className="h-9 cursor-pointer border-rose-300 text-rose-600 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/40"
              onClick={(e) => {
                e.stopPropagation();
                onCancelEvent?.(event);
              }}
            >
              <X className="mr-1.5 h-4 w-4" />
              Cancelar agendamento
            </Button>
          )}
          <Button
            variant="ghost"
            className="h-9 cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Info({
  icon: Icon,
  label,
  children,
  className,
}: {
  icon: typeof CalendarDays;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-lg border border-border bg-muted/20 px-3 py-2", className)}>
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <div className="mt-1 text-sm text-foreground">{children}</div>
    </div>
  );
}
