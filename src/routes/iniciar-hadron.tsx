import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpenText,
  Boxes,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileCode2,
  Eye,
  Filter,
  Flag,
  GitBranch,
  History,
  KeyRound,
  ListChecks,
  ListTodo,
  Minus,
  PackageCheck,
  Pencil,
  Rocket,
  Search,
  SlidersHorizontal,
  Sparkles,
  ArrowUp,
  Trash2,
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
import { TicketTimelineList } from "@/components/tickets/TicketTimelineList";
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
import { modulesMap } from "@/lib/modules-map";
import { cvsArticles } from "@/lib/cvs-catalogs-imported";
import { getCategory, kbArticlesFull } from "@/lib/kb-data";
import { useTickets, type TicketEvent } from "@/lib/tickets-store";

export const Route = createFileRoute("/iniciar-hadron")({
  head: () => ({ meta: [{ title: "Iniciar Hadron - CRM Procion" }] }),
  component: HadronPage,
});

type Detail = {
  title: string;
  subtitle: string;
  body: string;
  meta: string[];
  occurrences?: TicketEvent[];
};

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

const operatorStats = [
  ["PRCEDU", 11],
  ["PRCJUL", 11],
  ["PRCWAG", 8],
  ["PRCWLS", 6],
  ["PRCGUI", 2],
  ["PRCAND", 1],
] as const;

const hadronChecklist = [
  ["direction", "Elaborado", "Direcionamento", "Direcionamento de Impressão", true, "18/10/2019 11:17", "18/10/2019 11:17"],
  ["pagination", "Elaborado", "Intervalo paginação", "Intervalo de Páginas / Inicial / Final", true, "18/10/2019 11:17", "18/10/2019 11:17"],
  ["ordering", "Elaborado", "Ordenação", "Verificar ordenação/separação/quebra", false, "18/10/2019 11:17", "18/10/2019 11:17"],
  ["data-integrity", "Elaborado", "Integridade dos dados", "Verificar integridade e resultados de todos os Filtros e Intervalos utilizados", false, "18/10/2019 11:17", "18/10/2019 11:17"],
  ["models", "Elaborado", "Modelos", "Modelos dos Relatórios", false, "18/10/2019 11:17", "18/10/2019 11:17"],
  ["alignment", "Elaborado", "Alinhamento", "Alinhamento de Campos, Sintaxe em cada opção habilitada", false, "18/10/2019 11:17", "18/10/2019 11:17"],
  ["print-types", "Elaborado", "Impres. tipos habilitados", "Impressão nas opções habilitadas", true, "18/10/2019 11:17", "18/10/2019 11:17"],
  ["print-enable", "Elaborado", "Hab. tipos impressão", "Habilitação das opções de impressão (disponíveis/necessárias)", true, "18/10/2019 11:17", "18/10/2019 11:17"],
  ["specific-integrity", "Específico", "Integridade", "Consequência dos dados após processo", false, "01/11/2019 16:49", "01/11/2019 16:49"],
  ["other-integrity", "Outros s/ ACP", "Integridade", "Consequência dos dados após processo", false, "01/11/2019 16:48", "01/11/2019 16:49"],
  ["process-integrity", "Processos", "Integridade", "Consequência dos dados após processo", false, "01/11/2019 16:47", "01/11/2019 16:47"],
  ["f3-item", "F3", "Escolher item", "Escolher itens com tela preenchida ou durante sua montagem", true, "01/11/2019 16:43", "01/11/2019 16:43"],
  ["f3-exit", "F3", "Saída com ESC", "Sair com ESC logo na entrada do Formulário, após marcado um item e durante a montagem com vários itens", true, "01/11/2019 16:43", "01/11/2019 16:46"],
  ["zebra", "RHCD", "Impressão Zebra", "Teste em Impressora Zebra e similares", false, "01/11/2019 16:38", "01/11/2019 16:38"],
] as const;

