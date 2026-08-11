import { useMemo } from "react";
import {
  Activity,
  CalendarClock,
  CheckCircle2,
  FileText,
  MessageSquare,
  PlayCircle,
  Send,
  ShieldCheck,
  UserPlus,
  XCircle,
} from "lucide-react";
import type { CompanyLeadActivity } from "@/lib/company-lead-activities.functions.ts";

const activityConfig: Record<
  CompanyLeadActivity["kind"],
  { label: string; color: string; icon: any }
> = {
  prospeccao: { label: "Prospecção", color: "text-blue-500", icon: Search },
  relacionamento: { label: "Relacionamento", color: "text-purple-500", icon: MessageSquare },
  demonstracao: { label: "Demonstração", color: "text-indigo-500", icon: PlayCircle },
  proposta: { label: "Proposta", color: "text-amber-500", icon: FileText },
  negociacao: { label: "Negociação", color: "text-orange-500", icon: Activity },
  alteracao_etapa: { label: "Alteração de etapa", color: "text-emerald-500", icon: ShieldCheck },
  agendamento: { label: "Agendamento", color: "text-cyan-500", icon: CalendarClock },
  concluida: { label: "Atividade concluída", color: "text-green-500", icon: CheckCircle2 },
  cancelada: { label: "Atividade cancelada", color: "text-red-500", icon: XCircle },
};

// Search is not in the imports above, adding it
import { Search } from "lucide-react";

export function LeadTimeline({ activities }: { activities: CompanyLeadActivity[] }) {
  if (activities.length === 0) {
    return (
      <div className="flex h-32 flex-col items-center justify-center rounded-lg border border-dashed text-muted-foreground">
        <Activity className="mb-2 h-8 w-8 opacity-20" />
        <p className="text-sm">Nenhuma atividade registrada</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 before:absolute before:inset-y-0 before:left-[15px] before:w-px before:bg-border">
      {activities.map((activity) => {
        const config = activityConfig[activity.kind] || {
          label: activity.kind,
          color: "text-muted-foreground",
          icon: Activity,
        };
        const Icon = config.icon;

        return (
          <div key={activity.id} className="relative pl-10">
            <span
              className={`absolute left-0 grid h-8 w-8 place-items-center rounded-full bg-background ring-1 ring-border ${config.color}`}
            >
              <Icon className="h-4 w-4" />
            </span>
            <div className="rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <h4 className="text-[13px] font-semibold text-foreground">{config.label}</h4>
                <time className="text-[11px] text-muted-foreground">
                  {new Date(activity.occurred_at).toLocaleString("pt-BR")}
                </time>
              </div>
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                {activity.description}
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <UserPlus className="h-3.5 w-3.5" />
                  {activity.actor_name} ({activity.actor_role})
                </span>
                {activity.contact_used && (
                  <span className="flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {activity.contact_used}
                  </span>
                )}
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] uppercase font-medium">
                  {activity.status}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
