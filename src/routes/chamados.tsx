import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Headphones,
  History,
  ChevronRight,
  Layers,
  LockKeyhole,
  MessageSquarePlus,
  MoreVertical,
  PhoneCall,
  Search,
  SlidersHorizontal,
  TrendingDown,
  TrendingUp,
  UserPlus,
  UserRound,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  dailyTicketAnalytics,
  ticketOperators,
  ticketStatuses,
  weeklyTicketAnalytics,
  type SupportTicket,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-tickets-data";

const ticketPriorities: TicketPriority[] = ["Alta", "Media", "Baixa"];
import { useTickets, useTicketHistory, ticketsStore } from "@/lib/tickets-store";
import { FileText } from "lucide-react";
import { getModuleIcon } from "@/lib/ticket-icons";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TicketDetailSheet } from "@/components/tickets/TicketDetailSheet";
import { TicketHistoryModal } from "@/components/tickets/TicketHistoryModal";

export const Route = createFileRoute("/chamados")({
  head: () => ({
    meta: [
      { title: "Chamados — CRM Prócion" },
      {
        name: "description",
        content:
          "CRM de suporte da Prócion com chamados, filtros operacionais e analytics de atendimento.",
      },
    ],
  }),
  component: ChamadosRouteShell,
});

// Solid status badge colors. Green reserved for Finalizado only.
const statusTone: Record<TicketStatus, string> = {
  Atrasado: "bg-red-600 text-white border-red-700 dark:bg-red-600 dark:text-white dark:border-red-500",
  "Em Aberto": "bg-cyan-600 text-white border-cyan-700 dark:bg-cyan-600 dark:text-white dark:border-cyan-500",
  Ocupado: "bg-amber-500 text-white border-amber-600 dark:bg-amber-500 dark:text-white dark:border-amber-400",
  "Em andamento": "bg-blue-600 text-white border-blue-700 dark:bg-blue-600 dark:text-white dark:border-blue-500",
  "Aguardando cliente": "bg-purple-600 text-white border-purple-700 dark:bg-purple-600 dark:text-white dark:border-purple-500",
  "Com especialista": "bg-teal-600 text-white border-teal-700 dark:bg-teal-600 dark:text-white dark:border-teal-500",
  Agendamento: "bg-orange-500 text-white border-orange-600 dark:bg-orange-500 dark:text-white dark:border-orange-400",
  Finalizado: "bg-emerald-600 text-white border-emerald-700 dark:bg-emerald-600 dark:text-white dark:border-emerald-500",
  Cancelado: "bg-slate-500 text-white border-slate-600 dark:bg-slate-600 dark:text-white dark:border-slate-500",
};

// Solid priority badges. Baixa uses slate/blue — NOT green (green = Finalizado).
const priorityTone: Record<TicketPriority, string> = {
  Alta: "bg-red-600 text-white dark:bg-red-600 dark:text-white",
  Media: "bg-amber-500 text-white dark:bg-amber-500 dark:text-white",
  Baixa: "bg-slate-500 text-white dark:bg-slate-500 dark:text-white",
};

// Row tint by priority (used only when ticket is NOT finalized).
const priorityRowTint: Record<TicketPriority, string> = {
  Alta: "bg-rose-100/70 hover:bg-rose-200/70 dark:bg-rose-500/[0.13] dark:hover:bg-rose-500/[0.20]",
  Media: "bg-amber-100/70 hover:bg-amber-200/70 dark:bg-amber-500/[0.13] dark:hover:bg-amber-500/[0.20]",
  Baixa: "bg-slate-100/70 hover:bg-slate-200/70 dark:bg-slate-500/[0.10] dark:hover:bg-slate-500/[0.16]",
};

const priorityTint: Record<TicketPriority, string> = {
  Alta: "bg-rose-100/80 dark:bg-rose-500/[0.14]",
  Media: "bg-amber-100/80 dark:bg-amber-500/[0.14]",
  Baixa: "bg-slate-100/70 dark:bg-slate-500/[0.10]",
};

// Green row tint reserved for finalized/resolved status.
const finalizedRowTint =
  "bg-emerald-100/70 hover:bg-emerald-200/70 dark:bg-emerald-500/[0.12] dark:hover:bg-emerald-500/[0.18]";

function rowTintFor(ticket: SupportTicket) {
  if (ticket.status === "Finalizado") return finalizedRowTint;
  return priorityRowTint[ticket.priority];
}

