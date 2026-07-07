import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  GitBranch,
  KanbanSquare,
  MoreVertical,
  Search,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal Prócion — Dashboard" },
      {
        name: "description",
        content:
          "Dashboard do Portal Prócion com indicadores, gráficos, base de conhecimento e tarefas do Kanban.",
      },
      { property: "og:title", content: "Portal Prócion" },
      {
        property: "og:description",
        content:
          "Central de ajuda e produtividade da Prócion Sistemas para clientes, parceiros e equipe interna.",
      },
    ],
  }),
  component: DashboardPage,
});

const weeklyStats = [
  { day: "Dom", suporte: 64, melhorias: 78 },
  { day: "Seg", suporte: 38, melhorias: 31 },
  { day: "Ter", suporte: 51, melhorias: 69 },
  { day: "Qua", suporte: 57, melhorias: 88 },
  { day: "Qui", suporte: 20, melhorias: 36 },
  { day: "Sex", suporte: 70, melhorias: 16 },
  { day: "Sab", suporte: 32, melhorias: 77 },
];

const completionData = [
  { day: "Dom", value: 42 },
  { day: "Seg", value: 48 },
  { day: "Ter", value: 44 },
  { day: "Qua", value: 62 },
  { day: "Qui", value: 55 },
  { day: "Sex", value: 72 },
  { day: "Sab", value: 68 },
];

const categoryData = [
  { name: "Suporte", value: 38, color: "#0b97c4" },
  { name: "Bug", value: 26, color: "#ff6b91" },
  { name: "Melhoria", value: 22, color: "#55d6be" },
  { name: "Implantação", value: 14, color: "#ffd166" },
];

const miniBarData = [
  { value: 44 },
  { value: 72 },
  { value: 58 },
  { value: 86 },
  { value: 63 },
];

const importantProjects = [
  { name: "NF-e Curitiba", label: "Fiscal", tone: "bg-[#e8f7fc] text-primary" },
  { name: "Produção fase 2", label: "Implantação", tone: "bg-[#fff4d8] text-[#c47a13]" },
  { name: "Portal Cliente", label: "Produto", tone: "bg-[#eafaf1] text-[#23a061]" },
];

function DashboardPage() {
  return (
    <AppShell>
      <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold text-primary">Portal Prócion</p>
          <h1 className="mt-1 text-[28px] font-bold tracking-tight text-[#191d33]">
            Dashboard
          </h1>
        </div>
        <div className="relative w-full md:w-[360px]">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8b91ad]" />
          <input
            type="search"
            placeholder="Buscar aqui..."
            className="h-12 w-full rounded-full border border-[#edf0f6] bg-white pl-11 pr-4 text-sm shadow-[0_10px_24px_rgba(25,29,51,0.04)] outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.1fr_1.1fr]">
        <div className="space-y-6">
          <HeroPanel />
          <ProjectStatistics />
          <CompletionRate />
        </div>

        <div className="space-y-6">
          <MetricGrid />
          <CompanyProfile />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <EmailCategories />
            <ImportantProjects />
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function HeroPanel() {
  return (
    <Card className="relative min-h-[250px] overflow-hidden rounded-[14px] border-0 bg-gradient-to-br from-[#0b97c4] via-[#0490d1] to-[#313866] p-8 text-white shadow-[0_18px_40px_rgba(11,151,196,0.22)]">
      <div className="relative z-10 max-w-[360px]">
        <h2 className="text-[26px] font-bold leading-tight">
          Gerencie suas demandas em um só lugar
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/78">
          Acompanhe suporte, implantação, versões e base de conhecimento com a visão executiva do Portal Prócion.
        </p>
        <Button asChild className="mt-7 rounded-full bg-white px-6 text-[#191d33] hover:bg-white/90">
          <Link to="/kanban">
            Abrir Kanban <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="absolute right-8 top-10 hidden h-[180px] w-[220px] md:block">
        <div className="absolute bottom-0 left-10 h-[92px] w-[142px] rounded-lg bg-white/75 shadow-xl" />
        <div className="absolute bottom-10 left-5 h-[66px] w-[86px] rounded-xl bg-[#33c3e8] shadow-lg">
          <div className="absolute left-4 top-4 flex h-9 items-end gap-1.5">
            {[18, 28, 36, 54, 42, 64].map((h, i) => (
              <span key={i} className="w-1.5 rounded-full bg-white" style={{ height: h }} />
            ))}
          </div>
        </div>
        <div className="absolute bottom-12 left-34 h-[86px] w-[120px] border-[7px] border-[#7d69d6]/35" />
        <div className="absolute bottom-20 right-8 h-4 w-4 rounded-full bg-[#ff8ecf]" />
        <div className="absolute right-16 top-8 h-8 w-8 rounded-full border-[10px] border-[#61c8e8]" />
        <div className="absolute bottom-24 left-24 h-2 w-2 rounded-full bg-white/80" />
      </div>
    </Card>
  );
}

function MetricGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <SmallMetricCard
        title="Clientes ativos"
        value="68"
        change="+0,5%"
        trend="up"
        visual={<MiniBars />}
      />
      <SmallMetricCard
        title="Tarefas concluídas"
        value="24"
        subtitle="76 restantes da meta"
        visual={<ProgressLine value={43} />}
      />
      <SmallMetricCard
        title="Total de demandas"
        value="562"
        change="-2%"
        trend="down"
        visual={<MiniWave color="#8d6bd8" />}
      />
      <SmallMetricCard
        title="Novos projetos"
        value="892"
        change="+0,5%"
        trend="up"
        visual={<MiniWave color="#7b61c9" rising />}
      />
    </div>
  );
}

