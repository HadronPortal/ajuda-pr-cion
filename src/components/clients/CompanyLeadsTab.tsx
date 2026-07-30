import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Columns3,
  ExternalLink,
  LoaderCircle,
  MapPin,
  Search,
  SlidersHorizontal,
  Target,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import { Separator } from "@/components/ui/separator";
import {
  companyLeadsApi,
  type CompanyLead,
  type CompanyLeadFilters,
  type CompanyLeadSort,
  type CompanyLeadStage,
} from "@/lib/company-leads-api";
import { cn } from "@/lib/utils";

const initialFilters: CompanyLeadFilters = {
  city: "",
  state: "SP",
  openedWithinDays: 90,
  cnae: "",
  companySize: "",
  registrationStatus: "",
  stage: "",
  minScore: "",
  openedFrom: "",
  openedTo: "",
  hasPhone: false,
  hasEmail: false,
  onlyMei: false,
  onlySimples: false,
};

const PAGE_SIZE = 50;
const COLUMNS_STORAGE_KEY = "procion:company-leads:columns";

const stageLabels: Record<CompanyLeadStage, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  qualificado: "Qualificado",
  descartado: "Descartado",
  convertido: "Convertido",
};

type ColumnKey =
  | "company"
  | "cnpj"
  | "opened_at"
  | "registration_status"
  | "city"
  | "address"
  | "cnae"
  | "cnae_description"
  | "company_size"
  | "legal_nature"
  | "phone"
  | "email"
  | "mei"
  | "simples"
  | "score"
  | "stage"
  | "source";

type ColumnDefinition = {
  key: ColumnKey;
  label: string;
  sort?: CompanyLeadSort;
  className?: string;
};

const columnDefinitions: ColumnDefinition[] = [
  { key: "company", label: "Empresa", sort: "company", className: "max-w-[220px]" },
  { key: "cnpj", label: "CNPJ", sort: "cnpj", className: "whitespace-nowrap" },
  { key: "opened_at", label: "Data de abertura", sort: "opened_at", className: "whitespace-nowrap" },
  {
    key: "registration_status",
    label: "Situação cadastral",
    sort: "registration_status",
    className: "whitespace-nowrap",
  },
  { key: "city", label: "Cidade/UF", sort: "city", className: "whitespace-nowrap" },
  { key: "address", label: "Endereço", className: "max-w-[200px]" },
  { key: "cnae", label: "CNAE", sort: "cnae", className: "whitespace-nowrap" },
  { key: "cnae_description", label: "Descrição do CNAE", className: "max-w-[220px]" },
  { key: "company_size", label: "Porte", sort: "company_size", className: "whitespace-nowrap" },
  { key: "legal_nature", label: "Natureza jurídica", className: "max-w-[180px]" },
  { key: "phone", label: "Telefone", sort: "phone", className: "whitespace-nowrap" },
  { key: "email", label: "E-mail", className: "max-w-[180px]" },
  { key: "mei", label: "MEI", className: "whitespace-nowrap" },
  { key: "simples", label: "Simples Nacional", className: "whitespace-nowrap" },
  { key: "score", label: "Score", sort: "score", className: "whitespace-nowrap" },
  { key: "stage", label: "Etapa", sort: "stage", className: "whitespace-nowrap" },
  { key: "source", label: "Fonte", className: "max-w-[160px]" },
];


const defaultColumns: ColumnKey[] = [
  "company",
  "cnpj",
  "opened_at",
  "city",
  "cnae",
  "company_size",
  "phone",
  "score",
  "stage",
];

const companySizeOptions = [
  "Microempresa",
  "Empresa de pequeno porte",
  "Demais",
  "Não informado",
];

const registrationStatusOptions = ["ATIVA", "BAIXADA", "SUSPENSA", "INAPTA"];

const scoreTone = (score: number) =>
  score >= 10
    ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
    : score >= 7
      ? "bg-amber-500/12 text-amber-700 dark:text-amber-300"
      : "bg-muted text-muted-foreground";

const formatCnpj = (value: string) =>
  value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

const formatPhone = (value: string | null) => {
  if (!value) return "—";
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return digits.replace(/^(\d{2})(\d{4})(\d{4})$/, "($1) $2-$3");
  if (digits.length === 11) return digits.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  return value;
};

