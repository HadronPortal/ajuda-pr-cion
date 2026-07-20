import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, Truck, Undo2, History, Filter } from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useVehicles,
  useUsages,
  getVehicleById,
  VEHICLE_STATUS_LABEL,
  USAGE_STATUS_LABEL,
  type UsageStatus,
  type Vehicle,
  type VehicleStatus,
} from "@/lib/fleet-store";
import { fleetActions } from "@/lib/fleet-action-store";
import { VehicleHistoryModal } from "@/components/fleet/VehicleHistoryModal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/frota")({
  head: () => ({ meta: [{ title: "Frota - Portal Prócion" }] }),
  component: FleetPage,
});

type TabKey = "hoje" | "veiculos" | "em_uso" | "historico";

const TABS: { key: TabKey; label: string; icon: typeof KeyRound }[] = [
  { key: "hoje", label: "Saídas de hoje", icon: KeyRound },
  { key: "veiculos", label: "Veículos", icon: Truck },
  { key: "em_uso", label: "Em uso", icon: Undo2 },
  { key: "historico", label: "Histórico", icon: History },
];

function FleetPage() {
  const [tab, setTab] = useState<TabKey>("hoje");
  const [query, setQuery] = useState("");

  return (
    <AppShell>
      <PageHeader
        title="Frota"
        description="Retiradas, devoluções e histórico dos veículos da equipe."
        breadcrumbs={[{ label: "Frota" }]}
        actions={
          <Button variant="outline" className="h-10 cursor-pointer gap-2 rounded-lg">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        }
      />

      <div className="mb-4 border-b border-border">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <div className="-mb-px flex min-w-0 items-center gap-1 overflow-x-auto">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.key === tab;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "flex h-11 shrink-0 cursor-pointer items-center gap-2 border-b-2 px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary text-primary font-medium"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="flex h-11 w-full items-center pb-2 sm:w-64 sm:pb-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar veículo, operador ou cliente..."
              className="h-9 cursor-text text-[13px]"
            />
          </div>
        </div>
      </div>


      {tab === "hoje" && <TodayView query={query} />}
      {tab === "veiculos" && <VehiclesView query={query} />}
      {tab === "em_uso" && <InUseView query={query} />}
      {tab === "historico" && <HistoryView query={query} />}
    </AppShell>
  );
}

