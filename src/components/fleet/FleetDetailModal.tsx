import { useEffect, useMemo, useState } from "react";
import { 
  CarFront, 
  Wrench, 
  Calendar, 
  Gauge, 
  AlertCircle, 
  Store, 
  MessageSquare, 
  ClipboardList, 
  Package, 
  Clock, 
  CheckCircle2,
  DollarSign,
  FileText,
  History,
  Eye,
  Plus,
  Undo2,
  Pencil
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  type Vehicle, 
  getLicensingStatus, 
  updateVehicle, 
  addVehicleMaintenance, 
  closeVehicleMaintenance,
  formatFleetDateTime,
  type VehicleMaintenance
} from "@/lib/fleet-store";
import { fleetActions } from "@/lib/fleet-action-store";
import { cn } from "@/lib/utils";
import { MaintenanceDialog } from "./MaintenanceDialog";

type Props = {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "dados" | "licenciamento" | "manutencao";
};

export function FleetDetailModal({ vehicle, open, onOpenChange, defaultTab = "dados" }: Props) {
  const [activeTab, setActiveTab] = useState<"dados" | "licenciamento" | "manutencao">(defaultTab);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<Vehicle | null>(null);
  const [maintenanceDialogOpen, setMaintenanceDialogOpen] = useState(false);
  const [selectedMaint, setSelectedMaint] = useState<VehicleMaintenance | null>(null);

  useEffect(() => {
    if (vehicle) {
      setDraft(vehicle);
      setIsEditing(false);
    }
  }, [vehicle, open]);

  useEffect(() => {
    if (open) setActiveTab(defaultTab);
  }, [open, defaultTab]);

  const licensing = useMemo(() => draft ? getLicensingStatus(draft) : null, [draft]);

  if (!draft || !vehicle) return null;

  const saveChanges = () => {
    updateVehicle(vehicle.id, draft);
    setIsEditing(false);
    toast.success("Dados do veículo atualizados.");
  };

  const activeMaintenance = draft.maintenanceRecords?.find(m => m.status === "em_andamento");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90dvh] max-h-[90dvh] w-[95vw] max-w-4xl flex-col overflow-hidden p-0 gap-0">
        <DetailModalHeader
          icon={activeTab === "manutencao" ? Wrench : activeTab === "licenciamento" ? FileText : CarFront}
          title={activeTab === "manutencao" ? "Manutenção" : activeTab === "licenciamento" ? "Licenciamento" : "Dados do veículo"}
          protocol={draft.plate}
          onClose={() => onOpenChange(false)}
        />
        
        <Tabs value={activeTab} onValueChange={(t: any) => setActiveTab(t)} className="flex min-h-0 flex-1 flex-col">
          <div className="px-6 border-b">
            <TabsList className="w-fit bg-transparent gap-0">
              <TabsTrigger value="dados" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3 pt-4 shadow-none bg-transparent font-medium">Informações Gerais</TabsTrigger>
              <TabsTrigger value="licenciamento" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3 pt-4 shadow-none bg-transparent font-medium">Licenciamento</TabsTrigger>
              <TabsTrigger value="manutencao" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4 pb-3 pt-4 shadow-none bg-transparent font-medium">Manutenção</TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex-1 overflow-y-auto hide-scrollbar">
            <TabsContent value="dados" className="m-0 p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 space-y-6">
                  <div className="aspect-[4/3] w-full rounded-xl bg-muted/20 flex items-center justify-center overflow-hidden border shadow-inner">
                    <img src={draft.imageUrl} alt={draft.model} className="object-contain h-full w-full p-4" />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex flex-col items-center text-center">
                      <h3 className="font-bold text-lg">{draft.model}</h3>
                      <p className="text-sm text-muted-foreground">{draft.power} Flex Aut.</p>
                    </div>
                    
                    <div className="bg-muted/30 rounded-xl p-4 flex flex-col items-center">
                      <span className="text-xl font-mono font-bold tracking-wider">{draft.plate}</span>
                      <span className="text-[10px] text-muted-foreground uppercase mt-1">SP - São Carlos</span>
                    </div>
                    {draft.status === "em_uso" && (
                      <Button className="w-full h-11 cursor-pointer" variant="outline" onClick={() => {
                        onOpenChange(false);
                        fleetActions.openReturn(draft.id); 
                      }}>
                        <Undo2 className="mr-2 h-4 w-4" />
                        Registrar Retorno
                      </Button>
                    )}

                    {!isEditing ? (
                      <Button className="w-full h-11 cursor-pointer" variant="outline" onClick={() => setIsEditing(true)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar veículo
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 h-11 cursor-pointer" onClick={() => { setDraft(vehicle); setIsEditing(false); }}>Cancelar</Button>
                        <Button className="flex-1 h-11 cursor-pointer" onClick={saveChanges}>Salvar</Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <Field label="Placa" value={draft.plate} onChange={(v: string) => setDraft({...draft, plate: v})} readOnly={!isEditing} />
                  <Field label="Renavam" value={draft.renavam} onChange={(v: string) => setDraft({...draft, renavam: v})} readOnly={!isEditing} />
                  <Field label="Chassi" value={draft.chassis} onChange={(v: string) => setDraft({...draft, chassis: v})} readOnly={!isEditing} />
                  <Field label="Ano / Modelo" value={draft.yearModel} onChange={(v: string) => setDraft({...draft, yearModel: v})} readOnly={!isEditing} />
                  <Field label="Cor" value={draft.color} onChange={(v: string) => setDraft({...draft, color: v})} readOnly={!isEditing} />
                  <Field label="Combustível" value={draft.fuelType} onChange={(v: string) => setDraft({...draft, fuelType: v})} readOnly={!isEditing} />
                  <Field label="Categoria" value={draft.category} onChange={(v: string) => setDraft({...draft, category: v})} readOnly={!isEditing} />
                  <Field label="Tipo do Veículo" value="Utilitário" readOnly={true} />
                  <Field label="Potência" value={draft.power} onChange={(v: string) => setDraft({...draft, power: v})} readOnly={!isEditing} />
                  <Field label="Capacidade" value={draft.capacity} onChange={(v: string) => setDraft({...draft, capacity: v})} readOnly={!isEditing} />
                  <Field label="Quilometragem" value={String(draft.currentMileage)} onChange={(v: string) => setDraft({...draft, currentMileage: Number(v)})} readOnly={!isEditing} />
                  <Field label="Localização Atual" value={draft.location} onChange={(v: string) => setDraft({...draft, location: v})} readOnly={!isEditing} />
                </div>
              </div>
            </TabsContent>


            <TabsContent value="licenciamento" className="m-0 p-6 space-y-6">
               <Card className={cn(
                 "p-6 border-0 shadow-none",
                 licensing?.status === "regular" 
                   ? "bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-900 dark:text-emerald-400" 
                   : "bg-amber-500/10 dark:bg-amber-500/5 text-amber-900 dark:text-amber-400"
               )}>
                 <div className="flex items-center gap-5">
                   <div className={cn("p-3.5 rounded-full", licensing?.status === "regular" ? "bg-emerald-500/20" : "bg-amber-500/20")}>
                     {licensing?.status === "regular" ? <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-500"/> : <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-500"/>}
                   </div>
                   <div className="flex-1">
                     <h3 className="font-bold text-lg">{licensing?.status === "regular" ? "Licenciamento em dia" : "Vence em breve"}</h3>
                     <p className={cn(
                       "text-sm opacity-80",
                       licensing?.status === "regular" ? "text-emerald-700 dark:text-emerald-500/70" : "text-amber-700 dark:text-amber-500/70"
                     )}>
                       Próximo vencimento em <span className="font-semibold">{formatFleetDateTime(licensing?.dueDate)}</span>
                     </p>
                   </div>
                   <Calendar className={cn("h-10 w-10 opacity-20", licensing?.status === "regular" ? "text-emerald-500" : "text-amber-500")} />
                 </div>
               </Card>

               
               <div className="grid grid-cols-4 gap-4">
                 <Stat label="Exercício" value={String(draft.licensingYear || 2025)} />
                 <Stat label="Vencimento" value={formatFleetDateTime(licensing?.dueDate).split(',')[0]} />
                 <Stat label="Valor Pago" value="R$ 145,65" />
                 <div className="p-3 rounded-lg border bg-card flex flex-col justify-center items-center">
                    <span className="text-[10px] uppercase text-muted-foreground">Situação</span>
                    <Badge variant="outline" className="mt-1 border-emerald-200 bg-emerald-50 text-emerald-700 font-normal">Pago</Badge>
                 </div>
               </div>

               <div className="space-y-3">
                 <h4 className="text-sm font-semibold">Documentos e Taxas</h4>
                 <div className="rounded-xl border divide-y">
                   <DocRow icon={FileText} title="CRLV Digital" subtitle="Documento do veículo" action="Visualizar" />
                   <DocRow icon={DollarSign} title="IPVA 2025" subtitle="Imposto sobre a Propriedade" value="R$ 145,65" status="Pago" />
                   <DocRow icon={ShieldCheck} title="DPVAT 2025" subtitle="Seguro obrigatório" value="R$ 16,21" status="Pago" />
                   <DocRow icon={FileText} title="Taxas DETRAN" subtitle="Licenciamento e emissão" value="R$ 0,00" status="Pago" />
                 </div>
               </div>
            </TabsContent>

            <TabsContent value="manutencao" className="m-0 p-6 space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <StatCard icon={Calendar} label="Próxima Revisão" value={draft.nextRevisionDate} subValue="ou 20/06/2026" />
                <StatCard icon={Gauge} label="Quilometragem Atual" value={`${draft.currentMileage.toLocaleString("pt-BR")} km`} />
                <StatCard icon={History} label="Última Revisão" value="10.000 km" subValue="em 20/12/2024" />
                <StatCard icon={CheckCircle2} label="Status Geral" value="Ótimo" subValue="Veículo em boas condições" success />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold">Histórico de manutenções</h4>
                </div>
                
                <div className="rounded-xl border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted/50 border-b">
                      <tr>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Data</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Tipo de Serviço</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Quilometragem</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Oficina</th>
                        <th className="text-left px-4 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Valor</th>
                        <th className="text-right px-4 py-3 font-medium text-muted-foreground text-[11px] uppercase tracking-wider">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {(draft.maintenanceRecords || []).length === 0 ? (
                        <tr><td colSpan={6} className="text-center py-8 text-muted-foreground">Nenhuma manutenção registrada.</td></tr>
                      ) : (
                        [...(draft.maintenanceRecords || [])].sort((a, b) => {
                          if (a.status === "em_andamento" && b.status !== "em_andamento") return -1;
                          if (a.status !== "em_andamento" && b.status === "em_andamento") return 1;
                          return b.entryDate.localeCompare(a.entryDate);
                        }).map(m => (
                          <tr key={m.id} className={cn("hover:bg-muted/30 transition-colors", m.status === "em_andamento" && "bg-amber-50/30")}>
                            <td className="px-4 py-3 font-medium">{formatFleetDateTime(m.entryDate).split(',')[0]}</td>
                            <td className="px-4 py-3">{m.reason}</td>
                            <td className="px-4 py-3 tabular-nums">{m.entryMileage.toLocaleString("pt-BR")} km</td>
                            <td className="px-4 py-3">{m.workshop}</td>
                            <td className="px-4 py-3 tabular-nums font-medium">{m.cost ? m.cost.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}</td>
                            <td className="px-4 py-3 text-right">
                               <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer" onClick={() => {
                                 setSelectedMaint(m);
                                 setMaintenanceDialogOpen(true);
                               }}>
                                 <Eye className="h-4 w-4" />
                               </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </div>

          {activeTab !== "dados" && (
            <div className="border-t px-6 py-4 flex items-center justify-between bg-muted/5">
              <div className="flex gap-2">
                {activeTab === "licenciamento" && <Button variant="outline" className="h-9 cursor-pointer text-xs"><History className="mr-2 h-4 w-4" /> Histórico de Licenciamentos</Button>}
                {activeTab === "manutencao" && (
                  <>
                    <Button variant="outline" className="h-9 cursor-pointer text-xs" onClick={() => setMaintenanceDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Nova Manutenção
                    </Button>
                    <Button variant="outline" className="h-9 cursor-pointer text-xs"><ClipboardList className="mr-2 h-4 w-4" /> Ver Plano de Manutenção</Button>
                  </>
                )}
              </div>
            </div>
          )}
        </Tabs>
      </DialogContent>

      
      <MaintenanceDialog 
        vehicle={vehicle} 
        open={maintenanceDialogOpen} 
        onOpenChange={setMaintenanceDialogOpen}
      />
    </Dialog>
  );
}

function Field({ label, value, onChange, readOnly }: any) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">{label}</Label>
      <Input 
        value={value || ""} 
        onChange={e => onChange?.(e.target.value)} 
        readOnly={readOnly} 
        className={cn(
          "h-10 text-[13px]",
          readOnly ? "bg-muted/30 border-transparent focus-visible:ring-0" : "bg-background"
        )} 
      />
    </div>
  );
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-3 rounded-xl border bg-card flex flex-col justify-center items-center text-center">
      <span className="text-[10px] uppercase text-muted-foreground">{label}</span>
      <span className="font-bold text-sm mt-1">{value}</span>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, subValue, success }: any) {
  return (
    <Card className="p-4 flex flex-col gap-3">
       <div className="flex items-start justify-between">
          <div className="space-y-1">
             <p className="text-[10px] uppercase text-muted-foreground tracking-wider">{label}</p>
             <p className="font-bold text-base leading-none">{value}</p>
          </div>
          <Icon className={cn("h-5 w-5", success ? "text-emerald-500" : "text-muted-foreground/50")} />
       </div>
       <p className={cn("text-[11px]", success ? "text-emerald-600" : "text-muted-foreground")}>{subValue}</p>
    </Card>
  )
}

function DocRow({ icon: Icon, title, subtitle, value, status, action }: any) {
  return (
    <div className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
      <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {value && <span className="text-sm font-medium tabular-nums">{value}</span>}
      {status && <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 font-normal ml-4">{status}</Badge>}
      {action && <Button variant="outline" size="sm" className="h-8 text-xs cursor-pointer">{action}</Button>}
    </div>
  )
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
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
