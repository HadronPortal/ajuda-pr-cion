import { useSyncExternalStore } from "react";
import corollaImg from "@/assets/vehicles/corolla.jpg";
import trackerImg from "@/assets/vehicles/tracker.jpg";
import onixImg from "@/assets/vehicles/onix.jpg";
import stradaImg from "@/assets/vehicles/strada.jpg";

// -----------------------------------------------------------------------------
// Tipos alinhados a um futuro backend / API
// -----------------------------------------------------------------------------
export type VehicleStatus = "disponivel" | "em_uso" | "manutencao";

export type Vehicle = {
  id: string;
  model: string;
  plate: string;
  category: string;
  color: string;
  yearModel: string;
  currentMileage: number;
  fuelLevel: string;
  nextRevisionDate: string;
  nextRevisionMileage: number;
  status: VehicleStatus;
  imageUrl: string;
};

export type UsageStatus =
  | "aguardando_retirada"
  | "em_deslocamento"
  | "devolvido"
  | "cancelado";

export type VehicleUsage = {
  id: string;
  vehicleId?: string;
  appointmentId?: number | string;
  operatorId: string;
  client?: string;
  destination: string;
  departureAt?: string;
  expectedReturnAt?: string;
  returnedAt?: string;
  departureMileage?: number;
  returnMileage?: number;
  distanceTraveled?: number;
  fuelAtDeparture?: string;
  fuelAtReturn?: string;
  status: UsageStatus;
  departureNotes?: string;
  returnNotes?: string;
  departurePhotos?: string[];
  returnPhotos?: string[];
  createdAt: string;
  updatedAt: string;
};

const nowISO = () => new Date().toISOString();

// -----------------------------------------------------------------------------
// Frota inicial
// -----------------------------------------------------------------------------
let vehicles: Vehicle[] = [
  {
    id: "corolla",
    model: "Toyota Corolla",
    plate: "ABC-1234",
    category: "Sedan",
    color: "Branco",
    yearModel: "2022 / 2023",
    currentMileage: 45678,
    fuelLevel: "1/2",
    nextRevisionDate: "10/09/2026",
    nextRevisionMileage: 50000,
    status: "disponivel",
    imageUrl: corollaImg,
  },
  {
    id: "tracker",
    model: "Chevrolet Tracker",
    plate: "PRC-2026",
    category: "SUV",
    color: "Prata",
    yearModel: "2023 / 2024",
    currentMileage: 31420,
    fuelLevel: "3/4",
    nextRevisionDate: "22/11/2026",
    nextRevisionMileage: 40000,
    status: "disponivel",
    imageUrl: trackerImg,
  },
  {
    id: "onix",
    model: "Chevrolet Onix",
    plate: "HAD-1908",
    category: "Hatch",
    color: "Cinza",
    yearModel: "2021 / 2022",
    currentMileage: 62150,
    fuelLevel: "1/4",
    nextRevisionDate: "05/08/2026",
    nextRevisionMileage: 65000,
    status: "em_uso",
    imageUrl: onixImg,
  },
  {
    id: "strada",
    model: "Fiat Strada",
    plate: "WEB-4580",
    category: "Utilitário",
    color: "Branco",
    yearModel: "2022 / 2022",
    currentMileage: 54802,
    fuelLevel: "Cheio",
    nextRevisionDate: "Em oficina",
    nextRevisionMileage: 60000,
    status: "manutencao",
    imageUrl: stradaImg,
  },
];

