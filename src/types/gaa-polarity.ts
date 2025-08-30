/**
 * Polarity-Integrated GAA Type System
 * Complete TypeScript interfaces for Shadow Engine and Cosmic Integration
 */

export interface PolarityProtocol {
  lightChannel: ChannelConfiguration;
  darkChannel: ChannelConfiguration;
  polarityBalance: number; // -1 (full dark) to +1 (full light)
  manifestInDark: boolean;
  crossPolarizationEnabled: boolean;
  darkEnergyDrift: DarkEnergyConfiguration;
}

export interface ChannelConfiguration {
  enabled: boolean;
  amplitude: number;
  phase: number;
  subharmonicDepth: number;
  texturalComplexity: number;
  resonanceMode: 'constructive' | 'destructive' | 'phase_cancel';
}

export interface DarkEnergyConfiguration {
  driftRate: number; // Hz/sec
  expansionFactor: number; // Cosmological expansion simulation
  voidResonance: boolean;
  quantumFluctuation: number;
  darkMatterDensity: number;
}

export interface ShadowEngineState {
  isActive: boolean;
  currentPhase: 'light' | 'dark' | 'transition' | 'void';
  polarityBalance: number;
  shadowIntensity: number;
  lightDominance: number;
  darkDominance: number;
  manifestationMode: 'light' | 'dark' | 'balanced';
  breathCoherence: number;
  heartVariability: number;
  neuralEntrainment: number;
}

export interface BiofeedbackMetrics {
  heartRateVariability: {
    rmssd: number;
    pnn50: number;
    coherenceRatio: number;
    timestamp: number;
  };
  brainwaveActivity: {
    alpha: number;
    beta: number;
    theta: number;
    delta: number;
    gamma: number;
    coherence: number;
    timestamp: number;
  };
  breathingPattern: {
    rate: number;
    depth: number;
    coherence: number;
    phase: 'inhale' | 'exhale' | 'hold' | 'pause';
    timestamp: number;
  };
  autonomicBalance: {
    sympathetic: number;
    parasympathetic: number;
    balance: number;
    timestamp: number;
  };
}

export interface CosmicStructureData {
  id: string;
  name: string;
  type: 'galaxy' | 'nebula' | 'pulsar' | 'blackhole' | 'gravitational_wave' | 'dark_matter' | 'jwst_discovery';
  coordinates: {
    ra: number; // Right ascension
    dec: number; // Declination
    distance: number; // Parsecs
    redshift?: number;
  };
  physicalProperties: {
    mass?: number;
    luminosity?: number;
    temperature?: number;
    magneticField?: number;
    rotationPeriod?: number;
  };
  geometricSignature: NormalizedGeometry;
  audioMapping: {
    fundamentalFreq: number;
    harmonicSeries: number[];
    polarityProfile: PolarityProtocol;
    temporalEvolution: TemporalParameters;
  };
  discoveryMetadata: {
    source: 'jwst' | 'hubble' | 'ligo' | 'ai_discovery' | 'manual';
    discoveryDate: Date;
    confidence: number;
    dataQuality: number;
  };
}

export interface TemporalParameters {
  cosmicAge: number; // Billion years
  evolutionRate: number; // Change per cosmic year
  timeDialationFactor: number;
  quantumFluctuation: number;
  causalityMode: 'forward' | 'backward' | 'quantum_superposition';
}

export interface NormalizedGeometry {
  vertices: Float32Array;
  faces: Uint32Array;
  normals: Float32Array;
  boundingBox: {
    min: [number, number, number];
    max: [number, number, number];
  };
  centerOfMass: [number, number, number];
  symmetryGroup: string;
  fractalDimension: number;
  sacredRatios: {
    phi: number;
    pi: number;
    euler: number;
    fibonacci: number[];
  };
}

export interface CollectiveOrchestration {
  sessionId: string;
  participants: ParticipantState[];
  phaseCoherence: number;
  collectiveResonance: number;
  synchronizationQuality: number;
  leaderUserId?: string;
  ceremonyType: 'healing' | 'manifestation' | 'shadow_work' | 'cosmic_attunement';
  groupConsciousnessMetrics: {
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
  biofeedback: BiofeedbackMetrics;
  shadowEngineState: ShadowEngineState;
  lastActive: Date;
  role: 'participant' | 'facilitator' | 'witness';
  consentLevel: 'observer' | 'participant' | 'full_integration';
}

export interface SafetyConfiguration {
  infrasonicLimit: number; // Hz - below which is blocked
  ultrasonicLimit: number; // Hz - above which is blocked  
  maxAmplitude: number; // Prevents hearing damage
  fatigueDetection: boolean;
  shadowModeRequiresConsent: boolean;
  emergencyStopEnabled: boolean;
  biofeedbackLimits: {
    maxHeartRate: number;
    minHeartRateVariability: number;
    maxStressIndicators: number;
  };
  temporalSafetyLimits: {
    maxSessionDuration: number; // Minutes
    cooldownPeriod: number; // Minutes between shadow sessions
    maxDarkDominance: number; // 0-1, prevents full shadow takeover
  };
}

export interface GAAPresetExtended {
  id: string;
  name: string;
  description: string;
  geometryType: string;
  parameters: any; // Original GAA parameters
  
  // Polarity Extensions
  polarityProtocol: PolarityProtocol;
  cosmicStructure?: CosmicStructureData;
  biofeedbackIntegration: boolean;
  shadowModeEnabled: boolean;
  collectiveCompatible: boolean;
  safetyProfile: SafetyConfiguration;
  
  // Metadata
  createdBy: string;
  createdAt: Date;
  tags: string[];
  evidenceProvenance: string[];
  scientificBasis: string;
}

export interface GAASessionExtended {
  id: string;
  presetId: string;
  facilitatorId: string;
  participantIds: string[];
  
  // Session State
  status: 'preparing' | 'active' | 'paused' | 'completed' | 'emergency_stopped';
  startTime: Date;
  endTime?: Date;
  
  // Real-time State
  collectiveState: CollectiveOrchestration;
  currentCosmicData?: CosmicStructureData;
  emergencyProtocols: EmergencyProtocol[];
  
  // Analytics
  sessionMetrics: {
    peakCoherence: number;
    averagePolarityBalance: number;
    shadowWorkIntensity: number;
    healingEventCount: number;
    manifestationMarkers: number;
  };
}

export interface EmergencyProtocol {
  id: string;
  type: 'biofeedback_alarm' | 'shadow_overflow' | 'temporal_displacement' | 'collective_disruption';
  severity: 'warning' | 'critical' | 'emergency';
  autoResponse: 'alert' | 'reduce_intensity' | 'emergency_stop';
  description: string;
  triggerConditions: any;
  responseActions: string[];
}

// Event Types for Real-time Updates
export interface GAARealtimeEvent {
  type: 'polarity_shift' | 'shadow_emergence' | 'cosmic_alignment' | 'collective_resonance' | 'emergency';
  sessionId: string;
  userId?: string;
  timestamp: Date;
  data: any;
}

// API Response Types
export interface CosmicDataResponse {
  structures: CosmicStructureData[];
  lastUpdated: Date;
  dataSource: string;
  confidence: number;
}

export interface BiofeedbackCalibration {
  userId: string;
  baselineHRV: number;
  baselineBrainwaves: any;
  baselineBreathing: any;
  polarityPreference: number; // Natural tendency toward light/dark
  shadowWorkReadiness: number; // 0-1 scale
  calibrationDate: Date;
  deviceConfiguration: any;
}