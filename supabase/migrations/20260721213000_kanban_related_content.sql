create or replace function public.save_kanban_card_payload_v2(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  result jsonb;
  saved_id uuid;
begin
  result := public.save_kanban_card_payload(payload);
  saved_id := (result ->> 'id')::uuid;

  update public.kanban_cards
     set source_payload = coalesce(source_payload, '{}'::jsonb) || jsonb_build_object(
       'relatedArticles', coalesce(payload -> 'relatedArticles', '[]'::jsonb),
       'relatedVersions', coalesce(payload -> 'relatedVersions', '[]'::jsonb)
     )
   where id = saved_id;

  return result;
end;
$$;

revoke all on function public.save_kanban_card_payload_v2(jsonb) from public;
grant execute on function public.save_kanban_card_payload_v2(jsonb) to anon, authenticated, service_role;
