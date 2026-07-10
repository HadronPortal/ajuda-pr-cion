import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileText,
  Info,
  MessageSquarePlus,
  Phone,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ticketsStore } from "@/lib/tickets-store";
import type { SupportTicket, TicketPriority } from "@/lib/support-tickets-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chamados/novo")({
  head: () => ({
    meta: [
      { title: "Novo chamado — CRM Prócion" },
      {
        name: "description",
        content: "Abertura de chamado no CRM de suporte da Prócion.",
      },
    ],
  }),
  component: NewTicketPage,
});

const modules = [
  "Vendas - NFE",
  "Fiscal - Apuração",
  "Financeiro - Contas a pagar",
  "Basico - Terceiros",
  "Estoque",
  "Hadron Web",
  "Portal do Cliente",
  "Impressoras",
];

const sourceOptions: SupportTicket["source"][] = [
  "Portal do cliente",
  "Telefone",
  "WhatsApp",
  "Email",
];

const priorityTone: Record<TicketPriority, string> = {
  Alta: "border-destructive/25 bg-destructive/8 text-destructive",
  Media: "border-warning/35 bg-warning/12 text-warning-foreground",
  Baixa: "border-border bg-muted/55 text-muted-foreground",
};

const initialForm = {
  clientCode: "",
  clientName: "",
  contact: "",
  source: "Portal do cliente" as SupportTicket["source"],
  priority: "Media" as TicketPriority,
  module: "Vendas - NFE",
  subject: "",
  description: "",
};

function NewTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const requiredMissing = useMemo(
    () =>
      !form.clientCode.trim() ||
      !form.clientName.trim() ||
      !form.contact.trim() ||
      !form.subject.trim() ||
      !form.description.trim(),
    [form],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requiredMissing) {
      toast.error("Preencha os campos obrigatórios para abrir o chamado.");
      return;
    }

    setSubmitting(true);
    const ticket = ticketsStore.createTicket(form);
    toast.success("Chamado criado", {
      description: `${ticket.protocol} foi adicionado na fila de suporte.`,
    });
    void navigate({ to: "/chamados" });
  };

  return (
    <AppShell>
      <PageHeader
        title="Criar chamado"
        description="Registre uma nova solicitação do cliente e envie para a fila de suporte."
        breadcrumbs={[{ label: "Chamados", to: "/chamados" }, { label: "Criar chamado" }]}
        actions={
          <Button asChild variant="outline" size="sm" className="rounded-xl">
            <Link to="/chamados">
              <ArrowLeft className="mr-1.5 h-4 w-4" />
              Voltar
            </Link>
          </Button>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]"
      >
        <div className="space-y-6">
          <Card className="rounded-[16px] border border-border/70 bg-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
            <SectionTitle
              icon={Building2}
              title="Cliente"
              description="Identifique a empresa e a pessoa que abriu a solicitação."
            />
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[160px_minmax(0,1fr)]">
              <Field label="Código" required>
                <Input
                  value={form.clientCode}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, clientCode: event.target.value }))
                  }
                  placeholder="MIT"
                  className="h-11 rounded-xl uppercase"
                />
              </Field>
              <Field label="Nome do cliente" required>
                <Input
                  value={form.clientName}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, clientName: event.target.value }))
                  }
                  placeholder="Mineração Itaporanga"
                  className="h-11 rounded-xl"
                />
              </Field>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Contato" required>
                <Input
                  value={form.contact}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, contact: event.target.value }))
                  }
                  placeholder="Samuel"
                  className="h-11 rounded-xl"
                />
              </Field>
              <Field label="Origem">
                <Select
                  value={form.source}
                  onValueChange={(value: SupportTicket["source"]) =>
                    setForm((prev) => ({ ...prev, source: value }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceOptions.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Card>

          <Card className="rounded-[16px] border border-border/70 bg-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
            <SectionTitle
              icon={FileText}
              title="Problema"
              description="Informe o assunto, módulo e o relato do cliente."
            />
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Módulo">
                <Select
                  value={form.module}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, module: value }))}
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module} value={module}>
                        {module}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Prioridade">
                <Select
                  value={form.priority}
                  onValueChange={(value: TicketPriority) =>
                    setForm((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Baixa">Baixa</SelectItem>
                    <SelectItem value="Media">Média</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Assunto" required>
                <Input
                  value={form.subject}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, subject: event.target.value }))
                  }
                  placeholder="Nota em processamento"
                  className="h-11 rounded-xl"
                />
              </Field>
            </div>
            <div className="mt-4">
              <Field label="Descrição do problema" required>
                <Textarea
                  value={form.description}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, description: event.target.value }))
                  }
                  rows={7}
                  placeholder="Descreva o que o cliente relatou, mensagens de erro, tela onde ocorreu e o que já foi conferido..."
                  className="min-h-[170px] resize-none rounded-xl"
                />
              </Field>
            </div>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card className="sticky top-6 rounded-[16px] border border-border/70 bg-card p-5 shadow-[0_10px_28px_rgba(25,29,51,0.06)]">
            <SectionTitle
              icon={MessageSquarePlus}
              title="Resumo"
              description="Prévia do chamado que será enviado para a fila."
            />

            <div className="mt-5 space-y-3 rounded-2xl border border-border bg-muted/25 p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {form.subject.trim() || "Assunto do chamado"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground">
                      {form.clientCode.trim().toUpperCase() || "COD"}
                    </span>
                    {" · "}
                    {form.clientName.trim() || "Cliente"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <PreviewItem icon={UserRound} label="Contato" value={form.contact || "-"} />
                <PreviewItem icon={Phone} label="Origem" value={form.source} />
                <PreviewItem icon={FileText} label="Módulo" value={form.module} />
                <PreviewItem icon={AlertTriangle} label="Prioridade" value={form.priority} />
              </div>

              <Badge
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  priorityTone[form.priority],
                )}
              >
                Prioridade {form.priority}
              </Badge>
            </div>

            <div className="mt-5 rounded-2xl border border-primary/15 bg-primary/6 p-4 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  Por enquanto este formulário salva em dados mockados. Quando o backend estiver
                  pronto, o envio será trocado para a API.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting || requiredMissing}
              className="mt-5 h-11 w-full cursor-pointer rounded-xl shadow-[0_10px_22px_rgba(11,151,196,0.18)]"
            >
              {submitting ? (
                "Criando..."
              ) : (
                <>
                  <Send className="mr-1.5 h-4 w-4" />
                  Criar chamado
                </>
              )}
            </Button>

            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              O chamado entrará como Em Aberto.
            </div>
          </Card>
        </aside>
      </form>
    </AppShell>
  );
}

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof FileText;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <h2 className="text-base font-bold text-foreground">{title}</h2>
        <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="mb-1.5 block text-[12px] font-semibold text-foreground">
        {label}
        {required && <span className="ml-1 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function PreviewItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0">
      <p className="inline-flex items-center gap-1 text-[10.5px] font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="mt-0.5 truncate font-semibold text-foreground">{value}</p>
    </div>
  );
}
