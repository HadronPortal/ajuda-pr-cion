-- Nome e CNPJ identificam a empresa diretamente e, portanto, não devem ficar
-- limitados à cidade usada nas consultas geográficas.
do $migration$
declare
  function_sql text;
  guard_start integer;
  guard_end integer;
  direct_search_guard constant text := $new$
  if company_name_value is null and cnpj_value is null then
    if city_value is null or state_value is null then
      raise exception 'Informe cidade e UF para pesquisar leads.';
    end if;

    where_text := format(
      'lead.state = %L and public.normalize_company_search(lead.city) = public.normalize_company_search(%L)',
      state_value,
      city_value
    );
  else
    where_text := 'true';
  end if;
$new$;
begin
  select pg_get_functiondef(
    'public.company_leads_search(jsonb,text,text,integer,integer)'::regprocedure
  ) into function_sql;

  guard_start := position('if city_value is null or state_value is null then' in function_sql);
  guard_end := position('opened_from := ' in function_sql);

  if guard_start = 0 or guard_end <= guard_start then
    raise exception 'Não foi possível localizar a validação geográfica de company_leads_search.';
  end if;

  function_sql := left(function_sql, guard_start - 1)
    || direct_search_guard
    || substr(function_sql, guard_end);
  execute function_sql;
end
$migration$;

create or replace function public.sync_client_company_to_lead()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  normalized_cnpj text := regexp_replace(coalesce(new.document, ''), '\D', '', 'g');
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
    jsonb_build_object('client_company', true),
    nullif(trim(concat_ws(' ', new.legal_name, new.trade_name)), ''),
    new.client_id,
    new.id
  )
  on conflict (cnpj) do update set
    search_alias = excluded.search_alias,
    existing_client_id = excluded.existing_client_id,
    existing_client_company_id = excluded.existing_client_company_id,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_client_company_to_lead_trigger on public.client_companies;
create trigger sync_client_company_to_lead_trigger
after insert or update of document, legal_name, trade_name, active, cnae, size, city, state,
  postal_code, address, client_id
on public.client_companies
for each row execute function public.sync_client_company_to_lead();
