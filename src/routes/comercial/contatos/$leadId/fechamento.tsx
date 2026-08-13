import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { 
  Briefcase, 
  ArrowLeft, 
  CheckCircle, 
  Building2, 
  MapPin, 
  User, 
  Settings, 
  FileText,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/portal/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { companyLeadsApi, type CompanyLeadDetails } from "@/lib/company-leads-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/comercial/contatos/$leadId/fechamento")({
  component: CloseDealPage,
});

const closeDealCompanyFields = [
  ["Nome (apelido)", "nickname"],
  ["Sigla", "acronym"],
  ["E-mail do responsável (Admin.)", "admin_email"],
  ["Nome (Admin.)", "admin_name"],
  ["Sigla do grupo", "group_acronym"],
  ["Unidade de atendimento", "service_unit"],
  ["CNPJ", "cnpj"],
  ["Razão social", "legal_name"],
  ["Nome fantasia", "trade_name"],
  ["Inscrição estadual", "state_registration"],
  ["Inscrição municipal", "city_registration"],
  ["CNAE", "cnae"],
  ["ANTT (transportadora)", "antt"],
  ["Regime de apuração", "tax_regime"],
  ["Ramo", "branch"],
  ["Porte", "company_size"],
  ["Site", "website"],
] as const;

const closeDealContactFields = [
  ["CEP", "postal_code"],
  ["Endereço", "address"],
  ["Número", "address_number"],
  ["Complemento", "address_complement"],
  ["Bairro", "neighborhood"],
  ["Cidade", "city"],
  ["UF", "state"],
  ["Telefone", "phone"],
  ["Contato do telefone", "phone_contact"],
  ["E-mail", "email"],
  ["Contato do e-mail", "email_contact"],
] as const;

const closeDealResponsibleFields = [
  ["Responsável", "responsible_name"],
  ["CPF", "responsible_cpf"],
  ["RG", "responsible_rg"],
  ["CEP do responsável", "responsible_postal_code"],
  ["Endereço do responsável", "responsible_address"],
  ["Número", "responsible_number"],
  ["Complemento", "responsible_complement"],
  ["Bairro", "responsible_neighborhood"],
  ["Cidade", "responsible_city"],
  ["UF", "responsible_state"],
  ["Escritório", "accounting_office"],
  ["Contador", "accountant_name"],
  ["Telefone do contador", "accountant_phone"],
  ["E-mail do contador", "accountant_email"],
] as const;

const closeDealHadronFields = [
  ["Responsável PRC 1", "hadron_responsible_1"],
  ["Responsável PRC 2", "hadron_responsible_2"],
  ["Tempo de instalação", "installation_time"],
  ["Terminais", "terminals"],
  ["Configuração de rede", "network"],
  ["Módulos contratados", "modules"],
  ["Documentos fiscais", "fiscal_documents"],
  ["Homologação de NF-e", "nfe_validation"],
  ["Importação de dados", "data_import"],
  ["Boleto bancário", "bank_slip"],
  ["Bancos para cobrança", "banks"],
  ["Aplicativos web", "web_apps"],
] as const;

function closeDealFallback(lead: CompanyLeadDetails, key: string) {
  const values: Record<string, string> = {
    cnpj: lead.cnpj,
    legal_name: lead.legal_name,
    trade_name: lead.trade_name || "",
    cnae: lead.cnae_code || "",
    company_size: lead.company_size || "",
    website: lead.website || "",
    postal_code: lead.postal_code || "",
    address: lead.address || "",
    neighborhood: lead.neighborhood || "",
    city: lead.city,
    state: lead.state,
    phone: lead.phone || "",
    email: lead.email || "",
  };
  return values[key] || "";
}

