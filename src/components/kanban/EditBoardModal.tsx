import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateKanbanBoard, type BoardSummary } from "@/lib/kanban-api";

const COLORS = [
  { id: "blue", className: "from-sky-500 to-blue-600" },
  { id: "green", className: "from-emerald-500 to-teal-600" },
  { id: "purple", className: "from-violet-500 to-purple-600" },
  { id: "orange", className: "from-amber-500 to-orange-600" },
  { id: "pink", className: "from-pink-500 to-rose-600" },
  { id: "slate", className: "from-slate-500 to-slate-700" },
];

export function EditBoardModal({
  board,
  open,
  onOpenChange,
  onSaved,
}: {
  board: BoardSummary;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(board.name);
  const [description, setDescription] = useState(board.description);
  const [color, setColor] = useState(board.color ?? "blue");
  const [visibility, setVisibility] = useState<string>(board.visibility ?? "team");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setName(board.name);
      setDescription(board.description);
      setColor(board.color ?? "blue");
      setVisibility(board.visibility ?? "team");
    }
  }, [open, board]);

  const submit = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome do quadro.");
      return;
    }
    setSaving(true);
    try {
      await updateKanbanBoard({
        data: {
          id: board.id,
          name: name.trim(),
          description: description.trim(),
          color,
          visibility,
        },
      });
      toast.success("Quadro atualizado.");
      onSaved();
    } catch {
      toast.error("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Editar quadro</DialogTitle>
          <DialogDescription>Atualize nome, descrição, cor e visibilidade.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-board-name">Nome</Label>
            <Input id="edit-board-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-board-desc">Descrição</Label>
            <Textarea
              id="edit-board-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="grid gap-2">
            <Label>Cor / capa</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={cn(
                    "h-9 w-14 cursor-pointer rounded-md bg-gradient-to-r transition",
                    c.className,
                    color === c.id ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "opacity-80 hover:opacity-100",
                  )}
                />
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="edit-board-visibility">Visibilidade</Label>
            <Select value={visibility} onValueChange={setVisibility}>
              <SelectTrigger id="edit-board-visibility" className="cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="team" className="cursor-pointer">Equipe</SelectItem>
                <SelectItem value="private" className="cursor-pointer">Privado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button className="cursor-pointer" onClick={() => void submit()} disabled={saving}>
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