const hadronParameters = [
  {
    id: "1",
    option: "60",
    form: "60",
    title: "Tag ICMS-60 do XML da Nota Fiscal Eletrônica (NF-e, NFC-e, SAT)",
    description: "Cálculo do valor do ICMS-ST recolhido anteriormente.",
    createdAt: "16/08/2022 17:46",
    updatedAt: "17/08/2022 17:05",
  },
  {
    id: "2",
    option: "3",
    form: "3",
    title: "Automatização B2C de procedimento de Cadastro de Clientes (e-commerce)",
    description: "Web",
    createdAt: "18/08/2022 11:03",
    updatedAt: "29/11/2022 12:08",
  },
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
              ["checklist", "Checklist", ListTodo],
              ["parametros", "Parâmetros", SlidersHorizontal],
              ["modulos", "Módulos", Boxes],
              ["seriais", "Seriais", KeyRound],
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
          <TabsContent value="checklist">
            <ChecklistTable query={query} onOpen={setDetail} />
          </TabsContent>
          <TabsContent value="parametros">
            <ParametersTable query={query} onOpen={setDetail} />
          </TabsContent>
          <TabsContent value="modulos">
            <ModulesTable query={query} onOpen={setDetail} />
          </TabsContent>
          <TabsContent value="seriais">
            <SerialsTable query={query} onOpen={setDetail} />
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
          <div className="max-h-[68vh] space-y-4 overflow-y-auto px-5 py-4">
          {detail?.occurrences ? (
            <TicketTimelineList
              events={detail.occurrences}
              variant="compact"
              emptyLabel="Nenhuma ocorrência vinculada a esta opção."
            />
          ) : <>
            <div className="grid gap-2 sm:grid-cols-2">{detail?.meta.map((item) => <div key={item} className="rounded-lg border bg-background p-3 text-xs text-muted-foreground">{item}</div>)}</div>
            <p className="rounded-lg border bg-background p-4 text-sm leading-6 text-foreground">{detail?.body}</p>
          </>}
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
  const optionRows = useMemo(() => {
    const grouped = new Map<string, TicketRow[]>();
    tickets.forEach((ticket) => {
      const optionId = findTicketOption(ticket)?.id;
      if (!optionId) return;
      grouped.set(optionId, [...(grouped.get(optionId) || []), ticket]);
    });
    return hadronOptions
      .filter((option) => option.status !== "10")
      .map((option) => ({ option, tickets: grouped.get(option.id) || [] }))
      .sort((a, b) => b.tickets.length - a.tickets.length || a.option.option.localeCompare(b.option.option, "pt-BR", { numeric: true }))
      .slice(0, 24);
  }, [tickets]);
  const overviewOperatorStats = useMemo(() => {
    const totals = new Map<string, number>();
    optionRows.forEach(({ option, tickets: related }) => {
      if (related.length) related.forEach((ticket) => totals.set(ticket.owner, (totals.get(ticket.owner) || 0) + 1));
      else if (option.owner) totals.set(option.owner, (totals.get(option.owner) || 0) + 1);
    });
    return [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [optionRows]);
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
        <section className="overflow-hidden rounded-md border bg-card shadow-sm">
          <div className="flex items-baseline gap-2 px-4 py-4"><h2 className="text-base font-medium">Opções</h2><span className="text-[10px] text-primary">Exceto Hádron</span></div>
          <div className="grid grid-cols-[118px_36px_64px_minmax(190px,1fr)_92px_44px] border-b px-5 pb-2 text-[11px] text-muted-foreground"><span>Status</span><span>P</span><span>Opção</span><span>Descrição</span><span>Responsável</span><span className="text-center">Ações</span></div>
          <div className="h-72 overflow-y-auto px-3">
            {optionRows.map(({ option, tickets: related }) => {
              const openCount = related.filter((ticket) => !["Finalizado", "Cancelado"].includes(ticket.status)).length;
              const count = Math.max(1, openCount);
              const occurrencesForModal: TicketEvent[] = related.map((ticket) => ({
                id: ticket.id,
                kind: ["Finalizado", "Cancelado"].includes(ticket.status) ? "closed" : "status",
                when: ticket.closedAt || ticket.updatedAt || ticket.openedAt,
                actor: ticket.owner || option.owner || "Não informado",
                actorType: "suporte",
                description: `${ticket.subject}${ticket.description ? ` — ${ticket.description}` : ""}`,
              }));
              const priority = normalizeOptionPriority(related[0]?.priority || option.priority);
              const PriorityIcon = priority.icon;
              const openPreview = () => onOpen({ title: "Ocorrências", subtitle: `Opção: ${option.option}`, body: option.observation || option.description, meta: [], occurrences: occurrencesForModal });
              return <div key={option.id} className="grid min-h-9 grid-cols-[118px_36px_64px_minmax(190px,1fr)_92px_44px] items-center border-b bg-background px-2 text-xs transition-colors hover:bg-muted/40">
                <span className="flex items-center gap-1"><Badge className="h-5 rounded-sm bg-rose-500 px-1.5 text-[9px] text-white hover:bg-rose-500">CORREÇÕES</Badge><span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] text-white">{count}</span></span>
                <span className={cn("grid h-6 w-6 place-items-center rounded-full border", priority.className)} title={`Prioridade ${priority.label}`}>
                  <PriorityIcon className="h-3.5 w-3.5" />
                </span>
                <span className="text-muted-foreground">{option.option}</span>
                <button type="button" onClick={openPreview} className="truncate text-left text-primary hover:underline">{option.description}</button>
                <span className="truncate text-muted-foreground">{related[0]?.owner || option.owner || "-"}</span>
                <Button type="button" variant="ghost" size="icon" onClick={openPreview} className="h-8 w-8 cursor-pointer" title="Prévia das ocorrências"><ClipboardCheck className="h-4 w-4" /></Button>
              </div>;
            })}
          </div>
          <div className="border-t px-4 py-3"><p className="text-[10px] text-muted-foreground">Total de Ocorrências por Operador</p><div className="mt-1 flex flex-wrap gap-x-5 gap-y-1">{overviewOperatorStats.map(([operator, count]) => <span key={operator} className="flex items-center gap-1 text-xs font-medium text-primary">{operator}<span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] text-white">{count}</span></span>)}</div></div>
        </section>
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
  const tickets = useTickets();
  const [optionQuery, setOptionQuery] = useState("");
  const [formQuery, setFormQuery] = useState("");
  const [operator, setOperator] = useState("todos");
  const [hadronScope, setHadronScope] = useState("exceto");
  const [characteristic, setCharacteristic] = useState("todos");
  const [module, setModule] = useState("todos");
  const [dateType, setDateType] = useState("atualizacao");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const optionsWithTickets = useMemo(() => {
    const grouped = new Map<string, TicketRow[]>();
    tickets.forEach((ticket) => {
      const optionId = findTicketOption(ticket)?.id;
      if (!optionId) return;
      const group = grouped.get(optionId) || [];
      group.push(ticket);
      grouped.set(optionId, group);
    });
    return hadronOptions.map((option) => {
      const related = grouped.get(option.id) || [];
      const active = related.filter((ticket) => !["Finalizado", "Cancelado"].includes(ticket.status));
      const latest = related.reduce<TicketRow | undefined>((current, ticket) => !current || ticket.updatedAt > current.updatedAt ? ticket : current, undefined);
      return { option, active, latest };
    });
  }, [tickets]);
  const operators = useMemo(() => [...new Set(tickets.map((ticket) => ticket.owner).filter(Boolean))].sort(), [tickets]);
  const modules = useMemo(() => [...new Set(tickets.map((ticket) => ticket.module).filter(Boolean))].sort(), [tickets]);
  const rows = useMemo(() => {
    const global = normalizeOccurrenceText(query);
    const optionFilter = normalizeOccurrenceText(optionQuery);
    const formFilter = normalizeOccurrenceText(formQuery);
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;
    return optionsWithTickets.filter(({ option, active, latest }) => {
      const searchable = normalizeOccurrenceText([option.option, option.form, option.description, latest?.subject, latest?.owner, latest?.module].filter(Boolean).join(" "));
      const dateValue = latest ? new Date(dateType === "abertura" ? latest.openedAt : latest.updatedAt).getTime() : null;
      const isHadron = normalizeOccurrenceText(option.description).includes("hadron");
      return (!global || searchable.includes(global))
        && (!optionFilter || normalizeOccurrenceText(`${option.option} ${option.description}`).includes(optionFilter))
        && (!formFilter || normalizeOccurrenceText(option.form).includes(formFilter))
        && (operator === "todos" || latest?.owner === operator)
        && (hadronScope === "todos" || (hadronScope === "somente" ? isHadron : !isHadron))
        && (characteristic === "todos" || (characteristic === "correcao" ? active.length > 0 : active.length === 0))
        && (module === "todos" || latest?.module === module)
        && (from === null || (dateValue !== null && dateValue >= from))
        && (to === null || (dateValue !== null && dateValue <= to));
    });
  }, [characteristic, dateFrom, dateTo, dateType, formQuery, hadronScope, module, operator, optionQuery, optionsWithTickets, query]);
  const clearFilters = () => {
    setOptionQuery(""); setFormQuery(""); setOperator("todos"); setHadronScope("exceto");
    setCharacteristic("todos"); setModule("todos"); setDateType("atualizacao"); setDateFrom(""); setDateTo("");
    setPage(1);
  };
  const pageCount = Math.max(1, Math.ceil(rows.length / 50));
  const safePage = Math.min(page, pageCount);
  const pagedRows = rows.slice((safePage - 1) * 50, safePage * 50);
  return (
    <section className="overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="border-b px-4 py-4">
        <h2 className="text-lg font-medium">Opções</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_.8fr_.75fr_.8fr_.8fr_.8fr_.75fr_.72fr_.72fr_auto]">
          <Input value={optionQuery} onChange={(event) => setOptionQuery(event.target.value)} placeholder="Opção" />
          <Input value={formQuery} onChange={(event) => setFormQuery(event.target.value)} placeholder="Formulário" />
          <OccurrenceSelect value={operator} onValueChange={setOperator} items={[["todos", "Operador"], ...operators.map((item) => [item, item] as [string, string])]} />
          <OccurrenceSelect value={hadronScope} onValueChange={setHadronScope} items={[["exceto", "Exceto HÁDRON"], ["somente", "Somente HÁDRON"], ["todos", "Todos"]]} />
          <OccurrenceSelect value={characteristic} onValueChange={setCharacteristic} items={[["todos", "Característica"], ["correcao", "Com correções"], ["normal", "Sem correções"]]} />
          <OccurrenceSelect value={module} onValueChange={setModule} items={[["todos", "Módulo"], ...modules.map((item) => [item, item] as [string, string])]} />
          <OccurrenceSelect value={dateType} onValueChange={setDateType} items={[["atualizacao", "Tipo data"], ["abertura", "Abertura"]]} />
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} aria-label="Data inicial" />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} aria-label="Data final" />
          <Button type="button" className="cursor-pointer px-7"><Search className="mr-2 h-4 w-4" />Buscar</Button>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="mt-3 cursor-pointer">Limpar</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1380px] text-left text-xs">
          <thead className="border-b bg-muted/25 text-primary">
            <tr>{["Status", "P", "Opção", "Formulário", "Descrição", "Chamada", "Data", "DLL EXE", "Módulo / Submódulo", "Responsável", "Ações"].map((header) => <th key={header} className="whitespace-nowrap px-3 py-3 font-medium">{header}</th>)}</tr>
          </thead>
          <tbody>{pagedRows.map(({ option, active, latest }) => {
            const priority = active.some((ticket) => ticket.priority === "Alta") ? "Alta" : active.some((ticket) => ticket.priority === "Media") ? "Media" : "Baixa";
            const detail: Detail = { title: option.description, subtitle: `Opção ${option.option} / Formulário ${option.form || "Não informado"}`, body: latest?.description || "Nenhuma ocorrência vinculada a esta opção.", meta: [`Correções em aberto: ${active.length}`, `Responsável: ${latest?.owner || "Não informado"}`, `Módulo: ${latest?.module || "Não informado"}`, "Origem: cvs_options.json"] };
            return <tr key={option.id} className={cn("border-b transition-colors hover:bg-muted/40", active.length > 0 && "bg-rose-50/80 dark:bg-rose-950/20")}>
              <td className="px-3 py-3"><Badge className={cn("whitespace-nowrap", active.length ? "bg-rose-600 text-white hover:bg-rose-600" : "bg-muted text-muted-foreground hover:bg-muted")}>{active.length ? `CORREÇÕES ${active.length}` : "SEM OCORRÊNCIAS"}</Badge></td>
              <td className="px-3 py-3"><span title={`Prioridade ${priority}`} className={cn("block h-3 w-3 rounded-full", priority === "Alta" ? "bg-rose-500" : priority === "Media" ? "bg-amber-500" : "bg-emerald-500")} /></td>
              <td className="px-3 py-3 font-medium">{option.option}</td>
              <td className="px-3 py-3">{option.form || "Não informado"}</td>
              <td className="max-w-72 px-3 py-3 text-primary">{option.description}</td>
              <td className="max-w-56 px-3 py-3">{latest?.subject || "Não informado"}</td>
              <td className="whitespace-nowrap px-3 py-3">{latest ? formatOccurrenceDate(latest.updatedAt) : "Não informado"}</td>
              <td className="px-3 py-3">Não informado</td>
              <td className="max-w-44 px-3 py-3">{latest?.module || "Não informado"}</td>
              <td className="px-3 py-3">{latest?.owner || "Não informado"}</td>
              <td className="px-3 py-3 text-center"><Button type="button" size="icon" variant="ghost" title="Ver opção" className="cursor-pointer" onClick={() => onOpen(detail)}><Eye className="h-4 w-4" /></Button></td>
            </tr>;
          })}</tbody>
        </table>
        {!rows.length && <p className="p-10 text-center text-sm text-muted-foreground">Nenhuma opção encontrada com os filtros aplicados.</p>}
      </div>
      {!!rows.length && <TablePagination noun="opções" page={safePage} pageCount={pageCount} total={rows.length} onPageChange={setPage} />}
    </section>
  );
}
function OccurrencesTable({ query, onOpen }: TableProps) {
  const tickets = useTickets();
  const ticketsWithOptions = useMemo(
    () => tickets.map((ticket) => ({ ticket, option: findTicketOption(ticket) })),
    [tickets],
  );
  const [optionQuery, setOptionQuery] = useState("");
  const [formQuery, setFormQuery] = useState("");
  const [occurrenceType, setOccurrenceType] = useState("todos");
  const [userType, setUserType] = useState("todos");
  const [operator, setOperator] = useState("todos");
  const [dateType, setDateType] = useState("abertura");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const operators = useMemo(
    () => [...new Set(tickets.map((ticket) => ticket.owner).filter(Boolean))].sort(),
    [tickets],
  );
  const rows = useMemo(() => {
    const global = normalizeOccurrenceText(query);
    const optionFilter = normalizeOccurrenceText(optionQuery);
    const formFilter = normalizeOccurrenceText(formQuery);
    const from = dateFrom ? new Date(`${dateFrom}T00:00:00`).getTime() : null;
    const to = dateTo ? new Date(`${dateTo}T23:59:59`).getTime() : null;
    return ticketsWithOptions
      .filter(({ ticket, option }) => {
        const date = new Date(dateType === "solucao" ? ticket.closedAt || ticket.updatedAt : ticket.openedAt).getTime();
        const searchable = normalizeOccurrenceText([ticket.protocol, ticket.subject, ticket.description, ticket.module, ticket.owner, option?.label].filter(Boolean).join(" "));
        return (!global || searchable.includes(global))
          && (!optionFilter || searchable.includes(optionFilter))
          && (!formFilter || normalizeOccurrenceText(option?.form).includes(formFilter))
          && (occurrenceType === "todos" || occurrenceKind(ticket) === occurrenceType)
          && (userType === "todos" || (userType === "cliente" ? ticket.source === "Portal do cliente" : ticket.source !== "Portal do cliente"))
          && (operator === "todos" || ticket.owner === operator)
          && (from === null || date >= from)
          && (to === null || date <= to);
      })
      .sort((a, b) => b.ticket.updatedAt.localeCompare(a.ticket.updatedAt));
  }, [dateFrom, dateTo, dateType, formQuery, occurrenceType, operator, optionQuery, query, ticketsWithOptions, userType]);
  const clearFilters = () => {
    setOptionQuery(""); setFormQuery(""); setOccurrenceType("todos"); setUserType("todos");
    setOperator("todos"); setDateType("abertura"); setDateFrom(""); setDateTo("");
    setPage(1);
  };
  const pageCount = Math.max(1, Math.ceil(rows.length / 50));
  const safePage = Math.min(page, pageCount);
  const pagedRows = rows.slice((safePage - 1) * 50, safePage * 50);
  return (
    <section className="overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="border-b px-4 py-4">
        <h2 className="text-lg font-medium">Ocorrências</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.5fr_.7fr_.75fr_.75fr_.8fr_.8fr_.75fr_.75fr_auto]">
          <Input value={optionQuery} onChange={(event) => setOptionQuery(event.target.value)} placeholder="Opção/descrição" />
          <Input value={formQuery} onChange={(event) => setFormQuery(event.target.value)} placeholder="Formulário" />
          <OccurrenceSelect value={occurrenceType} onValueChange={setOccurrenceType} items={[["todos", "Tipo Oco."], ["problema", "Problema"], ["solicitacao", "Solicitação"], ["revisado", "Revisado"]]} />
          <OccurrenceSelect value={userType} onValueChange={setUserType} items={[["todos", "Tipo Usu."], ["cliente", "Cliente"], ["interno", "Interno"]]} />
          <OccurrenceSelect value={operator} onValueChange={setOperator} items={[["todos", "Operador"], ...operators.map((item) => [item, item] as [string, string])]} />
          <OccurrenceSelect value={dateType} onValueChange={setDateType} items={[["abertura", "Ocorrência"], ["solucao", "Solução"]]} />
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} aria-label="De" />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} aria-label="Até" />
          <Button type="button" className="cursor-pointer px-6">Buscar</Button>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={clearFilters} className="mt-3 cursor-pointer">Limpar</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1280px] text-left text-xs">
          <thead className="border-b bg-muted/20 text-primary"><tr>
            <th className="w-14 px-3 py-3 font-medium">Tipo</th><th className="w-28 px-3 py-3 font-medium">Opção/Formulário</th>
            <th className="w-72 px-3 py-3 font-medium">Descrição</th><th className="px-3 py-3 font-medium">Detalhes</th>
            <th className="w-24 px-3 py-3 font-medium">Responsável</th><th className="w-28 px-3 py-3 font-medium">Ocorrência</th>
            <th className="w-28 px-3 py-3 font-medium">Solução</th><th className="w-24 px-3 py-3 font-medium">Revisado</th>
            <th className="w-20 px-3 py-3 text-center font-medium">Ações</th>
          </tr></thead>
          <tbody className="divide-y">{pagedRows.map(({ ticket, option }) => {
            const reviewed = ["Finalizado", "Cancelado"].includes(ticket.status);
            return <tr key={ticket.id} className="align-top hover:bg-muted/25">
              <td className="px-3 py-3"><OccurrenceTypeIcon ticket={ticket} /></td>
              <td className="px-3 py-3 font-medium">{option ? `${option.option}/${option.form || option.option}` : "-"}</td>
              <td className="px-3 py-3 font-medium">{option?.description || ticket.module}</td>
              <td className="max-w-md px-3 py-3 leading-5 text-muted-foreground">{ticket.description || ticket.subject}</td>
              <td className="px-3 py-3">{ticket.owner || "-"}</td>
              <td className="px-3 py-3"><OccurrenceDate value={ticket.openedAt} operator={ticket.owner} /></td>
              <td className="px-3 py-3"><OccurrenceDate value={ticket.closedAt || ticket.updatedAt} operator={reviewed ? ticket.owner : ""} /></td>
              <td className="px-3 py-3">{reviewed ? <span className="text-emerald-600">{formatOccurrenceDate(ticket.closedAt || ticket.updatedAt)}<br />{ticket.owner}</span> : <Button size="sm" variant="secondary" className="h-10 cursor-pointer" onClick={() => openOccurrence(ticket, option, onOpen)}>Revisar</Button>}</td>
              <td className="px-3 py-3 text-center"><Button size="icon" variant="ghost" title="Ver ocorrência" className="cursor-pointer" onClick={() => openOccurrence(ticket, option, onOpen)}><Eye className="h-4 w-4" /></Button></td>
            </tr>;
          })}</tbody>
        </table>
        {!rows.length && <p className="p-10 text-center text-sm text-muted-foreground">Nenhuma ocorrência encontrada com os filtros aplicados.</p>}
      </div>
      {!!rows.length && <TablePagination noun="ocorrências" page={safePage} pageCount={pageCount} total={rows.length} onPageChange={setPage} />}
    </section>
  );
}

