export type Priority = "Baixa" | "Média" | "Alta" | "Crítica";
export type CardType = "Suporte" | "Melhoria" | "Bug" | "Implantação" | "Documentação";
export type ColumnId = "backlog" | "triagem" | "em-andamento" | "aguardando-cliente" | "homologacao" | "concluido";

export type KanbanMember = {
  id: string;
  name: string;
  initials: string;
  color: string;
};

export type ChecklistItem = { id: string; text: string; done: boolean };
export type CommentEntry = { id: string; authorId: string; at: string; text: string };
export type ActivityEntry = { id: string; at: string; text: string; authorId?: string };
export type AttachmentItem = { id: string; name: string; size: string; kind: string };
export type RelatedArticle = { id: string; title: string; category: string };
export type RelatedVersion = { id: string; version: string; date: string; note: string };

export type KanbanCard = {
  id: string;
  columnId: ColumnId;
  title: string;
  summary: string;
  client: string;
  module: string;
  priority: Priority;
  type: CardType;
  assigneeId: string;
  dueDate: string; // ISO
  tags: string[];
  comments: number;
  attachments: number;
  archived?: boolean;
  description?: string;
  participants?: string[];
  checklist?: ChecklistItem[];
  commentsList?: CommentEntry[];
  activity?: ActivityEntry[];
  attachmentsList?: AttachmentItem[];
  relatedArticles?: RelatedArticle[];
  relatedVersions?: RelatedVersion[];
};

export type KanbanColumn = {
  id: ColumnId;
  title: string;
};

export const kanbanMembers: KanbanMember[] = [
  { id: "u-ar", name: "Ana Ribeiro", initials: "AR", color: "bg-primary/15 text-primary" },
  { id: "u-bl", name: "Bruno Lima", initials: "BL", color: "bg-accent/20 text-accent-foreground" },
  { id: "u-ms", name: "Marina Souza", initials: "MS", color: "bg-success/15 text-success" },
  { id: "u-rt", name: "Rafael Torres", initials: "RT", color: "bg-warning/25 text-warning-foreground" },
  { id: "u-ca", name: "Camila Alves", initials: "CA", color: "bg-primary/15 text-primary" },
  { id: "u-jp", name: "João Prado", initials: "JP", color: "bg-accent/20 text-accent-foreground" },
];

export const kanbanColumnsDef: KanbanColumn[] = [
  { id: "backlog", title: "Backlog" },
  { id: "triagem", title: "Triagem" },
  { id: "em-andamento", title: "Em andamento" },
  { id: "aguardando-cliente", title: "Aguardando cliente" },
  { id: "homologacao", title: "Homologação" },
  { id: "concluido", title: "Concluído" },
];

export const kanbanClients = [
  "Vega Distribuidora",
  "Alpha Comércio",
  "Órion Serviços",
  "Nébula Indústria",
  "Cetus Logística",
  "Lyra Farmácias",
] as const;

export const kanbanModules = [
  "ERP - Fiscal",
  "ERP - Financeiro",
  "ERP - Estoque",
  "ERP - Produção",
  "ERP - Compras",
  "NF-e / SPED",
  "Logística",
  "Portal do Cliente",
  "Integrações",
  "Infraestrutura",
] as const;

