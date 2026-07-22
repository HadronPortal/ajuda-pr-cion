alter table public.clients
  add column if not exists name text,
  add column if not exists address text,
  add column if not exists address_number text,
  add column if not exists neighborhood text,
  add column if not exists address_complement text,
  add column if not exists primary_operator text,
  add column if not exists secondary_operator text,
  add column if not exists inactive_at timestamptz,
  add column if not exists inactive_by text,
  add column if not exists website text,
  add column if not exists state_registration text,
  add column if not exists municipal_registration text,
  add column if not exists cnae text,
  add column if not exists tax_regime text;

drop function if exists public.list_crm_clients();
create function public.list_crm_clients(p_limit integer default 500, p_offset integer default 0)
returns table (
  id uuid, legacy_id text, acronym varchar, group_acronym varchar, name text,
  legal_name text, trade_name text, document varchar, industry text, size text,
  city text, state char, postal_code varchar, active boolean,
  crm_created_at timestamptz, crm_updated_at timestamptz, version text,
  version_released_at date, setup_at timestamptz
)
language sql stable security definer set search_path = public
as $$
  select c.id, c.legacy_id, c.acronym, c.group_acronym, c.name,
    c.legal_name, c.trade_name, c.document, c.industry, c.size,
    c.city, c.state, c.postal_code, c.active, c.crm_created_at,
    c.crm_updated_at, c.version, c.version_released_at, c.setup_at
  from public.clients c
  order by c.legal_name, c.acronym
  limit least(greatest(p_limit, 1), 500)
  offset greatest(p_offset, 0);
$$;

grant execute on function public.list_crm_clients(integer, integer) to anon, authenticated;

create or replace function public.get_crm_client(client_acronym text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'client', to_jsonb(c),
    'companies', coalesce((select jsonb_agg(to_jsonb(e) order by e.company_number, e.legal_name)
      from public.client_companies e where e.client_id = c.id), '[]'::jsonb),
    'contacts', coalesce((select jsonb_agg(to_jsonb(cc) order by cc.name, cc.email, cc.phone)
      from public.client_contacts cc where cc.client_id = c.id), '[]'::jsonb)
  )
  from public.clients c
  where lower(c.acronym) = lower(client_acronym)
  limit 1;
$$;

grant execute on function public.get_crm_client(text) to anon, authenticated;
