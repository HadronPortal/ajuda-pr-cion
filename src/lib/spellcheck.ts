import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";

/**
 * Corretor ortográfico pt-BR para campos de texto livre.
 *
 * A correção é feita no servidor (Edge Function `spellcheck-ptbr`) — nenhuma
 * chave de IA fica exposta no frontend. O texto nunca é resumido nem apagado:
 * o backend descarta correções que alterem o tamanho/estrutura do conteúdo.
 */

const cache = new Map<string, string>();

/** Padrões que nunca devem ser enviados ao corretor. */
const SKIP_PATTERNS = [
  /https?:\/\//i,
  /\b[\w.+-]+@[\w-]+\.[\w.]+\b/, // e-mail
  /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/, // CNPJ
  /\b\d{3}\.?\d{3}\.?\d{3}-?\d{2}\b/, // CPF
  /\b\d{5}-?\d{3}\b/, // CEP
  /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, // UUID
];

export function shouldSkipCorrection(text: string) {
  const trimmed = text.trim();
  if (trimmed.length < 6) return true;
  if (trimmed.length > 4000) return true;
  // Apenas números/códigos, sem palavras reais.
  if (!/\p{L}{3,}/u.test(trimmed)) return true;
  return SKIP_PATTERNS.some((pattern) => pattern.test(trimmed));
}

export async function correctPtBr(text: string): Promise<string> {
  if (shouldSkipCorrection(text)) return text;
  const cached = cache.get(text);
  if (cached !== undefined) return cached;

  const { data, error } = await supabase.functions.invoke("spellcheck-ptbr", {
    body: { text },
  });
  if (error) throw error;

  const corrected = (data as { corrected?: string } | null)?.corrected;
  const result = typeof corrected === "string" && corrected.trim() ? corrected : text;
  cache.set(text, result);
  return result;
}

type Options = {
  value: string;
  onChange: (next: string) => void;
  enabled?: boolean;
  /** Pausa (ms) na digitação antes de corrigir. */
  delay?: number;
};

export type SpellCorrectionState = {
  correcting: boolean;
  corrected: boolean;
  undo: () => void;
  dismiss: () => void;
  /** Dispara a correção manualmente (usado no onBlur). */
  runNow: () => void;
  /** Deve ser chamado a cada digitação para reiniciar o debounce. */
  notifyTyping: () => void;
};

export function useSpellCorrection({
  value,
  onChange,
  enabled = true,
  delay = 1200,
}: Options): SpellCorrectionState {
  const [correcting, setCorrecting] = useState(false);
  const [previous, setPrevious] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(value);
  const running = useRef(false);
  latest.current = value;

  const run = useCallback(async () => {
    if (!enabled || running.current) return;
    const source = latest.current;
    if (!source || shouldSkipCorrection(source)) return;

    running.current = true;
    setCorrecting(true);
    try {
      const corrected = await correctPtBr(source);
      // Se o usuário continuou digitando, não sobrescreve.
      if (corrected !== source || latest.current !== source) {
        if (latest.current === source && corrected !== source) {
          setPrevious(source);
          onChange(corrected);
        }
      }
    } catch {
      // Falha no corretor nunca deve atrapalhar a digitação.
    } finally {
      running.current = false;
      setCorrecting(false);
    }
  }, [enabled, onChange]);

  const notifyTyping = useCallback(() => {
    if (!enabled) return;
    setPrevious(null);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void run(), delay);
  }, [delay, enabled, run]);

  const runNow = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    void run();
  }, [run]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const undo = useCallback(() => {
    if (previous === null) return;
    onChange(previous);
    setPrevious(null);
  }, [onChange, previous]);

  return {
    correcting,
    corrected: previous !== null,
    undo,
    dismiss: () => setPrevious(null),
    runNow,
    notifyTyping,
  };
}
