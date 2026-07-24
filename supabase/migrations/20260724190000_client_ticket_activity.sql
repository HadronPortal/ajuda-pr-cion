create or replace function public.get_crm_client_ticket_activity(client_acronym text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select coalesce(jsonb_agg(
    jsonb_build_object(
      'id', event.id,
      'ticket_id', ticket.id,
      'protocol', ticket.protocol,
      'subject', ticket.subject,
      'event_type', event.event_type,
      'title', event.title,
      'description', event.description,
      'actor', coalesce(event.actor_code, actor.operator_code),
      'occurred_at', event.occurred_at
    )
    order by event.occurred_at desc
  ), '[]'::jsonb)
  from public.ticket_events event
  join public.tickets ticket on ticket.id = event.ticket_id
  join public.clients client on client.id = ticket.client_id
  left join public.profiles actor on actor.id = event.actor_id
  where lower(client.acronym) = lower(client_acronym);
$$;

grant execute on function public.get_crm_client_ticket_activity(text) to anon, authenticated;
