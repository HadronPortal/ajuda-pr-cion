import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type DbClient = {
  query: (text: string, values?: unknown[]) => Promise<{ rows: any[] }>;
};

let pool: DbClient | null = null;

async function getPool(): Promise<DbClient> {
  if (pool) return pool;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL nao configurada no servidor.");
  }
  const { Pool } = await import("pg");
  pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false }, max: 5 });
  return pool;
}

const priorityToUi = (value: string | null) =>
  value === "high" ? "Alta" : value === "low" ? "Baixa" : "Media";

const priorityToDb = (value: string) =>
  value === "Alta" || value === "Critica" ? "high" : value === "Baixa" ? "low" : "medium";

function labelNames(labels: unknown): string[] {
  if (!Array.isArray(labels)) return [];
  return labels
    .map((label: any) => String(label?.name || label?.color || "").trim())
    .filter(Boolean);
}

function mapCard(row: any) {
  const payload = row.source_payload ?? {};
  const tags = labelNames(row.labels);
  const memberId = row.member_legacy_ids?.[0] ?? "u-ar";
  return {
    id: row.id,
    columnId: row.column_id,
    title: row.title,
    summary: row.description?.split(/\r?\n/).find(Boolean) ?? "Cartao importado do Trello",
    description: row.description ?? "",
    client: payload.client || "Interno",
    module: payload.module || "Trello",
    priority: priorityToUi(row.priority),
    type: "Melhoria",
    assigneeId: memberId,
    participants: row.member_legacy_ids ?? [],
    dueDate: row.due_at ? String(row.due_at).slice(0, 10) : "",
    tags,
    comments: Number(row.comments_count ?? 0),
    attachments: Number(row.attachments_count ?? 0),
    archived: Boolean(row.archived),
    checklist: row.checklist ?? [],
    commentsList: row.comments_list ?? [],
    attachmentsList: row.attachments_list ?? [],
    activity: [],
    relatedArticles: [],
    relatedVersions: [],
  };
}

export const loadKanbanBoard = createServerFn({ method: "GET" }).handler(async () => {
  const db = await getPool();
  const boardResult = await db.query(`
    select id, name, description
    from public.kanban_boards
    where archived = false
    order by (legacy_id is not null) desc, created_at desc
    limit 1
  `);
  const board = boardResult.rows[0];
  if (!board) return { board: null, columns: [], cards: [] };

  const [columnsResult, cardsResult] = await Promise.all([
    db.query(`
      select id, name, position
      from public.kanban_columns
      where board_id = $1 and archived = false
      order by position, source_position nulls last, name
    `, [board.id]),
    db.query(`
      with checklist as (
        select card_id, jsonb_agg(jsonb_build_object('id', id, 'text', title, 'done', completed) order by position) items
        from public.kanban_checklist_items group by card_id
      ), comments as (
        select card_id,
          jsonb_agg(jsonb_build_object('id', id, 'authorId', coalesce(author_legacy_id, 'trello'), 'at', created_at, 'text', body) order by created_at) items,
          count(*) total
        from public.kanban_comments group by card_id
      ), attachments as (
        select card_id,
          jsonb_agg(jsonb_build_object('id', id, 'name', coalesce(name, 'Anexo'), 'size', coalesce(bytes::text, ''), 'kind', coalesce(mime_type, 'link')) order by position) items,
          count(*) total
        from public.kanban_card_attachments group by card_id
      )
      select c.*,
        coalesce(i.items, '[]'::jsonb) checklist,
        coalesce(m.items, '[]'::jsonb) comments_list,
        coalesce(a.items, '[]'::jsonb) attachments_list,
        coalesce(m.total, 0) comments_count,
        coalesce(a.total, 0) attachments_count
      from public.kanban_cards c
      join public.kanban_columns col on col.id = c.column_id
      left join checklist i on i.card_id = c.id
      left join comments m on m.card_id = c.id
      left join attachments a on a.card_id = c.id
      where col.board_id = $1 and col.archived = false and c.archived = false
      order by col.position, c.position, c.created_at
    `, [board.id]),
  ]);

  return {
    board,
    columns: columnsResult.rows.map((row) => ({ id: row.id, title: row.name })),
    cards: cardsResult.rows.map(mapCard),
  };
});

