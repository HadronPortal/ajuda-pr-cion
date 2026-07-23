alter table public.tickets
  add column if not exists client_code text,
  add column if not exists client_name text,
  add column if not exists contact_name text,
  add column if not exists module_label text,
  add column if not exists attendant_code text,
  add column if not exists owner_code text,
  add column if not exists locked_by_code text;

alter table public.ticket_events
  add column if not exists actor_code text,
  add column if not exists actor_type text;

alter table public.ticket_messages
  add column if not exists sender_code text,
  add column if not exists sender_name text,
  add column if not exists author_type text;

create index if not exists tickets_legacy_id_idx on public.tickets(legacy_id);
create index if not exists ticket_messages_ticket_created_idx
  on public.ticket_messages(ticket_id, created_at);

create or replace function public.support_status_to_db(value text)
returns public.ticket_status
language sql immutable
as $$
  select case value
    when 'Atrasado' then 'overdue'::public.ticket_status
    when 'Em Aberto' then 'open'::public.ticket_status
    when 'Ocupado' then 'occupied'::public.ticket_status
    when 'Em andamento' then 'in_progress'::public.ticket_status
    when 'Aguardando cliente' then 'waiting_client'::public.ticket_status
    when 'Com especialista' then 'with_specialist'::public.ticket_status
    when 'Agendamento' then 'scheduled'::public.ticket_status
    when 'Finalizado' then 'finished'::public.ticket_status
    when 'Cancelado' then 'cancelled'::public.ticket_status
    else 'open'::public.ticket_status
  end
$$;

create or replace function public.support_status_from_db(value public.ticket_status)
returns text
language sql immutable
as $$
  select case value
    when 'overdue' then 'Atrasado'
    when 'open' then 'Em Aberto'
    when 'occupied' then 'Ocupado'
    when 'in_progress' then 'Em andamento'
    when 'waiting_client' then 'Aguardando cliente'
    when 'with_specialist' then 'Com especialista'
    when 'scheduled' then 'Agendamento'
    when 'finished' then 'Finalizado'
    when 'cancelled' then 'Cancelado'
  end
$$;

create or replace function public.support_priority_to_db(value text)
returns public.priority_level
language sql immutable
as $$
  select case value
    when 'Alta' then 'high'::public.priority_level
    when 'Baixa' then 'low'::public.priority_level
    else 'medium'::public.priority_level
  end
$$;

create or replace function public.support_priority_from_db(value public.priority_level)
returns text
language sql immutable
as $$
  select case value
    when 'high' then 'Alta'
    when 'low' then 'Baixa'
    else 'Media'
  end
$$;

create or replace function public.support_channel_to_db(value text)
returns public.ticket_channel
language sql immutable
as $$
  select case value
    when 'Portal do cliente' then 'client_portal'::public.ticket_channel
    when 'WhatsApp' then 'whatsapp'::public.ticket_channel
    when 'Email' then 'email'::public.ticket_channel
    else 'phone'::public.ticket_channel
  end
$$;

create or replace function public.support_channel_from_db(value public.ticket_channel)
returns text
language sql immutable
as $$
  select case value
    when 'client_portal' then 'Portal do cliente'
    when 'whatsapp' then 'WhatsApp'
    when 'email' then 'Email'
    else 'Telefone'
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

