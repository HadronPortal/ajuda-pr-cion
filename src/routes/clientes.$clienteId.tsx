import { useState } from "react";
import { createFileRoute, Link, useNavigate, notFound } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { ArrowLeft, Building2, CalendarDays, Database, History, MapPin, Monitor, Network, UsersRound, Wifi } from "lucide-react";
import { ClientTicketsHistoryModal } from "@/components/tickets/ClientTicketsHistoryModal";

import { AppShell } from "@/components/portal/AppShell";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ClientTab,
  ClientHadronTab,
  ClientInternetTab,
  ClientDevicesTab,
  ClientUsersTab,
  ClientTerminalsTab,
  ClientCompaniesTab,
} from "./clientes.index";

import { getClientDetail } from "@/lib/clients-api";
import { normalizeCityUf } from "@/lib/br-city";
import { useClients, resolveGroupCode, getGroupMembers } from "@/lib/clients-store";

const tabs = ["cliente", "hadron", "internet", "dispositivos", "usuarios", "terminais", "empresas"] as const;
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
    <AppShell fullWidth>
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
  const { client, contacts, companies, users, terminals, modules, internet, tickets, events } = Route.useLoaderData();
  const { tab, from, ticketId } = Route.useSearch();
  const navigate = useNavigate();
  const [historyOpen, setHistoryOpen] = useState(false);
  const showReturnToTicket = from === "chamado" && !!ticketId;
  const { clients: allClients } = useClients({ onlyActive: false });
  const showInternet = internet.hasActiveContract || internet.contracts.some((c: { active: boolean }) => c.active);
  const showDevices = showInternet && internet.devices.length > 0;

  // Grupo: usa group_acronym do cliente. Se vazio, verifica se ele é raiz de
  // um grupo (algum outro cliente aponta group_acronym para a sigla dele).
  const groupCode = resolveGroupCode(client, allClients);
  const groupMembersCount = groupCode ? getGroupMembers(groupCode, allClients).length : 0;


  const requestedTab = tab;
  const tabAllowed =
    (tabs as readonly string[]).includes(requestedTab) &&
    (requestedTab !== "dispositivos" || showDevices) &&
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
      <div className="mb-4 flex items-center gap-2">
        <div className="flex items-center gap-2">
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
          <Link
            to="/clientes"
            className="cursor-pointer text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Voltar para Clientes
          </Link>
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
      </div>

      <Tabs value={currentTab} onValueChange={setTab} className="flex flex-col gap-5">
        <header className="overflow-hidden rounded-lg bg-primary px-5 py-5 text-primary-foreground shadow-md lg:px-7">
          <div className="flex flex-wrap items-center justify-between gap-5">
            <div className="flex min-w-0 items-center gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-white text-primary shadow-sm">
                <Building2 className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="border-0 bg-emerald-400/25 text-[10px] text-white shadow-none">
                    {client.status}
                  </Badge>
                </div>
                <h1 className="mt-1 truncate text-lg font-semibold text-white">
                  {client.razaoSocial}
                </h1>
                <p className="mt-1 text-xs text-white/80">
                  {client.fantasia}
                  {groupCode ? <span className="ml-2">· Grupo {groupCode}</span> : null}
                </p>
              </div>
            </div>

            <div className="flex flex-1 flex-wrap items-center justify-end gap-4 lg:gap-6">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10"><UsersRound className="h-4 w-4" /></span>
                <div><p className="text-[9px] uppercase text-white/65">Versão Hádron</p><p className="text-xs font-medium">{client.version || "Não informada"}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10"><CalendarDays className="h-4 w-4" /></span>
                <div><p className="text-[9px] uppercase text-white/65">Atualização</p><p className="text-xs font-medium">{client.updated || "Não informada"}</p></div>
              </div>
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10"><MapPin className="h-4 w-4" /></span>
                <div><p className="text-[9px] uppercase text-white/65">Cidade</p><p className="text-xs font-medium">{normalizeCityUf(client.city) || "Não informada"}</p></div>
              </div>
              {groupCode && (
                <Button asChild variant="outline" size="sm" className="h-9 border-white/60 bg-transparent text-xs text-white hover:bg-white/10 hover:text-white">
                  <Link to="/clientes" search={{ grupo: groupCode }}>
                    Ver clientes do grupo {groupCode} ({groupMembersCount})
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </header>

        {currentTab !== "cliente" && (
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-7">
            <TabsList className="h-auto justify-start gap-1 rounded-none border-0 bg-transparent p-0">
              {[
                ["cliente", "Cliente", Building2],
                ["hadron", "Hadron", Database],
                ...(showInternet ? [["internet", "Internet", Wifi]] : []),
                ...(showDevices ? [["dispositivos", "Dispositivos", Monitor]] : []),
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
        )}

          <div>
            <TabsContent value="cliente" className="m-0 space-y-5">
              <ClientTab
                client={client}
                contacts={contacts}
                companies={companies}
                terminals={terminals}
                tickets={tickets}
                events={events}
                onOpenCompanies={() => setTab("empresas")}
                onNavigateTab={setTab}
                showInternet={showInternet}
                showDevices={showDevices}
              />
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
