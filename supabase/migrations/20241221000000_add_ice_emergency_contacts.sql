-- Add ICE (In Case of Emergency) contacts to Sacred Shifter
-- This enables emergency contact functionality while maintaining consciousness-aware architecture

-- Add ICE contacts column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ice_contacts JSONB DEFAULT '[]'::jsonb;

-- Add ICE consent tracking
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ice_consent_given BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS ice_consent_date TIMESTAMP WITH TIME ZONE;

-- Add ICE activation tracking
CREATE TABLE IF NOT EXISTS public.ice_activations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activated_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_name TEXT NOT NULL,
  contact_phone TEXT,
  contact_email TEXT,
  contact_user_id UUID REFERENCES auth.users(id),
  activation_type TEXT NOT NULL CHECK (activation_type IN ('call', 'message', 'location_share')),
  status TEXT NOT NULL CHECK (status IN ('initiated', 'connected', 'failed', 'fallback_sent')),
  webrtc_attempted BOOLEAN DEFAULT false,
  fallback_attempted BOOLEAN DEFAULT false,
  location_shared BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_ice_activations_user_id ON public.ice_activations(user_id);
CREATE INDEX IF NOT EXISTS idx_ice_activations_created_at ON public.ice_activations(created_at);

-- Add RLS policies for ICE data
ALTER TABLE public.ice_activations ENABLE ROW LEVEL SECURITY;

-- Users can only see their own ICE activations
CREATE POLICY "Users can view own ICE activations" ON public.ice_activations
  FOR SELECT USING (auth.uid() = user_id OR auth.uid() = activated_by);

-- Users can insert their own ICE activations
CREATE POLICY "Users can insert own ICE activations" ON public.ice_activations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own ICE activations
CREATE POLICY "Users can update own ICE activations" ON public.ice_activations
  FOR UPDATE USING (auth.uid() = user_id);

-- Create function to validate ICE contact structure
CREATE OR REPLACE FUNCTION validate_ice_contact(contact JSONB)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if contact has required fields
  IF NOT (contact ? 'name' AND contact ? 'relationship') THEN
    RETURN FALSE;
  END IF;
  
  -- Check if contact has at least one communication method
  IF NOT (contact ? 'phone' OR contact ? 'email' OR contact ? 'user_id') THEN
    RETURN FALSE;
  END IF;
  
  -- Validate phone format if present
  IF contact ? 'phone' AND contact->>'phone' IS NOT NULL THEN
    IF NOT (contact->>'phone' ~ '^\+?[1-9]\d{1,14}$') THEN
      RETURN FALSE;
    END IF;
  END IF;
  
  -- Validate email format if present
  IF contact ? 'email' AND contact->>'email' IS NOT NULL THEN
    IF NOT (contact->>'email' ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
      RETURN FALSE;
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Create function to update ICE contacts with validation
CREATE OR REPLACE FUNCTION update_ice_contacts(
  user_uuid UUID,
  new_contacts JSONB
)
RETURNS BOOLEAN AS $$
DECLARE
  contact JSONB;
BEGIN
  -- Validate each contact
  FOR contact IN SELECT * FROM jsonb_array_elements(new_contacts)
  LOOP
    IF NOT validate_ice_contact(contact) THEN
      RAISE EXCEPTION 'Invalid ICE contact structure: %', contact;
    END IF;
  END LOOP;
  
  -- Update the profiles table
  UPDATE public.profiles 
  SET 
    ice_contacts = new_contacts,
    ice_consent_given = true,
    ice_consent_date = NOW()
  WHERE user_id = user_uuid;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_ice_contacts(UUID, JSONB) TO authenticated;

-- Create function to get ICE contacts for emergency use
CREATE OR REPLACE FUNCTION get_ice_contacts_for_emergency(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  contacts JSONB;
BEGIN
  SELECT ice_contacts INTO contacts
  FROM public.profiles
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(contacts, '[]'::jsonb);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_ice_contacts_for_emergency(UUID) TO authenticated;

-- Add comment explaining the dual meaning of ICE
COMMENT ON COLUMN public.profiles.ice_contacts IS 'In Case of Emergency contacts - bypasses sovereignty filters for emergency communication. Also supports WebRTC ICE (Interactive Connectivity Establishment) for technical P2P handshake.';
