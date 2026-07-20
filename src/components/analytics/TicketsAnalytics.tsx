import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Headphones,
  Layers,
  MessageSquarePlus,
  MoreVertical,
  PhoneCall,
  Star,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ticketStatuses,
  type SupportTicket,
  type TicketStatus,
} from "@/lib/support-tickets-data";
import { useTickets } from "@/lib/tickets-store";

const sourceLabels = {
  Telefone: "Telefone",
  "Portal do cliente": "Portal",
  WhatsApp: "WhatsApp",
  Email: "Email",
};

// ============= Analytics dashboard components (Chamados) =============

function RevenueStyleCards({
  openTickets,
  inProgressTickets,
  overdueTickets,
  finishedTickets,
}: {
  openTickets: number;
  inProgressTickets: number;
  overdueTickets: number;
  finishedTickets: number;
}) {
  const cards = [
    {
      tag: "ABR",
      title: "Chamados Abertos",
      value: openTickets,
      change: "+18 hoje",
      helper: "Abertos e aguardando atendimento",
      tone: "from-[#ff9d00] to-[#ffb13b]",
      arrow: "bg-[#e28a00]",
      positive: true,
      bars: [34, 42, 28, 56, 48],
    },
    {
      tag: "AND",
      title: "Em Atendimento",
      value: inProgressTickets,
      change: "+8%",
      helper: "Chamados em atendimento",
      tone: "from-[#0b97c4] to-[#36b9df]",
      arrow: "bg-[#087fa6]",
      positive: true,
      bars: [26, 40, 44, 36, 52],
    },
    {
      tag: "SLA",
      title: "Chamados Atrasados",
      value: overdueTickets,
      change: "-5.0%",
      helper: "Exigem retorno imediato",
      tone: "from-[#ff1f25] to-[#ff4a50]",
      arrow: "bg-[#d80f15]",
      positive: false,
      bars: [46, 32, 28, 58, 38],
    },
    {
      tag: "FIN",
      title: "Finalizados Hoje",
      value: finishedTickets,
      change: "+12%",
      helper: "Concluídos pela equipe",
      tone: "from-[#18b978] to-[#36d695]",
      arrow: "bg-[#10955f]",
      positive: true,
      bars: [28, 48, 36, 62, 44],
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.tag}
          className="relative min-h-[152px] overflow-hidden rounded-[28px] border-0 bg-[#f6f7f9] pl-[74px] shadow-[0_14px_34px_rgba(15,23,42,0.08)] dark:bg-[#20263d]"
        >
          <div className={cn("absolute inset-y-0 left-0 w-[104px] overflow-hidden rounded-l-[28px] bg-gradient-to-b", card.tone)}>
            <span
              className={cn(
                "absolute right-[-26px] top-1/2 h-[74px] w-[74px] -translate-y-1/2 rotate-45 shadow-[10px_10px_18px_rgba(0,0,0,0.12)]",
                card.arrow,
              )}
              aria-hidden="true"
            />
            <span className="absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[17px] font-black tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.25)]">
              {card.tag}
            </span>
          </div>

          <div className="relative z-10 flex h-full min-h-[152px] flex-col justify-between rounded-l-[28px] bg-[#f6f7f9] px-6 py-5 dark:bg-[#20263d]">
            <div>
              <p className="text-[13px] font-medium text-muted-foreground">{card.title}</p>
              <p className="mt-2 text-[20px] font-bold leading-none tracking-tight text-foreground">
                {card.value} chamados
              </p>
            </div>
            <div
              className="grid items-end gap-3"
              style={{ gridTemplateColumns: "minmax(0, 1fr) 56px" }}
            >
              <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-1 text-[13px] font-semibold",
                    card.positive ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600",
                  )}
                >
                  {card.change}
                </span>
                <span
                  className="min-w-0 flex-1 text-[13px] leading-tight text-muted-foreground"
                  style={{
                    whiteSpace: "normal",
                    overflow: "visible",
                    textOverflow: "clip",
                  }}
                >
                  {card.helper}
                </span>
              </div>
              <div
                className="ml-auto flex items-end justify-end gap-[3px] opacity-80"
                style={{ width: 56, height: 40 }}
                aria-hidden="true"
              >
                {card.bars.map((height, index) => (
                  <span
                    key={index}
                    className="w-[6px] rounded-t bg-[#cfc6f4]"
                    style={{ height: Math.min(40, Math.round(height * 0.65)) }}
                  />
                ))}
              </div>
            </div>

          </div>
        </Card>
      ))}
    </div>
  );
}

