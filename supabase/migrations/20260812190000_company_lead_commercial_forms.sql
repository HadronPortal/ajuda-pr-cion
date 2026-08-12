alter table public.company_leads
  add column if not exists commercial_data jsonb not null default '{}'::jsonb,
  add column if not exists conversion_data jsonb not null default '{}'::jsonb,
  add column if not exists conversion_status text,
  add column if not exists inactivation_reason text,
  add column if not exists inactivation_notes text,
  add column if not exists inactivated_at timestamptz,
  add column if not exists closed_at timestamptz;

create or replace function public.company_leads_save_action(
  p_id uuid,
  p_action text,
  p_payload jsonb default '{}'::jsonb,
  p_finalize boolean default false
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_lead public.company_leads;
begin
  if p_action = 'edit' then
    update public.company_leads
    set commercial_data = coalesce(commercial_data, '{}'::jsonb) || coalesce(p_payload, '{}'::jsonb),
        stage = case when p_payload->>'stage' in ('novo','prospeccao','relacionamento','proposta','negociacao','demonstracao','negocio_fechado','sem_interesse') then p_payload->>'stage' else stage end,
        trade_name = coalesce(nullif(trim(p_payload->>'trade_name'), ''), trade_name),
        raw_payload = coalesce(raw_payload, '{}'::jsonb) || jsonb_strip_nulls(jsonb_build_object(
          'phone', nullif(trim(p_payload->>'phone'), ''),
          'email', nullif(trim(p_payload->>'email'), ''),
          'website', nullif(trim(p_payload->>'website'), '')
        )),
        notes = nullif(trim(p_payload->>'activities'), ''),
        updated_at = now()
    where id = p_id returning * into updated_lead;
  elsif p_action = 'inactivate' then
    if nullif(trim(p_payload->>'reason'), '') is null then
      raise exception 'Informe o motivo da inativacao.';
    end if;
    update public.company_leads
    set registration_status = 'INATIVA',
        inactivation_reason = trim(p_payload->>'reason'),
        inactivation_notes = nullif(trim(p_payload->>'notes'), ''),
        inactivated_at = now(),
        updated_at = now()
    where id = p_id returning * into updated_lead;
  elsif p_action = 'close_deal' then
    update public.company_leads
    set conversion_data = coalesce(p_payload, '{}'::jsonb),
        conversion_status = case when p_finalize then 'finalizado' else 'rascunho' end,
        stage = case when p_finalize then 'negocio_fechado' else stage end,
        closed_at = case when p_finalize then now() else closed_at end,
        updated_at = now()
    where id = p_id returning * into updated_lead;
  else
    raise exception 'Acao comercial invalida.';
  end if;

  if updated_lead.id is null then raise exception 'Lead nao encontrado.'; end if;
  return public.company_lead_details(updated_lead.id);
end;
$$;

revoke all on function public.company_leads_save_action(uuid, text, jsonb, boolean) from public;
grant execute on function public.company_leads_save_action(uuid, text, jsonb, boolean) to anon, authenticated;
