import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/frota")({
  head: () => ({ meta: [{ title: "Frota - Portal Prócion" }] }),
  component: () => <Outlet />,
});
