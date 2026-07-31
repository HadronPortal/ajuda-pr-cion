-- Prospecção: busca por nome da empresa, descrição do CNAE e CNAEs secundários.

-- Dicionário de descrições de CNAE (código -> descrição) usado para pesquisar
-- também nas descrições dos CNAEs secundários.
create table if not exists public.cnae_labels (
  cnae_code text primary key,
  cnae_description text not null
);

alter table public.company_leads
  add column if not exists search_alias text,
  add column if not exists existing_client_id uuid,
  add column if not exists existing_client_company_id uuid;

create extension if not exists pg_trgm;

create or replace function public.normalize_company_search(value text)
returns text
language sql
immutable
parallel safe
as $$
  select translate(
    lower(coalesce(value, '')),
    'áàâãäéèêëíìîïóòôõöúùûüç',
    'aaaaaeeeeiiiiooooouuuuc'
  );
$$;

create index if not exists company_leads_secondary_cnaes_gin_idx
  on public.company_leads using gin (secondary_cnaes);

create index if not exists company_leads_company_name_search_v3_idx
  on public.company_leads using gin (
    public.normalize_company_search(
      coalesce(legal_name, '') || ' ' || coalesce(trade_name, '') || ' ' || coalesce(search_alias, '')
    ) gin_trgm_ops
  );

create index if not exists company_leads_cnpj_prefix_idx
  on public.company_leads (cnpj text_pattern_ops);

create index if not exists company_leads_location_search_v2_idx
  on public.company_leads (
    state,
    public.normalize_company_search(city),
    opened_at desc nulls last,
    relevance_score desc,
    id
  );

update public.company_leads lead
   set search_alias = company.search_alias,
       existing_client_id = company.client_id,
       existing_client_company_id = company.id
  from (
    select distinct on (regexp_replace(coalesce(document, ''), '\D', '', 'g'))
      id,
      client_id,
      regexp_replace(coalesce(document, ''), '\D', '', 'g') cnpj,
      nullif(trim(concat_ws(' ', legal_name, trade_name)), '') search_alias
    from public.client_companies
    where regexp_replace(coalesce(document, ''), '\D', '', 'g') <> ''
    order by regexp_replace(coalesce(document, ''), '\D', '', 'g'), active desc, id
  ) company
 where company.cnpj = lead.cnpj
   and (
     lead.search_alias is distinct from company.search_alias
     or lead.existing_client_id is distinct from company.client_id
     or lead.existing_client_company_id is distinct from company.id
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
  company_name_value text := nullif(trim(coalesce(p_filters->>'companyName', '')), '');
  cnpj_value text := nullif(regexp_replace(coalesce(p_filters->>'cnpj', ''), '\D', '', 'g'), '');
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
    'lead.state = %L and public.normalize_company_search(lead.city) = public.normalize_company_search(%L)',
    state_value,
    city_value
  );

  opened_from := nullif(trim(coalesce(p_filters->>'openedFrom', '')), '');
  if opened_from is not null and company_name_value is null and cnpj_value is null then
    where_text := where_text || format(' and lead.opened_at >= %L::date', opened_from);
  end if;

  opened_to := nullif(trim(coalesce(p_filters->>'openedTo', '')), '');
  if opened_to is not null and company_name_value is null and cnpj_value is null then
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
  if company_name_value is not null then
    where_text := where_text || format(
      ' and public.normalize_company_search(coalesce(lead.legal_name, '''') || '' '' || coalesce(lead.trade_name, '''') || '' '' || coalesce(lead.search_alias, '''')) like %L',
      '%' || public.normalize_company_search(company_name_value) || '%'
    );
  end if;

  -- CNPJ completo ou parcial, com ou sem pontuação.
  if cnpj_value is not null then
    where_text := where_text || format(' and lead.cnpj like %L', cnpj_value || '%');
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

  execute format(
    'select count(*) from (select 1 from public.company_leads lead where %s limit 5001) counted',
    where_text
  )
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
            'is_client', lead.existing_client_id is not null,
            'existing_client_id', lead.existing_client_id,
            'existing_client_company_id', lead.existing_client_company_id,
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

  return jsonb_build_object(
    'rows', coalesce(rows_json, '[]'::jsonb),
    'total', coalesce(total_count, 0),
    'total_capped', coalesce(total_count, 0) >= 5001
  );
end;
$$;

revoke all on function public.company_leads_search(jsonb, text, text, integer, integer) from public;
grant execute on function public.company_leads_search(jsonb, text, text, integer, integer)
  to anon, authenticated;

create or replace function public.company_lead_details(p_id uuid)
returns jsonb
language sql
stable
security definer
set search_path = public
as $$
  select to_jsonb(lead) || jsonb_build_object(
    'is_client', lead.existing_client_id is not null,
    'phone', nullif(lead.raw_payload->>'phone', ''),
    'email', nullif(lead.raw_payload->>'email', ''),
    'mei', coalesce((lead.raw_payload->>'mei')::boolean, false),
    'simples', coalesce((lead.raw_payload->>'simple')::boolean, false),
    'partners', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', partner.id,
        'name', partner.partner_name,
        'type', partner.partner_type,
        'qualification', partner.qualification,
        'joined_at', partner.joined_at,
        'country', partner.country
      ) order by partner.partner_name)
      from public.company_lead_partners partner
      where partner.company_root = coalesce(lead.company_root, left(lead.cnpj, 8))
    ), '[]'::jsonb)
  )
  from public.company_leads lead
  where lead.id = p_id;
$$;

revoke all on function public.company_lead_details(uuid) from public;
grant execute on function public.company_lead_details(uuid) to anon, authenticated;
