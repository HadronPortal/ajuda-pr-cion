import * as cheerio from "cheerio";
import pg from "pg";

const CRM_URL = (process.env.CRM_URL || "https://crm.procion.com").replace(/\/$/, "");
const CRM_OPERATOR = process.env.CRM_OPERATOR;
const CRM_PASSWORD = process.env.CRM_PASSWORD;
const DATABASE_URL = process.env.DATABASE_URL;
const concurrency = Number(process.env.IMPORT_CONCURRENCY || 8);
const limit = Number(process.env.IMPORT_LIMIT || 0);

if (!CRM_OPERATOR || !CRM_PASSWORD || !DATABASE_URL) {
  throw new Error("Defina CRM_OPERATOR, CRM_PASSWORD e DATABASE_URL.");
}

const cookies = new Map();
const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
const digits = (value) => normalize(value).replace(/\D/g, "");
const nullable = (value) => normalize(value) || null;

function rememberCookies(response) {
  for (const header of response.headers.getSetCookie?.() || []) {
    const [pair] = header.split(";");
    const separator = pair.indexOf("=");
    cookies.set(pair.slice(0, separator), pair.slice(separator + 1));
  }
}

async function crmFetchOnce(path, options = {}) {
  let url = path.startsWith("http") ? path : `${CRM_URL}/${path.replace(/^\//, "")}`;
  for (let redirects = 0; redirects < 8; redirects += 1) {
    const response = await fetch(url, {
      ...options,
      signal: AbortSignal.timeout(30_000),
      redirect: "manual",
      headers: {
        ...options.headers,
        cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join("; "),
      },
    });
    rememberCookies(response);
    if (![301, 302, 303, 307, 308].includes(response.status)) return response;
    url = new URL(response.headers.get("location"), url).toString();
    options = { method: "GET" };
  }
  throw new Error(`Redirecionamentos demais em ${url}`);
}

async function crmFetch(path, options = {}) {
  let lastError;
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    try {
      return await crmFetchOnce(path, options);
    } catch (error) {
      lastError = error;
      if (attempt < 4) await new Promise((resolve) => setTimeout(resolve, attempt * 750));
    }
  }
  throw new Error(`CRM indisponível após 4 tentativas em ${path}: ${lastError?.message}`);
}

async function login() {
  const loginPage = await crmFetch("auth-usuarios/login");
  const $ = cheerio.load(await loginPage.text());
  const csrf = $('input[name="_csrfToken"]').attr("value");
  const body = new URLSearchParams({
    _method: "POST",
    _csrfToken: csrf,
    aus_operador: CRM_OPERATOR,
    aus_senha: CRM_PASSWORD,
    login_remember: "on",
  });
  const response = await crmFetch("auth-usuarios/login", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  if (response.url.includes("login")) throw new Error("Falha ao autenticar no CRM.");
}

function parseBrazilianDate(value) {
  const match = normalize(value).match(/(\d{2})\/(\d{2})\/(\d{2,4})(?:\s+(\d{2}):(\d{2})(?::(\d{2}))?)?/);
  if (!match) return null;
  const [, day, month, rawYear, hour = "00", minute = "00", second = "00"] = match;
  const year = rawYear.length === 2 ? `20${rawYear}` : rawYear;
  return `${year}-${month}-${day}T${hour}:${minute}:${second}-03:00`;
}

function parseList(html) {
  const $ = cheerio.load(html);
  return $("table tbody tr").map((_, row) => {
    const cells = $(row).find("td");
    const link = $(cells[2]).find('a[href*="tabClientes/view/"]').first();
    const legacyId = link.attr("href")?.match(/view\/(\d+)/)?.[1];
    if (!legacyId) return null;
    const nameLines = $(cells[2]).find("a, span").map((__, el) => normalize($(el).text())).get();
    const location = normalize($(cells[4]).clone().find("br,span").remove().end().text());
    const locationMatch = location.match(/^(.*?)\s+-\s+([A-Z]{2})$/);
    const sectorSize = nameLines[2]?.match(/^(.*?)\s+-\s+Porte:\s*(.*)$/i);
    const versionText = normalize($(cells[3]).text());
    const versionMatch = versionText.match(/Versão:\s*([^()]+)\s*\((\d{2}\/\d{2}\/\d{4})\)/i);
    return {
      legacyId,
      detailPath: link.attr("href"),
      acronym: normalize($(cells[1]).text()),
      tradeName: nameLines[0] || null,
      legalName: nameLines[1] || nameLines[0] || "Sem nome",
      industry: sectorSize?.[1] || null,
      size: sectorSize?.[2] || null,
      version: versionMatch?.[1]?.trim() || null,
      versionReleasedAt: versionMatch ? parseBrazilianDate(versionMatch[2]) : null,
      city: locationMatch?.[1] || null,
      state: locationMatch?.[2] || null,
      postalCode: digits($(cells[4]).find(".cep").text()) || null,
      document: digits($(cells[5]).text()) || null,
      active: /ativo/i.test(normalize($(cells[6]).text())),
      crmCreatedAt: parseBrazilianDate($(cells[0]).text()),
      crmUpdatedAt: parseBrazilianDate($(cells[7]).text()),
    };
  }).get().filter(Boolean);
}

function parseDetail(html, sourceUrl) {
  const $ = cheerio.load(html);
  const tabs = $("#user_profile_tabs_content > li").map((_, tab) => normalize($(tab).text())).get();
  const contacts = [];
  $("#user_profile_tabs_content > li").eq(0).find(".md-list-content").each((_, item) => {
    const value = normalize($(item).find(".md-list-heading").first().text());
    const description = normalize($(item).find(".uk-text-muted").first().text());
    if (!value || (!value.includes("@") && digits(value).length < 8)) return;
    contacts.push({ value, description, type: value.includes("@") ? "email" : "phone" });
  });
  const terminals = [];
  $("#user_profile_tabs_content > li").eq(3).find("tbody tr").each((_, row) => {
    const values = $(row).find("td").map((__, cell) => normalize($(cell).text())).get().filter(Boolean);
    if (values.length < 5) return;
    terminals.push({ raw: values });
  });
  return {
    sourceUrl,
    tabs: {
      client: tabs[0] || "",
      hadron: tabs[1] || "",
      users: tabs[2] || "",
      terminals: tabs[3] || "",
      companies: tabs[4] || "",
    },
    contacts,
    terminals,
  };
}

async function mapConcurrent(items, worker) {
  let cursor = 0;
  const output = new Array(items.length);
  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, async () => {
    while (cursor < items.length) {
      const index = cursor++;
      output[index] = await worker(items[index], index);
    }
  }));
  return output;
}