export function CloseDealPage() {
  const { leadId } = useParams({ strict: false });
  const navigate = useNavigate();
  const [lead, setLead] = useState<CompanyLeadDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [conversionForm, setConversionForm] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadLead() {
      try {
        setLoading(true);
        const data = await companyLeadsApi.details(leadId);
        setLead(data);
        
        // Initialize form with existing data or fallbacks
        const initialForm = { ...(data.conversion_data as Record<string, string> || {}) };
        
        // Apply fallbacks for specific fields if not already present
        const allFields = [
          ...closeDealCompanyFields, 
          ...closeDealContactFields, 
          ...closeDealResponsibleFields, 
          ...closeDealHadronFields
        ];
        
        allFields.forEach(([_, key]) => {
          if (!initialForm[key]) {
            initialForm[key] = closeDealFallback(data, key);
          }
        });
        
        setConversionForm(initialForm);
      } catch (err) {
        console.error(err);
        toast.error("Não foi possível carregar os detalhes do lead.");
      } finally {
        setLoading(false);
      }
    }
    loadLead();
  }, [leadId]);

  const handleFinishDeal = async () => {
    setSaving(true);
    try {
      await companyLeadsApi.saveAction(leadId, "close_deal", conversionForm, true);
      toast.success("Negócio fechado com sucesso!");
      navigate({ to: "/comercial/contatos/$leadId", params: { leadId } });
    } catch (err) {
      toast.error("Erro ao finalizar o negócio.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await companyLeadsApi.saveAction(leadId, "close_deal", conversionForm, false);
      toast.success("Rascunho salvo com sucesso.");
    } catch (err) {
      toast.error("Erro ao salvar rascunho.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AppShell fullWidth>
        <div className="p-8 space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <div className="space-y-8">
            <Skeleton className="h-[200px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!lead) return null;

  return (
    <AppShell fullWidth>
      <div className="min-h-screen bg-background pb-20">
        <DetailModalHeader
          icon={CheckCircle}
          title={`Fechamento de Negócio: ${lead.trade_name || lead.legal_name}`}
          protocol={lead.cnpj}
          meta={
            <>
              <span className="flex items-center gap-1">
                <Building2 className="h-3 w-3" />
                {lead.legal_name}
              </span>
              <span className="mx-1">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {lead.city} - {lead.state}
              </span>
            </>
          }
          trailing={
            <Button
              size="sm"
              asChild
              variant="ghost"
              className="h-8 text-xs gap-1.5 border border-input hover:bg-accent"
            >
              <Link to="/comercial/contatos/$leadId" params={{ leadId }}>
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar ao contato
              </Link>
            </Button>
          }
        />

        <main className="max-w-7xl mx-auto p-6 space-y-12">
          {/* Seção: Cliente e Empresa */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-muted-foreground border-b pb-2">
              <Building2 className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Cliente e Empresa</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closeDealCompanyFields.map(([label, key]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key} className="text-xs text-muted-foreground font-medium uppercase">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    value={conversionForm[key] || ""}
                    onChange={(e) => setConversionForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-9"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Endereço e Contatos */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-muted-foreground border-b pb-2">
              <MapPin className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Endereço e Contatos</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closeDealContactFields.map(([label, key]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key} className="text-xs text-muted-foreground font-medium uppercase">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    value={conversionForm[key] || ""}
                    onChange={(e) => setConversionForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-9"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Responsável e Contabilidade */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-muted-foreground border-b pb-2">
              <User className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Responsável e Contabilidade</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closeDealResponsibleFields.map(([label, key]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key} className="text-xs text-muted-foreground font-medium uppercase">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    value={conversionForm[key] || ""}
                    onChange={(e) => setConversionForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-9"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Implantação do Hádron */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-muted-foreground border-b pb-2">
              <Settings className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Implantação do Hádron</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {closeDealHadronFields.map(([label, key]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={key} className="text-xs text-muted-foreground font-medium uppercase">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    value={conversionForm[key] || ""}
                    onChange={(e) => setConversionForm(prev => ({ ...prev, [key]: e.target.value }))}
                    className="h-9"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Seção: Observações */}
          <section>
            <div className="flex items-center gap-2 mb-6 text-muted-foreground border-b pb-2">
              <FileText className="h-4 w-4" />
              <h2 className="text-sm font-semibold uppercase tracking-wider">Observações</h2>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-xs text-muted-foreground font-medium uppercase">
                Notas Adicionais
              </Label>
              <Textarea
                id="notes"
                value={conversionForm.notes || ""}
                onChange={(e) => setConversionForm(prev => ({ ...prev, notes: e.target.value }))}
                className="min-h-[120px] resize-none"
                placeholder="Insira aqui observações importantes sobre o fechamento..."
              />
            </div>
          </section>

          {/* Ações Fixas no Rodapé */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-lg flex justify-center gap-4 z-50">
            <Button
              variant="outline"
              size="lg"
              className="min-w-[140px]"
              asChild
            >
              <Link to="/comercial/contatos/$leadId" params={{ leadId }}>
                Voltar
              </Link>
            </Button>
            
            <Button
              variant="secondary"
              size="lg"
              className="min-w-[140px]"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Salvar Rascunho
            </Button>

            <Button
              size="lg"
              className="min-w-[180px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
              onClick={handleFinishDeal}
              disabled={saving}
            >
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              Concluir Negócio
            </Button>
          </div>
        </main>
      </div>
    </AppShell>
  );
}
