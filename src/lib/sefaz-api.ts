import { createServerFn } from "@tanstack/react-start";

export type FiscalDocument = "nfe" | "nfce" | "cte" | "mdfe";

export type SefazState = {
  uf: string;
  statusCode: number;
  status: string;
  responseTime: number;
  description?: string;
};

export type SefazDocumentStatus = {
  document: FiscalDocument;
  updatedAt: string;
  states: SefazState[];
  metric: "status" | "latency";
};

export type SefazMonitorResponse = {
  documents: SefazDocumentStatus[];
  cached: boolean;
  source: "Webmania" | "FiscalAPI";
};

type FiscalApiPayload = {
  timestamp?: unknown;
  states?: unknown;
};

type WebmaniaComponent = {
  name?: unknown;
  description?: unknown;
  status?: unknown;
  group?: { name?: unknown } | null;
};

type WebmaniaPayload = {
  components?: unknown;
};

const WEBMANIA_API_URL = "https://monitorsefaz.webmaniabr.com/v3/components.json";
const FISCAL_API_URL = "https://api.fiscalapi.com.br/api/v1/sefaz/status";
const CACHE_TTL_MS = 60 * 1000;
const fiscalApiDocuments: FiscalDocument[] = ["nfe", "nfce", "cte"];

const webmaniaGroups: Record<string, FiscalDocument> = {
  "Autorizadores de NF-e": "nfe",
  "Autorizadores de NFC-e": "nfce",
  "Autorizadores de CT-e": "cte",
  "Autorizadores de MDF-e": "mdfe",
};

const webmaniaStatuses: Record<string, { code: number; label: string; level: number }> = {
  OPERATIONAL: { code: 1, label: "Operacional", level: 0 },
  UNDERMAINTENANCE: { code: 2, label: "Em manutenção", level: 3 },
  DEGRADEDPERFORMANCE: { code: 3, label: "Desempenho degradado", level: 5 },
  PARTIALOUTAGE: { code: 4, label: "Indisponibilidade parcial", level: 7 },
  MAJOROUTAGE: { code: 5, label: "Indisponível", level: 10 },
};

let cache: { expiresAt: number; data: SefazMonitorResponse } | undefined;

function parseWebmania(payload: WebmaniaPayload): SefazMonitorResponse {
  if (!Array.isArray(payload.components)) {
    throw new Error("Resposta inválida do Monitor SEFAZ Webmania.");
  }

  const grouped = new Map<FiscalDocument, SefazState[]>();
  for (const entry of payload.components as WebmaniaComponent[]) {
    const groupName = entry.group?.name;
    if (typeof groupName !== "string" || typeof entry.name !== "string") continue;
    const document = webmaniaGroups[groupName];
    if (!document) continue;

    const rawStatus = typeof entry.status === "string" ? entry.status : "MAJOROUTAGE";
    const status = webmaniaStatuses[rawStatus] ?? {
      code: 5,
      label: "Status desconhecido",
      level: 10,
    };
    const states = grouped.get(document) ?? [];
    states.push({
      uf: entry.name,
      statusCode: status.code,
      status: status.label,
      responseTime: status.level,
      description: typeof entry.description === "string" ? entry.description : undefined,
    });
    grouped.set(document, states);
  }

  const updatedAt = new Date().toISOString();
  const documents = (Object.values(webmaniaGroups) as FiscalDocument[])
    .filter((document, index, all) => all.indexOf(document) === index)
    .flatMap((document) => {
      const states = grouped.get(document);
      return states?.length ? [{ document, updatedAt, states, metric: "status" as const }] : [];
    });

  if (
    !documents.some(
      (document) =>
        document.document === "nfe" && document.states.some((state) => state.uf === "SP"),
    )
  ) {
    throw new Error("O Monitor SEFAZ Webmania não retornou o autorizador SP para NF-e.");
  }

  return { documents, cached: false, source: "Webmania" };
}

async function fetchWebmaniaStatus() {
  const response = await fetch(WEBMANIA_API_URL, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Webmania respondeu ${response.status}.`);
  return parseWebmania((await response.json()) as WebmaniaPayload);
}

function parseFiscalApi(document: FiscalDocument, payload: FiscalApiPayload): SefazDocumentStatus {
  if (!Array.isArray(payload.states)) {
    throw new Error(`Resposta inválida da FiscalAPI para ${document.toUpperCase()}.`);
  }

  const states = payload.states.flatMap((entry) => {
    if (entry == null || typeof entry !== "object") return [];
    const state = entry as Record<string, unknown>;
    if (typeof state.uf !== "string" || typeof state.status_code !== "number") return [];
    return [
      {
        uf: state.uf,
        statusCode: state.status_code,
        status: typeof state.status === "string" ? state.status : "Indisponível",
        responseTime: typeof state.status_avg === "number" ? state.status_avg : 0,
      },
    ];
  });

  if (!states.length)
    throw new Error(`A FiscalAPI não retornou estados para ${document.toUpperCase()}.`);
  return {
    document,
    updatedAt: typeof payload.timestamp === "string" ? payload.timestamp : new Date().toISOString(),
    states,
    metric: "latency",
  };
}

async function fetchFiscalApiFallback(apiKey: string): Promise<SefazMonitorResponse> {
  const documents = await Promise.all(
    fiscalApiDocuments.map(async (document) => {
      const response = await fetch(`${FISCAL_API_URL}?doc=${document}`, {
        headers: { "X-API-Key": apiKey },
      });
      if (!response.ok) throw new Error(`FiscalAPI respondeu ${response.status}.`);
      return parseFiscalApi(document, (await response.json()) as FiscalApiPayload);
    }),
  );
  return { documents, cached: false, source: "FiscalAPI" };
}

export const getSefazMonitor = createServerFn({ method: "GET" }).handler(
  async (): Promise<SefazMonitorResponse> => {
    const now = Date.now();
    if (cache && cache.expiresAt > now) return { ...cache.data, cached: true };

    let result: SefazMonitorResponse;
    try {
      result = await fetchWebmaniaStatus();
    } catch (webmaniaError) {
      const apiKey = process.env.FISCAL_API_KEY;
      if (!apiKey) throw webmaniaError;
      console.warn("Monitor Webmania indisponível; usando FiscalAPI como fallback.", webmaniaError);
      result = await fetchFiscalApiFallback(apiKey);
    }

    cache = { expiresAt: now + CACHE_TTL_MS, data: result };
    return result;
  },
);
