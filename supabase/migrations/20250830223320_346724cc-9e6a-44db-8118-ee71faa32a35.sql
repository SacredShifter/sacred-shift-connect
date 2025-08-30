-- Phase 1: Polarity-Integrated GAA Database Extensions

-- Extend existing gaa_presets table with polarity and dark-phase fields
ALTER TABLE gaa_presets
  ADD COLUMN IF NOT EXISTS dark_weight numeric DEFAULT 0.7,
  ADD COLUMN IF NOT EXISTS light_weight numeric DEFAULT 0.3,
  ADD COLUMN IF NOT EXISTS manifest_dark_phase jsonb
    DEFAULT jsonb_build_object('duration', 30, 'intensity', 0.5, 'curve', 'exp'),
  ADD COLUMN IF NOT EXISTS polarity_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS shadow_mode_default boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS dark_energy_enabled boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS dark_energy_params jsonb
    DEFAULT jsonb_build_object('driftRate', 0.0005, 'depth', 0.2);

-- Extend cosmic_structures with firmament state tracking
ALTER TABLE cosmic_structures
  ADD COLUMN IF NOT EXISTS firmament_state jsonb
    DEFAULT jsonb_build_object('Lmax_gly', 15.0, 'updated_at', now());

-- Multi-user GAA sessions for collective orchestra mode
CREATE TABLE IF NOT EXISTS gaa_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  preset_id uuid REFERENCES gaa_presets(id),
  host_uid uuid NOT NULL,
  started_at timestamptz DEFAULT now(),
  settings jsonb DEFAULT '{}',
  collective_phase numeric DEFAULT 0,
  is_public boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for gaa_sessions
ALTER TABLE gaa_sessions ENABLE ROW LEVEL SECURITY;

-- Session participants tracking
CREATE TABLE IF NOT EXISTS gaa_session_participants (
  session_id uuid REFERENCES gaa_sessions(id) ON DELETE CASCADE,
  user_uid uuid NOT NULL,
  joined_at timestamptz DEFAULT now(),
  PRIMARY KEY (session_id, user_uid)
);

-- Enable RLS for participants
ALTER TABLE gaa_session_participants ENABLE ROW LEVEL SECURITY;

-- RLS policies for GAA sessions
CREATE POLICY "Users can view public sessions or their own sessions" 
ON gaa_sessions 
FOR SELECT 
USING (is_public = true OR host_uid = auth.uid() OR EXISTS (
  SELECT 1 FROM gaa_session_participants 
  WHERE session_id = gaa_sessions.id AND user_uid = auth.uid()
));

CREATE POLICY "Users can create their own sessions" 
ON gaa_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = host_uid);

CREATE POLICY "Session hosts can update their sessions" 
ON gaa_sessions 
FOR UPDATE 
USING (auth.uid() = host_uid);

CREATE POLICY "Session hosts can delete their sessions" 
ON gaa_sessions 
FOR DELETE 
USING (auth.uid() = host_uid);

-- RLS policies for session participants
CREATE POLICY "Users can view participants in sessions they can access" 
ON gaa_session_participants 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM gaa_sessions 
  WHERE id = session_id AND (
    is_public = true OR 
    host_uid = auth.uid() OR 
    EXISTS (SELECT 1 FROM gaa_session_participants sp WHERE sp.session_id = gaa_sessions.id AND sp.user_uid = auth.uid())
  )
));

CREATE POLICY "Users can join sessions" 
ON gaa_session_participants 
FOR INSERT 
WITH CHECK (auth.uid() = user_uid);

CREATE POLICY "Users can leave sessions" 
ON gaa_session_participants 
FOR DELETE 
USING (auth.uid() = user_uid);

-- Biofeedback data tracking
CREATE TABLE IF NOT EXISTS biofeedback_streams (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  session_id uuid REFERENCES gaa_sessions(id) ON DELETE CASCADE,
  stream_type text NOT NULL, -- 'breath', 'hrv', 'eeg'
  data_point numeric NOT NULL,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'
);

-- Enable RLS for biofeedback
ALTER TABLE biofeedback_streams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own biofeedback data" 
ON biofeedback_streams 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Cosmic events ingestion for real-time data
CREATE TABLE IF NOT EXISTS cosmic_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL, -- 'GW_DETECTION', 'STRUCTURE_UPDATE', etc.
  event_data jsonb NOT NULL,
  source_url text,
  ingested_at timestamptz DEFAULT now(),
  processed boolean DEFAULT false,
  generated_preset_id uuid REFERENCES gaa_presets(id)
);

-- Enable RLS for cosmic events (public read)
ALTER TABLE cosmic_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view cosmic events" 
ON cosmic_events 
FOR SELECT 
USING (true);

CREATE POLICY "Service role can manage cosmic events" 
ON cosmic_events 
FOR ALL 
USING (auth.role() = 'service_role');

-- Update trigger for gaa_sessions
CREATE OR REPLACE FUNCTION update_gaa_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_gaa_sessions_updated_at
BEFORE UPDATE ON gaa_sessions
FOR EACH ROW
EXECUTE FUNCTION update_gaa_sessions_updated_at();