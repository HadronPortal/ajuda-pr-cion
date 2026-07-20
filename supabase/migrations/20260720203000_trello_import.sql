alter table public.kanban_boards
  add column if not exists legacy_id text,
  add column if not exists source_url text,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;
create unique index if not exists kanban_boards_legacy_id_idx on public.kanban_boards (legacy_id) where legacy_id is not null;

alter table public.kanban_columns
  add column if not exists legacy_id text,
  add column if not exists source_position numeric,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;
create unique index if not exists kanban_columns_legacy_id_idx on public.kanban_columns (legacy_id) where legacy_id is not null;

alter table public.kanban_cards
  add column if not exists legacy_id text,
  add column if not exists source_url text,
  add column if not exists labels jsonb not null default '[]'::jsonb,
  add column if not exists member_legacy_ids jsonb not null default '[]'::jsonb,
  add column if not exists cover jsonb not null default '{}'::jsonb,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;
create unique index if not exists kanban_cards_legacy_id_idx on public.kanban_cards (legacy_id) where legacy_id is not null;

alter table public.kanban_checklist_items
  add column if not exists legacy_id text,
  add column if not exists checklist_legacy_id text,
  add column if not exists checklist_title text,
  add column if not exists due_at timestamptz,
  add column if not exists member_legacy_id text,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;
create unique index if not exists kanban_checklist_items_legacy_id_idx on public.kanban_checklist_items (legacy_id) where legacy_id is not null;

alter table public.kanban_comments
  add column if not exists legacy_id text,
  add column if not exists author_legacy_id text,
  add column if not exists author_name text,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;
create unique index if not exists kanban_comments_legacy_id_idx on public.kanban_comments (legacy_id) where legacy_id is not null;

create table if not exists public.kanban_trello_members (
  legacy_id text primary key,
  full_name text,
  username text,
  initials text,
  avatar_url text,
  source_payload jsonb not null default '{}'::jsonb
);

create table if not exists public.kanban_card_trello_members (
  card_id uuid not null references public.kanban_cards(id) on delete cascade,
  member_legacy_id text not null references public.kanban_trello_members(legacy_id) on delete cascade,
  primary key (card_id, member_legacy_id)
);

create table if not exists public.kanban_card_attachments (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.kanban_cards(id) on delete cascade,
  legacy_id text not null,
  name text,
  url text,
  mime_type text,
  bytes bigint,
  position numeric,
  is_upload boolean not null default false,
  created_at timestamptz,
  source_payload jsonb not null default '{}'::jsonb,
  unique (card_id, legacy_id)
);

alter table public.kanban_trello_members enable row level security;
alter table public.kanban_card_trello_members enable row level security;
alter table public.kanban_card_attachments enable row level security;
create policy kanban_trello_members_staff on public.kanban_trello_members for all using (public.is_staff()) with check (public.is_staff());
create policy kanban_card_trello_members_staff on public.kanban_card_trello_members for all using (public.is_staff()) with check (public.is_staff());
create policy kanban_card_attachments_staff on public.kanban_card_attachments for all using (public.is_staff()) with check (public.is_staff());
