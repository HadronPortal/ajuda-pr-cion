import pg from "pg";

const DATABASE_URL = process.env.DATABASE_URL;
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const LIMIT = Math.min(1000, Math.max(1, Number(process.env.LEAD_ENRICH_LIMIT || 100)));
const DRY_RUN = process.argv.includes("--dry-run");
const REFRESH = process.argv.includes("--refresh");
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

function extractEmails(html) {
  const links = [...html.matchAll(/href=["']mailto:([^"'?\s]+)/gi)].map((match) => match[1]);
  const text = html.replace(/&#64;|\[at\]|\(at\)/gi, "@").replace(/<[^>]+>/g, " ");
  const visible = text.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi) || [];
  return [...new Set([...links, ...visible].map((email) => email.trim().toLowerCase()))];
}

const normalizeText = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
const nameTokens = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(/[^a-z0-9]+/).filter((token) => token.length >= 4 && !["ltda", "empresa", "comercio", "servicos"].includes(token));

function placeScore(place, lead) {
  const placeName = normalizeText(place.displayName?.text);
  const placeAddress = normalizeText(place.formattedAddress);
  const tokens = [...new Set([...nameTokens(lead.legal_name), ...nameTokens(lead.trade_name)])];
  const matchedTokens = tokens.filter((token) => placeName.includes(normalizeText(token))).length;
  let score = Math.min(5, matchedTokens * 2);
  if (tokens.length && matchedTokens / tokens.length >= 0.5) score += 2;
  if (placeAddress.includes(normalizeText(lead.city))) score += 2;
  if (lead.postal_code && placeAddress.includes(digits(lead.postal_code))) score += 3;
  const streetToken = nameTokens(lead.address).find((token) => token.length >= 5);
  if (streetToken && placeAddress.includes(normalizeText(streetToken))) score += 1;
  return score;
}

async function findGooglePlace(lead) {
  if (!GOOGLE_PLACES_API_KEY) return null;
  const queryName = lead.trade_name || lead.legal_name;
  const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-goog-api-key": GOOGLE_PLACES_API_KEY,
      "x-goog-fieldmask": [
        "places.id",
        "places.displayName",
        "places.formattedAddress",
        "places.nationalPhoneNumber",
        "places.websiteUri",
        "places.businessStatus",
      ].join(","),
    },
    body: JSON.stringify({
      textQuery: `${queryName}, ${lead.city} - ${lead.state}, Brasil`,
      languageCode: "pt-BR",
      regionCode: "BR",
      pageSize: 5,
    }),
    signal: AbortSignal.timeout(12_000),
  });
  if (!response.ok) throw new Error(`Google Places HTTP ${response.status}.`);
  const payload = await response.json();
  const candidates = (payload.places || [])
    .filter((place) => place.businessStatus !== "CLOSED_PERMANENTLY")
    .map((place) => ({ place, score: placeScore(place, lead) }))
    .sort((left, right) => right.score - left.score);
  return candidates[0]?.score >= 4 ? candidates[0] : null;
}

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

async function enrichWebsite(domain, knownPhones, knownEmails, lead) {
  const foundPhones = new Map();
  const foundEmails = new Map();
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
          if (!knownPhones.has(phone)) foundPhones.set(phone, page.url);
        }
        for (const email of extractEmails(page.html)) {
          if (!knownEmails.has(email)) foundEmails.set(email, page.url);
        }
      } catch {
        // Domínios sem site ou páginas indisponíveis são esperados nesta rotina.
      }
    }
    if (website) break;
  }
  return {
    website,
    phones: [...foundPhones].map(([phone, sourceUrl]) => ({ phone, source: "Site oficial", source_url: sourceUrl, confidence: "alta" })),
    emails: [...foundEmails].map(([email, sourceUrl]) => ({ email, source: "Site oficial", source_url: sourceUrl, confidence: "alta" })),
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
            'enriched_emails', $4::jsonb,
            'google_place_id', $5::text,
            'contact_enriched_at', now()::text,
            'contact_enrichment_method', $6::text
          ), updated_at = now()
        where id = $1`,
      [
        leadId,
        enriched.website,
        JSON.stringify(enriched.phones),
        JSON.stringify(enriched.emails),
        enriched.googlePlaceId || null,
        method,
      ],
    );
  };
  const result = await client.query(
    `select id, cnpj, legal_name, trade_name, city, state, postal_code, address,
            raw_payload->>'email' email, raw_payload->>'phone' phone, phone_secondary
       from public.company_leads
      where ($2::boolean or coalesce((raw_payload->>'contact_enriched_at')::timestamptz, '-infinity') < now() - interval '30 days')
      order by case
        when stage in ('negociacao', 'proposta', 'demonstracao') then 0
        when stage in ('relacionamento', 'prospeccao') then 1
        else 2
      end,
               relevance_score desc, opened_at desc nulls last
      limit $1`,
    [LIMIT, REFRESH],
  );
  let websites = 0;
  let phones = 0;
  let emails = 0;
  let places = 0;
  for (const lead of result.rows) {
    let placeMatch = null;
    try {
      placeMatch = await findGooglePlace(lead);
    } catch (error) {
      console.warn(`${lead.cnpj}: ${error instanceof Error ? error.message : error}`);
    }
    const knownPhones = new Set([normalizePhone(lead.phone), normalizePhone(lead.phone_secondary)].filter(Boolean));
    const knownEmails = new Set([String(lead.email || "").trim().toLowerCase()].filter(Boolean));
    const googlePhone = normalizePhone(placeMatch?.place.nationalPhoneNumber);
    const googlePhones = googlePhone && !knownPhones.has(googlePhone)
      ? [{ phone: googlePhone, source: "Google Places", source_url: `https://www.google.com/maps/search/?api=1&query_place_id=${placeMatch.place.id}`, confidence: "média" }]
      : [];
    const websiteUrl = placeMatch?.place.websiteUri || null;
    const websiteDomain = websiteUrl
      ? new URL(websiteUrl).hostname.replace(/^www\./, "")
      : domainFromEmail(lead.email);
    const website = websiteDomain
      ? await enrichWebsite(websiteDomain, new Set([...knownPhones, ...googlePhones.map((item) => item.phone)]), knownEmails, lead)
      : { website: null, phones: [], emails: [] };
    const enriched = {
      website: websiteUrl || website.website,
      phones: [...googlePhones, ...website.phones],
      emails: website.emails,
      googlePlaceId: placeMatch?.place.id || null,
    };
    await saveResult(lead.id, enriched, placeMatch ? "google-places-and-official-site" : "corporate-email-domain");
    places += placeMatch ? 1 : 0;
    websites += enriched.website ? 1 : 0;
    phones += enriched.phones.length;
    emails += enriched.emails.length;
  }
  console.log(`${result.rows.length} lead(s) verificado(s): ${places} local(is), ${websites} site(s), ${phones} telefone(s) e ${emails} e-mail(s) adicional(is).`);
} finally {
  await client.end();
}
