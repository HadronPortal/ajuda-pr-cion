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
  clients: option("--clients", path.join(downloads, "tab_clientes.json")),
  companies: option("--companies", path.join(downloads, "tab_cli_empresas.json")),
  phones: option("--phones", path.join(downloads, "tab_cli_telefones.json")),
  emails: option("--emails", path.join(downloads, "tab_cli_mails.json")),
};

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL nao configurada.");

function rows(file) {
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  return json.find((item) => item.type === "table")?.data || [];
}
const data = Object.fromEntries(Object.entries(files).map(([key, file]) => [key, rows(file)]));
const contactsOnly = args.includes("--contacts-only");
const clientsOnly = args.includes("--clients-only");
const text = (value) => String(value ?? "").trim() || null;
const integer = (value) => Number.isFinite(Number(value)) ? Number(value) : null;
const bool = (value) => ["1", "true", "ativo", "a"].includes(String(value ?? "").trim().toLowerCase());
const iso = (value) => {
  const clean = text(value);
  return clean && clean !== "0000-00-00" && !clean.startsWith("0000-00-00") ? clean : null;
};
const jsonObject = (value) => {
  try { return value ? JSON.parse(value) : {}; } catch { return {}; }
};
const address = (row, prefix) => [row[`${prefix}_endereco`], row[`${prefix}_numero`], row[`${prefix}_complemento`], row[`${prefix}_bairro`]].map(text).filter(Boolean).join(", ") || null;

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false }, max: 4 });
const migration = fs.readFileSync(path.resolve("supabase/migrations/20260722143000_client_json_import.sql"), "utf8");
await pool.query(migration);

const clientIds = new Map();
const clientsByAcronym = new Map(
  data.clients.map((row) => [(text(row.cli_sigla) || "").toUpperCase(), row]),
);
if (contactsOnly) {
  const existing = await pool.query("select legacy_id, id from public.clients where legacy_id is not null");
  for (const row of existing.rows) clientIds.set(String(row.legacy_id), row.id);
}
for (const row of contactsOnly ? [] : data.clients) {
  const acronym = text(row.cli_sigla) || `CLI${row.cli_id}`;
  const groupClient = clientsByAcronym.get((text(row.cli_sigla_grupo) || "").toUpperCase());
  const versionReleasedAt = row.cli_data_versao || groupClient?.cli_data_versao;
  const setupAt = row.cli_data_setup || groupClient?.cli_data_setup;
  const version = versionReleasedAt ? "2.0" : null;
  const result = await pool.query(`
    insert into public.clients
      (legacy_id, acronym, group_acronym, name, legal_name, trade_name, document,
       industry, size, city, state, postal_code, active, crm_created_at, crm_updated_at,
       version, version_released_at, setup_at, address, address_number, neighborhood,
       address_complement, primary_operator, secondary_operator, inactive_at, inactive_by,
       website, state_registration, municipal_registration, cnae, tax_regime, source_payload)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32)
    on conflict (legacy_id) do update set
      acronym=excluded.acronym, group_acronym=excluded.group_acronym, name=excluded.name,
      legal_name=excluded.legal_name, trade_name=excluded.trade_name, document=excluded.document,
      industry=excluded.industry, size=excluded.size, city=excluded.city, state=excluded.state,
      postal_code=excluded.postal_code, active=excluded.active, crm_created_at=excluded.crm_created_at,
      crm_updated_at=excluded.crm_updated_at, version=excluded.version,
      version_released_at=excluded.version_released_at, setup_at=excluded.setup_at,
      address=excluded.address, address_number=excluded.address_number,
      neighborhood=excluded.neighborhood, address_complement=excluded.address_complement,
      primary_operator=excluded.primary_operator, secondary_operator=excluded.secondary_operator,
      inactive_at=excluded.inactive_at, inactive_by=excluded.inactive_by, website=excluded.website,
      state_registration=excluded.state_registration, municipal_registration=excluded.municipal_registration,
      cnae=excluded.cnae, tax_regime=excluded.tax_regime, source_payload=excluded.source_payload,
      updated_at=now()
    returning id
  `, [row.cli_id, acronym, text(row.cli_sigla_grupo), text(row.cli_nome),
    text(row.cli_razao_social) || text(row.cli_nome) || text(row.cli_nome_fantasia) || acronym,
    text(row.cli_nome_fantasia), text(row.cli_cnpj), text(row.cli_setor), text(row.cli_porte),
    text(row.cli_cidade), text(row.cli_uf), text(row.cli_cep), bool(row.cli_status),
    iso(row.created || row.cli_data_cadastro), iso(row.modified), version,
    iso(versionReleasedAt), iso(setupAt), text(row.cli_endereco), text(row.cli_numero),
    text(row.cli_bairro), text(row.cli_complemento), text(row.cli_operador_resp1),
    text(row.cli_operador_resp2), iso(row.cli_data_inativa), text(row.cli_ope_inativa),
    text(row.cli_site), text(row.cli_insc_estadual), text(row.cli_insc_municipal),
    text(row.cli_cnae), text(row.cli_regime), JSON.stringify(row)]);
  clientIds.set(String(row.cli_id), result.rows[0].id);
}