function TablePagination({ noun, page, pageCount, total, onPageChange }: { noun: string; page: number; pageCount: number; total: number; onPageChange: (page: number) => void }) {
  return <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-xs text-muted-foreground">
    <span>Mostrando {(page - 1) * 50 + 1} a {Math.min(page * 50, total)} de {total} {noun}</span>
    <div className="flex items-center gap-2">
      <Button type="button" size="sm" variant="outline" disabled={page === 1} onClick={() => onPageChange(Math.max(1, page - 1))}>Anterior</Button>
      <span>Página {page} de {pageCount}</span>
      <Button type="button" size="sm" variant="outline" disabled={page === pageCount} onClick={() => onPageChange(Math.min(pageCount, page + 1))}>Próxima</Button>
    </div>
  </div>;
}

function OccurrenceSelect({ value, onValueChange, items }: { value: string; onValueChange: (value: string) => void; items: [string, string][] }) {
  return <Select value={value} onValueChange={onValueChange}><SelectTrigger className="w-full cursor-pointer"><SelectValue /></SelectTrigger><SelectContent>{items.map(([itemValue, label]) => <SelectItem key={itemValue} value={itemValue}>{label}</SelectItem>)}</SelectContent></Select>;
}

function normalizeOccurrenceText(value: unknown) {
  return String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

type TicketRow = ReturnType<typeof useTickets>[number];

function normalizeOptionPriority(value: string | undefined) {
  const normalized = (value || "").trim().toLowerCase();
  if (["alta", "1"].includes(normalized)) {
    return { label: "Alta", icon: ArrowUp, className: "border-destructive/20 bg-destructive/12 text-destructive" };
  }
  if (["media", "média", "2"].includes(normalized)) {
    return {
      label: "Média",
      icon: Minus,
      className: "border-amber-200 bg-amber-100 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300",
    };
  }
  return {
    label: "Baixa",
    icon: CheckCircle2,
    className: "border-[#bfdcff] bg-[#eaf4ff] text-[#246cb5] dark:border-[#24527d] dark:bg-[#17314e] dark:text-[#9dcaff]",
  };
}
const hadronOptionByTerm = new Map<string, (typeof hadronOptions)[number]>();
hadronOptions.forEach((option) => {
  normalizeOccurrenceText(option.label).split(/\s+/).filter((term) => term.length > 3).forEach((term) => {
    if (!hadronOptionByTerm.has(term)) hadronOptionByTerm.set(term, option);
  });
});
function findTicketOption(ticket: TicketRow) {
  const terms = normalizeOccurrenceText(`${ticket.subject} ${ticket.module}`).split(/\s+/).filter((term) => term.length > 3);
  return terms.map((term) => hadronOptionByTerm.get(term)).find(Boolean);
}
function occurrenceKind(ticket: TicketRow) {
  if (["Finalizado", "Cancelado"].includes(ticket.status)) return "revisado";
  return ticket.priority === "Alta" ? "problema" : "solicitacao";
}
function OccurrenceTypeIcon({ ticket }: { ticket: TicketRow }) {
  const kind = occurrenceKind(ticket);
  return <span className={cn("text-base", kind === "revisado" ? "text-emerald-600" : kind === "problema" ? "text-rose-600" : "text-amber-500")}>{kind === "revisado" ? "✓" : kind === "problema" ? "✹" : "★"}</span>;
}
function formatOccurrenceDate(value: string | null | undefined) {
  if (!value) return "-";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "-" : parsed.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}
function OccurrenceDate({ value, operator }: { value: string | null | undefined; operator: string }) {
  return <span>{formatOccurrenceDate(value)}{operator && <><br /><span className="text-[10px] text-muted-foreground">{operator}</span></>}</span>;
}
function openOccurrence(ticket: TicketRow, option: ReturnType<typeof findTicketOption>, onOpen: (detail: Detail) => void) {
  onOpen({ title: ticket.subject, subtitle: option ? `${option.option}/${option.form || option.option}` : ticket.protocol, body: ticket.description || "Sem detalhes informados para esta ocorrência.", meta: [`Tipo: ${occurrenceKind(ticket)}`, `Operador: ${ticket.owner || "Não informado"}`, `Situação: ${ticket.status}`, `Ocorrência: ${formatOccurrenceDate(ticket.openedAt)}`, `Solução: ${formatOccurrenceDate(ticket.closedAt)}`] });
}

function ParametersTable({ query, onOpen }: TableProps) {
  const [search, setSearch] = useState("");
  const [option, setOption] = useState("");
  const [form, setForm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const normalizedSearch = normalizeOccurrenceText(`${query} ${search}`);
  const rows = useMemo(() => hadronParameters.filter((parameter) => {
    if (normalizedSearch && !normalizeOccurrenceText(`${parameter.id} ${parameter.title} ${parameter.description}`).includes(normalizedSearch)) return false;
    if (option && !normalizeOccurrenceText(parameter.option).includes(normalizeOccurrenceText(option))) return false;
    if (form && !normalizeOccurrenceText(parameter.form).includes(normalizeOccurrenceText(form))) return false;
    const updatedAt = parameterDateValue(parameter.updatedAt);
    if (dateFrom && updatedAt < new Date(`${dateFrom}T00:00:00`).getTime()) return false;
    if (dateTo && updatedAt > new Date(`${dateTo}T23:59:59`).getTime()) return false;
    return true;
  }), [dateFrom, dateTo, form, normalizedSearch, option]);

  const clearFilters = () => {
    setSearch("");
    setOption("");
    setForm("");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <section className="overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Parâmetros</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[2fr_.6fr_.6fr_.9fr_.9fr_auto]">
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pesquisa" />
          <Input value={option} onChange={(event) => setOption(event.target.value)} placeholder="Opção" />
          <Input value={form} onChange={(event) => setForm(event.target.value)} placeholder="Formulário" />
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} aria-label="De" />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} aria-label="Até" />
          <Button type="button" className="cursor-pointer px-8">Buscar</Button>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={clearFilters} disabled={!search && !option && !form && !dateFrom && !dateTo} className="mt-3 cursor-pointer">Limpar</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b bg-muted/25 text-xs font-medium text-muted-foreground">
            <tr><th className="w-16 px-4 py-3">ID</th><th className="px-4 py-3">Título</th><th className="w-[34%] px-4 py-3">Descrição</th><th className="w-44 px-4 py-3">Datas</th><th className="w-28 px-4 py-3 text-center">Ações</th></tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((parameter, index) => (
              <tr key={parameter.id} className={cn("transition-colors hover:bg-muted/35", index % 2 === 0 && "bg-muted/15")}>
                <td className="px-4 py-3 text-muted-foreground">{parameter.id}</td>
                <td className="px-4 py-3">{parameter.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{parameter.description}</td>
                <td className="px-4 py-3 text-xs text-primary"><span>{parameter.createdAt}</span><br /><span>{parameter.updatedAt}</span></td>
                <td className="px-4 py-3"><div className="flex justify-center gap-1">
                  <Button variant="ghost" size="icon" title="Ver parâmetro" className="cursor-pointer" onClick={() => onOpen({ title: parameter.title, subtitle: `Parâmetro ${parameter.id}`, body: parameter.description, meta: [`Opção: ${parameter.option}`, `Formulário: ${parameter.form}`, `Criado em: ${parameter.createdAt}`, `Atualizado em: ${parameter.updatedAt}`] })}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Edição indisponível para registros legados" disabled><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" title="Exclusão indisponível para registros legados" disabled><Trash2 className="h-4 w-4" /></Button>
                </div></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">Nenhum parâmetro encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="border-t px-4 py-3 text-xs text-muted-foreground">Página 1 de 1, mostrando {rows.length} de {rows.length} no total.</div>
    </section>
  );
}

function parameterDateValue(value: string) {
  const [date, time] = value.split(" ");
  const [day, month, year] = date.split("/").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hour, minute).getTime();
}

function ModulesTable({ query, onOpen }: TableProps) {
  const [search, setSearch] = useState("");
  const normalizedQuery = normalizeOccurrenceText(`${query} ${search}`);
  const rows = useMemo(() => Object.entries(modulesMap).map(([module, submodules], moduleIndex) => ({
    id: String(moduleIndex + 1),
    module,
    submodules: submodules.map((submodule) => ({
      name: submodule,
      options: hadronOptions.filter((option) => {
        const optionText = normalizeOccurrenceText(option.description);
        const terms = normalizeOccurrenceText(submodule).split(/\s+/).filter((term) => term.length > 3);
        return terms.some((term) => optionText.includes(term));
      }).slice(0, 12),
    })),
  })).filter((row) => !normalizedQuery || normalizeOccurrenceText([
    row.id,
    row.module,
    ...row.submodules.flatMap((submodule) => [submodule.name, ...submodule.options.map((option) => option.label)]),
  ].join(" ")).includes(normalizedQuery)), [normalizedQuery]);

  return (
    <section className="overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h2 className="text-lg font-medium">Módulos e Submódulos</h2><p className="text-sm text-muted-foreground">Estrutura do Hádron carregada do catálogo importado.</p></div>
        <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar módulo, submódulo ou opção" className="sm:w-80" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b bg-muted/25 text-xs font-medium text-muted-foreground"><tr><th className="w-20 px-4 py-3">ID</th><th className="px-4 py-3">Nome</th><th className="w-28 px-4 py-3 text-center">Ações</th></tr></thead>
          <tbody className="divide-y">
            {rows.map((row) => <tr key={row.id} className="align-top hover:bg-muted/20">
              <td className="px-4 py-4 text-muted-foreground">{row.id}</td>
              <td className="px-4 py-4">
                <p className="font-medium uppercase">{row.module}</p>
                <div className="mt-3 space-y-3 border-l pl-5">
                  {row.submodules.map((submodule) => <div key={submodule.name}>
                    <p className="text-xs font-medium uppercase text-muted-foreground">{submodule.name}</p>
                    {submodule.options.length > 0 && <div className="mt-1 divide-y rounded-md border">
                      {submodule.options.map((option) => <button key={option.id} type="button" onClick={() => onOpen({ title: option.description, subtitle: `${row.module} / ${submodule.name}`, body: "Opção pertencente ao catálogo oficial importado do Hádron.", meta: [`Opção: ${option.option}`, `Formulário: ${option.form || option.option}`] })} className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-muted/40"><span className="font-mono text-muted-foreground">{option.option} | {option.form || option.option}</span><span>{option.description}</span></button>)}
                    </div>}
                  </div>)}
                </div>
              </td>
              <td className="px-4 py-4"><div className="flex justify-center gap-1"><Button variant="ghost" size="icon" title="Ver módulo" className="cursor-pointer" onClick={() => onOpen({ title: row.module, subtitle: `${row.submodules.length} submódulos`, body: row.submodules.map((item) => item.name).join(", "), meta: [`ID: ${row.id}`, `Submódulos: ${row.submodules.length}`] })}><Eye className="h-4 w-4" /></Button><Button variant="ghost" size="icon" title="Edição indisponível para o catálogo importado" disabled><Pencil className="h-4 w-4" /></Button></div></td>
            </tr>)}
            {rows.length === 0 && <tr><td colSpan={3} className="px-4 py-12 text-center text-muted-foreground">Nenhum módulo encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="border-t px-4 py-3 text-xs text-muted-foreground">{rows.length} módulo(s) encontrado(s)</div>
    </section>
  );
}

function SerialsTable({ query }: TableProps) {
  const [serial, setSerial] = useState("");
  const [acronym, setAcronym] = useState("");
  const [operator, setOperator] = useState("todos");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const hasFilter = Boolean(query || serial || acronym || operator !== "todos" || dateFrom || dateTo);
  const clearFilters = () => {
    setSerial("");
    setAcronym("");
    setOperator("todos");
    setDateFrom("");
    setDateTo("");
  };

  return (
    <section className="overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="border-b p-4">
        <h2 className="text-lg font-medium">Seriais</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_.6fr_.8fr_.8fr_.8fr_auto]">
          <Input value={serial} onChange={(event) => setSerial(event.target.value)} placeholder="Número de série" />
          <Input value={acronym} onChange={(event) => setAcronym(event.target.value.toUpperCase())} placeholder="Sigla" />
          <OccurrenceSelect value={operator} onValueChange={setOperator} items={[["todos", "Operador"], ...operatorStats.map(([item]) => [item, item] as [string, string])]} />
          <Input type="date" value={dateFrom} onChange={(event) => setDateFrom(event.target.value)} aria-label="De" />
          <Input type="date" value={dateTo} onChange={(event) => setDateTo(event.target.value)} aria-label="Até" />
          <Button type="button" className="cursor-pointer px-8">Buscar</Button>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={clearFilters} disabled={!hasFilter} className="mt-3 cursor-pointer">Limpar</Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b bg-muted/25 text-xs font-medium text-muted-foreground"><tr><th className="w-20 px-4 py-3">ID</th><th className="px-4 py-3">Número de série</th><th className="w-64 px-4 py-3">Operador</th><th className="w-40 px-4 py-3">Cliente</th><th className="w-44 px-4 py-3">Datas</th><th className="w-24 px-4 py-3 text-center">Ações</th></tr></thead>
          <tbody><tr><td colSpan={6} className="px-4 py-16 text-center"><KeyRound className="mx-auto mb-3 h-8 w-8 text-muted-foreground/50" /><p className="text-sm text-muted-foreground">Nenhum serial importado.</p><p className="mt-1 text-xs text-muted-foreground">O projeto ainda não possui um JSON de seriais para preencher esta tabela.</p></td></tr></tbody>
        </table>
      </div>
      <div className="border-t px-4 py-3 text-xs text-muted-foreground">Página 1 de 1, mostrando 0 de 0 no total.</div>
    </section>
  );
}

function ChecklistTable({ query, onOpen }: TableProps) {
  const [filter, setFilter] = useState("");
  const normalizedQuery = normalizeOccurrenceText(`${query} ${filter}`);
  const rows = useMemo(() => hadronChecklist.filter((item) => !normalizedQuery || normalizeOccurrenceText(item.join(" ")).includes(normalizedQuery)), [normalizedQuery]);

  return (
    <section className="overflow-hidden rounded-md border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold">Checklist</h2>
          <p className="text-sm text-muted-foreground">Itens de validação utilizados nas opções e formulários do Hádron.</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Buscar característica, título ou descrição" className="sm:w-80" />
          <Button variant="outline" onClick={() => setFilter("")} disabled={!filter} className="cursor-pointer">Limpar</Button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="border-b bg-muted/30 text-left text-xs font-medium text-muted-foreground">
            <tr><th className="w-36 px-4 py-3">Característica</th><th className="w-64 px-4 py-3">Título</th><th className="px-4 py-3">Descrição</th><th className="w-20 px-4 py-3 text-center">Salvo</th><th className="w-44 px-4 py-3">Datas</th><th className="w-24 px-4 py-3 text-center">Ações</th></tr>
          </thead>
          <tbody>
            {rows.map(([id, characteristic, title, description, saved, createdAt, updatedAt], index) => (
              <tr key={id} className={cn("border-b transition-colors hover:bg-muted/40", index % 2 === 0 && "bg-muted/20")}>
                <td className="px-4 py-3">{characteristic}</td><td className="px-4 py-3 font-medium">{title}</td><td className="px-4 py-3">{description}</td>
                <td className="px-4 py-3 text-center">{saved ? <Flag className="mx-auto h-4 w-4 text-muted-foreground" /> : <span className="text-muted-foreground">-</span>}</td>
                <td className="px-4 py-3 text-xs text-primary"><span>{createdAt}</span><br /><span>{updatedAt}</span></td>
                <td className="px-4 py-3"><div className="flex justify-center gap-1"><Button variant="ghost" size="icon" title="Ver detalhes" className="cursor-pointer" onClick={() => onOpen({ title, subtitle: characteristic, body: description, meta: [`Criado em: ${createdAt}`, `Atualizado em: ${updatedAt}`, `Salvo: ${saved ? "Sim" : "Não"}`] })}><Pencil className="h-4 w-4" /></Button><Button variant="ghost" size="icon" title="Exclusão indisponível para registros legados" disabled><Trash2 className="h-4 w-4" /></Button></div></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">Nenhum item de checklist encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="border-t px-4 py-3 text-xs text-muted-foreground">{rows.length} item(ns) encontrado(s)</div>
    </section>
  );
}

function ReleasesTable({ query, onOpen }: TableProps) {
  const [page, setPage] = useState(1);
  const normalizedQuery = normalizeOccurrenceText(query);
  const rows = useMemo(() => cvsArticles.map((release) => ({
    release,
    option: findReleaseOption(release.title),
  })).filter(({ release, option }) => !normalizedQuery || normalizeOccurrenceText([
    release.id, release.title, release.status, option?.option, option?.form, option?.description,
  ].filter(Boolean).join(" ")).includes(normalizedQuery)), [normalizedQuery]);
  const pageSize = 50;
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = rows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="border-b px-5 py-4">
        <h2 className="font-semibold">Releases</h2>
        <p className="text-sm text-muted-foreground">Histórico de publicações carregado do catálogo oficial importado.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-sm">
          <thead className="border-b bg-muted/35 text-left text-xs font-medium text-muted-foreground">
            <tr><th className="w-14 px-4 py-3">Tipo</th><th className="w-40 px-4 py-3">Opção/Formulário</th><th className="min-w-[360px] px-4 py-3">Descrição</th><th className="w-44 px-4 py-3">Módulo/Submódulo</th><th className="w-32 px-4 py-3">Responsável</th><th className="w-20 px-4 py-3 text-center">Cliques</th><th className="w-24 px-4 py-3">Versão</th><th className="w-32 px-4 py-3">Data</th><th className="w-20 px-4 py-3 text-center">Ações</th></tr>
          </thead>
          <tbody className="divide-y">
            {pagedRows.map(({ release, option }) => (
              <tr key={release.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3"><Sparkles className={cn("h-4 w-4", release.status === "publish" ? "text-amber-500" : "text-muted-foreground")} /></td>
                <td className="px-4 py-3 font-medium">{option ? `${option.option}/${option.form || option.option}` : "Não informado"}</td>
                <td className="px-4 py-3">{release.title}</td>
                <td className="px-4 py-3 text-muted-foreground">Não informado</td><td className="px-4 py-3 text-muted-foreground">Não informado</td><td className="px-4 py-3 text-center text-muted-foreground">-</td><td className="px-4 py-3 text-muted-foreground">Não informada</td><td className="px-4 py-3 text-muted-foreground">Não informada</td>
                <td className="px-4 py-3 text-center"><Button variant="ghost" size="icon" title="Ver detalhes" onClick={() => onOpen({ title: release.title, subtitle: option ? `${option.option}/${option.form || option.option}` : `Release ${release.id}`, body: "Registro importado do catálogo oficial de releases do Hádron.", meta: [`Status: ${release.status}`, `Opção/Formulário: ${option ? `${option.option}/${option.form || option.option}` : "Não informado"}`, "Os demais campos não constam no JSON fornecido."] })}><Eye className="h-4 w-4" /></Button></td>
              </tr>
            ))}
            {pagedRows.length === 0 && <tr><td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">Nenhum release encontrado.</td></tr>}
          </tbody>
        </table>
      </div>
      <TablePagination noun="releases" page={currentPage} pageCount={pageCount} total={rows.length} onPageChange={setPage} />
    </div>
  );
}

function findReleaseOption(title: string) {
  const normalizedTitle = normalizeOccurrenceText(title);
  const leadingCode = normalizedTitle.match(/^([a-z0-9]+)(?:\s*[-/]|\s)/)?.[1];
  if (leadingCode) {
    const exact = hadronOptions.find((option) => normalizeOccurrenceText(option.option) === leadingCode || normalizeOccurrenceText(option.form) === leadingCode);
    if (exact) return exact;
  }
  return normalizedTitle.split(/\s+/).filter((term) => term.length > 3).map((term) => hadronOptionByTerm.get(term)).find(Boolean);
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
  const statusById = useMemo(
    () => new Map(cvsArticles.map((article) => [article.id, article.status])),
    [],
  );
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  const rows = useMemo(
    () => kbArticlesFull.filter((article) =>
      [article.id, article.title, article.author, article.module, getCategory(article.category).name]
        .join(" ")
        .toLocaleLowerCase("pt-BR")
        .includes(normalizedQuery),
    ),
    [normalizedQuery],
  );

  return (
    <section className="overflow-hidden rounded-lg border bg-card shadow-sm">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="text-sm font-medium">Artigos</h2>
          <p className="text-xs text-muted-foreground">{rows.length} artigos do catálogo Hádron.</p>
        </div>
        <Badge variant="secondary">Fonte: cvs_articles.json</Badge>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-left text-xs">
          <thead className="border-b bg-muted/35 text-[11px] text-muted-foreground">
            <tr>
              {["Permissão", "Título", "Categoria", "Responsável", "Módulo / Submódulo", "Status", "Cliques", "Datas", "Ações"].map((header) => (
                <th key={header} className="whitespace-nowrap px-3 py-2 font-medium">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((article, index) => {
              const published = statusById.get(article.id) === "1";
              return (
                <tr key={article.id} className={cn("border-b last:border-0 hover:bg-muted/35", index % 2 === 1 && "bg-muted/20")}>
                  <td className="px-3 py-2.5 text-muted-foreground"><UserRound className="h-4 w-4" /></td>
                  <td className="max-w-[420px] px-3 py-2.5 font-medium">
                    <span className="mr-1 text-muted-foreground">{article.id} -</span>{article.title}
                  </td>
                  <td className="px-3 py-2.5">{getCategory(article.category).name}</td>
                  <td className="whitespace-nowrap px-3 py-2.5">{article.author}</td>
                  <td className="px-3 py-2.5">
                    <span className="block">{article.module}</span>
                    <span className="text-[10px] text-muted-foreground">{article.tags.slice(0, 2).join(" / ") || "Não informado"}</span>
                  </td>
                  <td className="px-3 py-2.5"><Badge variant={published ? "default" : "secondary"}>{published ? "Publicado" : "Em análise"}</Badge></td>
                  <td className="px-3 py-2.5 text-center text-muted-foreground">-</td>
                  <td className="whitespace-nowrap px-3 py-2.5 text-primary">{formatHadronArticleDate(article.updatedAt)}</td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Visualizar artigo" onClick={() => onOpen({
                        title: article.title,
                        subtitle: `${getCategory(article.category).name} - ${article.module}`,
                        body: article.summary,
                        meta: [`Responsável: ${article.author}`, `Atualizado: ${formatHadronArticleDate(article.updatedAt)}`, `Status: ${published ? "Publicado" : "Em análise"}`, `Artigo: ${article.id}`],
                      })}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Editar artigo"><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="h-7 w-7" title="Artigos importados não podem ser excluídos" disabled><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {rows.length === 0 && <div className="px-4 py-12 text-center text-sm text-muted-foreground">Nenhum artigo encontrado.</div>}
    </section>
  );
}

function formatHadronArticleDate(value: string) {
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
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
