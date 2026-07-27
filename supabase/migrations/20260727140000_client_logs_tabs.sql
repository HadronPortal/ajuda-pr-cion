create or replace function public.get_crm_client_logs(client_acronym text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  allowed boolean;
  target_client_id uuid;
begin
  allowed := public.is_admin_department_collaborator() or public.is_auth_s_admin();

  if not allowed then
    return jsonb_build_object(
      'authorized', false,
      'logs', '[]'::jsonb,
      'external_logs', '[]'::jsonb
    );
  end if;

  select client.id
    into target_client_id
  from public.clients client
  where upper(client.acronym) = upper(get_crm_client_logs.client_acronym)
  limit 1;

  return jsonb_build_object(
    'authorized', true,
    'logs', coalesce((
      select jsonb_agg(to_jsonb(log_row) order by log_row.crm_created_at desc nulls last)
      from (
        select
          hadron_log.id,
          hadron_log.legacy_id,
          hadron_log.ip_address,
          hadron_log.level,
          hadron_log.terminal_code,
          hadron_log.operation,
          hadron_log.new_operation_id,
          hadron_log.new_operator_code,
          hadron_log.parent_option,
          hadron_log.child_option,
          hadron_log.serial_number,
          hadron_log.user_code,
          hadron_log.previous_operation_id,
          hadron_log.previous_operator_code,
          hadron_log.previous_drive,
          hadron_log.current_drive,
          hadron_log.crm_created_at
        from public.tab_hadron_logs hadron_log
        where hadron_log.client_id = target_client_id
           or upper(hadron_log.client_acronym) = upper(get_crm_client_logs.client_acronym)
        order by hadron_log.crm_created_at desc nulls last
        limit 200
      ) log_row
    ), '[]'::jsonb),
    'external_logs', coalesce((
      select jsonb_agg(to_jsonb(log_row) order by log_row.crm_created_at desc nulls last)
      from (
        select
          external_log.id,
          external_log.legacy_id,
          external_log.action,
          external_log.controller,
          external_log.operator,
          external_log.agent,
          external_log.device,
          external_log.ip_address,
          external_log.url,
          external_log.info,
          external_log.crm_created_at
        from public.auth_logs external_log
        where external_log.client_id = target_client_id
           or upper(external_log.client_acronym) = upper(get_crm_client_logs.client_acronym)
        order by external_log.crm_created_at desc nulls last
        limit 200
      ) log_row
    ), '[]'::jsonb)
  );
end;
$$;

revoke all on function public.get_crm_client_logs(text) from public;
grant execute on function public.get_crm_client_logs(text) to authenticated;
