import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ArrowLeft, Building2, Database, Monitor, Server, UsersRound } from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  clientRows,
  ClientTab,
  HadronTab,
  UsersTab,
  TerminalsTab,
  CompaniesTab,
  Summary,
} from "./clientes";

const tabs = ["cliente", "hadron", "usuarios", "terminais", "empresas"] as const;
type TabValue = (typeof tabs)[number];

const searchSchema = z.object({
  tab: fallback(z.string(), "cliente").default("cliente"),
});

export const Route = createFileRoute("/clientes/$clienteId")({
  head: ({ params }) => ({
    meta: [{ title: `Cliente ${params.clienteId.toUpperCase()} - Portal Procion` }],
  }),
  validateSearch: zodValidator(searchSchema),
  loader: ({ params }) => {
    const client = clientRows.find((c) => c.id === params.clienteId);
    if (!client) throw notFound();
    return { client };
  },
  notFoundComponent: () => (
    <AppShell>
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-medium">Cliente não encontrado</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Não localizamos este cliente. Verifique a sigla ou volte à lista.
        </p>
        <Button asChild className="mt-6 cursor-pointer">
          <Link to="/clientes">Voltar para Clientes</Link>
        </Button>
      </div>
    </AppShell>
  ),
  errorComponent: ({ reset }) => (
    <AppShell>
      <div className="mx-auto max-w-md py-16 text-center">
        <h1 className="text-2xl font-medium">Erro ao carregar cliente</h1>
        <Button onClick={reset} className="mt-6 cursor-pointer">Tentar novamente</Button>
      </div>
    </AppShell>
  ),
  component: ClientDetailPage,
});

function ClientDetailPage() {
  const { client } = Route.useLoaderData();
  const { tab } = Route.useSearch();
  const navigate = useNavigate();
  const isAvc = client.id === "avc";

  const currentTab: TabValue = (tabs as readonly string[]).includes(tab)
    ? (tab as TabValue)
    : "cliente";

  const setTab = (value: string) => {
    navigate({
      to: "/clientes/$clienteId",
      params: { clienteId: client.id },
      search: { tab: value },
      replace: true,
    });
  };

  return (
    <AppShell>
      <Breadcrumbs
        items={[
          { label: "Clientes", to: "/clientes" },
          { label: client.acronym },
        ]}
      />
      <div className="mb-4 flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="cursor-pointer"
          aria-label="Voltar para lista de clientes"
        >
          <Link to="/clientes">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <span className="text-sm text-muted-foreground">Voltar para Clientes</span>
      </div>

      <Card className="overflow-hidden border-border bg-background p-0">
        <header className="border-b border-border px-7 py-5">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex min-w-0 gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-primary">{client.acronym}</span>
                  <Badge className="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                    {client.status}
                  </Badge>
                </div>
                <h2 className="mt-1 truncate text-xl font-medium">
                  {client.razaoSocial} {client.group && `(${client.group})`}
                </h2>
                <p className="text-sm text-muted-foreground">{client.fantasia}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm lg:grid-cols-4">
              <Summary label="Atendimento" value="Sao Carlos" />
              <Summary label="Versao Hadron" value={isAvc ? "02/07/2026" : client.version} />
              <Summary
                label="Atualizacao"
                value={isAvc ? "09/07/2026 09:14" : client.updated}
              />
              <Summary label="Cidade" value={client.city} />
            </div>
          </div>
        </header>

        <Tabs value={currentTab} onValueChange={setTab} className="flex flex-col">
          <TabsList className="h-auto justify-start gap-1 rounded-none border-b border-border bg-transparent px-7 py-0">
            {[
              ["cliente", "Cliente", Building2],
              ["hadron", "Hadron", Database],
              ["usuarios", "Usuarios", UsersRound],
              ["terminais", "Terminais", Monitor],
              ["empresas", "Empresas", Server],
            ].map(([value, label, Icon]) => {
              const V = value as string;
              const L = label as string;
              const I = Icon as typeof Building2;
              return (
                <TabsTrigger
                  key={V}
                  value={V}
                  className="cursor-pointer gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  <I className="h-4 w-4" />
                  {L}
                </TabsTrigger>
              );
            })}
          </TabsList>
          <div className="bg-muted/10 p-6">
            <TabsContent value="cliente" className="m-0 space-y-5">
              <ClientTab />
            </TabsContent>
            <TabsContent value="hadron" className="m-0 space-y-5">
              <HadronTab />
            </TabsContent>
            <TabsContent value="usuarios" className="m-0">
              <UsersTab />
            </TabsContent>
            <TabsContent value="terminais" className="m-0">
              <TerminalsTab />
            </TabsContent>
            <TabsContent value="empresas" className="m-0">
              <CompaniesTab />
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </AppShell>
  );
}
