import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarClock,
  Download,
  Filter as FilterIcon,
  Fuel,
  Gauge,
  MapPin,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  useUsages,
  USAGE_STATUS_LABEL,
  type UsageStatus,
  type Vehicle,
  type VehicleUsage,
} from "@/lib/fleet-store";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------
function formatDate(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR");
}
function formatTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
function formatDateTime(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR");
}
function formatKm(v?: number) {
  return v !== undefined ? `${v.toLocaleString("pt-BR")} km` : "—";
}
function diffHours(a?: string, b?: string) {
  if (!a || !b) return 0;
  return Math.max(0, (new Date(b).getTime() - new Date(a).getTime()) / 36e5);
}
function fmtDuration(h: number) {
  if (h <= 0) return "0h";
  const hh = Math.floor(h);
  const mm = Math.round((h - hh) * 60);
  return mm ? `${hh}h ${mm}m` : `${hh}h`;
}

function usageBadgeClass(status: UsageStatus) {
  return cn(
    "inline-flex h-[22px] w-fit items-center gap-1 whitespace-nowrap rounded-md border px-2 text-[11px] font-normal leading-none",
    status === "em_deslocamento" &&
      "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300",
    status === "aguardando_retirada" &&
      "border-sky-500/25 bg-sky-500/10 text-sky-600 dark:text-sky-300",
    status === "devolvido" &&
      "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    status === "cancelado" &&
      "border-slate-400/30 bg-slate-400/10 text-slate-600 dark:text-slate-300",
  );
}

