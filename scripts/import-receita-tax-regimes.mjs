import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import pg from "pg";
import unzipper from "unzipper";

const DATABASE_URL = process.env.DATABASE_URL;
const CACHE_DIR = path.resolve(process.env.CNPJ_TAX_CACHE_DIR || ".cache/cnpj/regime-tributario/2024-03-15");
const BATCH_SIZE = Math.max(100, Number(process.env.CNPJ_IMPORT_BATCH || 1000));
const DOWNLOAD_ONLY = process.argv.includes("--download-only");
const OFFICIAL_BASE = "https://arquivos.receitafederal.gov.br/dados/cnpj/regime_tributario";
const MIRROR_BASE = "https://dados-abertos-rf-cnpj.casadosdados.com.br/arquivos/2024-03-15/regime_tributario";
const SOURCES = [
  { file: "Lucro Real.zip", remote: "Lucro%20Real.zip", code: "2", label: "Lucro Real" },
  { file: "Lucro Presumido 1.zip", remote: "Lucro%20Presumido%201.zip", officialRemote: "Lucro%20Presumido.zip", code: "1", label: "Lucro Presumido" },
  { file: "Lucro Arbitrado.zip", remote: "Lucro%20Arbitrado.zip", code: "4", label: "Lucro Arbitrado" },
  { file: "Imunes e isentas.zip", remote: "Imunes%20e%20isentas.zip", officialRemote: "Imunes%20e%20Isentas.zip", code: "5", label: "Imune ou Isenta" },
];

if (!DATABASE_URL && !DOWNLOAD_ONLY) throw new Error("Defina DATABASE_URL ou execute com --download-only.");
const digits = (value) => String(value ?? "").replace(/\D/g, "");

async function download(url, destination) {
  const response = await fetch(url, { signal: AbortSignal.timeout(7_200_000) });
  if (!response.ok || !response.body) throw new Error(`HTTP ${response.status}`);
  const partial = `${destination}.part`;
  await pipeline(Readable.fromWeb(response.body), fs.createWriteStream(partial));
  await fs.promises.rename(partial, destination);
}

async function ensureSources() {
  await fs.promises.mkdir(CACHE_DIR, { recursive: true });
  const provenance = [];
  for (const source of SOURCES) {
    const destination = path.join(CACHE_DIR, source.file);
    if (fs.existsSync(destination)) {
      provenance.push({ ...source, url: `${MIRROR_BASE}/${source.remote}` });
      continue;
    }
    const officialUrl = `${OFFICIAL_BASE}/${source.officialRemote || source.remote}`;
    try {
      await download(officialUrl, destination);
      provenance.push({ ...source, url: officialUrl });
      continue;
    } catch (error) {
      console.warn(`Fonte oficial indisponível para ${source.label}: ${error.message}.`);
    }
    const mirrorUrl = `${MIRROR_BASE}/${source.remote}`;
    await download(mirrorUrl, destination);
    provenance.push({ ...source, url: mirrorUrl });
  }
  await fs.promises.writeFile(path.join(CACHE_DIR, "source-manifest.json"), `${JSON.stringify({ downloadedAt: new Date().toISOString(), files: provenance }, null, 2)}\n`);
  return provenance;
}

async function forEachCsvRow(zipPath, handler) {
  const archive = fs.createReadStream(zipPath).pipe(unzipper.Parse({ forceStream: true }));
  for await (const entry of archive) {
    if (entry.type !== "File" || !entry.path.toLowerCase().endsWith(".csv")) {
      entry.autodrain();
      continue;
    }
    entry.setEncoding("latin1");
    const lines = readline.createInterface({ input: entry, crlfDelay: Infinity });
    for await (const line of lines) {
      const separator = line.includes(";") ? ";" : ",";
      const [year, rawCnpj] = line.split(separator, 2);
      const cnpj = digits(rawCnpj);
      if (/^\d{4}$/.test(year) && cnpj.length === 14) await handler({ year, cnpj });
    }
  }
}

const provenance = await ensureSources();
console.log(`Arquivos validados em ${CACHE_DIR}.`);
if (DOWNLOAD_ONLY) process.exit(0);

const client = new pg.Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } });
await client.connect();
try {
  const leadRows = await client.query("select cnpj from public.company_leads");
  const leadCnpjs = new Set(leadRows.rows.map((row) => digits(row.cnpj)));
  const latestByCnpj = new Map();
  for (const source of provenance) {
    await forEachCsvRow(path.join(CACHE_DIR, source.file), ({ year, cnpj }) => {
      if (!leadCnpjs.has(cnpj)) return;
      const current = latestByCnpj.get(cnpj);
      if (!current || Number(year) > Number(current.year)) latestByCnpj.set(cnpj, { ...source, year });
    });
  }
  const records = [...latestByCnpj.entries()];
  let updated = 0;
  for (let offset = 0; offset < records.length; offset += BATCH_SIZE) {
    const payload = records.slice(offset, offset + BATCH_SIZE).map(([cnpj, regime]) => ({ cnpj, code: regime.code, label: regime.label, year: Number(regime.year), sourceUrl: regime.url }));
    const result = await client.query(
      `update public.company_leads lead
       set raw_payload = lead.raw_payload || jsonb_build_object(
         'tax_regime', source.code, 'tax_regime_label', source.label,
         'tax_regime_year', source.year, 'tax_regime_source', 'Receita Federal',
         'tax_regime_source_url', source."sourceUrl"
       ), updated_at = now()
       from jsonb_to_recordset($1::jsonb)
         as source(cnpj text, code text, label text, year integer, "sourceUrl" text)
       where regexp_replace(lead.cnpj, '\\D', '', 'g') = source.cnpj`,
      [JSON.stringify(payload)],
    );
    updated += result.rowCount;
  }
  console.log(`${updated} empresa(s) atualizada(s) com o regime oficial mais recente disponível.`);
} finally {
  await client.end();
}
