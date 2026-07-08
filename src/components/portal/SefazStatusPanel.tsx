import { useEffect, useState } from "react";
import { Activity, CheckCircle2, RefreshCw, AlertTriangle, XCircle } from "lucide-react";
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
        "flex min-w-0 items-start gap-2 rounded-xl border bg-white/95 px-2.5 py-2 dark:bg-[#20263d]/95",
        tone.border,
      )}
    >
      <span
        className={cn(
          "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md",
          tone.bg,
          tone.text,
        )}
      >
        <StatusIcon status={svc.status} className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-bold leading-none text-foreground">{svc.name}</p>
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
      <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white">
              <Activity className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-white/80">
                Status SEFAZ
              </p>
              <p className="text-[10.5px] text-white/60">
                {data ? `Atualizado ${formatTime(data.updatedAt)}` : "Carregando..."}
              </p>
            </div>
          </div>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold",
              tone.badge,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
            {data?.generalStatus ?? "—"}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(data?.services ?? []).map((s) => (
            <ServiceCard key={s.name} svc={s} />
          ))}
        </div>

        {affectedUfs.length > 0 && (
          <p className="mt-3 text-[11px] text-white/85">
            UFs com instabilidade:{" "}
            <span className="font-semibold text-white">{affectedUfs.join(", ")}</span>
          </p>
        )}

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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg rounded-2xl border border-border bg-background p-6">
          <DialogHeader>
            <DialogTitle className="text-[16px] font-bold text-foreground">
              Status SEFAZ — detalhes
            </DialogTitle>
            {data && (
              <p className="text-[12px] text-muted-foreground">
                Última atualização: {data.updatedAt.toLocaleString("pt-BR")}
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
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                            t.badge,
                          )}
                        >
                          {svc.status}
                        </span>
                      </div>
                      {svc.affectedUf && svc.affectedUf.length > 0 ? (
                        <p className="mt-1 text-[11.5px] text-muted-foreground">
                          UFs afetadas: {svc.affectedUf.join(", ")}
                        </p>
                      ) : (
                        <p className="mt-1 text-[11.5px] text-muted-foreground">
                          Sem ocorrências no momento.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-4 text-[11px] text-muted-foreground">
            Dados atualmente mockados — integração com fonte oficial em breve.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
