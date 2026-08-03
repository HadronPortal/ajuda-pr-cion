-- Expõe o exercício da publicação anual para não confundi-lo com a abertura da empresa.
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
    'website', nullif(lead.raw_payload->>'website', ''),
    'additional_phones', coalesce(lead.raw_payload->'enriched_phones', '[]'::jsonb),
    'mei', coalesce((lead.raw_payload->>'mei')::boolean, false),
    'simples', coalesce((lead.raw_payload->>'simple')::boolean, false),
    'tax_regime', case
      when coalesce((lead.raw_payload->>'mei')::boolean, false) then '3'
      when coalesce((lead.raw_payload->>'simple')::boolean, false) then '0'
      else nullif(lead.raw_payload->>'tax_regime', '')
    end,
    'tax_regime_year', nullif(lead.raw_payload->>'tax_regime_year', ''),
    'tax_regime_source', nullif(lead.raw_payload->>'tax_regime_source', ''),
    'partners', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', partner.id,
        'name', partner.partner_name,
        'type', partner.partner_type,
        'qualification', partner.qualification,
        'joined_at', partner.joined_at,
        'country', partner.country
      ) order by
        case
          when partner.qualification ilike '%titular%' then 0
          when partner.qualification ilike '%sócio-administrador%' then 1
          when partner.qualification ilike '%administrador%' then 2
          else 3
        end,
        partner.partner_name)
      from public.company_lead_partners partner
      where partner.company_root = coalesce(lead.company_root, left(lead.cnpj, 8))
    ), '[]'::jsonb)
  )
  from public.company_leads lead
  where lead.id = p_id;
$$;

revoke all on function public.company_lead_details(uuid) from public;
grant execute on function public.company_lead_details(uuid) to anon, authenticated;
