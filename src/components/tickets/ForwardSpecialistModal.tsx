import { useMemo, useState, type ReactNode } from "react";
import { ArrowUp, ChevronDown, Minus, Plus, UserCheck, X } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { ticketsStore } from "@/lib/tickets-store";
import { cn } from "@/lib/utils";
import type { SupportTicket, TicketPriority } from "@/lib/support-tickets-data";
import { modulesMap, moduleOptions, splitModule } from "@/lib/modules-map";

const PRIORITY_OPTIONS: {
  value: TicketPriority;
  label: string;
  icon: typeof ArrowUp;
  baseClass: string;
  activeClass: string;
  iconWrapClass: string;
  textClass: string;
}[] = [
  {
    value: "Baixa",
    label: "Baixa",
    icon: ChevronDown,
    baseClass: "border-success/25 bg-success/10 dark:bg-success/15",
    activeClass: "border-success/70 ring-2 ring-success/40 shadow-sm bg-success/15 dark:bg-success/20",
    iconWrapClass: "bg-success text-success-foreground",
    textClass: "text-success",
  },
  {
    value: "Media",
    label: "Média",
    icon: Minus,
    baseClass: "border-warning/30 bg-warning/12 dark:bg-warning/15",
    activeClass: "border-warning/70 ring-2 ring-warning/40 shadow-sm bg-warning/20 dark:bg-warning/25",
    iconWrapClass: "bg-warning text-warning-foreground",
    textClass: "text-warning-foreground",
  },
  {
    value: "Alta",
    label: "Alta",
    icon: ArrowUp,
    baseClass: "border-destructive/25 bg-destructive/10 dark:bg-destructive/15",
    activeClass: "border-destructive/70 ring-2 ring-destructive/40 shadow-sm bg-destructive/15 dark:bg-destructive/20",
    iconWrapClass: "bg-destructive text-destructive-foreground",
    textClass: "text-destructive",
  },
];

