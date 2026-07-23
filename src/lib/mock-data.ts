export const currentUser = {
  name: "Ana Ribeiro",
  email: "ana.ribeiro@procion.com.br",
  role: "Analista de Suporte",
  initials: "AR",
  operator: "PRCMAR",
};

export const shortcuts = [
  { key: "manuais", label: "Manuais", description: "Guias completos por módulo", icon: "BookOpen", tone: "primary" },
  { key: "artigos", label: "Artigos", description: "Base de conhecimento", icon: "FileText", tone: "accent" },
  { key: "atualizacoes", label: "Atualizações", description: "Novidades do produto", icon: "Sparkles", tone: "success" },
  { key: "versoes", label: "Versões", description: "Histórico de releases", icon: "GitBranch", tone: "primary" },
  { key: "erros", label: "Erros e Correções", description: "Bugs conhecidos e fixes", icon: "AlertTriangle", tone: "warning" },
  { key: "legislacao", label: "Legislação", description: "Normas e obrigações", icon: "Scale", tone: "accent" },
  { key: "comunicacao", label: "Comunicação", description: "Comunicados oficiais", icon: "Megaphone", tone: "primary" },
] as const;

export const latestArticles = [
  { id: "1", title: "Como configurar integrações SPED Fiscal", category: "Fiscal", author: "Bruno Lima", date: "2 dias atrás", readTime: "6 min" },
  { id: "2", title: "Boas práticas para conciliação bancária", category: "Financeiro", author: "Marina Souza", date: "3 dias atrás", readTime: "8 min" },
  { id: "3", title: "Guia rápido do módulo de Estoque", category: "Estoque", author: "Rafael Torres", date: "5 dias atrás", readTime: "4 min" },
  { id: "4", title: "Novidades da API de emissão de NF-e", category: "Integrações", author: "Camila Alves", date: "1 semana atrás", readTime: "10 min" },
];

export const latestVersions = [
  { id: "v-2026.3", version: "2026.3.1", title: "Melhorias no Kanban e novo filtro de clientes", type: "Estável", date: "05 Jul 2026", badge: "success" },
  { id: "v-2026.2", version: "2026.2.4", title: "Correções em relatórios fiscais e SPED", type: "Correção", date: "22 Jun 2026", badge: "warning" },
  { id: "v-2026.2b", version: "2026.2.3", title: "Nova tela de cadastro de parceiros", type: "Estável", date: "10 Jun 2026", badge: "success" },
];

export const recentTasks = [
  { id: "t1", title: "Revisar manual do módulo Fiscal", project: "Base de Conhecimento", status: "Em andamento", due: "Hoje", assignee: "AR" },
  { id: "t2", title: "Publicar release notes 2026.3.1", project: "Versões", status: "Aguardando", due: "Amanhã", assignee: "BL" },
  { id: "t3", title: "Atender chamados da fila de suporte", project: "Suporte", status: "Em andamento", due: "Hoje", assignee: "MS" },
  { id: "t4", title: "Atualizar artigo sobre NF-e 4.00", project: "Base de Conhecimento", status: "Concluído", due: "Ontem", assignee: "RT" },
];

export const kbCategories = [
  { name: "Fiscal", articles: 48, color: "primary" },
  { name: "Financeiro", articles: 36, color: "accent" },
  { name: "Estoque", articles: 27, color: "success" },
  { name: "Integrações", articles: 19, color: "warning" },
  { name: "Cadastros", articles: 22, color: "primary" },
  { name: "Relatórios", articles: 31, color: "accent" },
];

export const updates = [
  { id: "u1", title: "Nova experiência do Kanban Prócion", date: "05 Jul 2026", tag: "Feature", summary: "Colunas customizáveis, filtros avançados e visão por responsável." },
  { id: "u2", title: "Integração nativa com Pix Automático", date: "28 Jun 2026", tag: "Integração", summary: "Cobrança recorrente via Pix diretamente do módulo Financeiro." },
  { id: "u3", title: "Atualização de segurança - autenticação 2FA", date: "20 Jun 2026", tag: "Segurança", summary: "2FA obrigatório para perfis administrativos a partir de 01/08." },
  { id: "u4", title: "Melhorias de performance nos relatórios", date: "12 Jun 2026", tag: "Melhoria", summary: "Redução de até 60% no tempo de geração dos principais relatórios." },
];

export const versions = [
  { version: "2026.3.1", date: "05 Jul 2026", type: "Estável", highlights: ["Kanban com colunas customizáveis", "Novo filtro global de clientes", "Correção em geração de boletos"] },
  { version: "2026.3.0", date: "28 Jun 2026", type: "Estável", highlights: ["Redesign do dashboard", "Pix Automático", "Melhorias no SPED"] },
  { version: "2026.2.4", date: "22 Jun 2026", type: "Correção", highlights: ["Correção no relatório DRE", "Ajuste em conciliação bancária"] },
  { version: "2026.2.3", date: "10 Jun 2026", type: "Estável", highlights: ["Cadastro de parceiros redesenhado", "Novos webhooks"] },
];

export const kanbanColumns = [
  {
    id: "backlog",
    title: "Backlog",
    cards: [
      { id: "k1", title: "Investigar lentidão no módulo Fiscal", tag: "Bug", priority: "Alta", assignee: "BL" },
      { id: "k2", title: "Documentar API de webhooks", tag: "Docs", priority: "Média", assignee: "MS" },
    ],
  },
  {
    id: "doing",
    title: "Em andamento",
    cards: [
      { id: "k3", title: "Redesign da tela de clientes", tag: "Feature", priority: "Alta", assignee: "AR" },
      { id: "k4", title: "Atualizar manuais 2026.3", tag: "Docs", priority: "Média", assignee: "RT" },
    ],
  },
  {
    id: "review",
    title: "Revisão",
    cards: [
      { id: "k5", title: "Release notes 2026.3.1", tag: "Docs", priority: "Alta", assignee: "CA" },
    ],
  },
  {
    id: "done",
    title: "Concluído",
    cards: [
      { id: "k6", title: "Migração de autenticação 2FA", tag: "Feature", priority: "Alta", assignee: "BL" },
      { id: "k7", title: "Correção no relatório DRE", tag: "Bug", priority: "Média", assignee: "MS" },
    ],
  },
];

// Empresas foram removidas dos mocks. Use useClients() de src/lib/clients-store.ts
// para consumir a lista real de clientes do Supabase.
export const clients: Array<{
  id: string;
  name: string;
  segment: string;
  plan: string;
  status: string;
  contact: string;
  since: string;
}> = [];
