import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  ticketStatuses,
  weeklyTicketAnalytics,
  type SupportTicket,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-tickets-data";

const ticketPriorities: TicketPriority[] = ["Alta", "Media", "Baixa"];
import { useTickets, useTicketHistory, ticketsStore } from "@/lib/tickets-store";
import { FileText } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
  component: TicketsPage,
});

const statusTone: Record<TicketStatus, string> = {
  Atrasado: "bg-destructive/12 text-destructive border-destructive/20",
  "Em Aberto": "bg-primary/12 text-primary border-primary/20",
  Ocupado: "bg-[#fff1d6] text-[#b66a00] border-[#ffd78a] dark:bg-[#4d3516] dark:text-[#ffd28a] dark:border-[#7a5520]",
  "Em andamento": "bg-[#e8f3ff] text-[#246cb5] border-[#bfddff] dark:bg-[#17314e] dark:text-[#9dcaff] dark:border-[#24527d]",
  "Aguardando cliente": "bg-[#f2eaff] text-[#7253bd] border-[#d9c9ff] dark:bg-[#2e2549] dark:text-[#c7b8ff] dark:border-[#4b3a78]",
  "Com especialista": "bg-[#e7faf1] text-[#1f9860] border-[#bdeed6] dark:bg-[#14382b] dark:text-[#8ee8be] dark:border-[#226447]",
  Agendamento: "bg-[#fff8dd] text-[#9c7610] border-[#f4df85] dark:bg-[#403817] dark:text-[#f3d66d] dark:border-[#695b22]",
  Finalizado: "bg-success/12 text-success border-success/20",
  Cancelado: "bg-muted text-muted-foreground border-border",
};

const priorityTone: Record<TicketPriority, string> = {
  Alta: "bg-destructive/10 text-destructive",
  Media: "bg-warning/16 text-warning-foreground",
  Baixa: "bg-muted text-muted-foreground",
};

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
};

const initialFilters: Filters = {
  status: "Todos",
  priority: "Todas",
  query: "",
};

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
    return supportTickets.filter((ticket) => {
      if (filters.status !== "Todos" && ticket.status !== filters.status) return false;
      if (filters.priority !== "Todas" && ticket.priority !== filters.priority) return false;
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
        actions={
          <Button size="sm" className="rounded-xl shadow-[0_10px_22px_rgba(11,151,196,0.18)]">
            <MessageSquarePlus className="mr-1.5 h-4 w-4" />
            Novo chamado
          </Button>
        }
      />

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative order-1 min-w-0 flex-1 sm:order-none">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={filters.query}
              onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
              type="search"
              placeholder="Buscar por cliente, protocolo, assunto, contato..."
              className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className="h-9 cursor-pointer rounded-lg border border-border bg-background px-2.5 pr-7 text-[13px] outline-none focus:ring-2 focus:ring-ring sm:w-[150px]"
            >
              <option>Todos</option>
              {ticketStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <select
              value={filters.priority}
              onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
              className="h-9 cursor-pointer rounded-lg border border-border bg-background px-2.5 pr-7 text-[13px] outline-none focus:ring-2 focus:ring-ring sm:w-[130px]"
            >
              <option>Todas</option>
              {ticketPriorities.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-9 shrink-0 cursor-pointer rounded-lg px-3 text-[13px] text-muted-foreground hover:text-foreground"
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
        <Badge variant="secondary" className="rounded-full">
          CRM lado suporte
        </Badge>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredTickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onOpen={openTicketDetail}
            onHistory={openTicketHistory}
          />
        ))}
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

function computeSla(ticket: SupportTicket) {
  const target = 24; // hours SLA
  const openedAt = new Date(ticket.openedAt).getTime();
  const now = new Date("2026-07-08T10:00:00").getTime();
  const hours = Math.max(0, (now - openedAt) / 36e5);
  const rawPct = ticket.status === "Atrasado" ? 100 : Math.min(100, (hours / target) * 100);
  const pct = Math.round(rawPct);
  let tone: "ok" | "warn" | "late" = "ok";
  if (ticket.status === "Atrasado" || pct >= 90) tone = "late";
  else if (pct >= 60) tone = "warn";
  return { pct, tone };
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

const sourceIcons: Record<SupportTicket["source"], typeof PhoneCall> = {
  Telefone: PhoneCall,
  "Portal do cliente": MessageSquarePlus,
  WhatsApp: MessageSquarePlus,
  Email: MessageSquarePlus,
};

const slaGaugeStroke: Record<"ok" | "warn" | "late", string> = {
  ok: "stroke-success",
  warn: "stroke-warning",
  late: "stroke-destructive",
};

function SlaGauge({ pct, tone }: { pct: number; tone: "ok" | "warn" | "late" }) {
  // Semicircle: path from (10,50) arc to (90,50), radius 40.
  const circumference = Math.PI * 40; // ~125.66
  const dash = (pct / 100) * circumference;
  return (
    <div className="relative flex h-[68px] w-[100px] items-end justify-center">
      <svg viewBox="0 0 100 58" className="h-full w-full overflow-visible">
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          fill="none"
          strokeWidth={9}
          strokeLinecap="round"
          className="stroke-muted"
        />
        <path
          d="M10 50 A40 40 0 0 1 90 50"
          fill="none"
          strokeWidth={9}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
          className={cn("transition-all", slaGaugeStroke[tone])}
        />
      </svg>
      <div className="pointer-events-none absolute inset-x-0 bottom-1 flex justify-center">
        <span className={cn("text-[15px] font-bold leading-none", slaTextTone[tone])}>
          {pct}%
        </span>
      </div>
    </div>
  );
}

function TicketCard({
  ticket,
  onOpen,
  onHistory,
}: {
  ticket: SupportTicket;
  onOpen?: (ticket: SupportTicket) => void;
  onHistory?: (ticket: SupportTicket) => void;
}) {
  const sla = computeSla(ticket);
  const SourceIcon = sourceIcons[ticket.source] ?? PhoneCall;

  const handleAssume = (e: React.MouseEvent) => {
    e.stopPropagation();
    ticketsStore.assumeTicket(ticket.id);
    toast.success(`Chamado ${ticket.protocol} assumido.`);
  };

  return (
    <Card className="flex min-w-0 flex-col gap-4 rounded-[16px] border border-border/70 bg-card p-4 shadow-[0_10px_28px_rgba(25,29,51,0.05)] transition hover:shadow-[0_14px_32px_rgba(25,29,51,0.09)] sm:p-5">
      {/* Top: icon + title + client / protocol + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
            <FileText className="h-5 w-5" />
          </div>
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

      {/* Middle: info grid + SLA gauge */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-stretch">
        <dl className="grid min-w-0 flex-1 grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
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

        <div className="flex shrink-0 flex-col items-center justify-center gap-1 rounded-xl border border-border/60 bg-muted/40 px-3 py-2 sm:w-[118px]">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            SLA
          </span>
          <SlaGauge pct={sla.pct} tone={sla.tone} />
        </div>
      </div>

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
        <Button className="mt-6 rounded-full bg-white dark:bg-[#20263d] px-6 text-foreground hover:bg-white/90">
          Ver painel completo <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
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
          <AreaChart data={dailyTicketAnalytics} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
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
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} width={30} />
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
          <BarChart data={weeklyTicketAnalytics} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,145,173,0.18)" />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} width={30} />
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