// -----------------------------------------------------------------------------
// SAÍDAS DE HOJE
// -----------------------------------------------------------------------------
function TodayView({ query }: { query: string }) {
  const usages = useUsages();
  const today = new Date().toISOString().slice(0, 10) || "2026-07-20";
  // Use fixed reference date matching mock data
  const day = "2026-07-20";
  const rows = useMemo(
    () =>
      usages
        .filter((u) => {
          if (u.status === "cancelado") return false;
          const ref = (u.departureAt ?? u.expectedReturnAt ?? u.createdAt).slice(0, 10);
          return ref === day || ref === today;
        })
        .filter((u) => matchesQuery(u, query))
        .sort((a, b) =>
          (a.expectedReturnAt ?? a.departureAt ?? "").localeCompare(
            b.expectedReturnAt ?? b.departureAt ?? "",
          ),
        ),
    [usages, query, today],
  );

  return (
    <Card className="overflow-hidden p-0">
      <TableHeader
        cols={["Horário", "Operador", "Cliente/Destino", "Veículo", "Status", "Ações"]}
        widths={["120px", "120px", "1fr", "180px", "160px", "220px"]}
      />
      {rows.length === 0 && <EmptyRow label="Nenhuma saída registrada hoje." />}
      {rows.map((u) => {
        const vehicle = getVehicleById(u.vehicleId);
        return (
          <div
            key={u.id}
            className="grid items-center gap-3 border-t border-border px-4 py-2.5 text-[13px]"
            style={{ gridTemplateColumns: "120px 120px 1fr 180px 160px 220px" }}
          >
            <span className="tabular-nums text-foreground">
              {u.departureAt ? new Date(u.departureAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}
              {" → "}
              {u.expectedReturnAt ? new Date(u.expectedReturnAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "—"}
            </span>
            <span className="text-foreground">{u.operatorId}</span>
            <span className="min-w-0 truncate text-muted-foreground">{u.destination}</span>
            <span className="text-muted-foreground">
              {vehicle ? `${vehicle.model} · ${vehicle.plate}` : "—"}
            </span>
            <UsageBadge status={u.status} />
            <div className="flex justify-end gap-1.5">
              {u.status === "aguardando_retirada" && (
                <Button
                  size="sm"
                  className="h-8 cursor-pointer bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => fleetActions.openPickup(u.id)}
                >
                  <KeyRound className="mr-1.5 h-3.5 w-3.5" />
                  Retirar
                </Button>
              )}
              {u.status === "em_deslocamento" && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 cursor-pointer"
                  onClick={() => fleetActions.openReturn(u.id)}
                >
                  <Undo2 className="mr-1.5 h-3.5 w-3.5" />
                  Devolver
                </Button>
              )}
              {u.status === "devolvido" && (
                <span className="text-[11.5px] text-emerald-600 dark:text-emerald-400">
                  Devolvido{" "}
                  {u.returnedAt
                    ? new Date(u.returnedAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
                    : ""}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// VEÍCULOS
// -----------------------------------------------------------------------------
function VehiclesView({ query }: { query: string }) {
  const vehicles = useVehicles();
  const [selected, setSelected] = useState<Vehicle | null>(null);
  const rows = vehicles.filter((v) =>
    `${v.model} ${v.plate} ${v.category}`.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {rows.map((v) => (
          <Card
            key={v.id}
            role="button"
            tabIndex={0}
            onClick={() => setSelected(v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setSelected(v);
              }
            }}
            className="cursor-pointer overflow-hidden p-0 transition hover:border-primary/40 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="flex h-32 items-center justify-center bg-white">
              <img src={v.imageUrl} alt={v.model} className="h-full w-full object-contain p-2" />
            </div>
            <div className="space-y-2 p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[13.5px] font-medium">{v.model}</p>
                  <p className="mt-0.5 font-mono text-[11.5px] text-primary">{v.plate}</p>
                </div>
                <VehicleBadge status={v.status} />
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11.5px] text-muted-foreground">
                <span>Categoria: <span className="text-foreground">{v.category}</span></span>
                <span>Cor: <span className="text-foreground">{v.color}</span></span>
                <span>Ano: <span className="text-foreground">{v.yearModel}</span></span>
                <span>KM: <span className="text-foreground">{v.currentMileage.toLocaleString("pt-BR")}</span></span>
                <span className="col-span-2">
                  Revisão: <span className="text-foreground">{v.nextRevisionDate}</span>
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <VehicleHistoryModal
        vehicle={selected}
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      />
    </>
  );
}

// -----------------------------------------------------------------------------
// EM USO
// -----------------------------------------------------------------------------
function InUseView({ query }: { query: string }) {
  const usages = useUsages();
  const rows = usages
    .filter((u) => u.status === "em_deslocamento")
    .filter((u) => matchesQuery(u, query));

  return (
    <Card className="overflow-hidden p-0">
      <TableHeader
        cols={["Veículo", "Operador", "Destino", "Saída", "Previsão retorno", "Ações"]}
        widths={["200px", "120px", "1fr", "160px", "160px", "160px"]}
      />
      {rows.length === 0 && <EmptyRow label="Nenhum veículo em uso no momento." />}
      {rows.map((u) => {
        const vehicle = getVehicleById(u.vehicleId);
        return (
          <div
            key={u.id}
            className="grid items-center gap-3 border-t border-border px-4 py-2.5 text-[13px]"
            style={{ gridTemplateColumns: "200px 120px 1fr 160px 160px 160px" }}
          >
            <span className="text-foreground">
              {vehicle ? `${vehicle.model} · ${vehicle.plate}` : "—"}
            </span>
            <span className="text-foreground">{u.operatorId}</span>
            <span className="min-w-0 truncate text-muted-foreground">{u.destination}</span>
            <span className="tabular-nums text-muted-foreground">
              {u.departureAt ? new Date(u.departureAt).toLocaleString("pt-BR") : "—"}
            </span>
            <span className="tabular-nums text-muted-foreground">
              {u.expectedReturnAt ? new Date(u.expectedReturnAt).toLocaleString("pt-BR") : "—"}
            </span>
            <div className="flex justify-end">
              <Button
                size="sm"
                variant="outline"
                className="h-8 cursor-pointer"
                onClick={() => fleetActions.openReturn(u.id)}
              >
                <Undo2 className="mr-1.5 h-3.5 w-3.5" />
                Devolver
              </Button>
            </div>
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// HISTÓRICO
// -----------------------------------------------------------------------------
function HistoryView({ query }: { query: string }) {
  const usages = useUsages();
  const rows = usages
    .filter((u) => u.status === "devolvido" || u.status === "cancelado")
    .filter((u) => matchesQuery(u, query))
    .sort((a, b) => (b.returnedAt ?? b.updatedAt).localeCompare(a.returnedAt ?? a.updatedAt));

  return (
    <Card className="overflow-hidden p-0">
      <TableHeader
        cols={["Data", "Veículo", "Operador", "Destino", "KM", "Status"]}
        widths={["160px", "180px", "120px", "1fr", "120px", "140px"]}
      />
      {rows.length === 0 && <EmptyRow label="Sem registros no histórico." />}
      {rows.map((u) => {
        const vehicle = getVehicleById(u.vehicleId);
        return (
          <div
            key={u.id}
            className="grid items-center gap-3 border-t border-border px-4 py-2.5 text-[13px]"
            style={{ gridTemplateColumns: "160px 180px 120px 1fr 120px 140px" }}
          >
            <span className="tabular-nums text-muted-foreground">
              {u.returnedAt ? new Date(u.returnedAt).toLocaleString("pt-BR") : "—"}
            </span>
            <span className="text-foreground">
              {vehicle ? `${vehicle.model} · ${vehicle.plate}` : "—"}
            </span>
            <span className="text-foreground">{u.operatorId}</span>
            <span className="min-w-0 truncate text-muted-foreground">{u.destination}</span>
            <span className="tabular-nums text-muted-foreground">
              {u.distanceTraveled !== undefined ? `${u.distanceTraveled.toLocaleString("pt-BR")} km` : "—"}
            </span>
            <UsageBadge status={u.status} />
          </div>
        );
      })}
    </Card>
  );
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------
function matchesQuery(u: { destination: string; operatorId: string; client?: string }, q: string) {
  if (!q.trim()) return true;
  const needle = q.trim().toLowerCase();
  return `${u.destination} ${u.operatorId} ${u.client ?? ""}`.toLowerCase().includes(needle);
}

function TableHeader({ cols, widths }: { cols: string[]; widths: string[] }) {
  return (
    <div
      className="grid gap-3 border-b border-border bg-muted/25 px-4 py-2 text-[11px] uppercase tracking-wider text-muted-foreground"
      style={{ gridTemplateColumns: widths.join(" ") }}
    >
      {cols.map((c, i) => (
        <span key={i} className={cn(i === cols.length - 1 && "text-right")}>{c}</span>
      ))}
    </div>
  );
}

function EmptyRow({ label }: { label: string }) {
  return <p className="px-4 py-10 text-center text-sm text-muted-foreground">{label}</p>;
}

const BADGE_BASE =
  "inline-flex h-[26px] w-fit items-center whitespace-nowrap rounded-md border px-2.5 text-[11.5px] font-normal leading-none";

function VehicleBadge({ status }: { status: VehicleStatus }) {
  return (
    <Badge
      className={cn(
        BADGE_BASE,
        status === "disponivel" &&
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        status === "em_uso" &&
          "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300",
        status === "manutencao" &&
          "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300",
      )}
    >
      {VEHICLE_STATUS_LABEL[status]}
    </Badge>
  );
}

function UsageBadge({ status }: { status: UsageStatus }) {
  return (
    <Badge
      className={cn(
        BADGE_BASE,
        status === "em_deslocamento" &&
          "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300",
        status === "aguardando_retirada" &&
          "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-300",
        status === "devolvido" &&
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
        status === "cancelado" &&
          "border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300",
      )}
    >
      {USAGE_STATUS_LABEL[status]}
    </Badge>
  );
}
