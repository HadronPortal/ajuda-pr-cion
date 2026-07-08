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
  Headphones,
  LockKeyhole,
  MessageSquarePlus,
  PhoneCall,
  Search,
  SlidersHorizontal,
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
  const overdueTickets = supportTickets.filter((ticket) => ticket.status === "Atrasado").length;
  const portalTickets = supportTickets.filter((ticket) => ticket.source === "Portal do cliente").length;
  const finishedTickets = supportTickets.filter((ticket) => ticket.status === "Finalizado").length;

  const statusDistribution = ticketStatuses
    .map((status) => ({
      status,
      total: supportTickets.filter((ticket) => ticket.status === status).length,
    }))
    .filter((item) => item.total > 0);

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

      <section className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Chamados abertos"
          value={openTickets}
          trend="+18 hoje"
          icon={Headphones}
          tone="bg-primary/12 text-primary"
        />
        <MetricCard
          label="Atrasados"
          value={overdueTickets}
          trend="exigem retorno"
          icon={AlertTriangle}
          tone="bg-destructive/12 text-destructive"
        />
        <MetricCard
          label="Criados pelo cliente"
          value={portalTickets}
          trend="novo fluxo do portal"
          icon={UserRound}
          tone="bg-[#e7faf1] text-[#1f9860]"
        />
        <MetricCard
          label="Finalizados"
          value={finishedTickets}
          trend="ultimas 24h"
          icon={CheckCircle2}
          tone="bg-success/12 text-success"
        />
      </section>

      <section className="mb-6 grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)]">
        <Card className="min-w-0 rounded-[14px] border-0 bg-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-base font-bold text-foreground">Volume por dia</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Abertos, finalizados e atrasados na semana atual.
              </p>
            </div>
            <Badge variant="secondary" className="rounded-full">Dia / semana</Badge>
          </div>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={dailyTicketAnalytics} margin={{ left: -16, right: 10, top: 8 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} width={36} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                dataKey="opened"
                type="monotone"
                stroke="var(--color-opened)"
                fill="var(--color-opened)"
                fillOpacity={0.16}
                strokeWidth={2.5}
              />
              <Area
                dataKey="finished"
                type="monotone"
                stroke="var(--color-finished)"
                fill="var(--color-finished)"
                fillOpacity={0.12}
                strokeWidth={2.5}
              />
              <Area
                dataKey="overdue"
                type="monotone"
                stroke="var(--color-overdue)"
                fill="var(--color-overdue)"
                fillOpacity={0.08}
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        </Card>

        <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-1">
          <Card className="rounded-[14px] border-0 bg-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
            <p className="text-base font-bold text-foreground">Backlog semanal</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Comparativo entre abertura, finalização e saldo.
            </p>
            <ChartContainer config={chartConfig} className="mt-3 h-[190px] w-full">
              <BarChart data={weeklyTicketAnalytics} margin={{ left: -20, right: 0, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} width={34} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="opened" fill="var(--color-opened)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="finished" fill="var(--color-finished)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>

          <Card className="rounded-[14px] border-0 bg-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
            <p className="text-base font-bold text-foreground">Distribuicao por status</p>
            <div className="mt-3 grid grid-cols-[132px_minmax(0,1fr)] items-center gap-3">
              <ChartContainer config={chartConfig} className="h-[132px] w-[132px]">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    dataKey="total"
                    nameKey="status"
                    innerRadius={38}
                    outerRadius={58}
                    paddingAngle={3}
                  >
                    {statusDistribution.map((item, index) => (
                      <Cell
                        key={item.status}
                        fill={[
                          "var(--color-primary)",
                          "var(--color-success)",
                          "var(--color-destructive)",
                          "var(--color-chart-2)",
                          "var(--color-chart-4)",
                        ][index % 5]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent nameKey="status" />} />
                </PieChart>
              </ChartContainer>
              <div className="min-w-0 space-y-2">
                {statusDistribution.slice(0, 5).map((item) => (
                  <div key={item.status} className="flex min-w-0 items-center justify-between gap-2 text-xs">
                    <span className="truncate text-muted-foreground">{item.status}</span>
                    <span className="font-semibold text-foreground">{item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
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

      <Card className="overflow-hidden rounded-[14px] border-0 bg-card shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
        <div className="border-b border-border px-5 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
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
        </div>
        <div className="app-scrollbar overflow-x-auto">
          <table className="w-full min-w-[1080px] text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <TableHead>Status/ID</TableHead>
                <TableHead>P</TableHead>
                <TableHead>Registro</TableHead>
                <TableHead>Atualizado</TableHead>
                <TableHead>Atendente</TableHead>
                <TableHead>Responsavel</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Contato</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Acoes</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTickets.map((ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </tbody>
          </table>
        </div>
      </Card>
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

function TableHead({ children }: { children: React.ReactNode }) {
  return <th className="whitespace-nowrap px-4 py-3 text-left font-medium">{children}</th>;
}

function TicketRow({ ticket }: { ticket: SupportTicket }) {
  return (
    <tr className="transition hover:bg-muted/35">
      <td className="px-4 py-3 align-top">
        <div className="flex min-w-0 flex-col gap-1">
          <Badge className={cn("w-fit rounded-full border text-[10px]", statusTone[ticket.status])}>
            {ticket.status}
          </Badge>
          <span className="font-mono text-xs font-semibold text-foreground">{ticket.protocol}</span>
        </div>
      </td>
      <td className="px-4 py-3 align-top">
        <Badge className={cn("rounded-full text-[10px]", priorityTone[ticket.priority])}>
          {ticket.priority}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-4 py-3 align-top text-muted-foreground">
        <DateCell value={ticket.openedAt} icon={CalendarClock} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 align-top text-muted-foreground">
        <DateCell value={ticket.updatedAt} icon={Clock3} />
      </td>
      <td className="px-4 py-3 align-top font-medium text-foreground">{ticket.attendant}</td>
      <td className="px-4 py-3 align-top">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{ticket.owner}</span>
          {ticket.lockedBy && (
            <span title={`Chamado ocupado por ${ticket.lockedBy}`} className="text-warning-foreground">
              <LockKeyhole className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </td>
      <td className="max-w-[240px] px-4 py-3 align-top">
        <p className="truncate font-semibold text-foreground">
          {ticket.clientCode} - {ticket.clientName}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{sourceLabels[ticket.source]}</p>
      </td>
      <td className="px-4 py-3 align-top text-muted-foreground">{ticket.contact}</td>
      <td className="max-w-[260px] px-4 py-3 align-top">
        <p className="truncate font-medium text-foreground">{ticket.subject}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{ticket.module}</p>
      </td>
      <td className="px-4 py-3 align-top">
        <Button variant="ghost" size="sm" className="cursor-pointer rounded-xl text-primary hover:text-primary">
          Abrir
          <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </td>
    </tr>
  );
}

function DateCell({ value, icon: Icon }: { value: string; icon: typeof CalendarClock }) {
  const date = new Date(value);
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5" />
      {date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}{" "}
      {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}
