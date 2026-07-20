import { useMemo, useState, useEffect } from "react";
import { toast } from "sonner";
import { Car, Check, ChevronLeft, ChevronRight, Fuel } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import {
  useVehicles,
  useUsages,
  getVehicleById,
  VEHICLE_STATUS_LABEL,
} from "@/lib/fleet-store";
import { fleetActions } from "@/lib/fleet-action-store";
import { cn } from "@/lib/utils";

const preventClose = (e: Event) => e.preventDefault();

export function VehiclePickerModal({ usageId }: { usageId: string }) {
  const vehicles = useVehicles();
  const usages = useUsages();
  const [index, setIndex] = useState(0);

  const vehicle = vehicles[index];
  const activeUsage = useMemo(
    () =>
      usages.find(
        (u) =>
          u.vehicleId === vehicle?.id &&
          (u.status === "em_deslocamento" || u.status === "aguardando_retirada"),
      ),
    [usages, vehicle?.id],
  );

  useEffect(() => {
    const firstAvailable = vehicles.findIndex((v) => v.status === "disponivel");
    if (firstAvailable >= 0) setIndex(firstAvailable);
  }, [vehicles]);

  if (!vehicle) return null;

  const previous = () => setIndex((c) => (c - 1 + vehicles.length) % vehicles.length);
  const next = () => setIndex((c) => (c + 1) % vehicles.length);

  const confirm = () => {
    if (vehicle.status !== "disponivel") {
      toast.error(`O veículo ${vehicle.model} não está disponível.`);
      return;
    }
    fleetActions.openDeparture(usageId, vehicle.id);
  };

  return (
    <Dialog open onOpenChange={(v) => !v && fleetActions.close()}>
      <DialogContent
        onPointerDownOutside={preventClose}
        onInteractOutside={preventClose}
        onEscapeKeyDown={preventClose}
        className="flex w-[calc(100vw-2rem)] max-w-[860px] max-h-[calc(100vh-32px)] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Selecionar veículo</DialogTitle>
        <DetailModalHeader
          icon={Car}
          title="Selecionar veículo"
          protocol={`${index + 1} de ${vehicles.length} veículos da frota`}
          onClose={() => fleetActions.close()}
        />

        <div className="flex-1 min-h-0 overflow-y-auto p-5">
          <div className="grid gap-4 md:grid-cols-[280px_1fr]">
            <div className="overflow-hidden rounded-xl border border-border">
              <div className="flex h-40 items-center justify-center bg-white">
                <img src={vehicle.imageUrl} alt={vehicle.model} className="h-full w-full object-contain p-3" />
              </div>
              <div className="p-3 text-center">
                <p className="text-[14px] font-medium">{vehicle.model}</p>
                <p className="mt-0.5 font-mono text-[12px] text-primary">{vehicle.plate}</p>
              </div>
              <div className="flex justify-center gap-1.5 pb-3">
                {vehicles.map((v, i) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      i === index ? "w-5 bg-primary" : "w-1.5 bg-muted-foreground/30",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Veículo</p>
                  <h3 className="mt-0.5 text-[15px] font-medium">
                    {vehicle.model} · <span className="font-mono text-primary">{vehicle.plate}</span>
                  </h3>
                </div>
                <Badge
                  className={cn(
                    "border px-2 py-0.5 text-[11px] font-normal",
                    vehicle.status === "disponivel"
                      ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                      : vehicle.status === "em_uso"
                        ? "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                        : "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300",
                  )}
                >
                  {VEHICLE_STATUS_LABEL[vehicle.status]}
                </Badge>
              </div>

              <dl className="grid grid-cols-2 gap-2 rounded-lg border border-border p-3 text-[12.5px]">
                <Spec label="Categoria" value={vehicle.category} />
                <Spec label="Cor" value={vehicle.color} />
                <Spec label="Ano/Modelo" value={vehicle.yearModel} />
                <Spec label="Quilometragem" value={`${vehicle.currentMileage.toLocaleString("pt-BR")} km`} />
                <Spec label="Próxima revisão" value={`${vehicle.nextRevisionDate} · ${vehicle.nextRevisionMileage.toLocaleString("pt-BR")} km`} />
                <Spec
                  label="Combustível"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <Fuel className="h-3.5 w-3.5 opacity-70" />
                      {vehicle.fuelLevel}
                    </span>
                  }
                />
              </dl>

              {activeUsage && (
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-[12px] text-amber-800 dark:text-amber-200">
                  Em uso por <b>{activeUsage.operatorId}</b> desde{" "}
                  {activeUsage.departureAt ? new Date(activeUsage.departureAt).toLocaleString("pt-BR") : "—"}.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-card px-4 py-2.5">
          <div className="flex gap-1.5">
            <Button variant="outline" size="icon" onClick={previous} className="cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={next} className="cursor-pointer">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={confirm}
            disabled={vehicle.status !== "disponivel"}
            className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Check className="mr-1.5 h-4 w-4" />
            Selecionar veículo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="truncate text-foreground">{value}</p>
    </div>
  );
}

// Utility exported for other modals
export { getVehicleById };
