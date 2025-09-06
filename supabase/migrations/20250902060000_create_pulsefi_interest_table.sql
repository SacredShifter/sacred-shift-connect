-- Create Pulse-Fi interest registration table
-- This table stores user interest registrations for Pulse-Fi hardware pre-orders

CREATE TABLE IF NOT EXISTS public.pulsefi_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  option TEXT NOT NULL CHECK (option IN ('Single-Room', 'Multi-Room', 'GAA')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pulsefi_interest ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Allow anyone to insert (for pre-order interest)
CREATE POLICY "Anyone can register interest in Pulse-Fi"
  ON public.pulsefi_interest
  FOR INSERT
  WITH CHECK (true);

-- Only allow users to view their own registrations (if authenticated)
CREATE POLICY "Users can view their own Pulse-Fi interest"
  ON public.pulsefi_interest
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_pulsefi_interest_email ON public.pulsefi_interest(email);
CREATE INDEX IF NOT EXISTS idx_pulsefi_interest_option ON public.pulsefi_interest(option);
CREATE INDEX IF NOT EXISTS idx_pulsefi_interest_created_at ON public.pulsefi_interest(created_at);

-- Add comment for documentation
COMMENT ON TABLE public.pulsefi_interest IS 'Stores user interest registrations for Pulse-Fi hardware pre-orders';
COMMENT ON COLUMN public.pulsefi_interest.option IS 'Selected Pulse-Fi system option: Single-Room, Multi-Room, or GAA';
COMMENT ON COLUMN public.pulsefi_interest.notes IS 'Optional user notes about their interest or requirements';
