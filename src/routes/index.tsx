import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  KanbanSquare,
  Sparkles,
  Clock,
  Tag,
  BarChart3,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  Users,
} from "lucide-react";
import { SefazStatusPanel } from "@/components/portal/SefazStatusPanel";
import { AppShell } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";
import { supportTickets } from "@/lib/support-tickets-data";
import { getTicketsForCurrentUser } from "@/lib/tickets-scope";
import { Badge } from "@/components/ui/badge";
import { kbArticlesFull, kbCategoriesFull } from "@/lib/kb-data";
import { versions } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal Prócion — Central de Ajuda" },
      {
        name: "description",
        content:
          "Portal Prócion: central de ajuda com base de conhecimento, atualizações, versões e Kanban.",
      },
      { property: "og:title", content: "Portal Prócion — Central de Ajuda" },
      {
        property: "og:description",
        content:
          "Encontre artigos, versões e novidades da Prócion Sistemas em um só lugar.",
      },
    ],
  }),
  component: HomePage,
});

const shortcuts = [
  {
    to: "/base-de-conhecimento",
    label: "Base de Conhecimento",
    description: "Guias, manuais e correções.",
    icon: BookOpen,
    tone: "bg-primary/10 text-primary",
  },
  {
    to: "/atualizacoes",
    label: "Atualizações",
    description: "Novidades e melhorias recentes.",
    icon: Sparkles,
    tone: "bg-[#fff4d8] text-[#c47a13]",
  },
  {
    to: "/versoes",
    label: "Versões",
    description: "Histórico e release notes.",
    icon: GitBranch,
    tone: "bg-[#eafaf1] text-[#23a061]",
  },
  {
    to: "/kanban",
    label: "Kanban Prócion",
    description: "Suas demandas em andamento.",
    icon: KanbanSquare,
    tone: "bg-primary/10 text-[#4d5bd8]",
  },
] as const;

