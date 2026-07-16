import { Link } from "@tanstack/react-router";
import type { KeyboardEvent, MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { KbArticle } from "@/lib/kb-data";

export type ModuleDef = {
  slug: string;
  label: string;
  aliases: string[];
  /** KB article `module` values that belong to this ticket module. */
  kbModules: string[];
  /** Extra keywords used to match articles by title/summary/tags. */
  keywords: string[];
};

export const MODULE_DEFS: ModuleDef[] = [
  {
    slug: "vendas-nfe",
    label: "Vendas - NFE",
    aliases: ["vendas nfe", "vendas nf-e", "vendas nf e", "vendas", "nfe", "nf-e", "nf e"],
    kbModules: ["NF-e / SPED"],
    keywords: ["nfe", "nf-e", "sped", "vendas", "devolução", "cfop", "fiscal"],
  },
  {
    slug: "basico-terceiros",
    label: "Basico - Terceiros",
    aliases: [
      "basico terceiros",
      "básico terceiros",
      "basico - terceiros",
      "básico - terceiros",
      "basico",
      "básico",
      "terceiros",
    ],
    kbModules: [],
    keywords: ["básico", "basico", "terceiros", "cadastro", "cliente", "fornecedor"],
  },
  {
    slug: "financeiro",
    label: "Financeiro",
    aliases: ["financeiro", "erp - financeiro", "erp financeiro"],
    kbModules: ["ERP - Financeiro"],
    keywords: ["financeiro", "conta", "pagar", "receber", "boleto", "cobrança"],
  },
  {
    slug: "estoque",
    label: "Estoque",
    aliases: ["estoque", "erp - estoque", "erp estoque"],
    kbModules: ["ERP - Estoque"],
    keywords: ["estoque", "inventário", "produto", "logística"],
  },
  {
    slug: "hadron-web",
    label: "Hadron Web",
    aliases: ["hadron web", "hádron web", "hadron", "hádron"],
    kbModules: ["Portal do Cliente"],
    keywords: ["hádron", "hadron", "web", "portal", "cliente"],
  },
];

export function normalizeModuleText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Also collapse "nf e" → "nfe" to match variants. */
function normalizeStrong(text: string): string {
  return normalizeModuleText(text).replace(/\bnf e\b/g, "nfe");
}

export function resolveModuleSlug(text: string | undefined | null): string | undefined {
  if (!text) return undefined;
  const n = normalizeStrong(text);
  if (!n) return undefined;
  for (const m of MODULE_DEFS) {
    const candidates = [m.label, m.slug, ...m.aliases, ...m.kbModules];
    for (const c of candidates) {
      const cn0 = normalizeStrong(c);
      if (!cn0) continue;
      if (n === cn0 || n.includes(cn0) || cn0.includes(n)) return m.slug;
    }
  }
  return undefined;
}

export function getModuleBySlug(slug: string | undefined): ModuleDef | undefined {
  if (!slug) return undefined;
  return MODULE_DEFS.find((m) => m.slug === slug);
}

export function filterArticlesByModule(
  articles: KbArticle[],
  mod: ModuleDef,
): KbArticle[] {
  const exact = articles.filter((a) =>
    mod.kbModules.some((k) => normalizeStrong(k) === normalizeStrong(a.module)),
  );
  if (exact.length > 0) return exact;

  const kwds = mod.keywords.map((k) => normalizeStrong(k));
  return articles.filter((a) => {
    const hay = normalizeStrong(
      [a.module, a.title, a.summary, a.tags.join(" ")].join(" "),
    );
    return kwds.some((k) => k && hay.includes(k));
  });
}

type Props = {
  module: string;
  children?: ReactNode;
  className?: string;
  title?: string;
  stopPropagation?: boolean;
};

/**
 * Renders the module label as a link to the Base de Conhecimento filtered
 * by the resolved module. Falls back to a plain span when the module cannot
 * be resolved.
 */
export function ModuleKnowledgeLink({
  module,
  children,
  className,
  title,
  stopPropagation = true,
}: Props) {
  const slug = resolveModuleSlug(module);
  const label: ReactNode = children ?? module;

  if (!slug) {
    return <span className={className}>{label}</span>;
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (stopPropagation) e.stopPropagation();
  };
  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (stopPropagation) e.stopPropagation();
    if (e.key === " ") {
      e.preventDefault();
      (e.currentTarget as HTMLAnchorElement).click();
    }
  };

  return (
    <Link
      to="/base-de-conhecimento"
      search={{ modulo: slug }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      title={title ?? "Ver artigos deste módulo"}
      aria-label={`Ver artigos do módulo ${module}`}
      className={cn(
        "cursor-pointer rounded-sm transition-colors hover:text-primary focus-visible:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {label}
    </Link>
  );
}
