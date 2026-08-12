import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/comercial/contato/$leadId")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/comercial/contatos/$leadId",
      params: { leadId: params.leadId },
      replace: true,
    });
  },
});
