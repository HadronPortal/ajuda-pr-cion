-- Prospecção: busca por nome da empresa, descrição do CNAE e CNAEs secundários.

-- Dicionário de descrições de CNAE (código -> descrição) usado para pesquisar
-- também nas descrições dos CNAEs secundários.
create table if not exists public.cnae_labels (
  cnae_code text primary key,
  cnae_description text not null
);

alter table public.company_leads
  add column if not exists search_alias text;

create extension if not exists pg_trgm;

create index if not exists company_leads_secondary_cnaes_gin_idx
  on public.company_leads using gin (secondary_cnaes);

create index if not exists company_leads_legal_name_search_idx
  on public.company_leads using gin (lower(legal_name) gin_trgm_ops);

create index if not exists company_leads_trade_name_search_idx
  on public.company_leads using gin (lower(trade_name) gin_trgm_ops);

create index if not exists company_leads_search_alias_idx
  on public.company_leads using gin (lower(search_alias) gin_trgm_ops);

update public.company_leads lead
   set search_alias = nullif(trim(concat_ws(' ', company.legal_name, company.trade_name)), '')
  from public.client_companies company
 where regexp_replace(coalesce(company.document, ''), '\D', '', 'g') = lead.cnpj
   and lead.search_alias is distinct from
       nullif(trim(concat_ws(' ', company.legal_name, company.trade_name)), '');

-- Carga (executada por faixas de código para evitar statement timeout):
-- insert into public.cnae_labels (cnae_code, cnae_description)
-- select distinct on (cnae_code) cnae_code, cnae_description
-- from public.company_leads
-- where cnae_code like '<faixa>%' and cnae_description is not null
-- order by cnae_code, cnae_description
-- on conflict (cnae_code) do nothing;

create or replace function public.company_leads_search(
  p_filters jsonb default '{}'::jsonb,
  p_sort text default 'opened_at',
  p_direction text default 'desc',
  p_limit integer default 50,
  p_offset integer default 0
)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
set statement_timeout = '15s'
as $$
declare
  unaccent_from constant text := 'áàâãäéèêëíìîïóòôõöúùûüçÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇ';
  unaccent_to   constant text := 'aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC';
  where_text text;
  order_text text;
  sort_expression text;
  direction text;
  city_value text := nullif(trim(coalesce(p_filters->>'city', '')), '');
  state_value text := upper(nullif(trim(coalesce(p_filters->>'state', '')), ''));
  cnae_value text;
  cnae_description_value text;
  company_name_value text;
  size_value text;
  status_value text;
  stage_value text;
  min_score integer;
  opened_from text;
  opened_to text;
  limit_value integer := least(greatest(coalesce(p_limit, 50), 1), 100);
  offset_value integer := greatest(coalesce(p_offset, 0), 0);
  total_count bigint;
  rows_json jsonb;
  matching_cnae_codes text[] := '{}'::text[];
