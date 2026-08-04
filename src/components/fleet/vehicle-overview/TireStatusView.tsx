import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Gauge } from "lucide-react";
import type { TireSystem, TireData } from "@/lib/fleet-store";

interface TireStatusViewProps {
  tires?: TireSystem;
}

export function TireStatusView({ tires }: TireStatusViewProps) {
  const tireList = [
    { key: "frontLeft", label: "Dianteiro Esquerdo", data: tires?.frontLeft },
    { key: "frontRight", label: "Dianteiro Direito", data: tires?.frontRight },
    { key: "rearLeft", label: "Traseiro Esquerdo", data: tires?.rearLeft },
    { key: "rearRight", label: "Traseiro Direito", data: tires?.rearRight },
  ];

  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="border-b bg-muted/30 p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          Status dos Pneus
        </h3>
      </div>
      
      <div className="relative flex flex-1 items-center justify-center p-8 bg-muted/5 min-h-[320px]">
        {/* Superior View Silhouette (CSS) */}
        <div className="relative h-64 w-32 rounded-[2rem] border-4 border-muted bg-background/50 shadow-inner flex items-center justify-center">
          <div className="h-20 w-1 bg-muted/20 absolute top-4" />
          <div className="h-1 w-20 bg-muted/20 absolute top-12" />
          
          {/* Tire Indicator Components */}
          {tireList.map((tire) => (
            <TireIndicator key={tire.key} position={tire.key} data={tire.data} />
          ))}
        </div>

        {/* Legend/Alerts */}
        <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground bg-background/50 backdrop-blur px-2 py-1 rounded">
          Dados de inspeção manual: {tires?.lastInspectionDate ? new Date(tires.lastInspectionDate).toLocaleDateString('pt-BR') : 'Sem data'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border">
        {tireList.map((tire) => (
          <div key={tire.key} className="bg-background p-3 text-[12px]">
            <p className="font-semibold mb-1">{tire.label}</p>
            {tire.data ? (
              <div className="space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>Pressão:</span>
                  <span className={cn(
                    "font-medium",
                    tire.data.condition === "critical" ? "text-red-500" : tire.data.condition === "warning" ? "text-amber-500" : "text-foreground"
                  )}>{tire.data.pressure} psi</span>
                </div>
                <div className="flex justify-between">
                  <span>Última troca:</span>
                  <span>{tire.data.lastSwapMileage.toLocaleString('pt-BR')} km</span>
                </div>
                <div className="flex justify-between">
                  <span>Rodízio em:</span>
                  <span>{tire.data.nextRotationMileage.toLocaleString('pt-BR')} km</span>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground italic">Sem dados registrados</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function TireIndicator({ position, data }: { position: string, data?: TireData }) {
  const positions: Record<string, string> = {
    "frontLeft": "-top-4 -left-8",
    "frontRight": "-top-4 -right-8",
    "rearLeft": "-bottom-4 -left-8",
    "rearRight": "-bottom-4 -right-8"
  };

  if (!data) return null;

  return (
    <div className={cn("absolute flex flex-col items-center", positions[position])}>
      <div className={cn(
        "h-12 w-6 rounded-md border-2 bg-slate-900 transition-colors",
        data.condition === "critical" ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : 
        data.condition === "warning" ? "border-amber-500" : "border-muted-foreground/30"
      )} />
      {data.condition !== "normal" && (
        <span className={cn(
          "mt-1 text-[10px] font-bold uppercase",
          data.condition === "critical" ? "text-red-500" : "text-amber-500"
        )}>
          {data.pressure} psi
        </span>
      )}
    </div>
  );
}
