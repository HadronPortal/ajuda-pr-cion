export type TicketStatus =
  | "Atrasado"
  | "Em Aberto"
  | "Ocupado"
  | "Em andamento"
  | "Aguardando cliente"
  | "Com especialista"
  | "Agendamento"
  | "Finalizado"
  | "Cancelado";

export type TicketPriority = "Alta" | "Media" | "Baixa";

export type SupportTicket = {
  id: string;
  protocol: string;
  status: TicketStatus;
  priority: TicketPriority;
  openedAt: string;
  updatedAt: string;
  attendant: string;
  owner: string;
  clientCode: string;
  clientName: string;
  contact: string;
  subject: string;
  module: string;
  source: "Telefone" | "Portal do cliente" | "WhatsApp" | "Email";
  lockedBy?: string;
};

export const ticketStatuses: TicketStatus[] = [
  "Atrasado",
  "Em Aberto",
  "Ocupado",
  "Em andamento",
  "Aguardando cliente",
  "Com especialista",
  "Agendamento",
  "Finalizado",
  "Cancelado",
];

export const ticketOperators = [
  "PRCSUZ",
  "PRCMAR",
  "PRCTRE",
  "PRCROG",
  "PRCLCZ",
  "PRCGGC",
  "PRCPED",
];

export const supportTickets: SupportTicket[] = [
  {
    id: "43725",
    protocol: "PRC-1783454392",
    status: "Em Aberto",
    priority: "Alta",
    openedAt: "2026-07-08T08:18:00",
    updatedAt: "2026-07-08T08:24:00",
    attendant: "PRCSUZ",
    owner: "PRCMAR",
    clientCode: "MIT",
    clientName: "Mineracao Itaporanga",
    contact: "Samuel",
    subject: "Nota em processamento",
    module: "Vendas - NFE",
    source: "Telefone",
  },
  {
    id: "43724",
    protocol: "PRC-1783454359",
    status: "Em Aberto",
    priority: "Media",
    openedAt: "2026-07-08T08:03:00",
    updatedAt: "2026-07-08T08:17:00",
    attendant: "PRCSUZ",
    owner: "PRCROG",
    clientCode: "MRG",
    clientName: "Mercearia e Sacolao Gomes",
    contact: "Vanderley",
    subject: "Nota fiscal nao autorizada",
    module: "Vendas - NFE",
    source: "Portal do cliente",
  },
  {
    id: "43722",
    protocol: "PRC-1783453236",
    status: "Em andamento",
    priority: "Media",
    openedAt: "2026-07-08T07:44:00",
    updatedAt: "2026-07-08T09:36:00",
    attendant: "PRCSUZ",
    owner: "PRCROG",
    clientCode: "CTR",
    clientName: "Coopertransc",
    contact: "Carla",
    subject: "Cupom nao apareceu no financeiro",
    module: "Basico - Terceiros",
    source: "WhatsApp",
  },
  {
    id: "43721",
    protocol: "PRC-1783452521",
    status: "Com especialista",
    priority: "Alta",
    openedAt: "2026-07-08T07:21:00",
    updatedAt: "2026-07-08T09:01:00",
    attendant: "PRCSUZ",
    owner: "PRCPED",
    clientCode: "IMP",
    clientName: "Imprima Mais Cartuchos",
    contact: "Elisangela",
    subject: "Alterar endereco do terceiro",
    module: "Basico - Terceiros",
    source: "Telefone",
  },
  {
    id: "43720",
    protocol: "PRC-1783452475",
    status: "Aguardando cliente",
    priority: "Baixa",
    openedAt: "2026-07-08T06:58:00",
    updatedAt: "2026-07-08T08:40:00",
    attendant: "PRCSUZ",
    owner: "PRCLCZ",
    clientCode: "EPB",
    clientName: "Epaper Box",
    contact: "Camila",
    subject: "Configurar impressora",
    module: "Basico - Terceiros",
    source: "Portal do cliente",
  },
  {
    id: "43716",
    protocol: "PRC-1783450423",
    status: "Ocupado",
    priority: "Alta",
    openedAt: "2026-07-07T15:53:00",
    updatedAt: "2026-07-08T08:53:00",
    attendant: "PRCSUZ",
    owner: "PRCMAR",
    clientCode: "MSS",
    clientName: "Messias Material Construcao",
    contact: "Fernanda",
    subject: "Nota fiscal com rejeicao",
    module: "Vendas - NFE",
    source: "Telefone",
    lockedBy: "PRCMAR",
  },
  {
    id: "43698",
    protocol: "PRC-1783442611",
    status: "Agendamento",
    priority: "Media",
    openedAt: "2026-07-07T13:43:00",
    updatedAt: "2026-07-08T07:58:00",
    attendant: "PRCSUZ",
    owner: "PRCTRE",
    clientCode: "MAG",
    clientName: "Lojas Maguilar",
    contact: "Paola",
    subject: "Treinamento Hadron Web",
    module: "Hadron Web",
    source: "Email",
  },
  {
    id: "43691",
    protocol: "PRC-1783441953",
    status: "Atrasado",
    priority: "Alta",
    openedAt: "2026-07-06T13:32:00",
    updatedAt: "2026-07-07T14:17:00",
    attendant: "PRCSUZ",
    owner: "PRCMAR",
    clientCode: "EDC",
    clientName: "Esquinao da Construcao",
    contact: "Caio",
    subject: "Carta de correcao",
    module: "Vendas - NFE",
    source: "Telefone",
  },
  {
    id: "43353",
    protocol: "PRC-1783377194",
    status: "Finalizado",
    priority: "Baixa",
    openedAt: "2026-07-05T09:16:00",
    updatedAt: "2026-07-05T11:02:00",
    attendant: "PRCSUZ",
    owner: "PRCGGC",
    clientCode: "CPB",
    clientName: "Campo Belo Alimentos",
    contact: "Marcos",
    subject: "Duvida sobre relatorio de estoque",
    module: "Estoque",
    source: "Portal do cliente",
  },
  {
    id: "43295",
    protocol: "PRC-1783369781",
    status: "Cancelado",
    priority: "Baixa",
    openedAt: "2026-07-04T10:02:00",
    updatedAt: "2026-07-04T10:21:00",
    attendant: "PRCSUZ",
    owner: "PRCSUZ",
    clientCode: "TRR",
    clientName: "Terra Sol",
    contact: "Bruno",
    subject: "Chamado duplicado",
    module: "Financeiro",
    source: "WhatsApp",
  },
];

export const dailyTicketAnalytics = [
  { day: "Qui", opened: 31, finished: 26, overdue: 7 },
  { day: "Sex", opened: 42, finished: 33, overdue: 9 },
  { day: "Sab", opened: 14, finished: 18, overdue: 4 },
  { day: "Dom", opened: 8, finished: 10, overdue: 3 },
  { day: "Seg", opened: 57, finished: 44, overdue: 12 },
  { day: "Ter", opened: 63, finished: 51, overdue: 15 },
  { day: "Qua", opened: 48, finished: 39, overdue: 11 },
];

export const weeklyTicketAnalytics = [
  { week: "Sem 23", opened: 215, finished: 202, backlog: 74 },
  { week: "Sem 24", opened: 238, finished: 221, backlog: 91 },
  { week: "Sem 25", opened: 251, finished: 248, backlog: 94 },
  { week: "Sem 26", opened: 276, finished: 252, backlog: 118 },
  { week: "Sem 27", opened: 263, finished: 241, backlog: 140 },
  { week: "Sem 28", opened: 287, finished: 259, backlog: 168 },
];
