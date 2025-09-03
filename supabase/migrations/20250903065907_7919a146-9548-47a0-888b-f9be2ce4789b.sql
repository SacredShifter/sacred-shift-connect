-- Fix critical RLS policy for content_sources table
-- Emergency fix for the 400 error when inserting content sources

-- Enable RLS on content_sources table
ALTER TABLE public.content_sources ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own content sources" ON public.content_sources;
DROP POLICY IF EXISTS "Users can view their own content sources" ON public.content_sources;
DROP POLICY IF EXISTS "Users can insert their own content sources" ON public.content_sources;
DROP POLICY IF EXISTS "Users can update their own content sources" ON public.content_sources;
DROP POLICY IF EXISTS "Users can delete their own content sources" ON public.content_sources;

-- Create comprehensive RLS policies for content_sources
CREATE POLICY "Users can view their own content sources"
  ON public.content_sources
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own content sources"
  ON public.content_sources
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content sources"
  ON public.content_sources
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own content sources"
  ON public.content_sources
  FOR DELETE
  USING (auth.uid() = user_id);