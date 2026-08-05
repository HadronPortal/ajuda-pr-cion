import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_debug_text')({
  component: () => (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Search</h1>
      <p>
        Faça agora um novo deploy do commit ad6440c da branch main.
      </p>
      <p className="mt-4">
        Não altere nenhum código e não recrie banco ou RPCs. Esse commit restaura a configuração necessária
      </p>
    </div>
  ),
});