const today = new Date();
const daysFromNow = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const initialCards: KanbanCard[] = [
  {
    id: "PRC-1024",
    columnId: "backlog",
    title: "Rejeição NF-e 539 na filial de Curitiba",
    summary: "Cliente relata rejeição intermitente ao transmitir notas acima de R$ 50 mil.",
    client: "Vega Distribuidora",
    module: "NF-e / SPED",
    priority: "Alta",
    type: "Bug",
    assigneeId: "u-bl",
    dueDate: daysFromNow(3),
    tags: ["fiscal", "nf-e"],
    comments: 4,
    attachments: 2,
  },
  {
    id: "PRC-1025",
    columnId: "backlog",
    title: "Novo relatório de curva ABC de estoque",
    summary: "Solicitação de relatório com filtros por CD e período customizado.",
    client: "Nébula Indústria",
    module: "ERP - Estoque",
    priority: "Média",
    type: "Melhoria",
    assigneeId: "u-ms",
    dueDate: daysFromNow(10),
    tags: ["estoque", "relatório"],
    comments: 2,
    attachments: 0,
  },
  {
    id: "PRC-1026",
    columnId: "backlog",
    title: "Documentar API pública de pedidos",
    summary: "Endpoints REST v2 de criação, consulta e cancelamento de pedidos.",
    client: "Interno",
    module: "Integrações",
    priority: "Baixa",
    type: "Documentação",
    assigneeId: "u-ca",
    dueDate: daysFromNow(14),
    tags: ["api", "docs"],
    comments: 1,
    attachments: 0,
  },
  {
    id: "PRC-1030",
    columnId: "triagem",
    title: "Lentidão ao gerar SPED Contribuições",
    summary: "Empresas com mais de 20 mil notas/mês estão levando mais de 30 min.",
    client: "Alpha Comércio",
    module: "NF-e / SPED",
    priority: "Crítica",
    type: "Suporte",
    assigneeId: "u-ar",
    dueDate: daysFromNow(1),
    tags: ["fiscal", "performance"],
    comments: 7,
    attachments: 3,
  },
  {
    id: "PRC-1031",
    columnId: "triagem",
    title: "Erro no rateio de comissão por vendedor",
    summary: "Rateio ignora devoluções lançadas no mesmo mês da venda original.",
    client: "Lyra Farmácias",
    module: "ERP - Financeiro",
    priority: "Alta",
    type: "Bug",
    assigneeId: "u-jp",
    dueDate: daysFromNow(4),
    tags: ["financeiro", "comissão"],
    comments: 3,
    attachments: 1,
  },
  {
    id: "PRC-1040",
    columnId: "em-andamento",
    title: "Implantação módulo de Produção - fase 2",
    summary: "Configuração de roteiros e apontamento por célula. Kick-off realizado.",
    client: "Nébula Indústria",
    module: "ERP - Produção",
    priority: "Alta",
    type: "Implantação",
    assigneeId: "u-rt",
    dueDate: daysFromNow(21),
    tags: ["implantação", "produção"],
    comments: 12,
    attachments: 5,
  },
  {
    id: "PRC-1041",
    columnId: "em-andamento",
    title: "Integração WMS com módulo de Logística",
    summary: "Sincronizar separação, conferência e expedição em tempo real.",
    client: "Cetus Logística",
    module: "Logística",
    priority: "Alta",
    type: "Melhoria",
    assigneeId: "u-bl",
    dueDate: daysFromNow(9),
    tags: ["logística", "wms", "integração"],
    comments: 6,
    attachments: 2,
  },
  {
    id: "PRC-1042",
    columnId: "em-andamento",
    title: "Redesign da tela de conciliação bancária",
    summary: "Nova experiência com match automático e sugestões.",
    client: "Interno",
    module: "ERP - Financeiro",
    priority: "Média",
    type: "Melhoria",
    assigneeId: "u-ar",
    dueDate: daysFromNow(15),
    tags: ["financeiro", "ux"],
    comments: 4,
    attachments: 1,
  },
  {
    id: "PRC-1050",
    columnId: "aguardando-cliente",
    title: "Validação de layout de boleto personalizado",
    summary: "Aguardando aprovação do time financeiro do cliente.",
    client: "Alpha Comércio",
    module: "ERP - Financeiro",
    priority: "Média",
    type: "Suporte",
    assigneeId: "u-ms",
    dueDate: daysFromNow(2),
    tags: ["financeiro", "boleto"],
    comments: 2,
    attachments: 4,
  },
  {
    id: "PRC-1051",
    columnId: "aguardando-cliente",
    title: "Confirmação de dados para migração de estoque",
    summary: "Cliente precisa validar planilha de saldo inicial dos CDs.",
    client: "Vega Distribuidora",
    module: "ERP - Estoque",
    priority: "Alta",
    type: "Implantação",
    assigneeId: "u-rt",
    dueDate: daysFromNow(5),
    tags: ["estoque", "migração"],
    comments: 3,
    attachments: 2,
  },
  {
    id: "PRC-1060",
    columnId: "homologacao",
    title: "Release 2026.3.1 - homologação com cliente piloto",
    summary: "Testes de emissão fiscal, kanban e pix automático.",
    client: "Órion Serviços",
    module: "ERP - Fiscal",
    priority: "Alta",
    type: "Melhoria",
    assigneeId: "u-ca",
    dueDate: daysFromNow(6),
    tags: ["release", "homologação"],
    comments: 9,
    attachments: 3,
  },
  {
    id: "PRC-1061",
    columnId: "homologacao",
    title: "Pix Automático - fluxo de cobrança recorrente",
    summary: "Validando webhooks e reconciliação automática.",
    client: "Lyra Farmácias",
    module: "ERP - Financeiro",
    priority: "Média",
    type: "Melhoria",
    assigneeId: "u-jp",
    dueDate: daysFromNow(8),
    tags: ["financeiro", "pix"],
    comments: 5,
    attachments: 1,
  },
  {
    id: "PRC-1070",
    columnId: "concluido",
    title: "Correção no cálculo de ICMS ST para SC",
    summary: "Alíquota atualizada conforme convênio ICMS 142/2024.",
    client: "Nébula Indústria",
    module: "ERP - Fiscal",
    priority: "Alta",
    type: "Bug",
    assigneeId: "u-bl",
    dueDate: daysFromNow(-2),
    tags: ["fiscal", "icms"],
    comments: 6,
    attachments: 2,
  },
  {
    id: "PRC-1071",
    columnId: "concluido",
    title: "Migração de autenticação para 2FA obrigatório",
    summary: "Concluído para perfis administrativos e master.",
    client: "Interno",
    module: "Infraestrutura",
    priority: "Alta",
    type: "Melhoria",
    assigneeId: "u-ar",
    dueDate: daysFromNow(-5),
    tags: ["segurança", "2fa"],
    comments: 4,
    attachments: 0,
  },
  {
    id: "PRC-1072",
    columnId: "concluido",
    title: "Publicação release notes 2026.3.0",
    summary: "Notas de versão publicadas no Portal Prócion.",
    client: "Interno",
    module: "Portal do Cliente",
    priority: "Baixa",
    type: "Documentação",
    assigneeId: "u-ca",
    dueDate: daysFromNow(-7),
    tags: ["release", "docs"],
    comments: 2,
    attachments: 1,
  },
];

export const priorityMeta: Record<Priority, { badge: string; dot: string; ring?: string }> = {
  Baixa: { badge: "bg-muted text-muted-foreground", dot: "bg-muted-foreground" },
  Média: { badge: "bg-accent/20 text-accent-foreground", dot: "bg-accent" },
  Alta: { badge: "bg-warning/25 text-warning-foreground", dot: "bg-warning" },
  Crítica: {
    badge: "bg-destructive/10 text-destructive",
    dot: "bg-destructive",
    ring: "ring-1 ring-destructive/40",
  },
};

export const typeMeta: Record<CardType, string> = {
  Suporte: "bg-primary/10 text-primary",
  Melhoria: "bg-success/15 text-success",
  Bug: "bg-destructive/10 text-destructive",
  Implantação: "bg-accent/20 text-accent-foreground",
  Documentação: "bg-secondary text-secondary-foreground",
};

export const priorities: Priority[] = ["Baixa", "Média", "Alta", "Crítica"];
export const cardTypes: CardType[] = ["Suporte", "Melhoria", "Bug", "Implantação", "Documentação"];
