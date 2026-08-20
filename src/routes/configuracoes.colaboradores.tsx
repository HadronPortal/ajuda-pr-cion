import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  Mail,
  RefreshCw,
  Search,
  UserRound,
  X,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  type Collaborator,
  collaboratorMatches,
  departmentLabel,
  useCollaborators,
} from "@/lib/collaborators-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/configuracoes/colaboradores")({
  head: () => ({ meta: [{ title: "Colaboradores - Configurações - Portal Prócion" }] }),
  component: CollaboratorsSettingsPage,
});

const PAGE_SIZE = 25;

function CollaboratorsSettingsPage() {
  const { allCollaborators, loading, error, reload } = useCollaborators({ onlyActive: false });
  const [acronym, setAcronym] = useState("");
  const [status, setStatus] = useState("all");
  const [department, setDepartment] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<Collaborator | null>(null);

  const departments = useMemo(
    () =>
      [...new Set(allCollaborators.map((item) => item.department).filter(Boolean))]
        .map((value) => String(value))
        .sort((a, b) => departmentLabel(a).localeCompare(departmentLabel(b), "pt-BR")),
    [allCollaborators],
  );

  const filtered = useMemo(
    () =>
      allCollaborators.filter((item) => {
        if (acronym && !(item.acronym ?? "").toUpperCase().includes(acronym.toUpperCase())) {
          return false;
        }
        if (status === "active" && !item.active) return false;
        if (status === "inactive" && item.active) return false;
        if (department && item.department !== department) return false;
        return collaboratorMatches(item, query);
      }),
    [acronym, allCollaborators, department, query, status],
  );

  useEffect(() => setPage(0), [acronym, department, query, status]);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const rows = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  return (
    <AppShell fullWidth>
      <PageHeader
        title="Colaboradores"
        description="Cadastros e acessos da equipe Prócion."
        breadcrumbs={[{ label: "Configurações" }, { label: "Colaboradores" }]}
      />

      <section className="mb-5 grid gap-3 lg:grid-cols-[180px_190px_240px_minmax(260px,1fr)_auto]">
        <Input
          value={acronym}
          onChange={(event) => setAcronym(event.target.value.toUpperCase())}
          placeholder="Sigla"
          className="h-10 uppercase"
          aria-label="Filtrar por sigla"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className={selectClass}
        >
          <option value="all">Todos os status</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
        <select
          value={department}
          onChange={(event) => setDepartment(event.target.value)}
          className={selectClass}
        >
          <option value="">Todos os departamentos</option>
          {departments.map((item) => (
            <option key={item} value={item}>
              {departmentLabel(item)}
            </option>
          ))}
        </select>
        <label className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar por nome, e-mail, função ou código"
            className="h-10 pl-9"
          />
        </label>
        <Button variant="outline" className="h-10 gap-2" onClick={reload} disabled={loading}>
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Atualizar
        </Button>
      </section>

      <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left text-sm">
            <colgroup>
              <col className="w-[15%]" />
              <col className="w-[10%]" />
              <col className="w-[17%]" />
              <col className="w-[23%]" />
              <col className="w-[27%]" />
              <col className="w-[8%]" />
            </colgroup>
            <thead className="border-b bg-muted/35 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Sigla / Cód.</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Departamento</th>
                <th className="px-4 py-3 font-medium">Nome</th>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 text-center font-medium">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan={6} className="h-52 text-center text-muted-foreground">
                    Carregando colaboradores...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="h-52 px-6 text-center text-destructive">
                    Não foi possível carregar os colaboradores: {error}
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="h-52 text-center text-muted-foreground">
                    Nenhum colaborador encontrado.
                  </td>
                </tr>
              ) : (
                rows.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-muted/25">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">
                        {item.acronym || "Não informado"}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Cód. Hádron: {item.operatorCode || "Não informado"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5",
                          item.active
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.active ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                        {item.active ? "Ativo" : "Inativo"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {departmentLabel(item.department) || "Não informado"}
                    </td>
                    <td className="px-4 py-3 text-foreground">{item.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.email || "Não informado"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Visualizar colaborador"
                        onClick={() => setSelected(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t px-5 py-3 text-sm text-muted-foreground">
          <span>
            Mostrando {filtered.length ? safePage * PAGE_SIZE + 1 : 0} a{" "}
            {Math.min((safePage + 1) * PAGE_SIZE, filtered.length)} de {filtered.length}{" "}
            colaboradores
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={safePage === 0}
              onClick={() => setPage(safePage - 1)}
              aria-label="Página anterior"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>
              Página {safePage + 1} de {pageCount}
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled={safePage + 1 >= pageCount}
              onClick={() => setPage(safePage + 1)}
              aria-label="Próxima página"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </footer>
      </div>

      <CollaboratorDetails collaborator={selected} onClose={() => setSelected(null)} />
    </AppShell>
  );
}

function CollaboratorDetails({
  collaborator,
  onClose,
}: {
  collaborator: Collaborator | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={Boolean(collaborator)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary">
            <UserRound className="h-5 w-5" />
          </div>
          <DialogTitle>{collaborator?.name}</DialogTitle>
          <DialogDescription>
            {collaborator?.acronym || "Colaborador sem sigla cadastrada"}
          </DialogDescription>
        </DialogHeader>
        {collaborator && (
          <div className="grid gap-x-6 gap-y-5 border-t pt-5 sm:grid-cols-2">
            <Detail label="Status" value={collaborator.active ? "Ativo" : "Inativo"} />
            <Detail label="Código Hádron" value={collaborator.operatorCode || "Não informado"} />
            <Detail
              label="Departamento"
              value={departmentLabel(collaborator.department) || "Não informado"}
            />
            <Detail label="Função" value={collaborator.jobTitle || "Não informado"} />
            <div className="sm:col-span-2">
              <p className="text-xs uppercase text-muted-foreground">E-mail</p>
              <p className="mt-1 flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                {collaborator.email || "Não informado"}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm text-foreground">{value}</p>
    </div>
  );
}

const selectClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/20";
