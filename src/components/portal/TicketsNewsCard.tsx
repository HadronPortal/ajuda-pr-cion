import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileWarning,
  Flame,
  Layers,
  TrendingUp,
  Trophy,
} from "lucide-react";
import {
  supportTickets,
  dailyTicketAnalytics,
  type SupportTicket,
} from "@/lib/support-tickets-data";

type NewsItem = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
  title: string;
  description: string;
  updatedAt?: string;
  to: string;
  search?: Record<string, string>;
};

const OPEN_STATUSES: SupportTicket["status"][] = [
  "Atrasado",
  "Em Aberto",
  "Ocupado",
  "Em andamento",
  "Aguardando cliente",
  "Com especialista",
  "Agendamento",
];

function latestUpdatedAt(tickets: SupportTicket[]) {
  if (tickets.length === 0) return undefined;
  return tickets
    .map((t) => t.updatedAt)
    .sort()
    .at(-1);
}

function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function topEntry<T extends string>(counts: Record<T, number>) {
  const entries = Object.entries(counts) as Array<[T, number]>;
  entries.sort((a, b) => b[1] - a[1]);
  return entries[0];
}

function buildNews(tickets: SupportTicket[]): NewsItem[] {
  const items: NewsItem[] = [];
  const active = tickets.filter((t) => OPEN_STATUSES.includes(t.status));
  const overdue = tickets.filter((t) => t.status === "Atrasado");
  const finalized = tickets.filter((t) => t.status === "Finalizado");

  // Módulo com maior volume
  const modCount: Record<string, number> = {};
  active.forEach((t) => {
    modCount[t.module] = (modCount[t.module] ?? 0) + 1;
  });
  const topModule = topEntry(modCount);
  if (topModule) {
    const [mod, count] = topModule;
    const modTickets = active.filter((t) => t.module === mod);
    items.push({
      id: "top-module",
      icon: Layers,
      tone: "bg-primary/10 text-primary",
      title: `${mod} concentra o maior volume`,
      description: `${count} chamado${count === 1 ? "" : "s"} em aberto neste módulo hoje.`,
      updatedAt: latestUpdatedAt(modTickets),
      to: "/chamados",
    });
  }

  // NF-e nas últimas atualizações
  const nfe = active.filter((t) => /nfe|nf-e/i.test(t.module));
  if (nfe.length > 0) {
    items.push({
      id: "nfe-recent",
      icon: TrendingUp,
      tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      title: `${nfe.length} chamado${nfe.length === 1 ? "" : "s"} de NF-e em andamento`,
      description: "Monitorando rejeições e falhas de autorização em tempo real.",
      updatedAt: latestUpdatedAt(nfe),
      to: "/chamados",
    });
  }

  // Assuntos recorrentes
  const subjectCount: Record<string, number> = {};
  tickets.forEach((t) => {
    subjectCount[t.subject] = (subjectCount[t.subject] ?? 0) + 1;
  });
  const recurring = Object.entries(subjectCount)
    .filter(([, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])[0];
  if (recurring) {
    const [subject, count] = recurring;
    items.push({
      id: "recurring",
      icon: Flame,
      tone: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      title: `Aumento de chamados: "${subject}"`,
      description: `${count} ocorrência${count === 1 ? "" : "s"} do mesmo assunto nos últimos dias.`,
      to: "/chamados",
    });
  }

  // Próximos do SLA (Alta prioridade em aberto)
  const nearSla = active.filter((t) => t.priority === "Alta" && t.status !== "Atrasado");
  if (nearSla.length > 0) {
    items.push({
      id: "near-sla",
      icon: Clock3,
      tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      title: `${nearSla.length} chamado${nearSla.length === 1 ? "" : "s"} próximo${nearSla.length === 1 ? "" : "s"} do SLA`,
      description: "Alta prioridade sem atendimento finalizado. Priorize agora.",
      updatedAt: latestUpdatedAt(nearSla),
      to: "/chamados",
    });
  }

  // Atrasados
  if (overdue.length > 0) {
    items.push({
      id: "overdue",
      icon: AlertTriangle,
      tone: "bg-red-500/10 text-red-600 dark:text-red-400",
      title: `${overdue.length} chamado${overdue.length === 1 ? "" : "s"} atrasado${overdue.length === 1 ? "" : "s"}`,
      description: "Ultrapassaram o tempo previsto de atendimento.",
      updatedAt: latestUpdatedAt(overdue),
      to: "/chamados",
    });
  }

  // Operador com mais finalizações
  const opCount: Record<string, number> = {};
  finalized.forEach((t) => {
    opCount[t.owner] = (opCount[t.owner] ?? 0) + 1;
  });
  const topOp = topEntry(opCount);
  if (topOp) {
    const [op, count] = topOp;
    items.push({
      id: "top-op",
      icon: Trophy,
      tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
      title: `${op} lidera finalizações`,
      description: `${count} chamado${count === 1 ? "" : "s"} concluído${count === 1 ? "" : "s"} recentemente.`,
      to: "/chamados",
    });
  }

  // Variação em relação ao dia anterior
  if (dailyTicketAnalytics.length >= 2) {
    const today = dailyTicketAnalytics.at(-1)!;
    const yesterday = dailyTicketAnalytics.at(-2)!;
    const delta = today.opened - yesterday.opened;
    if (delta !== 0) {
      const up = delta > 0;
      items.push({
        id: "delta",
        icon: up ? TrendingUp : FileWarning,
        tone: up
          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        title: `${up ? "Alta" : "Queda"} de ${Math.abs(delta)} chamado${Math.abs(delta) === 1 ? "" : "s"} vs ontem`,
        description: `Hoje: ${today.opened} abertos · ontem: ${yesterday.opened}.`,
        to: "/chamados",
      });
    }
  }

  return items;
}

function NewsMiniChart({ itemId }: { itemId: string }) {
  const primaryKey = itemId === "overdue" || itemId === "near-sla" ? "overdue" : "opened";
  const primary = dailyTicketAnalytics.map((point) => point[primaryKey]);
  const comparison = dailyTicketAnalytics.map((point) => point.finished);
  const max = Math.max(...primary, ...comparison, 1);
  const width = 280;
  const height = 120;
  const baseY = 96;
  const chartTop = 8;
  const chartRange = baseY - chartTop;
  const step = width / dailyTicketAnalytics.length;
  const linePoints = comparison
    .map((value, index) => {
      const x = index * step + step / 2;
      const y = baseY - (value / max) * chartRange;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="mt-2 flex-1 min-h-0 rounded-xl border border-border/70 bg-muted/25 px-3 pb-1.5 pt-2">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="Tendência dos chamados nos últimos sete dias"
      >
        <line x1="0" y1={baseY} x2={width} y2={baseY} className="stroke-border" />
        {primary.map((value, index) => {
          const barHeight = Math.max(4, (value / max) * chartRange);
          return (
            <rect
              key={dailyTicketAnalytics[index].day}
              x={index * step + 8}
              y={baseY - barHeight}
              width={step - 16}
              height={barHeight}
              rx="4"
              className="fill-primary/55"
            />
          );
        })}
        <polyline
          points={linePoints}
          fill="none"
          className="stroke-emerald-500"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {comparison.map((value, index) => (
          <circle
            key={`${dailyTicketAnalytics[index].day}-point`}
            cx={index * step + step / 2}
            cy={baseY - (value / max) * chartRange}
            r="3"
            className="fill-card stroke-emerald-500"
            strokeWidth="2"
          />
        ))}
        {dailyTicketAnalytics.map((point, index) => (
          <text
            key={`${point.day}-label`}
            x={index * step + step / 2}
            y={height - 8}
            textAnchor="middle"
            className="fill-muted-foreground text-[8px]"
          >
            {point.day}
          </text>
        ))}
      </svg>
      <div className="flex justify-end gap-3 text-[9px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <i className="h-2 w-2 rounded-sm bg-primary/55" /> Volume
        </span>
        <span className="inline-flex items-center gap-1">
          <i className="h-2 w-2 rounded-full border-2 border-emerald-500" /> Finalizados
        </span>
      </div>
    </div>
  );
}

export function TicketsNewsCard() {
  const news = useMemo(() => buildNews(supportTickets), []);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || news.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % news.length);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, news.length]);

  if (news.length === 0) return null;

  const item = news[index];
  const Icon = item.icon;

  const goPrev = () => setIndex((i) => (i - 1 + news.length) % news.length);
  const goNext = () => setIndex((i) => (i + 1) % news.length);

  return (
    <section
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-border bg-card text-card-foreground shadow-[0_14px_36px_rgba(15,16,20,0.08)] dark:shadow-[0_14px_36px_rgba(0,0,0,0.35)]"
    >
      <header className="flex items-center justify-between gap-3 border-b border-border/60 px-6 py-3">
        <div className="min-w-0">
          <h2 className="truncate text-[17px] font-semibold leading-tight">
            Notícias dos chamados
          </h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Insights em tempo real da sua operação
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Notícia anterior"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Próxima notícia"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md border border-border bg-background text-muted-foreground transition hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </header>

      <Link
        to={item.to}
        className="group flex flex-1 min-h-0 cursor-pointer flex-col px-6 py-4 transition hover:bg-muted/40"
      >
        <div className="flex items-start gap-4">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${item.tone}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-semibold leading-snug text-foreground">{item.title}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-3">
              {item.description}
            </p>
          </div>
        </div>
        <NewsMiniChart itemId={item.id} />
        <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
          <span>
            {item.updatedAt ? `Atualizado às ${formatTime(item.updatedAt)}` : "Atualização recente"}
          </span>
          <span className="opacity-0 transition group-hover:opacity-100">Ver chamados →</span>
        </div>
      </Link>

      <footer className="flex items-center justify-center gap-1.5 border-t border-border/60 px-4 py-2.5">
        {news.map((n, i) => (
          <button
            key={n.id}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir para notícia ${i + 1}`}
            className={`h-1.5 cursor-pointer rounded-full transition-all ${
              i === index
                ? "w-6 bg-primary"
                : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
            }`}
          />
        ))}
      </footer>
    </section>
  );
}
