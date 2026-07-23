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
        order by module.name
      )
      from public.client_modules client_module
      join public.modules module on module.id = client_module.module_id
      where client_module.client_id = c.id
    ), '[]'::jsonb),
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
