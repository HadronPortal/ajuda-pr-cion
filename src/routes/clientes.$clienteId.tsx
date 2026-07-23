import { useState } from "react";
import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ArrowLeft, Building2, Database, History, Monitor, Network, Server, UsersRound } from "lucide-react";
import { ClientTicketsHistoryModal } from "@/components/tickets/ClientTicketsHistoryModal";

import { AppShell } from "@/components/portal/AppShell";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClientTab,
  ClientHadronTab,
  ClientUsersTab,
  ClientTerminalsTab,
  ClientCompaniesTab,
  Summary,
} from "./clientes.index";
import { getClientDetail } from "@/lib/clients-api";
import { normalizeCityUf } from "@/lib/br-city";
import { useClients, resolveGroupCode, getGroupMembers } from "@/lib/clients-store";

const tabs = ["cliente", "hadron", "usuarios", "terminais", "empresas"] as const;
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
  const { client, contacts, companies, users, terminals, modules, tickets, events } = Route.useLoaderData();
  const { tab, from, ticketId } = Route.useSearch();
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  const showReturnToTicket = from === "chamado" && !!ticketId;


  const currentTab: TabValue = (tabs as readonly string[]).includes(tab)
    ? (tab as TabValue)
    : "cliente";

  const setTab = (value: string) => {
    navigate({
      to: "/clientes/$clienteId",
      params: { clienteId: client.id },
      search: { tab: value, from, ticketId },
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
        {showReturnToTicket && (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="ml-auto h-8 cursor-pointer rounded-lg"
          >
            <Link to="/chamados" search={{ ticket: ticketId }}>
              <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
              Voltar ao chamado
            </Link>
          </Button>
        )}
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
                  {client.group ? (
                    <Link
                      to="/clientes"
                      search={{ grupo: client.group }}
                      className="cursor-pointer text-sm font-medium text-primary hover:underline"
                      title={`Ver empresas do grupo ${client.group}`}
                    >
                      {client.acronym}
                    </Link>
                  ) : (
                    <span className="text-sm font-medium text-primary">{client.acronym}</span>
                  )}
                  <Badge className="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                    {client.status}
                  </Badge>
                  {client.group && (
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      title="Exibir empresas deste grupo"
                      className="h-7 cursor-pointer gap-1.5 rounded-full border-primary/30 px-2.5 text-[11.5px] font-medium text-primary hover:bg-primary/10"
                    >
                      <Link to="/clientes" search={{ grupo: client.group }}>
                        <Network className="h-3.5 w-3.5" />
                        Ver empresas do grupo {client.group}
                      </Link>
                    </Button>
                  )}
                </div>

                <h2 className="mt-1 truncate text-xl font-medium">
                  {client.group ? (
                    <>
                      <Link
                        to="/clientes"
                        search={{ grupo: client.group }}
                        className="cursor-pointer hover:underline"
                      >
                        {client.razaoSocial}
                      </Link>{" "}
                      <Link
                        to="/clientes"
                        search={{ grupo: client.group }}
                        className="cursor-pointer text-primary hover:underline"
                        title={`Ver empresas do grupo ${client.group}`}
                      >
                        ({client.group})
                      </Link>
                    </>
                  ) : (
                    client.razaoSocial
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">{client.fantasia}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm lg:grid-cols-4">
              <Summary label="Atendimento" value={client.city || "Nao informado"} />
              <Summary label="Versao Hadron" value={client.version || "Nao informada"} />
              <Summary label="Atualizacao" value={client.updated || "Nao informada"} />
              <Summary label="Cidade" value={normalizeCityUf(client.city)} />
            </div>
          </div>
        </header>

        <Tabs value={currentTab} onValueChange={setTab} className="flex flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-7">
            <TabsList className="h-auto justify-start gap-1 rounded-none border-0 bg-transparent p-0">
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
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setHistoryOpen(true);
              }}
              className="ml-auto h-9 cursor-pointer gap-1.5 whitespace-nowrap rounded-md px-3 text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
            >
              <History className="h-4 w-4" />
              Histórico de chamados
            </Button>
          </div>

          <div className="bg-muted/10 p-6">
            <TabsContent value="cliente" className="m-0 space-y-5">
              <ClientTab client={client} contacts={contacts} companies={companies} tickets={tickets} events={events} />
            </TabsContent>
            <TabsContent value="hadron" className="m-0 space-y-5">
              <ClientHadronTab client={client} modules={modules} terminals={terminals} />
            </TabsContent>
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

      <ClientTicketsHistoryModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        client={{
          acronym: client.acronym,
          razaoSocial: client.razaoSocial,
          status: client.status,
        }}
      />
    </AppShell>
  );

}
