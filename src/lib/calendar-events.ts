import { Car, CalendarDays, Laptop, UsersRound } from "lucide-react";

export type EventType = "Visita presencial" | "Reunião remota" | "Reunião na Prócion" | "Pessoal";

export type EventStatus = "Agendado" | "Concluído" | "Cancelado";

export type CalendarEvent = {
  id: string | number;
  date: string;
  time: string;
  end: string;
  type: EventType;
  origin: "Administração" | "Suporte" | "Comercial";
  operator: string;
  title: string;
  /** Rótulo textual do cliente (sigla · razão social). */
  client?: string;
  /** ID real do cliente vinculado (quando criado a partir do cliente). */
  clientId?: string;
  status?: EventStatus;
  description?: string;
  guests?: string[];
  needsDisplacement?: boolean;
  vehicleId?: string;
  address?: string;
  responsible?: string;
  meetingLink?: string;
  platform?: string;
  room?: string;
  isPrivate?: boolean;
};

export const PRC_OPERATORS = [
  "PRCGGC",
  "PRCGIN",
  "PRCJAC",
  "PRCREN",
  "PRCROG",
  "PRCSUZ",
  "PRCMAR",
  "PRCLCZ",
  "PRCPED",
];

export const PLATFORM_OPTIONS = ["Google Meet", "Microsoft Teams", "Zoom", "AnyDesk"];
export const ROOM_OPTIONS = ["Sala Diretoria", "Sala Reuniões 1", "Sala Reuniões 2", "Auditório"];

export const TYPE_ICON: Record<EventType, typeof Car> = {
  "Visita presencial": Car,
  "Reunião remota": Laptop,
  "Reunião na Prócion": UsersRound,
  Pessoal: CalendarDays,
};
