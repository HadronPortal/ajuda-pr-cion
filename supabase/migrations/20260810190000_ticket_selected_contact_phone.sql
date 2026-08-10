-- Preserva exatamente o telefone escolhido ao criar o chamado.
alter table public.tickets
  add column if not exists contact_phone text;

-- Recupera o telefone dos chamados criados antes da coluna existir.
update public.tickets
set contact_phone = trim(substring(description from 'Contato: [^·\n]+ · ([^.\n]+)\.'))
where contact_phone is null
  and description like '%Contato:%·%';

do $$
declare
  function_sql text;
begin
  select pg_get_functiondef('public.support_create_ticket(jsonb)'::regprocedure) into function_sql;
  if position('contact_phone' in function_sql) = 0 then
    function_sql := replace(
      function_sql,
      'client_id, client_code, client_name, contact_name,',
      'client_id, client_code, client_name, contact_name, contact_phone,'
    );
    function_sql := replace(
      function_sql,
      'payload->>''clientName'', payload->>''contact'', payload->>''subject'',',
      'payload->>''clientName'', payload->>''contact'', nullif(payload->>''contactPhone'', ''''), payload->>''subject'','
    );
    execute function_sql;
  end if;

  select pg_get_functiondef('public.support_load()'::regprocedure) into function_sql;
  function_sql := replace(
    function_sql,
    '''contactPhone'', cc.phone,',
    '''contactPhone'', coalesce(t.contact_phone, cc.phone),'
  );
  execute function_sql;
end
$$;
