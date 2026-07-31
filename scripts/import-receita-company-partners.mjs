import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import pg from "pg";
import unzipper from "unzipper";

const DATABASE_URL = process.env.DATABASE_URL;
const COMPETENCE = process.env.CNPJ_COMPETENCE;
const CACHE_DIR = path.resolve(process.env.CNPJ_CACHE_DIR || ".cache/cnpj");
const BATCH_SIZE = Math.max(100, Number(process.env.CNPJ_IMPORT_BATCH || 1000));

if (!DATABASE_URL) throw new Error("Defina DATABASE_URL.");
if (!COMPETENCE) throw new Error("Defina CNPJ_COMPETENCE.");

const normalize = (value) => String(value ?? "").trim();
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
      } else quoted = !quoted;
    } else if (character === ";" && !quoted) {
      values.push(value);
      value = "";
    } else value += character;
  }
  values.push(value);
  return values;
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
    for await (const line of lines) if (line) await handler(parseCsvLine(line));
  }
}

async function loadLookup(file) {
  const lookup = new Map();
  await forEachZipLine(file, (row) => {
    if (row[0]) lookup.set(normalize(row[0]), normalize(row[1]));
  });
  return lookup;
}

const directory = path.join(CACHE_DIR, COMPETENCE);
const qualificationLookup = await loadLookup(path.join(directory, "Qualificacoes.zip"));
const countryLookup = await loadLookup(path.join(directory, "Paises.zip"));
const partnerFiles = (await fs.promises.readdir(directory))
  .filter((name) => /^Socios\d+\.zip$/i.test(name))
  .sort()
  .map((name) => path.join(directory, name));

if (!partnerFiles.length) throw new Error("Nenhum arquivo Socios*.zip encontrado no cache.");

const client = new pg.Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
await client.connect();

try {
  const rootRows = await client.query(
    "select distinct coalesce(company_root, left(cnpj, 8)) company_root from public.company_leads",
  );
  const companyRoots = new Set(rootRows.rows.map(({ company_root: root }) => root));
  let imported = 0;
  let batch = [];

  const flush = async () => {
    if (!batch.length) return;
    const unique = [...new Map(batch.map((partner) => [partner.sourceKey, partner])).values()];
    const values = [];
    const placeholders = unique.map((partner, rowIndex) => {
      const start = rowIndex * 7;
      values.push(
        partner.companyRoot,
        partner.sourceKey,
        partner.name,
        partner.type,
        partner.qualification,
        partner.joinedAt,
        partner.country,
      );
      return `(${Array.from({ length: 7 }, (_, index) => `$${start + index + 1}`).join(",")})`;
    });
    await client.query(
      `insert into public.company_lead_partners
        (company_root, source_key, partner_name, partner_type, qualification, joined_at, country)
       values ${placeholders.join(",")}
       on conflict (source_key) do update set
         partner_name = excluded.partner_name,
         partner_type = excluded.partner_type,
         qualification = excluded.qualification,
         joined_at = excluded.joined_at,
         country = excluded.country,
         updated_at = now()`,
      values,
    );
    imported += unique.length;
    batch = [];
  };

  for (const file of partnerFiles) {
    await forEachZipLine(file, async (row) => {
      const companyRoot = digits(row[0]).padStart(8, "0");
      if (!companyRoots.has(companyRoot)) return;
      const name = normalize(row[2]);
      if (!name) return;
      const type =
        { 1: "Pessoa jurídica", 2: "Pessoa física", 3: "Estrangeiro" }[normalize(row[1])] ||
        "Não informado";
      const qualificationCode = normalize(row[4]);
      const sourceKey = crypto
        .createHash("sha256")
        .update(
          [companyRoot, normalize(row[1]), name, qualificationCode, normalize(row[5])].join("|"),
        )
        .digest("hex");
      batch.push({
        companyRoot,
        sourceKey,
        name,
        type,
        qualification: qualificationLookup.get(qualificationCode) || qualificationCode || null,
        joinedAt: isoDate(row[5]),
        country: countryLookup.get(normalize(row[6])) || null,
      });
      if (batch.length >= BATCH_SIZE) await flush();
    });
    await flush();
    console.log(`Sócios criados/atualizados: ${imported.toLocaleString("pt-BR")}`);
  }
} finally {
  await client.end();
}
