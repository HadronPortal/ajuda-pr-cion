import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  CircleUserRound,
  Cpu,
  Database,
  FileText,
  Filter,
  RefreshCw,
  HardDrive,
  Monitor,
  Phone,
  ShieldCheck,
  Server,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import {
  formatVersionDate,
  getClientErpVersionStatus,
  latestErpAlterationDate,
} from "@/lib/erp-versions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { listClients } from "@/lib/clients-api";
import type {
  ClientCompany,
  ClientContact,
  ClientEvent,
  ClientHadronUser,
  ClientModule,
  ClientTerminal,
  ClientTicket,
} from "@/lib/clients-api";
import { normalizeCityUf } from "@/lib/br-city";
import { supabase } from "@/lib/supabase";

const clientesSearchSchema = z.object({
  grupo: fallback(z.string(), "").optional(),
});

export const Route = createFileRoute("/clientes/")({
  head: () => ({ meta: [{ title: "Clientes - Portal Procion" }] }),
  validateSearch: zodValidator(clientesSearchSchema),
  loader: async () => {
    try {
      return { clients: await listClients() };
    } catch (error) {
      console.error("Nao foi possivel carregar clientes do Supabase", error);
      return { clients: clientRows };
    }
  },
  component: ClientsPage,
});

export type ClientRow = {
  id: string;
  registered: string; // dd/MM/yyyy
  acronym: string;
  group: string;
  name: string; // apelido / nome curto
  razaoSocial: string;
  fantasia: string;
  segment: string; // ramo
  size: string; // porte
  version: string;
  versionDate: string; // data da versão (release)
  versionUpdatedAt: string; // data/hora em que a versão foi instalada no cliente
  updated: string;
  updatedAt: string; // última alteração do cadastro no CRM
  city: string; // "Cidade - UF"
  uf: string;
  cep: string;
  cnpj: string;
  status: "Ativo" | "Inativo";
};

