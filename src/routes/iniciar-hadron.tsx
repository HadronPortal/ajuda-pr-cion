import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileCode2,
  Filter,
  GitBranch,
  History,
  ListChecks,
  PackageCheck,
  Rocket,
  Search,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { Breadcrumbs } from "@/components/portal/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { erpVersions, formatVersionDate } from "@/lib/erp-versions";
import { hadronOptions } from "@/lib/hadron-options";
import { cvsArticles } from "@/lib/cvs-catalogs-imported";
import { useTickets } from "@/lib/tickets-store";

export const Route = createFileRoute("/iniciar-hadron")({
  head: () => ({ meta: [{ title: "Iniciar Hadron - CRM Procion" }] }),
  component: HadronPage,
});

type Detail = { title: string; subtitle: string; body: string; meta: string[] };

const options = [
  {
    id: "1111",
    title: "Cadastro de Tabelas de Tributacoes",
    description: "Ajustes e melhorias nas regras fiscais.",
    owner: "PRCEDU",
    priority: "Alta",
    status: "Correcao",
  },
  {
    id: "1116",
    title: "Cadastro de Operadores",
    description: "Permissões e configurações dos usuários.",
    owner: "PRCEDU",
    priority: "Media",
    status: "Melhoria",
  },
  {
    id: "1243",
    title: "Complementos Gerais N.C.M.",
    description: "Manutencao dos complementos tributarios.",
    owner: "PRCWAG",
    priority: "Alta",
    status: "Correcao",
  },
  {
    id: "1398",
    title: "Emissão de Nota Fiscal Eletrônica",
    description: "Validacoes e retorno da SEFAZ.",
    owner: "PRCJUL",
    priority: "Baixa",
    status: "Evolucao",
  },
];

const occurrences = [
  {
    type: "Problema Hadron",
    option: "1111 - Tabelas de Tributacoes",
    title: "Alíquota não aplicada na venda",
    owner: "PRCEDU",
    state: "Aguardando revisao",
    date: "18/07/2026",
  },
  {
    type: "Configuração",
    option: "1116 - Cadastro de Operadores",
    title: "Permissão de acesso ao financeiro",
    owner: "PRCJUL",
    state: "Em análise",
    date: "17/07/2026",
  },
  {
    type: "Problema Externo",
    option: "1398 - Nota Fiscal Eletronica",
    title: "Retorno intermitente da SEFAZ",
    owner: "PRCWAG",
    state: "Resolvido",
    date: "16/07/2026",
  },
  {
    type: "Solicitação/Sugestão",
    option: "1243 - Complementos N.C.M.",
    title: "Novo filtro por classificacao",
    owner: "PRCGUI",
    state: "Em desenvolvimento",
    date: "15/07/2026",
  },
];

const releases = [
  {
    version: "2.0.2026.07.18",
    title: "Ajustes na emissão de NF-e",
    module: "Vendas / NFE",
    owner: "PRCEDU",
    published: "18/07/2026",
    status: "Publicado",
  },
  {
    version: "2.0.2026.07.16",
    title: "Permissoes por grupo de operadores",
    module: "Basico / Seguranca",
    owner: "PRCJUL",
    published: "16/07/2026",
    status: "Publicado",
  },
  {
    version: "2.0.2026.07.14",
    title: "Melhorias no fechamento financeiro",
    module: "Financeiro",
    owner: "PRCWAG",
    published: "14/07/2026",
    status: "Homologacao",
  },
];

const articles = [
  {
    title: "Como configurar uma tabela de tributacao",
    category: "Fiscal",
    option: "1111",
    author: "PRCEDU",
    updated: "18/07/2026",
    views: 284,
  },
  {
    title: "Permissoes do cadastro de operadores",
    category: "Basico",
    option: "1116",
    author: "PRCJUL",
    updated: "16/07/2026",
    views: 176,
  },
  {
    title: "Tratamento de rejeicoes da NF-e",
    category: "Vendas - NFE",
    option: "1398",
    author: "PRCWAG",
    updated: "14/07/2026",
    views: 421,
  },
];

