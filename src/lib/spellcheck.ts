import { useCallback, useEffect, useRef, useState, type ChangeEvent } from "react";
import { supabase } from "@/lib/supabase";
import { correctWord } from "@/lib/ptbr-dictionary";

/**
 * Corretor ortográfico pt-BR para campos de texto livre.
 *
 * Duas camadas:
 * 1. Instantânea (local, sem rede): ao fechar uma palavra com espaço, vírgula,
 *    ponto, Enter ou outra pontuação, apenas a palavra recém-digitada é
 *    verificada em um dicionário local. A posição do cursor é preservada.
 * 2. Contextual (servidor, em segundo plano): após uma pausa maior na digitação
 *    — ou ao sair do campo — o texto completo é revisado pela Edge Function
 *    `spellcheck-ptbr`. Nenhuma chave de IA fica exposta no frontend e o texto
 *    nunca é resumido nem apagado.
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

/** Caracteres que fecham uma palavra. */
const BOUNDARY = /[\s.,;:!?)\]}"'\n\r\t/]/;
const WORD_TAIL = /[\p{L}\p{M}]+$/u;

type InstantResult = { value: string; caret: number } | null;

/**
 * Corrige a última palavra fechada, preservando a posição do cursor.
 * Retorna `null` quando não há nada a corrigir.
 */
export function correctLastWord(value: string, caret: number): InstantResult {
  if (caret <= 1 || caret > value.length) return null;
  const boundaryChar = value[caret - 1];
  if (!BOUNDARY.test(boundaryChar)) return null;

  const head = value.slice(0, caret - 1);
  const match = head.match(WORD_TAIL);
  if (!match) return null;

  const word = match[0];
  const fixed = correctWord(word);
  if (!fixed || fixed === word) return null;

  const start = head.length - word.length;
  const next = value.slice(0, start) + fixed + value.slice(start + word.length);
  return { value: next, caret: caret + (fixed.length - word.length) };
}

type Field = HTMLInputElement | HTMLTextAreaElement;

type Options = {
  value: string;
  onChange: (next: string) => void;
  enabled?: boolean;
  /** Pausa (ms) na digitação antes da revisão contextual em segundo plano. */
  delay?: number;
};

export type SpellCorrectionState = {
  correcting: boolean;
  corrected: boolean;
  undo: () => void;
  dismiss: () => void;
  /** Dispara a revisão contextual manualmente (usado no onBlur). */
  runNow: () => void;
  /**
   * Deve ser chamado a cada digitação. Quando o evento é informado, aplica a
   * correção instantânea da palavra recém-fechada preservando o cursor.
   */
  notifyTyping: (event?: ChangeEvent<Field> | Field | null) => void;
};

/** Tempo (ms) que a indicação de "corrigido" permanece visível. */
const HINT_TTL = 4000;

export function useSpellCorrection({
  value,
  onChange,
  enabled = true,
  delay = 2500,
}: Options): SpellCorrectionState {
  const [correcting, setCorrecting] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const previous = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hintTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef(value);
  const running = useRef(false);
  /** Cursor a restaurar após uma correção instantânea. */
  const pendingCaret = useRef<{ el: Field; pos: number } | null>(null);
  latest.current = value;

  const flashHint = useCallback(() => {
    setHintVisible(true);
    if (hintTimer.current) clearTimeout(hintTimer.current);
    hintTimer.current = setTimeout(() => setHintVisible(false), HINT_TTL);
  }, []);

  // Restaura o cursor no mesmo frame do commit do React (sem piscar).
  useEffect(() => {
    const pending = pendingCaret.current;
    if (!pending) return;
    pendingCaret.current = null;
    const { el, pos } = pending;
    if (document.activeElement !== el) return;
    try {
      el.setSelectionRange(pos, pos);
    } catch {
      // inputs sem suporte a seleção (ex.: type=email) — ignora.
    }
  });

  const run = useCallback(async () => {
    if (!enabled || running.current) return;
    const source = latest.current;
    if (!source || shouldSkipCorrection(source)) return;

    running.current = true;
    setCorrecting(true);
    try {
      const corrected = await correctPtBr(source);
      if (corrected !== source && latest.current === source) {
        previous.current = source;
        onChange(corrected);
        flashHint();
      }
    } catch {
      // Falha no corretor nunca deve atrapalhar a digitação.
    } finally {
      running.current = false;
      setCorrecting(false);
    }
  }, [enabled, flashHint, onChange]);

  const notifyTyping = useCallback(
    (input?: ChangeEvent<Field> | Field | null) => {
      if (!enabled) return;

      // 1) Correção instantânea da palavra recém-fechada.
      const el = input
        ? ((input as ChangeEvent<Field>).target ?? (input as Field))
        : null;
      if (el && typeof el.selectionStart === "number") {
        const caret = el.selectionStart;
        // Só corrige quando não há seleção ativa.
        if (el.selectionEnd === caret) {
          const instant = correctLastWord(el.value, caret);
          if (instant) {
            previous.current = el.value;
            latest.current = instant.value;
            pendingCaret.current = { el, pos: instant.caret };
            onChange(instant.value);
            flashHint();
          }
        }
      }

      // 2) Revisão contextual completa depois de uma pausa maior.
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void run(), delay);
    },
    [delay, enabled, flashHint, onChange, run],
  );

  const runNow = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    void run();
  }, [run]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (hintTimer.current) clearTimeout(hintTimer.current);
    },
    [],
  );

  const undo = useCallback(() => {
    if (previous.current === null) return;
    onChange(previous.current);
    previous.current = null;
    setHintVisible(false);
  }, [onChange]);

  return {
    correcting,
    corrected: hintVisible,
    undo,
    dismiss: () => setHintVisible(false),
    runNow,
    notifyTyping,
  };
}
