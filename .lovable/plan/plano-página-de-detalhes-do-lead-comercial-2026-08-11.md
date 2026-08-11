# Plano: Página de Detalhes do Lead Comercial

Este plano implementa uma nova página de detalhes para leads comerciais no módulo **Comercial > Contatos**, substituindo o modal atual e adicionando novas seções de informações e histórico de atividades.

## Mudanças

### Backend (Supabase)
- **Não haverá alterações estruturais no banco**, seguindo as restrições.
- Utilização da RPC existente `company_lead_details` para carregar dados.
- Utilização da tabela `company_lead_activities` para a timeline (com fallback caso a tabela não exista ou esteja vazia).

### Frontend
- **Nova Rota**: Criação de `src/routes/comercial.contatos.$leadId.tsx` para exibição em tela cheia.
- **Navegação**: Refatoração da listagem em `src/routes/comercial.contatos.tsx` para abrir a nova rota em uma nova aba (`target="_blank"`) ao clicar em uma empresa, preservando o estado da listagem original.
- **Layout de Detalhes**:
    - Cabeçalho padronizado com `DetailModalHeader`.
    - Seção unificada de **Localização e Contato**.
    - Seção dedicada de **Atividade da Empresa** (CNAE Principal e Secundários).
    - Seção de **Quadro Societário**.
    - Seção de **Atividades** com timeline vertical decrescente (mais recente primeiro), mostrando tipos reais (Prospecção, Relacionamento, etc.).
- **Componentes**: Criação de `src/components/commercial/LeadTimeline.tsx` e `src/components/commercial/LeadDetailView.tsx`.
- **API**: Criação de `src/lib/company-lead-activities.functions.ts` para buscar atividades via servidor.

## Detalhes Técnicos
- Uso de `tanstack/react-router` para a nova rota dinâmica.
- Preservação do tema light/dark através das classes globais do projeto.
- Normalização de Cidade/UF usando `normalizeCityUf`.
- Implementação de cópia para clipboard em telefones e e-mails.
- Tratamento de campos nulos exibindo "Não informado".

## Arquivos Alterados
- `src/routes/comercial.contatos.tsx` (Refatoração da listagem e navegação)
- `src/routes/comercial.contatos.$leadId.tsx` (Nova rota de detalhes)
- `src/lib/company-lead-activities.functions.ts` (Serviço de atividades)
- `src/components/commercial/LeadDetailView.tsx` (Componente principal de visualização)
- `src/components/commercial/LeadTimeline.tsx` (Timeline de atividades)