function PrioritySegmented({ value, onChange }: { value: TicketPriority; onChange: (v: TicketPriority) => void }) {
  return (
    <div role="radiogroup" aria-label="Prioridade" className="grid grid-cols-3 gap-2">
      {PRIORITY_OPTIONS.map((opt) => {
        const active = value === opt.value;
        const Icon = opt.icon;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "relative flex h-9 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border text-xs font-medium transition",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
              opt.baseClass,
              active && opt.activeClass,
            )}
          >
            <span className={cn("grid h-4 w-4 shrink-0 place-items-center rounded-full", opt.iconWrapClass)}>
              <Icon className="h-2.5 w-2.5" strokeWidth={3} />
            </span>
            <span className={cn("font-medium", opt.textClass)}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const TYPES = ["Não definido", "Dúvida", "Configuração", "Atualização do Hádron", "Problema Hádron", "Problema Externo", "Treinamento", "Solicitação/Sugestão", "Outros"];
const PERMISSIONS = ["Público", "Clientes", "Empresa"];
const AREAS = ["Ag. Comercial", "Ag. Financeiro", "Ag. Administrativo", "Ag. Desenvolvimento", "Ag. Web"];
const selectClass = "h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring";
const preventOutsideClose = (event: Event) => event.preventDefault();

export function ForwardSpecialistModal({ open, onOpenChange, ticket }: { open: boolean; onOpenChange: (value: boolean) => void; ticket: SupportTicket }) {
  const defaults = useMemo(() => splitModule(ticket.module), [ticket.module]);
  const [permission, setPermission] = useState("Clientes");
  const [priority, setPriority] = useState<TicketPriority>(ticket.priority);
  const [type, setType] = useState(TYPES[0]);
  const [waitingArea, setWaitingArea] = useState("Ag. Desenvolvimento");
  const [module, setModule] = useState(defaults.module);
  const [submodule, setSubmodule] = useState(defaults.submodule);
  const [reason, setReason] = useState("");
  const [articleQuery, setArticleQuery] = useState("");
  const [formQuery, setFormQuery] = useState("");
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);
  const [relatedForms, setRelatedForms] = useState<string[]>([]);

  const availableSubs = modulesMap[module] ?? [];

  const changeModule = (value: string) => {
    setModule(value);
    const subs = modulesMap[value] ?? [];
    if (!subs.includes(submodule)) {
      setSubmodule(subs[0] ?? "");
    }
  };

  const reset = () => {
    setPermission("Clientes"); setPriority(ticket.priority); setType(TYPES[0]);
    setWaitingArea("Ag. Desenvolvimento");
    setModule(defaults.module); setSubmodule(defaults.submodule);
    setReason("");
    setArticleQuery(""); setFormQuery(""); setRelatedArticles([]); setRelatedForms([]);
  };
  const submit = () => {
    if (!module || !submodule) { toast.error("Selecione módulo e submódulo."); return; }
    if (!reason.trim()) { toast.error("Informe a mensagem para o especialista."); return; }
    ticketsStore.forwardToSpecialist(ticket.id, {
      waitingArea, reason: reason.trim(), permission, priority, type, module, submodule,
      relatedArticles, relatedForms,
    });
    toast.success("Chamado enviado para a fila de especialistas", { description: `${waitingArea} · ${module} / ${submodule}` });
    reset(); onOpenChange(false);
  };

  return <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent
      onPointerDownOutside={preventOutsideClose}
      onInteractOutside={preventOutsideClose}
      onEscapeKeyDown={preventOutsideClose}
      style={{ maxHeight: "calc(100vh - 2rem)" }}
      className="flex w-[calc(100vw-2rem)] max-w-[940px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
    >
      <DialogTitle className="sr-only">Enviar chamado {ticket.protocol} a especialista</DialogTitle>
      <DetailModalHeader icon={UserCheck} title="Enviar a especialista" protocol={ticket.protocol} onClose={() => onOpenChange(false)} meta={<span className="inline-flex items-center gap-1"><span className="text-primary">{ticket.clientCode}</span><span className="text-border">·</span><span>{ticket.clientName}</span></span>} />
      <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4 md:px-6">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Tipo"><select value={type} onChange={(e) => setType(e.target.value)} className={selectClass}>{TYPES.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Área de espera"><select value={waitingArea} onChange={(e) => setWaitingArea(e.target.value)} className={selectClass}>{AREAS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Permissão"><select value={permission} onChange={(e) => setPermission(e.target.value)} className={selectClass}>{PERMISSIONS.map((item) => <option key={item}>{item}</option>)}</select></Field>
          <Field label="Prioridade"><PrioritySegmented value={priority} onChange={setPriority} /></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Módulo" required>
            <select value={module} onChange={(e) => changeModule(e.target.value)} className={selectClass}>
              {moduleOptions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>
          <Field label="Submódulo" required>
            <select value={submodule} onChange={(e) => setSubmodule(e.target.value)} className={selectClass} disabled={availableSubs.length === 0}>
              {availableSubs.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Mensagem para o especialista" required><textarea value={reason} onChange={(e) => setReason(e.target.value)} rows={3} maxLength={1000} placeholder="Descreva o diagnóstico, testes realizados e o que precisa ser analisado..." className="min-h-[84px] w-full resize-none rounded-md border border-input bg-background p-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"/></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <RelatedPicker label="Artigos relacionados" query={articleQuery} onQuery={setArticleQuery} selected={relatedArticles} onSelected={setRelatedArticles} />
          <RelatedPicker label="Opções/Formulários relacionados" query={formQuery} onQuery={setFormQuery} selected={relatedForms} onSelected={setRelatedForms} />
        </div>
        <p className="text-[11.5px] text-muted-foreground">
          O chamado será encaminhado para a fila de especialistas. O responsável será
          definido posteriormente pelo backend.
        </p>
      </div>
      <DialogFooter className="shrink-0 gap-2 border-t border-border bg-card px-5 py-3 sm:gap-2"><Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button><Button onClick={submit} className="cursor-pointer"><UserCheck className="mr-1.5 h-4 w-4"/>Enviar a especialista</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}

function RelatedPicker({ label, query, onQuery, selected, onSelected }: { label: string; query: string; onQuery: (value: string) => void; selected: string[]; onSelected: (value: string[]) => void }) {
  const add = () => {
    const value = query.trim();
    if (!value || selected.includes(value)) return;
    onSelected([...selected, value]); onQuery("");
  };
  return <div>
    <Label className="mb-1.5 block text-[12.5px] font-medium">{label}</Label>
    <div className="flex gap-2"><Input value={query} onChange={(e) => onQuery(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }} placeholder="Digite e adicione" /><Button type="button" onClick={add} size="icon" className="shrink-0 cursor-pointer" aria-label={`Adicionar em ${label}`}><Plus className="h-4 w-4"/></Button></div>
    {selected.length > 0 && <div className="mt-2 flex flex-wrap gap-1.5">{selected.map((item) => <button type="button" key={item} onClick={() => onSelected(selected.filter((value) => value !== item))} className="inline-flex max-w-full cursor-pointer items-center gap-1 rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] text-primary"><span className="truncate">{item}</span><X className="h-3 w-3 shrink-0"/></button>)}</div>}
  </div>;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return <div><Label className="mb-1.5 block text-[12.5px] font-medium">{label}{required && <span className="text-destructive"> *</span>}</Label>{children}</div>;
}
