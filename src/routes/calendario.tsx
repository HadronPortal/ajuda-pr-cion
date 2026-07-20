import { useMemo, useState, useEffect, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  CalendarDays,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Filter,
  Fuel,
  Gauge,
  Laptop,
  Link2,
  Lock,
  MapPin,
  Plus,
  SlidersHorizontal,
  Sparkles,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AppShell, PageHeader } from "@/components/portal/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { cn } from "@/lib/utils";

const preventOutsideClose = (event: Event) => event.preventDefault();


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
  description?: string;
  guests?: string[];
  vehicle?: string;
  address?: string;
  responsible?: string;
  meetingLink?: string;
  platform?: string;
  room?: string;
  isPrivate?: boolean;
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
  const [agendaOpen, setAgendaOpen] = useState(false);

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
              onClick={() => setAgendaOpen(true)}
              className="h-10 cursor-pointer gap-2 rounded-lg px-4 text-sm font-medium"
            >
              <CalendarDays className="h-4 w-4" />
              Agenda
            </Button>
            <Button
              type="button"
              onClick={() => setFiltersOpen(true)}
              className="h-10 cursor-pointer gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-md hover:bg-blue-700"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {activeCount > 0 && (
                <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white/25 px-1.5 text-[11px] font-semibold">
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

      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => moveMonth(-1)} className="cursor-pointer">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => moveMonth(1)} className="cursor-pointer">
              <ChevronRight className="h-4 w-4" />
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
                onClick={() => {
                  setSelectedDate(cell.key);
                  setAgendaOpen(true);
                }}
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

      <Sheet open={agendaOpen} onOpenChange={setAgendaOpen}>
        <SheetContent
          side="right"
          className="flex w-[90vw] flex-col gap-0 p-0 sm:max-w-[380px]"
        >
          <SheetHeader className="border-b border-border px-5 py-4">
            <SheetTitle className="text-base font-medium">
              {new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "2-digit", month: "long" }).format(new Date(`${selectedDate}T12:00:00`))}
            </SheetTitle>
          </SheetHeader>
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 space-y-6">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs uppercase text-muted-foreground">Agenda do dia</p>
                <Badge variant="secondary">{selectedEvents.length}</Badge>
              </div>
              <div className="space-y-3">
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
            </section>
            <section>
              <p className="mb-3 text-xs uppercase text-muted-foreground">Resumo do mês</p>
              <div className="grid grid-cols-2 gap-3">
                <Metric value={filtered.filter((e) => e.type === "Visita").length} label="Visitas" color="text-emerald-500" />
                <Metric value={filtered.filter((e) => e.type.includes("Reunião")).length} label="Reuniões" color="text-sky-500" />
                <Metric value={new Set(filtered.map((e) => e.operator)).size} label="Operadores" color="text-violet-500" />
                <Metric value={filtered.filter((e) => e.type === "Pessoal").length} label="Pessoais" color="text-amber-500" />
              </div>
            </section>
          </div>
        </SheetContent>
      </Sheet>

      <CreateEventDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        initialDate={selectedDate}
        existingEvents={events}
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
  const Icon = style.icon;
  const operator = event.operator?.trim() ? event.operator : "SEM OPERADOR";
  const label = event.client || event.title;
  const fullText = `${event.time}  ${operator} - ${label}`;
  return (
    <span
      title={`${event.type} · ${fullText}`}
      className={cn(
        "flex items-center gap-2 overflow-hidden rounded px-2 py-1 text-[10px] text-white",
        style.dot,
      )}
    >
      <span className="shrink-0 tabular-nums">{event.time}</span>
      <Icon className="h-3 w-3 shrink-0" aria-label={event.type} />
      <span className="truncate">
        <span className="font-medium">{operator}</span>
        <span> - {label}</span>
      </span>
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

const PRC_OPERATORS = ["PRCGGC", "PRCGIN", "PRCJAC", "PRCREN", "PRCROG", "PRCSUZ", "PRCMAR", "PRCLCZ", "PRCPED"];
type FleetVehicle = {
  id: string;
  model: string;
  plate: string;
  category: string;
  color: string;
  year: string;
  mileage: string;
  fuel: string;
  status: "Disponível" | "Em uso" | "Manutenção";
};

const FLEET_VEHICLES: FleetVehicle[] = [
  { id: "corolla", model: "Toyota Corolla", plate: "ABC-1234", category: "Sedan", color: "Branco", year: "2022 / 2023", mileage: "45.678 km", fuel: "1/2", status: "Disponível" },
  { id: "tracker", model: "Chevrolet Tracker", plate: "PRC-2026", category: "SUV", color: "Prata", year: "2023 / 2024", mileage: "31.420 km", fuel: "3/4", status: "Disponível" },
  { id: "onix", model: "Chevrolet Onix", plate: "HAD-1908", category: "Hatch", color: "Cinza", year: "2021 / 2022", mileage: "62.150 km", fuel: "1/4", status: "Em uso" },
  { id: "strada", model: "Fiat Strada", plate: "WEB-4580", category: "Utilitário", color: "Branco", year: "2022 / 2022", mileage: "54.802 km", fuel: "Cheio", status: "Manutenção" },
];
const PLATFORM_OPTIONS = ["Google Meet", "Microsoft Teams", "Zoom", "AnyDesk"];
const ROOM_OPTIONS = ["Sala Diretoria", "Sala Reuniões 1", "Sala Reuniões 2", "Auditório"];

const TYPE_ICON: Record<EventType, typeof Car> = {
  Visita: Car,
  "Reunião remota": Laptop,
  "Reunião PRC": UsersRound,
  Pessoal: CalendarDays,
};

function CreateEventDialog({
  open,
  onOpenChange,
  initialDate,
  existingEvents,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate: string;
  existingEvents: CalendarEvent[];
  onCreate: (event: Omit<CalendarEvent, "id">) => void;
}) {
  const [type, setType] = useState<EventType>("Visita");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [guests, setGuests] = useState<string[]>([]);
  const [guestInput, setGuestInput] = useState("");
  const [guestOpen, setGuestOpen] = useState(false);
  const [date, setDate] = useState(initialDate);
  const [dateOpen, setDateOpen] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [client, setClient] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [address, setAddress] = useState("");
  const [responsible, setResponsible] = useState(PRC_OPERATORS[0]);
  const [meetingLink, setMeetingLink] = useState("");
  const [platform, setPlatform] = useState(PLATFORM_OPTIONS[0]);
  const [room, setRoom] = useState(ROOM_OPTIONS[0]);
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    if (open) setDate(initialDate);
  }, [open, initialDate]);

  const reset = () => {
    setType("Visita"); setTitle(""); setDescription("");
    setGuests([]); setGuestInput("");
    setStartTime("09:00"); setEndTime("10:00");
    setClient(""); setVehicle(""); setAddress("");
    setResponsible(PRC_OPERATORS[0]);
    setMeetingLink(""); setPlatform(PLATFORM_OPTIONS[0]);
    setRoom(ROOM_OPTIONS[0]); setIsPrivate(false);
  };

  const addGuestValue = (raw: string) => {
    const value = raw.trim().toUpperCase();
    if (!value) return;
    setGuests((prev) => (prev.includes(value) ? prev : [...prev, value]));
  };
  const commitGuestInput = () => {
    if (!guestInput.trim()) return;
    guestInput.split(",").forEach(addGuestValue);
    setGuestInput("");
  };
  const removeGuest = (value: string) =>
    setGuests((prev) => prev.filter((g) => g !== value));

  const dayEvents = useMemo(
    () =>
      existingEvents
        .filter((event) => event.date === date)
        .sort((a, b) => a.time.localeCompare(b.time)),
    [existingEvents, date],
  );

  const dateLabel = date
    ? format(new Date(`${date}T12:00:00`), "EEEE, dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    : "Selecione uma data";

  const submit = () => {
    if (!title.trim()) { toast.error("Informe o título do agendamento."); return; }
    if (!date || !startTime || !endTime) { toast.error("Preencha data e horários."); return; }
    if (endTime <= startTime) { toast.error("O horário final deve ser posterior ao inicial."); return; }
    onCreate({
      date, time: startTime, end: endTime, type,
      origin: type === "Pessoal" ? "Administração" : "Suporte",
      operator: responsible,
      title: title.trim(),
      client: type === "Visita" ? (client.trim() || undefined) : undefined,
      description: description.trim() || undefined,
      guests: guests.length ? guests : undefined,
      vehicle: type === "Visita" ? vehicle : undefined,
      address: type === "Visita" ? (address.trim() || undefined) : undefined,
      responsible,
      meetingLink: type === "Reunião remota" ? (meetingLink.trim() || undefined) : undefined,
      platform: type === "Reunião remota" ? platform : undefined,
      room: type === "Reunião PRC" ? room : undefined,
      isPrivate: type === "Pessoal" ? isPrivate : undefined,
    });
    reset();
    onOpenChange(false);
  };

  const typeOptions: { value: EventType; icon: typeof Car }[] = [
    { value: "Visita", icon: Car },
    { value: "Reunião remota", icon: Laptop },
    { value: "Reunião PRC", icon: Building2 },
    { value: "Pessoal", icon: CalendarDays },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={preventOutsideClose}
        onInteractOutside={preventOutsideClose}
        onEscapeKeyDown={preventOutsideClose}
        style={{ maxHeight: "calc(100vh - 2rem)" }}
        className="flex w-[calc(100vw-2rem)] max-w-[880px] flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Novo agendamento</DialogTitle>
        <DetailModalHeader
          icon={CalendarDays}
          title="Novo agendamento"
          protocol={dateLabel}
          onClose={() => onOpenChange(false)}
        />

        <div className="flex-1 min-h-0 space-y-4 overflow-y-auto bg-card px-5 py-4 md:px-6">
          <NewField label="Título" required>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Informe o título do agendamento"
              maxLength={140}
            />
          </NewField>

          <NewField label="Descrição">
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={700}
              placeholder="Descreva o objetivo ou as informações do agendamento"
              className="min-h-[80px] resize-none"
            />
          </NewField>

          <NewField label="Convidados">
            <div className="rounded-md border border-input bg-background px-2 py-2">
              {guests.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {guests.map((g) => (
                    <span
                      key={g}
                      className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[12px] text-primary"
                    >
                      {g}
                      <button
                        type="button"
                        onClick={() => removeGuest(g)}
                        aria-label={`Remover ${g}`}
                        className="grid h-4 w-4 cursor-pointer place-items-center rounded-full hover:bg-primary/20"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <input
                  value={guestInput}
                  onChange={(e) => setGuestInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === ",") {
                      e.preventDefault();
                      commitGuestInput();
                    }
                  }}
                  onBlur={commitGuestInput}
                  placeholder="Pesquise ou digite siglas separadas por vírgula"
                  className="h-8 flex-1 bg-transparent px-1 text-[13px] outline-none placeholder:text-muted-foreground"
                />
                <Popover open={guestOpen} onOpenChange={setGuestOpen}>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className="cursor-pointer rounded-md border border-input bg-background px-2 py-1 text-[12px] text-muted-foreground hover:text-foreground"
                    >
                      Selecionar operadores
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 p-1">
                    <ul className="max-h-64 overflow-y-auto">
                      {PRC_OPERATORS.map((op) => {
                        const active = guests.includes(op);
                        return (
                          <li key={op}>
                            <button
                              type="button"
                              onClick={() =>
                                active ? removeGuest(op) : addGuestValue(op)
                              }
                              className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent"
                            >
                              <span>{op}</span>
                              {active && <Check className="h-4 w-4 text-primary" />}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </NewField>

          <div className="grid gap-3 sm:grid-cols-3">
            <NewField label="Data" required>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="inline-flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
                  >
                    <CalendarDays className="h-4 w-4 opacity-70" />
                    <span>{date ? format(new Date(`${date}T12:00:00`), "dd/MM/yyyy") : "dd/mm/aaaa"}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date ? new Date(`${date}T12:00:00`) : undefined}
                    onSelect={(d) => {
                      if (d) {
                        setDate(
                          `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
                        );
                      }
                      setDateOpen(false);
                    }}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>
            </NewField>
            <NewField label="Início" required>
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="cursor-pointer" />
            </NewField>
            <NewField label="Término" required>
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="cursor-pointer" />
            </NewField>
          </div>

          <NewField label="Tipo de agendamento" required>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {typeOptions.map((opt) => {
                const Icon = opt.icon;
                const active = type === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setType(opt.value)}
                    className={cn(
                      "flex cursor-pointer items-center justify-center gap-2 rounded-md border px-3 py-2 text-[13px] transition",
                      active
                        ? "border-primary bg-primary/10 text-primary shadow-sm"
                        : "border-input bg-background text-foreground hover:border-primary/40 hover:bg-accent",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {opt.value}
                  </button>
                );
              })}
            </div>
          </NewField>

          {type === "Visita" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <NewField label="Cliente">
                <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Sigla ou razão social" />
              </NewField>
              <NewField label="Veículo">
                <button
                  type="button"
                  onClick={() => setVehicleOpen(true)}
                  className="flex h-9 w-full cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 text-left text-[13px] transition hover:border-primary/40 hover:bg-accent"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <Car className="h-4 w-4 shrink-0 text-primary" />
                    <span className={cn("truncate", !vehicle && "text-muted-foreground")}>
                      {vehicle || "Selecionar veículo"}
                    </span>
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </button>
              </NewField>
              <NewField label="Endereço" className="sm:col-span-2">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-8" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, cidade" />
                </div>
              </NewField>
              <NewField label="Responsável" className="sm:col-span-2">
                <SelectNative value={responsible} onChange={setResponsible} options={PRC_OPERATORS} />
              </NewField>
            </div>
          )}

          {type === "Reunião remota" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <NewField label="Link da reunião" className="sm:col-span-2">
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-8" value={meetingLink} onChange={(e) => setMeetingLink(e.target.value)} placeholder="https://" />
                </div>
              </NewField>
              <NewField label="Plataforma">
                <SelectNative value={platform} onChange={setPlatform} options={PLATFORM_OPTIONS} />
              </NewField>
              <NewField label="Responsável">
                <SelectNative value={responsible} onChange={setResponsible} options={PRC_OPERATORS} />
              </NewField>
            </div>
          )}

          {type === "Reunião PRC" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <NewField label="Sala">
                <SelectNative value={room} onChange={setRoom} options={ROOM_OPTIONS} />
              </NewField>
              <NewField label="Responsável">
                <SelectNative value={responsible} onChange={setResponsible} options={PRC_OPERATORS} />
              </NewField>
            </div>
          )}

          {type === "Pessoal" && (
            <div className="grid gap-3 sm:grid-cols-2">
              <NewField label="Responsável">
                <SelectNative value={responsible} onChange={setResponsible} options={PRC_OPERATORS} />
              </NewField>
              <div className="flex items-end">
                <label className="flex cursor-pointer items-center gap-2 text-[13px] text-foreground">
                  <Checkbox
                    checked={isPrivate}
                    onCheckedChange={(v) => setIsPrivate(v === true)}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Evento privado
                </label>
              </div>
            </div>
          )}

          <section className="rounded-lg border border-border bg-background/40">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
                Agendamentos do dia
              </p>
              <Badge variant="secondary" className="text-[11px]">{dayEvents.length}</Badge>
            </div>
            {dayEvents.length === 0 ? (
              <p className="px-3 py-4 text-center text-[12.5px] text-muted-foreground">
                Nenhum agendamento para esta data
              </p>
            ) : (
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left text-[12px]">
                  <thead className="sticky top-0 bg-background/95 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-1.5 font-medium">Horário</th>
                      <th className="px-2 py-1.5 font-medium">Tipo</th>
                      <th className="px-2 py-1.5 font-medium">Título</th>
                      <th className="px-2 py-1.5 font-medium">Operador</th>
                      <th className="px-2 py-1.5 font-medium">Convidados</th>
                      <th className="px-3 py-1.5 font-medium">Veículo/Local</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayEvents.map((ev) => {
                      const Icon = TYPE_ICON[ev.type];
                      return (
                        <tr key={ev.id} className="border-t border-border/50">
                          <td className="px-3 py-1.5 tabular-nums text-foreground">
                            {ev.time}–{ev.end}
                          </td>
                          <td className="px-2 py-1.5">
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Icon className="h-3.5 w-3.5" />
                              {ev.type}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-foreground">{ev.title}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{ev.operator || "—"}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">
                            {ev.guests?.join(", ") || "—"}
                          </td>
                          <td className="px-3 py-1.5 text-muted-foreground">
                            {ev.vehicle || ev.room || ev.address || ev.client || "—"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        <DialogFooter className="flex shrink-0 items-center justify-end gap-2 border-t border-border bg-card px-5 py-3 md:px-6">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancelar
          </Button>
          <Button onClick={submit} className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            Adicionar evento
          </Button>
        </DialogFooter>
        <VehiclePickerDialog
          open={vehicleOpen}
          onOpenChange={setVehicleOpen}
          selected={vehicle}
          onSelect={setVehicle}
        />
      </DialogContent>
    </Dialog>
  );
}

function VehiclePickerDialog({
  open,
  onOpenChange,
  selected,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: string;
  onSelect: (vehicle: string) => void;
}) {
  const selectedIndex = Math.max(
    0,
    FLEET_VEHICLES.findIndex((item) => `${item.model} · ${item.plate}` === selected),
  );
  const [index, setIndex] = useState(selectedIndex);

  useEffect(() => {
    if (open) setIndex(selectedIndex);
  }, [open, selectedIndex]);

  const vehicle = FLEET_VEHICLES[index];
  const previous = () =>
    setIndex((current) => (current - 1 + FLEET_VEHICLES.length) % FLEET_VEHICLES.length);
  const next = () => setIndex((current) => (current + 1) % FLEET_VEHICLES.length);
  const available = vehicle.status === "Disponível";

  const confirm = () => {
    if (!available) {
      toast.error(`O veículo ${vehicle.model} está ${vehicle.status.toLowerCase()}.`);
      return;
    }
    onSelect(`${vehicle.model} · ${vehicle.plate}`);
    onOpenChange(false);
    toast.success("Veículo selecionado para a visita.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={preventOutsideClose}
        onInteractOutside={preventOutsideClose}
        onEscapeKeyDown={preventOutsideClose}
        className="w-[calc(100vw-2rem)] max-w-[760px] gap-0 overflow-hidden rounded-2xl border border-border bg-card p-0 shadow-[0_30px_80px_rgba(0,0,0,0.35)] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">Selecionar veículo</DialogTitle>
        <DetailModalHeader
          icon={Car}
          title="Selecionar veículo"
          protocol={`${index + 1} de ${FLEET_VEHICLES.length} veículos da frota`}
          onClose={() => onOpenChange(false)}
        />

        <div className="grid gap-5 bg-card p-5 md:grid-cols-[280px_1fr] md:p-6">
          <section className="relative overflow-hidden rounded-xl border border-border bg-muted/20 p-5">
            <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
            <div className="relative flex h-40 items-center justify-center rounded-lg bg-gradient-to-b from-background to-muted/50">
              <Car className="h-28 w-28 text-primary drop-shadow-sm" strokeWidth={1.25} />
              <span className="absolute bottom-3 rounded-full border border-border bg-background/90 px-3 py-1 text-[11px] text-muted-foreground shadow-sm">
                {vehicle.color} · {vehicle.category}
              </span>
            </div>
            <div className="mt-4 text-center">
              <p className="text-base font-medium text-foreground">{vehicle.model}</p>
              <p className="mt-0.5 text-sm font-medium tracking-wide text-primary">{vehicle.plate}</p>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2">
              {FLEET_VEHICLES.map((item, itemIndex) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(itemIndex)}
                  aria-label={`Ver ${item.model}`}
                  className={cn(
                    "h-2 cursor-pointer rounded-full transition-all",
                    itemIndex === index
                      ? "w-7 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60",
                  )}
                />
              ))}
            </div>
          </section>

          <section className="flex min-w-0 flex-col">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Dados do veículo</p>
                <h3 className="mt-1 text-lg font-medium">{vehicle.model}</h3>
              </div>
              <Badge
                className={cn(
                  "border px-2.5 py-1 font-normal",
                  available
                    ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                    : vehicle.status === "Em uso"
                      ? "border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                      : "border-rose-500/25 bg-rose-500/10 text-rose-600 dark:text-rose-300",
                )}
              >
                {vehicle.status}
              </Badge>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <VehicleDatum icon={Car} label="Categoria" value={vehicle.category} />
              <VehicleDatum icon={Sparkles} label="Cor" value={vehicle.color} />
              <VehicleDatum icon={CalendarDays} label="Ano / modelo" value={vehicle.year} />
              <VehicleDatum icon={Gauge} label="Quilometragem" value={vehicle.mileage} />
            </div>

            <div className="mt-4 rounded-lg border border-border bg-muted/20 p-3">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Fuel className="h-4 w-4" /> Combustível estimado
                </span>
                <span className="font-medium text-foreground">{vehicle.fuel}</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{
                    width:
                      vehicle.fuel === "Cheio"
                        ? "100%"
                        : vehicle.fuel === "3/4"
                          ? "75%"
                          : vehicle.fuel === "1/2"
                            ? "50%"
                            : "25%",
                  }}
                />
              </div>
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 pt-5">
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="icon" onClick={previous} className="cursor-pointer" aria-label="Veículo anterior">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button type="button" variant="outline" size="icon" onClick={next} className="cursor-pointer" aria-label="Próximo veículo">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Button type="button" onClick={confirm} disabled={!available} className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700">
                <Check className="mr-1.5 h-4 w-4" />
                Selecionar veículo
              </Button>
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function VehicleDatum({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Car;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-background p-3">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {label}
      </div>
      <p className="mt-1.5 truncate text-[13px] text-foreground">{value}</p>
    </div>
  );
}

function SelectNative({
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
      className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((option) => (
        <option key={option}>{option}</option>
      ))}
    </select>
  );
}

function NewField({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label className="mb-1.5 block text-[12.5px] font-medium">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
    </div>
  );
}

