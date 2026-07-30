import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import pg from "pg";
import unzipper from "unzipper";
import { TARGET_CITY_NAMES, TARGET_CITIES, normalizeCity } from "./company-leads-cities.mjs";

const DATABASE_URL = process.env.DATABASE_URL;
const SOURCE_DIR = process.env.CNPJ_SOURCE_DIR ? path.resolve(process.env.CNPJ_SOURCE_DIR) : null;
const BASE_URL = (
  process.env.CNPJ_BASE_URL || "https://dados-abertos-rf-cnpj.casadosdados.com.br/arquivos"
).replace(/\/$/, "");
let competence = process.env.CNPJ_COMPETENCE || "";
const CACHE_DIR = path.resolve(process.env.CNPJ_CACHE_DIR || ".cache/cnpj");
const BATCH_SIZE = Math.max(100, Number(process.env.CNPJ_IMPORT_BATCH || 1000));
const DRY_RUN = process.argv.includes("--dry-run");

if (!DATABASE_URL && !DRY_RUN) {
  throw new Error("Defina DATABASE_URL ou execute com --dry-run.");
}
const normalize = (value) => String(value ?? "").trim();
const nullable = (value) => normalize(value) || null;
const digits = (value) => normalize(value).replace(/\D/g, "");
const isoDate = (value) => {
  const raw = digits(value);
  if (!/^\d{8}$/.test(raw) || raw === "00000000") return null;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
};

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"') {
      if (quoted && line[index + 1] === '"') {
        value += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === ";" && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += character;
    }
  }
  values.push(value);
  return values;
}

async function listZipFiles(directory) {
  const entries = await fs.promises.readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) => {
      const absolute = path.join(directory, entry.name);
      return entry.isDirectory() ? listZipFiles(absolute) : [absolute];
    }),
  );
  return nested.flat().filter((file) => file.toLowerCase().endsWith(".zip"));
}

async function download(url, destination) {
  if (fs.existsSync(destination)) return destination;
  await fs.promises.mkdir(path.dirname(destination), { recursive: true });
  const partial = `${destination}.part`;
  const downloadedBytes = fs.existsSync(partial) ? fs.statSync(partial).size : 0;
  const response = await fetch(url, {
    headers: downloadedBytes ? { range: `bytes=${downloadedBytes}-` } : undefined,
    signal: AbortSignal.timeout(7_200_000),
  });
  if (response.status === 416 && downloadedBytes) {
    await fs.promises.rename(partial, destination);
    return destination;
  }
  if (!response.ok || !response.body) {
    throw new Error(`Falha ao baixar ${url}: HTTP ${response.status}.`);
  }
  const canResume = downloadedBytes > 0 && response.status === 206;
  await pipeline(
    Readable.fromWeb(response.body),
    fs.createWriteStream(partial, { flags: canResume ? "a" : "w" }),
  );
  await fs.promises.rename(partial, destination);
  return destination;
}

