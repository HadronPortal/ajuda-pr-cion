import fs from "node:fs";
import pg from "pg";

const file = process.argv[2];
const databaseUrl = process.env.DATABASE_URL;
const resume = process.env.TRELLO_RESUME === "1";
if (!file || !databaseUrl) throw new Error("Uso: DATABASE_URL=... npm run import:trello -- caminho/board.json");

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const pool = new pg.Pool({ connectionString: databaseUrl, ssl: { rejectUnauthorized: false }, max: 4 });
const priorityFor = (card) => {
  const labels = card.labels || [];
  if (labels.some((label) => /alta/i.test(label.name))) return "high";
  if (labels.some((label) => /m[eé]dia/i.test(label.name))) return "medium";
  if (labels.some((label) => /normal|baixa/i.test(label.name))) return "low";
  return null;
};

const boardResult = await pool.query(`
  insert into public.kanban_boards (legacy_id, name, description, archived, source_url, source_payload)
  values ($1,$2,$3,$4,$5,$6)
  on conflict (legacy_id) where legacy_id is not null do update set
    name=excluded.name, description=excluded.description, archived=excluded.archived,
    source_url=excluded.source_url, source_payload=excluded.source_payload, updated_at=now()
  returning id
`, [data.id, data.name, data.desc || null, Boolean(data.closed), data.url || null, JSON.stringify(data)]);
const boardId = boardResult.rows[0].id;

for (const member of data.members || []) {
  await pool.query(`insert into public.kanban_trello_members
    (legacy_id, full_name, username, initials, avatar_url, source_payload) values ($1,$2,$3,$4,$5,$6)
    on conflict (legacy_id) do update set full_name=excluded.full_name, username=excluded.username,
      initials=excluded.initials, avatar_url=excluded.avatar_url, source_payload=excluded.source_payload`,
    [member.id, member.fullName || null, member.username || null, member.initials || null, member.avatarUrl || null, JSON.stringify(member)]);
}

const columnIds = new Map();
const lists = [...(data.lists || [])].sort((a, b) => a.pos - b.pos);
for (let index = 0; index < lists.length; index += 1) {
  const list = lists[index];
  const result = await pool.query(`insert into public.kanban_columns
    (board_id, legacy_id, name, position, archived, source_position, source_payload)
    values ($1,$2,$3,$4,$5,$6,$7)
    on conflict (legacy_id) where legacy_id is not null do update set name=excluded.name,
      position=excluded.position, archived=excluded.archived, source_position=excluded.source_position,
      source_payload=excluded.source_payload returning id`,
    [boardId, list.id, list.name, index, Boolean(list.closed), list.pos, JSON.stringify(list)]);
  columnIds.set(list.id, result.rows[0].id);
}

const cardIds = new Map();
if (resume) {
  const existing = await pool.query(`select c.id, c.legacy_id from public.kanban_cards c
    join public.kanban_columns col on col.id = c.column_id where col.board_id = $1`, [boardId]);
  for (const card of existing.rows) cardIds.set(card.legacy_id, card.id);
}
for (const card of resume ? [] : (data.cards || [])) {
  const columnId = columnIds.get(card.idList);
  if (!columnId) continue;
  const result = await pool.query(`insert into public.kanban_cards
    (column_id, legacy_id, title, description, priority, due_at, position, archived,
     source_url, labels, member_legacy_ids, cover, source_payload, created_at, updated_at)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    on conflict (legacy_id) where legacy_id is not null do update set column_id=excluded.column_id,
      title=excluded.title, description=excluded.description, priority=excluded.priority,
      due_at=excluded.due_at, position=excluded.position, archived=excluded.archived,
      source_url=excluded.source_url, labels=excluded.labels, member_legacy_ids=excluded.member_legacy_ids,
      cover=excluded.cover, source_payload=excluded.source_payload, updated_at=excluded.updated_at returning id`,
    [columnId, card.id, card.name, card.desc || null, priorityFor(card), card.due || null, card.pos,
      Boolean(card.closed), card.url || card.shortUrl || null, JSON.stringify(card.labels || []),
      JSON.stringify(card.idMembers || []), JSON.stringify(card.cover || {}), JSON.stringify(card),
      card.dateLastActivity || new Date().toISOString(), card.dateLastActivity || new Date().toISOString()]);
  const cardId = result.rows[0].id;
  cardIds.set(card.id, cardId);
  for (const memberId of card.idMembers || []) {
    if (!(data.members || []).some((member) => member.id === memberId)) continue;
    await pool.query(`insert into public.kanban_card_trello_members (card_id, member_legacy_id)
      values ($1,$2) on conflict do nothing`, [cardId, memberId]);
  }
  for (const attachment of card.attachments || []) {
    await pool.query(`insert into public.kanban_card_attachments
      (card_id, legacy_id, name, url, mime_type, bytes, position, is_upload, created_at, source_payload)
      values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      on conflict (card_id, legacy_id) do update set name=excluded.name, url=excluded.url,
        mime_type=excluded.mime_type, bytes=excluded.bytes, position=excluded.position,
        is_upload=excluded.is_upload, source_payload=excluded.source_payload`,
      [cardId, attachment.id, attachment.name || null, attachment.url || null, attachment.mimeType || null,
        attachment.bytes || null, attachment.pos || null, Boolean(attachment.isUpload), attachment.date || null,
        JSON.stringify(attachment)]);
  }
}

