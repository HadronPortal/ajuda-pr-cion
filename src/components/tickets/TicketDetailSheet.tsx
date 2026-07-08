import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Info,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Phone,
  PlayCircle,
  Send,
  ShieldCheck,
  Tag,
  UserCheck,
  UserPlus,
  UserRound,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import {
  ticketStatuses,
  type SupportTicket,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-tickets-data";
import {
  ticketsStore,
  useTicket,
  useTicketHistory,
  type ClosurePayload,
} from "@/lib/tickets-store";
import { currentUser } from "@/lib/mock-data";
import { TicketHistoryModal } from "./TicketHistoryModal";

const statusTone: Record<TicketStatus, string> = {
  Atrasado: "bg-destructive/12 text-destructive border-destructive/20",
  "Em Aberto": "bg-primary/12 text-primary border-primary/20",
  Ocupado:
    "bg-[#fff1d6] text-[#b66a00] border-[#ffd78a] dark:bg-[#4d3516] dark:text-[#ffd28a] dark:border-[#7a5520]",
  "Em andamento":
    "bg-[#e8f3ff] text-[#246cb5] border-[#bfddff] dark:bg-[#17314e] dark:text-[#9dcaff] dark:border-[#24527d]",
  "Aguardando cliente":
    "bg-[#f2eaff] text-[#7253bd] border-[#d9c9ff] dark:bg-[#2e2549] dark:text-[#c7b8ff] dark:border-[#4b3a78]",
  "Com especialista":
    "bg-[#e7faf1] text-[#1f9860] border-[#bdeed6] dark:bg-[#14382b] dark:text-[#8ee8be] dark:border-[#226447]",
  Agendamento:
    "bg-[#fff8dd] text-[#9c7610] border-[#f4df85] dark:bg-[#403817] dark:text-[#f3d66d] dark:border-[#695b22]",
  Finalizado: "bg-success/12 text-success border-success/20",
  Cancelado: "bg-muted text-muted-foreground border-border",
};

const priorityTone: Record<TicketPriority, string> = {
  Alta: "bg-destructive/12 text-destructive border-destructive/20",
  Media: "bg-warning/16 text-warning-foreground border-warning/30",
  Baixa: "bg-muted text-muted-foreground border-border",
};

const sourceLabels: Record<SupportTicket["source"], string> = {
  Telefone: "Telefone",
  "Portal do cliente": "Portal do cliente",
  WhatsApp: "WhatsApp",
  Email: "Email",
};

type ClientMock = {
  cnpj: string;
  city: string;
  uf: string;
  phone: string;
  email: string;
  status: "Ativo" | "Pendente" | "Bloqueado" | "Inativo";
  setup: string;
  lastContact: string;
  commercialOwner: string;
};

type ContactMock = {
  phone: string;
  email: string;
  role: string;
  preference: "WhatsApp" | "Telefone" | "Email";
};

const cities = [
  ["São Paulo", "SP"],
  ["Campinas", "SP"],
  ["Belo Horizonte", "MG"],
  ["Curitiba", "PR"],
  ["Porto Alegre", "RS"],
  ["Goiânia", "GO"],
  ["Recife", "PE"],
  ["Fortaleza", "CE"],
];
const setups = [
  "Hadron Web 4.2.1",
  "Prócion ERP 12.8",
  "Prócion ERP 12.7",
  "Hadron Desktop 3.9",
  "Prócion Cloud 2.4",
];
const clientStatuses: ClientMock["status"][] = [
  "Ativo",
  "Ativo",
  "Ativo",
  "Pendente",
  "Bloqueado",
  "Inativo",
];
const contactRoles = [
  "Financeiro",
  "TI / Sistemas",
  "Compras",
  "Comercial",
  "Fiscal",
  "Diretoria",
];
const commercialOwners = [
  "Carlos Menezes",
  "Priscila Duarte",
  "Rafael Antunes",
  "Juliana Prado",
];
const categoryByModule: Record<string, string> = {
  "Vendas - NFE": "Emissão fiscal",
  "Basico - Terceiros": "Cadastro",
  "Hadron Web": "Treinamento",
  Estoque: "Relatórios",
  Financeiro: "Movimentação",
};

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  return hash;
}

