import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const updateLeadStatus = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ 
    id: z.string(), 
    status: z.string().optional(),
    stage: z.enum(["novo", "prospeccao", "relacionamento", "proposta", "negociacao", "demonstracao", "negocio_fechado", "sem_interesse"]).optional()
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const updateData: any = {};
    if (data.status) updateData.registration_status = data.status;
    if (data.stage) updateData.stage = data.stage;

    const { error } = await supabaseAdmin
      .from("company_leads")
      .update(updateData)
      .eq("id", data.id);

    if (error) throw error;
    return { success: true };
  });

export const updateLeadCommercialData = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({
    id: z.string(),
    trade_name: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().optional(),
    website: z.string().optional(),
    notes: z.string().optional(),
  }).parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { id, ...fields } = data;
    const { error } = await supabaseAdmin
      .from("company_leads")
      .update(fields)
      .eq("id", id);

    if (error) throw error;
    return { success: true };
  });

