-- Fix critical RLS policy for content_sources table
-- This is the emergency fix for the 400 error when inserting content sources

-- Enable RLS if not already enabled
ALTER TABLE IF EXISTS public.content_sources ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies for content_sources
CREATE POLICY IF NOT EXISTS "Users can manage their own content sources"
  ON public.content_sources
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create additional policies for safer access patterns
CREATE POLICY IF NOT EXISTS "Users can view their own content sources"
  ON public.content_sources
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own content sources"
  ON public.content_sources
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own content sources"
  ON public.content_sources
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete their own content sources"
  ON public.content_sources
  FOR DELETE
  USING (auth.uid() = user_id);