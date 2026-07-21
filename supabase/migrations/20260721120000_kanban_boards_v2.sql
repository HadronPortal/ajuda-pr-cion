alter table public.kanban_boards
  add column if not exists color text,
  add column if not exists cover text,
  add column if not exists visibility text not null default 'team',
  add column if not exists is_favorite boolean not null default false;

create table if not exists public.kanban_board_members (
  board_id uuid not null references public.kanban_boards(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (board_id, profile_id)
);

create index if not exists kanban_board_members_profile_idx
  on public.kanban_board_members (profile_id);
