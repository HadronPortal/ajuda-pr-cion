import { useMemo, useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  Filter,
  Laptop,
  MapPin,
  Plus,
  SlidersHorizontal,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/calendario")({
  head: () => ({ meta: [{ title: "Calendário - Portal Prócion" }] }),
  component: CalendarPage,
});

type EventType = "Visita" | "Reunião remota" | "Reunião PRC" | "Pessoal";
type EventStatus = "Agendado" | "Concluído" | "Cancelado";
type CalendarEvent = {
  id: number;
  date: string;
  time: string;
  end: string;
  type: EventType;
  origin: "Administração" | "Suporte" | "Comercial";
  operator: string;
  title: string;
  client?: string;
  status?: EventStatus;
};

const initialEvents: CalendarEvent[] = [
  { id: 1, date: "2026-07-02", time: "08:00", end: "09:30", type: "Visita", origin: "Comercial", operator: "PRCGIN", title: "Visita técnica", client: "ICF · INCOFAP" },
  { id: 2, date: "2026-07-03", time: "09:00", end: "10:00", type: "Reunião remota", origin: "Suporte", operator: "PRCROG", title: "Acompanhamento", client: "CPB · CAMPO BELO ALIMENTOS" },
  { id: 3, date: "2026-07-06", time: "08:30", end: "11:00", type: "Visita", origin: "Comercial", operator: "PRCJAC", title: "Implantação", client: "EIN · EUROIND" },
  { id: 4, date: "2026-07-08", time: "13:30", end: "15:00", type: "Visita", origin: "Suporte", operator: "PRCREN", title: "Treinamento", client: "FRU · FRUTAVO" },
  { id: 5, date: "2026-07-10", time: "14:00", end: "15:00", type: "Reunião remota", origin: "Suporte", operator: "PRCROG", title: "Revisão de processo", client: "AVC · CENTER GLASS" },
  { id: 6, date: "2026-07-13", time: "08:30", end: "10:30", type: "Visita", origin: "Comercial", operator: "PRCJAC", title: "Visita comercial", client: "USB · US BRASIL" },
  { id: 7, date: "2026-07-14", time: "14:00", end: "15:00", type: "Reunião PRC", origin: "Administração", operator: "PRCROG", title: "Reunião da equipe" },
  { id: 8, date: "2026-07-15", time: "14:00", end: "15:00", type: "Pessoal", origin: "Administração", operator: "PRCREN", title: "Médico" },
  { id: 9, date: "2026-07-17", time: "08:30", end: "10:00", type: "Visita", origin: "Suporte", operator: "PRCGIN", title: "Validação final", client: "ICF · INCOFAP" },
  { id: 10, date: "2026-07-17", time: "14:00", end: "15:00", type: "Reunião remota", origin: "Suporte", operator: "PRCSUZ", title: "Retorno de chamado", client: "MIT · MINERAÇÃO ITAPORANGA" },
  { id: 11, date: "2026-07-21", time: "14:00", end: "16:00", type: "Visita", origin: "Comercial", operator: "PRCJAC", title: "Apresentação", client: "NUT · NUTRIVET BRASIL" },
  { id: 12, date: "2026-07-24", time: "14:00", end: "15:00", type: "Reunião PRC", origin: "Administração", operator: "PRCGGC", title: "Planejamento mensal" },
];

const operators = ["Todos", "PRCGGC", "PRCGIN", "PRCJAC", "PRCREN", "PRCROG", "PRCSUZ"];
const typeOptions = ["Todos", "Visita", "Reunião remota", "Reunião PRC", "Pessoal"] as const;
const originOptions = ["Todas", "Administração", "Suporte", "Comercial"] as const;
const statusOptions = ["Todos", "Agendado", "Concluído", "Cancelado"] as const;

type Filters = {
  query: string;
  type: string;
  origin: string;
  operator: string;
  client: string;
  status: string;
  dateStart?: Date;
  dateEnd?: Date;
};

const emptyFilters: Filters = {
  query: "",
  type: "Todos",
  origin: "Todas",
  operator: "Todos",
  client: "",
  status: "Todos",
  dateStart: undefined,
  dateEnd: undefined,
};

