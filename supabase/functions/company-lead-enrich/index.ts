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
const googleKey = Deno.env.get("GOOGLE_PLACES_API_KEY");
const genericDomains = new Set([
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.com.br", "icloud.com",
  "live.com", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "globo.com",
]);
const contactPaths = ["/", "/contato", "/fale-conosco", "/contact"];
const digits = (value: unknown) => String(value ?? "").replace(/\D/g, "");
const normalize = (value: unknown) =>
  String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const tokens = (value: unknown) =>
  String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !["ltda", "empresa", "comercio", "servicos"].includes(token));
const normalizePhone = (value: unknown) => {
  let phone = digits(value);
  if (phone.startsWith("55") && phone.length > 11) phone = phone.slice(2);
  return phone.length === 10 || phone.length === 11 ? phone : null;
};
const domainFromEmail = (email: unknown) => {
  const domain = String(email ?? "").trim().toLowerCase().split("@")[1]?.replace(/^www\./, "");
  return domain && !genericDomains.has(domain) && domain.includes(".") ? domain : null;
};
const extractPhones = (html: string) => {
  const links = [...html.matchAll(/(?:href=["'](?:tel:|https?:\/\/(?:api\.)?whatsapp\.com\/send\?phone=|https?:\/\/wa\.me\/))([^"'&?\s]+)/gi)].map((match) => match[1]);
  const visible = html.replace(/&nbsp;/gi, " ").replace(/<[^>]+>/g, " ")
    .match(/(?:\+?55\s*)?\(\d{2}\)\s*9?\d{4}[\s.-]*\d{4}/g) || [];
  return [...new Set([...links, ...visible].map(normalizePhone).filter(Boolean))] as string[];
};
const extractEmails = (html: string) => {
  const links = [...html.matchAll(/href=["']mailto:([^"'?\s]+)/gi)].map((match) => match[1]);
  const visible = html.replace(/&#64;|\[at\]|\(at\)/gi, "@").replace(/<[^>]+>/g, " ")
    .match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [];
  return [...new Set([...links, ...visible].map((email) => email.trim().toLowerCase()))];
};

function placeScore(place: Record<string, any>, lead: Record<string, any>) {
  const placeName = normalize(place.displayName?.text);
  const placeAddress = normalize(place.formattedAddress);
  const companyTokens = [...new Set([...tokens(lead.legal_name), ...tokens(lead.trade_name)])];
  const matches = companyTokens.filter((token) => placeName.includes(normalize(token))).length;
  let score = Math.min(5, matches * 2);
  if (companyTokens.length && matches / companyTokens.length >= 0.5) score += 2;
  if (placeAddress.includes(normalize(lead.city))) score += 2;
  if (lead.postal_code && placeAddress.includes(digits(lead.postal_code))) score += 3;
  const street = tokens(lead.address).find((token) => token.length >= 5);
  if (street && placeAddress.includes(normalize(street))) score += 1;
  return score;
}

async function findPlace(lead: Record<string, any>) {
  if (!googleKey) throw new Error("GOOGLE_PLACES_API_KEY não configurada no servidor.");
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": googleKey,
      "x-goog-fieldmask": "places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri,places.businessStatus",
    },
    body: JSON.stringify({
      textQuery: `${lead.trade_name || lead.legal_name}, ${lead.city} - ${lead.state}, Brasil`,
      languageCode: "pt-BR", regionCode: "BR", pageSize: 5,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error?.message || `Google Places HTTP ${response.status}.`);
  const candidates = (payload.places || []).filter((place: Record<string, any>) => place.businessStatus !== "CLOSED_PERMANENTLY")
    .map((place: Record<string, any>) => ({ place, score: placeScore(place, lead) }))
    .sort((a: { score: number }, b: { score: number }) => b.score - a.score);
  return candidates[0]?.score >= 4 ? candidates[0].place : null;
}

function safeDomain(url: string | null, email: string | null) {
  try {
    const parsed = url ? new URL(url) : null;
    const host = parsed?.hostname.replace(/^www\./, "") || domainFromEmail(email);
    if (!host || host === "localhost" || /^\d/.test(host) || host.endsWith(".local")) return null;
    return host;
  } catch {
    return null;
  }
}

async function scrapeSite(domain: string | null, lead: Record<string, any>, knownPhones: Set<string>, knownEmails: Set<string>) {
  if (!domain) return { website: null, phones: [], emails: [] };
  const phones = new Map<string, string>();
  const emails = new Map<string, string>();
  let website: string | null = null;
  for (const protocol of ["https", "http"]) {
    for (const path of contactPaths) {
      try {
        const response = await fetch(`${protocol}://${domain}${path}`, {
          redirect: "follow",
          headers: { "user-agent": "ProcionCRM-LeadContactEnrichment/1.0" },
          signal: AbortSignal.timeout(8_000),
        });
        if (!response.ok || !(response.headers.get("content-type") || "").includes("text/html")) continue;
        const html = await response.text();
        const trusted = normalize(domain).includes(tokens(lead.trade_name || lead.legal_name)[0] || "-") || digits(html).includes(digits(lead.cnpj));
        if (!trusted) continue;
        website ||= new URL(response.url).origin;
        for (const phone of extractPhones(html)) if (!knownPhones.has(phone)) phones.set(phone, response.url);
        for (const email of extractEmails(html)) if (!knownEmails.has(email)) emails.set(email, response.url);
      } catch {
        // Sites indisponíveis são esperados durante o enriquecimento.
      }
    }
    if (website) break;
  }
  return {
    website,
    phones: [...phones].map(([phone, source_url]) => ({ phone, source: "Site oficial", source_url, confidence: "alta" })),
    emails: [...emails].map(([email, source_url]) => ({ email, source: "Site oficial", source_url, confidence: "alta" })),
  };
}

serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (request.method !== "POST") return json({ error: "Método não permitido." }, 405);
  try {
    const { leadId } = await request.json();
    if (!/^[0-9a-f-]{36}$/i.test(String(leadId || ""))) return json({ error: "Empresa inválida." }, 400);
    const { data: lead, error } = await admin.from("company_leads").select("*").eq("id", leadId).single();
    if (error || !lead) return json({ error: "Empresa não encontrada." }, 404);
    const enrichedAt = Date.parse(lead.raw_payload?.contact_enriched_at || "");
    const cached = Number.isFinite(enrichedAt) && Date.now() - enrichedAt < 86_400_000;
    if (!cached) {
      const place = await findPlace(lead);
      const knownPhones = new Set([normalizePhone(lead.raw_payload?.phone), normalizePhone(lead.phone_secondary)].filter(Boolean) as string[]);
      const knownEmails = new Set([String(lead.raw_payload?.email || "").trim().toLowerCase()].filter(Boolean));
      const googlePhone = normalizePhone(place?.nationalPhoneNumber);
      const googlePhones = googlePhone && !knownPhones.has(googlePhone)
        ? [{ phone: googlePhone, source: "Google Places", source_url: `https://www.google.com/maps/search/?api=1&query_place_id=${place.id}`, confidence: "média" }]
        : [];
      const site = await scrapeSite(safeDomain(place?.websiteUri || null, lead.raw_payload?.email || null), lead, new Set([...knownPhones, ...googlePhones.map((item) => item.phone)]), knownEmails);
      const payload = {
        ...lead.raw_payload,
        website: place?.websiteUri || site.website,
        enriched_phones: [...googlePhones, ...site.phones],
        enriched_emails: site.emails,
        google_place_id: place?.id || null,
        contact_enriched_at: new Date().toISOString(),
        contact_enrichment_method: "google-places-and-official-site",
      };
      const { error: updateError } = await admin.from("company_leads").update({ raw_payload: payload, updated_at: new Date().toISOString() }).eq("id", leadId);
      if (updateError) throw updateError;
    }
    const { data: details, error: detailsError } = await admin.rpc("company_lead_details", { p_id: leadId });
    if (detailsError) throw detailsError;
    return json({
      lead: details,
      cached,
      statistics: {
        phones: details?.additional_phones?.length || 0,
        emails: details?.additional_emails?.length || 0,
        website: Boolean(details?.website),
      },
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
    return json({ error: error instanceof Error ? error.message : "Falha ao buscar contatos." }, 500);
  }
});
