import { supabase } from "@/integrations/supabase/client";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export type CompanyLeadActivity = {
  id: string;
  lead_id: string;
  kind:
    | "prospeccao"
    | "relacionamento"
    | "demonstracao"
    | "proposta"
    | "negociacao"
    | "alteracao_etapa"
    | "agendamento"
    | "concluida"
    | "cancelada";
  status: string;
  actor_name: string;
  actor_role: string;
  description: string;
  contact_used: string | null;
  occurred_at: string;
  created_at: string;
};

export const getLeadActivities = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ leadId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const { data: activities, error } = await (supabase as any)
      .from("company_lead_activities")
      .select("*")
      .eq("lead_id", data.leadId)
      .order("occurred_at", { ascending: false });

    if (error) {
      if (error.code === "PGRST116" || error.code === "42P01") {
        return [];
      }
      throw error;
    }

    return (activities || []) as CompanyLeadActivity[];
  });
