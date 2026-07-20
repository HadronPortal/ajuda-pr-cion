export const modulesMap: Record<string, string[]> = {
  "Vendas": ["NFE", "Pedidos", "Orçamentos", "Devoluções"],
  "Fiscal": ["Apuração", "SPED", "ECF", "ICMS"],
  "Financeiro": ["Contas a pagar", "Contas a receber", "Fluxo de caixa", "Conciliação"],
  "Basico": ["Terceiros", "Produtos", "Filiais", "Usuários"],
  "Estoque": ["Movimentação", "Inventário", "Transferência"],
  "Hadron Web": ["Portal", "Integrações", "Relatórios"],
  "Impressoras": ["Configuração", "Etiquetas"],
};

export const moduleOptions = Object.keys(modulesMap);

/** Resolve module/submodule from a "Modulo - Submodulo" string. */
export function splitModule(text: string): { module: string; submodule: string } {
  const [rawMod, ...rest] = (text || "").split(" - ");
  const mod = moduleOptions.includes(rawMod) ? rawMod : (moduleOptions[0] ?? rawMod);
  const subs = modulesMap[mod] ?? [];
  const rawSub = rest.join(" - ").trim();
  const submodule = subs.includes(rawSub) ? rawSub : (subs[0] ?? rawSub ?? "Geral");
  return { module: mod, submodule };
}
