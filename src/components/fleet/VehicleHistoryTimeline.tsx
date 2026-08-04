import { useMemo, useState } from "react";
import { 
  Fuel, 
  DollarSign, 
  TrendingUp, 
  Wrench, 
  MapPin, 
  Gauge, 
  CheckSquare, 
  Bell, 
  Search, 
  Download,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { type FleetEntry, type FleetEntryType, useFleetEntries } from "@/lib/fleet-entry-store";
import { formatFleetDateTime } from "@/lib/fleet-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface VehicleHistoryTimelineProps {
  vehicleId: string;
}

const ENTRY_CONFIG: Record<FleetEntryType, { icon: any; color: string; label: string; bg: string }> = {
  abastecimento: { icon: Fuel, color: "text-blue-500", bg: "bg-blue-500/10", label: "Abastecimento" },
  despesa: { icon: DollarSign, color: "text-red-500", bg: "bg-red-500/10", label: "Despesa" },
  receita: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Receita" },
  servico: { icon: Wrench, color: "text-amber-500", bg: "bg-amber-500/10", label: "Serviço" },
  percurso: { icon: MapPin, color: "text-indigo-500", bg: "bg-indigo-500/10", label: "Percurso" },
  leitura: { icon: Gauge, color: "text-slate-500", bg: "bg-slate-500/10", label: "Leitura" },
  checklist: { icon: CheckSquare, color: "text-violet-500", bg: "bg-violet-500/10", label: "Checklist" },
  lembrete: { icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10", label: "Lembrete" },
};

export function VehicleHistoryTimeline({ vehicleId }: VehicleHistoryTimelineProps) {
  const allEntries = useFleetEntries();
  const [search, setSearch] = useState("");

  const filteredEntries = useMemo(() => {
    return allEntries
      .filter(e => e.vehicleId === vehicleId)
      .filter(e => {
        if (!search) return true;
        const term = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(term) ||
          e.notes?.toLowerCase().includes(term) ||
          ENTRY_CONFIG[e.type].label.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => b.occurredAt.localeCompare(a.occurredAt));
  }, [allEntries, vehicleId, search]);

  const groupedEntries = useMemo(() => {
    const groups: Record<string, FleetEntry[]> = {};
    filteredEntries.forEach(entry => {
      const date = new Date(entry.occurredAt);
      const monthYear = date.toLocaleString("pt-BR", { month: "long", year: "numeric" });
      const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
      if (!groups[capitalized]) groups[capitalized] = [];
      groups[capitalized].push(entry);
    });
    return Object.entries(groups);
  }, [filteredEntries]);

  const handleExport = () => {
    const headers = ["Data", "Tipo", "Título", "Quilometragem", "Valor", "Notas"];
    const rows = filteredEntries.map(e => [
      formatFleetDateTime(e.occurredAt),
      ENTRY_CONFIG[e.type].label,
      e.title,
      e.mileage ? `${e.mileage} km` : "",
      e.amount ? `R$ ${e.amount.toLocaleString("pt-BR")}` : "",
      e.notes || ""
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(";")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `historico-veiculo-${vehicleId}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar no histórico..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9" onClick={handleExport} title="Exportar CSV">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {groupedEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">Nenhum registro encontrado.</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {groupedEntries.map(([month, entries]) => (
              <div key={month} className="relative">
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 mb-4">
                  <Badge variant="secondary" className="font-semibold text-[10px] uppercase tracking-wider ml-1">
                    {month}
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  {entries.map((entry) => {
                    const config = ENTRY_CONFIG[entry.type];
                    const Icon = config.icon;
                    return (
                      <div key={entry.id} className="relative pl-10 group">
                        {/* Dot */}
                        <div className={cn(
                          "absolute left-0 top-1.5 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background z-10 shadow-sm",
                          config.bg
                        )}>
                          <Icon className={cn("h-4 w-4", config.color)} />
                        </div>

                        <div className="flex flex-col gap-1 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors group-hover:border-primary/20">
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-bold text-foreground leading-tight">
                              {entry.title}
                            </span>
                            <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap bg-muted px-1.5 py-0.5 rounded">
                              {formatFleetDateTime(entry.occurredAt).split(",")[0]}
                            </span>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                            {entry.mileage && (
                              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Gauge className="h-3 w-3" />
                                {entry.mileage.toLocaleString("pt-BR")} km
                              </div>
                            )}
                            {entry.amount && (
                              <div className="flex items-center gap-1 text-[11px] font-semibold text-foreground">
                                <DollarSign className="h-3 w-3" />
                                R$ {entry.amount.toLocaleString("pt-BR")}
                              </div>
                            )}
                            {entry.liters && (
                              <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                <Fuel className="h-3 w-3" />
                                {entry.liters}L
                              </div>
                            )}
                          </div>

                          {entry.notes && (
                            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-relaxed border-t border-border/50 pt-1 italic">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
