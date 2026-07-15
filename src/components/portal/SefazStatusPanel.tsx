import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const sefazChartData = [
  { time: "00h", autorizacoes: 34, ocorrencias: 8, disponibilidade: 89 },
  { time: "02h", autorizacoes: 65, ocorrencias: 12, disponibilidade: 98 },
  { time: "04h", autorizacoes: 46, ocorrencias: 7, disponibilidade: 68 },
  { time: "06h", autorizacoes: 68, ocorrencias: 17, disponibilidade: 109 },
  { time: "08h", autorizacoes: 49, ocorrencias: 21, disponibilidade: 77 },
  { time: "10h", autorizacoes: 61, ocorrencias: 11, disponibilidade: 84 },
  { time: "12h", autorizacoes: 42, ocorrencias: 5, disponibilidade: 51 },
  { time: "14h", autorizacoes: 44, ocorrencias: 9, disponibilidade: 29 },
  { time: "16h", autorizacoes: 78, ocorrencias: 7, disponibilidade: 92 },
  { time: "18h", autorizacoes: 52, ocorrencias: 29, disponibilidade: 41 },
  { time: "20h", autorizacoes: 63, ocorrencias: 12, disponibilidade: 88 },
];

const chartColors = {
  primary: "#465a91",
  accent: "#0eae98",
  line: "#f6ad3c",
  grid: "#e7eaf0",
  text: "#7b8098",
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-[#e4e6eb] bg-white px-3 py-2 shadow-lg">
      <p className="mb-1.5 text-[11px] text-[#555b6f]">{label}</p>
      {payload.map((item) => (
        <div key={item.name} className="flex items-center justify-between gap-5 text-[11px]">
          <span className="inline-flex items-center gap-1.5 text-[#777d91]">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name}
          </span>
          <span className="text-[#30364a]">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

export function SefazStatusPanel() {
  return (
    <section className="flex h-full min-h-[356px] flex-col overflow-hidden rounded-lg border border-[#e4e6eb] bg-white shadow-[0_10px_28px_rgba(35,42,68,0.06)]">
      <header className="border-b border-[#e4e6eb] px-5 py-4">
        <h2 className="text-[17px] font-medium text-[#30364a]">Status SEFAZ</h2>
        <p className="mt-0.5 text-[11px] text-[#7b8098]">
          Autorizações, ocorrências e disponibilidade nas últimas 24 horas
        </p>
      </header>

      <div className="min-h-0 flex-1 px-2 pb-2 pt-4 sm:px-4">
        <ResponsiveContainer width="100%" height="100%" minHeight={270}>
          <ComposedChart
            data={sefazChartData}
            margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
            barGap={2}
            barCategoryGap="54%"
          >
            <defs>
              <linearGradient id="sefazAvailabilityFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColors.line} stopOpacity={0.18} />
                <stop offset="100%" stopColor={chartColors.line} stopOpacity={0.04} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke={chartColors.grid}
              strokeWidth={1}
              vertical
              horizontal={false}
            />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: chartColors.text, fontSize: 11 }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={44}
              domain={[0, 120]}
              ticks={[0, 20, 40, 60, 80, 100, 120]}
              tick={{ fill: chartColors.text, fontSize: 10.5 }}
              tickFormatter={(value) => Number(value).toFixed(2)}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(70,90,145,0.04)" }} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              iconSize={9}
              wrapperStyle={{
                color: chartColors.text,
                fontSize: 11,
                paddingTop: 20,
              }}
            />

            <Area
              type="monotone"
              dataKey="disponibilidade"
              name="Disponibilidade"
              legendType="none"
              stroke="none"
              fill="url(#sefazAvailabilityFill)"
              isAnimationActive={false}
            />
            <Bar
              dataKey="autorizacoes"
              name="Autorizações"
              fill={chartColors.primary}
              maxBarSize={20}
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="ocorrencias"
              name="Ocorrências"
              fill={chartColors.accent}
              maxBarSize={20}
              radius={[0, 0, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="disponibilidade"
              name="Disponibilidade"
              stroke={chartColors.line}
              strokeWidth={1.25}
              strokeDasharray="3 3"
              dot={{ r: 3.5, fill: chartColors.line, stroke: chartColors.line }}
              activeDot={{ r: 5, fill: chartColors.line, stroke: "#fff", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
