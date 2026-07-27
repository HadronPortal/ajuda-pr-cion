create or replace function public.get_crm_client_group_companies(client_acronym text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with target as (
    select
      client.acronym,
      coalesce(nullif(client.group_acronym, ''), client.acronym) as group_code
    from public.clients client
    where upper(client.acronym) = upper(get_crm_client_group_companies.client_acronym)
    limit 1
  ),
  members as (
    select member.*
    from public.clients member
    cross join target
    where upper(member.acronym) = upper(target.group_code)
       or upper(coalesce(member.group_acronym, '')) = upper(target.group_code)
  ),
  company_rows as (
    select
      company.id,
      member.acronym as client_acronym,
      coalesce(
        substring(member.legal_name from '\(([0-9]{3})\)\s*$'),
        substring(coalesce(member.source_payload ->> 'cli_nome', '') from '\(([0-9]{3})\)\s*$')
      ) as group_position,
      company.company_number,
      company.legal_name,
      company.trade_name,
      company.document,
      company.state_registration,
      company.municipal_registration,
      company.cnae,
      company.industry,
      company.size,
      company.tax_regime,
      company.address,
      company.city,
      company.state,
      company.postal_code,
      company.responsible_name,
      company.responsible_document,
      company.accountant_name,
      company.accountant_phone,
      company.accountant_email,
      company.active,
      company.source_payload
    from members member
    join public.client_companies company on company.client_id = member.id

    union all

    select
      member.id,
      member.acronym,
      coalesce(
        substring(member.legal_name from '\(([0-9]{3})\)\s*$'),
        substring(coalesce(member.source_payload ->> 'cli_nome', '') from '\(([0-9]{3})\)\s*$')
      ),
      null::integer,
      member.legal_name,
      member.trade_name,
      member.document,
      member.source_payload ->> 'cli_insc_estadual',
      null::text,
      member.source_payload ->> 'cli_cnae',
      member.industry,
      member.size,
      member.source_payload ->> 'cli_regime',
      member.source_payload ->> 'cli_endereco',
      member.city,
      member.state,
      member.postal_code,
      member.source_payload ->> 'cli_res_nome',
      member.source_payload ->> 'cli_res_cpf',
      null::text,
      null::text,
      null::text,
      member.active,
      member.source_payload
    from members member
    where not exists (
      select 1
      from public.client_companies company
      where company.client_id = member.id
    )
  )
  select coalesce(
    jsonb_agg(
      to_jsonb(company_rows)
      order by
        case when company_rows.group_position ~ '^[0-9]+$'
          then company_rows.group_position::integer
          else 2147483647
        end,
        company_rows.client_acronym,
        company_rows.company_number nulls last
    ),
    '[]'::jsonb
  )
  from company_rows;
$$;

grant execute on function public.get_crm_client_group_companies(text) to authenticated;
