export type SefazServiceStatus = "Normal" | "Atenção" | "Instável" | "Fora do ar";

export type SefazService = {
  name: "NF-e" | "NFC-e" | "CT-e" | "MDF-e";
  status: SefazServiceStatus;
  affectedUf?: string[];
};

export type SefazStatus = {
  generalStatus: SefazServiceStatus;
  updatedAt: Date;
  services: SefazService[];
};

/**
 * Retorna o status atual dos serviços SEFAZ.
 *
 * TODO: substituir por integração real (endpoint próprio agregador
 * consumindo SEFAZ/Downdetector). Por enquanto retorna dados mockados.
 */
export async function getSefazStatus(): Promise<SefazStatus> {
  return {
    generalStatus: "Atenção",
    updatedAt: new Date(),
    services: [
      { name: "NF-e", status: "Normal" },
      { name: "NFC-e", status: "Atenção", affectedUf: ["SP", "MG"] },
      { name: "CT-e", status: "Normal" },
      { name: "MDF-e", status: "Normal" },
    ],
  };
}

export function sefazStatusTone(status: SefazServiceStatus) {
  switch (status) {
    case "Normal":
      return {
        dot: "bg-emerald-500",
        text: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/30",
        badge: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
      };
    case "Atenção":
      return {
        dot: "bg-yellow-400",
        text: "text-slate-800 dark:text-yellow-200",
        bg: "bg-yellow-300/20",
        border: "border-yellow-300/50",
        badge: "bg-yellow-300/90 text-slate-900 dark:bg-yellow-300/80 dark:text-slate-900",
      };
    case "Instável":
      return {
        dot: "bg-orange-500",
        text: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        badge: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
      };
    case "Fora do ar":
      return {
        dot: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        badge: "bg-red-500/15 text-red-700 dark:text-red-300",
      };
  }
}
