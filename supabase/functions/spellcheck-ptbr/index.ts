// Supabase Edge Function: spellcheck-ptbr
// Deploy: supabase functions deploy spellcheck-ptbr --no-verify-jwt
// Requires env: LOVABLE_API_KEY.
//
// Corretor ortográfico/acentuação em português do Brasil, com contexto de frase.
// NUNCA resume, traduz, reescreve estilo ou remove conteúdo: apenas corrige.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders },
  });

const MAX_CHARS = 4000;

const SYSTEM_PROMPT = [
  "Você é um corretor ortográfico de português do Brasil para um CRM de suporte do ERP Hádron.",
  "Sua ÚNICA tarefa é corrigir erros de ortografia, acentuação, cedilha, hífen e maiúscula inicial de frase,",
  "usando o contexto da frase para decidir (ex.: 'nao' -> 'não'; 'esta' -> 'está' quando for verbo;",
  "'e' -> 'é' quando for verbo; 'ja' -> 'já'; 'usuario' -> 'usuário').",
  "REGRAS ABSOLUTAS:",
  "1. Nunca resuma, traduza, reescreva, reordene, encurte ou complete o texto.",
  "2. Mantenha exatamente o mesmo número de frases, a mesma ordem e todas as quebras de linha.",
  "3. Não altere: nomes próprios, siglas em maiúsculas, protocolos, códigos, números de documento,",
  "   nomes de módulos/telas/produtos do Hádron, e-mails, URLs, CNPJ/CPF/CEP, IDs, UUIDs e trechos entre aspas ou crase.",
  "4. Não invente palavras. Se uma palavra estiver incompleta ou você não tiver certeza do que ela é, deixe-a como está.",
  "5. Não mude a pontuação além do necessário para corrigir erro evidente.",
  "6. Não adicione comentários, títulos, markdown ou aspas ao redor da resposta.",
  "Responda SOMENTE com o texto corrigido.",
].join(" ");

async function correct(text: string) {
  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) throw new Error("LOVABLE_API_KEY ausente");

  const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "google/gemini-3.6-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI gateway ${response.status}: ${detail.slice(0, 200)}`);
  }

  const payload = await response.json();
  const out = payload?.choices?.[0]?.message?.content;
  if (typeof out !== "string" || !out.trim()) throw new Error("Resposta vazia");
  return out.replace(/^\s*["'`]+|["'`]+\s*$/g, "").trim();
}

/** Descarta correções suspeitas (resumo, corte, expansão exagerada). */
function isSafe(original: string, corrected: string) {
  if (!corrected) return false;
  const a = original.trim();
  const b = corrected.trim();
  if (b.length < a.length * 0.85) return false;
  if (b.length > a.length * 1.25 + 20) return false;
  const wordsA = a.split(/\s+/).length;
  const wordsB = b.split(/\s+/).length;
  return wordsB >= wordsA - 1 && wordsB <= wordsA + 2;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);

  try {
    const body = await req.json().catch(() => ({}));
    const text = typeof body?.text === "string" ? body.text : "";
    if (!text.trim() || text.length > MAX_CHARS) return json({ corrected: text, changed: false });

    const corrected = await correct(text);
    if (!isSafe(text, corrected) || corrected === text) {
      return json({ corrected: text, changed: false });
    }
    return json({ corrected, changed: true });
  } catch (error) {
    console.error("[spellcheck-ptbr]", error);
    return json({ error: "SPELLCHECK_UNAVAILABLE" }, 502);
  }
});
