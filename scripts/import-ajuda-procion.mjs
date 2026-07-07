import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const BASE_URL = "https://ajuda.procion.com";
const OUT_FILE = path.resolve("src/lib/kb-imported.ts");

const categoryMap = {
  guia: "guia",
  manual: "manual",
  erros_correcoes: "erros",
  legislacao: "legislacao",
  comunicacao: "comunicacao",
  novidade: "novidades",
};

const moduleMap = [
  [/fiscal|nfe|nf-e|sped|nota/i, "NF-e / SPED"],
  [/financeiro|contas|boleto|pix|receber|pagar/i, "ERP - Financeiro"],
  [/estoque|inventario|custos/i, "ERP - Estoque"],
  [/produção|producao|ordens/i, "ERP - Produção"],
  [/compras/i, "ERP - Compras"],
  [/transporte|logística|logistica|carreteiro|frete/i, "Logística"],
  [/vendas|faturamento|pedido|loja/i, "Portal do Cliente"],
  [/integra|api|webservice|xml/i, "Integrações"],
];

function decodeHtml(value = "") {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
    .replace(/&#x([a-f0-9]+);/gi, (_, code) => String.fromCharCode(parseInt(code, 16)));
}

function stripTags(html = "") {
  return decodeHtml(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim(),
  );
}

function absoluteUrl(href) {
  if (!href) return "";
  if (/^https?:\/\//i.test(href)) return href;
  return new URL(href.replace(/^\//, ""), `${BASE_URL}/`).href;
}

function slugFromUrl(url) {
  return url.split("/").filter(Boolean).at(-1) ?? "";
}

function categoryFromUrl(url) {
  const raw = url.match(/\/artigo\/([^/]+)\//)?.[1] ?? "guia";
  return categoryMap[raw] ?? "guia";
}

function moduleFromLegacy(raw, title) {
  const source = `${raw} ${title}`;
  for (const [pattern, module] of moduleMap) {
    if (pattern.test(source)) return module;
  }
  return "Portal do Cliente";
}

function dateFromLegacy(raw) {
  const match = raw.match(/(\d{2})\/(\d{2})\/(\d{2,4})\s+(\d{2}):(\d{2})?/);
  if (!match) return new Date().toISOString().slice(0, 10);
  let [, dd, mm, yy] = match;
  if (yy.length === 2) yy = `20${yy}`;
  return `${yy}-${mm}-${dd}`;
}

function tagsFrom(title, module, category) {
  const base = [module, category]
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
  const tags = new Set();
  if (/nf|nfe|fiscal|sped|xml/.test(`${base} ${title.toLowerCase()}`)) tags.add("fiscal");
  if (/estoque|custo/.test(`${base} ${title.toLowerCase()}`)) tags.add("estoque");
  if (/producao|produção|ordem/.test(`${base} ${title.toLowerCase()}`)) tags.add("producao");
  if (/financeiro|boleto|pix|contas/.test(`${base} ${title.toLowerCase()}`)) tags.add("financeiro");
  if (/erro|rejeicao|rejeição/.test(title.toLowerCase())) tags.add("erro");
  if (/venda|pedido|loja/.test(`${base} ${title.toLowerCase()}`)) tags.add("vendas");
  return [...tags].slice(0, 5);
}

function readTimeFrom(text) {
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(2, Math.ceil(words / 180))} min`;
}

function extractArticleContent(html) {
  const marker = '<div style="overflow-wrap: break-word;">';
  const start = html.indexOf(marker);
  if (start === -1) return "";
  const afterStart = start + marker.length;
  const endMarker = '<div class="uk-width-medium-1-4">';
  const end = html.indexOf(endMarker, afterStart);
  const chunk = html.slice(afterStart, end === -1 ? undefined : end);
  return chunk.replace(/<\/div>\s*<\/div>\s*<\/div>\s*$/i, "").trim();
}

function blocksFromHtml(contentHtml) {
  const blocks = [];
  const tokenRegex = /<(p|h2|h3|li)\b[^>]*>[\s\S]*?<\/\1>|<img\b[^>]*>/gi;
  const tokens = contentHtml.match(tokenRegex) ?? [];

  for (const token of tokens) {
    const imgMatches = [...token.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)];
    for (const img of imgMatches) {
      const alt = token.match(/\balt=["']([^"']*)["']/i)?.[1] ?? "";
      blocks.push({
        type: "image",
        src: absoluteUrl(decodeHtml(img[1])),
        alt: decodeHtml(alt) || "Imagem do artigo",
      });
    }

    if (/^<img/i.test(token)) continue;
    const tag = token.match(/^<([a-z0-9]+)/i)?.[1]?.toLowerCase();
    const text = stripTags(token);
    if (!text) continue;
    if (tag === "h2" || tag === "h3") {
      blocks.push({ type: tag, text });
    } else if (tag === "li") {
      const last = blocks.at(-1);
      if (last?.type === "ul") last.items.push(text);
      else blocks.push({ type: "ul", items: [text] });
    } else {
      const isSoftHeading = text.length <= 130 && /[:?]?$/.test(text) && /[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(text[0] ?? "");
      blocks.push({ type: isSoftHeading ? "h3" : "p", text });
    }
  }

  return blocks.length > 0 ? blocks : [{ type: "p", text: stripTags(contentHtml) || "Conteúdo importado do Ajuda Prócion." }];
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (compatible; ProcionPortalImporter/1.0)",
    },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.text();
}

async function collectArticleUrls() {
  const urls = new Map();
  for (let page = 1; page <= 7; page += 1) {
    const url = page === 1 ? `${BASE_URL}/artigos` : `${BASE_URL}/artigos?page=${page}`;
    const html = await fetchText(url);
    const matches = html.matchAll(/href=["'](artigo\/(?:guia|manual|erros_correcoes|legislacao|comunicacao|novidade)\/\d+\/[^"']+)["']/gi);
    for (const match of matches) {
      const full = absoluteUrl(match[1]);
      urls.set(full, full);
    }
  }
  return [...urls.keys()];
}

async function parseArticle(url, index) {
  const html = await fetchText(url);
  const title = stripTags(html.match(/<div class="md-card">\s*<h1>([\s\S]*?)<\/h1>/i)?.[1] ?? "");
  const metadata = stripTags(html.match(/<div class="md-card">[\s\S]*?<small>([\s\S]*?)<\/small>/i)?.[1] ?? "");
  const contentHtml = extractArticleContent(html);
  const blocks = blocksFromHtml(contentHtml);
  const plainText = blocks
    .map((block) => ("text" in block ? block.text : block.type === "ul" || block.type === "ol" ? block.items.join(" ") : ""))
    .join(" ");
  const summary =
    blocks.find((block) => block.type === "p" && block.text.length > 40)?.text.slice(0, 220) ||
    "Artigo importado da base Ajuda Prócion.";
  const module = moduleFromLegacy(metadata, title);
  const category = categoryFromUrl(url);
  const id = url.match(/\/artigo\/[^/]+\/(\d+)\//)?.[1] ?? String(index + 1);

  return {
    id: `AP-${id}`,
    slug: slugFromUrl(url),
    title,
    category,
    module,
    tags: tagsFrom(title, module, category),
    updatedAt: dateFromLegacy(metadata),
    readTime: readTimeFrom(plainText),
    author: "Prócion Sistemas",
    summary,
    sourceUrl: url,
    content: blocks,
  };
}

async function main() {
  const urls = await collectArticleUrls();
  console.log(`Encontrados ${urls.length} artigos públicos.`);

  const articles = [];
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    try {
      const article = await parseArticle(url, i);
      articles.push(article);
      console.log(`[${i + 1}/${urls.length}] ${article.id} ${article.title}`);
    } catch (error) {
      console.warn(`Falha ao importar ${url}:`, error.message);
    }
  }

  articles.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt) || a.title.localeCompare(b.title));

  const output = `import type { KbArticle } from "./kb-data";

export const importedKbArticles = ${JSON.stringify(articles, null, 2)} satisfies KbArticle[];
`;

  await mkdir(path.dirname(OUT_FILE), { recursive: true });
  await writeFile(OUT_FILE, output, "utf8");
  console.log(`Gerado ${OUT_FILE} com ${articles.length} artigos.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
