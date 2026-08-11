// Supabase Edge Function: ticket-summary
// Deploy: supabase functions deploy ticket-summary --no-verify-jwt
// Requires env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, LOVABLE_API_KEY.
//
// Gera (e persiste) um resumo técnico da descrição original do chamado.
// A descrição original nunca é alterada — o resumo vai para colunas separadas.

import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const url = Deno.env.get("SUPABASE_URL")!;
const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders },
  });

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const SYSTEM_PROMPT = [
  "Você resume descrições de chamados de suporte de um ERP (Hádron), em português do Brasil.",
  "Use EXCLUSIVAMENTE o texto fornecido como fonte.",
  "Nunca invente diagnóstico, causa, solução, testes, dados ou hipóteses.",
  "Produza um resumo curto (no máximo 3 frases ou 3 tópicos curtos), claro e técnico.",
  "Preserve: problema relatado, mensagens/códigos de erro, operação afetada, números de documentos,",
  "nomes de opções/telas do Hádron e contexto relevante, exatamente como escritos.",
  "Não use saudações, títulos, markdown decorativo nem comentários sobre o resumo.",
  "Se o texto for muito curto, apenas reescreva-o de forma objetiva.",
  "A pessoa solicitante/contato do cliente é quem relata a dúvida ou problema.",
  "O operador de suporte apenas registrou o chamado: nunca atribua a ele a dúvida, necessidade ou problema do cliente.",
].join(" ");

type SummaryContext = {
  requester?: string | null;
  requesterPhone?: string | null;
  operator?: string | null;
  company?: string | null;
};

async function generateSummary(description: string, context?: SummaryContext) {
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
        {
          role: "user",
          content: [
            `Descrição original: ${description}`,
            `Solicitante/contato do cliente: ${context?.requester || "não informado"}`,
            `Telefone do solicitante: ${context?.requesterPhone || "não informado"}`,
            `Empresa: ${context?.company || "não informada"}`,
            `Operador que apenas registrou o chamado: ${context?.operator || "não informado"}`,
          ].join("\n"),
        },
      ],
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AI gateway ${response.status}: ${detail.slice(0, 200)}`);
  }

  const payload = await response.json();
  const text = payload?.choices?.[0]?.message?.content;
  if (typeof text !== "string" || !text.trim()) throw new Error("Resumo vazio");
  return text.trim();
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "METHOD_NOT_ALLOWED" }, 405);

  try {
    const body = (await req.json().catch(() => ({}))) as {
      ticketId?: string;
      force?: boolean;
      summaryVersion?: number;
      context?: SummaryContext;
    };
    const ticketId = typeof body.ticketId === "string" ? body.ticketId.trim() : "";
    if (!ticketId) return json({ error: "TICKET_ID_REQUIRED" }, 400);

    const { data, error } = await admin.rpc("support_get_description", {
      ticket_key: ticketId,
    });
    if (error) throw error;
    if (!data) return json({ error: "TICKET_NOT_FOUND" }, 404);

    const row = data as {
      description: string | null;
      summary: string | null;
      summaryHash: string | null;
    };

    const description = (row.description ?? "").replace(/\r\n/g, "\n").trim();
    if (!description) return json({ summary: null, description: null });

    const hash = await sha256(
      JSON.stringify({
        version: body.summaryVersion ?? 2,
        description,
        context: body.context ?? {},
      }),
    );
    // Só chama o modelo quando não há resumo ou quando a descrição mudou.
    if (!body.force && row.summary && row.summaryHash === hash) {
      return json({ summary: row.summary, description, cached: true });
    }

    const summary = await generateSummary(description, body.context);
    const { error: saveError } = await admin.rpc("support_set_description_summary", {
      ticket_key: ticketId,
      summary,
      source_hash: hash,
    });
    if (saveError) throw saveError;

    return json({ summary, description, cached: false });
  } catch (error) {
    console.error("[ticket-summary]", error);
    return json({ error: "SUMMARY_UNAVAILABLE" }, 502);
  }
});
