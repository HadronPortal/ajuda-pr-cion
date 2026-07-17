import * as React from "react";
import { format } from "date-fns";
import {
  Archive,
  ArrowRightLeft,
  CalendarIcon,
  Copy,
  ExternalLink,
  Link2,
  MoreHorizontal,
  Tag,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { kanbanStore } from "@/lib/kanban-store";
import {
  kanbanMembers,
  type KanbanCard,
  type KanbanColumn,
  type ColumnId,
} from "@/lib/kanban-data";

type Props = {
  card: KanbanCard;
  columns: KanbanColumn[];
  onOpen?: () => void;
  onArchive?: (card: KanbanCard) => void;
};

const TAG_SUGGESTIONS = [
  "fiscal",
  "financeiro",
  "estoque",
  "logística",
  "urgente",
  "bug",
  "melhoria",
  "docs",
];

export function KanbanCardMenu({ card, columns, onOpen, onArchive }: Props) {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [dialog, setDialog] = React.useState<
    "tags" | "members" | "date" | "move" | null
  >(null);

  const stop = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const openDialog = (key: "tags" | "members" | "date" | "move") => {
    setMenuOpen(false);
    setDialog(key);
  };

  const handleCopyCard = () => {
    setMenuOpen(false);
    const clone: KanbanCard = {
      ...card,
      id: "",
      title: `Cópia de ${card.title}`,
    };
    kanbanStore.addCard(clone);
    toast.success("Cartão duplicado");
  };

  const handleCopyLink = async () => {
    setMenuOpen(false);
    const url = `${window.location.origin}${window.location.pathname}#card-${card.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link do cartão copiado");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  const handleArchive = () => {
    setMenuOpen(false);
    const archivedCol = columns.find(
      (c) =>
        c.id === "arquivado" ||
        /arquiv|finaliz/i.test(c.id) ||
        /arquiv|finaliz/i.test(c.title),
    );
    if (archivedCol) {
      kanbanStore.updateCard({
        ...card,
        columnId: archivedCol.id,
        archived: true,
      });
    } else {
      kanbanStore.updateCard({ ...card, archived: true });
    }
    onArchive?.(card);
    toast.success("Cartão arquivado");
  };

  const items: {
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    danger?: boolean;
  }[] = [
    { key: "open", label: "Abrir cartão", icon: ExternalLink, onClick: () => { setMenuOpen(false); onOpen?.(); } },
    { key: "tags", label: "Editar etiquetas", icon: Tag, onClick: () => openDialog("tags") },
    { key: "members", label: "Alterar membros", icon: Users, onClick: () => openDialog("members") },
    { key: "date", label: "Editar datas", icon: CalendarIcon, onClick: () => openDialog("date") },
    { key: "move", label: "Mover", icon: ArrowRightLeft, onClick: () => openDialog("move") },
    { key: "copy", label: "Copiar cartão", icon: Copy, onClick: handleCopyCard },
    { key: "link", label: "Copiar link", icon: Link2, onClick: handleCopyLink },
    { key: "archive", label: "Arquivar", icon: Archive, onClick: handleArchive, danger: true },
  ];

  return (
    <>
      <Popover open={menuOpen} onOpenChange={setMenuOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={stop}
            onPointerDown={stop}
            className="grid h-6 w-6 cursor-pointer place-items-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-500 dark:hover:bg-white/7 dark:hover:text-white"
            aria-label="Ações do card"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-56 p-1"
          onClick={stop}
          onPointerDown={stop}
        >
          <ul className="flex flex-col">
            {items.map((it) => (
              <li key={it.key}>
                <button
                  onClick={it.onClick}
                  className={cn(
                    "flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-left text-[13px] transition hover:bg-slate-100 dark:hover:bg-white/8",
                    it.danger
                      ? "text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
                      : "text-slate-700 dark:text-slate-200",
                  )}
                >
                  <it.icon className="h-4 w-4 shrink-0" />
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>

      <TagsDialog
        open={dialog === "tags"}
        onOpenChange={(o) => !o && setDialog(null)}
        card={card}
      />
      <MembersDialog
        open={dialog === "members"}
        onOpenChange={(o) => !o && setDialog(null)}
        card={card}
      />
      <DateDialog
        open={dialog === "date"}
        onOpenChange={(o) => !o && setDialog(null)}
        card={card}
      />
      <MoveDialog
        open={dialog === "move"}
        onOpenChange={(o) => !o && setDialog(null)}
        card={card}
        columns={columns}
      />
    </>
  );
}

/* ---------------- Etiquetas ---------------- */

function TagsDialog({
  open,
  onOpenChange,
  card,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  card: KanbanCard;
}) {
  const [tags, setTags] = React.useState<string[]>(card.tags ?? []);
  const [input, setInput] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setTags(card.tags ?? []);
      setInput("");
    }
  }, [open, card]);

  const toggle = (t: string) => {
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  };

  const addNew = () => {
    const clean = input.trim().toLowerCase();
    if (!clean) return;
    if (!tags.includes(clean)) setTags([...tags, clean]);
    setInput("");
  };

  const save = () => {
    kanbanStore.updateCard({ ...card, tags });
    toast.success("Etiquetas atualizadas");
    onOpenChange(false);
  };

  const suggestions = Array.from(new Set([...TAG_SUGGESTIONS, ...(card.tags ?? [])]));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Editar etiquetas</DialogTitle>
          <DialogDescription>
            Selecione ou crie etiquetas para este cartão.
          </DialogDescription>
        </DialogHeader>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-1 rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] font-medium text-violet-700 dark:text-violet-200"
              >
                {t}
                <button
                  type="button"
                  onClick={() => toggle(t)}
                  className="cursor-pointer rounded hover:bg-violet-500/25"
                  aria-label={`Remover ${t}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Nova etiqueta"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addNew();
              }
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={addNew}
          >
            Adicionar
          </Button>
        </div>

        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Sugestões
          </p>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((t) => {
              const active = tags.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggle(t)}
                  className={cn(
                    "cursor-pointer rounded-md border px-2 py-0.5 text-[11px] font-medium transition",
                    active
                      ? "border-violet-500/50 bg-violet-500/15 text-violet-700 dark:text-violet-200"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10",
                  )}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" onClick={save}>
            Salvar etiquetas
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Membros ---------------- */

function MembersDialog({
  open,
  onOpenChange,
  card,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  card: KanbanCard;
}) {
  const [assigneeId, setAssigneeId] = React.useState(card.assigneeId);
  const [participants, setParticipants] = React.useState<string[]>(
    card.participants ?? [],
  );

  React.useEffect(() => {
    if (open) {
      setAssigneeId(card.assigneeId);
      setParticipants(card.participants ?? []);
    }
  }, [open, card]);

  const toggleParticipant = (id: string) => {
    setParticipants((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const save = () => {
    kanbanStore.updateCard({ ...card, assigneeId, participants });
    toast.success("Membros atualizados");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Alterar membros</DialogTitle>
          <DialogDescription>
            Defina o responsável e os participantes do cartão.
          </DialogDescription>
        </DialogHeader>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Responsável
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {kanbanMembers.map((m) => {
              const active = assigneeId === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAssigneeId(m.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-left text-[12px] transition",
                    active
                      ? "border-violet-500/60 bg-violet-500/10 text-slate-900 dark:text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={cn("text-[9px] font-black", m.color)}>
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Participantes
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {kanbanMembers.map((m) => {
              const active = participants.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleParticipant(m.id)}
                  className={cn(
                    "flex cursor-pointer items-center gap-2 rounded-md border px-2 py-1.5 text-left text-[12px] transition",
                    active
                      ? "border-emerald-500/60 bg-emerald-500/10 text-slate-900 dark:text-white"
                      : "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10",
                  )}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className={cn("text-[9px] font-black", m.color)}>
                      {m.initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate">{m.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" onClick={save}>
            Salvar membros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Datas ---------------- */

function DateDialog({
  open,
  onOpenChange,
  card,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  card: KanbanCard;
}) {
  const parse = (iso?: string) => {
    if (!iso) return undefined;
    const d = new Date(iso + "T00:00:00");
    return Number.isNaN(d.getTime()) ? undefined : d;
  };
  const [date, setDate] = React.useState<Date | undefined>(parse(card.dueDate));

  React.useEffect(() => {
    if (open) setDate(parse(card.dueDate));
  }, [open, card]);

  const save = () => {
    const iso = date ? date.toISOString().slice(0, 10) : "";
    kanbanStore.updateCard({ ...card, dueDate: iso });
    toast.success(date ? "Data de vencimento atualizada" : "Data removida");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Editar datas</DialogTitle>
          <DialogDescription>
            Defina a data de vencimento deste cartão.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-2">
          <div className="text-[12px] text-muted-foreground">
            {date ? format(date, "PPP") : "Sem data definida"}
          </div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className={cn("rounded-md border p-3 pointer-events-auto")}
          />
          {date && (
            <button
              type="button"
              onClick={() => setDate(undefined)}
              className="cursor-pointer text-[11px] font-medium text-rose-600 hover:underline dark:text-rose-400"
            >
              Remover data
            </button>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" onClick={save}>
            Salvar data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- Mover ---------------- */

function MoveDialog({
  open,
  onOpenChange,
  card,
  columns,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  card: KanbanCard;
  columns: KanbanColumn[];
}) {
  const move = (target: ColumnId) => {
    if (target === card.columnId) {
      onOpenChange(false);
      return;
    }
    kanbanStore.updateCard({
      ...card,
      columnId: target,
      archived: target === "arquivado" ? true : card.archived,
    });
    const col = columns.find((c) => c.id === target);
    toast.success(`Movido para "${col?.title ?? target}"`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[380px]">
        <DialogHeader>
          <DialogTitle>Mover cartão</DialogTitle>
          <DialogDescription>Escolha a lista de destino.</DialogDescription>
        </DialogHeader>

        <ul className="flex flex-col gap-1">
          {columns.map((c) => {
            const active = c.id === card.columnId;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => move(c.id)}
                  disabled={active}
                  className={cn(
                    "flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-[13px] font-semibold transition",
                    active
                      ? "cursor-not-allowed border-slate-200 bg-white text-slate-400 dark:border-white/10 dark:bg-white/5 dark:text-slate-500"
                      : "cursor-pointer border-slate-200 bg-white text-slate-700 hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:bg-white/10",
                  )}
                >
                  {c.title}
                  {active && <span className="text-[10px] font-medium">Lista atual</span>}
                </button>
              </li>
            );
          })}
        </ul>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
