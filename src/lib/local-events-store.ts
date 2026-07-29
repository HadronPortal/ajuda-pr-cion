import { useSyncExternalStore } from "react";
import type { CalendarEvent } from "@/lib/calendar-events";
import { createUsageForAppointment, getUsageByAppointment } from "@/lib/fleet-store";

const STORAGE_KEY = "procion.local-calendar-events.v1";
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

    createUsageForAppointment({
      appointmentId: created.id,
      operatorId: created.responsible ?? created.operator,
      client: created.client,
      destination,
      expectedReturnAt: `${created.date}T${created.end}:00`,
    });
  }

  return created;
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
