import { supabase } from "@/lib/supabase";

export type CompanyLeadStage = "novo" | "em_analise" | "qualificado" | "descartado" | "convertido";

export type CompanyLead = {
  id: string;
  cnpj: string;
  legal_name: string;
  trade_name: string | null;
  opened_at: string | null;
  registration_status: string;
  cnae_code: string | null;
  cnae_description: string | null;
  company_size: string | null;
  legal_nature: string | null;
  city: string;
  state: string;
  address: string | null;
  neighborhood: string | null;
  postal_code: string | null;
  phone: string | null;
  email: string | null;
  mei: boolean;
  simples: boolean;
  relevance_score: number;
  stage: CompanyLeadStage;
  source: string;
  source_url: string | null;
  discovered_at: string;
};

export type CompanyLeadPartner = {
  id: string;
  name: string;
  type: string;
  qualification: string | null;
  joined_at: string | null;
  country: string | null;
};

export type CompanyLeadDetails = CompanyLead & {
  company_root: string | null;
  branch_type: string | null;
  secondary_cnaes: string[];
  phone_secondary: string | null;
  fax: string | null;
  capital_social: number | null;
  responsible_qualification: string | null;
  special_status: string | null;
  special_status_at: string | null;
  simple_opted_at: string | null;
  simple_excluded_at: string | null;
  mei_opted_at: string | null;
  mei_excluded_at: string | null;
  partners: CompanyLeadPartner[];
};

export type CompanyLeadSort =
  | "company"
  | "cnpj"
  | "opened_at"
  | "registration_status"
  | "city"
  | "cnae"
  | "company_size"
  | "phone"
  | "score"
  | "stage";

export type CompanyLeadFilters = {
  city: string;
  state: string;
  openedWithinDays: number;
  cnae: string;
  cnaeDescription?: string;
  companyName?: string;
  companySize: string;
  registrationStatus?: string;
  stage?: string;
  minScore?: string;
  openedFrom?: string;
  openedTo?: string;
  hasPhone?: boolean;
  hasEmail?: boolean;
  onlyMei?: boolean;
  onlySimples?: boolean;
};

export type CompanyLeadsQuery = {
  filters: CompanyLeadFilters;
  sort: CompanyLeadSort;
  direction: "asc" | "desc";
  limit: number;
  offset: number;
};

type LeadsResponse = {
  leads: CompanyLead[];
  total: number;
  source: string;
};

function daysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

function buildFilterPayload(filters: CompanyLeadFilters) {
  const openedFrom =
    filters.openedFrom?.trim() ||
    (filters.openedWithinDays ? daysAgo(filters.openedWithinDays) : "");

  return {
    city: filters.city.trim(),
    state: filters.state.trim().toUpperCase(),
    openedFrom: openedFrom || null,
    openedTo: filters.openedTo?.trim() || null,
    cnae: filters.cnae?.trim() || null,
    cnaeDescription: filters.cnaeDescription?.trim() || null,
    companyName: filters.companyName?.trim() || null,
    companySize: filters.companySize?.trim() || null,
    registrationStatus: filters.registrationStatus?.trim() || null,
    stage: filters.stage?.trim() || null,
    minScore: filters.minScore?.toString().trim() || null,
    hasPhone: Boolean(filters.hasPhone),
    hasEmail: Boolean(filters.hasEmail),
    onlyMei: Boolean(filters.onlyMei),
    onlySimples: Boolean(filters.onlySimples),
  };
}

export const companyLeadsApi = {
  async list(query: CompanyLeadsQuery): Promise<LeadsResponse> {
    const { data, error } = await supabase.rpc("company_leads_search", {
      p_filters: buildFilterPayload(query.filters),
      p_sort: query.sort,
      p_direction: query.direction,
      p_limit: query.limit,
      p_offset: query.offset,
    });
    if (error) throw error;
    const payload = (data || {}) as { rows?: CompanyLead[]; total?: number };
    return {
      leads: payload.rows || [],
      total: Number(payload.total || 0),
      source: "Dados públicos do CNPJ/Receita Federal",
    };
  },

  async details(id: string): Promise<CompanyLeadDetails> {
    const { data, error } = await supabase.rpc("company_lead_details", { p_id: id });
    if (error) throw error;
    if (!data) throw new Error("Lead não encontrado.");
    return data as CompanyLeadDetails;
  },

  async updateStage(id: string, stage: CompanyLeadStage) {
    const { error } = await supabase.rpc("company_leads_update_stage", {
      p_id: id,
      p_stage: stage,
    });
    if (error) throw error;
    return { success: true };
  },
};
