import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ArrowLeft, Building2, Database, Monitor, Network, SlidersHorizontal, UsersRound, Wifi } from "lucide-react";

import { AppShell } from "@/components/portal/AppShell";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClientTab,
  ClientHadronTab,
  ClientInternetTab,
  ClientDevicesTab,
  ClientParametersTab,
  ClientUsersTab,
  ClientTerminalsTab,
  ClientCompaniesTab,
} from "./clientes.index";

function MiniSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-sm dark:border-border">
      <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-[13px] font-medium text-foreground" title={value}>{value}</p>
    </div>
  );
}

import { getClientDetail } from "@/lib/clients-api";
import { normalizeCityUf } from "@/lib/br-city";
import { useClients, resolveGroupCode, getGroupMembers } from "@/lib/clients-store";

const tabs = ["cliente", "hadron", "internet", "dispositivos", "parametros", "usuarios", "terminais", "empresas"] as const;
type TabValue = (typeof tabs)[number];


const searchSchema = z.object({
  tab: fallback(z.string(), "cliente").default("cliente"),
  from: fallback(z.string(), "").optional(),
  ticketId: fallback(z.string(), "").optional(),
});


export const Route = createFileRoute("/clientes/$clienteId")({
  head: ({ params }) => ({
    meta: [{ title: `Cliente ${params.clienteId.toUpperCase()} - Portal Procion` }],
  }),
  validateSearch: zodValidator(searchSchema),
  loader: async ({ params }) => {
    const detail = await getClientDetail(params.clienteId);
    if (!detail) throw notFound();
    return detail;
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
  const { client, contacts, companies, users, terminals, modules, internet, tickets, events, activities, parameters } =
    Route.useLoaderData() as ClientDetail;
  const { tab, from, ticketId } = Route.useSearch();
  const navigate = useNavigate();
  const showReturnToTicket = from === "chamado" && !!ticketId;
  const { clients: allClients } = useClients({ onlyActive: false });
  const showInternet = internet.hasActiveContract || internet.contracts.some((c: { active: boolean }) => c.active);
  const showDevices = showInternet && internet.devices.length > 0;
  const showParameters = parameters.length > 0;

  // Grupo: usa group_acronym do cliente. Se vazio, verifica se ele é raiz de
  // um grupo (algum outro cliente aponta group_acronym para a sigla dele).
  const groupCode = resolveGroupCode(client, allClients);
  const groupMembersCount = groupCode ? getGroupMembers(groupCode, allClients).length : 0;


  const requestedTab = tab;
  const tabAllowed =
    (tabs as readonly string[]).includes(requestedTab) &&
    (requestedTab !== "dispositivos" || showDevices) &&
    (requestedTab !== "parametros" || showParameters) &&
    (requestedTab !== "internet" || showInternet);
  const currentTab: TabValue = tabAllowed ? (requestedTab as TabValue) : "cliente";


  const setTab = (value: string) => {
    navigate({
      to: "/clientes/$clienteId",
      params: { clienteId: client.id },
      search: { tab: value, from, ticketId },
      replace: true,
    });
  };

  const breadcrumbGroupLabel = groupCode || client.acronym;
  return (
    <AppShell>
      <Breadcrumbs
        items={[
          { label: "Clientes", to: "/clientes" },
          groupCode
            ? { label: breadcrumbGroupLabel, to: `/clientes?grupo=${groupCode}` }
            : { label: client.acronym, to: "/clientes" },
          { label: "Detalhes do cliente" },
        ]}
      />
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="outline"
            className="h-10 cursor-pointer gap-2 rounded-lg border-border bg-muted/40 px-4 text-sm font-medium text-foreground shadow-sm hover:bg-muted"
          >
            <Link to="/clientes" aria-label="Voltar para Clientes">
              <ArrowLeft className="h-4 w-4" />
              Voltar para Clientes
            </Link>
          </Button>
          {showReturnToTicket && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="ml-2 h-8 cursor-pointer rounded-lg"
            >
              <Link to="/chamados" search={{ ticket: ticketId }}>
                <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
                Voltar ao chamado
              </Link>
            </Button>
          )}
        </div>

        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:grid-cols-3 xl:grid-cols-5">
          <MiniSummary label="Atendimento" value={normalizeCityUf(client.city) || "Não informado"} />
          <MiniSummary label="Status" value={client.status || "Não informado"} />
          <MiniSummary label="Versão Hádron" value={client.versionDate || client.version || "Não informada"} />
          <MiniSummary label="Data de atualização" value={client.versionUpdatedAt || client.updated || "Não informada"} />
          <MiniSummary label="Dispositivos" value={String(internet.devices.length)} />
        </div>
      </div>


      <Card className="overflow-hidden border-border bg-card p-0 shadow-sm dark:border-border">
        <header className="border-b border-border px-7 py-5 dark:border-border">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div className="flex min-w-0 gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-primary text-base font-semibold text-primary-foreground shadow-sm">
                {client.acronym.slice(0, 4).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  {groupCode ? (
                    <Link
                      to="/clientes"
                      search={{ grupo: groupCode }}
                      className="cursor-pointer text-sm font-medium text-primary hover:underline"
                      title={`Ver clientes do grupo ${groupCode}`}
                    >
                      {client.acronym}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-primary">{client.acronym}</span>
                  )}
                  <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    {client.status}
                  </Badge>
                </div>

                <h2 className="mt-1 truncate text-xl font-semibold text-foreground">
                  {client.razaoSocial}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {client.fantasia}
                  {groupCode ? <span className="ml-1 text-muted-foreground/80">· Grupo {groupCode}</span> : null}
                </p>
              </div>
            </div>

            {groupCode && (
              <Button
                asChild
                variant="outline"
                size="sm"
                title="Ver clientes deste grupo"
                className="h-9 cursor-pointer gap-1.5 rounded-full border-primary/30 bg-primary/5 px-3.5 text-[12.5px] font-medium text-primary hover:bg-primary/10"
              >
                <Link to="/clientes" search={{ grupo: groupCode }}>
                  <Network className="h-3.5 w-3.5" />
                  Ver clientes do grupo {groupCode} ({groupMembersCount})
                </Link>
              </Button>
            )}
          </div>
        </header>

        <Tabs value={currentTab} onValueChange={setTab} className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-7">
            <TabsList className="h-auto justify-start gap-1 rounded-none border-0 bg-transparent p-0">
              {[
                ["cliente", "Cliente", Building2],
                ["hadron", "Hadron", Database],
                ...(showInternet ? [["internet", "Internet", Wifi]] : []),
                ...(showDevices ? [["dispositivos", "Dispositivos", Monitor]] : []),
                ...(showParameters ? [["parametros", "Parâmetros", SlidersHorizontal]] : []),
                ["usuarios", "Usuarios", UsersRound],
                ["terminais", "Terminais", Monitor],
                ["empresas", "Empresas", Network],
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
          </div>

          <div className="bg-muted/10 p-6">
            <TabsContent value="cliente" className="m-0 space-y-5">
              <ClientTab client={client} contacts={contacts} companies={companies} terminals={terminals} tickets={tickets} events={events} activities={activities} onOpenCompanies={() => setTab("empresas")} />
            </TabsContent>
            <TabsContent value="hadron" className="m-0 space-y-5">
              <ClientHadronTab client={client} modules={modules} terminals={terminals} />
            </TabsContent>
            {showInternet && (
              <TabsContent value="internet" className="m-0 space-y-5">
                <ClientInternetTab internet={internet} />
              </TabsContent>
            )}
            {showDevices && (
              <TabsContent value="dispositivos" className="m-0 space-y-5">
                <ClientDevicesTab internet={internet} />
              </TabsContent>
            )}
            {showParameters && (
              <TabsContent value="parametros" className="m-0">
                <ClientParametersTab parameters={parameters} />
              </TabsContent>
            )}
            <TabsContent value="usuarios" className="m-0">
              <ClientUsersTab users={users} />
            </TabsContent>
            <TabsContent value="terminais" className="m-0">
              <ClientTerminalsTab terminals={terminals} />
            </TabsContent>
            <TabsContent value="empresas" className="m-0">
              <ClientCompaniesTab client={client} companies={companies} terminals={terminals} />
            </TabsContent>
          </div>

        </Tabs>
      </Card>

    </AppShell>
  );

}
