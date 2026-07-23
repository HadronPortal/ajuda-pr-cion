import { supabase } from "@/lib/supabase";

export type ClientContact = {
  id: string;
  name: string;
  value: string;
};

export type ClientCompanySummary = {
  id: string;
  companyNumber: number | null;
  legalName: string;
  tradeName: string;
  document: string;      // CNPJ formatado (00.000.000/0000-00) quando 14 dígitos
  documentRaw: string;   // apenas dígitos
  city: string;
  state: string;
  isPrincipal: boolean;
};

export type ClientContactsBundle = {
  clientId: string | null;
  emails: ClientContact[];
  phones: ClientContact[];
  companies: ClientCompanySummary[];
};

type RawContact = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  active?: boolean | null;
  deleted_at?: string | null;
};

type RawCompany = {
  id?: string | null;
  company_number?: number | null;
  legal_name?: string | null;
  trade_name?: string | null;
  document?: string | null;
  city?: string | null;
  state?: string | null;
};

const collator = new Intl.Collator("pt-BR", { sensitivity: "base" });

function isEmailValid(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizePhone(value: string): string {
  return value.replace(/\D+/g, "");
}

function isPhoneValid(value: string): boolean {
  const digits = normalizePhone(value);
  return digits.length >= 8 && digits.length <= 13;
}

function sortContacts(list: ClientContact[]): ClientContact[] {
  return [...list].sort(
    (a, b) => collator.compare(a.name, b.name) || collator.compare(a.value, b.value),
  );
}

function dedupe(list: ClientContact[]): ClientContact[] {
  const seen = new Set<string>();
  const out: ClientContact[] = [];
  for (const item of list) {
    const key = `${item.value.toLowerCase()}|${item.name.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(item);
  }
  return out;
}

function formatCnpj(value: string): string {
  const digits = value.replace(/\D+/g, "");
  if (digits.length !== 14) return value;
  return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

function mapCompanies(raw: RawCompany[]): ClientCompanySummary[] {
  const list = raw
    .filter((c) => c && (c.id || c.document || c.legal_name || c.trade_name))
    .map<ClientCompanySummary>((c) => {
      const documentRaw = String(c.document ?? "").replace(/\D+/g, "");
      // "Principal" quando company_number = 1 ou quando CNPJ termina em /0001-XX.
      const isPrincipalByCnpj = documentRaw.length === 14 && documentRaw.slice(8, 12) === "0001";
      const isPrincipalByNumber = c.company_number === 1;
      return {
        id: String(c.id ?? documentRaw ?? Math.random()),
        companyNumber: typeof c.company_number === "number" ? c.company_number : null,
        legalName: String(c.legal_name ?? "").trim(),
        tradeName: String(c.trade_name ?? "").trim(),
        document: documentRaw ? formatCnpj(documentRaw) : String(c.document ?? ""),
        documentRaw,
        city: String(c.city ?? "").trim(),
        state: String(c.state ?? "").trim().toUpperCase(),
        isPrincipal: isPrincipalByCnpj || isPrincipalByNumber,
      };
    });

  // Se nenhuma foi marcada como principal, marca a de menor company_number.
  if (list.length > 0 && !list.some((c) => c.isPrincipal)) {
    const min = list.reduce((acc, c) =>
      (c.companyNumber ?? Number.POSITIVE_INFINITY) < (acc.companyNumber ?? Number.POSITIVE_INFINITY) ? c : acc,
    list[0]);
    min.isPrincipal = true;
  }

  // Ordena: principal primeiro; depois por company_number asc; fallback pelo nome.
  return list.sort((a, b) => {
    if (a.isPrincipal !== b.isPrincipal) return a.isPrincipal ? -1 : 1;
    const an = a.companyNumber ?? Number.POSITIVE_INFINITY;
    const bn = b.companyNumber ?? Number.POSITIVE_INFINITY;
    if (an !== bn) return an - bn;
    return collator.compare(a.tradeName || a.legalName, b.tradeName || b.legalName);
  });
}

export async function fetchClientContacts(acronym: string): Promise<ClientContactsBundle> {
  if (!acronym) return { clientId: null, emails: [], phones: [], companies: [] };
  const { data, error } = await supabase.rpc("get_crm_client", { client_acronym: acronym });
  if (error) throw error;

  const clientId = (data?.client?.id as string | undefined) ?? null;
  const raw: RawContact[] = Array.isArray(data?.contacts) ? (data.contacts as RawContact[]) : [];
  const rawCompanies: RawCompany[] = Array.isArray(data?.companies) ? (data.companies as RawCompany[]) : [];

  const emails: ClientContact[] = [];
  const phones: ClientContact[] = [];

  for (const c of raw) {
    if (!c || c.active === false || c.deleted_at) continue;
    const name = (c.name ?? "").trim() || "Contato";
    if (c.email) {
      const value = c.email.trim();
      if (value && isEmailValid(value)) emails.push({ id: String(c.id ?? value), name, value });
    }
    if (c.phone) {
      const value = c.phone.trim();
      if (value && isPhoneValid(value)) phones.push({ id: String(c.id ?? value), name, value });
    }
  }

  return {
    clientId,
    emails: sortContacts(dedupe(emails)),
    phones: sortContacts(dedupe(phones)),
    companies: mapCompanies(rawCompanies),
  };
}

export async function addClientContact(
  clientId: string,
  kind: "email" | "phone",
  value: string,
  name: string,
): Promise<ClientContact> {
  const trimmedValue = value.trim();
  const trimmedName = name.trim() || trimmedValue;
  if (kind === "email" && !isEmailValid(trimmedValue)) {
    throw new Error("E-mail inválido.");
  }
  if (kind === "phone" && !isPhoneValid(trimmedValue)) {
    throw new Error("Telefone inválido.");
  }
  const { data, error } = await supabase.rpc("add_client_contact", {
    p_client_id: clientId,
    p_kind: kind,
    p_value: trimmedValue,
    p_name: trimmedName,
  });
  if (error) throw error;
  const row = (data ?? {}) as RawContact;
  const displayValue = (kind === "email" ? row.email : row.phone) ?? trimmedValue;
  return {
    id: String(row.id ?? `${kind}-${Date.now()}`),
    name: (row.name ?? trimmedName) || "Contato",
    value: displayValue,
  };
}

export function formatPhoneDisplay(value: string): string {
  const digits = normalizePhone(value);
  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 13 && digits.startsWith("55")) {
    const rest = digits.slice(2);
    return `+55 (${rest.slice(0, 2)}) ${rest.slice(2, 7)}-${rest.slice(7)}`;
  }
  return value;
}
