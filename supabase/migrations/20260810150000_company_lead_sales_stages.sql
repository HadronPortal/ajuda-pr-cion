-- Substitui as etapas técnicas iniciais pelo funil comercial usado na prospecção.
alter table public.company_leads
  drop constraint if exists company_leads_stage_check;

update public.company_leads
set stage = case stage
  when 'em_analise' then 'prospeccao'
  when 'qualificado' then 'relacionamento'
  when 'convertido' then 'negocio_fechado'
  when 'descartado' then 'sem_interesse'
  else stage
end;

alter table public.company_leads
  add constraint company_leads_stage_check
  check (stage in (
    'novo',
    'prospeccao',
    'relacionamento',
    'proposta',
    'negociacao',
    'demonstracao',
    'negocio_fechado',
    'sem_interesse'
  ));

create or replace function public.company_leads_update_stage(
  p_id uuid,
  p_stage text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_stage not in (
    'novo',
    'prospeccao',
    'relacionamento',
    'proposta',
    'negociacao',
    'demonstracao',
    'negocio_fechado',
    'sem_interesse'
  ) then
    raise exception 'Etapa de prospecção inválida.';
  end if;

  update public.company_leads
  set stage = p_stage,
      updated_at = now()
  where id = p_id;
end;
$$;

revoke all on function public.company_leads_update_stage(uuid, text) from public;
grant execute on function public.company_leads_update_stage(uuid, text) to anon, authenticated;
