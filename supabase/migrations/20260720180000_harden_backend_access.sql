DROP POLICY IF EXISTS "anyone can tap once" ON public.coffee_taps;

REVOKE INSERT ON TABLE public.coffee_taps FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.get_coffee_count() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_coffee_count() TO service_role;

CREATE OR REPLACE FUNCTION public.app_healthcheck()
RETURNS TIMESTAMPTZ
LANGUAGE SQL
VOLATILE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT clock_timestamp();
$$;

REVOKE ALL ON FUNCTION public.app_healthcheck() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.app_healthcheck() TO service_role;
