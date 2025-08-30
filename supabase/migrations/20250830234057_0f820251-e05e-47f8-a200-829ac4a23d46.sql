-- Create GAA Presets Extended table for polarity integration
CREATE TABLE public.gaa_presets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  geometry_type TEXT NOT NULL,
  parameters JSONB NOT NULL DEFAULT '{}',
  
  -- Polarity Extensions
  polarity_protocol JSONB NOT NULL DEFAULT '{
    "lightChannel": {"enabled": true, "amplitude": 1.0, "phase": 0, "subharmonicDepth": 0.3, "texturalComplexity": 0.5, "resonanceMode": "constructive"},
    "darkChannel": {"enabled": false, "amplitude": 0.8, "phase": 3.14159, "subharmonicDepth": 0.7, "texturalComplexity": 0.8, "resonanceMode": "destructive"},
    "polarityBalance": 0.0,
    "manifestInDark": false,
    "crossPolarizationEnabled": false,
    "darkEnergyDrift": {"driftRate": 0.01, "expansionFactor": 1.0, "voidResonance": false, "quantumFluctuation": 0.1, "darkMatterDensity": 0.27}
  }',
  cosmic_structure_id UUID NULL,
  biofeedback_integration BOOLEAN DEFAULT false,
  shadow_mode_enabled BOOLEAN DEFAULT false,
  collective_compatible BOOLEAN DEFAULT false,
  safety_profile JSONB NOT NULL DEFAULT '{
    "infrasonicLimit": 20,
    "ultrasonicLimit": 20000,
    "maxAmplitude": 0.8,
    "fatigueDetection": true,
    "shadowModeRequiresConsent": true,
    "emergencyStopEnabled": true,
    "biofeedbackLimits": {"maxHeartRate": 180, "minHeartRateVariability": 20, "maxStressIndicators": 0.8},
    "temporalSafetyLimits": {"maxSessionDuration": 60, "cooldownPeriod": 30, "maxDarkDominance": 0.8}
  }',
  
  -- Metadata
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tags TEXT[] DEFAULT '{}',
  evidence_provenance TEXT[] DEFAULT '{}',
  scientific_basis TEXT DEFAULT 'Sacred geometry and harmonic resonance principles'
);

-- Create Cosmic Structure Data table
CREATE TABLE public.cosmic_structures (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('galaxy', 'nebula', 'pulsar', 'blackhole', 'gravitational_wave', 'dark_matter', 'jwst_discovery')),
  coordinates JSONB NOT NULL DEFAULT '{
    "ra": 0,
    "dec": 0,
    "distance": 0,
    "redshift": 0
  }',
  physical_properties JSONB NOT NULL DEFAULT '{}',
  geometric_signature JSONB NOT NULL DEFAULT '{
    "vertices": [],
    "faces": [],
    "normals": [],
    "boundingBox": {"min": [0,0,0], "max": [1,1,1]},
    "centerOfMass": [0.5,0.5,0.5],
    "symmetryGroup": "C1",
    "fractalDimension": 2.0,
    "sacredRatios": {"phi": 1.618, "pi": 3.14159, "euler": 2.718, "fibonacci": [1,1,2,3,5,8]}
  }',
  audio_mapping JSONB NOT NULL DEFAULT '{
    "fundamentalFreq": 440,
    "harmonicSeries": [440, 880, 1320, 1760],
    "polarityProfile": {},
    "temporalEvolution": {"cosmicAge": 13.8, "evolutionRate": 0.01, "timeDialationFactor": 1.0, "quantumFluctuation": 0.1, "causalityMode": "forward"}
  }',
  discovery_metadata JSONB NOT NULL DEFAULT '{
    "source": "manual",
    "discoveryDate": "2024-01-01T00:00:00Z",
    "confidence": 0.8,
    "dataQuality": 0.7
  }',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create GAA Sessions Extended table for collective orchestration
