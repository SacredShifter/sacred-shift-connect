-- Create screensaver_events table for logging screensaver usage
CREATE TABLE public.screensaver_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  visual_type TEXT,
  duration INTEGER,
  triggered_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.screensaver_events ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own screensaver events" 
ON public.screensaver_events 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own screensaver events" 
ON public.screensaver_events 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_screensaver_events_user_id ON public.screensaver_events(user_id);
CREATE INDEX idx_screensaver_events_triggered_at ON public.screensaver_events(triggered_at);