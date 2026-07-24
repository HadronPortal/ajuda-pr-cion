create or replace function public.get_crm_client_events(client_acronym text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    jsonb_agg(to_jsonb(client_event) order by client_event.starts_at desc),
    '[]'::jsonb
  )
  from (
    select
      event.id,
      event.title,
      event.description,
      event.kind,
      event.starts_at,
      event.ends_at,
      coalesce(event.legacy_operator, responsible.operator_code) as operator,
      event.legacy_origin as origin,
      event.status,
      event.legacy_ticket_id,
      ticket.protocol as ticket_protocol
    from public.clients client
    join public.calendar_events event on event.client_id = client.id
    left join public.profiles responsible on responsible.id = event.responsible_id
    left join public.tickets ticket on ticket.id = event.ticket_id
    where upper(client.acronym) = upper($1)
    order by event.starts_at desc
    limit 50
  ) client_event;
$$;

grant execute on function public.get_crm_client_events(text) to anon, authenticated;