const formatDate = (value: string | null) => {
  if (!value) return "Não informada";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

const openedLabels: Record<number, string> = {
  0: "Qualquer data",
  30: "Últimos 30 dias",
  90: "Últimos 90 dias",
  180: "Últimos 180 dias",
  365: "Último ano",
};

function loadColumns(): ColumnKey[] {
  if (typeof window === "undefined") return defaultColumns;
  try {
    const stored = window.localStorage.getItem(COLUMNS_STORAGE_KEY);
    if (!stored) return defaultColumns;
    const parsed = JSON.parse(stored) as ColumnKey[];
    const valid = parsed.filter((key) => columnDefinitions.some((column) => column.key === key));
    return valid.length ? valid : defaultColumns;
  } catch {
    return defaultColumns;
  }
}

export function CompanyLeadsTab() {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState<CompanyLeadSort>("opened_at");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(defaultColumns);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setVisibleColumns(loadColumns());
  }, []);

  const persistColumns = (next: ColumnKey[]) => {
    setVisibleColumns(next);
    try {
      window.localStorage.setItem(COLUMNS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* preferência opcional */
    }
  };

  const runSearch = async (
    nextPage: number,
    nextFilters: CompanyLeadFilters,
    nextSort: CompanyLeadSort,
    nextDirection: "asc" | "desc",
  ) => {
    if (!nextFilters.city.trim() || nextFilters.state.trim().length !== 2) {
      toast.error("Informe a cidade e uma UF válida.");
      return;
    }
    setSearching(true);
    setLoading(true);
    try {
      const result = await companyLeadsApi.list({
        filters: nextFilters,
        sort: nextSort,
        direction: nextDirection,
        limit: PAGE_SIZE,
        offset: nextPage * PAGE_SIZE,
      });
      setLeads(result.leads);
      setTotal(result.total);
      setPage(nextPage);
      setAppliedFilters(nextFilters);
      setSort(nextSort);
      setDirection(nextDirection);
      setHasSearched(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao procurar empresas.");
    } finally {
      setSearching(false);
      setLoading(false);
    }
  };

  const searchLeads = (nextPage = 0) => void runSearch(nextPage, filters, sort, direction);

  const toggleSort = (column: CompanyLeadSort) => {
    if (!hasSearched) return;
    const nextDirection: "asc" | "desc" =
      sort === column ? (direction === "asc" ? "desc" : "asc") : column === "company" ? "asc" : "desc";
    void runSearch(0, appliedFilters, column, nextDirection);
  };

  const removeFilter = (patch: Partial<CompanyLeadFilters>) => {
    const nextFilters = { ...appliedFilters, ...patch };
    setFilters((current) => ({ ...current, ...patch }));
    if (hasSearched) void runSearch(0, nextFilters, sort, direction);
    else setAppliedFilters(nextFilters);
  };

  const updateStage = async (lead: CompanyLead, stage: CompanyLeadStage) => {
    const previous = leads;
    setLeads((items) => items.map((item) => (item.id === lead.id ? { ...item, stage } : item)));
    try {
      await companyLeadsApi.updateStage(lead.id, stage);
    } catch (error) {
      setLeads(previous);
      toast.error(error instanceof Error ? error.message : "Não foi possível atualizar o lead.");
    }
  };

  const qualified = useMemo(
    () => leads.filter((lead) => lead.stage === "qualificado").length,
    [leads],
  );

  const chips = useMemo(() => {
    const items: Array<{ key: string; label: string; clear: Partial<CompanyLeadFilters> }> = [];
    const source = appliedFilters;
    if (source.openedWithinDays)
      items.push({
        key: "openedWithinDays",
        label: `Abertura: ${openedLabels[source.openedWithinDays] ?? `${source.openedWithinDays} dias`}`,
        clear: { openedWithinDays: 0 },
      });
    if (source.openedFrom)
      items.push({
        key: "openedFrom",
        label: `Aberta a partir de ${formatDate(source.openedFrom)}`,
        clear: { openedFrom: "" },
      });
    if (source.openedTo)
      items.push({
        key: "openedTo",
        label: `Aberta até ${formatDate(source.openedTo)}`,
        clear: { openedTo: "" },
      });
    if (source.cnae)
      items.push({ key: "cnae", label: `CNAE: ${source.cnae}`, clear: { cnae: "" } });
    if (source.companySize)
      items.push({
        key: "companySize",
        label: `Porte: ${source.companySize}`,
        clear: { companySize: "" },
      });
    if (source.registrationStatus)
      items.push({
        key: "registrationStatus",
        label: `Situação: ${source.registrationStatus}`,
        clear: { registrationStatus: "" },
      });
    if (source.stage)
      items.push({
        key: "stage",
        label: `Etapa: ${stageLabels[source.stage as CompanyLeadStage] ?? source.stage}`,
        clear: { stage: "" },
      });
    if (source.minScore)
      items.push({
        key: "minScore",
        label: `Score mínimo: ${source.minScore}`,
        clear: { minScore: "" },
      });
    if (source.hasPhone)
      items.push({ key: "hasPhone", label: "Com telefone", clear: { hasPhone: false } });
    if (source.hasEmail)
      items.push({ key: "hasEmail", label: "Com e-mail", clear: { hasEmail: false } });
    if (source.onlyMei)
      items.push({ key: "onlyMei", label: "Somente MEI", clear: { onlyMei: false } });
    if (source.onlySimples)
      items.push({
        key: "onlySimples",
        label: "Somente Simples Nacional",
        clear: { onlySimples: false },
      });
    return items;
  }, [appliedFilters]);

  const columns = useMemo(
    () => columnDefinitions.filter((column) => visibleColumns.includes(column.key)),
    [visibleColumns],
  );

  const renderCell = (column: ColumnDefinition, lead: CompanyLead) => {
    switch (column.key) {
      case "company":
        return (
          <>
            <div className="font-medium">{lead.trade_name || lead.legal_name}</div>
            {lead.trade_name && (
              <div className="mt-0.5 text-xs text-muted-foreground">{lead.legal_name}</div>
            )}
          </>
        );
      case "cnpj":
        return <span className="whitespace-nowrap">{formatCnpj(lead.cnpj)}</span>;
      case "opened_at":
        return (
          <div className="whitespace-nowrap">
            <div className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
              {formatDate(lead.opened_at)}
            </div>
          </div>
        );
      case "registration_status":
        return <span className="text-emerald-600">{lead.registration_status}</span>;
      case "city":
        return (
          <div className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
            {lead.city} - {lead.state}
          </div>
        );
      case "address":
        return <span className="text-muted-foreground">{lead.address || "—"}</span>;
      case "cnae":
        return <span className="whitespace-nowrap">{lead.cnae_code || "—"}</span>;
      case "cnae_description":
        return <span>{lead.cnae_description || "—"}</span>;
      case "company_size":
        return <span className="whitespace-nowrap">{lead.company_size || "—"}</span>;
      case "legal_nature":
        return <span>{lead.legal_nature || "—"}</span>;
      case "phone":
        return <span className="whitespace-nowrap">{formatPhone(lead.phone)}</span>;
      case "email":
        return <span className="lowercase">{lead.email?.toLowerCase() || "—"}</span>;
      case "mei":
        return lead.mei ? (
          <Badge className="bg-primary/10 text-primary">MEI</Badge>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      case "simples":
        return lead.simples ? (
          <Badge className="bg-emerald-500/12 text-emerald-700 dark:text-emerald-300">Sim</Badge>
        ) : (
          <span className="text-muted-foreground">Não</span>
        );
      case "score":
        return (
          <Badge className={cn("font-semibold", scoreTone(lead.relevance_score))}>
            {lead.relevance_score}
          </Badge>
        );
      case "stage":
        return (
          <select
            value={lead.stage}
            onChange={(event) => void updateStage(lead, event.target.value as CompanyLeadStage)}
            className="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-xs"
          >
            {Object.entries(stageLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        );
      case "source":
        return <span className="text-xs text-muted-foreground">{lead.source}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="min-w-[220px] flex-[1.4] space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Cidade</span>
          <Input
            value={filters.city}
            onChange={(event) => setFilters((value) => ({ ...value, city: event.target.value }))}
            placeholder="Ex.: São Carlos"
          />
        </label>
        <label className="w-[90px] space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">UF</span>
          <Input
            value={filters.state}
            maxLength={2}
            onChange={(event) =>
              setFilters((value) => ({ ...value, state: event.target.value.toUpperCase() }))
            }
            className="uppercase"
          />
        </label>
        <label className="min-w-[170px] flex-1 space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">Abertura</span>
          <select
            value={filters.openedWithinDays}
            onChange={(event) =>
              setFilters((value) => ({
                ...value,
                openedWithinDays: Number(event.target.value),
              }))
            }
            className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value={0}>Qualquer data</option>
            <option value={30}>Últimos 30 dias</option>
            <option value={90}>Últimos 90 dias</option>
            <option value={180}>Últimos 180 dias</option>
            <option value={365}>Último ano</option>
          </select>
        </label>
        <label className="min-w-[150px] flex-1 space-y-1.5">
          <span className="text-xs font-medium text-muted-foreground">CNAE</span>
          <Input
            value={filters.cnae}
            onChange={(event) => setFilters((value) => ({ ...value, cnae: event.target.value }))}
            placeholder="Código do CNAE"
          />
        </label>

        <Popover open={filtersOpen} onOpenChange={setFiltersOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="h-9 gap-2" title="Filtros adicionais">
              <SlidersHorizontal className="h-4 w-4" />
              Filtros
              {chips.length > 0 && (
                <Badge className="ml-1 bg-primary/10 px-1.5 text-primary">{chips.length}</Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={8}
            collisionPadding={16}
            avoidCollisions
            className="flex max-h-[calc(100vh-120px)] w-[min(320px,calc(100vw-32px))] flex-col p-0"
          >
            <div className="shrink-0 border-b border-border px-4 py-2.5">
              <p className="text-sm font-semibold">Filtros adicionais</p>
            </div>
            <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="space-y-3 p-4">

                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">
                    Situação cadastral
                  </span>
                  <select
                    value={filters.registrationStatus}
                    onChange={(event) =>
                      setFilters((value) => ({ ...value, registrationStatus: event.target.value }))
                    }
                    className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Todas</option>
                    {registrationStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Porte</span>
                  <select
                    value={filters.companySize}
                    onChange={(event) =>
                      setFilters((value) => ({ ...value, companySize: event.target.value }))
                    }
                    className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Todos</option>
                    {companySizeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Etapa do lead</span>
                  <select
                    value={filters.stage}
                    onChange={(event) =>
                      setFilters((value) => ({ ...value, stage: event.target.value }))
                    }
                    className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="">Todas</option>
                    {Object.entries(stageLabels).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">CNAE</span>
                  <Input
                    value={filters.cnae}
                    onChange={(event) =>
                      setFilters((value) => ({ ...value, cnae: event.target.value }))
                    }
                    placeholder="Código do CNAE"
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Score mínimo</span>
                  <Input
                    type="number"
                    min={0}
                    value={filters.minScore}
                    onChange={(event) =>
                      setFilters((value) => ({ ...value, minScore: event.target.value }))
                    }
                    placeholder="Ex.: 8"
                  />
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Aberta de</span>
                    <Input
                      type="date"
                      value={filters.openedFrom}
                      onChange={(event) =>
                        setFilters((value) => ({ ...value, openedFrom: event.target.value }))
                      }
                      className="cursor-pointer"
                    />
                  </label>
                  <label className="space-y-1.5">
                    <span className="text-xs font-medium text-muted-foreground">Aberta até</span>
                    <Input
                      type="date"
                      value={filters.openedTo}
                      onChange={(event) =>
                        setFilters((value) => ({ ...value, openedTo: event.target.value }))
                      }
                      className="cursor-pointer"
                    />
                  </label>
                </div>
                <Separator />
                {(
                  [
                    ["hasPhone", "Com telefone"],
                    ["hasEmail", "Com e-mail"],
                    ["onlyMei", "Somente MEI"],
                    ["onlySimples", "Somente Simples Nacional"],
                  ] as Array<[keyof CompanyLeadFilters, string]>
                ).map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={Boolean(filters[key])}
                      onCheckedChange={(checked) =>
                        setFilters((value) => ({ ...value, [key]: checked === true }))
                      }
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
            <div className="shrink-0 border-t border-border p-3">
              <Button
                type="button"
                className="w-full"
                onClick={() => {
                  setFiltersOpen(false);
                  searchLeads(0);
                }}
              >
                Aplicar filtros
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="h-9 gap-2" title="Escolher colunas">
              <Columns3 className="h-4 w-4" />
              Colunas
            </Button>
          </PopoverTrigger>
          <PopoverContent
            align="end"
            side="bottom"
            sideOffset={8}
            collisionPadding={16}
            avoidCollisions
            className="flex max-h-[calc(100vh-120px)] w-[min(260px,calc(100vw-32px))] flex-col p-0"
          >
            <div className="shrink-0 border-b border-border px-3 py-2.5">
              <p className="text-sm font-semibold">Colunas visíveis</p>
            </div>
            <div className="hide-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <div className="space-y-1 p-3">
                {columnDefinitions.map((column) => (
                  <label
                    key={column.key}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm hover:bg-muted/50"
                  >
                    <Checkbox
                      checked={visibleColumns.includes(column.key)}
                      onCheckedChange={(checked) =>
                        persistColumns(
                          checked === true
                            ? columnDefinitions
                                .map((item) => item.key)
                                .filter(
                                  (key) => visibleColumns.includes(key) || key === column.key,
                                )
                            : visibleColumns.filter((key) => key !== column.key),
                        )
                      }
                    />
                    {column.label}
                  </label>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>


        <Button
          onClick={() => searchLeads(0)}
          disabled={searching}
          title="Procurar empresas"
          className="h-9 gap-2"
        >
          {searching ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          Procurar empresas
        </Button>
      </div>

      {chips.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/40 px-3 py-1 text-xs"
            >
              {chip.label}
              <button
                type="button"
                title={`Remover filtro ${chip.label}`}
                onClick={() => removeFilter(chip.clear)}
                className="grid h-4 w-4 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4 border-y border-border py-3 text-sm">
        <span className="inline-flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <strong>{total}</strong> leads encontrados
        </span>
        <span className="inline-flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-600" />
          <strong>{qualified}</strong> qualificados
        </span>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-muted/35 text-left text-xs uppercase text-muted-foreground">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="px-4 py-3 font-medium">
                    {column.sort ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(column.sort as CompanyLeadSort)}
                        title={`Ordenar por ${column.label}`}
                        className="inline-flex cursor-pointer items-center gap-1 uppercase hover:text-foreground"
                      >
                        {column.label}
                        {sort === column.sort ? (
                          direction === "asc" ? (
                            <ArrowUp className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-primary" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                        )}
                      </button>
                    ) : (
                      column.label
                    )}
                  </th>
                ))}
                <th className="w-12 px-4 py-3">
                  <span className="sr-only">Fonte</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!loading &&
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-primary/[0.03]">
                    {columns.map((column) => (
                      <td key={column.key} className="px-4 py-3 align-top">
                        {renderCell(column, lead)}
                      </td>
                    ))}
                    <td className="px-4 py-3">
                      {lead.source_url && (
                        <a
                          href={lead.source_url}
                          target="_blank"
                          rel="noreferrer"
                          title="Consultar fonte"
                          className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              {!loading && leads.length === 0 && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-14 text-center text-muted-foreground"
                  >
                    {hasSearched
                      ? "Nenhum lead encontrado com os filtros aplicados."
                      : "Informe cidade e UF para procurar novas empresas."}
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td
                    colSpan={columns.length + 1}
                    className="px-6 py-14 text-center text-muted-foreground"
                  >
                    <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Carregando leads…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      {total > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Mostrando {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total}
          </span>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={searching || page === 0}
              onClick={() => void runSearch(page - 1, appliedFilters, sort, direction)}
              title="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-20 text-center">
              Página {page + 1} de {Math.ceil(total / PAGE_SIZE)}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={searching || (page + 1) * PAGE_SIZE >= total}
              onClick={() => void runSearch(page + 1, appliedFilters, sort, direction)}
              title="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
