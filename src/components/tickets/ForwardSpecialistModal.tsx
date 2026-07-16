import { useMemo, useState } from "react";
import { toast } from "sonner";
import { UserCheck, Search, CircleDot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { DetailModalHeader } from "@/components/portal/DetailModalHeader";
import { ticketsStore } from "@/lib/tickets-store";
import type { SupportTicket } from "@/lib/support-tickets-data";

type Specialist = {
  id: string;
  name: string;
  area: string;
  availability: "Disponível" | "Ocupado" | "Ausente";
};

const SPECIALISTS: Specialist[] = [
  { id: "esp-1", name: "Ana Ribeiro", area: "Fiscal / SPED", availability: "Disponível" },
  { id: "esp-2", name: "Bruno Martins", area: "NF-e / NFC-e", availability: "Disponível" },
  { id: "esp-3", name: "Carla Souza", area: "Financeiro", availability: "Ocupado" },
  { id: "esp-4", name: "Diego Alves", area: "Estoque / Produção", availability: "Disponível" },
  { id: "esp-5", name: "Eduarda Lima", area: "Integrações / API", availability: "Ausente" },
  { id: "esp-6", name: "Felipe Costa", area: "Segurança / Acesso", availability: "Disponível" },
];

const availabilityTone: Record<Specialist["availability"], string> = {
  Disponível: "text-success",
  Ocupado: "text-warning-foreground",
  Ausente: "text-muted-foreground",
};

function preventOutsideClose(e: Event) {
  e.preventDefault();
}

export function ForwardSpecialistModal({
  open,
  onOpenChange,
  ticket,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ticket: SupportTicket;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SPECIALISTS;
    return SPECIALISTS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.area.toLowerCase().includes(q),
    );
  }, [query]);

  const reset = () => {
    setQuery("");
    setSelectedId(null);
    setReason("");
  };

  const submit = () => {
    const specialist = SPECIALISTS.find((s) => s.id === selectedId);
    if (!specialist) {
      toast.error("Selecione um especialista.");
      return;
    }
    if (!reason.trim()) {
      toast.error("Informe o motivo do encaminhamento.");
      return;
    }
    ticketsStore.forwardToSpecialist(ticket.id, {
      specialist: specialist.name,
      area: specialist.area,
      reason: reason.trim(),
    });
    toast.success("Chamado encaminhado", {
      description: `${specialist.name} · ${specialist.area}`,
    });
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        onPointerDownOutside={preventOutsideClose}
        onInteractOutside={preventOutsideClose}
        onEscapeKeyDown={preventOutsideClose}
        className="flex max-h-[90vh] w-[calc(100vw-1rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border bg-background p-0 sm:w-[calc(100vw-2rem)] md:w-[640px] [&>button]:hidden"
      >
        <DialogTitle className="sr-only">
          Encaminhar chamado {ticket.protocol} a especialista
        </DialogTitle>

        <DetailModalHeader
          icon={UserCheck}
          title="Encaminhar a especialista"
          protocol={ticket.protocol}
          onClose={() => onOpenChange(false)}
          meta={
            <span className="inline-flex items-center gap-1">
              <span className="font-semibold text-primary">{ticket.clientCode}</span>
              <span aria-hidden className="text-border">·</span>
              <span className="truncate text-foreground">{ticket.clientName}</span>
            </span>
          }
        />

        <div className="flex-1 overflow-y-auto space-y-4 px-5 py-4 md:px-6">
          <div>
            <Label className="mb-1.5 block text-[12.5px] font-medium">
              Buscar especialista
            </Label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Nome ou área/especialidade"
                className="pl-8"
              />
            </div>
          </div>

          <div>
            <Label className="mb-1.5 block text-[12.5px] font-medium">
              Especialistas disponíveis
            </Label>
            <ul className="max-h-[280px] space-y-1.5 overflow-y-auto rounded-lg border border-border bg-card p-1.5">
              {list.length === 0 && (
                <li className="p-6 text-center text-[12.5px] text-muted-foreground">
                  Nenhum especialista encontrado.
                </li>
              )}
              {list.map((s) => {
                const selected = selectedId === s.id;
                const disabled = s.availability !== "Disponível";
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedId(s.id)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition",
                        selected
                          ? "border-primary bg-primary/5"
                          : "border-transparent hover:bg-accent",
                        disabled && "cursor-not-allowed opacity-60",
                        !disabled && "cursor-pointer",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/12 text-primary text-[12px] font-semibold",
                        )}
                      >
                        {s.name
                          .split(" ")
                          .slice(0, 2)
                          .map((p) => p[0])
                          .join("")}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-foreground">
                          {s.name}
                        </p>
                        <p className="truncate text-[11.5px] text-muted-foreground">
                          {s.area}
                        </p>
                      </div>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 text-[11px] font-medium",
                          availabilityTone[s.availability],
                        )}
                      >
                        <CircleDot className="h-3 w-3" />
                        {s.availability}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <Label className="mb-1.5 block text-[12.5px] font-medium">
              Motivo do encaminhamento <span className="text-destructive">*</span>
            </Label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Explique o motivo e o contexto para o especialista..."
              className="min-h-[90px] w-full resize-none rounded-md border border-input bg-background p-3 text-[13px] outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        <DialogFooter className="shrink-0 gap-2 border-t border-border bg-card px-5 py-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer rounded-lg"
          >
            Cancelar
          </Button>
          <Button onClick={submit} className="cursor-pointer rounded-lg">
            <UserCheck className="mr-1.5 h-4 w-4" />
            Encaminhar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
