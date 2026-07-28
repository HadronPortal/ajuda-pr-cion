-- Listagem paginada dos logs externos (auth_logs) para o Dashboard e a tela "Últimos Logs".
create or replace function public.list_auth_logs(
  search text default null,
  controller_filter text default null,
  acronym_filter text default null,
  page_limit integer default 6,
  page_offset integer default 0
)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  with filtered as (
    select
      log.id,
      log.controller,
      log.action,
      log.client_acronym,
      log.url,
      log.info,
      log.operator,
      host(log.ip_address) as ip_address,
      log.crm_created_at
    from public.auth_logs log
    where (
        search is null or btrim(search) = ''
        or log.controller ilike '%' || btrim(search) || '%'
        or log.action ilike '%' || btrim(search) || '%'
        or log.client_acronym ilike '%' || btrim(search) || '%'
        or log.operator ilike '%' || btrim(search) || '%'
        or log.url ilike '%' || btrim(search) || '%'
        or log.info ilike '%' || btrim(search) || '%'
        or host(log.ip_address) ilike '%' || btrim(search) || '%'
      )
      and (controller_filter is null or btrim(controller_filter) = '' or log.controller = controller_filter)
      and (acronym_filter is null or btrim(acronym_filter) = '' or upper(log.client_acronym) = upper(btrim(acronym_filter)))
  )
  select jsonb_build_object(
    'total', (select count(*) from filtered),
    'controllers', coalesce((
      select jsonb_agg(c.controller order by c.controller)
      from (select distinct controller from public.auth_logs where controller is not null) c
    ), '[]'::jsonb),
    'rows', coalesce((
      select jsonb_agg(to_jsonb(r) order by r.crm_created_at desc nulls last)
      from (
        select * from filtered
        order by crm_created_at desc nulls last
        limit greatest(1, least(coalesce(page_limit, 6), 200))
        offset greatest(0, coalesce(page_offset, 0))
      ) r
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.list_auth_logs(text, text, text, integer, integer) from public;
grant execute on function public.list_auth_logs(text, text, text, integer, integer) to anon, authenticated;