const cardInput = z.object({
  id: z.string().optional(),
  columnId: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().optional().default(""),
  priority: z.string().default("Media"),
  dueDate: z.string().optional().default(""),
  archived: z.boolean().optional().default(false),
  tags: z.array(z.string()).optional().default([]),
  memberIds: z.array(z.string()).optional().default([]),
});

export const saveKanbanCard = createServerFn({ method: "POST" })
  .validator(cardInput)
  .handler(async ({ data }) => {
    const db = await getPool();
    const existing = data.id && z.string().uuid().safeParse(data.id).success;
    const positionResult = await db.query(
      "select coalesce(max(position), 0) + 1024 position from public.kanban_cards where column_id = $1",
      [data.columnId],
    );
    const values = [
      data.columnId,
      data.title,
      data.description,
      priorityToDb(data.priority),
      data.dueDate || null,
      data.archived,
      positionResult.rows[0].position,
      JSON.stringify(data.tags.map((name) => ({ name }))),
      JSON.stringify(data.memberIds),
    ];
    const result = existing
      ? await db.query(`
          update public.kanban_cards set
            column_id=$1, title=$2, description=$3, priority=$4, due_at=$5,
            archived=$6, labels=$8::jsonb, member_legacy_ids=$9::jsonb, updated_at=now()
          where id=$10 returning id
        `, [...values, data.id])
      : await db.query(`
          insert into public.kanban_cards
            (column_id,title,description,priority,due_at,archived,position,labels,member_legacy_ids)
          values ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9::jsonb) returning id
        `, values);
    return { id: result.rows[0].id };
  });

const moveInput = z.object({
  cardId: z.string().uuid(),
  columnId: z.string().uuid(),
  beforeCardId: z.string().uuid().optional(),
});

export const moveKanbanCard = createServerFn({ method: "POST" })
  .validator(moveInput)
  .handler(async ({ data }) => {
    const db = await getPool();
    let position: number;
    if (data.beforeCardId) {
      const target = await db.query("select position from public.kanban_cards where id=$1", [data.beforeCardId]);
      position = Number(target.rows[0]?.position ?? 1024) - 0.5;
    } else {
      const last = await db.query("select coalesce(max(position),0)+1024 position from public.kanban_cards where column_id=$1", [data.columnId]);
      position = Number(last.rows[0].position);
    }
    await db.query("update public.kanban_cards set column_id=$1, position=$2, archived=false, updated_at=now() where id=$3", [data.columnId, position, data.cardId]);
    return { ok: true };
  });

export const deleteKanbanCard = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    const db = await getPool();
    await db.query("delete from public.kanban_cards where id=$1", [data.id]);
    return { ok: true };
  });

const columnInput = z.object({ boardId: z.string().uuid(), title: z.string().min(1) });

export const createKanbanColumn = createServerFn({ method: "POST" })
  .validator(columnInput)
  .handler(async ({ data }) => {
    const db = await getPool();
    const pos = await db.query("select coalesce(max(position),-1)+1 position from public.kanban_columns where board_id=$1", [data.boardId]);
    const result = await db.query("insert into public.kanban_columns(board_id,name,position) values($1,$2,$3) returning id", [data.boardId, data.title, pos.rows[0].position]);
    return { id: result.rows[0].id };
  });

export const deleteKanbanColumn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), fallbackId: z.string().uuid() }))
  .handler(async ({ data }) => {
    const db = await getPool();
    await db.query("update public.kanban_cards set column_id=$1, updated_at=now() where column_id=$2", [data.fallbackId, data.id]);
    await db.query("delete from public.kanban_columns where id=$1", [data.id]);
    return { ok: true };
  });
