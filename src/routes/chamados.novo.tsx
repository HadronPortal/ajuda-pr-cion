import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUp,
  Building2,
  ChevronDown,
  FileText,
  Info,
  Mail,
  MessageSquarePlus,
  Minus,
  Phone,
  Plus,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { ClientPicker } from "@/components/portal/ClientPicker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { ticketsStore } from "@/lib/tickets-store";
import type { SupportTicket, TicketPriority } from "@/lib/support-tickets-data";
import type { ClosurePayload } from "@/lib/tickets-store";
import { loadClients } from "@/lib/clients-store";
import {
  addClientContact,
  fetchClientGroupCompanies,
  formatPhoneDisplay,
  type ClientContact,
  type ClientCompanySummary,
} from "@/lib/client-contacts";
import type { ClientRow } from "@/routes/clientes.index";
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

// -----------------------------------------------------------------------------
// Metadados fixos do formulário (não são dados de cliente).
// -----------------------------------------------------------------------------

const modulesMap: Record<string, string[]> = {
  "Vendas": ["NFE", "Pedidos", "Orçamentos", "Devoluções"],
  "Fiscal": ["Apuração", "SPED", "ECF", "ICMS"],
  "Financeiro": ["Contas a pagar", "Contas a receber", "Fluxo de caixa", "Conciliação"],
  "Basico": ["Terceiros", "Produtos", "Filiais", "Usuários"],
  "Estoque": ["Movimentação", "Inventário", "Transferência"],
  "Hadron Web": ["Portal", "Integrações", "Relatórios"],
  "Impressoras": ["Configuração", "Etiquetas"],
};

const operators = [
  { code: "PRCMAR", name: "Marina Souza" },
  { code: "PRCSUZ", name: "Suzana Ribeiro" },
  { code: "PRCROG", name: "Rogério Lima" },
  { code: "PRCLCZ", name: "Lucas Zaboti" },
  { code: "PRCPED", name: "Pedro Antunes" },
];

const ticketTypes: ClosurePayload["type"][] = [
  "Não definido",
  "Dúvida",
  "Configuração",
  "Atualização do Hádron",
  "Problema Hádron",
  "Problema Externo",
  "Treinamento",
  "Solicitação/Sugestão",
  "Outros",
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
  Baixa: "border-success/30 bg-success/10 text-success",
};

const priorityOptions: {
  value: TicketPriority;
  label: string;
  icon: typeof ArrowUp;
  baseClass: string;
  activeClass: string;
  iconWrapClass: string;
  textClass: string;
}[] = [
  {
    value: "Baixa",
    label: "Baixa",
    icon: ChevronDown,
    baseClass: "border-success/25 bg-success/10 dark:bg-success/15",
    activeClass:
      "border-success/70 ring-2 ring-success/40 shadow-sm bg-success/15 dark:bg-success/20",
    iconWrapClass: "bg-success text-success-foreground",
    textClass: "text-success",
  },
  {
    value: "Media",
    label: "Média",
    icon: Minus,
    baseClass: "border-warning/30 bg-warning/12 dark:bg-warning/15",
    activeClass:
      "border-warning/70 ring-2 ring-warning/40 shadow-sm bg-warning/20 dark:bg-warning/25",
    iconWrapClass: "bg-warning text-warning-foreground",
    textClass: "text-warning-foreground",
  },
  {
    value: "Alta",
    label: "Alta",
    icon: ArrowUp,
    baseClass: "border-destructive/25 bg-destructive/10 dark:bg-destructive/15",
    activeClass:
      "border-destructive/70 ring-2 ring-destructive/40 shadow-sm bg-destructive/15 dark:bg-destructive/20",
    iconWrapClass: "bg-destructive text-destructive-foreground",
    textClass: "text-destructive",
  },
];

// -----------------------------------------------------------------------------

