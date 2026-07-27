alter table public.auth_contratos
  add column if not exists contract_key text;

create or replace function public.get_crm_client(client_acronym text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'client', to_jsonb(c),
    'companies', coalesce((
      select jsonb_agg(to_jsonb(company) order by company.company_number, company.legal_name)
      from public.client_companies company
      where company.client_id = c.id
    ), '[]'::jsonb),
    'contacts', coalesce((
      select jsonb_agg(to_jsonb(contact) order by contact.name, contact.email, contact.phone)
      from public.client_contacts contact
      where contact.client_id = c.id
    ), '[]'::jsonb),
    'users', coalesce((
      select jsonb_agg(to_jsonb(client_user) order by client_user.name, client_user.email)
      from public.client_hadron_users client_user
      where client_user.client_id = c.id
    ), '[]'::jsonb),
    'terminals', coalesce((
      select jsonb_agg(to_jsonb(terminal) order by terminal.terminal_number, terminal.updated_at desc)
      from public.client_terminals terminal
      where terminal.client_id = c.id
    ), '[]'::jsonb),
    'modules', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', module.id,
          'name', module.name,
          'contracted', client_module.contracted,
          'version', client_module.version
        )
        order by module.display_order nulls last, module.name
      )
      from public.client_modules client_module
      join public.modules module on module.id = client_module.module_id
      where client_module.client_id = c.id
    ), '[]'::jsonb),
    'internet', (
      with active_contracts as (
        select contract.*
        from public.auth_contratos contract
        where contract.client_id = c.id and contract.active
      ),
      active_devices as (
        select device.*
        from public.mob_dispositivos device
        join active_contracts contract on contract.id = device.contrato_id
      )
      select jsonb_build_object(
        'has_active_contract', exists(select 1 from active_contracts),
        'has_devices', exists(select 1 from active_devices),
        'devices', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'id', device.id,
              'legacy_id', device.legacy_id,
              'auth_contratos_id_con', device.auth_contratos_id_con,
              'device_uuid', device.device_uuid,
              'utilizador', device.utilizador,
              'codrep', device.codrep,
              'tipo', device.tipo,
              'sistema', device.sistema,
              'status', device.status,
              'active', device.active,
              'app_type', device.app_type,
              'build_version', device.build_version,
              'db_version', device.db_version,
              'last_checked_at', device.last_checked_at,
              'updated_at', device.crm_updated_at
            )
            order by device.crm_updated_at desc nulls last, device.utilizador
          )
          from active_devices device
        ), '[]'::jsonb),
        'contracts', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'id', contract.id,
              'legacy_id', contract.legacy_id,
              'contract_key', contract.contract_key,
              'name', contract.name,
              'web_url', contract.web_url,
              'database_name', contract.database_name,
              'server_host', contract.server_host,
              'status', contract.status,
              'active', contract.active,
              'starts_at', contract.starts_at,
              'expires_at', contract.expires_at,
              'updated_at', contract.crm_updated_at,
              'source_payload', contract.source_payload,
              'devices', coalesce((
                select jsonb_agg(
                  jsonb_build_object(
                    'id', device.id,
                    'legacy_id', device.legacy_id,
                    'auth_contratos_id_con', device.auth_contratos_id_con,
                    'device_uuid', device.device_uuid,
                    'utilizador', device.utilizador,
                    'codrep', device.codrep,
                    'tipo', device.tipo,
                    'sistema', device.sistema,
                    'status', device.status,
                    'active', device.active,
                    'app_type', device.app_type,
                    'build_version', device.build_version,
                    'db_version', device.db_version,
                    'last_checked_at', device.last_checked_at,
                    'updated_at', device.crm_updated_at
                  )
                  order by device.crm_updated_at desc nulls last, device.utilizador
                )
                from active_devices device
                where device.contrato_id = contract.id
              ), '[]'::jsonb)
            )
            order by contract.name, contract.legacy_id
          )
          from active_contracts contract
        ), '[]'::jsonb),
        'applications', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'id', app.id,
              'legacy_id', app.legacy_id,
              'contract_legacy_id', app.auth_contratos_id_con,
              'name', app.name,
              'app_type', app.app_type,
              'version', app.version,
              'status', app.status,
              'active', app.active,
              'updated_at', app.crm_updated_at
            )
            order by app.name, app.legacy_id
          )
          from public.auth_aplicativos app
          where app.client_id = c.id
             or exists (
               select 1
               from active_contracts contract
               where coalesce(contract.source_payload->>'con_web_apps', '[]')::jsonb ? app.app_type
             )
        ), '[]'::jsonb)
      )
    ),
    'tickets', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', ticket.id,
          'protocol', ticket.protocol,
          'subject', ticket.subject,
          'module', module.name,
          'submodule', submodule.name,
          'operator', coalesce(attendant.operator_code, owner.operator_code),
          'priority', ticket.priority,
          'status', ticket.status,
          'created_at', ticket.created_at
        )
        order by ticket.created_at desc
      )
      from (
        select ticket.*
        from public.tickets ticket
        where ticket.client_id = c.id
        order by ticket.created_at desc
        limit 20
      ) ticket
      left join public.modules module on module.id = ticket.module_id
      left join public.submodules submodule on submodule.id = ticket.submodule_id
      left join public.profiles attendant on attendant.id = ticket.attendant_id
      left join public.profiles owner on owner.id = ticket.owner_id
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', event.id,
          'title', event.title,
          'starts_at', event.starts_at,
          'ends_at', event.ends_at,
          'operator', responsible.operator_code,
          'status', event.status,
          'ticket_protocol', ticket.protocol
        )
        order by event.starts_at desc
      )
      from (
        select event.*
        from public.calendar_events event
        where event.client_id = c.id
        order by event.starts_at desc
        limit 20
      ) event
      left join public.profiles responsible on responsible.id = event.responsible_id
      left join public.tickets ticket on ticket.id = event.ticket_id
    ), '[]'::jsonb)
  )
  from public.clients c
  where lower(c.acronym) = lower(client_acronym)
  limit 1;
$$;

grant execute on function public.get_crm_client(text) to anon, authenticated;
