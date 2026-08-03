import { createServerFn } from "@tanstack/react-start";
import { createClient } from '@supabase/supabase-js';

// Helper to get admin client inside handler
const getAdminClient = () => {
  const url = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase admin credentials (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)");
  }
  
  return createClient(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
};

export const testPlacesApi = createServerFn({ method: "POST" })
  .handler(async () => {
    const apiKey = process.env['GOOGLE_PLACES_API_KEY'];
    if (!apiKey) {
      return { success: false, error: "GOOGLE_PLACES_API_KEY not found in environment" };
    }

    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.websiteUri'
        },
        body: JSON.stringify({
          textQuery: 'Habib\'s São Carlos SP'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        return { success: false, error: data.error?.message || "Unknown API error", status: response.status };
      }

      return { success: true, data: data.places?.[0] || null };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });

export const enrichLeads = createServerFn({ method: "POST" })
  .handler(async () => {
    const apiKey = process.env['GOOGLE_PLACES_API_KEY'];
    if (!apiKey) return { success: false, error: "No API Key" };

    try {
      const supabaseAdmin = getAdminClient();

      // Find leads in SÃO CARLOS
      const { data: leads, error: fetchError } = await supabaseAdmin
        .from('tab_company_leads')
        .select('id, legal_name, trade_name, city, state, phone, website')
        .eq('city', 'SÃO CARLOS')
        .limit(2);

      if (fetchError) throw fetchError;
      if (!leads || leads.length === 0) {
        return { success: false, error: "No leads found in São Carlos to enrich." };
      }

      let stats = { phones: 0, sites: 0, emails: 0 };

      for (const lead of leads) {
        const query = `${lead.trade_name || lead.legal_name} ${lead.city} ${lead.state}`;
        
        const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': apiKey,
            'X-Goog-FieldMask': 'places.nationalPhoneNumber,places.websiteUri'
          },
          body: JSON.stringify({ textQuery: query })
        });

        if (response.ok) {
          const data = await response.json();
          const place = data.places?.[0];

          if (place) {
            const updates: any = {};
            if (place.nationalPhoneNumber && !lead.phone) {
              updates.phone = place.nationalPhoneNumber;
              stats.phones++;
            }
            if (place.websiteUri && !lead.website) {
              updates.website = place.websiteUri;
              stats.sites++;
            }

            if (Object.keys(updates).length > 0) {
              await supabaseAdmin
                .from('tab_company_leads')
                .update(updates)
                .eq('id', lead.id);
            }
          }
        }
      }

      return { success: true, stats };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
