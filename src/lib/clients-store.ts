import { useEffect, useState } from "react";
import { listClients } from "@/lib/clients-api";
import type { ClientRow } from "@/routes/clientes.index";

// Fonte única de clientes para toda a aplicação.
// Carrega a partir do Supabase (RPC list_crm_clients) uma vez por sessão,
// mantém em memória e reaproveita para seletores em qualquer módulo.

let cache: ClientRow[] | null = null;
let inflight: Promise<ClientRow[]> | null = null;
const subscribers = new Set<() => void>();

function notify() {
  subscribers.forEach((cb) => cb());
}

export async function loadClients(force = false): Promise<ClientRow[]> {
  if (cache && !force) return cache;
  if (inflight) return inflight;
  inflight = listClients()
    .then((rows) => {
      cache = rows;
      inflight = null;
      notify();
      return rows;
    })
    .catch((err) => {
      inflight = null;
      throw err;
    });
  return inflight;
}

export function getCachedClients(): ClientRow[] | null {
  return cache;
}

export function getClientById(id: string | undefined | null): ClientRow | null {
  if (!id || !cache) return null;
  const target = id.toLowerCase();
  return cache.find((c) => c.id === target || c.acronym.toLowerCase() === target) ?? null;
}

export type UseClientsState = {
  clients: ClientRow[];
  loading: boolean;
  error: string | null;
  reload: () => void;
};

export function useClients(options?: { onlyActive?: boolean }): UseClientsState {
  const onlyActive = options?.onlyActive ?? true;
  const [, force] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(cache === null);

  useEffect(() => {
    const rerender = () => force((n) => n + 1);
    subscribers.add(rerender);
    if (cache === null) {
      setLoading(true);
      loadClients()
        .then(() => setError(null))
        .catch((err) => setError(err instanceof Error ? err.message : String(err)))
        .finally(() => setLoading(false));
    }
    return () => {
      subscribers.delete(rerender);
    };
  }, []);

  const source = cache ?? [];
  const clients = (onlyActive ? source.filter((c) => c.status === "Ativo") : source).sort((a, b) =>
    (a.fantasia || a.name).localeCompare(b.fantasia || b.name, "pt-BR", { sensitivity: "base" }),
  );

  return {
    clients,
    loading,
    error,
    reload: () => {
      setLoading(true);
      loadClients(true)
        .then(() => setError(null))
        .catch((err) => setError(err instanceof Error ? err.message : String(err)))
        .finally(() => setLoading(false));
    },
  };
}

// Filtro de busca reutilizável (sigla, fantasia, razão, CNPJ, cidade).
export function matchClient(client: ClientRow, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return [client.acronym, client.fantasia, client.razaoSocial, client.name, client.cnpj, client.city]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .includes(q);
}

// Rótulos padronizados usados em toda a UI.
export const CLIENT_UNLINKED_LABEL = "Cliente não vinculado";

export function formatClientDisplay(
  ticket: { clientCode?: string; clientName?: string } | null | undefined,
): { code: string; name: string; unlinked: boolean } {
  const code = ticket?.clientCode?.trim() ?? "";
  const name = ticket?.clientName?.trim() ?? "";
  if (!code && !name) return { code: "—", name: CLIENT_UNLINKED_LABEL, unlinked: true };
  return { code: code || "—", name: name || CLIENT_UNLINKED_LABEL, unlinked: !name };
}

// -----------------------------------------------------------------------------
// Grupos de clientes
// -----------------------------------------------------------------------------
// Cada cliente pode ter `group_acronym` (mapeado para `group`) apontando para o
// código do grupo. A empresa "raiz" do grupo geralmente possui o mesmo código
// do grupo em `acronym` (ex.: cliente MCC é a raiz do grupo MCC) e pode vir com
// `group` vazio. A detecção considera ambos os casos.

const normalizeCode = (v: string | null | undefined) => (v ?? "").trim().toUpperCase();

/** Código do grupo do cliente, ou null. Considera também clientes-raiz. */
export function resolveGroupCode(
  client: { acronym?: string | null; group?: string | null } | null | undefined,
  allClients: readonly { acronym: string; group: string }[] = getCachedClients() ?? [],
): string | null {
  if (!client) return null;
  const direct = normalizeCode(client.group);
  if (direct) return direct;
  const own = normalizeCode(client.acronym);
  if (!own) return null;
  const hasMembers = allClients.some((c) => normalizeCode(c.group) === own);
  return hasMembers ? own : null;
}

/** Todos os clientes do grupo, incluindo a empresa raiz. */
export function getGroupMembers(
  groupCode: string,
  allClients: readonly ClientRow[] = getCachedClients() ?? [],
): ClientRow[] {
  const code = normalizeCode(groupCode);
  if (!code) return [];
  return allClients.filter(
    (c) => normalizeCode(c.group) === code || normalizeCode(c.acronym) === code,
  );
}
