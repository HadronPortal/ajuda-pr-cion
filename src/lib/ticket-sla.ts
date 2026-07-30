import type { SupportTicket, TicketStatus } from "./support-tickets-data";

/** Meta padrão de atendimento, em horas. */
export const SLA_TARGET_HOURS = 24;

export type SlaTone = "ok" | "warn" | "late";

export type SlaResult = {
  /** Percentual consumido da meta (0-100). */
  pct: number;
  tone: SlaTone;
  /** Horas decorridas arredondadas (compatível com a exibição atual). */
  hours: number;
  /** Horas decorridas com precisão, para relatórios/indicadores. */
  exactHours: number;
  /** Instante usado como limite do cálculo. */
  boundaryAt: string;
  /** `true` quando o contador está parado (chamado finalizado/cancelado). */
  stopped: boolean;
};

/** Normaliza texto removendo acentos e caixa. */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

const TERMINAL_STATUSES = new Set([
  "finalizado",
  "finalizada",
  "concluido",
  "concluida",
  "fechado",
  "fechada",
  "encerrado",
  "encerrada",
  "resolvido",
  "resolvida",
  "cancelado",
  "cancelada",
]);

/** Um chamado encerrado não deve mais acumular tempo de SLA. */
export function isTicketClosed(status: TicketStatus | string | null | undefined): boolean {
  return TERMINAL_STATUSES.has(normalize(status ?? ""));
}

/**
 * Instante em que o contador de SLA parou.
 * Usa a data/hora exata de finalização quando registrada; caso o chamado seja
 * histórico e não possua o carimbo, cai para a última atualização conhecida.
 * Nunca redefine o valor já existente.
 */
export function getSlaBoundary(ticket: SupportTicket): { at: string; stopped: boolean } {
  if (isTicketClosed(ticket.status)) {
    const closed = ticket.closedAt ?? ticket.updatedAt ?? ticket.openedAt;
    return { at: closed, stopped: true };
  }
  return { at: new Date().toISOString(), stopped: false };
}

/**
 * Calcula o SLA do chamado. Para chamados abertos o comportamento é o atual
 * (aberto → agora); para finalizados o cálculo fica congelado entre a abertura
 * e a data/hora de finalização.
 */
export function computeSla(ticket: SupportTicket): SlaResult {
  const openedAt = new Date(ticket.openedAt).getTime();
  const boundary = getSlaBoundary(ticket);
  const boundaryTime = new Date(boundary.at).getTime();
  const safeBoundary = Number.isFinite(boundaryTime) ? boundaryTime : Date.now();
  const exactHours = Math.max(0, (safeBoundary - openedAt) / 36e5);
  const rawPct =
    ticket.status === "Atrasado" ? 100 : Math.min(100, (exactHours / SLA_TARGET_HOURS) * 100);
  const pct = Math.round(rawPct);
  let tone: SlaTone = "ok";
  if (ticket.status === "Atrasado" || pct >= 90) tone = "late";
  else if (pct >= 60) tone = "warn";
  return {
    pct,
    tone,
    hours: Math.round(exactHours),
    exactHours,
    boundaryAt: boundary.at,
    stopped: boundary.stopped,
  };
}