// -----------------------------------------------------------------------------
// Utilizações (usages) — inclui alguns registros para "hoje" (2026-07-20)
// -----------------------------------------------------------------------------
let usages: VehicleUsage[] = [
  {
    id: "u-hoje-01",
    appointmentId: "evt-today-1",
    operatorId: "PRCJAC",
    client: "EIN · EUROIND",
    destination: "EIN · EUROIND — Av. Industrial, 1500, Sorocaba/SP",
    expectedReturnAt: "2026-07-20T18:00:00",
    status: "aguardando_retirada",
    createdAt: "2026-07-19T18:00:00",
    updatedAt: "2026-07-19T18:00:00",
  },
  {
    id: "u-hoje-02",
    vehicleId: "onix",
    appointmentId: "evt-today-2",
    operatorId: "PRCROG",
    client: "AVC · CENTER GLASS",
    destination: "AVC · CENTER GLASS — Rua das Palmeiras, 320, Itu/SP",
    departureAt: "2026-07-20T08:00:00",
    expectedReturnAt: "2026-07-20T17:00:00",
    departureMileage: 62150,
    fuelAtDeparture: "1/4",
    status: "em_deslocamento",
    departureNotes: "Retorno previsto no fim do expediente.",
    createdAt: "2026-07-19T17:00:00",
    updatedAt: "2026-07-20T08:00:00",
  },
  {
    id: "u-hoje-03",
    vehicleId: "corolla",
    appointmentId: "evt-today-3",
    operatorId: "PRCGIN",
    client: "ICF · INCOFAP",
    destination: "ICF · INCOFAP — Av. Central, 720, Campinas/SP",
    departureAt: "2026-07-20T07:20:00",
    expectedReturnAt: "2026-07-20T13:00:00",
    returnedAt: "2026-07-20T13:15:00",
    departureMileage: 45320,
    returnMileage: 45678,
    distanceTraveled: 358,
    fuelAtDeparture: "Cheio",
    fuelAtReturn: "1/2",
    status: "devolvido",
    createdAt: "2026-07-19T15:00:00",
    updatedAt: "2026-07-20T13:15:00",
  },
  {
    id: "u-hist-01",
    vehicleId: "tracker",
    operatorId: "PRCJAC",
    client: "USB · US BRASIL",
    destination: "USB · US BRASIL — Av. Paulista, 1000, São Paulo/SP",
    departureAt: "2026-07-13T08:30:00",
    expectedReturnAt: "2026-07-13T18:00:00",
    returnedAt: "2026-07-13T17:40:00",
    departureMileage: 30980,
    returnMileage: 31420,
    distanceTraveled: 440,
    fuelAtDeparture: "Cheio",
    fuelAtReturn: "1/2",
    status: "devolvido",
    createdAt: "2026-07-12T18:00:00",
    updatedAt: "2026-07-13T17:40:00",
  },
];

// -----------------------------------------------------------------------------
// Pub-sub
// -----------------------------------------------------------------------------
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// -----------------------------------------------------------------------------
// Snapshots + hooks
// -----------------------------------------------------------------------------
export function getVehiclesSnapshot() {
  return vehicles;
}
export function getUsagesSnapshot() {
  return usages;
}

export function useVehicles() {
  return useSyncExternalStore(subscribe, getVehiclesSnapshot, getVehiclesSnapshot);
}
export function useUsages() {
  return useSyncExternalStore(subscribe, getUsagesSnapshot, getUsagesSnapshot);
}

// -----------------------------------------------------------------------------
// Consultas auxiliares
// -----------------------------------------------------------------------------
export function getVehicleById(id?: string) {
  if (!id) return undefined;
  return vehicles.find((v) => v.id === id);
}

export function getUsageById(id: string) {
  return usages.find((u) => u.id === id);
}

export function getUsageByAppointment(appointmentId: number | string) {
  return usages.find(
    (u) => u.appointmentId === appointmentId && u.status !== "cancelado",
  );
}

export function getActiveUsageByVehicle(vehicleId: string) {
  return usages.find(
    (u) =>
      u.vehicleId === vehicleId &&
      (u.status === "em_deslocamento" || u.status === "aguardando_retirada"),
  );
}

export function getTodayUsages(today = new Date()) {
  const day = today.toISOString().slice(0, 10);
  return usages
    .filter((u) => {
      if (u.status === "cancelado") return false;
      const ref = (u.departureAt ?? u.expectedReturnAt ?? u.createdAt).slice(0, 10);
      return ref === day;
    })
    .sort((a, b) =>
      (a.expectedReturnAt ?? a.departureAt ?? "").localeCompare(
        b.expectedReturnAt ?? b.departureAt ?? "",
      ),
    );
}

export function getUsagesInUse() {
  return usages.filter((u) => u.status === "em_deslocamento");
}

export function getUsagesHistory() {
  return usages
    .filter((u) => u.status === "devolvido" || u.status === "cancelado")
    .sort((a, b) => (b.returnedAt ?? b.updatedAt).localeCompare(a.returnedAt ?? a.updatedAt));
}

