import { forwardRef, useMemo, useRef, useState, type ComponentType } from "react";
import { toast } from "sonner";
import {
  AlertCircle,
  Boxes,
  Building2,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
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
  Mail,
  MessageSquare,
  MoreHorizontal,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import finishIconUrl from "@/assets/ticket-finalize-v4.png";
import transferIconUrl from "@/assets/ticket-transfer-solid.png";
import startAttendanceIconUrl from "@/assets/ticket-start-solid.png";
import scheduleIconUrl from "@/assets/ticket-schedule-solid.png";
import specialistIconUrl from "@/assets/ticket-send-specialist-solid.png";

import { cn } from "@/lib/utils";
import {
  ticketStatuses,
  type SupportTicket,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-tickets-data";
import {
  getTransferBlockReason,
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
import { useTicketSummary } from "@/lib/ticket-summary";
import { TicketTimelineModal } from "./TicketTimelineModal";
import { TicketTimelineList } from "./TicketTimelineList";
import { TicketFloatingChat } from "./TicketFloatingChat";
import { ScheduleEventModal } from "./ScheduleEventModal";
import { ForwardSpecialistModal } from "./ForwardSpecialistModal";
import { TransferTicketModal } from "./TransferTicketModal";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { ModuleKnowledgeLink } from "@/lib/module-link";
import { kbArticlesFull } from "@/lib/kb-data";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Link } from "@tanstack/react-router";
import { clientRows } from "@/routes/clientes.index";
import { useClients } from "@/lib/clients-store";
import { snapshotCurrentChamadosForTicket } from "@/lib/return-to-ticket";

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

const statusTextTone: Record<TicketStatus, string> = {
  Atrasado: "text-destructive",
  "Em Aberto": "text-primary",
  Ocupado: "text-[#b66a00] dark:text-[#ffd28a]",
  "Em andamento": "text-[#246cb5] dark:text-[#9dcaff]",
  "Aguardando cliente": "text-[#7253bd] dark:text-[#c7b8ff]",
  "Com especialista": "text-[#1f9860] dark:text-[#8ee8be]",
  Agendamento: "text-[#9c7610] dark:text-[#f3d66d]",
  Finalizado: "text-success",
  Cancelado: "text-muted-foreground",
};

const priorityTextTone: Record<TicketPriority, string> = {
  Alta: "text-destructive",
  Media: "text-warning-foreground",
  Baixa: "text-muted-foreground",
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

function createMaskedActionIcon(maskUrl: string, size: string = "contain"): IconComponent {
  return function MaskedActionIcon({ className }) {
    return (
      <span
        aria-hidden="true"
        className={cn("block bg-current", className)}
        style={{
          WebkitMask: `url(${maskUrl}) center / ${size} no-repeat`,
          mask: `url(${maskUrl}) center / ${size} no-repeat`,
        }}
      />
    );
  };
}

const TicketCloseIcon = createMaskedActionIcon(finishIconUrl);
const TicketAssumeIcon = createMaskedActionIcon(transferIconUrl);
const TicketAttendIcon = createMaskedActionIcon(startAttendanceIconUrl);
const TicketScheduleIcon = createMaskedActionIcon(scheduleIconUrl);
const TicketForwardIcon = createMaskedActionIcon(specialistIconUrl);
const TicketTimelineIcon = History;

import { getModuleIcon } from "@/lib/ticket-icons";
import { computeSla } from "@/lib/ticket-sla";

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
  const [transferOpen, setTransferOpen] = useState(false);
  const transferBlockReason = getTransferBlockReason(ticket);
  const canTransfer = !transferBlockReason;
  const openTransfer = () => {
    const reason = getTransferBlockReason(ticket);
    if (reason) {
      toast.error(reason);
      return;
    }
    setTransferOpen(true);
  };
  const [historyOpen, setHistoryOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [descriptionOpen, setDescriptionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("resumo");
  const [selectedHistory, setSelectedHistory] = useState<PastAttendance | null>(null);
  const [activeAction, setActiveAction] = useState<
    "encerrar" | "assumir" | "agendar" | "encaminhar" | "atender" | "timeline"
  >("atender");

  const mock = useMemo(() => (ticket ? buildMock(ticket) : null), [ticket]);
  const sla = useMemo(() => (ticket ? computeSla(ticket) : null), [ticket]);
  // Descrição real informada na abertura do chamado (sem texto padrão).
  const ticketDescription = useMemo(() => {
    const raw = ticket?.description;
    return typeof raw === "string" ? raw.replace(/\r\n/g, "\n").trim() : "";
  }, [ticket?.id, ticket?.description]);
  const summaryState = useTicketSummary(
    ticket?.id,
    ticketDescription,
    ticket?.descriptionSummary ?? null,
  );
  const { clients: loadedClients } = useClients({ onlyActive: false });
  // Resolve o cliente pela sigla real do chamado (ou da empresa/subempresa),
  // nunca apenas por UUID/companyId — chamados importados podem não tê-los.
  const clientSlug = useMemo(() => {
    const candidates = [ticket?.clientCode, ticket?.clientName]
      .map((v) => (typeof v === "string" ? v.trim().toLowerCase() : ""))
      .filter(Boolean);
    if (!candidates.length) return null;
    const pool: Array<{ id: string; acronym: string }> = [
      ...loadedClients,
      ...clientRows,
    ];
    for (const code of candidates) {
      const found = pool.find(
        (c) => c.id?.toLowerCase() === code || c.acronym?.toLowerCase() === code,
      );
      if (found) return found.id;
    }
    return null;
  }, [ticket?.clientCode, ticket?.clientName, loadedClients]);




  if (!ticket || !mock || !sla) return null;

  const timelineEvents = events.filter((e) => e.kind !== "note");

  const isMine = ticket.owner === currentUser.operator || ticket.lockedBy === currentUser.operator;

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

  const contactEmail = "";
  const hadronOptionValue = "";
  const moduleParts = ticket.module
    .split(/\s+[-–]\s+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const moduleMain = moduleParts[0] || ticket.module || "Não informado";
  const moduleSub = moduleParts.slice(1).join(" - ");
  const attachmentEvents = events.filter((e) => e.kind === "attached");
  const ModuleIcon = getModuleIcon(ticket.module, ticket.source, ticket.subject);

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copiado`);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  const actionItems: {
    key: typeof activeAction;
    icon: IconComponent;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    title?: string;
  }[] = [
    {
      key: "atender",
      icon: TicketAttendIcon,
      label: "Iniciar atendimento",
      onClick: () => {
        setActiveAction("atender");
        handleAttend();
      },
    },
    {
      key: "encerrar",
      icon: TicketCloseIcon,
      label: "Finalizar",
      onClick: () => {
        setActiveAction("encerrar");
        setCloseOpen(true);
      },
    },
    {
      key: "assumir",
      icon: TicketAssumeIcon,
      label: "Transferir chamado",
      disabled: !canTransfer,
      title: transferBlockReason ?? undefined,
      onClick: () => {
        setActiveAction("assumir");
        openTransfer();
      },
    },
    {
      key: "agendar",
      icon: TicketScheduleIcon,
      label: "Agendar evento",
      onClick: () => {
        setActiveAction("agendar");
        setScheduleOpen(true);
      },
    },
    {
      key: "encaminhar",
      icon: TicketForwardIcon,
      label: "Enviar a especialista",
      onClick: () => {
        setActiveAction("encaminhar");
        setForwardOpen(true);
      },
    },
  ];

  const clientLinkProps = clientSlug
    ? ({
        to: "/clientes/$clienteId",
        params: { clienteId: clientSlug },
        search: { tab: "cliente", from: "chamado", ticketId: ticket.id },
        onClick: () => snapshotCurrentChamadosForTicket(ticket.id),
      } as const)
    : null;

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
          className="flex h-[92vh] max-h-[92vh] w-[94vw] max-w-[1400px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
        >
          <DialogTitle className="sr-only">Detalhes do chamado {ticket.protocol}</DialogTitle>

          {/* 1. Cabeçalho */}
          <header className="shrink-0 border-b border-border bg-card px-4 py-3 md:px-5">
            <div className="flex items-start gap-3">
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm"
              >
                <ModuleIcon className="h-5 w-5" strokeWidth={2.4} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {ticket.protocol}
                  </span>
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
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium",
                      sla.tone === "late"
                        ? "border-destructive/30 bg-destructive/10 text-destructive"
                        : sla.tone === "warn"
                          ? "border-warning/40 bg-warning/15 text-warning-foreground"
                          : "border-success/25 bg-success/10 text-success",
                    )}
                  >
                    <CalendarClock className="h-3 w-3" />
                    SLA {sla.pct}%
                  </span>
                  {ticket.lockedBy && (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-md bg-warning/15 px-2 py-0.5 text-[10.5px] font-medium text-warning-foreground">
                      <LockKeyhole className="h-3 w-3" />
                      {ticket.lockedBy}
                    </span>
                  )}
                </div>

                <h2 className="mt-0.5 truncate text-[17px] font-semibold leading-snug text-foreground">
                  {ticket.subject}
                </h2>

                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px] text-muted-foreground">
                  {clientLinkProps ? (
                    <Link
                      {...clientLinkProps}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-sm hover:underline"
                      title="Ver detalhes do cliente"
                    >
                      <span className="truncate text-foreground">
                        {ticket.clientName || "Cliente não vinculado"}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10.5px] font-semibold text-primary">
                        {ticket.clientCode || "—"}
                      </span>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <span className="truncate text-foreground">
                        {ticket.clientName || "Cliente não vinculado"}
                      </span>
                      <span className="rounded bg-muted px-1.5 py-0.5 text-[10.5px] font-semibold text-primary">
                        {ticket.clientCode || "—"}
                      </span>
                    </span>
                  )}
                  {(ticket.companyName || ticket.companyNumber || ticket.companyDocument) && (
                    <>
                      <span aria-hidden className="text-border">·</span>
                      <span className="truncate text-[11px]">
                        {ticket.companyNumber
                          ? `${String(ticket.companyNumber).padStart(3, "0")} · `
                          : ""}
                        {ticket.companyName || "Empresa"}
                        {ticket.companyDocument ? ` · ${ticket.companyDocument}` : ""}
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                {/* Menu de mais opções */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 cursor-pointer rounded-lg"
                      aria-label="Mais opções"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 p-1">
                    <MenuRow
                      icon={History}
                      label="Timeline completa"
                      onClick={() => setTimelineOpen(true)}
                    />
                    <MenuRow
                      icon={ListChecks}
                      label={`Histórico de atendimentos (${historyList.length})`}
                      onClick={() => setHistoryOpen(true)}
                    />
                    <MenuRow
                      icon={NotebookText}
                      label={`Notas internas (${notes.length})`}
                      onClick={() => setNotesOpen(true)}
                    />
                    <MenuRow
                      icon={FileText}
                      label="Ver descrição original"
                      onClick={() => setDescriptionOpen(true)}
                    />
                  </PopoverContent>
                </Popover>

                {/* Botão Ações */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button size="sm" className="h-8 cursor-pointer rounded-lg px-3 text-[12.5px]">
                      Ações
                      <ChevronDown className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-60 p-1">
                    {actionItems.map((item) => (
                      <MenuRow
                        key={item.key}
                        icon={item.icon}
                        label={item.label}
                        disabled={item.disabled}
                        title={item.title}
                        onClick={item.onClick}
                      />
                    ))}
                  </PopoverContent>
                </Popover>

                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  aria-label="Fechar"
                  className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Corpo: conteúdo + histórico lateral */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="flex min-h-0 flex-col overflow-hidden">
              {/* 2. Indicadores */}
              <div className="shrink-0 border-b border-border bg-muted/20 px-4 py-3 md:px-5">
                <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
                  <IndicatorCard icon={ShieldCheck} label="Status" tone="primary">
                    <span className={cn("text-[14px] font-semibold", statusTextTone[ticket.status])}>
                      {ticket.status}
                    </span>
                  </IndicatorCard>
                  <IndicatorCard icon={AlertCircle} label="Prioridade" tone="danger">
                    <span
                      className={cn("text-[14px] font-semibold", priorityTextTone[ticket.priority])}
                    >
                      {ticket.priority}
                    </span>
                  </IndicatorCard>
                  <IndicatorCard icon={Clock3} label="SLA" tone="success">
                    <div className="flex items-center gap-2">
                      <span className={cn("text-[14px] font-semibold", slaTextTone[sla.tone])}>
                        {sla.pct}%
                      </span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className={cn("h-full rounded-full", slaBarTone[sla.tone])}
                          style={{ width: `${sla.pct}%` }}
                        />
                      </div>
                    </div>
                    <p className="mt-0.5 text-[10.5px] text-muted-foreground">
                      {sla.hours}h decorridas{sla.stopped ? " · parado" : ""}
                    </p>
                  </IndicatorCard>
                  <IndicatorCard icon={CalendarClock} label="Abertura" tone="primary">
                    <span className="text-[13px] font-semibold text-foreground">
                      {formatDateTime(ticket.openedAt)}
                    </span>
                  </IndicatorCard>
                </div>
              </div>

              {/* Mobile action bar */}
              <div className="flex shrink-0 items-center gap-2 overflow-x-auto border-b border-border bg-card px-3 py-2 xl:hidden">
                {actionItems.map((item) => (
                  <MobileAction
                    key={item.key}
                    icon={item.icon}
                    label={item.label}
                    disabled={item.disabled}
                    title={item.title}
                    highlight={item.key === "atender"}
                    onClick={item.onClick}
                  />
                ))}
                <MobileAction
                  icon={TicketTimelineIcon}
                  label="Timeline"
                  onClick={() => setTimelineOpen(true)}
                />
                <MobileAction
                  icon={ListChecks}
                  label="Histórico"
                  onClick={() => setHistoryOpen(true)}
                />
              </div>

              {/* 3. Abas */}
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="flex min-h-0 flex-1 flex-col gap-0"
              >
                <div className="shrink-0 border-b border-border bg-card px-4 md:px-5">
                  <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-none bg-transparent p-0">
                    {[
                      { value: "resumo", label: "Resumo" },
                      { value: "detalhes", label: "Detalhes" },
                      { value: "atividades", label: `Atividades (${timelineEvents.length})` },
                      { value: "arquivos", label: `Arquivos (${attachmentEvents.length})` },
                      { value: "notas", label: `Notas (${notes.length})` },
                    ].map((tab) => (
                      <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        className="cursor-pointer rounded-none border-b-2 border-transparent bg-transparent px-3 py-2.5 text-[12.5px] font-medium text-muted-foreground shadow-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <div className="min-h-0 flex-1 overflow-y-auto bg-muted/10 px-4 py-4 md:px-5">
                  {/* 4. Resumo */}
                  <TabsContent value="resumo" className="mt-0 space-y-3">
                    <Section title="Descrição do problema" icon={FileText}>
                      {ticketDescription ? (
                        <div key={ticket.id} className="space-y-2">
                          {summaryState.status === "loading" ? (
                            <p className="text-[13px] leading-relaxed text-muted-foreground">
                              Gerando resumo da descrição...
                            </p>
                          ) : (
                            <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground">
                              {summaryState.summary ?? ticketDescription}
                            </p>
                          )}
                          <button
                            type="button"
                            onClick={() => setDescriptionOpen(true)}
                            className="w-fit cursor-pointer text-[12px] font-medium text-primary no-underline hover:opacity-80"
                          >
                            Ver descrição original
                          </button>
                        </div>
                      ) : (
                        <p className="text-[13px] leading-relaxed text-muted-foreground">
                          Descrição não informada
                        </p>
                      )}
                    </Section>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <Section title="Cliente" icon={Building2} compact>
                        {clientLinkProps ? (
                          <Link
                            {...clientLinkProps}
                            className="block cursor-pointer rounded-sm transition-colors hover:text-primary"
                            title="Ver detalhes do cliente"
                          >
                            <p className="truncate text-[13.5px] font-semibold text-foreground">
                              {ticket.clientName || "Cliente não vinculado"}
                            </p>
                          </Link>
                        ) : (
                          <p className="truncate text-[13.5px] font-semibold text-foreground">
                            {ticket.clientName || "Cliente não vinculado"}
                          </p>
                        )}
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                          <MapPin className="mr-1 inline h-3 w-3" />
                          {mock.city} - {mock.uf}
                        </p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          Código: {ticket.clientCode || "—"}
                        </p>
                      </Section>

                      <Section title="Contato" icon={UserRound} compact>
                        <p className="truncate text-[13.5px] font-semibold text-foreground">
                          {ticket.contact || "Não informado"}
                        </p>
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                          {mock.contactRole}
                        </p>
                        <button
                          type="button"
                          onClick={() => copyValue("Telefone", mock.contactPhone)}
                          title="Copiar telefone"
                          className="mt-1 inline-flex cursor-pointer items-center gap-1 rounded-sm text-[11.5px] text-muted-foreground transition hover:text-primary"
                        >
                          <Phone className="h-3 w-3" />
                          {mock.contactPhone}
                        </button>
                        {contactEmail && (
                          <button
                            type="button"
                            onClick={() => copyValue("E-mail", contactEmail)}
                            title="Copiar e-mail"
                            className="mt-0.5 flex w-full cursor-pointer items-center gap-1 truncate rounded-sm text-left text-[11.5px] text-muted-foreground transition hover:text-primary"
                          >
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">{contactEmail}</span>
                          </button>
                        )}
                      </Section>

                      <Section title="Módulo" icon={Folder} compact>
                        <div className="flex items-center gap-1.5">
                          <ModuleKnowledgeLink
                            module={ticket.module}
                            className="truncate text-[13.5px] font-semibold text-foreground"
                            returnToTicketId={ticket.id}
                            onBeforeNavigate={() => snapshotCurrentChamadosForTicket(ticket.id)}
                          />
                        </div>
                        {moduleSub && (
                          <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                            Submódulo: {moduleSub}
                          </p>
                        )}
                        <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                          Origem: {sourceLabels[ticket.source]}
                        </p>
                        {hadronOptionValue && (
                          <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                            Opção Hádron: {hadronOptionValue}
                          </p>
                        )}
                      </Section>
                    </div>

                    <div className="grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_6px_18px_rgba(25,29,51,0.04)] sm:grid-cols-2">
                      <CompactInfo
                        icon={Clock3}
                        label="Última atualização"
                        value={`${formatDateTime(ticket.updatedAt)}${ticket.owner ? ` · por ${ticket.owner}` : ""}`}
                      />
                      <CompactInfo
                        icon={UserRound}
                        label="Responsável atual"
                        value={
                          ticket.lockedBy ? `${ticket.owner} · ${ticket.lockedBy}` : ticket.owner
                        }
                      />
                    </div>
                  </TabsContent>

                  {/* Detalhes */}
                  <TabsContent value="detalhes" className="mt-0 space-y-3">
                    <Section title="Dados do chamado" icon={Info}>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        <CompactInfo icon={TicketIcon} label="Protocolo" value={ticket.protocol} />
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
                          icon={CheckCircle2}
                          label="Finalização"
                          value={ticket.closedAt ? formatDateTime(ticket.closedAt) : "—"}
                        />
                        <CompactInfo
                          icon={UserCheck}
                          label="Atendente"
                          value={ticket.attendant || "—"}
                        />
                        <CompactInfo
                          icon={UserRound}
                          label="Responsável"
                          value={ticket.owner || "—"}
                        />
                        <CompactInfo icon={Folder} label="Módulo" value={moduleMain} />
                        <CompactInfo icon={Boxes} label="Submódulo" value={moduleSub || "—"} />
                        <CompactInfo
                          icon={Globe}
                          label="Origem"
                          value={sourceLabels[ticket.source]}
                        />
                        <CompactInfo
                          icon={Building2}
                          label="Empresa"
                          value={ticket.companyName || ticket.clientName || "—"}
                        />
                        <CompactInfo
                          icon={ReceiptText}
                          label="CNPJ"
                          value={ticket.companyDocument || "—"}
                        />
                        <CompactInfo
                          icon={LockKeyhole}
                          label="Em atendimento por"
                          value={ticket.lockedBy || "—"}
                        />
                      </div>
                    </Section>

                    <Section title="Descrição original" icon={FileText}>
                      <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground">
                        {ticketDescription || "Descrição não informada"}
                      </p>
                    </Section>
                  </TabsContent>

                  {/* Atividades */}
                  <TabsContent value="atividades" className="mt-0">
                    <Section title="Timeline do chamado" icon={History}>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[12.5px] font-medium text-foreground">
                          Eventos do atendimento ({timelineEvents.length})
                        </span>
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
                        <TicketTimelineList events={timelineEvents} variant="compact" />
                      </div>
                    </Section>
                  </TabsContent>

                  {/* Arquivos */}
                  <TabsContent value="arquivos" className="mt-0">
                    <Section title="Arquivos do chamado" icon={Paperclip}>
                      {attachmentEvents.length === 0 ? (
                        <p className="py-6 text-center text-[12.5px] text-muted-foreground">
                          Nenhum arquivo anexado a este chamado.
                        </p>
                      ) : (
                        <ul className="space-y-2">
                          {attachmentEvents.map((ev) => (
                            <li
                              key={ev.id}
                              className="flex items-start gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5"
                            >
                              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                                <Paperclip className="h-4 w-4" />
                              </span>
                              <div className="min-w-0">
                                <p className="truncate text-[12.5px] font-medium text-foreground">
                                  {ev.description}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  {ev.actor} · {formatDateTime(ev.when)}
                                </p>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </Section>
                  </TabsContent>

                  {/* Notas */}
                  <TabsContent value="notas" className="mt-0">
                    <Section title="Notas internas" icon={NotebookText}>
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[12.5px] font-medium text-foreground">
                          {notes.length} nota(s) registrada(s)
                        </span>
                        {notes.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setNotesOpen(true)}
                            className="inline-flex cursor-pointer items-center gap-1 text-[11.5px] font-medium text-primary hover:underline"
                          >
                            Ver todas
                            <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {notes.length === 0 ? (
                          <p className="py-4 text-center text-[12.5px] text-muted-foreground">
                            Nenhuma nota interna registrada.
                          </p>
                        ) : (
                          notes.slice(0, 5).map((item) => (
                            <div
                              key={item.id}
                              className="rounded-xl border border-border bg-card px-3 py-2.5"
                            >
                              <div className="flex flex-wrap items-baseline gap-x-2">
                                <span className="text-[12px] font-medium text-foreground">
                                  {item.operator}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {formatDateTime(item.createdAt)}
                                </span>
                              </div>
                              <p className="mt-0.5 whitespace-pre-wrap break-words text-[12.5px] text-muted-foreground">
                                {item.text}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                        <Input
                          value={note}
                          onChange={(event) => setNote(event.target.value)}
                          placeholder="Escreva uma nota interna..."
                          className="h-10 rounded-lg bg-card"
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              handleSaveNote();
                            }
                          }}
                        />
                        <Button
                          onClick={handleSaveNote}
                          disabled={!note.trim()}
                          className="h-10 shrink-0 cursor-pointer rounded-lg disabled:cursor-not-allowed"
                        >
                          <Plus className="mr-1 h-4 w-4" />
                          Adicionar nota
                        </Button>
                      </div>
                    </Section>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* 5. Histórico de atendimentos */}
            <TicketPastAttendancesSidePanel
              ticket={ticket}
              items={historyList}
              onSelect={setSelectedHistory}
              onSeeAll={() => setHistoryOpen(true)}
              className="hidden min-h-0 border-l border-border xl:flex"
            />
          </div>

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

      <Dialog open={descriptionOpen} onOpenChange={setDescriptionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Descrição original — {ticket.protocol}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            <p className="whitespace-pre-wrap break-words text-[13px] leading-relaxed text-foreground">
              {ticketDescription || "Descrição não informada"}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDescriptionOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


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

      <TransferTicketModal open={transferOpen} onOpenChange={setTransferOpen} ticket={ticket} />
    </>
  );
}

function MenuRow({
  icon: Icon,
  label,
  onClick,
  disabled,
  title,
}: {
  icon: IconComponent;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-left text-[12.5px] font-medium text-popover-foreground transition hover:bg-accent",
        disabled && "cursor-not-allowed opacity-50 hover:bg-transparent",
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={2.2} />
      <span className="truncate">{label}</span>
    </button>
  );
}

function IndicatorCard({
  icon: Icon,
  label,
  tone,
  children,
}: {
  icon: IconComponent;
  label: string;
  tone: "primary" | "danger" | "success";
  children: React.ReactNode;
}) {
  const toneClass =
    tone === "danger"
      ? "bg-destructive/10 text-destructive"
      : tone === "success"
        ? "bg-success/12 text-success"
        : "bg-primary/10 text-primary";
  return (
    <div className="flex min-w-0 items-start gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-[0_4px_12px_rgba(25,29,51,0.04)]">
      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", toneClass)}>
        <Icon className="h-4 w-4" strokeWidth={2.2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        {children}
      </div>
    </div>
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
  const sla = useMemo(() => computeSla(ticket), [ticket]);
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
        onPointerDownOutside={(event) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest?.('[data-rich-text-menu="true"]')) {
            event.preventDefault();
            return;
          }
          event.preventDefault();
        }}
        onInteractOutside={(event) => {
          const target = event.target as HTMLElement | null;
          if (target?.closest?.('[data-rich-text-menu="true"]')) {
            event.preventDefault();
            return;
          }
          event.preventDefault();
        }}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        className="flex w-[calc(100vw-2rem)] max-w-[940px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
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
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 text-[10.5px] font-medium",
                  sla.tone === "late"
                    ? "border-destructive/40 bg-destructive/10 text-destructive"
                    : sla.tone === "warn"
                      ? "border-warning/40 bg-warning/15 text-warning-foreground"
                      : "border-border bg-muted/50 text-muted-foreground",
                )}
              >
                <CalendarClock className="h-3 w-3" />
                SLA {sla.pct}% · {sla.hours}h
                {sla.tone === "late" && (
                  <span className="ml-1 uppercase">· vencido</span>
                )}
              </span>
            </>
          }
          meta={
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold text-primary">{ticket.clientCode || "—"}</span>
              <span aria-hidden className="text-border">·</span>
              <span className="truncate text-foreground">{ticket.clientName || "Cliente não vinculado"}</span>
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
        <DialogFooter className="gap-2 border-t border-border bg-card px-6 py-3 sm:gap-2">
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
            size="icon"
            disabled={!query.trim()}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const item = suggestions[0] ?? query.trim();
              if (!item) return;
              onAdd(item);
            }}
            className="h-10 w-10 shrink-0 cursor-pointer rounded-lg disabled:cursor-not-allowed disabled:opacity-50"
            aria-label={`Adicionar em ${label}`}
          >
            <Plus className="pointer-events-none h-4 w-4" />
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


function MobileAction({
  icon: Icon,
  label,
  onClick,
  highlight,
  disabled,
  title,
}: {
  icon: IconComponent;
  label: string;
  onClick: () => void;
  highlight?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={label}
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-medium transition",
        disabled && "cursor-not-allowed opacity-50",
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
              Cliente {ticket.clientCode || "—"}
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
            Ver todos ({items.length})
            <ChevronRight className="h-3 w-3" />
          </button>
        )}
      </div>

      <div
        className={cn(
          "flex-1 min-h-0 bg-muted/20 px-3 py-3",
          items.length > 5 ? "overflow-y-auto" : "overflow-hidden",
        )}
      >
        {items.length === 0 ? (
          <p className="py-8 text-center text-[12px] text-muted-foreground">
            Sem atendimentos anteriores.
          </p>
        ) : (
          <TicketHistoryList items={items.slice(0, 5)} onSelect={onSelect} timeline />
        )}
      </div>
    </aside>
  );
}
