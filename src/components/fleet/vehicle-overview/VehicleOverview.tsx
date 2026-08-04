import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
import { 
  ArrowLeft, 
  KeyRound, 
  Undo2, 
  History,
  Gauge,
  Fuel,
  Calendar,
  ShieldCheck,
  User,
  LayoutDashboard,
  Clock,
  ClipboardList,
  Wrench,
  Key,
  MapPin,
  AlertTriangle,
  Download
} from "lucide-react";
import { 
  type Vehicle, 
  useUsages,
  formatFleetDateTime,
  VEHICLE_STATUS_LABEL,
  getVehicleById
} from "@/lib/fleet-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { VehicleHistoryModal } from "../VehicleHistoryModal";
import { fleetActions } from "@/lib/fleet-action-store";
import { FleetEntryDialog } from "@/components/fleet/FleetEntryDialog";
import { VehicleHistoryTimeline } from "../VehicleHistoryTimeline";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface VehicleOverviewProps {
  vehicle: Vehicle;
}

export function VehicleOverview({ vehicle }: VehicleOverviewProps) {
  const navigate = useNavigate();
  const usages = useUsages();
  const [activeTab, setActiveTab] = useState("overview");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [isMaintenanceDetailsOpen, setIsMaintenanceDetailsOpen] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState<any>(null);
  const [isUsageDetailsOpen, setIsUsageDetailsOpen] = useState(false);

  const vehicleUsages = useMemo(() => {
    return usages
      .filter((u) => u.vehicleId === vehicle.id)
      .sort((a, b) => (b.returnedAt ?? b.updatedAt).localeCompare(a.returnedAt ?? a.updatedAt));
  }, [usages, vehicle.id]);

  const lastUsage = vehicleUsages.find(u => u.status === "devolvido");

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

        <Card className="grid grid-cols-1 gap-y-4 gap-x-6 p-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 bg-muted/20 border-border/50">
          <HeaderStat 
            icon={Calendar} 
            label="Modelo" 
            value={vehicle.model} 
            className="sm:col-span-2 md:col-span-2 lg:col-span-2 xl:col-span-1"
          />
          <HeaderStat icon={Key} label="Placa" value={vehicle.plate} />
          <HeaderStat icon={ShieldCheck} label="Renavam" value={vehicle.renavam || "—"} />
          <HeaderStat icon={Gauge} label="KM Atual" value={`${vehicle.currentMileage.toLocaleString("pt-BR")} km`} />
          <HeaderStat icon={Fuel} label="Combustível" value={vehicle.fuelLevel} />
          <HeaderStat icon={LayoutDashboard} label="Status" value={VEHICLE_STATUS_LABEL[vehicle.status]} />
          <HeaderStat icon={User} label="Último condutor" value={lastUsage?.operatorId || "—"} />
          <HeaderStat icon={Wrench} label="Próxima revisão" value={vehicle.nextRevisionDate} />
        </Card>
      </div>

      {/* Barra de Ações */}
      <div className="flex flex-wrap gap-2">
        <FleetEntryDialog defaultVehicleId={vehicle.id} triggerLabel="Adicionar lançamento" />
        {vehicle.status === "em_uso" && (
          <ActionButton 
            icon={Undo2} 
            label="Registrar devolução" 
            onClick={() => {
              const current = vehicleUsages.find(u => u.status === "em_deslocamento");
              if (current) fleetActions.openReturn(current.id);
            }} 
          />
        )}
        <ActionButton icon={History} label="Histórico" onClick={() => setIsHistoryModalOpen(true)} />
      </div>

      {/* Main Content Area */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="h-auto w-full justify-start rounded-none border-b bg-transparent p-0">
          <TabsTrigger value="overview">Visão geral</TabsTrigger>
          <TabsTrigger value="maintenance">Manutenções</TabsTrigger>
          <TabsTrigger value="utilization">Utilizações</TabsTrigger>
          <TabsTrigger value="occurrences">Ocorrências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Últimas Utilizações */}
            <Card className="p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-6 text-primary">
                <Clock className="h-5 w-5" />
                <h3 className="text-base font-bold">Últimas Utilizações</h3>
              </div>
              <div className="space-y-4 flex-1">
                {vehicleUsages.slice(0, 4).map(u => (
                  <div key={u.id} className="group border-b border-border/40 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between font-semibold mb-1">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[13px]">{u.operatorId}</span>
                      </div>
                      <span className="text-[12px] text-muted-foreground font-normal bg-muted/50 px-2 py-0.5 rounded-full">
                        {formatFleetDateTime(u.departureAt || u.scheduledStartAt).split(',')[0]}
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
              {vehicleUsages.length > 4 && (
                <Button variant="ghost" size="sm" className="mt-4 w-full text-xs text-muted-foreground hover:text-primary" onClick={() => setIsHistoryModalOpen(true)}>
                  Ver tudo
                </Button>
              )}
            </Card>

            <Card className="p-5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-primary">
                  <ClipboardList className="h-5 w-5" />
                  <h3 className="text-base font-bold">Linha do Tempo</h3>
                </div>
              </div>
              
              <div className="overflow-hidden flex-1">
                <VehicleHistoryTimeline vehicleId={vehicle.id} />
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="mt-6 flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <Wrench className="h-5 w-5" />
                <h3 className="text-base font-bold">Histórico de Manutenções</h3>
              </div>
              <FleetEntryDialog defaultVehicleId={vehicle.id} triggerLabel="Nova manutenção" />
            </div>
            
            <div className="space-y-4">
              {(vehicle.maintenanceRecords ?? []).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  <Wrench className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">Nenhuma manutenção registrada.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {(vehicle.maintenanceRecords ?? []).map(m => (
                      <Card key={m.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => {
                        setSelectedMaintenance(m);
                        setIsMaintenanceDetailsOpen(true);
                      }}>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{m.reason}</span>
                            <Badge variant={m.status === "em_andamento" ? "outline" : "secondary"} className="text-[10px] uppercase">
                              {m.status === "em_andamento" ? "Em andamento" : "Concluída"}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatFleetDateTime(m.entryDate)}
                          </p>
                        </div>
                        {m.cost && (
                          <div className="text-right">
                            <p className="text-sm font-bold">R$ {m.cost.toLocaleString("pt-BR")}</p>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="utilization" className="mt-6">
          <Card className="p-6">
             <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <KeyRound className="h-5 w-5" />
                <h3 className="text-base font-bold">Histórico de Utilizações</h3>
              </div>
            </div>

            <div className="space-y-4">
              {vehicleUsages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  <KeyRound className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">Nenhuma utilização registrada.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {vehicleUsages.map(u => (
                    <Card key={u.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => {
                      setSelectedUsage(u);
                      setIsUsageDetailsOpen(true);
                    }}>
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{u.operatorId}</span>
                            <Badge variant="outline" className="text-[10px] uppercase">
                              {u.status}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {u.destination}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {formatFleetDateTime(u.departureAt || u.scheduledStartAt)} - {u.returnedAt ? formatFleetDateTime(u.returnedAt) : "Em uso"}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="font-mono text-[10px]">
                            {u.returnMileage ? `${u.returnMileage.toLocaleString("pt-BR")} km` : (u.departureMileage ? `${u.departureMileage.toLocaleString("pt-BR")} km` : "—")}
                          </Badge>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="occurrences" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-bold">Ocorrências</h3>
              </div>
              <FleetEntryDialog defaultVehicleId={vehicle.id} triggerLabel="Nova ocorrência" />
            </div>
            
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg">
              <AlertTriangle className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">Nenhuma ocorrência registrada.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modais */}
      <VehicleHistoryModal 
        vehicle={vehicle} 
        open={isHistoryModalOpen} 
        onOpenChange={setIsHistoryModalOpen} 
      />

      {/* Modal Detalhes Manutenção */}
      <Dialog open={isMaintenanceDetailsOpen} onOpenChange={setIsMaintenanceDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedMaintenance && (
            <>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <Wrench className="h-5 w-5 text-primary" />
                Detalhes da Manutenção
              </DialogTitle>
              <div className="grid grid-cols-2 gap-6 py-4">
                <DetailItem label="Motivo" value={selectedMaintenance.reason} />
                <DetailItem label="Oficina" value={selectedMaintenance.workshop} />
                <DetailItem label="Data Entrada" value={formatFleetDateTime(selectedMaintenance.entryDate)} />
                <DetailItem label="Data Saída" value={selectedMaintenance.exitDate ? formatFleetDateTime(selectedMaintenance.exitDate) : "—"} />
                <DetailItem label="KM Entrada" value={`${selectedMaintenance.entryMileage?.toLocaleString("pt-BR")} km`} />
                <DetailItem label="Custo" value={selectedMaintenance.cost ? `R$ ${selectedMaintenance.cost.toLocaleString("pt-BR")}` : "—"} />
                <DetailItem label="Status" value={selectedMaintenance.status === "em_andamento" ? "Em andamento" : "Concluída"} />
                <DetailItem label="Observações" value={selectedMaintenance.notes || "—"} fullWidth />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes Utilização */}
      <Dialog open={isUsageDetailsOpen} onOpenChange={setIsUsageDetailsOpen}>
        <DialogContent className="max-w-2xl">
          {selectedUsage && (
            <>
              <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                <KeyRound className="h-5 w-5 text-primary" />
                Detalhes da Utilização
              </DialogTitle>
              <div className="grid grid-cols-2 gap-6 py-4">
                <DetailItem label="Operador" value={selectedUsage.operatorId} />
                <DetailItem label="Status" value={selectedUsage.status} />
                <DetailItem label="Destino" value={selectedUsage.destination} fullWidth />
                <DetailItem label="Saída Real" value={formatFleetDateTime(selectedUsage.departureAt || selectedUsage.scheduledStartAt)} />
                <DetailItem label="Retorno Real" value={selectedUsage.returnedAt ? formatFleetDateTime(selectedUsage.returnedAt) : "—"} />
                <DetailItem label="KM Saída" value={selectedUsage.departureMileage ? `${selectedUsage.departureMileage.toLocaleString("pt-BR")} km` : "—"} />
                <DetailItem label="KM Retorno" value={selectedUsage.returnMileage ? `${selectedUsage.returnMileage.toLocaleString("pt-BR")} km` : "—"} />
                <DetailItem label="Combustível Saída" value={selectedUsage.fuelAtDeparture || "—"} />
                <DetailItem label="Combustível Retorno" value={selectedUsage.fuelAtReturn || "—"} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function HeaderStat({ icon: Icon, label, value, className }: { icon: any; label: string; value: string; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 min-w-0", className)}>
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3 w-3 shrink-0" />
        <span className="text-[10px] font-bold uppercase tracking-wider truncate">{label}</span>
      </div>
      <p className="text-sm font-black truncate">{value}</p>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, disabled }: { icon: any; label: string; onClick?: () => void; disabled?: boolean }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={onClick}
      disabled={disabled}
      className="h-9 gap-2 text-[12px] font-semibold border-border/60 hover:border-primary hover:bg-primary/5 transition-all"
    >
      <Icon className="h-4 w-4" />
      {label}
    </Button>
  );
}

function DetailItem({ label, value, fullWidth }: { label: string; value: string; fullWidth?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-1", fullWidth && "col-span-2")}>
      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</span>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}
