create table if not exists public.company_leads (
  id uuid primary key default gen_random_uuid(),
  cnpj text not null unique,
  legal_name text not null,
  trade_name text,
  opened_at date,
  registration_status text not null default 'ATIVA',
  status_updated_at date,
  cnae_code text,
  cnae_description text,
  company_size text,
  legal_nature text,
  city text not null,
  state text not null,
  postal_code text,
  neighborhood text,
  address text,
  source text not null default 'receita-federal',
  source_url text,
  relevance_score integer not null default 0,
  stage text not null default 'novo'
    check (stage in ('novo', 'em_analise', 'qualificado', 'descartado', 'convertido')),
  assigned_to text,
  notes text,
  discovered_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  raw_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_leads_location_idx
  on public.company_leads (state, city, opened_at desc);

create index if not exists company_leads_cnae_idx
  on public.company_leads (cnae_code);

create index if not exists company_leads_stage_idx
  on public.company_leads (stage, relevance_score desc);

alter table public.company_leads enable row level security;

drop policy if exists "company_leads_read" on public.company_leads;
create policy "company_leads_read"
  on public.company_leads for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.company_leads from anon, authenticated;
grant select on public.company_leads to anon, authenticated;

create or replace function public.company_leads_list(
  p_city text default null,
  p_state text default null,
  p_opened_after date default null,
  p_cnae text default null,
  p_company_size text default null,
  p_limit integer default 50
)
returns setof public.company_leads
language sql
stable
security definer
set search_path = public
as $$
  select lead.*
  from public.company_leads lead
  where (nullif(trim(p_city), '') is null or lead.city ilike '%' || trim(p_city) || '%')
    and (nullif(trim(p_state), '') is null or lead.state = upper(trim(p_state)))
    and (p_opened_after is null or lead.opened_at >= p_opened_after)
    and (nullif(regexp_replace(coalesce(p_cnae, ''), '\D', '', 'g'), '') is null
      or lead.cnae_code like regexp_replace(p_cnae, '\D', '', 'g') || '%')
    and (nullif(trim(p_company_size), '') is null
      or lead.company_size ilike '%' || trim(p_company_size) || '%')
  order by lead.relevance_score desc, lead.opened_at desc nulls last
  limit least(greatest(coalesce(p_limit, 50), 1), 100);
$$;

create or replace function public.company_leads_update_stage(
  p_id uuid,
  p_stage text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_stage not in ('novo', 'em_analise', 'qualificado', 'descartado', 'convertido') then
    raise exception 'Etapa de lead inválida.';
  end if;

  update public.company_leads
  set stage = p_stage, updated_at = now()
  where id = p_id;
end;
$$;

revoke all on function public.company_leads_list(text, text, date, text, text, integer)
  from public;
revoke all on function public.company_leads_update_stage(uuid, text)
  from public;
grant execute on function public.company_leads_list(text, text, date, text, text, integer)
  to anon, authenticated;
grant execute on function public.company_leads_update_stage(uuid, text)
  to anon, authenticated;
