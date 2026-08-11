import { Building2, Copy, Globe, Mail, MapPin, Phone, UsersRound, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { normalizeCityUf } from "@/lib/br-city";
import type { CompanyLeadDetails } from "@/lib/company-leads-api";
import type { CompanyLeadActivity } from "@/lib/company-lead-activities.functions.ts";
import { LeadTimeline } from "./LeadTimeline";

export function LeadDetailView({
  lead,
  activities,
}: {
  lead: CompanyLeadDetails;
  activities: CompanyLeadActivity[];
}) {
  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  const stages: Record<string, string> = {
    prospeccao: "Prospecção",
    relacionamento: "Relacionamento",
    proposta: "Proposta",
    negociacao: "Negociação",
    demonstracao: "Demonstração",
    negocio_fechado: "Negócio fechado",
    sem_interesse: "Sem interesse",
  };

  return (
    <div className="flex flex-col gap-6">
      <DetailModalHeader
        icon={Building2}
        title={lead.trade_name || lead.legal_name}
        protocol={lead.cnpj}
        meta={
          <div className="flex flex-wrap items-center gap-3">
            <span>{lead.legal_name}</span>
            <span>•</span>
            <span>{lead.registration_status}</span>
            {lead.opened_at && (
              <>
                <span>•</span>
                <span>Desde {new Date(lead.opened_at).toLocaleDateString("pt-BR")}</span>
              </>
            )}
          </div>
        }
        chips={
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
            {stages[lead.stage] || lead.stage}
          </Badge>
        }
        onClose={() => window.close()}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Seção de Contato e Localização */}
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2.5 text-[15px] font-bold text-foreground">
              <MapPin className="h-5 w-5 text-primary" />
              Contato e Localização
            </h3>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="space-y-4">
                <InfoField
                  label="Endereço completo"
                  value={lead.address}
                  icon={MapPin}
                />
                <InfoField
                  label="Bairro"
                  value={lead.neighborhood}
                />
                <InfoField
                  label="Cidade / UF"
                  value={normalizeCityUf(`${lead.city} - ${lead.state}`)}
                />
                <InfoField
                  label="CEP"
                  value={lead.postal_code}
                />
              </div>
              <div className="space-y-4">
                <ClickableInfoField
                  label="Telefone principal"
                  value={lead.phone}
                  icon={Phone}
                  onCopy={() => copyToClipboard(lead.phone!, "Telefone")}
                />
                <ClickableInfoField
                  label="Telefone adicional"
                  value={lead.phone_secondary}
                  icon={Phone}
                  onCopy={() => copyToClipboard(lead.phone_secondary!, "Telefone adicional")}
                />
                <ClickableInfoField
                  label="E-mail"
                  value={lead.email}
                  icon={Mail}
                  onCopy={() => copyToClipboard(lead.email!, "E-mail")}
                />
                <ClickableInfoField
                  label="Site"
                  value={lead.website}
                  icon={Globe}
                  onCopy={() => copyToClipboard(lead.website!, "Site")}
                />
              </div>
            </div>
          </section>

          {/* Seção de Atividade da Empresa */}
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2.5 text-[15px] font-bold text-foreground">
              <Briefcase className="h-5 w-5 text-primary" />
              Atividade da empresa
            </h3>
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  CNAE Principal
                </span>
                <div className="mt-1.5 rounded-lg bg-muted/30 p-3 text-[13px]">
                  <span className="font-mono font-bold text-primary">{lead.cnae_code}</span>
                  <span className="mx-2 text-muted-foreground">•</span>
                  <span className="text-foreground">{lead.cnae_description}</span>
                </div>
              </div>
              {lead.secondary_cnaes && lead.secondary_cnaes.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    CNAEs Secundários
                  </span>
                  <div className="mt-1.5 grid gap-2">
                    {lead.secondary_cnaes.map((cnae, idx) => (
                      <div key={idx} className="rounded-lg border bg-card p-2.5 text-[12px] text-muted-foreground">
                        {cnae}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Seção de Atividades */}
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2.5 text-[15px] font-bold text-foreground">
              <Activity className="h-5 w-5 text-primary" />
              Atividades
            </h3>
            <LeadTimeline activities={activities} />
          </section>
        </div>

        <div className="space-y-6">
          {/* Informações Complementares */}
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2.5 text-[15px] font-bold text-foreground">
              <Building2 className="h-5 w-5 text-primary" />
              Informações Gerais
            </h3>
            <div className="space-y-4">
              <InfoField label="Porte" value={lead.company_size} />
              <InfoField label="Natureza Jurídica" value={lead.legal_nature} />
              <InfoField
                label="Capital Social"
                value={lead.capital_social?.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              />
              <InfoField label="MEI" value={lead.mei ? "Sim" : "Não"} />
              <InfoField label="Simples Nacional" value={lead.simples ? "Sim" : "Não"} />
            </div>
          </section>

          {/* Quadro Societário */}
          <section className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2.5 text-[15px] font-bold text-foreground">
              <UsersRound className="h-5 w-5 text-primary" />
              Quadro Societário ({lead.partners.length})
            </h3>
            <div className="space-y-3">
              {lead.partners.length > 0 ? (
                lead.partners.map((partner) => (
                  <div key={partner.id} className="group relative overflow-hidden rounded-lg border p-3 transition-colors hover:bg-muted/50">
                    <span className="block text-[13px] font-medium text-foreground">
                      {partner.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-muted-foreground">
                      {partner.qualification || partner.type}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-[12px] text-muted-foreground italic">
                  Nenhum sócio informado
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoField({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: string | number | null;
  icon?: any;
}) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </dt>
      <dd className="mt-1 break-words text-[13px] font-medium text-foreground">
        {value || "Não informado"}
      </dd>
    </div>
  );
}

function ClickableInfoField({
  label,
  value,
  icon: Icon,
  onCopy,
}: {
  label: string;
  value?: string | null;
  icon?: any;
  onCopy: () => void;
}) {
  if (!value) return <InfoField label={label} value="Não informado" icon={Icon} />;

  return (
    <div className="group min-w-0">
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </dt>
      <dd className="mt-1 flex items-center gap-2">
        <span className="truncate text-[13px] font-medium text-foreground">{value}</span>
        <button
          onClick={onCopy}
          className="rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
          title="Copiar"
        >
          <Copy className="h-3 w-3" />
        </button>
      </dd>
    </div>
  );
}
