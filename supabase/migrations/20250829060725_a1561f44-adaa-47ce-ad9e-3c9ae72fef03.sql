-- Create comprehensive Sacred Shifter profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  -- Primary key
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Core identity fields
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender_identity text,
  timezone text NOT NULL DEFAULT 'UTC',
  primary_language text NOT NULL DEFAULT 'en',

  -- Resonance & spiritual fields
  soul_identity text,
  resonance_tags text[] DEFAULT '{}',
  aura_signature text,
  circles_joined uuid[] DEFAULT '{}',

  -- Journey tracking fields
  current_stage text NOT NULL DEFAULT 'Entry' CHECK (current_stage IN ('Entry', 'Expansion', 'Integration', 'Crown', 'Beyond')),
  last_login timestamp with time zone DEFAULT now(),
  streak_days integer DEFAULT 0,
  total_meditation_minutes integer DEFAULT 0,
  total_journal_entries integer DEFAULT 0,
  total_breath_sessions integer DEFAULT 0,
  mood_trends jsonb DEFAULT '{}',

  -- Synchronicity tracking
  last_synchronicity_event timestamp with time zone,
  synchronicity_chain text[] DEFAULT '{}',
  synchronicity_score integer DEFAULT 0,

  -- Technical fields
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  deleted_at timestamp with time zone
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile"
  ON public.profiles
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, date_of_birth, timezone, primary_language)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Sacred Shifter'),
    COALESCE((NEW.raw_user_meta_data->>'date_of_birth')::date, CURRENT_DATE - INTERVAL '30 years'),
    COALESCE(NEW.raw_user_meta_data->>'timezone', 'UTC'),
    COALESCE(NEW.raw_user_meta_data->>'primary_language', 'en')
  );
  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RETURN NEW; -- Don't block signup if profile creation fails
END;
$$;

-- Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created_profile ON auth.users;
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user_profile();

-- Create function to update profile updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_profile_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create trigger for updating updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profile_updated_at();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_current_stage ON public.profiles(current_stage);
CREATE INDEX IF NOT EXISTS idx_profiles_resonance_tags ON public.profiles USING GIN(resonance_tags);
CREATE INDEX IF NOT EXISTS idx_profiles_synchronicity_chain ON public.profiles USING GIN(synchronicity_chain);
CREATE INDEX IF NOT EXISTS idx_profiles_last_login ON public.profiles(last_login);

-- Create function to calculate derived fields
CREATE OR REPLACE FUNCTION public.update_profile_metrics(profile_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  meditation_count int;
  journal_count int;
  breath_count int;
  meditation_minutes int;
BEGIN
  -- Calculate meditation sessions and minutes
  SELECT 
    COUNT(*), 
    COALESCE(SUM(EXTRACT(EPOCH FROM (ended_at - started_at))/60), 0)
  INTO meditation_count, meditation_minutes
  FROM meditation_sessions 
  WHERE user_id = profile_user_id AND ended_at IS NOT NULL;

  -- Calculate journal entries
  SELECT COUNT(*) 
  INTO journal_count 
  FROM mirror_journal_entries 
  WHERE user_id = profile_user_id;

  -- Calculate breath sessions
  SELECT COUNT(*) 
  INTO breath_count 
  FROM breath_sessions 
  WHERE user_id = profile_user_id;

  -- Update profile with calculated metrics
  UPDATE public.profiles 
  SET 
    total_meditation_minutes = meditation_minutes,
    total_journal_entries = journal_count,
    total_breath_sessions = breath_count,
    updated_at = now()
  WHERE user_id = profile_user_id;
END;
$$;