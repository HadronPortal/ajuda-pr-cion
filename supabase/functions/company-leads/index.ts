import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...corsHeaders },
  });

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

type LeadFilters = {
  city?: string;
  state?: string;
  openedWithinDays?: number;
  cnae?: string;
  companySize?: string;
  limit?: number;
};

type LeadRow = {
  cnpj: string;
  legal_name: string;
  trade_name: string | null;
  opened_at: string | null;
  registration_status: string;
  status_updated_at: string | null;
  cnae_code: string | null;
  cnae_description: string | null;
  company_size: string | null;
  legal_nature: string | null;
  city: string;
  state: string;
  postal_code: string | null;
  neighborhood: string | null;
  address: string | null;
  source: string;
  source_url: string | null;
  relevance_score: number;
  last_seen_at: string;
  raw_payload: Record<string, unknown>;
};

const normalizeText = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toUpperCase();

const digits = (value: unknown) => String(value ?? "").replace(/\D+/g, "");

const text = (value: unknown) => {
  const result = String(value ?? "").trim();
  return result || null;
};

const first = (record: Record<string, unknown>, names: string[]) => {
  for (const name of names) {
    if (record[name] !== undefined && record[name] !== null && record[name] !== "") {
      return record[name];
    }
  }
  return null;
};

const toIsoDate = (value: unknown) => {
  if (!value) return null;
  const raw = String(value).trim();
  const brazilian = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  const normalized = brazilian
    ? `${brazilian[3]}-${brazilian[2]}-${brazilian[1]}`
    : raw.slice(0, 10);
  const parsed = new Date(`${normalized}T12:00:00Z`);
  return Number.isNaN(parsed.getTime()) ? null : normalized;
};

function scoreLead(lead: Omit<LeadRow, "relevance_score" | "last_seen_at">) {
  let score = normalizeText(lead.registration_status).includes("ATIV") ? 4 : 0;
  if (lead.opened_at) {
    const age = Math.max(
      0,
      Math.floor((Date.now() - new Date(`${lead.opened_at}T12:00:00Z`).getTime()) / 86400000),
    );
    if (age <= 30) score += 5;
    else if (age <= 90) score += 4;
    else if (age <= 180) score += 3;
    else if (age <= 365) score += 1;
  }
  if (lead.cnae_code) score += 2;
  if (lead.trade_name) score += 1;
  if (/ME|MICRO|EPP|PEQUENO/.test(normalizeText(lead.company_size))) score += 2;
  return score;
}

function normalizeProviderLead(value: unknown): LeadRow | null {
  if (!value || typeof value !== "object") return null;
  const source = value as Record<string, unknown>;
  const establishment =
    source.estabelecimento && typeof source.estabelecimento === "object"
      ? (source.estabelecimento as Record<string, unknown>)
      : source;
  const addressSource =
    source.endereco && typeof source.endereco === "object"
      ? (source.endereco as Record<string, unknown>)
      : establishment;

  const cnpj = digits(first(source, ["cnpj", "numero_cnpj", "documento"]));
  const city = text(first(addressSource, ["cidade", "municipio", "nome_cidade"]));
  const state = text(first(addressSource, ["uf", "estado", "sigla_uf"]));
  const legalName = text(first(source, ["razao_social", "razaoSocial", "nome_empresarial"]));
  if (cnpj.length !== 14 || !city || !state || !legalName) return null;

  const base = {
    cnpj,
    legal_name: legalName,
    trade_name: text(first(source, ["nome_fantasia", "nomeFantasia", "fantasia"])),
    opened_at: toIsoDate(
      first(source, ["data_abertura", "data_inicio_atividade", "dataInicioAtividades"]),
    ),
    registration_status:
      text(first(source, ["situacao_cadastral", "situacaoCadastral", "situacao"])) ?? "ATIVA",
    status_updated_at: toIsoDate(
      first(source, ["data_situacao_cadastral", "dataSituacaoCadastral"]),
    ),
    cnae_code: text(first(source, ["cnae_fiscal", "cnae_principal", "cnae"])),
    cnae_description: text(
      first(source, ["cnae_fiscal_descricao", "descricao_cnae", "atividade_principal"]),
    ),
    company_size: text(first(source, ["porte", "porte_empresa", "company_size"])),
    legal_nature: text(first(source, ["natureza_juridica", "naturezaJuridica"])),
    city,
    state: state.toUpperCase(),
    postal_code: text(first(addressSource, ["cep", "codigo_postal"])),
    neighborhood: text(first(addressSource, ["bairro"])),
    address: [
      text(first(addressSource, ["logradouro", "endereco"])),
      text(first(addressSource, ["numero"])),
      text(first(addressSource, ["complemento"])),
    ]
      .filter(Boolean)
      .join(", ") || null,
    source: "receita-federal-via-provedor",
    source_url: `https://www.gov.br/pt-br/servicos/consultar-cadastro-nacional-de-pessoas-juridicas`,
    raw_payload: source,
  };

  return {
    ...base,
    relevance_score: scoreLead(base),
    last_seen_at: new Date().toISOString(),
  };
}

