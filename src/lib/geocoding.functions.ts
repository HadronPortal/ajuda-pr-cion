import { createServerFn } from "@tanstack/react-start";
import { createClient } from '@supabase/supabase-js';

const getAdminClient = () => {
  const url = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase admin credentials");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
};

export const getCoordinates = createServerFn({ method: "POST" })
  .validator((address: string) => address)
  .handler(async ({ data: address }: { data: string }) => {
    const apiKey = process.env['GOOGLE_PLACES_API_KEY'];
    if (!apiKey) return { success: false, error: "API Key not configured" };

    const supabase = getAdminClient();

    // 1. Check Cache
    const { data: cached } = await supabase
      .from('geocoding_cache')
      .select('lat, lng')
      .eq('address', address)
      .single();

    if (cached) return { success: true, ...cached };

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

      if (!response.ok) throw new Error("Geocoding failed");

      const result = await response.json();
      const location = result.places?.[0]?.location;

      if (!location) return { success: false, error: "Location not found" };

      const coords = { lat: location.latitude, lng: location.longitude };

      // 3. Update Cache
      await supabase.from('geocoding_cache').insert({
        address,
        lat: coords.lat,
        lng: coords.lng
      });

      return { success: true, ...coords };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  });
