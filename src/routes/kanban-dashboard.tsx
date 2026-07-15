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
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kanban-dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard Kanban — Portal Prócion" },
      {
        name: "description",
        content:
          "Visão executiva do Kanban Prócion: indicadores, distribuição, progresso e projetos importantes.",
      },
      { property: "og:title", content: "Portal Prócion" },
      {
        property: "og:description",
        content:
          "Central de ajuda e produtividade da Prócion Sistemas para clientes, parceiros e equipe interna.",
      },
    ],
  }),
  component: KanbanDashboardPage,
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
  { name: "NF-e Curitiba", label: "Fiscal", tone: "bg-primary/10 text-primary" },
  { name: "Produção fase 2", label: "Implantação", tone: "bg-[#fff4d8] text-[#c47a13]" },
  { name: "Portal Cliente", label: "Produto", tone: "bg-[#eafaf1] text-[#23a061]" },
];

function KanbanDashboardPage() {
  return (
    <AppShell>
      <PageHeader
        title="Dashboard Kanban"
        description="Visão executiva das demandas, progresso e produtividade da equipe."
        breadcrumbs={[
          { label: "Kanban Prócion", to: "/kanban" },
          { label: "Analytics" },
        ]}
        actions={
          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/kanban">
              Ir para o quadro <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

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
        <h2 className="text-[26px] font-medium leading-tight">
          Gerencie suas demandas em um só lugar
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/78">
          Acompanhe suporte, implantação, versões e base de conhecimento com a visão executiva do Portal Prócion.
        </p>
        <Button asChild className="mt-7 rounded-full bg-white dark:bg-[#20263d] px-6 text-foreground hover:bg-white/90">
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
              <span key={i} className="w-1.5 rounded-full bg-white dark:bg-[#20263d]" style={{ height: h }} />
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
    <Card className="min-h-[126px] rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-5 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="flex h-full items-center justify-between gap-4">
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
        <div key={index} className="flex h-14 w-2 items-center rounded-full bg-muted">
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
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-[#7c65c9]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function ProjectStatistics() {
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-base font-bold text-foreground">Estatísticas do projeto</h3>
        <div className="flex rounded-full bg-primary/10 p-1 text-[11px] font-medium text-muted-foreground">
          {["Mensal", "Semanal", "Diário"].map((item) => (
            <button
              key={item}
              className={cn(
                "rounded-full px-4 py-2 transition",
                item === "Diário" && "bg-white dark:bg-[#20263d] text-foreground shadow-sm",
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

      <div className="mt-2 flex items-center gap-8 text-xs font-semibold text-muted-foreground">
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
        <div className="flex h-full flex-col justify-between pb-7 pt-2 text-[11px] text-muted-foreground">
          {[100, 80, 60, 40, 20, 0].map((tick) => (
            <span key={tick}>{tick}</span>
          ))}
        </div>
        <div className="relative h-full border-b border-border">
          {[0, 1, 2, 3, 4].map((line) => (
            <span
              key={line}
              className="absolute left-0 right-0 border-t border-border"
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
          <div className="absolute bottom-0 left-0 right-0 grid grid-cols-7 gap-3 px-1 text-center text-[11px] text-muted-foreground">
            {weeklyStats.map((item) => (
              <span key={item.day}>{item.day}</span>
            ))}
          </div>
          <div className="absolute left-[25%] top-[30%] hidden rounded-xl bg-white dark:bg-[#20263d] px-4 py-3 text-xs shadow-[0_16px_32px_rgba(25,29,51,0.12)] md:block">
            <p className="font-bold text-foreground">56 projetos</p>
            <p className="mt-1 text-muted-foreground">24 out, 2026</p>
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
        <p className="text-lg font-bold leading-none text-foreground">{value}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function CompanyProfile() {
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-7 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="grid gap-6 md:grid-cols-[1fr_260px] md:items-center">
        <div>
          <h3 className="text-base font-bold text-foreground">Perfil Prócion</h3>
          <p className="mt-1 text-sm font-semibold text-foreground">Portal de Ajuda e Kanban</p>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
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
  // Semicircle gauge using SVG for precise centering.
  const size = 220;
  const cx = size / 2;
  const cy = size / 2;
  const r = 88;
  const stroke = 22;
  const progress = 0.7; // 70%
  const circumference = Math.PI * r;
  const dash = circumference * progress;

  // Needle angle: -180deg (left) -> 0deg (right). At 70% => -180 + 180*0.7 = -54deg
  const angleDeg = -180 + 180 * progress;
  const needleLength = r - 6;
  const rad = (angleDeg * Math.PI) / 180;
  const tipX = cx + needleLength * Math.cos(rad);
  const tipY = cy + needleLength * Math.sin(rad);

  return (
    <div className="mx-auto flex w-full max-w-[240px] flex-col items-center">
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "2 / 1" }}>
        <svg
          viewBox={`0 0 ${size} ${size / 2 + 4}`}
          className="block h-auto w-full"
          aria-hidden="true"
        >
          {/* Track */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#eee7ff"
            strokeWidth={stroke}
            strokeLinecap="round"
          />
          {/* Progress */}
          <path
            d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
            fill="none"
            stroke="#ff61cf"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
          />
          {/* Inner disc */}
          <circle cx={cx} cy={cy} r={30} fill="#ede7ff" />
          <circle cx={cx} cy={cy} r={18} fill="#8d6bd8" />
          {/* Needle */}
          <line
            x1={cx}
            y1={cy}
            x2={tipX}
            y2={tipY}
            stroke="#7d69d6"
            strokeWidth={8}
            strokeLinecap="round"
          />
          <circle cx={cx} cy={cy} r={5} fill="#ffffff" />
        </svg>
      </div>
      <p className="mt-2 text-sm font-bold text-muted-foreground">
        Em progresso <span className="text-[#20bf6b]">70%</span>
      </p>
    </div>
  );
}


function EmailCategories() {
  return (
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <h3 className="text-base font-bold text-foreground">Categorias</h3>
      <p className="mt-1 text-xs text-muted-foreground">Demandas por tipo</p>
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
          <span key={item.name} className="inline-flex items-center gap-2 text-xs text-muted-foreground">
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
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <h3 className="text-base font-bold text-foreground">Projetos importantes</h3>
          <p className="mt-1 text-xs text-muted-foreground">Prioridades em andamento</p>
        </div>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-5">
        {importantProjects.map((project, index) => (
          <div key={project.name} className="flex gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10">
              {index === 0 && <KanbanSquare className="h-5 w-5 text-primary" />}
              {index === 1 && <Users className="h-5 w-5 text-[#c47a13]" />}
              {index === 2 && <BookOpen className="h-5 w-5 text-[#23a061]" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-foreground">{project.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
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
    <Card className="rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">Taxa de conclusão</h3>
        <MoreVertical className="h-5 w-5 text-muted-foreground" />
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
    <div className="rounded-xl bg-muted/40 p-3">
      <Icon className="h-4 w-4 text-primary" />
      <p className="mt-2 text-[11px] text-muted-foreground">{label}</p>
      <p className="text-sm font-bold text-foreground">{value}</p>
    </div>
  );
}
