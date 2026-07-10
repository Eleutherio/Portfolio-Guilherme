CREATE TABLE public.coffee_taps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.coffee_taps TO anon, authenticated;
GRANT ALL ON public.coffee_taps TO service_role;

ALTER TABLE public.coffee_taps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can tap once"
  ON public.coffee_taps
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.get_coffee_count()
RETURNS BIGINT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT count(*)::bigint FROM public.coffee_taps;
$$;

GRANT EXECUTE ON FUNCTION public.get_coffee_count() TO anon, authenticated;