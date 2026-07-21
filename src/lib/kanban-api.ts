import { supabase } from "@/lib/supabase";

// Client-side wrapper around the `kanban-api` Supabase Edge Function.
// The Edge Function uses SUPABASE_SERVICE_ROLE_KEY on the server; the
// frontend never sees privileged credentials.

class KanbanUnavailableError extends Error {
  constructor() {
    super("KANBAN_UNAVAILABLE");
    this.name = "KanbanUnavailableError";
  }
}

async function invoke<T>(action: string, data?: unknown): Promise<T> {
  const { data: res, error } = await supabase.functions.invoke("kanban-api", {
    body: { action, data },
  });
  if (error || !res || (res as any).error) {
    throw new KanbanUnavailableError();
  }
  return (res as { data: T }).data;
}

// Signatures preserved: callers pass `{ data: {...} }` (TanStack-style) or
// call with no args. We accept both.
type Wrapped<T> = { data: T } | T;
const unwrap = <T,>(x: Wrapped<T> | undefined): T =>
  (x && typeof x === "object" && "data" in (x as any) ? (x as any).data : x) as T;

export const loadKanbanBoard = () => invoke<any>("loadBoard");

export const saveKanbanCard = (input: Wrapped<{
  id?: string;
  columnId: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  archived?: boolean;
  tags?: string[];
  memberIds?: string[];
}>) => invoke<{ id: string }>("updateCard", unwrap(input));

export const moveKanbanCard = (input: Wrapped<{
  cardId: string;
  columnId: string;
  beforeCardId?: string;
}>) => invoke<{ ok: true }>("moveCard", unwrap(input));

export const deleteKanbanCard = (input: Wrapped<{ id: string }>) =>
  invoke<{ ok: true }>("deleteCard", unwrap(input));

export const archiveKanbanCard = (input: Wrapped<{ id: string }>) =>
  invoke<{ ok: true }>("archiveCard", unwrap(input));

export const createKanbanColumn = (input: Wrapped<{ boardId: string; title: string }>) =>
  invoke<{ id: string }>("createColumn", unwrap(input));

export const deleteKanbanColumn = (input: Wrapped<{ id: string; fallbackId: string }>) =>
  invoke<{ ok: true }>("deleteColumn", unwrap(input));
