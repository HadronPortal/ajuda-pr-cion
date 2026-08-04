import { useState, useMemo } from "react";
import { useNavigate } from "@tanstack/react-router";
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
  AlertTriangle,
  FileCheck,
  Plus
} from "lucide-react";
import { 
  type Vehicle, 
  useUsages,
  formatFleetDateTime,
  getLicensingStatus,
  VEHICLE_STATUS_LABEL,
  type VehicleUsage,
  getVehicleById
} from "@/lib/fleet-store";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { VehicleHistoryModal } from "../VehicleHistoryModal";
import { MaintenanceDialog } from "../MaintenanceDialog";
import { VehicleEditorModal } from "../VehicleEditorModal";
import { fleetActions } from "@/lib/fleet-action-store";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface VehicleOverviewProps {
  vehicle: Vehicle;
}

export function VehicleOverview({ vehicle }: VehicleOverviewProps) {
  const navigate = useNavigate();
  const usages = useUsages();
  const [activeTab, setActiveTab] = useState("overview");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<any>(null);
  const [isMaintenanceDetailsOpen, setIsMaintenanceDetailsOpen] = useState(false);
  const [selectedUsage, setSelectedUsage] = useState<any>(null);
  const [isUsageDetailsOpen, setIsUsageDetailsOpen] = useState(false);
  const [isOccurenceDetailsOpen, setIsOccurenceDetailsOpen] = useState(false);

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
                <h1 className="text-xl font-bold tracking-tight">{vehicle.model.split(" / ")[0]}</h1>
                <Badge variant="secondary" className="font-mono text-[11px]">{vehicle.yearModel.split(" / ")[0]}</Badge>
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

        <Card className="grid grid-cols-2 gap-y-4 gap-x-6 p-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 bg-muted/20 border-border/50">
            <HeaderStat 
              icon={Calendar} 
              label="Modelo" 
              value={vehicle.model.split(" / ")[0]} 
              className="sm:col-span-2 lg:col-span-2"
            />
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
        <ActionButton icon={Pencil} label="Editar veículo" onClick={() => setIsEditorModalOpen(true)} />
        <ActionButton icon={Wrench} label="Nova manutenção" onClick={() => setIsMaintenanceDialogOpen(true)} />
        <ActionButton icon={KeyRound} label="Registrar saída" disabled={vehicle.status !== "disponivel"} onClick={() => {
          // No current usage id context, this usually happens from a ticket or calendar.
          // For now, let's open a generic pickup flow or a placeholder.
          toast.info("Selecione um agendamento no Calendário ou Chamado para registrar a saída.");
        }} />
        <ActionButton icon={Undo2} label="Registrar devolução" disabled={vehicle.status !== "em_uso"} onClick={() => {
          const current = vehicleUsages.find(u => u.status === "em_deslocamento");
          if (current) fleetActions.openReturn(current.id);
        }} />
        <ActionButton icon={FileText} label="Documentos" onClick={() => setActiveTab("documents")} />
        <ActionButton icon={History} label="Histórico" onClick={() => setIsHistoryModalOpen(true)} />
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
                  <h3 className="text-base font-bold">Histórico Recente</h3>
                </div>
                {vehicleUsages.length > 4 && (
                  <Button variant="outline" size="sm" className="h-8 text-xs gap-1" onClick={() => setIsHistoryModalOpen(true)}>
                    Ver tudo
                    <ChevronRight className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="overflow-hidden flex-1">
                <div className="space-y-1">
                  {vehicleUsages.slice(0, 4).map(u => (
                    <div key={u.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors border border-transparent hover:border-border/50">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-medium">{u.operatorId}</span>
                        <span className="text-[11px] text-muted-foreground">{formatFleetDateTime(u.departureAt || u.scheduledStartAt)}</span>
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

        <TabsContent value="maintenance" className="mt-6 flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <Wrench className="h-5 w-5" />
                <h3 className="text-base font-bold">Histórico de Manutenções</h3>
              </div>
              <Button size="sm" className="gap-2" onClick={() => setIsMaintenanceDialogOpen(true)}>
                <Plus className="h-4 w-4" />
                Nova manutenção
              </Button>
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

        <TabsContent value="documents" className="mt-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                <h3 className="text-base font-bold">Documentação</h3>
              </div>
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Adicionar documento
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DocumentCard 
                title="Licenciamento" 
                status={licensing.status === "regular" ? "regular" : "vencido"}
                dueDate={vehicle.licensingDueDate || "—"}
                value="—"
              />
              <DocumentCard 
                title="CRLV Digital" 
                status="regular"
                dueDate="—"
                value="—"
              />
              <DocumentCard 
                title="IPVA" 
                status="regular"
                dueDate="—"
                value="—"
              />
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
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" disabled={vehicle.status !== "em_uso"} onClick={() => {
                  const current = vehicleUsages.find(u => u.status === "em_deslocamento");
                  if (current) fleetActions.openReturn(current.id);
                }}>
                  <Undo2 className="h-4 w-4" />
                  Registrar devolução
                </Button>
                <Button size="sm" className="gap-2" disabled={vehicle.status !== "disponivel"} onClick={() => fleetActions.openPickup("manual")}>
                  <KeyRound className="h-4 w-4" />
                  Registrar saída
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {vehicleUsages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground border border-dashed rounded-lg">
                  <History className="h-8 w-8 mb-2 opacity-20" />
                  <p className="text-sm">Nenhuma utilização registrada.</p>
                </div>
              ) : (
                vehicleUsages.map(u => (
                  <Card key={u.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => {
                    setSelectedUsage(u);
                    setIsUsageDetailsOpen(true);
                  }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground">Operador</span>
                        <span className="text-sm font-medium">{u.operatorId}</span>
                      </div>
                      <div className="flex flex-col col-span-2">
                        <span className="text-[10px] uppercase text-muted-foreground">Cliente / Destino</span>
                        <span className="text-sm truncate">{u.client || u.destination}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground">Saída</span>
                        <span className="text-sm">{formatFleetDateTime(u.departureAt || u.scheduledStartAt)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase text-muted-foreground">Devolução</span>
                        <span className="text-sm">{u.returnedAt ? formatFleetDateTime(u.returnedAt) : "—"}</span>
                      </div>
                      <div className="flex justify-end">
                         <Badge variant={u.status === "em_deslocamento" ? "outline" : "secondary"} className="text-[10px] uppercase">
                            {u.status === "em_deslocamento" ? "Em uso" : u.status}
                          </Badge>
                      </div>
                    </div>
                  </Card>
                ))
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
              <Button size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Nova ocorrência
              </Button>
            </div>

            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-lg bg-muted/10">
              <AlertTriangle className="h-10 w-10 mb-3 opacity-20" />
              <p className="text-sm">Nenhuma ocorrência registrada.</p>
              <p className="text-xs mt-1">Avarias, multas ou acidentes aparecerão aqui.</p>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <VehicleHistoryModal 
        vehicle={vehicle} 
        open={isHistoryModalOpen} 
        onOpenChange={setIsHistoryModalOpen} 
      />
      
      <MaintenanceDialog 
        vehicle={vehicle} 
        open={isMaintenanceDialogOpen} 
        onOpenChange={setIsMaintenanceDialogOpen} 
      />

      <VehicleEditorModal
        vehicle={vehicle}
        open={isEditorModalOpen}
        onOpenChange={setIsEditorModalOpen}
      />

      {/* Modal Visualizar Manutenção */}
      <Dialog open={isMaintenanceDetailsOpen} onOpenChange={setIsMaintenanceDetailsOpen}>
        <DialogContent className="max-w-2xl p-0 [&>button]:hidden">
          {selectedMaintenance && (
            <>
              <DetailModalHeader
                icon={Wrench}
                title="Detalhes da Manutenção"
                protocol={selectedMaintenance.id.slice(0, 8).toUpperCase()}
                onClose={() => setIsMaintenanceDetailsOpen(false)}
              />
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Motivo</p>
                    <p className="text-sm font-semibold">{selectedMaintenance.reason}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Oficina</p>
                    <p className="text-sm">{selectedMaintenance.workshop}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Entrada</p>
                    <p className="text-sm">{formatFleetDateTime(selectedMaintenance.entryDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Saída</p>
                    <p className="text-sm">{selectedMaintenance.exitDate ? formatFleetDateTime(selectedMaintenance.exitDate) : "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Custo</p>
                    <p className="text-sm font-bold text-primary">{selectedMaintenance.cost ? `R$ ${selectedMaintenance.cost.toLocaleString("pt-BR")}` : "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">KM</p>
                    <p className="text-sm">{selectedMaintenance.entryMileage.toLocaleString("pt-BR")} km</p>
                  </div>
                </div>
                {selectedMaintenance.notes && (
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Observações</p>
                    <div className="p-3 bg-muted/50 rounded-lg text-sm italic">
                      {selectedMaintenance.notes}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar Utilização */}
      <Dialog open={isUsageDetailsOpen} onOpenChange={setIsUsageDetailsOpen}>
        <DialogContent className="max-w-2xl p-0 [&>button]:hidden">
          {selectedUsage && (
            <>
              <DetailModalHeader
                icon={KeyRound}
                title="Detalhes da Utilização"
                protocol={selectedUsage.id.slice(0, 8).toUpperCase()}
                onClose={() => setIsUsageDetailsOpen(false)}
              />
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Operador</p>
                    <p className="text-sm font-semibold">{selectedUsage.operatorId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Cliente / Destino</p>
                    <p className="text-sm">{selectedUsage.client || selectedUsage.destination}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Saída</p>
                    <p className="text-sm">{formatFleetDateTime(selectedUsage.departureAt || selectedUsage.scheduledStartAt)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">Retorno</p>
                    <p className="text-sm">{selectedUsage.returnedAt ? formatFleetDateTime(selectedUsage.returnedAt) : "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">KM Inicial</p>
                    <p className="text-sm">{selectedUsage.departureMileage?.toLocaleString("pt-BR")} km</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] uppercase text-muted-foreground">KM Final</p>
                    <p className="text-sm">{selectedUsage.returnMileage?.toLocaleString("pt-BR") || "—"} km</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocumentCard({ title, status, dueDate, value }: { title: string, status: "regular" | "vencido" | "pendente", dueDate: string, value: string }) {
  return (
    <Card className="p-4 border-l-4 border-l-primary flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm">{title}</h4>
        <Badge variant={status === "regular" ? "secondary" : "destructive"} className="text-[10px] uppercase">
          {status}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground">Vencimento</span>
          <span className="text-xs font-medium">{dueDate}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] uppercase text-muted-foreground">Valor</span>
          <span className="text-xs font-medium">{value}</span>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-7 text-[11px] gap-1.5 mt-2">
        <FileCheck className="h-3 w-3" />
        Visualizar
      </Button>
    </Card>
  );
}

function HeaderStat({ icon: Icon, label, value, className }: { icon: any, label: string, value: string, className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1 min-w-0", className)}>
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted-foreground whitespace-nowrap overflow-hidden">
        <Icon className="h-3 w-3 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <div className="text-[13px] font-medium leading-tight break-words line-clamp-2">{value}</div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, disabled, onClick }: { icon: any, label: string, disabled?: boolean, onClick?: () => void }) {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      disabled={disabled}
      onClick={onClick}
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
