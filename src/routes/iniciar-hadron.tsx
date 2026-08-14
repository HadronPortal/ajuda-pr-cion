import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  BookOpenText,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Code2,
  FileCode2,
  Eye,
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
