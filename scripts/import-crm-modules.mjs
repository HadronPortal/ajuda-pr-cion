import fs from "node:fs";
import path from "node:path";
import pg from "pg";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) process.env[match[1].trim()] = match[2].trim();
  }
}

loadEnv(path.resolve(".env.local"));
loadEnv(path.resolve(".env"));

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};

const downloads = path.join(process.env.USERPROFILE || "", "Downloads");
const files = {
  modules: option("--modules", path.join(downloads, "modulos.json")),
  clients: option("--clients", path.join(downloads, "tab_clientes.json")),
};

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL nao configurada.");

function tableRows(file) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const table = Array.isArray(json) ? json.find((item) => item.type === "table") : null;
  return table?.data || (Array.isArray(json) ? json : []);
}

const text = (value) => String(value ?? "").trim();
const integer = (value) => {
  const parsed = Number(text(value));
  return Number.isInteger(parsed) ? parsed : null;
};
const slugify = (value) =>
  text(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const serialMask = (value) => {
  const clean = text(value).replace(/\D/g, "");
  return clean ? BigInt(clean) : 0n;
};
const isContracted = (serial, horder) => ((serial >> BigInt(horder)) & 1n) === 1n;

const moduleRows = tableRows(files.modules)
  .map((row) => ({
    opcao: text(row.opcao),
    name: text(row.modulo),
    horder: integer(row.horder),
    source: row,
  }))
  .filter((row) => row.opcao && row.name && row.horder !== null)
  .sort((a, b) => a.horder - b.horder);

const horders = new Set(moduleRows.map((row) => row.horder));
if (!moduleRows.length) throw new Error("Nenhum modulo valido encontrado.");
if (horders.size !== moduleRows.length)
  throw new Error("Existem horders duplicados em modulos.json.");

const clientRows = tableRows(files.clients).filter((row) => text(row.cli_id));
if (!clientRows.length) throw new Error("Nenhum cliente valido encontrado.");

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 4,
});

const migration = fs.readFileSync(
  path.resolve("supabase/migrations/20260724120000_crm_modules_import.sql"),
  "utf8",
);

const moduleIds = new Map();
let insertedModules = 0;
let updatedModules = 0;
let clientsProcessed = 0;
let clientsSkipped = 0;
let preExistingLinks = 0;
let linksUpserted = 0;

try {
  await pool.query(migration);
  await pool.query("begin");

  for (const module of moduleRows) {
    const before = await pool.query("select id from public.modules where slug = $1", [
      slugify(module.name),
    ]);
    const result = await pool.query(
      `
      insert into public.modules
        (legacy_id, name, slug, active, display_order, source_payload)
      values ($1,$2,$3,true,$4,$5)
      on conflict (slug) do update set
        legacy_id=excluded.legacy_id,
        name=excluded.name,
        active=true,
        display_order=excluded.display_order,
        source_payload=coalesce(public.modules.source_payload, '{}'::jsonb) || excluded.source_payload
      returning id
    `,
      [
        module.opcao,
        module.name,
        slugify(module.name),
        module.horder,
        JSON.stringify({
          source_table: "modulos",
          opcao: module.opcao,
          horder: module.horder,
          imported_from: path.basename(files.modules),
        }),
      ],
    );
    moduleIds.set(module.horder, result.rows[0].id);
    if (before.rowCount) updatedModules += 1;
    else insertedModules += 1;
  }

  const clientLegacyIds = clientRows.map((row) => text(row.cli_id));
  const dbClients = await pool.query(
    "select id, legacy_id, acronym from public.clients where legacy_id = any($1::text[])",
    [clientLegacyIds],
  );
  const clientIds = new Map(dbClients.rows.map((row) => [String(row.legacy_id), row.id]));
  const moduleIdList = moduleRows.map((module) => moduleIds.get(module.horder));
  const clientIdList = dbClients.rows.map((row) => row.id);

  if (clientIdList.length && moduleIdList.length) {
    const existing = await pool.query(
      `
      select count(*)::int as count
      from public.client_modules
      where client_id = any($1::uuid[])
        and module_id = any($2::uuid[])
    `,
      [clientIdList, moduleIdList],
    );
    preExistingLinks = existing.rows[0].count;
  }

  const linkRows = [];
  const expectedCounts = new Map();
  for (const row of clientRows) {
    const clientId = clientIds.get(text(row.cli_id));
    if (!clientId) {
      clientsSkipped += 1;
      continue;
    }
    const serial = serialMask(row.cli_serial2);
    let contractedCount = 0;
    for (const module of moduleRows) {
      const contracted = isContracted(serial, module.horder);
      if (contracted) contractedCount += 1;
      linkRows.push({
        client_id: clientId,
        module_id: moduleIds.get(module.horder),
        contracted,
      });
    }
    expectedCounts.set(clientId, contractedCount);
    clientsProcessed += 1;
  }

  for (let offset = 0; offset < linkRows.length; offset += 1000) {
    const chunk = linkRows.slice(offset, offset + 1000);
    await pool.query(
      `
      insert into public.client_modules (client_id, module_id, contracted, updated_at)
      select x.client_id::uuid, x.module_id::uuid, x.contracted::boolean, now()
      from jsonb_to_recordset($1::jsonb) as x(client_id text, module_id text, contracted boolean)
      on conflict (client_id, module_id) do update set
        contracted=excluded.contracted,
        updated_at=now()
    `,
      [JSON.stringify(chunk)],
    );
    linksUpserted += chunk.length;
  }

  const validation = await pool.query(
    `
    select cm.client_id, count(*) filter (where cm.contracted)::int as contracted
    from public.client_modules cm
    where cm.client_id = any($1::uuid[])
      and cm.module_id = any($2::uuid[])
    group by cm.client_id
  `,
    [clientIdList, moduleIdList],
  );

  const actualCounts = new Map(validation.rows.map((row) => [row.client_id, row.contracted]));
  const mismatches = [];
  for (const [clientId, expected] of expectedCounts) {
    const actual = actualCounts.get(clientId) ?? 0;
    if (actual !== expected) mismatches.push({ clientId, expected, actual });
  }
  if (mismatches.length) throw new Error(`Validacao falhou para ${mismatches.length} cliente(s).`);

  await pool.query("commit");

  const sample = dbClients.rows.slice(0, 5).map((client) => ({
    legacy_id: client.legacy_id,
    sigla: client.acronym,
    contratados: expectedCounts.get(client.id) ?? 0,
  }));

  console.log(
    JSON.stringify(
      {
        imported: {
          modules: moduleRows.length,
          clientsProcessed,
          clientsSkipped,
          linksUpserted,
          linksInsertedEstimated: Math.max(linksUpserted - preExistingLinks, 0),
          linksUpdatedEstimated: Math.min(preExistingLinks, linksUpserted),
        },
        catalog: {
          inserted: insertedModules,
          updated: updatedModules,
        },
        validation: {
          mismatches: 0,
          samples: sample,
        },
      },
      null,
      2,
    ),
  );
} catch (error) {
  await pool.query("rollback").catch(() => {});
  throw error;
} finally {
  await pool.end();
}
