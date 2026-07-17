-- 024: Culture CMS — runtime-editable culture content.
--
-- Content ships as bundled JSON (shared/content/culture/) — the BASE layer.
-- This table is the OVERRIDE layer: rows materialize lazily on first admin
-- save (no bulk seed), and the DB row wins at read time. Bundled JSON stays
-- the fallback and mobile's offline path. Writes go exclusively through the
-- admin-gated SECURITY DEFINER RPC (house pattern, cf. 022): no client
-- INSERT/UPDATE/DELETE policies exist at all.

CREATE TABLE culture_content (
    id text PRIMARY KEY CHECK (id ~ '^[a-z]{2}$'),
    content jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now(),
    updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE culture_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read culture content"
    ON culture_content FOR SELECT
    TO authenticated
    USING (true);

-- Shape validation happens app-side (zod cultureCountrySchema) inside the
-- admin server action before this RPC is called; the RPC re-checks only the
-- cheap invariants (admin caller, id match, size cap).
CREATE OR REPLACE FUNCTION public.admin_upsert_culture_content(p_id text, p_content jsonb)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT is_caller_admin() THEN
    RAISE EXCEPTION 'admin only';
  END IF;
  IF p_id !~ '^[a-z]{2}$' OR (p_content->>'id') IS DISTINCT FROM p_id THEN
    RAISE EXCEPTION 'content id mismatch';
  END IF;
  IF pg_column_size(p_content) > 262144 THEN -- 256 KB per country is plenty
    RAISE EXCEPTION 'content too large';
  END IF;

  INSERT INTO culture_content (id, content, updated_at, updated_by)
  VALUES (p_id, p_content, now(), auth.uid())
  ON CONFLICT (id) DO UPDATE
    SET content = EXCLUDED.content,
        updated_at = now(),
        updated_by = auth.uid();

  RETURN true;
END;
$function$;

REVOKE ALL ON FUNCTION public.admin_upsert_culture_content(text, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_upsert_culture_content(text, jsonb) TO authenticated;
