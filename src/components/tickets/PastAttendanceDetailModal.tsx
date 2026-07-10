import { toast } from "sonner";
import {
  CalendarClock,
  CheckCircle2,
  ClipboardCopy,
  Clock,
  FileText,
  Folder,
  Headphones,
  History,
  Layers,
  MessageSquare,
  Play,
  Sparkles,
  Tag,
  UserRound,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { SupportTicket, TicketPriority } from "@/lib/support-tickets-data";
import type { PastAttendance } from "@/lib/tickets-store";

const priorityChip: Record<TicketPriority, string> = {
  Alta: "bg-destructive/12 text-destructive border-destructive/25",
  Media:
    "bg-[#fff4d1] text-[#8a6300] border-[#f2d97a] dark:bg-[#3a2f10] dark:text-[#f3d66d] dark:border-[#5c4a1c]",
  Baixa: "bg-muted text-muted-foreground border-border",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function addMinutes(iso: string, minutes: number) {
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

function hashString(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i += 1)
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  return h;
}

const CHANNELS = ["Telefone", "Portal do cliente", "WhatsApp", "Email"] as const;
const CATEGORIES = [
  "Dúvida operacional",
  "Erro do sistema",
  "Configuração fiscal",
  "Cadastro / parâmetros",
  "Integração",
  "Relatório",
];

const PROBLEM_TEMPLATES = [
  "Cliente relatou divergência ao gerar o arquivo. Foram anexados prints e log da operação para análise.",
  "Ao executar a rotina, o sistema apresentou mensagem de erro impedindo a continuidade do processo.",
  "Cliente informou que o cadastro não estava refletindo corretamente nas movimentações subsequentes.",
  "Registro solicitado não aparecia no relatório mesmo após a inclusão. Cliente pediu conferência dos parâmetros.",
];

const SOLUTION_TEMPLATES = [
  "Foi realizada a conferência dos parâmetros fiscais e orientado o cliente sobre a correção do cadastro. Após ajuste, o SPED foi gerado com sucesso.",
  "Identificada configuração divergente no cadastro. Após correção junto ao cliente, a rotina passou a executar normalmente.",
  "Orientado o cliente quanto ao fluxo correto do módulo. Realizado teste em conjunto e processo concluído sem erros.",
  "Aplicado ajuste nos parâmetros e reprocessado o movimento. Cliente validou o resultado e aprovou o encerramento.",
];

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-border/70 bg-muted/30 px-3 py-2.5">
      <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-[12.5px] font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}

export function PastAttendanceDetailModal({
  open,
  onOpenChange,
  attendance,
  ticket,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  attendance: PastAttendance | null;
  ticket: SupportTicket | null;
}) {
  if (!attendance) return null;

  const h = hashString(attendance.id);
  const channel = CHANNELS[h % CHANNELS.length];
  const category = CATEGORIES[h % CATEGORIES.length];
  const durationMinutes = 30 + (h % 240);
  const closedAt = addMinutes(attendance.date, durationMinutes);
  const problem = PROBLEM_TEMPLATES[h % PROBLEM_TEMPLATES.length];
  const solution = SOLUTION_TEMPLATES[h % SOLUTION_TEMPLATES.length];

  const timeline = [
    { icon: FileText, label: "Chamado aberto", when: attendance.date, actor: "Cliente" },
    {
      icon: UserRound,
      label: "Chamado assumido",
      when: addMinutes(attendance.date, Math.max(5, Math.floor(durationMinutes * 0.08))),
      actor: attendance.operator,
    },
    {
      icon: Play,
      label: "Atendimento iniciado",
      when: addMinutes(attendance.date, Math.max(10, Math.floor(durationMinutes * 0.15))),
      actor: attendance.operator,
    },
    {
      icon: Sparkles,
      label: "Solução aplicada",
      when: addMinutes(attendance.date, Math.max(20, Math.floor(durationMinutes * 0.8))),
      actor: attendance.operator,
    },
    {
      icon: CheckCircle2,
      label: "Chamado finalizado",
      when: closedAt,
      actor: attendance.operator,
    },
  ];

  const copySolution = async () => {
    try {
      await navigator.clipboard.writeText(solution);
      toast.success("Solução copiada");
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:w-[calc(100vw-2rem)] md:w-[880px] lg:w-[960px] [&>button]:hidden">
        <DialogTitle className="sr-only">
          Detalhes do atendimento {attendance.protocol}
        </DialogTitle>

        {/* Header */}
        <header className="relative shrink-0 overflow-hidden border-b border-border bg-gradient-to-br from-success/15 via-success/8 to-success/5 px-5 py-5 md:px-7 md:py-6 dark:from-success/25 dark:via-success/12 dark:to-success/5">
          <CheckCircle2
            aria-hidden
            className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 text-success/10 dark:text-success/15"
          />
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Fechar"
            className="absolute right-3 top-3 z-10 grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted-foreground transition hover:bg-background/60 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="relative flex flex-wrap items-start gap-4 pr-10">
            <span
              aria-hidden
              className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-success/15 text-success ring-1 ring-success/25 shadow-sm"
            >
              <History className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {attendance.protocol}
                </span>
                <Badge className="rounded-md border border-success/25 bg-success/12 px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-success">
                  Finalizado
                </Badge>
                <Badge
                  className={cn(
                    "rounded-md border px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wide",
                    priorityChip[attendance.priority],
                  )}
                >
                  {attendance.priority}
                </Badge>
              </div>
              <h2 className="mt-1.5 text-[22px] font-bold leading-tight text-foreground">
                {attendance.title}
              </h2>
              {ticket && (
                <p className="mt-1 truncate text-[12.5px] text-muted-foreground">
                  <span className="font-semibold text-foreground">
                    {ticket.clientCode}
                  </span>
                  {" · "}
                  {ticket.clientName}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <CalendarClock className="h-3.5 w-3.5" />
                  <span className="font-semibold text-foreground">
                    {formatDateTime(attendance.date)}
                  </span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <UserRound className="h-3.5 w-3.5" />
                  <span className="font-semibold text-foreground">
                    {attendance.operator}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Body */}
        <div className="flex-1 space-y-5 overflow-y-auto bg-muted/30 px-4 py-5 md:px-6">
          {/* Info grid */}
          <section>
            <h3 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Dados do atendimento
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              <InfoRow icon={Folder} label="Módulo" value={attendance.module} />
              <InfoRow icon={Tag} label="Categoria" value={category} />
              <InfoRow icon={Headphones} label="Canal de origem" value={channel} />
              <InfoRow
                icon={CalendarClock}
                label="Data de abertura"
                value={formatDateTime(attendance.date)}
              />
              <InfoRow
                icon={CheckCircle2}
                label="Data de finalização"
                value={formatDateTime(closedAt)}
              />
              <InfoRow
                icon={Clock}
                label="Tempo total"
                value={formatDuration(durationMinutes)}
              />
              <InfoRow
                icon={UserRound}
                label="Atendente responsável"
                value={attendance.operator}
              />
              <InfoRow icon={Layers} label="Prioridade" value={attendance.priority} />
              <InfoRow icon={FileText} label="Protocolo" value={attendance.protocol} />
            </div>
          </section>

          {/* Problema */}
          <section className="rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-[12.5px] font-bold uppercase tracking-wider text-foreground">
                Descrição do problema
              </h3>
            </div>
            <p className="text-[13px] leading-relaxed text-foreground/90">
              {problem}
            </p>
          </section>

          {/* Solução — destaque */}
          <section className="relative overflow-hidden rounded-xl border border-success/30 bg-gradient-to-br from-success/10 via-success/5 to-transparent p-4 shadow-[0_1px_0_rgba(15,23,42,0.03)]">
            <span
              aria-hidden
              className="absolute left-0 top-0 h-full w-1 bg-success"
            />
            <div className="mb-2 flex items-center justify-between gap-2 pl-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-success" />
                <h3 className="text-[12.5px] font-bold uppercase tracking-wider text-success">
                  Solução aplicada
                </h3>
              </div>
              <button
                type="button"
                onClick={copySolution}
                className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-success/30 bg-background/60 px-2 py-1 text-[11px] font-semibold text-success transition hover:bg-success/10"
              >
                <ClipboardCopy className="h-3.5 w-3.5" />
                Copiar
              </button>
            </div>
            <p className="pl-2 text-[13.5px] font-medium leading-relaxed text-foreground">
              {solution}
            </p>
          </section>

          {/* Timeline */}
          <section className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-[12.5px] font-bold uppercase tracking-wider text-foreground">
              Timeline
            </h3>
            <ol className="relative space-y-3">
              <span
                aria-hidden
                className="absolute left-4 top-2 bottom-2 w-px bg-border"
              />
              {timeline.map((step, idx) => {
                const Icon = step.icon;
                const isLast = idx === timeline.length - 1;
                return (
                  <li
                    key={step.label}
                    className="relative grid grid-cols-[32px_1fr] items-start gap-3"
                  >
                    <span
                      aria-hidden
                      className={cn(
                        "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full ring-2 ring-card",
                        isLast
                          ? "bg-success text-success-foreground"
                          : "bg-primary/12 text-primary",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <p className="text-[12.5px] font-semibold text-foreground">
                          {step.label}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {formatDateTime(step.when)}
                        </p>
                      </div>
                      <p className="text-[11.5px] text-muted-foreground">
                        {step.actor}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        {/* Footer */}
        <footer className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-border bg-background px-4 py-3 md:px-6">
          <button
            type="button"
            onClick={copySolution}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-[12px] font-semibold text-foreground transition hover:bg-muted"
          >
            <ClipboardCopy className="h-3.5 w-3.5" />
            Copiar solução
          </button>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-[12px] font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            Fechar
          </button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
