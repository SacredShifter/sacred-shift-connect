-- First, let's check if the breath_sessions table exists and create it if it doesn't
CREATE TABLE IF NOT EXISTS public.breath_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    duration INTEGER NOT NULL,
    cycles_completed INTEGER NOT NULL,
    breath_pattern JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on the table
ALTER TABLE public.breath_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for breath_sessions
-- Users can only see their own breath sessions
CREATE POLICY "Users can view their own breath sessions" 
ON public.breath_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can only insert their own breath sessions
CREATE POLICY "Users can create their own breath sessions" 
ON public.breath_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own breath sessions
CREATE POLICY "Users can update their own breath sessions" 
ON public.breath_sessions 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own breath sessions
CREATE POLICY "Users can delete their own breath sessions" 
ON public.breath_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for updating the updated_at column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_breath_sessions_updated_at
    BEFORE UPDATE ON public.breath_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();