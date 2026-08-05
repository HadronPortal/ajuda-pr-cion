import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFleetEntries } from "@/lib/fleet-entry-store";
import { Fuel, Wrench, Receipt, KeyRound, MapPin } from "lucide-react";
import { formatFleetDateTime, type VehicleUsage } from "@/lib/fleet-store";

interface VehicleLastMonthStatsProps {
  vehicleId: string;
  usages: VehicleUsage[];
  onUsageClick: (usage: VehicleUsage) => void;
}

export function VehicleLastMonthStats({ vehicleId, usages, onUsageClick }: VehicleLastMonthStatsProps) {
  const allEntries = useFleetEntries();

  const stats = useMemo(() => {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    
    const entries = allEntries.filter(e => 
      e.vehicleId === vehicleId && 
      new Date(e.occurredAt) >= lastMonth
    );

    const totalCusto = entries.reduce((acc, e) => {
      if (e.type === 'abastecimento' || e.type === 'servico' || e.type === 'despesa') {
        return acc + (e.amount || 0);
      }
      return acc;
    }, 0);

    const daysCount = 30; // Mês comercial
    const costPerDay = totalCusto / daysCount;

    const counts = {
      abastecimento: entries.filter(e => e.type === 'abastecimento').length,
      servico: entries.filter(e => e.type === 'servico').length,
      despesa: entries.filter(e => e.type === 'despesa').length,
    };
    const totalSpecific = counts.abastecimento + counts.servico + counts.despesa || 1;

    return {
      totalCusto,
      costPerDay,
      pctAbastecimento: Math.round((counts.abastecimento / totalSpecific) * 100),
      pctServico: Math.round((counts.servico / totalSpecific) * 100),
      pctDespesa: Math.round((counts.despesa / totalSpecific) * 100),
    };
  }, [allEntries, vehicleId]);

  return (
    <Card className="flex flex-col border-border/50 bg-card p-5">
      <h3 className="mb-5 text-xl font-bold">Último mês</h3>
      
      <div className="mb-5 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="shrink-0 space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">Custo</p>
          <p className="text-2xl font-bold text-red-500">R$ {stats.totalCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-[11px] text-muted-foreground">R$ {stats.costPerDay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Por dia</p>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-4 lg:max-w-xl">
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-muted/20" />
            <div 
              className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-orange-500 bg-background"
              style={{ clipPath: `inset(0 0 0 0)` }} // Simplificado, a referência mostra borda cheia
            >
              <Fuel className="h-6 w-6 text-orange-500" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Abastecimentos</p>
            <p className="text-base font-bold">{stats.pctAbastecimento}%</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-muted/20 bg-background">
            <Wrench className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Serviços</p>
            <p className="text-base font-bold">{stats.pctServico}%</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-red-500/20 bg-background">
            <Receipt className="h-6 w-6 text-red-500/50" />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Despesas</p>
            <p className="text-base font-bold">{stats.pctDespesa}%</p>
          </div>
        </div>
        </div>
      </div>

      <div className="mt-4 border-t pt-4">
        <div className="mb-3 flex items-center gap-2 text-primary">
          <KeyRound className="h-4 w-4" />
          <h4 className="text-sm font-semibold">Utilizações</h4>
        </div>
        {usages.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma utilização registrada.</p>
        ) : (
          <div className="space-y-2">
            {usages.slice(0, 4).map((usage) => (
              <button key={usage.id} type="button" onClick={() => onUsageClick(usage)} className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md border px-3 py-2 text-left hover:bg-muted/40">
                <span className="min-w-0">
                  <span className="block text-sm font-medium">{usage.operatorId}</span>
                  <span className="flex items-center gap-1 truncate text-xs text-muted-foreground"><MapPin className="h-3 w-3 shrink-0" />{usage.destination}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">{formatFleetDateTime(usage.departureAt || usage.scheduledStartAt)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Button variant="outline" className="mt-5 h-10 w-full rounded-full border-primary/50 text-sm font-bold uppercase tracking-wider text-primary hover:bg-primary/5">
        Relatórios completos
      </Button>
    </Card>
  );
}
