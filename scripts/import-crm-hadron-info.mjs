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
const option = (name, fallback) => {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
};
const sourceFile = option(
  "--source",
  path.join(process.env.USERPROFILE || "", "Downloads", "tab_hadron_info.json"),
);

const dump = JSON.parse(fs.readFileSync(sourceFile, "utf8"));
const sourceRows = dump.find((item) => item.type === "table")?.data || [];
const text = (value) => String(value ?? "").trim();
const integer = (value) => {
  const parsed = Number.parseInt(text(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
};
const number = (value) => {
  const parsed = Number(text(value));
  return Number.isFinite(parsed) ? parsed : null;
};
const iso = (value) => {
  const clean = text(value);
  return !clean || clean.startsWith("0000-00-00") ? null : clean;
};
const localDateTime = (value) => {
  const clean = iso(value);
  if (!clean) return null;
  if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(clean)) {
    return `${clean.replace(" ", "T")}-03:00`;
  }
  return clean;
};
const truthy = (value) => ["1", "S", "SIM", "TRUE"].includes(text(value).toUpperCase());
const chunks = (rows, size) => {
  const result = [];
  for (let index = 0; index < rows.length; index += size) result.push(rows.slice(index, index + size));
  return result;
};

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 2,
});

try {
  const migration = path.resolve(
    "supabase/migrations/20260728153000_client_hadron_info.sql",
  );
  await pool.query(fs.readFileSync(migration, "utf8"));
  await pool.query("begin");

  const clients = await pool.query("select id, acronym from public.clients");
  const clientByAcronym = new Map(
    clients.rows.map((client) => [text(client.acronym).toUpperCase(), client.id]),
  );

  const rows = sourceRows
    .map((row) => {
      const acronym = text(row.hdi_id_emp).toUpperCase();
      const tasks = Array.from({ length: 9 }, (_, index) =>
        integer(row[`hdi_task_${301 + index}`]) || 0,
      );
      const drives = [
        {
          name: text(row.hdi_drive_p),
          role: "P",
          total: number(row.hdi_drive_p_total),
          free: number(row.hdi_drive_p_livre),
          used: number(row.hdi_drive_p_usado),
        },
        {
          name: text(row.hdi_drive_t),
          role: "T",
          total: number(row.hdi_drive_t_total),
          free: number(row.hdi_drive_t_livre),
          used: number(row.hdi_drive_t_usado),
        },
        {
          name: text(row.hdi_drive_a),
          role: "A",
          total: number(row.hdi_drive_a_total),
          free: number(row.hdi_drive_a_livre),
          used: number(row.hdi_drive_a_usado),
        },
      ].filter((drive) => drive.name);
      const legacyKey = [
        text(row.hdi_codusu),
        text(row.hdi_terminal),
        text(row.created),
      ].join(":");

      return {
        client_id: clientByAcronym.get(acronym) || null,
        legacy_key: legacyKey,
        company_number: integer(row.hdi_codusu),
        branch_number: integer(row.hdi_fili),
        company_description: text(row.hdi_detusu_ult) || text(row.hdi_detusu) || null,
        terminal_number: integer(row.hdi_terminal),
        version_released_at: iso(row.hdi_versao)?.slice(0, 10) || null,
        operating_system: text(row.hdi_os_nome) || null,
        operating_system_version: text(row.hdi_os_versao) || null,
        emits_nfe: truthy(row.hdi_nfe_ger),
        notes_issued: tasks.reduce((total, task) => total + task, 0),
        memory_used: number(row.hdi_memo_fis_usada),
        memory_total: number(row.hdi_memo_fis_total),
        drives,
        certificate_type: text(row.hdi_tipo_certificado) || null,
        certificate_expires_at: iso(row.hdi_validade)?.slice(0, 10) || null,
        environment: text(row.hdi_ambiente) || null,
        total_incompatible: integer(row.hdi_total_incompativel),
        registered_at: localDateTime(row.created || row.hdi_data),
        technical_updated_at: localDateTime(row.modified || row.hdi_data_ult_atu),
        source_payload: {
          client_acronym: acronym,
          hdi_data: text(row.hdi_data),
          hdi_data_ult_atu: text(row.hdi_data_ult_atu),
          hdi_memo_qtd_prc: text(row.hdi_memo_qtd_prc),
          hdi_prc_p_seg: text(row.hdi_prc_p_seg),
          hdi_contador: text(row.hdi_contador),
          hdi_hora: text(row.hdi_hora),
        },
      };
    })
    .filter((row) => row.client_id);

  for (const batch of chunks(rows, 300)) {
    await pool.query(
      `insert into public.client_hadron_info
        (client_id, legacy_key, company_number, branch_number, company_description,
         terminal_number, version_released_at, operating_system, operating_system_version,
         emits_nfe, notes_issued, memory_used, memory_total, drives, certificate_type,
         certificate_expires_at, environment, total_incompatible, registered_at,
         technical_updated_at, source_payload)
       select x.client_id, x.legacy_key, x.company_number, x.branch_number,
         x.company_description, x.terminal_number, x.version_released_at,
         x.operating_system, x.operating_system_version, x.emits_nfe, x.notes_issued,
         x.memory_used, x.memory_total, x.drives, x.certificate_type,
         x.certificate_expires_at, x.environment, x.total_incompatible,
         x.registered_at, x.technical_updated_at, x.source_payload
       from jsonb_to_recordset($1::jsonb) as x(
         client_id uuid, legacy_key text, company_number integer, branch_number integer,
         company_description text, terminal_number integer, version_released_at date,
         operating_system text, operating_system_version text, emits_nfe boolean,
         notes_issued bigint, memory_used numeric, memory_total numeric, drives jsonb,
         certificate_type text, certificate_expires_at date, environment text,
         total_incompatible bigint, registered_at timestamptz,
         technical_updated_at timestamptz, source_payload jsonb
       )
       on conflict (client_id, legacy_key) do update set
         company_number=excluded.company_number,
         branch_number=excluded.branch_number,
         company_description=excluded.company_description,
         terminal_number=excluded.terminal_number,
         version_released_at=excluded.version_released_at,
         operating_system=excluded.operating_system,
         operating_system_version=excluded.operating_system_version,
         emits_nfe=excluded.emits_nfe,
         notes_issued=excluded.notes_issued,
         memory_used=excluded.memory_used,
         memory_total=excluded.memory_total,
         drives=excluded.drives,
         certificate_type=excluded.certificate_type,
         certificate_expires_at=excluded.certificate_expires_at,
         environment=excluded.environment,
         total_incompatible=excluded.total_incompatible,
         registered_at=excluded.registered_at,
         technical_updated_at=excluded.technical_updated_at,
         source_payload=excluded.source_payload,
         updated_at=now()`,
      [JSON.stringify(batch)],
    );
  }

  await pool.query("commit");
  const importedClients = new Set(
    rows.map((row) => row.source_payload.client_acronym),
  ).size;
  console.log(
    JSON.stringify({
      sourceRows: sourceRows.length,
      importedRows: rows.length,
      importedClients,
      skippedRows: sourceRows.length - rows.length,
    }),
  );
} catch (error) {
  await pool.query("rollback").catch(() => {});
  throw error;
} finally {
  await pool.end();
}