let checklistItems = 0;
const checklistRows = [];
for (const checklist of data.checklists || []) {
  const cardId = cardIds.get(checklist.idCard);
  if (!cardId) continue;
  for (const item of checklist.checkItems || []) {
    checklistRows.push({ card_id: cardId, legacy_id: item.id, checklist_legacy_id: checklist.id,
      checklist_title: checklist.name, title: item.name, completed: item.state === "complete",
      position: Math.round(item.pos || 0), due_at: item.due || "", member_legacy_id: item.idMember || "",
      source_payload: item });
    checklistItems += 1;
  }
}
for (let index = 0; index < checklistRows.length; index += 500) {
  const chunk = checklistRows.slice(index, index + 500);
  await pool.query(`insert into public.kanban_checklist_items
    (card_id, legacy_id, checklist_legacy_id, checklist_title, title, completed, position,
     due_at, member_legacy_id, source_payload)
    select x.card_id::uuid, x.legacy_id, x.checklist_legacy_id, x.checklist_title, x.title,
      x.completed, x.position, nullif(x.due_at, '')::timestamptz, nullif(x.member_legacy_id, ''), x.source_payload
    from jsonb_to_recordset($1::jsonb) as x(card_id text, legacy_id text, checklist_legacy_id text,
      checklist_title text, title text, completed boolean, position bigint, due_at text,
      member_legacy_id text, source_payload jsonb)
    on conflict (legacy_id) where legacy_id is not null do update set checklist_title=excluded.checklist_title,
      title=excluded.title, completed=excluded.completed, position=excluded.position,
      due_at=excluded.due_at, member_legacy_id=excluded.member_legacy_id, source_payload=excluded.source_payload`,
    [JSON.stringify(chunk)]);
}

let comments = 0;
for (const action of (data.actions || []).filter((item) => item.type === "commentCard")) {
  const cardId = cardIds.get(action.data?.card?.id);
  if (!cardId) continue;
  await pool.query(`insert into public.kanban_comments
    (card_id, legacy_id, author_legacy_id, author_name, body, created_at, source_payload)
    values ($1,$2,$3,$4,$5,$6,$7)
    on conflict (legacy_id) where legacy_id is not null do update set body=excluded.body,
      author_legacy_id=excluded.author_legacy_id, author_name=excluded.author_name,
      source_payload=excluded.source_payload`,
    [cardId, action.id, action.idMemberCreator || null, action.memberCreator?.fullName || null,
      action.data?.text || "", action.date, JSON.stringify(action)]);
  comments += 1;
}

await pool.end();
console.log(JSON.stringify({ board: data.name, lists: lists.length, cards: cardIds.size,
  members: (data.members || []).length, checklistItems, comments,
  attachments: (data.cards || []).reduce((sum, card) => sum + (card.attachments?.length || 0), 0) }, null, 2));
