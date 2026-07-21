// Supabase Edge Function: kanban-api
// Deploy: supabase functions deploy kanban-api --no-verify-jwt
// Requires env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY (available by default).

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const url = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders },
  });

const priorityToDb = (v: string) =>
  v === "Alta" || v === "Critica" ? "high" : v === "Baixa" ? "low" : "medium";

const DEFAULT_COLUMNS = [
  { name: "A fazer", position: 0 },
  { name: "Em andamento", position: 1 },
  { name: "Concluido", position: 2 },
];

function groupBy<T>(rows: T[], key: (r: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const r of rows) {
    const k = key(r);
    (out[k] ||= []).push(r);
  }
  return out;
}

async function listBoards() {
  const { data: boards, error } = await admin
    .from("kanban_boards")
    .select("id, name, description, color, cover, visibility, is_favorite, updated_at, created_at")
    .eq("archived", false)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  const ids = (boards ?? []).map((b: any) => b.id);
  if (!ids.length) return { boards: [] };

  const [colsResult, cardsResult, membersResult] = await Promise.allSettled([
    admin.from("kanban_columns").select("id, board_id").in("board_id", ids).eq("archived", false),
    admin
      .from("kanban_cards")
      .select("id, archived, kanban_columns!inner(board_id, archived)")
      .in("kanban_columns.board_id", ids)
      .eq("kanban_columns.archived", false)
      .eq("archived", false),
    admin
      .from("kanban_board_members")
      .select("board_id, role, profiles:profile_id(id, full_name, avatar_url, operator_code)")
      .in("board_id", ids),
  ]);

  // Optional board summaries must never prevent users from opening the board list.
  // This also keeps the UI available while a freshly deployed schema cache settles.
  const colsRes = colsResult.status === "fulfilled" ? colsResult.value : { data: [] };
  const cardsRes = cardsResult.status === "fulfilled" ? cardsResult.value : { data: [] };
  const membersRes = membersResult.status === "fulfilled" ? membersResult.value : { data: [] };

  if ("error" in colsRes && colsRes.error) console.error("[kanban-api:listBoards:columns]", colsRes.error);
  if ("error" in cardsRes && cardsRes.error) console.error("[kanban-api:listBoards:cards]", cardsRes.error);
  if ("error" in membersRes && membersRes.error) console.error("[kanban-api:listBoards:members]", membersRes.error);

  const colsByBoard = groupBy(colsRes.data ?? [], (r: any) => r.board_id);
  const cardsByBoard: Record<string, number> = {};
  for (const row of (cardsRes.data ?? []) as any[]) {
    const b = row.kanban_columns?.board_id;
    if (b) cardsByBoard[b] = (cardsByBoard[b] ?? 0) + 1;
  }
  const membersByBoard = groupBy(membersRes.data ?? [], (r: any) => r.board_id);

  return {
    boards: (boards ?? []).map((b: any) => ({
      id: b.id,
      name: b.name,
      description: b.description ?? "",
      color: b.color ?? null,
      cover: b.cover ?? null,
      visibility: b.visibility ?? "team",
      isFavorite: Boolean(b.is_favorite),
      updatedAt: b.updated_at,
      createdAt: b.created_at,
      columnsCount: (colsByBoard[b.id] ?? []).length,
      cardsCount: cardsByBoard[b.id] ?? 0,
      members: (membersByBoard[b.id] ?? []).map((m: any) => ({
        id: m.profiles?.id,
        name: m.profiles?.full_name ?? "",
        avatarUrl: m.profiles?.avatar_url ?? null,
        operator: m.profiles?.operator_code ?? null,
        role: m.role,
      })).filter((m: any) => m.id),
    })),
  };
}

