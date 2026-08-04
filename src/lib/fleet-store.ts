import { useSyncExternalStore } from "react";
import corollaImg from "@/assets/vehicles/gol-g4.png";
import trackerImg from "@/assets/vehicles/celta.png";
import onixImg from "@/assets/vehicles/mobi.png";
import stradaImg from "@/assets/vehicles/saveiro-g5.png";

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
  state?: string;
  renavam?: string;
  licensingYear?: number;
  licensingPaidAt?: string;
  licensingDueDate?: string;
  maintenanceRecords?: VehicleMaintenance[];
  inspectionHistory?: VehicleInspection[];
  tires?: TireSystem;
};

export type TireSystem = {
  frontLeft: TireData;
  frontRight: TireData;
  rearLeft: TireData;
  rearRight: TireData;
  lastInspectionDate?: string;
};

export type TireData = {
  pressure: number;
  condition: "normal" | "warning" | "critical";
  lastSwapMileage: number;
  nextRotationMileage: number;
  notes?: string;
};

export type VehicleInspection = {
  id: string;
  vehicleId: string;
  date: string;
  inspectorId: string;
  components: {
    tires: "normal" | "warning" | "critical";
    brakes: "normal" | "warning" | "critical";
    engine: "normal" | "warning" | "critical";
    battery: "normal" | "warning" | "critical";
    oil: "normal" | "warning" | "critical";
    bodywork: "normal" | "warning" | "critical";
  };
  notes?: string;
  mileageAtInspection: number;
};

export type VehicleMaintenance = {
  id: string;
  vehicleId: string;
  entryDate: string; // ISO datetime
  exitDate?: string; // ISO datetime
  entryMileage: number;
  exitMileage?: number;
  reason: string;
  workshop: string;
  notes?: string;
  cost?: number; // Numeric value in DB
  duration?: string; // Formatted duration string (e.g., "6h 30min")
  servicesPerformed?: string;
  partsReplaced?: string;
  nextRevisionDate?: string;
  nextRevisionMileage?: number;
  status: "em_andamento" | "concluido";
  createdAt: string;
  updatedAt: string;
};

export type LicensingStatus = "regular" | "due_soon" | "overdue" | "unknown";

export type UsageStatus = "aguardando_retirada" | "em_deslocamento" | "devolvido" | "cancelado";

export type ReservationStatus = "pre_agendado" | "convertida_em_uso" | "cancelada";

export type VehicleReservation = {
  id: string;
  eventId?: string | number;
  ticketId?: string;
  vehicleId: string;
  operatorId: string;
  customerId?: string;
  destination?: string;
  startAt: string;
  endAt: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
};

