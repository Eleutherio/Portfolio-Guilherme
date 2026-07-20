CREATE TABLE public.contact_rate_limits (
  key_hash TEXT PRIMARY KEY CHECK (char_length(key_hash) = 64),
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  request_count INTEGER NOT NULL DEFAULT 0 CHECK (request_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX contact_rate_limits_updated_at_idx
  ON public.contact_rate_limits (updated_at);

ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.contact_rate_limits FROM anon, authenticated;
GRANT ALL ON TABLE public.contact_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION public.consume_contact_rate_limit(
  p_key_hash TEXT,
  p_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allowed BOOLEAN;
  v_now TIMESTAMPTZ := clock_timestamp();
  v_window INTERVAL;
BEGIN
  IF char_length(p_key_hash) <> 64
    OR p_limit < 1
    OR p_limit > 100000
    OR p_window_seconds < 1
    OR p_window_seconds > 86400 THEN
    RAISE EXCEPTION 'invalid rate limit configuration';
  END IF;

  v_window := make_interval(secs => p_window_seconds);

  INSERT INTO public.contact_rate_limits AS limits (
    key_hash,
    window_started_at,
    request_count,
    updated_at
  )
  VALUES (p_key_hash, v_now, 1, v_now)
  ON CONFLICT (key_hash) DO UPDATE
  SET
    window_started_at = CASE
      WHEN limits.window_started_at <= v_now - v_window THEN v_now
      ELSE limits.window_started_at
    END,
    request_count = CASE
      WHEN limits.window_started_at <= v_now - v_window THEN 1
      ELSE LEAST(limits.request_count + 1, p_limit + 1)
    END,
    updated_at = v_now
  RETURNING request_count <= p_limit INTO v_allowed;

  IF random() < 0.01 THEN
    DELETE FROM public.contact_rate_limits
    WHERE updated_at < v_now - interval '7 days';
  END IF;

  RETURN v_allowed;
END;
$$;

REVOKE ALL ON FUNCTION public.consume_contact_rate_limit(TEXT, INTEGER, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.consume_contact_rate_limit(TEXT, INTEGER, INTEGER) TO service_role;
