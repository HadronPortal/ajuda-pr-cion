import fs from "node:fs";
import path from "node:path";
import pg from "pg";

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([^#=]+)=(.*)$/);
    if (match && !process.env[match[1].trim()]) {
      process.env[match[1].trim()] = match[2].trim();
    }
  }
}

loadEnv(path.resolve(".env.local"));
loadEnv(path.resolve(".env"));

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL nao configurada.");

const args = process.argv.slice(2);
const fileIndex = args.indexOf("--file");
const sourceFile =
  fileIndex >= 0
    ? args[fileIndex + 1]
    : path.join(process.env.USERPROFILE || "", "Downloads", "tab_colaboradores.json");

if (!fs.existsSync(sourceFile)) {
  throw new Error(`Arquivo nao encontrado: ${sourceFile}`);
}

function tableRows(file) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  const table = Array.isArray(json) ? json.find((item) => item.type === "table") : null;
  return table?.data || (Array.isArray(json) ? json : []);
}

const text = (value) => String(value ?? "").trim();
const rows = tableRows(sourceFile);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

let imported = 0;
let active = 0;
let admins = 0;
let activeAdmins = 0;
let linkedProfiles = 0;

try {
  await pool.query("begin");

  for (const row of rows) {
    const legacyId = text(row.clb_id);
    if (!legacyId) continue;

    const email = text(row.clb_email).toLowerCase();
    const department = text(row.clb_departamento).toLowerCase();
    const isActive = text(row.clb_st) === "1";

    const result = await pool.query(
      `insert into public.tab_colaboradores
        (legacy_id, profile_id, email, clb_departamento, active)
       values (
         $1,
         (select profile.id from public.profiles profile
          where lower(profile.email) = $2 limit 1),
         nullif($2, ''),
         nullif($3, ''),
         $4
       )
       on conflict (legacy_id) do update set
         profile_id = coalesce(excluded.profile_id, tab_colaboradores.profile_id),
         email = excluded.email,
         clb_departamento = excluded.clb_departamento,
         active = excluded.active,
         updated_at = now()
       returning profile_id`,
      [legacyId, email, department, isActive],
    );

    imported += 1;
    if (isActive) active += 1;
    if (department === "admin") admins += 1;
    if (department === "admin" && isActive) activeAdmins += 1;
    if (result.rows[0]?.profile_id) linkedProfiles += 1;
  }

  await pool.query("commit");

  const totals = await pool.query(
    `select
       count(*)::int as collaborators,
       count(*) filter (where active)::int as active_collaborators,
       count(*) filter (where lower(clb_departamento) = 'admin')::int as admins,
       count(*) filter (
         where active and lower(clb_departamento) = 'admin'
       )::int as active_admins
     from public.tab_colaboradores`,
  );

  console.log(
    JSON.stringify(
      {
        imported,
        active,
        admins,
        activeAdmins,
        linkedProfiles,
        database: totals.rows[0],
        source: path.basename(sourceFile),
        sensitiveFieldsImported: 0,
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
