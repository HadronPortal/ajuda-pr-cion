import { createFileRoute } from "@tanstack/react-router";
import { Plus, MoreHorizontal } from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { kanbanColumns } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kanban")({
  head: () => ({
    meta: [
      { title: "Kanban Prócion — Portal Prócion" },
      { name: "description", content: "Gestão visual de tarefas e projetos da equipe Prócion." },
    ],
  }),
  component: KanbanPage,
});

const tagTone: Record<string, string> = {
  Bug: "bg-destructive/10 text-destructive",
  Feature: "bg-primary/10 text-primary",
  Docs: "bg-accent/15 text-accent-foreground",
};

const priorityDot: Record<string, string> = {
  Alta: "bg-destructive",
  Média: "bg-warning",
  Baixa: "bg-muted-foreground",
};

function KanbanPage() {
  return (
    <AppShell>
      <PageHeader
        title="Kanban Prócion"
        description="Gestão visual de tarefas e projetos da equipe."
        actions={
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" /> Nova tarefa
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {kanbanColumns.map((col) => (
          <div key={col.id} className="min-w-0">
            <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{col.title}</span>
                <span className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                  {col.cards.length}
                </span>
              </div>
              <button className="text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 min-h-[120px] p-2 rounded-xl bg-muted/40 border border-border/60">
              {col.cards.map((c) => (
                <Card key={c.id} className="p-3 cursor-pointer hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className={cn("text-[10px]", tagTone[c.tag])}>{c.tag}</Badge>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-sm font-medium leading-snug mb-3">{c.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <span
                        className={cn("h-1.5 w-1.5 rounded-full", priorityDot[c.priority])}
                      />
                      {c.priority}
                    </span>
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                        {c.assignee}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
