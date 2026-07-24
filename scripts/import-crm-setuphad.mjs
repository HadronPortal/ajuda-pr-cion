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
const downloads = path.join(process.env.USERPROFILE || "", "Downloads");
const files = {
  setup: option("--setup", path.join(downloads, "setuphad.json")),
  logs: option("--logs", path.join(downloads, "tab_hadron_log.json")),
};

const tableRows = (file) => {
  const dump = JSON.parse(fs.readFileSync(file, "utf8"));
  return dump.find((item) => item.type === "table")?.data || [];
};
const text = (value) => String(value ?? "").trim();
const iso = (value) => {
  const clean = text(value);
  return !clean || clean.startsWith("0000-00-00") ? null : clean;
};
const dateOnly = (value) => iso(value)?.slice(0, 10) || null;
const integer = (value) => {
  const parsed = Number.parseInt(text(value), 10);
  return Number.isFinite(parsed) ? parsed : null;
};
const validIp = (value) => {
  const clean = text(value);
  return clean && /^[0-9a-f:.]+$/i.test(clean) ? clean : null;
};
const chunks = (rows, size) => {
  const result = [];
  for (let index = 0; index < rows.length; index += size) {
    result.push(rows.slice(index, index + size));
  }
  return result;
};

const setupRows = tableRows(files.setup);
const logRows = tableRows(files.logs);
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 2,
});

