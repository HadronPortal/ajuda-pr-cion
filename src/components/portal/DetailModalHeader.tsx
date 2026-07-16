import type { ReactNode } from "react";
import { X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cabeçalho padronizado para modais de detalhe e telas afins.
 *
 * Estrutura: faixa colorida à esquerda, ícone circular sólido, título,
 * metadados/protocolo, chips e botão X. O mesmo ícone é reutilizado como
 * marca d'água decorativa à direita (apenas em telas médias+).
 */
export function DetailModalHeader({
  icon: Icon,
  title,
  protocol,
  meta,
  chips,
  onClose,
  accentClassName = "bg-primary",
  iconWrapClassName = "bg-primary text-primary-foreground",
  decorativeIconClassName = "text-primary/10",
}: {
  icon: LucideIcon;
  title: string;
  protocol?: string;
  meta?: ReactNode;
  chips?: ReactNode;
  onClose: () => void;
  /** Classe da faixa vertical à esquerda. */
  accentClassName?: string;
  /** Classe do círculo sólido do ícone (fundo + cor). */
  iconWrapClassName?: string;
  /** Classe da marca d'água (ícone grande decorativo). */
  decorativeIconClassName?: string;
}) {
  return (
    <header className="relative shrink-0 border-b border-border bg-card px-4 pb-4 pt-4 md:px-6 md:pb-5 md:pt-5">
      <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_12px_rgba(15,23,42,0.05)]">
        <span aria-hidden className={cn("absolute left-0 top-0 h-full w-1", accentClassName)} />

        <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-md text-muted-foreground transition hover:bg-accent hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 md:block",
            decorativeIconClassName,
          )}
        >
          <Icon className="h-24 w-24" strokeWidth={2.25} fill="currentColor" />
        </span>

        <div className="flex items-start gap-3 pl-5 pr-16 py-4 md:gap-4 md:py-5">
          <span
            aria-hidden
            className={cn(
              "grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-sm ring-1 ring-inset ring-white/10",
              iconWrapClassName,
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2.5} />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {protocol && (
                <span className="font-mono text-[12px] font-semibold uppercase tracking-wider text-foreground">
                  {protocol}
                </span>
              )}
              {chips}
            </div>

            <h2 className="mt-1.5 text-[16px] font-medium leading-snug text-foreground">
              {title}
            </h2>

            {meta && (
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-muted-foreground">
                {meta}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
