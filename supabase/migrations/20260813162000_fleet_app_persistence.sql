create table if not exists public.fleet_app_state (
  scope text primary key,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.fleet_app_state enable row level security;

create or replace function public.get_fleet_app_state(p_scope text)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select payload from public.fleet_app_state where scope = p_scope;
$$;

create or replace function public.save_fleet_app_state(p_scope text, p_payload jsonb)
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.fleet_app_state(scope, payload, updated_at)
  values (p_scope, coalesce(p_payload, '{}'::jsonb), now())
  on conflict (scope) do update
  set payload = excluded.payload, updated_at = excluded.updated_at;
$$;

grant execute on function public.get_fleet_app_state(text) to anon, authenticated;
grant execute on function public.save_fleet_app_state(text, jsonb) to anon, authenticated;

insert into public.fleet_app_state(scope, payload)
values
  ('fleet_core', '{"vehicles":[],"usages":[],"reservations":[]}'::jsonb),
  ('fleet_entries', '[]'::jsonb)
on conflict (scope) do update
set payload = excluded.payload, updated_at = now();
