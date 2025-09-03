-- Create karma_reflections table
CREATE TABLE IF NOT EXISTS public.karma_reflections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  reflection TEXT NOT NULL,
  outcome TEXT NOT NULL CHECK (outcome IN ('positive', 'negative', 'neutral')),
  tags TEXT[] DEFAULT '{}',
  linked_modules TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.karma_reflections ENABLE ROW LEVEL SECURITY;

-- Create policies for karma reflections
CREATE POLICY "Users can view their own karma reflections" 
ON public.karma_reflections 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own karma reflections" 
ON public.karma_reflections 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own karma reflections" 
ON public.karma_reflections 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own karma reflections" 
ON public.karma_reflections 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates  
CREATE TRIGGER update_karma_reflections_updated_at
BEFORE UPDATE ON public.karma_reflections
FOR EACH ROW
EXECUTE FUNCTION public.update_karma_reflections_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_karma_reflections_user_id ON public.karma_reflections(user_id);
CREATE INDEX idx_karma_reflections_outcome ON public.karma_reflections(outcome);
CREATE INDEX idx_karma_reflections_created_at ON public.karma_reflections(created_at);
CREATE INDEX idx_karma_reflections_tags ON public.karma_reflections USING GIN(tags);