import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, FileText, Search, ArrowRight } from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { kbCategories, latestArticles } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/base-de-conhecimento")({
  head: () => ({
    meta: [
      { title: "Base de Conhecimento — Portal Prócion" },
      {
        name: "description",
        content:
          "Manuais, artigos e guias organizados por módulo para clientes e parceiros Prócion.",
      },
    ],
  }),
  component: KbPage,
});

const toneClasses: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/15 text-accent-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/25 text-warning-foreground",
};

function KbPage() {
  return (
    <AppShell>
      <PageHeader
        title="Base de Conhecimento"
        description="Explore manuais, artigos e guias organizados por módulo do sistema."
      />

      <Card className="p-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Pesquisar na base de conhecimento..."
            className="w-full h-11 pl-9 pr-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </Card>

      <section className="mb-10">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
          Categorias
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {kbCategories.map((c) => (
            <Card
              key={c.name}
              className="p-4 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div
                className={cn(
                  "grid h-10 w-10 place-items-center rounded-lg mb-3",
                  toneClasses[c.color],
                )}
              >
                <BookOpen className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">{c.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {c.articles} artigos
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Artigos em destaque</h3>
          <button className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
            Ver todos <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestArticles.map((a) => (
            <Card
              key={a.id}
              className="p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-[10px]">
                  {a.category}
                </Badge>
                <span className="text-[11px] text-muted-foreground">{a.readTime}</span>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-medium leading-snug">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    por {a.author} · {a.date}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
