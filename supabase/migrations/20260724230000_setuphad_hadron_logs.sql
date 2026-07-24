alter table public.client_terminals
  add column if not exists serial_number text,
  add column if not exists legacy_flags text;

create table if not exists public.tab_hadron_logs (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  client_id uuid references public.clients(id) on delete set null,
  client_acronym text,
  ip_address inet,
  level text,
  terminal_code text,
  operation text,
  new_operation_id text,
  new_operator_code text,
  parent_option text,
  child_option text,
  serial_number text,
  user_code text,
  previous_operation_id text,
  previous_operator_code text,
  previous_drive text,
  current_drive text,
  crm_created_at timestamptz,
  crm_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tab_hadron_logs_client_id_idx
  on public.tab_hadron_logs(client_id);
create index if not exists tab_hadron_logs_created_at_idx
  on public.tab_hadron_logs(crm_created_at desc);
create index if not exists tab_hadron_logs_terminal_idx
  on public.tab_hadron_logs(client_acronym, terminal_code);

alter table public.tab_hadron_logs enable row level security;

drop policy if exists tab_hadron_logs_admin_department_read on public.tab_hadron_logs;
create policy tab_hadron_logs_admin_department_read on public.tab_hadron_logs
  for select using (public.is_admin_department_collaborator());

drop trigger if exists set_updated_at on public.tab_hadron_logs;
create trigger set_updated_at before update on public.tab_hadron_logs
  for each row execute function public.set_updated_at();

grant select on public.tab_hadron_logs to authenticated;