function buildMock(ticket: SupportTicket) {
  const h = hashString(ticket.id);
  const [city, uf] = cities[h % cities.length];
  const phoneA = 3000 + (h % 6999);
  const phoneB = 1000 + ((h >> 3) % 8999);
  const cnpj = `${10 + (h % 89)}.${100 + ((h >> 2) % 899)}.${100 + ((h >> 5) % 899)}/0001-${10 + ((h >> 7) % 89)}`;
  return {
    category: categoryByModule[ticket.module] ?? "Atendimento",
    description:
      "Cliente relata dificuldade recorrente ao executar a operação descrita no assunto. Solicita análise do time de suporte e retorno com orientação técnica ou correção do comportamento identificado.",
    client: {
      cnpj,
      city,
      uf,
      phone: `(${11 + (h % 88)}) 9${phoneA}-${phoneB}`,
      email: `contato@${ticket.clientCode.toLowerCase()}.com.br`,
      status: clientStatuses[h % clientStatuses.length],
      setup: setups[h % setups.length],
      lastContact: ticket.updatedAt,
      commercialOwner: commercialOwners[h % commercialOwners.length],
    } as ClientMock,
    contactDetails: {
      phone: `(${11 + ((h >> 1) % 88)}) 9${phoneB}-${phoneA}`,
      email: `${ticket.contact.split(" ")[0]?.toLowerCase() ?? "contato"}@${ticket.clientCode.toLowerCase()}.com.br`,
      role: contactRoles[h % contactRoles.length],
      preference: (["WhatsApp", "Telefone", "Email"] as const)[h % 3],
    } as ContactMock,
  };
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatCompact(iso: string) {
  const d = new Date(iso);
  return `${d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" })} ${d.toLocaleTimeString(
    "pt-BR",
    { hour: "2-digit", minute: "2-digit" },
  )}`;
}

function computeSla(ticket: SupportTicket) {
  const target = 24;
  const openedAt = new Date(ticket.openedAt).getTime();
  const now = Date.now();
  const hours = Math.max(0, (now - openedAt) / 36e5);
  const rawPct = ticket.status === "Atrasado" ? 100 : Math.min(100, (hours / target) * 100);
  const pct = Math.round(rawPct);
  let tone: "ok" | "warn" | "late" = "ok";
  if (ticket.status === "Atrasado" || pct >= 90) tone = "late";
  else if (pct >= 60) tone = "warn";
  return { pct, tone, hours: Math.round(hours) };
}

const slaBarTone: Record<"ok" | "warn" | "late", string> = {
  ok: "bg-success",
  warn: "bg-warning",
  late: "bg-destructive",
};


const clientStatusTone: Record<ClientMock["status"], string> = {
  Ativo: "bg-success/12 text-success border-success/20",
  Pendente: "bg-warning/16 text-warning-foreground border-warning/30",
  Bloqueado: "bg-destructive/12 text-destructive border-destructive/20",
  Inativo: "bg-muted text-muted-foreground border-border",
};

export function TicketDetailSheet({
  ticketId,
  open,
  onOpenChange,
}: {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const ticket = useTicket(ticketId);
  const historyList = useTicketHistory(ticketId);

  const [note, setNote] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const mock = useMemo(() => (ticket ? buildMock(ticket) : null), [ticket]);
  const sla = useMemo(() => (ticket ? computeSla(ticket) : null), [ticket]);

  if (!ticket || !mock || !sla) return null;

  const isMine =
    ticket.owner === currentUser.operator || ticket.lockedBy === currentUser.operator;

  const handleAssume = () => {
    ticketsStore.assumeTicket(ticket.id);
    toast.success("Chamado assumido");
  };
  const handleAttend = () => {
    ticketsStore.attendTicket(ticket.id);
    toast.success("Atendimento iniciado");
  };
  const handleStatus = (s: TicketStatus) => {
    ticketsStore.updateTicketStatus(ticket.id, s);
    setStatusOpen(false);
    toast.success("Status alterado", { description: s });
  };
  const handleSaveNote = () => {
    const text = note.trim();
    if (!text) return;
    ticketsStore.addNote(ticket.id, text);
    setNote("");
    toast.success("Nota interna adicionada ao histórico");
  };
  const handleClose = (payload: ClosurePayload) => {
    ticketsStore.closeTicket(ticket.id, payload);
    setCloseOpen(false);
    toast.success("Chamado encerrado");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="flex max-h-[92vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:w-[calc(100vw-2rem)] md:max-h-[88vh] md:w-[900px] lg:w-[1000px] xl:w-[1080px]"
        >
          <DialogTitle className="sr-only">
            Detalhes do chamado {ticket.protocol}
          </DialogTitle>

          {/* Fixed header */}
          <header className="shrink-0 border-b border-border bg-card px-5 py-4 md:px-6">
            <div className="flex flex-wrap items-start justify-between gap-3 pr-8">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[12px] font-semibold text-muted-foreground">
                    {ticket.protocol}
                  </span>
                  <span className="text-[12px] text-muted-foreground">·</span>
                  <span className="text-[12px] text-muted-foreground">
                    {sourceLabels[ticket.source]}
                  </span>
                </div>
                <h2 className="mt-1 truncate text-[17px] font-bold leading-snug text-foreground">
                  {ticket.subject}
                </h2>
                <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{ticket.clientCode}</span>
                  {" · "}
                  {ticket.clientName}
                </p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  statusTone[ticket.status],
                )}
              >
                {ticket.status}
              </Badge>
              <Badge
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                  priorityTone[ticket.priority],
                )}
              >
                Prioridade {ticket.priority}
              </Badge>
              <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                <CalendarClock className="h-3 w-3" />
                SLA {sla.pct}% · {sla.hours}h
              </span>
              {ticket.lockedBy && (
                <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-0.5 text-[11px] font-medium text-warning-foreground">
                  <LockKeyhole className="h-3 w-3" />
                  Atendendo agora: {ticket.lockedBy}
                </span>
              )}
            </div>

            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all", slaBarTone[sla.tone])}
                style={{ width: `${sla.pct}%` }}
              />
            </div>
          </header>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto bg-muted/30 px-5 py-5 md:px-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <SectionCard title="Cliente" icon={Building2}>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-bold text-foreground">
                      {ticket.clientName}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Código {ticket.clientCode}
                    </p>
                  </div>
                  <Badge
                    className={cn(
                      "shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                      clientStatusTone[mock.client.status],
                    )}
                  >
                    {mock.client.status}
                  </Badge>
                </div>
                <dl className="grid grid-cols-1 gap-2 text-[12px]">
                  <Field icon={FileText} label="CNPJ" value={mock.client.cnpj} mono />
                  <Field
                    icon={MapPin}
                    label="Cidade"
                    value={`${mock.client.city} - ${mock.client.uf}`}
                  />
                  <Field icon={Phone} label="Telefone" value={mock.client.phone} />
                  <Field icon={Mail} label="Email" value={mock.client.email} />
                  <Field icon={Tag} label="Setup" value={mock.client.setup} />
                  <Field
                    icon={Clock3}
                    label="Último contato"
                    value={formatDateTime(mock.client.lastContact)}
                  />
                  <Field
                    icon={UserRound}
                    label="Comercial"
                    value={mock.client.commercialOwner}
                  />
                </dl>
              </SectionCard>

              <SectionCard title="Contato" icon={UserRound}>
                <p className="text-[14px] font-bold text-foreground">{ticket.contact}</p>
                <p className="mb-3 text-[11px] text-muted-foreground">
                  {mock.contactDetails.role}
                </p>
                <dl className="grid grid-cols-1 gap-2 text-[12px]">
                  <Field icon={Phone} label="Telefone" value={mock.contactDetails.phone} />
                  <Field icon={Mail} label="Email" value={mock.contactDetails.email} />
                  <Field
                    icon={MessageSquare}
                    label="Retorno preferido"
                    value={mock.contactDetails.preference}
                  />
                </dl>
              </SectionCard>

              <SectionCard title="Detalhes do chamado" icon={Info} className="lg:col-span-2">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <Field icon={Tag} label="Assunto" value={ticket.subject} />
                  <Field icon={FileText} label="Módulo" value={ticket.module} />
                  <Field icon={Tag} label="Categoria" value={mock.category} />
                  <Field
                    icon={CalendarClock}
                    label="Abertura"
                    value={formatDateTime(ticket.openedAt)}
                  />
                  <Field
                    icon={Clock3}
                    label="Última atualização"
                    value={formatDateTime(ticket.updatedAt)}
                  />
                  <Field icon={UserRound} label="Atendente inicial" value={ticket.attendant} />
                  <Field
                    icon={UserRound}
                    label="Responsável atual"
                    value={
                      ticket.lockedBy
                        ? `${ticket.owner} · Atendendo agora: ${ticket.lockedBy}`
                        : ticket.owner
                    }
                  />
                </div>
                <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Descrição do problema
                  </p>
                  <p className="text-[13px] leading-relaxed text-foreground">
                    {mock.description}
                  </p>
                </div>
              </SectionCard>



              <SectionCard title="Nota interna" icon={Send} className="lg:col-span-2">
                <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  Visível somente para o time de suporte
                </p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  placeholder="Escreva uma nota interna sobre este atendimento..."
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 cursor-pointer rounded-lg text-[12px]"
                  >
                    <Paperclip className="mr-1.5 h-3.5 w-3.5" />
                    Anexar arquivo
                  </Button>
                  <Button
                    size="sm"
                    disabled={!note.trim()}
                    onClick={handleSaveNote}
                    className="h-9 cursor-pointer rounded-lg text-[12px]"
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Salvar nota
                  </Button>
                </div>
              </SectionCard>
            </div>
            <div className="h-2" />
          </div>

          {/* Fixed footer */}
          <footer className="shrink-0 border-t border-border bg-card px-5 py-3 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleAssume}
                  className="h-9 cursor-pointer rounded-lg px-3 text-[12px]"
                >
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Assumir
                </Button>
                <Button
                  size="sm"
                  onClick={handleAttend}
                  className="h-9 cursor-pointer rounded-lg px-3 text-[12px]"
                >
                  <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
                  Atender
                </Button>

                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-9 cursor-pointer rounded-lg px-3 text-[12px]"
                    >
                      <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
                      Alterar status
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-56 p-1">
                    <p className="px-2 pb-1 pt-2 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Novo status
                    </p>
                    <div className="max-h-72 overflow-auto">
                      {ticketStatuses.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => handleStatus(s)}
                          className={cn(
                            "flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left text-[12.5px] transition hover:bg-accent",
                            ticket.status === s && "bg-accent font-semibold",
                          )}
                        >
                          <span>{s}</span>
                          {ticket.status === s && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                          )}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setCloseOpen(true)}
                  className="h-9 cursor-pointer rounded-lg px-3 text-[12px]"
                >
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Encerrar
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHistoryOpen(true)}
                  className="h-9 cursor-pointer rounded-lg px-3 text-[12px]"
                >
                  <History className="mr-1.5 h-3.5 w-3.5" />
                  Histórico
                </Button>
              </div>

              {isMine && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
                  <UserCheck className="h-3 w-3" />
                  Atendendo agora: {currentUser.operator}
                </span>
              )}
            </div>
          </footer>
        </DialogContent>
      </Dialog>

      <CloseTicketDialog
        open={closeOpen}
        onOpenChange={setCloseOpen}
        onConfirm={handleClose}
        ticket={ticket}
      />

      <TicketHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        ticket={ticket}
        historyItems={historyList}
      />
    </>
  );
}

