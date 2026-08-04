import { createServerFn } from "@tanstack/react-start";
import { createClient } from '@supabase/supabase-js';

const getAdminClient = () => {
  // Try server-side env vars first, then VITE_ prefixed if needed (though on server they should be without VITE_)
  const url = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  
  if (!url || !serviceKey) {
    // Return null instead of throwing to handle it gracefully in the handler
    return null;
  }
  
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
};

export const getCoordinates = createServerFn({ method: "POST" })
  .validator((address: string) => address)
  .handler(async ({ data: address }: { data: string }) => {
    const apiKey = process.env['GOOGLE_PLACES_API_KEY'];
    if (!apiKey) {
      console.warn("GOOGLE_PLACES_API_KEY not found");
      return { success: false, error: "API Key not configured" };
    }

    const supabase = getAdminClient();
    if (!supabase) {
      console.warn("Supabase admin client could not be initialized");
    }

    // 1. Check Cache if Supabase is available
    if (supabase) {
      try {
        const { data: cached, error: cacheError } = await supabase
          .from('geocoding_cache')
          .select('lat, lng')
          .eq('address', address)
          .maybeSingle();

        if (cached) return { success: true, lat: cached.lat, lng: cached.lng };
        if (cacheError) console.error("Cache check error:", cacheError);
      } catch (e) {
        console.error("Cache query failed:", e);
      }
    }

    // 2. Geocode via Google Places
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.location'
        },
        body: JSON.stringify({ textQuery: address })
      });

      if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Geocoding failed: ${response.status} ${errBody}`);
      }

      const result = await response.json();
      const location = result.places?.[0]?.location;

      if (!location) return { success: false, error: "Location not found" };

      const coords = { lat: location.latitude, lng: location.longitude };

      // 3. Update Cache if Supabase is available
      if (supabase) {
        try {
          await supabase.from('geocoding_cache').upsert({
            address,
            lat: coords.lat,
            lng: coords.lng,
            last_checked_at: new Date().toISOString()
          }, { onConflict: 'address' });
        } catch (e) {
          console.error("Cache update failed:", e);
        }
      }

      return { success: true, ...coords };
    } catch (error: any) {
      console.error("Geocoding handler error:", error);
      return { success: false, error: error.message };
    }
  });