create extension if not exists pgcrypto;

create type public.user_role as enum ('admin', 'support', 'specialist', 'client');
create type public.ticket_status as enum ('open', 'occupied', 'in_progress', 'waiting_client', 'with_specialist', 'scheduled', 'finished', 'cancelled', 'overdue');
create type public.priority_level as enum ('low', 'medium', 'high');
create type public.ticket_channel as enum ('phone', 'client_portal', 'whatsapp', 'email');
create type public.event_kind as enum ('visit', 'remote_meeting', 'procion_meeting', 'personal');
create type public.vehicle_status as enum ('available', 'in_use', 'maintenance');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  operator_code text unique,
  full_name text not null,
  email text,
  role public.user_role not null default 'client',
  avatar_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  acronym varchar(10) not null unique,
  group_acronym varchar(10),
  legal_name text not null,
  trade_name text,
  document varchar(20),
  industry text,
  size text,
  city text,
  state char(2),
  postal_code varchar(10),
  active boolean not null default true,
  crm_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.client_users (
  client_id uuid not null references public.clients(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  is_primary boolean not null default false,
  primary key (client_id, profile_id)
);

create table public.client_contacts (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null,
  department text,
  email text,
  phone text,
  mobile text,
  whatsapp text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  name text not null unique,
  slug text not null unique,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.submodules (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules(id) on delete cascade,
  legacy_id text,
  name text not null,
  slug text not null,
  active boolean not null default true,
  unique(module_id, slug)
);

create table public.client_modules (
  client_id uuid not null references public.clients(id) on delete cascade,
  module_id uuid not null references public.modules(id) on delete cascade,
  contracted boolean not null default true,
  version text,
  version_released_at date,
  installed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (client_id, module_id)
);

create table public.client_terminals (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  company_number integer,
  terminal_number integer,
  operating_system text,
  operating_system_version text,
  hadron_version text,
  emits_nfe boolean,
  notes_issued bigint default 0,
  memory_used_mb numeric,
  memory_total_mb numeric,
  certificate_type text,
  certificate_expires_at date,
  environment text,
  drives jsonb not null default '[]'::jsonb,
  registered_at timestamptz,
  updated_at timestamptz not null default now()
);

create table public.kb_categories (
  id uuid primary key default gen_random_uuid(),
  legacy_slug text unique,
  name text not null,
  slug text not null unique,
  icon text,
  created_at timestamptz not null default now()
);

create table public.kb_articles (
  id uuid primary key default gen_random_uuid(),
  legacy_id integer unique,
  category_id uuid references public.kb_categories(id) on delete set null,
  module_id uuid references public.modules(id) on delete set null,
  submodule_id uuid references public.submodules(id) on delete set null,
  title text not null,
  slug text not null unique,
  summary text,
  content_html text not null default '',
  content_text text not null default '',
  source_url text unique,
  source_published_at timestamptz,
  published_at timestamptz,
  published boolean not null default true,
  imported_at timestamptz,
  author_id uuid references public.profiles(id) on delete set null,
  search_vector tsvector generated always as (
    setweight(to_tsvector('portuguese', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('portuguese', coalesce(content_text, '')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kb_article_assets (
  id uuid primary key default gen_random_uuid(),
  article_id uuid not null references public.kb_articles(id) on delete cascade,
  source_url text not null,
  storage_path text,
  alt_text text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.kb_tags (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique
);

create table public.kb_article_tags (
  article_id uuid not null references public.kb_articles(id) on delete cascade,
  tag_id uuid not null references public.kb_tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

create table public.tickets (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  protocol text not null unique,
  client_id uuid not null references public.clients(id),
  contact_id uuid references public.client_contacts(id) on delete set null,
  module_id uuid references public.modules(id) on delete set null,
  submodule_id uuid references public.submodules(id) on delete set null,
  subject text not null,
  description text,
  status public.ticket_status not null default 'open',
  priority public.priority_level not null default 'medium',
  channel public.ticket_channel not null default 'phone',
  attendant_id uuid references public.profiles(id) on delete set null,
  owner_id uuid references public.profiles(id) on delete set null,
  specialist_id uuid references public.profiles(id) on delete set null,
  sla_due_at timestamptz,
  started_at timestamptz,
  finished_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.ticket_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  event_type text not null,
  title text not null,
  description text,
  metadata jsonb not null default '{}'::jsonb,
  actor_id uuid references public.profiles(id) on delete set null,
  occurred_at timestamptz not null default now()
);

create table public.ticket_messages (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  body text not null,
  internal boolean not null default false,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create table public.ticket_attachments (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  message_id uuid references public.ticket_messages(id) on delete cascade,
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  uploaded_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.ticket_transfers (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  from_profile_id uuid references public.profiles(id) on delete set null,
  to_profile_id uuid references public.profiles(id) on delete set null,
  priority public.priority_level,
  message text,
  created_at timestamptz not null default now()
);

create table public.ticket_finalizations (
  ticket_id uuid primary key references public.tickets(id) on delete cascade,
  closing_type text not null,
  solution_html text not null,
  visibility text not null default 'client',
  finalized_by uuid references public.profiles(id) on delete set null,
  finalized_at timestamptz not null default now()
);

create table public.ticket_related_articles (
  ticket_id uuid not null references public.tickets(id) on delete cascade,
  article_id uuid not null references public.kb_articles(id) on delete cascade,
  primary key (ticket_id, article_id)
);

create table public.calendar_events (
  id uuid primary key default gen_random_uuid(),
  ticket_id uuid references public.tickets(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  description text,
  kind public.event_kind not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  responsible_id uuid references public.profiles(id) on delete set null,
  meeting_url text,
  room text,
  reminder_enabled boolean not null default true,
  status text not null default 'scheduled',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.calendar_attendees (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.calendar_events(id) on delete cascade,
  profile_id uuid references public.profiles(id) on delete cascade,
  external_email text,
  response text not null default 'pending',
  check (profile_id is not null or external_email is not null)
);

create unique index calendar_attendees_profile_unique
  on public.calendar_attendees(event_id, profile_id)
  where profile_id is not null;

create unique index calendar_attendees_email_unique
  on public.calendar_attendees(event_id, lower(external_email))
  where external_email is not null;

create table public.vehicles (
  id uuid primary key default gen_random_uuid(),
  model text not null,
  plate text not null unique,
  category text,
  color text,
  model_year text,
  current_mileage integer not null default 0,
  fuel_level numeric(5,2),
  next_revision_at date,
  next_revision_mileage integer,
  status public.vehicle_status not null default 'available',
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.vehicle_reservations (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references public.vehicles(id),
  event_id uuid references public.calendar_events(id) on delete cascade,
  operator_id uuid references public.profiles(id) on delete set null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'pre_scheduled',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);

create table public.vehicle_trips (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid references public.vehicle_reservations(id) on delete set null,
  vehicle_id uuid not null references public.vehicles(id),
  operator_id uuid references public.profiles(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  destination text,
  departed_at timestamptz,
  expected_return_at timestamptz,
  returned_at timestamptz,
  departure_mileage integer,
  return_mileage integer,
  fuel_departure numeric(5,2),
  fuel_return numeric(5,2),
  departure_notes text,
  return_notes text,
  checklist jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kanban_boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid references public.profiles(id) on delete set null,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kanban_columns (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.kanban_boards(id) on delete cascade,
  name text not null,
  color text,
  position integer not null,
  archived boolean not null default false,
  unique(board_id, position)
);

create table public.kanban_cards (
  id uuid primary key default gen_random_uuid(),
  column_id uuid not null references public.kanban_columns(id) on delete cascade,
  title text not null,
  description text,
  priority public.priority_level,
  due_at timestamptz,
  position numeric not null,
  archived boolean not null default false,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.kanban_card_members (
  card_id uuid not null references public.kanban_cards(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  primary key(card_id, profile_id)
);

create table public.kanban_checklist_items (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.kanban_cards(id) on delete cascade,
  title text not null,
  completed boolean not null default false,
  position integer not null
);

create table public.kanban_comments (
  id uuid primary key default gen_random_uuid(),
  card_id uuid not null references public.kanban_cards(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  link text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.sefaz_status_samples (
  id bigint generated always as identity primary key,
  document_type text not null,
  state char(2) not null,
  available boolean not null,
  latency_ms integer,
  source text not null,
  checked_at timestamptz not null default now()
);

create index kb_articles_search_idx on public.kb_articles using gin(search_vector);
create index kb_articles_module_idx on public.kb_articles(module_id, submodule_id);
create index ticket_filter_idx on public.tickets(status, priority, created_at desc);
create index ticket_client_idx on public.tickets(client_id, created_at desc);
create index ticket_owner_idx on public.tickets(owner_id, status);
create index ticket_events_idx on public.ticket_events(ticket_id, occurred_at desc);
create index calendar_range_idx on public.calendar_events(starts_at, ends_at);
create index vehicle_reservation_range_idx on public.vehicle_reservations(vehicle_id, starts_at, ends_at);
create index kanban_cards_order_idx on public.kanban_cards(column_id, position);
create index sefaz_samples_idx on public.sefaz_status_samples(document_type, state, checked_at desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

do $$ declare t text; begin
  foreach t in array array['profiles','clients','client_contacts','client_modules','kb_articles','tickets','calendar_events','vehicles','vehicle_reservations','vehicle_trips','kanban_boards','kanban_cards']
  loop execute format('create trigger set_updated_at before update on public.%I for each row execute function public.set_updated_at()', t); end loop;
end $$;

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and active and role in ('admin','support','specialist'))
$$;

create or replace function public.can_access_client(target uuid) returns boolean language sql stable security definer set search_path = public as $$
  select public.is_staff() or exists(select 1 from public.client_users where profile_id = auth.uid() and client_id = target)
$$;

alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.client_users enable row level security;
alter table public.client_contacts enable row level security;
alter table public.client_modules enable row level security;
alter table public.client_terminals enable row level security;
alter table public.kb_articles enable row level security;
alter table public.kb_article_assets enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_events enable row level security;
alter table public.ticket_messages enable row level security;
alter table public.ticket_attachments enable row level security;
alter table public.calendar_events enable row level security;
alter table public.vehicles enable row level security;
alter table public.vehicle_reservations enable row level security;
alter table public.vehicle_trips enable row level security;
alter table public.kanban_boards enable row level security;
alter table public.kanban_columns enable row level security;
alter table public.kanban_cards enable row level security;
alter table public.notifications enable row level security;

create policy profiles_self_or_staff on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy clients_access on public.clients for select using (public.can_access_client(id));
create policy contacts_access on public.client_contacts for select using (public.can_access_client(client_id));
create policy client_modules_access on public.client_modules for select using (public.can_access_client(client_id));
create policy client_terminals_access on public.client_terminals for select using (public.can_access_client(client_id));
create policy kb_public_read on public.kb_articles for select using (published or public.is_staff());
create policy kb_assets_read on public.kb_article_assets for select using (exists(select 1 from public.kb_articles a where a.id = article_id and (a.published or public.is_staff())));
create policy tickets_access on public.tickets for select using (public.is_staff() or public.can_access_client(client_id));
create policy ticket_events_access on public.ticket_events for select using (exists(select 1 from public.tickets t where t.id = ticket_id and (public.is_staff() or public.can_access_client(t.client_id))));
create policy ticket_messages_access on public.ticket_messages for select using (exists(select 1 from public.tickets t where t.id = ticket_id and (public.is_staff() or (public.can_access_client(t.client_id) and not internal))));
create policy staff_manage_articles on public.kb_articles for all using (public.is_staff()) with check (public.is_staff());
create policy staff_manage_tickets on public.tickets for all using (public.is_staff()) with check (public.is_staff());
create policy staff_manage_events on public.ticket_events for all using (public.is_staff()) with check (public.is_staff());
create policy staff_manage_messages on public.ticket_messages for all using (public.is_staff()) with check (public.is_staff());
create policy calendar_access on public.calendar_events for select using (public.is_staff() or responsible_id = auth.uid());
create policy fleet_staff on public.vehicles for all using (public.is_staff()) with check (public.is_staff());
create policy reservations_staff on public.vehicle_reservations for all using (public.is_staff()) with check (public.is_staff());
create policy trips_staff on public.vehicle_trips for all using (public.is_staff()) with check (public.is_staff());
create policy boards_staff on public.kanban_boards for all using (public.is_staff()) with check (public.is_staff());
create policy columns_staff on public.kanban_columns for all using (public.is_staff()) with check (public.is_staff());
create policy cards_staff on public.kanban_cards for all using (public.is_staff()) with check (public.is_staff());
create policy notifications_self on public.notifications for select using (profile_id = auth.uid());

insert into storage.buckets (id, name, public) values
  ('knowledge-base', 'knowledge-base', true),
  ('ticket-attachments', 'ticket-attachments', false),
  ('fleet', 'fleet', false)
on conflict (id) do nothing;

alter publication supabase_realtime add table public.ticket_messages;
alter publication supabase_realtime add table public.notifications;