begin
  if city_value is null or state_value is null then
    raise exception 'Informe cidade e UF para pesquisar leads.';
  end if;

  where_text := format(
    'lead.state = %L and lower(translate(lead.city, ''áàâãäéèêëíìîïóòôõöúùûüç'', ''aaaaaeeeeiiiiooooouuuuc'')) = lower(translate(%L, ''áàâãäéèêëíìîïóòôõöúùûüç'', ''aaaaaeeeeiiiiooooouuuuc''))',
    state_value,
    city_value
  );

  opened_from := nullif(trim(coalesce(p_filters->>'openedFrom', '')), '');
  if opened_from is not null then
    where_text := where_text || format(' and lead.opened_at >= %L::date', opened_from);
  end if;

  opened_to := nullif(trim(coalesce(p_filters->>'openedTo', '')), '');
  if opened_to is not null then
    where_text := where_text || format(' and lead.opened_at <= %L::date', opened_to);
  end if;

  -- Código do CNAE: principal OU qualquer secundário (aceita código formatado).
  cnae_value := nullif(regexp_replace(coalesce(p_filters->>'cnae', ''), '\D', '', 'g'), '');
  if cnae_value is not null then
    if length(cnae_value) = 7 then
      where_text := where_text || format(
        ' and (lead.cnae_code = %L or lead.secondary_cnaes @> array[%L]::text[])',
        cnae_value,
        cnae_value
      );
    else
      where_text := where_text || format(
        ' and (coalesce(lead.cnae_code, '''') like %L'
        || ' or exists (select 1 from unnest(coalesce(lead.secondary_cnaes, ''{}''::text[])) as sec(code)'
        || ' where regexp_replace(sec.code, ''\D'', '''', ''g'') like %L))',
        cnae_value || '%',
        cnae_value || '%'
      );
    end if;
  end if;

  -- Nome da empresa: razão social ou nome fantasia, parcial e sem acentos.
  company_name_value := nullif(trim(coalesce(p_filters->>'companyName', '')), '');
  if company_name_value is not null then
    where_text := where_text || format(
      ' and (lower(lead.legal_name) like %L or lower(lead.trade_name) like %L or lower(lead.search_alias) like %L)',
      '%' || lower(company_name_value) || '%',
      '%' || lower(company_name_value) || '%',
      '%' || lower(company_name_value) || '%'
    );
  end if;

  -- Descrição do CNAE: principal ou dos CNAEs secundários.
  cnae_description_value := nullif(trim(coalesce(p_filters->>'cnaeDescription', '')), '');
  if cnae_description_value is not null then
    select coalesce(array_agg(label.cnae_code), '{}'::text[])
      into matching_cnae_codes
      from public.cnae_labels label
     where lower(translate(label.cnae_description, unaccent_from, unaccent_to)) like
       '%' || lower(translate(cnae_description_value, unaccent_from, unaccent_to)) || '%';

    where_text := where_text || format(
      ' and (lead.cnae_code = any(%L::text[]) or lead.secondary_cnaes && %L::text[])',
      matching_cnae_codes,
      matching_cnae_codes
    );
  end if;

  size_value := nullif(trim(coalesce(p_filters->>'companySize', '')), '');
  if size_value is not null then
    where_text := where_text || format(
      ' and lower(translate(coalesce(lead.company_size, ''''), %L, %L)) like %L',
      unaccent_from, unaccent_to,
      '%' || lower(translate(size_value, unaccent_from, unaccent_to)) || '%'
    );
  end if;

  status_value := nullif(trim(coalesce(p_filters->>'registrationStatus', '')), '');
  if status_value is not null then
    where_text := where_text || format(
      ' and lower(translate(lead.registration_status, %L, %L)) like %L',
      unaccent_from, unaccent_to,
      '%' || lower(translate(status_value, unaccent_from, unaccent_to)) || '%'
    );
  end if;

  stage_value := nullif(trim(coalesce(p_filters->>'stage', '')), '');
  if stage_value is not null then
    where_text := where_text || format(' and lead.stage = %L', stage_value);
  end if;

  min_score := nullif(trim(coalesce(p_filters->>'minScore', '')), '')::integer;
  if min_score is not null then
    where_text := where_text || format(' and lead.relevance_score >= %s', min_score);
  end if;

  if coalesce((p_filters->>'hasPhone')::boolean, false) then
    where_text := where_text || ' and coalesce(lead.raw_payload->>''phone'', '''') <> ''''';
  end if;

  if coalesce((p_filters->>'hasEmail')::boolean, false) then
    where_text := where_text || ' and coalesce(lead.raw_payload->>''email'', '''') <> ''''';
  end if;

  if coalesce((p_filters->>'onlyMei')::boolean, false) then
    where_text := where_text || ' and coalesce((lead.raw_payload->>''mei'')::boolean, false) is true';
  end if;

  if coalesce((p_filters->>'onlySimples')::boolean, false) then
    where_text := where_text || ' and coalesce((lead.raw_payload->>''simple'')::boolean, false) is true';
  end if;

  direction := case when lower(coalesce(p_direction, 'desc')) = 'asc' then 'asc' else 'desc' end;

  sort_expression := case lower(coalesce(p_sort, 'opened_at'))
    when 'company' then 'lower(coalesce(nullif(lead.trade_name, ''''), lead.legal_name))'
    when 'cnpj' then 'lead.cnpj'
    when 'opened_at' then 'lead.opened_at'
    when 'registration_status' then 'lower(lead.registration_status)'
    when 'city' then 'lower(lead.city)'
    when 'cnae' then 'lead.cnae_code'
    when 'company_size' then 'lower(lead.company_size)'
    when 'phone' then 'lead.raw_payload->>''phone'''
    when 'score' then 'lead.relevance_score'
    when 'stage' then 'lead.stage'
    else 'lead.opened_at'
  end;

  order_text := format(
    '%s %s nulls last, lead.relevance_score desc, lead.id',
    sort_expression,
    direction
  );

  execute format('select count(*) from public.company_leads lead where %s', where_text)
    into total_count;

  execute format(
    $query$
      select coalesce(jsonb_agg(item order by ordinality), '[]'::jsonb)
      from (
        select
          jsonb_build_object(
            'id', lead.id,
            'cnpj', lead.cnpj,
            'legal_name', lead.legal_name,
            'trade_name', lead.trade_name,
            'search_alias', lead.search_alias,
            'opened_at', lead.opened_at,
            'registration_status', lead.registration_status,
            'cnae_code', lead.cnae_code,
            'cnae_description', lead.cnae_description,
            'matched_cnaes', (
              select coalesce(jsonb_agg(jsonb_build_object(
                'code', label.cnae_code,
                'description', label.cnae_description
              ) order by label.cnae_code), '[]'::jsonb)
              from public.cnae_labels label
              where label.cnae_code = any(%L::text[])
                and (label.cnae_code = lead.cnae_code or label.cnae_code = any(lead.secondary_cnaes))
            ),
            'company_size', lead.company_size,
            'legal_nature', lead.legal_nature,
            'city', lead.city,
            'state', lead.state,
            'address', lead.address,
            'neighborhood', lead.neighborhood,
            'postal_code', lead.postal_code,
            'phone', nullif(lead.raw_payload->>'phone', ''),
            'email', nullif(lead.raw_payload->>'email', ''),
            'mei', coalesce((lead.raw_payload->>'mei')::boolean, false),
            'simples', coalesce((lead.raw_payload->>'simple')::boolean, false),
            'relevance_score', lead.relevance_score,
            'stage', lead.stage,
            'source', lead.source,
            'source_url', lead.source_url,
            'discovered_at', lead.discovered_at
          ) as item,
          row_number() over () as ordinality
        from public.company_leads lead
        where %s
        order by %s
        limit %s offset %s
      ) page
    $query$,
    matching_cnae_codes,
    where_text,
    order_text,
    limit_value,
    offset_value
  ) into rows_json;

  return jsonb_build_object('rows', coalesce(rows_json, '[]'::jsonb), 'total', coalesce(total_count, 0));
end;
$$;

revoke all on function public.company_leads_search(jsonb, text, text, integer, integer) from public;
grant execute on function public.company_leads_search(jsonb, text, text, integer, integer)
  to anon, authenticated;
