import { useMemo, useState } from "react";
import { 
  CarFront, 
  X, 
  Gauge, 
  MapPin, 
  Pencil, 
  History, 
  FileText, 
  Settings2, 
  LayoutDashboard,
  Fuel,
  Users,
  Hash,
  Fingerprint,
  Calendar,
  Store,
  Wrench,
  Clock,
  ArrowRight
} from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  useUsages,
  type Vehicle, 
  type VehicleMaintenance,
  VEHICLE_STATUS_LABEL, 
  getLicensingStatus,
  formatFleetDateTime
} from "@/lib/fleet-store";

type VehicleDetailModalProps = {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (vehicle: Vehicle) => void;
};

type TabId = "resumo" | "caracteristicas" | "documentos" | "historico";

export function VehicleDetailModal({ vehicle, open, onOpenChange, onEdit }: VehicleDetailModalProps) {
  const [activeTab, setActiveTab] = useState<TabId>("resumo");
  const allUsages = useUsages();

  const vehicleUsages = useMemo(() => {
    if (!vehicle) return [];
    return allUsages
      .filter((u) => u.vehicleId === vehicle.id)
      .sort((a, b) =>
        (b.departureAt ?? b.scheduledStartAt ?? b.returnedAt ?? "").localeCompare(
          a.departureAt ?? a.scheduledStartAt ?? a.returnedAt ?? "",
        ),
      );
  }, [allUsages, vehicle]);

  if (!vehicle) return null;

  const licensing = getLicensingStatus(vehicle);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[calc(100vw-2rem)] max-w-4xl flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card p-0 sm:w-[90vw] md:w-[850px] [&>button]:hidden">
        <DialogTitle className="sr-only">Dados do Veículo - {vehicle.model}</DialogTitle>
        
        {/* CABEÇALHO COMPACTO */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted/50 border">
              <CarFront className="h-5 w-5 text-muted-foreground" />
            </div>
            <h2 className="text-base font-semibold text-foreground">Dados do veículo</h2>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-muted" 
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        <div className="flex flex-1 flex-col overflow-hidden md:flex-row">
          {/* COLUNA LATERAL ESQUERDA (32%) */}
          <aside className="w-full shrink-0 border-b bg-muted/5 px-6 py-8 md:w-[32%] md:border-b-0 md:border-r">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-muted/30 p-4 ring-1 ring-border">
                <img 
                  src={vehicle.imageUrl} 
                  alt={vehicle.model} 
                  className="h-full w-full object-contain drop-shadow-sm" 
                />
              </div>
              
              <h3 className="text-lg font-bold leading-tight text-foreground">{vehicle.model}</h3>
              <p className="mt-1 text-sm text-muted-foreground">Versão não informada</p>
              
              <Badge 
                variant="outline" 
                className={cn(
                  "mt-4 h-7 px-3 text-[11px] font-medium uppercase tracking-wider",
                  vehicle.status === "disponivel" && "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
                  vehicle.status === "em_uso" && "bg-amber-500/10 text-amber-600 border-amber-500/20",
                  vehicle.status === "manutencao" && "bg-red-500/10 text-red-600 border-red-500/20"
                )}
              >
                {VEHICLE_STATUS_LABEL[vehicle.status]}
              </Badge>

              <div className="mt-8 w-full rounded-xl bg-muted/40 p-4 text-center ring-1 ring-border/50">
                <p className="font-mono text-xl font-bold tracking-wider text-foreground">{vehicle.plate}</p>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">{vehicle.state || "SP"} - São Paulo</p>
              </div>
            </div>
          </aside>

          {/* CONTEÚDO PRINCIPAL (68%) */}
          <main className="flex flex-1 flex-col overflow-hidden bg-card">
            <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
              {activeTab === "resumo" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <section>
                    <h4 className="mb-4 text-sm font-semibold text-foreground">Informações Gerais</h4>
                    <div className="rounded-xl border bg-muted/5 p-4 space-y-3">
                      <InfoRow icon={Hash} label="Placa" value={vehicle.plate} />
                      <InfoRow icon={Fingerprint} label="Renavam" value={vehicle.renavam || "Não informado"} />
                      <InfoRow icon={Settings2} label="Chassi" value="Não informado" />
                      <InfoRow icon={Calendar} label="Ano / Modelo" value={vehicle.yearModel} />
                    </div>
                  </section>

                  <section className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-6">
                      <CharacteristicItem label="Cor" value={vehicle.color} />
                      <CharacteristicItem label="Tipo de Veículo" value={vehicle.category} />
                      <CharacteristicItem label="Potência" value="Não informado" />
                    </div>
                    <div className="space-y-6">
                      <CharacteristicItem icon={Fuel} label="Combustível" value="Flex" />
                      <CharacteristicItem label="Categoria" value="Particular" />
                      <CharacteristicItem label="Capacidade" value="5 lugares" />
                    </div>
                  </section>

                  <section className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 rounded-xl border p-4 bg-muted/5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600">
                        <Gauge className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Quilometragem</p>
                        <p className="text-sm font-bold text-foreground">{vehicle.currentMileage.toLocaleString("pt-BR")} km</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 rounded-xl border p-4 bg-muted/5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">Localização Atual</p>
                        <p className="text-sm font-bold text-foreground">São Carlos - SP</p>
                      </div>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "caracteristicas" && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  <section>
                    <h4 className="mb-4 text-sm font-semibold text-foreground">Especificações Técnicas</h4>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6 rounded-xl border p-6 bg-muted/5">
                       <CharacteristicItem label="Motorização" value="Não informado" />
                       <CharacteristicItem label="Combustível" value="Flex" />
                       <CharacteristicItem label="Transmissão" value="Não informado" />
                       <CharacteristicItem label="Tração" value="Não informado" />
                       <CharacteristicItem label="Potência" value="Não informado" />
                       <CharacteristicItem label="Peso" value="Não informado" />
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "documentos" && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  <section>
                    <h4 className="mb-4 text-sm font-semibold text-foreground">Documentação e Licenciamento</h4>
                    <div className="rounded-xl border bg-muted/5 p-4 space-y-3">
                      <InfoRow icon={FileText} label="Licenciamento" value={licensing.label} />
                      <InfoRow icon={Calendar} label="Vencimento" value={licensing.dueDate ? new Date(licensing.dueDate).toLocaleDateString('pt-BR') : 'Não informado'} />
                      <InfoRow icon={History} label="Exercício" value={String(vehicle.licensingYear || "Não informado")} />
                      <InfoRow icon={ShieldCheck} label="Situação" value={licensing.status === 'regular' ? 'Regularizado' : 'Pendente'} />
                      <InfoRow icon={Hash} label="Renavam" value={vehicle.renavam || "Não informado"} />
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "historico" && (
                <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-sm font-semibold text-foreground">Histórico Recente</h4>
                      <Badge variant="outline" className="text-[10px] uppercase">{vehicleUsages.length} registros</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {vehicleUsages.length === 0 ? (
                        <p className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl">Nenhum registro encontrado.</p>
                      ) : (
                        vehicleUsages.map((usage) => (
                          <Card key={usage.id} className="p-3 bg-muted/10 border-muted-foreground/10">
                            <div className="flex items-start justify-between gap-2">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold">{usage.operatorId}</span>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">{usage.destination}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatFleetDateTime(usage.departureAt || usage.scheduledStartAt)}</span>
                                </div>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "text-[9px] h-5 px-1.5 uppercase",
                                  usage.status === "devolvido" && "border-emerald-500/20 text-emerald-600 bg-emerald-500/5",
                                  usage.status === "em_deslocamento" && "border-amber-500/20 text-amber-600 bg-amber-500/5"
                                )}
                              >
                                {usage.status === "devolvido" ? "Concluído" : "Em uso"}
                              </Badge>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>

                    {(vehicle.maintenanceRecords?.length ?? 0) > 0 && (
                      <div className="mt-8 space-y-3">
                        <h4 className="text-sm font-semibold text-foreground mb-4">Manutenções</h4>
                        {vehicle.maintenanceRecords?.map((m) => (
                          <MaintenanceCard key={m.id} maintenance={m} />
                        ))}
                      </div>
                    )}
                  </section>
                </div>
              )}
            </div>

            {/* AÇÃO DISCRETA DE EDIÇÃO */}
            <div className="absolute right-6 top-[72px] md:top-[68px]">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full border bg-background shadow-sm hover:bg-muted"
                onClick={() => onEdit?.(vehicle)}
              >
                <Pencil className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* NAVEGAÇÃO INFERIOR */}
            <footer className="mt-auto border-t bg-muted/10">
              <nav className="flex items-center justify-around h-20">
                <TabButton 
                  active={activeTab === "resumo"} 
                  onClick={() => setActiveTab("resumo")}
                  icon={LayoutDashboard}
                  label="Resumo"
                />
                <TabButton 
                  active={activeTab === "caracteristicas"} 
                  onClick={() => setActiveTab("caracteristicas")}
                  icon={Settings2}
                  label="Características"
                />
                <TabButton 
                  active={activeTab === "documentos"} 
                  onClick={() => setActiveTab("documentos")}
                  icon={FileText}
                  label="Documentos"
                />
                <TabButton 
                  active={activeTab === "historico"} 
                  onClick={() => setActiveTab("historico")}
                  icon={History}
                  label="Histórico"
                />
              </nav>
            </footer>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MaintenanceCard({ maintenance }: { maintenance: VehicleMaintenance }) {
  const inProgress = maintenance.status === "em_andamento";
  return (
    <Card className={cn("p-3 bg-muted/10 border-l-4", inProgress ? "border-l-amber-500" : "border-l-emerald-500")}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wrench className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-bold">{maintenance.reason}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Store className="h-3 w-3" />
            <span>{maintenance.workshop}</span>
            <span className="mx-1">•</span>
            <span>{formatFleetDateTime(maintenance.entryDate)}</span>
          </div>
        </div>
        {maintenance.cost !== undefined && (
          <span className="text-xs font-bold tabular-nums">
            {maintenance.cost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        )}
      </div>
    </Card>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function MaintenanceCard({ maintenance }: { maintenance: VehicleMaintenance }) {
  const inProgress = maintenance.status === "em_andamento";
  return (
    <Card className={cn("p-3 bg-muted/10 border-l-4", inProgress ? "border-l-amber-500" : "border-l-emerald-500")}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Wrench className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs font-bold">{maintenance.reason}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
            <Store className="h-3 w-3" />
            <span>{maintenance.workshop}</span>
            <span className="mx-1">•</span>
            <span>{formatFleetDateTime(maintenance.entryDate)}</span>
          </div>
        </div>
        {maintenance.cost !== undefined && (
          <span className="text-xs font-bold tabular-nums">
            {maintenance.cost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        )}
      </div>
    </Card>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon?: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground/70" />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function CharacteristicItem({ icon: Icon, label, value }: { icon?: any, label: string, value: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-muted-foreground/60" />}
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <p className="text-sm font-bold text-foreground">{value || "Não informado"}</p>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center flex-1 h-full gap-1.5 transition-all relative",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className={cn("h-5 w-5", active && "scale-110")} />
      <span className="text-[11px] font-semibold">{label}</span>
      {active && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-primary rounded-full" />
      )}
    </button>
  );
}
