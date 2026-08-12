import { useEffect, useState, type ReactNode } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Ban,
  Building2,
  CalendarClock,
  CheckCircle2,
  MapPin,
  Pencil,
  Phone,
  UsersRound,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/portal/AppShell";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  companyLeadsApi,
  type CompanyLeadDetails,
  type CompanyLeadStage,
} from "@/lib/company-leads-api";

export const Route = createFileRoute("/comercial/contato/$leadId")({ component: LeadDetailsPage });

const stageLabels: Record<CompanyLeadStage, string> = {
  novo: "Novo",
  prospeccao: "Prospecção",
  relacionamento: "Relacionamento",
  proposta: "Proposta",
  negociacao: "Negociação",
  demonstracao: "Demonstração",
  negocio_fechado: "Negócio fechado",
  sem_interesse: "Sem interesse",
};

function LeadDetailsPage() {
  const { leadId } = Route.useParams();
  const navigate = useNavigate();
  const [lead, setLead] = useState<CompanyLeadDetails | null>(null);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState<"inactive" | "closed" | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stage, setStage] = useState<CompanyLeadStage>("novo");
  const [assignedTo, setAssignedTo] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let active = true;
    companyLeadsApi
      .details(leadId)
      .then((data) => active && setLead(data))
      .catch(() => active && setError("Não foi possível carregar os detalhes da empresa."));
    return () => {
      active = false;
    };
  }, [leadId]);

  useEffect(() => {
    if (!lead) return;
    setStage(lead.stage);
    setAssignedTo(lead.assigned_to || "");
    setNotes(lead.notes || "");
  }, [lead]);

  async function changeStage(nextStage: CompanyLeadStage) {
    if (!lead || saving) return;
    try {
      setSaving(true);
      await companyLeadsApi.updateStage(lead.id, nextStage);
      setLead({ ...lead, stage: nextStage });
      toast.success(
        nextStage === "negocio_fechado" ? "Negócio marcado como fechado." : "Contato inativado.",
      );
      setPendingAction(null);
    } catch (actionError) {
      console.error(actionError);
      toast.error("Não foi possível atualizar a etapa comercial.");
    } finally {
      setSaving(false);
    }
  }

  async function saveCommercial() {
    if (!lead || saving) return;
    try {
      setSaving(true);
      const updated = await companyLeadsApi.updateCommercial(lead.id, { stage, assignedTo, notes });
      setLead(updated);
      setEditOpen(false);
      toast.success("Informações comerciais atualizadas.");
    } catch (actionError) {
      console.error(actionError);
      toast.error("Não foi possível salvar as informações comerciais.");
    } finally {
      setSaving(false);
    }
  }

  if (!lead) {
    return (
      <AppShell fullWidth>
        <div className="py-24 text-center text-muted-foreground">
          {error || "Carregando detalhes..."}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell fullWidth>
      <header className="mb-5 border-b pb-5">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => void navigate({ to: "/comercial/contatos" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para contatos
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold">{lead.trade_name || lead.legal_name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {lead.legal_name} · {lead.cnpj}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setPendingAction("inactive")}
              disabled={saving || lead.stage === "sem_interesse"}
            >
              <Ban className="mr-2 h-4 w-4" />
              Inativar
            </Button>
            <Button
              size="sm"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              onClick={() => setPendingAction("closed")}
              disabled={saving || lead.stage === "negocio_fechado"}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Negócio fechado
            </Button>
            <Button
              size="sm"
              className="bg-amber-500 text-white hover:bg-amber-600"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="space-y-5">
          <Section title="Empresa" icon={Building2}>
            <Info
              items={[
                ["Razão social", lead.legal_name],
                ["Nome fantasia", lead.trade_name],
                ["Situação cadastral", lead.registration_status],
                ["Porte", lead.company_size],
                ["Natureza jurídica", lead.legal_nature],
                [
                  "CNAE principal",
                  [lead.cnae_code, lead.cnae_description].filter(Boolean).join(" · "),
                ],
                ["Data de abertura", formatDate(lead.opened_at)],
                ["Capital social", formatMoney(lead.capital_social)],
              ]}
            />
          </Section>
          <Section title="Localização e contato" icon={MapPin}>
            <Info
              items={[
                ["Endereço", lead.address],
                ["Bairro", lead.neighborhood],
                ["Cidade / UF", `${lead.city} - ${lead.state}`],
                ["CEP", lead.postal_code],
                ["Telefone", lead.phone],
                ["Telefone adicional", lead.phone_secondary],
                ["E-mail", lead.email],
                ["Site", lead.website],
              ]}
            />
          </Section>
          <Section title="Atividades" icon={CalendarClock}>
            <div className="rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
              Nenhuma atividade comercial registrada para esta empresa.
            </div>
          </Section>
        </main>
        <aside className="space-y-5">
          <Section title={`Quadro societário (${lead.partners.length})`} icon={UsersRound}>
            {lead.partners.length ? (
              lead.partners.map((partner) => (
                <div key={partner.id} className="border-b py-3 last:border-0">
                  <p className="text-sm">{partner.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {partner.qualification || partner.type}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum sócio informado.</p>
            )}
          </Section>
          <Section title="Resumo comercial" icon={Phone}>
            <Info
              single
              items={[
                ["Etapa", stageLabels[lead.stage]],
                ["Responsável", lead.assigned_to],
                ["Descoberto em", formatDate(lead.discovered_at)],
                ["Telefone", lead.phone],
                ["E-mail", lead.email],
                ["Observações", lead.notes],
              ]}
            />
          </Section>
        </aside>
      </div>

      <AlertDialog
        open={pendingAction !== null}
        onOpenChange={(open) => !open && setPendingAction(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingAction === "closed"
                ? "Marcar negócio como fechado?"
                : "Inativar este contato?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction === "closed"
                ? "A empresa será movida para a etapa Negócio fechado."
                : "A empresa será movida para Sem interesse e deixará a fila comercial ativa."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(event) => {
                event.preventDefault();
                void changeStage(pendingAction === "closed" ? "negocio_fechado" : "sem_interesse");
              }}
            >
              {saving ? "Salvando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar informações comerciais</DialogTitle>
            <DialogDescription>
              Os dados oficiais da empresa permanecem inalterados.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="commercial-stage">Etapa comercial</Label>
              <Select value={stage} onValueChange={(value) => setStage(value as CompanyLeadStage)}>
                <SelectTrigger id="commercial-stage">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(stageLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="commercial-owner">Responsável</Label>
              <Input
                id="commercial-owner"
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value.toUpperCase())}
                placeholder="Ex.: PRCGGC"
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="commercial-notes">Observações</Label>
              <Textarea
                id="commercial-notes"
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Registre o andamento e o próximo passo comercial."
                className="min-h-28"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={() => void saveCommercial()} disabled={saving}>
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Building2;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <h2 className="mb-5 flex items-center gap-2 font-semibold">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function Info({
  items,
  single = false,
}: {
  items: Array<[string, string | null | undefined]>;
  single?: boolean;
}) {
  return (
    <dl className={single ? "grid gap-4" : "grid gap-4 sm:grid-cols-2"}>
      {items.map(([key, value]) => (
        <div key={key}>
          <dt className="text-xs uppercase text-muted-foreground">{key}</dt>
          <dd className="mt-1 break-words text-sm">{value || "Não informado"}</dd>
        </div>
      ))}
    </dl>
  );
}

function formatDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value.length === 10 ? `${value}T12:00:00` : value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
}

function formatMoney(value: number | null | undefined) {
  return value == null
    ? null
    : value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}
