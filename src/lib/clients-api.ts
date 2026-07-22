import { supabase } from "@/lib/supabase";
import type { ClientRow } from "@/routes/clientes.index";

type DatabaseClient = Record<string, string | boolean | null>;

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
    city: [c.city, c.state].filter(Boolean).join(" - "),
    uf: String(c.state || ""),
    cep: String(c.postal_code || ""),
    cnpj: String(c.document || ""),
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
