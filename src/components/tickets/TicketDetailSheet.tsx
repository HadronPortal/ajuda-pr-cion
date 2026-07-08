import { useState } from "react";
import {
  AlertCircle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  FileText,
  History,
  Info,
  LockKeyhole,
  Mail,
  MapPin,
  MessageSquare,
  Paperclip,
  Phone,
  Send,
  ShieldCheck,
  Tag,
  UserPlus,
  UserRound,
  XCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  SupportTicket,
  TicketPriority,
  TicketStatus,
} from "@/lib/support-tickets-data";

const statusTone: Record<TicketStatus, string> = {
  Atrasado: "bg-destructive/12 text-destructive border-destructive/20",
  "Em Aberto": "bg-primary/12 text-primary border-primary/20",
  Ocupado:
    "bg-[#fff1d6] text-[#b66a00] border-[#ffd78a] dark:bg-[#4d3516] dark:text-[#ffd28a] dark:border-[#7a5520]",
  "Em andamento":
    "bg-[#e8f3ff] text-[#246cb5] border-[#bfddff] dark:bg-[#17314e] dark:text-[#9dcaff] dark:border-[#24527d]",
  "Aguardando cliente":
    "bg-[#f2eaff] text-[#7253bd] border-[#d9c9ff] dark:bg-[#2e2549] dark:text-[#c7b8ff] dark:border-[#4b3a78]",
  "Com especialista":
    "bg-[#e7faf1] text-[#1f9860] border-[#bdeed6] dark:bg-[#14382b] dark:text-[#8ee8be] dark:border-[#226447]",
  Agendamento:
    "bg-[#fff8dd] text-[#9c7610] border-[#f4df85] dark:bg-[#403817] dark:text-[#f3d66d] dark:border-[#695b22]",
  Finalizado: "bg-success/12 text-success border-success/20",
  Cancelado: "bg-muted text-muted-foreground border-border",
};

const priorityTone: Record<TicketPriority, string> = {
  Alta: "bg-destructive/12 text-destructive border-destructive/20",
  Media: "bg-warning/16 text-warning-foreground border-warning/30",
  Baixa: "bg-muted text-muted-foreground border-border",
};

const sourceLabels: Record<SupportTicket["source"], string> = {
  Telefone: "Telefone",
  "Portal do cliente": "Portal do cliente",
  WhatsApp: "WhatsApp",
  Email: "Email",
};

type ClientMock = {
  cnpj: string;
  city: string;
  uf: string;
  phone: string;
  email: string;
  status: "Ativo" | "Pendente" | "Bloqueado" | "Inativo";
  setup: string;
  lastContact: string;
  commercialOwner: string;
};

type ContactMock = {
  phone: string;
  email: string;
  role: string;
  preference: "WhatsApp" | "Telefone" | "Email";
};

type TicketMockExtras = {
  category: string;
  description: string;
  client: ClientMock;
  contactDetails: ContactMock;
};

