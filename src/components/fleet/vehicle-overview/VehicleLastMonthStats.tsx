import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFleetEntries } from "@/lib/fleet-entry-store";
import { Fuel, Wrench, Receipt } from "lucide-react";

interface VehicleLastMonthStatsProps {
  vehicleId: string;
}

export function VehicleLastMonthStats({ vehicleId }: VehicleLastMonthStatsProps) {
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

    const totalReceita = entries.reduce((acc, e) => {
      if (e.type === 'receita') return acc + (e.amount || 0);
      return acc;
    }, 0);

    const daysCount = 30; // Mês comercial
    const costPerDay = totalCusto / daysCount;
    const revenuePerDay = totalReceita / daysCount;

    const counts = {
      abastecimento: entries.filter(e => e.type === 'abastecimento').length,
      servico: entries.filter(e => e.type === 'servico').length,
      despesa: entries.filter(e => e.type === 'despesa').length,
    };
    const totalSpecific = counts.abastecimento + counts.servico + counts.despesa || 1;

    return {
      totalCusto,
      totalReceita,
      costPerDay,
      revenuePerDay,
      pctAbastecimento: Math.round((counts.abastecimento / totalSpecific) * 100),
      pctServico: Math.round((counts.servico / totalSpecific) * 100),
      pctDespesa: Math.round((counts.despesa / totalSpecific) * 100),
    };
  }, [allEntries, vehicleId]);

  return (
    <Card className="p-6 flex flex-col h-full bg-card border-border/50">
      <h3 className="text-xl font-bold mb-8">Último mês</h3>
      
      <div className="grid grid-cols-2 gap-8 mb-12">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">Custo</p>
          <p className="text-2xl font-bold text-red-500">R$ {stats.totalCusto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-[11px] text-muted-foreground">R$ {stats.costPerDay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Por dia</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-semibold text-muted-foreground">Receita</p>
          <p className="text-2xl font-bold text-emerald-500">R$ {stats.totalReceita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
          <p className="text-[11px] text-muted-foreground">R$ {stats.revenuePerDay.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} Por dia</p>
        </div>
      </div>

      <div className="flex justify-between items-center px-2 mb-auto py-8">
        <div className="flex flex-col items-center gap-2">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-muted/20" />
            <div 
              className="h-16 w-16 rounded-full border-4 border-orange-500 flex items-center justify-center bg-background"
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
          <div className="h-16 w-16 rounded-full border-4 border-muted/20 flex items-center justify-center bg-background">
            <Wrench className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Serviços</p>
            <p className="text-base font-bold">{stats.pctServico}%</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="h-16 w-16 rounded-full border-4 border-red-500/20 flex items-center justify-center bg-background">
            <Receipt className="h-6 w-6 text-red-500/50" />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-bold">Despesas</p>
            <p className="text-base font-bold">{stats.pctDespesa}%</p>
          </div>
        </div>
      </div>

      <Button variant="outline" className="w-full mt-8 rounded-full border-primary/50 text-primary hover:bg-primary/5 h-12 text-sm font-bold uppercase tracking-wider">
        Relatórios completos
      </Button>
    </Card>
  );
}
