import { useSyncExternalStore } from "react";

export type FleetUsageStatus = "reservado" | "em_uso" | "devolvido" | "cancelado";

export type FleetUsage = {
  id: string;
  vehicleId: string;
  appointmentId?: string;
  operatorId: string;
  destination: string;
  departureAt?: string;
  expectedReturnAt?: string;
  returnedAt?: string;
  departureMileage?: number;
  returnMileage?: number;
  distanceTraveled?: number;
  fuelAtDeparture?: string;
  fuelAtReturn?: string;
  status: FleetUsageStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const nowISO = () => new Date().toISOString();

let records: FleetUsage[] = [
  {
    id: "u-onix-01",
    vehicleId: "onix",
    appointmentId: "evt-3",
    operatorId: "PRCJAC",
    destination: "EIN · EUROIND",
    departureAt: "2026-07-20T08:00:00",
    expectedReturnAt: "2026-07-20T18:00:00",
    departureMileage: 62150,
    fuelAtDeparture: "1/4",
    status: "em_uso",
    notes: "Implantação — retorno previsto no fim do expediente.",
    createdAt: "2026-07-19T18:00:00",
    updatedAt: "2026-07-20T08:00:00",
  },
  {
    id: "u-corolla-98",
    vehicleId: "corolla",
    operatorId: "PRCROG",
    destination: "AVC · CENTER GLASS",
    departureAt: "2026-07-18T08:20:00",
    expectedReturnAt: "2026-07-18T18:00:00",
    returnedAt: "2026-07-18T17:40:00",
    departureMileage: 45320,
    returnMileage: 45678,
    distanceTraveled: 358,
    fuelAtDeparture: "Cheio",
    fuelAtReturn: "1/2",
    status: "devolvido",
    notes: "Sem intercorrências.",
    createdAt: "2026-07-17T18:00:00",
    updatedAt: "2026-07-18T17:40:00",
  },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function subscribeFleetUsage(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFleetUsageSnapshot() {
  return records;
}

export function useFleetUsage() {
  return useSyncExternalStore(subscribeFleetUsage, getFleetUsageSnapshot, getFleetUsageSnapshot);
}

export function getActiveUsageByVehicle(vehicleId: string): FleetUsage | undefined {
  return records.find(
    (r) => r.vehicleId === vehicleId && (r.status === "em_uso" || r.status === "reservado"),
  );
}

export function getUsageHistoryByVehicle(vehicleId: string) {
  return records
    .filter((r) => r.vehicleId === vehicleId)
    .sort((a, b) => (b.departureAt ?? b.createdAt).localeCompare(a.departureAt ?? a.createdAt));
}

export function hasConflict(vehicleId: string, start: string, end: string, ignoreId?: string) {
  return records.some((r) => {
    if (r.id === ignoreId) return false;
    if (r.vehicleId !== vehicleId) return false;
    if (r.status !== "reservado" && r.status !== "em_uso") return false;
    const s = r.departureAt ?? r.createdAt;
    const e = r.expectedReturnAt ?? r.returnedAt ?? end;
    return s < end && e > start;
  });
}

export function createReservation(input: {
  vehicleId: string;
  appointmentId?: string;
  operatorId: string;
  destination: string;
  departureAt: string;
  expectedReturnAt: string;
  fuelAtDeparture?: string;
  notes?: string;
}) {
  const id = `u-${input.vehicleId}-${Date.now()}`;
  const usage: FleetUsage = {
    id,
    ...input,
    status: "reservado",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  records = [usage, ...records];
  emit();
  return usage;
}

export function registerDeparture(
  id: string,
  data: { departureMileage: number; fuelAtDeparture?: string; departureAt?: string },
) {
  records = records.map((r) =>
    r.id === id
      ? {
          ...r,
          ...data,
          departureAt: data.departureAt ?? r.departureAt ?? nowISO(),
          status: "em_uso" as const,
          updatedAt: nowISO(),
        }
      : r,
  );
  emit();
}

export function registerReturn(
  id: string,
  data: { returnMileage: number; fuelAtReturn: string; returnedAt?: string; notes?: string },
) {
  records = records.map((r) => {
    if (r.id !== id) return r;
    const distance = r.departureMileage ? data.returnMileage - r.departureMileage : undefined;
    return {
      ...r,
      ...data,
      returnedAt: data.returnedAt ?? nowISO(),
      distanceTraveled: distance,
      status: "devolvido" as const,
      updatedAt: nowISO(),
    };
  });
  emit();
}

export function cancelUsage(id: string) {
  records = records.map((r) =>
    r.id === id ? { ...r, status: "cancelado" as const, updatedAt: nowISO() } : r,
  );
  emit();
}
