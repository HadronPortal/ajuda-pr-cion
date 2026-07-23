import { supabase } from "@/lib/supabase";

export type ClientContact = {
  id: string;
  name: string;
  value: string;
};

export type ClientContactsBundle = {
  clientId: string | null; // uuid real do cliente
  emails: ClientContact[];
  phones: ClientContact[];
};

type RawContact = {
  id?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  active?: boolean | null;
  deleted_at?: string | null;
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

export async function fetchClientContacts(acronym: string): Promise<ClientContactsBundle> {
  if (!acronym) return { clientId: null, emails: [], phones: [] };
  const { data, error } = await supabase.rpc("get_crm_client", { client_acronym: acronym });
  if (error) throw error;

  const clientId = (data?.client?.id as string | undefined) ?? null;
  const raw: RawContact[] = Array.isArray(data?.contacts) ? (data.contacts as RawContact[]) : [];

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