const chartConfig = {
  opened: { label: "Abertos", color: "var(--color-primary)" },
  finished: { label: "Finalizados", color: "var(--color-success)" },
  overdue: { label: "Atrasados", color: "var(--color-destructive)" },
  backlog: { label: "Backlog", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

const sourceLabels = {
  Telefone: "Telefone",
  "Portal do cliente": "Portal",
  WhatsApp: "WhatsApp",
  Email: "Email",
};

type Filters = {
  status: string;
  priority: string;
  query: string;
  sigla: string;
  operatorType: "Todos" | "Atendente" | "Responsável";
  operator: string;
  dateType: "Registro" | "Atualizado";
  dateStart?: Date;
  dateEnd?: Date;
};

const initialFilters: Filters = {
  status: "Todos",
  priority: "Todas",
  query: "",
  sigla: "",
  operatorType: "Todos",
  operator: "Todos",
  dateType: "Registro",
  dateStart: undefined,
  dateEnd: undefined,
};

function DateRangeFilter({
  start,
  end,
  onChange,
}: {
  start?: Date;
  end?: Date;
  onChange: (range: { start?: Date; end?: Date }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<DateRange | undefined>(
    start || end ? { from: start, to: end } : undefined,
  );

  useEffect(() => {
    setDraft(start || end ? { from: start, to: end } : undefined);
  }, [start, end]);

  const label = (() => {
    if (start && end) {
      return `${format(start, "dd/MM/yyyy")} - ${format(end, "dd/MM/yyyy")}`;
    }
    if (start) return `A partir de ${format(start, "dd/MM/yyyy")}`;
    if (end) return `Até ${format(end, "dd/MM/yyyy")}`;
    return "dd/mm/aaaa - dd/mm/aaaa";
  })();

  const apply = () => {
    let from = draft?.from;
    let to = draft?.to;
    if (from && to && from > to) [from, to] = [to, from];
    onChange({ start: from, end: to });
    setOpen(false);
  };

  const clear = () => {
    setDraft(undefined);
    onChange({ start: undefined, end: undefined });
    setOpen(false);
  };

  const isPlaceholder = !start && !end;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-9 w-[220px] shrink-0 cursor-pointer items-center gap-2 truncate rounded-lg border border-border bg-background px-2.5 text-[13px] outline-none transition focus:ring-2 focus:ring-ring",
            isPlaceholder && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="h-3.5 w-3.5 shrink-0 opacity-70" />
          <span className="truncate">{label}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <Calendar
          mode="range"
          numberOfMonths={2}
          selected={draft}
          onSelect={(range) => {
            setDraft(range);
            let from = range?.from;
            let to = range?.to;
            if (from && to && from > to) [from, to] = [to, from];
            onChange({ start: from, end: to });
          }}
          locale={ptBR}
          initialFocus
          className={cn("pointer-events-auto p-3")}
        />
        <div className="flex items-center justify-end gap-2 border-t border-border px-3 py-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 cursor-pointer"
            onClick={clear}
          >
            Limpar
          </Button>
          <Button
            type="button"
            size="sm"
            className="h-8 cursor-pointer"
            onClick={apply}
          >
            Aplicar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}



function ChamadosRouteShell() {
  const location = useLocation();
  if (location.pathname !== "/chamados") {
    return <Outlet />;
  }

  return <TicketsPage />;
}

function TicketsPage() {

  const supportTickets = useTickets();
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [historyTicketId, setHistoryTicketId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);



  const openTicketDetail = (ticket: SupportTicket) => {
    setSelectedTicketId(ticket.id);
    setDetailOpen(true);
  };

  const openTicketHistory = (ticket: SupportTicket) => {
    setHistoryTicketId(ticket.id);
    setHistoryOpen(true);
  };

  const filteredTickets = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const sigla = filters.sigla.trim().toLowerCase();
    return supportTickets.filter((ticket) => {
      if (filters.status !== "Todos" && ticket.status !== filters.status) return false;
      if (filters.priority !== "Todas" && ticket.priority !== filters.priority) return false;
      if (sigla && !ticket.clientCode.toLowerCase().includes(sigla)) return false;
      if (filters.operator !== "Todos") {
        const op = filters.operator;
        if (filters.operatorType === "Atendente" && ticket.attendant !== op) return false;
        if (filters.operatorType === "Responsável" && ticket.owner !== op) return false;
        if (filters.operatorType === "Todos" && ticket.attendant !== op && ticket.owner !== op) return false;
      }
      if (filters.dateStart || filters.dateEnd) {
        const raw = filters.dateType === "Registro" ? ticket.openedAt : ticket.updatedAt;
        const d = new Date(raw);
        const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        if (filters.dateStart) {
          const s = filters.dateStart;
          const start = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
          if (day < start) return false;
        }
        if (filters.dateEnd) {
          const e = filters.dateEnd;
          const end = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
          if (day > end) return false;
        }
      }
      if (!query) return true;
      return [
        ticket.protocol,
        ticket.clientCode,
        ticket.clientName,
        ticket.contact,
        ticket.subject,
        ticket.module,
        ticket.owner,
        ticket.attendant,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [filters, supportTickets]);

  const openTickets = supportTickets.filter(
    (ticket) => !["Finalizado", "Cancelado"].includes(ticket.status),
  ).length;
  const inProgressTickets = supportTickets.filter((ticket) => ticket.status === "Em andamento").length;
  const overdueTickets = supportTickets.filter((ticket) => ticket.status === "Atrasado").length;
  const portalTickets = supportTickets.filter((ticket) => ticket.source === "Portal do cliente").length;
  const finishedTickets = supportTickets.filter((ticket) => ticket.status === "Finalizado").length;
  const resolutionRate = Math.round((finishedTickets / supportTickets.length) * 100);
  const avgHandlingLabel = "01h 47min";
  const slaMedio = 82;

  const statusDistribution = ticketStatuses
    .map((status) => ({
      status,
      total: supportTickets.filter((ticket) => ticket.status === status).length,
    }))
    .filter((item) => item.total > 0);

  const sourceDistribution = (["Portal do cliente", "Telefone", "WhatsApp", "Email"] as const).map(
    (source) => ({
      source,
      label: sourceLabels[source],
      total: supportTickets.filter((ticket) => ticket.source === source).length,
    }),
  );

  const moduleMap = new Map<string, number>();
  supportTickets.forEach((ticket) => {
    const key = ticket.module.split(" - ").pop() ?? ticket.module;
    moduleMap.set(key, (moduleMap.get(key) ?? 0) + 1);
  });
  const moduleDistribution = Array.from(moduleMap.entries())
    .map(([label, total]) => ({ label, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  return (
    <AppShell>
      <PageHeader
        title="Chamados"
        description="CRM de suporte para acompanhar abertura, atendimento, atrasos e produtividade dos chamados."
        breadcrumbs={[{ label: "Chamados" }]}
      />

      <Link
        to="/chamados/novo"
        aria-label="Novo chamado"
        title="Novo chamado"
        className="group fixed bottom-6 right-6 z-40 inline-grid h-14 w-14 cursor-pointer place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[0_14px_32px_rgba(11,151,196,0.35)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(11,151,196,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 md:bottom-8 md:right-8"
      >
        <MessageSquarePlus className="h-6 w-6" />
        <span className="pointer-events-none absolute right-full top-1/2 mr-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs font-semibold text-background opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Novo chamado
        </span>
      </Link>



      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.1fr]">
        <div className="space-y-6">
          <TicketsHero openTickets={openTickets} overdueTickets={overdueTickets} />
          <div id="analytics-detalhado" className="scroll-mt-24 space-y-6">
            <DailyVolumeCard />
            <WeeklyBacklogCard />
          </div>
        </div>


        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <SmallStatCard
              title="Abertos"
              value={String(openTickets)}
              change="+18 hoje"
              trend="up"
              icon={Headphones}
              accent="#0b97c4"
            />
            <SmallStatCard
              title="Em andamento"
              value={String(inProgressTickets)}
              change="ativos"
              trend="up"
              icon={Clock3}
              accent="#8d6bd8"
            />
            <SmallStatCard
              title="Atrasados"
              value={String(overdueTickets)}
              change="revisar SLA"
              trend="down"
              icon={AlertTriangle}
              accent="#fb5166"
            />
            <SmallStatCard
              title="Finalizados"
              value={String(finishedTickets)}
              change="+8 hoje"
              trend="up"
              icon={CheckCircle2}
              accent="#20bf6b"
            />
          </div>

          <SlaProfileCard
            slaMedio={slaMedio}
            avgHandlingLabel={avgHandlingLabel}
            resolutionRate={resolutionRate}
            portalTickets={portalTickets}
          />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <StatusCategoriesCard data={statusDistribution} />
            <SourceModuleCard sources={sourceDistribution} modules={moduleDistribution} />
          </div>
        </div>
      </section>


      <Card className="mb-6 rounded-2xl border border-border/60 bg-card p-3 shadow-[0_8px_22px_rgba(25,29,51,0.05)]">
        <div className="-mx-1 overflow-x-auto px-1 xl:overflow-visible">
          <div className="flex min-w-max flex-nowrap items-center gap-2 xl:min-w-0">
            <div className="relative min-w-0 flex-1 basis-[220px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={filters.query}
                onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
                type="search"
                placeholder="Buscar cliente, protocolo..."
                className="h-9 w-full truncate rounded-lg border border-border bg-background pl-9 pr-3 text-[13px] outline-none transition focus:ring-2 focus:ring-ring"
              />
            </div>
            <input
              value={filters.sigla}
              onChange={(event) => setFilters((prev) => ({ ...prev, sigla: event.target.value.toUpperCase() }))}
              type="text"
              placeholder="Sigla"
              className="h-9 w-[80px] shrink-0 truncate rounded-lg border border-border bg-background px-2.5 text-[13px] uppercase outline-none focus:ring-2 focus:ring-ring"
            />
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className="h-9 w-[130px] shrink-0 cursor-pointer truncate rounded-lg border border-border bg-background px-2.5 pr-7 text-[13px] outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Todos</option>
              {ticketStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <select
              value={filters.priority}
              onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
              className="h-9 w-[110px] shrink-0 cursor-pointer truncate rounded-lg border border-border bg-background px-2.5 pr-7 text-[13px] outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Todas</option>
              {ticketPriorities.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
            <select
              value={filters.operatorType}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, operatorType: event.target.value as Filters["operatorType"] }))
              }
              className="h-9 w-[130px] shrink-0 cursor-pointer truncate rounded-lg border border-border bg-background px-2.5 pr-7 text-[13px] outline-none focus:ring-2 focus:ring-ring"
              title="Tipo operador"
            >
              <option value="Todos">Tipo operador</option>
              <option value="Atendente">Atendente</option>
              <option value="Responsável">Responsável</option>
            </select>
            <select
              value={filters.operator}
              onChange={(event) => setFilters((prev) => ({ ...prev, operator: event.target.value }))}
              className="h-9 w-[120px] shrink-0 cursor-pointer truncate rounded-lg border border-border bg-background px-2.5 pr-7 text-[13px] outline-none focus:ring-2 focus:ring-ring"
              title="Operador"
            >
              <option value="Todos">Operador</option>
              {ticketOperators.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
            <select
              value={filters.dateType}
              onChange={(event) =>
                setFilters((prev) => ({ ...prev, dateType: event.target.value as Filters["dateType"] }))
              }
              className="h-9 w-[120px] shrink-0 cursor-pointer truncate rounded-lg border border-border bg-background px-2.5 pr-7 text-[13px] outline-none focus:ring-2 focus:ring-ring"
              title="Tipo data"
            >
              <option value="Registro">Registro</option>
              <option value="Atualizado">Atualizado</option>
            </select>
            <DateRangeFilter
              start={filters.dateStart}
              end={filters.dateEnd}
              onChange={(range) =>
                setFilters((prev) => ({ ...prev, dateStart: range.start, dateEnd: range.end }))
              }
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 shrink-0 cursor-pointer whitespace-nowrap rounded-lg px-3 text-[13px] text-muted-foreground hover:text-foreground"
              onClick={() => setFilters(initialFilters)}
            >
              <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5" />
              Limpar
            </Button>
          </div>
        </div>
      </Card>



      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-base font-bold text-foreground">Fila de suporte</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {filteredTickets.length} chamado(s) exibidos com os filtros atuais.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            CRM lado suporte
          </Badge>
        </div>
      </div>
      <div className="min-h-[560px]">
        {filteredTickets.length === 0 ? (
          <div className="grid min-h-[560px] place-items-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center">
            <div>
              <p className="text-sm font-semibold text-foreground">Nenhum chamado encontrado</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ajuste os filtros para exibir chamados nesta fila.
              </p>
            </div>
          </div>
        ) : (
          <TicketsListView
            tickets={filteredTickets}
            onOpen={openTicketDetail}
            onHistory={openTicketHistory}
          />
        )}
      </div>

      <TicketDetailSheet
        ticketId={selectedTicketId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />

      <HistoryModalHost
        ticketId={historyTicketId}
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        tickets={supportTickets}
      />
    </AppShell>
  );
}

function MetricCard({
  label,
  value,
  trend,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  trend: string;
  icon: typeof Headphones;
  tone: string;
}) {
  return (
    <Card className="rounded-[14px] border-0 bg-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
        </div>
        <div className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-xl", tone)}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

const sourceIcons: Record<SupportTicket["source"], typeof PhoneCall> = {
  Telefone: PhoneCall,
  "Portal do cliente": MessageSquarePlus,
  WhatsApp: MessageSquarePlus,
  Email: MessageSquarePlus,
};


function TicketCard({
  ticket,
  onOpen,
  onHistory,
}: {
  ticket: SupportTicket;
  onOpen?: (ticket: SupportTicket) => void;
  onHistory?: (ticket: SupportTicket) => void;
}) {
  
  const SourceIcon = sourceIcons[ticket.source] ?? PhoneCall;

  const handleAssume = (e: React.MouseEvent) => {
    e.stopPropagation();
    ticketsStore.assumeTicket(ticket.id);
    toast.success(`Chamado ${ticket.protocol} assumido.`);
  };

  return (
    <Card className={cn("flex min-w-0 flex-col gap-4 rounded-[16px] border border-border/70 bg-card p-4 shadow-[0_10px_28px_rgba(25,29,51,0.05)] transition hover:shadow-[0_14px_32px_rgba(25,29,51,0.09)] sm:p-5", priorityTint[ticket.priority])}>
      {/* Top: icon + title + client / protocol + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          {(() => {
            const ModuleIcon = getModuleIcon(ticket.module, ticket.source, ticket.subject);
            return (
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                <ModuleIcon className="h-5 w-5" />
              </div>
            );
          })()}
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold leading-snug text-foreground">
              {ticket.subject}
            </p>
            <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
              <span className="font-semibold text-foreground">{ticket.clientCode}</span>
              {" · "}
              {ticket.clientName}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-mono text-[10.5px] font-semibold text-muted-foreground">
            {ticket.protocol}
          </span>
          <Badge
            className={cn(
              "whitespace-nowrap rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
              statusTone[ticket.status],
            )}
          >
            {ticket.status}
          </Badge>
        </div>
      </div>

      {/* Middle: info grid */}
      <dl className="grid min-w-0 grid-cols-1 gap-x-4 gap-y-2 text-[12px] sm:grid-cols-2 lg:grid-cols-3">
        <InfoRow icon={UserRound} label="Contato" value={ticket.contact} />
        <InfoRow icon={Layers} label="Módulo" value={ticket.module} />
        <InfoRow icon={Headphones} label="Atendente" value={ticket.attendant} />
        <InfoRow icon={UserPlus} label="Responsável" value={ticket.owner} />
        <InfoRow
          icon={CalendarClock}
          label="Registro"
          value={formatDateTime(ticket.openedAt)}
        />
        <InfoRow
          icon={Clock3}
          label="Atualizado"
          value={formatDateTime(ticket.updatedAt)}
        />
      </dl>


      {/* Chips */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Chip className={priorityTone[ticket.priority]}>
          <AlertTriangle className="h-3 w-3" />
          {ticket.priority}
        </Chip>
        <Chip className="bg-primary/10 text-primary">
          <SourceIcon className="h-3 w-3" />
          {sourceLabels[ticket.source]}
        </Chip>
        <Link
          to="/base-de-conhecimento"
          search={{ search: ticket.module }}
          onClick={(e) => e.stopPropagation()}
          className="inline-flex cursor-pointer items-center gap-1 whitespace-nowrap rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
          title={`Buscar "${ticket.module}" na Base de Conhecimento`}
        >
          <FolderKanban className="h-3 w-3" />
          {ticket.module}
        </Link>
        {ticket.lockedBy && (
          <Chip className="bg-warning/15 text-warning-foreground">
            <LockKeyhole className="h-3 w-3" />
            {ticket.lockedBy}
          </Chip>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
        <Button
          size="sm"
          onClick={() => onOpen?.(ticket)}
          className="h-8 cursor-pointer rounded-lg px-3 text-[12px] shadow-[0_6px_14px_rgba(11,151,196,0.18)]"
        >
          Abrir
          <ArrowRight className="ml-0.5 h-3.5 w-3.5" />
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleAssume}
            className="h-8 cursor-pointer rounded-lg px-2 text-[12px] text-muted-foreground hover:text-foreground"
          >
            <UserPlus className="mr-1 h-3.5 w-3.5" />
            Assumir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onHistory?.(ticket);
            }}
            className="h-8 cursor-pointer rounded-lg px-2 text-[12px] text-muted-foreground hover:text-foreground"
          >
            <History className="mr-1 h-3.5 w-3.5" />
            Histórico
          </Button>
        </div>
      </div>
    </Card>
  );
}

function TicketsListView({
  tickets,
  onOpen,
  onHistory,
}: {
  tickets: SupportTicket[];
  onOpen: (ticket: SupportTicket) => void;
  onHistory: (ticket: SupportTicket) => void;
}) {
  if (tickets.length === 0) {
    return (
      <Card className="rounded-2xl border border-border/60 bg-card p-8 text-center text-sm text-muted-foreground">
        Nenhum chamado encontrado com os filtros atuais.
      </Card>
    );
  }

  const handleAssume = (ticket: SupportTicket, e: React.MouseEvent) => {
    e.stopPropagation();
    ticketsStore.assumeTicket(ticket.id);
    toast.success(`Chamado ${ticket.protocol} assumido.`);
  };

  return (
    <>
      {/* Desktop table */}
      <Card className="hidden overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_8px_22px_rgba(25,29,51,0.05)] lg:block">
        <div className="w-full">
          <table className="w-full table-fixed text-[12px]">
            <colgroup>
              <col style={{ width: "160px" }} />
              <col style={{ width: "104px" }} />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col style={{ width: "108px" }} />
              <col style={{ width: "108px" }} />
              <col style={{ width: "28px" }} />
            </colgroup>
            <thead className="bg-muted/40 text-[10.5px] uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-2 py-2 text-left font-semibold">Status</th>
                <th className="px-2 py-2 text-left font-semibold">Prioridade</th>
                <th className="px-2 py-2 text-left font-semibold">Cliente</th>
                <th className="px-2 py-2 text-left font-semibold">Contato</th>
                <th className="px-2 py-2 text-left font-semibold">Assunto</th>
                <th className="px-2 py-2 text-left font-semibold">Módulo</th>
                <th className="px-2 py-2 text-left font-semibold">Atendente</th>
                <th className="px-2 py-2 text-left font-semibold">Responsável</th>
                <th className="px-2 py-2 text-left font-semibold">Registro</th>
                <th className="px-2 py-2 text-left font-semibold">Atualizado</th>
                <th className="px-2 py-2" aria-label="Abrir" />
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className={cn(
                    "cursor-pointer border-t border-border/60 transition",
                    rowTintFor(ticket),
                  )}
                  onClick={() => onOpen(ticket)}
                >
                  <td className="px-2 py-2 align-top">
                    <div className="flex flex-col items-start gap-1">
                      <Badge
                        className={cn(
                          "inline-flex w-[136px] justify-center whitespace-nowrap rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                          statusTone[ticket.status],
                        )}
                      >
                        {ticket.status}
                      </Badge>
                      <span className="font-mono text-[10px] leading-tight text-muted-foreground">
                        {ticket.protocol}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        priorityTone[ticket.priority],
                      )}
                    >
                      <AlertTriangle className="h-3 w-3" />
                      {ticket.priority}
                    </span>
                  </td>
                  <td className="px-2 py-2 align-top">
                    <div className="truncate font-semibold text-foreground">{ticket.clientCode}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{ticket.clientName}</div>
                  </td>
                  <td className="truncate px-2 py-2 align-top text-muted-foreground">
                    {ticket.contact}
                  </td>
                  <td className="px-2 py-2 align-top font-medium text-foreground">
                    <span className="line-clamp-2 break-words">{ticket.subject}</span>
                  </td>
                  <td className="truncate px-2 py-2 align-top text-muted-foreground">
                    {ticket.module}
                  </td>
                  <td className="truncate px-2 py-2 align-top text-muted-foreground">{ticket.attendant}</td>
                  <td className="truncate px-2 py-2 align-top text-muted-foreground">{ticket.owner}</td>
                  <td className="whitespace-nowrap px-2 py-2 align-top text-[11px] text-muted-foreground">
                    {formatDateTime(ticket.openedAt)}
                  </td>
                  <td className="whitespace-nowrap px-2 py-2 align-top text-[11px] text-muted-foreground">
                    {formatDateTime(ticket.updatedAt)}
                  </td>
                  <td className="px-2 py-2 text-right align-top text-muted-foreground">
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </Card>

      {/* Mobile stacked list */}
      <div className="space-y-2 lg:hidden">
        {tickets.map((ticket) => (
          <Card
            key={ticket.id}
            onClick={() => onOpen(ticket)}
            className={cn("cursor-pointer rounded-xl border border-border/60 bg-card p-3 shadow-[0_6px_16px_rgba(25,29,51,0.04)] transition hover:shadow-[0_10px_20px_rgba(25,29,51,0.08)]", priorityTint[ticket.priority])}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge
                    className={cn(
                      "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                      statusTone[ticket.status],
                    )}
                  >
                    {ticket.status}
                  </Badge>
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                      priorityTone[ticket.priority],
                    )}
                  >
                    <AlertTriangle className="h-2.5 w-2.5" />
                    {ticket.priority}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {ticket.protocol}
                  </span>
                </div>
                <p className="mt-1.5 truncate text-[13px] font-bold text-foreground">
                  {ticket.subject}
                </p>
                <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                  <span className="font-semibold text-foreground">{ticket.clientCode}</span> ·{" "}
                  {ticket.clientName}
                </p>
              </div>
            </div>
            <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
              <div className="truncate"><span className="font-semibold text-foreground">Contato:</span> {ticket.contact}</div>
              <div className="truncate"><span className="font-semibold text-foreground">Atendente:</span> {ticket.attendant}</div>
              <div className="col-span-2 truncate"><span className="font-semibold text-foreground">Módulo:</span> {ticket.module}</div>
              <div className="truncate"><span className="font-semibold text-foreground">Resp.:</span> {ticket.owner}</div>
              <div className="truncate"><span className="font-semibold text-foreground">Atual.:</span> {formatDateTime(ticket.updatedAt)}</div>
            </dl>
            <div className="mt-2 flex items-center justify-end gap-1 border-t border-border/60 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => handleAssume(ticket, e)}
                className="h-7 cursor-pointer rounded-md px-2 text-[11px] text-muted-foreground"
              >
                <UserPlus className="mr-1 h-3 w-3" />
                Assumir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onHistory(ticket);
                }}
                className="h-7 cursor-pointer rounded-md px-2 text-[11px] text-muted-foreground"
              >
                <History className="mr-1 h-3 w-3" />
                Histórico
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}

function HistoryModalHost({
  ticketId,
  open,
  onOpenChange,
  tickets,
}: {
  ticketId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tickets: SupportTicket[];
}) {
  const historyItems = useTicketHistory(ticketId);
  const ticket = ticketId ? (tickets.find((t) => t.id === ticketId) ?? null) : null;
  return (
    <TicketHistoryModal
      open={open}
      onOpenChange={onOpenChange}
      ticket={ticket}
      historyItems={historyItems}
    />
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarClock;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 items-start gap-1.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </dt>
        <dd className="mt-0.5 truncate text-[12px] font-semibold text-foreground">{value}</dd>
      </div>
    </div>
  );
}

function Chip({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}

function formatDateTime(value: string) {
  const date = new Date(value);
  return `${date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })} ${date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}`;
}


// ============= Analytics dashboard components (Chamados) =============

function TicketsHero({
  openTickets,
  overdueTickets,
}: {
  openTickets: number;
  overdueTickets: number;
}) {
  return (
    <Card className="relative min-h-[230px] overflow-hidden rounded-[14px] border-0 bg-gradient-to-br from-[#0b97c4] via-[#0490d1] to-[#313866] p-7 text-white shadow-[0_18px_40px_rgba(11,151,196,0.22)]">
      <div className="relative z-10 max-w-[360px]">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
          Central de chamados
        </p>
        <h2 className="mt-2 text-[24px] font-bold leading-tight">
          {openTickets} chamados ativos no atendimento
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-white/78">
          {overdueTickets} atrasados exigem retorno imediato. Acompanhe SLA, produtividade e o
          fluxo de origem em um só lugar.
        </p>

      </div>
      <div className="absolute right-6 top-8 hidden h-[160px] w-[200px] md:block">
        <div className="absolute bottom-0 left-8 h-[86px] w-[130px] rounded-lg bg-white/75 shadow-xl" />
        <div className="absolute bottom-9 left-3 h-[60px] w-[78px] rounded-xl bg-[#33c3e8] shadow-lg">
          <div className="absolute left-3 top-3 flex h-8 items-end gap-1.5">
            {[16, 26, 34, 50, 40, 60].map((h, i) => (
              <span
                key={i}
                className="w-1.5 rounded-full bg-white dark:bg-[#20263d]"
                style={{ height: h }}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-4 top-6 h-7 w-7 rounded-full border-[9px] border-[#61c8e8]" />
        <div className="absolute bottom-16 right-6 h-3.5 w-3.5 rounded-full bg-[#ff8ecf]" />
      </div>
    </Card>
  );
}

function DailyVolumeCard() {
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-foreground">Volume por dia</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Abertos, finalizados e atrasados na semana atual.
          </p>
        </div>
        <div className="flex rounded-full bg-primary/10 p-1 text-[11px] font-semibold text-muted-foreground">
          {["Semana", "Mês", "Trim."].map((item) => (
            <button
              key={item}
              className={cn(
                "rounded-full px-3.5 py-1.5 transition",
                item === "Semana" && "bg-white dark:bg-[#20263d] text-foreground shadow-sm",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatLegend color="#0b97c4" label="Abertos" value={sumDaily("opened").toString()} />
        <StatLegend color="#20bf6b" label="Finalizados" value={sumDaily("finished").toString()} />
        <StatLegend color="#fb5166" label="Atrasados" value={sumDaily("overdue").toString()} />
      </div>
      <div className="h-[240px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dailyTicketAnalytics} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
            <defs>
              <linearGradient id="chamados-opened" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0b97c4" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#0b97c4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="chamados-finished" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#20bf6b" stopOpacity={0.28} />
                <stop offset="100%" stopColor="#20bf6b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,145,173,0.18)" />
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} width={40} />
            <Tooltip
              contentStyle={{
                border: "0",
                borderRadius: 12,
                boxShadow: "0 14px 30px rgba(25,29,51,0.12)",
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="opened" stroke="#0b97c4" strokeWidth={3} fill="url(#chamados-opened)" />
            <Area type="monotone" dataKey="finished" stroke="#20bf6b" strokeWidth={3} fill="url(#chamados-finished)" />
            <Area type="monotone" dataKey="overdue" stroke="#fb5166" strokeWidth={2} fill="transparent" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function sumDaily(key: "opened" | "finished" | "overdue") {
  return dailyTicketAnalytics.reduce((acc, item) => acc + item[key], 0);
}

function WeeklyBacklogCard() {
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Backlog semanal</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Evolução de abertos, finalizados e saldo em aberto.
          </p>
        </div>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyTicketAnalytics} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,145,173,0.18)" />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} width={40} />
            <Tooltip
              contentStyle={{
                border: "0",
                borderRadius: 12,
                boxShadow: "0 14px 30px rgba(25,29,51,0.12)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="opened" fill="#8d6bd8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="finished" fill="#ff9f68" radius={[6, 6, 0, 0]} />
            <Bar dataKey="backlog" fill="#ff5fc8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-5 text-xs font-semibold text-muted-foreground">
        <LegendDot color="#8d6bd8" label="Abertos" />
        <LegendDot color="#ff9f68" label="Finalizados" />
        <LegendDot color="#ff5fc8" label="Saldo" />
      </div>
    </Card>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

function StatLegend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none text-foreground">{value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function SmallStatCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
  accent,
}: {
  title: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
  icon: typeof Headphones;
  accent: string;
}) {
  return (
    <Card className="min-h-[126px] rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-5 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="flex h-full items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">{title}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-bold tabular-nums text-foreground">{value}</span>
            {change && (
              <span
                className={cn(
                  "mb-1 inline-flex items-center gap-1 text-xs font-semibold",
                  trend === "down" ? "text-[#fb5166]" : "text-[#20bf6b]",
                )}
              >
                {trend === "down" ? <TrendingDown className="h-3 w-3" /> : <TrendingUp className="h-3 w-3" />}
                {change}
              </span>
            )}
          </div>
        </div>
        <div
          className="grid h-11 w-11 shrink-0 place-items-center rounded-xl"
          style={{ background: `${accent}1f`, color: accent }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

function SlaProfileCard({
  slaMedio,
  avgHandlingLabel,
  resolutionRate,
  portalTickets,
}: {
  slaMedio: number;
  avgHandlingLabel: string;
  resolutionRate: number;
  portalTickets: number;
}) {
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="grid gap-6 md:grid-cols-[1fr_220px] md:items-center">
        <div>
          <h3 className="text-base font-bold text-foreground">Saúde do atendimento</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Tempo médio, SLA e taxa de resolução consolidados.
          </p>
          <div className="mt-5 grid grid-cols-3 gap-3">
            <InfoPill icon={Clock3} label="Tempo médio" value={avgHandlingLabel} />
            <InfoPill icon={CheckCircle2} label="Resolução" value={`${resolutionRate}%`} />
            <InfoPill icon={UserRound} label="Portal" value={String(portalTickets)} />
          </div>
        </div>
        <Gauge value={slaMedio} />
      </div>
    </Card>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Headphones;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-muted/40 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}

function Gauge({ value }: { value: number }) {
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 82;
  const stroke = 20;
  const progress = Math.max(0, Math.min(1, value / 100));
  const circumference = Math.PI * r;
  const dash = circumference * progress;
  const angleDeg = -180 + 180 * progress;
  const needleLength = r - 6;
  const rad = (angleDeg * Math.PI) / 180;
  const tipX = cx + needleLength * Math.cos(rad);
  const tipY = cy + needleLength * Math.sin(rad);

  return (
    <div className="mx-auto flex w-full max-w-[220px] flex-col items-center">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2 / 1" }}>
        <svg viewBox={`0 0 ${size} ${size / 2 + 4}`} className="block h-auto w-full" aria-hidden="true">
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="rgba(139,145,173,0.22)"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#0b97c4"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
          <circle cx={cx} cy={cy} r={28} fill="rgba(11,151,196,0.14)" />
          <circle cx={cx} cy={cy} r={16} fill="#0b97c4" />
          <line x1={cx} y1={cy} x2={tipX} y2={tipY} stroke="#313866" strokeWidth={7} strokeLinecap="round" />
          <circle cx={cx} cy={cy} r={4} fill="#ffffff" />
        </svg>
      </div>
      <p className="mt-1 text-sm font-bold text-muted-foreground">
        SLA médio <span className="text-[#20bf6b]">{value}%</span>
      </p>
    </div>
  );
}

const statusChartColors = [
  "#0b97c4",
  "#8d6bd8",
  "#ffd166",
  "#ff9f68",
  "#20bf6b",
  "#fb5166",
  "#33c3e8",
  "#ff5fc8",
  "#8b91ad",
];

function StatusCategoriesCard({
  data,
}: {
  data: { status: TicketStatus; total: number }[];
}) {
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <h3 className="text-base font-bold text-foreground">Chamados por status</h3>
      <p className="mt-1 text-xs text-muted-foreground">Distribuição atual do funil.</p>
      <div className="mt-4 h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={46} outerRadius={72} paddingAngle={2} dataKey="total" nameKey="status">
              {data.map((entry, index) => (
                <Cell key={entry.status} fill={statusChartColors[index % statusChartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                border: "0",
                borderRadius: 12,
                boxShadow: "0 14px 30px rgba(25,29,51,0.12)",
                fontSize: 12,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {data.map((item, index) => (
          <span key={item.status} className="inline-flex min-w-0 items-center gap-2 text-[11px] text-muted-foreground">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: statusChartColors[index % statusChartColors.length] }}
            />
            <span className="truncate">{item.status}</span>
            <span className="ml-auto font-semibold text-foreground">{item.total}</span>
          </span>
        ))}
      </div>
    </Card>
  );
}

function SourceModuleCard({
  sources,
  modules,
}: {
  sources: { source: string; label: string; total: number }[];
  modules: { label: string; total: number }[];
}) {
  const sourceMax = Math.max(1, ...sources.map((s) => s.total));
  const moduleMax = Math.max(1, ...modules.map((m) => m.total));
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Origem & Módulo</h3>
          <p className="mt-1 text-xs text-muted-foreground">Canais e áreas mais acionadas.</p>
        </div>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </div>

      <div className="mt-4">
        <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <PhoneCall className="h-3 w-3" /> Origem
        </p>
        <div className="space-y-2">
          {sources.map((item) => (
            <BarRow key={item.source} label={item.label} value={item.total} max={sourceMax} color="#0b97c4" />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          <Layers className="h-3 w-3" /> Módulo
        </p>
        <div className="space-y-2">
          {modules.map((item) => (
            <BarRow key={item.label} label={item.label} value={item.total} max={moduleMax} color="#8d6bd8" />
          ))}
        </div>
      </div>
    </Card>
  );
}

function BarRow({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="grid grid-cols-[92px_minmax(0,1fr)_28px] items-center gap-3">
      <span className="truncate text-[12px] font-medium text-foreground">{label}</span>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="text-right text-[12px] font-semibold tabular-nums text-foreground">{value}</span>
    </div>
  );
}

