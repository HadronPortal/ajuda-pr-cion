import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CalendarDays,
  ExternalLink,
  LoaderCircle,
  MapPin,
  Search,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  companyLeadsApi,
  type CompanyLead,
  type CompanyLeadFilters,
  type CompanyLeadStage,
} from "@/lib/company-leads-api";
import { cn } from "@/lib/utils";

const initialFilters: CompanyLeadFilters = {
  city: "",
  state: "SP",
  openedWithinDays: 90,
  cnae: "",
  companySize: "",
  limit: 50,
};

const stageLabels: Record<CompanyLeadStage, string> = {
  novo: "Novo",
  em_analise: "Em análise",
  qualificado: "Qualificado",
  descartado: "Descartado",
  convertido: "Convertido",
};

const scoreTone = (score: number) =>
  score >= 10
    ? "bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
    : score >= 7
      ? "bg-amber-500/12 text-amber-700 dark:text-amber-300"
      : "bg-muted text-muted-foreground";

const formatCnpj = (value: string) =>
  value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

const formatDate = (value: string | null) => {
  if (!value) return "Não informada";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
};

export function CompanyLeadsTab() {
  const [filters, setFilters] = useState(initialFilters);
  const [leads, setLeads] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const providerConfigured = true;

  const loadCached = async () => {
    setLoading(true);
    try {
      const result = await companyLeadsApi.list(filters);
      setLeads(result.leads);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível carregar os leads.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCached();
    // A carga inicial deve acontecer apenas ao abrir a aba.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchLeads = async () => {
    if (!providerConfigured) {
      toast.info("O coletor externo de CNPJ ainda não está configurado no servidor.");
      return;
    }
    if (!filters.city.trim() || filters.state.trim().length !== 2) {
      toast.error("Informe a cidade e uma UF válida.");
      return;
    }
    setSearching(true);
    try {
      const result = await companyLeadsApi.list(filters);
      setLeads(result.leads);
      toast.success(`${result.leads.length} lead(s) encontrado(s).`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao procurar empresas.");
    } finally {
      setSearching(false);
    }
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
            className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
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
        <Button
          onClick={searchLeads}
          disabled={searching || !providerConfigured}
          title={
            providerConfigured
              ? "Procurar empresas"
              : "Configure o coletor externo no servidor para pesquisar"
          }
          className="h-9 gap-2"
        >
          {searching ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Search className="h-4 w-4" />
          )}
          {providerConfigured ? "Procurar empresas" : "Coletor não configurado"}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-y border-border py-3 text-sm">
        <span className="inline-flex items-center gap-2">
          <Building2 className="h-4 w-4 text-primary" />
          <strong>{leads.length}</strong> leads encontrados
        </span>
        <span className="inline-flex items-center gap-2">
          <Target className="h-4 w-4 text-emerald-600" />
          <strong>{qualified}</strong> qualificados
        </span>
        {!providerConfigured && (
          <span className="text-xs text-amber-700 dark:text-amber-300">
            Coleta externa aguardando configuração no servidor.
          </span>
        )}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="bg-muted/35 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Empresa</th>
                <th className="px-4 py-3 font-medium">Abertura</th>
                <th className="px-4 py-3 font-medium">Localização</th>
                <th className="px-4 py-3 font-medium">CNAE / porte</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Etapa</th>
                <th className="w-12 px-4 py-3">
                  <span className="sr-only">Fonte</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-primary/[0.03]">
                  <td className="px-4 py-3">
                    <div className="font-medium">{lead.trade_name || lead.legal_name}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {lead.legal_name} · {formatCnpj(lead.cnpj)}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <div className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatDate(lead.opened_at)}
                    </div>
                    <div className="mt-1 text-xs text-emerald-600">{lead.registration_status}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      {lead.city} - {lead.state}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{lead.cnae_description || lead.cnae_code || "Não informado"}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {lead.cnae_code || "Sem CNAE"} · {lead.company_size || "Porte não informado"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge className={cn("font-semibold", scoreTone(lead.relevance_score))}>
                      {lead.relevance_score}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={lead.stage}
                      onChange={(event) =>
                        void updateStage(lead, event.target.value as CompanyLeadStage)
                      }
                      className="h-8 rounded-md border border-input bg-background px-2 text-xs"
                    >
                      {Object.entries(stageLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
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
                  <td colSpan={7} className="px-6 py-14 text-center text-muted-foreground">
                    Informe cidade e UF para procurar novas empresas.
                  </td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-muted-foreground">
                    <LoaderCircle className="mx-auto mb-2 h-5 w-5 animate-spin" />
                    Carregando leads…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