type FormState = {
  clientId: string;
  companyId: string; // subempresa selecionada (id do client_companies)
  contactName: string;
  emailContactId: string;
  emailValue: string;
  phoneContactId: string;
  phoneValue: string;
  module: string;
  submodule: string;
  operator: string;
  type: ClosurePayload["type"];
  priority: TicketPriority;
  subject: string;
  description: string;
  source: SupportTicket["source"];
};

const initialForm: FormState = {
  clientId: "",
  companyId: "",
  contactName: "",
  emailContactId: "",
  emailValue: "",
  phoneContactId: "",
  phoneValue: "",
  module: "Vendas",
  submodule: "NFE",
  operator: operators[0].code,
  type: "Não definido",
  priority: "Media",
  subject: "",
  description: "",
  source: "Portal do cliente",
};

type AddContactState = {
  open: boolean;
  kind: "email" | "phone";
  value: string;
  name: string;
  saving: boolean;
};

const initialAddContact: AddContactState = {
  open: false,
  kind: "email",
  value: "",
  name: "",
  saving: false,
};

function NewTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [client, setClient] = useState<ClientRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Contatos vinculados ao cliente (carregados do Supabase).
  const [clientUuid, setClientUuid] = useState<string | null>(null);
  const [emails, setEmails] = useState<ClientContact[]>([]);
  const [phones, setPhones] = useState<ClientContact[]>([]);
  const [companies, setCompanies] = useState<ClientCompanySummary[]>([]);
  const [contactsLoading, setContactsLoading] = useState(false);
  const [addContact, setAddContact] = useState<AddContactState>(initialAddContact);

  // Garante que a fonte única de clientes esteja carregada.
  useEffect(() => {
    void loadClients().catch(() => undefined);
  }, []);

  const submodules = modulesMap[form.module] ?? [];
  const operatorObj = operators.find((o) => o.code === form.operator);
  const selectedCompany = companies.find((c) => c.id === form.companyId) ?? null;

  useEffect(() => {
    if (!submodules.includes(form.submodule)) {
      setForm((prev) => ({ ...prev, submodule: submodules[0] ?? "" }));
    }
  }, [form.module, form.submodule, submodules]);

  // Carrega contatos + empresas/subempresas ao selecionar/alterar o cliente.
  useEffect(() => {
    if (!client?.acronym) {
      setClientUuid(null);
      setEmails([]);
      setPhones([]);
      setCompanies([]);
      return;
    }
    let cancelled = false;
    setContactsLoading(true);
    setEmails([]);
    setPhones([]);
    setCompanies([]);
    setClientUuid(null);
    fetchClientContacts(client.acronym)
      .then((bundle) => {
        if (cancelled) return;
        setClientUuid(bundle.clientId);
        setEmails(bundle.emails);
        setPhones(bundle.phones);
        setCompanies(bundle.companies);
        // Se houver apenas uma empresa, seleciona automaticamente.
        setForm((prev) => ({
          ...prev,
          companyId: bundle.companies.length === 1 ? bundle.companies[0].id : "",
        }));
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("[chamados.novo] falha ao carregar contatos", err);
        toast.error("Não foi possível carregar os contatos deste cliente.");
      })
      .finally(() => {
        if (!cancelled) setContactsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [client?.acronym]);

  const requiredMissing =
    !form.clientId ||
    (companies.length > 0 && !form.companyId) ||
    !form.contactName.trim() ||
    !form.emailValue.trim() ||
    !form.phoneValue.trim() ||
    !form.subject.trim() ||
    !form.description.trim();

  const handleClientSelect = (c: ClientRow) => {
    setClient(c);
    setForm((prev) => ({
      ...prev,
      clientId: c.id,
      companyId: "",
      emailContactId: "",
      emailValue: "",
      phoneContactId: "",
      phoneValue: "",
    }));
  };

  const handleSelectEmail = (id: string) => {
    const found = emails.find((e) => e.id === id);
    setForm((prev) => ({
      ...prev,
      emailContactId: id,
      emailValue: found?.value ?? "",
      contactName: prev.contactName || found?.name || "",
    }));
  };

  const handleSelectPhone = (id: string) => {
    const found = phones.find((p) => p.id === id);
    setForm((prev) => ({
      ...prev,
      phoneContactId: id,
      phoneValue: found?.value ?? "",
      contactName: prev.contactName || found?.name || "",
    }));
  };

  const openAddContact = (kind: "email" | "phone") => {
    setAddContact({ ...initialAddContact, open: true, kind });
  };

  const handleSaveNewContact = async () => {
    if (!clientUuid) {
      toast.error("Selecione uma empresa antes de cadastrar um contato.");
      return;
    }
    const value = addContact.value.trim();
    if (!value) return;
    setAddContact((prev) => ({ ...prev, saving: true }));
    try {
      const created = await addClientContact(
        clientUuid,
        addContact.kind,
        value,
        addContact.name.trim(),
      );
      if (addContact.kind === "email") {
        setEmails((prev) =>
          [...prev.filter((e) => e.id !== created.id), created].sort((a, b) =>
            a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
          ),
        );
        handleSelectEmail(created.id);
      } else {
        setPhones((prev) =>
          [...prev.filter((p) => p.id !== created.id), created].sort((a, b) =>
            a.name.localeCompare(b.name, "pt-BR", { sensitivity: "base" }),
          ),
        );
        handleSelectPhone(created.id);
      }
      toast.success("Contato cadastrado.");
      setAddContact(initialAddContact);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Não foi possível cadastrar o contato.";
      toast.error(msg);
      setAddContact((prev) => ({ ...prev, saving: false }));
    }
  };


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requiredMissing || !client) {
      toast.error("Preencha os campos obrigatórios para abrir o chamado.");
      return;
    }

    setSubmitting(true);
    const ticket = ticketsStore.createTicket({
      priority: form.priority,
      clientCode: client.acronym,
      clientName: client.fantasia || client.razaoSocial || client.name,
      contact: form.contactName,
      subject: form.subject,
      module: `${form.module} - ${form.submodule}`,
      source: form.source,
      description:
        `${form.description}\n\n` +
        `Tipo: ${form.type}. Operador: ${form.operator}. ` +
        `Contato: ${form.emailValue} · ${form.phoneValue}.` +
        (selectedCompany
          ? `\nEmpresa: ${selectedCompany.companyNumber ? String(selectedCompany.companyNumber).padStart(3, "0") + " · " : ""}${selectedCompany.tradeName || selectedCompany.legalName}${selectedCompany.document ? " · " + selectedCompany.document : ""}`
          : ""),
      companyId: selectedCompany?.id ?? null,
      companyNumber: selectedCompany?.companyNumber ?? null,
      companyName: selectedCompany?.tradeName || selectedCompany?.legalName || undefined,
      companyDocument: selectedCompany?.document || undefined,
    });
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
          <Button asChild variant="outline" size="sm" className="rounded-xl cursor-pointer">
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
        <div className="space-y-5">
          {/* 1. Cliente */}
          <Card className="rounded-[16px] border border-border/70 bg-card p-5">
            <SectionTitle
              icon={Building2}
              title="Cliente"
              description="Selecione o cliente cadastrado no CRM."
            />
            <div className="mt-4 space-y-3">
              <ClientPicker value={client} onSelect={handleClientSelect} required />

              {client && (
                <div className="rounded-xl border border-border bg-muted/30 px-3 py-2 text-[12px] text-muted-foreground">
                  <p className="truncate">
                    <span className="font-semibold text-foreground">{client.razaoSocial}</span>
                    {client.cnpj && ` · ${client.cnpj}`}
                  </p>
                  {client.city && <p className="truncate">{client.city}</p>}
                </div>
              )}

              {/* Empresa / subempresa vinculada ao cliente selecionado */}
              {client && (
                <div>
                  <Label className="mb-1.5 block text-[12px] font-medium text-foreground">
                    Empresa / subempresa
                    {companies.length > 0 && <span className="ml-1 text-destructive">*</span>}
                  </Label>
                  {contactsLoading ? (
                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-2.5 text-[12px] text-muted-foreground">
                      Carregando empresas…
                    </div>
                  ) : companies.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-3 py-2.5 text-[12px] text-muted-foreground">
                      Nenhuma empresa vinculada.
                    </div>
                  ) : (
                    <Select
                      value={form.companyId}
                      onValueChange={(v) => setForm((prev) => ({ ...prev, companyId: v }))}
                    >
                      <SelectTrigger className="h-11 rounded-xl cursor-pointer">
                        <SelectValue placeholder="Selecione a empresa ou filial" />
                      </SelectTrigger>
                      <SelectContent>
                        {companies.map((co) => {
                          const number = co.companyNumber
                            ? String(co.companyNumber).padStart(3, "0")
                            : "—";
                          const name = co.tradeName || co.legalName || "Empresa";
                          const location = [co.city, co.state].filter(Boolean).join(" / ");
                          return (
                            <SelectItem
                              key={co.id}
                              value={co.id}
                              className="cursor-pointer"
                            >
                              <span className="inline-flex flex-col">
                                <span className="text-[12.5px]">
                                  <span className="font-semibold">{number}</span>
                                  {" · "}
                                  {name}
                                  {co.document ? ` · ${co.document}` : ""}
                                </span>
                                <span className="text-[11px] text-muted-foreground">
                                  {co.isPrincipal ? "Principal" : "Filial"}
                                  {location ? ` · ${location}` : ""}
                                </span>
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* 2. Contato */}
          <Card className="rounded-[16px] border border-border/70 bg-card p-5">
            <SectionTitle
              icon={UserRound}
              title="Contato"
              description="Quem está solicitando o atendimento."
            />
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field label="Nome do contato" required>
                <Input
                  value={form.contactName}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, contactName: e.target.value }))
                  }
                  placeholder="Nome completo"
                  className="h-11 rounded-xl"
                />
              </Field>

              <Field label="E-mail do contato" required>
                <ContactSelectField
                  icon={Mail}
                  kind="email"
                  disabled={!client}
                  loading={contactsLoading}
                  options={emails}
                  value={form.emailContactId}
                  placeholder={
                    !client
                      ? "Selecione uma empresa"
                      : contactsLoading
                        ? "Carregando contatos..."
                        : emails.length === 0
                          ? "Nenhum e-mail cadastrado"
                          : "Selecione um e-mail"
                  }
                  onChange={handleSelectEmail}
                  onAdd={() => openAddContact("email")}
                />
              </Field>

              <Field label="Telefone" required>
                <ContactSelectField
                  icon={Phone}
                  kind="phone"
                  disabled={!client}
                  loading={contactsLoading}
                  options={phones}
                  value={form.phoneContactId}
                  placeholder={
                    !client
                      ? "Selecione uma empresa"
                      : contactsLoading
                        ? "Carregando contatos..."
                        : phones.length === 0
                          ? "Nenhum telefone cadastrado"
                          : "Selecione um telefone"
                  }
                  onChange={handleSelectPhone}
                  onAdd={() => openAddContact("phone")}
                />
              </Field>
            </div>
          </Card>

          {/* 3. Classificação */}
          <Card className="rounded-[16px] border border-border/70 bg-card p-5">
            <SectionTitle
              icon={FileText}
              title="Classificação"
              description="Módulo, submódulo e operador responsável."
            />
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              <Field label="Módulo">
                <Select
                  value={form.module}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, module: v }))}
                >
                  <SelectTrigger className="h-11 rounded-xl cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(modulesMap).map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Submódulo">
                <Select
                  value={form.submodule}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, submodule: v }))}
                >
                  <SelectTrigger className="h-11 rounded-xl cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {submodules.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Operador">
                <Select
                  value={form.operator}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, operator: v }))}
                >
                  <SelectTrigger className="h-11 rounded-xl cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {operators.map((op) => (
                      <SelectItem key={op.code} value={op.code}>
                        {op.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </Card>

          {/* 4. Informações do chamado */}
          <Card className="rounded-[16px] border border-border/70 bg-card p-5">
            <SectionTitle
              icon={MessageSquarePlus}
              title="Informações do chamado"
              description="Assunto, descrição, tipo e prioridade."
            />
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[minmax(0,1fr)_240px]">
              <div className="space-y-3">
                <Field label="Assunto" required>
                  <Input
                    value={form.subject}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Ex.: Nota em processamento"
                    className="h-11 rounded-xl"
                  />
                </Field>
                <Field label="Descrição" required>
                  <Textarea
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    rows={7}
                    placeholder="Descreva o que o cliente relatou, mensagens de erro, tela onde ocorreu e o que já foi conferido..."
                    className="min-h-[180px] resize-none rounded-xl"
                  />
                </Field>
              </div>

              <div className="space-y-3">
                <Field label="Tipo">
                  <Select
                    value={form.type}
                    onValueChange={(v: ClosurePayload["type"]) =>
                      setForm((prev) => ({ ...prev, type: v }))
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Prioridade">
                  <div
                    role="radiogroup"
                    aria-label="Prioridade"
                    className="grid grid-cols-3 gap-2"
                  >
                    {priorityOptions.map((opt) => {
                      const active = form.priority === opt.value;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() =>
                            setForm((prev) => ({ ...prev, priority: opt.value }))
                          }
                          className={cn(
                            "relative flex h-11 w-full items-center justify-center gap-2 rounded-xl border text-xs font-medium transition cursor-pointer",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                            opt.baseClass,
                            active && opt.activeClass,
                          )}
                        >
                          <span
                            className={cn(
                              "grid h-5 w-5 shrink-0 place-items-center rounded-full",
                              opt.iconWrapClass,
                            )}
                          >
                            <Icon className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span className={cn("font-medium", opt.textClass)}>
                            {opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </Field>

                <Field label="Origem">
                  <Select
                    value={form.source}
                    onValueChange={(v: SupportTicket["source"]) =>
                      setForm((prev) => ({ ...prev, source: v }))
                    }
                  >
                    <SelectTrigger className="h-11 rounded-xl cursor-pointer">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sourceOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </div>
          </Card>

          {/* 5. Ações */}
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-xl cursor-pointer"
              onClick={() => void navigate({ to: "/chamados" })}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={submitting || requiredMissing}
              className="h-11 rounded-xl cursor-pointer shadow-[0_10px_22px_rgba(11,151,196,0.18)]"
            >
              <Send className="mr-1.5 h-4 w-4" />
              {submitting ? "Criando..." : "Criar chamado"}
            </Button>
          </div>
        </div>

        {/* Resumo lateral */}
        <aside>
          <Card className="sticky top-6 rounded-[16px] border border-border/70 bg-card p-5">
            <SectionTitle
              icon={MessageSquarePlus}
              title="Resumo"
              description="Prévia do chamado em tempo real."
            />

            <div className="mt-5 space-y-3 rounded-2xl border border-border bg-card p-4">
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
                      {client?.acronym ?? "COD"}
                    </span>
                    {" · "}
                    {client?.fantasia || client?.name || "Cliente"}
                  </p>
                  {selectedCompany && (
                    <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {selectedCompany.companyNumber
                          ? String(selectedCompany.companyNumber).padStart(3, "0")
                          : "—"}
                      </span>
                      {" · "}
                      {selectedCompany.tradeName || selectedCompany.legalName}
                      {selectedCompany.document ? ` · ${selectedCompany.document}` : ""}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <PreviewItem icon={UserRound} label="Contato" value={form.contactName || "-"} />
                <PreviewItem
                  icon={FileText}
                  label="Módulo"
                  value={`${form.module} / ${form.submodule || "-"}`}
                />
                <PreviewItem
                  icon={UserRound}
                  label="Operador"
                  value={operatorObj ? operatorObj.code : "-"}
                />
                <PreviewItem icon={FileText} label="Tipo" value={form.type} />
                <PreviewItem icon={Phone} label="Origem" value={form.source} />
                <PreviewItem
                  icon={FileText}
                  label="Prioridade"
                  value={form.priority === "Media" ? "Média" : form.priority}
                />
              </div>

              <Badge
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[11px]",
                  priorityTone[form.priority],
                )}
              >
                Prioridade {form.priority === "Media" ? "Média" : form.priority}
              </Badge>
            </div>

            <div className="mt-4 rounded-2xl border border-primary/15 bg-primary/6 p-4 text-sm text-muted-foreground">
              <div className="flex gap-2">
                <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <p>
                  Clientes carregados diretamente da base do CRM. O chamado é registrado com o
                  ID real do cliente selecionado.
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              O chamado entrará como Em Aberto.
            </div>
          </Card>
        </aside>
      </form>

      <Dialog
        open={addContact.open}
        onOpenChange={(open) => {
          if (!open && !addContact.saving) setAddContact(initialAddContact);
        }}
      >
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle>
              {addContact.kind === "email" ? "Novo e-mail" : "Novo telefone"}
            </DialogTitle>
            <DialogDescription>
              O contato será vinculado a {client?.fantasia || client?.razaoSocial || "esta empresa"}.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-3 py-2">
            <div>
              <Label className="mb-1.5 block text-[12px] font-medium">Nome do contato</Label>
              <Input
                value={addContact.name}
                onChange={(e) => setAddContact((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Nome ou descrição"
                className="h-10 rounded-xl"
              />
            </div>
            <div>
              <Label className="mb-1.5 block text-[12px] font-medium">
                {addContact.kind === "email" ? "E-mail" : "Telefone"}
              </Label>
              <Input
                type={addContact.kind === "email" ? "email" : "tel"}
                value={addContact.value}
                onChange={(e) => setAddContact((prev) => ({ ...prev, value: e.target.value }))}
                placeholder={
                  addContact.kind === "email" ? "email@empresa.com" : "(00) 00000-0000"
                }
                className="h-10 rounded-xl"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl cursor-pointer"
              onClick={() => setAddContact(initialAddContact)}
              disabled={addContact.saving}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              className="rounded-xl cursor-pointer"
              onClick={handleSaveNewContact}
              disabled={addContact.saving || !addContact.value.trim()}
            >
              {addContact.saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

// -----------------------------------------------------------------------------
// Auxiliares
// -----------------------------------------------------------------------------

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
        <h2 className="text-base font-medium text-foreground">{title}</h2>
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
      <Label className="mb-1.5 block text-[12px] font-medium text-foreground">
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
      <p className="inline-flex items-center gap-1 text-[10.5px] font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3 w-3" />
        {label}
      </p>
      <p className="mt-0.5 truncate font-semibold text-foreground">{value}</p>
    </div>
  );
}

function ContactSelectField({
  icon: Icon,
  kind,
  disabled,
  loading,
  options,
  value,
  placeholder,
  onChange,
  onAdd,
}: {
  icon: typeof Mail;
  kind: "email" | "phone";
  disabled?: boolean;
  loading?: boolean;
  options: ClientContact[];
  value: string;
  placeholder: string;
  onChange: (id: string) => void;
  onAdd: () => void;
}) {
  const hasOptions = options.length > 0;
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Select
          value={value}
          onValueChange={onChange}
          disabled={disabled || loading || !hasOptions}
        >
          <SelectTrigger className="h-11 rounded-xl pl-9 cursor-pointer">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.id} value={opt.id} className="cursor-pointer">
                {kind === "email"
                  ? `${opt.value} - ${opt.name}`
                  : `${formatPhoneDisplay(opt.value)} | ${opt.name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="default"
        size="icon"
        onClick={onAdd}
        disabled={disabled}
        aria-label={kind === "email" ? "Adicionar e-mail" : "Adicionar telefone"}
        className="h-11 w-11 shrink-0 rounded-xl cursor-pointer"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}
