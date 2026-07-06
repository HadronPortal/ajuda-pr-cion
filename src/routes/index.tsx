import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  FileText,
  Sparkles,
  GitBranch,
  AlertTriangle,
  Scale,
  Megaphone,
  Search,
  ArrowRight,
  Clock,
  CheckCircle2,
  CircleDashed,
  CircleDot,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  shortcuts,
  latestArticles,
  latestVersions,
  recentTasks,
  currentUser,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal Prócion — Central de Ajuda e Produtividade" },
      {
        name: "description",
        content:
          "Portal Prócion: base de conhecimento, atualizações, versões, kanban e gestão de clientes em um só lugar.",
      },
      { property: "og:title", content: "Portal Prócion" },
      {
        property: "og:description",
        content:
          "Central de ajuda e produtividade da Prócion Sistemas para clientes, parceiros e equipe interna.",
      },
    ],
  }),
  component: DashboardPage,
});

const iconMap: Record<string, LucideIcon> = {
  BookOpen,
  FileText,
  Sparkles,
  GitBranch,
  AlertTriangle,
  Scale,
  Megaphone,
};

const toneClasses: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/15 text-accent-foreground",
  success: "bg-success/15 text-success",
  warning: "bg-warning/20 text-warning-foreground",
};

const statusIcon = (status: string) => {
  if (status === "Concluído") return CheckCircle2;
  if (status === "Em andamento") return CircleDot;
  return CircleDashed;
};

function DashboardPage() {
  return (
    <AppShell>
      {/* Hero search */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-6 sm:p-10 mb-8">
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />
          <div className="absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-primary-foreground/10 blur-3xl" />
        </div>
        <div className="relative">
          <p className="text-xs uppercase tracking-widest text-primary-foreground/70">
            Olá, {currentUser.name.split(" ")[0]}
          </p>
          <h2 className="mt-2 text-2xl sm:text-4xl font-semibold tracking-tight max-w-2xl">
            Como podemos ajudar?
          </h2>
          <p className="mt-2 text-sm sm:text-base text-primary-foreground/80 max-w-xl">
            Busque em manuais, artigos, atualizações e versões do Portal Prócion.
          </p>
          <div className="mt-6 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Ex: como emitir NF-e, conciliação bancária, versão 2026.3..."
                className="w-full h-14 pl-12 pr-32 rounded-xl bg-background text-foreground placeholder:text-muted-foreground shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-4 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:opacity-90 transition">
                Buscar
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-primary-foreground/70">
              <span>Populares:</span>
              {["SPED Fiscal", "NF-e 4.00", "Pix Automático", "Kanban"].map((t) => (
                <button
                  key={t}
                  className="rounded-full border border-primary-foreground/20 px-2.5 py-0.5 hover:bg-primary-foreground/10 transition"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Atalhos</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
          {shortcuts.map((s) => {
            const Icon = iconMap[s.icon];
            return (
              <Card
                key={s.key}
                className="group cursor-pointer p-4 hover:border-primary/40 hover:shadow-md transition-all"
              >
                <div
                  className={cn(
                    "grid h-10 w-10 place-items-center rounded-lg mb-3",
                    toneClasses[s.tone],
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-medium leading-tight">{s.label}</p>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                  {s.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Two-column: latest articles + latest versions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Últimos artigos</h3>
            <button className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
              Ver todos <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <Card className="divide-y divide-border p-0 overflow-hidden">
            {latestArticles.map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-4 p-4 hover:bg-muted/40 transition cursor-pointer"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-secondary text-secondary-foreground">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {a.category}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {a.readTime}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    por {a.author} · {a.date}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Últimas versões</h3>
            <button className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
              Histórico <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <Card className="p-4 space-y-4">
            {latestVersions.map((v) => (
              <div key={v.id} className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                  <GitBranch className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold">{v.version}</p>
                    <Badge
                      className={cn(
                        "text-[10px] px-1.5 py-0",
                        v.badge === "success"
                          ? "bg-success/15 text-success hover:bg-success/15"
                          : "bg-warning/25 text-warning-foreground hover:bg-warning/25",
                      )}
                    >
                      {v.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">
                    {v.title}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1">{v.date}</p>
                </div>
              </div>
            ))}
          </Card>
        </section>
      </div>

      {/* Recent projects and tasks */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Projetos e tarefas recentes</h3>
          <button className="text-xs font-medium text-primary hover:underline inline-flex items-center gap-1">
            Abrir Kanban <ArrowRight className="h-3 w-3" />
          </button>
        </div>
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="text-left font-medium px-4 py-3">Tarefa</th>
                  <th className="text-left font-medium px-4 py-3 hidden md:table-cell">
                    Projeto
                  </th>
                  <th className="text-left font-medium px-4 py-3">Status</th>
                  <th className="text-left font-medium px-4 py-3 hidden sm:table-cell">
                    Prazo
                  </th>
                  <th className="text-left font-medium px-4 py-3">Resp.</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentTasks.map((t) => {
                  const Icon = statusIcon(t.status);
                  return (
                    <tr key={t.id} className="hover:bg-muted/30 transition">
                      <td className="px-4 py-3 font-medium">{t.title}</td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                        {t.project}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 text-xs font-medium",
                            t.status === "Concluído" && "text-success",
                            t.status === "Em andamento" && "text-primary",
                            t.status === "Aguardando" && "text-muted-foreground",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                        {t.due}
                      </td>
                      <td className="px-4 py-3">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                            {t.assignee}
                          </AvatarFallback>
                        </Avatar>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </AppShell>
  );
}