let companies = 0;
if (!contactsOnly && !clientsOnly && clientIds.size) {
  await pool.query(
    "delete from public.client_companies where client_id = any($1::uuid[])",
    [Array.from(clientIds.values())],
  );
}
for (const row of contactsOnly || clientsOnly ? [] : data.companies) {
  const clientId = clientIds.get(String(row.tab_clientes_cli_id));
  if (!clientId) continue;
  const responsible = jsonObject(row.tcl_responsavel);
  const accountant = jsonObject(row.tcl_contador);
  await pool.query(`
    insert into public.client_companies
      (client_id, legacy_key, company_number, legal_name, trade_name, document,
       state_registration, municipal_registration, cnae, industry, size, tax_regime,
       address, city, state, postal_code, responsible_name, responsible_document,
       accountant_name, accountant_phone, accountant_email, active, source_payload)
    values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,true,$22)
    on conflict (client_id, legacy_key) do update set
      company_number=excluded.company_number, legal_name=excluded.legal_name,
      trade_name=excluded.trade_name, document=excluded.document,
      state_registration=excluded.state_registration, municipal_registration=excluded.municipal_registration,
      cnae=excluded.cnae, industry=excluded.industry, size=excluded.size, tax_regime=excluded.tax_regime,
      address=excluded.address, city=excluded.city, state=excluded.state, postal_code=excluded.postal_code,
      responsible_name=excluded.responsible_name, responsible_document=excluded.responsible_document,
      accountant_name=excluded.accountant_name, accountant_phone=excluded.accountant_phone,
      accountant_email=excluded.accountant_email, source_payload=excluded.source_payload, updated_at=now()
  `, [clientId, row.id, integer(row.tcl_empresa || row.id), text(row.tcl_razao_social),
    text(row.tcl_nome_fantasia), text(row.tcl_cnpj), text(row.tcl_insc_estadual),
    text(row.tcl_insc_municipal), text(row.tcl_cnae), text(row.tcl_setor), text(row.tcl_porte),
    text(row.tcl_regime), address(row, "tcl"), text(row.tcl_cidade), text(row.tcl_uf),
    text(row.tcl_cep), text(responsible.cli_res_nome), text(responsible.cli_res_cpf),
    text(accountant.cli_ctd_nome), text(accountant.cli_ctd_tel), text(accountant.cli_ctd_email),
    JSON.stringify(row)]);
  companies++;
}

if (!clientsOnly && clientIds.size) {
  await pool.query(
    "delete from public.client_contacts where client_id = any($1::uuid[])",
    [Array.from(clientIds.values())],
  );
}
let contacts = 0;
const contactValues = [];
for (const [type, records] of clientsOnly ? [] : [["phone", data.phones], ["email", data.emails]]) {
  const occurrences = new Map();
  for (const row of records) {
    const clientId = clientIds.get(String(row.id));
    if (!clientId) continue;
    const value = text(type === "phone" ? row.telefone : row.email);
    if (!value) continue;
    const base = `${type}:${row.id}:${type === "phone" ? row.tel_order : row.eml_order}:${value}`;
    const occurrence = occurrences.get(base) || 0;
    occurrences.set(base, occurrence + 1);
    const name = text(type === "phone" ? row.contato : row.eml_contato) || (type === "phone" ? "Telefone" : "Email");
    contactValues.push([clientId, `json:${base}:${occurrence}`, name,
      type === "email" ? value : null, type === "phone" ? value : null, JSON.stringify(row)]);
    contacts++;
  }
}
for (let offset = 0; offset < contactValues.length; offset += 500) {
  const chunk = contactValues.slice(offset, offset + 500);
  const params = chunk.flat();
  const valuesSql = chunk.map((_, rowIndex) => {
    const start = rowIndex * 6;
    return `($${start + 1},$${start + 2},$${start + 3},$${start + 4},$${start + 5},$${start + 6})`;
  }).join(",");
  await pool.query(`insert into public.client_contacts
    (client_id, legacy_key, name, email, phone, source_payload)
    values ${valuesSql}
    on conflict (client_id, legacy_key) where legacy_key is not null do update set
      name=excluded.name, email=excluded.email, phone=excluded.phone,
      source_payload=excluded.source_payload, updated_at=now()`, params);
}

const counts = await pool.query(`select
  (select count(*)::int from public.clients) clients,
  (select count(*)::int from public.client_companies) companies,
  (select count(*)::int from public.client_contacts where legacy_key like 'json:%') contacts`);
console.log(JSON.stringify({ imported: { clients: data.clients.length, companies, contacts }, database: counts.rows[0] }, null, 2));
await pool.end();
