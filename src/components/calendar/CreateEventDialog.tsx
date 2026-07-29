import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Building2,
  CalendarDays,
  Car,
  Check,
  Laptop,
  Link2,
  Lock,
  MapPin,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { cn } from "@/lib/utils";
import {
  CollaboratorMultiSelect,
  CollaboratorSelect,
  type CollaboratorGuest,
} from "@/components/portal/CollaboratorPicker";
import { useCollaborators } from "@/lib/collaborators-store";
import {
  PLATFORM_OPTIONS,
  ROOM_OPTIONS,
  TYPE_ICON,
  type CalendarEvent,
  type EventType,
} from "@/lib/calendar-events";


const preventOutsideClose = (event: Event) => event.preventDefault();

export function CreateEventDialog({
  open,
  onOpenChange,
  initialDate,
  existingEvents,
  onCreate,
  lockedClient,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate: string;
  existingEvents: CalendarEvent[];
  onCreate: (event: Omit<CalendarEvent, "id">) => void;
  /** Cliente fixo (vindo dos detalhes do cliente), vinculado pelo ID real. */
  lockedClient?: { id: string; label: string };
}) {
  const [type, setType] = useState<EventType>("Visita presencial");
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
  const [needsDisplacement, setNeedsDisplacement] = useState(false);
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
    setType("Visita presencial"); setTitle(""); setDescription("");
    setGuests([]); setGuestInput("");
    setStartTime("09:00"); setEndTime("10:00");
    setClient(""); setNeedsDisplacement(false); setAddress("");
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
  const removeGuest = (value: string) => setGuests((prev) => prev.filter((g) => g !== value));

  const dayEvents = useMemo(
    () => existingEvents.filter((event) => event.date === date).sort((a, b) => a.time.localeCompare(b.time)),
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
      client: lockedClient
        ? lockedClient.label
        : type === "Visita presencial"
          ? (client.trim() || undefined)
          : undefined,
      clientId: lockedClient?.id,
      description: description.trim() || undefined,
      guests: guests.length ? guests : undefined,
      needsDisplacement: type === "Visita presencial" ? needsDisplacement : undefined,
      address: type === "Visita presencial" ? (address.trim() || undefined) : undefined,
      responsible,
      meetingLink: type === "Reunião remota" ? (meetingLink.trim() || undefined) : undefined,
      platform: type === "Reunião remota" ? platform : undefined,
      room: type === "Reunião na Prócion" ? room : undefined,
      isPrivate: type === "Pessoal" ? isPrivate : undefined,
    });
    reset();
    onOpenChange(false);
  };

  const typeCards: { value: EventType; icon: typeof Car }[] = [
    { value: "Visita presencial", icon: Car },
    { value: "Reunião remota", icon: Laptop },
    { value: "Reunião na Prócion", icon: Building2 },
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
        <DetailModalHeader icon={CalendarDays} title="Novo agendamento" protocol={dateLabel} onClose={() => onOpenChange(false)} />

        <div className="flex-1 min-h-0 space-y-4 overflow-y-auto bg-card px-5 py-4 md:px-6">
          <NewField label="Título" required>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Informe o título do agendamento" maxLength={140} />
          </NewField>

          <NewField label="Descrição">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} maxLength={700} placeholder="Descreva o objetivo ou as informações do agendamento" className="min-h-[80px] resize-none" />
          </NewField>

          <NewField label="Convidados">
            <div className="rounded-md border border-input bg-background px-2 py-2">
              {guests.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {guests.map((g) => (
                    <span key={g} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[12px] text-primary">
                      {g}
                      <button type="button" onClick={() => removeGuest(g)} aria-label={`Remover ${g}`} className="grid h-4 w-4 cursor-pointer place-items-center rounded-full hover:bg-primary/20">
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
                    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commitGuestInput(); }
                  }}
                  onBlur={commitGuestInput}
                  placeholder="Pesquise ou digite siglas separadas por vírgula"
                  className="h-8 flex-1 bg-transparent px-1 text-[13px] outline-none placeholder:text-muted-foreground"
                />
                <Popover open={guestOpen} onOpenChange={setGuestOpen}>
                  <PopoverTrigger asChild>
                    <button type="button" className="cursor-pointer rounded-md border border-input bg-background px-2 py-1 text-[12px] text-muted-foreground hover:text-foreground">
                      Selecionar operadores
                    </button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-56 p-1">
                    <ul className="max-h-64 overflow-y-auto">
                      {PRC_OPERATORS.map((op) => {
                        const active = guests.includes(op);
                        return (
                          <li key={op}>
                            <button type="button" onClick={() => active ? removeGuest(op) : addGuestValue(op)} className="flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px] hover:bg-accent">
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
                  <button type="button" className="inline-flex h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring">
                    <CalendarDays className="h-4 w-4 opacity-70" />
                    <span>{date ? format(new Date(`${date}T12:00:00`), "dd/MM/yyyy") : "dd/mm/aaaa"}</span>
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date ? new Date(`${date}T12:00:00`) : undefined}
                    onSelect={(d) => {
                      if (d) setDate(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);
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
              {typeCards.map((opt) => {
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

          {lockedClient && (
            <NewField label="Cliente">
              <div className="flex h-9 items-center gap-2 rounded-md border border-input bg-muted/40 px-3 text-[13px] text-foreground">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{lockedClient.label}</span>
              </div>
            </NewField>
          )}

          {type === "Visita presencial" && (
            <div className="grid gap-3 sm:grid-cols-2">
              {!lockedClient && (
                <NewField label="Cliente">
                  <Input value={client} onChange={(e) => setClient(e.target.value)} placeholder="Sigla ou razão social" />
                </NewField>
              )}
              <NewField label="Responsável">
                <SelectNative value={responsible} onChange={setResponsible} options={PRC_OPERATORS} />
              </NewField>
              <NewField label="Endereço" className="sm:col-span-2">
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-8" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, cidade" />
                </div>
              </NewField>
              <div className="sm:col-span-2 flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/25 px-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium">Deslocamento necessário</p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    Ative para reservar um veículo da frota. A retirada é feita na Frota ou na Agenda do dia.
                  </p>
                </div>
                <Switch checked={needsDisplacement} onCheckedChange={setNeedsDisplacement} className="cursor-pointer" />
              </div>
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

          {type === "Reunião na Prócion" && (
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
                  <Checkbox checked={isPrivate} onCheckedChange={(v) => setIsPrivate(v === true)} className="h-4 w-4 cursor-pointer" />
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Evento privado
                </label>
              </div>
            </div>
          )}

          <section className="rounded-lg border border-border bg-background/40">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <p className="text-[12px] font-medium uppercase tracking-wider text-muted-foreground">Agendamentos do dia</p>
              <Badge variant="secondary" className="text-[11px]">{dayEvents.length}</Badge>
            </div>
            {dayEvents.length === 0 ? (
              <p className="px-3 py-4 text-center text-[12.5px] text-muted-foreground">Nenhum agendamento para esta data</p>
            ) : (
              <div className="max-h-48 overflow-y-auto">
                <table className="w-full text-left text-[12px]">
                  <thead className="sticky top-0 bg-background/95 text-[11px] uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-3 py-1.5 font-medium">Horário</th>
                      <th className="px-2 py-1.5 font-medium">Tipo</th>
                      <th className="px-2 py-1.5 font-medium">Título</th>
                      <th className="px-2 py-1.5 font-medium">Operador</th>
                      <th className="px-3 py-1.5 font-medium">Local</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dayEvents.map((ev) => {
                      const Icon = TYPE_ICON[ev.type];
                      return (
                        <tr key={ev.id} className="border-t border-border/50">
                          <td className="px-3 py-1.5 tabular-nums text-foreground">{ev.time}–{ev.end}</td>
                          <td className="px-2 py-1.5">
                            <span className="inline-flex items-center gap-1 text-muted-foreground">
                              <Icon className="h-3.5 w-3.5" />
                              {ev.type}
                            </span>
                          </td>
                          <td className="px-2 py-1.5 text-foreground">{ev.title}</td>
                          <td className="px-2 py-1.5 text-muted-foreground">{ev.operator || "—"}</td>
                          <td className="px-3 py-1.5 text-muted-foreground">{ev.address || ev.room || ev.client || "—"}</td>
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
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">Cancelar</Button>
          <Button onClick={submit} className="cursor-pointer bg-blue-600 text-white hover:bg-blue-700">
            <CalendarDays className="mr-1.5 h-4 w-4" />
            Adicionar evento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SelectNative({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 w-full cursor-pointer rounded-md border border-input bg-background px-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
    >
      {options.map((option) => <option key={option}>{option}</option>)}
    </select>
  );
}

function NewField({ label, required, children, className }: { label: string; required?: boolean; children: ReactNode; className?: string }) {
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
