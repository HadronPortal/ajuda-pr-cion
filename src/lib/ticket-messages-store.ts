import { useCallback, useSyncExternalStore } from "react";
import { supportTickets } from "./support-tickets-data";
import { currentUser } from "./mock-data";
import { ticketsApi } from "./tickets-api";

export type ChatAuthor = "cliente" | "suporte";

export type TicketMessage = {
  id: string;
  author: ChatAuthor;
  name: string;
  text: string;
  at: string; // ISO
};

const messages: Record<string, TicketMessage[]> = {};
const EMPTY: TicketMessage[] = [];
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
let hydrationPromise: Promise<void> | null = null;

let counter = 0;
const nextId = () => `msg-${Date.now().toString(36)}-${++counter}`;

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

const OPENERS = [
  "Bom dia, estou tendo dificuldades para concluir a operação descrita. Poderiam me ajudar?",
  "Olá, seguem os detalhes do problema. Aguardo retorno assim que possível.",
  "Oi, esse ponto está travando o nosso fechamento aqui, alguma orientação?",
];
const SUPPORT = [
  "Olá! Já estou analisando o chamado e retorno em instantes com uma orientação.",
  "Bom dia! Recebi o chamado, vou reproduzir aqui e já te retorno.",
  "Oi! Obrigado pelo detalhe, estou verificando o comportamento agora.",
];
const REPLIES = [
  "Perfeito, fico no aguardo. Se precisar de mais alguma informação me avise.",
  "Consegui reproduzir novamente, o comportamento se repete. Segue print anexo.",
  "Ok, obrigado! Vou aguardar o retorno.",
];

function seedFor(ticketId: string): TicketMessage[] {
  const t = supportTickets.find((s) => s.id === ticketId);
  if (!t) return [];
  const h = hashString(ticketId);
  const base = new Date(t.openedAt).getTime();
  const mk = (
    author: ChatAuthor,
    name: string,
    text: string,
    offsetMin: number,
  ): TicketMessage => ({
    id: nextId(),
    author,
    name,
    text,
    at: new Date(base + offsetMin * 60_000).toISOString(),
  });
  return [
    mk("cliente", t.contact, OPENERS[h % OPENERS.length], 2),
    mk("suporte", t.attendant, SUPPORT[(h >> 2) % SUPPORT.length], 18),
    mk("cliente", t.contact, REPLIES[(h >> 3) % REPLIES.length], 34),
  ];
}

function ensureSeed(ticketId: string) {
  if (!messages[ticketId]) messages[ticketId] = seedFor(ticketId);
}

async function hydrateFromSupabase() {
  try {
    const snapshot = await ticketsApi.load();
    const remoteMessages: Record<string, TicketMessage[]> = {};
    snapshot.messages.forEach(({ ticketId, ...message }) => {
      (remoteMessages[ticketId] ??= []).push(message);
    });
    for (const ticket of snapshot.tickets) {
      if (remoteMessages[ticket.id]?.length) {
        messages[ticket.id] = remoteMessages[ticket.id];
      } else {
        ensureSeed(ticket.id);
        for (const message of messages[ticket.id] ?? []) {
          await ticketsApi.addMessage(ticket.id, {
            text: message.text,
            internal: false,
            senderCode: message.author === "suporte" ? message.name : undefined,
            name: message.name,
            author: message.author,
          });
        }
      }
    }
    emit();
  } catch (error) {
    console.error("[ticket-messages-store] Não foi possível carregar o chat.", error);
  }
}

function ensureHydrated() {
  hydrationPromise ??= hydrateFromSupabase();
}

// Public API (ready to swap for API/WebSocket).
export const ticketMessagesStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    ensureHydrated();
    return () => {
      listeners.delete(l);
    };
  },
  getMessages(ticketId: string) {
    ensureSeed(ticketId);
    return messages[ticketId] ?? EMPTY;
  },
  // TODO: replace body with API/WebSocket call.
  sendTicketMessage(ticketId: string, text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    ensureSeed(ticketId);
    const msg: TicketMessage = {
      id: nextId(),
      author: "suporte",
      name: currentUser.operator ?? "Suporte",
      text: trimmed,
      at: new Date().toISOString(),
    };
    messages[ticketId] = [...(messages[ticketId] ?? []), msg];
    emit();
    void ticketsApi
      .addMessage(ticketId, {
        text: trimmed,
        internal: false,
        senderCode: currentUser.operator,
        name: msg.name,
        author: "suporte",
      })
      .catch((error) => {
        console.error(`[ticket-messages-store] Falha ao enviar mensagem do chamado ${ticketId}.`, error);
      });
  },
};

export function sendTicketMessage(ticketId: string, text: string) {
  ticketMessagesStore.sendTicketMessage(ticketId, text);
}

export function useTicketMessages(ticketId: string | null | undefined): TicketMessage[] {
  const getSnap = useCallback(
    () => (ticketId ? ticketMessagesStore.getMessages(ticketId) : EMPTY),
    [ticketId],
  );
  return useSyncExternalStore(ticketMessagesStore.subscribe, getSnap, getSnap);
}
