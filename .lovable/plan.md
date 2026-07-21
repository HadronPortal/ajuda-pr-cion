# Kanban: tela de quadros + roteamento por boardId

## Objetivo
Transformar `/kanban` numa tela de listagem de quadros ("Meus Quadros") e mover o board atual para `/kanban/$boardId`, sem alterar o visual interno do board.

## Rotas
- `/kanban` → nova tela **Meus Quadros** (grid, busca, filtros Todos/Meus/Favoritos, botão Criar quadro).
- `/kanban/$boardId` → board atual (renomear o arquivo `kanban.tsx` para `kanban.$boardId.tsx` mantendo todo o comportamento; adicionar header com botão "← Meus Quadros" e o nome do quadro).
- Menu lateral continua apontando para `/kanban` (só muda o destino do clique — abre a lista).

## Edge Function `kanban-api` (novas ações)
Adicionar em `supabase/functions/kanban-api/index.ts`:
- `listBoards` — retorna boards não arquivados com contagem de colunas, cartões ativos, membros (avatares) e `updated_at`.
- `getBoard({ boardId })` — metadados do quadro.
- `createBoard({ name, description, color, visibility, memberIds })` — cria board + coluna padrão + vincula usuário como admin.
- `updateBoard({ id, name?, description?, color? })`.
- `duplicateBoard({ id })` — clona board, colunas e cartões.
- `archiveBoard({ id })` / `deleteBoard({ id })`.
- `listAvailableMembers({ query? })`.
- `addBoardMember` / `updateBoardMemberRole` / `removeBoardMember`.
- **`loadBoard` passa a exigir `boardId`** (remove seleção automática do último).

Favoritos: coluna `is_favorite` em `kanban_board_members` (ou tabela `kanban_board_favorites` se preferir) — migração adicionada.

## Front

### `src/lib/kanban-api.ts`
Novos wrappers: `listBoards`, `createBoard`, `updateBoard`, `duplicateBoard`, `archiveBoard`, `deleteBoard`, `listAvailableMembers`, `addBoardMember`, `updateBoardMemberRole`, `removeBoardMember`, `toggleBoardFavorite`. `loadKanbanBoard(boardId)` passa a receber id.

### `src/routes/kanban.tsx` (nova tela)
- `AppShell` + header (título, subtítulo, busca, botão Criar quadro).
- Tabs "Todos / Meus quadros / Favoritos".
- Grid responsiva de `BoardCard`: nome, descrição, faixa colorida/capa, contagem de listas/cartões, avatares dos membros, `updated_at`, estrela de favorito, menu ⋯ (Renomear, Editar descrição, Gerenciar membros, Duplicar, Arquivar, Excluir com modal).
- Estados: loading (skeleton), vazio, erro com "Tentar novamente".
- Cursor `pointer` em todas as áreas clicáveis.
- React Query para `listBoards` + invalidação após mutações.

### `src/routes/kanban.$boardId.tsx`
Conteúdo atual do `kanban.tsx`, com:
- `useParams` para obter `boardId`.
- `loadKanbanBoard({ boardId })`.
- Header extra com botão "← Meus Quadros" (Link para `/kanban`) e nome do quadro.
- Nenhuma outra mudança de layout/drag/drawers.

### Modais novos (`src/components/kanban/`)
- `CreateBoardModal.tsx` — nome*, descrição, cor (paleta), visibilidade (privado/equipe), membros iniciais.
- `ManageMembersModal.tsx` — busca, lista disponíveis/adicionados, funções (admin/membro/observador), adicionar/alterar/remover.
- `DeleteBoardConfirm.tsx` — confirmação em modal próprio.
- Todos: fechar só por X ou Cancelar (`onInteractOutside` prevenido).

## Regras respeitadas
- Sem dados simulados; tudo via Edge Function.
- Sem `localStorage` para boards/membros/cartões.
- Visual interno do Kanban preservado.
- Light/dark preservado.
- Chaves privadas ficam apenas na Edge Function.

## Deploy
Após implementar: redeploy da Edge Function (via `EXTERNAL_SUPABASE_ACCESS_TOKEN` como antes) e do frontend.

## Validação
Fluxo completo: menu → lista → criar quadro → adicionar membros → abrir → criar coluna/cartão → mover → voltar → abrir outro → F5 (persistência).

Confirma que posso implementar assim?
