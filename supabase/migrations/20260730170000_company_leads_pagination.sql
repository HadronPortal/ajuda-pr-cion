drop function if exists public.company_leads_list(text, text, date, text, text, integer);

drop index if exists public.company_leads_state_city_search_idx;

create index company_leads_state_city_search_idx
  on public.company_leads (
    state,
    lower(translate(
      city,
      'áàâãäéèêëíìîïóòôõöúùûüç',
      'aaaaaeeeeiiiiooooouuuuc'
    )),
    relevance_score desc,
    opened_at desc nulls last,
    id
  );

create index if not exists company_leads_state_city_opened_idx
  on public.company_leads (
    state,
    lower(translate(
      city,
      'áàâãäéèêëíìîïóòôõöúùûüç',
      'aaaaaeeeeiiiiooooouuuuc'
    )),
    opened_at
  );

create or replace function public.company_leads_list(
  p_city text default null,
  p_state text default null,
  p_opened_after date default null,
  p_cnae text default null,
  p_company_size text default null,
  p_limit integer default 50,
  p_offset integer default 0
)
returns setof public.company_leads
language sql
stable
security definer
set search_path = public
as $$
  select lead.*
  from public.company_leads lead
  where lower(translate(
        lead.city,
        'áàâãäéèêëíìîïóòôõöúùûüç',
        'aaaaaeeeeiiiiooooouuuuc'
      )) = lower(translate(
        trim(p_city),
        'áàâãäéèêëíìîïóòôõöúùûüç',
        'aaaaaeeeeiiiiooooouuuuc'
      ))
    and lead.state = upper(trim(p_state))
    and (p_opened_after is null or lead.opened_at >= p_opened_after)
    and (
      nullif(regexp_replace(coalesce(p_cnae, ''), '\D', '', 'g'), '') is null
      or lead.cnae_code like regexp_replace(p_cnae, '\D', '', 'g') || '%'
    )
    and (
      nullif(trim(p_company_size), '') is null
      or lower(lead.company_size) like '%' || lower(trim(p_company_size)) || '%'
    )
  order by lead.relevance_score desc, lead.opened_at desc nulls last, lead.id
  limit least(greatest(coalesce(p_limit, 50), 1), 100)
  offset greatest(coalesce(p_offset, 0), 0);
$$;

create or replace function public.company_leads_count(
  p_city text default null,
  p_state text default null,
  p_opened_after date default null,
  p_cnae text default null,
  p_company_size text default null
)
returns bigint
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  query_text text;
  result_count bigint;
begin
  query_text := format(
    $query$
      select count(*)
      from public.company_leads lead
      where lead.state = %L
        and lower(translate(
          lead.city,
          'áàâãäéèêëíìîïóòôõöúùûüç',
          'aaaaaeeeeiiiiooooouuuuc'
        )) = lower(translate(
          %L,
          'áàâãäéèêëíìîïóòôõöúùûüç',
          'aaaaaeeeeiiiiooooouuuuc'
        ))
    $query$,
    upper(trim(p_state)),
    trim(p_city)
  );

  if p_opened_after is not null then
    query_text := query_text || format(' and lead.opened_at >= %L', p_opened_after);
  end if;

  if nullif(regexp_replace(coalesce(p_cnae, ''), '\D', '', 'g'), '') is not null then
    query_text := query_text || format(
      ' and lead.cnae_code like %L',
      regexp_replace(p_cnae, '\D', '', 'g') || '%'
    );
  end if;

  if nullif(trim(p_company_size), '') is not null then
    query_text := query_text || format(
      ' and lower(lead.company_size) like %L',
      '%' || lower(trim(p_company_size)) || '%'
    );
  end if;

  execute query_text into result_count;
  return result_count;
end;
$$;

revoke all on function public.company_leads_list(text, text, date, text, text, integer, integer)
  from public;
revoke all on function public.company_leads_count(text, text, date, text, text)
  from public;

grant execute on function public.company_leads_list(text, text, date, text, text, integer, integer)
  to anon, authenticated;
grant execute on function public.company_leads_count(text, text, date, text, text)
  to anon, authenticated;
