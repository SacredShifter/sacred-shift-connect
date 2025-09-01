-- Create breath_sessions table for Sacred Ventilation tracking
CREATE TABLE public.breath_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  mode TEXT NOT NULL DEFAULT 'sacred_ventilation',
  rounds_planned INTEGER NOT NULL DEFAULT 2,
  rounds_completed INTEGER NOT NULL DEFAULT 0,
  cadence TEXT NOT NULL DEFAULT 'moderate',
  intensity INTEGER NOT NULL DEFAULT 60,
  music_enabled BOOLEAN NOT NULL DEFAULT true,
  cycles_total INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  resonance_tags TEXT[] DEFAULT '{}',
  emotions TEXT[] DEFAULT '{}',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own breath sessions" 
ON public.breath_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own breath sessions" 
ON public.breath_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own breath sessions" 
ON public.breath_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own breath sessions" 
ON public.breath_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_breath_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_breath_sessions_updated_at
  BEFORE UPDATE ON public.breath_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_breath_sessions_updated_at();

-- Create user_safety_acknowledgments table
CREATE TABLE public.user_safety_acknowledgments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  acknowledgment_type TEXT NOT NULL,
  acknowledged_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, acknowledgment_type)
);

-- Enable RLS for safety acknowledgments
ALTER TABLE public.user_safety_acknowledgments ENABLE ROW LEVEL SECURITY;

-- Create policies for safety acknowledgments
CREATE POLICY "Users can manage their own safety acknowledgments" 
ON public.user_safety_acknowledgments 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);