create or replace function public.add_client_contact(
  p_client_id uuid,
  p_kind text,
  p_value text,
  p_name text default null
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_email text;
  v_phone text;
  v_name text;
begin
  if p_value is null or length(btrim(p_value)) = 0 then
    raise exception 'valor obrigatório';
  end if;
  if p_kind = 'email' then
    v_email := btrim(p_value);
  elsif p_kind = 'phone' then
    v_phone := btrim(p_value);
  else
    raise exception 'tipo inválido: %', p_kind;
  end if;
  v_name := nullif(btrim(coalesce(p_name, '')), '');
  if v_name is null then v_name := coalesce(v_email, v_phone); end if;
  insert into public.client_contacts(client_id, name, email, phone, active, legacy_key)
    values (p_client_id, v_name, v_email, v_phone, true, 'ui:' || gen_random_uuid()::text)
    returning id into v_id;
  return jsonb_build_object(
    'id', v_id, 'client_id', p_client_id,
    'name', v_name, 'email', v_email, 'phone', v_phone, 'active', true
  );
end;
$$;
grant execute on function public.add_client_contact(uuid, text, text, text) to anon, authenticated;
