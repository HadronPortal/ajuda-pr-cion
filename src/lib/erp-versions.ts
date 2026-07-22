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

export const latestErpAlterationDate = latestErpVersion?.data_alterar ?? "";

const ERP_2_CUTOFF_DATE = "2025-07-28";

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
      latestErpAlterationDate &&
      clientReleaseDate < latestErpAlterationDate,
  );
};

export const getClientErpVersionStatus = (version: string, releaseDate: string) => {
  const normalizedVersion = version.trim();
  const clientReleaseDate = toIsoDate(releaseDate);
  const isMissing = !normalizedVersion && !clientReleaseDate;
  const isVersion2 =
    normalizedVersion === "2.0" || clientReleaseDate >= ERP_2_CUTOFF_DATE;
  const isLegacy = !isMissing && !isVersion2;
  const isOutdated = isErpVersionOutdated(releaseDate);

  return {
    displayVersion: isMissing ? "Sem versão" : isVersion2 ? "2.0" : normalizedVersion || "1.X",
    isMissing,
    isLegacy,
    isOutdated,
    needsAttention: isMissing || isLegacy || isOutdated,
    label: isMissing
      ? "Sem versão"
      : isLegacy
        ? "Versão anterior"
        : isOutdated
          ? "Desatualizada"
          : "Atualizada",
  };
};

export const formatVersionDate = (value: string) => {
  const [year, month, day] = value.split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
};
