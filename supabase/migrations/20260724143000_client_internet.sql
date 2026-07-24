create table if not exists public.auth_contratos (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  client_id uuid references public.clients(id) on delete cascade,
  client_legacy_id text,
  name text,
  web_url text,
  database_name text,
  server_host text,
  status text,
  active boolean not null default false,
  starts_at date,
  expires_at date,
  crm_created_at timestamptz,
  crm_updated_at timestamptz,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.auth_aplicativos (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  auth_contratos_id_con text,
  contrato_id uuid references public.auth_contratos(id) on delete set null,
  client_id uuid references public.clients(id) on delete cascade,
  name text,
  app_type text,
  version text,
  status text,
  active boolean not null default true,
  crm_created_at timestamptz,
  crm_updated_at timestamptz,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.mob_dispositivos (
  id uuid primary key default gen_random_uuid(),
  legacy_id text not null unique,
  auth_contratos_id_con text not null,
  contrato_id uuid references public.auth_contratos(id) on delete set null,
  client_id uuid references public.clients(id) on delete cascade,
  device_uuid text,
  utilizador text,
  codrep text,
  tipo text,
  sistema text,
  status text,
  active boolean not null default true,
  app_type text,
  build_version text,
  db_version text,
  last_checked_at timestamptz,
  crm_created_at timestamptz,
  crm_updated_at timestamptz,
  source_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists auth_contratos_client_id_idx on public.auth_contratos(client_id);
create index if not exists auth_contratos_active_idx on public.auth_contratos(client_id, active);
create index if not exists auth_aplicativos_contrato_id_idx on public.auth_aplicativos(contrato_id);
create index if not exists auth_aplicativos_client_id_idx on public.auth_aplicativos(client_id);
create index if not exists mob_dispositivos_contrato_id_idx on public.mob_dispositivos(contrato_id);
create index if not exists mob_dispositivos_client_id_idx on public.mob_dispositivos(client_id);

alter table public.auth_contratos enable row level security;
alter table public.auth_aplicativos enable row level security;
alter table public.mob_dispositivos enable row level security;

drop policy if exists auth_contratos_access on public.auth_contratos;
create policy auth_contratos_access on public.auth_contratos
  for select using (public.can_access_client(client_id));

drop policy if exists auth_aplicativos_access on public.auth_aplicativos;
create policy auth_aplicativos_access on public.auth_aplicativos
  for select using (public.can_access_client(client_id));

drop policy if exists mob_dispositivos_access on public.mob_dispositivos;
create policy mob_dispositivos_access on public.mob_dispositivos
  for select using (public.can_access_client(client_id));

drop trigger if exists set_updated_at on public.auth_contratos;
create trigger set_updated_at before update on public.auth_contratos
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.auth_aplicativos;
create trigger set_updated_at before update on public.auth_aplicativos
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at on public.mob_dispositivos;
create trigger set_updated_at before update on public.mob_dispositivos
  for each row execute function public.set_updated_at();

create or replace function public.get_crm_client(client_acronym text)
returns jsonb
language sql stable security definer set search_path = public
as $$
  select jsonb_build_object(
    'client', to_jsonb(c),
    'companies', coalesce((
      select jsonb_agg(to_jsonb(company) order by company.company_number, company.legal_name)
      from public.client_companies company
      where company.client_id = c.id
    ), '[]'::jsonb),
    'contacts', coalesce((
      select jsonb_agg(to_jsonb(contact) order by contact.name, contact.email, contact.phone)
      from public.client_contacts contact
      where contact.client_id = c.id
    ), '[]'::jsonb),
    'users', coalesce((
      select jsonb_agg(to_jsonb(client_user) order by client_user.name, client_user.email)
      from public.client_hadron_users client_user
      where client_user.client_id = c.id
    ), '[]'::jsonb),
    'terminals', coalesce((
      select jsonb_agg(to_jsonb(terminal) order by terminal.terminal_number, terminal.updated_at desc)
      from public.client_terminals terminal
      where terminal.client_id = c.id
    ), '[]'::jsonb),
    'modules', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', module.id,
          'name', module.name,
          'contracted', client_module.contracted,
          'version', client_module.version
        )
        order by module.display_order nulls last, module.name
      )
      from public.client_modules client_module
      join public.modules module on module.id = client_module.module_id
      where client_module.client_id = c.id
    ), '[]'::jsonb),
    'internet', (
      with active_contracts as (
        select contract.*
        from public.auth_contratos contract
        where contract.client_id = c.id and contract.active
      )
      select jsonb_build_object(
        'has_active_contract', exists(select 1 from active_contracts),
        'contracts', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'id', contract.id,
              'legacy_id', contract.legacy_id,
              'name', contract.name,
              'web_url', contract.web_url,
              'database_name', contract.database_name,
              'server_host', contract.server_host,
              'status', contract.status,
              'active', contract.active,
              'starts_at', contract.starts_at,
              'expires_at', contract.expires_at,
              'updated_at', contract.crm_updated_at,
              'devices', coalesce((
                select jsonb_agg(
                  jsonb_build_object(
                    'id', device.id,
                    'legacy_id', device.legacy_id,
                    'device_uuid', device.device_uuid,
                    'utilizador', device.utilizador,
                    'codrep', device.codrep,
                    'tipo', device.tipo,
                    'sistema', device.sistema,
                    'status', device.status,
                    'active', device.active,
                    'app_type', device.app_type,
                    'build_version', device.build_version,
                    'db_version', device.db_version,
                    'last_checked_at', device.last_checked_at,
                    'updated_at', device.crm_updated_at
                  )
                  order by device.crm_updated_at desc nulls last, device.utilizador
                )
                from public.mob_dispositivos device
                where device.contrato_id = contract.id
              ), '[]'::jsonb)
            )
            order by contract.name, contract.legacy_id
          )
          from active_contracts contract
        ), '[]'::jsonb),
        'applications', coalesce((
          select jsonb_agg(
            jsonb_build_object(
              'id', app.id,
              'legacy_id', app.legacy_id,
              'contract_legacy_id', app.auth_contratos_id_con,
              'name', app.name,
              'app_type', app.app_type,
              'version', app.version,
              'status', app.status,
              'active', app.active,
              'updated_at', app.crm_updated_at
            )
            order by app.name, app.legacy_id
          )
          from public.auth_aplicativos app
          join active_contracts contract on contract.id = app.contrato_id
          where app.client_id = c.id
        ), '[]'::jsonb)
      )
    ),
    'tickets', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', ticket.id,
          'protocol', ticket.protocol,
          'subject', ticket.subject,
          'module', module.name,
          'submodule', submodule.name,
          'operator', coalesce(attendant.operator_code, owner.operator_code),
          'priority', ticket.priority,
          'status', ticket.status,
          'created_at', ticket.created_at
        )
        order by ticket.created_at desc
      )
      from (
        select ticket.*
        from public.tickets ticket
        where ticket.client_id = c.id
        order by ticket.created_at desc
        limit 20
      ) ticket
      left join public.modules module on module.id = ticket.module_id
      left join public.submodules submodule on submodule.id = ticket.submodule_id
      left join public.profiles attendant on attendant.id = ticket.attendant_id
      left join public.profiles owner on owner.id = ticket.owner_id
    ), '[]'::jsonb),
    'events', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', event.id,
          'title', event.title,
          'starts_at', event.starts_at,
          'ends_at', event.ends_at,
          'operator', responsible.operator_code,
          'status', event.status,
          'ticket_protocol', ticket.protocol
        )
        order by event.starts_at desc
      )
      from (
        select event.*
        from public.calendar_events event
        where event.client_id = c.id
        order by event.starts_at desc
        limit 20
      ) event
      left join public.profiles responsible on responsible.id = event.responsible_id
      left join public.tickets ticket on ticket.id = event.ticket_id
    ), '[]'::jsonb)
  )
  from public.clients c
  where lower(c.acronym) = lower(client_acronym)
  limit 1;
$$;

grant execute on function public.get_crm_client(text) to anon, authenticated;
