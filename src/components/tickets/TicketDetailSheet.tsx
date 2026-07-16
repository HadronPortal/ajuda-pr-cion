import { forwardRef, useMemo, useRef, useState, type ComponentType } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Boxes,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  Folder,
  Globe,
  History,
  Info,
  LayoutGrid,
  ListChecks,
  LockKeyhole,
  MapPin,
  MessageSquare,
  NotebookText,
  Paperclip,
  Phone,
  Plus,
  PlayCircle,
  ReceiptText,
  Send,
  ShieldCheck,
  Sparkles,
  Ticket as TicketIcon,
  UserCheck,
  UserPlus,
  UserRound,
  Users,
  Wallet,
  X,
  XCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import finishIconUrl from "@/assets/ticket-finish-solid.png";
import transferIconUrl from "@/assets/ticket-transfer-solid.png";
import startAttendanceIconUrl from "@/assets/ticket-start-solid.png";

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
import { TicketHistoryList } from "./TicketHistoryList";
import { PastAttendanceDetailModal } from "./PastAttendanceDetailModal";
import type { PastAttendance } from "@/lib/tickets-store";
import { TicketNotesModal } from "./TicketNotesModal";
import { TicketTimelineModal } from "./TicketTimelineModal";
import { TicketTimelineList } from "./TicketTimelineList";
import { TicketFloatingChat } from "./TicketFloatingChat";
import { ScheduleEventModal } from "./ScheduleEventModal";
import { ForwardSpecialistModal } from "./ForwardSpecialistModal";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { ModuleKnowledgeLink } from "@/lib/module-link";
import { kbArticlesFull } from "@/lib/kb-data";

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
  ["São Paulo", "SP"],
  ["Campinas", "SP"],
  ["Belo Horizonte", "MG"],
  ["Curitiba", "PR"],
  ["Porto Alegre", "RS"],
  ["Goiânia", "GO"],
  ["Recife", "PE"],
  ["Fortaleza", "CE"],
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
    city,
    uf,
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
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
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
  solution: Sparkles,
  closed: CheckCircle2,
  scheduled: CalendarClock,
  forwarded: UserCheck,
};

const timelineTone: Record<TicketEvent["kind"], string> = {
  created: "bg-primary/12 text-primary",
  attached: "bg-muted text-foreground",
  assumed: "bg-[#e7faf1] text-[#1f9860] dark:bg-[#14382b] dark:text-[#8ee8be]",
  attend: "bg-[#fff1d6] text-[#b66a00] dark:bg-[#4d3516] dark:text-[#ffd28a]",
  status: "bg-[#e8f3ff] text-[#246cb5] dark:bg-[#17314e] dark:text-[#9dcaff]",
  message: "bg-[#f2eaff] text-[#7253bd] dark:bg-[#2e2549] dark:text-[#c7b8ff]",
  note: "bg-muted text-foreground",
  solution: "bg-success/15 text-success",
  closed: "bg-success/15 text-success",
  scheduled: "bg-[#fff8dd] text-[#9c7610] dark:bg-[#403817] dark:text-[#f3d66d]",
  forwarded: "bg-[#e7faf1] text-[#1f9860] dark:bg-[#14382b] dark:text-[#8ee8be]",
};

type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

function createMaskedActionIcon(maskUrl: string): IconComponent {
  return function MaskedActionIcon({ className }) {
    return (
      <span
        aria-hidden="true"
        className={cn("block bg-current", className)}
        style={{
          WebkitMask: `url(${maskUrl}) center / contain no-repeat`,
          mask: `url(${maskUrl}) center / contain no-repeat`,
        }}
      />
    );
  };
}

const TicketCloseIcon = createMaskedActionIcon(finishIconUrl);
const TicketAssumeIcon = createMaskedActionIcon(transferIconUrl);
const TicketAttendIcon = createMaskedActionIcon(startAttendanceIconUrl);
const TicketScheduleIcon = CalendarClock;
const TicketForwardIcon = UserCheck;
const TicketTimelineIcon = History;

