# Plan - Lead Management Actions

Add management buttons (Inativar, Negócio Fechado, Editar, Voltar) to the commercial lead details page header and implement their respective logic.

## User Review Required

> [!IMPORTANT]
> - **Inativar**: Confirm that updating `registration_status` to 'inativo' is the correct way to "inactivate" a lead in your system.
> - **Editar**: Confirm which fields are considered "commercial" and allowed for editing (Trade Name, Phone, Email, Website, Notes).
> - **Negócio Fechado**: Confirm that this should only update the `stage` field to `negocio_fechado`.

- Should the "Voltar" button return specifically to the list view or just go back in history? I will implement it to navigate to `/comercial/contatos`.

## Proposed Changes

### Lead Management Functionality

#### [New] Server Functions
- Create `src/lib/lead-actions.functions.ts` to handle updates for lead status, stage, and commercial details using `createServerFn`.

#### Commercial Lead Details Page
- Edit `src/routes/comercial/contatos/$leadId.tsx`:
    - Add confirmation dialogs for "Inativar" and "Negócio Fechado" using `AlertDialog`.
    - Add an "Editar" dialog with a form to update commercial fields.
    - Update the `DetailModalHeader` trailing section to include:
        - **Inativar**: Red destructive button with `AlertTriangle` icon.
        - **Negócio Fechado**: Green button with `CheckCircle` icon.
        - **Editar**: Primary color button with `Pencil` icon.
        - **Voltar**: Neutral button with `ArrowLeft` icon (linking to `/comercial/contatos`).
    - Implement loading states for all actions.

### Technical Details

- **Components**: Use `AlertDialog` for confirmations and `Dialog` for the edit form.
- **Icons**: Use `AlertTriangle`, `CheckCircle`, `Pencil`, and `ArrowLeft` from `lucide-react`.
- **Styling**: Adhere to existing Tailwind colors and Shadcn UI patterns.
- **Data Persistence**: Use `supabase` client within server functions to ensure RLS compliance.
- **State Management**: Use local React state for loading indicators and dialog visibility.