const agentProfiles: Record<string, { name: string; role: string; avatar: string; rating: number }> = {
  PRCSUZ: {
    name: "Ana Ribeiro",
    role: "Analista de Suporte",
    avatar: "https://i.pravatar.cc/120?img=47",
    rating: 4.8,
  },
  PRCMAR: {
    name: "Marcos Ribeiro",
    role: "Especialista Sênior",
    avatar: "https://i.pravatar.cc/120?img=12",
    rating: 4.6,
  },
  PRCROG: {
    name: "Rogerio Lima",
    role: "Líder de Atendimento",
    avatar: "https://i.pravatar.cc/120?img=33",
    rating: 4.7,
  },
  PRCLCZ: {
    name: "Lucas Cruz",
    role: "Analista de Suporte",
    avatar: "https://i.pravatar.cc/120?img=59",
    rating: 4.5,
  },
  PRCGGC: {
    name: "Guilherme Costa",
    role: "Coordenador de Suporte",
    avatar: "https://i.pravatar.cc/120?img=15",
    rating: 4.9,
  },
  PRCPED: {
    name: "Pedro Almeida",
    role: "Analista de Sistemas",
    avatar: "https://i.pravatar.cc/120?img=52",
    rating: 4.4,
  },
  PRCTRE: {
    name: "Trevisan Silva",
    role: "Consultor Técnico",
    avatar: "https://i.pravatar.cc/120?img=65",
    rating: 4.3,
  },
};

