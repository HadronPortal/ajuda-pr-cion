import { supabase } from "@/lib/supabase";
import { normalizeCityName } from "@/lib/br-city";
import type { ClientRow } from "@/routes/clientes.index";

type DatabaseClient = Record<string, string | boolean | null>;

export type ClientContact = {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  mobile: string;
  whatsapp: string;
  active: boolean;
};

export type ClientCompany = {
  id: string;
  companyNumber: number | null;
  legalName: string;
  tradeName: string;
  document: string;
  stateRegistration: string;
  cnae: string;
  industry: string;
  size: string;
  taxRegime: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  responsibleName: string;
  responsibleDocument: string;
  accountantName: string;
  accountantPhone: string;
  accountantEmail: string;
};

export type ClientHadronUser = {
  id: string;
  name: string;
  email: string;
  operator: string;
  role: string;
  active: boolean;
  updatedAt: string;
};

export type ClientTerminal = {
  id: string;
  companyNumber: number | null;
  terminalNumber: number | null;
  ipAddress: string;
  installPath: string;
  version: string;
  versionDate: string;
  operatingSystem: string;
  operatingSystemVersion: string;
  emitsNfe: boolean | null;
  notesIssued: number;
  memoryUsed: string;
  memoryTotal: string;
  certificateType: string;
  certificateExpiresAt: string;
  environment: string;
  drives: unknown[];
  registeredAt: string;
  updatedAt: string;
};

export type ClientModule = {
  id: string;
  name: string;
  contracted: boolean;
  version: string;
};

export type ClientTicket = {
  id: string;
  protocol: string;
  subject: string;
  module: string;
  submodule: string;
  operator: string;
  priority: string;
  status: string;
  createdAt: string;
};

export type ClientEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  operator: string;
  status: string;
  ticketProtocol: string;
};

export type ClientDetail = {
  client: ClientRow;
  contacts: ClientContact[];
  companies: ClientCompany[];
  users: ClientHadronUser[];
  terminals: ClientTerminal[];
  modules: ClientModule[];
  tickets: ClientTicket[];
  events: ClientEvent[];
};

const industryLabels: Record<string, string> = {
  "1": "Comércio",
  "4": "Indústria",
};

const sizeLabels: Record<string, string> = {
  P: "Pequeno",
  M: "Médio",
  G: "Grande",
};

const labelFromCode = (value: unknown, labels: Record<string, string>) => {
  const code = String(value || "").trim();
  return labels[code.toUpperCase()] || code || "Não informado";
};

const date = (value: unknown, withTime = false) => {
  if (!value) return "";
  const parsed = new Date(String(value));
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", withTime ? { dateStyle: "short", timeStyle: "short" } : { dateStyle: "short" }).format(parsed);
};

const formatCnpj = (value: unknown) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length !== 14) return String(value || "");
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5",
  );
};

export function mapDatabaseClient(c: DatabaseClient): ClientRow {
  return {
    id: String(c.acronym || c.legacy_id || "").toLowerCase(),
    registered: date(c.crm_created_at),
    acronym: String(c.acronym || ""),
    group: String(c.group_acronym || ""),
    name: String(c.name || c.trade_name || c.legal_name || ""),
    razaoSocial: String(c.legal_name || c.name || c.acronym || ""),
    fantasia: String(c.trade_name || c.name || ""),
    segment: labelFromCode(c.industry, industryLabels),
    size: labelFromCode(c.size, sizeLabels),
    version: String(c.version || ""),
    versionDate: date(c.version_released_at),
    versionUpdatedAt: date(c.setup_at, true),
    updated: date(c.crm_updated_at, true),
    updatedAt: date(c.crm_updated_at, true),
    city: [normalizeCityName(String(c.city || "")), c.state ? String(c.state).toUpperCase() : ""].filter(Boolean).join(" - "),
    uf: String(c.state || ""),
    cep: String(c.postal_code || ""),
    cnpj: formatCnpj(c.document),
    status: c.active ? "Ativo" : "Inativo",
  };
}

export async function listClients(): Promise<ClientRow[]> {
  const rows: DatabaseClient[] = [];
  for (let offset = 0; ; offset += 500) {
    const { data, error } = await supabase.rpc("list_crm_clients", { p_limit: 500, p_offset: offset });
    if (error) throw error;
    rows.push(...((data || []) as DatabaseClient[]));
    if (!data || data.length < 500) break;
  }
  return rows.map(mapDatabaseClient);
}

export async function getClient(acronym: string): Promise<ClientRow | null> {
  const { data, error } = await supabase.rpc("get_crm_client", { client_acronym: acronym });
  if (error) throw error;
  return data?.client ? mapDatabaseClient(data.client) : null;
}

