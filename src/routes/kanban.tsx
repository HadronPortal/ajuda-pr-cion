import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
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
  Plus,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from "lucide-react";
import { AppShell } from "@/components/portal/AppShell";
import { kanbanStore, useKanbanCards } from "@/lib/kanban-store";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
      { title: "Kanban Prócion — Gestão visual de demandas" },
      {
        name: "description",
        content:
          "Quadro Kanban para organizar demandas, suporte, implantação e melhorias da Prócion Sistemas.",
      },
    ],
  }),
  component: KanbanPage,
});

const boards = [
  { id: "geral", name: "Quadro Geral" },
  { id: "suporte", name: "Suporte & Atendimento" },
  { id: "implantacao", name: "Implantação" },
  { id: "produto", name: "Produto & Melhorias" },
];

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
  const [activeBoard, setActiveBoard] = useState(boards[0].id);
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
      {/* Board header */}
      <div className="mb-5 space-y-4">
        <div className="grid grid-cols-1 items-center gap-3 sm:flex sm:flex-wrap sm:justify-between">
          <div className="min-w-0 flex items-center gap-3">
            <div>
              <p className="text-xs font-semibold text-primary">Kanban Prócion</p>
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-[26px] font-bold tracking-tight text-foreground truncate">
                  {boards.find((b) => b.id === activeBoard)?.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="grid w-full min-w-0 max-w-full shrink-0 grid-cols-1 items-center gap-2 md:flex md:w-auto md:justify-start md:gap-3">
            <div className="hidden md:flex -space-x-2">
              {kanbanMembers.slice(0, 5).map((m) => (
                <Avatar key={m.id} className="h-8 w-8 ring-2 ring-background">
                  <AvatarFallback className={cn("text-[10px] font-semibold", m.color)}>
                    {m.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-[10px] font-medium text-muted-foreground ring-2 ring-background">
                +{Math.max(0, kanbanMembers.length - 5)}
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full min-w-0 rounded-xl border-border bg-white dark:bg-[#20263d] px-2 text-xs md:w-auto md:px-3 md:text-sm">
              <Link to="/kanban-dashboard">Dashboard</Link>
            </Button>
            <Button size="sm" onClick={() => handleNewCard()} className="w-full min-w-0 rounded-xl px-2 text-xs shadow-[0_10px_22px_rgba(11,151,196,0.18)] md:w-auto md:px-3 md:text-sm">
              <Plus className="h-4 w-4 mr-1" />
              <span className="md:hidden">Novo</span>
              <span className="hidden md:inline">Novo card</span>
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr_auto] gap-3 items-center rounded-2xl border border-border bg-white dark:bg-[#20263d] p-3 shadow-[0_10px_30px_rgba(25,29,51,0.025)]">
          <Select value={activeBoard} onValueChange={setActiveBoard}>
            <SelectTrigger className="w-full cursor-pointer rounded-xl border-border bg-muted/40 md:w-[240px]">
              <SelectValue placeholder={boards.find((b) => b.id === activeBoard)?.name ?? "Quadro Geral"} />
            </SelectTrigger>
            <SelectContent>
              {boards.map((b) => (
                <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Buscar por título, cliente, módulo, tag ou ID..."
              className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-muted/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-xl border-border bg-white dark:bg-[#20263d]">
                  <SlidersHorizontal className="h-4 w-4 mr-1.5" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 px-1 bg-primary text-primary-foreground">
                      {activeFilterCount}
                    </Badge>
                  )}
                  <ChevronDown className="h-3 w-3 ml-1 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold">Filtros</p>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" /> Limpar
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  <FilterSelect
                    label="Cliente"
                    value={filters.client}
                    onChange={(v) => setFilters({ ...filters, client: v })}
                    options={[
                      { value: "all", label: "Todos" },
                      { value: "Interno", label: "Interno" },
                      ...kanbanClients.map((c) => ({ value: c, label: c })),
                    ]}
                  />
                  <FilterSelect
                    label="Responsável"
                    value={filters.assignee}
                    onChange={(v) => setFilters({ ...filters, assignee: v })}
                    options={[
                      { value: "all", label: "Todos" },
                      ...kanbanMembers.map((m) => ({ value: m.id, label: m.name })),
                    ]}
                  />
                  <FilterSelect
                    label="Prioridade"
                    value={filters.priority}
                    onChange={(v) => setFilters({ ...filters, priority: v as Priority | "all" })}
                    options={[
                      { value: "all", label: "Todas" },
                      ...priorities.map((p) => ({ value: p, label: p })),
                    ]}
                  />
                  <FilterSelect
                    label="Tipo"
                    value={filters.type}
                    onChange={(v) => setFilters({ ...filters, type: v as CardType | "all" })}
                    options={[
                      { value: "all", label: "Todos" },
                      ...cardTypes.map((t) => ({ value: t, label: t })),
                    ]}
                  />
                  <FilterSelect
                    label="Status"
                    value={filters.status}
                    onChange={(v) => setFilters({ ...filters, status: v })}
                    options={[
                      { value: "all", label: "Todos" },
                      ...kanbanColumnsDef.map((c) => ({ value: c.id, label: c.title })),
                    ]}
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-muted-foreground">Ativos:</span>
            {Object.entries(filters).map(([k, v]) => {
              if (v === "all") return null;
              const label =
                k === "assignee"
                  ? kanbanMembers.find((m) => m.id === v)?.name ?? v
                  : k === "status"
                    ? kanbanColumnsDef.find((c) => c.id === v)?.title ?? v
                    : v;
              return (
                <Badge
                  key={k}
                  variant="secondary"
                  className="gap-1 pr-1 text-[11px]"
                >
                  {label}
                  <button
                    onClick={() => setFilters({ ...filters, [k]: "all" })}
                    className="ml-0.5 cursor-pointer rounded p-0.5 hover:bg-muted-foreground/10"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Mobile column tabs */}
      <div className="md:hidden mb-3 max-w-full overflow-hidden">
        <Tabs value={mobileColumn} onValueChange={(v) => setMobileColumn(v as ColumnId)}>
          <TabsList className="w-full max-w-full h-auto flex overflow-x-auto justify-start">
            {kanbanColumnsDef.map((c) => (
              <TabsTrigger key={c.id} value={c.id} className="cursor-pointer whitespace-nowrap text-xs">
                {c.title}
                <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded bg-muted-foreground/10">
                  {cardsByColumn[c.id].length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {/* Desktop / tablet: horizontal scroll */}
        <div className="hidden md:block">
          <div className="rounded-[14px] border border-border bg-white dark:bg-[#20263d] p-4 shadow-[0_16px_40px_rgba(25,29,51,0.035)]">
            <div className="overflow-x-auto kanban-scrollbar snap-x snap-mandatory rounded-xl border border-dashed border-border px-0 py-4">
              <div className="flex min-w-max gap-0">
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
        </div>

        {/* Mobile: single column via tabs */}
        <div className="md:hidden">
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
