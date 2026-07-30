import * as React from "react";
import { Loader2, SpellCheck2, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSpellCorrection } from "@/lib/spellcheck";

type Common = {
  value: string;
  onValueChange: (next: string) => void;
  /** Desliga o corretor (campos técnicos, busca, códigos). */
  autoCorrectPtBr?: boolean;
  hintClassName?: string;
};

function CorrectionHint({
  correcting,
  corrected,
  onUndo,
  className,
}: {
  correcting: boolean;
  corrected: boolean;
  onUndo: () => void;
  className?: string;
}) {
  if (!correcting && !corrected) return null;
  return (
    <div
      className={cn(
        "mt-1 flex items-center gap-2 text-[11px] text-muted-foreground",
        className,
      )}
      aria-live="polite"
    >
      {correcting ? (
        <>
          <Loader2 className="h-3 w-3 animate-spin" />
          <span>Revisando ortografia…</span>
        </>
      ) : (
        <>
          <SpellCheck2 className="h-3 w-3 text-primary" />
          <span>Ortografia corrigida.</span>
          <button
            type="button"
            onClick={onUndo}
            className="inline-flex cursor-pointer items-center gap-1 font-medium text-primary hover:underline"
          >
            <Undo2 className="h-3 w-3" />
            Desfazer correção
          </button>
        </>
      )}
    </div>
  );
}

export const SmartTextarea = React.forwardRef<
  HTMLTextAreaElement,
  Omit<React.ComponentProps<"textarea">, "value" | "onChange"> & Common
>(({ value, onValueChange, autoCorrectPtBr = true, hintClassName, onBlur, ...props }, ref) => {
  const correction = useSpellCorrection({
    value,
    onChange: onValueChange,
    enabled: autoCorrectPtBr,
  });

  return (
    <div className="w-full">
      <Textarea
        {...props}
        ref={ref}
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
          correction.notifyTyping();
        }}
        onBlur={(event) => {
          correction.runNow();
          onBlur?.(event);
        }}
      />
      <CorrectionHint
        correcting={correction.correcting}
        corrected={correction.corrected}
        onUndo={correction.undo}
        className={hintClassName}
      />
    </div>
  );
});
SmartTextarea.displayName = "SmartTextarea";

export const SmartInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "value" | "onChange"> & Common
>(({ value, onValueChange, autoCorrectPtBr = true, hintClassName, onBlur, ...props }, ref) => {
  const correction = useSpellCorrection({
    value,
    onChange: onValueChange,
    enabled: autoCorrectPtBr,
  });

  return (
    <div className="w-full">
      <Input
        {...props}
        ref={ref}
        lang="pt-BR"
        spellCheck
        autoCorrect="on"
        autoCapitalize="sentences"
        value={value}
        onChange={(event) => {
          onValueChange(event.target.value);
          correction.notifyTyping();
        }}
        onBlur={(event) => {
          correction.runNow();
          onBlur?.(event);
        }}
      />
      <CorrectionHint
        correcting={correction.correcting}
        corrected={correction.corrected}
        onUndo={correction.undo}
        className={hintClassName}
      />
    </div>
  );
});
SmartInput.displayName = "SmartInput";