try {
  const migration = path.resolve(
    "supabase/migrations/20260724230000_setuphad_hadron_logs.sql",
  );
  await pool.query(fs.readFileSync(migration, "utf8"));
  await pool.query("begin");

  const clients = await pool.query("select id, acronym from public.clients");
  const clientByAcronym = new Map(
    clients.rows.map((client) => [text(client.acronym).toUpperCase(), client.id]),
  );

  const grouped = new Map();
  for (const row of setupRows) {
    const acronym = text(row.id_emp).toUpperCase();
    const terminalCode = text(row.cod_trm);
    if (!acronym || !terminalCode) continue;
    const key = `${acronym}|${terminalCode}`;
    const current = grouped.get(key);
    const setupAt = iso(row.data_setup);
    const versionAt = dateOnly(row.data_versao);
    if (!current) {
      grouped.set(key, {
        acronym,
        terminalCode,
        latest: row,
        setupAt,
        versionAt,
      });
      continue;
    }
    if (versionAt && versionAt > String(current.versionAt || "")) {
      current.versionAt = versionAt;
    }
    if (String(setupAt || "") > String(current.setupAt || "")) {
      current.latest = row;
      current.setupAt = setupAt;
    }
  }

  const terminals = [...grouped.values()]
    .map(({ acronym, terminalCode, latest, setupAt, versionAt }) => ({
      client_id: clientByAcronym.get(acronym) || null,
      legacy_key: `setuphad:${terminalCode}`,
      terminal_number: integer(terminalCode),
      ip_address: validIp(latest.ip),
      install_path: text(latest.pasta) || null,
      registered_at: setupAt,
      version_released_at: versionAt,
      serial_number: text(latest.num_serie) || null,
      legacy_flags: text(latest.flags) || null,
      source_payload: {
        setuphad_id: text(latest.id),
        client_acronym: acronym,
        terminal_code: terminalCode,
      },
    }))
    .filter((terminal) => terminal.client_id);

  for (const batch of chunks(terminals, 500)) {
    await pool.query(
      `insert into public.client_terminals
        (client_id, legacy_key, terminal_number, ip_address, install_path,
         registered_at, version_released_at, serial_number, legacy_flags, source_payload)
       select x.client_id, x.legacy_key, x.terminal_number, x.ip_address::inet,
         x.install_path, x.registered_at, x.version_released_at, x.serial_number,
         x.legacy_flags, x.source_payload
       from jsonb_to_recordset($1::jsonb) as x(
         client_id uuid, legacy_key text, terminal_number integer, ip_address text,
         install_path text, registered_at timestamptz, version_released_at date,
         serial_number text, legacy_flags text, source_payload jsonb
       )
       on conflict (client_id, legacy_key) where legacy_key is not null do update set
         terminal_number=excluded.terminal_number,
         ip_address=excluded.ip_address,
         install_path=excluded.install_path,
         registered_at=excluded.registered_at,
         version_released_at=excluded.version_released_at,
         serial_number=excluded.serial_number,
         legacy_flags=excluded.legacy_flags,
         source_payload=excluded.source_payload,
         updated_at=now()`,
      [JSON.stringify(batch)],
    );
  }

  const logs = logRows.map((row) => {
    const acronym = text(row.hog_id_emp).toUpperCase();
    return {
      legacy_id: text(row.id_hog),
      client_id: clientByAcronym.get(acronym) || null,
      client_acronym: acronym || null,
      ip_address: validIp(row.hog_ip),
      level: text(row.hog_nivel) || null,
      terminal_code: text(row.hog_codtrm) || null,
      operation: text(row.hog_oprc) || null,
      new_operation_id: text(row.hog_id_ope_n) || null,
      new_operator_code: text(row.hog_codope_n) || null,
      parent_option: text(row.hog_opc_mae) || null,
      child_option: text(row.hog_opc_ch) || null,
      serial_number: text(row.hog_nroser) || null,
      user_code: text(row.hog_codusu) || null,
      previous_operation_id: text(row.hog_id_ope_a) || null,
      previous_operator_code: text(row.hog_codope_a) || null,
      previous_drive: text(row.hog_drive_p) || null,
      current_drive: text(row.hog_drive_a) || null,
      crm_created_at: iso(row.created),
      crm_updated_at: iso(row.updated),
    };
  }).filter((row) => row.legacy_id);

  for (const batch of chunks(logs, 500)) {
    await pool.query(
      `insert into public.tab_hadron_logs
        (legacy_id, client_id, client_acronym, ip_address, level, terminal_code,
         operation, new_operation_id, new_operator_code, parent_option, child_option,
         serial_number, user_code, previous_operation_id, previous_operator_code,
         previous_drive, current_drive, crm_created_at, crm_updated_at)
       select x.legacy_id, x.client_id, x.client_acronym, x.ip_address::inet, x.level,
         x.terminal_code, x.operation, x.new_operation_id, x.new_operator_code,
         x.parent_option, x.child_option, x.serial_number, x.user_code,
         x.previous_operation_id, x.previous_operator_code, x.previous_drive,
         x.current_drive, x.crm_created_at, x.crm_updated_at
       from jsonb_to_recordset($1::jsonb) as x(
         legacy_id text, client_id uuid, client_acronym text, ip_address text,
         level text, terminal_code text, operation text, new_operation_id text,
         new_operator_code text, parent_option text, child_option text,
         serial_number text, user_code text, previous_operation_id text,
         previous_operator_code text, previous_drive text, current_drive text,
         crm_created_at timestamptz, crm_updated_at timestamptz
       )
       on conflict (legacy_id) do update set
         client_id=excluded.client_id, client_acronym=excluded.client_acronym,
         ip_address=excluded.ip_address, level=excluded.level,
         terminal_code=excluded.terminal_code, operation=excluded.operation,
         new_operation_id=excluded.new_operation_id,
         new_operator_code=excluded.new_operator_code,
         parent_option=excluded.parent_option, child_option=excluded.child_option,
         serial_number=excluded.serial_number, user_code=excluded.user_code,
         previous_operation_id=excluded.previous_operation_id,
         previous_operator_code=excluded.previous_operator_code,
         previous_drive=excluded.previous_drive, current_drive=excluded.current_drive,
         crm_created_at=excluded.crm_created_at, crm_updated_at=excluded.crm_updated_at,
         updated_at=now()`,
      [JSON.stringify(batch)],
    );
  }

  await pool.query("commit");
  console.log(JSON.stringify({
    setupSourceRows: setupRows.length,
    terminalGroups: grouped.size,
    terminalsImported: terminals.length,
    terminalGroupsWithoutClient: grouped.size - terminals.length,
    hadronLogsImported: logs.length,
    hadronLogsLinkedToClients: logs.filter((row) => row.client_id).length,
  }));
} catch (error) {
  await pool.query("rollback").catch(() => {});
  throw error;
} finally {
  await pool.end();
}
