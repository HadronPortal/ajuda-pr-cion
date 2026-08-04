import { useState } from "react";
import { Bell, ClipboardCheck, DollarSign, Fuel, Gauge, MapPinned, Plus, Receipt, Save, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createFleetEntry, type FleetEntryType } from "@/lib/fleet-entry-store";
import { useVehicles } from "@/lib/fleet-store";

const TYPES = [
  ["abastecimento", "Abastecimento", Fuel], ["despesa", "Despesa", Receipt],
  ["receita", "Receita", DollarSign], ["servico", "Serviço", Wrench],
  ["percurso", "Percurso", MapPinned], ["leitura", "Leitura", Gauge],
  ["checklist", "Checklist", ClipboardCheck], ["lembrete", "Lembrete", Bell],
] as const;

type Draft = Record<"vehicleId" | "occurredAt" | "mileage" | "title" | "notes" | "amount" | "liters" | "fuelType" | "fuelLevel" | "origin" | "destination" | "distance" | "readingType" | "readingValue" | "checklistItems" | "reminderAt", string>;

function emptyDraft(vehicleId = ""): Draft {
  return { vehicleId, occurredAt: new Date().toISOString().slice(0, 16), mileage: "", title: "", notes: "", amount: "", liters: "", fuelType: "Gasolina", fuelLevel: "", origin: "", destination: "", distance: "", readingType: "Quilometragem", readingValue: "", checklistItems: "", reminderAt: "" };
}

export function FleetEntryDialog({ defaultVehicleId, triggerLabel = "Adicionar" }: { defaultVehicleId?: string; triggerLabel?: string }) {
  const vehicles = useVehicles();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FleetEntryType | null>(null);
  const [draft, setDraft] = useState(() => emptyDraft(defaultVehicleId));
  const set = (key: keyof Draft, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const selectedLabel = TYPES.find(([value]) => value === type)?.[1];
  const close = () => { setOpen(false); setType(null); setDraft(emptyDraft(defaultVehicleId)); };

  const save = () => {
    if (!type || !draft.vehicleId || !draft.occurredAt || !draft.title.trim()) return toast.error("Preencha veículo, data e descrição.");
    createFleetEntry({
      type, vehicleId: draft.vehicleId, occurredAt: draft.occurredAt, title: draft.title.trim(),
      mileage: numberValue(draft.mileage), notes: draft.notes.trim() || undefined,
      amount: moneyValue(draft.amount), liters: numberValue(draft.liters),
      fuelType: type === "abastecimento" ? draft.fuelType : undefined,
      fuelLevel: type === "abastecimento" ? draft.fuelLevel || undefined : undefined,
      origin: type === "percurso" ? draft.origin || undefined : undefined,
      destination: type === "percurso" ? draft.destination || undefined : undefined,
      distance: type === "percurso" ? numberValue(draft.distance) : undefined,
      readingType: type === "leitura" ? draft.readingType : undefined,
      readingValue: type === "leitura" ? draft.readingValue || undefined : undefined,
      checklistItems: type === "checklist" ? draft.checklistItems.split("\n").map((item) => item.trim()).filter(Boolean) : undefined,
      reminderAt: type === "lembrete" ? draft.reminderAt || undefined : undefined,
    });
    toast.success(`${selectedLabel} registrado com sucesso.`); close();
  };

  return <>
    <Button onClick={() => setOpen(true)} className="h-10 gap-2"><Plus className="h-4 w-4" />{triggerLabel}</Button>
    <Dialog open={open} onOpenChange={(next) => next ? setOpen(true) : close()}>
      <DialogContent className="flex max-h-[92vh] max-w-3xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4"><DialogTitle>{type ? `Adicionar ${selectedLabel?.toLowerCase()}` : "Adicionar lançamento"}</DialogTitle></DialogHeader>
        <div className="overflow-y-auto px-6 py-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {!type ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TYPES.map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setType(value)} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border bg-card p-3 text-sm font-medium transition hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Icon className="h-5 w-5 text-primary" />{label}</button>)}
          </div> : <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Veículo"><select value={draft.vehicleId} onChange={(e) => set("vehicleId", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Selecione</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.model} · {v.plate}</option>)}</select></Field>
              <Field label="Data e hora"><Input type="datetime-local" value={draft.occurredAt} onChange={(e) => set("occurredAt", e.target.value)} /></Field>
              <Field label="Quilometragem"><Input inputMode="numeric" value={draft.mileage} onChange={(e) => set("mileage", e.target.value.replace(/\D/g, ""))} /></Field>
              <Field label={type === "servico" ? "Serviço realizado" : "Descrição"}><Input value={draft.title} onChange={(e) => set("title", e.target.value)} /></Field>
            </div>
            {(["abastecimento", "despesa", "receita", "servico"] as FleetEntryType[]).includes(type) && <div className="grid gap-4 sm:grid-cols-2"><Field label="Valor (R$)"><Input inputMode="decimal" value={draft.amount} onChange={(e) => set("amount", e.target.value)} placeholder="0,00" /></Field>{type === "abastecimento" && <><Field label="Litros"><Input value={draft.liters} onChange={(e) => set("liters", e.target.value)} /></Field><Field label="Combustível"><Input value={draft.fuelType} onChange={(e) => set("fuelType", e.target.value)} /></Field><Field label="Nível após abastecer"><Input value={draft.fuelLevel} onChange={(e) => set("fuelLevel", e.target.value)} /></Field></>}</div>}
            {type === "percurso" && <div className="grid gap-4 sm:grid-cols-3"><Field label="Origem"><Input value={draft.origin} onChange={(e) => set("origin", e.target.value)} /></Field><Field label="Destino"><Input value={draft.destination} onChange={(e) => set("destination", e.target.value)} /></Field><Field label="Distância (km)"><Input value={draft.distance} onChange={(e) => set("distance", e.target.value)} /></Field></div>}
            {type === "leitura" && <div className="grid gap-4 sm:grid-cols-2"><Field label="Tipo de leitura"><Input value={draft.readingType} onChange={(e) => set("readingType", e.target.value)} /></Field><Field label="Valor"><Input value={draft.readingValue} onChange={(e) => set("readingValue", e.target.value)} /></Field></div>}
            {type === "checklist" && <Field label="Itens (um por linha)"><Textarea rows={5} value={draft.checklistItems} onChange={(e) => set("checklistItems", e.target.value)} placeholder={"Óleo\nFreios\nLuzes\nDocumentos"} /></Field>}
            {type === "lembrete" && <Field label="Lembrar em"><Input type="datetime-local" value={draft.reminderAt} onChange={(e) => set("reminderAt", e.target.value)} /></Field>}
            <Field label="Observações"><Textarea rows={3} value={draft.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
          </div>}
        </div>
        <div className="flex justify-end gap-2 border-t px-6 py-3">{type && <Button variant="ghost" onClick={() => setType(null)}>Voltar</Button>}<Button variant="outline" onClick={close}>Cancelar</Button>{type && <Button onClick={save} className="gap-2"><Save className="h-4 w-4" />Salvar</Button>}</div>
      </DialogContent>
    </Dialog>
  </>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }
function numberValue(value: string) { const parsed = Number(value.replace(",", ".")); return value.trim() && Number.isFinite(parsed) ? parsed : undefined; }
function moneyValue(value: string) { const parsed = Number(value.replace(/\./g, "").replace(",", ".")); return value.trim() && Number.isFinite(parsed) ? parsed : undefined; }
