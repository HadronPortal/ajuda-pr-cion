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

function groupBy<T>(rows: T[], key: (r: T) => string): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const r of rows) {
    const k = key(r);
    (out[k] ||= []).push(r);
  }
  return out;
}

async function loadBoard() {
  const { data: boards, error: e1 } = await admin
    .from("kanban_boards")
    .select("id, name, description, legacy_id, created_at")
    .eq("archived", false)
    .order("legacy_id", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(1);
  if (e1) throw e1;
  const board = boards?.[0];
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
    return { id: data.id };
  }
  row.position = await nextCardPosition(payload.columnId);
  const { data, error } = await admin
    .from("kanban_cards")
    .insert(row)
    .select("id")
    .single();
  if (error) throw error;
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

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { action, data } = await req.json();
    let result: unknown;
    switch (action) {
      case "loadBoard":
        result = await loadBoard();
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
    // Full error stays in Edge Function logs only.
    console.error("[kanban-api]", err);
    return json({ error: "KANBAN_UNAVAILABLE" }, 500);
  }
});