// -----------------------------------------------------------------------------
// Mutations
// -----------------------------------------------------------------------------
export function createUsageForAppointment(input: {
  appointmentId: number | string;
  operatorId: string;
  client?: string;
  destination: string;
  expectedReturnAt?: string;
}) {
  const usage: VehicleUsage = {
    id: `u-${input.appointmentId}-${Date.now()}`,
    appointmentId: input.appointmentId,
    operatorId: input.operatorId,
    client: input.client,
    destination: input.destination,
    expectedReturnAt: input.expectedReturnAt,
    status: "aguardando_retirada",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  usages = [usage, ...usages];
  emit();
  return usage;
}

export function registerDeparture(
  usageId: string,
  data: {
    vehicleId: string;
    departureAt?: string;
    departureMileage: number;
    fuelAtDeparture: string;
    operatorId?: string;
    client?: string;
    destination?: string;
    expectedReturnAt?: string;
    departureNotes?: string;
    departurePhotos?: string[];
  },
) {
  usages = usages.map((u) =>
    u.id === usageId
      ? {
          ...u,
          vehicleId: data.vehicleId,
          departureAt: data.departureAt ?? nowISO(),
          departureMileage: data.departureMileage,
          fuelAtDeparture: data.fuelAtDeparture,
          operatorId: data.operatorId ?? u.operatorId,
          client: data.client ?? u.client,
          destination: data.destination ?? u.destination,
          expectedReturnAt: data.expectedReturnAt ?? u.expectedReturnAt,
          departureNotes: data.departureNotes ?? u.departureNotes,
          departurePhotos: data.departurePhotos ?? u.departurePhotos,
          status: "em_deslocamento",
          updatedAt: nowISO(),
        }
      : u,
  );
  vehicles = vehicles.map((v) =>
    v.id === data.vehicleId
      ? {
          ...v,
          status: "em_uso",
          currentMileage: Math.max(v.currentMileage, data.departureMileage),
          fuelLevel: data.fuelAtDeparture,
        }
      : v,
  );
  emit();
}

export function registerReturn(
  usageId: string,
  data: {
    returnMileage: number;
    fuelAtReturn: string;
    returnedAt?: string;
    returnNotes?: string;
    returnPhotos?: string[];
  },
) {
  const usage = usages.find((u) => u.id === usageId);
  if (!usage) return;
  const distance =
    usage.departureMileage !== undefined
      ? Math.max(0, data.returnMileage - usage.departureMileage)
      : undefined;
  usages = usages.map((u) =>
    u.id === usageId
      ? {
          ...u,
          returnMileage: data.returnMileage,
          fuelAtReturn: data.fuelAtReturn,
          returnedAt: data.returnedAt ?? nowISO(),
          returnNotes: data.returnNotes,
          returnPhotos: data.returnPhotos,
          distanceTraveled: distance,
          status: "devolvido",
          updatedAt: nowISO(),
        }
      : u,
  );
  if (usage.vehicleId) {
    vehicles = vehicles.map((v) =>
      v.id === usage.vehicleId
        ? {
            ...v,
            status: "disponivel",
            currentMileage: data.returnMileage,
            fuelLevel: data.fuelAtReturn,
          }
        : v,
    );
  }
  emit();
}

export function cancelUsage(id: string) {
  const usage = usages.find((u) => u.id === id);
  usages = usages.map((u) =>
    u.id === id ? { ...u, status: "cancelado", updatedAt: nowISO() } : u,
  );
  if (usage?.vehicleId) {
    vehicles = vehicles.map((v) =>
      v.id === usage.vehicleId ? { ...v, status: "disponivel" } : v,
    );
  }
  emit();
}

export function hasConflict(
  vehicleId: string,
  start: string,
  end: string,
  ignoreUsageId?: string,
) {
  return usages.some((u) => {
    if (u.id === ignoreUsageId) return false;
    if (u.vehicleId !== vehicleId) return false;
    if (u.status !== "em_deslocamento") return false;
    const s = u.departureAt ?? u.createdAt;
    const e = u.expectedReturnAt ?? u.returnedAt ?? end;
    return s < end && e > start;
  });
}

// -----------------------------------------------------------------------------
// Rótulos
// -----------------------------------------------------------------------------
export const VEHICLE_STATUS_LABEL: Record<VehicleStatus, string> = {
  disponivel: "Disponível",
  em_uso: "Em uso",
  manutencao: "Manutenção",
};

export const USAGE_STATUS_LABEL: Record<UsageStatus, string> = {
  aguardando_retirada: "Aguardando retirada",
  em_deslocamento: "Em deslocamento",
  devolvido: "Devolvido",
  cancelado: "Cancelado",
};