create or replace function public.support_seed_tickets(payload jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  item jsonb;
  target_client uuid;
  target_ticket uuid;
begin
  if exists(select 1 from public.tickets limit 1) then
    return jsonb_build_object('seeded', false);
  end if;

  for item in select * from jsonb_array_elements(payload)
  loop
    select id into target_client
    from public.clients
    where upper(acronym) = upper(item->>'clientCode')
    limit 1;

    if target_client is null then
      insert into public.clients(acronym, legal_name, trade_name, active)
      values (
        upper(item->>'clientCode'),
        coalesce(nullif(item->>'clientName', ''), upper(item->>'clientCode')),
        nullif(item->>'clientName', ''),
        true
      )
      returning id into target_client;
    end if;

    insert into public.tickets(
      legacy_id, protocol, client_id, client_code, client_name, contact_name,
      subject, description, module_label, status, priority, channel,
      attendant_code, owner_code, locked_by_code, created_at, updated_at
    )
    values (
      item->>'id', item->>'protocol', target_client, upper(item->>'clientCode'),
      item->>'clientName', item->>'contact', item->>'subject',
      nullif(item->>'description', ''), item->>'module',
      public.support_status_to_db(item->>'status'),
      public.support_priority_to_db(item->>'priority'),
      public.support_channel_to_db(item->>'source'),
      item->>'attendant', item->>'owner', nullif(item->>'lockedBy', ''),
      (item->>'openedAt')::timestamptz, (item->>'updatedAt')::timestamptz
    )
    returning id into target_ticket;

    insert into public.ticket_events(
      ticket_id, event_type, title, description, actor_code, actor_type, occurred_at
    ) values (
      target_ticket, 'created', 'Chamado aberto',
      'Chamado importado para o ambiente de testes.',
      coalesce(item->>'contact', 'Cliente'), 'cliente',
      (item->>'openedAt')::timestamptz
    );
  end loop;

  return jsonb_build_object('seeded', true);
end
$$;

create or replace function public.support_create_ticket(payload jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  target_client uuid;
  target_ticket uuid;
  new_legacy_id text := coalesce(nullif(payload->>'id', ''), gen_random_uuid()::text);
begin
  select id into target_client from public.clients
  where upper(acronym) = upper(payload->>'clientCode') limit 1;

  if target_client is null then
    insert into public.clients(acronym, legal_name, trade_name, active)
    values (
      upper(payload->>'clientCode'),
      coalesce(nullif(payload->>'clientName', ''), upper(payload->>'clientCode')),
      nullif(payload->>'clientName', ''),
      true
    ) returning id into target_client;
  end if;

  insert into public.tickets(
    legacy_id, protocol, client_id, client_code, client_name, contact_name,
    subject, description, module_label, status, priority, channel,
    attendant_code, owner_code, created_at, updated_at
  ) values (
    new_legacy_id, payload->>'protocol', target_client, upper(payload->>'clientCode'),
    payload->>'clientName', payload->>'contact', payload->>'subject',
    nullif(payload->>'description', ''), payload->>'module', 'open',
    public.support_priority_to_db(payload->>'priority'),
    public.support_channel_to_db(payload->>'source'),
    payload->>'attendant', payload->>'owner', now(), now()
  ) returning id into target_ticket;

  insert into public.ticket_events(
    ticket_id, event_type, title, description, actor_code, actor_type
  ) values (
    target_ticket, 'created', 'Chamado aberto',
    coalesce(payload->>'eventDescription', 'Chamado aberto.'),
    coalesce(payload->>'contact', 'Cliente'), 'cliente'
  );

  return jsonb_build_object('id', new_legacy_id);
end
$$;

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
      when patch->>'status' = 'Finalizado' then now()
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

create or replace function public.support_add_message(
  ticket_key text,
  message_payload jsonb
)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  target_ticket uuid;
  message_id uuid;
begin
  select id into target_ticket from public.tickets
  where legacy_id = ticket_key or id::text = ticket_key limit 1;
  if target_ticket is null then raise exception 'Chamado não encontrado'; end if;

  insert into public.ticket_messages(
    ticket_id, body, internal, sender_code, sender_name, author_type
  ) values (
    target_ticket,
    message_payload->>'text',
    coalesce((message_payload->>'internal')::boolean, false),
    nullif(message_payload->>'senderCode', ''),
    nullif(message_payload->>'name', ''),
    coalesce(message_payload->>'author', 'suporte')
  ) returning id into message_id;

  update public.tickets set updated_at = now() where id = target_ticket;
  return jsonb_build_object('id', message_id);
end
$$;

revoke all on function public.support_load() from public;
revoke all on function public.support_seed_tickets(jsonb) from public;
revoke all on function public.support_create_ticket(jsonb) from public;
revoke all on function public.support_update_ticket(text, jsonb, jsonb) from public;
revoke all on function public.support_add_message(text, jsonb) from public;

grant execute on function public.support_load() to anon, authenticated;
grant execute on function public.support_seed_tickets(jsonb) to anon, authenticated;
grant execute on function public.support_create_ticket(jsonb) to anon, authenticated;
grant execute on function public.support_update_ticket(text, jsonb, jsonb) to anon, authenticated;
grant execute on function public.support_add_message(text, jsonb) to anon, authenticated;
