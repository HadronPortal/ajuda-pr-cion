export type KbCategoryId =
  | "guia"
  | "manual"
  | "erros"
  | "legislacao"
  | "comunicacao"
  | "novidades"
  | "atualizacoes";

export type KbCategory = {
  id: KbCategoryId;
  name: string;
  description: string;
  tone: "primary" | "accent" | "success" | "warning" | "destructive" | "muted";
};

export type KbArticle = {
  id: string;
  slug: string;
  title: string;
  category: KbCategoryId;
  module: string; // matches kanbanModules
  tags: string[];
  updatedAt: string; // ISO
  readTime: string;
  author: string;
  summary: string;
  content: KbBlock[];
};

export type KbBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; tone: "info" | "warning" | "success" | "danger"; title: string; text: string }
  | { type: "code"; text: string };

export const kbCategoriesFull: KbCategory[] = [
  { id: "guia", name: "Guia", description: "Passo a passo para tarefas do dia a dia", tone: "primary" },
  { id: "manual", name: "Manual", description: "Documentação completa por módulo", tone: "accent" },
  { id: "erros", name: "Erros e Correções", description: "Rejeições, mensagens de erro e soluções", tone: "destructive" },
  { id: "legislacao", name: "Legislação", description: "Normas fiscais, tributárias e trabalhistas", tone: "warning" },
  { id: "comunicacao", name: "Comunicação", description: "Comunicados oficiais da Prócion", tone: "success" },
  { id: "novidades", name: "Novidades", description: "Recursos novos no sistema", tone: "primary" },
  { id: "atualizacoes", name: "Atualizações", description: "Notas de versão e melhorias", tone: "muted" },
];

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};

