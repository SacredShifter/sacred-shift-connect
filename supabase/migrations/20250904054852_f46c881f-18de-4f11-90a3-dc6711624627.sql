-- Add missing source_platform column to content_items table
ALTER TABLE public.content_items 
ADD COLUMN source_platform text;

-- Add an index on source_platform for better query performance
CREATE INDEX idx_content_items_source_platform ON public.content_items(source_platform);

-- Update existing content_items to set source_platform based on their content_sources
UPDATE public.content_items 
SET source_platform = cs.source_name
FROM public.content_sources cs 
WHERE content_items.source_id = cs.id;

-- Create or replace the search_unified_media function with proper column references
CREATE OR REPLACE FUNCTION public.search_unified_media(
  search_query text DEFAULT ''::text, 
  category_filter uuid DEFAULT NULL::uuid, 
  source_filter text DEFAULT NULL::text, 
  consciousness_level_filter text DEFAULT NULL::text, 
  limit_count integer DEFAULT 50
)
RETURNS TABLE(
  id uuid, 
  title text, 
  description text, 
  thumbnail_url text, 
  source_platform text, 
  content_url text, 
  category_name text, 
  category_id uuid, 
  featured_priority integer, 
  energy_level integer, 
  consciousness_level text, 
  genre_tags text[], 
  mood_tags text[], 
  teaching_notes text, 
  created_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.title,
    ci.description,
    ci.thumbnail_url,
    ci.source_platform,
    ci.content_url,
    mc.name as category_name,
    ci.category_id,
    ci.featured_priority,
    ci.energy_level,
    ci.consciousness_level,
    ci.genre_tags,
    ci.mood_tags,
    ci.teaching_notes,
    ci.created_at
  FROM public.content_items ci
  LEFT JOIN public.media_categories mc ON ci.category_id = mc.id
  WHERE 
    (search_query = '' OR (
      ci.title ILIKE '%' || search_query || '%' OR
      ci.description ILIKE '%' || search_query || '%' OR
      ci.teaching_notes ILIKE '%' || search_query || '%' OR
      EXISTS (
        SELECT 1 FROM unnest(ci.genre_tags) AS tag WHERE tag ILIKE '%' || search_query || '%'
      ) OR
      EXISTS (
        SELECT 1 FROM unnest(ci.mood_tags) AS tag WHERE tag ILIKE '%' || search_query || '%'
      )
    ))
    AND (category_filter IS NULL OR ci.category_id = category_filter)
    AND (source_filter IS NULL OR ci.source_platform = source_filter)
    AND (consciousness_level_filter IS NULL OR ci.consciousness_level = consciousness_level_filter)
  ORDER BY 
    ci.featured_priority DESC NULLS LAST,
    CASE WHEN search_query != '' THEN 
      ts_rank(to_tsvector('english', coalesce(ci.title, '') || ' ' || coalesce(ci.description, '')), plainto_tsquery('english', search_query))
    ELSE 0 END DESC,
    ci.created_at DESC
  LIMIT limit_count;
END;
$function$;