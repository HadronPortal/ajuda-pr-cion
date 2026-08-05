import { useMemo, useState } from "react";
import { 
  Fuel, 
  Receipt, 
  Wrench, 
  MapPinned, 
  Gauge, 
  ClipboardCheck, 
  Bell,
  Search,
  Download,
  Calendar
} from "lucide-react";
import { type FleetEntry, useFleetEntries } from "@/lib/fleet-entry-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  abastecimento: { icon: Fuel, color: "text-orange-500", border: "border-orange-500", label: "Abastecimento" },
  despesa: { icon: Receipt, color: "text-red-500", border: "border-red-500", label: "Despesa" },
  servico: { icon: Wrench, color: "text-orange-500", border: "border-orange-500", label: "Serviço" },
  percurso: { icon: MapPinned, color: "text-indigo-500", border: "border-indigo-500", label: "Percurso" },
  leitura: { icon: Gauge, color: "text-slate-500", border: "border-slate-500", label: "Leitura" },
  checklist: { icon: ClipboardCheck, color: "text-purple-500", border: "border-purple-500", label: "Checklist" },
  lembrete: { icon: Bell, color: "text-amber-500", border: "border-amber-500", label: "Lembrete" },
};

export function VehicleHistoryTimeline({ vehicleId }: { vehicleId: string }) {
  const allEntries = useFleetEntries();
  const [search, setSearch] = useState("");
  const [showAll, setShowAll] = useState(false);

  const vehicleEntries = useMemo(() => {
    return allEntries
      .filter(e => e.vehicleId === vehicleId)
      .filter(e => {
        if (!search.trim()) return true;
        const s = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(s) || 
          e.notes?.toLowerCase().includes(s) ||
          TYPE_CONFIG[e.type]?.label.toLowerCase().includes(s)
        );
      })
      .sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
  }, [allEntries, vehicleId, search]);

  const visibleEntries = showAll ? vehicleEntries : vehicleEntries.slice(0, 3);

  const groups = useMemo(() => {
    const map: Record<string, FleetEntry[]> = {};
    visibleEntries.forEach(entry => {
      const date = new Date(entry.occurredAt);
      const month = date.toLocaleString('pt-BR', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} de ${year}`;
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    });
    return Object.entries(map);
  }, [visibleEntries]);

  const exportData = () => {
    const content = vehicleEntries.map(e => (
      `${new Date(e.occurredAt).toLocaleString('pt-BR')};${TYPE_CONFIG[e.type].label};${e.title};${e.amount || ''};${e.mileage || ''}`
    )).join('\n');
    const blob = new Blob([`Data;Tipo;Descrição;Valor;KM\n${content}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `historico-veiculo-${vehicleId}.csv`;
    link.click();
  };

  return (
    <Card className="p-6 h-full flex flex-col bg-card border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold">Histórico</h3>
          <Search className="h-5 w-5 text-primary cursor-pointer hover:opacity-70" />
        </div>
        <Download 
          className="h-5 w-5 text-primary cursor-pointer hover:opacity-70" 
          onClick={exportData}
        />
      </div>

      <div className="relative flex-1 space-y-8 before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-border/60">
        {groups.map(([key, entries]) => (
          <div key={key} className="relative">
            <div className="flex items-center gap-4 mb-8 ml-12">
              <h4 className="text-sm font-semibold text-muted-foreground/60">{key}</h4>
            </div>

            <div className="space-y-12">
              {entries.map((entry) => {
                const config = TYPE_CONFIG[entry.type] || TYPE_CONFIG.despesa;
                const Icon = config.icon;
                const date = new Date(entry.occurredAt);
                
                return (
                  <div key={entry.id} className="relative pl-16">
                    {/* Linha e Círculo da Timeline */}
                    <div className={cn(
                      "absolute left-2 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border-4 bg-background shadow-sm",
                      config.border
                    )}>
                      <Icon className={cn("h-5 w-5", config.color)} />
                    </div>
                    
                    <div className="flex flex-col gap-4 border-b border-border/40 pb-6 last:border-0">
                      <h5 className="text-lg font-bold">{entry.title}</h5>
                      
                      <div className="grid grid-cols-2 gap-y-3 gap-x-8">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <Calendar className="h-3.5 w-3.5" />
                          {date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })}
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <Icon className="h-3.5 w-3.5" />
                          {entry.fuelType || entry.type} {entry.liters ? `(${entry.liters.toLocaleString('pt-BR')} L)` : ''}
                        </div>

                        {entry.mileage && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                            <Gauge className="h-3.5 w-3.5" />
                            {entry.mileage.toLocaleString('pt-BR')} km
                          </div>
                        )}

                        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                          <MapPinned className="h-3.5 w-3.5" />
                          {entry.distance ? `${entry.distance.toLocaleString('pt-BR')} km/L` : '0,00 km/L'}
                        </div>
                      </div>

                      {entry.amount !== undefined && (
                        <p className="text-sm font-bold text-foreground/80">
                          R$ {entry.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {vehicleEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">Nenhum registro encontrado.</p>
          </div>
        )}
      </div>

      {vehicleEntries.length > 3 && (
        <Button variant="ghost" className="mt-5 w-full cursor-pointer text-primary" onClick={() => setShowAll((value) => !value)}>
          {showAll ? "Mostrar menos" : "Ver tudo"}
        </Button>
      )}
    </Card>
  );
}
