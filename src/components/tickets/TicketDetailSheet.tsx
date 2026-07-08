import { forwardRef, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  Folder,
  Gauge,
  History,
  Info,
  LayoutGrid,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  NotebookText,
  Paperclip,
  Phone,
  PlayCircle,
  Send,
  ShieldCheck,
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
  useTicketEvents,
  useTicketHistory,
  useTicketNotes,
  type ClosurePayload,
  type TicketEvent,
} from "@/lib/tickets-store";
import { currentUser } from "@/lib/mock-data";
import { TicketHistoryModal } from "./TicketHistoryModal";
import { TicketNotesModal } from "./TicketNotesModal";

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

const cities = [
  ["São Paulo", "SP"], ["Campinas", "SP"], ["Belo Horizonte", "MG"],
  ["Curitiba", "PR"], ["Porto Alegre", "RS"], ["Goiânia", "GO"],
  ["Recife", "PE"], ["Fortaleza", "CE"],
];
const contactRoles = ["Financeiro", "TI / Sistemas", "Compras", "Comercial", "Fiscal", "Diretoria"];

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
  return {
    description:
      "Cliente relata dificuldade recorrente ao executar a operação descrita no assunto. Solicita análise do time de suporte e retorno com orientação técnica ou correção do comportamento identificado.",
    city, uf,
    clientPhone: `(${11 + (h % 88)}) 9${phoneA}-${phoneB}`,
    contactPhone: `(${11 + ((h >> 1) % 88)}) 9${phoneB}-${phoneA}`,
    contactRole: contactRoles[h % contactRoles.length],
    files: [
      { name: "print-erro.png", size: "182 KB" },
      { name: "log-operacao.txt", size: "24 KB" },
    ],
  };
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
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

const slaTextTone: Record<"ok" | "warn" | "late", string> = {
  ok: "text-success",
  warn: "text-warning-foreground",
  late: "text-destructive",
};

const timelineIcon: Record<TicketEvent["kind"], typeof Info> = {
  created: MessageSquare,
  attached: Paperclip,
  assumed: UserPlus,
  attend: PlayCircle,
  status: ShieldCheck,
  message: Send,
  note: FileText,
  closed: CheckCircle2,
};

const timelineTone: Record<TicketEvent["kind"], string> = {
  created: "bg-primary/12 text-primary",
  attached: "bg-muted text-foreground",
  assumed: "bg-[#e7faf1] text-[#1f9860] dark:bg-[#14382b] dark:text-[#8ee8be]",
  attend: "bg-[#fff1d6] text-[#b66a00] dark:bg-[#4d3516] dark:text-[#ffd28a]",
  status: "bg-[#e8f3ff] text-[#246cb5] dark:bg-[#17314e] dark:text-[#9dcaff]",
  message: "bg-[#f2eaff] text-[#7253bd] dark:bg-[#2e2549] dark:text-[#c7b8ff]",
  note: "bg-muted text-foreground",
  closed: "bg-success/15 text-success",
};

type NavKey = "resumo" | "cliente" | "contato" | "detalhes" | "timeline" | "arquivos" | "historico";

