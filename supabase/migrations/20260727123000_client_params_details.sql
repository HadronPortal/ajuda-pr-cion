create or replace function public.get_crm_client_params(client_acronym text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', client_param.id,
        'legacy_id', client_param.legacy_id,
        'parameter_legacy_id', client_param.cvs_parameter_legacy_id,
        'option_legacy_id', client_param.cvs_option_legacy_id,
        'signature', client_param.parameter_signature,
        'option_data', client_param.option_data,
        'auth_user_legacy_id', client_param.auth_usuario_legacy_id,
        'signed_by', coalesce(auth_user.name, auth_user.operator, auth_user.email),
        'operator', auth_user.operator,
        'created_at', client_param.crm_created_at,
        'updated_at', client_param.crm_updated_at
      )
      order by client_param.parameter_signature, client_param.legacy_id
    ),
    '[]'::jsonb
  )
  from public.clients client
  join public.tab_cli_params client_param on client_param.client_id = client.id
  left join public.auth_usuarios auth_user on auth_user.id = client_param.auth_usuario_id
  where upper(client.acronym) = upper($1);
$$;

grant execute on function public.get_crm_client_params(text) to anon, authenticated;
