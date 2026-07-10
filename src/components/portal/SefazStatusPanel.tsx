import { useEffect, useState } from "react";
import { Activity, AlertTriangle, CheckCircle2, RefreshCw, XCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getSefazStatus,
  sefazStatusTone,
  type SefazService,
  type SefazServiceStatus,
  type SefazStatus,
} from "@/lib/sefaz-status";

const statusHistory = [
  { time: "15:00", nfe: 82, nfce: 58, cte: 76, mdfe: 68 },
  { time: "18:00", nfe: 68, nfce: 82, cte: 84, mdfe: 66 },
  { time: "21:00", nfe: 69, nfce: 63, cte: 79, mdfe: 71 },
  { time: "00:00", nfe: 74, nfce: 65, cte: 72, mdfe: 74 },
  { time: "03:00", nfe: 70, nfce: 72, cte: 80, mdfe: 69 },
  { time: "06:00", nfe: 76, nfce: 66, cte: 73, mdfe: 83 },
  { time: "09:00", nfe: 81, nfce: 74, cte: 86, mdfe: 63 },
  { time: "12:00", nfe: 76, nfce: 78, cte: 72, mdfe: 72 },
  { time: "15:00", nfe: 78, nfce: 67, cte: 79, mdfe: 75 },
];

function StatusIcon({ status, className }: { status: SefazServiceStatus; className?: string }) {
  const Icon =
    status === "Normal"
      ? CheckCircle2
      : status === "Fora do ar"
        ? XCircle
        : AlertTriangle;
  return <Icon className={className} />;
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function ServiceCard({ svc }: { svc: SefazService }) {
  const tone = sefazStatusTone(svc.status);
  return (
    <div
      className={cn(
        "flex min-h-[66px] min-w-0 items-start gap-2.5 rounded-xl border bg-[#eef8ff]/95 px-3.5 py-3 shadow-[0_12px_26px_rgba(20,76,135,0.12)] dark:bg-[#eaf6ff]/95",
        tone.border,
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg",
          tone.bg,
          tone.text,
        )}
      >
        <StatusIcon status={svc.status} className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-bold leading-none text-foreground">{svc.name}</p>
        <p className={cn("mt-1 text-[10.5px] font-semibold leading-none", tone.text)}>
          {svc.status}
        </p>
        {svc.affectedUf && svc.affectedUf.length > 0 && (
          <p className="mt-1 truncate text-[10px] text-muted-foreground">
            UFs: {svc.affectedUf.join(", ")}
          </p>
        )}
      </div>
    </div>
  );
}

function ChartLegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}

