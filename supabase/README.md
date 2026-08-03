# Supabase Prócion

As migrações deste diretório criam a base operacional do Portal Prócion:

- autenticação, perfis e clientes;
- chamados, mensagens, eventos, anexos, transferências e finalizações;
- base de conhecimento, categorias, módulos, submódulos, tags e arquivos;
- agenda, frota, reservas e utilização de veículos;
- Kanban, colunas, cartões, checklists, membros e comentários;
- notificações e amostras de monitoramento da SEFAZ.

## Migrações

1. `20260720150000_initial_schema.sql`: estrutura, índices, RLS, buckets e realtime.
2. `20260720151000_import_knowledge_base.sql`: 135 artigos importados de `ajuda.procion.com`.

Para atualizar o conteúdo importado, execute:

```bash
node scripts/import-ajuda-supabase.mjs
```

O script reconstrói a segunda migração de forma idempotente. As imagens permanecem apontando para a origem e também são catalogadas em `kb_article_assets`, prontas para migração posterior ao Storage.
# Atualização mensal da prospecção

Execute `npm run sync:company-leads` em um servidor com `DATABASE_URL` configurada. O processo
detecta a competência mais recente da Receita Federal, ignora competências já importadas e registra
o resultado em `company_lead_sync_runs`. Em Windows, `scripts/run-company-leads-sync.cmd` pode ser
usado pelo Agendador de Tarefas. A atualização precisa de aproximadamente 8 GB livres para o cache.

O enriquecimento em lote pode ser executado manualmente com `npm run enrich:company-lead-contacts`. Quando
`GOOGLE_PLACES_API_KEY` está configurada, ele valida a empresa por nome e endereço, consulta telefone
e site no Google Places e extrai telefones/e-mails das páginas oficiais. Sem a chave, permanece ativo
apenas o enriquecimento por domínio corporativo. No CRM, a função `company-lead-enrich` executa o
mesmo processo somente para a empresa solicitada. Dados da Receita nunca são substituídos.
