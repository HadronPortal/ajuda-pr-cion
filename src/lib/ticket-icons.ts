import {
  AlertTriangle,
  Boxes,
  Globe,
  Info,
  PhoneCall,
  Printer,
  ReceiptText,
  Ticket as TicketIcon,
  Users,
  Wallet,
} from "lucide-react";

/**
 * Ícone dinâmico do chamado com base em módulo/assunto/origem.
 * Usado no card da lista e no cabeçalho do detalhe do chamado.
 */
export function getModuleIcon(
  module: string,
  source?: string,
  subject?: string,
): typeof Info {
  const haystack = `${module ?? ""} ${subject ?? ""}`.toLowerCase();
  const s = (source ?? "").toLowerCase();

  if (/impress|printer|spool/.test(haystack)) return Printer;
  if (/nfe|nota|fiscal|sped|cfop|cst|xml/.test(haystack)) return ReceiptText;
  if (/financ|conta|caixa|banco|boleto|pagar|receber|carteira/.test(haystack))
    return Wallet;
  if (/terceiros|cadastro|cliente|fornecedor|contato/.test(haystack)) return Users;
  if (/estoque|produto|mercadoria|invent/.test(haystack)) return Boxes;
  if (/erro|sistema|atualiza|update|bug|falha/.test(haystack)) return AlertTriangle;
  if (/telefone|ligacao|ligação|fone/.test(haystack) || s.includes("telefone"))
    return PhoneCall;
  if (/hadron|web|portal/.test(haystack) || s.includes("portal")) return Globe;
  return TicketIcon;
}