function SmallMetricCard({
  title,
  value,
  subtitle,
  change,
  trend,
  visual,
}: {
  title: string;
  value: string;
  subtitle?: string;
  change?: string;
  trend?: "up" | "down";
  visual: React.ReactNode;
}) {
  return (
    <Card className="min-h-[126px] rounded-[14px] border-0 bg-white p-5 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="flex h-full items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-bold text-[#25293b]">{title}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-3xl font-bold tabular-nums text-[#191d33]">{value}</span>
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
          {subtitle && <p className="mt-1 text-xs text-[#fb5166]">{subtitle}</p>}
        </div>
        <div className="h-16 w-24 shrink-0">{visual}</div>
      </div>
    </Card>
  );
}

function MiniBars() {
  return (
    <div className="flex h-full items-center justify-end gap-2">
      {miniBarData.map((bar, index) => (
        <div key={index} className="flex h-14 w-2 items-center rounded-full bg-[#edf0f6]">
          <span
            className="mt-auto w-full rounded-full bg-[#7c65c9]"
            style={{ height: `${bar.value}%`, opacity: 0.62 + index * 0.08 }}
          />
        </div>
      ))}
    </div>
  );
}

function MiniWave({ color, rising = false }: { color: string; rising?: boolean }) {
  const data = rising
    ? [{ v: 25 }, { v: 34 }, { v: 31 }, { v: 58 }, { v: 49 }, { v: 72 }]
    : [{ v: 70 }, { v: 64 }, { v: 36 }, { v: 31 }, { v: 45 }, { v: 43 }];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 8, right: 4, left: 4, bottom: 8 }}>
        <Area type="monotone" dataKey="v" stroke={color} strokeWidth={4} fill="transparent" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ProgressLine({ value }: { value: number }) {
  return (
    <div className="flex h-full items-center">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#edf0f6]">
        <div className="h-full rounded-full bg-[#7c65c9]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ProjectStatistics() {
  return (
    <Card className="rounded-[14px] border-0 bg-white p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-[#191d33]">Estatísticas do projeto</h3>
        <div className="flex rounded-full bg-[#eef5ff] p-1 text-[11px] font-semibold text-[#8b91ad]">
          {["Mensal", "Semanal", "Diário"].map((item) => (
            <button
              key={item}
              className={cn(
                "rounded-full px-4 py-2 transition",
                item === "Diário" && "bg-white text-[#191d33] shadow-sm",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <StatLegend color="#8d6bd8" label="Total" value="246" />
        <StatLegend color="#ffd166" label="Em andamento" value="167" />
        <StatLegend color="#ff6bba" label="Inacabadas" value="28" />
      </div>

      <ProjectBarChart />

      <div className="mt-2 flex items-center gap-8 text-xs font-semibold text-[#555b75]">
        <span className="inline-flex items-center gap-2">
          Número <span className="h-3 w-6 rounded-full bg-[#8d6bd8]" />
        </span>
        <span className="inline-flex items-center gap-2">
          Análise <span className="h-3 w-6 rounded-full bg-[#8b91ad]" />
        </span>
      </div>
    </Card>
  );
}

function ProjectBarChart() {
  return (
    <div className="mt-2 h-[260px]">
      <div className="grid h-[220px] grid-cols-[34px_1fr] gap-3">
        <div className="flex h-full flex-col justify-between pb-7 pt-2 text-[11px] text-[#8b91ad]">
          {[100, 80, 60, 40, 20, 0].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="relative h-full border-b border-[#eef1f8]">
          {[0, 1, 2, 3, 4].map((line) => (
            <span
              key={line}
              className="absolute left-0 right-0 border-t border-[#eef1f8]"
              style={{ top: `${line * 20}%` }}
            />
          ))}
          <div className="relative z-10 grid h-full grid-cols-7 items-end gap-3 px-1 pb-7">
            {weeklyStats.map((item, index) => (
              <div key={item.day} className="group flex h-full items-end justify-center gap-2">
                <div
                  className="w-3.5 rounded-t-full bg-[#ff9f68] shadow-[0_8px_18px_rgba(255,159,104,0.22)] transition group-hover:opacity-85"
                  style={{ height: `${item.suporte}%` }}
                />
                <div
                  className={cn(
                    "w-3.5 rounded-t-full bg-[#ff5fc8] shadow-[0_8px_18px_rgba(255,95,200,0.20)] transition group-hover:opacity-85",
                    index === 2 && "bg-[repeating-linear-gradient(135deg,#ff5fc8_0_4px,#ff9dde_4px_8px)]",
                  )}
                  style={{ height: `${item.melhorias}%` }}
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 grid grid-cols-7 gap-3 px-1 text-center text-[11px] text-[#8b91ad]">
            {weeklyStats.map((item) => (
              <span key={item.day}>{item.day}</span>
            ))}
          </div>
          <div className="absolute left-[25%] top-[30%] hidden rounded-xl bg-white px-4 py-3 text-xs shadow-[0_16px_32px_rgba(25,29,51,0.12)] md:block">
            <p className="font-bold text-[#191d33]">56 projetos</p>
            <p className="mt-1 text-[#8b91ad]">24 out, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatLegend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <div className="min-w-0">
        <p className="text-lg font-bold leading-none text-[#191d33]">{value}</p>
        <p className="mt-1 truncate text-xs text-[#555b75]">{label}</p>
      </div>
    </div>
  );
}

function CompanyProfile() {
  return (
    <Card className="rounded-[14px] border-0 bg-white p-7 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="grid gap-6 md:grid-cols-[1fr_260px] md:items-center">
        <div>
          <h3 className="text-base font-bold text-[#191d33]">Perfil Prócion</h3>
          <p className="mt-1 text-sm font-semibold text-[#25293b]">Portal de Ajuda e Kanban</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-[#6f7590]">
            Visão consolidada das demandas, clientes, tarefas concluídas e evolução dos projetos internos.
          </p>
          <div className="mt-6 flex gap-3">
            <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full">
              <ArrowRight className="h-4 w-4 rotate-180" />
            </Button>
            <Button size="icon" className="h-9 w-9 rounded-full">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Gauge />
      </div>
    </Card>
  );
}

function Gauge() {
  return (
    <div className="mx-auto flex h-[190px] w-[240px] flex-col items-center justify-end">
      <div className="relative h-[140px] w-[220px] overflow-hidden">
        <div className="absolute left-0 top-0 h-[220px] w-[220px] rounded-full bg-[conic-gradient(from_270deg,#ff8ee4_0deg,#ff61cf_84deg,#eee7ff_84deg,#eee7ff_180deg,transparent_180deg)]" />
        <div className="absolute left-[42px] top-[42px] h-[136px] w-[136px] rounded-full bg-white" />
        <div className="absolute left-[74px] top-[74px] h-[72px] w-[72px] rounded-full bg-[#ede7ff]" />
        <div className="absolute left-[88px] top-[88px] h-[44px] w-[44px] rounded-full bg-[#8d6bd8]" />
        <div className="absolute left-[105px] top-[105px] h-2.5 w-2.5 rounded-full bg-white" />
        <div className="absolute left-[106px] top-[20px] h-[118px] w-4 origin-bottom rotate-[48deg] rounded-full bg-[#7d69d6]" />
      </div>
      <p className="-mt-5 text-sm font-bold text-[#8b91ad]">
        Em progresso <span className="text-[#20bf6b]">70%</span>
      </p>
    </div>
  );
}

function EmailCategories() {
  return (
    <Card className="rounded-[14px] border-0 bg-white p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <h3 className="text-base font-bold text-[#191d33]">Categorias</h3>
      <p className="mt-1 text-xs text-[#8b91ad]">Demandas por tipo</p>
      <div className="mt-5 h-[190px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={categoryData} innerRadius={48} outerRadius={74} paddingAngle={0} dataKey="value">
              {categoryData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {categoryData.map((item) => (
          <span key={item.name} className="inline-flex items-center gap-2 text-xs text-[#555b75]">
            <span className="h-2 w-2 rounded-full" style={{ background: item.color }} />
            {item.name}
          </span>
        ))}
      </div>
    </Card>
  );
}

function ImportantProjects() {
  return (
    <Card className="rounded-[14px] border-0 bg-white p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-[#191d33]">Projetos importantes</h3>
          <p className="mt-1 text-xs text-[#8b91ad]">Prioridades em andamento</p>
        </div>
        <MoreVertical className="h-5 w-5 text-[#8b91ad]" />
      </div>
      <div className="space-y-5">
        {importantProjects.map((project, index) => (
          <div key={project.name} className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#eef5ff]">
              {index === 0 && <KanbanSquare className="h-5 w-5 text-primary" />}
              {index === 1 && <Users className="h-5 w-5 text-[#c47a13]" />}
              {index === 2 && <BookOpen className="h-5 w-5 text-[#23a061]" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-[#25293b]">{project.name}</p>
              <p className="mt-1 text-xs text-[#8b91ad]">
                Otimização e acompanhamento no Kanban Prócion.
              </p>
              <Badge className={cn("mt-2 rounded-full px-2.5 py-0.5 text-[10px] hover:bg-current/0", project.tone)}>
                {project.label}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function CompletionRate() {
  return (
    <Card className="rounded-[14px] border-0 bg-white p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-[#191d33]">Taxa de conclusão</h3>
        <MoreVertical className="h-5 w-5 text-[#8b91ad]" />
      </div>
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={completionData} margin={{ top: 12, right: 10, left: -18, bottom: 0 }}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#8b91ad" }} />
            <Tooltip
              contentStyle={{
                border: "0",
                borderRadius: 12,
                boxShadow: "0 14px 30px rgba(25,29,51,0.12)",
                fontSize: 12,
              }}
            />
            <Area type="monotone" dataKey="value" stroke="#0b97c4" strokeWidth={3} fill="rgba(11,151,196,0.12)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3">
        <InfoPill icon={CheckCircle2} label="Concluído" value="74%" />
        <InfoPill icon={GitBranch} label="Versões" value="12" />
        <InfoPill icon={KanbanSquare} label="Cards" value="86" />
      </div>
    </Card>
  );
}

function InfoPill({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#f7f9fc] p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-[11px] text-[#8b91ad]">{label}</p>
      <p className="text-sm font-bold text-[#191d33]">{value}</p>
    </div>
  );
}
