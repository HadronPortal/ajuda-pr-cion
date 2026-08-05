import { useState } from "react";
import { Bell, ClipboardCheck, DollarSign, Fuel, Gauge, MapPinned, Plus, Receipt, Save, Upload, Wrench } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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

type Draft = {
  vehicleId: string; occurredAt: string; endedAt: string; mileage: string; endingMileage: string;
  title: string; notes: string; amount: string; liters: string; unitPrice: string; fuelType: string;
  fuelStation: string; driver: string; motive: string; paymentMethod: string; location: string;
  origin: string; destination: string; distance: string; routeKind: "viagem" | "frete"; ratePerKm: string;
  readingType: string; readingValue: string; checklistItems: string; reminderAt: string;
  reminderKind: "despesa" | "servico"; attachmentName: string; fullTank: boolean; previousRefuelingMissing: boolean;
};

function localNow(offsetHours = 0) {
  const date = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

function emptyDraft(vehicleId = ""): Draft {
  return {
    vehicleId, occurredAt: localNow(), endedAt: localNow(1), mileage: "", endingMileage: "",
    title: "", notes: "", amount: "", liters: "", unitPrice: "", fuelType: "Gasolina aditivada",
    fuelStation: "", driver: "", motive: "", paymentMethod: "", location: "", origin: "", destination: "",
    distance: "", routeKind: "viagem", ratePerKm: "", readingType: "Quilometragem", readingValue: "",
    checklistItems: "", reminderAt: "", reminderKind: "despesa", attachmentName: "", fullTank: true,
    previousRefuelingMissing: false,
  };
}

export function FleetEntryDialog({ defaultVehicleId, triggerLabel = "Adicionar" }: { defaultVehicleId?: string; triggerLabel?: string }) {
  const vehicles = useVehicles();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<FleetEntryType | null>(null);
  const [draft, setDraft] = useState(() => emptyDraft(defaultVehicleId));
  const set = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const selectedLabel = TYPES.find(([value]) => value === type)?.[1];
  const close = () => { setOpen(false); setType(null); setDraft(emptyDraft(defaultVehicleId)); };

  const save = () => {
    if (!type || !draft.vehicleId || !draft.occurredAt) return toast.error("Preencha veículo e data do lançamento.");
    const title = draft.title.trim() || selectedLabel || "Lançamento";
    createFleetEntry({
      type, vehicleId: draft.vehicleId, occurredAt: draft.occurredAt, title,
      mileage: numberValue(draft.mileage), notes: draft.notes.trim() || undefined,
      amount: moneyValue(draft.amount), liters: numberValue(draft.liters), unitPrice: moneyValue(draft.unitPrice),
      fuelType: type === "abastecimento" ? draft.fuelType : undefined,
      fullTank: type === "abastecimento" ? draft.fullTank : undefined,
      previousRefuelingMissing: type === "abastecimento" ? draft.previousRefuelingMissing : undefined,
      fuelStation: type === "abastecimento" ? draft.fuelStation.trim() || undefined : undefined,
      driver: draft.driver.trim() || undefined, motive: draft.motive.trim() || undefined,
      paymentMethod: draft.paymentMethod || undefined, location: draft.location.trim() || undefined,
      attachmentName: draft.attachmentName || undefined,
      origin: type === "percurso" ? draft.origin.trim() || undefined : undefined,
      destination: type === "percurso" ? draft.destination.trim() || undefined : undefined,
      distance: type === "percurso" ? numberValue(draft.distance) : undefined,
      endedAt: type === "percurso" ? draft.endedAt : undefined,
      endingMileage: type === "percurso" ? numberValue(draft.endingMileage) : undefined,
      routeKind: type === "percurso" ? draft.routeKind : undefined,
      ratePerKm: type === "percurso" ? moneyValue(draft.ratePerKm) : undefined,
      readingType: type === "leitura" ? draft.readingType : undefined,
      readingValue: type === "leitura" ? draft.readingValue.trim() || undefined : undefined,
      checklistItems: type === "checklist" ? draft.checklistItems.split("\n").map((item) => item.trim()).filter(Boolean) : undefined,
      reminderAt: type === "lembrete" ? draft.reminderAt || undefined : undefined,
      reminderKind: type === "lembrete" ? draft.reminderKind : undefined,
    });
    toast.success(`${selectedLabel} registrado com sucesso.`);
    close();
  };

  return <>
    <Button onClick={() => setOpen(true)} className="h-10 gap-2"><Plus className="h-4 w-4" />{triggerLabel}</Button>
    <Dialog open={open} onOpenChange={(next) => next ? setOpen(true) : close()}>
      <DialogContent className="flex max-h-[92vh] max-w-4xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4"><DialogTitle>{type ? `Adicionar ${selectedLabel?.toLowerCase()}` : "Adicionar lançamento"}</DialogTitle></DialogHeader>
        <div className="overflow-y-auto px-6 py-5 [scrollbar-color:hsl(var(--muted-foreground)/.35)_transparent] [scrollbar-width:thin]">
          {!type ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TYPES.map(([value, label, Icon]) => <button key={value} type="button" onClick={() => setType(value)} className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-md border bg-card p-3 text-sm font-medium transition hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><Icon className="h-5 w-5 text-primary" />{label}</button>)}
          </div> : <div className="space-y-5">
            <CommonFields draft={draft} set={set} vehicles={vehicles} type={type} />
            {type === "abastecimento" && <FuelFields draft={draft} set={set} />}
            {type === "despesa" && <ExpenseFields draft={draft} set={set} />}
            {type === "receita" && <IncomeFields draft={draft} set={set} />}
            {type === "servico" && <ServiceFields draft={draft} set={set} />}
            {type === "percurso" && <RouteFields draft={draft} set={set} />}
            {type === "leitura" && <ReadingFields draft={draft} set={set} />}
            {type === "checklist" && <Field label="Itens do checklist (um por linha)"><Textarea rows={6} value={draft.checklistItems} onChange={(e) => set("checklistItems", e.target.value)} placeholder={"Óleo\nFreios\nLuzes\nPneus\nDocumentos"} /></Field>}
            {type === "lembrete" && <ReminderFields draft={draft} set={set} />}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Anexo (opcional)"><label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-input px-3 text-sm"><Upload className="h-4 w-4 text-muted-foreground" /><span className="truncate">{draft.attachmentName || "Anexar arquivo"}</span><input className="sr-only" type="file" onChange={(e) => set("attachmentName", e.target.files?.[0]?.name || "")} /></label></Field>
              <Field label="Observação"><Textarea rows={3} value={draft.notes} onChange={(e) => set("notes", e.target.value)} /></Field>
            </div>
          </div>}
        </div>
        <div className="flex justify-end gap-2 border-t px-6 py-3">{type && <Button variant="ghost" onClick={() => setType(null)}>Voltar</Button>}<Button variant="outline" onClick={close}>Cancelar</Button>{type && <Button onClick={save} className="gap-2"><Save className="h-4 w-4" />Salvar</Button>}</div>
      </DialogContent>
    </Dialog>
  </>;
}

