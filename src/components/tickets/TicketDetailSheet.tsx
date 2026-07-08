import { forwardRef, useMemo, useRef, useState } from "react";
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
  LockKeyhole,
  MapPin,
  MessageCircle,
  MessageSquare,
  NotebookText,
  Paperclip,
  Phone,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
import { TicketTimelineModal } from "./TicketTimelineModal";
import { TicketChatPanel } from "./TicketChatPanel";

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

type NavKey = "timeline";

const navItems: { key: NavKey; label: string; icon: typeof Info }[] = [
  { key: "timeline", label: "Timeline", icon: History },
];

function getModuleIcon(module: string, source?: string): typeof Info {
  const m = (module ?? "").toLowerCase();
  const s = (source ?? "").toLowerCase();
  if (/nfe|nota|fiscal/.test(m)) return ReceiptText;
  if (/financ|conta|caixa|banco/.test(m)) return Wallet;
  if (/terceiros|cadastro|cliente|fornecedor/.test(m)) return Users;
  if (/estoque|produto/.test(m)) return Boxes;
  if (/hadron|web|portal/.test(m) || s.includes("portal")) return Globe;
  return TicketIcon;
}


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
  const [timelineOpen, setTimelineOpen] = useState(false);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const mock = useMemo(() => (ticket ? buildMock(ticket) : null), [ticket]);
  const sla = useMemo(() => (ticket ? computeSla(ticket) : null), [ticket]);

  if (!ticket || !mock || !sla) return null;

  const timelineEvents = events.filter((e) => e.kind !== "note");

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
          className="grid max-h-none w-[92vw] max-w-[1500px] gap-4 border-0 bg-transparent p-0 shadow-none xl:grid-cols-[minmax(0,1fr)_360px] xl:gap-6 [&>button]:hidden"
        >
          <DialogTitle className="sr-only">
            Detalhes do chamado {ticket.protocol}
          </DialogTitle>

          {/* Painel esquerdo — Chamado */}
          <div className="relative flex max-h-[90vh] min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-[0_30px_80px_rgba(0,0,0,0.35)]">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            <header className="shrink-0 border-b border-border bg-card px-5 py-4 md:px-6">
            <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3 pr-8">
              <span
                aria-hidden
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary ring-1 ring-primary/15"
              >

                {(() => {
                  const Icon = getModuleIcon(ticket.module, ticket.source);
                  return <Icon className="h-5 w-5" />;
                })()}
              </span>
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
                <h2 className="mt-1 truncate text-[18px] font-bold leading-snug text-foreground">
                  {ticket.subject}
                </h2>
                <p className="mt-0.5 truncate text-[12.5px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{ticket.clientCode}</span>
                  {" · "}
                  {ticket.clientName}
                </p>
              </div>
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


          {/* Body: sidebar (menu + ações) | conteúdo | chat */}
          <div className="flex flex-1 min-h-0 flex-col bg-muted/30 md:flex-row md:gap-4 md:p-4">
            {/* Sidebar */}
            <aside
              className={cn(
                "hidden shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-[width] duration-200 md:flex",
                navCollapsed ? "md:w-[64px]" : "md:w-[210px]",
              )}
            >
              <div className="flex items-center justify-end border-b border-border p-2">
                <button
                  type="button"
                  onClick={() => setNavCollapsed((v) => !v)}
                  aria-label={navCollapsed ? "Expandir menu" : "Retrair menu"}
                  title={navCollapsed ? "Expandir menu" : "Retrair menu"}
                  className="grid h-7 w-7 cursor-pointer place-items-center rounded-md border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
                >
                  {navCollapsed ? (
                    <ChevronRight className="h-4 w-4" />
                  ) : (
                    <ChevronLeft className="h-4 w-4" />
                  )}
                </button>
              </div>

              <div className="border-b border-border p-2">
                <SideItem
                  icon={History}
                  label="Timeline"
                  collapsed={navCollapsed}
                  onClick={() => setTimelineOpen(true)}
                />
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto p-2">
                {!navCollapsed && (
                  <p className="px-2 pb-1 pt-1 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Ações
                  </p>
                )}
                <SideItem
                  icon={UserPlus}
                  label="Assumir"
                  collapsed={navCollapsed}
                  onClick={handleAssume}
                />
                <SideItem
                  icon={PlayCircle}
                  label="Atender"
                  collapsed={navCollapsed}
                  onClick={handleAttend}
                  highlight
                />
                <Popover open={statusOpen} onOpenChange={setStatusOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      title={navCollapsed ? "Alterar status" : undefined}
                      aria-label="Alterar status"
                      className={cn(sideItemClasses(false), navCollapsed && "md:justify-center md:px-0")}
                    >
                      <ShieldCheck className="h-4 w-4 shrink-0" />
                      <span className={cn("truncate", navCollapsed && "md:hidden")}>
                        Alterar status
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent side="right" align="start" className="w-56 p-1">
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
                <SideItem
                  icon={CheckCircle2}
                  label="Encerrar"
                  collapsed={navCollapsed}
                  onClick={() => setCloseOpen(true)}
                />
                <SideItem
                  icon={Folder}
                  label="Histórico"
                  collapsed={navCollapsed}
                  onClick={() => setHistoryOpen(true)}
                />
                <SideItem
                  icon={MessageCircle}
                  label="Chat"
                  collapsed={navCollapsed}
                  onClick={() => setChatOpen(true)}
                  className="xl:hidden"
                />
              </div>

              {isMine && (
                <div className="border-t border-border p-2">
                  <span
                    className={cn(
                      "flex items-center gap-1.5 rounded-lg bg-primary/10 px-2 py-1.5 text-[10.5px] font-semibold text-primary",
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
              <MobileAction icon={History} label="Timeline" onClick={() => setTimelineOpen(true)} />
              <MobileAction icon={UserPlus} label="Assumir" onClick={handleAssume} />
              <MobileAction icon={PlayCircle} label="Atender" onClick={handleAttend} highlight />
              <MobileAction
                icon={ShieldCheck}
                label="Status"
                onClick={() => setStatusOpen((v) => !v)}
              />
              <MobileAction icon={CheckCircle2} label="Encerrar" onClick={() => setCloseOpen(true)} />
              <MobileAction icon={Folder} label="Histórico" onClick={() => setHistoryOpen(true)} />
              <MobileAction icon={MessageCircle} label="Chat" onClick={() => setChatOpen(true)} />
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0 overflow-y-auto rounded-2xl border border-border bg-background px-5 py-5 md:px-6">
              {/* Resumo */}
              <Section title="Resumo do chamado" icon={LayoutGrid}>
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

              <Section title="Descrição do problema" icon={FileText}>
                <p className="text-[13px] leading-relaxed text-foreground">{mock.description}</p>
              </Section>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Section title="Cliente" icon={Building2} compact>
                  <p className="text-[13.5px] font-bold text-foreground truncate">{ticket.clientName}</p>
                  <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                    <MapPin className="mr-1 inline h-3 w-3" />
                    {mock.city} - {mock.uf}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Código {ticket.clientCode}</p>
                </Section>

                <Section title="Contato" icon={UserRound} compact>
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

              {/* Datas e responsável — card próprio */}
              <div className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card p-3 shadow-[0_6px_18px_rgba(25,29,51,0.04)] sm:grid-cols-3">
                <CompactInfo icon={CalendarClock} label="Abertura" value={formatDateTime(ticket.openedAt)} />
                <CompactInfo icon={Clock3} label="Última atualização" value={formatDateTime(ticket.updatedAt)} />
                <CompactInfo
                  icon={UserRound}
                  label="Responsável atual"
                  value={ticket.lockedBy ? `${ticket.owner} · ${ticket.lockedBy}` : ticket.owner}
                />
              </div>

              {/* Nota interna — card separado */}
              <div className="mt-4">
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
              </div>

              <div className="h-2" />
            </div>

          </div>
          {/* fim body wrapper */}
          </div>
          {/* fim painel esquerdo */}


          {/* Painel direito — Chat (card separado) */}
          <TicketChatPanel
            ticket={ticket}
            className="hidden max-h-[90vh] overflow-hidden rounded-2xl border border-border shadow-[0_30px_80px_rgba(0,0,0,0.35)] xl:flex"
          />

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

      {/* Chat como modal para notebook/mobile */}
      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="flex h-[85vh] max-h-[85vh] w-[calc(100vw-1rem)] max-w-md flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 sm:w-[420px]">
          <DialogTitle className="sr-only">Chat com o cliente</DialogTitle>
          <TicketChatPanel
            ticket={ticket}
            className="flex-1 border-l-0"
            onClose={() => setChatOpen(false)}
          />
        </DialogContent>
      </Dialog>


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

  const closureOptions: {
    value: ClosurePayload["type"];
    title: string;
    description: string;
    icon: typeof CheckCircle2;
    tone: "primary" | "danger" | "neutral";
  }[] = [
    {
      value: "Resolvido",
      title: "Resolvido",
      description: "Problema solucionado com sucesso.",
      icon: CheckCircle2,
      tone: "primary",
    },
    {
      value: "Sem retorno do cliente",
      title: "Sem retorno do cliente",
      description: "Cliente não retornou ao contato.",
      icon: XCircle,
      tone: "danger",
    },
    {
      value: "Duplicado",
      title: "Duplicado",
      description: "Chamado duplicado ou já tratado.",
      icon: Folder,
      tone: "neutral",
    },
    {
      value: "Cancelado",
      title: "Cancelado",
      description: "Encerrado sem continuidade.",
      icon: AlertCircle,
      tone: "neutral",
    },
  ];

  const handleSubmit = () => {
    if (!solution.trim()) {
      toast.error("Informe a solução aplicada para encerrar o chamado.");
      return;
    }
    submit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-h-[90vh] w-[calc(100vw-1rem)] overflow-y-auto rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.45)] sm:w-[calc(100vw-2rem)] md:w-[760px] lg:w-[820px] [&>button]:hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-6 py-5">
          <div className="flex items-start gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <DialogTitle className="text-[16px] font-bold text-foreground">
                Encerrar chamado
              </DialogTitle>
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                {ticket.protocol} · {ticket.clientName}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="grid h-8 w-8 shrink-0 cursor-pointer place-items-center rounded-lg border border-border text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-5 px-6 py-5">
          {/* Solução aplicada */}
          <div>
            <Label className="mb-2 flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground">
              <MessageSquare className="h-3.5 w-3.5 text-primary" />
              Solução aplicada
            </Label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={5}
              placeholder="Descreva a solução ou o motivo do encerramento..."
              className="w-full resize-none rounded-xl border border-border bg-background p-3 text-[13px] leading-relaxed outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Tipo de encerramento */}
          <div>
            <Label className="mb-2 block text-[12.5px] font-semibold text-foreground">
              Tipo de encerramento
            </Label>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {closureOptions.map((opt) => {
                const selected = type === opt.value;
                const Icon = opt.icon;
                const toneBg =
                  opt.tone === "primary"
                    ? "bg-primary/15 text-primary"
                    : opt.tone === "danger"
                      ? "bg-destructive/15 text-destructive"
                      : "bg-muted text-muted-foreground";
                return (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setType(opt.value)}
                    className={cn(
                      "group flex cursor-pointer items-start gap-3 rounded-xl border bg-card px-3.5 py-3 text-left transition",
                      selected
                        ? "border-primary bg-primary/5 shadow-[0_0_0_1px_hsl(var(--primary)/0.4)]"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-full",
                        toneBg,
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12.5px] font-semibold text-foreground">
                        {opt.title}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">
                        {opt.description}
                      </span>
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full border transition",
                        selected
                          ? "border-primary bg-primary"
                          : "border-border bg-background",
                      )}
                      aria-hidden
                    >
                      {selected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-primary-foreground" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Opções adicionais */}
          <div className="space-y-2">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card px-3.5 py-3 transition hover:border-primary/40">
              <Checkbox
                checked={addToClientHistory}
                onCheckedChange={(v) => setAddToClientHistory(v === true)}
                className="mt-0.5 cursor-pointer"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-semibold text-foreground">
                  Adicionar ao histórico do cliente
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">
                  O encerramento será registrado no histórico do cliente.
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card px-3.5 py-3 transition hover:border-primary/40">
              <Checkbox
                checked={generateKbArticle}
                onCheckedChange={(v) => setGenerateKbArticle(v === true)}
                className="mt-0.5 cursor-pointer"
              />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Sugerir artigo para base de conhecimento
                </span>
                <span className="mt-0.5 block text-[11.5px] leading-snug text-muted-foreground">
                  Criar sugestão para documentar esta solução depois.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="gap-2 border-t border-border bg-muted/30 px-6 py-4 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-lg"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
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
  highlight,
  className,
}: {
  icon: typeof Info;
  label: string;
  collapsed: boolean;
  onClick: () => void;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={label}
      className={cn(
        sideItemClasses(!!highlight),
        collapsed && "md:justify-center md:px-0",
        className,
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className={cn("truncate", collapsed && "md:hidden")}>{label}</span>
    </button>
  );
}

function MobileAction({
  icon: Icon,
  label,
  onClick,
  highlight,
}: {
  icon: typeof Info;
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
        "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold transition",
        highlight
          ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90"
          : "border-border bg-card text-foreground hover:bg-accent",
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </button>
  );
}

