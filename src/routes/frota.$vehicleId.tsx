import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { getVehicleById } from "@/lib/fleet-store";
import { VehicleOverview } from "@/components/fleet/vehicle-overview/VehicleOverview";
import { AppShell } from "@/components/portal/AppShell";

export const Route = createFileRoute("/frota/$vehicleId")({
  head: ({ params }) => {
    const vehicle = getVehicleById(params.vehicleId);
    return {
      meta: [{ title: `${vehicle ? vehicle.model : "Veículo"} - Visão Geral` }],
    };
  },
  component: VehicleOverviewRoute,
});

function VehicleOverviewRoute() {
  const { vehicleId } = Route.useParams();
  const vehicle = getVehicleById(vehicleId);
  const navigate = useNavigate();

  if (!vehicle) {
    return (
      <AppShell>
        <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Veículo não encontrado.</p>
          <button
            onClick={() => navigate({ to: "/frota" })}
            className="text-primary hover:underline"
          >
            Voltar para a Frota
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <VehicleOverview vehicle={vehicle} />
    </AppShell>
  );
}
