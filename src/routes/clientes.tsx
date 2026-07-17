import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Database,
  HardDrive,
  Monitor,
  Phone,
  Search,
  Server,
  UsersRound,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Clientes - Portal Procion" }] }),
  component: ClientsPage,
});

const clientRows = [
  {
    id: "avc",
    registered: "06/05/2026",
    acronym: "AVC",
    group: "ASC",
    name: "CENTER GLASS ACESSORIOS AUTOMOBILISTICOS LTDA",
    segment: "Comercio",
    size: "Pequeno",
    version: "2.0",
    updated: "15/06/2026 09:58",
    city: "Catanduva - SP",
    cnpj: "66.613.387/0001-60",
    status: "Ativo",
  },
  {
    id: "mit",
    registered: "12/03/2019",
    acronym: "MIT",
    group: "",
    name: "MINERACAO ITAPORANGA LTDA",
    segment: "Industria",
    size: "Medio",
    version: "2.0",
    updated: "08/07/2026 08:24",
    city: "Curitiba - PR",
    cnpj: "18.447.221/0001-40",
    status: "Ativo",
  },
  {
    id: "mrg",
    registered: "18/09/2020",
    acronym: "MRG",
    group: "",
    name: "MERCEARIA E SACOLAO GOMES",
    segment: "Comercio",
    size: "Pequeno",
    version: "2.0",
    updated: "08/07/2026 08:17",
    city: "Belo Horizonte - MG",
    cnpj: "31.095.640/0001-12",
    status: "Ativo",
  },
  {
    id: "epb",
    registered: "04/11/2022",
    acronym: "EPB",
    group: "",
    name: "EPAPER BOX",
    segment: "Industria",
    size: "Medio",
    version: "2.0",
    updated: "08/07/2026 08:40",
    city: "Sao Paulo - SP",
    cnpj: "47.510.982/0001-73",
    status: "Ativo",
  },
];

const modules = [
  "Faturamento",
  "Compras",
  "Contas a Receber",
  "Contas a Pagar",
  "Estoque",
  "Ordens de Servico",
  "Frente de Loja",
];
const unavailableModules = [
  "Folha de Pgto",
  "Livros Fiscais - SPED",
  "Contabilidade",
  "Ativo Imobilizado",
  "Transportes",
  "Mobile",
  "Integracoes Hadron Web",
  "Fluxo de Caixa",
];
const terminals = [
  ["05", "181.225.157.89", "P:/PROGEST/", "02/07/2026", "09/07/2026 09:14"],
  ["02", "177.21.58.91", "P:/PROGEST/", "02/07/2026", "06/07/2026 10:57"],
  ["03", "177.21.58.91", "P:/PROGEST/", "02/07/2026", "06/07/2026 10:50"],
  ["50", "177.21.58.91", "P:/PROGEST/", "11/05/2026", "27/05/2026 18:14"],
  ["01", "177.21.58.91", "P:/PROGEST/", "11/05/2026", "26/05/2026 11:29"],
];

function ClientsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Todos");
  const [selected, setSelected] = useState<(typeof clientRows)[number] | null>(null);
  const filtered = useMemo(
    () =>
      clientRows.filter((client) => {
        const text = `${client.acronym} ${client.name} ${client.cnpj} ${client.city}`.toLowerCase();
        return (
          text.includes(query.toLowerCase()) && (status === "Todos" || client.status === status)
        );
      }),
    [query, status],
  );

  return (
    <AppShell>
      <PageHeader
        title="Clientes"
        description="Cadastro, ambiente e relacionamento dos clientes."
        breadcrumbs={[{ label: "Clientes" }]}
      />
      <Card className="mb-4 p-4">
        <div className="grid gap-3 md:grid-cols-[minmax(260px,1fr)_220px]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por sigla, nome, CNPJ ou cidade..."
              className="h-10 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
          >
            <option>Todos</option>
            <option>Ativo</option>
            <option>Inativo</option>
          </select>
        </div>
      </Card>
      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead className="bg-muted/35 text-xs uppercase text-muted-foreground">
              <tr>
                {[
                  "Cadastro",
                  "Sigla",
                  "Nome / perfil",
                  "Versao / setup",
                  "Cidade / UF",
                  "CNPJ",
                  "Status",
                  "",
                ].map((label) => (
                  <th key={label} className="px-4 py-3 text-left font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((client) => (
                <tr
                  key={client.id}
                  onClick={() => setSelected(client)}
                  className="cursor-pointer transition-colors hover:bg-primary/[0.04]"
                >
                  <td className="px-4 py-4 text-muted-foreground">{client.registered}</td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-primary">{client.acronym}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.group || "Sem grupo"}
                    </div>
                  </td>
                  <td className="max-w-[340px] px-4 py-4">
                    <div className="truncate font-medium">{client.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.segment} · {client.size}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div>{client.version}</div>
                    <div className="text-xs text-muted-foreground">{client.updated}</div>
                  </td>
                  <td className="px-4 py-4">{client.city}</td>
                  <td className="px-4 py-4 text-muted-foreground">{client.cnpj}</td>
                  <td className="px-4 py-4">
                    <Badge className="bg-emerald-500/12 text-emerald-600 dark:text-emerald-400">
                      {client.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <ClientDetail client={selected} onOpenChange={(open) => !open && setSelected(null)} />
    </AppShell>
  );
}

function ClientDetail({
  client,
  onOpenChange,
}: {
  client: (typeof clientRows)[number] | null;
  onOpenChange: (open: boolean) => void;
}) {
  const isAvc = client?.id === "avc";
  return (
    <Dialog open={!!client} onOpenChange={onOpenChange}>
      <DialogContent className="h-[92vh] max-h-[920px] w-[96vw] max-w-[1500px] gap-0 overflow-hidden border-border bg-background p-0">
        <DialogTitle className="sr-only">Ficha do cliente {client?.acronym}</DialogTitle>
        <DialogDescription className="sr-only">
          Dados completos, ambiente e relacionamento do cliente.
        </DialogDescription>
        {client && (
          <>
            <header className="border-b border-border px-7 py-5 pr-14">
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
                      {client.name} {client.group && `(${client.group})`}
                    </h2>
                    <p className="text-sm text-muted-foreground">{client.name}</p>
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
            <Tabs defaultValue="cliente" className="flex min-h-0 flex-1 flex-col">
              <TabsList className="h-auto justify-start gap-1 rounded-none border-b border-border bg-transparent px-7 py-0">
                {[
                  ["cliente", "Cliente", Building2],
                  ["hadron", "Hadron", Database],
                  ["usuarios", "Usuarios", UsersRound],
                  ["terminais", "Terminais", Monitor],
                  ["empresas", "Empresas", Server],
                ].map(([value, label, Icon]) => (
                  <TabsTrigger
                    key={value as string}
                    value={value as string}
                    className="gap-2 rounded-none border-b-2 border-transparent px-4 py-3 data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    <Icon className="h-4 w-4" />
                    {label as string}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="min-h-0 flex-1 overflow-y-auto bg-muted/10 p-6">
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] uppercase text-muted-foreground">{label}</p>
      <p className="mt-0.5 font-medium">{value}</p>
    </div>
  );
}
function Section({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: typeof Building2;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <h3 className="mb-4 flex items-center gap-2 font-medium">
        <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h3>
      {children}
    </Card>
  );
}
function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function ClientTab() {
  return (
    <>
      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Contatos" icon={Phone}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Telefone principal" value="(16) 3116-5795 · Helden / Marketing" />
            <Field label="Loja Sao Carlos" value="Leticia · Atendimento" />
            <Field label="E-mail" value="contato@autovidrossaocarlos.com.br" />
            <Field label="Financeiro" value="financeiro@autovidrossacarlos.com.br · Marina" />
          </div>
        </Section>
        <Section title="Empresa principal" icon={Building2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome fantasia" value="CENTER GLASS CATANDUVA" />
            <Field label="CNPJ" value="66.613.387/0001-60" />
            <Field label="IE / CNAE" value="260.382.987.118 · 45307-03" />
            <Field label="Regime" value="Comercio · Pequeno · Simples" />
            <Field label="Endereco" value="Rua Rosa Cruz, 2188 · Bosque das Laranjeiras" />
            <Field label="Cidade" value="Catanduva - SP · CEP 15805-254" />
          </div>
        </Section>
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Responsavel e contabilidade" icon={CircleUserRound}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Responsavel" value="MAURO APARECIDO SANCHES" />
            <Field label="CPF / RG" value="040.172.448-40 · 14.143.256-1" />
            <Field label="Escritorio" value="MARQUES E SANTOS" />
            <Field label="Contador" value="EDUARDO MARQUES DOS SANTOS" />
            <Field label="Telefone" value="(16) 98130-0428" />
            <Field label="E-mail" value="FISCALMARQUESSANTOS2011@GMAIL.COM" />
          </div>
        </Section>
        <Section title="Proximo evento" icon={CalendarDays}>
          <div className="rounded-md border border-border p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-medium">Acompanhamento CENTER GLASS CATANDUVA</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  11/05/2026 · 14:00 as 15:00 · PRCREN
                </p>
              </div>
              <Badge className="bg-emerald-500/12 text-emerald-600">Concluido</Badge>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Chamado relacionado: PRC-1778502127
            </p>
          </div>
        </Section>
      </div>
      <Section title="Historico de suporte" icon={HardDrive}>
        <SupportRows />
      </Section>
    </>
  );
}

function SupportRows() {
  return (
    <div className="divide-y divide-border rounded-md border border-border">
      {[
        [
          "CONFIGURACAO DE IMPRESSORA",
          "BASICO - TERCEIROS",
          "PRCREN",
          "Baixa",
          "11/05/2026",
          "PRC-1778502127",
        ],
        [
          "NOTA FISCAL NAO AUTORIZADA",
          "VENDAS - NFE",
          "PRCSUZ",
          "Media",
          "28/05/2026",
          "PRC-1779945138",
        ],
        [
          "AJUSTE FINANCEIRO",
          "FINANCEIRO - CONTAS A PAGAR",
          "PRCMAR",
          "Alta",
          "02/07/2026",
          "PRC-1782011845",
        ],
      ].map((row) => (
        <div
          key={row[5]}
          className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-[1.4fr_1.2fr_.6fr_.5fr_.7fr_auto]"
        >
          <span className="font-medium">{row[0]}</span>
          <span className="text-muted-foreground">{row[1]}</span>
          <span>{row[2]}</span>
          <span>{row[3]}</span>
          <span>{row[4]}</span>
          <Button variant="ghost" size="sm">
            Ver
          </Button>
        </div>
      ))}
    </div>
  );
}

function HadronTab() {
  return (
    <>
      <Section title="Ambiente Hadron" icon={Database}>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Serial" value="AVC - 00000000415 - 19723520" />
          <Field label="Responsavel" value="PRCCRIS / PRCCRIS" />
          <Field label="Tempo de instalacao" value="8 horas" />
          <Field label="Rede" value="5 terminais · Cabo" />
          <Field label="Boleto bancario" value="Nao" />
          <Field label="Homologacao conjunta NF-e" value="Nao" />
        </div>
      </Section>
      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Modulos adquiridos" icon={CheckCircle2}>
          <div className="grid gap-2 sm:grid-cols-2">
            {modules.map((m) => (
              <div
                key={m}
                className="flex items-center gap-2 rounded-md bg-emerald-500/8 px-3 py-2 text-sm"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {m}
              </div>
            ))}
          </div>
        </Section>
        <Section title="Modulos nao contratados" icon={Database}>
          <div className="grid gap-2 sm:grid-cols-2">
            {unavailableModules.map((m) => (
              <div
                key={m}
                className="rounded-md bg-muted/50 px-3 py-2 text-sm text-muted-foreground"
              >
                {m}
              </div>
            ))}
          </div>
        </Section>
      </div>
      <Section title="Documentos fiscais" icon={HardDrive}>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            ["NF-e", true],
            ["NFC-e", true],
            ["CT-e", false],
            ["NFS-e", false],
            ["MDF-e", false],
            ["SAT", false],
          ].map(([name, active]) => (
            <div
              key={name as string}
              className={cn(
                "rounded-md border p-3 text-center text-sm",
                active
                  ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-600"
                  : "border-border text-muted-foreground",
              )}
            >
              {name as string}
              <div className="mt-1 text-xs">{active ? "Habilitado" : "Nao habilitado"}</div>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

function UsersTab() {
  return (
    <Section title="Usuarios do portal" icon={UsersRound}>
      <DataTable
        headers={["Nome", "E-mail", "Operador", "Perfil", "Status", "Cadastro / atualizacao"]}
        rows={[
          [
            "MAURO",
            "MAURO@ESPACOBENTOCARLOS.COM.BR",
            "-",
            "Administrador",
            "Ativo",
            "06/05/2026 09:07",
          ],
        ]}
      />
    </Section>
  );
}
function TerminalsTab() {
  return (
    <Section title="Terminais instalados" icon={Monitor}>
      <DataTable
        headers={["Terminal", "IP", "Pasta", "Data da versao", "Atualizacao", "Acoes"]}
        rows={terminals.map((r) => [...r, "Ver log"])}
      />
    </Section>
  );
}
function CompaniesTab() {
  return (
    <Section title="Empresas vinculadas" icon={Server}>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-md border border-border p-5">
          <p className="text-sm text-primary">001</p>
          <h3 className="mt-1 text-lg font-medium">CENTER GLASS ACESSORIOS</h3>
          <p className="mt-1 text-sm text-muted-foreground">CNPJ 66.613.387/0001-60</p>
          <div className="mt-5 grid grid-cols-2 gap-4">
            <Field label="Terminais" value="3" />
            <Field label="Filiais" value="1" />
            <Field label="Versao" value="2026-07-02" />
            <Field label="Documentos" value="NF-e" />
          </div>
        </div>
        <div className="rounded-md border border-border p-5">
          <h3 className="font-medium">Ambiente</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Sistema operacional" value="Windows 7 (6.2)" />
            <Field label="Unidade" value="P:" />
            <Field label="Notas emitidas" value="0" />
            <Field label="Status" value="Operacional" />
          </div>
        </div>
      </div>
    </Section>
  );
}
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead className="bg-muted/35 text-xs uppercase text-muted-foreground">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-4">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
