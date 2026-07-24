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

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL nao configurada.");

const args = process.argv.slice(2);
const fileIndex = args.indexOf("--file");
const sourceFile =
  fileIndex >= 0
    ? args[fileIndex + 1]
    : path.join(process.env.USERPROFILE || "", "Downloads", "tab_cli_params.json");

const dump = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
const rows = Array.isArray(dump)
  ? dump.find((item) => item.type === "table")?.data || []
  : [];
const text = (value) => String(value ?? "").trim();
const iso = (value) => {
  const clean = text(value);
  return !clean || clean.startsWith("0000-00-00") ? null : clean;
};
const jsonData = (value) => {
  const clean = text(value);
  if (!clean) return null;
  try {
    return JSON.stringify(JSON.parse(clean));
  } catch {
    return JSON.stringify({ raw: clean });
  }
};

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 2,
});

let imported = 0;
let linkedToClients = 0;
let linkedToUsers = 0;

try {
  const migration = path.resolve(
    "supabase/migrations/20260724213000_client_auth_params.sql",
  );
  await pool.query(fs.readFileSync(migration, "utf8"));
  await pool.query("begin");

  const clients = await pool.query("select id, acronym from public.clients");
  const clientByAcronym = new Map(
    clients.rows.map((client) => [text(client.acronym).toUpperCase(), client.id]),
  );
  const users = await pool.query("select id, legacy_id from public.auth_usuarios");
  const userByLegacyId = new Map(
    users.rows.map((user) => [text(user.legacy_id), user.id]),
  );

  for (const row of rows) {
    const legacyId = text(row.id);
    if (!legacyId) continue;
    const acronym = text(row.tab_clientes_cli_sigla).toUpperCase();
    const clientId = clientByAcronym.get(acronym) || null;
    const userLegacyId = text(row.auth_usuarios_id);
    const userId = userByLegacyId.get(userLegacyId) || null;

    await pool.query(
      `insert into public.tab_cli_params
        (legacy_id, client_id, client_acronym, auth_usuario_id,
         auth_usuario_legacy_id, cvs_parameter_legacy_id, cvs_option_legacy_id,
         parameter_signature, option_data, crm_created_at, crm_updated_at)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       on conflict (legacy_id) do update set
         client_id=excluded.client_id,
         client_acronym=excluded.client_acronym,
         auth_usuario_id=excluded.auth_usuario_id,
         auth_usuario_legacy_id=excluded.auth_usuario_legacy_id,
         cvs_parameter_legacy_id=excluded.cvs_parameter_legacy_id,
         cvs_option_legacy_id=excluded.cvs_option_legacy_id,
         parameter_signature=excluded.parameter_signature,
         option_data=excluded.option_data,
         crm_created_at=excluded.crm_created_at,
         crm_updated_at=excluded.crm_updated_at,
         updated_at=now()`,
      [
        legacyId,
        clientId,
        acronym || null,
        userId,
        userLegacyId || null,
        text(row.cvs_parameters_id) || null,
        text(row.cvs_options_id) || null,
        text(row.cvs_params_signature) || null,
        jsonData(row.cvs_params_options_data),
        iso(row.created),
        iso(row.modified),
      ],
    );
    imported += 1;
    if (clientId) linkedToClients += 1;
    if (userId) linkedToUsers += 1;
  }

  await pool.query("commit");
  console.log(JSON.stringify({ imported, linkedToClients, linkedToUsers }));
} catch (error) {
  await pool.query("rollback").catch(() => {});
  throw error;
} finally {
  await pool.end();
}

