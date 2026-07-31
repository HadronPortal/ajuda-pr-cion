import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
const LIMIT = Math.min(1000, Math.max(1, Number(process.env.LEAD_ENRICH_LIMIT || 100)));
const DRY_RUN = process.argv.includes("--dry-run");
const GENERIC_DOMAINS = new Set([
  "gmail.com", "hotmail.com", "outlook.com", "yahoo.com", "yahoo.com.br", "icloud.com",
  "live.com", "uol.com.br", "bol.com.br", "terra.com.br", "ig.com.br", "globo.com",
]);
const CONTACT_PATHS = ["/", "/contato", "/fale-conosco", "/contact"];

if (!DATABASE_URL) throw new Error("Defina DATABASE_URL.");

const digits = (value) => String(value ?? "").replace(/\D/g, "");
const normalizePhone = (value) => {
  let phone = digits(value);
  if (phone.startsWith("55") && phone.length > 11) phone = phone.slice(2);
  return phone.length === 10 || phone.length === 11 ? phone : null;
};

function domainFromEmail(email) {
  const domain = String(email ?? "").trim().toLowerCase().split("@")[1]?.replace(/^www\./, "");
  return domain && !GENERIC_DOMAINS.has(domain) && domain.includes(".") ? domain : null;
}

function extractPhones(html) {
  const links = [...html.matchAll(/(?:href=["'](?:tel:|https?:\/\/(?:api\.)?whatsapp\.com\/send\?phone=|https?:\/\/wa\.me\/))([^"'&?\s]+)/gi)].map((match) => match[1]);
  const text = html.replace(/&nbsp;/gi, " ").replace(/<[^>]+>/g, " ");
  const visible = text.match(/(?:\+?55\s*)?\(\d{2}\)\s*9?\d{4}[\s.-]*\d{4}/g) || [];
  const matches = [...links, ...visible];
  return [...new Set(matches.map(normalizePhone).filter(Boolean))];
}

const normalizeText = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const nameTokens = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !["ltda", "empresa", "comercio", "servicos"].includes(token));

function domainMatchesCompany(domain, lead) {
  const compactDomain = normalizeText(domain.split(".")[0]);
  return [...nameTokens(lead.legal_name), ...nameTokens(lead.trade_name)].some((token) => compactDomain.includes(token));
}

async function fetchPage(url) {
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "user-agent": "ProcionCRM-LeadContactEnrichment/1.0" },
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) return null;
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return null;
  return { html: await response.text(), url: response.url };
}

async function enrich(domain, knownPhones, lead) {
  const found = new Map();
  let website = null;
  for (const protocol of ["https", "http"]) {
    for (const path of CONTACT_PATHS) {
      try {
        const page = await fetchPage(`${protocol}://${domain}${path}`);
        if (!page) continue;
        const pageDigits = digits(page.html);
        const trusted = domainMatchesCompany(domain, lead) || pageDigits.includes(digits(lead.cnpj));
        if (!trusted) continue;
        website ||= new URL(page.url).origin;
        for (const phone of extractPhones(page.html)) {
          if (!knownPhones.has(phone)) found.set(phone, page.url);
        }
      } catch {
        // Domínios sem site ou páginas indisponíveis são esperados nesta rotina.
      }
    }
    if (website) break;
  }
  return {
    website,
    phones: [...found].map(([phone, sourceUrl]) => ({ phone, source: "Site da empresa", source_url: sourceUrl })),
  };
}

const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  const saveResult = async (leadId, enriched, method = "corporate-email-domain") => {
    if (DRY_RUN) return;
    await client.query(
      `update public.company_leads
          set raw_payload = raw_payload || jsonb_build_object(
            'website', $2::text,
            'enriched_phones', $3::jsonb,
            'contact_enriched_at', now()::text,
            'contact_enrichment_method', $4::text
          ), updated_at = now()
        where id = $1`,
      [leadId, enriched.website, JSON.stringify(enriched.phones), method],
    );
  };
  const result = await client.query(
    `select id, cnpj, legal_name, trade_name, raw_payload->>'email' email,
            raw_payload->>'phone' phone, phone_secondary
       from public.company_leads
      where coalesce(raw_payload->>'email', '') like '%@%'
        and coalesce(raw_payload->>'contact_enriched_at', '') = ''
      order by case stage when 'qualificado' then 0 when 'em_analise' then 1 else 2 end,
               relevance_score desc, opened_at desc nulls last
      limit $1`,
    [LIMIT],
  );
  let websites = 0;
  let phones = 0;
  for (const lead of result.rows) {
    const domain = domainFromEmail(lead.email);
    if (!domain) {
      await saveResult(lead.id, { website: null, phones: [] }, "generic-email-domain-skipped");
      continue;
    }
    const known = new Set([normalizePhone(lead.phone), normalizePhone(lead.phone_secondary)].filter(Boolean));
    const enriched = await enrich(domain, known, lead);
    await saveResult(lead.id, enriched);
    if (!enriched.website && !enriched.phones.length) continue;
    websites += enriched.website ? 1 : 0;
    phones += enriched.phones.length;
  }
  console.log(`${result.rows.length} lead(s) verificado(s), ${websites} site(s) e ${phones} telefone(s) adicional(is) encontrados.`);
} finally {
  await client.end();
}
