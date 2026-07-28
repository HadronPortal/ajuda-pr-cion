import type { SupportTicket, TicketStatus } from "./support-tickets-data";

// ---------------------------------------------------------------------------
// Utilitários de mês (YYYY-MM) usados pelo Dashboard e pela página Chamados.
// Todos os cálculos derivam dos chamados reais carregados do Supabase.
// ---------------------------------------------------------------------------

export const OPEN_TICKET_STATUSES: TicketStatus[] = [
  "Atrasado",
  "Em Aberto",
  "Ocupado",
  "Em andamento",
  "Aguardando cliente",
  "Com especialista",
  "Agendamento",
];

export const IN_PROGRESS_STATUSES: TicketStatus[] = [
  "Em andamento",
  "Ocupado",
  "Com especialista",
  "Aguardando cliente",
  "Agendamento",
];

export function monthKeyFromDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function currentMonthKey(): string {
  return monthKeyFromDate(new Date());
}

export function isMonthKey(value: string | undefined | null): value is string {
  return !!value && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}

export function monthRange(key: string): { start: Date; end: Date } {
  const [year, month] = key.split("-").map(Number);
  return {
    start: new Date(year, month - 1, 1, 0, 0, 0, 0),
    end: new Date(year, month, 0, 23, 59, 59, 999),
  };
}

export function addMonths(key: string, delta: number): string {
  const [year, month] = key.split("-").map(Number);
  return monthKeyFromDate(new Date(year, month - 1 + delta, 1));
}

/** "julho de 2026" */
export function monthLabel(key: string): string {
  const { start } = monthRange(key);
  return new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(start);
}

/** "jul/26" */
export function monthShortLabel(key: string): string {
  const { start } = monthRange(key);
  const month = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(start)
    .replace(".", "");
  return `${month}/${String(start.getFullYear()).slice(-2)}`;
}

export function lastMonthKeys(key: string, count: number): string[] {
  return Array.from({ length: count }, (_, i) => addMonths(key, i - (count - 1)));
}

function keyOf(iso: string | undefined): string | null {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return monthKeyFromDate(date);
}

export function isTicketInMonth(
  ticket: SupportTicket,
  key: string,
  field: "openedAt" | "updatedAt" | "any" = "any",
): boolean {
  const opened = keyOf(ticket.openedAt);
  const updated = keyOf(ticket.updatedAt);
  if (field === "openedAt") return opened === key;
  if (field === "updatedAt") return updated === key;
  return opened === key || updated === key;
}

export type MonthMetrics = {
  open: number;
  inProgress: number;
  overdue: number;
  finished: number;
  total: number;
};

export type TicketMonthView = "open" | "in-progress" | "overdue" | "finished";

export function isTicketMonthView(value: string | undefined | null): value is TicketMonthView {
  return ["open", "in-progress", "overdue", "finished"].includes(value || "");
}

export function ticketMatchesMonthView(
  ticket: SupportTicket,
  key: string,
  view: TicketMonthView,
): boolean {
  if (view === "open") {
    return (
      OPEN_TICKET_STATUSES.includes(ticket.status) &&
      isTicketInMonth(ticket, key, "openedAt")
    );
  }
  if (view === "in-progress") {
    return (
      IN_PROGRESS_STATUSES.includes(ticket.status) &&
      isTicketInMonth(ticket, key)
    );
  }
  if (view === "overdue") {
    return ticket.status === "Atrasado" && isTicketInMonth(ticket, key);
  }
  return ticket.status === "Finalizado" && isTicketInMonth(ticket, key, "updatedAt");
}

export function computeMonthMetrics(tickets: SupportTicket[], key: string): MonthMetrics {
  const touched = tickets.filter((t) => isTicketInMonth(t, key));
  return {
    open: tickets.filter((ticket) => ticketMatchesMonthView(ticket, key, "open")).length,
    inProgress: tickets.filter((ticket) =>
      ticketMatchesMonthView(ticket, key, "in-progress"),
    ).length,
    overdue: tickets.filter((ticket) =>
      ticketMatchesMonthView(ticket, key, "overdue"),
    ).length,
    finished: tickets.filter((ticket) =>
      ticketMatchesMonthView(ticket, key, "finished"),
    ).length,
    total: touched.length,
  };
}

/** Variação percentual em relação ao mês anterior. `null` quando não é calculável. */
export function percentChange(current: number, previous: number): number | null {
  if (!previous) return null;
  return Math.round(((current - previous) / previous) * 100);
}

export function formatPercentChange(value: number | null): string | null {
  if (value === null) return null;
  return `${value > 0 ? "+" : ""}${value}% vs mês anterior`;
}

export type MonthSeriesPoint = {
  key: string;
  label: string;
  opened: number;
  finished: number;
  overdue: number;
};

export function buildMonthSeries(
  tickets: SupportTicket[],
  keys: string[],
): MonthSeriesPoint[] {
  return keys.map((key) => {
    const metrics = computeMonthMetrics(tickets, key);
    return {
      key,
      label: monthShortLabel(key),
      opened: metrics.open,
      finished: metrics.finished,
      overdue: metrics.overdue,
    };
  });
}

/** Meses com chamados registrados, do mais recente para o mais antigo. */
export function availableMonthKeys(tickets: SupportTicket[]): string[] {
  const set = new Set<string>();
  tickets.forEach((t) => {
    const opened = keyOf(t.openedAt);
    const updated = keyOf(t.updatedAt);
    if (opened) set.add(opened);
    if (updated) set.add(updated);
  });
  set.add(currentMonthKey());
  return Array.from(set).sort().reverse();
}
