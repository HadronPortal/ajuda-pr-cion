import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, CalendarClock, MapPin, Phone, UsersRound } from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { Button } from "@/components/ui/button";
import { companyLeadsApi, type CompanyLeadDetails } from "@/lib/company-leads-api";

export const Route = createFileRoute("/comercial/contato/$leadId")({ component: LeadDetailsPage });

const stageLabels: Record<string, string> = {
  novo: "Novo", prospeccao: "Prospecção", relacionamento: "Relacionamento",
  proposta: "Proposta", negociacao: "Negociação", demonstracao: "Demonstração",
  negocio_fechado: "Negócio fechado", sem_interesse: "Sem interesse",
};

function LeadDetailsPage() {
  const { leadId } = Route.useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<CompanyLeadDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    companyLeadsApi.details(leadId).then((data) => active && setLead(data)).catch(() => active && setError("Não foi possível carregar os detalhes da empresa."));
    return () => { active = false; };
  }, [leadId]);

  if (!lead) return <AppShell fullWidth><div className="py-24 text-center text-muted-foreground">{error || "Carregando detalhes..."}</div></AppShell>;

  return (
    <AppShell fullWidth>
      <header className="mb-5 border-b pb-5">
        <Button variant="outline" size="sm" className="mb-4" onClick={() => void navigate({ to: "/comercial/contatos" })}><ArrowLeft className="mr-2 h-4 w-4" />Voltar para contatos</Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h1 className="text-2xl font-semibold">{lead.trade_name || lead.legal_name}</h1><p className="mt-1 text-sm text-muted-foreground">{lead.legal_name} · {lead.cnpj}</p></div>
          <div><span className="text-xs uppercase text-muted-foreground">Etapa comercial</span><p className="mt-1 text-sm">{stageLabels[lead.stage] || lead.stage}</p></div>
        </div>
      </header>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-5">
          <Section title="Empresa" icon={Building2}><Info items={[["Razão social",lead.legal_name],["Nome fantasia",lead.trade_name],["Situação cadastral",lead.registration_status],["Porte",lead.company_size],["Natureza jurídica",lead.legal_nature],["CNAE principal",[lead.cnae_code,lead.cnae_description].filter(Boolean).join(" · ")],["Data de abertura",formatDate(lead.opened_at)],["Capital social",formatMoney(lead.capital_social)]]}/></Section>
          <Section title="Localização e contato" icon={MapPin}><Info items={[["Endereço",lead.address],["Bairro",lead.neighborhood],["Cidade / UF",`${lead.city} - ${lead.state}`],["CEP",lead.postal_code],["Telefone",lead.phone],["Telefone adicional",lead.phone_secondary],["E-mail",lead.email],["Site",lead.website]]}/></Section>
          <Section title="Atividades" icon={CalendarClock}><div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">Nenhuma atividade comercial registrada para esta empresa.</div></Section>
        </main>
        <aside className="space-y-5">
          <Section title={`Quadro societário (${lead.partners.length})`} icon={UsersRound}>{lead.partners.length ? lead.partners.map((p)=><div key={p.id} className="border-b py-3 last:border-0"><p className="text-sm">{p.name}</p><p className="text-xs text-muted-foreground">{p.qualification || p.type}</p></div>) : <p className="text-sm text-muted-foreground">Nenhum sócio informado.</p>}</Section>
          <Section title="Resumo comercial" icon={Phone}><Info single items={[["Etapa",stageLabels[lead.stage] || lead.stage],["Descoberto em",formatDate(lead.discovered_at)],["Telefone",lead.phone],["E-mail",lead.email]]}/></Section>
        </aside>
      </div>
    </AppShell>
  );
}

function Section({title,icon:Icon,children}:{title:string;icon:typeof Building2;children:ReactNode}) { return <section className="rounded-lg border bg-card p-5"><h2 className="mb-5 flex items-center gap-2 font-semibold"><Icon className="h-5 w-5 text-primary" />{title}</h2>{children}</section>; }
function Info({items,single=false}:{items:Array<[string,string|null|undefined]>;single?:boolean}) { return <dl className={single?"grid gap-4":"grid gap-4 sm:grid-cols-2"}>{items.map(([k,v])=><div key={k}><dt className="text-xs uppercase text-muted-foreground">{k}</dt><dd className="mt-1 break-words text-sm">{v || "Não informado"}</dd></div>)}</dl>; }
function formatDate(v:string|null|undefined){if(!v)return null;const d=new Date(v.length===10?`${v}T12:00:00`:v);return Number.isNaN(d.getTime())?v:d.toLocaleDateString("pt-BR");}
function formatMoney(v:number|null|undefined){return v==null?null:v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