const typeStyles: Record<EventType, { dot: string; soft: string; text: string; icon: typeof Car }> =
  {
    Visita: { dot: "bg-emerald-500", soft: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-300", icon: Car },
    "Reunião remota": { dot: "bg-sky-500", soft: "bg-sky-500/10", text: "text-sky-700 dark:text-sky-300", icon: Laptop },
    "Reunião PRC": { dot: "bg-violet-500", soft: "bg-violet-500/10", text: "text-violet-700 dark:text-violet-300", icon: UsersRound },
    Pessoal: { dot: "bg-amber-500", soft: "bg-amber-500/12", text: "text-amber-700 dark:text-amber-300", icon: UserRound },
  };

function dateKey(year: number, month: number, day: number) {
  const value = new Date(year, month, day);
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

function CalendarPage() {
  const [cursor, setCursor] = useState(new Date(2026, 6, 1));
  const [selectedDate, setSelectedDate] = useState("2026-07-17");
  const [events, setEvents] = useState(initialEvents);
  const [createOpen, setCreateOpen] = useState(false);

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(emptyFilters);

  useEffect(() => {
    if (filtersOpen) setDraft(filters);
  }, [filtersOpen, filters]);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const status = event.status ?? "Agendado";
      if (filters.type !== "Todos" && event.type !== filters.type) return false;
      if (filters.origin !== "Todas" && event.origin !== filters.origin) return false;
      if (filters.operator !== "Todos" && event.operator !== filters.operator) return false;
      if (filters.status !== "Todos" && status !== filters.status) return false;
      if (filters.client.trim()) {
        const c = (event.client || "").toLowerCase();
        if (!c.includes(filters.client.trim().toLowerCase())) return false;
      }
      if (filters.query.trim()) {
        const haystack = `${event.title} ${event.client || ""} ${event.operator}`.toLowerCase();
        if (!haystack.includes(filters.query.trim().toLowerCase())) return false;
      }
      if (filters.dateStart) {
        const d = new Date(`${event.date}T00:00:00`);
        const s = new Date(filters.dateStart);
        s.setHours(0, 0, 0, 0);
        if (d < s) return false;
      }
      if (filters.dateEnd) {
        const d = new Date(`${event.date}T00:00:00`);
        const e = new Date(filters.dateEnd);
        e.setHours(23, 59, 59, 999);
        if (d > e) return false;
      }
      return true;
    });
  }, [events, filters]);

  const activeCount = useMemo(() => {
    let n = 0;
    if (filters.query.trim()) n++;
    if (filters.type !== "Todos") n++;
    if (filters.origin !== "Todas") n++;
    if (filters.operator !== "Todos") n++;
    if (filters.client.trim()) n++;
    if (filters.status !== "Todos") n++;
    if (filters.dateStart) n++;
    if (filters.dateEnd) n++;
    return n;
  }, [filters]);

  const removeFilter = (k: keyof Filters) =>
    setFilters((p) => ({ ...p, [k]: emptyFilters[k] } as Filters));

  const chips: { key: string; label: string; onRemove: () => void }[] = [];
  if (filters.query.trim()) chips.push({ key: "query", label: `Busca: "${filters.query}"`, onRemove: () => removeFilter("query") });
  if (filters.type !== "Todos") chips.push({ key: "type", label: `Tipo: ${filters.type}`, onRemove: () => removeFilter("type") });
  if (filters.origin !== "Todas") chips.push({ key: "origin", label: `Origem: ${filters.origin}`, onRemove: () => removeFilter("origin") });
  if (filters.operator !== "Todos") chips.push({ key: "operator", label: `Operador: ${filters.operator}`, onRemove: () => removeFilter("operator") });
  if (filters.client.trim()) chips.push({ key: "client", label: `Cliente: ${filters.client}`, onRemove: () => removeFilter("client") });
  if (filters.status !== "Todos") chips.push({ key: "status", label: `Status: ${filters.status}`, onRemove: () => removeFilter("status") });
  if (filters.dateStart) chips.push({ key: "dateStart", label: `De: ${format(filters.dateStart, "dd/MM/yyyy")}`, onRemove: () => removeFilter("dateStart") });
  if (filters.dateEnd) chips.push({ key: "dateEnd", label: `Até: ${format(filters.dateEnd, "dd/MM/yyyy")}`, onRemove: () => removeFilter("dateEnd") });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const monthTitle = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(cursor);
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const previousMonthDays = new Date(year, month, 0).getDate();
  const cells = Array.from({ length: 42 }, (_, index) => {
    const value = index - firstWeekday + 1;
    if (value < 1) return { day: previousMonthDays + value, current: false, key: dateKey(year, month - 1, previousMonthDays + value) };
    if (value > daysInMonth) return { day: value - daysInMonth, current: false, key: dateKey(year, month + 1, value - daysInMonth) };
    return { day: value, current: true, key: dateKey(year, month, value) };
  });
  const selectedEvents = filtered
    .filter((event) => event.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  const moveMonth = (delta: number) => {
    const next = new Date(year, month + delta, 1);
    setCursor(next);
    setSelectedDate(dateKey(next.getFullYear(), next.getMonth(), 1));
  };

  return (
    <AppShell>
      <PageHeader
        title="Calendário"
        description="Visitas, reuniões e compromissos da equipe em um só lugar."
        breadcrumbs={[{ label: "Calendário" }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFiltersOpen(true)}
              className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm font-medium"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary/15 px-1.5 text-[11px] font-semibold text-primary">
                  {activeCount}
                </span>
              )}
            </Button>
            <Button onClick={() => setCreateOpen(true)} className="cursor-pointer">
              <Plus className="mr-1.5 h-4 w-4" />
              Novo evento
            </Button>
          </div>
        }
      />

      {chips.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex max-w-full items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-foreground"
            >
              <span className="truncate">{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remover filtro ${chip.label}`}
                className="grid h-4 w-4 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-background hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={() => setFilters(emptyFilters)}
            className="cursor-pointer text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Limpar todos
          </button>
        </div>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <Card className="overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => moveMonth(-1)} className="cursor-pointer">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => moveMonth(1)} className="cursor-pointer">
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setCursor(new Date(2026, 6, 1));
                  setSelectedDate("2026-07-17");
                }}
                className="cursor-pointer"
              >
                Hoje
              </Button>
            </div>
            <h2 className="capitalize text-lg font-medium">{monthTitle}</h2>
            <div className="flex flex-wrap gap-3">
              {Object.entries(typeStyles).map(([name, style]) => (
                <span key={name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className={cn("h-2 w-2 rounded-full", style.dot)} />
                  {name}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-border bg-muted/20">
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div key={day} className="px-2 py-2.5 text-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((cell) => {
              const dayEvents = filtered
                .filter((event) => event.date === cell.key)
                .sort((a, b) => a.time.localeCompare(b.time));
              const selected = selectedDate === cell.key;
              const today = cell.key === "2026-07-17";
              return (
                <button
                  type="button"
                  key={cell.key}
                  onClick={() => setSelectedDate(cell.key)}
                  className={cn(
                    "group min-h-[118px] cursor-pointer border-b border-r border-border p-2 text-left align-top transition-colors hover:bg-primary/[0.035]",
                    !cell.current && "bg-muted/15 text-muted-foreground/45",
                    selected && "bg-primary/[0.06] ring-1 ring-inset ring-primary/25",
                  )}
                >
                  <span
                    className={cn(
                      "mb-1.5 grid h-7 w-7 place-items-center rounded-full text-xs",
                      today && "bg-primary text-primary-foreground",
                      selected && !today && "bg-primary/10 text-primary",
                    )}
                  >
                    {cell.day}
                  </span>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <CalendarEventPill key={event.id} event={event} />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="block pl-1 text-[10px] text-primary">
                        +{dayEvents.length - 3} eventos
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <aside className="space-y-4">
          <Card className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase text-muted-foreground">Agenda do dia</p>
                <h2 className="mt-1 text-lg font-medium">
                  {new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date(`${selectedDate}T12:00:00`))}
                </h2>
              </div>
              <Badge variant="secondary">{selectedEvents.length}</Badge>
            </div>
            <div className="mt-5 space-y-3">
              {selectedEvents.length ? (
                selectedEvents.map((event) => <AgendaItem key={event.id} event={event} />)
              ) : (
                <div className="rounded-md border border-dashed border-border px-4 py-10 text-center">
                  <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground/45" />
                  <p className="mt-3 text-sm text-muted-foreground">Nenhum compromisso neste dia.</p>
                  <Button variant="link" onClick={() => setCreateOpen(true)} className="mt-1 cursor-pointer">
                    Adicionar evento
                  </Button>
                </div>
              )}
            </div>
          </Card>
          <Card className="p-5">
            <p className="text-xs uppercase text-muted-foreground">Resumo do mês</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Metric value={filtered.filter((e) => e.type === "Visita").length} label="Visitas" color="text-emerald-500" />
              <Metric value={filtered.filter((e) => e.type.includes("Reunião")).length} label="Reuniões" color="text-sky-500" />
              <Metric value={new Set(filtered.map((e) => e.operator)).size} label="Operadores" color="text-violet-500" />
              <Metric value={filtered.filter((e) => e.type === "Pessoal").length} label="Pessoais" color="text-amber-500" />
            </div>
          </Card>
        </aside>
      </div>

      <CreateEventDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initialDate={selectedDate}
        onCreate={(event) => {
          setEvents((current) => [...current, { ...event, id: Date.now() }]);
          setSelectedDate(event.date);
          toast.success("Evento adicionado ao calendário");
        }}
      />

      <FiltersPanel
        open={filtersOpen}
        onOpenChange={setFiltersOpen}
        draft={draft}
        setDraft={setDraft}
        onApply={() => {
          setFilters(draft);
          setFiltersOpen(false);
        }}
        onClear={() => setDraft(emptyFilters)}
      />
    </AppShell>
  );
}

function FiltersPanel({
  open,
  onOpenChange,
  draft,
  setDraft,
  onApply,
  onClear,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  draft: Filters;
  setDraft: React.Dispatch<React.SetStateAction<Filters>>;
  onApply: () => void;
  onClear: () => void;
}) {
  const update = <K extends keyof Filters>(k: K, v: Filters[K]) =>
    setDraft((p) => ({ ...p, [k]: v }));

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-[480px]">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="text-lg font-semibold">Filtros do calendário</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="space-y-5">
            <FieldText
              label="Pesquisa geral"
              value={draft.query}
              onChange={(v) => update("query", v)}
              placeholder="Cliente, compromisso, local ou operador"
            />

            <div className="grid grid-cols-2 gap-3">
              <FieldSelect
                label="Tipo"
                value={draft.type}
                onChange={(v) => update("type", v)}
                options={typeOptions.map((o) => ({ value: o, label: o }))}
              />
              <FieldSelect
                label="Origem"
                value={draft.origin}
                onChange={(v) => update("origin", v)}
                options={originOptions.map((o) => ({ value: o, label: o }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FieldSelect
                label="Operador"
                value={draft.operator}
                onChange={(v) => update("operator", v)}
                options={operators.map((o) => ({ value: o, label: o }))}
              />
              <FieldSelect
                label="Status"
                value={draft.status}
                onChange={(v) => update("status", v)}
                options={statusOptions.map((o) => ({ value: o, label: o }))}
              />
            </div>

            <FieldText
              label="Cliente"
              value={draft.client}
              onChange={(v) => update("client", v)}
              placeholder="Sigla ou razão social"
            />

            <div className="space-y-2">
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                Período
              </p>
              <div className="grid grid-cols-2 gap-3">
                <DateField label="Data inicial" value={draft.dateStart} onChange={(d) => update("dateStart", d)} />
                <DateField label="Data final" value={draft.dateEnd} onChange={(d) => update("dateEnd", d)} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border bg-background px-6 py-4">
          <Button
            type="button"
            variant="ghost"
            className="h-10 cursor-pointer rounded-lg text-sm"
            onClick={onClear}
          >
            <SlidersHorizontal className="mr-1.5 h-4 w-4" />
            Limpar filtros
          </Button>
          <Button
            type="button"
            onClick={onApply}
            className="h-10 cursor-pointer rounded-lg bg-blue-600 px-5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Aplicar filtros
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function FieldText({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

function FieldSelect({
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
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 w-full cursor-pointer rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: Date;
  onChange: (d?: Date) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "inline-flex h-10 w-full cursor-pointer items-center gap-2 truncate rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring",
              !value && "text-muted-foreground",
            )}
          >
            <CalendarDays className="h-4 w-4 shrink-0 opacity-70" />
            <span className="truncate">{value ? format(value, "dd/MM/yyyy") : "dd/mm/aaaa"}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange(d);
              setOpen(false);
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function CalendarEventPill({ event }: { event: CalendarEvent }) {
  const style = typeStyles[event.type];
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 overflow-hidden rounded px-1.5 py-1 text-[10px]",
        style.soft,
        style.text,
      )}
    >
      <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
      <span className="shrink-0">{event.time}</span>
      <span className="truncate">{event.client || event.title}</span>
    </span>
  );
}

function AgendaItem({ event }: { event: CalendarEvent }) {
  const style = typeStyles[event.type];
  const Icon = style.icon;
  return (
    <div className="rounded-md border border-border p-3 transition-colors hover:border-primary/25">
      <div className="flex items-start gap-3">
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md", style.soft, style.text)}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium">{event.title}</p>
            <span className="text-xs text-muted-foreground">{event.time}</span>
          </div>
          {event.client && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{event.client}</p>
          )}
          <div className="mt-2 flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{event.operator}</span>
            <span>{event.type}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Metric({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="rounded-md bg-muted/35 p-3">
      <p className={cn("text-xl font-medium", color)}>{value}</p>
      <p className="mt-0.5 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function CreateEventDialog({
  open,
  onOpenChange,
  initialDate,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate: string;
  onCreate: (event: Omit<CalendarEvent, "id">) => void;
}) {
  const [eventType, setEventType] = useState<EventType>("Visita");
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState("09:00");
  const [end, setEnd] = useState("10:00");
  const [eventOperator, setEventOperator] = useState("PRCGGC");
  const [title, setTitle] = useState("");
  const [client, setClient] = useState("");
  const submit = () => {
    if (!title.trim() || !date || !time || !end) {
      toast.error("Preencha os campos obrigatórios.");
      return;
    }
    if (end <= time) {
      toast.error("O término deve ser posterior ao início.");
      return;
    }
    onCreate({
      date,
      time,
      end,
      type: eventType,
      origin: eventType === "Pessoal" ? "Administração" : "Suporte",
      operator: eventOperator,
      title: title.trim(),
      client: client.trim() || undefined,
    });
    setTitle("");
    setClient("");
    onOpenChange(false);
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        if (value) setDate(initialDate);
      }}
    >
      <DialogContent className="max-w-[680px] gap-0 overflow-hidden p-0">
        <DialogTitle className="sr-only">Novo evento</DialogTitle>
        <div className="flex items-center gap-3 border-b border-border px-6 py-5">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-primary/10 text-primary">
            <CalendarDays className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-lg font-medium">Novo evento</h2>
            <p className="text-sm text-muted-foreground">
              Adicione uma visita, reunião ou compromisso pessoal.
            </p>
          </div>
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-2">
          <FormField label="Tipo">
            <SimpleSelect
              value={eventType}
              onChange={(value) => setEventType(value as EventType)}
              options={["Visita", "Reunião remota", "Reunião PRC", "Pessoal"]}
            />
          </FormField>
          <FormField label="Responsável">
            <SimpleSelect
              value={eventOperator}
              onChange={setEventOperator}
              options={operators.slice(1)}
            />
          </FormField>
          <FormField label="Data">
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </FormField>
          <div className="grid grid-cols-2 gap-2">
            <FormField label="Início">
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </FormField>
            <FormField label="Término">
              <Input type="time" value={end} onChange={(e) => setEnd(e.target.value)} />
            </FormField>
          </div>
          <FormField label="Assunto" className="sm:col-span-2">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Objetivo do compromisso"
            />
          </FormField>
          <FormField label="Cliente ou local" className="sm:col-span-2">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="pl-9"
                placeholder="Sigla, empresa ou local"
              />
            </div>
          </FormField>
        </div>
        <DialogFooter className="border-t border-border px-6 py-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={submit}>
            <Plus className="mr-1.5 h-4 w-4" />
            Adicionar evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SimpleSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 cursor-pointer rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function FormField({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-xs">{label}</Label>
      {children}
    </div>
  );
}
