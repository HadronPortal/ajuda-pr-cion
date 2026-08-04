import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Info, AlertCircle, CheckCircle2 } from "lucide-react";

interface ComponentStatus {
  condition: string;
  lastCheck: string;
  lastMaintenance: string;
  nextCheck: string;
  notes: string;
  status: "normal" | "warning" | "critical";
}

interface InteractivePointsProps {
  onPointClick: (name: string, data: ComponentStatus) => void;
}

const COMPONENT_DATA: Record<string, ComponentStatus> = {
  "Pneu Dianteiro Esquerdo": {
    condition: "Bom - 32 psi",
    lastCheck: "10/07/2026",
    lastMaintenance: "15/01/2026",
    nextCheck: "10/08/2026",
    notes: "Desgaste uniforme observado.",
    status: "normal"
  },
  "Pneu Dianteiro Direito": {
    condition: "Bom - 32 psi",
    lastCheck: "10/07/2026",
    lastMaintenance: "15/01/2026",
    nextCheck: "10/08/2026",
    notes: "Calibrado recentemente.",
    status: "normal"
  },
  "Pneu Traseiro Esquerdo": {
    condition: "Atenção - 22 psi",
    lastCheck: "10/07/2026",
    lastMaintenance: "—",
    nextCheck: "Imediata",
    notes: "Pressão abaixo do recomendado. Possível furo.",
    status: "critical"
  },
  "Pneu Traseiro Direito": {
    condition: "Bom - 31 psi",
    lastCheck: "10/07/2026",
    lastMaintenance: "—",
    nextCheck: "10/08/2026",
    notes: "Condição estável.",
    status: "normal"
  },
  "Motor": {
    condition: "Operacional",
    lastCheck: "05/06/2026",
    lastMaintenance: "10/12/2025",
    nextCheck: "05/12/2026",
    notes: "Níveis de fluidos normais.",
    status: "normal"
  },
  "Bateria": {
    condition: "Carga 95%",
    lastCheck: "15/07/2026",
    lastMaintenance: "20/02/2025",
    nextCheck: "15/01/2027",
    notes: "Tensão de saída estável.",
    status: "normal"
  }
};

export function InteractivePoints({ onPointClick }: InteractivePointsProps) {
  // Simple overlay for interaction demonstration
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Front Left Tire */}
      <Point 
        top="70%" left="30%" 
        onClick={() => onPointClick("Pneu Dianteiro Esquerdo", COMPONENT_DATA["Pneu Dianteiro Esquerdo"])} 
      />
      {/* Front Right Tire */}
      <Point 
        top="70%" left="70%" 
        onClick={() => onPointClick("Pneu Dianteiro Direito", COMPONENT_DATA["Pneu Dianteiro Direito"])} 
      />
      {/* Rear Left Tire */}
      <Point 
        top="30%" left="30%" 
        onClick={() => onPointClick("Pneu Traseiro Esquerdo", COMPONENT_DATA["Pneu Traseiro Esquerdo"])} 
      />
      {/* Rear Right Tire */}
      <Point 
        top="30%" left="70%" 
        onClick={() => onPointClick("Pneu Traseiro Direito", COMPONENT_DATA["Pneu Traseiro Direito"])} 
      />
      {/* Engine Area */}
      <Point 
        top="75%" left="50%" 
        onClick={() => onPointClick("Motor", COMPONENT_DATA["Motor"])} 
      />
    </div>
  );
}

function Point({ top, left, onClick }: { top: string, left: string, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute h-6 w-6 -translate-x-1/2 -translate-y-1/2 pointer-events-auto flex items-center justify-center"
      style={{ top, left }}
    >
      <span className="absolute h-full w-full animate-ping rounded-full bg-primary/40 opacity-75" />
      <span className="relative h-3 w-3 rounded-full bg-primary shadow-lg border-2 border-white" />
    </button>
  );
}

export function ComponentInfoPanel({ name, data, onClose }: { name: string, data: ComponentStatus, onClose: () => void }) {
  return (
    <Card className="absolute top-4 left-4 z-20 w-64 p-4 shadow-xl border-primary/20 bg-background/95 backdrop-blur">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm">{name}</h4>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <Info className="h-4 w-4" />
        </button>
      </div>
      
      <div className="space-y-2 text-[12px]">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Condição</span>
          <span className={cn(
            "font-medium flex items-center gap-1",
            data.status === "critical" ? "text-red-500" : data.status === "warning" ? "text-amber-500" : "text-emerald-500"
          )}>
            {data.status === "critical" ? <AlertCircle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />}
            {data.condition}
          </span>
        </div>
        <InfoRow label="Última verif." value={data.lastCheck} />
        <InfoRow label="Última manut." value={data.lastMaintenance} />
        <InfoRow label="Próxima verif." value={data.nextCheck} />
        <div className="pt-2 border-t mt-2">
          <p className="text-muted-foreground mb-1 italic">Observações:</p>
          <p>{data.notes}</p>
        </div>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
