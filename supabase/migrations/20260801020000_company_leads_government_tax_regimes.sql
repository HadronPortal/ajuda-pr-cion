-- Regimes anuais publicados pela Receita Federal, inclusive para empresas que não são clientes.
do $migration$
declare
  function_sql text;
  details_sql text;
  restricted_filter constant text := E'  tax_regime_value := nullif(trim(coalesce(p_filters->>''taxRegime'', '''')), '''');\n'
    || E'  if tax_regime_value = ''0'' then\n'
    || E'    where_text := where_text || '' and coalesce((lead.raw_payload->>''''simple'''')::boolean, false)'';\n'
    || E'  elsif tax_regime_value = ''3'' then\n'
    || E'    where_text := where_text || '' and coalesce((lead.raw_payload->>''''mei'''')::boolean, false)'';\n'
    || E'  elsif tax_regime_value in (''1'', ''2'') then\n'
    || E'    where_text := where_text || format('' and lead.existing_client_id is not null and lead.raw_payload->>''''tax_regime'''' = %L'', tax_regime_value);\n'
    || E'  end if;';
  government_filter constant text := E'  tax_regime_value := nullif(trim(coalesce(p_filters->>''taxRegime'', '''')), '''');\n'
    || E'  if tax_regime_value = ''0'' then\n'
    || E'    where_text := where_text || '' and coalesce((lead.raw_payload->>''''simple'''')::boolean, false)'';\n'
    || E'  elsif tax_regime_value = ''3'' then\n'
    || E'    where_text := where_text || '' and coalesce((lead.raw_payload->>''''mei'''')::boolean, false)'';\n'
    || E'  elsif tax_regime_value is not null then\n'
    || E'    where_text := where_text || format('' and lead.raw_payload->>''''tax_regime'''' = %L'', tax_regime_value);\n'
    || E'  end if;';
  restricted_regime constant text := E'case\n'
    || E'              when coalesce((lead.raw_payload->>''mei'')::boolean, false) then ''3''\n'
    || E'              when coalesce((lead.raw_payload->>''simple'')::boolean, false) then ''0''\n'
    || E'              when lead.existing_client_id is not null then nullif(lead.raw_payload->>''tax_regime'', '''')\n'
    || E'              else null\n'
    || E'            end';
  government_regime constant text := E'case\n'
    || E'              when coalesce((lead.raw_payload->>''mei'')::boolean, false) then ''3''\n'
    || E'              when coalesce((lead.raw_payload->>''simple'')::boolean, false) then ''0''\n'
    || E'              else nullif(lead.raw_payload->>''tax_regime'', '''')\n'
    || E'            end';
begin
  select pg_get_functiondef('public.company_leads_search(jsonb,text,text,integer,integer)'::regprocedure) into function_sql;
  function_sql := replace(function_sql, restricted_filter, government_filter);
  function_sql := replace(function_sql, restricted_regime, government_regime);
  execute function_sql;

  select pg_get_functiondef('public.company_lead_details(uuid)'::regprocedure) into details_sql;
  details_sql := replace(details_sql, restricted_regime, government_regime);
  execute details_sql;
end
$migration$;