function ResumoHojeSlide() {
  const bars = [
    { label: "08-12h", value: 8, height: "42%" },
    { label: "12-18h", value: 15, height: "82%" },
    { label: "18-24h", value: 12, height: "68%" },
    { label: "00-06h", value: 9, height: "50%" },
    { label: "06-08h", value: 4, height: "28%" },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/86">
          Resumo de hoje
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/66">
          <BarChart3 className="h-3.5 w-3.5" />
          Volume
        </span>
      </div>

      <div className="relative z-10 mt-4">
        <p className="text-[12px] text-white/84">Hoje foram abertos</p>
        <p className="mt-1 text-[30px] font-extrabold leading-none tracking-normal md:text-[34px]">
          48 chamados
        </p>
        <p className="mt-2 text-[12px] font-medium text-white/76">
          39 foram finalizados pela equipe
        </p>
      </div>

      <div className="relative z-10 mt-4 h-[118px]">
        <div className="pointer-events-none absolute inset-x-3 bottom-[38px] h-[52px] rounded-[50%] bg-cyan-300/10 blur-xl" />
        <div className="absolute inset-x-0 bottom-8 h-px bg-white/10" />
        <svg
          aria-hidden
          viewBox="0 0 340 104"
          className="absolute inset-x-3 top-1 h-[86px] w-[calc(100%-24px)] overflow-visible"
          preserveAspectRatio="none"
        >
          <path
            d="M8 72 C42 58, 56 40, 86 30 C116 20, 136 48, 166 44 C196 40, 210 24, 236 32 C266 39, 280 66, 330 58"
            fill="none"
            stroke="rgba(143,206,255,0.48)"
            strokeWidth="3"
          />
          <path
            d="M8 74 C42 60, 56 42, 86 32 C116 22, 136 50, 166 46 C196 42, 210 26, 236 34 C266 41, 280 68, 330 60 L330 104 L8 104 Z"
            fill="rgba(72,157,255,0.14)"
          />
        </svg>
        <div className="relative flex h-full items-end justify-between gap-3 px-5">
          {bars.map((bar) => (
            <div key={bar.label} className="flex h-full flex-1 flex-col items-center justify-end">
              <span className="mb-1 text-[12px] font-medium text-white">{bar.value}</span>
              <span
                className="w-full max-w-[44px] rounded-t-lg bg-[linear-gradient(180deg,#49d4ff_0%,#5a5cf7_100%)] shadow-[0_10px_22px_rgba(33,118,255,0.38)]"
                style={{ height: bar.height }}
              />
              <span className="mt-2 whitespace-nowrap text-[10px] font-medium text-white/74">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-3 space-y-2">
        <SummaryProgress icon={CheckCircle2} label="Taxa de resolução" value="81%" />
        <SummaryProgress icon={Clock3} label="Tempo médio de resposta" value="24 min" />
      </div>
    </>
  );
}

function SlaSlide() {
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/86">
          SLA e atrasos
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/66">
          <AlertTriangle className="h-3.5 w-3.5" />
          Prioridade
        </span>
      </div>

      <div className="relative z-10 mt-4">
        <p className="text-[12px] text-white/84">Chamados em risco</p>
        <p className="mt-1 text-[30px] font-extrabold leading-none tracking-normal md:text-[34px]">
          7 chamados <span className="text-[#ffd166]">em risco</span>
        </p>
        <p className="mt-2 text-[12px] font-medium text-white/76">
          3 já ultrapassaram o SLA
        </p>
      </div>

      <div className="relative z-10 mt-5 space-y-2">
        <SummaryProgress icon={CheckCircle2} label="Dentro do SLA" value="86%" tone="ok" />
        <SummaryProgress icon={AlertTriangle} label="Atrasados" value="3 chamados" tone="danger" />
        <SummaryProgress icon={Clock3} label="Próximo SLA vence em" value="42 min" tone="warn" />
      </div>
    </>
  );
}

function FilaSlide() {
  const rows = [
    { label: "Ana Ribeiro", value: 3, width: "60%" },
    { label: "PRCSUZ", value: 4, width: "80%" },
    { label: "PRCMAR", value: 5, width: "100%" },
    { label: "Sem responsável", value: 2, width: "40%", muted: true },
  ];
  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-white/86">
          Fila de atendimento
        </p>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-white/66">
          <Users className="h-3.5 w-3.5" />
          Por atendente
        </span>
      </div>

      <div className="relative z-10 mt-4">
        <p className="text-[12px] text-white/84">Em atendimento agora</p>
        <p className="mt-1 text-[30px] font-extrabold leading-none tracking-normal md:text-[34px]">
          5 em atendimento
        </p>
        <p className="mt-2 text-[12px] font-medium text-white/76">
          12 aguardando primeira resposta
        </p>
      </div>

      <div className="relative z-10 mt-4 space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-3">
            <span className="w-[110px] shrink-0 truncate text-[11px] font-medium text-white/85">
              {r.label}
            </span>
            <div className="relative h-2 flex-1 overflow-hidden rounded-full bg-white/12">
              <div
                className={`h-full rounded-full ${
                  r.muted
                    ? "bg-white/30"
                    : "bg-[linear-gradient(90deg,#49d4ff_0%,#5a5cf7_100%)]"
                }`}
                style={{ width: r.width }}
              />
            </div>
            <span className="w-6 text-right text-[11px] font-medium text-white">{r.value}</span>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-3">
        <SummaryProgress icon={Clock3} label="Maior espera" value="1h18" tone="warn" />
      </div>
    </>
  );
}

const SLIDES = [
  { key: "resumo", render: () => <ResumoHojeSlide /> },
  { key: "sla", render: () => <SlaSlide /> },
  { key: "fila", render: () => <FilaSlide /> },
];

function TodaySummaryCard() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % SLIDES.length), 6500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex h-[440px] min-h-[440px] max-h-[440px] flex-col overflow-hidden rounded-2xl border border-white/14 bg-[radial-gradient(circle_at_32%_34%,rgba(71,186,255,0.28),transparent_34%),linear-gradient(137deg,rgba(42,132,210,0.58)_0%,rgba(45,58,155,0.74)_48%,rgba(42,34,120,0.84)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.13)] backdrop-blur-md">
      <div className="pointer-events-none absolute -bottom-14 left-8 h-32 w-64 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-8 h-52 w-52 rounded-full bg-violet-300/12 blur-3xl" />

      <div className="relative z-10 min-h-0 flex-1 overflow-hidden">
        {SLIDES.map((s, i) => (
          <div
            key={s.key}
            className={`absolute inset-0 flex h-full flex-col overflow-hidden transition-opacity duration-300 ${i === idx ? "opacity-100" : "pointer-events-none opacity-0"}`}
            aria-hidden={i !== idx}
          >
            {s.render()}
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-auto flex shrink-0 gap-1.5 pt-4">
        {SLIDES.map((s, i) => (
          <button
            key={s.key}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === idx ? "w-8 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function SummaryProgress({
  icon: Icon,
  label,
  value,
  tone = "ok",
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string;
  tone?: "ok" | "warn" | "danger";
}) {
  const iconColor =
    tone === "danger" ? "text-[#ff8a8a]" : tone === "warn" ? "text-[#ffd166]" : "text-[#68e7bd]";
  const valueColor =
    tone === "danger" ? "text-[#ff8a8a]" : tone === "warn" ? "text-[#ffd166]" : "text-[#8ee8ff]";
  const barGrad =
    tone === "danger"
      ? "from-[#ff8a8a] to-[#ff5470]"
      : tone === "warn"
        ? "from-[#ffd166] to-[#ff9f45]"
        : "from-[#54e1a7] to-[#6bd9ff]";
  return (
    <div className="rounded-xl border border-white/10 bg-white/10 px-3 py-1.5">
      <div className="flex items-center justify-between gap-3 text-[11px] font-medium">
        <span className="inline-flex items-center gap-2 text-white/86">
          <span className={`grid h-4 w-4 shrink-0 place-items-center rounded-full bg-white/12 ${iconColor}`}>
            <Icon className="h-3 w-3" />
          </span>
          {label}
        </span>
        <span className={valueColor}>{value}</span>
      </div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/14">
        <div className={`h-full w-[81%] rounded-full bg-gradient-to-r ${barGrad}`} />
      </div>
    </div>
  );
}

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Math.round((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "hoje";
  if (diff === 1) return "ontem";
  if (diff < 7) return `${diff} dias atrás`;
  if (diff < 30) return `${Math.floor(diff / 7)} sem atrás`;
  return d.toLocaleDateString("pt-BR");
}

function getGreeting(hour: number) {
  if (hour >= 5 && hour < 12) return "Bom dia";
  if (hour >= 12 && hour < 18) return "Boa tarde";
  return "Boa noite";
}

function HomePage() {
  const latestArticles = [...kbArticlesFull]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);
  const latestVersions = versions.slice(0, 4);
  const categoriesMap = Object.fromEntries(
    kbCategoriesFull.map((c) => [c.id, c]),
  );

  const [greeting, setGreeting] = useState(() => getGreeting(new Date().getHours()));
  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting(new Date().getHours())), 60_000);
    return () => clearInterval(id);
  }, []);

  // Lista única e pessoal do usuário logado — todos os chips derivam dela.
  const personalTickets = getTicketsForCurrentUser(supportTickets, currentUser);

  // Debug temporário para validar owner/status enquanto o backend não conecta.
  if (typeof window !== "undefined") {
    // eslint-disable-next-line no-console
    console.debug("[banner] currentUser.operator =", currentUser.operator);
    // eslint-disable-next-line no-console
    console.debug(
      "[banner] personalTickets =",
      personalTickets.map((t) => ({ protocol: t.protocol, owner: t.owner, status: t.status })),
    );
  }

  const displayName = `PRC ${currentUser.name}`;

  const slides = [
    {
      eyebrow: "Volume",
      primary: "Ontem foram abertos 48 chamados",
      secondary: "39 foram finalizados pela equipe",
    },
    {
      eyebrow: "Performance",
      primary: "SLA médio: 82%",
      secondary: "Tempo médio de atendimento: 1h42",
    },
    {
      eyebrow: "Destaques",
      primary: "Módulo mais acionado: Vendas - NFE",
      secondary: "Cliente com maior volume: Coopertransc",
    },
  ];

  const [slideIdx, setSlideIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setSlideIdx((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, [slides.length]);

  const personalTicketsCount = personalTickets.length;
  const personalTicketsLabel = personalTicketsCount === 1 ? "chamado" : "chamados";

  return (
    <AppShell>
      {/* Hero */}
      <section className="mb-6 overflow-hidden rounded-[18px] bg-[radial-gradient(circle_at_20%_10%,rgba(51,195,232,0.42),transparent_34%),linear-gradient(135deg,#0c9fd4_0%,#087ee0_42%,#263276_100%)] p-4 text-white shadow-[0_22px_54px_rgba(11,151,196,0.28)] md:p-5">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1.75fr)_minmax(360px,0.95fr)]">
          <SefazStatusPanel />
          <TodaySummaryCard />
        </div>

      </section>

      <section className="hidden">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-stretch">
          {/* Esquerda: saudação + chips + busca */}
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              Portal Prócion
            </p>
            <h1 className="mt-2 text-[24px] font-bold leading-tight md:text-[30px]">
              {greeting}, {displayName}
            </h1>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/15 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <span className="text-sm font-bold">{personalTicketsCount}</span>
                <span className="text-white/85">{personalTicketsLabel}</span>
              </span>
            </div>

            <div className="mt-5 max-w-2xl lg:h-[266px]">
              <SefazStatusPanel />
            </div>

          </div>

          {/* Direita: carrossel */}
          <div className="min-w-0">
            <div className="relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md lg:h-[266px]">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium uppercase tracking-wider text-white/80">
                  Resumo de ontem
                </p>
                <span className="text-[10px] font-medium text-white/60">
                  {slides[slideIdx].eyebrow}
                </span>
              </div>

              <div className="relative mt-3 flex-1">
                {slides.map((s, i) => (
                  <div
                    key={i}
                    className={`absolute inset-0 transition-all duration-500 ease-out ${
                      i === slideIdx
                        ? "opacity-100 translate-y-0"
                        : "pointer-events-none opacity-0 translate-y-2"
                    }`}
                  >
                    <p className="text-base font-semibold leading-snug text-white md:text-lg">
                      {s.primary}
                    </p>
                    <p className="mt-1.5 text-[12.5px] leading-snug text-white/80">{s.secondary}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex gap-1.5">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Slide ${i + 1}`}
                    onClick={() => setSlideIdx(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slideIdx ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Atalhos */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-foreground">Atalhos</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group"
            >
              <Card className="h-full rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-5 shadow-[0_10px_26px_rgba(25,29,51,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(25,29,51,0.10)]">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tone}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-bold text-foreground">{s.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  Abrir <ArrowRight className="h-3 w-3" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Últimos artigos + Versões */}
      <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="min-w-0 overflow-hidden rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Últimos artigos</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Atualizações recentes na base de conhecimento.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
              <Link to="/base-de-conhecimento">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <ul className="divide-y divide-[#f1f3f8]">
            {latestArticles.map((a) => {
              const cat = categoriesMap[a.category];
              return (
                <li key={a.slug}>
                  <Link
                    to="/base-de-conhecimento/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-start gap-4 py-4 transition hover:bg-muted/40/60"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {a.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        {cat && (
                          <span className="inline-flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {cat.name}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelative(a.updatedAt)}
                        </span>
                        {a.module && (
                          <Badge variant="secondary" className="rounded-full text-[10px]">
                            {a.module}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-[#c5cadb]" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="min-w-0 overflow-hidden rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-foreground">Últimas versões</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Release notes recentes.</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="shrink-0 text-primary hover:text-primary">
              <Link to="/versoes">
                Ver todas <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <ol className="relative space-y-5 border-l border-border pl-5">
            {latestVersions.map((v) => (
              <li key={v.version} className="relative min-w-0">
                <span className="absolute -left-[26px] top-1 grid h-4 w-4 place-items-center rounded-full bg-white dark:bg-[#20263d] ring-2 ring-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="shrink-0 text-sm font-bold text-foreground">{v.version}</span>
                  <Badge
                    variant="secondary"
                    className={`rounded-full text-[10px] ${
                      v.type === "Correção"
                        ? "bg-[#fff4d8] text-[#c47a13]"
                        : "bg-[#eafaf1] text-[#23a061]"
                    }`}
                  >
                    {v.type}
                  </Badge>
                  <span className="ml-auto text-[11px] text-muted-foreground whitespace-nowrap">{v.date}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {v.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex min-w-0 gap-1.5">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#c5cadb]" />
                      <span className="min-w-0 break-words">{h}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </AppShell>
  );
}