export const kbArticlesFull: KbArticle[] = [
  {
    id: "KB-101",
    slug: "nota-fiscal-de-devolucao",
    title: "Nota Fiscal de Devolução: como emitir corretamente",
    category: "guia",
    module: "NF-e / SPED",
    tags: ["nf-e", "devolução", "fiscal"],
    updatedAt: daysAgo(3),
    readTime: "7 min",
    author: "Bruno Lima",
    summary:
      "Passo a passo para emitir NF-e de devolução vinculada à nota de origem, com tratamento correto de impostos.",
    content: [
      { type: "p", text: "A NF-e de devolução deve sempre referenciar a nota fiscal de origem para manter a rastreabilidade fiscal e o crédito de impostos correto." },
      { type: "h2", text: "Pré-requisitos" },
      { type: "ul", items: [
        "Nota fiscal de origem autorizada pela SEFAZ",
        "Motivo de devolução cadastrado no ERP",
        "CFOP de devolução configurado para a operação",
      ]},
      { type: "h2", text: "Passo a passo" },
      { type: "ol", items: [
        "Acesse ERP > Fiscal > Emissão de NF-e > Nova nota",
        "Selecione a natureza de operação 'Devolução de venda'",
        "Vincule a nota de origem pelo botão 'Referenciar NF-e'",
        "Confira os impostos: ICMS, IPI e PIS/COFINS devem espelhar a origem",
        "Transmita e autorize o XML",
      ]},
      { type: "callout", tone: "warning", title: "Atenção", text: "O valor total da devolução não pode ser maior que a nota referenciada. Se houver diferença, emita nota complementar." },
    ],
  },
  {
    id: "KB-102",
    slug: "centro-de-custos-de-producao",
    title: "Centro de Custos de Produção: configuração e rateio",
    category: "manual",
    module: "ERP - Produção",
    tags: ["produção", "custos", "rateio"],
    updatedAt: daysAgo(7),
    readTime: "12 min",
    author: "Marina Souza",
    summary:
      "Como estruturar centros de custo de produção, vincular ordens de produção e configurar rateio automático de despesas.",
    content: [
      { type: "p", text: "Centros de custo permitem apurar o custo real por linha de produção, célula ou equipamento." },
      { type: "h2", text: "Estrutura recomendada" },
      { type: "ul", items: [
        "CC pai: Fábrica",
        "CC filhos: Linha 1, Linha 2, Manutenção, Utilidades",
        "Vinculação: cada roteiro de produção aponta para um CC",
      ]},
      { type: "h2", text: "Rateio automático" },
      { type: "p", text: "Despesas indiretas como energia e supervisão podem ser rateadas por horas apontadas, quantidade produzida ou percentual fixo." },
      { type: "callout", tone: "info", title: "Boa prática", text: "Revise o rateio mensalmente para acompanhar variações de mix de produção." },
    ],
  },
  {
    id: "KB-103",
    slug: "recibo-de-carreteiro",
    title: "Recibo de Carreteiro (RPA): geração e retenções",
    category: "guia",
    module: "Logística",
    tags: ["logística", "rpa", "fretes"],
    updatedAt: daysAgo(10),
    readTime: "6 min",
    author: "Rafael Torres",
    summary:
      "Como emitir Recibo de Pagamento a Autônomo para carreteiros, com cálculo correto de INSS, IRRF e SEST/SENAT.",
    content: [
      { type: "p", text: "O RPA para transportador autônomo tem tratamento diferenciado: 20% da base é considerada base de cálculo para INSS." },
      { type: "h2", text: "Retenções obrigatórias" },
      { type: "ul", items: [
        "INSS: 11% sobre 20% do valor bruto",
        "SEST/SENAT: 2,5% sobre 20% do valor bruto",
        "IRRF: tabela progressiva conforme faixa",
      ]},
      { type: "h2", text: "Onde emitir" },
      { type: "p", text: "ERP > Financeiro > Contas a Pagar > Novo RPA. Selecione o motorista, informe o valor do frete e o sistema calcula automaticamente." },
    ],
  },
  {
    id: "KB-104",
    slug: "rejeicao-nfe-539",
    title: "Rejeição NF-e 539: duplicidade de chave detectada",
    category: "erros",
    module: "NF-e / SPED",
    tags: ["nf-e", "rejeição", "539", "fiscal"],
    updatedAt: daysAgo(1),
    readTime: "5 min",
    author: "Ana Ribeiro",
    summary:
      "A rejeição 539 indica que a chave da NF-e já foi transmitida. Aprenda a identificar e resolver o cenário.",
    content: [
      { type: "callout", tone: "danger", title: "Sintoma", text: "Ao transmitir a NF-e, a SEFAZ retorna: 'Rejeição 539 - Duplicidade de NF-e com diferença na chave de acesso'." },
      { type: "h2", text: "Causas mais comuns" },
      { type: "ul", items: [
        "Nota reenviada após timeout sem consultar o status",
        "Numeração reutilizada por erro de operação",
        "Contingência acionada e a nota original foi autorizada em paralelo",
      ]},
      { type: "h2", text: "Como resolver" },
      { type: "ol", items: [
        "Consulte a chave na SEFAZ pelo menu Fiscal > Consulta NF-e",
        "Se autorizada, cancele a duplicata local e importe a versão autorizada",
        "Se rejeitada, corrija a inconsistência e retransmita com nova numeração",
      ]},
      { type: "callout", tone: "info", title: "Prevenção", text: "Ative a consulta automática de status antes de retransmitir em caso de timeout." },
    ],
  },
  {
    id: "KB-105",
    slug: "rejeicao-nfe-204",
    title: "Rejeição NF-e 204: duplicidade de NF-e",
    category: "erros",
    module: "NF-e / SPED",
    tags: ["nf-e", "rejeição", "204"],
    updatedAt: daysAgo(4),
    readTime: "4 min",
    author: "Bruno Lima",
    summary:
      "Rejeição 204 indica que a chave já foi autorizada. Diferença em relação à 539 e como tratar.",
    content: [
      { type: "p", text: "A rejeição 204 confirma que a NF-e já está autorizada com a mesma chave. Nesse caso não é necessário retransmitir." },
      { type: "h2", text: "Ação recomendada" },
      { type: "ol", items: [
        "Baixe o XML autorizado direto da SEFAZ",
        "Importe no ERP pelo menu Fiscal > Importar XML",
        "Confirme que o status ficou como 'Autorizada'",
      ]},
    ],
  },
  {
    id: "KB-106",
    slug: "custo-medio-recalculo",
    title: "Custo Médio: como funciona e quando recalcular",
    category: "manual",
    module: "ERP - Estoque",
    tags: ["estoque", "custo médio", "valorização"],
    updatedAt: daysAgo(14),
    readTime: "10 min",
    author: "Marina Souza",
    summary:
      "Entenda o algoritmo de custo médio ponderado móvel usado pelo Prócion e quando o recálculo é necessário.",
    content: [
      { type: "p", text: "O custo médio é recalculado a cada entrada de estoque, ponderando o saldo anterior com a nova compra." },
      { type: "h2", text: "Fórmula" },
      { type: "code", text: "novo_custo = (saldo_anterior * custo_anterior + qtd_entrada * custo_entrada) / (saldo_anterior + qtd_entrada)" },
      { type: "h2", text: "Quando recalcular" },
      { type: "ul", items: [
        "Após importação retroativa de notas de entrada",
        "Ao ajustar CFOP que altera composição do custo",
        "Após correção de inventário",
      ]},
      { type: "callout", tone: "warning", title: "Cuidado", text: "O recálculo bloqueia movimentações de estoque durante a execução. Programe para horários de baixa operação." },
    ],
  },
  {
    id: "KB-107",
    slug: "ordem-de-producao",
    title: "Ordem de Produção: ciclo completo",
    category: "guia",
    module: "ERP - Produção",
    tags: ["produção", "op", "apontamento"],
    updatedAt: daysAgo(9),
    readTime: "9 min",
    author: "Rafael Torres",
    summary:
      "Do planejamento ao fechamento: como criar, apontar e encerrar uma ordem de produção no Prócion.",
    content: [
      { type: "h2", text: "Etapas da OP" },
      { type: "ol", items: [
        "Planejamento: quantidade, roteiro e prazo",
        "Liberação: reserva de matéria-prima",
        "Apontamento: horas e quantidades produzidas por operação",
        "Fechamento: consumo real x previsto",
      ]},
      { type: "h2", text: "Apontamento por célula" },
      { type: "p", text: "O apontamento pode ser feito via terminal de célula, coletor de dados ou tela web. O sistema calcula automaticamente perdas e eficiência." },
    ],
  },
  {
    id: "KB-108",
    slug: "importacao-de-estoque",
    title: "Importação de Estoque: layout e validações",
    category: "manual",
    module: "ERP - Estoque",
    tags: ["estoque", "importação", "csv"],
    updatedAt: daysAgo(5),
    readTime: "8 min",
    author: "Camila Alves",
    summary:
      "Layout oficial do arquivo de importação de saldo inicial de estoque e principais validações.",
    content: [
      { type: "h2", text: "Colunas obrigatórias" },
      { type: "ul", items: [
        "codigo_produto (string)",
        "codigo_deposito (string)",
        "quantidade (decimal, 4 casas)",
        "custo_unitario (decimal, 6 casas)",
        "data_movimento (AAAA-MM-DD)",
      ]},
      { type: "h2", text: "Validações críticas" },
      { type: "ul", items: [
        "Produto deve existir e estar ativo",
        "Depósito deve pertencer à filial",
        "Custo unitário maior que zero",
      ]},
      { type: "callout", tone: "info", title: "Dica", text: "Use o modo 'Simulação' antes da importação real para revisar erros linha a linha." },
    ],
  },
  {
    id: "KB-109",
    slug: "manifesto-e-xml",
    title: "Manifesto do Destinatário e XML: fluxo obrigatório",
    category: "legislacao",
    module: "NF-e / SPED",
    tags: ["manifesto", "xml", "fiscal", "legislação"],
    updatedAt: daysAgo(6),
    readTime: "7 min",
    author: "Bruno Lima",
    summary:
      "Regras do Manifesto do Destinatário (MDe): prazos, eventos e como automatizar o download de XMLs.",
    content: [
      { type: "p", text: "O MDe é obrigatório para contribuintes de ICMS que recebem NF-e como destinatário. Falta de manifestação pode gerar multa." },
      { type: "h2", text: "Eventos possíveis" },
      { type: "ul", items: [
        "Ciência da operação (até 10 dias)",
        "Confirmação da operação (até 20 dias)",
        "Desconhecimento da operação",
        "Operação não realizada",
      ]},
      { type: "h2", text: "Automação no Prócion" },
      { type: "p", text: "O robô fiscal executa manifestação automática configurável por CFOP e faz o download do XML da SEFAZ." },
    ],
  },
  {
    id: "KB-110",
    slug: "comunicado-fim-de-vida-2025",
    title: "Comunicado: fim de vida da versão 2025.x",
    category: "comunicacao",
    module: "Portal do Cliente",
    tags: ["release", "comunicado", "eol"],
    updatedAt: daysAgo(15),
    readTime: "3 min",
    author: "Camila Alves",
    summary:
      "A versão 2025.x deixa de receber correções em 31/12/2026. Planeje sua migração para 2026.x.",
    content: [
      { type: "callout", tone: "warning", title: "Prazo final", text: "Correções e suporte para 2025.x encerram em 31/12/2026." },
      { type: "p", text: "Todas as versões 2026.x oferecem migração assistida sem parada de operação." },
    ],
  },
  {
    id: "KB-111",
    slug: "novidade-pix-automatico",
    title: "Novidade: Pix Automático no módulo Financeiro",
    category: "novidades",
    module: "ERP - Financeiro",
    tags: ["pix", "financeiro", "novidade"],
    updatedAt: daysAgo(12),
    readTime: "5 min",
    author: "Marina Souza",
    summary:
      "Cobrança recorrente via Pix Automático integrada nativamente ao contas a receber.",
    content: [
      { type: "p", text: "O Pix Automático permite débito recorrente autorizado pelo pagador, reduzindo inadimplência em cobranças mensais." },
      { type: "h2", text: "Como habilitar" },
      { type: "ol", items: [
        "Contratar o serviço no seu banco parceiro",
        "Configurar chave Pix e certificado em Financeiro > Configurações",
        "Selecionar a modalidade 'Pix Automático' no cadastro de cobrança",
      ]},
    ],
  },
  {
    id: "KB-112",
    slug: "atualizacao-2026-3-1",
    title: "Notas da versão 2026.3.1",
    category: "atualizacoes",
    module: "Portal do Cliente",
    tags: ["release", "2026.3.1"],
    updatedAt: daysAgo(2),
    readTime: "4 min",
    author: "Camila Alves",
    summary:
      "Kanban com colunas customizáveis, novo filtro de clientes e ajustes fiscais.",
    content: [
      { type: "h2", text: "Destaques" },
      { type: "ul", items: [
        "Kanban Prócion com detalhamento completo de cards",
        "Filtro global de clientes no header",
        "Correção na geração de boletos com desconto condicional",
      ]},
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return kbArticlesFull.find((a) => a.slug === slug) ?? null;
}

export function getCategory(id: KbCategoryId) {
  return kbCategoriesFull.find((c) => c.id === id)!;
}

export function categoryToneClass(id: KbCategoryId) {
  const tone = getCategory(id).tone;
  return {
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/20 text-accent-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/25 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
    muted: "bg-muted text-muted-foreground",
  }[tone];
}

export function getRelatedArticles(article: KbArticle, limit = 4) {
  return kbArticlesFull
    .filter((a) => a.id !== article.id)
    .map((a) => {
      let score = 0;
      if (a.module === article.module) score += 3;
      if (a.category === article.category) score += 2;
      score += a.tags.filter((t) => article.tags.includes(t)).length;
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.a);
}

/**
 * Sugere artigos para um card. Em cards Bug/Suporte, prioriza a categoria
 * "Erros e Correções" e artigos do mesmo módulo.
 */
export function suggestArticlesForCard(opts: {
  type: string;
  module: string;
  tags?: string[];
}) {
  const wantsFixes = opts.type === "Bug" || opts.type === "Suporte";
  return kbArticlesFull
    .map((a) => {
      let score = 0;
      if (wantsFixes && a.category === "erros") score += 5;
      if (a.module === opts.module) score += 3;
      score += (opts.tags ?? []).filter((t) => a.tags.includes(t)).length * 2;
      return { a, score };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, 4)
    .map((x) => x.a);
}
