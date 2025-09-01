-- Ensure registry_of_resonance table exists with proper structure
CREATE TABLE IF NOT EXISTS public.registry_of_resonance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  resonance_rating INTEGER NOT NULL DEFAULT 5 CHECK (resonance_rating >= 1 AND resonance_rating <= 10),
  resonance_signature TEXT,
  tags TEXT[],
  entry_type TEXT NOT NULL DEFAULT 'Sacred Teachings',
  access_level TEXT NOT NULL DEFAULT 'Public' CHECK (access_level IN ('Private', 'Circle', 'Public')),
  is_verified BOOLEAN DEFAULT false,
  is_pinned BOOLEAN DEFAULT false,
  category_id UUID,
  image_url TEXT,
  image_alt_text TEXT,
  author_name TEXT,
  author_bio TEXT,
  publication_date TIMESTAMPTZ,
  reading_time_minutes INTEGER,
  word_count INTEGER,
  source_citation TEXT,
  inspiration_source TEXT,
  visibility_settings JSONB DEFAULT '{"public": true, "circle_shared": false, "featured": false}',
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'markdown', 'rich_text')),
  engagement_metrics JSONB DEFAULT '{"views": 0, "shares": 0, "bookmarks": 0}',
  resonance_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on registry_of_resonance
ALTER TABLE public.registry_of_resonance ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view public entries" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Users can view their own entries" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Users can create entries" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Users can update their own entries" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Admins can update all entries" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Users can delete their own entries" ON public.registry_of_resonance;
DROP POLICY IF EXISTS "Admins can delete all entries" ON public.registry_of_resonance;

-- Create comprehensive RLS policies for registry_of_resonance

-- SELECT policies: All users can see public entries, users can see their own entries
CREATE POLICY "Anyone can view public entries"
  ON public.registry_of_resonance
  FOR SELECT
  USING (access_level = 'Public');

CREATE POLICY "Users can view their own entries"
  ON public.registry_of_resonance
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy: Authenticated users can create entries
CREATE POLICY "Authenticated users can create entries"
  ON public.registry_of_resonance
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policies: Users can update their own entries, Justice/Aura can update all
CREATE POLICY "Users can update their own entries"
  ON public.registry_of_resonance
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Justice and Aura can update all entries"
  ON public.registry_of_resonance
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('justice@sacredshifter.com', 'aura@sacredshifter.com')
    )
  );

-- DELETE policies: Users can delete their own entries, Justice/Aura can delete all
CREATE POLICY "Users can delete their own entries"
  ON public.registry_of_resonance
  FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Justice and Aura can delete all entries"
  ON public.registry_of_resonance
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users 
      WHERE auth.users.id = auth.uid() 
      AND auth.users.email IN ('justice@sacredshifter.com', 'aura@sacredshifter.com')
    )
  );

-- Create registry_entry_resonance table for likes/resonance voting
CREATE TABLE IF NOT EXISTS public.registry_entry_resonance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.registry_of_resonance(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(entry_id, user_id)
);

-- Enable RLS on registry_entry_resonance
ALTER TABLE public.registry_entry_resonance ENABLE ROW LEVEL SECURITY;

-- RLS policies for resonance voting
CREATE POLICY "Anyone can view resonance votes" ON public.registry_entry_resonance FOR SELECT USING (true);
CREATE POLICY "Users can manage their own resonance votes" ON public.registry_entry_resonance FOR ALL USING (auth.uid() = user_id);

-- Create registry_entry_comments table for comments
CREATE TABLE IF NOT EXISTS public.registry_entry_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID NOT NULL REFERENCES public.registry_of_resonance(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_comment_id UUID REFERENCES public.registry_entry_comments(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on registry_entry_comments
ALTER TABLE public.registry_entry_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for comments
CREATE POLICY "Anyone can view comments" ON public.registry_entry_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.registry_entry_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.registry_entry_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.registry_entry_comments FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for registry images if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('registry-images', 'registry-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for registry images
CREATE POLICY "Anyone can view registry images" ON storage.objects FOR SELECT USING (bucket_id = 'registry-images');
CREATE POLICY "Authenticated users can upload registry images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'registry-images' AND auth.uid() IS NOT NULL);
CREATE POLICY "Users can update their own registry images" ON storage.objects FOR UPDATE USING (bucket_id = 'registry-images' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete their own registry images" ON storage.objects FOR DELETE USING (bucket_id = 'registry-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION update_registry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER registry_update_updated_at
  BEFORE UPDATE ON public.registry_of_resonance
  FOR EACH ROW
  EXECUTE FUNCTION update_registry_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registry_user_id ON public.registry_of_resonance(user_id);
CREATE INDEX IF NOT EXISTS idx_registry_access_level ON public.registry_of_resonance(access_level);
CREATE INDEX IF NOT EXISTS idx_registry_entry_type ON public.registry_of_resonance(entry_type);
CREATE INDEX IF NOT EXISTS idx_registry_created_at ON public.registry_of_resonance(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registry_resonance_rating ON public.registry_of_resonance(resonance_rating DESC);
CREATE INDEX IF NOT EXISTS idx_registry_tags ON public.registry_of_resonance USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_registry_text_search ON public.registry_of_resonance USING GIN(to_tsvector('english', title || ' ' || content));