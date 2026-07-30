create extension if not exists unaccent with schema extensions;

create or replace function public.company_leads_list(
  p_city text default null,
  p_state text default null,
  p_opened_after date default null,
  p_cnae text default null,
  p_company_size text default null,
  p_limit integer default 50
)
returns setof public.company_leads
language sql
stable
security definer
set search_path = public, extensions
as $$
  select lead.*
  from public.company_leads lead
  where (
      nullif(trim(p_city), '') is null
      or extensions.unaccent(lead.city) ilike
        '%' || extensions.unaccent(trim(p_city)) || '%'
    )
    and (nullif(trim(p_state), '') is null or lead.state = upper(trim(p_state)))
    and (p_opened_after is null or lead.opened_at >= p_opened_after)
    and (
      nullif(regexp_replace(coalesce(p_cnae, ''), '\D', '', 'g'), '') is null
      or lead.cnae_code like regexp_replace(p_cnae, '\D', '', 'g') || '%'
    )
    and (
      nullif(trim(p_company_size), '') is null
      or extensions.unaccent(lead.company_size) ilike
        '%' || extensions.unaccent(trim(p_company_size)) || '%'
    )
  order by lead.relevance_score desc, lead.opened_at desc nulls last
  limit least(greatest(coalesce(p_limit, 50), 1), 100);
$$;

revoke all on function public.company_leads_list(text, text, date, text, text, integer)
  from public;
grant execute on function public.company_leads_list(text, text, date, text, text, integer)
  to anon, authenticated;
