import { useCallback, useSyncExternalStore } from "react";
import {
  supportTickets,
  type SupportTicket,
  type TicketStatus,
} from "./support-tickets-data";
import { currentUser } from "./mock-data";

export type TicketEventKind =
  | "created"
  | "attached"
  | "assumed"
  | "attend"
  | "status"
  | "message"
  | "note"
  | "closed";

export type TicketEvent = {
  id: string;
  kind: TicketEventKind;
  when: string;
  actor: string;
  actorType: "cliente" | "suporte" | "sistema";
  description: string;
};

export type PastAttendance = {
  id: string;
  title: string;
  status: TicketStatus;
  module: string;
  priority: SupportTicket["priority"];
  operator: string;
  date: string;
  protocol: string;
  description: string;
};

export type ClosurePayload = {
  solution: string;
  type: "Resolvido" | "Duplicado" | "Sem retorno do cliente" | "Cancelado";
  addToClientHistory: boolean;
  generateKbArticle: boolean;
};

export type InternalNote = {
  id: string;
  operator: string;
  createdAt: string;
  text: string;
};

let tickets: SupportTicket[] = supportTickets.map((t) => ({ ...t }));
const events: Record<string, TicketEvent[]> = {};
const history: Record<string, PastAttendance[]> = {};
const internalNotes: Record<string, InternalNote[]> = {};

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

let eventCounter = 0;
const nextEventId = () => `evt-${Date.now().toString(36)}-${++eventCounter}`;

const nowIso = () => new Date().toISOString();

function addMinutes(iso: string, minutes: number) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

function hashString(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1) h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

const PAST_TITLES = [
  "NOTA DEVOLUÇÃO",
  "CONFERÊNCIA DE ESTOQUE",
  "AJUSTE FINANCEIRO",
  "ORÇAMENTO NÃO IMPRIME",
  "CADASTRO DE PRODUTO",
  "IMPOSTO DIVERGENTE",
  "SPED FISCAL",
];
const PAST_MODULES = [
  "VENDAS -- NOTAS FISCAIS / NFE",
  "ESTOQUE -- MOVIMENTAÇÃO",
  "FINANCEIRO -- CONTAS A PAGAR",
  "BASICO -- TERCEIROS",
  "FISCAL -- APURAÇÃO",
];
const PAST_OPERATORS = ["PRCSUZ", "PRCROG", "PRCMAR", "PRCLCZ", "PRCPED"];

function seedHistory(ticket: SupportTicket): PastAttendance[] {
  const h = hashString(ticket.clientCode + ticket.id);
  const count = 2 + (h % 3);
  const arr: PastAttendance[] = [];
  for (let i = 0; i < count; i += 1) {
    const idx = (h + i * 7) % PAST_TITLES.length;
    const dateBase = new Date(ticket.openedAt);
    dateBase.setDate(dateBase.getDate() - (7 + i * 11 + (h % 9)));
    arr.push({
      id: `${ticket.id}-past-${i}`,
      title: PAST_TITLES[idx],
      status: "Finalizado",
      module: PAST_MODULES[(h + i) % PAST_MODULES.length],
      priority: (["Baixa", "Media", "Alta"] as const)[(h + i) % 3],
      operator: PAST_OPERATORS[(h + i * 3) % PAST_OPERATORS.length],
      date: dateBase.toISOString(),
      protocol: `PRC-${1780000000 + ((h + i * 137) % 9999999)}`,
      description: "Atendimento anterior deste cliente relacionado ao módulo.",
    });
  }
  return arr;
}

function seedEvents(ticket: SupportTicket): TicketEvent[] {
  const base: TicketEvent[] = [
    {
      id: nextEventId(),
      kind: "created",
      when: ticket.openedAt,
      actor: ticket.contact,
      actorType: "cliente",
      description: `Chamado aberto via ${ticket.source}.`,
    },
    {
      id: nextEventId(),
      kind: "attached",
      when: addMinutes(ticket.openedAt, 6),
      actor: ticket.contact,
      actorType: "cliente",
      description: "Cliente anexou print do erro e log da operação.",
    },
    {
      id: nextEventId(),
      kind: "assumed",
      when: addMinutes(ticket.openedAt, 14),
      actor: ticket.attendant,
      actorType: "suporte",
      description: `Chamado assumido por ${ticket.attendant}.`,
    },
    {
      id: nextEventId(),
      kind: "status",
      when: addMinutes(ticket.openedAt, 32),
      actor: ticket.owner,
      actorType: "sistema",
      description: `Status alterado para "${ticket.status}".`,
    },
    {
      id: nextEventId(),
      kind: "message",
      when: ticket.updatedAt,
      actor: ticket.owner,
      actorType: "suporte",
      description: "Retorno enviado ao cliente com orientação inicial.",
    },
  ];
  if (ticket.status === "Finalizado") {
    base.push({
      id: nextEventId(),
      kind: "closed",
      when: ticket.updatedAt,
      actor: ticket.owner,
      actorType: "suporte",
      description: "Chamado encerrado após confirmação do cliente.",
    });
  }
  return base;
}

