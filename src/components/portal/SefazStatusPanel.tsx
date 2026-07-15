import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getSefazMonitor, type FiscalDocument, type SefazMonitorResponse } from "@/lib/sefaz-api";

const documentLabels: Record<FiscalDocument, string> = {
  nfe: "NF-e",
  nfce: "NFC-e",
  cte: "CT-e",
};

function formatUpdatedAt(value?: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey: string; value: number; payload: { status: string } }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  const responseTime = Number(payload.find((item) => item.dataKey === "responseTime")?.value ?? 0);

  return (
    <div className="rounded border border-[#56575f] bg-[#34353b] px-3 py-2 text-xs shadow-xl">
      <p className="text-white">SEFAZ {label}</p>
      <p className="mt-1 text-[#b9bbc5]">
        {point.status} · {responseTime.toFixed(2)}s
      </p>
    </div>
  );
}

export function SefazStatusPanel() {
  const [data, setData] = useState<SefazMonitorResponse>();
  const [selectedDocument, setSelectedDocument] = useState<FiscalDocument>("nfe");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      setData(await getSefazMonitor());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Não foi possível consultar a FiscalAPI.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  const selected = data?.documents.find((item) => item.document === selectedDocument);
  const chartData = useMemo(
    () => selected?.states.map((state) => ({ ...state, normalLimit: 2 })) ?? [],
    [selected],
  );
  const affectedStates = selected?.states.filter((state) => state.statusCode > 1).length ?? 0;
  const maxResponse = Math.max(10, ...chartData.map((state) => state.responseTime));
  const yAxisMax = Math.ceil(maxResponse / 10) * 10;

  return (
    <section className="overflow-hidden rounded-[20px] bg-[#42434b] text-white shadow-[0_14px_36px_rgba(15,16,20,0.18)]">
      <header className="flex min-h-[65px] flex-wrap items-center justify-between gap-3 px-7 py-3">
        <div>
          <h2 className="text-[22px] font-normal leading-tight">
            Falhas com a SEFAZ detectadas em tempo real
          </h2>
          <p className="mt-1 text-[11px] text-[#b9bbc5]">
            FiscalAPI ·{" "}
            {selected ? `atualizado às ${formatUpdatedAt(selected.updatedAt)}` : "consultando..."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-[#5a5b63] bg-[#34353b] p-0.5">
            {(Object.keys(documentLabels) as FiscalDocument[]).map((document) => (
              <button
                key={document}
                type="button"
                onClick={() => setSelectedDocument(document)}
                className={`cursor-pointer rounded px-3 py-1.5 text-xs transition-colors ${selectedDocument === document ? "bg-[#11a6b2] text-white" : "text-[#c7c8cf] hover:bg-white/10"}`}
              >
                {documentLabels[document]}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => void loadStatus()}
            disabled={loading}
            title="Atualizar status"
            className="grid h-9 w-9 cursor-pointer place-items-center rounded-md border border-[#5a5b63] bg-[#34353b] text-[#d9dae0] transition hover:bg-[#505159] disabled:cursor-wait"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </header>

      <div className="bg-[#25262a]">
        {error ? (
          <div className="flex min-h-[360px] flex-col items-center justify-center gap-3 px-6 text-center">
            <AlertTriangle className="h-8 w-8 text-[#16b3bd]" />
            <p className="text-sm text-white">Status temporariamente indisponível</p>
            <p className="max-w-lg text-xs text-[#a9abb5]">{error}</p>
            <button
              type="button"
              onClick={() => void loadStatus()}
              className="cursor-pointer rounded-full bg-[#11a6b2] px-5 py-2 text-sm text-white hover:bg-[#1396a0]"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <div className="relative h-[365px] px-4 pb-2 pt-5 sm:px-6">
            <div className="pointer-events-none absolute inset-x-0 top-[68px] z-10 text-center text-[34px] text-white/20">
              Prócion Monitor
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 8 }}>
                <defs>
                  <linearGradient id="sefazIncidentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#12b8c2" stopOpacity={0.92} />
                    <stop offset="100%" stopColor="#0d8d96" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#505159" strokeDasharray="5 6" vertical horizontal={false} />
                <XAxis
                  dataKey="uf"
                  axisLine={{ stroke: "#55565d" }}
                  tickLine={{ stroke: "#55565d" }}
                  interval={2}
                  tick={{ fill: "#999ba6", fontSize: 11 }}
                  dy={8}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  domain={[0, yAxisMax]}
                  width={38}
                  tick={{ fill: "#999ba6", fontSize: 11 }}
                />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: "#666870" }} />
                <Area
                  type="linear"
                  dataKey="responseTime"
                  stroke="#13b8c3"
                  strokeWidth={1.25}
                  fill="url(#sefazIncidentFill)"
                  dot={false}
                  activeDot={{ r: 4, fill: "#13b8c3", stroke: "#fff", strokeWidth: 1 }}
                />
                <Line
                  type="monotone"
                  dataKey="normalLimit"
                  stroke="#fff"
                  strokeWidth={2}
                  strokeDasharray="6 5"
                  dot={false}
                  activeDot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <footer className="flex min-h-[78px] items-center justify-center px-5 py-3">
        <a
          href="https://docs.fiscalapi.com.br/docs/sefaz-monitor/status-sefaz"
          target="_blank"
          rel="noreferrer"
          className="inline-flex cursor-pointer items-center rounded-full bg-[#e51c34] px-7 py-2.5 text-sm text-white transition hover:bg-[#ca162c]"
        >
          Saiba mais sobre a metodologia
        </a>
        <span className="absolute sr-only">{affectedStates} UFs com instabilidade</span>
      </footer>
    </section>
  );
}
