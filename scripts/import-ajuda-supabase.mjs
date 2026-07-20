import { load } from 'cheerio'
import { mkdir, writeFile } from 'node:fs/promises'

const SOURCE = 'https://ajuda.procion.com'
const OUTPUT = new URL('../supabase/migrations/20260720151000_import_knowledge_base.sql', import.meta.url)

const categoryNames = {
  guia: 'Guia',
  manual: 'Manual',
  erros_correcoes: 'Erros e CorreÃ§Ãµes',
  legislacao: 'LegislaÃ§Ã£o',
  comunicacao: 'ComunicaÃ§Ã£o',
  novidade: 'Novidade',
}

const compact = (value = '') => value.replace(/\s+/g, ' ').trim()
const sql = (value) => (value == null ? 'null' : `'${String(value).replaceAll("'", "''")}'`)
const b64 = (value) => Buffer.from(value || '', 'utf8').toString('base64')

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function parsePublishedAt(value) {
  const match = value.match(/(\d{2})\/(\d{2})\/(\d{2})\s+(\d{2}):(\d{2})/)
  if (!match) return null
  const [, day, month, year, hour, minute] = match
  return `20${year}-${month}-${day}T${hour}:${minute}:00-03:00`
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'ProcionKnowledgeBaseImporter/1.0' } })
  if (!response.ok) throw new Error(`${response.status} ao acessar ${url}`)
  return response.text()
}

function absoluteAssetUrls($, content) {
  content.find('[src]').each((_, element) => {
    const current = $(element).attr('src')
    if (current) $(element).attr('src', new URL(current, SOURCE).href)
  })
  content.find('a[href]').each((_, element) => {
    const current = $(element).attr('href')
    if (current && !current.startsWith('#') && !current.startsWith('javascript:')) {
      $(element).attr('href', new URL(current, SOURCE).href)
    }
  })
}

