create table if not exists public.fiscal_news_sources (
  id text primary key,
  name text not null,
  base_url text not null,
  listing_url text not null,
  rss_url text,
  enabled boolean not null default true,
  last_collected_at timestamptz,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.fiscal_news (
  id uuid primary key default gen_random_uuid(),
  source_id text not null references public.fiscal_news_sources(id),
  external_id text,
  title text not null,
  summary text not null default '',
  category text not null,
  categories text[] not null default '{}',
  url text not null unique,
  canonical_url text not null unique,
  source_image_url text,
  image_url text,
  image_storage_path text,
  published_at timestamptz,
  relevance_score integer not null check (relevance_score >= 5),
  keywords text[] not null default '{}',
  raw_metadata jsonb not null default '{}'::jsonb,
  collected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists fiscal_news_published_idx
  on public.fiscal_news (published_at desc nulls last);
create index if not exists fiscal_news_category_idx
  on public.fiscal_news (category);
create index if not exists fiscal_news_source_idx
  on public.fiscal_news (source_id);

alter table public.fiscal_news_sources enable row level security;
alter table public.fiscal_news enable row level security;

drop policy if exists fiscal_news_sources_public_read on public.fiscal_news_sources;
create policy fiscal_news_sources_public_read
  on public.fiscal_news_sources for select using (enabled);

drop policy if exists fiscal_news_public_read on public.fiscal_news;
create policy fiscal_news_public_read
  on public.fiscal_news for select using (relevance_score >= 5);

insert into storage.buckets (id, name, public)
values ('fiscal-news-images', 'fiscal-news-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists fiscal_news_images_public_read on storage.objects;
create policy fiscal_news_images_public_read
  on storage.objects for select
  using (bucket_id = 'fiscal-news-images');
