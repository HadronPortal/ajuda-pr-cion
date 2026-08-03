import { createFileRoute } from '@tanstack/react-router'
import { testPlacesApi, enrichLeads } from '@/lib/enrichment/places.functions'

export const Route = createFileRoute('/api/public/test-places')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const testResult = await (testPlacesApi as any)();
          let enrichResult = null;
          
          if (testResult.success) {
            enrichResult = await (enrichLeads as any)();
          }

          return new Response(JSON.stringify({ testResult, enrichResult }), {
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (error: any) {
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }
    }
  }
})
