-- Mantém as ações comerciais atômicas sem liberar UPDATE direto na tabela.
create or replace function public.company_leads_update_commercial(
  p_id uuid,
  p_stage text,
  p_assigned_to text default null,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_lead public.company_leads;
begin
  if p_stage not in (
    'novo', 'prospeccao', 'relacionamento', 'proposta', 'negociacao',
    'demonstracao', 'negocio_fechado', 'sem_interesse'
  ) then
    raise exception 'Etapa de prospecção inválida.';
  end if;

  update public.company_leads
  set stage = p_stage,
      assigned_to = nullif(trim(p_assigned_to), ''),
      notes = nullif(trim(p_notes), ''),
      updated_at = now()
  where id = p_id
  returning * into updated_lead;

  if updated_lead.id is null then
    raise exception 'Lead não encontrado.';
  end if;

  return public.company_lead_details(updated_lead.id);
end;
$$;

revoke all on function public.company_leads_update_commercial(uuid, text, text, text) from public;
grant execute on function public.company_leads_update_commercial(uuid, text, text, text)
  to anon, authenticated;
