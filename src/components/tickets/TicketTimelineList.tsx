import { useMemo } from "react";
import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Paperclip,
  PlayCircle,
  Send,
  ShieldCheck,
  UserPlus,
} from "lucide-react";
import type { TicketEvent } from "@/lib/tickets-store";

export const timelineEventPresentation: Record<
  TicketEvent["kind"],
  { label: string; color: string; softColor: string; icon: typeof FileText }
> = {
  created: {
    label: "Chamado criado",
    color: "#8b5bd6",
    softColor: "rgba(139, 91, 214, 0.24)",
    icon: MessageSquare,
  },
  attached: {
    label: "Arquivo anexado",
    color: "#f59b45",
    softColor: "rgba(245, 155, 69, 0.24)",
    icon: Paperclip,
  },
  assumed: {
    label: "Chamado assumido",
    color: "#47b985",
    softColor: "rgba(71, 185, 133, 0.24)",
    icon: UserPlus,
  },
  attend: {
    label: "Atendimento iniciado",
    color: "#38a6d9",
    softColor: "rgba(56, 166, 217, 0.24)",
    icon: PlayCircle,
  },
  status: {
    label: "Status alterado",
    color: "#e04d87",
    softColor: "rgba(224, 77, 135, 0.24)",
    icon: ShieldCheck,
  },
  message: {
    label: "Retorno enviado",
    color: "#5877d8",
    softColor: "rgba(88, 119, 216, 0.24)",
    icon: Send,
  },
  note: {
    label: "Nota interna",
    color: "#d79531",
    softColor: "rgba(215, 149, 49, 0.24)",
    icon: FileText,
  },
  solution: {
    label: "Solução aplicada",
    color: "#20ad74",
    softColor: "rgba(32, 173, 116, 0.24)",
    icon: Sparkles,
  },
  closed: {
    label: "Chamado encerrado",
    color: "#20ad74",
    softColor: "rgba(32, 173, 116, 0.24)",
    icon: CheckCircle2,
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Variant = "full" | "compact";

export function TicketTimelineList({
  events,
  variant = "full",
  limit,
  emptyLabel = "Nenhum evento registrado ainda.",
}: {
  events: TicketEvent[];
  variant?: Variant;
  limit?: number;
  emptyLabel?: string;
}) {
  const sorted = useMemo(() => {
    const arr = [...events].sort(
      (a, b) => new Date(a.when).getTime() - new Date(b.when).getTime(),
    );
    return typeof limit === "number" ? arr.slice(0, limit) : arr;
  }, [events, limit]);

  if (sorted.length === 0) {
    return (
      <p className="py-10 text-center text-[13px] text-muted-foreground">
        {emptyLabel}
      </p>
    );
  }

  const isCompact = variant === "compact";

  // Sizing tokens per variant
  const rowMinH = isCompact ? "min-h-[92px]" : "min-h-[132px]";
  const colTemplate = isCompact
    ? "grid-cols-[60px_minmax(0,1fr)] gap-3"
    : "grid-cols-[76px_minmax(0,1fr)] gap-4 sm:grid-cols-[94px_minmax(0,1fr)] sm:gap-6";
  const ringSize = isCompact ? "h-[58px] w-[58px] border-[5px]" : "h-[76px] w-[76px] border-[7px] sm:h-[88px] sm:w-[88px]";
  const iconWrap = isCompact ? "mt-[13px] h-8 w-8" : "mt-[19px] h-10 w-10 sm:mt-[22px] sm:h-11 sm:w-11";
  const iconSize = isCompact ? "h-4 w-4" : "h-5 w-5";
  const connectorLeft = isCompact ? "left-[29px]" : "left-[37px] sm:left-[47px]";
  const connectorTop = isCompact ? "top-[52px] h-[calc(100%-32px)]" : "top-[66px] h-[calc(100%-42px)]";
  const topDot = isCompact ? "h-2 w-2" : "h-2.5 w-2.5";
  const bottomDotTop = isCompact ? "top-[54px]" : "top-[72px] sm:top-[84px]";
  const dateBadge = isCompact
    ? "min-w-[96px] px-2.5 py-0.5 text-[10.5px]"
    : "min-w-[112px] px-3 py-1 text-[11px]";
  const titleSize = isCompact ? "text-[11px]" : "text-[12px]";
  const descSize = isCompact ? "text-[12px] leading-[18px]" : "text-[13px] leading-5";
  const metaSize = isCompact ? "text-[10.5px]" : "text-[11.5px]";
  const timeSize = isCompact ? "text-[10.5px]" : "text-[11px]";
  const articlePad = isCompact ? "pb-5 pt-0.5" : "pb-8 pt-1";
  const maxW = isCompact ? "max-w-full" : "max-w-[720px]";

  return (
    <ol className={`mx-auto ${maxW}`}>
      {sorted.map((event, index) => {
        const presentation = timelineEventPresentation[event.kind];
        const Icon = presentation.icon;
        const isLast = index === sorted.length - 1;

        return (
          <li
            key={event.id}
            className={`relative grid ${rowMinH} ${colTemplate}`}
          >
            {!isLast && (
              <span
                aria-hidden
                className={`absolute ${connectorLeft} ${connectorTop} w-[3px] -translate-x-1/2 rounded-full`}
                style={{ backgroundColor: presentation.softColor }}
              />
            )}

            <div className="relative flex justify-center pt-1">
              <span
                aria-hidden
                className={`absolute top-0 rounded-full ${ringSize}`}
                style={{ borderColor: presentation.softColor }}
              />
              <span
                aria-hidden
                className={`absolute left-1/2 top-[6px] -translate-x-1/2 rounded-full ${topDot}`}
                style={{ backgroundColor: presentation.color }}
              />
              <span
                className={`relative grid place-items-center rounded-full text-white shadow-sm ${iconWrap}`}
                style={{ backgroundColor: presentation.color }}
              >
                <Icon className={iconSize} />
              </span>
              <span
                aria-hidden
                className={`absolute left-1/2 -translate-x-1/2 rounded-full ${bottomDotTop} h-2 w-2`}
                style={{ backgroundColor: presentation.color }}
              />
            </div>

            <article className={`min-w-0 ${articlePad}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center justify-center rounded-full font-medium text-white shadow-sm ${dateBadge}`}
                  style={{ backgroundColor: presentation.color }}
                >
                  {formatDate(event.when)}
                </span>
                <span className={`${timeSize} text-muted-foreground`}>
                  {formatTime(event.when)}
                </span>
              </div>

              <h3
                className={`mt-2 ${titleSize} font-semibold uppercase tracking-normal`}
                style={{ color: presentation.color }}
              >
                {presentation.label}
              </h3>
              <p className={`mt-1 ${descSize} text-foreground break-words`}>
                {event.description}
              </p>
              <p className={`mt-1 ${metaSize} text-muted-foreground`}>
                {event.actor} · {event.actorType}
              </p>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
