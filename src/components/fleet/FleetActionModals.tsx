import { useFleetAction } from "@/lib/fleet-action-store";
import { VehiclePickerModal } from "./VehiclePickerModal";
import { RegisterDepartureModal } from "./RegisterDepartureModal";
import { ReturnVehicleModal } from "./ReturnVehicleModal";

export function FleetActionModals() {
  const action = useFleetAction();
  if (!action) return null;
  if (action.kind === "picker") return <VehiclePickerModal usageId={action.usageId} />;
  if (action.kind === "departure")
    return <RegisterDepartureModal usageId={action.usageId} vehicleId={action.vehicleId} />;
  if (action.kind === "return") return <ReturnVehicleModal usageId={action.usageId} />;
  return null;
}
