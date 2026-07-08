import type { SupportTicket } from "./support-tickets-data";

type UserLike = { operator?: string } | null | undefined;

/**
 * Retorna apenas os chamados atribuídos ao usuário informado.
 * Quando o backend estiver disponível, basta trocar a fonte de dados —
 * a assinatura da função permanece a mesma.
 */
export function getTicketsForCurrentUser(
  tickets: SupportTicket[],
  user: UserLike,
): SupportTicket[] {
  const op = user?.operator;
  if (!op) return [];
  return tickets.filter((t) => t.owner === op);
}
