import { useSyncExternalStore } from "react";

export type FleetEntryType =
  | "abastecimento"
  | "despesa"
  | "receita"
  | "servico"
  | "percurso"
  | "leitura"
  | "checklist"
  | "lembrete";

export type FleetEntry = {
  id: string;
  type: FleetEntryType;
  vehicleId: string;
  occurredAt: string;
  mileage?: number;
  title: string;
  notes?: string;
  amount?: number;
  liters?: number;
  fuelType?: string;
  fuelLevel?: string;
  origin?: string;
  destination?: string;
  distance?: number;
  readingType?: string;
  readingValue?: string;
  checklistItems?: string[];
  reminderAt?: string;
  createdAt: string;
};

const STORAGE_KEY = "procion.fleet-entries.v1";
let entries: FleetEntry[] = [];
let hydrated = false;
const listeners = new Set<() => void>();

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "[]");
    if (Array.isArray(parsed)) entries = parsed;
  } catch {
    entries = [];
  }
}

function persist() {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }
}

function subscribe(listener: () => void) {
  hydrate();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function snapshot() {
  hydrate();
  return entries;
}

export function useFleetEntries() {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export function createFleetEntry(input: Omit<FleetEntry, "id" | "createdAt">) {
  const entry: FleetEntry = {
    ...input,
    id: `fleet-entry-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  entries = [entry, ...entries];
  persist();
  listeners.forEach((listener) => listener());
  return entry;
}
