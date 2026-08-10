-- Expõe no chamado somente telefone e departamento realmente vinculados ao contato.
do $$
declare
  function_sql text;
begin
  select pg_get_functiondef('public.support_load()'::regprocedure) into function_sql;

  if position('''contactPhone''' in function_sql) = 0 then
    function_sql := replace(
      function_sql,
      '''contact'', coalesce(t.contact_name, cc.name, ''Não informado''),',
      '''contact'', coalesce(t.contact_name, cc.name, ''Não informado''),
        ''contactPhone'', cc.phone,
        ''contactRole'', cc.department,'
    );
    execute function_sql;
  end if;
end
$$;
