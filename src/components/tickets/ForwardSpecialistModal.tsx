import { useMemo, useState, type ReactNode } from "react";
import { CircleDot, Search, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { cn } from "@/lib/utils";
import { ticketsStore } from "@/lib/tickets-store";
import type { SupportTicket, TicketPriority } from "@/lib/support-tickets-data";

type Specialist = { id: string; operator: string; name: string; area: string; availability: "Disponível" | "Ocupado" | "Ausente" };
const SPECIALISTS: Specialist[] = [
  { id: "esp-1", operator: "PRCMAR", name: "Ana Ribeiro", area: "Fiscal / SPED", availability: "Disponível" },
  { id: "esp-2", operator: "PRCROG", name: "Bruno Martins", area: "NF-e / NFC-e", availability: "Disponível" },
  { id: "esp-3", operator: "PRCLCZ", name: "Carla Souza", area: "Financeiro", availability: "Ocupado" },
  { id: "esp-4", operator: "PRCPED", name: "Diego Alves", area: "Estoque / Produção", availability: "Disponível" },
  { id: "esp-5", operator: "PRCGGC", name: "Eduarda Lima", area: "Desenvolvimento / Web", availability: "Disponível" },
];
const PERMISSIONS = ["Público", "Clientes", "Empresa"];
const AREAS = ["Ag. Comercial", "Ag. Financeiro", "Ag. Administrativo", "Ag. Desenvolvimento", "Ag. Web"];
const selectClass = "h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring";
const preventOutsideClose = (event: Event) => event.preventDefault();

export function ForwardSpecialistModal({ open, onOpenChange, ticket }: { open: boolean; onOpenChange: (value: boolean) => void; ticket: SupportTicket }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [permission, setPermission] = useState("Clientes");
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [waitingArea, setWaitingArea] = useState("Ag. Desenvolvimento");
  const [module, setModule] = useState(ticket.module.split(" - ")[0] || ticket.module);
  const [submodule, setSubmodule] = useState(ticket.module.split(" - ").slice(1).join(" - ") || "Geral");
  const [reason, setReason] = useState("");
  const list = useMemo(() => {
    const value = query.trim().toLowerCase();
    return value ? SPECIALISTS.filter((item) => `${item.name} ${item.operator} ${item.area}`.toLowerCase().includes(value)) : SPECIALISTS;
  }, [query]);

  const reset = () => {
    setQuery(""); setSelectedId(null); setPermission("Clientes"); setPriority(ticket.priority);
    setWaitingArea("Ag. Desenvolvimento"); setModule(ticket.module.split(" - ")[0] || ticket.module);
    setSubmodule(ticket.module.split(" - ").slice(1).join(" - ") || "Geral"); setReason("");
  };
  const submit = () => {
    const specialist = SPECIALISTS.find((item) => item.id === selectedId);
    if (!specialist) { toast.error("Selecione um especialista."); return; }
    if (!reason.trim()) { toast.error("Informe a mensagem para o especialista."); return; }
    ticketsStore.forwardToSpecialist(ticket.id, {
      specialist: specialist.name, operator: specialist.operator, area: specialist.area,
      waitingArea, reason: reason.trim(), permission, priority, module, submodule,
    });
    toast.success("Chamado enviado ao especialista", { description: `${specialist.operator} · ${specialist.area}` });
    reset(); onOpenChange(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent onPointerDownOutside={preventOutsideClose} onInteractOutside={preventOutsideClose} onEscapeKeyDown={preventOutsideClose} className="flex max-h-[90vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 sm:w-[calc(100vw-2rem)] md:w-[760px] [&>button]:hidden">
      <DialogTitle className="sr-only">Enviar chamado {ticket.protocol} a especialista</DialogTitle>
      <DetailModalHeader icon={UserCheck} title="Enviar a especialista" protocol={ticket.protocol} onClose={() => onOpenChange(false)} meta={<span className="inline-flex items-center gap-1"><span className="text-primary">{ticket.clientCode}</span><span className="text-border">·</span><span>{ticket.clientName}</span></span>} />
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 md:px-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Permissão"><select value={permission} onChange={(e) => setPermission(e.target.value)} className={selectClass}>{PERMISSIONS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Prioridade"><select value={priority} onChange={(e) => setPriority(e.target.value as TicketPriority)} className={selectClass}><option>Baixa</option><option value="Media">Média</option><option>Alta</option></select></Field>
          <Field label="Área de espera"><select value={waitingArea} onChange={(e) => setWaitingArea(e.target.value)} className={selectClass}>{AREAS.map((item) => <option key={item}>{item}</option>)}</select></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2"><Field label="Módulo"><Input value={module} onChange={(e) => setModule(e.target.value)} /></Field><Field label="Submódulo"><Input value={submodule} onChange={(e) => setSubmodule(e.target.value)} /></Field></div>
        <Field label="Buscar especialista"><div className="relative"><Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Nome, operador ou especialidade" className="pl-8"/></div></Field>
        <ul className="grid max-h-[230px] gap-2 overflow-y-auto rounded-lg border border-border bg-card p-2 sm:grid-cols-2">
          {list.map((item) => {
            const selected = selectedId === item.id;
            const disabled = item.availability === "Ausente";
            return <li key={item.id}><button type="button" disabled={disabled} onClick={() => setSelectedId(item.id)} className={cn("flex w-full cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors", selected ? "border-primary bg-primary/8" : "border-border hover:bg-accent", disabled && "cursor-not-allowed opacity-50")}><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/12 text-[11px] text-primary">{item.operator.slice(-2)}</span><span className="min-w-0 flex-1"><span className="block truncate text-[13px]">{item.name} · {item.operator}</span><span className="block truncate text-[11.5px] text-muted-foreground">{item.area}</span></span><CircleDot className={cn("h-3.5 w-3.5", item.availability === "Disponível" ? "text-success" : "text-warning-foreground")}/></button></li>;
          })}
        </ul>
        <Field label="Mensagem para o especialista" required><textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={4} maxLength={1000} placeholder="Descreva o diagnóstico, testes realizados e o que precisa ser analisado..." className="min-h-[100px] w-full resize-none rounded-md border border-input bg-background p-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"/></Field>
      </div>
      <DialogFooter className="shrink-0 gap-2 border-t border-border bg-card px-5 py-3 sm:gap-2"><Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button><Button onClick={submit} className="cursor-pointer"><UserCheck className="mr-1.5 h-4 w-4"/>Enviar a especialista</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <div><Label className="mb-1.5 block text-[12.5px] font-medium">{label}{required && <span className="text-destructive"> *</span>}</Label>{children}</div>;
}