async function getBoard(payload: any) {
  const { data, error } = await admin
    .from("kanban_boards")
    .select("id, name, description, color, cover, visibility, is_favorite")
    .eq("id", payload.boardId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return { board: null };
  return {
    board: {
      id: data.id,
      name: data.name,
      description: data.description ?? "",
      color: data.color ?? null,
      cover: data.cover ?? null,
      visibility: data.visibility ?? "team",
      isFavorite: Boolean(data.is_favorite),
    },
  };
}

async function loadBoard(payload: any) {
  if (!payload?.boardId) throw new Error("boardId_required");
  const { data: board, error: e1 } = await admin
    .from("kanban_boards")
    .select("id, name, description")
    .eq("id", payload.boardId)
    .eq("archived", false)
    .maybeSingle();
  if (e1) throw e1;
  if (!board) return { board: null, columns: [], cards: [] };

  const [colsRes, cardsRes] = await Promise.all([
    admin
      .from("kanban_columns")
      .select("id, name, position, source_position")
      .eq("board_id", board.id)
      .eq("archived", false)
      .order("position", { ascending: true }),
    admin
      .from("kanban_cards")
      .select(
        "id, column_id, title, description, priority, due_at, position, archived, labels, member_legacy_ids, source_payload, kanban_columns!inner(board_id, archived)",
      )
      .eq("kanban_columns.board_id", board.id)
      .eq("kanban_columns.archived", false)
      .eq("archived", false)
      .order("position", { ascending: true }),
  ]);
  if (colsRes.error) throw colsRes.error;
  if (cardsRes.error) throw cardsRes.error;

  const cardIds = (cardsRes.data ?? []).map((c: any) => c.id);
  const [checklistRes, commentsRes, attachmentsRes] = await Promise.all([
    cardIds.length
      ? admin
          .from("kanban_checklist_items")
          .select("id, card_id, title, completed, position")
          .in("card_id", cardIds)
          .order("position", { ascending: true })
      : { data: [], error: null },
    cardIds.length
      ? admin
          .from("kanban_comments")
          .select("id, card_id, author_legacy_id, body, created_at")
          .in("card_id", cardIds)
          .order("created_at", { ascending: true })
      : { data: [], error: null },
    cardIds.length
      ? admin
          .from("kanban_card_attachments")
          .select("id, card_id, name, bytes, mime_type, position")
          .in("card_id", cardIds)
          .order("position", { ascending: true })
      : { data: [], error: null },
  ]);
  if ((checklistRes as any).error) throw (checklistRes as any).error;
  if ((commentsRes as any).error) throw (commentsRes as any).error;
  if ((attachmentsRes as any).error) throw (attachmentsRes as any).error;

  const cl = groupBy((checklistRes as any).data ?? [], (r: any) => r.card_id);
  const cm = groupBy((commentsRes as any).data ?? [], (r: any) => r.card_id);
  const at = groupBy((attachmentsRes as any).data ?? [], (r: any) => r.card_id);

  const priorityToUi = (v: string | null) =>
    v === "high" ? "Alta" : v === "low" ? "Baixa" : "Media";
  const labelNames = (labels: unknown): string[] => {
    if (!Array.isArray(labels)) return [];
    return labels
      .map((l: any) => String(l?.name || l?.color || "").trim())
      .filter(Boolean);
  };

  const cards = (cardsRes.data ?? []).map((row: any) => {
    const payload = row.source_payload ?? {};
    const memberIds = row.member_legacy_ids ?? [];
    return {
      id: row.id,
      columnId: row.column_id,
      title: row.title,
      summary:
        row.description?.split(/\r?\n/).find(Boolean) ??
        "Cartao importado do Trello",
      description: row.description ?? "",
      client: payload.client || "Interno",
      module: payload.module || "Trello",
      priority: priorityToUi(row.priority),
      type: "Melhoria",
      assigneeId: memberIds[0] ?? "u-ar",
      participants: memberIds,
      dueDate: row.due_at ? String(row.due_at).slice(0, 10) : "",
      tags: labelNames(row.labels),
      comments: (cm[row.id] ?? []).length,
      attachments: (at[row.id] ?? []).length,
      archived: Boolean(row.archived),
      checklist: (cl[row.id] ?? []).map((i: any) => ({
        id: i.id,
        text: i.title,
        done: i.completed,
      })),
      commentsList: (cm[row.id] ?? []).map((i: any) => ({
        id: i.id,
        authorId: i.author_legacy_id ?? "trello",
        at: i.created_at,
        text: i.body,
      })),
      attachmentsList: (at[row.id] ?? []).map((i: any) => ({
        id: i.id,
        name: i.name ?? "Anexo",
        size: i.bytes ? String(i.bytes) : "",
        kind: i.mime_type ?? "link",
      })),
      activity: [],
      relatedArticles: [],
      relatedVersions: [],
    };
  });

  return {
    board: { id: board.id, name: board.name, description: board.description },
    columns: (colsRes.data ?? []).map((r: any) => ({ id: r.id, title: r.name })),
    cards,
  };
}

async function nextCardPosition(columnId: string) {
  const { data, error } = await admin
    .from("kanban_cards")
    .select("position")
    .eq("column_id", columnId)
    .order("position", { ascending: false })
    .limit(1);
  if (error) throw error;
  return Number(data?.[0]?.position ?? 0) + 1024;
}

async function touchBoardOfColumn(columnId: string) {
  const { data } = await admin
    .from("kanban_columns")
    .select("board_id")
    .eq("id", columnId)
    .maybeSingle();
  if (data?.board_id) {
    await admin
      .from("kanban_boards")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", data.board_id);
  }
}

async function saveCard(payload: any) {
  const isUuid = payload.id && /^[0-9a-f-]{36}$/i.test(payload.id);
  const row: any = {
    column_id: payload.columnId,
    title: payload.title,
    description: payload.description ?? "",
    priority: priorityToDb(payload.priority ?? "Media"),
    due_at: payload.dueDate || null,
    archived: Boolean(payload.archived),
    labels: (payload.tags ?? []).map((name: string) => ({ name })),
    member_legacy_ids: payload.memberIds ?? [],
    updated_at: new Date().toISOString(),
  };
  if (isUuid) {
    const { data, error } = await admin
      .from("kanban_cards")
      .update(row)
      .eq("id", payload.id)
      .select("id")
      .single();
    if (error) throw error;
    await touchBoardOfColumn(payload.columnId);
    return { id: data.id };
  }
  row.position = await nextCardPosition(payload.columnId);
  const { data, error } = await admin
    .from("kanban_cards")
    .insert(row)
    .select("id")
    .single();
  if (error) throw error;
  await touchBoardOfColumn(payload.columnId);
  return { id: data.id };
}

async function moveCard(payload: any) {
  let position: number;
  if (payload.beforeCardId) {
    const { data, error } = await admin
      .from("kanban_cards")
      .select("position")
      .eq("id", payload.beforeCardId)
      .maybeSingle();
    if (error) throw error;
    position = Number(data?.position ?? 1024) - 0.5;
  } else {
    position = await nextCardPosition(payload.columnId);
  }
  const { error } = await admin
    .from("kanban_cards")
    .update({
      column_id: payload.columnId,
      position,
      archived: false,
      updated_at: new Date().toISOString(),
    })
    .eq("id", payload.cardId);
  if (error) throw error;
  await touchBoardOfColumn(payload.columnId);
  return { ok: true };
}

async function archiveCard(payload: any) {
  const { error } = await admin
    .from("kanban_cards")
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq("id", payload.id);
  if (error) throw error;
  return { ok: true };
}

async function deleteCard(payload: any) {
  const { error } = await admin.from("kanban_cards").delete().eq("id", payload.id);
  if (error) throw error;
  return { ok: true };
}

async function createColumn(payload: any) {
  const { data: pos, error: eP } = await admin
    .from("kanban_columns")
    .select("position")
    .eq("board_id", payload.boardId)
    .order("position", { ascending: false })
    .limit(1);
  if (eP) throw eP;
  const position = Number(pos?.[0]?.position ?? -1) + 1;
  const { data, error } = await admin
    .from("kanban_columns")
    .insert({ board_id: payload.boardId, name: payload.title, position })
    .select("id")
    .single();
  if (error) throw error;
  return { id: data.id };
}

async function deleteColumn(payload: any) {
  const { error: eMove } = await admin
    .from("kanban_cards")
    .update({ column_id: payload.fallbackId, updated_at: new Date().toISOString() })
    .eq("column_id", payload.id);
  if (eMove) throw eMove;
  const { error } = await admin.from("kanban_columns").delete().eq("id", payload.id);
  if (error) throw error;
  return { ok: true };
}

/* ---------- BOARDS ---------- */

async function createBoard(payload: any) {
  const { data: board, error } = await admin
    .from("kanban_boards")
    .insert({
      name: payload.name,
      description: payload.description ?? "",
      color: payload.color ?? null,
      cover: payload.cover ?? null,
      visibility: payload.visibility ?? "team",
    })
    .select("id")
    .single();
  if (error) throw error;

  const cols = DEFAULT_COLUMNS.map((c) => ({ ...c, board_id: board.id }));
  const { error: eCols } = await admin.from("kanban_columns").insert(cols);
  if (eCols) throw eCols;

  const memberIds: string[] = Array.isArray(payload.memberIds) ? payload.memberIds : [];
  if (memberIds.length) {
    const rows = memberIds.map((id: string) => ({
      board_id: board.id,
      profile_id: id,
      role: "member",
    }));
    await admin.from("kanban_board_members").upsert(rows, { onConflict: "board_id,profile_id" });
  }
  if (payload.ownerId) {
    await admin
      .from("kanban_board_members")
      .upsert(
        [{ board_id: board.id, profile_id: payload.ownerId, role: "admin" }],
        { onConflict: "board_id,profile_id" },
      );
  }
  return { id: board.id };
}

async function updateBoard(payload: any) {
  const patch: any = { updated_at: new Date().toISOString() };
  if (payload.name !== undefined) patch.name = payload.name;
  if (payload.description !== undefined) patch.description = payload.description;
  if (payload.color !== undefined) patch.color = payload.color;
  if (payload.cover !== undefined) patch.cover = payload.cover;
  if (payload.visibility !== undefined) patch.visibility = payload.visibility;
  if (payload.isFavorite !== undefined) patch.is_favorite = Boolean(payload.isFavorite);
  const { error } = await admin.from("kanban_boards").update(patch).eq("id", payload.id);
  if (error) throw error;
  return { ok: true };
}

async function duplicateBoard(payload: any) {
  const { data: src, error: e1 } = await admin
    .from("kanban_boards")
    .select("name, description, color, cover, visibility")
    .eq("id", payload.id)
    .single();
  if (e1) throw e1;
  const { data: newBoard, error: e2 } = await admin
    .from("kanban_boards")
    .insert({
      name: `${src.name} (cópia)`,
      description: src.description,
      color: src.color,
      cover: src.cover,
      visibility: src.visibility,
    })
    .select("id")
    .single();
  if (e2) throw e2;

  const { data: cols, error: e3 } = await admin
    .from("kanban_columns")
    .select("id, name, position, color")
    .eq("board_id", payload.id)
    .eq("archived", false)
    .order("position");
  if (e3) throw e3;

  const colMap = new Map<string, string>();
  for (const c of cols ?? []) {
    const { data: nc, error } = await admin
      .from("kanban_columns")
      .insert({ board_id: newBoard.id, name: c.name, position: c.position, color: c.color })
      .select("id")
      .single();
    if (error) throw error;
    colMap.set(c.id, nc.id);
  }

  const { data: cards, error: e4 } = await admin
    .from("kanban_cards")
    .select("column_id, title, description, priority, due_at, position, labels, member_legacy_ids")
    .in("column_id", Array.from(colMap.keys()))
    .eq("archived", false);
  if (e4) throw e4;

  if (cards?.length) {
    const rows = cards.map((c: any) => ({
      column_id: colMap.get(c.column_id),
      title: c.title,
      description: c.description,
      priority: c.priority,
      due_at: c.due_at,
      position: c.position,
      labels: c.labels ?? [],
      member_legacy_ids: c.member_legacy_ids ?? [],
    }));
    const { error } = await admin.from("kanban_cards").insert(rows);
    if (error) throw error;
  }
  return { id: newBoard.id };
}

async function archiveBoard(payload: any) {
  const { error } = await admin
    .from("kanban_boards")
    .update({ archived: true, updated_at: new Date().toISOString() })
    .eq("id", payload.id);
  if (error) throw error;
  return { ok: true };
}

async function deleteBoard(payload: any) {
  const { error } = await admin.from("kanban_boards").delete().eq("id", payload.id);
  if (error) throw error;
  return { ok: true };
}

/* ---------- MEMBERS ---------- */

async function listAvailableMembers(payload: any) {
  const q = String(payload?.query ?? "").trim();
  let query = admin
    .from("profiles")
    .select("id, full_name, email, operator_code, avatar_url, role, active")
    .eq("active", true)
    .order("full_name", { ascending: true })
    .limit(100);
  if (q) {
    query = query.or(
      `full_name.ilike.%${q}%,email.ilike.%${q}%,operator_code.ilike.%${q}%`,
    );
  }
  const { data, error } = await query;
  if (error) throw error;
  return {
    members: (data ?? []).map((p: any) => ({
      id: p.id,
      name: p.full_name,
      email: p.email,
      operator: p.operator_code,
      avatarUrl: p.avatar_url,
    })),
  };
}

async function listBoardMembers(payload: any) {
  const { data, error } = await admin
    .from("kanban_board_members")
    .select("role, profiles:profile_id(id, full_name, email, operator_code, avatar_url)")
    .eq("board_id", payload.boardId);
  if (error) throw error;
  return {
    members: (data ?? [])
      .map((m: any) => ({
        id: m.profiles?.id,
        name: m.profiles?.full_name ?? "",
        email: m.profiles?.email,
        operator: m.profiles?.operator_code,
        avatarUrl: m.profiles?.avatar_url,
        role: m.role,
      }))
      .filter((m: any) => m.id),
  };
}

async function addBoardMember(payload: any) {
  const { error } = await admin
    .from("kanban_board_members")
    .upsert(
      [{ board_id: payload.boardId, profile_id: payload.profileId, role: payload.role ?? "member" }],
      { onConflict: "board_id,profile_id" },
    );
  if (error) throw error;
  return { ok: true };
}

async function updateBoardMemberRole(payload: any) {
  const { error } = await admin
    .from("kanban_board_members")
    .update({ role: payload.role })
    .eq("board_id", payload.boardId)
    .eq("profile_id", payload.profileId);
  if (error) throw error;
  return { ok: true };
}

async function removeBoardMember(payload: any) {
  const { error } = await admin
    .from("kanban_board_members")
    .delete()
    .eq("board_id", payload.boardId)
    .eq("profile_id", payload.profileId);
  if (error) throw error;
  return { ok: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { action, data } = await req.json();
    let result: unknown;
    switch (action) {
      case "listBoards":
        result = await listBoards();
        break;
      case "getBoard":
        result = await getBoard(data);
        break;
      case "loadBoard":
        result = await loadBoard(data);
        break;
      case "createBoard":
        result = await createBoard(data);
        break;
      case "updateBoard":
        result = await updateBoard(data);
        break;
      case "duplicateBoard":
        result = await duplicateBoard(data);
        break;
      case "archiveBoard":
        result = await archiveBoard(data);
        break;
      case "deleteBoard":
        result = await deleteBoard(data);
        break;
      case "listAvailableMembers":
        result = await listAvailableMembers(data);
        break;
      case "listBoardMembers":
        result = await listBoardMembers(data);
        break;
      case "addBoardMember":
        result = await addBoardMember(data);
        break;
      case "updateBoardMemberRole":
        result = await updateBoardMemberRole(data);
        break;
      case "removeBoardMember":
        result = await removeBoardMember(data);
        break;
      case "createCard":
      case "updateCard":
        result = await saveCard(data);
        break;
      case "moveCard":
        result = await moveCard(data);
        break;
      case "archiveCard":
        result = await archiveCard(data);
        break;
      case "deleteCard":
        result = await deleteCard(data);
        break;
      case "createColumn":
        result = await createColumn(data);
        break;
      case "deleteColumn":
        result = await deleteColumn(data);
        break;
      default:
        return json({ error: "unknown_action" }, 400);
    }
    return json({ data: result });
  } catch (err) {
    console.error("[kanban-api]", err);
    return json({ error: "KANBAN_UNAVAILABLE" }, 500);
  }
});
