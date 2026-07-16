import { useMemo, useState } from "react";
import { Check, Clipboard, ExternalLink, FileSearch } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const SEFAZ_CONSULT_URL = "https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx";

function onlyDigits(value: string) {
  return value.replace(/\D/g, "").slice(0, 44);
}

function isValidNfeKey(key: string) {
  if (!/^\d{44}$/.test(key) || /^(\d)\1{43}$/.test(key)) return false;

  let weight = 2;
  let sum = 0;
  for (let index = 42; index >= 0; index -= 1) {
    sum += Number(key[index]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }

  const remainder = sum % 11;
  const digit = remainder === 0 || remainder === 1 ? 0 : 11 - remainder;
  return digit === Number(key[43]);
}

async function copyKey(key: string) {
  await navigator.clipboard.writeText(key);
  toast.success("Chave copiada");
}

export function NfeConsultDialog() {
  const [open, setOpen] = useState(false);
  const [key, setKey] = useState("");
  const [copied, setCopied] = useState(false);
  const isComplete = key.length === 44;
  const isValid = useMemo(() => isValidNfeKey(key), [key]);

  async function handleCopy() {
    await copyKey(key);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openSefazConsult() {
    const params = new URLSearchParams({
      tipoConsulta: "resumo",
      tipoConteudo: "7PhJ+gAVw2g=",
      nfe: key,
    });
    void copyKey(key).catch(() => {
      toast.info("Não foi possível copiar a chave automaticamente.");
    });
    window.open(`${SEFAZ_CONSULT_URL}?${params.toString()}`, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 cursor-pointer border-current/20 bg-transparent px-3 hover:bg-current/10"
        >
          <FileSearch className="h-4 w-4" />
          Consultar NF-e
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[calc(100vw-2rem)] max-w-[560px] rounded-2xl border-border bg-card p-0 shadow-2xl">
        <DialogHeader className="border-b border-border px-6 py-5 pr-12">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <FileSearch className="h-5 w-5" />
            </span>
            <div>
              <DialogTitle className="text-base font-medium">Consultar NF-e</DialogTitle>
              <DialogDescription className="mt-1 text-xs">
                Consulte a situação da nota no Portal Nacional da NF-e.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 px-6 py-5">
          <div className="space-y-2">
            <label htmlFor="nfe-key" className="text-sm text-foreground">
              Chave de acesso
            </label>
            <div className="flex gap-2">
              <Input
                id="nfe-key"
                value={key}
                onChange={(event) => {
                  setKey(onlyDigits(event.target.value));
                  setCopied(false);
                }}
                inputMode="numeric"
                autoComplete="off"
                placeholder="Informe os 44 dígitos da chave"
                className="h-11 font-mono text-sm"
                aria-invalid={isComplete && !isValid}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={!isComplete}
                onClick={() => void handleCopy()}
                title="Copiar chave"
                aria-label="Copiar chave"
                className="h-11 w-11 shrink-0"
              >
                {copied ? <Check /> : <Clipboard />}
              </Button>
            </div>
            <div className="flex items-center justify-between gap-3 text-[11px]">
              <span
                className={isComplete && !isValid ? "text-destructive" : "text-muted-foreground"}
              >
                {isComplete && !isValid
                  ? "A chave informada não possui um dígito verificador válido."
                  : "A consulta oficial exige a confirmação do hCaptcha."}
              </span>
              <span className="shrink-0 text-muted-foreground">{key.length}/44</span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
            Por segurança, a SEFAZ abrirá em uma nova aba. A chave será copiada automaticamente para
            facilitar a consulta.
          </div>
        </div>

        <DialogFooter className="border-t border-border px-6 py-4">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="button" disabled={!isValid} onClick={openSefazConsult}>
            Consultar na SEFAZ
            <ExternalLink className="h-4 w-4" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
