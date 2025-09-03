-- Phase 1: Sacred Shifter Unified Media Library Database Enhancement

-- Create media categories table for organizing content (Meditations, Music, Talks, etc.)
CREATE TABLE public.media_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  icon_name TEXT, -- Lucide icon name
  color_scheme TEXT DEFAULT '#8A2BE2', -- Sacred purple default
  sacred_geometry TEXT DEFAULT 'mandala',
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default Sacred Shifter content categories
INSERT INTO public.media_categories (name, description, display_order, icon_name, color_scheme, sacred_geometry) VALUES
('Meditations', 'Guided meditations and mindfulness practices', 1, 'Circle', '#8A2BE2', 'mandala'),
('Music', 'Sacred frequencies and healing sounds', 2, 'Music', '#4A90E2', 'spiral'),
('Talks', 'Wisdom teachings and consciousness discussions', 3, 'MessageSquare', '#F5A623', 'flower_of_life'),
('Teachings', 'Educational content and spiritual insights', 4, 'BookOpen', '#7ED321', 'tree_of_life'),
('Rituals', 'Ceremonial practices and sacred rituals', 5, 'Flame', '#D0021B', 'sacred_cross'),
('Journey', 'Consciousness exploration and inner work', 6, 'Compass', '#9013FE', 'merkaba'),
('Community', 'Circle sharing and collective wisdom', 7, 'Users', '#00BCD4', 'flower_of_life'),
('Healing', 'Therapeutic and recovery-focused content', 8, 'Heart', '#FF5722', 'spiral');

-- Add enhanced metadata to content_items table
ALTER TABLE public.content_items 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.media_categories(id),
ADD COLUMN IF NOT EXISTS teaching_notes TEXT,
ADD COLUMN IF NOT EXISTS featured_priority INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS netflix_style_metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS genre_tags TEXT[],
ADD COLUMN IF NOT EXISTS mood_tags TEXT[],
ADD COLUMN IF NOT EXISTS energy_level INTEGER DEFAULT 5, -- 1-10 scale
ADD COLUMN IF NOT EXISTS recommended_time_of_day TEXT[], -- morning, afternoon, evening, night
ADD COLUMN IF NOT EXISTS consciousness_level TEXT DEFAULT 'beginner', -- beginner, intermediate, advanced, master
ADD COLUMN IF NOT EXISTS sacred_geometry_association TEXT DEFAULT 'flower_of_life';

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_items_category_id ON public.content_items(category_id);
CREATE INDEX IF NOT EXISTS idx_content_items_featured_priority ON public.content_items(featured_priority DESC) WHERE featured_priority > 0;
CREATE INDEX IF NOT EXISTS idx_content_items_consciousness_level ON public.content_items(consciousness_level);
CREATE INDEX IF NOT EXISTS idx_media_categories_display_order ON public.media_categories(display_order);
CREATE INDEX IF NOT EXISTS idx_content_items_energy_level ON public.content_items(energy_level);

-- Enable RLS on media_categories
ALTER TABLE public.media_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies for media_categories - Admin only can manage
CREATE POLICY "Anyone can view media categories" 
ON public.media_categories FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage media categories" 
ON public.media_categories FOR ALL 
USING (
  auth.email() = 'kentburchard@sacredshifter.com' 
  OR user_has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.email() = 'kentburchard@sacredshifter.com' 
  OR user_has_role(auth.uid(), 'admin'::app_role)
);

-- Update RLS policies for content_items to include admin-only content management
DROP POLICY IF EXISTS "Users can manage content_items" ON public.content_items;

-- New admin-only content management policy
CREATE POLICY "Only admins can manage content items" 
ON public.content_items FOR ALL 
USING (
  auth.email() = 'kentburchard@sacredshifter.com' 
  OR user_has_role(auth.uid(), 'admin'::app_role)
)
WITH CHECK (
  auth.email() = 'kentburchard@sacredshifter.com' 
  OR user_has_role(auth.uid(), 'admin'::app_role)
);

-- Everyone can view content (needed for the library)
CREATE POLICY "Anyone can view content items" 
ON public.content_items FOR SELECT 
USING (true);

-- Create function to get featured content by category
CREATE OR REPLACE FUNCTION public.get_featured_content_by_category()
RETURNS TABLE (
  category_name TEXT,
  category_id UUID,
  content_count BIGINT,
  featured_items JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    mc.name as category_name,
    mc.id as category_id,
    COUNT(ci.id) as content_count,
    COALESCE(
      jsonb_agg(
        jsonb_build_object(
          'id', ci.id,
          'title', ci.title,
          'thumbnail_url', ci.thumbnail_url,
          'source_platform', ci.source_platform,
          'featured_priority', ci.featured_priority,
          'energy_level', ci.energy_level,
          'consciousness_level', ci.consciousness_level,
          'genre_tags', ci.genre_tags
        ) ORDER BY ci.featured_priority DESC, ci.created_at DESC
      ) FILTER (WHERE ci.id IS NOT NULL),
      '[]'::jsonb
    ) as featured_items
  FROM public.media_categories mc
  LEFT JOIN public.content_items ci ON mc.id = ci.category_id 
    AND ci.featured_priority > 0
  WHERE mc.is_active = true
  GROUP BY mc.id, mc.name, mc.display_order
  ORDER BY mc.display_order;
END;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_media_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_media_categories_updated_at
  BEFORE UPDATE ON public.media_categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_media_categories_updated_at();

-- Create function for unified search across all content
CREATE OR REPLACE FUNCTION public.search_unified_media(
  search_query TEXT DEFAULT '',
  category_filter UUID DEFAULT NULL,
  source_filter TEXT DEFAULT NULL,
  consciousness_level_filter TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  thumbnail_url TEXT,
  source_platform TEXT,
  source_url TEXT,
  category_name TEXT,
  category_id UUID,
  featured_priority INTEGER,
  energy_level INTEGER,
  consciousness_level TEXT,
  genre_tags TEXT[],
  mood_tags TEXT[],
  teaching_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id,
    ci.title,
    ci.description,
    ci.thumbnail_url,
    ci.source_platform,
    ci.source_url,
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
$$;