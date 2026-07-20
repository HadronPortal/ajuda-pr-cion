import { useSyncExternalStore } from "react";

export type FleetActionState =
  | { kind: "picker"; usageId: string }
  | { kind: "departure"; usageId: string; vehicleId: string }
  | { kind: "return"; usageId: string }
  | null;

let state: FleetActionState = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getFleetActionState() {
  return state;
}

export function useFleetAction() {
  return useSyncExternalStore(subscribe, getFleetActionState, getFleetActionState);
}

export const fleetActions = {
  openPickup(usageId: string) {
    state = { kind: "picker", usageId };
    emit();
  },
  openDeparture(usageId: string, vehicleId: string) {
    state = { kind: "departure", usageId, vehicleId };
    emit();
  },
  openReturn(usageId: string) {
    state = { kind: "return", usageId };
    emit();
  },
  close() {
    state = null;
    emit();
  },
};
