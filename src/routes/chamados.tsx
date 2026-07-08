import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Headphones,
  History,
  LockKeyhole,
  MessageSquarePlus,
  PhoneCall,
  Search,
  SlidersHorizontal,
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
  supportTickets,
  ticketOperators,
  ticketStatuses,
  weeklyTicketAnalytics,
  type SupportTicket,
  type TicketPriority,
  type TicketStatus,
} from "@/lib/support-tickets-data";
import { cn } from "@/lib/utils";

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
  operator: string;
  dateType: string;
  query: string;
};

const initialFilters: Filters = {
  status: "Todos",
  operator: "Todos",
  dateType: "Registro",
  query: "",
};

function TicketsPage() {
  const [filters, setFilters] = useState<Filters>(initialFilters);

  const filteredTickets = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    return supportTickets.filter((ticket) => {
      if (filters.status !== "Todos" && ticket.status !== filters.status) return false;
      if (
        filters.operator !== "Todos" &&
        ticket.owner !== filters.operator &&
        ticket.attendant !== filters.operator
      ) {
        return false;
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
  }, [filters]);

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
          <DailyVolumeCard />
          <WeeklyBacklogCard />
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


      <section className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="rounded-[14px] border-0 bg-card p-4 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[180px_180px_180px_minmax(0,1fr)_auto]">
            <select
              value={filters.status}
              onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
              className="h-10 cursor-pointer rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Todos</option>
              {ticketStatuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
            <select
              value={filters.operator}
              onChange={(event) => setFilters((prev) => ({ ...prev, operator: event.target.value }))}
              className="h-10 cursor-pointer rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Todos</option>
              {ticketOperators.map((operator) => (
                <option key={operator}>{operator}</option>
              ))}
            </select>
            <select
              value={filters.dateType}
              onChange={(event) => setFilters((prev) => ({ ...prev, dateType: event.target.value }))}
              className="h-10 cursor-pointer rounded-xl border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Registro</option>
              <option>Atualizado</option>
            </select>
            <div className="relative min-w-0">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={filters.query}
                onChange={(event) => setFilters((prev) => ({ ...prev, query: event.target.value }))}
                type="search"
                placeholder="Buscar por cliente, protocolo, assunto, contato..."
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer rounded-xl"
              onClick={() => setFilters(initialFilters)}
            >
              <SlidersHorizontal className="mr-1.5 h-4 w-4" />
              Limpar
            </Button>
          </div>
        </Card>

        <Card className="rounded-[14px] border-0 bg-gradient-to-br from-primary/12 via-card to-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
              <PhoneCall className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-foreground">Fluxo novo do cliente</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                O cliente abre o chamado pelo Ajuda Procion; o suporte recebe aqui com origem
                "Portal do cliente", acompanha SLA e retorna pelo canal definido.
              </p>
            </div>
          </div>
        </Card>
      </section>

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
          <TicketCard key={ticket.id} ticket={ticket} />
        ))}
      </div>
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

function TicketCard({ ticket }: { ticket: SupportTicket }) {
  const sla = computeSla(ticket);
  return (
    <Card className="flex min-w-0 flex-col gap-4 rounded-[16px] border border-border/70 bg-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.05)] transition hover:shadow-[0_14px_32px_rgba(25,29,51,0.09)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold leading-snug text-foreground">
            {ticket.subject}
          </p>
          <p className="mt-1 truncate text-[12px] text-muted-foreground">
            <span className="font-semibold text-foreground">{ticket.clientCode}</span>
            {" · "}
            {ticket.clientName}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end">
          <span className="font-mono text-[11px] font-semibold text-foreground">
            {ticket.protocol}
          </span>
          <span className="mt-0.5 text-[11px] text-muted-foreground">
            {sourceLabels[ticket.source]}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Badge
          className={cn(
            "whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
            statusTone[ticket.status],
          )}
        >
          {ticket.status}
        </Badge>
        {ticket.lockedBy && (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[11px] font-medium text-warning-foreground">
            <LockKeyhole className="h-3 w-3" />
            Ocupado por {ticket.lockedBy}
          </span>
        )}
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
        <InfoRow label="Contato" value={ticket.contact} />
        <InfoRow label="Modulo" value={ticket.module} />
        <InfoRow label="Atendente" value={ticket.attendant} />
        <InfoRow label="Responsavel" value={ticket.owner} />
        <InfoRow
          label="Registro"
          value={<DateCell value={ticket.openedAt} icon={CalendarClock} />}
        />
        <InfoRow
          label="Atualizado"
          value={<DateCell value={ticket.updatedAt} icon={Clock3} />}
        />
      </dl>

      <div>
        <div className="mb-1 flex items-center justify-between text-[11px]">
          <span className="font-medium text-muted-foreground">SLA</span>
          <span className={cn("font-semibold", slaTextTone[sla.tone])}>{sla.pct}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className={cn("h-full rounded-full transition-all", slaBarTone[sla.tone])}
            style={{ width: `${sla.pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <Chip className={priorityTone[ticket.priority]}>{ticket.priority}</Chip>
        <Chip className="bg-primary/10 text-primary">
          <PhoneCall className="h-3 w-3" />
          {sourceLabels[ticket.source]}
        </Chip>
        <Chip className="bg-muted text-muted-foreground">
          <FolderKanban className="h-3 w-3" />
          {ticket.module}
        </Chip>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border/70 pt-3">
        <Button
          size="sm"
          className="h-8 cursor-pointer rounded-lg px-3 text-[12px] shadow-[0_6px_14px_rgba(11,151,196,0.18)]"
        >
          Abrir
          <ArrowUpRight className="ml-0.5 h-3.5 w-3.5" />
        </Button>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 cursor-pointer rounded-lg px-2 text-[12px] text-muted-foreground hover:text-foreground"
          >
            <UserPlus className="mr-1 h-3.5 w-3.5" />
            Assumir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 cursor-pointer rounded-lg px-2 text-[12px] text-muted-foreground hover:text-foreground"
          >
            <History className="mr-1 h-3.5 w-3.5" />
            Historico
          </Button>
        </div>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10.5px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 truncate text-[12.5px] font-medium text-foreground">{value}</dd>
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

function DateCell({ value, icon: Icon }: { value: string; icon: typeof CalendarClock }) {
  const date = new Date(value);
  return (
    <span className="inline-flex items-center gap-1 whitespace-nowrap">
      <Icon className="h-3 w-3" />
      {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}{" "}
      {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}


