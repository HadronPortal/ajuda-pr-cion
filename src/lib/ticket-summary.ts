import { useEffect, useState } from "react";
import { supabase } from "./supabase";

type SummaryState = {
  status: "idle" | "loading" | "ready" | "error";
  summary: string | null;
};

const cache = new Map<string, SummaryState>();
const inflight = new Map<string, Promise<SummaryState>>();

const IDLE: SummaryState = { status: "idle", summary: null };

async function fetchSummary(ticketId: string): Promise<SummaryState> {
  const { data, error } = await supabase.functions.invoke("ticket-summary", {
    body: { ticketId },
  });
  if (error) throw error;
  const summary = (data as { summary?: string | null } | null)?.summary ?? null;
  return { status: summary ? "ready" : "error", summary };
}

/**
 * Retorna o resumo (gerado por IA no backend) da descrição original do chamado.
 * O resultado é persistido no banco e reutilizado — a IA só roda quando não há
 * resumo ou quando a descrição original mudou.
 */
export function useTicketSummary(
  ticketId: string | null | undefined,
  description: string,
  knownSummary?: string | null,
): SummaryState {
  const key = ticketId ?? "";
  const [state, setState] = useState<SummaryState>(() => {
    if (knownSummary) return { status: "ready", summary: knownSummary };
    return cache.get(key) ?? IDLE;
  });

  useEffect(() => {
    if (!key || !description) {
      setState(IDLE);
      return;
    }
    if (knownSummary) {
      setState({ status: "ready", summary: knownSummary });
      return;
    }

    const cached = cache.get(key);
    if (cached && cached.status !== "loading") {
      setState(cached);
      return;
    }

    let active = true;
    setState({ status: "loading", summary: null });

    const promise =
      inflight.get(key) ??
      fetchSummary(key)
        .catch((error): SummaryState => {
          console.error(`[ticket-summary] Falha ao gerar resumo do chamado ${key}.`, error);
          return { status: "error", summary: null };
        })
        .then((result) => {
          cache.set(key, result);
          inflight.delete(key);
          return result;
        });

    inflight.set(key, promise);
    void promise.then((result) => {
      if (active) setState(result);
    });

    return () => {
      active = false;
    };
  }, [key, description, knownSummary]);

  return state;
}