export type VehicleUsage = {
  id: string;
  vehicleId?: string;
  appointmentId?: number | string;
  operatorId: string;
  client?: string;
  destination: string;
  scheduledStartAt?: string;
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
const RUNTIME_STORAGE_KEY = "procion.fleet-runtime.v2";
const VEHICLES_STORAGE_KEY = "procion.fleet-vehicles.v1";
const SP_TIME_ZONE = "America/Sao_Paulo";

/**
 * Datas "ingênuas" (2026-07-30T08:00:00, sem fuso) vêm do agendamento e devem ser
 * lidas literalmente — converter para UTC reduziria um dia. Datas com fuso (Z/offset)
 * são convertidas para America/Sao_Paulo.
 */
const NAIVE_DATETIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;

export function formatFleetDateTime(value?: string) {
  if (!value) return "—";
  const naive = NAIVE_DATETIME.exec(value);
  if (naive && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(value)) {
    const [, y, m, d, hh, mm] = naive;
    return `${d}/${m}/${y}, ${hh}:${mm}`;
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleString("pt-BR", {
    timeZone: SP_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Data (yyyy-mm-dd) do agendamento, sem conversão de fuso. */
export function fleetDayKey(value?: string) {
  if (!value) return "";
  const naive = NAIVE_DATETIME.exec(value);
  if (naive && !/[zZ]|[+-]\d{2}:?\d{2}$/.test(value)) return value.slice(0, 10);
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: SP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}

/** Momento previsto (ou real) da saída — nunca usa createdAt. */
export function getUsageDepartureRef(u: VehicleUsage) {
  return u.departureAt ?? u.scheduledStartAt;
}

/** Momento previsto (ou real) da devolução. */
export function getUsageReturnRef(u: VehicleUsage) {
  return u.returnedAt ?? u.expectedReturnAt;
}

// -----------------------------------------------------------------------------
// Frota inicial
// -----------------------------------------------------------------------------
let vehicles: Vehicle[] = [
  {
    id: "corolla",
    model: "Volkswagen Gol G4",
    plate: "ABC-1234",
    category: "Hatch",
    color: "Prata",
    yearModel: "2022 / 2023",
    currentMileage: 45678,
    fuelLevel: "1/2",
    nextRevisionDate: "10/09/2026",
    nextRevisionMileage: 50000,
    status: "disponivel",
    imageUrl: corollaImg,
    tires: {
      frontLeft: { pressure: 32, condition: "normal", lastSwapMileage: 35000, nextRotationMileage: 45000 },
      frontRight: { pressure: 32, condition: "normal", lastSwapMileage: 35000, nextRotationMileage: 45000 },
      rearLeft: { pressure: 30, condition: "normal", lastSwapMileage: 35000, nextRotationMileage: 45000 },
      rearRight: { pressure: 30, condition: "normal", lastSwapMileage: 35000, nextRotationMileage: 45000 },
      lastInspectionDate: "2026-07-15"
    }
  },
  {
    id: "tracker",
    model: "Chevrolet Celta",
    plate: "PRC-2026",
    category: "Hatch",
    color: "Prata",
    yearModel: "2023 / 2024",
    currentMileage: 31420,
    fuelLevel: "3/4",
    nextRevisionDate: "22/11/2026",
    nextRevisionMileage: 40000,
    status: "disponivel",
    imageUrl: trackerImg,
    tires: {
      frontLeft: { pressure: 33, condition: "normal", lastSwapMileage: 25000, nextRotationMileage: 35000 },
      frontRight: { pressure: 33, condition: "normal", lastSwapMileage: 25000, nextRotationMileage: 35000 },
      rearLeft: { pressure: 31, condition: "normal", lastSwapMileage: 25000, nextRotationMileage: 35000 },
      rearRight: { pressure: 31, condition: "normal", lastSwapMileage: 25000, nextRotationMileage: 35000 },
      lastInspectionDate: "2026-07-10"
    }
  },
  {
    id: "onix",
    model: "Fiat Mobi",
    plate: "HAD-1908",
    category: "Hatch",
    color: "Branco",
    yearModel: "2021 / 2022",
    currentMileage: 62150,
    fuelLevel: "1/4",
    nextRevisionDate: "05/08/2026",
    nextRevisionMileage: 65000,
    status: "disponivel",
    imageUrl: onixImg,
    tires: {
      frontLeft: { pressure: 28, condition: "warning", lastSwapMileage: 50000, nextRotationMileage: 60000 },
      frontRight: { pressure: 32, condition: "normal", lastSwapMileage: 50000, nextRotationMileage: 60000 },
      rearLeft: { pressure: 22, condition: "critical", lastSwapMileage: 50000, nextRotationMileage: 60000 },
      rearRight: { pressure: 30, condition: "normal", lastSwapMileage: 50000, nextRotationMileage: 60000 },
      lastInspectionDate: "2026-07-18"
    }
  },
  {
    id: "strada",
    model: "Volkswagen Saveiro G5",
    plate: "WEB-4580",
    category: "Utilitário",
    color: "Prata",
    yearModel: "2022 / 2022",
    currentMileage: 54802,
    fuelLevel: "Cheio",
    nextRevisionDate: "10/09/2026",
    nextRevisionMileage: 60000,
    status: "manutencao",
    imageUrl: stradaImg,
    tires: {
      frontLeft: { pressure: 32, condition: "normal", lastSwapMileage: 40000, nextRotationMileage: 50000 },
      frontRight: { pressure: 32, condition: "normal", lastSwapMileage: 40000, nextRotationMileage: 50000 },
      rearLeft: { pressure: 34, condition: "normal", lastSwapMileage: 40000, nextRotationMileage: 50000 },
      rearRight: { pressure: 34, condition: "normal", lastSwapMileage: 40000, nextRotationMileage: 50000 },
      lastInspectionDate: "2026-07-12"
    }
  },
];

// Add initial maintenance record for Saveiro
const strada = vehicles.find(v => v.id === "strada");
if (strada) {
  strada.maintenanceRecords = [{
    id: "mnt-initial",
    vehicleId: "strada",
    entryDate: "2026-07-28T09:00:00",
    entryMileage: 54802,
    reason: "Revisão geral e troca de suspensão",
    workshop: "Mecânica São Carlos",
    status: "em_andamento",
    createdAt: "2026-07-28T09:00:00",
    updatedAt: "2026-07-28T09:00:00"
  }];
}

// -----------------------------------------------------------------------------
// Utilizações (usages) — inclui alguns registros para "hoje" (2026-07-20)
// -----------------------------------------------------------------------------
let usages: VehicleUsage[] = [];

let reservations: VehicleReservation[] = [];
let runtimeHydrated = false;
let vehiclesHydrated = false;

function hydrateVehicles() {
  if (vehiclesHydrated || typeof window === "undefined") return;
  vehiclesHydrated = true;
  try {
    const raw = window.localStorage.getItem(VEHICLES_STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Vehicle[];
    if (!Array.isArray(saved)) return;
    vehicles = vehicles.map((vehicle) => {
      const stored = saved.find((item) => item.id === vehicle.id);
      return stored ? { ...vehicle, ...stored, imageUrl: vehicle.imageUrl } : vehicle;
    });
  } catch {
    // Mantém a frota padrão quando o armazenamento estiver indisponível.
  }
}

function persistVehicles() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(VEHICLES_STORAGE_KEY, JSON.stringify(vehicles));
}

function hydrateRuntimeRecords() {
  if (runtimeHydrated || typeof window === "undefined") return;
  runtimeHydrated = true;
  try {
    const raw = window.localStorage.getItem(RUNTIME_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as {
      usages?: Array<VehicleUsage & { expectedDepartureAt?: string }>;
      reservations?: VehicleReservation[];
    };
    const requiresUsageMigration = Array.isArray(parsed.usages)
      ? parsed.usages.some((usage) => !usage.scheduledStartAt)
      : false;
    const savedReservations = Array.isArray(parsed.reservations) ? parsed.reservations : [];
    const savedUsages = (Array.isArray(parsed.usages) ? parsed.usages : []).map((usage) => {
      if (usage.scheduledStartAt) return usage;
      const reservation = savedReservations.find(
        (item) => String(item.eventId) === String(usage.appointmentId),
      );
      const calendarStart = getCalendarEventStart(usage.appointmentId);
      return {
        ...usage,
        scheduledStartAt: usage.expectedDepartureAt ?? reservation?.startAt ?? calendarStart,
      };
    });
    const usageIds = new Set(usages.map((usage) => usage.id));
    const reservationIds = new Set(reservations.map((reservation) => reservation.id));
    usages = [...savedUsages.filter((usage) => !usageIds.has(usage.id)), ...usages];
    reservations = [
      ...savedReservations.filter((reservation) => !reservationIds.has(reservation.id)),
      ...reservations,
    ];
    if (requiresUsageMigration) {
      persistRuntimeRecords();
    }
  } catch {
    // Mantém os registros da sessão quando o armazenamento estiver indisponível.
  }
}

function getCalendarEventStart(appointmentId?: string | number) {
  if (appointmentId === undefined || typeof window === "undefined") return undefined;
  try {
    const raw = window.localStorage.getItem("procion.local-calendar-events.v2");
    const events = raw ? (JSON.parse(raw) as Array<Record<string, unknown>>) : [];
    const event = events.find((item) => String(item.id) === String(appointmentId));
    if (!event?.date || !event?.time) return undefined;
    return `${event.date}T${event.time}:00`;
  } catch {
    return undefined;
  }
}

function persistRuntimeRecords() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      RUNTIME_STORAGE_KEY,
      JSON.stringify({
        usages: usages.filter(
          (usage) =>
            String(usage.appointmentId ?? "").startsWith("ticket-") ||
            String(usage.appointmentId ?? "").startsWith("local-"),
        ),
        reservations: reservations.filter(
          (reservation) =>
            String(reservation.eventId ?? "").startsWith("ticket-") ||
            String(reservation.eventId ?? "").startsWith("local-"),
        ),
      }),
    );
  } catch {
    // A aplicação continua funcional durante a sessão.
  }
}

// -----------------------------------------------------------------------------
// Pub-sub
// -----------------------------------------------------------------------------
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  hydrateVehicles();
  const wasHydrated = runtimeHydrated;
  hydrateRuntimeRecords();
  listeners.add(listener);
  if (!wasHydrated && runtimeHydrated) queueMicrotask(listener);
  return () => listeners.delete(listener);
}

// -----------------------------------------------------------------------------
// Snapshots + hooks
// -----------------------------------------------------------------------------
export function getVehiclesSnapshot() {
  hydrateVehicles();
  return vehicles;
}
export function getUsagesSnapshot() {
  hydrateRuntimeRecords();
  return usages;
}

export function useVehicles() {
  return useSyncExternalStore(subscribe, getVehiclesSnapshot, getVehiclesSnapshot);
}
export function useUsages() {
  return useSyncExternalStore(subscribe, getUsagesSnapshot, getUsagesSnapshot);
}

export function getReservationsSnapshot() {
  hydrateRuntimeRecords();
  return reservations;
}
export function useReservations() {
  return useSyncExternalStore(subscribe, getReservationsSnapshot, getReservationsSnapshot);
}

export function getActiveReservationsByVehicle(vehicleId: string) {
  return reservations.filter((r) => r.vehicleId === vehicleId && r.status === "pre_agendado");
}

export function hasReservationConflict(
  vehicleId: string,
  startAt: string,
  endAt: string,
  ignoreReservationId?: string,
): VehicleReservation | undefined {
  return reservations.find((r) => {
    if (r.id === ignoreReservationId) return false;
    if (r.vehicleId !== vehicleId) return false;
    if (r.status !== "pre_agendado") return false;
    return r.startAt < endAt && r.endAt > startAt;
  });
}

export function createReservation(input: {
  vehicleId: string;
  operatorId: string;
  startAt: string;
  endAt: string;
  eventId?: string | number;
  ticketId?: string;
  customerId?: string;
  destination?: string;
}): VehicleReservation | { error: "conflict"; conflict: VehicleReservation } {
  const conflict = hasReservationConflict(input.vehicleId, input.startAt, input.endAt);
  if (conflict) return { error: "conflict", conflict };

  const vehicle = getVehicleById(input.vehicleId);
  if (vehicle?.status === "manutencao") {
    // Para simplificar o retorno sem mudar a assinatura radicalmente:
    return { error: "conflict", conflict: { id: "indisponivel" } as any };
  }
  const now = nowISO();
  const reservation: VehicleReservation = {
    id: `res-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`,
    vehicleId: input.vehicleId,
    operatorId: input.operatorId,
    startAt: input.startAt,
    endAt: input.endAt,
    eventId: input.eventId,
    ticketId: input.ticketId,
    customerId: input.customerId,
    destination: input.destination,
    status: "pre_agendado",
    createdAt: now,
    updatedAt: now,
  };
  reservations = [reservation, ...reservations];
  persistRuntimeRecords();
  emit();
  return reservation;
}

export function cancelReservationByEvent(eventId: string | number) {
  reservations = reservations.map((r) =>
    r.eventId === eventId && r.status === "pre_agendado"
      ? { ...r, status: "cancelada", updatedAt: nowISO() }
      : r,
  );
  persistRuntimeRecords();
  emit();
}

// -----------------------------------------------------------------------------
// Consultas auxiliares
// -----------------------------------------------------------------------------
export function getVehicleById(id?: string) {
  hydrateVehicles();
  if (!id) return undefined;
  return vehicles.find((v) => v.id === id);
}

export function normalizeVehiclePlate(value: string) {
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 7);
  return clean.length === 7 ? `${clean.slice(0, 3)}-${clean.slice(3)}` : clean;
}

export function calculateLicensingDueDate(plate: string, state = "SP", year = new Date().getFullYear()) {
  if (state.toUpperCase() !== "SP") return undefined;
  const finalDigit = plate.replace(/\D/g, "").at(-1);
  const monthByDigit: Record<string, number> = {
    "1": 7, "2": 7, "3": 8, "4": 8, "5": 9,
    "6": 9, "7": 10, "8": 10, "9": 11, "0": 12,
  };
  const month = finalDigit ? monthByDigit[finalDigit] : undefined;
  if (!month) return undefined;
  const lastDay = new Date(year, month, 0).getDate();
  return `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
}

export function getLicensingStatus(vehicle: Vehicle, today = new Date()) {
  const year = today.getFullYear();
  if ((vehicle.licensingYear ?? 0) >= year) {
    return { status: "regular" as LicensingStatus, label: `Licenciado ${vehicle.licensingYear}` };
  }
  const dueDate = vehicle.licensingDueDate || calculateLicensingDueDate(vehicle.plate, vehicle.state, year);
  if (!dueDate) return { status: "unknown" as LicensingStatus, label: "Prazo não informado" };
  const due = new Date(`${dueDate}T23:59:59`);
  const days = Math.ceil((due.getTime() - today.getTime()) / 86_400_000);
  if (days < 0) return { status: "overdue" as LicensingStatus, label: `Vencido há ${Math.abs(days)} dias`, dueDate };
  if (days <= 45) return { status: "due_soon" as LicensingStatus, label: `Vence em ${days} dias`, dueDate };
  return { status: "regular" as LicensingStatus, label: `Vence em ${days} dias`, dueDate };
}

export function updateVehicle(vehicleId: string, changes: Partial<Vehicle>) {
  vehicles = vehicles.map((vehicle) => vehicle.id === vehicleId ? { ...vehicle, ...changes } : vehicle);
  persistVehicles();
  emit();
}

export function addVehicleMaintenance(vehicleId: string, input: Omit<VehicleMaintenance, "id" | "vehicleId" | "createdAt" | "updatedAt" | "status">) {
  const now = nowISO();
  const record: VehicleMaintenance = {
    ...input,
    id: `mnt-${Date.now().toString(36)}`,
    vehicleId,
    status: "em_andamento",
    createdAt: now,
    updatedAt: now,
  };
  
  vehicles = vehicles.map((vehicle) => 
    vehicle.id === vehicleId
      ? {
          ...vehicle,
          status: "manutencao" as VehicleStatus,
          currentMileage: Math.max(vehicle.currentMileage, input.entryMileage),
          maintenanceRecords: [record, ...(vehicle.maintenanceRecords ?? [])],
        }
      : vehicle
  );
  
  persistVehicles();
  emit();
  return record;
}

export function closeVehicleMaintenance(maintenanceId: string, input: {
  exitDate: string;
  exitMileage: number;
  cost?: number;
  duration?: string;
  servicesPerformed: string;
  partsReplaced: string;
  notes?: string;
  nextRevisionDate?: string;
  nextRevisionMileage?: number;
}) {
  const now = nowISO();
  let vehicleId = "";

  vehicles = vehicles.map((vehicle) => {
    const maintenance = vehicle.maintenanceRecords?.find((m) => m.id === maintenanceId);
    if (!maintenance) return vehicle;
    
    vehicleId = vehicle.id;
    const updatedRecords = vehicle.maintenanceRecords?.map((m) => 
      m.id === maintenanceId 
        ? { ...m, ...input, status: "concluido" as const, updatedAt: now } 
        : m
    );

    // Check if there are any other open maintenances for this vehicle
    const hasOtherOpen = updatedRecords?.some(m => m.status === "em_andamento");

    return {
      ...vehicle,
      status: hasOtherOpen ? ("manutencao" as VehicleStatus) : ("disponivel" as VehicleStatus),
      currentMileage: Math.max(vehicle.currentMileage, input.exitMileage),
      nextRevisionDate: input.nextRevisionDate || vehicle.nextRevisionDate,
      nextRevisionMileage: input.nextRevisionMileage || vehicle.nextRevisionMileage,
      maintenanceRecords: updatedRecords,
    };
  });

  persistVehicles();
  emit();
}

export function getUsageById(id: string) {
  return usages.find((u) => u.id === id);
}

export function getUsageByAppointment(appointmentId: number | string) {
  hydrateRuntimeRecords();
  return usages.find((u) => u.appointmentId === appointmentId && u.status !== "cancelado");
}

export function getActiveUsageByVehicle(vehicleId: string) {
  return usages.find(
    (u) =>
      u.vehicleId === vehicleId &&
      (u.status === "em_deslocamento" || u.status === "aguardando_retirada"),
  );
}

export function getTodayUsages(today = new Date()) {
  const day = fleetDayKey(today.toISOString());
  return usages
    .filter((u) => {
      if (u.status === "cancelado") return false;
      return fleetDayKey(getUsageDepartureRef(u)) === day;
    })
    .sort((a, b) => (getUsageDepartureRef(a) ?? "").localeCompare(getUsageDepartureRef(b) ?? ""));
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
  vehicleId?: string;
  client?: string;
  destination: string;
  scheduledStartAt?: string;
  expectedReturnAt?: string;
}) {
  const usage: VehicleUsage = {
    id: `u-${input.appointmentId}-${Date.now()}`,
    appointmentId: input.appointmentId,
    vehicleId: input.vehicleId,
    operatorId: input.operatorId,
    client: input.client,
    destination: input.destination,
    scheduledStartAt: input.scheduledStartAt,
    expectedReturnAt: input.expectedReturnAt,
    status: "aguardando_retirada",
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };

  usages = [usage, ...usages];
  persistRuntimeRecords();
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
  persistRuntimeRecords();
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
  persistRuntimeRecords();
  emit();
}

export function cancelUsage(id: string) {
  const usage = usages.find((u) => u.id === id);
  usages = usages.map((u) =>
    u.id === id ? { ...u, status: "cancelado", updatedAt: nowISO() } : u,
  );
  if (usage?.vehicleId) {
    vehicles = vehicles.map((v) => (v.id === usage.vehicleId ? { ...v, status: "disponivel" } : v));
  }
  persistRuntimeRecords();
  emit();
}

export function hasConflict(vehicleId: string, start: string, end: string, ignoreUsageId?: string) {
  return usages.some((u) => {
    if (u.id === ignoreUsageId) return false;
    if (u.vehicleId !== vehicleId) return false;
    if (u.status !== "em_deslocamento") return false;
    const s = u.departureAt ?? u.scheduledStartAt;
    if (!s) return false;
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
