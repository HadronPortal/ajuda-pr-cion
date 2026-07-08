import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  Headset,
  KanbanSquare,
  Search,
  Sparkles,
  Clock,
  Tag,
} from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { currentUser } from "@/lib/mock-data";
import { supportTickets } from "@/lib/support-tickets-data";
import { Badge } from "@/components/ui/badge";
import { kbArticlesFull, kbCategoriesFull } from "@/lib/kb-data";
import { versions } from "@/lib/mock-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portal Prócion — Central de Ajuda" },
      {
        name: "description",
        content:
          "Portal Prócion: central de ajuda com base de conhecimento, atualizações, versões e Kanban.",
      },
      { property: "og:title", content: "Portal Prócion — Central de Ajuda" },
      {
        property: "og:description",
        content:
          "Encontre artigos, versões e novidades da Prócion Sistemas em um só lugar.",
      },
    ],
  }),
  component: HomePage,
});

const shortcuts = [
  {
    to: "/base-de-conhecimento",
    label: "Base de Conhecimento",
    description: "Guias, manuais e correções.",
    icon: BookOpen,
    tone: "bg-primary/10 text-primary",
  },
  {
    to: "/atualizacoes",
    label: "Atualizações",
    description: "Novidades e melhorias recentes.",
    icon: Sparkles,
    tone: "bg-[#fff4d8] text-[#c47a13]",
  },
  {
    to: "/versoes",
    label: "Versões",
    description: "Histórico e release notes.",
    icon: GitBranch,
    tone: "bg-[#eafaf1] text-[#23a061]",
  },
  {
    to: "/kanban",
    label: "Kanban Prócion",
    description: "Suas demandas em andamento.",
    icon: KanbanSquare,
    tone: "bg-primary/10 text-[#4d5bd8]",
  },
] as const;

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Math.round((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (diff <= 0) return "hoje";
  if (diff === 1) return "ontem";
  if (diff < 7) return `${diff} dias atrás`;
  if (diff < 30) return `${Math.floor(diff / 7)} sem atrás`;
  return d.toLocaleDateString("pt-BR");
}

function HomePage() {
  const latestArticles = [...kbArticlesFull]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 5);
  const latestVersions = versions.slice(0, 4);
  const categoriesMap = Object.fromEntries(
    kbCategoriesFull.map((c) => [c.id, c]),
  );

  return (
    <AppShell>
      {/* Hero + busca */}
      <section className="mb-8 rounded-[18px] bg-gradient-to-br from-[#0b97c4] via-[#0490d1] to-[#313866] p-8 text-white shadow-[0_18px_40px_rgba(11,151,196,0.22)] md:p-12">
        <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
          Portal Prócion
        </p>
        <h1 className="mt-2 max-w-2xl text-[26px] font-bold leading-tight md:text-[34px]">
          Como podemos ajudar você hoje?
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white/80 md:text-base">
          Pesquise na base de conhecimento, acompanhe versões e resolva demandas no Kanban.
        </p>

        <form
          className="mt-6 flex w-full max-w-2xl items-center gap-2 rounded-full bg-white dark:bg-[#20263d] p-1.5 shadow-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search className="ml-3 h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="search"
            placeholder="Buscar por artigos, erros, módulos..."
            className="h-10 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Button asChild className="rounded-full bg-[#191d33] px-5 text-white hover:bg-[#191d33]/90">
            <Link to="/base-de-conhecimento">Buscar</Link>
          </Button>
        </form>
      </section>

      {/* Atalhos */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-foreground">Atalhos</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group"
            >
              <Card className="h-full rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-5 shadow-[0_10px_26px_rgba(25,29,51,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(25,29,51,0.10)]">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tone}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-bold text-foreground">{s.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  Abrir <ArrowRight className="h-3 w-3" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Últimos artigos + Versões */}
      <section className="grid min-w-0 grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="min-w-0 overflow-hidden rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Últimos artigos</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Atualizações recentes na base de conhecimento.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
              <Link to="/base-de-conhecimento">
                Ver todos <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <ul className="divide-y divide-[#f1f3f8]">
            {latestArticles.map((a) => {
              const cat = categoriesMap[a.category];
              return (
                <li key={a.slug}>
                  <Link
                    to="/base-de-conhecimento/$slug"
                    params={{ slug: a.slug }}
                    className="flex items-start gap-4 py-4 transition hover:bg-muted/40/60"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {a.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                        {cat && (
                          <span className="inline-flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {cat.name}
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatRelative(a.updatedAt)}
                        </span>
                        {a.module && (
                          <Badge variant="secondary" className="rounded-full text-[10px]">
                            {a.module}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <ArrowRight className="mt-2 h-4 w-4 shrink-0 text-[#c5cadb]" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="min-w-0 overflow-hidden rounded-[14px] border-0 bg-white dark:bg-[#20263d] p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-foreground">Últimas versões</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">Release notes recentes.</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="shrink-0 text-primary hover:text-primary">
              <Link to="/versoes">
                Ver todas <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <ol className="relative space-y-5 border-l border-border pl-5">
            {latestVersions.map((v) => (
              <li key={v.version} className="relative min-w-0">
                <span className="absolute -left-[26px] top-1 grid h-4 w-4 place-items-center rounded-full bg-white dark:bg-[#20263d] ring-2 ring-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="shrink-0 text-sm font-bold text-foreground">{v.version}</span>
                  <Badge
                    variant="secondary"
                    className={`rounded-full text-[10px] ${
                      v.type === "Correção"
                        ? "bg-[#fff4d8] text-[#c47a13]"
                        : "bg-[#eafaf1] text-[#23a061]"
                    }`}
                  >
                    {v.type}
                  </Badge>
                  <span className="ml-auto text-[11px] text-muted-foreground whitespace-nowrap">{v.date}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {v.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex min-w-0 gap-1.5">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#c5cadb]" />
                      <span className="min-w-0 break-words">{h}</span>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </Card>
      </section>
    </AppShell>
  );
}
