import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/versoes")({
  beforeLoad: () => {
    throw redirect({ to: "/atualizacoes", search: { aba: "versoes" } });
  },
});
