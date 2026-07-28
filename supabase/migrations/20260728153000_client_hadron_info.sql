create table if not exists public.client_hadron_info (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  legacy_key text not null,
  company_number integer,
  branch_number integer,
  company_description text,
  terminal_number integer,
  version_released_at date,
  operating_system text,
  operating_system_version text,
  emits_nfe boolean,
  notes_issued bigint not null default 0,
  memory_used numeric,
  memory_total numeric,
  drives jsonb not null default '[]'::jsonb,
  certificate_type text,
  certificate_expires_at date,
  environment text,
  total_incompatible bigint,
  registered_at timestamptz,
  technical_updated_at timestamptz,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, legacy_key)
);

create index if not exists client_hadron_info_client_idx
  on public.client_hadron_info (client_id, company_number);

alter table public.client_hadron_info enable row level security;

drop policy if exists client_hadron_info_access on public.client_hadron_info;
create policy client_hadron_info_access on public.client_hadron_info
  for select using (public.can_access_client(client_id));

drop trigger if exists set_updated_at on public.client_hadron_info;
create trigger set_updated_at before update on public.client_hadron_info
  for each row execute function public.set_updated_at();

create or replace function public.get_crm_client_hadron_info(client_acronym text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(to_jsonb(info) order by info.company_number, info.terminal_number), '[]'::jsonb)
  from public.client_hadron_info info
  join public.clients client on client.id = info.client_id
  where upper(client.acronym) = upper(client_acronym);
$$;

grant execute on function public.get_crm_client_hadron_info(text) to authenticated, anon;