type Setter = <K extends keyof Draft>(key: K, value: Draft[K]) => void;
type VehicleOption = { id: string; model: string; plate: string };

function CommonFields({ draft, set, vehicles, type }: { draft: Draft; set: Setter; vehicles: VehicleOption[]; type: FleetEntryType }) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Field label="Veículo"><select value={draft.vehicleId} onChange={(e) => set("vehicleId", e.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"><option value="">Selecione</option>{vehicles.map((v) => <option key={v.id} value={v.id}>{v.model} · {v.plate}</option>)}</select></Field>
    <Field label={type === "percurso" ? "Data e hora inicial" : "Data e hora"}><Input type="datetime-local" value={draft.occurredAt} onChange={(e) => set("occurredAt", e.target.value)} /></Field>
    <Field label={type === "percurso" ? "Odômetro inicial (km)" : "Odômetro (km)"}><Input inputMode="numeric" value={draft.mileage} onChange={(e) => set("mileage", e.target.value.replace(/\D/g, ""))} /></Field>
  </div>;
}

function FuelFields({ draft, set }: { draft: Draft; set: Setter }) { return <>
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Combustível"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={draft.fuelType} onChange={(e) => set("fuelType", e.target.value)}><option>Gasolina aditivada</option><option>Gasolina comum</option><option>Etanol</option><option>Diesel</option><option>GNV</option></select></Field><Field label="Preço por litro (R$)"><Input inputMode="decimal" value={draft.unitPrice} onChange={(e) => set("unitPrice", e.target.value)} /></Field><Field label="Valor total (R$)"><Input inputMode="decimal" value={draft.amount} onChange={(e) => set("amount", e.target.value)} /></Field><Field label="Litros"><Input inputMode="decimal" value={draft.liters} onChange={(e) => set("liters", e.target.value)} /></Field><Field label="Posto de combustível"><Input value={draft.fuelStation} onChange={(e) => set("fuelStation", e.target.value)} /></Field><Field label="Motorista"><Input value={draft.driver} onChange={(e) => set("driver", e.target.value)} /></Field></div>
  <div className="grid gap-4 sm:grid-cols-2"><Field label="Motivo (opcional)"><Input value={draft.motive} onChange={(e) => set("motive", e.target.value)} /></Field><Payment draft={draft} set={set} /></div>
  <div className="flex flex-wrap gap-6"><Check label="Está completando o tanque?" checked={draft.fullTank} onChange={(value) => set("fullTank", value)} /><Check label="Abastecimento anterior em falta?" checked={draft.previousRefuelingMissing} onChange={(value) => set("previousRefuelingMissing", value)} /></div>
  </>; }

function ExpenseFields({ draft, set }: { draft: Draft; set: Setter }) { return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Tipo de despesa"><Input value={draft.title} onChange={(e) => set("title", e.target.value)} placeholder="Ex.: estacionamento" /></Field><Field label="Valor (R$)"><Input inputMode="decimal" value={draft.amount} onChange={(e) => set("amount", e.target.value)} /></Field><Field label="Local (opcional)"><Input value={draft.location} onChange={(e) => set("location", e.target.value)} /></Field><Field label="Motorista"><Input value={draft.driver} onChange={(e) => set("driver", e.target.value)} /></Field><Field label="Motivo (opcional)"><Input value={draft.motive} onChange={(e) => set("motive", e.target.value)} /></Field><Payment draft={draft} set={set} /></div>; }
function IncomeFields({ draft, set }: { draft: Draft; set: Setter }) { return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Tipo de receita"><Input value={draft.title} onChange={(e) => set("title", e.target.value)} /></Field><Field label="Valor (R$)"><Input inputMode="decimal" value={draft.amount} onChange={(e) => set("amount", e.target.value)} /></Field><Field label="Motorista"><Input value={draft.driver} onChange={(e) => set("driver", e.target.value)} /></Field></div>; }
function ServiceFields({ draft, set }: { draft: Draft; set: Setter }) { return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><Field label="Tipo de serviço"><Input value={draft.title} onChange={(e) => set("title", e.target.value)} /></Field><Field label="Local / oficina"><Input value={draft.location} onChange={(e) => set("location", e.target.value)} /></Field><Field label="Valor (R$)"><Input inputMode="decimal" value={draft.amount} onChange={(e) => set("amount", e.target.value)} /></Field><Field label="Motorista"><Input value={draft.driver} onChange={(e) => set("driver", e.target.value)} /></Field><Payment draft={draft} set={set} /></div>; }
function RouteFields({ draft, set }: { draft: Draft; set: Setter }) { return <><div className="grid gap-4 sm:grid-cols-2"><Field label="Origem"><Input value={draft.origin} onChange={(e) => set("origin", e.target.value)} /></Field><Field label="Destino"><Input value={draft.destination} onChange={(e) => set("destination", e.target.value)} /></Field><Field label="Data e hora final"><Input type="datetime-local" value={draft.endedAt} onChange={(e) => set("endedAt", e.target.value)} /></Field><Field label="Odômetro final"><Input value={draft.endingMileage} onChange={(e) => set("endingMileage", e.target.value.replace(/\D/g, ""))} /></Field></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Field label="Modalidade"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={draft.routeKind} onChange={(e) => set("routeKind", e.target.value as Draft["routeKind"])}><option value="viagem">Viagem</option><option value="frete">Frete</option></select></Field><Field label="Distância (km)"><Input value={draft.distance} onChange={(e) => set("distance", e.target.value)} /></Field><Field label="Valor por km (R$)"><Input value={draft.ratePerKm} onChange={(e) => set("ratePerKm", e.target.value)} /></Field><Field label="Motorista"><Input value={draft.driver} onChange={(e) => set("driver", e.target.value)} /></Field></div><Field label="Motivo (opcional)"><Input value={draft.motive} onChange={(e) => set("motive", e.target.value)} /></Field></>; }
function ReadingFields({ draft, set }: { draft: Draft; set: Setter }) { return <div className="grid gap-4 sm:grid-cols-3"><Field label="Tipo de leitura"><Input value={draft.readingType} onChange={(e) => set("readingType", e.target.value)} /></Field><Field label="Valor"><Input value={draft.readingValue} onChange={(e) => set("readingValue", e.target.value)} /></Field><Field label="Motorista"><Input value={draft.driver} onChange={(e) => set("driver", e.target.value)} /></Field></div>; }
function ReminderFields({ draft, set }: { draft: Draft; set: Setter }) { return <div className="grid gap-4 sm:grid-cols-3"><Field label="Categoria"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={draft.reminderKind} onChange={(e) => set("reminderKind", e.target.value as Draft["reminderKind"])}><option value="despesa">Despesa</option><option value="servico">Serviço</option></select></Field><Field label={draft.reminderKind === "despesa" ? "Tipo de despesa" : "Tipo de serviço"}><Input value={draft.title} onChange={(e) => set("title", e.target.value)} /></Field><Field label="Lembrar em"><Input type="datetime-local" value={draft.reminderAt} onChange={(e) => set("reminderAt", e.target.value)} /></Field></div>; }
function Payment({ draft, set }: { draft: Draft; set: Setter }) { return <Field label="Forma de pagamento (opcional)"><select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={draft.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)}><option value="">Selecione</option><option>Dinheiro</option><option>Cartão de crédito</option><option>Cartão de débito</option><option>Pix</option><option>Boleto</option></select></Field>; }
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) { return <label className="flex cursor-pointer items-center gap-2 text-sm"><Checkbox checked={checked} onCheckedChange={(value) => onChange(value === true)} />{label}</label>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-1.5"><Label>{label}</Label>{children}</div>; }
function numberValue(value: string) { const parsed = Number(value.replace(",", ".")); return value.trim() && Number.isFinite(parsed) ? parsed : undefined; }
function moneyValue(value: string) { const parsed = Number(value.replace(/\./g, "").replace(",", ".")); return value.trim() && Number.isFinite(parsed) ? parsed : undefined; }
