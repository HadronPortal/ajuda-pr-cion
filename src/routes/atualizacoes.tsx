import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import { Sparkles, GitBranch } from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { UpdatesContent } from "@/components/portal/UpdatesContent";
import { VersionsContent } from "@/components/portal/VersionsContent";

const searchSchema = z.object({
  aba: fallback(z.enum(["atualizacoes", "versoes"]), "atualizacoes").default("atualizacoes"),
});

export const Route = createFileRoute("/atualizacoes")({
  head: () => ({
    meta: [
      { title: "Atualizações — Portal Prócion" },
      {
        name: "description",
        content: "Novidades, melhorias, comunicados e histórico de versões dos produtos Prócion.",
      },
    ],
  }),
  validateSearch: zodValidator(searchSchema),
  component: UpdatesPage,
});

function UpdatesPage() {
  const { aba } = Route.useSearch();
  const navigate = useNavigate({ from: "/atualizacoes" });
  const activeTab = aba === "versoes" ? "versoes" : "atualizacoes";

  return (
    <AppShell>
      <PageHeader
        title="Atualizações"
        description="Novidades, melhorias e histórico de versões do produto."
        breadcrumbs={[{ label: "Atualizações" }]}
      />

      <Tabs
        value={activeTab}
        onValueChange={(v) =>
          navigate({ search: { aba: v === "versoes" ? "versoes" : "atualizacoes" } })
        }
        className="w-full"
      >
        <TabsList className="mb-6">
          <TabsTrigger value="atualizacoes" className="cursor-pointer gap-2">
            <Sparkles className="h-4 w-4" />
            Atualizações
          </TabsTrigger>
          <TabsTrigger value="versoes" className="cursor-pointer gap-2">
            <GitBranch className="h-4 w-4" />
            Versões
          </TabsTrigger>
        </TabsList>

        <TabsContent value="atualizacoes" className="mt-0">
          <UpdatesContent />
        </TabsContent>

        <TabsContent value="versoes" className="mt-0">
          <VersionsContent />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
