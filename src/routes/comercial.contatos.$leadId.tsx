import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/portal/AppShell";
import { companyLeadsApi, type CompanyLeadDetails } from "@/lib/company-leads-api";
import { getLeadActivities, type CompanyLeadActivity } from "@/lib/company-lead-activities.functions.ts";
import { LeadDetailView } from "@/components/commercial/LeadDetailView";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/comercial/contatos/$leadId")({
  component: CommercialLeadDetailsPage,
});

function CommercialLeadDetailsPage() {
  const { leadId } = Route.useParams();
  const [lead, setLead] = useState<CompanyLeadDetails | null>(null);
  const [activities, setActivities] = useState<CompanyLeadActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [details, activityList] = await Promise.all([
          companyLeadsApi.details(leadId),
          getLeadActivities({ data: { leadId } }),
        ]);
        setLead(details);
        setActivities(activityList);
      } catch (err) {
        console.error(err);
        toast.error("Não foi possível carregar os detalhes do contato.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [leadId]);

  if (loading) {
    return (
      <AppShell>
        <div className="flex h-[70vh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Carregando detalhes do lead...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!lead) {
    return (
      <AppShell>
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
          <div className="rounded-full bg-muted p-4">
            <Loader2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Contato não encontrado</h1>
            <p className="text-muted-foreground">O lead solicitado não existe ou você não tem permissão para acessá-lo.</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell fullWidth>
      <LeadDetailView lead={lead} activities={activities} />
    </AppShell>
  );
}