export async function getClientDetail(acronym: string): Promise<ClientDetail | null> {
  const { data, error } = await supabase.rpc("get_crm_client", { client_acronym: acronym });
  if (error) throw error;
  if (!data?.client) return null;

  const contacts = (Array.isArray(data.contacts) ? data.contacts : []).map(
    (contact: Record<string, unknown>): ClientContact => ({
      id: String(contact.id || ""),
      name: String(contact.name || ""),
      department: String(contact.department || ""),
      email: String(contact.email || ""),
      phone: String(contact.phone || ""),
      mobile: String(contact.mobile || ""),
      whatsapp: String(contact.whatsapp || ""),
      active: contact.active !== false,
    }),
  );

  const companies = (Array.isArray(data.companies) ? data.companies : []).map(
    (company: Record<string, unknown>): ClientCompany => ({
      id: String(company.id || ""),
      companyNumber: typeof company.company_number === "number" ? company.company_number : null,
      legalName: String(company.legal_name || ""),
      tradeName: String(company.trade_name || ""),
      document: formatCnpj(company.document),
      stateRegistration: String(company.state_registration || ""),
      cnae: String(company.cnae || ""),
      industry: labelFromCode(company.industry, industryLabels),
      size: labelFromCode(company.size, sizeLabels),
      taxRegime: String(company.tax_regime || ""),
      address: String(company.address || ""),
      city: normalizeCityName(String(company.city || "")),
      state: String(company.state || "").toUpperCase(),
      postalCode: String(company.postal_code || ""),
      responsibleName: String(company.responsible_name || ""),
      responsibleDocument: String(company.responsible_document || ""),
      accountantName: String(company.accountant_name || ""),
      accountantPhone: String(company.accountant_phone || ""),
      accountantEmail: String(company.accountant_email || ""),
    }),
  );

  const users = (Array.isArray(data.users) ? data.users : []).map(
    (user: Record<string, unknown>): ClientHadronUser => ({
      id: String(user.id || ""),
      name: String(user.name || ""),
      email: String(user.email || ""),
      operator: String(user.operator || ""),
      role: String(user.role || ""),
      active: user.active !== false,
      updatedAt: date(user.crm_updated_at || user.crm_created_at, true),
    }),
  );

  const terminals = (Array.isArray(data.terminals) ? data.terminals : []).map(
    (terminal: Record<string, unknown>): ClientTerminal => ({
      id: String(terminal.id || ""),
      companyNumber: typeof terminal.company_number === "number" ? terminal.company_number : null,
      terminalNumber: typeof terminal.terminal_number === "number" ? terminal.terminal_number : null,
      ipAddress: String(terminal.ip_address || ""),
      installPath: String(terminal.install_path || ""),
      version: String(terminal.hadron_version || ""),
      versionDate: date(terminal.version_released_at),
      operatingSystem: String(terminal.operating_system || ""),
      operatingSystemVersion: String(terminal.operating_system_version || ""),
      emitsNfe: typeof terminal.emits_nfe === "boolean" ? terminal.emits_nfe : null,
      notesIssued: Number(terminal.notes_issued || 0),
      memoryUsed: String(terminal.memory_used_mb ?? ""),
      memoryTotal: String(terminal.memory_total_mb ?? ""),
      certificateType: String(terminal.certificate_type || ""),
      certificateExpiresAt: date(terminal.certificate_expires_at),
      environment: String(terminal.environment || ""),
      drives: Array.isArray(terminal.drives) ? terminal.drives : [],
      registeredAt: date(terminal.registered_at, true),
      updatedAt: date(terminal.updated_at, true),
    }),
  );

  const modules = (Array.isArray(data.modules) ? data.modules : []).map(
    (module: Record<string, unknown>): ClientModule => ({
      id: String(module.id || ""),
      name: String(module.name || ""),
      contracted: module.contracted !== false,
      version: String(module.version || ""),
    }),
  );

  const tickets = (Array.isArray(data.tickets) ? data.tickets : []).map(
    (ticket: Record<string, unknown>): ClientTicket => ({
      id: String(ticket.id || ""),
      protocol: String(ticket.protocol || ""),
      subject: String(ticket.subject || ""),
      module: String(ticket.module || ""),
      submodule: String(ticket.submodule || ""),
      operator: String(ticket.operator || ""),
      priority: String(ticket.priority || ""),
      status: String(ticket.status || ""),
      createdAt: date(ticket.created_at, true),
    }),
  );

  const events = (Array.isArray(data.events) ? data.events : []).map(
    (event: Record<string, unknown>): ClientEvent => ({
      id: String(event.id || ""),
      title: String(event.title || ""),
      startsAt: date(event.starts_at, true),
      endsAt: date(event.ends_at, true),
      operator: String(event.operator || ""),
      status: String(event.status || ""),
      ticketProtocol: String(event.ticket_protocol || ""),
    }),
  );

  return {
    client: mapDatabaseClient(data.client),
    contacts,
    companies,
    users,
    terminals,
    modules,
    tickets,
    events,
  };
}
