CREATE TABLE public.website_carbon_cache (
  id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
  grade TEXT NOT NULL CHECK (grade IN ('A+', 'A', 'B', 'C', 'D', 'E', 'F')),
  carbon NUMERIC,
  cleaner_than INTEGER CHECK (cleaner_than BETWEEN 0 AND 100),
  measured_at TIMESTAMPTZ NOT NULL,
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT TO_TIMESTAMP(0),
  source TEXT NOT NULL CHECK (source IN ('published', 'api'))
);

ALTER TABLE public.website_carbon_cache ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.website_carbon_cache FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.website_carbon_cache TO service_role;

INSERT INTO public.website_carbon_cache (
  id,
  grade,
  measured_at,
  last_attempt_at,
  source
) VALUES (
  TRUE,
  'A+',
  '2026-08-25T12:00:00Z',
  TO_TIMESTAMP(0),
  'published'
);

CREATE OR REPLACE FUNCTION public.claim_website_carbon_refresh(
  p_minimum_age_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.website_carbon_cache
  SET last_attempt_at = NOW()
  WHERE id = TRUE
    AND last_attempt_at <= NOW() - MAKE_INTERVAL(secs => p_minimum_age_seconds);

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_website_carbon_refresh(INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_website_carbon_refresh(INTEGER)
  TO service_role;
