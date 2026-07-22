import source from "@/data/cvs-versions.json";

export type ErpVersion = {
  id: string;
  versao: string;
  data_versao: string;
  data_runtime: string;
  data_arq: string;
  data_arq_bas: string;
  data_alterar: string;
};

const entries = source as Array<{
  type: string;
  name?: string;
  data?: ErpVersion[];
}>;

const versionTable = entries.find(
  (entry) => entry.type === "table" && entry.name === "cvs_versions",
);

export const erpVersions = [...(versionTable?.data ?? [])].sort((a, b) =>
  b.data_versao.localeCompare(a.data_versao),
);

export const latestErpVersion = erpVersions[0];

const toIsoDate = (value: string) => {
  const trimmed = value.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const match = trimmed.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return match ? `${match[3]}-${match[2]}-${match[1]}` : "";
};

export const isErpVersionOutdated = (releaseDate: string) => {
  const clientReleaseDate = toIsoDate(releaseDate);
  return Boolean(
    clientReleaseDate &&
      latestErpVersion &&
      clientReleaseDate < latestErpVersion.data_versao,
  );
};

export const formatVersionDate = (value: string) => {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
};
