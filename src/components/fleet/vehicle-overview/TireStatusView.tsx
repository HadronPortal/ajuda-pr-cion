import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Info, Gauge, RotateCcw } from "lucide-react";

interface TireData {
  position: string;
  pressure: string;
  condition: "normal" | "warning" | "critical";
  lastSwapKm: string;
  nextRotationKm: string;
  label: string;
}

const TIRES: TireData[] = [
  {
    position: "top-left",
    label: "Dianteiro Esquerdo",
    pressure: "32.5 psi",
    condition: "normal",
    lastSwapKm: "35.000",
    nextRotationKm: "45.000"
  },
  {
    position: "top-right",
    label: "Dianteiro Direito",
    pressure: "32.5 psi",
    condition: "normal",
    lastSwapKm: "35.000",
    nextRotationKm: "45.000"
  },
  {
    position: "bottom-left",
    label: "Traseiro Esquerdo",
    pressure: "22 psi",
    condition: "critical",
    lastSwapKm: "40.000",
    nextRotationKm: "50.000"
  },
  {
    position: "bottom-right",
    label: "Traseiro Direito",
    pressure: "32.5 psi",
    condition: "normal",
    lastSwapKm: "40.000",
    nextRotationKm: "50.000"
  }
];

export function TireStatusView() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="border-b bg-muted/30 p-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Gauge className="h-4 w-4" />
          Status dos Pneus
        </h3>
      </div>
      
      <div className="relative flex flex-1 items-center justify-center p-8 bg-muted/5">
        {/* Superior View Silhouette (CSS) */}
        <div className="relative h-64 w-32 rounded-[2rem] border-4 border-muted bg-background/50 shadow-inner flex items-center justify-center">
          <div className="h-20 w-1 bg-muted/20 absolute top-4" />
          <div className="h-1 w-20 bg-muted/20 absolute top-12" />
          
          {/* Tire Indicator Components */}
          {TIRES.map((tire) => (
            <TireIndicator key={tire.position} data={tire} />
          ))}
        </div>

        {/* Legend/Alerts */}
        <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground bg-background/50 backdrop-blur px-2 py-1 rounded">
          Dados de inspeção manual
        </div>
      </div>

      <div className="grid grid-cols-2 gap-px bg-border">
        {TIRES.map((tire) => (
          <div key={tire.position} className="bg-background p-3 text-[12px]">
            <p className="font-semibold mb-1">{tire.label}</p>
            <div className="space-y-1 text-muted-foreground">
              <div className="flex justify-between">
                <span>Pressão:</span>
                <span className={cn(
                  "font-medium",
                  tire.condition === "critical" ? "text-red-500" : tire.condition === "warning" ? "text-amber-500" : "text-foreground"
                )}>{tire.pressure}</span>
              </div>
              <div className="flex justify-between">
                <span>Última troca:</span>
                <span>{tire.lastSwapKm} km</span>
              </div>
              <div className="flex justify-between">
                <span>Rodízio em:</span>
                <span>{tire.nextRotationKm} km</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function TireIndicator({ data }: { data: TireData }) {
  const positions: Record<string, string> = {
    "top-left": "-top-4 -left-8",
    "top-right": "-top-4 -right-8",
    "bottom-left": "-bottom-4 -left-8",
    "bottom-right": "-bottom-4 -right-8"
  };

  return (
    <div className={cn("absolute flex flex-col items-center", positions[data.position])}>
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
          {data.pressure}
        </span>
      )}
    </div>
  );
}
