-- SLA: expõe a data/hora exata de finalização (finished_at) e impede que ela
-- seja redefinida em atualizações posteriores de um chamado já finalizado.

create or replace function public.support_update_ticket(
  ticket_key text,
  patch jsonb,
  event_payload jsonb default null
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  target_ticket uuid;
begin
  select id into target_ticket from public.tickets
  where legacy_id = ticket_key or id::text = ticket_key limit 1;
  if target_ticket is null then raise exception 'Chamado não encontrado'; end if;

  update public.tickets set
    status = case when patch ? 'status' then public.support_status_to_db(patch->>'status') else status end,
    priority = case when patch ? 'priority' then public.support_priority_to_db(patch->>'priority') else priority end,
    attendant_code = case when patch ? 'attendant' then patch->>'attendant' else attendant_code end,
    owner_code = case when patch ? 'owner' then patch->>'owner' else owner_code end,
    locked_by_code = case
      when patch ? 'lockedBy' and nullif(patch->>'lockedBy', '') is null then null
      when patch ? 'lockedBy' then patch->>'lockedBy'
      else locked_by_code
    end,
    finished_at = case
      -- Nunca redefine uma finalização já registrada.
      when patch->>'status' = 'Finalizado' and finished_at is null
        then coalesce((patch->>'closedAt')::timestamptz, now())
      else finished_at
    end,
    updated_at = now()
  where id = target_ticket;

  if event_payload is not null then
    insert into public.ticket_events(
      ticket_id, event_type, title, description, actor_code, actor_type, metadata
    ) values (
      target_ticket,
      coalesce(event_payload->>'kind', 'status'),
      coalesce(event_payload->>'title', 'Chamado atualizado'),
      event_payload->>'description',
      coalesce(event_payload->>'actor', 'Sistema'),
      coalesce(event_payload->>'actorType', 'sistema'),
      coalesce(event_payload->'metadata', '{}'::jsonb)
    );
  end if;

  return jsonb_build_object('ok', true);
end
$$;

create or replace function public.support_load()
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'tickets', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', coalesce(t.legacy_id, t.id::text),
        'protocol', t.protocol,
        'status', public.support_status_from_db(t.status),
        'priority', public.support_priority_from_db(t.priority),
        'openedAt', t.created_at,
        'updatedAt', t.updated_at,
        'closedAt', t.finished_at,
        'attendant', coalesce(t.attendant_code, 'Sem atendente'),
        'owner', coalesce(t.owner_code, 'Sem responsável'),
        'clientCode', coalesce(t.client_code, c.acronym),
        'clientName', coalesce(t.client_name, c.trade_name, c.legal_name),
        'contact', coalesce(t.contact_name, cc.name, 'Não informado'),
        'subject', t.subject,
        'module', coalesce(t.module_label, m.name, 'Não informado'),
        'source', public.support_channel_from_db(t.channel),
        'lockedBy', t.locked_by_code,
        'description', t.description
      ) order by t.created_at desc)
      from public.tickets t
      left join public.clients c on c.id = t.client_id
      left join public.client_contacts cc on cc.id = t.contact_id
      left join public.modules m on m.id = t.module_id
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id,
        'ticketId', coalesce(t.legacy_id, t.id::text),
        'kind', e.event_type,
        'when', e.occurred_at,
        'actor', coalesce(e.actor_code, 'Sistema'),
        'actorType', coalesce(e.actor_type, 'sistema'),
        'description', coalesce(e.description, e.title)
      ) order by e.occurred_at)
      from public.ticket_events e
      join public.tickets t on t.id = e.ticket_id
    ), '[]'::jsonb),
    'notes', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', msg.id,
        'ticketId', coalesce(t.legacy_id, t.id::text),
        'operator', coalesce(msg.sender_code, msg.sender_name, 'Suporte'),
        'createdAt', msg.created_at,
        'text', msg.body
      ) order by msg.created_at desc)
      from public.ticket_messages msg
      join public.tickets t on t.id = msg.ticket_id
      where msg.internal
    ), '[]'::jsonb),
    'messages', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', msg.id,
        'ticketId', coalesce(t.legacy_id, t.id::text),
        'author', coalesce(msg.author_type, 'suporte'),
        'name', coalesce(msg.sender_name, msg.sender_code, 'Suporte'),
        'text', msg.body,
        'at', msg.created_at
      ) order by msg.created_at)
      from public.ticket_messages msg
      join public.tickets t on t.id = msg.ticket_id
      where not msg.internal
    ), '[]'::jsonb)
  );
$$;

-- Backfill conservador: chamados já finalizados sem carimbo usam a última
-- atualização registrada (nenhum dado histórico existente é sobrescrito).
update public.tickets
set finished_at = updated_at
where finished_at is null
  and status = 'finished'::public.ticket_status;

revoke all on function public.support_load() from public;
revoke all on function public.support_update_ticket(text, jsonb, jsonb) from public;
grant execute on function public.support_load() to anon, authenticated;
grant execute on function public.support_update_ticket(text, jsonb, jsonb) to anon, authenticated;
