import { createServerFn } from "@tanstack/react-start";

export type BrazilNewsArticle = {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
};

type NewsApiResponse = {
  status: "ok" | "error";
  articles?: Array<{
    title?: string | null;
    description?: string | null;
    url?: string | null;
    urlToImage?: string | null;
    publishedAt?: string | null;
    source?: { name?: string | null };
  }>;
  message?: string;
};

const CACHE_TTL_MS = 15 * 60 * 1000;
let cache: { expiresAt: number; articles: BrazilNewsArticle[] } | null = null;

export const getBrazilFiscalNews = createServerFn({ method: "GET" }).handler(
  async (): Promise<BrazilNewsArticle[]> => {
    const now = Date.now();
    if (cache && cache.expiresAt > now) return cache.articles;

    const apiKey = process.env.NEWS_API_KEY;
    if (!apiKey) {
      throw new Error("Configure NEWS_API_KEY no ambiente do servidor.");
    }

    const params = new URLSearchParams({
      q: '"Receita Federal" OR tributação OR ICMS',
      language: "pt",
      sortBy: "publishedAt",
      pageSize: "12",
    });
    const response = await fetch(`https://newsapi.org/v2/everything?${params}`, {
      headers: { "X-Api-Key": apiKey },
    });
    const payload = (await response.json()) as NewsApiResponse;
    if (!response.ok || payload.status !== "ok") {
      throw new Error(payload.message || "Não foi possível carregar as notícias.");
    }

    const articles = (payload.articles || [])
      .filter((article) => article.title && article.url)
      .map((article) => ({
        title: article.title || "",
        description: article.description || "",
        url: article.url || "",
        imageUrl: article.urlToImage || "",
        source: article.source?.name || "Fonte não informada",
        publishedAt: article.publishedAt || "",
      }))
      .slice(0, 6);

    cache = { expiresAt: now + CACHE_TTL_MS, articles };
    return articles;
  },
);
