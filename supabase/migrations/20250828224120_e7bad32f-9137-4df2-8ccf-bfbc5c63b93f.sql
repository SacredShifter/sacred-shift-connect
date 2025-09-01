-- Fix the events table structure
-- First, let's see what columns exist and add the missing ones

-- Add missing end_datetime column to events table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'events' AND column_name = 'end_datetime') THEN
        ALTER TABLE public.events ADD COLUMN end_datetime TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Also ensure we have a proper events table structure for social platform
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    start_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    end_datetime TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    circle_id UUID,
    is_public BOOLEAN DEFAULT true,
    max_attendees INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    event_type TEXT DEFAULT 'general',
    tags TEXT[],
    image_url TEXT
);

-- Enable RLS on events table
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Create policies for events
CREATE POLICY "Anyone can view public events" 
ON public.events 
FOR SELECT 
USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "Users can create events" 
ON public.events 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own events" 
ON public.events 
FOR UPDATE 
USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own events" 
ON public.events 
FOR DELETE 
USING (auth.uid() = created_by);

-- Create event_attendees table for tracking who's attending
CREATE TABLE IF NOT EXISTS public.event_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'attending' CHECK (status IN ('attending', 'maybe', 'not_attending')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(event_id, user_id)
);

-- Enable RLS on event_attendees
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;

-- Policies for event_attendees
CREATE POLICY "Users can view event attendees" 
ON public.event_attendees 
FOR SELECT 
USING (true);

CREATE POLICY "Users can manage their own attendance" 
ON public.event_attendees 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);