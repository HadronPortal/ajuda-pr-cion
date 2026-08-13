# Plan - CRM Prócion Improvements

This plan covers the restoration of the "CRM Prócion" database connection, fixes for the "Iniciar Hadron" game assets/limits, and minor visual adjustments.

## Proposed Changes

### Database Connection
- **Restore Connection**: Ensure the application points to the correct Supabase project (`vbkbbfeujqmvgmmhmeao`) containing the production schema and data.
- **Safety**: Implement connection restoration at the code level (fallbacks/proxy) to respect the strict prohibition on `.env` file modifications.
- **Validation**: Verify that critical RPCs (`list_crm_clients`, `list_colaboradores`, `company_leads_search`) return real data.

### Iniciar Hadron (Game)
- **Asset Restoration**: Fix references to the game cover and background assets.
- **Roleta Logic**: Ensure the prize wheel is strictly limited to 4 prizes.
- **Admin Features**: Verify/restore functional exports (CSV/TXT) and JSON backups in the admin screen.
- **UI Label**: Confirm the menu label remains "Hadron" as per previous requests.

### Commercial Contact Details
- **Buttons UI**: Refine the "Voltar" and "Editar" buttons in the header for consistency.
- **Labels**: Ensure all fields show "Não informado" when empty and that the "Etapa" column in the list is a static badge.

## Technical Details

- **Supabase Client**: Modify `src/integrations/supabase/client.ts` to use a configurable project reference if the environment variables are not correctly set by the platform.
- **Game Store**: Restore or recreate `src/lib/game-store.ts` to manage game state and exports.
- **Zod Validation**: Maintain schema integrity for lead actions in `src/lib/lead-actions.functions.ts`.
