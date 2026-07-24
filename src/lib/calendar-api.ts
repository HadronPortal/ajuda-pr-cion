import { supabase } from "@/lib/supabase";

export type CrmCalendarEvent = {
  id: string;
  date: string;
  time: string;
  end: string;
  type: "Visita presencial" | "Reunião remota" | "Reunião na Prócion" | "Pessoal";
  origin: "Administração" | "Suporte" | "Comercial";
  operator: string;
  title: string;
  client?: string;
  status?: "Agendado" | "Concluído" | "Cancelado";
  description?: string;
  guests?: string[];
};

const typeLabels: Record<string, CrmCalendarEvent["type"]> = {
  visit: "Visita presencial",
  remote_meeting: "Reunião remota",
  procion_meeting: "Reunião na Prócion",
  personal: "Pessoal",
};
const originLabels: Record<string, CrmCalendarEvent["origin"]> = {
  admin: "Administração",
  support: "Suporte",
  commercial: "Comercial",
};
const statusLabels: Record<string, NonNullable<CrmCalendarEvent["status"]>> = {
  scheduled: "Agendado",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export async function listCrmCalendarEvents(): Promise<CrmCalendarEvent[]> {
  const { data, error } = await supabase.rpc("get_crm_calendar_events");
  if (error) throw error;
  return (Array.isArray(data) ? data : []).map((event: Record<string, unknown>) => ({
    id: String(event.id || ""),
    date: String(event.date || ""),
    time: String(event.time || ""),
    end: String(event.end || ""),
    type: typeLabels[String(event.kind || "")] || "Pessoal",
    origin: originLabels[String(event.origin || "")] || "Administração",
    operator: String(event.operator || ""),
    title: String(event.title || ""),
    client: event.client ? String(event.client) : undefined,
    status: statusLabels[String(event.status || "")] || "Agendado",
    description: event.description ? String(event.description) : undefined,
    guests: event.guests
      ? String(event.guests).split(/[,;]+/).map((guest) => guest.trim()).filter(Boolean)
      : undefined,
  }));
}