function buildProviderBody(filters: LeadFilters) {
  const openedAfter = filters.openedWithinDays
    ? new Date(Date.now() - filters.openedWithinDays * 86400000)
        .toISOString()
        .slice(0, 10)
    : undefined;

  return {
    uf: normalizeText(filters.state),
    municipio: filters.city?.trim(),
    situacao_cadastral: "ATIVA",
    data_abertura_inicio: openedAfter,
    cnae: digits(filters.cnae),
    porte: filters.companySize || undefined,
    limit: Math.min(Math.max(filters.limit || 50, 1), 100),
  };
}

async function fetchProvider(filters: LeadFilters) {
  const apiKey = Deno.env.get("LEADS_API_KEY");
  const apiUrl =
    Deno.env.get("LEADS_API_URL") || "https://api.apicnpjs.com.br/v1/cnpj/search";
  if (!apiKey) return { rows: [] as LeadRow[], configured: false };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`,
      "x-api-key": apiKey,
    },
    body: JSON.stringify(buildProviderBody(filters)),
  });
  if (!response.ok) {
    throw new Error(`O provedor de CNPJ respondeu com HTTP ${response.status}.`);
  }

  const payload = await response.json();
  const candidates = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.results || payload?.empresas || payload?.items || [];
  return {
    rows: (Array.isArray(candidates) ? candidates : [])
      .map(normalizeProviderLead)
      .filter((lead): lead is LeadRow => Boolean(lead)),
    configured: true,
  };
}

async function existingClientCnpjs() {
  const { data, error } = await admin
    .from("client_companies")
    .select("document")
    .not("document", "is", null);
  if (error) throw error;
  return new Set((data || []).map((row) => digits(row.document)).filter(Boolean));
}

async function listLeads(filters: LeadFilters) {
  let query = admin
    .from("company_leads")
    .select("*")
    .order("relevance_score", { ascending: false })
    .order("opened_at", { ascending: false })
    .limit(Math.min(Math.max(filters.limit || 50, 1), 100));

  if (filters.state) query = query.eq("state", normalizeText(filters.state));
  if (filters.city) query = query.ilike("city", `%${filters.city.trim()}%`);
  if (filters.cnae) query = query.like("cnae_code", `${digits(filters.cnae)}%`);
  if (filters.companySize) query = query.ilike("company_size", `%${filters.companySize}%`);
  if (filters.openedWithinDays) {
    const threshold = new Date(Date.now() - filters.openedWithinDays * 86400000)
      .toISOString()
      .slice(0, 10);
    query = query.gte("opened_at", threshold);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

serve(async (request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Método não permitido." }, 405);

  try {
    const body = await request.json().catch(() => ({}));
    const action = String(body.action || "list");
    const filters = (body.filters || {}) as LeadFilters;

    if (action === "update-stage") {
      const { error } = await admin
        .from("company_leads")
        .update({ stage: body.stage, updated_at: new Date().toISOString() })
        .eq("id", body.id);
      if (error) throw error;
      return json({ success: true });
    }

    let collected = 0;
    let providerConfigured = Boolean(Deno.env.get("LEADS_API_KEY"));
    if (action === "search") {
      if (!filters.city?.trim() || !filters.state?.trim()) {
        return json({ error: "Informe cidade e UF para pesquisar novos leads." }, 400);
      }
      const provider = await fetchProvider(filters);
      providerConfigured = provider.configured;
      const clientCnpjs = await existingClientCnpjs();
      const candidates = provider.rows.filter(
        (lead) =>
          !clientCnpjs.has(lead.cnpj) &&
          normalizeText(lead.registration_status).includes("ATIV"),
      );
      if (candidates.length) {
        const { error } = await admin.from("company_leads").upsert(candidates, {
          onConflict: "cnpj",
          ignoreDuplicates: false,
        });
        if (error) throw error;
      }
      collected = candidates.length;
    }

    const leads = await listLeads(filters);
    return json({
      leads,
      collected,
      providerConfigured,
      source: "Dados públicos do CNPJ/Receita Federal",
    });
  } catch (error) {
    console.error("[company-leads]", error);
    return json(
      { error: error instanceof Error ? error.message : "Não foi possível consultar os leads." },
      500,
    );
  }
});

