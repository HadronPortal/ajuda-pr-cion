-- Garante que toda empresa cliente também seja localizável na prospecção.
insert into public.company_leads (
  cnpj,
  legal_name,
  trade_name,
  registration_status,
  cnae_code,
  company_size,
  city,
  state,
  postal_code,
  address,
  source,
  relevance_score,
  raw_payload,
  search_alias,
  existing_client_id,
  existing_client_company_id
)
select distinct on (regexp_replace(coalesce(company.document, ''), '\D', '', 'g'))
  regexp_replace(coalesce(company.document, ''), '\D', '', 'g'),
  coalesce(nullif(trim(company.legal_name), ''), nullif(trim(company.trade_name), ''), 'Empresa cliente'),
  nullif(trim(company.trade_name), ''),
  case when company.active then 'ATIVA' else 'INATIVA' end,
  nullif(regexp_replace(coalesce(company.cnae, ''), '\D', '', 'g'), ''),
  case upper(coalesce(company.size, ''))
    when 'M' then 'Médio'
    when 'P' then 'Pequeno'
    when 'G' then 'Grande'
    else nullif(trim(company.size), '')
  end,
  coalesce(nullif(trim(company.city), ''), 'Não informada'),
  coalesce(nullif(upper(trim(company.state)), ''), 'SP'),
  nullif(regexp_replace(coalesce(company.postal_code, ''), '\D', '', 'g'), ''),
  nullif(trim(company.address), ''),
  'procion-crm',
  20,
  jsonb_build_object('client_company', true),
  nullif(trim(concat_ws(' ', company.legal_name, company.trade_name)), ''),
  company.client_id,
  company.id
from public.client_companies company
where regexp_replace(coalesce(company.document, ''), '\D', '', 'g') <> ''
order by regexp_replace(coalesce(company.document, ''), '\D', '', 'g'), company.id
on conflict (cnpj) do update set
  search_alias = excluded.search_alias,
  existing_client_id = excluded.existing_client_id,
  existing_client_company_id = excluded.existing_client_company_id,
  updated_at = now();
