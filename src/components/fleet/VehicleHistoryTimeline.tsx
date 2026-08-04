import { useMemo, useState } from "react";
import { 
  Fuel, 
  Receipt, 
  DollarSign, 
  Wrench, 
  MapPinned, 
  Gauge, 
  ClipboardCheck, 
  Bell,
  Search,
  Download,
  Calendar,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { type FleetEntry, useFleetEntries } from "@/lib/fleet-entry-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TYPE_CONFIG = {
  abastecimento: { icon: Fuel, color: "text-blue-500", bg: "bg-blue-500/10", label: "Abastecimento" },
  despesa: { icon: Receipt, color: "text-red-500", bg: "bg-red-500/10", label: "Despesa" },
  receita: { icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Receita" },
  servico: { icon: Wrench, color: "text-orange-500", bg: "bg-orange-500/10", label: "Serviço" },
  percurso: { icon: MapPinned, color: "text-indigo-500", bg: "bg-indigo-500/10", label: "Percurso" },
  leitura: { icon: Gauge, color: "text-slate-500", bg: "bg-slate-500/10", label: "Leitura" },
  checklist: { icon: ClipboardCheck, color: "text-purple-500", bg: "bg-purple-500/10", label: "Checklist" },
  lembrete: { icon: Bell, color: "text-amber-500", bg: "bg-amber-500/10", label: "Lembrete" },
};

export function VehicleHistoryTimeline({ vehicleId }: { vehicleId: string }) {
  const allEntries = useFleetEntries();
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

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

  const groups = useMemo(() => {
    const map: Record<string, FleetEntry[]> = {};
    vehicleEntries.forEach(entry => {
      const date = new Date(entry.occurredAt);
      const month = date.toLocaleString('pt-BR', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month} ${year}`;
      if (!map[key]) map[key] = [];
      map[key].push(entry);
    });
    return Object.entries(map);
  }, [vehicleEntries]);

  const toggleGroup = (key: string) => {
    setExpandedGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

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
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Pesquisar no histórico..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={exportData} className="gap-2 h-9">
          <Download className="h-4 w-4" />
          Exportar
        </Button>
      </div>

      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
        {groups.map(([key, entries]) => {
          const isExpanded = expandedGroups[key] !== false;
          return (
            <div key={key} className="relative">
              <div 
                className="flex items-center gap-4 mb-6 cursor-pointer group"
                onClick={() => toggleGroup(key)}
              >
                <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm transition-colors group-hover:border-primary">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    {key}
                  </h3>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5 font-bold">
                    {entries.length}
                  </Badge>
                  {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-6 ml-5">
                  {entries.map((entry) => {
                    const config = TYPE_CONFIG[entry.type];
                    const Icon = config.icon;
                    return (
                      <div key={entry.id} className="relative pl-10">
                        <div className={cn(
                          "absolute left-[-1.25rem] top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background shadow-sm",
                          config.bg
                        )}>
                          <Icon className={cn("h-4 w-4", config.color)} />
                        </div>
                        
                        <div className="flex flex-col gap-1 p-4 rounded-xl border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-bold uppercase text-muted-foreground/70">
                                  {new Date(entry.occurredAt).toLocaleDateString('pt-BR')} às {new Date(entry.occurredAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                                {entry.mileage && (
                                  <Badge variant="outline" className="text-[10px] px-1.5 h-4 font-mono bg-background">
                                    {entry.mileage.toLocaleString('pt-BR')} KM
                                  </Badge>
                                )}
                              </div>
                              <h4 className="text-sm font-bold leading-none mb-2">{entry.title}</h4>
                            </div>
                            {entry.amount !== undefined && (
                              <div className="text-right">
                                <p className="text-sm font-black tabular-nums">
                                  {entry.amount < 0 ? '-' : ''} R$ {Math.abs(entry.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <span className="text-[10px] text-muted-foreground uppercase font-bold">
                                  {entry.type}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {entry.notes && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 italic">
                              "{entry.notes}"
                            </p>
                          )}

                          <div className="mt-3 flex flex-wrap gap-2">
                            {entry.fuelType && (
                              <Badge variant="secondary" className="text-[10px] font-normal">
                                {entry.fuelType}
                              </Badge>
                            )}
                            {entry.destination && (
                              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-background px-2 py-0.5 rounded border border-border/50">
                                <MapPinned className="h-3 w-3" />
                                {entry.destination}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {vehicleEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Search className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm">Nenhum registro encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
}
