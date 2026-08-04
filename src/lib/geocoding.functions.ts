import { createServerFn } from "@tanstack/react-start";
import { createClient } from '@supabase/supabase-js';

const getAdminClient = () => {
  const url = process.env['SUPABASE_URL'] || process.env['VITE_SUPABASE_URL'];
  const serviceKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  
  if (!url || !serviceKey) {
    return null;
  }
  
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false }
  });
};

export type GeocodingResult = {
  success: boolean;
  lat?: number;
  lng?: number;
  error?: string;
  source?: 'google' | 'cache';
  formatted_address?: string;
  errorCode?: 'CORS' | 'QUOTA' | 'NOT_FOUND' | 'INCOMPLETE' | 'ASSOCIATION_MISSING';
};

export const getCoordinates = createServerFn({ method: "POST" })
  .validator((address: string) => address)
  .handler(async ({ data: address }: { data: string }): Promise<GeocodingResult> => {
    // 1. Validate input
    if (!address || address.trim().length < 5) {
      return { success: false, error: "Endereço incompleto para geocodificação", errorCode: 'INCOMPLETE' };
    }

    const apiKey = process.env['GOOGLE_PLACES_API_KEY'];
    if (!apiKey) {
      console.warn("GOOGLE_PLACES_API_KEY not found");
      return { success: false, error: "Limite do provedor ou chave não configurada", errorCode: 'QUOTA' };
    }

    const supabase = getAdminClient();

    // 2. Check Cache
    if (supabase) {
      try {
        const { data: cached, error: cacheError } = await supabase
          .from('geocoding_cache')
          .select('lat, lng, address')
          .eq('address', address)
          .maybeSingle();

        if (cached) {
          return { 
            success: true, 
            lat: cached.lat, 
            lng: cached.lng, 
            source: 'cache',
            formatted_address: cached.address 
          };
        }
        if (cacheError) console.error("Cache check error:", cacheError);
      } catch (e) {
        console.error("Cache query failed:", e);
      }
    }

    // 3. Geocode via Google Places
    try {
      const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Goog-Api-Key': apiKey,
          'X-Goog-FieldMask': 'places.location,places.formattedAddress'
        },
        body: JSON.stringify({ textQuery: address })
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 403 || status === 429) {
          return { success: false, error: "Limite do provedor atingido", errorCode: 'QUOTA' };
        }
        const errBody = await response.text();
        throw new Error(`Geocoding failed: ${status} ${errBody}`);
      }

      const result = await response.json();
      const place = result.places?.[0];
      const location = place?.location;

      if (!location) {
        return { success: false, error: "Endereço não encontrado", errorCode: 'NOT_FOUND' };
      }

      const coords = { lat: location.latitude, lng: location.longitude };
      const formattedAddress = place.formattedAddress || address;

      // 4. Update Cache
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

      return { 
        success: true, 
        lat: coords.lat, 
        lng: coords.lng, 
        source: 'google',
        formatted_address: formattedAddress 
      };
    } catch (error: any) {
      console.error("Geocoding handler error:", error);
      const isCors = error.message?.includes('CORS') || error.message?.includes('fetch');
      return { 
        success: false, 
        error: isCors ? "Erro de conexão ou CORS" : error.message, 
        errorCode: isCors ? 'CORS' : undefined 
      };
    }
  });