function TopAgentsCard({ tickets }: { tickets: SupportTicket[] }) {
  const agents = useMemo(() => {
    const map = new Map<string, { operator: string; handled: number; finished: number }>();
    tickets.forEach((ticket) => {
      const key = ticket.owner;
      const current = map.get(key) ?? { operator: key, handled: 0, finished: 0 };
      current.handled += 1;
      if (ticket.status === "Finalizado") current.finished += 1;
      map.set(key, current);
    });
    return Array.from(map.values())
      .sort((a, b) => b.handled - a.handled)
      .slice(0, 4);
  }, [tickets]);

  return (
    <Card className="rounded-md border border-border/80 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.08)] dark:bg-card">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold tracking-tight text-foreground">
          Performance dos Operadores
        </h3>
        <Button
          type="button"
          variant="outline"
          className="h-9 cursor-pointer gap-2 rounded-md border-border bg-white px-3 text-xs font-semibold text-foreground shadow-none hover:bg-muted dark:bg-card"
        >
          <CalendarClock className="h-4 w-4" />
          Mensal
        </Button>
      </div>

      <div className="space-y-3">
        {agents.map((agent, index) => {
          const profile = agentProfiles[agent.operator] ?? {
            name: agent.operator,
            role: "Analista de Suporte",
            avatar: `https://i.pravatar.cc/120?u=${agent.operator}`,
            rating: 4.4,
          };
          const fallbackRates = [70, 95, 60, 80];
          const rawResolutionRate = agent.handled
            ? Math.round((agent.finished / agent.handled) * 100)
            : fallbackRates[index] ?? 70;
          const resolutionRate = Math.min(
            98,
            Math.max(fallbackRates[index] ?? 70, rawResolutionRate),
          );
          const activeDots = Math.round((resolutionRate / 100) * 18);
          const avgResolutionTime = (1.1 + index * 0.18 + agent.handled * 0.08).toFixed(1);

          return (
            <div
              key={agent.operator}
              className="flex flex-col gap-3 rounded-md border border-border/80 bg-white px-4 py-3 dark:bg-background/30 lg:flex-row lg:items-center lg:gap-5"
            >
              <div className="flex min-w-0 items-center gap-3 lg:w-[200px]">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                  loading="lazy"
                />
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-foreground">
                    {profile.name}
                  </p>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Star className="h-3 w-3 fill-[#ffb31a] text-[#ffb31a]" />
                    <span>{profile.rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>

              <div className="min-w-0 lg:w-[130px]">
                <p className="text-[11px] text-muted-foreground">Tempo médio</p>
                <p className="mt-0.5 text-[14px] font-bold text-foreground">{avgResolutionTime}h</p>
              </div>

              <div className="min-w-0 lg:w-[120px]">
                <p className="text-[11px] text-muted-foreground">Atendimentos</p>
                <p className="mt-0.5 text-[14px] font-bold text-foreground">{agent.handled}</p>
              </div>

              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex items-center justify-between gap-3">
                  <p className="text-[11px] text-muted-foreground">Taxa de resolução</p>
                  <p className="text-[13px] font-semibold text-foreground">{resolutionRate}%</p>
                </div>
                <div className="flex flex-wrap items-center gap-1">
                  {Array.from({ length: 18 }).map((_, dotIndex) => (
                    <span
                      key={dotIndex}
                      className={cn(
                        "h-2.5 w-2.5 rounded-full",
                        dotIndex < activeDots ? "bg-[#f26322]" : "bg-[#dfe3e8] dark:bg-muted",
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>

  );
}
const statisticsDays = [
  { day: "11", weekday: "QUI" },
  { day: "12", weekday: "SEX" },
  { day: "13", weekday: "SAB", warm: true },
  { day: "14", weekday: "DOM", warm: true },
  { day: "15", weekday: "SEG" },
  { day: "16", weekday: "TER" },
  { day: "17", weekday: "QUA" },
  { day: "18", weekday: "QUI" },
  { day: "19", weekday: "SEX" },
  { day: "20", weekday: "SAB", warm: true },
  { day: "21", weekday: "DOM", warm: true },
  { day: "22", weekday: "SEG" },
  { day: "23", weekday: "TER" },
  { day: "24", weekday: "QUA" },
  { day: "25", weekday: "QUI" },
  { day: "26", weekday: "SEX" },
  { day: "27", weekday: "SAB", warm: true },
  { day: "28", weekday: "DOM", warm: true },
  { day: "29", weekday: "SEG" },
  { day: "30", weekday: "TER", active: true },
  { day: "31", weekday: "QUA" },
  { day: "01", weekday: "QUI", outlined: true },
];

const hourlyStats = [
  { time: "7am", thisWeek: 28, lastWeek: 23 },
  { time: "8am", thisWeek: 45, lastWeek: 38 },
  { time: "9am", thisWeek: 86, lastWeek: 72 },
  { time: "10am", thisWeek: 120, lastWeek: 98 },
  { time: "11am", thisWeek: 96, lastWeek: 82 },
  { time: "12pm", thisWeek: 78, lastWeek: 66 },
  { time: "1pm", thisWeek: 65, lastWeek: 56 },
  { time: "2pm", thisWeek: 72, lastWeek: 61 },
  { time: "3pm", thisWeek: 88, lastWeek: 76 },
  { time: "4pm", thisWeek: 62, lastWeek: 53 },
  { time: "5pm", thisWeek: 48, lastWeek: 41 },
  { time: "6pm", thisWeek: 36, lastWeek: 29 },
];

function StatisticsCard() {
  return (
    <Card className="w-full max-w-full min-w-0 overflow-hidden rounded-[14px] border border-border/60 bg-white p-4 shadow-[0_10px_26px_rgba(25,29,51,0.06)] dark:bg-[#20263d] sm:p-5">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <h3 className="text-base font-bold tracking-tight text-foreground">Estatísticas</h3>
        <button
          type="button"
          className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md bg-muted/60 px-4 text-sm font-semibold text-foreground"
        >
          <CalendarClock className="h-4 w-4" />
          Últimos 7 dias
        </button>
      </div>

      <div className="mb-6 flex items-center gap-1.5 overflow-x-auto pb-1">
        <button className="grid h-[60px] w-[40px] shrink-0 cursor-pointer place-items-center rounded-md bg-muted/60 text-foreground">
          <ChevronLeft className="h-4 w-4" />
        </button>
        {statisticsDays.map((item) => (
          <button
            key={`${item.day}-${item.weekday}`}
            className={cn(
              "grid h-[60px] w-[44px] shrink-0 cursor-pointer place-items-center rounded-md bg-muted/45 text-center transition",
              item.active && "bg-[#a779c7] text-white",
              item.outlined && "border-2 border-[#7fb9ab] bg-white text-[#6aa899] dark:bg-[#20263d]",
            )}
          >
            <span>
              <span className="block text-[14px] font-black leading-none">{item.day}</span>
              <span
                className={cn(
                  "mt-1 block text-[9px] font-bold",
                  item.warm && !item.active ? "text-[#ff7a2f]" : "text-current",
                )}
              >
                {item.weekday}
              </span>
              <span className="mx-auto mt-1.5 block h-1 w-1 rounded-full bg-[#b9d899]" />
            </span>
          </button>
        ))}
        <button className="grid h-[60px] w-[40px] shrink-0 cursor-pointer place-items-center rounded-md bg-muted/60 text-foreground">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="h-[300px] w-full min-w-0 overflow-hidden">

        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={hourlyStats} margin={{ top: 12, right: 24, left: 0, bottom: 8 }}>
            <defs>
              <linearGradient id="statsPurple" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#b082cf" stopOpacity={0.95} />
                <stop offset="100%" stopColor="#8e62aa" stopOpacity={0.95} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(139,145,173,0.28)" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#66708a" }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              ticks={[0, 40, 80, 120, 160]}
              tick={{ fontSize: 12, fill: "#66708a" }}
              width={42}
            />
            <Tooltip
              contentStyle={{
                border: "0",
                borderRadius: 12,
                boxShadow: "0 14px 30px rgba(25,29,51,0.12)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="thisWeek" name="Esta semana" fill="url(#statsPurple)" radius={[5, 5, 0, 0]} maxBarSize={36} />
            <Line
              type="monotone"
              dataKey="lastWeek"
              name="Semana passada"
              stroke="#89c2b7"
              strokeWidth={2.5}
              dot={{ r: 4, strokeWidth: 3, stroke: "#89c2b7", fill: "#ffffff" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 flex flex-wrap justify-end gap-8 text-xs font-semibold text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-[#a779c7]" /> Esta semana
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-3 rounded-full border-2 border-[#89c2b7]" /> Semana passada
        </span>
      </div>
    </Card>
  );
}

const weeklyTopCompanies = [
  { company: "MIT", nfe: 8, basic: 4, financial: 3 },
  { company: "MRG", nfe: 7, basic: 5, financial: 2 },
  { company: "MSS", nfe: 6, basic: 3, financial: 4 },
  { company: "IMP", nfe: 3, basic: 7, financial: 2 },
  { company: "CTR", nfe: 2, basic: 6, financial: 3 },
  { company: "EPB", nfe: 3, basic: 5, financial: 2 },
];

function WeeklyBacklogCard() {
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Empresas que mais ligaram na semana</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Volume de chamados por empresa e tipo de problema.
          </p>
        </div>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyTopCompanies} margin={{ top: 16, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(139,145,173,0.18)" />
            <XAxis dataKey="company" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 600, fill: "#8b91ad" }} />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} width={40} />
            <Tooltip
              formatter={(value, name) => [`${value} chamado${Number(value) === 1 ? "" : "s"}`, name]}
              contentStyle={{
                border: "0",
                borderRadius: 12,
                boxShadow: "0 14px 30px rgba(25,29,51,0.12)",
                fontSize: 12,
              }}
            />
            <Bar dataKey="nfe" name="NF-e" fill="#8d6bd8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="basic" name="Básico / Terceiros" fill="#ff9f68" radius={[6, 6, 0, 0]} />
            <Bar dataKey="financial" name="Financeiro" fill="#ff5fc8" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-5 text-xs font-semibold text-muted-foreground">
        <LegendDot color="#8d6bd8" label="NF-e" />
        <LegendDot color="#ff9f68" label="Básico / Terceiros" />
        <LegendDot color="#ff5fc8" label="Financeiro" />
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
  const weekIndicators = [
    { icon: Clock3, label: "Primeira resposta", value: "24 min", delta: "-3 min", tone: "text-[#20bf6b]" },
    { icon: Headphones, label: "Em atendimento", value: "5", delta: "+1", tone: "text-[#20bf6b]" },
    { icon: UserRound, label: "Aguardando cliente", value: "3", delta: "0", tone: "text-muted-foreground" },
    { icon: AlertTriangle, label: "Fora do SLA", value: "1", delta: "-1", tone: "text-[#20bf6b]" },
  ];
  const slaSpark = [72, 75, 74, 78, 76, 80, 82];
  const sparkMax = Math.max(...slaSpark);
  const sparkMin = Math.min(...slaSpark);
  const sparkPoints = slaSpark
    .map((v, i) => {
      const x = (i / (slaSpark.length - 1)) * 100;
      const y = 100 - ((v - sparkMin) / Math.max(1, sparkMax - sparkMin)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

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

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Indicadores da semana
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {weekIndicators.map(({ icon: Icon, label, value, delta, tone }) => (
            <div
              key={label}
              className="flex flex-col gap-1 rounded-lg bg-muted/40 dark:bg-white/[0.03] px-3 py-2"
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Icon className="h-3 w-3" />
                {label}
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold tabular-nums text-foreground">{value}</span>
                <span className={cn("text-[10px] font-medium tabular-nums", tone)}>{delta}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-3 rounded-lg bg-muted/40 dark:bg-white/[0.03] px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-[11px] text-muted-foreground">Evolução do SLA</p>
            <p className="text-sm font-bold text-foreground">
              82% <span className="ml-1 text-[10px] font-medium text-[#20bf6b]">+5% na semana</span>
            </p>
          </div>
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-8 w-24 shrink-0">
            <polyline
              fill="none"
              stroke="#0b97c4"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={sparkPoints}
            />
          </svg>
        </div>
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

const statusChartColorMap: Record<string, string> = {
  "Em Aberto": "#f43f5e",
  "Em andamento": "#3b82f6",
  Ocupado: "#f59e0b",
  "Aguardando cliente": "#10b981",
  "Com especialista": "#8b5cf6",
  Agendamento: "#f97316",
  Finalizado: "#22c55e",
  Atrasado: "#ef4444",
  Cancelado: "#94a3b8",
};


function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(radians),
    y: cy + radius * Math.sin(radians),
  };
}

function polarAreaPath(
  cx: number,
  cy: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
) {
  const outerStart = polarPoint(cx, cy, outerRadius, startAngle);
  const outerEnd = polarPoint(cx, cy, outerRadius, endAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${cx} ${cy}`,
    `L ${outerStart.x} ${outerStart.y}`,
    `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${cx} ${cy}`,
    "Z",
  ].join(" ");
}

function StatusCategoriesCard({
  data,
}: {
  data: { status: TicketStatus; total: number }[];
}) {
  const [activeStatus, setActiveStatus] = useState<TicketStatus | null>(null);
  const max = Math.max(1, ...data.map((item) => item.total));
  const totalAll = data.reduce((acc, item) => acc + item.total, 0) || 1;
  const cx = 140;
  const cy = 114;
  const minRadius = 72;
  const maxRadius = 108;
  const angleStep = 360 / Math.max(1, data.length);
  const gap = 1.5;
  const rotation = 0;

  const toggle = (status: TicketStatus) =>
    setActiveStatus((prev) => (prev === status ? null : status));

  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <h3 className="text-base font-bold text-foreground">Chamados por status</h3>
      <p className="mt-1 text-xs text-muted-foreground">Distribuição atual do funil.</p>
      <div className="mt-4 flex h-[220px] items-center justify-center overflow-hidden">
        <svg viewBox="0 0 280 230" className="h-full w-full max-w-[280px]" role="img" aria-label="Chamados por status">
          {data.map((item, index) => {
            const startAngle = rotation + index * angleStep + gap / 2;
            const endAngle = rotation + (index + 1) * angleStep - gap / 2;
            const normalized = item.total / max;
            const outerRadius = minRadius + (maxRadius - minRadius) * Math.max(0.22, normalized);
            const midAngle = (startAngle + endAngle) / 2;
            const isActive = activeStatus === item.status;
            const hasActive = activeStatus !== null;
            const baseOffset = item.total === max || index % 3 === 1 ? 7 : 0;
            const offset = isActive ? baseOffset + 8 : baseOffset;
            const exploded = polarPoint(0, 0, offset, midAngle);
            const color = statusChartColorMap[item.status] ?? "#94a3b8";

            return (
              <path
                key={item.status}
                d={polarAreaPath(cx + exploded.x, cy + exploded.y, outerRadius, startAngle, endAngle)}
                fill={color}
                stroke="hsl(var(--card))"
                strokeWidth="2"
                onClick={() => toggle(item.status)}
                style={{
                  cursor: "pointer",
                  opacity: hasActive && !isActive ? 0.35 : 1,
                  transition: "opacity 200ms, transform 200ms",
                }}
                className="hover:opacity-90"
              >
                <title>{`${item.status}: ${item.total} chamado${item.total === 1 ? "" : "s"}`}</title>
              </path>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-x-4 divide-y divide-border/60 sm:grid-cols-2 sm:gap-x-5 sm:divide-y-0 sm:[&>*:nth-child(n+3)]:border-t sm:[&>*]:border-border/60">
        {data.map((item) => {
          const color = statusChartColorMap[item.status] ?? "#94a3b8";
          const pct = Math.round((item.total / totalAll) * 100);
          const isActive = activeStatus === item.status;
          return (
            <button
              key={item.status}
              type="button"
              onClick={() => toggle(item.status)}
              className={cn(
                "group flex flex-col gap-1.5 rounded-md px-2 py-2 text-left transition",
                "hover:bg-muted/40 dark:hover:bg-white/[0.03]",
                isActive && "bg-muted/60 dark:bg-white/[0.05]",
              )}
              style={{ cursor: "pointer" }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 shrink-0 rounded-full"
                  style={{ background: color }}
                />
                <span className="min-w-0 flex-1 whitespace-nowrap text-[12px] font-medium text-foreground">
                  {item.status}
                </span>
                <span className="ml-auto text-[13px] font-medium tabular-nums text-foreground">
                  {item.total}
                </span>
              </div>
              <div className="flex items-center gap-2 pl-[18px]">
                <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted/70 dark:bg-white/[0.06]">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${pct}%`, background: color }}
                  />
                </div>
                <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                  {pct}%
                </span>
              </div>
            </button>
          );
        })}
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
        <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <PhoneCall className="h-3 w-3" /> Origem
        </p>
        <div className="space-y-2">
          {sources.map((item) => (
            <BarRow key={item.source} label={item.label} value={item.total} max={sourceMax} color="#0b97c4" />
          ))}
        </div>
      </div>

      <div className="mt-5">
        <p className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <Layers className="h-3 w-3" /> Módulo
        </p>
        <div className="space-y-2">
          {modules.map((item) => (
            <BarRow key={item.label} label={item.label} value={item.total} max={moduleMax} color="#8d6bd8" />
          ))}
        </div>
      </div>

      <div className="mt-5 border-t border-border/60 pt-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Resumo do período
        </p>
        <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 divide-border/60 sm:grid-cols-4 sm:divide-x">
          {[
            { icon: PhoneCall, label: "Canal principal", value: "Telefone" },
            { icon: Layers, label: "Módulo mais acionado", value: "NFE" },
            { icon: MessageSquarePlus, label: "Interações", value: "10" },
            { icon: CalendarClock, label: "Horário de pico", value: "10h–11h" },
          ].map(({ icon: Icon, label, value }, i) => (
            <div key={label} className={cn("flex flex-col gap-0.5", i > 0 && "sm:pl-3")}>
              <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Icon className="h-3 w-3" />
                {label}
              </span>
              <span className="text-sm font-bold text-foreground">{value}</span>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-muted/40 dark:bg-white/[0.03] px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          Telefone concentra 40% dos contatos e NFE representa 40% das solicitações.
        </p>
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
      <span className="text-right text-[12px] font-medium tabular-nums text-foreground">{value}</span>
    </div>
  );
}

export function TicketsAnalyticsSection() {
  const supportTickets = useTickets();

  const openTickets = supportTickets.filter(
    (ticket) => !["Finalizado", "Cancelado"].includes(ticket.status),
  ).length;
  const inProgressTickets = supportTickets.filter((ticket) => ticket.status === "Em andamento").length;
  const overdueTickets = supportTickets.filter((ticket) => ticket.status === "Atrasado").length;
  const portalTickets = supportTickets.filter((ticket) => ticket.source === "Portal do cliente").length;
  const finishedTickets = supportTickets.filter((ticket) => ticket.status === "Finalizado").length;
  const resolutionRate = supportTickets.length
    ? Math.round((finishedTickets / supportTickets.length) * 100)
    : 0;
  const avgHandlingLabel = "01h 47min";
  const slaMedio = 82;

  const statusDistribution = ticketStatuses
    .filter((status) => status !== "Atrasado" && status !== "Cancelado")
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
    <section className="space-y-6">
      <RevenueStyleCards
        openTickets={openTickets}
        inProgressTickets={inProgressTickets}
        overdueTickets={overdueTickets}
        finishedTickets={finishedTickets}
      />

      <div id="analytics-detalhado" className="grid scroll-mt-24 grid-cols-1 gap-6 xl:grid-cols-[0.92fr_1.35fr]">
        <TopAgentsCard tickets={supportTickets} />
        <StatisticsCard />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <WeeklyBacklogCard />
        <SlaProfileCard
          slaMedio={slaMedio}
          avgHandlingLabel={avgHandlingLabel}
          resolutionRate={resolutionRate}
          portalTickets={portalTickets}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <StatusCategoriesCard data={statusDistribution} />
        <SourceModuleCard sources={sourceDistribution} modules={moduleDistribution} />
      </div>
    </section>
  );
}
