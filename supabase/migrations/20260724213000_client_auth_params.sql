create table if not exists public.tab_cli_params (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  client_id uuid references public.clients(id) on delete cascade,
  client_acronym text,
  auth_usuario_id uuid references public.auth_usuarios(id) on delete set null,
  auth_usuario_legacy_id text,
  cvs_parameter_legacy_id text,
  cvs_option_legacy_id text,
  parameter_signature text,
  option_data jsonb,
  crm_created_at timestamptz,
  crm_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tab_cli_params_client_id_idx
  on public.tab_cli_params(client_id);
create index if not exists tab_cli_params_auth_usuario_id_idx
  on public.tab_cli_params(auth_usuario_id);
create index if not exists tab_cli_params_parameter_idx
  on public.tab_cli_params(cvs_parameter_legacy_id);

alter table public.tab_cli_params enable row level security;

drop policy if exists tab_cli_params_read on public.tab_cli_params;
create policy tab_cli_params_read on public.tab_cli_params
  for select using (
    public.can_access_client(client_id)
    or public.is_auth_s_admin()
  );

drop policy if exists tab_cli_params_s_admin_insert on public.tab_cli_params;
create policy tab_cli_params_s_admin_insert on public.tab_cli_params
  for insert with check (public.is_auth_s_admin());

drop policy if exists tab_cli_params_s_admin_update on public.tab_cli_params;
create policy tab_cli_params_s_admin_update on public.tab_cli_params
  for update using (public.is_auth_s_admin()) with check (public.is_auth_s_admin());

drop trigger if exists set_updated_at on public.tab_cli_params;
create trigger set_updated_at before update on public.tab_cli_params
  for each row execute function public.set_updated_at();

grant select, insert, update on public.tab_cli_params to authenticated;

