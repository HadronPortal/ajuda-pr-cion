import { cvsOptions } from "@/lib/cvs-catalogs-imported";

export type HadronOption = {
  id: string;
  option: string;
  form: string;
  description: string;
  label: string;
};

export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

type CvsOption = { id: string; option: string; form: string; description: string };

export const hadronOptions: HadronOption[] = (
  cvsOptions as readonly CvsOption[]
).map((item) => ({
  id: item.id,
  option: item.option,
  form: item.form,
  description: item.description,
  label: `${item.description} (${item.option} - ${item.form || item.option})`,
}));

function search(query: string, formFirst: boolean, limit = 10) {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  return hadronOptions
    .filter((item) => {
      const value = formFirst
        ? `${item.form} ${item.description} ${item.option}`
        : `${item.option} ${item.description} ${item.form}`;
      return normalizeSearch(value).includes(normalized);
    })
    .slice(0, limit);
}

export function searchHadronOptions(query: string, limit = 10) {
  return search(query, false, limit);
}

export function searchHadronForms(query: string, limit = 10) {
  return search(query, true, limit);
}
