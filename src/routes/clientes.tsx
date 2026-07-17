import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  Database,
  Filter,
  RefreshCw,
  HardDrive,
  Monitor,
  Phone,
  Server,
  SlidersHorizontal,
  UsersRound,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/clientes")({
  head: () => ({ meta: [{ title: "Clientes - Portal Procion" }] }),
  component: ClientsPage,
});

type ClientRow = {
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

const clientRows: ClientRow[] = [
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

const sizes = Array.from(new Set(clientRows.map((c) => c.size)));
const segments = Array.from(new Set(clientRows.map((c) => c.segment)));
const ufs = Array.from(new Set(clientRows.map((c) => c.uf))).sort();

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

function ClientsPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<Filters>(() => lastFilters);
  const [draft, setDraft] = useState<Filters>(() => lastFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    lastFilters = filters;
  }, [filters]);

  useEffect(() => {
    if (filtersOpen) setDraft(filters);
  }, [filtersOpen, filters]);

  const filtered = useMemo(() => {
    return clientRows.filter((c) => {
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
  }, [filters]);

  const activeCount = countActive(filters);

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
                  <th key={label} className="whitespace-nowrap px-4 py-3 text-left font-medium">
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((client) => (
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
                  <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                    {client.registered}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="font-medium text-primary">{client.acronym}</div>
                    <div className="text-xs text-muted-foreground">
                      {client.group || "Sem grupo"}
                    </div>
                  </td>
                  <td className="min-w-[280px] px-4 py-4">
                    <div className="text-[12px] font-normal leading-[1.2] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                      {client.razaoSocial}
                    </div>
                    <div className="text-[11px] font-normal text-muted-foreground">
                      {client.segment} · {client.size}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div>
                      Versão: {client.version} ({client.versionDate})
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>{client.versionUpdatedAt}</span>
                      <RefreshCw className="h-3 w-3" />
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">{client.city}</td>
                  <td className="whitespace-nowrap px-4 py-4 text-muted-foreground">
                    {client.cnpj}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4">
                    <div className="flex flex-col items-start gap-1">
                      <Badge
                        className={cn(
                          client.status === "Ativo"
                            ? "bg-emerald-500/12 text-emerald-600 dark:text-emerald-400"
                            : "bg-slate-500/15 text-slate-600 dark:text-slate-300",
                        )}
                      >
                        {client.status}
                      </Badge>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <RefreshCw className="h-3 w-3" />
                        <span>{client.updatedAt}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">
                    Nenhum cliente encontrado com os filtros atuais.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <FiltersPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        draft={draft}
        setDraft={setDraft}
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
  onApply,
  onClear,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  draft: Filters;
  setDraft: React.Dispatch<React.SetStateAction<Filters>>;
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

function ClientDetail({
  client,
  onOpenChange,
}: {
  client: ClientRow | null;
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
                      {client.razaoSocial} {client.group && `(${client.group})`}
                    </h2>
                    <p className="text-sm text-muted-foreground">{client.fantasia}</p>
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
