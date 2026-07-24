alter table public.calendar_events
  add column if not exists legacy_id text,
  add column if not exists legacy_operator text,
  add column if not exists legacy_origin text,
  add column if not exists legacy_type text,
  add column if not exists legacy_status text,
  add column if not exists legacy_contact_id text,
  add column if not exists legacy_ticket_id text,
  add column if not exists legacy_vehicle_id text,
  add column if not exists legacy_guests text;

create unique index if not exists calendar_events_legacy_id_idx
  on public.calendar_events(legacy_id)
  where legacy_id is not null;

create or replace function public.get_crm_calendar_events()
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'id', event.id,
        'date', to_char(event.starts_at at time zone 'America/Sao_Paulo', 'YYYY-MM-DD'),
        'time', to_char(event.starts_at at time zone 'America/Sao_Paulo', 'HH24:MI'),
        'end', to_char(event.ends_at at time zone 'America/Sao_Paulo', 'HH24:MI'),
        'kind', event.kind,
        'origin', event.legacy_origin,
        'operator', coalesce(event.legacy_operator, responsible.operator_code),
        'title', event.title,
        'client', case
          when client.id is null then null
          else client.acronym || ' · ' || coalesce(client.trade_name, client.legal_name)
        end,
        'status', event.status,
        'description', event.description,
        'guests', event.legacy_guests
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

