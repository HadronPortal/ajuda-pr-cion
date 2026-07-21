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

type Wrapped<T> = { data: T } | T;
const unwrap = <T,>(x: Wrapped<T> | undefined): T =>
  (x && typeof x === "object" && "data" in (x as any) ? (x as any).data : x) as T;

/* ---------- Board (contents) ---------- */

export type BoardSummary = {
  id: string;
  name: string;
  description: string;
  color: string | null;
  cover: string | null;
  visibility: "team" | "private" | string;
  isFavorite: boolean;
  updatedAt: string;
  createdAt: string;
  columnsCount: number;
  cardsCount: number;
  members: {
    id: string;
    name: string;
    avatarUrl: string | null;
    operator: string | null;
    role: string;
  }[];
};

export type BoardMember = {
  id: string;
  name: string;
  email?: string | null;
  operator?: string | null;
  avatarUrl?: string | null;
  role?: string;
};

export const loadKanbanBoard = (input: Wrapped<{ boardId: string }>) =>
  invoke<any>("loadBoard", unwrap(input));

export const getKanbanBoard = (input: Wrapped<{ boardId: string }>) =>
  invoke<{ board: BoardSummary | null }>("getBoard", unwrap(input));

export const listKanbanBoards = () =>
  invoke<{ boards: BoardSummary[] }>("listBoards");

export const createKanbanBoard = (input: Wrapped<{
  name: string;
  description?: string;
  color?: string | null;
  cover?: string | null;
  visibility?: string;
  memberIds?: string[];
  ownerId?: string | null;
}>) => invoke<{ id: string }>("createBoard", unwrap(input));

export const updateKanbanBoard = (input: Wrapped<{
  id: string;
  name?: string;
  description?: string;
  color?: string | null;
  cover?: string | null;
  visibility?: string;
  isFavorite?: boolean;
}>) => invoke<{ ok: true }>("updateBoard", unwrap(input));

export const duplicateKanbanBoard = (input: Wrapped<{ id: string }>) =>
  invoke<{ id: string }>("duplicateBoard", unwrap(input));

export const archiveKanbanBoard = (input: Wrapped<{ id: string }>) =>
  invoke<{ ok: true }>("archiveBoard", unwrap(input));

export const deleteKanbanBoard = (input: Wrapped<{ id: string }>) =>
  invoke<{ ok: true }>("deleteBoard", unwrap(input));

/* ---------- Members ---------- */

export const listAvailableMembers = (input?: Wrapped<{ query?: string }>) =>
  invoke<{ members: BoardMember[] }>("listAvailableMembers", unwrap(input ?? { data: {} }));

export const listBoardMembers = (input: Wrapped<{ boardId: string }>) =>
  invoke<{ members: BoardMember[] }>("listBoardMembers", unwrap(input));

export const addBoardMember = (input: Wrapped<{ boardId: string; profileId: string; role?: string }>) =>
  invoke<{ ok: true }>("addBoardMember", unwrap(input));

export const updateBoardMemberRole = (input: Wrapped<{ boardId: string; profileId: string; role: string }>) =>
  invoke<{ ok: true }>("updateBoardMemberRole", unwrap(input));

export const removeBoardMember = (input: Wrapped<{ boardId: string; profileId: string }>) =>
  invoke<{ ok: true }>("removeBoardMember", unwrap(input));

/* ---------- Cards & Columns ---------- */

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
