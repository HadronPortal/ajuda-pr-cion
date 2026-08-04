import { useEffect, useMemo, useState } from "react";
import { CarFront, Plus, Save, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addVehicleMaintenance,
  calculateLicensingDueDate,
  getLicensingStatus,
  normalizeVehiclePlate,
  updateVehicle,
  type Vehicle,
} from "@/lib/fleet-store";
import { cn } from "@/lib/utils";

type Props = {
  vehicle: Vehicle | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const formatDate = (value?: string) => value
  ? new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString("pt-BR")
  : "Não informado";

export function VehicleEditorModal({ vehicle, open, onOpenChange }: Props) {
  const [draft, setDraft] = useState<Vehicle | null>(vehicle);
  const [maintenance, setMaintenance] = useState({
    entryDate: new Date().toISOString().slice(0, 16),
    description: "",
    mileage: vehicle ? String(vehicle.currentMileage) : "",
    workshop: "",
    notes: "",
  });

  useEffect(() => setDraft(vehicle), [vehicle, open]);
  const licensing = useMemo(() => draft ? getLicensingStatus(draft) : null, [draft]);
  if (!draft || !vehicle) return null;

  const change = (field: keyof Vehicle, value: string | number | undefined) =>
    setDraft((current) => current ? { ...current, [field]: value } : current);

  const save = () => {
    const plate = normalizeVehiclePlate(draft.plate);
    if (plate.replace(/[^A-Z0-9]/g, "").length !== 7) {
      toast.error("Informe uma placa válida.");
      return;
    }
    updateVehicle(vehicle.id, {
      ...draft,
      plate,
      state: (draft.state || "SP").toUpperCase(),
      licensingDueDate: draft.licensingDueDate || calculateLicensingDueDate(plate, draft.state),
    });
    toast.success("Dados do veículo atualizados.");
    onOpenChange(false);
  };

  const registerMaintenance = () => {
    if (!maintenance.description.trim()) {
      toast.error("Informe o serviço realizado.");
      return;
    }
    const record = addVehicleMaintenance(vehicle.id, {
      entryDate: maintenance.entryDate,
      entryMileage: Number(maintenance.mileage) || vehicle.currentMileage,
      reason: maintenance.description.trim(),
      workshop: maintenance.workshop.trim() || "Não informada",
      notes: maintenance.notes.trim() || undefined,
    });
    setDraft((current) => current ? {
      ...current,
      status: "manutencao" as const,
      currentMileage: Math.max(current.currentMileage, Number(maintenance.mileage) || 0),
      maintenanceRecords: [record, ...(current.maintenanceRecords ?? [])],
    } : current);
    setMaintenance((current) => ({ ...current, description: "", mileage: vehicle ? String(vehicle.currentMileage) : "", workshop: "", notes: "" }));
    toast.success("Manutenção registrada.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90dvh] max-w-2xl flex-col overflow-hidden p-0 shadow-lg border-border">
        <DialogHeader className="px-5 py-3 border-b border-border">
          <DialogTitle className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Editar veículo</span>
            <span className="text-base font-semibold">{draft.model}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="dados" className="flex flex-1 flex-col overflow-hidden">
          <TabsList className="flex w-full justify-between gap-0 h-10 px-5 bg-transparent border-b border-border/50 rounded-none shrink-0">
            <TabsTrigger 
              value="dados" 
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground transition-none"
            >
              Dados
            </TabsTrigger>
            <TabsTrigger 
              value="licenciamento" 
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground transition-none"
            >
              Licenciamento
            </TabsTrigger>
            <TabsTrigger 
              value="manutencao" 
              className="flex-1 bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground rounded-none text-muted-foreground transition-none"
            >
              Manutenção
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-5 py-4 hide-scrollbar">
            <TabsContent value="dados" className="mt-0 space-y-6">
              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Identificação</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <Field label="Modelo">
                    <Input 
                      value={draft.model} 
                      onChange={(e) => change("model", e.target.value)}
                      className="h-9 focus-visible:ring-primary/30"
                    />
                  </Field>
                  <Field label="Placa">
                    <Input 
                      value={draft.plate} 
                      maxLength={8} 
                      onChange={(e) => change("plate", normalizeVehiclePlate(e.target.value))} 
                      className="uppercase h-9 focus-visible:ring-primary/30" 
                    />
                  </Field>
                  <Field label="Categoria">
                    <Input 
                      value={draft.category} 
                      onChange={(e) => change("category", e.target.value)}
                      className="h-9 focus-visible:ring-primary/30"
                    />
                  </Field>
                  <Field label="Cor">
                    <Input 
                      value={draft.color} 
                      onChange={(e) => change("color", e.target.value)}
                      className="h-9 focus-visible:ring-primary/30"
                    />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Ano / modelo">
                      <Input 
                        value={draft.yearModel} 
                        onChange={(e) => change("yearModel", e.target.value)}
                        className="h-9 focus-visible:ring-primary/30"
                      />
                    </Field>
                  </div>
                </div>
              </section>

              <hr className="border-border/40" />

              <section>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Controle</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                  <Field label="Quilometragem atual">
                    <Input 
                      type="text" 
                      value={draft.currentMileage.toLocaleString("pt-BR")} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        change("currentMileage", Number(val));
                      }}
                      className="h-9 focus-visible:ring-primary/30 tabular-nums"
                    />
                  </Field>
                  <Field label="Próxima revisão (Data)">
                    <Input 
                      type="date"
                      value={draft.nextRevisionDate} 
                      onChange={(e) => change("nextRevisionDate", e.target.value)}
                      className="h-9 focus-visible:ring-primary/30"
                    />
                  </Field>
                  <Field label="Revisão por KM">
                    <Input 
                      type="text"
                      value={draft.nextRevisionMileage?.toLocaleString("pt-BR") ?? ""} 
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        change("nextRevisionMileage", Number(val));
                      }}
                      className="h-9 focus-visible:ring-primary/30 tabular-nums"
                    />
                  </Field>
                </div>
              </section>
            </TabsContent>

            <TabsContent value="licenciamento" className="mt-0 space-y-5">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 p-4">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Situação do licenciamento</p>
                  <p className="text-[11px] text-muted-foreground">Cálculo baseado no registro em SP.</p>
                </div>
                <Badge className={cn("px-3 py-1 font-semibold", licensing?.status === "overdue" && "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-200", licensing?.status === "due_soon" && "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 border-amber-200", licensing?.status === "regular" && "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-200")}>
                  {licensing?.label}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                <Field label="UF do registro">
                  <Input 
                    value={draft.state ?? "SP"} 
                    maxLength={2} 
                    onChange={(e) => change("state", e.target.value.toUpperCase())}
                    className="h-9 focus-visible:ring-primary/30"
                  />
                </Field>
                <Field label="Renavam">
                  <Input 
                    value={draft.renavam ?? ""} 
                    inputMode="numeric" 
                    onChange={(e) => change("renavam", e.target.value.replace(/\D/g, "").slice(0, 11))}
                    className="h-9 focus-visible:ring-primary/30 tabular-nums"
                  />
                </Field>
                <Field label="Exercício licenciado">
                  <Input 
                    type="number" 
                    min="2000" 
                    max="2100" 
                    value={draft.licensingYear ?? ""} 
                    onChange={(e) => change("licensingYear", e.target.value ? Number(e.target.value) : undefined)}
                    className="h-9 focus-visible:ring-primary/30 tabular-nums"
                  />
                </Field>
                <Field label="Pagamento realizado em">
                  <Input 
                    type="date" 
                    value={draft.licensingPaidAt ?? ""} 
                    onChange={(e) => change("licensingPaidAt", e.target.value || undefined)}
                    className="h-9 focus-visible:ring-primary/30"
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Prazo (Calculado automaticamente)">
                    <Input 
                      type="date" 
                      value={draft.licensingDueDate ?? calculateLicensingDueDate(draft.plate, draft.state) ?? ""} 
                      onChange={(e) => change("licensingDueDate", e.target.value || undefined)}
                      className="h-9 focus-visible:ring-primary/30"
                    />
                  </Field>
                </div>
              </div>
              <p className="text-[11px] leading-relaxed text-muted-foreground italic px-1">
                A placa define o calendário estimado. Confirme a quitação no CRLV-e oficial.
              </p>
            </TabsContent>

            <TabsContent value="manutencao" className="mt-4 space-y-5">
              <div className="grid gap-3 rounded-md border border-border p-4 sm:grid-cols-2">
                <Field label="Data/Hora de Entrada">
                  <Input 
                    type="datetime-local" 
                    value={maintenance.entryDate} 
                    onChange={(e) => setMaintenance({ ...maintenance, entryDate: e.target.value })} 
                  />
                </Field>
                <Field label="Quilometragem Inicial">
                  <Input 
                    type="number" 
                    min="0" 
                    value={maintenance.mileage} 
                    onChange={(e) => setMaintenance({ ...maintenance, mileage: e.target.value })} 
                  />
                </Field>
                <Field label="Motivo / Problema">
                  <Input 
                    value={maintenance.description} 
                    onChange={(e) => setMaintenance({ ...maintenance, description: e.target.value })} 
                    placeholder="Ex.: Troca de óleo, barulho na suspensão..." 
                  />
                </Field>
                <Field label="Oficina">
                  <Input 
                    value={maintenance.workshop} 
                    onChange={(e) => setMaintenance({ ...maintenance, workshop: e.target.value })} 
                  />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Observações">
                    <Input 
                      value={maintenance.notes} 
                      onChange={(e) => setMaintenance({ ...maintenance, notes: e.target.value })} 
                    />
                  </Field>
                </div>
                <Button type="button" variant="outline" className="sm:col-span-2" onClick={registerMaintenance}>
                  <Plus className="mr-2 h-4 w-4" />
                  Iniciar manutenção
                </Button>
              </div>
              <div className="space-y-2">
                <h3 className="flex items-center gap-2 text-sm font-medium"><Wrench className="h-4 w-4 text-primary" />Histórico de manutenção</h3>
                {(draft.maintenanceRecords ?? []).length === 0 ? <p className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">Nenhuma manutenção registrada.</p> : draft.maintenanceRecords?.map((record) => (
                  <div key={record.id} className="grid gap-1 rounded-md border border-border p-3 text-sm sm:grid-cols-[110px_1fr_auto]">
                    <span className="text-muted-foreground">{formatDate(record.entryDate)}</span>
                    <div><p className="font-medium">{record.reason}</p><p className="text-xs text-muted-foreground">{[record.workshop, record.entryMileage ? `${record.entryMileage.toLocaleString("pt-BR")} km` : null, record.notes].filter(Boolean).join(" · ")}</p></div>
                    <span className="tabular-nums">{record.cost !== undefined ? record.cost.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 }) : ""}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={save}><Save className="mr-2 h-4 w-4" />Salvar alterações</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>;
}
