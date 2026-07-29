# API de notícias fiscais oficiais

A Edge Function `fiscal-news` coleta, classifica, persiste e lista notícias de
fontes oficiais brasileiras.

## Endpoints

`POST /functions/v1/fiscal-news`

Listagem pública:

```json
{ "action": "list", "limit": 12, "category": "ICMS" }
```

Coleta administrativa:

```json
{ "action": "collect" }
```

A coleta exige o header `x-collector-token`, com o mesmo valor do secret
`NEWS_COLLECTOR_TOKEN` configurado no Supabase.

## Fontes

- Receita Federal
- Portal SPED
- Portal Nacional NF-e
- Portal Nacional NFS-e
- CONFAZ
- Ministério da Fazenda
- Diário Oficial da União
- SEFAZ SP
- SEFAZ MG
- SEFAZ RS

O coletor procura um feed RSS/Atom declarado pela fonte e usa scraping HTML
como fallback. Falhas de uma fonte são registradas em `fiscal_news_sources` e
não interrompem as demais coletas.

## Persistência

A migration `20260729120000_official_fiscal_news.sql` cria:

- `fiscal_news_sources`
- `fiscal_news`
- bucket público `fiscal-news-images`

Somente notícias com `relevance_score >= 5` são persistidas. URLs canônicas
impedem duplicidades. Imagens externas válidas são copiadas para o Storage.
