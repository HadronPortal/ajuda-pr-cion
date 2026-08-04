import { useEffect, useMemo, useState } from "react";
import { CarFront, FileText, Wrench, X, Save, Calendar, Gauge, AlertCircle, Store, MessageSquare, ClipboardList, Package, Clock, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  formatFleetDateTime
} from "@/lib/fleet-store";
import { cn } from "@/lib/utils";

type Props = {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "dados" | "licenciamento" | "manutencao";
};

export function FleetDetailModal({ vehicle, open, onOpenChange, defaultTab = "dados" }: Props) {
  if (!vehicle) return null;
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(vehicle);
  const licensing = useMemo(() => getLicensingStatus(draft), [draft]);

  useEffect(() => {
    setDraft(vehicle);
    setIsEditing(false);
  }, [vehicle, open]);

  const saveChanges = () => {
    updateVehicle(vehicle.id, draft);
    setIsEditing(false);
    toast.success("Dados do veículo atualizados.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] w-[95vw] max-w-4xl flex-col overflow-hidden p-0">
        <DetailModalHeader
          icon={CarFront}
          title="Dados do veículo"
          protocol={draft.plate}
          onClose={() => onOpenChange(false)}
          chips={<Badge variant={draft.status === "manutencao" ? "destructive" : "secondary"}>{draft.status.toUpperCase()}</Badge>}
          meta={<>{draft.model} · {draft.yearModel}</>}
        />
        
        <Tabs value={activeTab} onValueChange={(t: any) => setActiveTab(t)} className="flex min-h-0 flex-1 flex-col">
          <TabsList className="mx-6 w-fit">
            <TabsTrigger value="dados">Informações Gerais</TabsTrigger>
            <TabsTrigger value="licenciamento">Licenciamento</TabsTrigger>
            <TabsTrigger value="manutencao">Manutenção</TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto px-6 py-4 hide-scrollbar">
            <TabsContent value="dados" className="m-0 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                  <div className="aspect-video w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden border">
                    <img src={draft.imageUrl} alt={draft.model} className="object-cover h-full w-full" />
                  </div>
                  {!isEditing ? (
                    <Button className="w-full" onClick={() => setIsEditing(true)}>Editar veículo</Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => { setDraft(vehicle); setIsEditing(false); }}>Cancelar</Button>
                      <Button className="flex-1" onClick={saveChanges}>Salvar</Button>
                    </div>
                  )}
                </div>
                
                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                  <Field label="Placa" value={draft.plate} onChange={v => setDraft({...draft, plate: v})} readOnly={!isEditing} />
                  <Field label="Renavam" value={draft.renavam} onChange={v => setDraft({...draft, renavam: v})} readOnly={!isEditing} />
                  <Field label="Chassi" value={draft.chassis} onChange={v => setDraft({...draft, chassis: v})} readOnly={!isEditing} />
                  <Field label="Ano / Modelo" value={draft.yearModel} onChange={v => setDraft({...draft, yearModel: v})} readOnly={!isEditing} />
                  <Field label="Cor" value={draft.color} onChange={v => setDraft({...draft, color: v})} readOnly={!isEditing} />
                  <Field label="Combustível" value={draft.fuelType} onChange={v => setDraft({...draft, fuelType: v})} readOnly={!isEditing} />
                  <Field label="Categoria" value={draft.category} onChange={v => setDraft({...draft, category: v})} readOnly={!isEditing} />
                  <Field label="Tipo" value="Utilitário" />
                  <Field label="Potência" value={draft.power} onChange={v => setDraft({...draft, power: v})} readOnly={!isEditing} />
                  <Field label="Capacidade" value={draft.capacity} onChange={v => setDraft({...draft, capacity: v})} readOnly={!isEditing} />
                  <Field label="Quilometragem" value={String(draft.currentMileage)} onChange={v => setDraft({...draft, currentMileage: Number(v)})} readOnly={!isEditing} />
                  <Field label="Localização" value={draft.location} onChange={v => setDraft({...draft, location: v})} readOnly={!isEditing} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="licenciamento" className="m-0">
               <Card className="p-6 mb-6">
                 <div className="flex items-center gap-4">
                   <div className={cn("p-3 rounded-full", licensing.status === "regular" ? "bg-emerald-500/10" : "bg-amber-500/10")}>
                     {licensing.status === "regular" ? <CheckCircle2 className="text-emerald-500"/> : <AlertCircle className="text-amber-500"/>}
                   </div>
                   <div>
                     <h3 className="font-semibold text-lg">{licensing.status === "regular" ? "Licenciamento em dia" : "Vence em breve"}</h3>
                     <p className="text-sm text-muted-foreground">Próximo vencimento em {formatFleetDateTime(licensing.dueDate)}</p>
                   </div>
                 </div>
               </Card>
               {/* Grid de documentos similar à imagem */}
            </TabsContent>

            <TabsContent value="manutencao" className="m-0">
              <div className="grid grid-cols-4 gap-4 mb-6">
                <Stat label="Próxima Revisão" value={draft.nextRevisionDate} />
                <Stat label="Quilometragem Atual" value={`${draft.currentMileage.toLocaleString("pt-BR")} km`} />
                <Stat label="Última Revisão" value="20/12/2024" />
                <Stat label="Status Geral" value="Ótimo" />
              </div>
              {/* Tabela de histórico */}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value, onChange, readOnly }: any) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground uppercase">{label}</Label>
      <Input value={value || ""} onChange={e => onChange?.(e.target.value)} readOnly={readOnly} className={readOnly ? "bg-muted/50 border-transparent" : ""} />
    </div>
  );
}

function Stat({ label, value }: { label: string, value: string }) {
  return (
    <Card className="p-3">
      <p className="text-[10px] uppercase text-muted-foreground">{label}</p>
      <p className="font-semibold text-sm mt-1">{value}</p>
    </Card>
  )
}
