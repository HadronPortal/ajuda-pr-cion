create or replace function public.get_kanban_workspaces()
returns jsonb
language sql
security definer
set search_path = public
as $$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', w.id,
    'name', w.name,
    'slug', w.slug,
    'description', w.description,
    'website', w.website,
    'logoUrl', w.logo_url,
    'visibility', w.visibility,
    'settings', w.settings,
    'membershipRole', 'admin',
    'membersCount', (select count(*) from public.kanban_workspace_members m where m.workspace_id = w.id)
  ) order by w.created_at), '[]'::jsonb)
  from public.kanban_workspaces w;
$$;

create or replace function public.update_kanban_workspace(
  workspace_id uuid,
  workspace_name text,
  workspace_slug text,
  workspace_description text,
  workspace_website text,
  workspace_visibility text,
  workspace_settings jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.kanban_workspaces
  set name = trim(workspace_name),
      slug = trim(workspace_slug),
      description = coalesce(trim(workspace_description), ''),
      website = coalesce(trim(workspace_website), ''),
      visibility = case when workspace_visibility = 'company' then 'company' else 'private' end,
      settings = coalesce(workspace_settings, settings),
      updated_at = now()
  where id = workspace_id;

  if not found then
    raise exception 'Área de trabalho não encontrada';
  end if;
end;
$$;

revoke all on function public.get_kanban_workspaces() from public;
revoke all on function public.update_kanban_workspace(uuid, text, text, text, text, text, jsonb) from public;
grant execute on function public.get_kanban_workspaces() to anon, authenticated;
grant execute on function public.update_kanban_workspace(uuid, text, text, text, text, text, jsonb) to anon, authenticated;