async function remoteFiles() {
  if (!competence) {
    const rootResponse = await fetch(`${BASE_URL}/`, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!rootResponse.ok) {
      throw new Error(`Não foi possível consultar as competências: HTTP ${rootResponse.status}.`);
    }
    const rootHtml = await rootResponse.text();
    const available = [...rootHtml.matchAll(/href=["'](\d{4}-\d{2}-\d{2})\/?["']/gi)]
      .map((match) => match[1])
      .sort();
    competence = available.at(-1) || "";
    if (!competence) throw new Error("Nenhuma competência foi encontrada no repositório.");
  }

  const directoryUrl = `${BASE_URL}/${competence}/`;
  const response = await fetch(directoryUrl, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) {
    throw new Error(`A competência ${competence} não está acessível: HTTP ${response.status}.`);
  }
  const html = await response.text();
  const names = [...html.matchAll(/href=["']([^"']+\.zip)["']/gi)]
    .map((match) => decodeURIComponent(match[1].split("/").pop()))
    .filter(Boolean);
  if (!names.length) throw new Error(`Nenhum ZIP encontrado em ${directoryUrl}.`);
  const wanted = names.filter((name) =>
    /(Estabelecimentos|Empresas|Municipios|Cnaes|Naturezas|Simples)/i.test(name),
  );
  const downloaded = [];
  for (const [index, name] of wanted.entries()) {
    console.log(`Baixando arquivo ${index + 1}/${wanted.length}: ${name}`);
    downloaded.push(
      await download(
        new URL(name, directoryUrl).toString(),
        path.join(CACHE_DIR, competence, name),
      ),
    );
  }
  return downloaded;
}

async function sourceFiles() {
  const files = SOURCE_DIR ? await listZipFiles(SOURCE_DIR) : await remoteFiles();
  const grouped = {
    establishments: files.filter((file) => /Estabelecimentos/i.test(path.basename(file))),
    companies: files.filter((file) => /Empresas/i.test(path.basename(file))),
    municipalities: files.filter((file) => /Municipios/i.test(path.basename(file))),
    cnaes: files.filter((file) => /Cnaes/i.test(path.basename(file))),
    legalNatures: files.filter((file) => /Naturezas/i.test(path.basename(file))),
    simple: files.filter((file) => /Simples/i.test(path.basename(file))),
  };
  for (const required of ["establishments", "companies", "municipalities", "cnaes"]) {
    if (!grouped[required].length) throw new Error(`Arquivo obrigatório ausente: ${required}.`);
  }
  return grouped;
}

async function forEachZipLine(zipPath, handler) {
  const archive = fs.createReadStream(zipPath).pipe(unzipper.Parse({ forceStream: true }));
  for await (const entry of archive) {
    if (entry.type !== "File") {
      entry.autodrain();
      continue;
    }
    entry.setEncoding("latin1");
    const lines = readline.createInterface({ input: entry, crlfDelay: Infinity });
    for await (const line of lines) {
      if (line) await handler(parseCsvLine(line));
    }
  }
}

async function loadLookup(files) {
  const result = new Map();
  for (const file of files) {
    await forEachZipLine(file, (row) => {
      if (row[0]) result.set(normalize(row[0]), normalize(row[1]));
    });
  }
  return result;
}

function scoreLead(lead) {
  let score = 4;
  if (lead.opened_at) {
    const days = Math.max(
      0,
      Math.floor((Date.now() - new Date(`${lead.opened_at}T12:00:00Z`).getTime()) / 86400000),
    );
    if (days <= 30) score += 5;
    else if (days <= 90) score += 4;
    else if (days <= 180) score += 3;
    else if (days <= 365) score += 1;
  }
  if (lead.cnae_code) score += 2;
  if (lead.trade_name) score += 1;
  if (["01", "03"].includes(lead.raw_payload.company_size_code)) score += 2;
  return score;
}

function splitBatches(items, size) {
  const batches = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

async function upsertBatch(client, rows) {
  const columns = [
    "cnpj",
    "legal_name",
    "trade_name",
    "opened_at",
    "registration_status",
    "status_updated_at",
    "cnae_code",
    "cnae_description",
    "company_size",
    "legal_nature",
    "city",
    "state",
    "postal_code",
    "neighborhood",
    "address",
    "source",
    "source_url",
    "relevance_score",
    "last_seen_at",
    "raw_payload",
  ];
  const values = [];
  const placeholders = rows.map((row, rowIndex) => {
    const start = rowIndex * columns.length;
    for (const column of columns) {
      values.push(column === "raw_payload" ? JSON.stringify(row[column]) : row[column]);
    }
    return `(${columns.map((_, index) => `$${start + index + 1}`).join(",")})`;
  });
  await client.query(
    `insert into public.company_leads (${columns.join(",")})
     values ${placeholders.join(",")}
     on conflict (cnpj) do update set
       legal_name = excluded.legal_name,
       trade_name = excluded.trade_name,
       opened_at = excluded.opened_at,
       registration_status = excluded.registration_status,
       status_updated_at = excluded.status_updated_at,
       cnae_code = excluded.cnae_code,
       cnae_description = excluded.cnae_description,
       company_size = excluded.company_size,
       legal_nature = excluded.legal_nature,
       city = excluded.city,
       state = excluded.state,
       postal_code = excluded.postal_code,
       neighborhood = excluded.neighborhood,
       address = excluded.address,
       source = excluded.source,
       source_url = excluded.source_url,
       relevance_score = excluded.relevance_score,
       last_seen_at = excluded.last_seen_at,
       raw_payload = excluded.raw_payload,
       updated_at = now()`,
    values,
  );
}

const files = await sourceFiles();
console.log(`Fonte: ${SOURCE_DIR || `${BASE_URL}/${competence}`}`);
console.log(`Municípios-alvo: ${TARGET_CITIES.length}`);

const municipalityLookup = await loadLookup(files.municipalities);
const cnaeLookup = await loadLookup(files.cnaes);
const legalNatureLookup = files.legalNatures.length
  ? await loadLookup(files.legalNatures)
  : new Map();
const targetMunicipalities = new Map();
for (const [rfbCode, name] of municipalityLookup) {
  const target = TARGET_CITY_NAMES.get(normalizeCity(name));
  if (target) targetMunicipalities.set(rfbCode, target);
}
if (targetMunicipalities.size !== TARGET_CITIES.length) {
  const found = new Set([...targetMunicipalities.values()].map(({ ibgeCode }) => ibgeCode));
  const missing = TARGET_CITIES.filter(([ibgeCode]) => !found.has(ibgeCode)).map(
    ([, name]) => name,
  );
  throw new Error(`Municípios não encontrados na tabela da Receita: ${missing.join(", ")}.`);
}

const establishments = [];
const companyRoots = new Set();
let scannedEstablishments = 0;
for (const file of files.establishments) {
  await forEachZipLine(file, (row) => {
    scannedEstablishments += 1;
    const municipality = targetMunicipalities.get(normalize(row[20]));
    if (!municipality || normalize(row[5]) !== "02") return;
    const root = digits(row[0]).padStart(8, "0");
    const order = digits(row[1]).padStart(4, "0");
    const verifier = digits(row[2]).padStart(2, "0");
    companyRoots.add(root);
    establishments.push({
      root,
      cnpj: `${root}${order}${verifier}`,
      tradeName: nullable(row[4]),
      statusUpdatedAt: isoDate(row[6]),
      openedAt: isoDate(row[10]),
      cnaeCode: digits(row[11]) || null,
      street: [nullable(row[13]), nullable(row[14])].filter(Boolean).join(" ") || null,
      number: nullable(row[15]),
      complement: nullable(row[16]),
      neighborhood: nullable(row[17]),
      postalCode: digits(row[18]) || null,
      state: normalize(row[19]) || "SP",
      municipality,
      phone: [digits(row[21]), digits(row[22])].filter(Boolean).join(""),
      email: nullable(row[27]),
    });
  });
  console.log(`Estabelecimentos filtrados: ${establishments.length}`);
}

const companies = new Map();
for (const file of files.companies) {
  await forEachZipLine(file, (row) => {
    const root = digits(row[0]).padStart(8, "0");
    if (!companyRoots.has(root)) return;
    companies.set(root, {
      legalName: normalize(row[1]),
      legalNatureCode: normalize(row[2]),
      companySizeCode: normalize(row[5]),
    });
  });
}

const simple = new Map();
for (const file of files.simple) {
  await forEachZipLine(file, (row) => {
    const root = digits(row[0]).padStart(8, "0");
    if (!companyRoots.has(root)) return;
    simple.set(root, { simple: normalize(row[1]) === "S", mei: normalize(row[4]) === "S" });
  });
}

const sizeNames = new Map([
  ["00", "Não informado"],
  ["01", "Microempresa"],
  ["03", "Empresa de pequeno porte"],
  ["05", "Demais"],
]);
const now = new Date().toISOString();
const leads = establishments.flatMap((establishment) => {
  const company = companies.get(establishment.root);
  if (!company?.legalName) return [];
  const taxOptions = simple.get(establishment.root) || { simple: false, mei: false };
  const rawPayload = {
    ibge_city_code: establishment.municipality.ibgeCode,
    rfb_city_code: [...targetMunicipalities].find(
      ([, city]) => city.ibgeCode === establishment.municipality.ibgeCode,
    )?.[0],
    company_size_code: company.companySizeCode,
    simple: taxOptions.simple,
    mei: taxOptions.mei,
    phone: establishment.phone || null,
    email: establishment.email,
    competence: competence || null,
  };
  const lead = {
    cnpj: establishment.cnpj,
    legal_name: company.legalName,
    trade_name: establishment.tradeName,
    opened_at: establishment.openedAt,
    registration_status: "ATIVA",
    status_updated_at: establishment.statusUpdatedAt,
    cnae_code: establishment.cnaeCode,
    cnae_description: cnaeLookup.get(establishment.cnaeCode) || null,
    company_size: sizeNames.get(company.companySizeCode) || "Não informado",
    legal_nature: legalNatureLookup.get(company.legalNatureCode) || company.legalNatureCode || null,
    city: establishment.municipality.name,
    state: establishment.state,
    postal_code: establishment.postalCode,
    neighborhood: establishment.neighborhood,
    address:
      [establishment.street, establishment.number, establishment.complement]
        .filter(Boolean)
        .join(", ") || null,
    source: "receita-federal-dados-abertos",
    source_url:
      "https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/dados-abertos/cadastros",
    last_seen_at: now,
    raw_payload: rawPayload,
  };
  return [{ ...lead, relevance_score: scoreLead(lead) }];
});

console.log(`Registros nacionais lidos: ${scannedEstablishments.toLocaleString("pt-BR")}`);
console.log(`Leads ativos preparados: ${leads.length.toLocaleString("pt-BR")}`);
if (DRY_RUN) process.exit(0);

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();
try {
  const existing = await client.query(
    "select regexp_replace(coalesce(document, ''), '\\D', '', 'g') cnpj from public.client_companies",
  );
  const clientCnpjs = new Set(existing.rows.map(({ cnpj }) => cnpj).filter(Boolean));
  const newLeads = leads.filter((lead) => !clientCnpjs.has(lead.cnpj));
  for (const [index, batch] of splitBatches(newLeads, BATCH_SIZE).entries()) {
    await upsertBatch(client, batch);
    console.log(
      `Gravando leads: ${Math.min((index + 1) * BATCH_SIZE, newLeads.length)}/${newLeads.length}`,
    );
  }
  console.log(`Clientes atuais ignorados: ${leads.length - newLeads.length}`);
  console.log(`Leads criados/atualizados: ${newLeads.length}`);
} finally {
  await client.end();
}
