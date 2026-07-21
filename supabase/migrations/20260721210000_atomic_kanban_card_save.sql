create or replace function public.save_kanban_card_payload(payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_card_id uuid;
  target_column_id uuid;
  next_position numeric;
  priority_value public.priority_level;
  checklist_item jsonb;
  checklist_position bigint := 0;
begin
  target_column_id := (payload ->> 'columnId')::uuid;
  priority_value := case lower(coalesce(payload ->> 'priority', ''))
    when 'alta' then 'high'::public.priority_level
    when 'high' then 'high'::public.priority_level
    when 'baixa' then 'low'::public.priority_level
    when 'low' then 'low'::public.priority_level
    when 'media' then 'medium'::public.priority_level
    when 'média' then 'medium'::public.priority_level
    when 'medium' then 'medium'::public.priority_level
    else null
  end;

  if coalesce(payload ->> 'id', '') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
    v_card_id := (payload ->> 'id')::uuid;
  end if;

  if v_card_id is not null and exists (select 1 from public.kanban_cards where id = v_card_id) then
    update public.kanban_cards
       set column_id = target_column_id,
           title = payload ->> 'title',
           description = nullif(payload ->> 'description', ''),
           priority = priority_value,
           due_at = case when nullif(payload ->> 'dueDate', '') is null then null else (payload ->> 'dueDate')::timestamptz end,
           archived = coalesce((payload ->> 'archived')::boolean, false),
           labels = coalesce(payload -> 'tags', '[]'::jsonb),
           member_legacy_ids = coalesce(payload -> 'memberIds', '[]'::jsonb),
           source_payload = coalesce(source_payload, '{}'::jsonb) || jsonb_build_object(
             'client', coalesce(payload ->> 'client', ''),
             'module', coalesce(payload ->> 'module', ''),
             'type', coalesce(payload ->> 'type', ''),
             'summary', coalesce(payload ->> 'summary', ''),
             'checklist', coalesce(payload -> 'checklist', '[]'::jsonb),
             'commentsList', coalesce(payload -> 'commentsList', '[]'::jsonb),
             'attachmentsList', coalesce(payload -> 'attachmentsList', '[]'::jsonb),
             'activity', coalesce(payload -> 'activity', '[]'::jsonb)
           ),
           updated_at = now()
     where id = v_card_id;
  else
    select coalesce(max(position), 0) + 1024
      into next_position
      from public.kanban_cards
     where column_id = target_column_id;

    insert into public.kanban_cards (
      column_id, title, description, priority, due_at, position, archived,
      labels, member_legacy_ids, source_payload
    ) values (
      target_column_id,
      payload ->> 'title',
      nullif(payload ->> 'description', ''),
      priority_value,
      case when nullif(payload ->> 'dueDate', '') is null then null else (payload ->> 'dueDate')::timestamptz end,
      next_position,
      coalesce((payload ->> 'archived')::boolean, false),
      coalesce(payload -> 'tags', '[]'::jsonb),
      coalesce(payload -> 'memberIds', '[]'::jsonb),
      jsonb_build_object(
        'client', coalesce(payload ->> 'client', ''),
        'module', coalesce(payload ->> 'module', ''),
        'type', coalesce(payload ->> 'type', ''),
        'summary', coalesce(payload ->> 'summary', ''),
        'checklist', coalesce(payload -> 'checklist', '[]'::jsonb),
        'commentsList', coalesce(payload -> 'commentsList', '[]'::jsonb),
        'attachmentsList', coalesce(payload -> 'attachmentsList', '[]'::jsonb),
        'activity', coalesce(payload -> 'activity', '[]'::jsonb)
      )
    ) returning id into v_card_id;
  end if;

  delete from public.kanban_checklist_items where kanban_checklist_items.card_id = v_card_id;

  for checklist_item in
    select value from jsonb_array_elements(coalesce(payload -> 'checklist', '[]'::jsonb))
  loop
    checklist_position := checklist_position + 1024;
    insert into public.kanban_checklist_items (
      card_id, title, completed, position, checklist_title, source_payload
    ) values (
      v_card_id,
      coalesce(checklist_item ->> 'text', ''),
      coalesce((checklist_item ->> 'done')::boolean, false),
      checklist_position,
      coalesce(nullif(checklist_item ->> 'checklistTitle', ''), 'Checklist'),
      checklist_item
    );
  end loop;

  return jsonb_build_object('id', v_card_id);
end;
$$;

revoke all on function public.save_kanban_card_payload(jsonb) from public;
grant execute on function public.save_kanban_card_payload(jsonb) to anon, authenticated, service_role;
