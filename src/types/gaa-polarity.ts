// Core Polarity Protocol Configuration
export interface PolarityProtocol {
  lightChannel: ChannelConfiguration;
  darkChannel: ChannelConfiguration;
  polarityBalance: number; // -1 (full dark) to 1 (full light)
  darkEnergyDrift: DarkEnergyConfiguration;
  timestamp: number;
}

// Channel configurations for light/dark polarity
export interface ChannelConfiguration {
  enabled: boolean;
  amplitude: number;
  phase: number;
  resonanceMode: 'harmonic' | 'chaotic' | 'adaptive';
}

// Dark energy dynamics configuration
export interface DarkEnergyConfiguration {
  driftRate: number;
  expansionFactor: number;
}

// Shadow Engine operational state
export interface ShadowEngineState {
  isActive: boolean;
  currentPhase: 'activation' | 'integration' | 'manifestation' | 'dissolution';
  polarityBalance: number;
  shadowIntensity: number;
  lightDominance: number;
  darkDominance: number;
  breathCoherence: number;
  heartVariability: number;
  neuralEntrainment: number;
}

// Comprehensive biofeedback metrics
export interface BiofeedbackMetrics {
  heartRateVariability: number;
  brainwaveActivity: {
    alpha: number;  // 8-13 Hz
    beta: number;   // 13-30 Hz
    theta: number;  // 4-8 Hz
    delta: number;  // 0.5-4 Hz
    gamma: number;  // 30-100 Hz
  };
  breathingPattern: {
    rate: number;      // breaths per minute
    depth: number;     // 0-1 normalized
    coherence: number; // HRV-breath sync
  };
  autonomicBalance: {
    sympathetic: number;   // 0-1 activation
    parasympathetic: number; // 0-1 activation
  };
}

// Cosmic structure data from real astronomical sources
export interface CosmicStructureData {
  id: string;
  name: string;
  type: 'galaxy' | 'nebula' | 'star_cluster' | 'quasar' | 'black_hole' | 'pulsar';
  coordinates: {
    rightAscension: number;
    declination: number;
    distance?: number; // light years
  };
  physicalProperties: {
    mass?: number;
    diameter?: number;
    temperature?: number;
    luminosity?: number;
    redshift?: number;
  };
  geometricSignature: NormalizedGeometry;
  audioMapping: {
    baseFrequency: number;
    harmonicSeries: number[];
    amplitude: number;
    duration: number; // seconds
  };
  discoveryMetadata: {
    discoveryDate?: string;
    observatory?: string;
    catalogId?: string;
    confidence: 'confirmed' | 'probable' | 'theoretical';
  };
}

// Normalized geometric data from cosmic structures
export interface NormalizedGeometry {
  vertices: number[][]; // 3D coordinates normalized to [-1, 1]
  faces?: number[][]; // vertex indices for faces
  normals?: number[][]; // surface normals
  boundingBox: {
    min: number[];
    max: number[];
  };
  sacredRatios: {
    phi: number; // golden ratio presence
    pi: number;  // circular geometry
    sqrt2: number; // square root of 2
  };
}

// Collective orchestration state
export interface CollectiveOrchestration {
  sessionId?: string;
  participants: ParticipantState[];
  phaseCoherence: number;
  collectiveResonance?: number;
  synchronizationQuality?: number;
  leaderUserId?: string;
  ceremonyType: 'healing' | 'manifestation' | 'shadow_work' | 'cosmic_attunement' | 'harmonic_convergence';
  groupConsciousnessMetrics?: {
    coherence: number;
    entrainment: number;
    fieldStrength: number;
    polarityConsensus: number;
  };
}

export interface ParticipantState {
  userId: string;
  displayName: string;
  polarityBalance: number;
  biofeedback: BiofeedbackMetrics | null;
  shadowEngineState: ShadowEngineState | null;
  lastActive: Date;
  lastActivity: Date;
  role: 'participant' | 'facilitator' | 'witness';
  consentLevel: 'observer' | 'participant' | 'full_integration';
}

