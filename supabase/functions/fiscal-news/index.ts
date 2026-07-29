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

// Fontes brasileiras confiáveis com cobertura fiscal/tributária/contábil.
const BR_DOMAINS = [
  "g1.globo.com",
  "valor.globo.com",
  "oglobo.globo.com",
  "exame.com",
  "infomoney.com.br",
  "contabeis.com.br",
  "jornalcontabil.com.br",
  "conjur.com.br",
  "migalhas.com.br",
  "poder360.com.br",
  "agenciabrasil.ebc.com.br",
  "cnnbrasil.com.br",
  "estadao.com.br",
  "folha.uol.com.br",
  "uol.com.br",
  "terra.com.br",
  "gazetadopovo.com.br",
  "istoedinheiro.com.br",
  "seudinheiro.com",
  "moneytimes.com.br",
].join(",");

const FISCAL_QUERY =
  '("Receita Federal" OR tributário OR tributária OR tributação OR imposto OR ICMS OR ISS OR PIS OR COFINS OR "Simples Nacional" OR "reforma tributária" OR "nota fiscal" OR SPED OR IRPF) AND (fiscal OR tributo OR tributos OR arrecadação OR contabilidade OR Brasil)';

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

// Termos que caracterizam matéria fiscal/tributária/contábil.
const FISCAL_TERMS = [
  "receita federal",
  "tributario",
  "tributaria",
  "tributacao",
  "tributo",
  "tributos",
  "imposto",
  "impostos",
  "icms",
  "iss",
  "pis",
  "cofins",
  "simples nacional",
  "mei",
  "fiscal",
  "fiscais",
  "arrecadacao",
  "reforma tributaria",
  "nota fiscal",
  "sped",
  "efd",
  "irpf",
  "irpj",
  "csll",
  "ipi",
  "iof",
  "cbs",
  "ibs",
  "obrigacoes acessorias",
  "declaracao de imposto",
  "contabilidade",
  "contador",
  "carf",
  "malha fina",
  "darf",
  "das",
];

// Sinais de que a matéria trata do Brasil.
const BRAZIL_TERMS = [
  "brasil",
  "brasileiro",
  "brasileira",
  "receita federal",
  "icms",
  "iss",
  "pis",
  "cofins",
  "simples nacional",
  "irpf",
  "irpj",
  "csll",
  "sped",
  "darf",
  "carf",
  "reforma tributaria",
  "governo federal",
  "congresso nacional",
  "camara dos deputados",
  "senado",
  "stf",
  "stj",
  "sefaz",
  "mei",
  "cbs",
  "ibs",
  "real",
  "r$",
];

// Sinais de matéria internacional — descartadas mesmo em português.
const FOREIGN_TERMS = [
  "portugal",
  "portugues de portugal",
  "lisboa",
  "porto",
  "angola",
  "mocambique",
  "cabo verde",
  "estados unidos",
  "eua",
  "irs",
  "washington",
  "california",
  "california",
  "uniao europeia",
  "espanha",
  "franca",
  "alemanha",
  "argentina",
  "china",
  "japao",
  "reino unido",
  "italia",
  "mexico",
  "chile",
  "colombia",
  "trump",
  "biden",
  "irlanda",
  "suica",
];

const hasTerm = (text: string, terms: string[]) =>
  terms.some((term) =>
    new RegExp(`(^|[^a-z0-9])${term.replace(/\$/g, "\\$")}([^a-z0-9]|$)`).test(
      text,
    ),
  );

type Article = Record<string, unknown>;

const isRelevant = (article: Article) => {
  const title = normalize(String(article.title ?? ""));
  const description = normalize(String(article.description ?? ""));
  const text = `${title} ${description}`;

  // Título e descrição validados no backend antes de exibir.
  if (!title) return false;
  if (!hasTerm(text, FISCAL_TERMS)) return false;
  if (!hasTerm(text, BRAZIL_TERMS)) return false;
  if (hasTerm(text, FOREIGN_TERMS) && !hasTerm(title, BRAZIL_TERMS)) {
    return false;
  }
  return true;
};

const mapArticle = (article: Article) => ({
  title: String(article.title ?? ""),
  description: String(article.description ?? ""),
  url: String(article.url ?? ""),
  imageUrl: String(article.urlToImage ?? ""),
  source:
    (article.source as { name?: string } | null)?.name || "Fonte não informada",
  publishedAt: String(article.publishedAt ?? ""),
});

async function fetchNews(apiKey: string, useDomains: boolean) {
  const params = new URLSearchParams({
    q: FISCAL_QUERY,
    language: "pt",
    sortBy: "publishedAt",
    pageSize: "100",
  });
  if (useDomains) params.set("domains", BR_DOMAINS);

  const response = await fetch(`https://newsapi.org/v2/everything?${params}`, {
    headers: { "X-Api-Key": apiKey },
  });
  const payload = await response.json();
  return { response, payload };
}

serve(async (request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("NEWS_API_KEY");
    if (!apiKey) {
      return json({ error: "NEWS_API_KEY não configurada no Supabase." }, 500);
    }

    let { response, payload } = await fetchNews(apiKey, true);
    if (!response.ok || payload.status !== "ok") {
      return json(
        { error: payload.message || "Não foi possível carregar as notícias." },
        response.status,
      );
    }

    const collect = (raw: unknown) =>
      ((raw as Article[]) || [])
        .filter((article) => article.title && article.url)
        .filter(isRelevant)
        .map(mapArticle);

    let articles = collect(payload.articles);

    // Fallback: se as fontes fixas trouxerem pouco, busca aberta com o mesmo filtro.
    if (articles.length < 6) {
      const fallback = await fetchNews(apiKey, false);
      if (fallback.response.ok && fallback.payload.status === "ok") {
        const extra = collect(fallback.payload.articles);
        const seen = new Set(articles.map((a) => a.url));
        for (const item of extra) {
          if (seen.has(item.url)) continue;
          seen.add(item.url);
          articles.push(item);
        }
      }
    }

    articles = articles
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, 6);

    return json({ articles });
  } catch (error) {
    console.error("[fiscal-news]", error);
    return json({ error: "Falha ao carregar notícias fiscais." }, 500);
  }
});
