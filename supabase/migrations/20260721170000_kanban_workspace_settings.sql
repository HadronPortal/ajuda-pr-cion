alter table public.kanban_workspaces
  add column if not exists slug text,
  add column if not exists website text not null default '',
  add column if not exists settings jsonb not null default '{
    "memberRestriction": "admins",
    "boardCreation": "members",
    "boardDeletion": "admins",
    "guestSharing": "admins"
  }'::jsonb;

update public.kanban_workspaces
set slug = lower(regexp_replace(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
where slug is null or slug = '';

alter table public.kanban_workspaces alter column slug set not null;

create unique index if not exists kanban_workspaces_slug_unique
  on public.kanban_workspaces (slug);
