// Persistência do estado da tela de Chamados para permitir "Voltar ao chamado".
// Usa sessionStorage para não poluir o localStorage do usuário e ser
// automaticamente descartado ao fechar a aba.

const KEY = "prc:chamados:snapshot";

export type ChamadosSnapshot = {
  ticketId: string;
  filters?: unknown;
  scrollY?: number;
  savedAt: number;
};

export function saveChamadosSnapshot(snapshot: Omit<ChamadosSnapshot, "savedAt">) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ ...snapshot, savedAt: Date.now() }));
  } catch {
    // ignore quota / disabled storage
  }
}

export function readChamadosSnapshot(): ChamadosSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ChamadosSnapshot;
    if (!parsed || typeof parsed !== "object" || !parsed.ticketId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearChamadosSnapshot() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}

// Cache in-memory dos filtros/scroll atuais da tela de chamados, para que a
// snapshot criada ao clicar em um link (módulo/cliente) possa persistir sem
// precisar tornar o estado global.
let currentFilters: unknown = null;
export function setChamadosFiltersCache(f: unknown) {
  currentFilters = f;
}
export function snapshotCurrentChamadosForTicket(ticketId: string) {
  const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
  saveChamadosSnapshot({ ticketId, filters: currentFilters, scrollY });
}
