import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  AlertOctagon,
  Clock,
  CheckCircle2,
  Inbox,
  UserRoundCheck,
  ArrowRight,
  Timer,
  Activity,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useKanbanCards } from "@/lib/kanban-store";
import {
  kanbanColumnsDef,
  kanbanMembers,
  kanbanClients,
  priorities,
  cardTypes,
  priorityMeta,
  type KanbanCard,
  type Priority,
} from "@/lib/kanban-data";

export const Route = createFileRoute("/kanban-dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Kanban — Portal Prócion" },
      {
        name: "description",
        content:
          "Visão executiva do Kanban Prócion: métricas, distribuição por status, prioridade e atividades recentes.",
      },
    ],
  }),
  component: KanbanDashboard,
});

type Period = "7" | "30" | "90" | "365" | "all";
type Filters = {
  period: Period;
  client: string;
  assignee: string;
  type: string;
  priority: string;
};

const emptyFilters: Filters = {
  period: "30",
  client: "all",
  assignee: "all",
  type: "all",
  priority: "all",
};

const periodLabels: Record<Period, string> = {
  "7": "Últimos 7 dias",
  "30": "Últimos 30 dias",
  "90": "Últimos 90 dias",
  "365": "Últimos 12 meses",
  all: "Todo o período",
};

const priorityColor: Record<Priority, string> = {
  Baixa: "var(--muted-foreground)",
  Média: "var(--accent)",
  Alta: "var(--warning)",
  Crítica: "var(--destructive)",
};

function isWithinPeriod(iso: string, period: Period) {
  if (period === "all") return true;
  const days = parseInt(period, 10);
  const target = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  const from = new Date();
  from.setDate(from.getDate() - days);
  return target >= from;
}

function daysBetween(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / (1000 * 60 * 60 * 24));
}