function CloseTicketDialog({
  open,
  onOpenChange,
  onConfirm,
  ticket,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: (payload: ClosurePayload) => void;
  ticket: SupportTicket;
}) {
  const [solution, setSolution] = useState("");
  const [type, setType] = useState<ClosurePayload["type"]>("Resolvido");
  const [addToClientHistory, setAddToClientHistory] = useState(true);
  const [generateKbArticle, setGenerateKbArticle] = useState(false);

  const submit = () => {
    onConfirm({
      solution: solution.trim(),
      type,
      addToClientHistory,
      generateKbArticle,
    });
    setSolution("");
    setType("Resolvido");
    setAddToClientHistory(true);
    setGenerateKbArticle(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border border-border bg-background p-6">
        <DialogHeader>
          <DialogTitle className="text-[16px] font-bold text-foreground">
            Encerrar chamado
          </DialogTitle>
          <p className="text-[12px] text-muted-foreground">
            {ticket.protocol} · {ticket.clientName}
          </p>
        </DialogHeader>

        <div className="mt-2 space-y-4">
          <div>
            <Label className="mb-1.5 block text-[12px] font-semibold text-foreground">
              Solução aplicada
            </Label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={4}
              placeholder="Descreva a solução ou o motivo do encerramento..."
              className="w-full resize-none rounded-xl border border-border bg-background p-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div>
            <Label className="mb-1.5 block text-[12px] font-semibold text-foreground">
              Tipo de encerramento
            </Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as ClosurePayload["type"])}
              className="grid grid-cols-2 gap-2"
            >
              {(["Resolvido", "Duplicado", "Sem retorno do cliente", "Cancelado"] as const).map(
                (opt) => (
                  <label
                    key={opt}
                    className={cn(
                      "flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[12.5px] font-medium transition hover:border-primary/40",
                      type === opt && "border-primary bg-primary/5 text-primary",
                    )}
                  >
                    <RadioGroupItem value={opt} className="cursor-pointer" />
                    <span>{opt}</span>
                  </label>
                ),
              )}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-foreground">
              <Checkbox
                checked={addToClientHistory}
                onCheckedChange={(v) => setAddToClientHistory(v === true)}
                className="cursor-pointer"
              />
              Adicionar ao histórico do cliente
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-foreground">
              <Checkbox
                checked={generateKbArticle}
                onCheckedChange={(v) => setGenerateKbArticle(v === true)}
                className="cursor-pointer"
              />
              Gerar artigo para base de conhecimento
            </label>
          </div>
        </div>

        <DialogFooter className="mt-4 gap-2 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            disabled={!solution.trim()}
            onClick={submit}
            className="cursor-pointer rounded-lg"
          >
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            Encerrar chamado
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: typeof Info;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-[0_6px_18px_rgba(25,29,51,0.04)]",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-[13px] font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof Info;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-none last:pb-0">
      <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Icon className="h-3 w-3 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <div
        className={cn(
          "min-w-0 truncate text-right text-[12.5px] font-medium text-foreground",
          mono && "font-mono",
        )}
      >
        {value}
      </div>
    </div>
  );
}
