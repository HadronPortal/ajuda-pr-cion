import { useState } from "react";
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
import { createKanbanBoard } from "@/lib/kanban-api";

const COLORS: { id: string; className: string; label: string }[] = [
  { id: "blue", className: "from-sky-500 to-blue-600", label: "Azul" },
  { id: "green", className: "from-emerald-500 to-teal-600", label: "Verde" },
  { id: "purple", className: "from-violet-500 to-purple-600", label: "Roxo" },
  { id: "orange", className: "from-amber-500 to-orange-600", label: "Laranja" },
  { id: "pink", className: "from-pink-500 to-rose-600", label: "Rosa" },
  { id: "slate", className: "from-slate-500 to-slate-700", label: "Grafite" },
];

export function CreateBoardModal({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("blue");
  const [visibility, setVisibility] = useState<"team" | "private">("team");
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setName("");
    setDescription("");
    setColor("blue");
    setVisibility("team");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Informe o nome do quadro.");
      return;
    }
    setSaving(true);
    try {
      const res = await createKanbanBoard({
        data: {
          name: name.trim(),
          description: description.trim(),
          color,
          visibility,
        },
      });
      toast.success("Quadro criado.");
      reset();
      onCreated(res.id);
    } catch {
      toast.error("Não foi possível criar o quadro.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-lg"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Criar quadro</DialogTitle>
          <DialogDescription>
            Organize suas demandas em um novo quadro Kanban.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="board-name">Nome</Label>
            <Input
              id="board-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Melhorias ERP"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="board-desc">Descrição</Label>
            <Textarea
              id="board-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição curta"
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
                  title={c.label}
                  onClick={() => setColor(c.id)}
                  className={cn(
                    "h-9 w-14 cursor-pointer rounded-md bg-gradient-to-r ring-offset-background transition",
                    c.className,
                    color === c.id
                      ? "ring-2 ring-primary ring-offset-2"
                      : "opacity-80 hover:opacity-100",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="board-visibility">Visibilidade</Label>
            <Select
              value={visibility}
              onValueChange={(v) => setVisibility(v as "team" | "private")}
            >
              <SelectTrigger id="board-visibility" className="cursor-pointer">
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
          <Button
            className="cursor-pointer"
            onClick={() => void handleSubmit()}
            disabled={saving}
          >
            {saving ? "Criando..." : "Criar quadro"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
