do $migration$
declare
  function_sql text;
  existing_fragment constant text := E'    ''additional_phones'', coalesce(lead.raw_payload->''enriched_phones'', ''[]''::jsonb),';
  enriched_fragment constant text := existing_fragment
    || E'\n    ''additional_emails'', coalesce(lead.raw_payload->''enriched_emails'', ''[]''::jsonb),'
    || E'\n    ''google_place_id'', nullif(lead.raw_payload->>''google_place_id'', ''''),';
begin
  select pg_get_functiondef('public.company_lead_details(uuid)'::regprocedure) into function_sql;
  if position('''additional_emails''' in function_sql) = 0 then
    function_sql := replace(function_sql, existing_fragment, enriched_fragment);
    if position('''additional_emails''' in function_sql) = 0 then
      raise exception 'Não foi possível expor os e-mails enriquecidos.';
    end if;
    execute function_sql;
  end if;
end
$migration$;