async function listArticles() {
  const found = new Map()
  for (let page = 1; page <= 7; page += 1) {
    const $ = load(await fetchHtml(`${SOURCE}/artigos?page=${page}`))
    $('.list-articles > li').each((_, item) => {
      const anchor = $(item).find('a').first()
      const href = anchor.attr('href')
      if (!href) return
      const match = href.match(/^artigo\/([^/]+)\/(\d+)\/([^/?#]+)/)
      if (!match) return
      const [, categorySlug, legacyId, sourceSlug] = match
      const metadata = compact($(item).find('small').first().text())
      const dateMatch = metadata.match(/\d{2}\/\d{2}\/\d{2}\s+\d{2}:\d{2}$/)
      const hierarchy = compact(metadata.replace(dateMatch?.[0] || '', '')).replace(/\s*-\s*$/, '')
      const [moduleName = 'OUTROS MÃ“DULOS', ...submoduleParts] = hierarchy.split(/\s+-\s+/)
      found.set(Number(legacyId), {
        legacyId: Number(legacyId),
        categorySlug,
        categoryName: categoryNames[categorySlug] || categorySlug,
        sourceSlug,
        title: compact(anchor.text()),
        moduleName: compact(moduleName),
        submoduleName: compact(submoduleParts.join(' - ')) || 'GERAL',
        sourcePublishedAt: parsePublishedAt(metadata),
        sourceUrl: new URL(href, SOURCE).href,
      })
    })
  }
  return [...found.values()]
}

async function hydrateArticle(article) {
  const $ = load(await fetchHtml(article.sourceUrl), { decodeEntities: false })
  const cards = $('.uk-width-medium-3-4 .md-card').toArray()
  const card = cards.map((node) => $(node)).find((candidate) => candidate.find('h1').length > 0)
  if (!card) throw new Error(`ConteÃºdo nÃ£o encontrado em ${article.sourceUrl}`)

  const content = card.find('div[style*="overflow-wrap"]').first()
  absoluteAssetUrls($, content)
  const contentHtml = content.html()?.trim() || ''
  const contentText = compact(content.text())
  const assets = content
    .find('img[src]')
    .toArray()
    .map((image, index) => ({
      sourceUrl: $(image).attr('src'),
      altText: compact($(image).attr('alt') || ''),
      position: index,
    }))

  return {
    ...article,
    title: compact(card.find('h1').first().text()) || article.title,
    slug: `${article.legacyId}-${slugify(article.title)}`,
    summary: contentText.slice(0, 280),
    contentHtml,
    contentText,
    assets,
  }
}

function buildMigration(articles) {
  const categories = [...new Map(articles.map((item) => [item.categorySlug, item.categoryName])).entries()]
  const modules = [...new Set(articles.map((item) => item.moduleName))]
  const submodules = [...new Map(articles.map((item) => [`${item.moduleName}\0${item.submoduleName}`, item])).values()]
  const lines = [
    '-- Generated from https://ajuda.procion.com on 2026-07-20.',
    '-- Re-run safely: all imported records use deterministic natural keys.',
    'begin;',
    '',
  ]

  for (const [slug, name] of categories) {
    lines.push(`insert into public.kb_categories (legacy_slug, name, slug) values (${sql(slug)}, ${sql(name)}, ${sql(slug)}) on conflict (slug) do update set name = excluded.name, legacy_slug = excluded.legacy_slug;`)
  }
  lines.push('')
  for (const name of modules) {
    lines.push(`insert into public.modules (name, slug) values (${sql(name)}, ${sql(slugify(name))}) on conflict (slug) do update set name = excluded.name;`)
  }
  lines.push('')
  for (const item of submodules) {
    lines.push(`insert into public.submodules (module_id, name, slug) select id, ${sql(item.submoduleName)}, ${sql(slugify(item.submoduleName))} from public.modules where slug = ${sql(slugify(item.moduleName))} on conflict (module_id, slug) do update set name = excluded.name;`)
  }
  lines.push('')

  for (const item of articles) {
    lines.push(
      `insert into public.kb_articles (legacy_id, category_id, module_id, submodule_id, title, slug, summary, content_html, content_text, source_url, source_published_at, published_at, published, imported_at)`,
      `select ${item.legacyId}, c.id, m.id, s.id, ${sql(item.title)}, ${sql(item.slug)}, ${sql(item.summary)}, convert_from(decode(${sql(b64(item.contentHtml))}, 'base64'), 'utf8'), convert_from(decode(${sql(b64(item.contentText))}, 'base64'), 'utf8'), ${sql(item.sourceUrl)}, ${sql(item.sourcePublishedAt)}::timestamptz, ${sql(item.sourcePublishedAt)}::timestamptz, true, now()`,
      `from public.kb_categories c join public.modules m on m.slug = ${sql(slugify(item.moduleName))} join public.submodules s on s.module_id = m.id and s.slug = ${sql(slugify(item.submoduleName))} where c.slug = ${sql(item.categorySlug)}`,
      `on conflict (legacy_id) do update set category_id = excluded.category_id, module_id = excluded.module_id, submodule_id = excluded.submodule_id, title = excluded.title, slug = excluded.slug, summary = excluded.summary, content_html = excluded.content_html, content_text = excluded.content_text, source_url = excluded.source_url, source_published_at = excluded.source_published_at, published_at = excluded.published_at, published = true, imported_at = now(), updated_at = now();`,
    )
    lines.push(`delete from public.kb_article_assets where article_id = (select id from public.kb_articles where legacy_id = ${item.legacyId});`)
    for (const asset of item.assets) {
      lines.push(`insert into public.kb_article_assets (article_id, source_url, alt_text, position) select id, ${sql(asset.sourceUrl)}, ${sql(asset.altText)}, ${asset.position} from public.kb_articles where legacy_id = ${item.legacyId};`)
    }
  }
  lines.push('', 'commit;', '')
  return lines.join('\n')
}

const listed = await listArticles()
console.log(`Encontrados ${listed.length} artigos; baixando conteÃºdo...`)

const hydrated = []
for (let index = 0; index < listed.length; index += 6) {
  hydrated.push(...(await Promise.all(listed.slice(index, index + 6).map(hydrateArticle))))
  console.log(`${Math.min(index + 6, listed.length)}/${listed.length}`)
}

await mkdir(new URL('../supabase/migrations/', import.meta.url), { recursive: true })
await writeFile(OUTPUT, buildMigration(hydrated), 'utf8')
console.log(`MigraÃ§Ã£o gerada com ${hydrated.length} artigos em ${OUTPUT.pathname}`)


