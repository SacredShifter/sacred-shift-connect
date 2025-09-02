-- 1. Add external_id to content_sources and make it non-nullable
ALTER TABLE public.content_sources ADD COLUMN external_id TEXT;

-- Backfill existing rows.
-- For YouTube, we'd ideally extract the channel ID. For others, we can use a hash.
-- This is a placeholder for a more robust backfill script.
UPDATE public.content_sources
SET external_id = md5(source_url)
WHERE external_id IS NULL;

ALTER TABLE public.content_sources ALTER COLUMN external_id SET NOT NULL;

-- 2. Add a unique constraint for user, source type, and external id
CREATE UNIQUE INDEX content_sources_user_source_type_external_id_idx
ON public.content_sources (user_id, source_type, external_id);

-- 3. Create the content_items table
create table if not exists public.content_items (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.content_sources(id) on delete cascade,
  external_id text not null,
  title text not null,
  description text,
  published_at timestamptz,
  thumb_url text,
  duration_seconds int,
  view_count bigint,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (source_id, external_id)
);

-- 4. Trigger to auto-update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_content_sources_updated
BEFORE UPDATE ON public.content_sources
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER on_content_items_updated
BEFORE UPDATE ON public.content_items
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

-- 5. Trigger to compute next_sync_at
CREATE OR REPLACE FUNCTION public.compute_next_sync()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.last_sync_at IS NOT NULL AND NEW.sync_frequency_hours IS NOT NULL THEN
    NEW.next_sync_at = NEW.last_sync_at + (NEW.sync_frequency_hours * interval '1 hour');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_content_sources_sync_change
BEFORE UPDATE ON public.content_sources
FOR EACH ROW
WHEN (OLD.last_sync_at IS DISTINCT FROM NEW.last_sync_at)
EXECUTE PROCEDURE public.compute_next_sync();

-- 6. Trigger to set default_external_id (simplified version)
CREATE OR REPLACE FUNCTION public.set_default_external_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.external_id IS NULL THEN
    IF NEW.source_type = 'youtube' AND NEW.source_url IS NOT NULL THEN
      -- Basic extraction, a more robust regex would be needed for production
      NEW.external_id := substring(NEW.source_url from 'channel/([^/]+)');
    END IF;

    -- Fallback for other types or if YouTube extraction fails
    IF NEW.external_id IS NULL THEN
      NEW.external_id := md5(NEW.source_url);
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER before_insert_content_source_set_external_id
BEFORE INSERT ON public.content_sources
FOR EACH ROW
EXECUTE PROCEDURE public.set_default_external_id();

-- 7. RLS Policies
-- content_sources: owner-only
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage their own content sources" ON public.content_sources;
CREATE POLICY "Users can manage their own content sources"
ON public.content_sources
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- content_items: owner-only select
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view content from their sources" ON public.content_items;
CREATE POLICY "Users can view content from their sources"
ON public.content_items
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.content_sources s
    WHERE s.id = content_items.source_id AND s.user_id = auth.uid()
  )
);

-- Allow service roles to bypass RLS for backend processing (e.g., syncing)
DROP POLICY IF EXISTS "System can manage content items" ON public.content_items;
CREATE POLICY "System can manage content items"
ON public.content_items
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');