function hashString(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const cities = [
  ["São Paulo", "SP"],
  ["Campinas", "SP"],
  ["Belo Horizonte", "MG"],
  ["Curitiba", "PR"],
  ["Porto Alegre", "RS"],
  ["Goiânia", "GO"],
  ["Recife", "PE"],
  ["Fortaleza", "CE"],
];

const setups = [
  "Hadron Web 4.2.1",
  "Prócion ERP 12.8",
  "Prócion ERP 12.7",
  "Hadron Desktop 3.9",
  "Prócion Cloud 2.4",
];

const clientStatuses: ClientMock["status"][] = [
  "Ativo",
  "Ativo",
  "Ativo",
  "Pendente",
  "Bloqueado",
  "Inativo",
];

const contactRoles = [
  "Financeiro",
  "TI / Sistemas",
  "Compras",
  "Comercial",
  "Fiscal",
  "Diretoria",
];

const commercialOwners = [
  "Carlos Menezes",
  "Priscila Duarte",
  "Rafael Antunes",
  "Juliana Prado",
];

const categoryByModule: Record<string, string> = {
  "Vendas - NFE": "Emissão fiscal",
  "Basico - Terceiros": "Cadastro",
  "Hadron Web": "Treinamento",
  Estoque: "Relatórios",
  Financeiro: "Movimentação",
};

function buildMock(ticket: SupportTicket): TicketMockExtras {
  const h = hashString(ticket.id);
  const [city, uf] = cities[h % cities.length];
  const phoneA = 3000 + (h % 6999);
  const phoneB = 1000 + ((h >> 3) % 8999);
  const cnpj = `${10 + (h % 89)}.${100 + ((h >> 2) % 899)}.${100 + ((h >> 5) % 899)}/0001-${10 + ((h >> 7) % 89)}`;
  return {
    category: categoryByModule[ticket.module] ?? "Atendimento",
    description:
      "Cliente relata dificuldade recorrente ao executar a operação descrita no assunto. Solicita análise do time de suporte e retorno com orientação técnica ou correção do comportamento identificado.",
    client: {
      cnpj,
      city,
      uf,
      phone: `(${11 + (h % 88)}) 9${phoneA}-${phoneB}`,
      email: `contato@${ticket.clientCode.toLowerCase()}.com.br`,
      status: clientStatuses[h % clientStatuses.length],
      setup: setups[h % setups.length],
      lastContact: ticket.updatedAt,
      commercialOwner: commercialOwners[h % commercialOwners.length],
    },
    contactDetails: {
      phone: `(${11 + ((h >> 1) % 88)}) 9${phoneB}-${phoneA}`,
      email: `${ticket.contact.split(" ")[0]?.toLowerCase() ?? "contato"}@${ticket.clientCode.toLowerCase()}.com.br`,
      role: contactRoles[h % contactRoles.length],
      preference: (["WhatsApp", "Telefone", "Email"] as const)[h % 3],
    },
  };
}

type TimelineEvent = {
  kind: "created" | "attached" | "assumed" | "status" | "message" | "closed";
  when: string;
  actor: string;
  actorType: "cliente" | "suporte" | "sistema";
  description: string;
};

function buildTimeline(ticket: SupportTicket): TimelineEvent[] {
  const events: TimelineEvent[] = [
    {
      kind: "created",
      when: ticket.openedAt,
      actor: ticket.contact,
      actorType: "cliente",
      description: `Chamado aberto via ${sourceLabels[ticket.source]}.`,
    },
    {
      kind: "attached",
      when: addMinutes(ticket.openedAt, 6),
      actor: ticket.contact,
      actorType: "cliente",
      description: "Cliente anexou print do erro e log da operação.",
    },
    {
      kind: "assumed",
      when: addMinutes(ticket.openedAt, 14),
      actor: ticket.attendant,
      actorType: "suporte",
      description: `Chamado assumido por ${ticket.attendant}.`,
    },
    {
      kind: "status",
      when: addMinutes(ticket.openedAt, 32),
      actor: ticket.owner,
      actorType: "sistema",
      description: `Status alterado para "${ticket.status}".`,
    },
    {
      kind: "message",
      when: ticket.updatedAt,
      actor: ticket.owner,
      actorType: "suporte",
      description: "Retorno enviado ao cliente com orientação inicial.",
    },
  ];
  if (ticket.status === "Finalizado") {
    events.push({
      kind: "closed",
      when: ticket.updatedAt,
      actor: ticket.owner,
      actorType: "suporte",
      description: "Chamado encerrado após confirmação do cliente.",
    });
  }
  return events;
}

function addMinutes(iso: string, minutes: number) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function computeSla(ticket: SupportTicket) {
  const target = 24;
  const openedAt = new Date(ticket.openedAt).getTime();
  const now = new Date("2026-07-08T10:00:00").getTime();
  const hours = Math.max(0, (now - openedAt) / 36e5);
  const rawPct = ticket.status === "Atrasado" ? 100 : Math.min(100, (hours / target) * 100);
  const pct = Math.round(rawPct);
  let tone: "ok" | "warn" | "late" = "ok";
  if (ticket.status === "Atrasado" || pct >= 90) tone = "late";
  else if (pct >= 60) tone = "warn";
  return { pct, tone, hours: Math.round(hours) };
}

const slaBarTone: Record<"ok" | "warn" | "late", string> = {
  ok: "bg-success",
  warn: "bg-warning",
  late: "bg-destructive",
};

const timelineIcon: Record<TimelineEvent["kind"], typeof Info> = {
  created: MessageSquare,
  attached: Paperclip,
  assumed: UserPlus,
  status: ShieldCheck,
  message: Send,
  closed: CheckCircle2,
};

const timelineTone: Record<TimelineEvent["kind"], string> = {
  created: "bg-primary/12 text-primary",
  attached: "bg-muted text-foreground",
  assumed: "bg-[#e7faf1] text-[#1f9860] dark:bg-[#14382b] dark:text-[#8ee8be]",
  status: "bg-[#e8f3ff] text-[#246cb5] dark:bg-[#17314e] dark:text-[#9dcaff]",
  message: "bg-[#f2eaff] text-[#7253bd] dark:bg-[#2e2549] dark:text-[#c7b8ff]",
  closed: "bg-success/15 text-success",
};

const clientStatusTone: Record<ClientMock["status"], string> = {
  Ativo: "bg-success/12 text-success border-success/20",
  Pendente: "bg-warning/16 text-warning-foreground border-warning/30",
  Bloqueado: "bg-destructive/12 text-destructive border-destructive/20",
  Inativo: "bg-muted text-muted-foreground border-border",
};

export function TicketDetailSheet({
  ticket,
  open,
  onOpenChange,
}: {
  ticket: SupportTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [replyMode, setReplyMode] = useState<"cliente" | "interna">("cliente");
  const [reply, setReply] = useState("");

  if (!ticket) return null;

  const mock = buildMock(ticket);
  const sla = computeSla(ticket);
  const timeline = buildTimeline(ticket);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 shadow-2xl sm:!max-w-none md:w-[720px] lg:w-[820px] xl:w-[860px]"
      >
        <SheetTitle className="sr-only">
          Detalhes do chamado {ticket.protocol}
        </SheetTitle>

        {/* Fixed header */}
        <header className="shrink-0 border-b border-border bg-card px-5 py-4 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[12px] font-semibold text-muted-foreground">
                  {ticket.protocol}
                </span>
                <span className="text-[12px] text-muted-foreground">·</span>
                <span className="text-[12px] text-muted-foreground">
                  {sourceLabels[ticket.source]}
                </span>
              </div>
              <h2 className="mt-1 truncate text-[17px] font-bold leading-snug text-foreground">
                {ticket.subject}
              </h2>
              <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                <span className="font-semibold text-foreground">{ticket.clientCode}</span>
                {" · "}
                {ticket.clientName}
              </p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                statusTone[ticket.status],
              )}
            >
              {ticket.status}
            </Badge>
            <Badge
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                priorityTone[ticket.priority],
              )}
            >
              Prioridade {ticket.priority}
            </Badge>
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
              <CalendarClock className="h-3 w-3" />
              SLA {sla.pct}% · {sla.hours}h
            </span>
            {ticket.lockedBy && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2.5 py-0.5 text-[11px] font-medium text-warning-foreground">
                <LockKeyhole className="h-3 w-3" />
                Ocupado por {ticket.lockedBy}
              </span>
            )}
          </div>

          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn("h-full rounded-full transition-all", slaBarTone[sla.tone])}
              style={{ width: `${sla.pct}%` }}
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8 cursor-pointer rounded-lg px-3 text-[12px]">
              <UserPlus className="mr-1 h-3.5 w-3.5" />
              Assumir
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 cursor-pointer rounded-lg px-3 text-[12px]"
            >
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              Alterar status
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 cursor-pointer rounded-lg px-3 text-[12px]"
            >
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Encerrar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 cursor-pointer rounded-lg px-3 text-[12px] text-muted-foreground hover:text-foreground"
            >
              <History className="mr-1 h-3.5 w-3.5" />
              Histórico
            </Button>
          </div>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto bg-muted/30 px-5 py-5 md:px-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <SectionCard title="Cliente" icon={Building2}>
              <div className="mb-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-foreground">
                    {ticket.clientName}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Código {ticket.clientCode}
                  </p>
                </div>
                <Badge
                  className={cn(
                    "shrink-0 rounded-full border px-2 py-0.5 text-[10.5px] font-semibold",
                    clientStatusTone[mock.client.status],
                  )}
                >
                  {mock.client.status}
                </Badge>
              </div>
              <dl className="grid grid-cols-1 gap-2 text-[12px]">
                <Field icon={FileText} label="CNPJ" value={mock.client.cnpj} mono />
                <Field
                  icon={MapPin}
                  label="Cidade"
                  value={`${mock.client.city} - ${mock.client.uf}`}
                />
                <Field icon={Phone} label="Telefone" value={mock.client.phone} />
                <Field icon={Mail} label="Email" value={mock.client.email} />
                <Field icon={Tag} label="Setup" value={mock.client.setup} />
                <Field
                  icon={Clock3}
                  label="Último contato"
                  value={formatDateTime(mock.client.lastContact)}
                />
                <Field
                  icon={UserRound}
                  label="Comercial"
                  value={mock.client.commercialOwner}
                />
              </dl>
            </SectionCard>

            <SectionCard title="Contato" icon={UserRound}>
              <p className="text-[14px] font-bold text-foreground">{ticket.contact}</p>
              <p className="mb-3 text-[11px] text-muted-foreground">
                {mock.contactDetails.role}
              </p>
              <dl className="grid grid-cols-1 gap-2 text-[12px]">
                <Field icon={Phone} label="Telefone" value={mock.contactDetails.phone} />
                <Field icon={Mail} label="Email" value={mock.contactDetails.email} />
                <Field
                  icon={MessageSquare}
                  label="Retorno preferido"
                  value={mock.contactDetails.preference}
                />
              </dl>
            </SectionCard>

            <SectionCard title="Detalhes do chamado" icon={Info} className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Field icon={Tag} label="Assunto" value={ticket.subject} />
                <Field icon={FileText} label="Módulo" value={ticket.module} />
                <Field icon={Tag} label="Categoria" value={mock.category} />
                <Field
                  icon={CalendarClock}
                  label="Abertura"
                  value={formatDateTime(ticket.openedAt)}
                />
                <Field
                  icon={Clock3}
                  label="Última atualização"
                  value={formatDateTime(ticket.updatedAt)}
                />
                <Field icon={UserRound} label="Atendente inicial" value={ticket.attendant} />
                <Field
                  icon={UserRound}
                  label="Responsável atual"
                  value={
                    ticket.lockedBy
                      ? `${ticket.owner} · Ocupado por ${ticket.lockedBy}`
                      : ticket.owner
                  }
                />
              </div>
              <div className="mt-4 rounded-xl border border-border bg-muted/40 p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Descrição do problema
                </p>
                <p className="text-[13px] leading-relaxed text-foreground">
                  {mock.description}
                </p>
              </div>
            </SectionCard>

            <SectionCard
              title="Timeline"
              icon={History}
              className="lg:col-span-2"
            >
              <ol className="relative space-y-4 border-l border-border pl-5">
                {timeline.map((event, idx) => {
                  const Icon = timelineIcon[event.kind];
                  return (
                    <li key={idx} className="relative">
                      <span
                        className={cn(
                          "absolute -left-[30px] top-0 grid h-6 w-6 place-items-center rounded-full ring-4 ring-card",
                          timelineTone[event.kind],
                        )}
                      >
                        <Icon className="h-3 w-3" />
                      </span>
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[13px] font-semibold text-foreground">
                          {event.actor}{" "}
                          <span className="text-[11px] font-normal text-muted-foreground">
                            · {event.actorType}
                          </span>
                        </p>
                        <span className="text-[11px] text-muted-foreground">
                          {formatDateTime(event.when)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-[12.5px] text-muted-foreground">
                        {event.description}
                      </p>
                    </li>
                  );
                })}
              </ol>
            </SectionCard>

            <SectionCard
              title="Adicionar resposta"
              icon={Send}
              className="lg:col-span-2"
            >
              <div className="mb-3 inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setReplyMode("cliente")}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-semibold transition",
                    replyMode === "cliente"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Mensagem para cliente
                </button>
                <button
                  type="button"
                  onClick={() => setReplyMode("interna")}
                  className={cn(
                    "cursor-pointer rounded-md px-3 py-1.5 text-[12px] font-semibold transition",
                    replyMode === "interna"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  Nota interna
                </button>
              </div>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                rows={4}
                placeholder={
                  replyMode === "cliente"
                    ? "Escreva a mensagem que será enviada ao cliente..."
                    : "Registre uma nota interna visível apenas para a equipe..."
                }
                className="w-full resize-none rounded-xl border border-border bg-background p-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 cursor-pointer rounded-lg text-[12px]"
                >
                  <Paperclip className="mr-1.5 h-3.5 w-3.5" />
                  Anexar arquivo
                </Button>
                <div className="flex items-center gap-2">
                  {replyMode === "interna" && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                      <AlertCircle className="h-3 w-3" />
                      Visível somente para o time
                    </span>
                  )}
                  <Button
                    size="sm"
                    disabled={!reply.trim()}
                    className="h-9 cursor-pointer rounded-lg text-[12px]"
                  >
                    <Send className="mr-1.5 h-3.5 w-3.5" />
                    Enviar resposta
                  </Button>
                </div>
              </div>
            </SectionCard>
          </div>

          <div className="h-2" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function SectionCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: typeof Info;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border border-border bg-card p-4 shadow-[0_6px_18px_rgba(25,29,51,0.04)]",
        className,
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-3.5 w-3.5" />
        </span>
        <h3 className="text-[13px] font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </Card>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof Info;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-none last:pb-0">
      <div className="flex min-w-0 items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
        <Icon className="h-3 w-3 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <div
        className={cn(
          "min-w-0 truncate text-right text-[12.5px] font-medium text-foreground",
          mono && "font-mono",
        )}
      >
        {value}
      </div>
    </div>
  );
}

// Prevent tree-shake warnings for unused imports helpers
void XCircle;
