create extension if not exists pg_cron;
create extension if not exists pg_net with schema extensions;

create or replace function public.invoke_fiscal_news_collector()
returns bigint
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  endpoint text;
  anon_key text;
  request_id bigint;
begin
  select decrypted_secret
    into endpoint
    from vault.decrypted_secrets
   where name = 'fiscal_news_function_url'
   limit 1;

  select decrypted_secret
    into anon_key
    from vault.decrypted_secrets
   where name = 'fiscal_news_anon_key'
   limit 1;

  if endpoint is null or anon_key is null then
    raise exception 'Secrets do coletor fiscal nao configurados no Vault';
  end if;

  select net.http_post(
    url := endpoint,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || anon_key
    ),
    body := '{"action":"scheduled_collect"}'::jsonb,
    timeout_milliseconds := 120000
  )
  into request_id;

  return request_id;
end;
$$;

revoke all on function public.invoke_fiscal_news_collector() from public;
grant execute on function public.invoke_fiscal_news_collector() to postgres;

do $$
declare
  existing_job bigint;
begin
  select jobid
    into existing_job
    from cron.job
   where jobname = 'collect-official-fiscal-news'
   limit 1;

  if existing_job is not null then
    perform cron.unschedule(existing_job);
  end if;

  perform cron.schedule(
    'collect-official-fiscal-news',
    '0 */3 * * *',
    'select public.invoke_fiscal_news_collector();'
  );
end;
$$;
