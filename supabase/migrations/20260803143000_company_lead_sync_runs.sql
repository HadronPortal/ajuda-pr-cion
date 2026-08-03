create table if not exists public.company_lead_sync_runs (
  id uuid primary key default gen_random_uuid(),
  competence text not null,
  status text not null check (status in ('running', 'completed', 'failed')),
  source_url text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  statistics jsonb not null default '{}'::jsonb,
  error_message text
);

create index if not exists company_lead_sync_runs_competence_idx
  on public.company_lead_sync_runs (competence desc, started_at desc);

alter table public.company_lead_sync_runs enable row level security;

revoke all on table public.company_lead_sync_runs from anon, authenticated;
