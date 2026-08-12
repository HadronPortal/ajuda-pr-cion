import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/comercial/contatos/$leadId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/comercial/contatos/$leadId"!</div>
}
