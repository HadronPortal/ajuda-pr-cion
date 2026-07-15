import { createServerFn } from "@tanstack/react-start";

export type FiscalDocument = "nfe" | "nfce" | "cte";

export type FiscalApiState = {
  uf: string;
  statusCode: number;
  status: string;
  responseTime: number;
};

export type FiscalApiDocumentStatus = {
  document: FiscalDocument;
  updatedAt: string;
  states: FiscalApiState[];
};

export type SefazMonitorResponse = {
  documents: FiscalApiDocumentStatus[];
  cached: boolean;
};

type FiscalApiPayload = {
  doc?: unknown;
  timestamp?: unknown;
  states?: unknown;
};

const FISCAL_API_URL = "https://api.fiscalapi.com.br/api/v1/sefaz/status";
const CACHE_TTL_MS = 2 * 60 * 1000;
const documents: FiscalDocument[] = ["nfe", "nfce", "cte"];

let cache: { expiresAt: number; data: SefazMonitorResponse } | undefined;

function parsePayload(
  document: FiscalDocument,
  payload: FiscalApiPayload,
): FiscalApiDocumentStatus {
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

  if (states.length === 0) {
    throw new Error(`A FiscalAPI não retornou estados para ${document.toUpperCase()}.`);
  }

  return {
    document,
    updatedAt: typeof payload.timestamp === "string" ? payload.timestamp : new Date().toISOString(),
    states,
  };
}

async function fetchDocumentStatus(document: FiscalDocument, apiKey: string) {
  const response = await fetch(`${FISCAL_API_URL}?doc=${document}`, {
    headers: { "X-API-Key": apiKey },
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `FiscalAPI respondeu ${response.status} ao consultar ${document.toUpperCase()}${detail ? `: ${detail.slice(0, 160)}` : ""}.`,
    );
  }

  return parsePayload(document, (await response.json()) as FiscalApiPayload);
}

export const getSefazMonitor = createServerFn({ method: "GET" }).handler(
  async (): Promise<SefazMonitorResponse> => {
    const now = Date.now();
    if (cache && cache.expiresAt > now) {
      return { ...cache.data, cached: true };
    }

    const apiKey = process.env.FISCAL_API_KEY;
    if (!apiKey) {
      throw new Error("FiscalAPI não configurada. Defina FISCAL_API_KEY no ambiente do servidor.");
    }

    const result: SefazMonitorResponse = {
      documents: await Promise.all(
        documents.map((document) => fetchDocumentStatus(document, apiKey)),
      ),
      cached: false,
    };

    cache = { expiresAt: now + CACHE_TTL_MS, data: result };
    return result;
  },
);
