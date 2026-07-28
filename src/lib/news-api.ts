import { supabase } from "@/lib/supabase";

export type BrazilNewsArticle = {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  source: string;
  publishedAt: string;
};

export async function getBrazilFiscalNews(): Promise<BrazilNewsArticle[]> {
  const { data, error } = await supabase.functions.invoke("fiscal-news");
  if (error) {
    throw new Error("Não foi possível carregar as notícias.");
  }

  const result = data as {
    articles?: BrazilNewsArticle[];
    error?: string;
  } | null;
  if (result?.error) throw new Error(result.error);
  return result?.articles || [];
}
