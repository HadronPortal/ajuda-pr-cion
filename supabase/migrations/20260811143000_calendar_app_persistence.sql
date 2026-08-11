alter table public.calendar_events
  add column if not exists app_metadata jsonb not null default '{}'::jsonb;

create or replace function public.save_crm_calendar_event(p_event jsonb)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_client_id uuid;
  v_ticket_id uuid;
  v_responsible_id uuid;
  v_kind public.event_kind;
  v_status text;
  v_starts_at timestamptz;
  v_ends_at timestamptz;
begin
  v_id := coalesce(nullif(p_event->>'id', '')::uuid, gen_random_uuid());

  select client.id into v_client_id
  from public.clients client
  where client.id::text = nullif(p_event->>'clientId', '')
     or upper(client.acronym) = upper(trim(split_part(coalesce(p_event->>'client', ''), '·', 1)))
  order by (client.id::text = nullif(p_event->>'clientId', '')) desc
  limit 1;

  select ticket.id into v_ticket_id
  from public.tickets ticket
  where ticket.id::text = nullif(p_event->>'ticketId', '')
     or ticket.legacy_id = nullif(p_event->>'ticketId', '')
  limit 1;

  select profile.id into v_responsible_id
  from public.profiles profile
  where upper(profile.operator_code) = upper(nullif(coalesce(p_event->>'responsible', p_event->>'operator'), ''))
  limit 1;

  v_kind := case p_event->>'type'
    when 'Visita presencial' then 'visit'::public.event_kind
    when 'Reunião remota' then 'remote_meeting'::public.event_kind
    when 'Reunião na Prócion' then 'procion_meeting'::public.event_kind
    else 'personal'::public.event_kind
  end;
  v_status := case p_event->>'status'
    when 'Concluído' then 'completed'
    when 'Cancelado' then 'cancelled'
    else 'scheduled'
  end;
  v_starts_at := ((p_event->>'date') || ' ' || (p_event->>'time'))::timestamp
    at time zone 'America/Sao_Paulo';
  v_ends_at := ((p_event->>'date') || ' ' || (p_event->>'end'))::timestamp
    at time zone 'America/Sao_Paulo';

  if v_ends_at <= v_starts_at then
    raise exception 'O horário final deve ser posterior ao inicial.';
  end if;

  insert into public.calendar_events (
    id, ticket_id, client_id, title, description, kind, starts_at, ends_at,
    responsible_id, meeting_url, room, reminder_enabled, status, created_by,
    legacy_operator, legacy_origin, legacy_type, legacy_status, legacy_vehicle_id,
    legacy_guests, app_metadata, updated_at
  ) values (
    v_id, v_ticket_id, v_client_id, p_event->>'title', nullif(p_event->>'description', ''),
    v_kind, v_starts_at, v_ends_at, v_responsible_id, nullif(p_event->>'meetingLink', ''),
    nullif(p_event->>'room', ''), coalesce((p_event->>'reminderEnabled')::boolean, true),
    v_status, auth.uid(), nullif(coalesce(p_event->>'responsible', p_event->>'operator'), ''),
    case p_event->>'origin' when 'Suporte' then 'support' when 'Comercial' then 'commercial' else 'admin' end,
    p_event->>'type', v_status, nullif(p_event->>'vehicleId', ''),
    nullif(array_to_string(array(select jsonb_array_elements_text(coalesce(p_event->'guests', '[]'::jsonb))), ', '), ''),
    p_event - array['id','title','description','type','date','time','end','status'], now()
  )
  on conflict (id) do update set
    ticket_id = excluded.ticket_id,
    client_id = excluded.client_id,
    title = excluded.title,
    description = excluded.description,
    kind = excluded.kind,
    starts_at = excluded.starts_at,
    ends_at = excluded.ends_at,
    responsible_id = excluded.responsible_id,
    meeting_url = excluded.meeting_url,
    room = excluded.room,
    reminder_enabled = excluded.reminder_enabled,
    status = excluded.status,
    legacy_operator = excluded.legacy_operator,
    legacy_origin = excluded.legacy_origin,
    legacy_type = excluded.legacy_type,
    legacy_status = excluded.legacy_status,
    legacy_vehicle_id = excluded.legacy_vehicle_id,
    legacy_guests = excluded.legacy_guests,
    app_metadata = excluded.app_metadata,
    updated_at = now();

  return v_id;
end;
$$;

grant execute on function public.save_crm_calendar_event(jsonb) to anon, authenticated;

create or replace function public.get_crm_calendar_events()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    jsonb_agg(
      coalesce(event.app_metadata, '{}'::jsonb) || jsonb_build_object(
        'id', event.id,
        'date', to_char(event.starts_at at time zone 'America/Sao_Paulo', 'YYYY-MM-DD'),
        'time', to_char(event.starts_at at time zone 'America/Sao_Paulo', 'HH24:MI'),
        'end', to_char(event.ends_at at time zone 'America/Sao_Paulo', 'HH24:MI'),
        'kind', event.kind,
        'origin', event.legacy_origin,
        'operator', coalesce(event.legacy_operator, responsible.operator_code),
        'title', event.title,
        'client', case when client.id is null then event.app_metadata->>'client'
          else client.acronym || ' · ' || coalesce(client.trade_name, client.legal_name) end,
        'clientId', event.client_id,
        'ticketId', coalesce(event.ticket_id::text, event.app_metadata->>'ticketId'),
        'status', event.status,
        'description', event.description,
        'guests', event.legacy_guests,
        'editable', event.legacy_id is null
      )
      order by event.starts_at, event.title
    ),
    '[]'::jsonb
  )
  from public.calendar_events event
  left join public.clients client on client.id = event.client_id
  left join public.profiles responsible on responsible.id = event.responsible_id;
$$;

grant execute on function public.get_crm_calendar_events() to anon, authenticated;
