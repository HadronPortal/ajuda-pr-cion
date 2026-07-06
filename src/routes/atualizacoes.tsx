import { createFileRoute } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { updates } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/atualizacoes")({
  head: () => ({
    meta: [
      { title: "Atualizações — Portal Prócion" },
      {
        name: "description",
        content: "Novidades, melhorias e comunicados oficiais dos produtos Prócion.",
      },
    ],
  }),
  component: UpdatesPage,
});

const tagTone: Record<string, string> = {
  Feature: "bg-primary/10 text-primary",
  Integração: "bg-accent/15 text-accent-foreground",
  Segurança: "bg-destructive/10 text-destructive",
  Melhoria: "bg-success/15 text-success",
};

function UpdatesPage() {
  return (
    <AppShell>
      <PageHeader
        title="Atualizações"
        description="Novidades, melhorias e comunicados oficiais do produto."
      />

      <div className="space-y-4">
        {updates.map((u) => (
          <Card key={u.id} className="p-5 hover:shadow-md transition-shadow">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 sm:flex sm:justify-between">
              <div className="min-w-0 flex items-start gap-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge className={cn("text-[10px]", tagTone[u.tag])}>{u.tag}</Badge>
                    <span className="text-[11px] text-muted-foreground">{u.date}</span>
                  </div>
                  <p className="font-semibold">{u.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{u.summary}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
