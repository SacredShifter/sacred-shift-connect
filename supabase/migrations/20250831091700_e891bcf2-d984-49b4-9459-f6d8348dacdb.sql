-- Sacred Shifter Privacy Compliance & Living Mesh Schema
-- Implements Privacy Act 1988, GDPR, CCPA compliance + Seeds/Handshakes

-- Privacy Compliance Tables
CREATE TABLE IF NOT EXISTS public.privacy_preferences_enhanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  analytics_consent BOOLEAN NOT NULL DEFAULT false,
  marketing_consent BOOLEAN NOT NULL DEFAULT false,
  profile_visibility TEXT NOT NULL DEFAULT 'private' CHECK (profile_visibility IN ('public', 'private', 'community')),
  data_processing_consent BOOLEAN NOT NULL DEFAULT false,
  communication_consent BOOLEAN NOT NULL DEFAULT false,
  health_data_consent BOOLEAN NOT NULL DEFAULT false,
  research_participation_consent BOOLEAN NOT NULL DEFAULT false,
  geolocation_consent BOOLEAN NOT NULL DEFAULT false,
  cookie_consent BOOLEAN NOT NULL DEFAULT false,
  third_party_sharing_consent BOOLEAN NOT NULL DEFAULT false,
  data_retention_period INTEGER NOT NULL DEFAULT 365,
  auto_delete_enabled BOOLEAN NOT NULL DEFAULT false,
  mesh_communication_consent BOOLEAN NOT NULL DEFAULT false,
  light_adapter_consent BOOLEAN NOT NULL DEFAULT false,
  frequency_adapter_consent BOOLEAN NOT NULL DEFAULT false,
  nature_adapter_consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.consent_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  consent_type TEXT NOT NULL,
  consent_given BOOLEAN NOT NULL,
  privacy_policy_version TEXT NOT NULL,
  terms_version TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  legal_basis TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.compliance_audit_trail (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  actor_id UUID,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  before_state JSONB,
  after_state JSONB,
  legal_basis TEXT,
  compliance_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.data_access_requests_enhanced (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  request_type TEXT NOT NULL CHECK (request_type IN ('export', 'deletion', 'correction', 'portability', 'restriction')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  requested_data_types TEXT[] NOT NULL DEFAULT '{}',
  description TEXT,
  processing_notes TEXT,
  legal_deadline TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Sacred Mesh Living Organism Tables
CREATE TABLE IF NOT EXISTS public.sacred_mesh_seeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  seed_name TEXT NOT NULL,
  identity_key_public BYTEA NOT NULL,
  identity_key_private_encrypted BYTEA NOT NULL,
  transport_capabilities JSONB NOT NULL DEFAULT '{}',
  consent_scope JSONB NOT NULL DEFAULT '{}',
  genealogy JSONB NOT NULL DEFAULT '{}',
  frequency_signature JSONB,
  light_signature JSONB,
  nature_signature JSONB,
  quantum_signature JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sacred_mesh_handshakes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  initiator_seed_id UUID NOT NULL REFERENCES public.sacred_mesh_seeds(id),
  responder_seed_id UUID,
  handshake_type TEXT NOT NULL CHECK (handshake_type IN ('websocket', 'light', 'frequency', 'nature', 'file', 'satellite', 'quantum')),
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'challenged', 'verified', 'established', 'failed', 'expired')),
  challenge_data JSONB,
  response_data JSONB,
  session_key_encrypted BYTEA,
  adapter_config JSONB,
  consent_verified BOOLEAN NOT NULL DEFAULT false,
  privacy_audit_log JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS public.sacred_mesh_communications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  handshake_id UUID NOT NULL REFERENCES public.sacred_mesh_handshakes(id),
  sender_seed_id UUID NOT NULL REFERENCES public.sacred_mesh_seeds(id),
  receiver_seed_id UUID REFERENCES public.sacred_mesh_seeds(id),
  adapter_type TEXT NOT NULL,
  message_type TEXT NOT NULL,
  encrypted_payload BYTEA NOT NULL,
  frequency_pattern JSONB,
  light_pattern JSONB,
  nature_pattern JSONB,
  transmission_metadata JSONB,
  privacy_compliance_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.sacred_mesh_adapters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  adapter_type TEXT NOT NULL CHECK (adapter_type IN ('websocket', 'light', 'frequency', 'nature', 'file', 'satellite', 'quantum')),
  user_id UUID NOT NULL,
  is_enabled BOOLEAN NOT NULL DEFAULT false,
  configuration JSONB NOT NULL DEFAULT '{}',
  calibration_data JSONB,
  consent_granted_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_statistics JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(adapter_type, user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.privacy_preferences_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_audit_trail ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_access_requests_enhanced ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sacred_mesh_seeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sacred_mesh_handshakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sacred_mesh_communications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sacred_mesh_adapters ENABLE ROW LEVEL SECURITY;

-- Privacy Compliance RLS Policies
CREATE POLICY "Users can manage their own privacy preferences" ON public.privacy_preferences_enhanced
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own consent logs" ON public.consent_logs
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert consent logs" ON public.consent_logs
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view their own audit trail" ON public.compliance_audit_trail
FOR SELECT USING (auth.uid() = user_id OR auth.uid() = actor_id);

CREATE POLICY "System can insert audit trails" ON public.compliance_audit_trail
FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can manage their own data requests" ON public.data_access_requests_enhanced
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Sacred Mesh RLS Policies
CREATE POLICY "Users can manage their own seeds" ON public.sacred_mesh_seeds
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view handshakes involving their seeds" ON public.sacred_mesh_handshakes
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.sacred_mesh_seeds 
    WHERE id = initiator_seed_id AND user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.sacred_mesh_seeds 
    WHERE id = responder_seed_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can insert handshakes from their seeds" ON public.sacred_mesh_handshakes
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sacred_mesh_seeds 
    WHERE id = initiator_seed_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update handshakes involving their seeds" ON public.sacred_mesh_handshakes
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.sacred_mesh_seeds 
    WHERE id = initiator_seed_id AND user_id = auth.uid()
  ) OR
  EXISTS (
    SELECT 1 FROM public.sacred_mesh_seeds 
    WHERE id = responder_seed_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage communications from their seeds" ON public.sacred_mesh_communications
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.sacred_mesh_seeds 
    WHERE id = sender_seed_id AND user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.sacred_mesh_seeds 
    WHERE id = sender_seed_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can view received communications" ON public.sacred_mesh_communications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.sacred_mesh_seeds 
    WHERE id = receiver_seed_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can manage their own adapters" ON public.sacred_mesh_adapters
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_privacy_preferences_updated_at
BEFORE UPDATE ON public.privacy_preferences_enhanced
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_sacred_mesh_seeds_updated_at
BEFORE UPDATE ON public.sacred_mesh_seeds
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Compliance logging function
CREATE OR REPLACE FUNCTION public.log_compliance_event(
  p_user_id UUID,
  p_actor_id UUID,
  p_action_type TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_before_state JSONB DEFAULT NULL,
  p_after_state JSONB DEFAULT NULL,
  p_legal_basis TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  audit_id UUID;
  compliance_hash TEXT;
BEGIN
  -- Generate compliance hash for integrity
  compliance_hash := encode(digest(
    COALESCE(p_user_id::text, '') || 
    COALESCE(p_actor_id::text, '') || 
    p_action_type || 
    p_entity_type || 
    COALESCE(p_entity_id::text, '') || 
    COALESCE(p_before_state::text, '') || 
    COALESCE(p_after_state::text, '') || 
    extract(epoch from now())::text,
    'sha256'
  ), 'hex');
  
  INSERT INTO public.compliance_audit_trail (
    user_id, actor_id, action_type, entity_type, entity_id,
    before_state, after_state, legal_basis, compliance_hash
  ) VALUES (
    p_user_id, p_actor_id, p_action_type, p_entity_type, p_entity_id,
    p_before_state, p_after_state, p_legal_basis, compliance_hash
  ) RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Data deletion compliance function
CREATE OR REPLACE FUNCTION public.delete_user_data_compliant(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deletion_summary JSONB := '{}';
  tables_processed TEXT[] := ARRAY[]::TEXT[];
BEGIN
  -- Log the deletion request
  PERFORM public.log_compliance_event(
    p_user_id, p_user_id, 'data_deletion_initiated', 'user_account', p_user_id,
    NULL, jsonb_build_object('deletion_timestamp', now())
  );
  
  -- Delete from user tables (preserving audit trails per legal requirements)
  DELETE FROM public.profiles WHERE user_id = p_user_id;
  tables_processed := array_append(tables_processed, 'profiles');
  
  DELETE FROM public.privacy_preferences_enhanced WHERE user_id = p_user_id;
  tables_processed := array_append(tables_processed, 'privacy_preferences_enhanced');
  
  DELETE FROM public.sacred_mesh_seeds WHERE user_id = p_user_id;
  tables_processed := array_append(tables_processed, 'sacred_mesh_seeds');
  
  DELETE FROM public.sacred_mesh_adapters WHERE user_id = p_user_id;
  tables_processed := array_append(tables_processed, 'sacred_mesh_adapters');
  
  -- Mark data access requests as completed
  UPDATE public.data_access_requests_enhanced 
  SET status = 'completed', completed_at = now()
  WHERE user_id = p_user_id AND request_type = 'deletion';
  
  deletion_summary := jsonb_build_object(
    'user_id', p_user_id,
    'deleted_at', now(),
    'tables_processed', tables_processed,
    'audit_retention', 'Audit trails retained per legal requirements'
  );
  
  -- Final compliance log
  PERFORM public.log_compliance_event(
    p_user_id, p_user_id, 'data_deletion_completed', 'user_account', p_user_id,
    NULL, deletion_summary
  );
  
  RETURN deletion_summary;
END;
$$;