await login();
const firstPage = await crmFetch("tabClientes");
const firstHtml = await firstPage.text();
const first$ = cheerio.load(firstHtml);
const pages = Math.max(1, ...first$('a[href*="tab-clientes?page="]').map((_, link) => Number(first$(link).attr("href")?.match(/page=(\d+)/)?.[1] || 1)).get());
const remainingPages = Array.from({ length: pages - 1 }, (_, index) => index + 2);
const remainingHtml = await mapConcurrent(remainingPages, async (page, index) => {
  const response = await crmFetch(`tab-clientes?page=${page}`);
  process.stdout.write(`\rListando clientes: ${index + 2}/${pages}`);
  return response.text();
});
const listPages = [firstHtml, ...remainingHtml];
let clients = listPages.flatMap(parseList);
if (limit > 0) clients = clients.slice(0, limit);
console.log(`\n${clients.length} clientes encontrados. Lendo cadastros detalhados...`);

const detailed = await mapConcurrent(clients, async (client, index) => {
  const response = await crmFetch(client.detailPath);
  const detail = parseDetail(await response.text(), response.url);
  process.stdout.write(`\rDetalhes: ${index + 1}/${clients.length}`);
  return { ...client, detail };
});

const pool = new pg.Pool({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 4 });
let importedContacts = 0;
for (let index = 0; index < detailed.length; index += 1) {
  const client = detailed[index];
  const result = await pool.query(`
    insert into public.clients
      (legacy_id, acronym, legal_name, trade_name, document, industry, size, city, state,
       postal_code, active, crm_created_at, crm_updated_at, version, version_released_at, source_payload)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
    on conflict (legacy_id) do update set
      acronym=excluded.acronym, legal_name=excluded.legal_name, trade_name=excluded.trade_name,
      document=excluded.document, industry=excluded.industry, size=excluded.size, city=excluded.city,
      state=excluded.state, postal_code=excluded.postal_code, active=excluded.active,
      crm_created_at=excluded.crm_created_at, crm_updated_at=excluded.crm_updated_at,
      version=excluded.version, version_released_at=excluded.version_released_at,
      source_payload=excluded.source_payload, updated_at=now()
    returning id
  `, [client.legacyId, client.acronym, client.legalName, client.tradeName, client.document,
      client.industry, client.size, client.city, client.state, client.postalCode, client.active,
      client.crmCreatedAt, client.crmUpdatedAt, client.version,
      client.versionReleasedAt?.slice(0, 10) || null, JSON.stringify(client)]);
  const clientId = result.rows[0].id;
  await pool.query(`
    insert into public.client_crm_snapshots
      (client_id, source_url, client_text, hadron_text, users_text, terminals_text, companies_text, payload, imported_at)
    values ($1,$2,$3,$4,$5,$6,$7,$8,now())
    on conflict (client_id) do update set source_url=excluded.source_url, client_text=excluded.client_text,
      hadron_text=excluded.hadron_text, users_text=excluded.users_text,
      terminals_text=excluded.terminals_text, companies_text=excluded.companies_text,
      payload=excluded.payload, imported_at=now()
  `, [clientId, client.detail.sourceUrl, client.detail.tabs.client, client.detail.tabs.hadron,
      client.detail.tabs.users, client.detail.tabs.terminals, client.detail.tabs.companies,
      JSON.stringify(client.detail)]);
  for (const contact of client.detail.contacts) {
    const key = `${contact.type}:${contact.value.toLowerCase()}:${contact.description.toLowerCase()}`;
    await pool.query(`
      insert into public.client_contacts (client_id, legacy_key, name, department, email, phone, source_payload)
      values ($1,$2,$3,$4,$5,$6,$7)
      on conflict (client_id, legacy_key) where legacy_key is not null do update set
        name=excluded.name, department=excluded.department, email=excluded.email,
        phone=excluded.phone, source_payload=excluded.source_payload, updated_at=now()
    `, [clientId, key, contact.description || contact.value, contact.description || null,
        contact.type === "email" ? contact.value : null,
        contact.type === "phone" ? contact.value : null, JSON.stringify(contact)]);
    importedContacts += 1;
  }
  process.stdout.write(`\rImportando: ${index + 1}/${detailed.length}`);
}
await pool.end();
console.log(`\nImportação concluída: ${detailed.length} clientes e ${importedContacts} contatos processados.`);