export function SefazStatusPanel() {
  const [data, setData] = useState<SefazStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const s = await getSefazStatus();
      setData(s);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const tone = data ? sefazStatusTone(data.generalStatus) : sefazStatusTone("Normal");
  const affectedUfs = data
    ? Array.from(new Set(data.services.flatMap((s) => s.affectedUf ?? [])))
    : [];

  return (
    <>
      <div className="relative h-full min-h-[356px] overflow-hidden rounded-2xl border border-white/14 bg-[linear-gradient(180deg,rgba(48,177,231,0.66)_0%,rgba(37,145,215,0.52)_54%,rgba(29,108,188,0.38)_100%)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] backdrop-blur-md">
        <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-cyan-200/18 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-950/12 blur-3xl" />
        <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-white/14 text-[#8ee8ff]">
              <Activity className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                Status SEFAZ
              </p>
              <p className="text-[10.5px] text-white/70">
                {data ? `Atualizado há 2 min · ${formatTime(data.updatedAt)}` : "Carregando..."}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/18 px-3 py-1.5 text-[11px] font-bold text-white">
            <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
            {data?.generalStatus ?? "-"}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {(data?.services ?? []).map((s) => (
            <ServiceCard key={s.name} svc={s} />
          ))}
        </div>

        <div className="mt-4">
          <p className="mb-2 text-[11px] font-semibold text-white/86">
            Histórico de status (últimas 24h)
          </p>
          <div className="h-[132px] overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={statusHistory} margin={{ top: 12, right: 12, left: 12, bottom: 8 }}>
                <defs>
                  {[
                    { id: "fillNfe", color: "#55e3ad" },
                    { id: "fillNfce", color: "#ffd04d" },
                    { id: "fillCte", color: "#59d9ff" },
                    { id: "fillMdfe", color: "#8cf45f" },
                  ].map((g) => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={g.color} stopOpacity={0.45} />
                      <stop offset="100%" stopColor={g.color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.14)" strokeDasharray="4 4" />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.72)", fontSize: 10 }} />
                <YAxis tickFormatter={(v) => `${v}%`} tickLine={false} axisLine={false} tick={{ fill: "rgba(255,255,255,0.70)", fontSize: 10 }} domain={[0, 100]} ticks={[0, 25, 50, 75, 100]} width={44} />
                <Tooltip
                  contentStyle={{
                    border: "0",
                    borderRadius: 12,
                    background: "rgba(25,29,51,0.94)",
                    color: "#fff",
                    fontSize: 11,
                  }}
                />
                <Area type="monotone" dataKey="nfe" stroke="none" fill="url(#fillNfe)" isAnimationActive={false} activeDot={false} />
                <Area type="monotone" dataKey="nfce" stroke="none" fill="url(#fillNfce)" isAnimationActive={false} activeDot={false} />
                <Area type="monotone" dataKey="cte" stroke="none" fill="url(#fillCte)" isAnimationActive={false} activeDot={false} />
                <Area type="monotone" dataKey="mdfe" stroke="none" fill="url(#fillMdfe)" isAnimationActive={false} activeDot={false} />
                <Line type="monotone" dataKey="nfe" stroke="#55e3ad" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="nfce" stroke="#ffd04d" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="cte" stroke="#59d9ff" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="mdfe" stroke="#8cf45f" strokeWidth={2.5} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-1 flex justify-center gap-5 text-[10px] font-semibold text-white/82">
            <ChartLegendDot color="#55e3ad" label="NF-e" />
            <ChartLegendDot color="#ffd04d" label="NFC-e" />
            <ChartLegendDot color="#59d9ff" label="CT-e" />
            <ChartLegendDot color="#8cf45f" label="MDF-e" />
          </div>
        </div>


        <div className="mt-3 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-white/20 disabled:opacity-60"
          >
            <RefreshCw className={cn("h-3 w-3", loading && "animate-spin")} />
            Atualizar
          </button>
          <Button
            size="sm"
            onClick={() => setOpen(true)}
            className="h-8 cursor-pointer rounded-full bg-[#191d33] px-4 text-[12px] text-white hover:bg-[#191d33]/90"
          >
            Ver detalhes
          </Button>
        </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl border border-border bg-background p-6">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold text-foreground">
              Status SEFAZ - detalhes
            </DialogTitle>
            {data && (
              <p className="text-[12px] text-muted-foreground">
                Ultima atualizacao: {data.updatedAt.toLocaleString("pt-BR")}
              </p>
            )}
          </DialogHeader>

          {data && (
            <div className="mt-2 space-y-2">
              {data.services.map((svc) => {
                const t = sefazStatusTone(svc.status);
                return (
                  <div
                    key={svc.name}
                    className={cn(
                      "flex items-start gap-3 rounded-xl border bg-card px-3 py-2.5",
                      t.border,
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg",
                        t.bg,
                        t.text,
                      )}
                    >
                      <StatusIcon status={svc.status} className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[13px] font-bold text-foreground">{svc.name}</p>
                        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", t.badge)}>
                          {svc.status}
                        </span>
                      </div>
                      {svc.affectedUf && svc.affectedUf.length > 0 ? (
                        <p className="mt-1 text-[11.5px] text-muted-foreground">
                          UFs afetadas: {svc.affectedUf.join(", ")}
                        </p>
                      ) : (
                        <p className="mt-1 text-[11.5px] text-muted-foreground">
                          Sem ocorrencias no momento.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-4 text-[11px] text-muted-foreground">
            Dados atualmente mockados - integracao com fonte oficial em breve.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
