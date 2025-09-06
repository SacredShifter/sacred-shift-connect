-- Create Grove Journey Progress table
-- This table tracks user progress through Sacred Grove consciousness evolution journeys

CREATE TABLE IF NOT EXISTS public.grove_journey_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pathway_id TEXT NOT NULL,
  current_step INTEGER NOT NULL DEFAULT 0,
  total_steps INTEGER NOT NULL,
  completed_steps INTEGER[] DEFAULT '{}',
  consciousness_level DECIMAL(3,1) NOT NULL DEFAULT 1.0,
  resonance_field JSONB NOT NULL DEFAULT '{}',
  journey_data JSONB NOT NULL DEFAULT '{}',
  current_step_title TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.grove_journey_progress ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own Grove journey progress"
  ON public.grove_journey_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Grove journey progress"
  ON public.grove_journey_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Grove journey progress"
  ON public.grove_journey_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_grove_journey_progress_user_id ON public.grove_journey_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_grove_journey_progress_pathway_id ON public.grove_journey_progress(pathway_id);
CREATE INDEX IF NOT EXISTS idx_grove_journey_progress_consciousness_level ON public.grove_journey_progress(consciousness_level);
CREATE INDEX IF NOT EXISTS idx_grove_journey_progress_completed_at ON public.grove_journey_progress(completed_at);

-- Add consciousness level to profiles table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles' AND table_schema = 'public') THEN
        ALTER TABLE public.profiles 
        ADD COLUMN IF NOT EXISTS consciousness_level DECIMAL(3,1) DEFAULT 1.0;

        ALTER TABLE public.profiles 
        ADD COLUMN IF NOT EXISTS last_grove_activity TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_grove_journey_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_grove_journey_progress_updated_at
  BEFORE UPDATE ON public.grove_journey_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_grove_journey_updated_at();
