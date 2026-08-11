import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  MapPin,
  Phone,
  Search,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  companyLeadsApi,
  type CompanyLead,
  type CompanyLeadDetails,
  type CompanyLeadStage,
} from "@/lib/company-leads-api";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/comercial/contatos")({ component: CommercialContactsPage });

const PAGE_SIZE = 25;
const leadColumns =
  "id,cnpj,legal_name,trade_name,opened_at,registration_status,cnae_code,cnae_description,company_size,legal_nature,city,state,address,neighborhood,postal_code,relevance_score,stage,source,source_url,discovered_at,raw_payload";
const stages: Array<{ value: CompanyLeadStage; label: string }> = [
  { value: "prospeccao", label: "Prospecção" },
  { value: "relacionamento", label: "Relacionamento" },
  { value: "proposta", label: "Proposta" },
  { value: "negociacao", label: "Negociação" },
  { value: "demonstracao", label: "Demonstração" },
  { value: "negocio_fechado", label: "Negócio fechado" },
  { value: "sem_interesse", label: "Sem interesse" },
];

function CommercialContactsPage() {
  const [rows, setRows] = useState<CompanyLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selected, setSelected] = useState<CompanyLeadDetails | null>(null);

  useEffect(() => {
    let active = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      let query = supabase
        .from("company_leads")
        .select(leadColumns)
        .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
      query = stage
        ? query.eq("stage", stage)
        : query.in(
            "stage",
            stages.map((item) => item.value),
          );
      const term = search.trim().replace(/[,%()]/g, " ");
      if (term)
        query = query.or(
          `legal_name.ilike.%${term}%,trade_name.ilike.%${term}%,cnpj.ilike.%${term}%,city.ilike.%${term}%`,
        );
      const { data, error } = await query;
      if (!active) return;
      if (error) {
        toast.error("Não foi possível carregar os contatos comerciais.");
        setRows([]);
        setHasNextPage(false);
      } else {
        const mapped = (data || []).map((row) => mapLeadRow(row));
        setHasNextPage(mapped.length > PAGE_SIZE);
        setRows(mapped.slice(0, PAGE_SIZE));
      }
      setLoading(false);
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [page, search, stage]);

  useEffect(() => setPage(0), [search, stage]);

  async function openDetails(lead: CompanyLead) {
    try {
      setSelected(await companyLeadsApi.details(lead.id));
    } catch {
      toast.error("Não foi possível abrir os detalhes da empresa.");
    }
  }

  async function changeStage(lead: CompanyLead, next: CompanyLeadStage) {
    try {
      await companyLeadsApi.updateStage(lead.id, next);
      setRows((current) =>
        current.map((row) => (row.id === lead.id ? { ...row, stage: next } : row)),
      );
      toast.success("Etapa comercial atualizada.");
    } catch {
      toast.error("Não foi possível atualizar a etapa.");
    }
  }

  return (
    <AppShell fullWidth>
      <PageHeader
        title="Contatos comerciais"
        description="Prospecção, relacionamento e acompanhamento das oportunidades comerciais."
        breadcrumbs={[{ label: "Comercial" }, { label: "Contatos" }]}
      />

      <section className="mb-5 grid gap-3 md:grid-cols-[minmax(280px,1fr)_260px]">
        <label className="relative block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Empresa, CNPJ, cidade, telefone ou e-mail"
            className="h-11 pl-10"
          />
        </label>
        <select
          value={stage}
          onChange={(event) => setStage(event.target.value)}
          className="h-11 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Todas as etapas</option>
          {stages.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </section>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="border-b bg-muted/35 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Empresa</th>
                <th className="px-5 py-3 font-medium">Contato</th>
                <th className="px-5 py-3 font-medium">Cidade / UF</th>
                <th className="px-5 py-3 font-medium">Atividade</th>
                <th className="px-5 py-3 font-medium">Etapa</th>
                <th className="w-16 px-5 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="h-52 text-center text-muted-foreground">
                    Carregando contatos...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-52 text-center text-muted-foreground">
                    Nenhum contato comercial encontrado.
                  </td>
                </tr>
              ) : (
                rows.map((lead) => (
                  <tr key={lead.id} className="transition-colors hover:bg-muted/25">
                    <td className="max-w-[340px] px-5 py-4">
                      <button
                        type="button"
                        onClick={() => openDetails(lead)}
                        className="text-left hover:text-primary"
                      >
                        <span className="block font-medium">
                          {lead.trade_name || lead.legal_name}
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {lead.legal_name} · {lead.cnpj}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      {lead.phone && (
                        <span className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5" />
                          {lead.phone}
                        </span>
                      )}
                      {lead.email && (
                        <span className="mt-1 flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5" />
                          {lead.email}
                        </span>
                      )}
                      {!lead.phone && !lead.email && "Não informado"}
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {lead.city} - {lead.state}
                      </span>
                    </td>
                    <td className="max-w-[260px] px-5 py-4">
                      <span className="block truncate">
                        {lead.cnae_description || "Não informada"}
                      </span>
                      <span className="text-xs text-muted-foreground">{lead.cnae_code}</span>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={lead.stage}
                        onChange={(event) =>
                          changeStage(lead, event.target.value as CompanyLeadStage)
                        }
                        className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                      >
                        {stages.map((item) => (
                          <option key={item.value} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDetails(lead)}
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t px-5 py-3 text-sm text-muted-foreground">
          <span>
            {rows.length
              ? `Mostrando ${page * PAGE_SIZE + 1} a ${page * PAGE_SIZE + rows.length}`
              : "Nenhum contato"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 0}
              onClick={() => setPage((value) => value - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>Página {page + 1}</span>
            <Button
              variant="outline"
              size="icon"
              disabled={!hasNextPage}
              onClick={() => setPage((value) => value + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="app-scrollbar max-h-[88vh] max-w-4xl overflow-y-auto">
          {selected && (
            <>
              <DialogHeader className="border-b pb-4">
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <span className="grid h-10 w-10 place-items-center rounded-md bg-primary/10 text-primary">
                    <Building2 className="h-5 w-5" />
                  </span>
                  {selected.trade_name || selected.legal_name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  {selected.legal_name} · {selected.cnpj}
                </p>
              </DialogHeader>
              <div className="grid gap-6 py-2 md:grid-cols-2">
                <DetailSection
                  title="Empresa"
                  icon={Building2}
                  items={[
                    ["Situação cadastral", selected.registration_status],
                    [
                      "Data de abertura",
                      selected.opened_at
                        ? new Date(`${selected.opened_at}T12:00:00`).toLocaleDateString("pt-BR")
                        : null,
                    ],
                    ["Porte", selected.company_size],
                    ["Natureza jurídica", selected.legal_nature],
                    [
                      "Capital social",
                      selected.capital_social != null
                        ? selected.capital_social.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : null,
                    ],
                    [
                      "Etapa comercial",
                      stages.find((item) => item.value === selected.stage)?.label,
                    ],
                  ]}
                />
                <DetailSection
                  title="Localização"
                  icon={MapPin}
                  items={[
                    ["Endereço", selected.address],
                    ["Bairro", selected.neighborhood],
                    ["Cidade / UF", `${selected.city} - ${selected.state}`],
                    ["CEP", selected.postal_code],
                  ]}
                />
                <DetailSection
                  title="Atividade e contatos"
                  icon={Phone}
                  items={[
                    [
                      "CNAE principal",
                      [selected.cnae_code, selected.cnae_description].filter(Boolean).join(" · "),
                    ],
                    ["Telefone", selected.phone],
                    ["Telefone adicional", selected.phone_secondary],
                    ["E-mail", selected.email],
                    ["Site", selected.website],
                  ]}
                />
                <DetailSection
                  title={`Quadro societário (${selected.partners.length})`}
                  icon={UsersRound}
                  items={
                    selected.partners.length
                      ? selected.partners
                          .slice(0, 8)
                          .map((partner) => [partner.qualification || partner.type, partner.name])
                      : [["Sócios", "Nenhum sócio informado na base importada"]]
                  }
                />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function mapLeadRow(row: Record<string, unknown>): CompanyLead {
  const payload = (row.raw_payload || {}) as Record<string, unknown>;
  return {
    ...(row as unknown as CompanyLead),
    phone: typeof payload.phone === "string" ? payload.phone : null,
    email: typeof payload.email === "string" ? payload.email : null,
    mei: payload.mei === true,
    simples: payload.simple === true,
    tax_regime: typeof payload.tax_regime === "string" ? payload.tax_regime : null,
  };
}

function DetailSection({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: typeof Building2;
  items: Array<[string, string | null | undefined]>;
}) {
  return (
    <section className="rounded-lg border p-4">
      <h3 className="mb-4 flex items-center gap-2 font-semibold">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      <dl className="grid gap-3 sm:grid-cols-2">
        {items.map(([label, value], index) => (
          <div key={`${label}-${index}`} className="min-w-0">
            <dt className="text-xs uppercase text-muted-foreground">{label}</dt>
            <dd className="mt-1 break-words text-sm">{value || "Não informado"}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
