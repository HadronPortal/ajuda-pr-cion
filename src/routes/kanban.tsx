import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragEndEvent,
  type DragStartEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  BarChart3,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Filter,
  Plus,
  Search,
  UserRound,
} from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { kanbanStore, useKanbanCards } from "@/lib/kanban-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { KanbanColumnView } from "@/components/kanban/KanbanColumn";
import { KanbanCardItem } from "@/components/kanban/KanbanCard";
import { KanbanCardDrawer } from "@/components/kanban/KanbanCardDrawer";
import {
  type KanbanCard,
  type ColumnId,
  type Priority,
  type CardType,
  kanbanColumnsDef,
  kanbanMembers,
  kanbanClients,
  priorities,
  cardTypes,
} from "@/lib/kanban-data";

export const Route = createFileRoute("/kanban")({
  head: () => ({
    meta: [
      { title: "Kanban Prócion - Demandas" },
      {
        name: "description",
        content:
          "Quadro Kanban escuro para organizar demandas e projetos internos da Prócion Sistemas.",
      },
    ],
  }),
  component: KanbanPage,
});

type Filters = {
  client: string;
  assignee: string;
  priority: string;
  type: string;
  status: string;
};

const emptyFilters: Filters = {
  client: "all",
  assignee: "all",
  priority: "all",
  type: "all",
  status: "all",
};