// Extended collective state type
export interface CollectiveGAAState {
  sessionId: string;
  isLeader: boolean;
  isConnected: boolean;
  orchestration: CollectiveOrchestration;
  participants: ParticipantState[];
  currentSession: GAASessionExtended | null;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'error';
}

// Safety configuration and monitoring
export interface SafetyConfiguration {
  maxFrequency: number; // Hz
  maxAmplitude: number; // normalized 0-1
  biofeedbackThresholds: {
    heartRateMax: number;
    heartRateMin: number;
    stressThreshold: number;
  };
  temporalLimits: {
    maxSessionDuration: number; // minutes
    cooldownPeriod: number; // minutes
  };
}

// Extended GAA preset with polarity integration
export interface GAAPresetExtended {
  id: string;
  name: string;
  description: string;
  cosmicStructure: CosmicStructureData;
  geometryParams: {
    complexity: number;
    symmetry: 'radial' | 'bilateral' | 'spiral' | 'fractal';
    scale: number;
  };
  polarityExtensions: {
    defaultBalance: number;
    darkChannelWeight: number;
    lightChannelWeight: number;
    manifestInDark: boolean;
  };
  biofeedbackIntegration: {
    hrv_sensitivity: number;
    brainwave_mapping: Record<string, number>;
    breath_coupling: number;
  };
  shadowMode: {
    enabled: boolean;
    activationThreshold: number;
    integrationDepth: number;
  };
  collectiveCompatible: boolean;
  safetyProfile: SafetyConfiguration;
  audioConfig: {
    baseFrequency: number;
    harmonics: number[];
    waveform: 'sine' | 'triangle' | 'sawtooth' | 'square';
    spatialMapping: '2d' | '3d' | 'spherical';
  };
}

// Extended session data with analytics
export interface GAASessionExtended {
  id: string;
  presetId: string;
  facilitatorId: string;
  participantIds: string[];
  status: 'active' | 'paused' | 'completed' | 'emergency_stopped';
  collectiveState: CollectiveOrchestration;
  sessionAnalytics: {
    startTime: Date;
    endTime?: Date;
    totalParticipants: number;
    averageCoherence: number;
    peakCoherence: number;
    emergencyStops?: number;
    biofeedbackSummary?: BiofeedbackMetrics;
  };
}

// Emergency response protocols
export interface EmergencyProtocol {
  triggerType: 'biofeedback_critical' | 'coherence_drop' | 'participant_distress' | 'system_error';
  severity: 'low' | 'medium' | 'high' | 'critical';
  responseActions: ('pause' | 'stop' | 'alert_facilitator' | 'medical_alert')[];
}

// Tarot tradition types
export type TarotTradition = 'marseille' | 'rws' | 'thoth' | 'etteilla';

// GAA Engine State
export interface GAAEngineState {
  isInitialized: boolean;
  isPlaying: boolean;
  currentPhase: 'idle' | 'activation' | 'processing' | 'integration';
  oscillatorCount: number;
  currentGeometry?: {
    complexity: number;
    vertices: number;
    faces: number;
  };
  biofeedbackIntegration: boolean;
  lastUpdate: number;
}

// Real-time event structure
export interface GAARealtimeEvent {
  type: 'participant_update' | 'polarity_sync' | 'emergency' | 'session_state';
  payload: any;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

// API response types
export interface CosmicDataResponse {
  structures: CosmicStructureData[];
  metadata: {
    totalCount: number;
    lastUpdated: string;
    source: string;
  };
}

export interface BiofeedbackCalibration {
  userId: string;
  deviceType: string;
  baselineMetrics: BiofeedbackMetrics;
  calibrationDate: Date;
  personalThresholds: {
    relaxation: number;
    focus: number;
    stress: number;
  };
}