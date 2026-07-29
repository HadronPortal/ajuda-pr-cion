import { kbArticlesFull } from "@/lib/kb-data";

export type HadronOption = {
  code: string;
  title: string;
  label: string;
};

const OPTION_PATTERN = /\b(\d{4})\s*[-–—]\s*([^.;:,\n"'()]{3,80})/g;

function articleText(article: (typeof kbArticlesFull)[number]) {
  const blocks = article.content.flatMap((block) => {
    if ("text" in block) return [block.text];
    if ("items" in block) return block.items;
    return [];
  });
  return [article.title, article.summary, ...blocks].join("\n");
}

const found = new Map<string, HadronOption>();

for (const article of kbArticlesFull) {
  for (const match of articleText(article).matchAll(OPTION_PATTERN)) {
    const code = match[1];
    const title = match[2].replace(/\s+/g, " ").trim();
    if (!found.has(code) || title.length > (found.get(code)?.title.length || 0)) {
      found.set(code, { code, title, label: `${code} - ${title}` });
    }
  }
}

export const hadronOptions = [...found.values()].sort((a, b) => Number(a.code) - Number(b.code));

export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}

export function searchHadronOptions(query: string, limit = 10) {
  const normalized = normalizeSearch(query);
  if (!normalized) return [];
  return hadronOptions
    .filter((option) => normalizeSearch(option.label).includes(normalized))
    .slice(0, limit);
}