// ---------------------------------------------------------------------------
// Modal principal
// ---------------------------------------------------------------------------
export function VehicleHistoryModal({
  vehicle,
  open,
  onOpenChange,
}: {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const allUsages = useUsages();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filtros
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [operator, setOperator] = useState("");
  const [statusFilter, setStatusFilter] = useState<UsageStatus | "all">("all");
  const [destination, setDestination] = useState("");

  const vehicleUsages = useMemo(() => {
    if (!vehicle) return [];
    return allUsages
      .filter((u) => u.vehicleId === vehicle.id)
      .sort((a, b) =>
        (b.departureAt ?? b.createdAt).localeCompare(a.departureAt ?? a.createdAt),
      );
  }, [allUsages, vehicle]);

  const filtered = useMemo(() => {
    return vehicleUsages.filter((u) => {
      const ref = (u.departureAt ?? u.createdAt).slice(0, 10);
      if (dateFrom && ref < dateFrom) return false;
      if (dateTo && ref > dateTo) return false;
      if (operator.trim() && !u.operatorId.toLowerCase().includes(operator.trim().toLowerCase()))
        return false;
      if (statusFilter !== "all" && u.status !== statusFilter) return false;
      if (destination.trim()) {
        const hay = `${u.destination} ${u.client ?? ""}`.toLowerCase();
        if (!hay.includes(destination.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [vehicleUsages, dateFrom, dateTo, operator, statusFilter, destination]);

  const stats = useMemo(() => computeStats(vehicleUsages), [vehicleUsages]);

  const clearFilters = () => {
    setDateFrom("");
    setDateTo("");
    setOperator("");
    setStatusFilter("all");
    setDestination("");
  };

  const selected = selectedId ? vehicleUsages.find((u) => u.id === selectedId) ?? null : null;

  const handleOpenChange = (v: boolean) => {
    if (!v) setSelectedId(null);
    onOpenChange(v);
  };

  if (!vehicle) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 sm:w-[calc(100vw-2rem)] md:w-[960px] lg:w-[1040px] [&>button]:hidden">
        <DialogTitle className="sr-only">
          Histórico do veículo {vehicle.model} {vehicle.plate}
        </DialogTitle>

        {/* Cabeçalho */}
        <header className="relative shrink-0 border-b border-border bg-card px-4 pb-4 pt-4 md:px-6 md:pb-5 md:pt-5">
          <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.05)]">
            <span aria-hidden className="absolute left-0 top-0 h-full w-1 bg-primary" />
            <button
              type="button"
              onClick={() => handleOpenChange(false)}
              aria-label="Fechar"
              className="absolute right-2 top-2 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-4 pl-5 pr-16 py-4 md:py-5">
              <div className="grid h-16 w-24 shrink-0 place-items-center overflow-hidden rounded-lg border border-border bg-white">
                <img
                  src={vehicle.imageUrl}
                  alt={vehicle.model}
                  className="h-full w-full object-contain p-1"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-[15px] font-medium text-foreground">
                    {vehicle.model}
                  </span>
                  <span aria-hidden className="text-border">·</span>
                  <span className="font-mono text-[12.5px] text-primary">{vehicle.plate}</span>
                  <span aria-hidden className="text-border">·</span>
                  <VehicleStatusChip status={vehicle.status} />
                </div>
                <h2 className="mt-1 text-[13px] font-normal text-muted-foreground">
                  Histórico do veículo
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <Gauge className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">
                      {formatKm(vehicle.currentMileage)}
                    </span>
                  </span>
                  <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
                  <span className="inline-flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="font-medium text-foreground">{vehicle.category}</span>
                  </span>
                  <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />
                  <span className="inline-flex items-center gap-1">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Próxima revisão{" "}
                    <span className="font-medium text-foreground">
                      {vehicle.nextRevisionDate}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {selected ? (
            <DetailView usage={selected} vehicle={vehicle} onBack={() => setSelectedId(null)} />
          ) : (
            <ListView
              stats={stats}
              usages={filtered}
              totalCount={vehicleUsages.length}
              onOpen={(id) => setSelectedId(id)}
              filters={{
                dateFrom,
                dateTo,
                operator,
                statusFilter,
                destination,
                setDateFrom,
                setDateTo,
                setOperator,
                setStatusFilter,
                setDestination,
                clearFilters,
              }}
            />
          )}
        </div>

        {/* Rodapé */}
        <footer className="flex shrink-0 items-center justify-between gap-2 border-t border-border bg-card px-4 py-3 md:px-6">
          <div className="text-[11.5px] text-muted-foreground">
            {vehicleUsages.length} utilização(ões) registrada(s)
          </div>
          <div className="flex items-center gap-2">
            {!selected && (
              <Button
                variant="outline"
                className="h-9 cursor-pointer gap-2"
                onClick={() => exportHistory(vehicle, filtered)}
              >
                <Download className="h-4 w-4" />
                Exportar histórico
              </Button>
            )}
            <Button
              variant="outline"
              className="h-9 cursor-pointer"
              onClick={() => handleOpenChange(false)}
            >
              Fechar
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Lista + resumo + filtros
// ---------------------------------------------------------------------------
type Filters = {
  dateFrom: string;
  dateTo: string;
  operator: string;
  statusFilter: UsageStatus | "all";
  destination: string;
  setDateFrom: (v: string) => void;
  setDateTo: (v: string) => void;
  setOperator: (v: string) => void;
  setStatusFilter: (v: UsageStatus | "all") => void;
  setDestination: (v: string) => void;
  clearFilters: () => void;
};

function ListView({
  stats,
  usages,
  totalCount,
  onOpen,
  filters,
}: {
  stats: ReturnType<typeof computeStats>;
  usages: VehicleUsage[];
  totalCount: number;
  onOpen: (id: string) => void;
  filters: Filters;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4 md:px-6">
      {/* Resumo */}
      <section>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Resumo de utilização
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total de saídas" value={String(stats.totalTrips)} />
          <StatCard label="KM percorridos" value={formatKm(stats.totalKm)} />
          <StatCard label="Tempo em uso" value={stats.totalTime} />
          <StatCard label="Top operador" value={stats.topOperator} />
          <StatCard label="Última utilização" value={stats.lastUse} />
          <StatCard label="Média por saída" value={formatKm(stats.avgKm)} />
        </div>
      </section>

      {/* Filtros */}
      <section className="rounded-lg border border-border bg-muted/25 p-3">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <FilterIcon className="h-3.5 w-3.5" />
          Filtros
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          <LabeledField label="Período inicial">
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => filters.setDateFrom(e.target.value)}
              className="h-9 cursor-text text-[12.5px]"
            />
          </LabeledField>
          <LabeledField label="Período final">
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => filters.setDateTo(e.target.value)}
              className="h-9 cursor-text text-[12.5px]"
            />
          </LabeledField>
          <LabeledField label="Operador">
            <Input
              value={filters.operator}
              onChange={(e) => filters.setOperator(e.target.value)}
              placeholder="PRC..."
              className="h-9 cursor-text text-[12.5px]"
            />
          </LabeledField>
          <LabeledField label="Status">
            <select
              value={filters.statusFilter}
              onChange={(e) => filters.setStatusFilter(e.target.value as UsageStatus | "all")}
              className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-2 text-[12.5px]"
            >
              <option value="all">Todos</option>
              {(Object.keys(USAGE_STATUS_LABEL) as UsageStatus[]).map((s) => (
                <option key={s} value={s}>
                  {USAGE_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </LabeledField>
          <LabeledField label="Cliente/Destino">
            <Input
              value={filters.destination}
              onChange={(e) => filters.setDestination(e.target.value)}
              placeholder="Buscar..."
              className="h-9 cursor-text text-[12.5px]"
            />
          </LabeledField>
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            variant="ghost"
            className="h-8 cursor-pointer text-[12px]"
            onClick={filters.clearFilters}
          >
            Limpar filtros
          </Button>
        </div>
      </section>

      {/* Tabela */}
      <section className="min-h-0 rounded-lg border border-border">
        {totalCount === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhuma utilização registrada para este veículo
          </p>
        ) : usages.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhum registro encontrado com os filtros atuais
          </p>
        ) : (
          <div className="max-h-[420px] overflow-auto">
            <table className="w-full min-w-[980px] text-[12.5px]">
              <thead className="sticky top-0 z-10 bg-muted/40 text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <Th>Data</Th>
                  <Th>Saída</Th>
                  <Th>Devolução</Th>
                  <Th>Operador</Th>
                  <Th>Destino</Th>
                  <Th className="text-right">KM inicial</Th>
                  <Th className="text-right">KM final</Th>
                  <Th className="text-right">Percorrido</Th>
                  <Th>Comb. saída</Th>
                  <Th>Comb. devol.</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Ação</Th>
                </tr>
              </thead>
              <tbody>
                {usages.map((u) => {
                  const inProgress = u.status === "em_deslocamento";
                  return (
                    <tr
                      key={u.id}
                      className="border-t border-border transition hover:bg-accent/40"
                    >
                      <Td className="tabular-nums">{formatDate(u.departureAt ?? u.createdAt)}</Td>
                      <Td className="tabular-nums">{formatTime(u.departureAt)}</Td>
                      <Td className="tabular-nums">
                        {inProgress ? (
                          <span className="text-amber-600 dark:text-amber-300">Em andamento</span>
                        ) : (
                          formatTime(u.returnedAt)
                        )}
                      </Td>
                      <Td>{u.operatorId}</Td>
                      <Td className="max-w-[240px] truncate text-muted-foreground">
                        {u.destination}
                      </Td>
                      <Td className="text-right tabular-nums">{formatKm(u.departureMileage)}</Td>
                      <Td className="text-right tabular-nums">
                        {inProgress ? "—" : formatKm(u.returnMileage)}
                      </Td>
                      <Td className="text-right tabular-nums">
                        {computeDistance(u) !== undefined ? formatKm(computeDistance(u)) : "—"}
                      </Td>
                      <Td className="text-muted-foreground">{u.fuelAtDeparture ?? "—"}</Td>
                      <Td className="text-muted-foreground">
                        {inProgress ? "—" : u.fuelAtReturn ?? "—"}
                      </Td>
                      <Td>
                        <span className={usageBadgeClass(u.status)}>
                          {USAGE_STATUS_LABEL[u.status]}
                        </span>
                      </Td>
                      <Td className="text-right">
                        <Button
                          variant="ghost"
                          className="h-7 cursor-pointer px-2 text-[12px]"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpen(u.id);
                          }}
                        >
                          Ver detalhes
                        </Button>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th
      className={cn("whitespace-nowrap px-3 py-2 text-left font-medium", className)}
    >
      {children}
    </th>
  );
}
function Td({ children, className }: { children: React.ReactNode; className?: string }) {
  return <td className={cn("whitespace-nowrap px-3 py-2 align-middle", className)}>{children}</td>;
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <p className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-[13.5px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function LabeledField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10.5px] uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function VehicleStatusChip({ status }: { status: Vehicle["status"] }) {
  const map: Record<Vehicle["status"], { label: string; cls: string }> = {
    disponivel: {
      label: "Disponível",
      cls: "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    },
    em_uso: {
      label: "Em uso",
      cls: "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300",
    },
    manutencao: {
      label: "Manutenção",
      cls: "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300",
    },
  };
  const { label, cls } = map[status];
  return (
    <Badge
      className={cn(
        "inline-flex h-[22px] w-fit items-center border px-2 text-[11px] font-normal leading-none",
        cls,
      )}
    >
      {label}
    </Badge>
  );
}

// ---------------------------------------------------------------------------
// Detalhes da utilização
// ---------------------------------------------------------------------------
function DetailView({
  usage,
  vehicle,
  onBack,
}: {
  usage: VehicleUsage;
  vehicle: Vehicle;
  onBack: () => void;
}) {
  const distance = computeDistance(usage);
  const inProgress = usage.status === "em_deslocamento";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-4 md:px-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          className="h-8 cursor-pointer gap-1.5 px-2 text-[12.5px]"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao histórico
        </Button>
        <span className={usageBadgeClass(usage.status)}>{USAGE_STATUS_LABEL[usage.status]}</span>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <DetailBlock title="Veículo">
          <Row icon={Truck} label="Veículo" value={`${vehicle.model} · ${vehicle.plate}`} />
          <Row icon={UserRound} label="Operador" value={usage.operatorId} />
          <Row
            icon={CalendarClock}
            label="Agendamento"
            value={usage.appointmentId ? String(usage.appointmentId) : "—"}
          />
        </DetailBlock>

        <DetailBlock title="Cliente e destino">
          <Row icon={UserRound} label="Cliente" value={usage.client ?? "—"} />
          <Row icon={MapPin} label="Endereço" value={usage.destination} />
        </DetailBlock>

        <DetailBlock title="Saída">
          <Row icon={CalendarClock} label="Data/hora" value={formatDateTime(usage.departureAt)} />
          <Row icon={Gauge} label="KM inicial" value={formatKm(usage.departureMileage)} />
          <Row icon={Fuel} label="Combustível" value={usage.fuelAtDeparture ?? "—"} />
        </DetailBlock>

        <DetailBlock title="Devolução">
          <Row
            icon={CalendarClock}
            label="Data/hora"
            value={inProgress ? "Em andamento" : formatDateTime(usage.returnedAt)}
          />
          <Row
            icon={Gauge}
            label="KM final"
            value={inProgress ? "—" : formatKm(usage.returnMileage)}
          />
          <Row
            icon={Fuel}
            label="Combustível"
            value={inProgress ? "—" : usage.fuelAtReturn ?? "—"}
          />
          <Row
            icon={Gauge}
            label="Total percorrido"
            value={distance !== undefined ? formatKm(distance) : "—"}
          />
        </DetailBlock>

        <DetailBlock title="Observações da retirada" full>
          <p className="text-[12.5px] text-foreground">
            {usage.departureNotes ?? (
              <span className="text-muted-foreground">Sem observações.</span>
            )}
          </p>
        </DetailBlock>

        <DetailBlock title="Observações da devolução" full>
          <p className="text-[12.5px] text-foreground">
            {usage.returnNotes ?? (
              <span className="text-muted-foreground">Sem observações.</span>
            )}
          </p>
        </DetailBlock>

        <DetailBlock title="Fotos da saída" full>
          <PhotoGallery photos={usage.departurePhotos} />
        </DetailBlock>

        <DetailBlock title="Fotos da devolução" full>
          <PhotoGallery photos={usage.returnPhotos} />
        </DetailBlock>

        <DetailBlock title="Checklist de devolução" full>
          <p className="text-[12.5px] text-muted-foreground">
            Nenhum item de checklist registrado.
          </p>
        </DetailBlock>

        <DetailBlock title="Ocorrências ou avarias" full>
          <p className="text-[12.5px] text-muted-foreground">Nenhuma ocorrência registrada.</p>
        </DetailBlock>
      </div>
    </div>
  );
}

function DetailBlock({
  title,
  children,
  full,
}: {
  title: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-card p-3",
        full && "md:col-span-2",
      )}
    >
      <p className="mb-2 text-[10.5px] font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col gap-1.5">{children}</div>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2 text-[12.5px]">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <span className="text-muted-foreground">{label}: </span>
        <span className="text-foreground">{value}</span>
      </div>
    </div>
  );
}

function PhotoGallery({ photos }: { photos?: string[] }) {
  if (!photos || photos.length === 0) {
    return <p className="text-[12.5px] text-muted-foreground">Nenhuma foto anexada.</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {photos.map((p, i) => (
        <div
          key={i}
          className="aspect-video overflow-hidden rounded-md border border-border bg-muted"
        >
          <img src={p} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Estatísticas + exportação
// ---------------------------------------------------------------------------
function computeDistance(u: VehicleUsage) {
  if (u.distanceTraveled !== undefined) return u.distanceTraveled;
  if (u.departureMileage !== undefined && u.returnMileage !== undefined) {
    return Math.max(0, u.returnMileage - u.departureMileage);
  }
  return undefined;
}

function computeStats(usages: VehicleUsage[]) {
  if (usages.length === 0) {
    return {
      totalTrips: 0,
      totalKm: 0,
      totalTime: "0h",
      topOperator: "—",
      lastUse: "—",
      avgKm: 0,
    };
  }
  const totalKm = usages.reduce((s, u) => s + (computeDistance(u) ?? 0), 0);
  const totalHours = usages.reduce(
    (s, u) => s + diffHours(u.departureAt, u.returnedAt),
    0,
  );
  const opCount: Record<string, number> = {};
  usages.forEach((u) => (opCount[u.operatorId] = (opCount[u.operatorId] ?? 0) + 1));
  const topOperator =
    Object.entries(opCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  const withDistance = usages.filter((u) => computeDistance(u) !== undefined);
  const avgKm = withDistance.length
    ? Math.round(totalKm / withDistance.length)
    : 0;
  const lastRef = usages
    .map((u) => u.returnedAt ?? u.departureAt ?? u.createdAt)
    .sort()
    .at(-1);
  return {
    totalTrips: usages.length,
    totalKm,
    totalTime: fmtDuration(totalHours),
    topOperator,
    lastUse: lastRef ? formatDate(lastRef) : "—",
    avgKm,
  };
}

function exportHistory(vehicle: Vehicle, usages: VehicleUsage[]) {
  const header = [
    "Data",
    "Saida",
    "Devolucao",
    "Operador",
    "Cliente",
    "Destino",
    "KM inicial",
    "KM final",
    "Percorrido",
    "Combustivel saida",
    "Combustivel devolucao",
    "Status",
  ];
  const rows = usages.map((u) => [
    formatDate(u.departureAt ?? u.createdAt),
    formatTime(u.departureAt),
    u.status === "em_deslocamento" ? "Em andamento" : formatTime(u.returnedAt),
    u.operatorId,
    u.client ?? "",
    u.destination,
    u.departureMileage ?? "",
    u.returnMileage ?? "",
    computeDistance(u) ?? "",
    u.fuelAtDeparture ?? "",
    u.fuelAtReturn ?? "",
    USAGE_STATUS_LABEL[u.status],
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(";"))
    .join("\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `historico-${vehicle.plate}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
