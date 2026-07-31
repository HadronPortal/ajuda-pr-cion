-- A base pública do CNPJ informa apenas opção pelo Simples e pelo MEI.
-- Lucro Presumido/Real continuam disponíveis somente para clientes identificados.
update public.company_leads
set raw_payload = raw_payload - 'tax_regime',
    updated_at = now()
where existing_client_id is null
  and raw_payload ? 'tax_regime';

create index if not exists company_leads_location_simple_idx
  on public.company_leads (state, public.normalize_company_search(city), opened_at desc nulls last)
  where coalesce((raw_payload->>'simple')::boolean, false);

create index if not exists company_leads_location_mei_idx
  on public.company_leads (state, public.normalize_company_search(city), opened_at desc nulls last)
  where coalesce((raw_payload->>'mei')::boolean, false);

do $migration$
declare
  function_sql text;
  details_sql text;
  old_filter constant text := E'  tax_regime_value := nullif(trim(coalesce(p_filters->>''taxRegime'', '''')), '''');\n'
    || E'  if tax_regime_value is not null then\n'
    || E'    where_text := where_text || format('' and lead.raw_payload->>''''tax_regime'''' = %L'', tax_regime_value);\n'
    || E'  end if;';
  official_filter constant text := E'  tax_regime_value := nullif(trim(coalesce(p_filters->>''taxRegime'', '''')), '''');\n'
    || E'  if tax_regime_value = ''0'' then\n'
    || E'    where_text := where_text || '' and coalesce((lead.raw_payload->>''''simple'''')::boolean, false)'';\n'
    || E'  elsif tax_regime_value = ''3'' then\n'
    || E'    where_text := where_text || '' and coalesce((lead.raw_payload->>''''mei'''')::boolean, false)'';\n'
    || E'  elsif tax_regime_value in (''1'', ''2'') then\n'
    || E'    where_text := where_text || format('' and lead.existing_client_id is not null and lead.raw_payload->>''''tax_regime'''' = %L'', tax_regime_value);\n'
    || E'  end if;';
  raw_regime constant text := 'nullif(lead.raw_payload->>''tax_regime'', '''')';
  sourced_regime constant text := E'case\n'
    || E'              when coalesce((lead.raw_payload->>''mei'')::boolean, false) then ''3''\n'
    || E'              when coalesce((lead.raw_payload->>''simple'')::boolean, false) then ''0''\n'
    || E'              when lead.existing_client_id is not null then nullif(lead.raw_payload->>''tax_regime'', '''')\n'
    || E'              else null\n'
    || E'            end';
begin
  select pg_get_functiondef(
    'public.company_leads_search(jsonb,text,text,integer,integer)'::regprocedure
  ) into function_sql;

  if position(old_filter in function_sql) = 0
    and position('tax_regime_value = ''0''' in function_sql) = 0 then
    raise exception 'Não foi possível localizar o filtro de regime tributário.';
  end if;
  if position(old_filter in function_sql) > 0 then
    function_sql := replace(function_sql, old_filter, official_filter);
  end if;
  function_sql := replace(function_sql, raw_regime, sourced_regime);
  execute function_sql;

  select pg_get_functiondef('public.company_lead_details(uuid)'::regprocedure)
    into details_sql;
  details_sql := replace(details_sql, raw_regime, sourced_regime);
  execute details_sql;
end
$migration$;
