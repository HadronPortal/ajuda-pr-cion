import { supabase } from "@/lib/supabase";

export type FleetStateScope = "fleet_core" | "fleet_entries";

export async function loadFleetState<T>(scope: FleetStateScope): Promise<T | null> {
  const { data, error } = await supabase.rpc("get_fleet_app_state" as never, {
    p_scope: scope,
  } as never);
  if (error) {
    console.error(`[fleet] Falha ao carregar ${scope}.`, error);
    return null;
  }
  return (data ?? null) as T | null;
}

export async function saveFleetState(scope: FleetStateScope, payload: unknown) {
  const { error } = await supabase.rpc("save_fleet_app_state" as never, {
    p_scope: scope,
    p_payload: payload,
  } as never);
  if (error) console.error(`[fleet] Falha ao salvar ${scope}.`, error);
}
