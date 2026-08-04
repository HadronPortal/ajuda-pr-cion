import { useState, useMemo } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  Pencil, 
  Wrench, 
  KeyRound, 
  Undo2, 
  FileText, 
  History,
  ChevronRight,
  Gauge,
  Fuel,
  Calendar,
  ShieldCheck,
  User,
  LayoutDashboard,
  MapPin,
  Clock,
  ClipboardList,
  Info
} from "lucide-react";
import { 
  type Vehicle, 
  useUsages,
  formatFleetDateTime,
  getLicensingStatus,
  VEHICLE_STATUS_LABEL
} from "@/lib/fleet-store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface VehicleOverviewProps {
  vehicle: Vehicle;
}

export function VehicleOverview({ vehicle }: VehicleOverviewProps) {
  const navigate = useNavigate();
  const usages = useUsages();
  const [activeTab, setActiveTab] = useState("overview");

  const vehicleUsages = useMemo(() => {
    return usages
      .filter((u) => u.vehicleId === vehicle.id)
      .sort((a, b) => (b.returnedAt ?? b.updatedAt).localeCompare(a.returnedAt ?? a.updatedAt));
  }, [usages, vehicle.id]);

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
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Informações Gerais */}
            <Card className="p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <Info className="h-5 w-5" />
                <h3 className="text-base font-bold">Informações Gerais</h3>
              </div>
              <div className="grid grid-cols-1 gap-5 flex-1">
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

            {/* Últimas Utilizações */}
            <Card className="p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <Clock className="h-5 w-5" />
                <h3 className="text-base font-bold">Últimas Utilizações</h3>
              </div>
              <div className="space-y-4 flex-1">
                {vehicleUsages.slice(0, 5).map(u => (
                  <div key={u.id} className="group border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[13px]">{u.operatorId}</span>
                      </div>
                      <span className="text-[12px] text-muted-foreground font-normal bg-muted/50 px-2 py-0.5 rounded-full">
                        {formatFleetDateTime(u.departureAt).split(',')[0]}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-[12px] text-muted-foreground group-hover:text-foreground transition-colors">
                      <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{u.destination}</span>
                    </div>
                  </div>
                ))}
                {vehicleUsages.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <History className="h-8 w-8 mb-2 opacity-20" />
                    <p className="text-sm">Nenhum histórico disponível.</p>
                  </div>
                )}
              </div>
              {vehicleUsages.length > 5 && (
                <Button variant="ghost" size="sm" className="mt-4 w-full text-xs text-muted-foreground hover:text-primary" onClick={() => setActiveTab("utilization")}>
                  Ver todas as utilizações
                </Button>
              )}
            </Card>

            {/* Histórico Recente / Resumo */}
            <Card className="p-5 flex flex-col lg:col-span-1 md:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-primary">
                  <ClipboardList className="h-5 w-5" />
                  <h3 className="text-base font-bold">Histórico Recente</h3>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => setActiveTab("utilization")}>
                  Ver tudo
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="overflow-hidden flex-1">
                <div className="space-y-1">
                  {vehicleUsages.slice(0, 6).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium">{u.operatorId}</span>
                        <span className="text-[11px] text-muted-foreground">{formatFleetDateTime(u.departureAt)}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <Badge variant="outline" className="text-[10px] uppercase font-bold px-1.5 h-5 mb-1">
                          {u.returnMileage ? `${u.returnMileage.toLocaleString("pt-BR")} km` : "—"}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">Utilização</span>
                      </div>
                    </div>
                  ))}
                  {vehicleUsages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                      <History className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-sm">Nenhum registro encontrado.</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Manutenção Preventiva e Alertas (Extra Info) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 border-l-4 border-l-blue-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <ShieldCheck className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Manutenção e Revisão</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Próxima revisão agendada para <span className="font-semibold text-foreground">{vehicle.nextRevisionDate}</span> ou ao atingir <span className="font-semibold text-foreground">{(vehicle.currentMileage + 10000).toLocaleString("pt-BR")} km</span>.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-5 border-l-4 border-l-emerald-500">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <Gauge className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">Consumo Médio Est.</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    O veículo apresenta um consumo médio estimado de <span className="font-semibold text-foreground">12.5 km/l</span> nos últimos 30 dias.
                  </p>
                </div>
              </div>
            </Card>
          </div>
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
    <div className="flex flex-col gap-1.5 p-3 rounded-lg bg-muted/30 border border-border/40">
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80">{label}</span>
      <div className="flex items-center gap-2">
        {status !== "normal" && (
          <div className={cn(
            "h-2 w-2 rounded-full animate-pulse",
            status === "critical" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
          )} />
        )}
        <span className={cn(
          "text-[13px] font-semibold",
          status === "critical" ? "text-red-500" : status === "warning" ? "text-amber-500" : "text-foreground"
        )}>{value}</span>
      </div>
    </div>
  );
}
