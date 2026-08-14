CREATE OR REPLACE FUNCTION public.consume_scoped_rate_limit(
  p_global_key_hash TEXT,
  p_ip_key_hash TEXT,
  p_global_limit INTEGER,
  p_ip_limit INTEGER,
  p_window_seconds INTEGER
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_now TIMESTAMPTZ := clock_timestamp();
  v_window INTERVAL;
  v_global_window_started_at TIMESTAMPTZ;
  v_global_count INTEGER;
  v_ip_allowed BOOLEAN;
BEGIN
  IF char_length(p_global_key_hash) <> 64
    OR char_length(p_ip_key_hash) <> 64
    OR p_global_key_hash = p_ip_key_hash
    OR p_global_limit < 1
    OR p_global_limit > 100000
    OR p_ip_limit < 1
    OR p_ip_limit > 100000
    OR p_window_seconds < 1
    OR p_window_seconds > 86400 THEN
    RAISE EXCEPTION 'invalid rate limit configuration';
  END IF;

  v_window := make_interval(secs => p_window_seconds);

  -- Create or lock the singleton global bucket in one statement. The no-op
  -- conflict update prevents retention from deleting it between discovery and
  -- lock acquisition, and serializes every decision for this scope.
  INSERT INTO public.contact_rate_limits AS global_limits (
    key_hash,
    window_started_at,
    request_count,
    updated_at
  )
  VALUES (p_global_key_hash, v_now, 0, v_now)
  ON CONFLICT (key_hash) DO UPDATE
  SET updated_at = global_limits.updated_at
  RETURNING window_started_at, request_count
  INTO v_global_window_started_at, v_global_count;

  IF v_global_window_started_at <= v_now - v_window THEN
    UPDATE public.contact_rate_limits
    SET window_started_at = v_now, request_count = 0, updated_at = v_now
    WHERE key_hash = p_global_key_hash;
    v_global_count := 0;
  END IF;

  -- Do not create a new per-IP row after the global capacity is exhausted.
  IF v_global_count >= p_global_limit THEN
    UPDATE public.contact_rate_limits
    SET updated_at = v_now
    WHERE key_hash = p_global_key_hash;
    RETURN 'global';
  END IF;

  INSERT INTO public.contact_rate_limits AS limits (
    key_hash,
    window_started_at,
    request_count,
    updated_at
  )
  VALUES (p_ip_key_hash, v_now, 1, v_now)
  ON CONFLICT (key_hash) DO UPDATE
  SET
    window_started_at = CASE
      WHEN limits.window_started_at <= v_now - v_window THEN v_now
      ELSE limits.window_started_at
    END,
    request_count = CASE
      WHEN limits.window_started_at <= v_now - v_window THEN 1
      ELSE LEAST(limits.request_count + 1, p_ip_limit + 1)
    END,
    updated_at = v_now
  RETURNING request_count <= p_ip_limit INTO v_ip_allowed;

  -- An already blocked IP does not consume global capacity.
  IF NOT v_ip_allowed THEN
    RETURN 'ip';
  END IF;

  UPDATE public.contact_rate_limits
  SET request_count = request_count + 1, updated_at = v_now
  WHERE key_hash = p_global_key_hash;

  RETURN 'allowed';
END;
$$;

REVOKE ALL ON FUNCTION public.consume_scoped_rate_limit(TEXT, TEXT, INTEGER, INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_scoped_rate_limit(TEXT, TEXT, INTEGER, INTEGER, INTEGER)
  TO service_role;

-- Keep the previous service-role-only RPC during the migration-first rollout.
-- The application no longer calls it; remove it in a later migration after the
-- new API version is confirmed in production.

CREATE OR REPLACE FUNCTION public.enforce_privacy_retention()
RETURNS TABLE (
  rate_limit_rows_deleted BIGINT,
  coffee_identifiers_anonymized BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  v_now TIMESTAMPTZ := clock_timestamp();
  v_rate_limit_rows_deleted BIGINT := 0;
  v_coffee_identifiers_anonymized BIGINT := 0;
BEGIN
  -- Skip rows used by live rate-limit decisions. They remain eligible for the
  -- next daily run without creating an inverse lock dependency.
  WITH stale_rate_limits AS MATERIALIZED (
    SELECT key_hash
    FROM public.contact_rate_limits
    WHERE updated_at < v_now - interval '7 days'
    ORDER BY key_hash
    FOR UPDATE SKIP LOCKED
  )
  DELETE FROM public.contact_rate_limits AS limits
  USING stale_rate_limits AS stale
  WHERE limits.key_hash = stale.key_hash;
  GET DIAGNOSTICS v_rate_limit_rows_deleted = ROW_COUNT;

  UPDATE public.coffee_taps
  SET
    visitor_id = NULL,
    anonymized_at = v_now
  WHERE visitor_id IS NOT NULL
    AND created_at < v_now - interval '30 days';
  GET DIAGNOSTICS v_coffee_identifiers_anonymized = ROW_COUNT;

  DELETE FROM public.privacy_retention_runs
  WHERE ran_at < v_now - interval '90 days';

  INSERT INTO public.privacy_retention_runs (
    ran_at,
    rate_limit_rows_deleted,
    coffee_identifiers_anonymized
  )
  VALUES (
    v_now,
    v_rate_limit_rows_deleted,
    v_coffee_identifiers_anonymized
  );

  RETURN QUERY SELECT v_rate_limit_rows_deleted, v_coffee_identifiers_anonymized;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_privacy_retention() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.enforce_privacy_retention() TO service_role;