const operatorStats = [
  ["PRCEDU", 11],
  ["PRCJUL", 11],
  ["PRCWAG", 8],
  ["PRCWLS", 6],
  ["PRCGUI", 2],
  ["PRCAND", 1],
] as const;

function HadronPage() {
  const [tab, setTab] = useState("visao-geral");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [detail, setDetail] = useState<Detail | null>(null);

  return (
    <AppShell>
      <div className="space-y-5">
        <header className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Breadcrumbs items={[{ label: "Iniciar Hadron" }]} />
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Rocket className="h-5 w-5" />
              </span>
              <div>
                <h1 className="text-xl font-medium text-foreground">Iniciar Hadron</h1>
                <p className="text-xs text-muted-foreground">
                  Gestao de opcoes, ocorrencias, releases e artigos do sistema.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar no Hadron..."
                className="pl-9"
              />
            </div>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-36 cursor-pointer">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendentes">Pendentes</SelectItem>
                <SelectItem value="concluidos">Concluidos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </header>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto rounded-lg border bg-card p-1">
            {[
              ["visao-geral", "Visao geral", Rocket],
              ["opcoes", "Opcoes", ListChecks],
              ["ocorrencias", "Ocorrências", ClipboardCheck],
              ["releases", "Releases", GitBranch],
              ["versoes", "Versões", History],
              ["artigos", "Artigos", BookOpenText],
            ].map(([value, label, Icon]) => (
              <TabsTrigger
                key={String(value)}
                value={String(value)}
                className="cursor-pointer gap-2 px-4"
              >
                <Icon className="h-4 w-4" />
                {String(label)}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="visao-geral">
            <Overview onOpen={setDetail} />
          </TabsContent>
          <TabsContent value="opcoes">
            <OptionsTable query={query} onOpen={setDetail} />
          </TabsContent>
          <TabsContent value="ocorrencias">
            <OccurrencesTable query={query} onOpen={setDetail} />
          </TabsContent>
          <TabsContent value="releases">
            <ReleasesTable query={query} onOpen={setDetail} />
          </TabsContent>
          <TabsContent value="versoes">
            <VersionsTable query={query} onOpen={setDetail} />
          </TabsContent>
          <TabsContent value="artigos">
            <ArticlesTable query={query} onOpen={setDetail} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent
          className="max-w-2xl gap-0 overflow-hidden bg-card p-0 [&>button]:hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogTitle className="sr-only">{detail?.title}</DialogTitle>
          <DetailModalHeader
            icon={Info}
            title={detail?.title ?? ""}
            meta={detail?.subtitle}
            onClose={() => setDetail(null)}
          />
          <div className="space-y-4 px-5 py-4">

          <div className="grid gap-2 sm:grid-cols-2">
            {detail?.meta.map((item) => (
              <div
                key={item}
                className="rounded-lg border bg-background p-3 text-xs text-muted-foreground"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="rounded-lg border bg-background p-4 text-sm leading-6 text-foreground">
            {detail?.body}
          </p>
          <div className="flex justify-end">
            <Button onClick={() => setDetail(null)} className="cursor-pointer">
              Concluir visualizacao
            </Button>
          </div>
          </div>
        </DialogContent>

      </Dialog>
    </AppShell>
  );
}

function Overview({ onOpen }: { onOpen: (d: Detail) => void }) {
  const tickets = useTickets();
  const active = useMemo(
    () => tickets.filter((ticket) => !["Finalizado", "Cancelado"].includes(ticket.status)),
    [tickets],
  );
  const completed = useMemo(
    () => tickets.filter((ticket) => ["Finalizado", "Cancelado"].includes(ticket.status)),
    [tickets],
  );
  const latestVersion = erpVersions[0];
  const cards = [
    ["Ag. revisão / ocorrência", `${active.length} / ${tickets.length}`, ClipboardCheck, "text-rose-600 bg-rose-500/10"],
    ["Opção ocorrência / total", `${active.length} / ${hadronOptions.length}`, ListChecks, "text-cyan-600 bg-cyan-500/10"],
    ["Releases", String(cvsArticles.length), PackageCheck, "text-amber-600 bg-amber-500/10"],
    ["Versão Hádron", latestVersion ? `${formatVersionDate(latestVersion.data_versao)} v${latestVersion.versao}` : "Não informada", Code2, "text-slate-600 bg-slate-500/10"],
  ] as const;
  return (
    <div className="mt-5 space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon, color]) => (
          <div key={label} className="min-h-20 rounded-md border bg-card px-4 py-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={cn("grid h-6 w-6 place-items-center rounded", color)}>
                <Icon className="h-3.5 w-3.5" />
              </span>
              <p className="text-[10px] font-medium uppercase text-muted-foreground">{label}</p>
            </div>
            <p className="mt-2 text-lg font-medium">{value}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <HadronDashboardPanel title="Opções" subtitle="Exceto Hádron">
          {hadronOptions.slice(0, 14).map((option) => (
            <button key={option.id} onClick={() => onOpen({ title: option.description, subtitle: `Opção ${option.option}`, body: option.label, meta: [`Formulário: ${option.form || option.option}`, "Origem: cvs_options.json"] })} className="grid w-full cursor-pointer grid-cols-[72px_72px_1fr] items-center gap-2 border-b px-3 py-2 text-left text-xs hover:bg-muted/40">
              <Badge variant="destructive" className="justify-center text-[9px]">OPÇÃO</Badge>
              <span className="text-muted-foreground">{option.option}</span>
              <span className="truncate text-primary">{option.description}</span>
            </button>
          ))}
        </HadronDashboardPanel>
        <HadronDashboardPanel title="Ocorrências" subtitle="Aguardando revisão">
          <HadronOccurrenceRows rows={active.slice(0, 10)} onOpen={onOpen} empty="Nenhuma ocorrência aguardando revisão." />
        </HadronDashboardPanel>
        <HadronDashboardPanel title="Ocorrências" subtitle="Geral">
          <HadronOccurrenceRows rows={[...active, ...completed].slice(0, 12)} onOpen={onOpen} empty="Nenhuma ocorrência registrada." />
        </HadronDashboardPanel>
        <HadronDashboardPanel title="Releases" subtitle="Últimos releases">
          {[...cvsArticles].reverse().slice(0, 12).map((release) => (
            <button key={release.id} onClick={() => onOpen({ title: release.title, subtitle: `Release ${release.id}`, body: release.title, meta: [`Status: ${release.status}`, "Origem: cvs_articles.json"] })} className="grid w-full cursor-pointer grid-cols-[64px_1fr_72px] items-center gap-3 border-b px-3 py-2 text-left text-xs hover:bg-muted/40">
              <span className="text-muted-foreground">{release.id}</span>
              <span className="truncate font-medium">{release.title}</span>
              <Badge variant="outline" className="justify-center">{release.status}</Badge>
            </button>
          ))}
        </HadronDashboardPanel>
      </div>
    </div>
  );
}

function HadronDashboardPanel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="min-h-80 overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="flex items-baseline gap-2 border-b px-3 py-3">
        <h2 className="text-sm font-medium">{title}</h2>
        <span className="text-[10px] text-primary">{subtitle}</span>
      </div>
      <div className="max-h-80 overflow-y-auto">{children}</div>
    </section>
  );
}

function HadronOccurrenceRows({ rows, onOpen, empty }: { rows: ReturnType<typeof useTickets>; onOpen: (d: Detail) => void; empty: string }) {
  if (!rows.length) return <p className="p-6 text-center text-xs text-muted-foreground">{empty}</p>;
  return rows.map((ticket) => (
    <button key={ticket.id} onClick={() => onOpen({ title: ticket.subject, subtitle: ticket.protocol, body: ticket.description || "Sem descrição informada.", meta: [`Módulo: ${ticket.module}`, `Operador: ${ticket.owner}`, `Status: ${ticket.status}`, `Atualizado: ${new Date(ticket.updatedAt).toLocaleString("pt-BR")}`] })} className="grid w-full cursor-pointer grid-cols-[90px_1fr_90px] items-center gap-3 border-b px-3 py-2 text-left text-xs hover:bg-muted/40">
      <span className="truncate text-muted-foreground">{ticket.module}</span>
      <span className="truncate">{ticket.subject}</span>
      <Badge variant="outline" className="justify-center truncate">{ticket.status}</Badge>
    </button>
  ));
}

function OptionsTable({ query, onOpen }: TableProps) {
  const rows = useFiltered(options, query);
  return (
    <DataCard
      title="Opcoes"
      subtitle="Cadastros e funcionalidades monitoradas pelo time Hadron."
      headers={["Status", "P", "Opção", "Descrição", "Responsável"]}
    >
      {rows.map((o) => (
        <DataRow
          key={o.id}
          onClick={() => onOpen(optionDetail(o))}
          cells={[
            <Badge variant="outline">{o.status}</Badge>,
            <Priority value={o.priority} />,
            o.id,
            <div>
              <p>{o.title}</p>
              <p className="text-xs text-muted-foreground">{o.description}</p>
            </div>,
            o.owner,
          ]}
        />
      ))}
    </DataCard>
  );
}
function OccurrencesTable({ query, onOpen }: TableProps) {
  const rows = useFiltered(occurrences, query);
  return (
    <DataCard
      title="Ocorrências"
      subtitle="Fila geral, revisoes e solucoes registradas."
      headers={["Tipo", "Opção / formulário", "Ocorrência", "Operador", "Situação", "Data"]}
    >
      {rows.map((o) => (
        <DataRow
          key={o.title}
          onClick={() =>
            onOpen({
              title: o.title,
              subtitle: o.option,
              body: "Registro detalhado da ocorrência, análise realizada e solução proposta pelo operador.",
              meta: [
                `Tipo: ${o.type}`,
                `Operador: ${o.owner}`,
                `Situação: ${o.state}`,
                `Data: ${o.date}`,
              ],
            })
          }
          cells={[
            o.type,
            o.option,
            o.title,
            o.owner,
            <Badge variant="outline">{o.state}</Badge>,
            o.date,
          ]}
        />
      ))}
    </DataCard>
  );
}
function ReleasesTable({ query, onOpen }: TableProps) {
  const rows = useFiltered(releases, query);
  return (
    <DataCard
      title="Releases"
      subtitle="Histórico de publicações e itens em homologação."
      headers={["Versão", "Descrição", "Módulo", "Responsável", "Publicação", "Status"]}
    >
      {rows.map((o) => (
        <DataRow
          key={o.version}
          onClick={() =>
            onOpen({
              title: o.title,
              subtitle: `Release ${o.version}`,
              body: "Pacote de atualização com correções, melhorias e orientações de implantação.",
              meta: [
                `Módulo: ${o.module}`,
                `Responsável: ${o.owner}`,
                `Publicacao: ${o.published}`,
                `Status: ${o.status}`,
              ],
            })
          }
          cells={[
            o.version,
            o.title,
            o.module,
            o.owner,
            o.published,
            <Badge variant="outline">{o.status}</Badge>,
          ]}
        />
      ))}
    </DataCard>
  );
}

function VersionsTable({ query, onOpen }: TableProps) {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const rows = erpVersions.filter((version) =>
    Object.values(version).some((value) =>
      value.toLocaleLowerCase("pt-BR").includes(normalizedQuery),
    ),
  );

  return (
    <DataCard
      title="Versões do ERP"
      subtitle="Histórico oficial das versões liberadas do Hadron."
      headers={["Versão", "Liberação", "Runtime", "Arquivos", "Base", "Alteração"]}
    >
      {rows.map((version) => (
        <DataRow
          key={version.id}
          onClick={() =>
            onOpen({
              title: `Versão ${version.versao}`,
              subtitle: `Liberada em ${formatVersionDate(version.data_versao)}`,
              body: "Registro técnico da versão liberada do ERP Hadron.",
              meta: [
                `Runtime: ${formatVersionDate(version.data_runtime)}`,
                `Arquivos: ${formatVersionDate(version.data_arq)}`,
                `Base: ${formatVersionDate(version.data_arq_bas)}`,
                `Alteração: ${formatVersionDate(version.data_alterar)}`,
              ],
            })
          }
          cells={[
            version.versao,
            formatVersionDate(version.data_versao),
            formatVersionDate(version.data_runtime),
            formatVersionDate(version.data_arq),
            formatVersionDate(version.data_arq_bas),
            formatVersionDate(version.data_alterar),
          ]}
        />
      ))}
    </DataCard>
  );
}

function ArticlesTable({ query, onOpen }: TableProps) {
  const rows = useFiltered(articles, query);
  return (
    <DataCard
      title="Artigos"
      subtitle="Documentacao tecnica vinculada as opcoes do Hadron."
      headers={["Artigo", "Categoria", "Opção", "Autor", "Atualizado", "Visualizações"]}
    >
      {rows.map((o) => (
        <DataRow
          key={o.title}
          onClick={() =>
            onOpen({
              title: o.title,
              subtitle: `${o.category} - Opção ${o.option}`,
              body: "Conteúdo técnico com orientações de configuração, validação e resolução do processo no Hádron.",
              meta: [
                `Autor: ${o.author}`,
                `Atualizado: ${o.updated}`,
                `${o.views} visualizacoes`,
                `Opção: ${o.option}`,
              ],
            })
          }
          cells={[o.title, o.category, o.option, o.author, o.updated, o.views]}
        />
      ))}
    </DataCard>
  );
}

type TableProps = { query: string; onOpen: (d: Detail) => void };
function useFiltered<T>(rows: T[], query: string) {
  return useMemo(
    () => rows.filter((r) => JSON.stringify(r).toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  );
}
function optionDetail(o: (typeof options)[number]): Detail {
  return {
    title: o.title,
    subtitle: `Opção ${o.id}`,
    body: o.description,
    meta: [
      `Status: ${o.status}`,
      `Prioridade: ${o.priority}`,
      `Responsável: ${o.owner}`,
      "Origem: CRM Hadron",
    ],
  };
}
function SectionTitle({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Rocket;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <h2 className="text-sm font-medium">{title}</h2>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
function StatusDot({ tone }: { tone: string }) {
  return (
    <span
      className={cn(
        "h-2.5 w-2.5 shrink-0 rounded-full",
        tone === "Alta" ? "bg-rose-500" : tone === "Media" ? "bg-amber-500" : "bg-emerald-500",
      )}
    />
  );
}
function Priority({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <StatusDot tone={value} />
      {value}
    </span>
  );
}
function DataCard({
  title,
  subtitle,
  headers,
  children,
}: {
  title: string;
  subtitle: string;
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b p-5">
        <div>
          <h2 className="text-base font-medium">{title}</h2>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
        <span className="text-xs text-muted-foreground">Clique em uma linha para abrir</span>
      </div>
      <div className="app-scrollbar overflow-x-auto">
        <div className="min-w-[850px]">
          <div
            className="grid border-b bg-muted/30 px-4 py-2.5 text-[11px] uppercase text-muted-foreground"
            style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}
          >
            {headers.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          <div className="divide-y">{children}</div>
        </div>
      </div>
    </section>
  );
}
function DataRow({ cells, onClick }: { cells: React.ReactNode[]; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grid w-full cursor-pointer items-center px-4 py-3 text-left text-xs transition hover:bg-muted/35"
      style={{ gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))` }}
    >
      {cells.map((c, i) => (
        <div key={i} className="min-w-0 pr-3">
          {c}
        </div>
      ))}
    </button>
  );
}
