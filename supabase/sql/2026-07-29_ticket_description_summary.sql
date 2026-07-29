-- Resumo do problema gerado por IA a partir da descrição original do chamado.
-- A descrição original nunca é sobrescrita: o resumo vive em colunas separadas.

alter table public.tickets
  add column if not exists description_summary text,
  add column if not exists description_summary_hash text,
  add column if not exists description_summary_at timestamptz;

-- support_load passa a expor o resumo (e o hash da descrição usada para gerá-lo).
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
        'attendant', coalesce(t.attendant_code, 'Sem atendente'),
        'owner', coalesce(t.owner_code, 'Sem responsável'),
        'clientCode', coalesce(t.client_code, c.acronym),
        'clientName', coalesce(t.client_name, c.trade_name, c.legal_name),
        'contact', coalesce(t.contact_name, cc.name, 'Não informado'),
        'subject', t.subject,
        'module', coalesce(t.module_label, m.name, 'Não informado'),
        'source', public.support_channel_from_db(t.channel),
        'lockedBy', t.locked_by_code,
        'description', t.description,
        'descriptionSummary', t.description_summary,
        'descriptionSummaryHash', t.description_summary_hash
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

-- Lê apenas o necessário para gerar o resumo (descrição original + resumo atual).
create or replace function public.support_get_description(ticket_key text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'id', coalesce(t.legacy_id, t.id::text),
    'description', t.description,
    'summary', t.description_summary,
    'summaryHash', t.description_summary_hash
  )
  from public.tickets t
  where t.legacy_id = ticket_key or t.id::text = ticket_key
  limit 1;
$$;

-- Persiste o resumo sem tocar na descrição original.
create or replace function public.support_set_description_summary(
  ticket_key text,
  summary text,
  source_hash text
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
    description_summary = nullif(summary, ''),
    description_summary_hash = nullif(source_hash, ''),
    description_summary_at = now()
  where id = target_ticket;

  return jsonb_build_object('ok', true);
end
$$;

revoke all on function public.support_get_description(text) from public;
revoke all on function public.support_set_description_summary(text, text, text) from public;

grant execute on function public.support_get_description(text) to service_role;
grant execute on function public.support_set_description_summary(text, text, text) to service_role;
