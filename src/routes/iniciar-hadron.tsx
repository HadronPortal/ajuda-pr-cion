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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
    description: "Permissoes e configuracoes dos usuarios.",
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
    title: "Emissao de Nota Fiscal Eletronica",
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
    title: "Aliquota nao aplicada na venda",
    owner: "PRCEDU",
    state: "Aguardando revisao",
    date: "18/07/2026",
  },
  {
    type: "Configuracao",
    option: "1116 - Cadastro de Operadores",
    title: "Permissao de acesso ao financeiro",
    owner: "PRCJUL",
    state: "Em analise",
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
    type: "Solicitacao/Sugestao",
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
    title: "Ajustes na emissao de NF-e",
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
              ["ocorrencias", "Ocorrencias", ClipboardCheck],
              ["releases", "Releases", GitBranch],
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
          <TabsContent value="artigos">
            <ArticlesTable query={query} onOpen={setDetail} />
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!detail} onOpenChange={(open) => !open && setDetail(null)}>
        <DialogContent
          className="max-w-2xl bg-card"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="pr-8 font-medium">{detail?.title}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-primary">{detail?.subtitle}</p>
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
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Overview({ onOpen }: { onOpen: (d: Detail) => void }) {
  const cards = [
    ["Ag. revisao / ocorrencia", "1 / 1", ClipboardCheck, "text-amber-600 bg-amber-500/10"],
    ["Opcoes com ocorrencia", "27 / 1.575", ListChecks, "text-primary bg-primary/10"],
    ["Releases", "1.011", PackageCheck, "text-violet-600 bg-violet-500/10"],
    ["Versao Hadron", "2.0", Code2, "text-emerald-600 bg-emerald-500/10"],
  ] as const;
  return (
    <div className="mt-5 space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([label, value, Icon, color]) => (
          <div key={label} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={cn("grid h-9 w-9 place-items-center rounded-lg", color)}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[11px] text-muted-foreground">Atualizado hoje</span>
            </div>
            <p className="mt-4 text-2xl font-medium">{value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[1.55fr_1fr]">
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <SectionTitle
            icon={Sparkles}
            title="Opcoes em destaque"
            subtitle="Itens que precisam de acompanhamento do time."
          />{" "}
          <div className="mt-4 divide-y">
            {options.slice(0, 3).map((o) => (
              <button
                key={o.id}
                onClick={() => onOpen(optionDetail(o))}
                className="flex w-full cursor-pointer items-center gap-3 py-3 text-left hover:bg-muted/35"
              >
                <StatusDot tone={o.priority} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">
                    {o.id} - {o.title}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{o.description}</p>
                </div>
                <Badge variant="outline">{o.owner}</Badge>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-lg border bg-card p-5 shadow-sm">
          <SectionTitle
            icon={UserRound}
            title="Ocorrencias por operador"
            subtitle="Distribuicao atual da fila Hadron."
          />
          <div className="mt-5 space-y-3">
            {operatorStats.map(([name, count]) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-xs">
                  <span>{name}</span>
                  <span>{count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${Math.max(10, (count / 11) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function OptionsTable({ query, onOpen }: TableProps) {
  const rows = useFiltered(options, query);
  return (
    <DataCard
      title="Opcoes"
      subtitle="Cadastros e funcionalidades monitoradas pelo time Hadron."
      headers={["Status", "P", "Opcao", "Descricao", "Responsavel"]}
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
      title="Ocorrencias"
      subtitle="Fila geral, revisoes e solucoes registradas."
      headers={["Tipo", "Opcao / formulario", "Ocorrencia", "Operador", "Situacao", "Data"]}
    >
      {rows.map((o) => (
        <DataRow
          key={o.title}
          onClick={() =>
            onOpen({
              title: o.title,
              subtitle: o.option,
              body: "Registro detalhado da ocorrencia, analise realizada e solucao proposta pelo operador.",
              meta: [
                `Tipo: ${o.type}`,
                `Operador: ${o.owner}`,
                `Situacao: ${o.state}`,
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
      subtitle="Historico de publicacoes e itens em homologacao."
      headers={["Versao", "Descricao", "Modulo", "Responsavel", "Publicacao", "Status"]}
    >
      {rows.map((o) => (
        <DataRow
          key={o.version}
          onClick={() =>
            onOpen({
              title: o.title,
              subtitle: `Release ${o.version}`,
              body: "Pacote de atualizacao com correcoes, melhorias e orientacoes de implantacao.",
              meta: [
                `Modulo: ${o.module}`,
                `Responsavel: ${o.owner}`,
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
function ArticlesTable({ query, onOpen }: TableProps) {
  const rows = useFiltered(articles, query);
  return (
    <DataCard
      title="Artigos"
      subtitle="Documentacao tecnica vinculada as opcoes do Hadron."
      headers={["Artigo", "Categoria", "Opcao", "Autor", "Atualizado", "Visualizacoes"]}
    >
      {rows.map((o) => (
        <DataRow
          key={o.title}
          onClick={() =>
            onOpen({
              title: o.title,
              subtitle: `${o.category} - Opcao ${o.option}`,
              body: "Conteudo tecnico com orientacoes de configuracao, validacao e resolucao do processo no Hadron.",
              meta: [
                `Autor: ${o.author}`,
                `Atualizado: ${o.updated}`,
                `${o.views} visualizacoes`,
                `Opcao: ${o.option}`,
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
    subtitle: `Opcao ${o.id}`,
    body: o.description,
    meta: [
      `Status: ${o.status}`,
      `Prioridade: ${o.priority}`,
      `Responsavel: ${o.owner}`,
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
