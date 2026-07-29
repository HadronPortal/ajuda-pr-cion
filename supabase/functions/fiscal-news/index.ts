import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...corsHeaders },
  });

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("NEWS_API_KEY");
    if (!apiKey) {
      return json({ error: "NEWS_API_KEY não configurada no Supabase." }, 500);
    }

    const params = new URLSearchParams({
      q: '("Receita Federal" OR tributário OR tributária OR tributação OR imposto OR ICMS OR ISS OR PIS OR COFINS OR "Simples Nacional") AND (fiscal OR tributo OR arrecadação)',
      language: "pt",
      sortBy: "publishedAt",
      pageSize: "50",
    });
    const response = await fetch(`https://newsapi.org/v2/everything?${params}`, {
      headers: { "X-Api-Key": apiKey },
    });
    const payload = await response.json();

    if (!response.ok || payload.status !== "ok") {
      return json(
        { error: payload.message || "Não foi possível carregar as notícias." },
        response.status,
      );
    }

    const normalize = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    const FISCAL_TERMS = [
      "receita federal",
      "tributario",
      "tributaria",
      "tributacao",
      "tributo",
      "imposto",
      "impostos",
      "icms",
      "iss",
      "pis",
      "cofins",
      "simples nacional",
      "fiscal",
      "arrecadacao",
      "reforma tributaria",
      "nota fiscal",
      "sped",
      "irpf",
      "ipi",
    ];

    const isFiscal = (article: Record<string, unknown>) => {
      const text = normalize(
        `${article.title ?? ""} ${article.description ?? ""} ${article.content ?? ""}`,
      );
      return FISCAL_TERMS.some((term) =>
        new RegExp(`(^|[^a-z0-9])${term}([^a-z0-9]|$)`).test(text),
      );
    };

    const articles = (payload.articles || [])
      .filter((article: Record<string, unknown>) => article.title && article.url)
      .filter(isFiscal)
      .slice(0, 6)
      .map((article: Record<string, unknown>) => ({
        title: article.title || "",
        description: article.description || "",
        url: article.url || "",
        imageUrl: article.urlToImage || "",
        source:
          (article.source as { name?: string } | null)?.name ||
          "Fonte não informada",
        publishedAt: article.publishedAt || "",
      }));

    return json({ articles });
  } catch (error) {
    console.error("[fiscal-news]", error);
    return json({ error: "Falha ao carregar notícias fiscais." }, 500);
  }
});
