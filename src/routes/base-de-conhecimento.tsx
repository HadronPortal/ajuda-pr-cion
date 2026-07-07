import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/base-de-conhecimento")({
  component: () => <Outlet />,
});
