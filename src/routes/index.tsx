import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  GitBranch,
  KanbanSquare,
  Search,
  Sparkles,
  Clock,
  Tag,
} from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    tone: "bg-[#e8f7fc] text-primary",
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
    tone: "bg-[#eef0ff] text-[#4d5bd8]",
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
          className="mt-6 flex w-full max-w-2xl items-center gap-2 rounded-full bg-white p-1.5 shadow-lg"
          onSubmit={(e) => e.preventDefault()}
        >
          <Search className="ml-3 h-5 w-5 shrink-0 text-[#8b91ad]" />
          <input
            type="search"
            placeholder="Buscar por artigos, erros, módulos..."
            className="h-10 flex-1 bg-transparent text-sm text-[#191d33] outline-none placeholder:text-[#8b91ad]"
          />
          <Button asChild className="rounded-full bg-[#191d33] px-5 text-white hover:bg-[#191d33]/90">
            <Link to="/base-de-conhecimento">Buscar</Link>
          </Button>
        </form>
      </section>

      {/* Atalhos */}
      <section className="mb-10">
        <div className="mb-4 flex items-end justify-between">
          <h2 className="text-lg font-bold text-[#191d33]">Atalhos</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {shortcuts.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group"
            >
              <Card className="h-full rounded-[14px] border-0 bg-white p-5 shadow-[0_10px_26px_rgba(25,29,51,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(25,29,51,0.10)]">
                <div className={`grid h-11 w-11 place-items-center rounded-xl ${s.tone}`}>
                  <s.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-bold text-[#25293b]">{s.label}</p>
                <p className="mt-1 text-xs text-[#8b91ad]">{s.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition group-hover:opacity-100">
                  Abrir <ArrowRight className="h-3 w-3" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Últimos artigos + Versões */}
      <section className="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_1fr]">
        <Card className="rounded-[14px] border-0 bg-white p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h3 className="text-base font-bold text-[#191d33]">Últimos artigos</h3>
              <p className="mt-0.5 text-xs text-[#8b91ad]">
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
                    className="flex items-start gap-4 py-4 transition hover:bg-[#f7f9fc]/60"
                  >
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[#eef5ff] text-primary">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#25293b]">
                        {a.title}
                      </p>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[#8b91ad]">
                        {cat && (
                          <span className="inline-flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {cat.label}
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

        <Card className="rounded-[14px] border-0 bg-white p-6 shadow-[0_10px_26px_rgba(25,29,51,0.06)]">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h3 className="text-base font-bold text-[#191d33]">Últimas versões</h3>
              <p className="mt-0.5 text-xs text-[#8b91ad]">Release notes recentes.</p>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary">
              <Link to="/versoes">
                Ver todas <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
          <ol className="relative space-y-5 border-l border-[#eef1f8] pl-5">
            {latestVersions.map((v) => (
              <li key={v.version} className="relative">
                <span className="absolute -left-[26px] top-1 grid h-4 w-4 place-items-center rounded-full bg-white ring-2 ring-primary">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#191d33]">{v.version}</span>
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
                  <span className="ml-auto text-[11px] text-[#8b91ad]">{v.date}</span>
                </div>
                <ul className="mt-2 space-y-1 text-xs text-[#555b75]">
                  {v.highlights.slice(0, 3).map((h) => (
                    <li key={h} className="flex gap-1.5">
                      <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#c5cadb]" />
                      <span>{h}</span>
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
