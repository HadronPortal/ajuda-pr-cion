import { createFileRoute } from "@tanstack/react-router";
import { useGameStore } from "@/lib/game-store";
import { AppShell } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Plus, Download, FileText, Database } from "lucide-react";

export const Route = createFileRoute("/iniciar-hadron")({
  component: HadronGameAdmin,
});

function HadronGameAdmin() {
  const { prizes, addPrize, removePrize, updatePrize, backgroundUrl, coverUrl } = useGameStore();

  const totalProbability = prizes.reduce((sum, p) => sum + p.probability, 0);

  const handleExportCSV = () => {
    try {
      const headers = ["ID", "Label", "Probability", "Color"];
      const rows = prizes.map(p => [p.id, p.label, p.probability, p.color].join(","));
      const csvContent = [headers.join(","), ...rows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "config-roleta.csv");
      link.click();
      toast.success("CSV exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar CSV.");
    }
  };

  const handleExportTXT = () => {
    try {
      const content = prizes.map(p => `${p.label}: ${p.probability}%`).join("\n");
      const blob = new Blob([content], { type: "text/plain;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "config-roleta.txt");
      link.click();
      toast.success("TXT exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao exportar TXT.");
    }
  };

  const handleBackupJSON = () => {
    try {
      const content = JSON.stringify({ prizes, backgroundUrl, coverUrl }, null, 2);
      const blob = new Blob([content], { type: "application/json;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "backup-hadron.json");
      link.click();
      toast.success("Backup JSON exportado com sucesso!");
    } catch (error) {
      toast.error("Erro ao realizar backup.");
    }
  };

  return (
    <AppShell>
      <div 
        className="min-h-screen p-6 bg-cover bg-center transition-all"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      >
        <div className="max-w-4xl mx-auto space-y-6 bg-white/90 dark:bg-slate-900/90 p-8 rounded-2xl backdrop-blur-sm shadow-xl">
          <header className="flex items-center justify-between border-b pb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Configurações do Jogo</h1>
              <p className="text-muted-foreground mt-1 text-lg">Desafio Robustus - Jogo da Cesta</p>
            </div>
            <img 
              src={coverUrl} 
              alt="Capa do Jogo" 
              className="w-32 h-32 object-contain rounded-lg shadow-md border bg-white"
            />
          </header>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Configuração da Roleta</h2>
              <Badge variant={totalProbability === 100 ? "default" : "destructive"} className="text-sm px-3 py-1">
                Total: {totalProbability}%
              </Badge>
            </div>

            <div className="grid gap-4">
              {prizes.map((prize) => (
                <Card key={prize.id} className="p-4 flex items-center gap-4 border-2">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Nome do Prêmio</Label>
                      <Input 
                        value={prize.label} 
                        onChange={(e) => updatePrize(prize.id, { label: e.target.value })}
                        placeholder="Ex: Ração 1kg"
                        className="font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Probabilidade (%)</Label>
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        value={prize.probability} 
                        onChange={(e) => updatePrize(prize.id, { probability: Number(e.target.value) })}
                        className="font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs uppercase font-bold text-muted-foreground">Cor</Label>
                      <div className="flex gap-2">
                        <Input 
                          type="color"
                          value={prize.color} 
                          onChange={(e) => updatePrize(prize.id, { color: e.target.value })}
                          className="w-12 h-10 p-1 cursor-pointer"
                        />
                        <Input 
                          value={prize.color} 
                          onChange={(e) => updatePrize(prize.id, { color: e.target.value })}
                          className="font-mono text-xs"
                        />
                      </div>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => removePrize(prize.id)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </Card>
              ))}
            </div>

            {prizes.length < 4 ? (
              <Button 
                onClick={() => addPrize({ label: "Novo Prêmio", probability: 0, color: "#6366f1" })}
                className="w-full py-6 text-lg font-semibold gap-2 border-2 border-dashed"
                variant="outline"
              >
                <Plus className="h-6 w-6" /> Adicionar Prêmio
              </Button>
            ) : (
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-700 dark:text-amber-400 text-center font-medium">
                A roleta pode ter no máximo 4 prêmios.
              </div>
            )}
          </section>

          <section className="pt-8 border-t">
            <h2 className="text-xl font-semibold mb-6">Gestão de Dados & Backup</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button onClick={handleExportCSV} variant="outline" className="h-24 flex-col gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200">
                <Download className="h-8 w-8 text-blue-500" />
                <div className="text-center">
                  <div className="font-bold">Exportar CSV</div>
                  <div className="text-[10px] text-muted-foreground">Relatório de prêmios</div>
                </div>
              </Button>
              <Button onClick={handleExportTXT} variant="outline" className="h-24 flex-col gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-200">
                <FileText className="h-8 w-8 text-emerald-500" />
                <div className="text-center">
                  <div className="font-bold">Exportar TXT</div>
                  <div className="text-[10px] text-muted-foreground">Resumo textual</div>
                </div>
              </Button>
              <Button onClick={handleBackupJSON} variant="outline" className="h-24 flex-col gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200">
                <Database className="h-8 w-8 text-purple-500" />
                <div className="text-center">
                  <div className="font-bold">Backup JSON</div>
                  <div className="text-[10px] text-muted-foreground">Configuração completa</div>
                </div>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Badge({ children, variant = "default", className }: { children: React.ReactNode, variant?: "default" | "destructive", className?: string }) {
  const variants = {
    default: "bg-primary text-primary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
  };
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset", variants[variant], className)}>
      {children}
    </span>
  );
}
