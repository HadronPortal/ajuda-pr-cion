alter table public.company_leads
  add column if not exists company_root text,
  add column if not exists branch_type text,
  add column if not exists secondary_cnaes text[] not null default '{}'::text[],
  add column if not exists phone_secondary text,
  add column if not exists fax text,
  add column if not exists capital_social numeric(18, 2),
  add column if not exists responsible_qualification text,
  add column if not exists special_status text,
  add column if not exists special_status_at date,
  add column if not exists simple_opted_at date,
  add column if not exists simple_excluded_at date,
  add column if not exists mei_opted_at date,
  add column if not exists mei_excluded_at date;

create index if not exists company_leads_company_root_idx
  on public.company_leads (company_root);

create table if not exists public.company_lead_partners (
  id uuid primary key default gen_random_uuid(),
  company_root text not null,
  source_key text not null unique,
  partner_name text not null,
  partner_type text not null,
  qualification text,
  joined_at date,
  country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists company_lead_partners_root_idx
  on public.company_lead_partners (company_root, partner_name);

alter table public.company_lead_partners enable row level security;

drop policy if exists "company_lead_partners_read" on public.company_lead_partners;
create policy "company_lead_partners_read"
  on public.company_lead_partners for select
  to anon, authenticated
  using (true);

revoke insert, update, delete on public.company_lead_partners from anon, authenticated;
grant select on public.company_lead_partners to anon, authenticated;

create or replace function public.company_lead_details(p_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select to_jsonb(lead) || jsonb_build_object(
    'phone', nullif(lead.raw_payload->>'phone', ''),
    'email', nullif(lead.raw_payload->>'email', ''),
    'mei', coalesce((lead.raw_payload->>'mei')::boolean, false),
    'simples', coalesce((lead.raw_payload->>'simple')::boolean, false),
    'partners', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', partner.id,
          'name', partner.partner_name,
          'type', partner.partner_type,
          'qualification', partner.qualification,
          'joined_at', partner.joined_at,
          'country', partner.country
        ) order by partner.partner_name
      )
      from public.company_lead_partners partner
      where partner.company_root = coalesce(lead.company_root, left(lead.cnpj, 8))
    ), '[]'::jsonb)
  )
  from public.company_leads lead
  where lead.id = p_id;
$$;

revoke all on function public.company_lead_details(uuid) from public;
grant execute on function public.company_lead_details(uuid) to anon, authenticated;
