alter table public.clients
  add column if not exists crm_created_at timestamptz,
  add column if not exists version text,
  add column if not exists version_released_at date,
  add column if not exists setup_at timestamptz,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;

alter table public.client_contacts
  add column if not exists legacy_key text,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;

create unique index if not exists client_contacts_legacy_key_idx
  on public.client_contacts (client_id, legacy_key)
  where legacy_key is not null;

alter table public.client_terminals
  add column if not exists legacy_key text,
  add column if not exists ip_address inet,
  add column if not exists install_path text,
  add column if not exists version_released_at date,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;

create unique index if not exists client_terminals_legacy_key_idx
  on public.client_terminals (client_id, legacy_key)
  where legacy_key is not null;

create table if not exists public.client_companies (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  legacy_key text not null,
  company_number integer,
  legal_name text,
  trade_name text,
  document text,
  state_registration text,
  municipal_registration text,
  cnae text,
  industry text,
  size text,
  tax_regime text,
  address text,
  city text,
  state char(2),
  postal_code text,
  responsible_name text,
  responsible_document text,
  accountant_name text,
  accountant_phone text,
  accountant_email text,
  active boolean not null default true,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, legacy_key)
);

create table if not exists public.client_hadron_users (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  legacy_key text not null,
  name text,
  email text,
  operator text,
  role text,
  active boolean not null default true,
  crm_created_at timestamptz,
  crm_updated_at timestamptz,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, legacy_key)
);

create table if not exists public.client_crm_snapshots (
  client_id uuid primary key references public.clients(id) on delete cascade,
  source_url text not null,
  client_text text,
  hadron_text text,
  users_text text,
  terminals_text text,
  companies_text text,
  payload jsonb not null default '{}'::jsonb,
  imported_at timestamptz not null default now()
);

alter table public.client_companies enable row level security;
alter table public.client_hadron_users enable row level security;
alter table public.client_crm_snapshots enable row level security;

create policy client_companies_access on public.client_companies
  for select using (public.can_access_client(client_id));
create policy client_hadron_users_access on public.client_hadron_users
  for select using (public.can_access_client(client_id));
create policy client_crm_snapshots_access on public.client_crm_snapshots
  for select using (public.can_access_client(client_id));
