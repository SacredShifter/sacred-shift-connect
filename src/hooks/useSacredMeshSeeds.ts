import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { SacredMeshCrypto } from '@/lib/sacredMesh/crypto';

export interface SacredMeshSeed {
  id?: string;
  user_id: string;
  seed_name: string;
  identity_key_public: Uint8Array;
  identity_key_private_encrypted: Uint8Array;
  transport_capabilities: {
    websocket: boolean;
    light: boolean;
    frequency: boolean;
    nature: boolean;
    file: boolean;
    satellite: boolean;
    quantum: boolean;
  };
  consent_scope: {
    data_sharing: boolean;
    light_communication: boolean;
    frequency_communication: boolean;
    nature_harmony: boolean;
    quantum_entanglement: boolean;
  };
  genealogy: {
    parent_seed_id?: string;
    generation: number;
    created_by_adapter?: string;
    ancestral_line: string[];
  };
  frequency_signature?: {
    primary_hz: number;
    harmonics: number[];
    whale_song_pattern?: number[];
    elephant_rumble_pattern?: number[];
  };
  light_signature?: {
    primary_wavelength: number;
    color_sequence: string[];
    blink_pattern: number[];
    screen_modulation: any;
  };
  nature_signature?: {
    bird_chirp_pattern?: number[];
    wind_pattern?: number[];
    water_flow_pattern?: number[];
    earth_rhythm?: number[];
  };
  quantum_signature?: {
    entanglement_key?: string;
    coherence_frequency?: number;
    quantum_state?: any;
  };
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SacredMeshHandshake {
  id?: string;
  initiator_seed_id: string;
  responder_seed_id?: string;
  handshake_type: 'websocket' | 'light' | 'frequency' | 'nature' | 'file' | 'satellite' | 'quantum';
  status: 'initiated' | 'challenged' | 'verified' | 'established' | 'failed' | 'expired';
  challenge_data?: any;
  response_data?: any;
  session_key_encrypted?: Uint8Array;
  adapter_config?: any;
  consent_verified: boolean;
  privacy_audit_log: any[];
  created_at?: string;
  expires_at?: string;
  completed_at?: string;
}

export const useSacredMeshSeeds = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['sacredMeshSeeds', user?.id],
    queryFn: async (): Promise<SacredMeshSeed[]> => {
      if (!user) return [];
      
      // Use localStorage until database types are regenerated
      const stored = localStorage.getItem(`sacred_mesh_seeds_${user.id}`);
      return stored ? JSON.parse(stored) : [];
      } catch (error) {
        console.error('Error fetching Sacred Mesh seeds:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
};

export const useCreateSacredMeshSeed = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const crypto = SacredMeshCrypto.getInstance();
  
  return useMutation({
    mutationFn: async (seedData: {
      seed_name: string;
      transport_capabilities: SacredMeshSeed['transport_capabilities'];
      consent_scope: SacredMeshSeed['consent_scope'];
      parent_seed_id?: string;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Generate cryptographic identity
      const identityKeyPair = await crypto.generateIdentityKeyPair();
      const publicKeyBytes = new Uint8Array(await window.crypto.subtle.exportKey('raw', identityKeyPair.publicKey));
      
      // Encrypt private key (in real implementation, use user's master key)
      const privateKeyBytes = new Uint8Array(await window.crypto.subtle.exportKey('pkcs8', identityKeyPair.privateKey));
      const encryptedPrivateKey = await crypto.encrypt(privateKeyBytes, identityKeyPair.publicKey, crypto.generateNonce());
      
      // Generate signatures based on enabled adapters
      const frequencySignature = seedData.transport_capabilities.frequency ? {
        primary_hz: 528, // Love frequency
        harmonics: [396, 417, 528, 639, 741, 852, 963], // Solfeggio frequencies
        whale_song_pattern: [20, 40, 60, 20], // Hz pattern inspired by humpback whales
        elephant_rumble_pattern: [5, 10, 15, 20] // Infrasonic communication
      } : undefined;
      
      const lightSignature = seedData.transport_capabilities.light ? {
        primary_wavelength: 528, // Green light of love
        color_sequence: ['#FFD700', '#00CED1', '#FF69B4', '#32CD32'], // Sacred colors
        blink_pattern: [100, 200, 100, 500], // Sacred rhythm in ms
        screen_modulation: {
          brightness_pattern: [0.1, 0.3, 0.7, 1.0, 0.7, 0.3, 0.1],
          color_temperature_shift: [3000, 4000, 5000, 6500, 5000, 4000, 3000]
        }
      } : undefined;
      
      const natureSignature = seedData.transport_capabilities.nature ? {
        bird_chirp_pattern: [2000, 3000, 2500, 1800, 2200], // Hz frequencies
        wind_pattern: [0.1, 0.5, 1.0, 0.8, 0.3], // Intensity pattern
        water_flow_pattern: [200, 400, 600, 400, 200], // Flow rhythm
        earth_rhythm: [7.83, 14.3, 20.8, 27.3] // Schumann resonances
      } : undefined;
      
      // Determine genealogy
      const genealogy: SacredMeshSeed['genealogy'] = {
        generation: seedData.parent_seed_id ? 1 : 0, // Will be calculated properly from parent
        ancestral_line: seedData.parent_seed_id ? [seedData.parent_seed_id] : [],
        parent_seed_id: seedData.parent_seed_id,
        created_by_adapter: 'manual'
      };
      
      const newSeed: Omit<SacredMeshSeed, 'id' | 'created_at' | 'updated_at'> = {
        user_id: user.id,
        seed_name: seedData.seed_name,
        identity_key_public: publicKeyBytes,
        identity_key_private_encrypted: encryptedPrivateKey.ciphertext,
        transport_capabilities: seedData.transport_capabilities,
        consent_scope: seedData.consent_scope,
        genealogy,
        frequency_signature: frequencySignature,
        light_signature: lightSignature,
        nature_signature: natureSignature,
        is_active: true
      };
      
      const { data, error } = await supabase
        .from('sacred_mesh_seeds')
        .insert(newSeed)
        .select()
        .single();
        
      if (error) throw error;
      
      // Log compliance event
      await supabase.rpc('log_compliance_event', {
        p_user_id: user.id,
        p_actor_id: user.id,
        p_action_type: 'sacred_mesh_seed_created',
        p_entity_type: 'sacred_mesh_seed',
        p_entity_id: data.id,
        p_after_state: {
          seed_name: seedData.seed_name,
          transport_capabilities: seedData.transport_capabilities,
          consent_scope: seedData.consent_scope
        },
        p_legal_basis: 'User consent for Sacred Mesh communication'
      });
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sacredMeshSeeds'] });
      toast({
        title: "Sacred Mesh Seed created",
        description: "Your new Sacred Mesh identity has been generated with cryptographic security and nature-inspired signatures.",
      });
    },
  });
};

export const useSacredMeshHandshakes = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['sacredMeshHandshakes', user?.id],
    queryFn: async (): Promise<SacredMeshHandshake[]> => {
      if (!user) return [];
      
      try {
        const { data, error } = await supabase
          .from('sacred_mesh_handshakes')
          .select(`
            *,
            initiator_seed:sacred_mesh_seeds!initiator_seed_id(seed_name),
            responder_seed:sacred_mesh_seeds!responder_seed_id(seed_name)
          `)
          .or(`
            initiator_seed_id.in.(
              select id from sacred_mesh_seeds where user_id = '${user.id}'
            ),
            responder_seed_id.in.(
              select id from sacred_mesh_seeds where user_id = '${user.id}'
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error('Error fetching Sacred Mesh handshakes:', error);
        return [];
      }
    },
    enabled: !!user?.id,
  });
};

export const useInitiateSacredMeshHandshake = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (handshakeData: {
      initiator_seed_id: string;
      handshake_type: SacredMeshHandshake['handshake_type'];
      target_identifier?: string; // Could be QR code, light pattern, frequency, etc.
      adapter_config?: any;
    }) => {
      if (!user) throw new Error('User not authenticated');
      
      // Generate challenge based on handshake type
      const challenge_data = await generateHandshakeChallenge(handshakeData.handshake_type);
      
      // Set expiration (1 hour for most, 24 hours for satellite)
      const expires_at = new Date();
      expires_at.setHours(expires_at.getHours() + (handshakeData.handshake_type === 'satellite' ? 24 : 1));
      
      const newHandshake: Omit<SacredMeshHandshake, 'id' | 'created_at' | 'completed_at'> = {
        initiator_seed_id: handshakeData.initiator_seed_id,
        handshake_type: handshakeData.handshake_type,
        status: 'initiated',
        challenge_data,
        adapter_config: handshakeData.adapter_config,
        consent_verified: true, // Already verified through seed creation
        privacy_audit_log: [{
          timestamp: new Date().toISOString(),
          action: 'handshake_initiated',
          adapter_type: handshakeData.handshake_type,
          privacy_impact: 'communication_attempt',
          legal_basis: 'User consent for Sacred Mesh communication'
        }],
        expires_at: expires_at.toISOString()
      };
      
      const { data, error } = await supabase
        .from('sacred_mesh_handshakes')
        .insert(newHandshake)
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['sacredMeshHandshakes'] });
      toast({
        title: "Sacred Handshake initiated",
        description: `${data.handshake_type} handshake has been initiated. The connection will expire in ${data.handshake_type === 'satellite' ? '24 hours' : '1 hour'}.`,
      });
    },
  });
};

// Helper function to generate handshake challenges
async function generateHandshakeChallenge(handshakeType: SacredMeshHandshake['handshake_type']) {
  const crypto = SacredMeshCrypto.getInstance();
  
  switch (handshakeType) {
    case 'light':
      return {
        light_sequence: generateLightSequence(),
        wavelength_pattern: [620, 530, 470, 620], // Red, Green, Blue, Red
        duration_ms: 5000,
        verification_pattern: crypto.generateNonce(16)
      };
      
    case 'frequency':
      return {
        frequency_sequence: [528, 639, 741, 852], // Solfeggio frequencies
        duration_ms: 8000,
        amplitude_pattern: [0.5, 0.7, 0.3, 0.9],
        verification_tone: 432 // Hz
      };
      
    case 'nature':
      return {
        bird_call_pattern: [2000, 1500, 2500, 1800], // Hz
        rhythm_pattern: [200, 300, 150, 400], // ms intervals
        nature_type: 'forest_harmony',
        verification_chirp: generateBirdChirpPattern()
      };
      
    case 'file':
      return {
        qr_code_data: await generateQRCodeChallenge(),
        file_format: 'sacred_mesh_v2',
        encryption_hint: crypto.generateNonce(8)
      };
      
    case 'satellite':
      return {
        orbital_period_hint: 90, // minutes
        frequency_band: 'L1',
        signal_pattern: generateSatellitePattern(),
        verification_sequence: crypto.generateNonce(32)
      };
      
    case 'quantum':
      return {
        entanglement_key: crypto.generateNonce(32),
        coherence_frequency: 40, // Hz (gamma waves)
        quantum_state: 'superposition',
        measurement_basis: 'computational'
      };
      
    default: // websocket
      return {
        challenge_string: crypto.generateNonce(32),
        timestamp: Date.now(),
        protocol_version: '2.0'
      };
  }
}

function generateLightSequence() {
  return [
    { color: '#FFD700', duration: 500 }, // Gold
    { color: '#00CED1', duration: 300 }, // Turquoise
    { color: '#FF69B4', duration: 400 }, // Pink
    { color: '#32CD32', duration: 600 }, // Green
    { color: '#FFD700', duration: 200 }  // Gold
  ];
}

function generateBirdChirpPattern() {
  return [
    { frequency: 2000, duration: 100 },
    { frequency: 2500, duration: 150 },
    { frequency: 1800, duration: 120 },
    { frequency: 2200, duration: 180 }
  ];
}

async function generateQRCodeChallenge() {
  const crypto = SacredMeshCrypto.getInstance();
  return {
    challenge_id: crypto.generateNonce(16),
    sacred_geometry: 'flower_of_life',
    timestamp: Date.now()
  };
}

function generateSatellitePattern() {
  return [
    { frequency: 1575.42, duration: 1000 }, // GPS L1
    { frequency: 1227.60, duration: 800 },  // GPS L2
    { frequency: 1176.45, duration: 600 }   // GPS L5
  ];
}