function KanbanPage() {
  const cards = useKanbanCards();
  const setCards = kanbanStore.setCards;
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"edit" | "create">("edit");
  const [drawerCard, setDrawerCard] = useState<KanbanCard | null>(null);
  const [defaultColumnId, setDefaultColumnId] = useState<ColumnId>("a-fazer");
  const [mobileColumn, setMobileColumn] = useState<ColumnId>("a-fazer");

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const activeFilterCount = Object.values(filters).filter((v) => v !== "all").length;

  const filteredCards = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cards.filter((c) => {
      if (c.archived && c.columnId !== "arquivado") return false;
      if (filters.client !== "all" && c.client !== filters.client) return false;
      if (filters.assignee !== "all" && c.assigneeId !== filters.assignee) return false;
      if (filters.priority !== "all" && c.priority !== filters.priority) return false;
      if (filters.type !== "all" && c.type !== filters.type) return false;
      if (filters.status !== "all" && c.columnId !== filters.status) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.client.toLowerCase().includes(q) ||
        c.module.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [cards, query, filters]);

  const cardsByColumn = useMemo(() => {
    const grouped = Object.fromEntries(
      kanbanColumnsDef.map((col) => [col.id, [] as KanbanCard[]]),
    ) as Record<ColumnId, KanbanCard[]>;
    for (const c of filteredCards) {
      (grouped[c.columnId] ?? grouped["a-fazer"]).push(c);
    }
    return grouped;
  }, [filteredCards]);


  const handleDragStart = (e: DragStartEvent) => {
    const c = cards.find((x) => x.id === e.active.id);
    if (c) setActiveCard(c);
  };

  const handleDragOver = (e: DragOverEvent) => {
    const { active, over } = e;
    if (!over) return;
    const overType = over.data.current?.type;
    const overColumn =
      overType === "column"
        ? (over.data.current?.columnId as ColumnId)
        : (over.data.current?.card?.columnId as ColumnId | undefined);
    if (!overColumn) return;

    setCards((prev) => {
      const activeIdx = prev.findIndex((c) => c.id === active.id);
      if (activeIdx === -1) return prev;
      const activeCardX = prev[activeIdx];
      if (activeCardX.columnId === overColumn) return prev;
      const next = [...prev];
      next[activeIdx] = {
        ...activeCardX,
        columnId: overColumn,
        archived: overColumn === "arquivado",
      };
      return next;
    });
  };

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveCard(null);
    const { active, over } = e;
    if (!over) return;
    if (active.id === over.id) return;
    const overType = over.data.current?.type;

    setCards((prev) => {
      const activeIdx = prev.findIndex((c) => c.id === active.id);
      if (activeIdx === -1) return prev;

      if (overType === "card") {
        const overIdx = prev.findIndex((c) => c.id === over.id);
        if (overIdx === -1) return prev;
        const next = [...prev];
        const [moved] = next.splice(activeIdx, 1);
        const targetIdx = next.findIndex((c) => c.id === over.id);
        next.splice(targetIdx, 0, {
          ...moved,
          columnId: prev[overIdx].columnId,
          archived: prev[overIdx].columnId === "arquivado",
        });
        return next;
      }
      if (overType === "column") {
        const overColumn = over.data.current?.columnId as ColumnId | undefined;
        if (!overColumn) return prev;
        return prev.map((c) =>
          c.id === active.id ? { ...c, columnId: overColumn, archived: overColumn === "arquivado" } : c,
        );
      }

      return prev;
    });
  };

  const openCard = (card: KanbanCard) => {
    setDrawerMode("edit");
    setDrawerCard(card);
    setDrawerOpen(true);
  };

  const handleArchiveCard = (card: KanbanCard) => {
    setCards((prev) =>
      prev.map((c) =>
        c.id === card.id ? { ...c, columnId: "arquivado", archived: true } : c,
      ),
    );
  };

  const handleNewCard = (columnId: ColumnId = "a-fazer") => {
    setDrawerMode("create");
    setDrawerCard(null);
    setDefaultColumnId(columnId);
    setDrawerOpen(true);
  };

  const handleSave = (card: KanbanCard) => {
    setCards((prev) => {
      if (drawerMode === "create") {
        const nextId =
          "PRC-" +
          (Math.max(
            ...prev.map((c) => parseInt(c.id.replace(/\D/g, ""), 10) || 0),
          ) + 1);
        return [...prev, { ...card, id: nextId }];
      }
      return prev.map((c) => (c.id === card.id ? card : c));
    });
  };

  const handleDelete = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  const clearFilters = () => setFilters(emptyFilters);

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-92px)] rounded-[18px] border border-slate-200 bg-slate-50 p-5 text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.06)] dark:border-white/8 dark:bg-[#050c18] dark:text-slate-100 dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[22px] font-black tracking-tight text-slate-900 dark:text-white">Kanban Prócion</h1>
            <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">Gestão inteligente de demandas e projetos internos</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative h-11 w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                type="search"
                placeholder="Buscar demandas..."
                className="h-full w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-primary/50 dark:border-white/8 dark:bg-white/[0.035] dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:bg-white/[0.055]"
              />
              <Search className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="h-11 cursor-pointer rounded-lg border-slate-200 bg-white px-4 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:border-white/8 dark:bg-white/[0.035] dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                  {activeFilterCount > 0 && <Badge className="ml-2 h-5 min-w-5 bg-primary text-[10px]">{activeFilterCount}</Badge>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">Filtros</p>
                  {activeFilterCount > 0 && (
                    <button onClick={clearFilters} className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      Limpar
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <FilterSelect label="Cliente" value={filters.client} onChange={(v) => setFilters({ ...filters, client: v })} options={[{ value: "all", label: "Todos" }, { value: "Interno", label: "Interno" }, ...kanbanClients.map((c) => ({ value: c, label: c }))]} />
                  <FilterSelect label="Responsavel" value={filters.assignee} onChange={(v) => setFilters({ ...filters, assignee: v })} options={[{ value: "all", label: "Todos" }, ...kanbanMembers.map((m) => ({ value: m.id, label: m.name }))]} />
                  <FilterSelect label="Prioridade" value={filters.priority} onChange={(v) => setFilters({ ...filters, priority: v as Priority | "all" })} options={[{ value: "all", label: "Todas" }, ...priorities.map((p) => ({ value: p, label: p }))]} />
                  <FilterSelect label="Tipo" value={filters.type} onChange={(v) => setFilters({ ...filters, type: v as CardType | "all" })} options={[{ value: "all", label: "Todos" }, ...cardTypes.map((t) => ({ value: t, label: t }))]} />
                  <FilterSelect label="Status" value={filters.status} onChange={(v) => setFilters({ ...filters, status: v })} options={[{ value: "all", label: "Todos" }, ...kanbanColumnsDef.map((c) => ({ value: c.id, label: c.title }))]} />
                </div>
              </PopoverContent>
            </Popover>

            <button className="grid h-11 w-11 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/8 dark:bg-white/[0.035] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
              <BarChart3 className="h-4 w-4" />
            </button>
            <button className="relative grid h-11 w-11 cursor-pointer place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-white/8 dark:bg-white/[0.035] dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-black text-white">3</span>
            </button>
            <Button onClick={() => handleNewCard()} className="h-11 rounded-lg bg-violet-600 px-5 text-xs font-bold text-white shadow-[0_12px_28px_rgba(124,58,237,0.28)] hover:bg-violet-500">
              <Plus className="mr-2 h-4 w-4" />
              Nova demanda
            </Button>
          </div>
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard icon={BriefcaseBusiness} label="A Fazer" value={String(cardsByColumn["a-fazer"].length)} color="blue" />
          <MetricCard icon={Clock3} label="Em andamento" value={String(cardsByColumn["em-andamento"].length)} color="amber" />
          <MetricCard icon={UserRound} label="Em revisão" value={String(cardsByColumn["homologacao"].length + cardsByColumn["concluido"].length)} color="violet" />
          <MetricCard icon={CheckCircle2} label="Concluídos" value={String(cardsByColumn["arquivado"].length)} color="emerald" />
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="hidden xl:block">
            <div className="overflow-x-auto kanban-scrollbar">
              <div className="flex min-w-max gap-4 pb-2">
                {kanbanColumnsDef.map((col) => (
                  <KanbanColumnView
                    key={col.id}
                    column={col}
                    cards={cardsByColumn[col.id]}
                    onCardClick={openCard}
                    onArchiveCard={handleArchiveCard}
                    onAddCard={handleNewCard}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="xl:hidden">
            <Tabs value={mobileColumn} onValueChange={(v) => setMobileColumn(v as ColumnId)}>
              <TabsList className="mb-3 flex h-auto w-full justify-start overflow-x-auto rounded-xl bg-slate-100 p-1 dark:bg-white/6">
                {kanbanColumnsDef.map((c) => (
                  <TabsTrigger key={c.id} value={c.id} className="cursor-pointer whitespace-nowrap text-xs text-slate-600 data-[state=active]:bg-white data-[state=active]:text-slate-900 dark:text-slate-300 dark:data-[state=active]:bg-white/10 dark:data-[state=active]:text-white">
                    {c.title}
                    <span className="ml-1.5 rounded bg-slate-200 px-1.5 py-0.5 text-[10px] dark:bg-white/10">
                      {cardsByColumn[c.id].length}
                    </span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            {kanbanColumnsDef
              .filter((c) => c.id === mobileColumn)
              .map((col) => (
                <KanbanColumnView
                  key={col.id}
                  column={col}
                  cards={cardsByColumn[col.id]}
                  onCardClick={openCard}
                  onArchiveCard={handleArchiveCard}
                  onAddCard={handleNewCard}
                />
              ))}
          </div>

          <DragOverlay>
            {activeCard && <KanbanCardItem card={activeCard} overlay />}
          </DragOverlay>
        </DndContext>
      </div>

      <KanbanCardDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        card={drawerCard}
        mode={drawerMode}
        defaultColumnId={defaultColumnId}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </AppShell>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof BriefcaseBusiness;
  label: string;
  value: string;
  color: "blue" | "amber" | "violet" | "emerald";
}) {
  const tones = {
    blue: "bg-blue-500 text-blue-200",
    amber: "bg-amber-500 text-amber-200",
    violet: "bg-violet-500 text-violet-200",
    emerald: "bg-emerald-500 text-emerald-200",
  };

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.045] p-4 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
      <div className="flex items-center gap-3">
        <div className={cn("grid h-11 w-11 place-items-center rounded-xl bg-opacity-25", tones[color])}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-[11px] font-medium text-slate-400">{label}</p>
          <div className="mt-1 flex items-end gap-3">
            <span className="text-3xl font-black leading-none text-white">{value}</span>
          </div>
        </div>
      </div>
      <MiniSpark color={color} />
    </div>
  );
}

function MiniSpark({ color }: { color: "blue" | "amber" | "violet" | "emerald" }) {
  const stroke = {
    blue: "#248cff",
    amber: "#f59e0b",
    violet: "#a855f7",
    emerald: "#22c55e",
  }[color];

  return (
    <svg className="mt-4 h-8 w-full overflow-visible" viewBox="0 0 160 32" fill="none" preserveAspectRatio="none">
      <path d="M2 24 C20 18 30 19 43 12 C56 23 74 25 91 20 C110 15 121 7 138 13 C147 17 153 15 158 12" stroke={stroke} strokeWidth="2.5" />
      <path d="M2 29 C28 25 50 25 75 24 C106 22 132 20 158 18" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
    </svg>
  );
}


function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground">{label}</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="h-9 cursor-pointer text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
