import { createFileRoute } from "@tanstack/react-router";
import { LeadDetailsPage } from "./comercial/contatos/$leadId";

export const Route = createFileRoute("/comercial/contato/$leadId")({
  component: LeadDetailsPage,
});
