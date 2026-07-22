alter table public.kanban_boards
  add column if not exists background_type text not null default 'color',
  add column if not exists background_value text,
  add column if not exists background_mode text not null default 'cover',
  add column if not exists background_text_theme text not null default 'auto';

create table if not exists public.kanban_board_invites (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.kanban_boards(id) on delete cascade,
  invite_type text not null check (invite_type in ('email', 'link')),
  email text,
  role text not null default 'member' check (role in ('admin', 'member', 'observer')),
  token uuid not null default gen_random_uuid() unique,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'revoked', 'expired')),
  expires_at timestamptz,
  max_uses integer,
  uses_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists kanban_board_invites_board_id_idx
  on public.kanban_board_invites(board_id, status);

alter table public.kanban_board_invites enable row level security;

insert into storage.buckets (id, name, public)
values ('kanban-backgrounds', 'kanban-backgrounds', true)
on conflict (id) do update set public = true;
