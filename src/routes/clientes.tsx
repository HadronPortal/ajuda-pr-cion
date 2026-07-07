import { createFileRoute } from "@tanstack/react-router";
import { Plus, Search, Building2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { clients } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clientes")({
  head: () => ({
    meta: [
      { title: "Clientes — Portal Prócion" },
      { name: "description", content: "Gestão de clientes e parceiros da Prócion Sistemas." },
    ],
  }),
  component: ClientsPage,
});

const statusTone: Record<string, string> = {
  Ativo: "bg-success/15 text-success",
  Trial: "bg-accent/15 text-accent-foreground",
  Inativo: "bg-muted text-muted-foreground",
};

const planTone: Record<string, string> = {
  Enterprise: "bg-primary/10 text-primary",
  Business: "bg-accent/15 text-accent-foreground",
  Starter: "bg-muted text-muted-foreground",
};

function ClientsPage() {
  return (
    <AppShell>
      <PageHeader
        title="Clientes"
        description="Consulte e gerencie clientes e parceiros do portal."
        breadcrumbs={[{ label: "Clientes" }]}
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Novo cliente
          </Button>
        }
      />

      <Card className="p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar cliente por nome, contato ou segmento..."
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select className="h-10 px-3 rounded-lg border border-border bg-background text-sm">
            <option>Todos os planos</option>
            <option>Enterprise</option>
            <option>Business</option>
            <option>Starter</option>
          </select>
          <select className="h-10 px-3 rounded-lg border border-border bg-background text-sm">
            <option>Todos os status</option>
            <option>Ativo</option>
            <option>Trial</option>
            <option>Inativo</option>
          </select>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Cliente</th>
                <th className="text-left font-medium px-4 py-3 hidden md:table-cell">
                  Segmento
                </th>
                <th className="text-left font-medium px-4 py-3">Plano</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-left font-medium px-4 py-3 hidden lg:table-cell">
                  Contato
                </th>
                <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">
                  Cliente desde
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-muted/30 transition cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                        <Building2 className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {c.segment}
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn("text-[10px]", planTone[c.plan])}>{c.plan}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn("text-[10px]", statusTone[c.status])}>
                      {c.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {c.contact}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                    {c.since}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  );
}
