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
  workspaceId: string | null;
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

export type WorkspaceSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  website: string;
  logoUrl: string | null;
  visibility: "private" | "company" | string;
  settings: {
    memberRestriction: "admins" | "members";
    boardCreation: "admins" | "members";
    boardDeletion: "admins" | "members";
    guestSharing: "admins" | "members";
  };
  membershipRole: "admin" | "member" | "guest" | string;
  membersCount: number;
  boards: BoardSummary[];
};

export const listKanbanWorkspaces = async () => {
  try {
    return await invoke<{ workspaces: WorkspaceSummary[] }>("listWorkspaces");
  } catch {
    const [{ data, error }, boardResult] = await Promise.all([
      (supabase as any).rpc("get_kanban_workspaces"),
      invoke<{ boards: BoardSummary[] }>("listBoards"),
    ]);
    if (error) throw error;
    const boards = boardResult.boards ?? [];
    const workspaces = (data ?? []) as Omit<WorkspaceSummary, "boards">[];
    const knownWorkspaceIds = new Set(workspaces.map((workspace) => workspace.id));
    return {
      workspaces: workspaces.map((workspace, index) => ({
        ...workspace,
        boards: boards.filter((board) =>
          board.workspaceId === workspace.id
          || (index === 0 && (!board.workspaceId || !knownWorkspaceIds.has(board.workspaceId))),
        ),
      })),
    };
  }
};

export const createKanbanWorkspace = (input: Wrapped<{
  name: string;
  slug?: string;
  description?: string;
  website?: string;
  visibility?: string;
  settings?: WorkspaceSummary["settings"];
}>) => invoke<{ id: string }>("createWorkspace", unwrap(input));

export const updateKanbanWorkspace = async (input: Wrapped<{
  id: string;
  name?: string;
  slug?: string;
  description?: string;
  website?: string;
  visibility?: string;
  settings?: WorkspaceSummary["settings"];
}>) => {
  const data = unwrap(input);
  const { error } = await (supabase as any).rpc("update_kanban_workspace", {
    workspace_id: data.id,
    workspace_name: data.name,
    workspace_slug: data.slug,
    workspace_description: data.description ?? "",
    workspace_website: data.website ?? "",
    workspace_visibility: data.visibility ?? "private",
    workspace_settings: data.settings,
  });
  if (error) throw error;
  return { ok: true as const };
};

export const listWorkspaceMembers = (input: Wrapped<{ workspaceId: string }>) =>
  invoke<{ members: BoardMember[] }>("listWorkspaceMembers", unwrap(input));

export const addWorkspaceMember = (input: Wrapped<{
  workspaceId: string;
  profileId: string;
  role?: "admin" | "member" | "guest";
}>) => invoke<{ ok: true }>("addWorkspaceMember", unwrap(input));

export const updateWorkspaceMemberRole = (input: Wrapped<{
  workspaceId: string;
  profileId: string;
  role: "admin" | "member" | "guest";
}>) => invoke<{ ok: true }>("updateWorkspaceMemberRole", unwrap(input));

export const removeWorkspaceMember = (input: Wrapped<{
  workspaceId: string;
  profileId: string;
}>) => invoke<{ ok: true }>("removeWorkspaceMember", unwrap(input));

export type BoardMember = {
  id: string;
  name: string;
  email?: string | null;
  operator?: string | null;
  avatarUrl?: string | null;
  role?: string;
};

export const loadKanbanBoard = async (input: Wrapped<{ boardId: string }>) => {
  const { boardId } = unwrap(input);
  const { data, error } = await supabase.rpc("load_kanban_board_payload", {
    target_board_id: boardId,
  });
  if (error || !data) throw new KanbanUnavailableError();
  return data as { board: any; columns: any[]; cards: any[] };
};

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
  workspaceId?: string | null;
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

export const saveKanbanCard = async (input: Wrapped<{
  id?: string;
  columnId: string;
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  archived?: boolean;
  tags?: string[];
  memberIds?: string[];
  client?: string;
  module?: string;
  type?: string;
  summary?: string;
  checklist?: Array<{ id: string; text: string; done: boolean; checklistTitle?: string }>;
  commentsList?: Array<{ id: string; authorId: string; at: string; text: string }>;
  attachmentsList?: Array<{ id: string; name: string; size: string; kind: string; url?: string }>;
  activity?: Array<{ id: string; at: string; text: string; authorId?: string }>;
  relatedArticles?: Array<{ id: string; title: string; category: string }>;
  relatedVersions?: Array<{ id: string; version: string; date: string; note: string }>;
}>) => {
  const payload = unwrap(input);
  const { data, error } = await supabase.rpc("save_kanban_card_payload_v2", {
    payload,
  });

  if (error || !data || typeof data.id !== "string") {
    throw new KanbanUnavailableError();
  }

  return data as { id: string };
};

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