function KanbanDashboard() {
  const allCards = useKanbanCards();
  const [filters, setFilters] = useState<Filters>(emptyFilters);

  const activeFilterCount = Object.entries(filters).filter(
    ([k, v]) => k !== "period" && v !== "all",
  ).length;

  const cards = useMemo(
    () =>
      allCards.filter((c) => {
        if (c.archived) return false;
        if (filters.client !== "all" && c.client !== filters.client) return false;
        if (filters.assignee !== "all" && c.assigneeId !== filters.assignee) return false;
        if (filters.type !== "all" && c.type !== filters.type) return false;
        if (filters.priority !== "all" && c.priority !== filters.priority) return false;
        return isWithinPeriod(c.dueDate, filters.period);
      }),
    [allCards, filters],
  );

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const metrics = useMemo(() => {
    const open = cards.filter((c) => c.columnId !== "concluido");
    const critical = open.filter((c) => c.priority === "Crítica");
    const waiting = cards.filter((c) => c.columnId === "aguardando-cliente");
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const doneMonth = cards.filter((c) => {
      if (c.columnId !== "concluido") return false;
      const d = new Date(c.dueDate + "T00:00:00");
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
    // Mock tempo médio: dif entre due e hoje para concluídos, absoluto
    const done = cards.filter((c) => c.columnId === "concluido");
    const avg =
      done.length === 0
        ? 0
        : done.reduce(
            (sum, c) =>
              sum + Math.abs(daysBetween(new Date(c.dueDate + "T00:00:00"), today)),
            0,
          ) / done.length;
    return {
      open: open.length,
      critical: critical.length,
      waiting: waiting.length,
      doneMonth: doneMonth.length,
      avgDays: avg,
    };
  }, [cards, today]);

  const byStatus = useMemo(
    () =>
      kanbanColumnsDef.map((col) => ({
        name: col.title,
        value: cards.filter((c) => c.columnId === col.id).length,
        id: col.id,
      })),
    [cards],
  );

  const byPriority = useMemo(
    () =>
      priorities.map((p) => ({
        name: p,
        value: cards.filter((c) => c.priority === p).length,
        color: priorityColor[p],
      })),
    [cards],
  );

  const criticalCards = useMemo(
    () =>
      cards
        .filter((c) => c.priority === "Crítica" && c.columnId !== "concluido")
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 6),
    [cards],
  );

  const overdueCards = useMemo(
    () =>
      cards
        .filter(
          (c) =>
            c.columnId !== "concluido" &&
            new Date(c.dueDate + "T00:00:00") < today,
        )
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
        .slice(0, 6),
    [cards, today],
  );

  const clientRanking = useMemo(() => {
    const map = new Map<string, number>();
    cards.forEach((c) => map.set(c.client, (map.get(c.client) ?? 0) + 1));
    const total = cards.length || 1;
    return [...map.entries()]
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [cards]);

  const recentActivity = useMemo(() => {
    type Entry = {
      key: string;
      cardId: string;
      cardTitle: string;
      at: string;
      text: string;
      authorId?: string;
    };
    const all: Entry[] = [];
    for (const c of cards) {
      for (const a of c.activity ?? []) {
        all.push({
          key: `${c.id}-${a.id}`,
          cardId: c.id,
          cardTitle: c.title,
          at: a.at,
          text: a.text,
          authorId: a.authorId,
        });
      }
    }
    return all.sort((a, b) => b.at.localeCompare(a.at)).slice(0, 8);
  }, [cards]);

  const clearFilters = () => setFilters(emptyFilters);

  return (
    <AppShell>
      <PageHeader
        title="Dashboard Kanban"
        description="Visão executiva das demandas em andamento, atrasos e produtividade da equipe."
        actions={
          <Button asChild variant="outline" size="sm">
            <Link to="/kanban">
              Ir para o quadro <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        }
      />

      {/* Filtros */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 items-center">
        <Select
          value={filters.period}
          onValueChange={(v) => setFilters({ ...filters, period: v as Period })}
        >
          <SelectTrigger className="w-full md:w-[220px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(Object.keys(periodLabels) as Period[]).map((p) => (
              <SelectItem key={p} value={p}>
                {periodLabels[p]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 flex-wrap">
          {activeFilterCount > 0 && (
            <>
              <span className="text-xs text-muted-foreground">Ativos:</span>
              {(["client", "assignee", "type", "priority"] as const).map((k) => {
                const v = filters[k];
                if (v === "all") return null;
                const label =
                  k === "assignee"
                    ? kanbanMembers.find((m) => m.id === v)?.name ?? v
                    : v;
                return (
                  <Badge key={k} variant="secondary" className="text-[11px] gap-1 pr-1">
                    {label}
                    <button
                      onClick={() => setFilters({ ...filters, [k]: "all" })}
                      className="ml-0.5 rounded hover:bg-muted-foreground/10 p-0.5"
                      aria-label="Remover filtro"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                Limpar
              </button>
            </>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="md:justify-self-end">
              <SlidersHorizontal className="h-4 w-4 mr-1.5" />
              Filtros
              {activeFilterCount > 0 && (
                <Badge className="ml-2 h-5 min-w-5 px-1 bg-primary text-primary-foreground">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-4" align="end">
            <p className="text-sm font-semibold mb-3">Filtros</p>
            <div className="space-y-3">
              <FilterSelect
                label="Cliente"
                value={filters.client}
                onChange={(v) => setFilters({ ...filters, client: v })}
                options={[
                  { value: "all", label: "Todos" },
                  { value: "Interno", label: "Interno" },
                  ...kanbanClients.map((c) => ({ value: c, label: c })),
                ]}
              />
              <FilterSelect
                label="Responsável"
                value={filters.assignee}
                onChange={(v) => setFilters({ ...filters, assignee: v })}
                options={[
                  { value: "all", label: "Todos" },
                  ...kanbanMembers.map((m) => ({ value: m.id, label: m.name })),
                ]}
              />
              <FilterSelect
                label="Tipo"
                value={filters.type}
                onChange={(v) => setFilters({ ...filters, type: v })}
                options={[
                  { value: "all", label: "Todos" },
                  ...cardTypes.map((t) => ({ value: t, label: t })),
                ]}
              />
              <FilterSelect
                label="Prioridade"
                value={filters.priority}
                onChange={(v) => setFilters({ ...filters, priority: v })}
                options={[
                  { value: "all", label: "Todas" },
                  ...priorities.map((p) => ({ value: p, label: p })),
                ]}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3 mb-6">
        <MetricCard
          icon={Inbox}
          tone="primary"
          label="Demandas abertas"
          value={metrics.open}
          hint={`${metrics.waiting} aguardando cliente`}
        />
        <MetricCard
          icon={AlertOctagon}
          tone="destructive"
          label="Críticas"
          value={metrics.critical}
          hint="Requerem ação imediata"
        />
        <MetricCard
          icon={UserRoundCheck}
          tone="accent"
          label="Aguardando cliente"
          value={metrics.waiting}
          hint="Sem ação nossa"
        />
        <MetricCard
          icon={CheckCircle2}
          tone="success"
          label="Concluídas no mês"
          value={metrics.doneMonth}
          hint={new Date().toLocaleDateString("pt-BR", { month: "long" })}
        />
        <MetricCard
          icon={Timer}
          tone="warning"
          label="Tempo médio"
          value={`${metrics.avgDays.toFixed(1)}d`}
          hint="Resolução dos concluídos"
        />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Demandas por status</h3>
              <p className="text-xs text-muted-foreground">
                Distribuição atual entre as colunas do quadro.
              </p>
            </div>
            <span className="text-xs text-muted-foreground">
              {cards.length} cards
            </span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byStatus} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                  height={50}
                />
                <YAxis
                  stroke="var(--muted-foreground)"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5">
          <div className="mb-4">
            <h3 className="text-sm font-semibold">Por prioridade</h3>
            <p className="text-xs text-muted-foreground">
              Distribuição de esforço por criticidade.
            </p>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={byPriority}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={80}
                  paddingAngle={2}
                  stroke="var(--background)"
                >
                  {byPriority.map((p) => (
                    <Cell key={p.name} fill={p.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 space-y-1.5">
            {byPriority.map((p) => (
              <div key={p.name} className="flex items-center gap-2 text-xs">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ background: p.color }}
                />
                <span className="flex-1">{p.name}</span>
                <span className="tabular-nums text-muted-foreground">{p.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <CardList
          title="Cards críticos"
          icon={AlertOctagon}
          tone="destructive"
          items={criticalCards}
          empty="Nenhum card crítico no momento."
        />
        <CardList
          title="Cards atrasados"
          icon={Clock}
          tone="warning"
          items={overdueCards}
          empty="Nenhum card atrasado."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Ranking clientes */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold">Clientes com mais demandas</h3>
              <p className="text-xs text-muted-foreground">
                Ranking no período selecionado.
              </p>
            </div>
          </div>
          {clientRanking.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">Sem dados.</p>
          ) : (
            <ul className="space-y-3">
              {clientRanking.map((c, i) => (
                <li key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-5 text-[11px] font-semibold text-muted-foreground tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="truncate">{c.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {c.count} · {c.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Atividades recentes */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Atividades recentes</h3>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              Sem atividades no período.
            </p>
          ) : (
            <ol className="relative border-l border-border ml-2 pl-4 space-y-3">
              {recentActivity.map((e) => {
                const author = kanbanMembers.find((m) => m.id === e.authorId);
                return (
                  <li key={e.key} className="relative">
                    <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
                    <p className="text-sm">
                      <span className="font-medium">{e.text}</span>{" "}
                      <span className="text-muted-foreground">em</span>{" "}
                      <Link
                        to="/kanban"
                        className="font-mono text-xs text-primary hover:underline"
                      >
                        {e.cardId}
                      </Link>
                    </p>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {e.cardTitle}
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {author?.name ? `${author.name} · ` : ""}
                      {new Date(e.at).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </li>
                );
              })}
            </ol>
          )}
        </Card>
      </div>
    </AppShell>
  );
}

// ============ helpers ============

const toneClasses: Record<string, { bg: string; text: string }> = {
  primary: { bg: "bg-primary/10", text: "text-primary" },
  destructive: { bg: "bg-destructive/10", text: "text-destructive" },
  success: { bg: "bg-success/15", text: "text-success" },
  warning: { bg: "bg-warning/25", text: "text-warning-foreground" },
  accent: { bg: "bg-accent/20", text: "text-accent-foreground" },
};

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  hint?: string;
  tone: keyof typeof toneClasses;
}) {
  const t = toneClasses[tone];
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
        </div>
        <div className={cn("grid h-9 w-9 place-items-center rounded-lg shrink-0", t.bg, t.text)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      {hint && (
        <p className="mt-2 text-[11px] text-muted-foreground truncate">{hint}</p>
      )}
    </Card>
  );
}

function CardList({
  title,
  icon: Icon,
  tone,
  items,
  empty,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: keyof typeof toneClasses;
  items: KanbanCard[];
  empty: string;
}) {
  const t = toneClasses[tone];
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={cn("grid h-7 w-7 place-items-center rounded-md", t.bg, t.text)}>
            <Icon className="h-3.5 w-3.5" />
          </div>
          <h3 className="text-sm font-semibold">{title}</h3>
          <span className="text-[11px] text-muted-foreground">({items.length})</span>
        </div>
        <Link
          to="/kanban"
          className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          Ver no quadro <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">{empty}</p>
      ) : (
        <ul className="divide-y divide-border -mx-1">
          {items.map((c) => {
            const assignee = kanbanMembers.find((m) => m.id === c.assigneeId);
            const due = new Date(c.dueDate + "T00:00:00");
            const overdue = due < new Date(new Date().setHours(0, 0, 0, 0));
            return (
              <li key={c.id} className="px-1 py-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="font-mono">{c.id}</span>
                      <span>·</span>
                      <span className="truncate">{c.client}</span>
                    </div>
                    <p className="text-sm font-medium leading-snug truncate mt-0.5">
                      {c.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground flex-wrap">
                      <span className="inline-flex items-center gap-1">
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            priorityMeta[c.priority].dot,
                          )}
                        />
                        {c.priority}
                      </span>
                      <span>·</span>
                      <span className={cn(overdue && "text-destructive font-medium")}>
                        {due.toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                      <span>·</span>
                      <span className="truncate">
                        {kanbanColumnsDef.find((k) => k.id === c.columnId)?.title}
                      </span>
                    </div>
                  </div>
                  {assignee && (
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarFallback
                        className={cn("text-[10px] font-semibold", assignee.color)}
                      >
                        {assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>
              {o.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
