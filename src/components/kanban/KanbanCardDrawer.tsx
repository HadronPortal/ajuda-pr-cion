import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  type KanbanCard,
  type ColumnId,
  kanbanMembers,
  kanbanClients,
  kanbanModules,
  kanbanColumnsDef,
  priorities,
  cardTypes,
  priorityMeta,
} from "@/lib/kanban-data";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  card: KanbanCard | null;
  mode: "edit" | "create";
  defaultColumnId?: ColumnId;
  onSave: (card: KanbanCard) => void;
  onDelete?: (id: string) => void;
};

const emptyDraft = (columnId: ColumnId): KanbanCard => ({
  id: "",
  columnId,
  title: "",
  summary: "",
  client: kanbanClients[0],
  module: kanbanModules[0],
  priority: "Média",
  type: "Suporte",
  assigneeId: kanbanMembers[0].id,
  dueDate: new Date().toISOString().slice(0, 10),
  tags: [],
  comments: 0,
  attachments: 0,
});

export function KanbanCardDrawer({
  open,
  onOpenChange,
  card,
  mode,
  defaultColumnId = "backlog",
  onSave,
  onDelete,
}: Props) {
  const [draft, setDraft] = useState<KanbanCard>(card ?? emptyDraft(defaultColumnId));
  const [tagsInput, setTagsInput] = useState((card?.tags ?? []).join(", "));

  useEffect(() => {
    if (open) {
      const base = card ?? emptyDraft(defaultColumnId);
      setDraft(base);
      setTagsInput((base.tags ?? []).join(", "));
    }
  }, [open, card, defaultColumnId]);

  const update = <K extends keyof KanbanCard>(key: K, value: KanbanCard[K]) => {
    setDraft((d) => ({ ...d, [key]: value }));
  };

  const handleSave = () => {
    if (!draft.title.trim()) return;
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean);
    onSave({ ...draft, tags });
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
        <div className="px-6 pt-6 pb-4 border-b border-border">
          <SheetHeader>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {mode === "edit" && draft.id && <span className="font-mono">{draft.id}</span>}
              {mode === "edit" && draft.id && <span>·</span>}
              <Badge
                className={cn(
                  "text-[10px]",
                  priorityMeta[draft.priority].badge,
                )}
              >
                {draft.priority}
              </Badge>
            </div>
            <SheetTitle className="text-xl mt-2">
              {mode === "create" ? "Novo card" : "Detalhes do card"}
            </SheetTitle>
            <SheetDescription>
              {mode === "create"
                ? "Preencha as informações da nova demanda."
                : "Edite as informações e clique em salvar."}
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="k-title">Título</Label>
            <Input
              id="k-title"
              value={draft.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Ex: Rejeição NF-e 539 na filial de Curitiba"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="k-summary">Descrição</Label>
            <Textarea
              id="k-summary"
              rows={4}
              value={draft.summary}
              onChange={(e) => update("summary", e.target.value)}
              placeholder="Breve resumo do problema, contexto e critérios de aceite."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={draft.columnId} onValueChange={(v) => update("columnId", v as ColumnId)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {kanbanColumnsDef.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={draft.priority} onValueChange={(v) => update("priority", v as KanbanCard["priority"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={draft.type} onValueChange={(v) => update("type", v as KanbanCard["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cardTypes.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Responsável</Label>
              <Select value={draft.assigneeId} onValueChange={(v) => update("assigneeId", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {kanbanMembers.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cliente</Label>
              <Select value={draft.client} onValueChange={(v) => update("client", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Interno">Interno</SelectItem>
                  {kanbanClients.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Módulo</Label>
              <Select value={draft.module} onValueChange={(v) => update("module", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {kanbanModules.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="k-due">Data limite</Label>
              <Input
                id="k-due"
                type="date"
                value={draft.dueDate}
                onChange={(e) => update("dueDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="k-tags">Tags (separadas por vírgula)</Label>
              <Input
                id="k-tags"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="fiscal, nf-e"
              />
            </div>
          </div>
        </div>

        <SheetFooter className="px-6 py-4 border-t border-border bg-muted/30 flex-row justify-between sm:justify-between">
          <div>
            {mode === "edit" && onDelete && draft.id && (
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                onClick={() => {
                  onDelete(draft.id);
                  onOpenChange(false);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Excluir
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleSave}>
              {mode === "create" ? "Criar card" : "Salvar"}
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
