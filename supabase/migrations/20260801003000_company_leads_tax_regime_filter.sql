-- Expõe e filtra o regime tributário importado do cadastro do cliente.
create index if not exists company_leads_location_tax_regime_idx
  on public.company_leads (
    state,
    public.normalize_company_search(city),
    (raw_payload->>'tax_regime'),
    opened_at desc nulls last
  );

do $migration$
declare
  function_sql text;
  details_sql text;
begin
  select pg_get_functiondef(
    'public.company_leads_search(jsonb,text,text,integer,integer)'::regprocedure
  ) into function_sql;

  if position('tax_regime_value text;' in function_sql) = 0 then
    function_sql := replace(
      function_sql,
      'status_value text;',
      E'status_value text;\n  tax_regime_value text;'
    );
  end if;

  if position('p_filters->>''taxRegime''' in function_sql) = 0 then
    function_sql := replace(
      function_sql,
      E'  stage_value := nullif(trim(coalesce(p_filters->>''stage'', '''')), '''');',
      E'  tax_regime_value := nullif(trim(coalesce(p_filters->>''taxRegime'', '''')), '''');\n'
      || E'  if tax_regime_value is not null then\n'
      || E'    where_text := where_text || format('' and lead.raw_payload->>''''tax_regime'''' = %L'', tax_regime_value);\n'
      || E'  end if;\n\n'
      || E'  stage_value := nullif(trim(coalesce(p_filters->>''stage'', '''')), '''');'
    );
  end if;

  if position('''tax_regime'', nullif(lead.raw_payload->>''tax_regime'', '''')' in function_sql) = 0 then
    function_sql := replace(
      function_sql,
      E'            ''simples'', coalesce((lead.raw_payload->>''simple'')::boolean, false),',
      E'            ''simples'', coalesce((lead.raw_payload->>''simple'')::boolean, false),\n'
      || E'            ''tax_regime'', nullif(lead.raw_payload->>''tax_regime'', ''''),'
    );
  end if;

  execute function_sql;

  select pg_get_functiondef('public.company_lead_details(uuid)'::regprocedure)
    into details_sql;

  if position('''tax_regime'', nullif(lead.raw_payload->>''tax_regime'', '''')' in details_sql) = 0 then
    details_sql := replace(
      details_sql,
      E'    ''simples'', coalesce((lead.raw_payload->>''simple'')::boolean, false),',
      E'    ''simples'', coalesce((lead.raw_payload->>''simple'')::boolean, false),\n'
      || E'    ''tax_regime'', nullif(lead.raw_payload->>''tax_regime'', ''''),'
    );
  end if;

  execute details_sql;
end
$migration$;