import { getModuleIcon } from "@/lib/ticket-icons";

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
  const [closeOpen, setCloseOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(true);
  const [selectedHistory, setSelectedHistory] = useState<PastAttendance | null>(null);
  const [activeAction, setActiveAction] = useState<
    "encerrar" | "assumir" | "agendar" | "encaminhar" | "atender" | "timeline"
  >("atender");

  const mock = useMemo(() => (ticket ? buildMock(ticket) : null), [ticket]);
  const sla = useMemo(() => (ticket ? computeSla(ticket) : null), [ticket]);

  if (!ticket || !mock || !sla) return null;

  const timelineEvents = events.filter((e) => e.kind !== "note");

  const isMine = ticket.owner === currentUser.operator || ticket.lockedBy === currentUser.operator;

  const handleAssume = () => {
    ticketsStore.assumeTicket(ticket.id);
    toast.success("Chamado assumido");
  };
  const handleAttend = () => {
    ticketsStore.attendTicket(ticket.id);
    toast.success("Atendimento iniciado");
  };
  // status change removed from side menu; substituted by "Agendar evento" and "Encaminhar a especialista"
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
      <Dialog open={open} onOpenChange={onOpenChange} modal={false}>
        <DialogContent
          onPointerDownOutside={(event) => {
            const target = event.target;
            if (target instanceof Element && target.closest("[data-ticket-floating-chat]")) {
              event.preventDefault();
            }
          }}
          onInteractOutside={(event) => {
            const target = event.target;
            if (target instanceof Element && target.closest("[data-ticket-floating-chat]")) {
              event.preventDefault();
            }
          }}
          className="grid max-h-none w-[92vw] max-w-[1500px] gap-4 border-0 bg-transparent p-0 shadow-none xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-6 [&>button]:hidden"
        >
          <DialogTitle className="sr-only">Detalhes do chamado {ticket.protocol}</DialogTitle>

          {/* Painel esquerdo — Chamado */}
          <div className="relative flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <DetailModalHeader
              icon={getModuleIcon(ticket.module, ticket.source, ticket.subject)}
              title={ticket.subject}
              protocol={ticket.protocol}
              onClose={() => onOpenChange(false)}
              chips={
                <>
                  <Badge
                    className={cn(
                      "shrink-0 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide",
                      statusTone[ticket.status],
                    )}
                  >
                    {ticket.status}
                  </Badge>
                  <Badge
                    className={cn(
                      "shrink-0 rounded-md border px-2 py-0.5 text-[10.5px] font-medium",
                      priorityTone[ticket.priority],
                    )}
                  >
                    Prioridade {ticket.priority}
                  </Badge>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-md border border-border bg-muted/50 px-2 py-0.5 text-[10.5px] font-medium text-muted-foreground">
                    <CalendarClock className="h-3 w-3" />
                    SLA {sla.pct}% · {sla.hours}h
                  </span>
                  {ticket.lockedBy && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-[10.5px] font-medium text-warning-foreground">
                      <LockKeyhole className="h-3 w-3" />
                      {ticket.lockedBy}
                    </span>
                  )}
                </>
              }
              meta={
                <span className="inline-flex items-center gap-1">
                  <span className="font-semibold text-primary">{ticket.clientCode}</span>
                  <span aria-hidden className="text-border">
                    ·
                  </span>
                  <span className="truncate text-foreground">{ticket.clientName}</span>
                </span>
              }
            />

            {/* Body: sidebar (menu + ações) | conteúdo | chat */}
            <div className="flex flex-1 min-h-0 flex-col bg-muted/30 md:flex-row md:gap-4 md:p-4">
              {/* Sidebar */}
              <aside
                className={cn(
                  "hidden shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[width] duration-200 md:flex",
                  navCollapsed ? "md:w-[64px]" : "md:w-[210px]",
                )}
              >
                <div className="flex items-center justify-end p-2">
                  <button
                    type="button"
                    onClick={() => setNavCollapsed((v) => !v)}
                    aria-label={navCollapsed ? "Expandir menu" : "Retrair menu"}
                    title={navCollapsed ? "Expandir menu" : "Retrair menu"}
                    className="grid h-7 w-7 cursor-pointer place-items-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
                  >
                    {navCollapsed ? (
                      <ChevronRight className="h-4 w-4" />
                    ) : (
                      <ChevronLeft className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="flex-1 space-y-1 overflow-y-auto p-2">
                  {!navCollapsed && (
                    <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                      Ações
                    </p>
                  )}
                  <SideItem
                    icon={TicketCloseIcon}
                    label="Finalizar"
                    collapsed={navCollapsed}
                    active={activeAction === "encerrar"}
                    onClick={() => {
                      setActiveAction("encerrar");
                      setCloseOpen(true);
                    }}
                  />
                  <SideItem
                    icon={TicketAssumeIcon}
                    label="Transferir chamado"
                    collapsed={navCollapsed}
                    active={activeAction === "assumir"}
                    onClick={() => {
                      setActiveAction("assumir");
                      handleAssume();
                    }}
                  />
                  <SideItem
                    icon={TicketScheduleIcon}
                    label="Agendar evento"
                    collapsed={navCollapsed}
                    active={activeAction === "agendar"}
                    onClick={() => {
                      setActiveAction("agendar");
                      setScheduleOpen(true);
                    }}
                  />
                  <SideItem
                    icon={TicketForwardIcon}
                    label="Enviar a especialista"
                    nowrap
                    collapsed={navCollapsed}
                    active={activeAction === "encaminhar"}
                    onClick={() => {
                      setActiveAction("encaminhar");
                      setForwardOpen(true);
                    }}
                  />
                  <SideItem
                    icon={TicketAttendIcon}
                    label="Iniciar atendimento"
                    collapsed={navCollapsed}
                    active={activeAction === "atender"}
                    onClick={() => {
                      setActiveAction("atender");
                      handleAttend();
                    }}
                  />
                </div>

                {isMine && (
                  <div className="p-2">
                    <span
                      className={cn(
                        "flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1.5 text-[10.5px] font-medium text-primary",
                        navCollapsed && "md:justify-center md:px-0",
                      )}
                      title={`Atendendo: ${currentUser.operator}`}
                    >
                      <UserCheck className="h-3.5 w-3.5 shrink-0" />
                      <span className={cn("truncate", navCollapsed && "md:hidden")}>
                        {currentUser.operator}
                      </span>
                    </span>
                  </div>
                )}
              </aside>

              {/* Mobile action bar (topo, rolável) */}
              <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border bg-card px-3 py-2 md:hidden">
                <MobileAction
                  icon={TicketCloseIcon}
                  label="Finalizar"
                  onClick={() => setCloseOpen(true)}
                />
                <MobileAction icon={TicketAssumeIcon} label="Transferir" onClick={handleAssume} />
                <MobileAction
                  icon={TicketScheduleIcon}
                  label="Agendar"
                  onClick={() => setScheduleOpen(true)}
                />
                <MobileAction
                  icon={TicketForwardIcon}
                  label="Enviar a especialista"
                  onClick={() => setForwardOpen(true)}
                />
                <MobileAction
                  icon={TicketAttendIcon}
                  label="Iniciar atendimento"
                  onClick={handleAttend}
                  highlight
                />
                <MobileAction
                  icon={TicketTimelineIcon}
                  label="Timeline"
                  onClick={() => setTimelineOpen(true)}
                />
              </div>

              {/* Main content */}
              <div className="flex-1 min-w-0 overflow-y-auto rounded-2xl border border-border bg-background px-5 py-5 md:px-6">
                {/* Resumo */}
                <Section title="Resumo do chamado" icon={LayoutGrid}>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <MiniStat label="Status">
                      <Badge
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium",
                          statusTone[ticket.status],
                        )}
                      >
                        {ticket.status}
                      </Badge>
                    </MiniStat>
                    <MiniStat label="Prioridade">
                      <Badge
                        className={cn(
                          "rounded-full border px-2.5 py-0.5 text-[11.5px] font-medium",
                          priorityTone[ticket.priority],
                        )}
                      >
                        {ticket.priority}
                      </Badge>
                    </MiniStat>
                    <MiniStat label="SLA">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-[22px] font-bold leading-none",
                            slaTextTone[sla.tone],
                          )}
                        >
                          {sla.pct}%
                        </span>
                        <div className="flex-1">
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                slaBarTone[sla.tone],
                              )}
                              style={{ width: `${sla.pct}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[10.5px] text-muted-foreground">
                            {sla.hours}h decorridas
                          </p>
                        </div>
                      </div>
                    </MiniStat>
                  </div>
                </Section>

                <Section title="Descrição do problema" icon={FileText}>
                  <p className="text-[13px] leading-relaxed text-foreground">{mock.description}</p>
                </Section>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <Section title="Cliente" icon={Building2} compact>
                    <p className="text-[13.5px] font-semibold text-foreground truncate">
                      {ticket.clientName}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                      <MapPin className="mr-1 inline h-3 w-3" />
                      {mock.city} - {mock.uf}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Código {ticket.clientCode}
                    </p>
                  </Section>

                  <Section title="Contato" icon={UserRound} compact>
                    <p className="text-[13.5px] font-semibold text-foreground truncate">
                      {ticket.contact}
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">{mock.contactRole}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11.5px] text-muted-foreground">
                      <Phone className="h-3 w-3" />
                      {mock.contactPhone}
                    </p>
                  </Section>

                  <Section title="Módulo" icon={Folder} compact>
                    <div className="flex items-center gap-1.5">
                      <ModuleKnowledgeLink
                        module={ticket.module}
                        className="truncate text-[13.5px] font-semibold text-foreground"
                      />
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
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                      Origem: {sourceLabels[ticket.source]}
                    </p>
                    {notes.length > 0 && (
                      <p className="mt-0.5 text-[11px] text-primary">
                        {notes.length} nota(s) interna(s)
                      </p>
                    )}
                  </Section>
                </div>

                {/* Datas e responsável — card próprio */}
                <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_6px_18px_rgba(25,29,51,0.04)] sm:grid-cols-3">
                  <CompactInfo
                    icon={CalendarClock}
                    label="Abertura"
                    value={formatDateTime(ticket.openedAt)}
                  />
                  <CompactInfo
                    icon={Clock3}
                    label="Última atualização"
                    value={formatDateTime(ticket.updatedAt)}
                  />
                  <CompactInfo
                    icon={UserRound}
                    label="Responsável atual"
                    value={ticket.lockedBy ? `${ticket.owner} · ${ticket.lockedBy}` : ticket.owner}
                  />
                </div>

                {/* Timeline do chamado atual — embutida */}
                <div className="mt-4">
                  <Section title="Timeline do chamado" icon={History}>
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-[12.5px] font-medium text-foreground">
                          Eventos do atendimento
                        </span>
                        <span className="text-[11.5px] font-medium text-muted-foreground">
                          ({timelineEvents.length})
                        </span>
                      </div>
                      {timelineEvents.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setTimelineOpen(true)}
                          className="inline-flex cursor-pointer items-center gap-1 text-[11.5px] font-medium text-primary hover:underline"
                        >
                          Ver completa
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="rounded-xl border border-border bg-card px-3 py-3">
                      <TicketTimelineList events={timelineEvents} variant="compact" limit={5} />
                    </div>
                  </Section>
                </div>

                <div className="h-2" />
              </div>
            </div>
            {/* fim body wrapper */}
          </div>
          {/* fim painel esquerdo */}

          {/* Painel direito — Histórico de atendimentos anteriores */}
          <TicketPastAttendancesSidePanel
            ticket={ticket}
            items={historyList}
            onSelect={setSelectedHistory}
            onSeeAll={() => setHistoryOpen(true)}
            className="hidden max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_30px_80px_rgba(0,0,0,0.35)] xl:flex"
          />

          <TicketFloatingChat ticket={ticket} />
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

      <TicketTimelineModal
        open={timelineOpen}
        onOpenChange={setTimelineOpen}
        ticket={ticket}
        events={timelineEvents}
      />

      <PastAttendanceDetailModal
        open={selectedHistory !== null}
        onOpenChange={(v) => !v && setSelectedHistory(null)}
        attendance={selectedHistory}
        ticket={ticket}
      />

      <ScheduleEventModal open={scheduleOpen} onOpenChange={setScheduleOpen} ticket={ticket} />

      <ForwardSpecialistModal open={forwardOpen} onOpenChange={setForwardOpen} ticket={ticket} />
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
  const [hadronOption, setHadronOption] = useState("");
  const [permission, setPermission] = useState<"" | ClosurePayload["permission"]>("");
  const [type, setType] = useState<ClosurePayload["type"]>("Não definido");
  const [articleQuery, setArticleQuery] = useState("");
  const [formQuery, setFormQuery] = useState("");
  const [relatedArticles, setRelatedArticles] = useState<string[]>([]);
  const [relatedForms, setRelatedForms] = useState<string[]>([]);
  const typeOptions: ClosurePayload["type"][] = [
    "Não definido",
    "Dúvida",
    "Configuração",
    "Atualização do Hádron",
    "Problema Hádron",
    "Problema Externo",
    "Treinamento",
    "Solicitação/Sugestão",
    "Outros",
  ];
  const formOptions = [
    "Checklist de validação fiscal",
    "Formulário de configuração",
    "Roteiro de treinamento",
    "Termo de aceite do cliente",
    "Relatório de diagnóstico",
  ];
  const articleSuggestions = kbArticlesFull
    .filter((article) =>
      `${article.title} ${article.module}`.toLowerCase().includes(articleQuery.toLowerCase()),
    )
    .filter((article) => !relatedArticles.includes(article.title))
    .slice(0, 5);
  const formSuggestions = formOptions
    .filter((form) => form.toLowerCase().includes(formQuery.toLowerCase()))
    .filter((form) => !relatedForms.includes(form));

  const reset = () => {
    setSolution("");
    setHadronOption("");
    setPermission("");
    setType("Não definido");
    setArticleQuery("");
    setFormQuery("");
    setRelatedArticles([]);
    setRelatedForms([]);
  };

  const solutionPlain = solution.replace(/<[^>]*>/g, "").trim();

  const handleSubmit = () => {
    if (!permission) {
      toast.error("Selecione uma permissão válida.");
      return;
    }
    if (!solutionPlain) {
      toast.error("Informe a mensagem de finalização.");
      return;
    }
    onConfirm({
      solution,
      type,
      hadronOption: hadronOption.trim(),
      permission,
      relatedArticles,
      relatedForms,
      addToClientHistory: true,
      generateKbArticle: false,
    });
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        className="flex w-[calc(100vw-2rem)] max-w-[940px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Finalizar chamado {ticket.protocol}</DialogTitle>

        <DetailModalHeader
          icon={CheckCircle2}
          title="Finalizar chamado"
          protocol={ticket.protocol}
          onClose={() => onOpenChange(false)}
          accentClassName="bg-success"
          iconWrapClassName="bg-success text-success-foreground"
          chips={
            <Badge
              className={cn(
                "shrink-0 rounded-md border px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-wide",
                statusTone[ticket.status],
              )}
            >
              {ticket.status}
            </Badge>
          }
          meta={
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold text-primary">{ticket.clientCode}</span>
              <span aria-hidden className="text-border">·</span>
              <span className="truncate text-foreground">{ticket.clientName}</span>
            </span>
          }
        />

        {/* Body */}
        <div className="min-h-0 grid gap-4 overflow-y-auto px-4 py-5 sm:grid-cols-2 md:px-6">
          <Field label="Opção Hádron">
            <Input
              value={hadronOption}
              onChange={(event) => setHadronOption(event.target.value)}
              placeholder="Informe a opção ou rotina utilizada"
              className="h-10 rounded-lg bg-card"
            />
          </Field>
          <Field label="Permissão">
            <select
              value={permission}
              onChange={(event) =>
                setPermission(event.target.value as "" | ClosurePayload["permission"])
              }
              className={cn(
                "h-10 w-full cursor-pointer rounded-lg border border-input bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
                permission ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <option value="" disabled>
                Permissão
              </option>
              {(["Público", "Clientes", "Empresa"] as const).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <div className="sm:col-span-2">
            <Label className="mb-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-foreground">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Mensagem de finalização
            </Label>
            <RichTextEditor
              value={solution}
              onChange={setSolution}
              placeholder="Descreva a solução aplicada e as orientações finais ao cliente..."
              minHeight={160}
            />
          </div>

          <Field label="Tipo">
            <select
              value={type}
              onChange={(event) => setType(event.target.value as ClosurePayload["type"])}
              className="h-10 w-full cursor-pointer rounded-lg border border-input bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
            >
              {typeOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </Field>
          <div />

          <RelatedPicker
            label="Artigos relacionados"
            query={articleQuery}
            setQuery={setArticleQuery}
            selected={relatedArticles}
            suggestions={articleSuggestions.map((article) => article.title)}
            onAdd={(item) => {
              setRelatedArticles((current) => [...current, item]);
              setArticleQuery("");
            }}
            onRemove={(item) =>
              setRelatedArticles((current) => current.filter((value) => value !== item))
            }
          />
          <RelatedPicker
            label="Opções/Formulários relacionados"
            query={formQuery}
            setQuery={setFormQuery}
            selected={relatedForms}
            suggestions={formSuggestions}
            onAdd={(item) => {
              setRelatedForms((current) => [...current, item]);
              setFormQuery("");
            }}
            onRemove={(item) =>
              setRelatedForms((current) => current.filter((value) => value !== item))
            }
          />
        </div>

        {/* Footer */}
        <DialogFooter className="gap-2 border-t border-border bg-muted/30 px-6 py-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => {
              reset();
              onOpenChange(false);
            }}
            className="cursor-pointer rounded-lg"
          >
            Fechar
          </Button>
          <Button onClick={handleSubmit} className="cursor-pointer rounded-lg">
            <CheckCircle2 className="mr-1.5 h-4 w-4" />
            Salvar e finalizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-[12.5px] font-medium text-foreground">{label}</Label>
      {children}
    </div>
  );
}

function RelatedPicker({
  label,
  query,
  setQuery,
  selected,
  suggestions,
  onAdd,
  onRemove,
}: {
  label: string;
  query: string;
  setQuery: (value: string) => void;
  selected: string[];
  suggestions: string[];
  onAdd: (value: string) => void;
  onRemove: (value: string) => void;
}) {
  return (
    <Field label={label}>
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && query.trim()) {
                event.preventDefault();
                onAdd(suggestions[0] ?? query.trim());
              }
            }}
            placeholder="Buscar e adicionar..."
            className="h-10 rounded-lg bg-card"
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={!query.trim()}
            onClick={() => onAdd(suggestions[0] ?? query.trim())}
            className="h-10 w-10 shrink-0 cursor-pointer rounded-lg"
            aria-label={`Adicionar em ${label}`}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {query.trim() && suggestions.length > 0 && (
          <div className="absolute z-20 mt-1 max-h-36 w-[calc(100%-48px)] overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg">
            {suggestions.map((item) => (
              <button
                type="button"
                key={item}
                onClick={() => onAdd(item)}
                className="block w-full cursor-pointer rounded-md px-2.5 py-2 text-left text-xs text-popover-foreground hover:bg-accent"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
      {selected.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {selected.map((item) => (
            <button
              type="button"
              key={item}
              onClick={() => onRemove(item)}
              title="Remover"
              className="max-w-full cursor-pointer truncate rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[11px] text-primary hover:bg-primary/15"
            >
              {item} ×
            </button>
          ))}
        </div>
      )}
    </Field>
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
      <p className="mb-1.5 text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
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
      <p className="mb-1 inline-flex items-center gap-1 text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="truncate text-[12.5px] font-medium text-foreground">{value}</p>
    </div>
  );
}

function sideItemClasses(highlight: boolean) {
  return cn(
    "group flex w-full cursor-pointer items-center gap-2 whitespace-nowrap rounded-lg px-2.5 py-2 text-left text-[12.5px] font-medium transition",
    highlight
      ? "bg-primary text-primary-foreground hover:bg-primary/90"
      : "text-foreground hover:bg-accent",
  );
}

function SideItem({
  icon: Icon,
  label,
  collapsed,
  onClick,
  active,
  className,
  nowrap,
}: {
  icon: IconComponent;
  label: string;
  collapsed: boolean;
  onClick: () => void;
  active?: boolean;
  className?: string;
  nowrap?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={label}
      aria-pressed={!!active}
      className={cn(sideItemClasses(!!active), collapsed && "md:justify-center md:px-0", className)}
    >
      <Icon
        className={cn(
          "h-5 w-5 shrink-0 transition-colors group-hover:text-primary",
          active ? "text-primary-foreground" : "text-slate-500 dark:text-slate-300",
        )}
        strokeWidth={2.35}
      />
      <span
        className={cn(collapsed && "md:hidden", nowrap ? "min-w-0 whitespace-nowrap" : "truncate")}
        style={nowrap ? { overflow: "visible", textOverflow: "clip" } : undefined}
      >
        {label}
      </span>
    </button>
  );
}

function MobileAction({
  icon: Icon,
  label,
  onClick,
  highlight,
}: {
  icon: IconComponent;
  label: string;
  onClick: () => void;
  highlight?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition",
        highlight
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      <Icon
        className={cn(
          "h-3.5 w-3.5",
          highlight ? "text-primary-foreground" : "text-slate-500 dark:text-slate-300",
        )}
        strokeWidth={2.35}
      />
      <span>{label}</span>
    </button>
  );
}

function TicketTimelineInline({ events }: { events: TicketEvent[] }) {
  if (events.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-3 py-6 text-center text-[12px] text-muted-foreground">
        Nenhum evento registrado ainda.
      </div>
    );
  }
  return (
    <ol className="relative space-y-3 rounded-xl border border-border bg-card px-3 py-3">
      {events.map((ev, i) => {
        const Icon = timelineIcon[ev.kind];
        const isLast = i === events.length - 1;
        return (
          <li key={ev.id} className="relative flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                  timelineTone[ev.kind],
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              {!isLast && <span className="mt-1 w-px flex-1 bg-border" aria-hidden />}
            </div>
            <div className="min-w-0 flex-1 pb-2">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                <span className="text-[12.5px] font-medium text-foreground">{ev.actor}</span>
                <span className="text-[11px] text-muted-foreground">{formatDateTime(ev.when)}</span>
              </div>
              <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted-foreground">
                {ev.description}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function TicketPastAttendancesSidePanel({
  ticket,
  items,
  onSelect,
  onSeeAll,
  className,
}: {
  ticket: SupportTicket;
  items: PastAttendance[];
  onSelect: (item: PastAttendance) => void;
  onSeeAll: () => void;
  className?: string;
}) {
  return (
    <aside className={cn("flex min-h-0 flex-col bg-card", className)}>
      <header className="flex shrink-0 items-start justify-between gap-2 border-b border-border px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-[13px] font-medium text-foreground">Histórico</h3>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="min-w-0 truncate text-[11px] text-muted-foreground">
              Cliente {ticket.clientCode}
            </p>
            <Badge
              className={cn(
                "shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-medium",
                statusTone[ticket.status],
              )}
            >
              {ticket.status}
            </Badge>
          </div>
        </div>
        <span
          aria-hidden
          className="grid h-7 w-7 shrink-0 place-items-center text-muted-foreground"
        >
          <History className="h-3.5 w-3.5" />
        </span>
      </header>

      <div className="flex shrink-0 items-baseline justify-between gap-2 border-b border-border px-4 py-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[12px] font-medium text-foreground">Atendimentos</span>
          <span className="text-[11px] font-medium text-muted-foreground">({items.length})</span>
        </div>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onSeeAll}
            className="inline-flex cursor-pointer items-center gap-0.5 text-[11px] font-medium text-primary hover:underline"
          >
            Ver todos
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto bg-muted/20 px-3 py-3">
        {items.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-muted-foreground">
            Sem atendimentos anteriores.
          </p>
        ) : (
          <TicketHistoryList items={items.slice(0, 4)} onSelect={onSelect} timeline />
        )}
      </div>
    </aside>
  );
}