const navItems: { key: NavKey; label: string; icon: typeof Info }[] = [
  { key: "resumo", label: "Resumo", icon: LayoutGrid },
  { key: "cliente", label: "Cliente", icon: Building2 },
  { key: "contato", label: "Contato", icon: UserRound },
  { key: "detalhes", label: "Detalhes", icon: Info },
  { key: "timeline", label: "Timeline", icon: History },
  { key: "arquivos", label: "Arquivos", icon: Paperclip },
  { key: "historico", label: "Histórico", icon: Folder },
];

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
  const events = useTicketEvents(ticketId);
  const notes = useTicketNotes(ticketId);

  const [note, setNote] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [closeOpen, setCloseOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const [activeNav, setActiveNav] = useState<NavKey>("resumo");

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<NavKey, HTMLElement | null>>({
    resumo: null, cliente: null, contato: null, detalhes: null,
    timeline: null, arquivos: null, historico: null,
  });

  const mock = useMemo(() => (ticket ? buildMock(ticket) : null), [ticket]);
  const sla = useMemo(() => (ticket ? computeSla(ticket) : null), [ticket]);

  if (!ticket || !mock || !sla) return null;

  const timelineEvents = events.filter((e) => e.kind !== "note");
  const timelineSorted = [...timelineEvents].sort(
    (a, b) => new Date(b.when).getTime() - new Date(a.when).getTime(),
  );
  const timelineShown = showAllTimeline ? timelineSorted : timelineSorted.slice(0, 5);

  const isMine =
    ticket.owner === currentUser.operator || ticket.lockedBy === currentUser.operator;

  const scrollTo = (key: NavKey) => {
    setActiveNav(key);
    const el = sectionRefs.current[key];
    const container = scrollRef.current;
    if (el && container) {
      container.scrollTo({ top: el.offsetTop - 12, behavior: "smooth" });
    }
  };

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
    ticketsStore.addInternalNote(ticket.id, text);
    setNote("");
    toast.success("Nota interna salva");
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
          className="flex max-h-[92vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:w-[calc(100vw-2rem)] md:max-h-[88vh] md:w-[960px] lg:w-[1080px] xl:w-[1140px]"
        >
          <DialogTitle className="sr-only">
            Detalhes do chamado {ticket.protocol}
          </DialogTitle>

          {/* Header */}
          <header className="shrink-0 border-b border-border bg-card px-5 py-4 md:px-6">
            <div className="min-w-0 pr-8">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-semibold text-muted-foreground">
                  {ticket.protocol}
                </span>
                <span className="text-[12px] text-muted-foreground">·</span>
                <span className="text-[12px] text-muted-foreground">
                  {sourceLabels[ticket.source]}
                </span>
              </div>
              <h2 className="mt-1 truncate text-[18px] font-bold leading-snug text-foreground">
                {ticket.subject}
              </h2>
              <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                <span className="font-semibold text-foreground">{ticket.clientCode}</span>
                {" · "}
                {ticket.clientName}
              </p>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", statusTone[ticket.status])}>
                {ticket.status}
              </Badge>
              <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-semibold", priorityTone[ticket.priority])}>
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
          </header>

          {/* Body with side nav + content */}
          <div className="flex flex-1 min-h-0 flex-col md:flex-row">
            {/* Side nav */}
            <nav className="shrink-0 border-b border-border bg-card px-2 py-2 md:w-[190px] md:border-b-0 md:border-r md:px-2.5 md:py-4">
              <ul className="flex gap-1 overflow-x-auto md:flex-col md:gap-0.5 md:overflow-visible">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNav === item.key;
                  return (
                    <li key={item.key} className="shrink-0 md:shrink">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.key === "historico") {
                            setHistoryOpen(true);
                            return;
                          }
                          scrollTo(item.key);
                        }}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-left text-[12.5px] font-medium transition",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Content */}
            <div ref={scrollRef} className="flex-1 min-w-0 overflow-y-auto bg-muted/30 px-5 py-5 md:px-6">
              {/* Resumo */}
              <Section
                ref={(el) => { sectionRefs.current.resumo = el; }}
                title="Resumo do chamado"
                icon={LayoutGrid}
              >
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <MiniStat label="Status">
                    <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold", statusTone[ticket.status])}>
                      {ticket.status}
                    </Badge>
                  </MiniStat>
                  <MiniStat label="Prioridade">
                    <Badge className={cn("rounded-full border px-2.5 py-0.5 text-[11.5px] font-semibold", priorityTone[ticket.priority])}>
                      {ticket.priority}
                    </Badge>
                  </MiniStat>
                  <MiniStat label="SLA">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[22px] font-bold leading-none", slaTextTone[sla.tone])}>
                        {sla.pct}%
                      </span>
                      <div className="flex-1">
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div className={cn("h-full rounded-full transition-all", slaBarTone[sla.tone])} style={{ width: `${sla.pct}%` }} />
                        </div>
                        <p className="mt-1 text-[10.5px] text-muted-foreground">{sla.hours}h decorridas</p>
                      </div>
                    </div>
                  </MiniStat>
                </div>
              </Section>

              <Section
                ref={(el) => { sectionRefs.current.detalhes = el; }}
                title="Descrição do problema"
                icon={FileText}
              >
                <p className="text-[13px] leading-relaxed text-foreground">{mock.description}</p>
              </Section>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Section
                  ref={(el) => { sectionRefs.current.cliente = el; }}
                  title="Cliente"
                  icon={Building2}
                  compact
                >
                  <p className="text-[13.5px] font-bold text-foreground truncate">{ticket.clientName}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    <MapPin className="mr-1 inline h-3 w-3" />
                    {mock.city} - {mock.uf}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Código {ticket.clientCode}</p>
                </Section>

                <Section
                  ref={(el) => { sectionRefs.current.contato = el; }}
                  title="Contato"
                  icon={UserRound}
                  compact
                >
                  <p className="text-[13.5px] font-bold text-foreground truncate">{ticket.contact}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">{mock.contactRole}</p>
                  <p className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {mock.contactPhone}
                  </p>
                </Section>

                <Section title="Módulo" icon={Folder} compact>
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[13.5px] font-bold text-foreground">{ticket.module}</p>
                    {notes.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setNotesOpen(true)}
                        title={`Ver ${notes.length} nota(s) interna(s)`}
                        aria-label="Ver notas internas"
                        className="grid h-5 w-5 shrink-0 cursor-pointer place-items-center rounded-md bg-primary/10 text-primary transition hover:bg-primary/20"
                      >
                        <NotebookText className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">Origem: {sourceLabels[ticket.source]}</p>
                  {notes.length > 0 && (
                    <p className="mt-0.5 text-[11px] text-primary">{notes.length} nota(s) interna(s)</p>
                  )}
                </Section>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-3 sm:grid-cols-3">
                <CompactInfo icon={CalendarClock} label="Abertura" value={formatDateTime(ticket.openedAt)} />
                <CompactInfo icon={Clock3} label="Última atualização" value={formatDateTime(ticket.updatedAt)} />
                <CompactInfo
                  icon={UserRound}
                  label="Responsável atual"
                  value={ticket.lockedBy ? `${ticket.owner} · ${ticket.lockedBy}` : ticket.owner}
                />
              </div>

              {/* Timeline */}
              <Section
                ref={(el) => { sectionRefs.current.timeline = el; }}
                title="Timeline"
                icon={History}
              >
                {timelineShown.length === 0 ? (
                  <p className="py-4 text-center text-[12px] text-muted-foreground">
                    Nenhum evento registrado ainda.
                  </p>
                ) : (
                  <>
                    <ol className="relative space-y-4 border-l border-border pl-5">
                      {timelineShown.map((event) => {
                        const Icon = timelineIcon[event.kind];
                        return (
                          <li key={event.id} className="relative">
                            <span className={cn("absolute -left-[30px] top-0 grid h-6 w-6 place-items-center rounded-full ring-4 ring-card", timelineTone[event.kind])}>
                              <Icon className="h-3 w-3" />
                            </span>
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <p className="text-[13px] font-semibold text-foreground">
                                {event.actor}{" "}
                                <span className="text-[11px] font-normal text-muted-foreground">
                                  · {event.actorType}
                                </span>
                              </p>
                              <span className="text-[11px] text-muted-foreground">
                                {formatDateTime(event.when)}
                              </span>
                            </div>
                            <p className="mt-0.5 text-[12.5px] text-muted-foreground">{event.description}</p>
                          </li>
                        );
                      })}
                    </ol>
                    {timelineSorted.length > 5 && (
                      <div className="mt-3 flex justify-center">
                        <button
                          type="button"
                          onClick={() => setShowAllTimeline((v) => !v)}
                          className="cursor-pointer text-[12px] font-semibold text-primary hover:underline"
                        >
                          {showAllTimeline ? "Ver menos" : `Ver mais (${timelineSorted.length - 5})`}
                        </button>
                      </div>
                    )}
                  </>
                )}
              </Section>

              {/* Arquivos */}
              <Section
                ref={(el) => { sectionRefs.current.arquivos = el; }}
                title="Arquivos"
                icon={Paperclip}
              >
                {mock.files.length === 0 ? (
                  <p className="py-4 text-center text-[12px] text-muted-foreground">
                    Nenhum arquivo anexado.
                  </p>
                ) : (
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {mock.files.map((f) => (
                      <li
                        key={f.name}
                        className="flex items-center gap-2 rounded-lg border border-border bg-background/60 px-3 py-2"
                      >
                        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
                          <FileText className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[12.5px] font-semibold text-foreground">{f.name}</p>
                          <p className="text-[10.5px] text-muted-foreground">{f.size}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Section>

              {/* Histórico shortcut */}
              <Section
                ref={(el) => { sectionRefs.current.historico = el; }}
                title="Histórico do cliente"
                icon={Folder}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[12.5px] text-muted-foreground">
                    {historyList.length} atendimento(s) anteriores relacionados a este cliente.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setHistoryOpen(true)}
                    className="h-8 cursor-pointer rounded-lg text-[12px]"
                  >
                    <History className="mr-1.5 h-3.5 w-3.5" />
                    Abrir histórico
                  </Button>
                </div>
              </Section>

              {/* Nota interna */}
              <Section title="Nota interna" icon={NotebookText}>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="inline-flex items-center gap-1.5 rounded-full bg-muted/60 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                    <AlertCircle className="h-3 w-3" />
                    Visível somente para o time de suporte
                  </p>
                  {notes.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setNotesOpen(true)}
                      className="inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                    >
                      <NotebookText className="h-3 w-3" />
                      Ver {notes.length} nota(s)
                    </button>
                  )}
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  placeholder="Escreva uma nota interna sobre este atendimento..."
                  className="w-full resize-none rounded-xl border border-border bg-background p-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="mt-3 flex justify-end">
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
              </Section>

              <div className="h-2" />
            </div>
          </div>

          {/* Footer */}
          <footer className="shrink-0 border-t border-border bg-card px-5 py-3 md:px-6">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" onClick={handleAssume} className="h-9 cursor-pointer rounded-lg px-3 text-[12px]">
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                  Assumir
                </Button>
                <Button size="sm" onClick={handleAttend} className="h-9 cursor-pointer rounded-lg px-3 text-[12px]">
                  <PlayCircle className="mr-1.5 h-3.5 w-3.5" />
                  Atender
                </Button>

                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <Button size="sm" variant="outline" className="h-9 cursor-pointer rounded-lg px-3 text-[12px]">
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
                          {ticket.status === s && <CheckCircle2 className="h-3.5 w-3.5 text-primary" />}
                        </button>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <Button size="sm" variant="outline" onClick={() => setCloseOpen(true)} className="h-9 cursor-pointer rounded-lg px-3 text-[12px]">
                  <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                  Encerrar
                </Button>

                <Button size="sm" variant="outline" onClick={() => setHistoryOpen(true)} className="h-9 cursor-pointer rounded-lg px-3 text-[12px]">
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

      <TicketNotesModal
        open={notesOpen}
        onOpenChange={setNotesOpen}
        notes={notes}
        protocol={ticket.protocol}
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

const Section = forwardRef<
  HTMLElement,
  {
    title: string;
    icon: typeof Info;
    children: React.ReactNode;
    compact?: boolean;
  }
>(function Section({ title, icon: Icon, children, compact }, ref) {
  return (
    <section
      ref={ref}
      className={cn(
        "mb-3 rounded-2xl border border-border bg-card shadow-[0_6px_18px_rgba(25,29,51,0.04)]",
        compact ? "p-3" : "p-4",
      )}
    >
      <div className={cn("mb-2 flex items-center gap-2", compact && "mb-1.5")}>
        <span className="grid h-6 w-6 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className={cn("font-bold text-foreground", compact ? "text-[12px]" : "text-[13px]")}>
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
});


function MiniStat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-background/60 p-3">
      <p className="mb-1.5 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div>{children}</div>
    </div>
  );
}

function CompactInfo({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Info;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="truncate text-[12.5px] font-semibold text-foreground">{value}</p>
    </div>
  );
}