CREATE TABLE public.gaa_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  preset_id UUID REFERENCES public.gaa_presets(id),
  facilitator_id UUID NOT NULL,
  participant_ids UUID[] DEFAULT '{}',
  
  -- Session State
  status TEXT NOT NULL DEFAULT 'preparing' CHECK (status IN ('preparing', 'active', 'paused', 'completed', 'emergency_stopped')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE NULL,
  
  -- Real-time State
  collective_state JSONB NOT NULL DEFAULT '{
    "sessionId": "",
    "participants": [],
    "phaseCoherence": 0.0,
    "collectiveResonance": 0.0,
    "synchronizationQuality": 0.0,
    "ceremonyType": "healing",
    "groupConsciousnessMetrics": {"coherence": 0.0, "entrainment": 0.0, "fieldStrength": 0.0, "polarityConsensus": 0.0}
  }',
  current_cosmic_data_id UUID REFERENCES public.cosmic_structures(id),
  emergency_protocols JSONB DEFAULT '[]',
  
  -- Analytics
  session_metrics JSONB DEFAULT '{
    "peakCoherence": 0.0,
    "averagePolarityBalance": 0.0,
    "shadowWorkIntensity": 0.0,
    "healingEventCount": 0,
    "manifestationMarkers": 0
  }',
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create Biofeedback Calibration table
CREATE TABLE public.biofeedback_calibrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baseline_hrv DECIMAL DEFAULT 0.0,
  baseline_brainwaves JSONB DEFAULT '{}',
  baseline_breathing JSONB DEFAULT '{}',
  polarity_preference DECIMAL DEFAULT 0.0, -- Natural tendency toward light/dark
  shadow_work_readiness DECIMAL DEFAULT 0.0 CHECK (shadow_work_readiness >= 0 AND shadow_work_readiness <= 1),
  calibration_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  device_configuration JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gaa_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cosmic_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gaa_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.biofeedback_calibrations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view public GAA presets" ON public.gaa_presets FOR SELECT USING (true);
CREATE POLICY "Users can manage their own GAA presets" ON public.gaa_presets FOR ALL USING (auth.uid() = created_by);

CREATE POLICY "Anyone can view cosmic structures" ON public.cosmic_structures FOR SELECT USING (true);
CREATE POLICY "Service role can manage cosmic structures" ON public.cosmic_structures FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Facilitators can manage their sessions" ON public.gaa_sessions FOR ALL USING (auth.uid() = facilitator_id);
CREATE POLICY "Participants can view their sessions" ON public.gaa_sessions FOR SELECT USING (auth.uid() = ANY(participant_ids) OR auth.uid() = facilitator_id);

CREATE POLICY "Users can manage their own biofeedback calibrations" ON public.biofeedback_calibrations FOR ALL USING (auth.uid() = user_id);

-- Create update triggers
CREATE TRIGGER update_gaa_presets_updated_at BEFORE UPDATE ON public.gaa_presets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_cosmic_structures_updated_at BEFORE UPDATE ON public.cosmic_structures FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_gaa_sessions_updated_at BEFORE UPDATE ON public.gaa_sessions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_biofeedback_calibrations_updated_at BEFORE UPDATE ON public.biofeedback_calibrations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Insert some sample cosmic structures for testing
INSERT INTO public.cosmic_structures (name, type, coordinates, physical_properties, discovery_metadata) VALUES
  ('Crab Nebula', 'nebula', '{"ra": 83.63, "dec": 22.01, "distance": 2000, "redshift": 0.0}', '{"mass": 4.6, "luminosity": 75000, "temperature": 11000}', '{"source": "hubble", "discoveryDate": "1731-01-01T00:00:00Z", "confidence": 0.95, "dataQuality": 0.9}'),
  ('Sagittarius A*', 'blackhole', '{"ra": 266.42, "dec": -29.01, "distance": 26000, "redshift": 0.0}', '{"mass": 4100000, "rotationPeriod": 0.00011}', '{"source": "ligo", "discoveryDate": "1974-01-01T00:00:00Z", "confidence": 0.99, "dataQuality": 0.95}'),
  ('PSR B1919+21', 'pulsar', '{"ra": 290.93, "dec": 21.90, "distance": 400, "redshift": 0.0}', '{"mass": 1.4, "rotationPeriod": 1.337, "magneticField": 100000000000}', '{"source": "manual", "discoveryDate": "1967-01-01T00:00:00Z", "confidence": 0.9, "dataQuality": 0.85}');