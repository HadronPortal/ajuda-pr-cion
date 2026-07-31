-- Prospecção: busca por nome da empresa, descrição do CNAE e CNAEs secundários.

-- Dicionário de descrições de CNAE (código -> descrição) usado para pesquisar
-- também nas descrições dos CNAEs secundários.
create table if not exists public.cnae_labels (
  cnae_code text primary key,
  cnae_description text not null
);

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
begin
  if city_value is null or state_value is null then
    raise exception 'Informe cidade e UF para pesquisar leads.';
  end if;

  where_text := format(
    'lead.state = %L and lower(translate(lead.city, %L, %L)) = lower(translate(%L, %L, %L))',
    state_value,
    unaccent_from, unaccent_to,
    city_value, unaccent_from, unaccent_to
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
    where_text := where_text || format(
      ' and (coalesce(lead.cnae_code, '''') like %L'
      || ' or exists (select 1 from unnest(coalesce(lead.secondary_cnaes, ''{}''::text[])) as sec(code)'
      || ' where regexp_replace(sec.code, ''\D'', '''', ''g'') like %L))',
      cnae_value || '%',
      cnae_value || '%'
    );
  end if;

  -- Nome da empresa: razão social ou nome fantasia, parcial e sem acentos.
  company_name_value := nullif(trim(coalesce(p_filters->>'companyName', '')), '');
  if company_name_value is not null then
    where_text := where_text || format(
      ' and lower(translate(coalesce(lead.legal_name, '''') || '' '' || coalesce(lead.trade_name, ''''), %L, %L)) like %L',
      unaccent_from, unaccent_to,
      '%' || lower(translate(company_name_value, unaccent_from, unaccent_to)) || '%'
    );
  end if;

  -- Descrição do CNAE: principal ou dos CNAEs secundários.
  cnae_description_value := nullif(trim(coalesce(p_filters->>'cnaeDescription', '')), '');
  if cnae_description_value is not null then
    where_text := where_text || format(
      ' and (lower(translate(coalesce(lead.cnae_description, ''''), %L, %L)) like %L'
      || ' or exists (select 1 from public.cnae_labels label'
      || ' where label.cnae_code = any(coalesce(lead.secondary_cnaes, ''{}''::text[]))'
      || ' and lower(translate(coalesce(label.cnae_description, ''''), %L, %L)) like %L))',
      unaccent_from, unaccent_to,
      '%' || lower(translate(cnae_description_value, unaccent_from, unaccent_to)) || '%',
      unaccent_from, unaccent_to,
      '%' || lower(translate(cnae_description_value, unaccent_from, unaccent_to)) || '%'
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
            'opened_at', lead.opened_at,
            'registration_status', lead.registration_status,
            'cnae_code', lead.cnae_code,
            'cnae_description', lead.cnae_description,
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
