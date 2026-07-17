import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { BarChart3 } from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TicketsAnalyticsSection } from "@/components/analytics/TicketsAnalytics";

const searchSchema = z.object({
  view: fallback(z.string(), "chamados").default("chamados"),
});

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — CRM Prócion" },
      {
        name: "description",
        content:
          "Indicadores de chamados e Kanban da Prócion consolidados em uma central de analytics.",
      },
    ],
  }),
  validateSearch: zodValidator(searchSchema),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { view } = Route.useSearch();
  const navigate = useNavigate({ from: "/analytics" });
  const activeTab = view === "kanban" ? "kanban" : "chamados";

  return (
    <AppShell>
      <div className="mb-5">
        <Breadcrumbs items={[{ label: "Analytics" }]} />
        <h1 className="text-lg font-medium tracking-tight text-foreground">Analytics</h1>
        <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
          Indicadores consolidados de atendimento e produtividade do time.
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          navigate({ search: { view: v === "kanban" ? "kanban" : "chamados" } })
        }
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="chamados" className="cursor-pointer">
            Chamados
          </TabsTrigger>
          <TabsTrigger value="kanban" className="cursor-pointer">
            Kanban
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chamados" className="mt-0">
          <TicketsAnalyticsSection />
        </TabsContent>

        <TabsContent value="kanban" className="mt-0">
          <KanbanAnalyticsEmpty />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function KanbanAnalyticsEmpty() {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-[14px] border border-dashed border-border/70 bg-white p-10 text-center dark:bg-[#20263d]">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-muted text-muted-foreground">
        <BarChart3 className="h-5 w-5" />
      </div>
      <p className="mt-4 text-sm font-medium text-foreground">
        Os indicadores do Kanban serão exibidos aqui
      </p>
      <p className="mt-1 max-w-md text-xs text-muted-foreground">
        Assim que os dados analíticos do Kanban estiverem disponíveis, eles aparecerão nesta aba.
      </p>
    </div>
  );
}
