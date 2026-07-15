import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { getSefazMonitor, type FiscalDocument, type SefazMonitorResponse } from "@/lib/sefaz-api";
import { Button } from "@/components/ui/button";

const documentLabels: Record<FiscalDocument, string> = {
  nfe: "NF-e",
  nfce: "NFC-e",
  cte: "CT-e",
};

const chartColors = {
  response: "#465a91",
  severity: "#f6ad3c",
  grid: "#e7eaf0",
  text: "#7b8098",
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

  return (
    <div className="rounded-lg border border-[#e4e6eb] bg-white px-3 py-2 text-[11px] shadow-lg dark:border-white/10 dark:bg-[#20263d]">
      <p className="mb-1 text-[#30364a] dark:text-white">SEFAZ {label}</p>
      <p className="text-[#777d91] dark:text-slate-300">Status: {point.status}</p>
      <p className="text-[#777d91] dark:text-slate-300">
        Resposta:{" "}
        {Number(payload.find((item) => item.dataKey === "responseTime")?.value ?? 0).toFixed(2)}s
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
    () =>
      selected?.states.map((state) => ({
        ...state,
        severity: state.statusCode,
      })) ?? [],
    [selected],
  );
  const affectedStates = selected?.states.filter((state) => state.statusCode > 1).length ?? 0;

  return (
    <section className="flex h-full min-h-[356px] flex-col overflow-hidden rounded-lg border border-[#e4e6eb] bg-white shadow-[0_10px_28px_rgba(35,42,68,0.06)] dark:border-white/10 dark:bg-[#20263d]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e4e6eb] px-5 py-4 dark:border-white/10">
        <div>
          <h2 className="text-[17px] font-medium text-[#30364a] dark:text-white">Status SEFAZ</h2>
          <p className="mt-0.5 text-[11px] text-[#7b8098] dark:text-slate-300">
            Monitoramento por UF via FiscalAPI
            {selected ? ` · atualizado às ${formatUpdatedAt(selected.updatedAt)}` : ""}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-[#e4e6eb] p-0.5 dark:border-white/10">
            {(Object.keys(documentLabels) as FiscalDocument[]).map((document) => (
              <button
                key={document}
                type="button"
                onClick={() => setSelectedDocument(document)}
                className={`cursor-pointer rounded px-3 py-1.5 text-[11px] transition ${selectedDocument === document ? "bg-[#465a91] text-white" : "text-[#7b8098] hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"}`}
              >
                {documentLabels[document]}
              </button>
            ))}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => void loadStatus()}
            disabled={loading}
            title="Atualizar status"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </header>

      {error ? (
        <div className="flex min-h-[270px] flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertTriangle className="h-7 w-7 text-amber-500" />
          <div>
            <p className="text-sm text-[#30364a] dark:text-white">
              Status temporariamente indisponível
            </p>
            <p className="mt-1 max-w-lg text-xs text-[#7b8098] dark:text-slate-300">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => void loadStatus()}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <div className="min-h-0 flex-1 px-2 pb-3 pt-4 sm:px-4">
          <div className="mb-2 flex items-center justify-end text-[11px] text-[#7b8098] dark:text-slate-300">
            {loading && !selected
              ? "Consultando SEFAZ..."
              : `${affectedStates} UF${affectedStates === 1 ? "" : "s"} com lentidão ou indisponibilidade`}
          </div>
          <ResponsiveContainer width="100%" height="90%" minHeight={250}>
            <ComposedChart
              data={chartData}
              margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
              barCategoryGap="42%"
            >
              <CartesianGrid stroke={chartColors.grid} strokeWidth={1} vertical={false} />
              <XAxis
                dataKey="uf"
                axisLine={false}
                tickLine={false}
                interval={0}
                tick={{ fill: chartColors.text, fontSize: 9 }}
                dy={8}
              />
              <YAxis
                yAxisId="response"
                axisLine={false}
                tickLine={false}
                width={38}
                tick={{ fill: chartColors.text, fontSize: 10 }}
                unit="s"
              />
              <YAxis yAxisId="severity" orientation="right" domain={[1, 5]} hide />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(70,90,145,0.04)" }} />
              <Bar
                yAxisId="response"
                dataKey="responseTime"
                name="Tempo de resposta"
                fill={chartColors.response}
                maxBarSize={22}
                radius={[3, 3, 0, 0]}
              />
              <Line
                yAxisId="severity"
                type="monotone"
                dataKey="severity"
                name="Severidade"
                stroke={chartColors.severity}
                strokeWidth={1.5}
                dot={{ r: 3, fill: chartColors.severity, strokeWidth: 0 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
