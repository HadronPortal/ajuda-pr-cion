import { useEffect, useMemo } from "react";
import { Car } from "lucide-react";
import { toast } from "sonner";
import {
  useVehicles,
  useReservations,
  hasReservationConflict,
  hasConflict,
  getActiveReservationsByVehicle,
  VEHICLE_STATUS_LABEL,
  type Vehicle,
} from "@/lib/fleet-store";

export const NO_VEHICLE = "__none__";

const selectClass =
  "h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring";

export type VehicleAvailability =
  | { key: "disponivel"; label: "Disponível"; conflict?: undefined }
  | { key: "em_uso"; label: "Em uso" | "Em uso no período"; conflict?: undefined }
  | { key: "indisponivel"; label: "Indisponível"; conflict?: undefined }
  | { key: "pre_agendado"; label: "Pré-agendado"; conflict?: boolean };

export function combineDateTime(date: string, time: string): string | null {
  if (!date || !time) return null;
  return `${date}T${time}:00`;
}

export function evaluateVehicle(
  vehicle: Vehicle,
  windowStart: string | null,
  windowEnd: string | null,
): VehicleAvailability {
  if (vehicle.status === "manutencao") return { key: "indisponivel", label: "Em manutenção" };
  if (!windowStart || !windowEnd) {
    if (vehicle.status === "em_uso") return { key: "em_uso", label: "Em uso" };
  } else if (hasConflict(vehicle.id, windowStart, windowEnd)) {
    return { key: "em_uso", label: "Em uso no período" };
  }
  const reservations = getActiveReservationsByVehicle(vehicle.id);
  if (reservations.length === 0) return { key: "disponivel", label: "Disponível" };
  if (!windowStart || !windowEnd) {
    return { key: "pre_agendado", label: "Pré-agendado", conflict: false };
  }
  const conflict = hasReservationConflict(vehicle.id, windowStart, windowEnd);
  return { key: "pre_agendado", label: "Pré-agendado", conflict: !!conflict };
}

export function isUnavailable(info?: VehicleAvailability) {
  return (
    info?.key === "em_uso" ||
    info?.key === "indisponivel" ||
    (info?.key === "pre_agendado" && info.conflict === true)
  );
}

/** Disponibilidade dos veículos para a janela informada (data + horários do evento). */
export function useVehicleAvailability(date: string, startTime: string, endTime: string) {
  const vehicles = useVehicles();
  useReservations(); // re-render em mudanças de reserva
  const windowStart = combineDateTime(date, startTime);
  const windowEnd = combineDateTime(date, endTime);
  const windowValid = !!(windowStart && windowEnd && windowEnd > windowStart);

  const availability = useMemo(() => {
    const map = new Map<string, VehicleAvailability>();
    for (const vehicle of vehicles) {
      map.set(
        vehicle.id,
        evaluateVehicle(vehicle, windowValid ? windowStart : null, windowValid ? windowEnd : null),
      );
    }
    return map;
  }, [vehicles, windowStart, windowEnd, windowValid]);

  return { vehicles, availability, windowStart, windowEnd, windowValid };
}

/**
 * Seletor de veículo compartilhado (Frota) usado nos modais de agendamento.
 * Mostra somente veículos disponíveis para a data/horário selecionados;
 * ocupados ou já reservados no período aparecem desabilitados.
 */
export function VehicleAvailabilitySelect({
  date,
  startTime,
  endTime,
  value,
  onChange,
}: {
  date: string;
  startTime: string;
  endTime: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const { vehicles, availability } = useVehicleAvailability(date, startTime, endTime);

  useEffect(() => {
    if (value === NO_VEHICLE) return;
    const info = availability.get(value);
    if (!info) return;
    if (isUnavailable(info)) {
      onChange(NO_VEHICLE);
      toast.info("Veículo indisponível no período selecionado. Escolha outro.");
    }
  }, [availability, value, onChange]);

  const selected = availability.get(value);

  return (
    <>
      <div className="relative">
        <Car className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${selectClass} pl-8`}
        >
          <option value={NO_VEHICLE}>Não definido</option>
          {vehicles.map((vehicle) => {
            const info = availability.get(vehicle.id);
            const label = info?.label ?? VEHICLE_STATUS_LABEL[vehicle.status];
            const disabled = isUnavailable(info);
            return (
              <option key={vehicle.id} value={vehicle.id} disabled={disabled}>
                {vehicle.model} · {vehicle.plate} — {label}
                {disabled ? " (indisponível)" : ""}
              </option>
            );
          })}
        </select>
      </div>
      {value !== NO_VEHICLE && selected?.key === "pre_agendado" && selected.conflict && (
        <p className="mt-1 text-[11px] text-destructive">
          Conflito com outra pré-reserva no período informado.
        </p>
      )}
    </>
  );
}
