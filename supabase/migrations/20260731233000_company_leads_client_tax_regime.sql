-- O regime do cadastro de clientes prevalece na apresentação da prospecção.
update public.company_leads lead
set raw_payload = coalesce(lead.raw_payload, '{}'::jsonb) || jsonb_build_object(
      'client_company', true,
      'tax_regime', company.tax_regime,
      'simple', company.tax_regime in ('0', '3'),
      'mei', company.tax_regime = '3'
    ),
    updated_at = now()
from (
  select distinct on (regexp_replace(coalesce(document, ''), '\D', '', 'g')) *
  from public.client_companies
  where regexp_replace(coalesce(document, ''), '\D', '', 'g') <> ''
  order by regexp_replace(coalesce(document, ''), '\D', '', 'g'), active desc, updated_at desc, id
) company
where lead.cnpj = regexp_replace(coalesce(company.document, ''), '\D', '', 'g')
;

create or replace function public.sync_client_company_to_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_cnpj text := regexp_replace(coalesce(new.document, ''), '\D', '', 'g');
  client_payload jsonb := jsonb_build_object(
    'client_company', true,
    'tax_regime', new.tax_regime,
    'simple', new.tax_regime in ('0', '3'),
    'mei', new.tax_regime = '3'
  );
begin
  if normalized_cnpj = '' then
    return new;
  end if;

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
  ) values (
    normalized_cnpj,
    coalesce(nullif(trim(new.legal_name), ''), nullif(trim(new.trade_name), ''), 'Empresa cliente'),
    nullif(trim(new.trade_name), ''),
    case when new.active then 'ATIVA' else 'INATIVA' end,
    nullif(regexp_replace(coalesce(new.cnae, ''), '\D', '', 'g'), ''),
    case upper(coalesce(new.size, ''))
      when 'M' then 'Médio'
      when 'P' then 'Pequeno'
      when 'G' then 'Grande'
      else nullif(trim(new.size), '')
    end,
    coalesce(nullif(trim(new.city), ''), 'Não informada'),
    coalesce(nullif(upper(trim(new.state)), ''), 'SP'),
    nullif(regexp_replace(coalesce(new.postal_code, ''), '\D', '', 'g'), ''),
    nullif(trim(new.address), ''),
    'procion-crm',
    20,
    client_payload,
    nullif(trim(concat_ws(' ', new.legal_name, new.trade_name)), ''),
    new.client_id,
    new.id
  )
  on conflict (cnpj) do update set
    raw_payload = coalesce(company_leads.raw_payload, '{}'::jsonb) || client_payload,
    search_alias = excluded.search_alias,
    existing_client_id = excluded.existing_client_id,
    existing_client_company_id = excluded.existing_client_company_id,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_client_company_to_lead_trigger on public.client_companies;
create trigger sync_client_company_to_lead_trigger
after insert or update of document, legal_name, trade_name, active, cnae, size, tax_regime,
  city, state, postal_code, address, client_id
on public.client_companies
for each row execute function public.sync_client_company_to_lead();

-- Consultas sem recorte de abertura percorrem um conjunto maior. Mantém o limite
-- do resultado em 5.001 registros, mas evita transformar picos legítimos em erro 500.
alter function public.company_leads_search(jsonb, text, text, integer, integer)
  set statement_timeout = '45s';
