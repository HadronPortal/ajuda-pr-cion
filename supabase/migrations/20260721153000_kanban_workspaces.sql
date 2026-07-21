create table if not exists public.kanban_workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  logo_url text,
  visibility text not null default 'private' check (visibility in ('private', 'company')),
  owner_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kanban_workspace_members (
  workspace_id uuid not null references public.kanban_workspaces(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('admin', 'member', 'guest')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, profile_id)
);

alter table public.kanban_boards
  add column if not exists workspace_id uuid references public.kanban_workspaces(id) on delete set null;

create index if not exists kanban_boards_workspace_idx
  on public.kanban_boards (workspace_id, archived, updated_at desc);

create index if not exists kanban_workspace_members_profile_idx
  on public.kanban_workspace_members (profile_id);

do $$
declare
  default_workspace_id uuid;
begin
  select id into default_workspace_id
  from public.kanban_workspaces
  order by created_at
  limit 1;

  if default_workspace_id is null then
    insert into public.kanban_workspaces (name, description, visibility)
    values (
      'Desenvolvimento Procion',
      'Projetos, melhorias e demandas internas da Procion.',
      'private'
    )
    returning id into default_workspace_id;
  end if;

  update public.kanban_boards
  set workspace_id = default_workspace_id
  where workspace_id is null;
end $$;

alter table public.kanban_workspaces enable row level security;
alter table public.kanban_workspace_members enable row level security;

drop policy if exists kanban_workspaces_staff on public.kanban_workspaces;
create policy kanban_workspaces_staff on public.kanban_workspaces
  for all using (public.is_staff()) with check (public.is_staff());

drop policy if exists kanban_workspace_members_staff on public.kanban_workspace_members;
create policy kanban_workspace_members_staff on public.kanban_workspace_members
  for all using (public.is_staff()) with check (public.is_staff());

drop trigger if exists set_updated_at on public.kanban_workspaces;
create trigger set_updated_at before update on public.kanban_workspaces
  for each row execute function public.set_updated_at();
