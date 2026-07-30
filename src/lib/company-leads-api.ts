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
  city: string;
  state: string;
  relevance_score: number;
  stage: CompanyLeadStage;
  source: string;
  source_url: string | null;
  discovered_at: string;
};

export type CompanyLeadFilters = {
  city: string;
  state: string;
  openedWithinDays: number;
  cnae: string;
  companySize: string;
  limit?: number;
  offset?: number;
};

type LeadsResponse = {
  leads: CompanyLead[];
  collected: number;
  providerConfigured: boolean;
  source: string;
  total: number;
};

function openedAfter(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
}

async function listFromDatabase(filters: CompanyLeadFilters): Promise<LeadsResponse> {
  const parameters = {
    p_city: filters.city || null,
    p_state: filters.state || null,
    p_opened_after: filters.openedWithinDays ? openedAfter(filters.openedWithinDays) : null,
    p_cnae: filters.cnae || null,
    p_company_size: filters.companySize || null,
  };
  const [listResult, countResult] = await Promise.all([
    supabase.rpc("company_leads_list", {
      ...parameters,
      p_limit: filters.limit || 50,
      p_offset: filters.offset || 0,
    }),
    supabase.rpc("company_leads_count", parameters),
  ]);
  if (listResult.error) throw listResult.error;
  if (countResult.error) throw countResult.error;
  return {
    leads: (listResult.data || []) as CompanyLead[],
    collected: 0,
    providerConfigured: false,
    source: "Dados públicos do CNPJ/Receita Federal",
    total: Number(countResult.data || 0),
  };
}

export const companyLeadsApi = {
  list: listFromDatabase,

  async updateStage(id: string, stage: CompanyLeadStage) {
    const { error } = await supabase.rpc("company_leads_update_stage", {
      p_id: id,
      p_stage: stage,
    });
    if (error) throw error;
    return { success: true };
  },
};
