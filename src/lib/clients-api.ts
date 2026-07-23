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

export type ClientDetail = {
  client: ClientRow;
  contacts: ClientContact[];
  companies: ClientCompany[];
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

  return { client: mapDatabaseClient(data.client), contacts, companies };
}
