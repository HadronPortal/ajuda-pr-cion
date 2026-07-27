alter table public.tickets
  add column if not exists source_payload jsonb not null default '{}'::jsonb;

alter table public.ticket_messages
  add column if not exists legacy_id text,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;

alter table public.ticket_events
  add column if not exists legacy_id text,
  add column if not exists source_payload jsonb not null default '{}'::jsonb;

create unique index if not exists ticket_messages_legacy_id_idx
  on public.ticket_messages (legacy_id)
  where legacy_id is not null;

create unique index if not exists ticket_events_legacy_id_idx
  on public.ticket_events (legacy_id)
  where legacy_id is not null;