export const clientRows: ClientRow[] = [
  {
    id: "avc",
    registered: "06/05/2026",
    acronym: "AVC",
    group: "ASC",
    name: "CENTER GLASS",
    razaoSocial: "CENTER GLASS ACESSORIOS AUTOMOBILISTICOS LTDA",
    fantasia: "CENTER GLASS CATANDUVA",
    segment: "Comercio",
    size: "Pequeno",
    version: "2.0",
    versionDate: "02/07/2026",
    versionUpdatedAt: "14/07/2026 09:02",
    updated: "15/06/2026 09:58",
    updatedAt: "17/07/2026 10:17",
    city: "Catanduva - SP",
    uf: "SP",
    cep: "15805-254",
    cnpj: "66.613.387/0001-60",
    status: "Ativo",
  },
  {
    id: "mit",
    registered: "12/03/2019",
    acronym: "MIT",
    group: "",
    name: "MINERACAO ITAPORANGA",
    razaoSocial: "MINERACAO ITAPORANGA LTDA",
    fantasia: "MIT MINERADORA",
    segment: "Industria",
    size: "Medio",
    version: "2.0",
    versionDate: "02/07/2026",
    versionUpdatedAt: "10/07/2026 15:41",
    updated: "08/07/2026 08:24",
    updatedAt: "16/07/2026 14:22",
    city: "Curitiba - PR",
    uf: "PR",
    cep: "80010-010",
    cnpj: "18.447.221/0001-40",
    status: "Ativo",
  },
  {
    id: "mrg",
    registered: "18/09/2020",
    acronym: "MRG",
    group: "",
    name: "MERCEARIA GOMES",
    razaoSocial: "MERCEARIA E SACOLAO GOMES",
    fantasia: "SACOLAO GOMES",
    segment: "Comercio",
    size: "Pequeno",
    version: "1.9",
    versionDate: "18/06/2026",
    versionUpdatedAt: "25/06/2026 10:12",
    updated: "08/07/2026 08:17",
    updatedAt: "15/07/2026 09:05",
    city: "Belo Horizonte - MG",
    uf: "MG",
    cep: "30130-010",
    cnpj: "31.095.640/0001-12",
    status: "Ativo",
  },
  {
    id: "epb",
    registered: "04/11/2022",
    acronym: "EPB",
    group: "",
    name: "EPAPER BOX",
    razaoSocial: "EPAPER BOX EMBALAGENS LTDA",
    fantasia: "EPAPER BOX",
    segment: "Industria",
    size: "Medio",
    version: "2.0",
    versionDate: "02/07/2026",
    versionUpdatedAt: "09/07/2026 18:30",
    updated: "08/07/2026 08:40",
    updatedAt: "17/07/2026 08:47",
    city: "Sao Paulo - SP",
    uf: "SP",
    cep: "01310-100",
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

type StatusFilter = "Todos" | "Ativo" | "Inativo";

type Filters = {
  sigla: string;
  siglaGrupo: string;
  nome: string;
  razaoSocial: string;
  fantasia: string;
  porte: string; // "" = todos
  ramo: string;
  cep: string;
  cidade: string;
  uf: string;
  cnpj: string;
  status: StatusFilter;
  dateStart?: Date;
  dateEnd?: Date;
};

const emptyFilters: Filters = {
  sigla: "",
  siglaGrupo: "",
  nome: "",
  razaoSocial: "",
  fantasia: "",
  porte: "",
  ramo: "",
  cep: "",
  cidade: "",
  uf: "",
  cnpj: "",
  status: "Todos",
  dateStart: undefined,
  dateEnd: undefined,
};

function normalize(v: string) {
  return v
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function digits(v: string) {
  return v.replace(/\D+/g, "");
}

function parseBRDate(s: string): Date {
  const [d, m, y] = s.split("/").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function countActive(f: Filters): number {
  let n = 0;
  if (f.sigla.trim()) n++;
  if (f.siglaGrupo.trim()) n++;
  if (f.nome.trim()) n++;
  if (f.razaoSocial.trim()) n++;
  if (f.fantasia.trim()) n++;
  if (f.porte) n++;
  if (f.ramo) n++;
  if (f.cep.trim()) n++;
  if (f.cidade.trim()) n++;
  if (f.uf) n++;
  if (f.cnpj.trim()) n++;
  if (f.status !== "Todos") n++;
  if (f.dateStart || f.dateEnd) n++;
  return n;
}

// Cache de filtros preservado ao navegar entre lista e ficha detalhada.
let lastFilters: Filters = { ...emptyFilters };

const PAGE_SIZE = 50;

function formatCep(v: string): string {
  const d = v.replace(/\D+/g, "");
  if (d.length !== 8) return v.trim();
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

function formatCnpjDisplay(v: string): { text: string; incomplete: boolean; raw: string } {
  const raw = String(v ?? "");
  const d = raw.replace(/\D+/g, "");
  if (d.length === 14) {
    return {
      text: d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5"),
      incomplete: false,
      raw,
    };
  }
  return { text: "CNPJ incompleto", incomplete: true, raw };
}

type CnpjInfo = { text: string; incomplete: boolean; raw: string; missing?: boolean };

const cnpjResolveCache = new Map<string, CnpjInfo>();
const cnpjResolvePending = new Map<string, Promise<CnpjInfo>>();

function formatCnpjDigits(d: string) {
  return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
}

async function resolveClientCnpj(client: ClientRow, initial: CnpjInfo): Promise<CnpjInfo> {
  const key = client.acronym || client.id;
  const cached = cnpjResolveCache.get(key);
  if (cached) return cached;
  const pending = cnpjResolvePending.get(key);
  if (pending) return pending;
  const promise = (async () => {
    try {
      const { data, error } = await supabase.rpc("get_crm_client", { client_acronym: client.acronym });
      if (error) throw error;
      const candidates: unknown[] = [];
      const clientDoc = (data as { client?: { document?: unknown } } | null)?.client?.document;
      if (clientDoc) candidates.push(clientDoc);
      const companies = (data as { companies?: Array<{ document?: unknown }> } | null)?.companies || [];
      for (const co of companies) if (co?.document) candidates.push(co.document);
      for (const raw of candidates) {
        const d = String(raw ?? "").replace(/\D+/g, "");
        if (d.length === 14) {
          const result: CnpjInfo = { text: formatCnpjDigits(d), incomplete: false, raw: String(raw) };
          cnpjResolveCache.set(key, result);
          return result;
        }
      }
    } catch {
      /* silencioso; mostraremos "CNPJ não informado" */
    }
    const result: CnpjInfo = { text: "CNPJ não informado", incomplete: true, missing: true, raw: initial.raw };
    cnpjResolveCache.set(key, result);
    return result;
  })();
  cnpjResolvePending.set(key, promise);
  try {
    return await promise;
  } finally {
    cnpjResolvePending.delete(key);
  }
}

function ClientCnpjCell({ client }: { client: ClientRow }) {
  const initial = useMemo(() => formatCnpjDisplay(client.cnpj), [client.cnpj]);
  const [info, setInfo] = useState<CnpjInfo>(() =>
    initial.incomplete ? cnpjResolveCache.get(client.acronym || client.id) ?? initial : initial,
  );

  useEffect(() => {
    if (!initial.incomplete) {
      setInfo(initial);
      return;
    }
    const cached = cnpjResolveCache.get(client.acronym || client.id);
    if (cached) {
      setInfo(cached);
      return;
    }
    let cancelled = false;
    resolveClientCnpj(client, initial).then((result) => {
      if (!cancelled) setInfo(result);
    });
    return () => {
      cancelled = true;
    };
  }, [client, initial]);

  if (info.incomplete) {
    return (
      <span
        className="text-[12px] italic text-muted-foreground/80"
        title={info.raw ? `Valor original: ${info.raw}` : "CNPJ não informado"}
      >
        {info.missing ? "CNPJ não informado" : initial.raw ? "…" : "CNPJ não informado"}
      </span>
    );
  }
  return <span title={info.raw}>{info.text}</span>;
}


type SortKey = "registered" | "acronym" | "name" | "version" | "city" | "cnpj" | "status";

const ptCollator = new Intl.Collator("pt-BR", { sensitivity: "base", numeric: true });

function compareByKey(a: ClientRow, b: ClientRow, key: SortKey): number {
  switch (key) {
    case "registered":
      return parseBRDate(a.registered).getTime() - parseBRDate(b.registered).getTime();
    case "acronym":
      return ptCollator.compare(a.acronym, b.acronym);
    case "name":
      return ptCollator.compare(a.razaoSocial || a.name, b.razaoSocial || b.name);
    case "version":
      return ptCollator.compare(a.version, b.version);
    case "city":
      return ptCollator.compare(a.city, b.city);
    case "cnpj": {
      const na = Number(digits(a.cnpj)) || 0;
      const nb = Number(digits(b.cnpj)) || 0;
      return na - nb;
    }
    case "status":
      return ptCollator.compare(a.status, b.status);
    default:
      return 0;
  }
}

function ClientVersionCell({ client }: { client: ClientRow }) {
  const status = getClientErpVersionStatus(client.version, client.versionDate);
  const warningClass =
    "rounded-md border border-red-200 bg-red-50 px-1.5 py-0.5 text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300";

  return (
    <td className="whitespace-nowrap px-4 py-4">
      <div className="inline-flex flex-col items-start gap-1">
        <div className="flex items-center gap-1.5 text-[11px] font-normal">
          <span className={cn((status.isMissing || status.isLegacy) && warningClass)}>
            {status.isMissing ? status.displayVersion : `Versão: ${status.displayVersion}`}
          </span>
          {!status.isMissing && client.versionDate && (
            <span
              className={cn(status.isOutdated && warningClass)}
              title={
                status.isOutdated
                  ? `Versão anterior à alteração mínima de ${formatVersionDate(latestErpAlterationDate)}`
                  : undefined
              }
            >
              ({client.versionDate})
            </span>
          )}
        </div>
        {client.versionUpdatedAt && (
          <div className="flex items-center gap-1.5 text-[11px] font-normal text-muted-foreground">
            <span>{client.versionUpdatedAt}</span>
            <RefreshCw className="h-3 w-3" />
          </div>
        )}
      </div>
    </td>
  );
}

function ClientsPage() {
  const { clients } = Route.useLoaderData() as { clients: ClientRow[] };
  const { grupo } = Route.useSearch();
  const navigate = useNavigate();
  const grupoParam = (grupo ?? "").trim().toUpperCase();
  const [filters, setFilters] = useState<Filters>(() =>
    grupoParam ? { ...lastFilters, siglaGrupo: grupoParam } : lastFilters,
  );
  const [draft, setDraft] = useState<Filters>(() => filters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" } | null>({ key: "registered", dir: "desc" });

  useEffect(() => {
    lastFilters = filters;
    setPage(1);
  }, [filters]);

  // Sincroniza URL <-> filtro de grupo, permitindo compartilhar/atualizar mantendo o filtro.
  useEffect(() => {
    if (grupoParam && filters.siglaGrupo.toUpperCase() !== grupoParam) {
      setFilters((p) => ({ ...p, siglaGrupo: grupoParam }));
    }
  }, [grupoParam]);

  useEffect(() => {
    const current = filters.siglaGrupo.trim().toUpperCase();
    if (current !== grupoParam) {
      navigate({
        to: "/clientes",
        search: current ? { grupo: current } : {},
        replace: true,
      });
    }
  }, [filters.siglaGrupo]);

  useEffect(() => {
    setPage(1);
  }, [sort]);

  useEffect(() => {
    if (filtersOpen) setDraft(filters);
  }, [filtersOpen, filters]);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      if (filters.sigla && !normalize(c.acronym).includes(normalize(filters.sigla))) return false;
      if (filters.siglaGrupo && !normalize(c.group).includes(normalize(filters.siglaGrupo)))
        return false;
      if (filters.nome && !normalize(c.name).includes(normalize(filters.nome))) return false;
      if (
        filters.razaoSocial &&
        !normalize(c.razaoSocial).includes(normalize(filters.razaoSocial))
      )
        return false;
      if (filters.fantasia && !normalize(c.fantasia).includes(normalize(filters.fantasia)))
        return false;
      if (filters.porte && c.size !== filters.porte) return false;
      if (filters.ramo && c.segment !== filters.ramo) return false;
      if (filters.cep && !digits(c.cep).includes(digits(filters.cep))) return false;
      if (filters.cidade && !normalize(c.city).includes(normalize(filters.cidade))) return false;
      if (filters.uf && c.uf !== filters.uf) return false;
      if (filters.cnpj && !digits(c.cnpj).includes(digits(filters.cnpj))) return false;
      if (filters.status !== "Todos" && c.status !== filters.status) return false;
      if (filters.dateStart || filters.dateEnd) {
        const d = parseBRDate(c.registered);
        const day = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        if (filters.dateStart) {
          const s = filters.dateStart;
          const start = new Date(s.getFullYear(), s.getMonth(), s.getDate()).getTime();
          if (day < start) return false;
        }
        if (filters.dateEnd) {
          const e = filters.dateEnd;
          const end = new Date(e.getFullYear(), e.getMonth(), e.getDate()).getTime();
          if (day > end) return false;
        }
      }
      return true;
    });
  }, [clients, filters]);

  const sizes = useMemo(() => Array.from(new Set(clients.map((c) => c.size))).sort(), [clients]);
  const segments = useMemo(() => Array.from(new Set(clients.map((c) => c.segment))).sort(), [clients]);
  const ufs = useMemo(() => Array.from(new Set(clients.map((c) => c.uf))).filter(Boolean).sort(), [clients]);

  const activeCount = countActive(filters);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const arr = filtered.slice();
    const factor = sort.dir === "asc" ? 1 : -1;
    arr.sort((a, b) => compareByKey(a, b, sort.key) * factor);
    return arr;
  }, [filtered, sort]);

  const totalItems = sorted.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pageRows = sorted.slice(startIndex, endIndex);


  const removeChip = (key: keyof Filters) => {
    setFilters((p) => ({
      ...p,
      [key]:
        key === "status" ? "Todos" : key === "dateStart" || key === "dateEnd" ? undefined : "",
    }));
  };

  const clearDates = () =>
    setFilters((p) => ({ ...p, dateStart: undefined, dateEnd: undefined }));

  const chips: Array<{ key: string; label: string; onRemove: () => void }> = [];
  if (filters.sigla)
    chips.push({ key: "sigla", label: `Sigla: ${filters.sigla}`, onRemove: () => removeChip("sigla") });
  if (filters.siglaGrupo)
    chips.push({
      key: "siglaGrupo",
      label: `Grupo: ${filters.siglaGrupo}`,
      onRemove: () => removeChip("siglaGrupo"),
    });
  if (filters.nome)
    chips.push({ key: "nome", label: `Nome: ${filters.nome}`, onRemove: () => removeChip("nome") });
  if (filters.razaoSocial)
    chips.push({
      key: "razaoSocial",
      label: `Razão social: ${filters.razaoSocial}`,
      onRemove: () => removeChip("razaoSocial"),
    });
  if (filters.fantasia)
    chips.push({
      key: "fantasia",
      label: `Fantasia: ${filters.fantasia}`,
      onRemove: () => removeChip("fantasia"),
    });
  if (filters.porte)
    chips.push({ key: "porte", label: `Porte: ${filters.porte}`, onRemove: () => removeChip("porte") });
  if (filters.ramo)
    chips.push({ key: "ramo", label: `Ramo: ${filters.ramo}`, onRemove: () => removeChip("ramo") });
  if (filters.cep)
    chips.push({ key: "cep", label: `CEP: ${filters.cep}`, onRemove: () => removeChip("cep") });
  if (filters.cidade)
    chips.push({
      key: "cidade",
      label: `Cidade: ${filters.cidade}`,
      onRemove: () => removeChip("cidade"),
    });
  if (filters.uf) chips.push({ key: "uf", label: `UF: ${filters.uf}`, onRemove: () => removeChip("uf") });
  if (filters.cnpj)
    chips.push({ key: "cnpj", label: `CNPJ: ${filters.cnpj}`, onRemove: () => removeChip("cnpj") });
  if (filters.status !== "Todos")
    chips.push({
      key: "status",
      label: `Status: ${filters.status}`,
      onRemove: () => removeChip("status"),
    });
  if (filters.dateStart || filters.dateEnd) {
    const s = filters.dateStart ? format(filters.dateStart, "dd/MM/yyyy") : "…";
    const e = filters.dateEnd ? format(filters.dateEnd, "dd/MM/yyyy") : "…";
    chips.push({ key: "date", label: `Cadastro: ${s} – ${e}`, onRemove: clearDates });
  }

  return (
    <AppShell>
      <PageHeader
        title="Clientes"
        description="Cadastro, ambiente e relacionamento dos clientes."
        breadcrumbs={[{ label: "Clientes" }]}
      />

      <div className="mb-4 flex justify-end">
        <Button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="h-10 cursor-pointer gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-md hover:bg-blue-700"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeCount > 0 && (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-[11px] font-semibold">
              {activeCount}
            </span>
          )}
        </Button>
      </div>

      {chips.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-foreground"
            >
              <span className="truncate">{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remover filtro ${chip.label}`}
                className="grid h-4 w-4 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="cursor-pointer text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Limpar todos
          </button>
        </div>
      )}

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/35 text-xs uppercase text-muted-foreground">
              <tr>
                {(
                  [
                    { label: "Cadastro", key: "registered" as SortKey },
                    { label: "Sigla", key: "acronym" as SortKey },
                    { label: "Nome / perfil", key: "name" as SortKey },
                    { label: "Versao / setup", key: "version" as SortKey },
                    { label: "Cidade / UF", key: "city" as SortKey },
                    { label: "CNPJ", key: "cnpj" as SortKey },
                    { label: "Status", key: "status" as SortKey },
                  ]
                ).map(({ label, key }) => {
                  const active = sort?.key === key;
                  const dir = active ? sort!.dir : null;
                  return (
                    <th
                      key={label}
                      onClick={() =>
                        setSort((prev) => {
                          if (!prev || prev.key !== key) return { key, dir: "asc" };
                          if (prev.dir === "asc") return { key, dir: "desc" };
                          return null;
                        })
                      }
                      aria-sort={
                        dir === "asc"
                          ? "ascending"
                          : dir === "desc"
                            ? "descending"
                            : "none"
                      }
                      className="cursor-pointer whitespace-nowrap px-2.5 py-3 text-left font-medium select-none hover:text-foreground transition-colors"
                    >
                      <span className="inline-flex items-center gap-1">
                        {label}
                        {dir === "asc" ? (
                          <ArrowUp className="h-3 w-3" />
                        ) : dir === "desc" ? (
                          <ArrowDown className="h-3 w-3" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 opacity-40" />
                        )}
                      </span>
                    </th>
                  );
                })}
                
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageRows.map((client) => (
                <tr
                  key={client.id}
                  onClick={() =>
                    navigate({
                      to: "/clientes/$clienteId",
                      params: { clienteId: client.id },
                    })
                  }
                  className="cursor-pointer transition-colors hover:bg-primary/[0.04]"
                >
                  <td className="whitespace-nowrap px-2.5 py-4 text-muted-foreground">
                    {client.registered}
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-4">
                    <div className="font-medium text-primary">{client.acronym}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.group || "Sem grupo"}
                    </div>
                  </td>
                  <td className="min-w-[240px] px-2.5 py-4">
                    <div className="text-[12px] font-normal leading-[1.2] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                      {client.name}
                    </div>
                    <div className="mt-1 truncate text-[11px] font-normal leading-[1.2] text-foreground/80">
                      {client.razaoSocial}
                    </div>
                    <div className="text-[11px] font-normal text-muted-foreground">
                      {client.segment} - Porte: {client.size}
                    </div>
                  </td>
                  <ClientVersionCell client={client} />
                  <td className="whitespace-nowrap px-2.5 py-4">
                    <div className="flex flex-col items-start">
                      <span>{normalizeCityUf(client.city)}</span>
                      {client.cep && client.cep.replace(/\D+/g, "").length > 0 && (
                        <span className="text-[11px] text-muted-foreground">{formatCep(client.cep)}</span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-2.5 py-4 text-muted-foreground">
                    <ClientCnpjCell client={client} />
                  </td>
                  <td className="px-2.5 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <Badge
                        className={cn(
                          client.status === "Ativo"
                            ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                            : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300",
                        )}
                      >
                        {client.status}
                      </Badge>
                      <div className="flex items-center gap-1 whitespace-nowrap text-[11px] text-muted-foreground">
                        <RefreshCw className="h-3 w-3 shrink-0" />
                        <span>{client.updatedAt}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Nenhum cliente encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {totalItems > 0 && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            start={startIndex + 1}
            end={endIndex}
            total={totalItems}
            onChange={setPage}
          />
        )}
      </Card>


      <FiltersPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        draft={draft}
        setDraft={setDraft}
        sizes={sizes}
        segments={segments}
        ufs={ufs}
        onApply={() => {
          setFilters(draft);
          setFiltersOpen(false);
        }}
        onClear={() => setDraft(emptyFilters)}
      />
    </AppShell>
  );
}

function FiltersPanel({
  open,
  onOpenChange,
  draft,
  setDraft,
  sizes,
  segments,
  ufs,
  onApply,
  onClear,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  draft: Filters;
  setDraft: React.Dispatch<React.SetStateAction<Filters>>;
  sizes: string[];
  segments: string[];
  ufs: string[];
  onApply: () => void;
  onClear: () => void;
}) {
  const update = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setDraft((p) => ({ ...p, [k]: v }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="text-lg font-semibold">Filtros de clientes</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <FieldText
                label="Sigla"
                value={draft.sigla}
                onChange={(v) => update("sigla", v.toUpperCase())}
                placeholder="Ex.: AVC"
                uppercase
              />
              <FieldText
                label="Sigla do grupo"
                value={draft.siglaGrupo}
                onChange={(v) => update("siglaGrupo", v.toUpperCase())}
                placeholder="Ex.: ASC"
                uppercase
              />
            </div>

            <FieldText
              label="Nome (apelido)"
              value={draft.nome}
              onChange={(v) => update("nome", v)}
              placeholder="Nome curto"
            />
            <FieldText
              label="Razão social"
              value={draft.razaoSocial}
              onChange={(v) => update("razaoSocial", v)}
              placeholder="Razão social completa"
            />
            <FieldText
              label="Nome fantasia"
              value={draft.fantasia}
              onChange={(v) => update("fantasia", v)}
              placeholder="Nome fantasia"
            />

            <div className="grid grid-cols-2 gap-3">
              <FieldSelect
                label="Porte"
                value={draft.porte}
                onChange={(v) => update("porte", v)}
                options={[{ value: "", label: "Todos" }, ...sizes.map((s) => ({ value: s, label: s }))]}
              />
              <FieldSelect
                label="Ramo"
                value={draft.ramo}
                onChange={(v) => update("ramo", v)}
                options={[{ value: "", label: "Todos" }, ...segments.map((s) => ({ value: s, label: s }))]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FieldText
                label="CEP"
                value={draft.cep}
                onChange={(v) => update("cep", v)}
                placeholder="00000-000"
              />
              <FieldSelect
                label="UF"
                value={draft.uf}
                onChange={(v) => update("uf", v)}
                options={[{ value: "", label: "Todas" }, ...ufs.map((u) => ({ value: u, label: u }))]}
              />
            </div>

            <FieldText
              label="Cidade"
              value={draft.cidade}
              onChange={(v) => update("cidade", v)}
              placeholder="Cidade"
            />

            <FieldText
              label="CNPJ"
              value={draft.cnpj}
              onChange={(v) => update("cnpj", v)}
              placeholder="Com ou sem pontuação"
            />

            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Status
              </p>
              <div className="grid grid-cols-3 gap-2">
                {(["Todos", "Ativo", "Inativo"] as StatusFilter[]).map((s) => {
                  const active = draft.status === s;
                  return (
                    <label
                      key={s}
                      className={cn(
                        "flex cursor-pointer items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm transition",
                        active
                          ? "border-primary bg-primary/5 text-foreground"
                          : "border-border bg-background text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <input
                        type="radio"
                        name="client-status"
                        className="h-4 w-4 cursor-pointer accent-primary"
                        checked={active}
                        onChange={() => update("status", s)}
                      />
                      <span>{s}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Período de cadastro
              </p>
              <div className="grid grid-cols-2 gap-3">
                <DateField
                  label="Data inicial"
                  value={draft.dateStart}
                  onChange={(d) => update("dateStart", d)}
                />
                <DateField
                  label="Data final"
                  value={draft.dateEnd}
                  onChange={(d) => update("dateEnd", d)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border bg-background px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            className="h-10 cursor-pointer rounded-lg text-sm"
            onClick={onClear}
          >
            <SlidersHorizontal className="mr-1.5 h-4 w-4" />
            Limpar filtros
          </Button>
          <Button
            type="button"
            onClick={onApply}
            className="h-10 cursor-pointer rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Aplicar filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FieldText({
  label,
  value,
  onChange,
  placeholder,
  uppercase,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  uppercase?: boolean;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring",
          uppercase && "uppercase",
        )}
      />
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: Date;
  onChange: (d?: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-full cursor-pointer items-center gap-2 truncate rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarDays className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">{value ? format(value, "dd/MM/yyyy") : "dd/mm/aaaa"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
            locale={ptBR}
            initialFocus
            className={cn("pointer-events-auto p-3")}
          />
          <div className="flex items-center justify-end border-t border-border px-3 py-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 cursor-pointer"
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            >
              Limpar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}


export function Summary({ label, value }: { label: string; value: string }) {
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
  titleClassName,
}: {
  title: string;
  icon: typeof Building2;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <Card className={cn("p-5", className)}>
      <h3 className={cn("mb-4 flex items-center gap-2 font-medium", titleClassName)}>
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

function contactDescription(contact: ClientContact) {
  return [contact.name, contact.department].filter(Boolean).join(" / ") || "Sem identificacao";
}

function EmptyState({ text }: { text: string }) {
  return <p className="rounded-md border border-dashed border-border p-5 text-sm text-muted-foreground">{text}</p>;
}

export function ClientTab({
  client,
  contacts,
  companies,
  tickets,
  events,
}: {
  client: ClientRow;
  contacts: ClientContact[];
  companies: ClientCompany[];
  tickets: ClientTicket[];
  events: ClientEvent[];
}) {
  const company = companies[0];
  const contactItems = contacts.flatMap((contact) => {
    const description = contactDescription(contact);
    const items: Array<{ id: string; label: string; value: string }> = [];
    if (contact.phone) items.push({ id: `${contact.id}-phone`, label: "Telefone", value: `${contact.phone} - ${description}` });
    if (contact.mobile) items.push({ id: `${contact.id}-mobile`, label: "Celular", value: `${contact.mobile} - ${description}` });
    if (contact.whatsapp) items.push({ id: `${contact.id}-whatsapp`, label: "WhatsApp", value: `${contact.whatsapp} - ${description}` });
    if (contact.email) items.push({ id: `${contact.id}-email`, label: "E-mail", value: `${contact.email} - ${description}` });
    return items;
  });
  const companyCity = [company?.city || client.city, company?.state].filter(Boolean).join(" - ");
  const companyProfile = [company?.industry || client.segment, company?.size || client.size, company?.taxRegime]
    .filter(Boolean)
    .join(" - ");
  return (
    <>
      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Contatos" icon={Phone}>
          {contactItems.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {contactItems.map((item) => (
                <Field key={item.id} label={item.label} value={item.value} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nenhum contato cadastrado para este cliente.</p>
          )}
          <div className="hidden">
            <Field label="Telefone principal" value="(16) 3116-5795 · Helden / Marketing" />
            <Field label="Loja Sao Carlos" value="Leticia · Atendimento" />
            <Field label="E-mail" value="contato@autovidrossaocarlos.com.br" />
            <Field label="Financeiro" value="financeiro@autovidrossacarlos.com.br · Marina" />
          </div>
        </Section>
        <Section title="Empresa principal" icon={Building2}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome fantasia" value={company?.tradeName || client.fantasia || "Nao informado"} />
            <Field label="CNPJ" value={company?.document || client.cnpj || "Nao informado"} />
            <Field
              label="IE / CNAE"
              value={[company?.stateRegistration, company?.cnae].filter(Boolean).join(" - ") || "Nao informado"}
            />
            <Field label="Regime" value={companyProfile || "Nao informado"} />
            <Field label="Endereco" value={company?.address || "Nao informado"} />
            <Field
              label="Cidade"
              value={[companyCity, company?.postalCode || client.cep].filter(Boolean).join(" - CEP ") || "Nao informado"}
            />
          </div>
          <div className="hidden">
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
            <Field label="Responsavel" value={company?.responsibleName || "Nao informado"} />
            <Field label="Documento" value={company?.responsibleDocument || "Nao informado"} />
            <Field label="Contador" value={company?.accountantName || "Nao informado"} />
            <Field label="Telefone" value={company?.accountantPhone || "Nao informado"} />
            <Field label="E-mail" value={company?.accountantEmail || "Nao informado"} />
          </div>
          <div className="hidden">
            <Field label="Responsavel" value="MAURO APARECIDO SANCHES" />
            <Field label="CPF / RG" value="040.172.448-40 · 14.143.256-1" />
            <Field label="Escritorio" value="MARQUES E SANTOS" />
            <Field label="Contador" value="EDUARDO MARQUES DOS SANTOS" />
            <Field label="Telefone" value="(16) 98130-0428" />
            <Field label="E-mail" value="FISCALMARQUESSANTOS2011@GMAIL.COM" />
          </div>
        </Section>
        {false && <Section title="Proximo evento" icon={CalendarDays}>
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
        </Section>}
        <ClientNextEvent events={events} />
      </div>
      <Section title="Historico de suporte" icon={HardDrive} titleClassName="text-[16px] font-normal">
        <SupportRows tickets={tickets} />
      </Section>
    </>
  );
}

function ClientNextEvent({ events }: { events: ClientEvent[] }) {
  const event = events[0];

  return (
    <Section title="Proximo evento" icon={CalendarDays}>
      {event ? (
        <div className="rounded-md border border-border p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-medium">{event.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {[event.startsAt, event.operator].filter(Boolean).join(" - ")}
              </p>
            </div>
            <Badge className="bg-emerald-500/12 text-emerald-600">
              {event.status || "Agendado"}
            </Badge>
          </div>
          {event.ticketProtocol && (
            <p className="mt-3 text-xs text-muted-foreground">
              Chamado relacionado: {event.ticketProtocol}
            </p>
          )}
        </div>
      ) : (
        <EmptyState text="Nenhum evento encontrado para este cliente." />
      )}
    </Section>
  );
}

function SupportRows({ tickets }: { tickets: ClientTicket[] }) {
  if (!tickets.length) return <EmptyState text="Nenhum chamado encontrado para este cliente." />;
  return (
    <div className="divide-y divide-border rounded-md border border-border">
      {tickets.map((ticket) => (
        <div
          key={ticket.id}
          className="grid items-center gap-3 px-4 py-2 sm:grid-cols-[1.4fr_1.2fr_.6fr_.5fr_.7fr_auto]"
        >
          <span className="text-[13px] font-normal">{ticket.subject}</span>
          <span className="text-[12px] text-muted-foreground">{[ticket.module, ticket.submodule].filter(Boolean).join(" - ")}</span>
          <span className="text-[12px]">{ticket.operator || "-"}</span>
          <span className="text-[12px]">{ticket.priority || "-"}</span>
          <span className="text-[12px]">{ticket.createdAt}</span>
          <Button variant="ghost" size="sm" className="h-7 px-2 text-[12px] font-normal">
            Ver
          </Button>
        </div>
      ))}
    </div>
  );
}

export function HadronTab() {
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
          <div className="grid gap-1.5 sm:grid-cols-2">
            {modules.map((m) => (
              <div key={m} className="flex items-center gap-2 px-1 py-1.5 text-sm">
                <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                <span>{m}</span>
              </div>
            ))}
          </div>
        </Section>
        <Section title="Modulos nao contratados" icon={Database}>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {unavailableModules.map((m) => (
              <div
                key={m}
                className="flex items-center gap-2 px-1 py-1.5 text-sm text-muted-foreground"
              >
                <X className="h-4 w-4 shrink-0 text-red-500" />
                <span>{m}</span>
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

export function UsersTab() {
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
export function TerminalsTab() {
  return (
    <Section title="Terminais instalados" icon={Monitor}>
      <DataTable
        headers={["Terminal", "IP", "Pasta", "Data da versao", "Atualizacao", "Acoes"]}
        rows={terminals.map((r) => [...r, "Ver log"])}
      />
    </Section>
  );
}
export function CompaniesTab() {
  const rows: Array<{ icon: typeof Monitor; label: string; value: string }> = [
    { icon: Building2, label: "Codigo / Empresa", value: "001 - CENTER GLASS ACESSORIOS" },
    { icon: FileText, label: "CNPJ", value: "66.613.387/0001-60" },
    { icon: Monitor, label: "Terminais", value: "3" },
    { icon: Server, label: "Filiais", value: "1" },
    { icon: Database, label: "Versao", value: "2026-07-02" },
    { icon: Cpu, label: "Sistema operacional", value: "Windows 7" },
    { icon: Cpu, label: "Versao do SO", value: "6.2" },
    { icon: FileText, label: "Emite NF-e", value: "Sim" },
    { icon: FileText, label: "Notas emitidas", value: "0" },
    { icon: Cpu, label: "Memoria usada / total", value: "0 / 2097151" },
    { icon: HardDrive, label: "Drive P", value: "P" },
    { icon: HardDrive, label: "Drive P usado / total", value: "6 / 312.4" },
    { icon: HardDrive, label: "Drive T", value: "C" },
    { icon: HardDrive, label: "Drive T usado / total", value: "57.1 / 237.4" },
    { icon: HardDrive, label: "Drive A", value: "P" },
    { icon: HardDrive, label: "Drive A usado / total", value: "6 / 312.4" },
    { icon: ShieldCheck, label: "Tipo de certificado", value: "P" },
    { icon: ShieldCheck, label: "Validade do certificado", value: "08/05/2027" },
    { icon: ShieldCheck, label: "Ambiente", value: "N" },
    { icon: RefreshCw, label: "Atualizado em", value: "17/07/2026 08:44:37" },
    { icon: CalendarDays, label: "Registrado em", value: "09/05/2026 08:44:38" },
  ];
  return (
    <Section title="Empresas vinculadas" icon={Server}>
      <div className="grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-y-0 sm:[&>*]:border-b sm:[&>*]:border-border lg:grid-cols-3">
        {rows.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.label} className="flex items-start gap-3 px-4 py-3 sm:border-r sm:border-border">
              <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{r.value}</p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  {r.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function ClientHadronTab({
  client,
  modules,
  terminals,
}: {
  client: ClientRow;
  modules: ClientModule[];
  terminals: ClientTerminal[];
}) {
  const contracted = modules.filter((item) => item.contracted);
  const unavailable = modules.filter((item) => !item.contracted);
  const terminal = terminals[0];
  return (
    <>
      <Section title="Ambiente Hadron" icon={Database}>
        <div className="grid gap-5 md:grid-cols-3">
          <Field label="Cliente" value={client.acronym} />
          <Field label="Versao" value={terminal?.version || client.version || "Nao informada"} />
          <Field label="Terminais" value={String(terminals.length)} />
          <Field label="Sistema operacional" value={terminal?.operatingSystem || "Nao informado"} />
          <Field label="Emite NF-e" value={terminal?.emitsNfe == null ? "Nao informado" : terminal.emitsNfe ? "Sim" : "Nao"} />
          <Field label="Ambiente" value={terminal?.environment || "Nao informado"} />
        </div>
      </Section>
      <div className="grid gap-5 xl:grid-cols-2">
        <Section title="Modulos adquiridos" icon={CheckCircle2}>
          {contracted.length ? (
            <div className="grid gap-1.5 sm:grid-cols-2">
              {contracted.map((item) => (
                <div key={item.id} className="flex items-center gap-2 px-1 py-1.5 text-sm">
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState text="Nenhum modulo contratado cadastrado." />}
        </Section>
        <Section title="Modulos nao contratados" icon={Database}>
          {unavailable.length ? (
            <div className="grid gap-1.5 sm:grid-cols-2">
              {unavailable.map((item) => (
                <div key={item.id} className="flex items-center gap-2 px-1 py-1.5 text-sm text-muted-foreground">
                  <X className="h-4 w-4 text-red-500" />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          ) : <EmptyState text="Nenhum modulo nao contratado cadastrado." />}
        </Section>
      </div>
    </>
  );
}

export function ClientUsersTab({ users }: { users: ClientHadronUser[] }) {
  return (
    <Section title="Usuarios do portal" icon={UsersRound}>
      {users.length ? (
        <DataTable
          headers={["Nome", "E-mail", "Operador", "Perfil", "Status", "Cadastro / atualizacao"]}
          rows={users.map((user) => [
            user.name,
            user.email,
            user.operator || "-",
            user.role || "-",
            user.active ? "Ativo" : "Inativo",
            user.updatedAt || "-",
          ])}
        />
      ) : <EmptyState text="Nenhum usuario vinculado a este cliente." />}
    </Section>
  );
}

export function ClientTerminalsTab({ terminals }: { terminals: ClientTerminal[] }) {
  return (
    <Section title="Terminais instalados" icon={Monitor}>
      {terminals.length ? (
        <DataTable
          headers={["Terminal", "IP", "Pasta", "Versao", "Sistema", "Atualizacao"]}
          rows={terminals.map((terminal) => [
            terminal.terminalNumber == null ? "-" : String(terminal.terminalNumber),
            terminal.ipAddress || "-",
            terminal.installPath || "-",
            terminal.version || "-",
            [terminal.operatingSystem, terminal.operatingSystemVersion].filter(Boolean).join(" ") || "-",
            terminal.updatedAt || "-",
          ])}
        />
      ) : <EmptyState text="Nenhum terminal vinculado a este cliente." />}
    </Section>
  );
}

export function ClientCompaniesTab({
  client,
  companies,
  terminals,
}: {
  client: ClientRow;
  companies: ClientCompany[];
  terminals: ClientTerminal[];
}) {
  if (!companies.length) return <Section title="Empresas vinculadas" icon={Server}><EmptyState text="Nenhuma empresa vinculada a este cliente." /></Section>;
  return (
    <Section title="Empresas vinculadas" icon={Server}>
      <div className="space-y-5">
        {companies.map((company) => {
          const companyTerminals = terminals.filter((terminal) => terminal.companyNumber === company.companyNumber);
          const terminal = companyTerminals[0];
          const rows = [
            ["Codigo / Empresa", `${String(company.companyNumber ?? "-").padStart(3, "0")} - ${company.tradeName || company.legalName}`],
            ["CNPJ", company.document || "Nao informado"],
            ["Terminais", String(companyTerminals.length)],
            ["Versao", terminal?.version || client.version || "Nao informada"],
            ["Sistema operacional", terminal?.operatingSystem || "Nao informado"],
            ["Emite NF-e", terminal?.emitsNfe == null ? "Nao informado" : terminal.emitsNfe ? "Sim" : "Nao"],
            ["Notas emitidas", terminal ? String(terminal.notesIssued) : "Nao informado"],
            ["Memoria usada / total", terminal ? `${terminal.memoryUsed || "-"} / ${terminal.memoryTotal || "-"}` : "Nao informado"],
            ["Tipo de certificado", terminal?.certificateType || "Nao informado"],
            ["Validade do certificado", terminal?.certificateExpiresAt || "Nao informado"],
            ["Ambiente", terminal?.environment || "Nao informado"],
            ["Atualizado em", terminal?.updatedAt || client.updated || "Nao informado"],
            ["Registrado em", terminal?.registeredAt || "Nao informado"],
          ];
          return (
            <div key={company.id} className="grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-3">
              {rows.map(([label, value]) => (
                <div key={label} className="border-b border-r border-border px-4 py-3">
                  <p className="text-sm text-foreground">{value}</p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          );
        })}
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

function Pagination({
  page,
  totalPages,
  start,
  end,
  total,
  onChange,
}: {
  page: number;
  totalPages: number;
  start: number;
  end: number;
  total: number;
  onChange: (p: number) => void;
}) {
  const go = (p: number) => onChange(Math.max(1, Math.min(totalPages, p)));
  const showEdges = totalPages > 7;
  const windowSize = 5;
  let from = Math.max(1, page - Math.floor(windowSize / 2));
  let to = Math.min(totalPages, from + windowSize - 1);
  from = Math.max(1, Math.min(from, to - windowSize + 1));
  const pages: number[] = [];
  for (let i = from; i <= to; i++) pages.push(i);

  const btnBase =
    "inline-flex h-8 min-w-8 items-center justify-center rounded-md border border-border px-2 text-xs font-medium cursor-pointer transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <div className="flex flex-col gap-2 border-t border-border bg-muted/20 px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-muted-foreground">
        Mostrando <span className="font-medium text-foreground">{start}</span> a{" "}
        <span className="font-medium text-foreground">{end}</span> de{" "}
        <span className="font-medium text-foreground">{total}</span> clientes
      </p>
      <div className="flex flex-wrap items-center gap-1">
        {showEdges && (
          <button type="button" className={btnBase} onClick={() => go(1)} disabled={page === 1} aria-label="Primeira página">
            «
          </button>
        )}
        <button type="button" className={btnBase} onClick={() => go(page - 1)} disabled={page === 1} aria-label="Página anterior">
          ‹
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            aria-current={p === page ? "page" : undefined}
            className={cn(
              btnBase,
              p === page && "border-primary bg-primary text-primary-foreground hover:bg-primary",
            )}
          >
            {p}
          </button>
        ))}
        <button type="button" className={btnBase} onClick={() => go(page + 1)} disabled={page === totalPages} aria-label="Próxima página">
          ›
        </button>
        {showEdges && (
          <button type="button" className={btnBase} onClick={() => go(totalPages)} disabled={page === totalPages} aria-label="Última página">
            »
          </button>
        )}
      </div>
    </div>
  );
}

