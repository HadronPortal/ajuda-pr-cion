import { useSyncExternalStore } from "react";
import type { CalendarEvent } from "@/lib/calendar-events";
import { createUsageForAppointment, getUsageByAppointment } from "@/lib/fleet-store";

const STORAGE_KEY = "procion.local-calendar-events.v2";
const CHANGE_EVENT = "procion:calendar-events-changed";

const EMPTY: CalendarEvent[] = [];

let cache: CalendarEvent[] | null = null;
const listeners = new Set<() => void>();

function read(): CalendarEvent[] {
  if (typeof window === "undefined") return EMPTY;
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    cache = Array.isArray(parsed)
      ? (parsed.filter((item) => item && typeof item === "object") as CalendarEvent[])
      : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: CalendarEvent[]) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  } catch {
    /* armazenamento indisponível: mantém apenas em memória */
  }
  listeners.forEach((listener) => listener());
}

export function addLocalEvent(event: Omit<CalendarEvent, "id"> & { id?: string | number }) {
  const created: CalendarEvent = {
    ...event,
    id: event.id ?? `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    status: event.status ?? "Agendado",
  };
  write([...read(), created]);

  if (created.needsDisplacement && !getUsageByAppointment(created.id)) {
    const destination = created.address
      ? `${created.client ?? created.title} - ${created.address}`
      : (created.client ?? created.title);

    const scheduledStartAt = `${created.date}T${created.time}:00`;
    const expectedReturnAt = `${created.date}T${created.end}:00`;

    createUsageForAppointment({
      appointmentId: created.id,
      operatorId: created.responsible ?? created.operator,
      vehicleId: created.vehicleId,
      client: created.client,
      destination,
      scheduledStartAt,
      expectedReturnAt,
    });

    // Pré-reserva na Frota usando a data/horário reais do evento (nunca a data de criação).
    if (created.vehicleId) {
      createReservation({
        vehicleId: created.vehicleId,
        operatorId: created.responsible ?? created.operator ?? "",
        startAt: scheduledStartAt,
        endAt: expectedReturnAt,
        eventId: created.id,
        customerId: created.clientId,
        destination,
      });
    }
  }


  return created;
}

/** Atualiza um evento local existente (não afeta eventos vindos do CRM). */
export function updateLocalEvent(
  id: string | number,
  patch: Partial<CalendarEvent>,
): CalendarEvent | null {
  const current = read();
  const index = current.findIndex((event) => String(event.id) === String(id));
  if (index < 0) return null;
  const updated = { ...current[index], ...patch, id: current[index].id };
  const next = [...current];
  next[index] = updated;
  write(next);
  return updated;
}

/** Indica se o evento é local (editável/cancelável pelo usuário). */
export function isLocalEvent(id: string | number): boolean {
  return read().some((event) => String(event.id) === String(id));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  const onLocalChange = () => {
    cache = null;
    listener();
  };
  window.addEventListener(CHANGE_EVENT, onLocalChange);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onLocalChange);
  };
}

export function useLocalEvents(): CalendarEvent[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function useLocalEventsForClient(clientId?: string): CalendarEvent[] {
  const all = useLocalEvents();
  if (!clientId) return EMPTY;
  return all.filter((event) => event.clientId === clientId);
}
