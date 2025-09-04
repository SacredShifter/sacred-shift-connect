-- Create table for Tao journey reflections
CREATE TABLE public.tao_journey_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  module_path TEXT NOT NULL,
  module_name TEXT NOT NULL,
  reflection_text TEXT NOT NULL,
  bell_frequency INTEGER,
  journey_stage TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.tao_journey_reflections ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own reflections" 
ON public.tao_journey_reflections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reflections" 
ON public.tao_journey_reflections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections" 
ON public.tao_journey_reflections 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_tao_journey_reflections_updated_at
BEFORE UPDATE ON public.tao_journey_reflections
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at();