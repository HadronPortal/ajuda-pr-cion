import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  Pencil, 
  Wrench, 
  KeyRound, 
  Undo2, 
  FileText, 
  History,
  AlertTriangle,
  Info,
  ChevronRight,
  Gauge,
  Fuel,
  Calendar,
  ShieldCheck,
  User,
  LayoutDashboard,
  Tractor
} from "lucide-react";
import { 
  type Vehicle, 
  type VehicleUsage,
  useUsages,
  formatFleetDateTime,
  getLicensingStatus,
  VEHICLE_STATUS_LABEL
} from "@/lib/fleet-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { VehicleScene } from "./VehicleScene";
import { ComponentInfoPanel, COMPONENT_DATA } from "./InteractivePoints";
import { VehicleUsageMap } from "./VehicleUsageMap";
import { cn } from "@/lib/utils";

interface VehicleOverviewProps {
  vehicle: Vehicle;
}

export function VehicleOverview({ vehicle }: VehicleOverviewProps) {
  const navigate = useNavigate();
  const usages = useUsages();
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPoint, setSelectedPoint] = useState<{ name: string; data: any } | null>(null);
  const [mapFilters, setMapFilters] = useState({
    period: "all",
    client: "all",
    operator: "all",
    status: "all"
  });

  const vehicleUsages = useMemo(() => {
    return usages
      .filter((u) => u.vehicleId === vehicle.id)
      .sort((a, b) => (b.returnedAt ?? b.updatedAt).localeCompare(a.returnedAt ?? a.updatedAt));
  }, [usages, vehicle.id]);

  const filteredUsages = useMemo(() => {
    return vehicleUsages.filter(u => {
      // Normalize internal status for filtering
      const status = u.status.toLowerCase();
      const filterStatus = mapFilters.status.toLowerCase();
      
      if (filterStatus !== "all") {
        const isCompleted = filterStatus === "concluido" && (status === "concluido" || status === "devolvido");
        const isInUse = filterStatus === "em_deslocamento" && (status === "em_deslocamento" || status === "em_uso");
        const isScheduled = filterStatus === "agendado" && (status === "agendado" || status === "aguardando_retirada");
        const isCancelled = filterStatus === "cancelado" && status === "cancelado";
        
        if (!isCompleted && !isInUse && !isScheduled && !isCancelled) return false;
      }

      if (mapFilters.operator !== "all" && u.operatorId !== mapFilters.operator) return false;
      if (mapFilters.client !== "all" && u.client !== mapFilters.client) return false;
      
      if (mapFilters.period !== "all") {
        const dateStr = u.departureAt || u.scheduledStartAt || "";
        if (!dateStr) return false;
        const date = new Date(dateStr);
        const now = new Date();
        if (mapFilters.period === "today") {
          return date.toDateString() === now.toDateString();
        }
        if (mapFilters.period === "week") {
          const weekAgo = new Date();
          weekAgo.setDate(now.getDate() - 7);
          return date >= weekAgo;
        }
        if (mapFilters.period === "month") {
          const monthAgo = new Date();
          monthAgo.setMonth(now.getMonth() - 1);
          return date >= monthAgo;
        }
      }
      return true;
    });
  }, [vehicleUsages, mapFilters]);

  const lastUsage = vehicleUsages.find(u => u.status === "devolvido");
  const currentUsage = vehicleUsages.find(u => u.status === "em_deslocamento");
  const licensing = getLicensingStatus(vehicle);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Resumo Principal Superior */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate({ to: "/frota" })}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">{vehicle.model}</h1>
                <Badge variant="secondary" className="font-mono text-[11px]">{vehicle.yearModel}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Visão geral do veículo</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              className={cn(
                "h-7 px-3 text-[11px] font-semibold uppercase tracking-wider",
                vehicle.status === "disponivel" ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" :
                vehicle.status === "manutencao" ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20" :
                "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20"
              )}
            >
              {VEHICLE_STATUS_LABEL[vehicle.status]}
            </Badge>
          </div>
        </div>

        <Card className="grid grid-cols-2 gap-y-4 gap-x-2 p-4 sm:grid-cols-4 lg:grid-cols-8 bg-muted/20 border-border/50">
          <HeaderStat icon={Calendar} label="Modelo e ano" value={`${vehicle.model} / ${vehicle.yearModel}`} />
          <HeaderStat icon={FileText} label="Placa" value={vehicle.plate} />
          <HeaderStat icon={ShieldCheck} label="Renavam" value={vehicle.renavam || "—"} />
          <HeaderStat icon={Gauge} label="KM Atual" value={`${vehicle.currentMileage.toLocaleString("pt-BR")} km`} />
          <HeaderStat icon={Fuel} label="Combustível" value={vehicle.fuelLevel} />
          <HeaderStat icon={LayoutDashboard} label="Status" value={VEHICLE_STATUS_LABEL[vehicle.status]} />
          <HeaderStat icon={User} label="Último condutor" value={lastUsage?.operatorId || "—"} />
          <HeaderStat icon={Wrench} label="Próxima revisão" value={vehicle.nextRevisionDate} />
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-2">
        <ActionButton icon={Pencil} label="Editar veículo" />
        <ActionButton icon={Wrench} label="Nova manutenção" />
        <ActionButton icon={KeyRound} label="Registrar saída" disabled={vehicle.status !== "disponivel"} />
        <ActionButton icon={Undo2} label="Registrar devolução" disabled={vehicle.status !== "em_uso"} />
        <ActionButton icon={FileText} label="Documentos" />
        <ActionButton icon={History} label="Histórico" />
      </div>

      {/* Main Content Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabTrigger value="overview">Visão geral</TabTrigger>
          <TabTrigger value="documents">Documentos</TabTrigger>
          <TabTrigger value="maintenance">Manutenções</TabTrigger>
          <TabTrigger value="utilization">Utilizações</TabTrigger>
          <TabTrigger value="occurrences">Ocorrências</TabTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Map Area */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <Card className="relative h-[450px] overflow-hidden">
                <VehicleUsageMap 
                  usages={filteredUsages} 
                  filters={mapFilters}
                  onFilterChange={(f) => setMapFilters(prev => ({ ...prev, ...f }))}
                  allOperators={Array.from(new Set(vehicleUsages.map(u => u.operatorId)))}
                  allClients={Array.from(new Set(vehicleUsages.map(u => u.client).filter(Boolean) as string[]))}
                />
              </Card>
            </div>

            {/* Side Panel */}
            <div className="flex flex-col gap-6">
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-semibold">Informações Gerais</h3>
                <div className="space-y-3">
                  <SideInfo label="Situação licenciamento" value={licensing.label} 
                    status={licensing.status === "overdue" ? "critical" : licensing.status === "due_soon" ? "warning" : "normal"} 
                  />
                  <SideInfo label="Próxima manutenção" value={vehicle.nextRevisionDate} />
                  <SideInfo label="Utilização atual" value={currentUsage ? `Em uso (${currentUsage.operatorId})` : "Disponível"} />
                  <SideInfo label="Último condutor" value={lastUsage?.operatorId || "—"} />
                  <SideInfo label="Quilometragem" value={`${vehicle.currentMileage.toLocaleString("pt-BR")} km`} />
                  <SideInfo label="Combustível" value={vehicle.fuelLevel} />
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="mb-4 text-sm font-semibold">Últimas Utilizações</h3>
                <div className="space-y-4">
                  {vehicleUsages.slice(0, 3).map(u => (
                    <div key={u.id} className="border-b pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between font-medium">
                        <span className="text-[13px]">{u.operatorId}</span>
                        <span className="text-[12px] text-muted-foreground">{formatFleetDateTime(u.departureAt).split(',')[0]}</span>
                      </div>
                      <div className="mt-1 text-[12px] text-muted-foreground">
                        {u.destination}
                      </div>
                    </div>
                  ))}
                  {vehicleUsages.length === 0 && (
                    <p className="text-center text-sm text-muted-foreground py-4">Nenhum histórico.</p>
                  )}
                </div>
              </Card>
            </div>
          </div>

          {/* Bottom History Table */}
          <Card className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Histórico Recente</h3>
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todo o histórico
                <ChevronRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="pb-2 text-left font-medium">Data</th>
                    <th className="pb-2 text-left font-medium">Tipo de serviço</th>
                    <th className="pb-2 text-left font-medium">Operador / Oficina</th>
                    <th className="pb-2 text-left font-medium">Quilometragem</th>
                    <th className="pb-2 text-left font-medium text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicleUsages.slice(0, 5).map(u => (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-3 tabular-nums">{formatFleetDateTime(u.departureAt).split(',')[0]}</td>
                      <td className="py-3">Utilização</td>
                      <td className="py-3">{u.operatorId}</td>
                      <td className="py-3 tabular-nums">{u.returnMileage ? `${u.returnMileage.toLocaleString("pt-BR")} km` : "—"}</td>
                      <td className="py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-xs">Ver detalhes</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card className="p-12 text-center text-muted-foreground">
            Módulo de manutenções detalhadas em desenvolvimento.
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function HeaderStat({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </div>
      <div className="text-[13px] font-medium truncate">{value}</div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, disabled }: { icon: any, label: string, disabled?: boolean }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={disabled}
      className={cn(
        "h-9 gap-2 bg-background hover:bg-muted/50 transition-colors border-border/60 shadow-sm",
        disabled && "opacity-50 grayscale"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-[13px]">{label}</span>
    </Button>
  );
}

function TabTrigger({ value, children }: { value: string, children: React.ReactNode }) {
  return (
    <TabsTrigger 
      value={value}
      className="rounded-none border-b-2 border-transparent px-4 py-3 text-[13px] font-medium transition-all data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none hover:text-foreground/80"
    >
      {children}
    </TabsTrigger>
  );
}

function SideInfo({ label, value, status = "normal" }: { label: string, value: string, status?: "normal" | "warning" | "critical" }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {status !== "normal" && (
          <div className={cn(
            "h-2 w-2 rounded-full",
            status === "critical" ? "bg-red-500" : "bg-amber-500"
          )} />
        )}
        <span className="text-[13px] font-medium">{value}</span>
      </div>
    </div>
  );
}
