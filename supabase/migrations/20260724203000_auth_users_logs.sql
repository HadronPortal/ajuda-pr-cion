create table if not exists public.auth_usuarios (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  client_id uuid references public.clients(id) on delete cascade,
  client_acronym text,
  name text,
  email text,
  operator text,
  hadron_code text,
  representative_code text,
  profile text,
  status text,
  active boolean not null default true,
  crm_created_at timestamptz,
  crm_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tab_colaboradores (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  profile_id uuid references public.profiles(id) on delete set null,
  email text,
  clb_departamento text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auth_logs (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  auth_usuario_id uuid references public.auth_usuarios(id) on delete set null,
  auth_usuario_legacy_id text,
  client_id uuid references public.clients(id) on delete set null,
  client_acronym text,
  action text,
  controller text,
  operator text,
  agent text,
  device text,
  ip_address inet,
  url text,
  info text,
  params jsonb,
  crm_created_at timestamptz,
  crm_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists auth_usuarios_client_id_idx on public.auth_usuarios(client_id);
create index if not exists auth_usuarios_profile_idx on public.auth_usuarios(lower(profile));
create index if not exists tab_colaboradores_profile_id_idx on public.tab_colaboradores(profile_id);
create index if not exists tab_colaboradores_email_idx on public.tab_colaboradores(lower(email));
create index if not exists auth_logs_client_id_idx on public.auth_logs(client_id);
create index if not exists auth_logs_auth_usuario_id_idx on public.auth_logs(auth_usuario_id);
create index if not exists auth_logs_created_at_idx on public.auth_logs(crm_created_at desc);

create or replace function public.is_auth_s_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    lower(coalesce(auth.jwt() -> 'app_metadata' ->> 'perfil', '')) = 's_admin'
    or lower(coalesce(auth.jwt() -> 'user_metadata' ->> 'perfil', '')) = 's_admin'
    or exists (
      select 1
      from public.auth_usuarios legacy_user
      where legacy_user.active
        and lower(legacy_user.profile) = 's_admin'
        and lower(legacy_user.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    );
$$;

create or replace function public.is_admin_department_collaborator()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.tab_colaboradores collaborator
    where collaborator.active
      and lower(collaborator.clb_departamento) = 'admin'
      and (
        collaborator.profile_id = auth.uid()
        or lower(collaborator.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
      )
  );
$$;

alter table public.auth_usuarios enable row level security;
alter table public.tab_colaboradores enable row level security;
alter table public.auth_logs enable row level security;

drop policy if exists auth_usuarios_read on public.auth_usuarios;
create policy auth_usuarios_read on public.auth_usuarios
  for select using (public.can_access_client(client_id) or public.is_auth_s_admin());

drop policy if exists auth_usuarios_s_admin_insert on public.auth_usuarios;
create policy auth_usuarios_s_admin_insert on public.auth_usuarios
  for insert with check (public.is_auth_s_admin());

drop policy if exists auth_usuarios_s_admin_update on public.auth_usuarios;
create policy auth_usuarios_s_admin_update on public.auth_usuarios
  for update using (public.is_auth_s_admin()) with check (public.is_auth_s_admin());

drop policy if exists tab_colaboradores_self_or_staff on public.tab_colaboradores;
create policy tab_colaboradores_self_or_staff on public.tab_colaboradores
  for select using (profile_id = auth.uid() or public.is_staff());

drop policy if exists auth_logs_admin_department_read on public.auth_logs;
create policy auth_logs_admin_department_read on public.auth_logs
  for select using (public.is_admin_department_collaborator());

drop trigger if exists set_updated_at on public.auth_usuarios;
create trigger set_updated_at before update on public.auth_usuarios
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.tab_colaboradores;
create trigger set_updated_at before update on public.tab_colaboradores
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.auth_logs;
create trigger set_updated_at before update on public.auth_logs
  for each row execute function public.set_updated_at();

grant select on public.auth_usuarios to authenticated;
grant insert, update on public.auth_usuarios to authenticated;
grant select on public.tab_colaboradores to authenticated;
grant select on public.auth_logs to authenticated;
