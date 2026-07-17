import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowUp,
  Building2,
  Check,
  ChevronDown,
  FileText,
  Info,
  Mail,
  MessageSquarePlus,
  Minus,
  Phone,
  Search,
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
import type { ClosurePayload } from "@/lib/tickets-store";
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
// Mock data específico da tela (será substituído por API futuramente)
// -----------------------------------------------------------------------------

type Company = {
  code: string;
  name: string;
  fantasy: string;
  cnpj: string;
  subs: { id: string; name: string; cnpj: string }[];
  defaultContact: {
    name: string;
    emails: string[];
    phones: string[];
  };
};

const companies: Company[] = [
  {
    code: "MIT",
    name: "Mineração Itaporanga LTDA",
    fantasy: "Mineração Itaporanga",
    cnpj: "12.345.678/0001-90",
    subs: [
      { id: "MIT-01", name: "Matriz — Itaporanga", cnpj: "12.345.678/0001-90" },
      { id: "MIT-02", name: "Filial — Currais Novos", cnpj: "12.345.678/0002-71" },
    ],
    defaultContact: {
      name: "Samuel Ferreira",
      emails: ["samuel@itaporanga.com.br"],
      phones: ["(84) 99988-1122"],
    },
  },
  {
    code: "VGA",
    name: "Vega Distribuidora S/A",
    fantasy: "Vega Distribuidora",
    cnpj: "22.555.888/0001-40",
    subs: [
      { id: "VGA-01", name: "Matriz — Natal", cnpj: "22.555.888/0001-40" },
      { id: "VGA-02", name: "CD — Parnamirim", cnpj: "22.555.888/0002-21" },
    ],
    defaultContact: {
      name: "Cláudia Nogueira",
      emails: ["compras@vega.com.br"],
      phones: ["(84) 3222-4477"],
    },
  },
  {
    code: "ALP",
    name: "Alpha Comércio LTDA",
    fantasy: "Alpha Comércio",
    cnpj: "33.111.222/0001-55",
    subs: [{ id: "ALP-01", name: "Matriz — Mossoró", cnpj: "33.111.222/0001-55" }],
    defaultContact: {
      name: "Ricardo Alves",
      emails: ["ti@alpha.com.br"],
      phones: ["(84) 3333-8899"],
    },
  },
  {
    code: "NEB",
    name: "Nébula Indústria S/A",
    fantasy: "Nébula Indústria",
    cnpj: "44.222.333/0001-10",
    subs: [
      { id: "NEB-01", name: "Matriz — Natal", cnpj: "44.222.333/0001-10" },
      { id: "NEB-02", name: "Unidade Industrial", cnpj: "44.222.333/0002-90" },
    ],
    defaultContact: {
      name: "Paula Menezes",
      emails: ["sistemas@nebula.com.br"],
      phones: ["(84) 99911-2233"],
    },
  },
];

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

// Radio segmentado de prioridade -----------------------------------------------

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
    baseClass:
      "border-success/25 bg-success/10 dark:bg-success/15",
    activeClass:
      "border-success/70 ring-2 ring-success/40 shadow-sm bg-success/15 dark:bg-success/20",
    iconWrapClass: "bg-success text-success-foreground",
    textClass: "text-success",
  },
  {
    value: "Media",
    label: "Média",
    icon: Minus,
    baseClass:
      "border-warning/30 bg-warning/12 dark:bg-warning/15",
    activeClass:
      "border-warning/70 ring-2 ring-warning/40 shadow-sm bg-warning/20 dark:bg-warning/25",
    iconWrapClass: "bg-warning text-warning-foreground",
    textClass: "text-warning-foreground",
  },
  {
    value: "Alta",
    label: "Alta",
    icon: ArrowUp,
    baseClass:
      "border-destructive/25 bg-destructive/10 dark:bg-destructive/15",
    activeClass:
      "border-destructive/70 ring-2 ring-destructive/40 shadow-sm bg-destructive/15 dark:bg-destructive/20",
    iconWrapClass: "bg-destructive text-destructive-foreground",
    textClass: "text-destructive",
  },
];

// -----------------------------------------------------------------------------

type FormState = {
  companyCode: string;
  subId: string;
  contactName: string;
  emails: string[];
  phones: string[];
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
  companyCode: "",
  subId: "",
  contactName: "",
  emails: [""],
  phones: [""],
  module: "Vendas",
  submodule: "NFE",
  operator: operators[0].code,
  type: "Não definido",
  priority: "Media",
  subject: "",
  description: "",
  source: "Portal do cliente",
};

function NewTicketPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const company = companies.find((c) => c.code === form.companyCode) ?? null;
  const sub = company?.subs.find((s) => s.id === form.subId) ?? null;
  const submodules = modulesMap[form.module] ?? [];
  const operatorObj = operators.find((o) => o.code === form.operator);

  // Sincroniza submódulo quando o módulo muda
  useEffect(() => {
    if (!submodules.includes(form.submodule)) {
      setForm((prev) => ({ ...prev, submodule: submodules[0] ?? "" }));
    }
  }, [form.module, form.submodule, submodules]);

  const requiredMissing =
    !form.companyCode ||
    !form.subId ||
    !form.contactName.trim() ||
    !form.emails[0]?.trim() ||
    !form.phones[0]?.trim() ||
    !form.subject.trim() ||
    !form.description.trim();

  const handleCompanySelect = (c: Company) => {
    setForm((prev) => ({
      ...prev,
      companyCode: c.code,
      subId: c.subs[0]?.id ?? "",
      contactName: c.defaultContact.name,
      emails: [...c.defaultContact.emails],
      phones: [...c.defaultContact.phones],
    }));
  };

  const updateEmail = (i: number, v: string) =>
    setForm((prev) => ({
      ...prev,
      emails: prev.emails.map((e, idx) => (idx === i ? v : e)),
    }));
  const updatePhone = (i: number, v: string) =>
    setForm((prev) => ({
      ...prev,
      phones: prev.phones.map((p, idx) => (idx === i ? v : p)),
    }));

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (requiredMissing || !company || !sub) {
      toast.error("Preencha os campos obrigatórios para abrir o chamado.");
      return;
    }

    setSubmitting(true);
    const ticket = ticketsStore.createTicket({
      priority: form.priority,
      clientCode: company.code,
      clientName: `${company.fantasy} — ${sub.name}`,
      contact: form.contactName,
      subject: form.subject,
      module: `${form.module} - ${form.submodule}`,
      source: form.source,
      description:
        `${form.description}\n\n` +
        `Tipo: ${form.type}. Operador: ${form.operator}. ` +
        `Contato: ${form.emails.filter(Boolean).join(", ")} · ${form.phones.filter(Boolean).join(", ")}.`,
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
          {/* 1. Empresa */}
          <Card className="rounded-[16px] border border-border/70 bg-card p-5">
            <SectionTitle
              icon={Building2}
              title="Empresa"
              description="Selecione a empresa e a subempresa relacionadas ao chamado."
            />
            <div className="mt-4 space-y-3">
              <CompanyCombobox
                value={company}
                onSelect={handleCompanySelect}
              />

              <div>
                <Label className="mb-1.5 block text-[12px] font-medium text-foreground">
                  Subempresa <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={form.subId}
                  onValueChange={(v) => setForm((prev) => ({ ...prev, subId: v }))}
                  disabled={!company}
                >
                  <SelectTrigger className="h-11 rounded-xl cursor-pointer">
                    <SelectValue placeholder="Selecione a subempresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {company?.subs.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        <div className="flex flex-col">
                          <span className="text-sm">{s.name}</span>
                          <span className="text-[11px] text-muted-foreground">{s.cnpj}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    value={form.emails[0] ?? ""}
                    onChange={(e) => updateEmail(0, e.target.value)}
                    placeholder="email@empresa.com"
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
              </Field>

              <Field label="Telefone" required>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={form.phones[0] ?? ""}
                    onChange={(e) => updatePhone(0, e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="h-11 rounded-xl pl-9"
                  />
                </div>
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
                        <span className="font-mono text-xs">{op.code}</span>
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
                    className="grid grid-cols-3 gap-1.5 rounded-xl border border-border bg-muted/30 p-1"
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
                            "flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition cursor-pointer",
                            "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                            active
                              ? opt.activeClass
                              : "border-transparent bg-card text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <Icon
                            className={cn("h-3.5 w-3.5", active ? opt.iconClass : "")}
                            strokeWidth={active ? 2.5 : 2}
                          />
                          <span>{opt.label}</span>
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
                      {company?.code ?? "COD"}
                    </span>
                    {" · "}
                    {company?.fantasy ?? "Empresa"}
                    {sub && ` — ${sub.name}`}
                  </p>
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
                  Por enquanto este formulário salva em dados mockados. Quando o backend estiver
                  pronto, o envio será trocado para a API.
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
    </AppShell>
  );
}

// -----------------------------------------------------------------------------
// Combobox de empresas (busca por nome, razão, fantasia, CNPJ, sigla)
// -----------------------------------------------------------------------------

function CompanyCombobox({
  value,
  onSelect,
}: {
  value: Company | null;
  onSelect: (c: Company) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies;
    return companies.filter((c) =>
      [c.name, c.fantasy, c.cnpj, c.code]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [query]);

  return (
    <div ref={rootRef} className="relative">
      <Label className="mb-1.5 block text-[12px] font-medium text-foreground">
        Empresa <span className="text-destructive">*</span>
      </Label>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-11 w-full items-center gap-2 rounded-xl border border-border bg-card px-3 text-left text-sm cursor-pointer transition hover:bg-accent/40"
      >
        <Search className="h-4 w-4 text-muted-foreground" />
        {value ? (
          <span className="flex min-w-0 flex-1 items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{value.code}</span>
            <span className="truncate">{value.fantasy}</span>
            <span className="hidden truncate text-xs text-muted-foreground md:inline">
              · {value.cnpj}
            </span>
          </span>
        ) : (
          <span className="flex-1 text-muted-foreground">
            Buscar por nome, razão social, CNPJ ou sigla...
          </span>
        )}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>
      {open && (
        <div className="absolute z-30 mt-1 w-full overflow-hidden rounded-xl border border-border bg-popover shadow-lg">
          <div className="border-b border-border p-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Digite para filtrar..."
                className="h-10 rounded-lg pl-9"
              />
            </div>
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-3 py-4 text-center text-sm text-muted-foreground">
                Nenhuma empresa encontrada.
              </li>
            )}
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(c);
                    setOpen(false);
                    setQuery("");
                  }}
                  className="flex w-full items-start gap-3 px-3 py-2 text-left text-sm cursor-pointer hover:bg-accent"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {c.code}
                      </span>
                      <span className="truncate font-medium">{c.fantasy}</span>
                    </div>
                    <div className="truncate text-[11px] text-muted-foreground">
                      {c.name} · {c.cnpj}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
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
