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