function ensureSeed(ticket: SupportTicket) {
  if (!events[ticket.id]) events[ticket.id] = seedEvents(ticket);
  if (!history[ticket.id]) history[ticket.id] = seedHistory(ticket);
}

// Seed everything up-front so listing works.
tickets.forEach(ensureSeed);

function updateTicket(id: string, patch: Partial<SupportTicket>) {
  tickets = tickets.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: nowIso() } : t));
}

function pushEvent(id: string, event: Omit<TicketEvent, "id">) {
  events[id] = [...(events[id] ?? []), { ...event, id: nextEventId() }];
}

const operator = () => currentUser.operator ?? "PRC???";

export const ticketsStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  getTickets: () => tickets,
  getEvents: (id: string) => events[id] ?? [],
  getHistory: (id: string) => history[id] ?? [],
  getInternalNotes: (id: string) => internalNotes[id] ?? [],

  assumeTicket(id: string) {
    const op = operator();
    updateTicket(id, { owner: op, lockedBy: undefined });
    pushEvent(id, {
      kind: "assumed",
      when: nowIso(),
      actor: op,
      actorType: "suporte",
      description: `Chamado assumido por ${op}.`,
    });
    emit();
  },

  attendTicket(id: string) {
    const op = operator();
    updateTicket(id, {
      owner: op,
      status: "Ocupado",
      lockedBy: op,
    });
    pushEvent(id, {
      kind: "attend",
      when: nowIso(),
      actor: op,
      actorType: "suporte",
      description: `${op} iniciou atendimento.`,
    });
    emit();
  },

  updateTicketStatus(id: string, status: TicketStatus) {
    const op = operator();
    updateTicket(id, { status });
    pushEvent(id, {
      kind: "status",
      when: nowIso(),
      actor: op,
      actorType: "suporte",
      description: `Status alterado para "${status}" por ${op}.`,
    });
    emit();
  },

  closeTicket(id: string, payload: ClosurePayload) {
    const op = operator();
    updateTicket(id, { status: "Finalizado", lockedBy: undefined });
    pushEvent(id, {
      kind: "closed",
      when: nowIso(),
      actor: op,
      actorType: "suporte",
      description: `Chamado finalizado por ${op} — ${payload.type}. ${payload.solution}`.trim(),
    });
    emit();
  },

  addInternalNote(id: string, note: string) {
    const op = operator();
    const when = nowIso();
    const entry: InternalNote = {
      id: `note-${Date.now().toString(36)}-${++eventCounter}`,
      operator: op,
      createdAt: when,
      text: note,
    };
    internalNotes[id] = [entry, ...(internalNotes[id] ?? [])];
    updateTicket(id, {});
    emit();
  },

  addNote(id: string, note: string) {
    this.addInternalNote(id, note);
  },
};

// React hooks -----------------------------------------------------------------

export function useTickets(): SupportTicket[] {
  return useSyncExternalStore(
    ticketsStore.subscribe,
    ticketsStore.getTickets,
    ticketsStore.getTickets,
  );
}

export function useTicket(id: string | null | undefined): SupportTicket | null {
  const all = useTickets();
  if (!id) return null;
  return all.find((t) => t.id === id) ?? null;
}

const EMPTY_EVENTS: TicketEvent[] = [];
const EMPTY_HISTORY: PastAttendance[] = [];
const EMPTY_NOTES: InternalNote[] = [];

export function useTicketNotes(id: string | null | undefined): InternalNote[] {
  const getSnap = useCallback(
    () => (id ? ticketsStore.getInternalNotes(id) : EMPTY_NOTES),
    [id],
  );
  return useSyncExternalStore(ticketsStore.subscribe, getSnap, getSnap);
}

export function useTicketEvents(id: string | null | undefined): TicketEvent[] {
  const getSnap = useCallback(
    () => (id ? ticketsStore.getEvents(id) : EMPTY_EVENTS),
    [id],
  );
  return useSyncExternalStore(ticketsStore.subscribe, getSnap, getSnap);
}

export function useTicketHistory(id: string | null | undefined): PastAttendance[] {
  const getSnap = useCallback(
    () => (id ? ticketsStore.getHistory(id) : EMPTY_HISTORY),
    [id],
  );
  return useSyncExternalStore(ticketsStore.subscribe, getSnap, getSnap);
}

