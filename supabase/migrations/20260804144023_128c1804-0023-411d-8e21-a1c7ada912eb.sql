-- Create table for geocoding cache
CREATE TABLE IF NOT EXISTS public.geocoding_cache (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    address text UNIQUE NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    last_checked_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- Grant access
GRANT SELECT, INSERT, UPDATE ON public.geocoding_cache TO authenticated;
GRANT ALL ON public.geocoding_cache TO service_role;

-- Enable RLS
ALTER TABLE public.geocoding_cache ENABLE ROW LEVEL SECURITY;

-- Simple read policy for authenticated users
CREATE POLICY "Allow authenticated to select geocoding_cache"
ON public.geocoding_cache FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to insert/update cache (so the server function can do it as the user)
CREATE POLICY "Allow authenticated to insert/update geocoding_cache"
ON public.geocoding_cache FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);