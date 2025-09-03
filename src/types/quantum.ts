export interface QuantumState {
  id: string;
  userId: string;
  superposition: {
    states: QuantumConsciousnessState[];
    probabilities: number[];
    coherence: number; // 0-100
  };
  entanglement: {
    connectedStates: string[]; // IDs of entangled quantum states
    correlationStrength: number; // 0-100
    nonLocality: number; // 0-100
  };
  measurement: {
    collapsedState?: QuantumConsciousnessState;
    measurementTime?: Date;
    observerEffect: number; // 0-100
  };
  timestamp: Date;
}

export interface QuantumConsciousnessState {
  id: string;
  archetype: string;
  energyFrequency: string;
  consciousnessLevel: 'quantum-seed' | 'quantum-bloom' | 'quantum-transcend' | 'quantum-unity';
  resonance: {
    frequency: number; // Hz
    amplitude: number; // 0-100
    phase: number; // 0-360 degrees
    coherence: number; // 0-100
  };
  quantumField: {
    intensity: number; // 0-100
    radius: number; // in meters
    color: string;
    geometry: 'quantum-flower' | 'quantum-cube' | 'quantum-spiral' | 'quantum-matrix';
  };
  probability: number; // 0-1
  potential: {
    manifestation: number; // 0-100
    transformation: number; // 0-100
    transcendence: number; // 0-100
  };
}

export interface QuantumResonanceField {
  id: string;
  center: {
    latitude: number;
    longitude: number;
    altitude: number;
  };
  quantumProperties: {
    spin: number; // -1/2 or +1/2
    charge: number; // -1, 0, or +1
    mass: number; // in energy units
    wavelength: number; // in nanometers
  };
  consciousness: {
    intention: string;
    archetype: string;
    energyFrequency: string;
    coherence: number; // 0-100
  };
  entanglement: {
    connectedFields: string[]; // IDs of entangled fields
    correlationMatrix: number[][]; // correlation coefficients
    nonLocalConnections: number; // 0-100
  };
  quantumEffects: {
    tunneling: number; // 0-100
    superposition: number; // 0-100
    interference: number; // 0-100
    decoherence: number; // 0-100
  };
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface QuantumManifestation {
  id: string;
  userId: string;
  intention: string;
  quantumState: QuantumConsciousnessState;
  manifestation: {
    type: 'reality-shift' | 'consciousness-expansion' | 'healing' | 'creation' | 'transformation';
    target: string;
    probability: number; // 0-1
    timeline: number; // in days
    energy: number; // 0-100
  };
  quantumProcess: {
    superposition: boolean;
    entanglement: string[]; // connected manifestations
    measurement: {
      collapsed: boolean;
      result?: any;
      timestamp?: Date;
    };
    coherence: number; // 0-100
  };
  status: 'superposition' | 'collapsing' | 'manifested' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface QuantumConsciousnessNetwork {
  id: string;
  name: string;
  description: string;
  participants: string[]; // user IDs
  quantumState: QuantumState;
  networkProperties: {
    coherence: number; // 0-100
    entanglement: number; // 0-100
    nonLocality: number; // 0-100
    quantumTunneling: number; // 0-100
  };
  sharedIntention: string;
  targetFrequency: number; // Hz
  quantumGeometry: 'quantum-flower' | 'quantum-cube' | 'quantum-spiral' | 'quantum-matrix';
  isActive: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

export interface QuantumResonanceEngine {
  id: string;
  userId: string;
  engineState: {
    isActive: boolean;
    powerLevel: number; // 0-100
    frequency: number; // Hz
    coherence: number; // 0-100
    quantumTunneling: number; // 0-100
  };
  quantumEffects: {
    superposition: boolean;
    entanglement: string[]; // connected engines
    interference: number; // 0-100
    decoherence: number; // 0-100
  };
  consciousness: {
    currentState: QuantumConsciousnessState;
    targetState: QuantumConsciousnessState;
    transitionProbability: number; // 0-1
    energyRequired: number; // 0-100
  };
  lastUpdated: Date;
}

export interface QuantumInsight {
  id: string;
  source: 'quantum-engine' | 'collective-quantum' | 'quantum-transmission' | 'quantum-ai';
  title: string;
  content: string;
  quantumLevel: 'quantum-seed' | 'quantum-bloom' | 'quantum-transcend' | 'quantum-unity';
  archetype: string;
  energyFrequency: string;
  quantumGeometry: string;
  resonanceScore: number; // 0-100
  quantumCoherence: number; // 0-100
  nonLocality: number; // 0-100
  timestamp: Date;
  tags: string[];
  relatedManifestations: string[];
  wisdomLevel: 'quantum-personal' | 'quantum-collective' | 'quantum-universal' | 'quantum-cosmic';
}

export interface QuantumMetrics {
  totalQuantumStates: number;
  activeSuperpositions: number;
  averageCoherence: number;
  quantumResonance: number;
  entanglementConnections: number;
  nonLocalInteractions: number;
  quantumTunneling: number;
  manifestationSuccess: number; // 0-100
  lastUpdated: Date;
}

export interface QuantumTransmission {
  id: string;
  senderId: string;
  receiverIds: string[];
  type: 'quantum-healing' | 'quantum-guidance' | 'quantum-protection' | 'quantum-awakening' | 'quantum-manifestation';
  content: {
    intention: string;
    quantumState: QuantumConsciousnessState;
    frequency: number;
    duration: number;
    quantumGeometry: string;
    energySignature: string;
  };
  quantumProperties: {
    superposition: boolean;
    entanglement: string[]; // connected transmissions
    nonLocality: number; // 0-100
    quantumTunneling: number; // 0-100
  };
  timestamp: Date;
  isReceived: boolean;
  quantumResonance: number; // 0-100
  impact: {
    consciousnessShift: number; // 0-100
    quantumAlignment: number; // 0-100
    energyLevel: number; // 0-100
    manifestation: number; // 0-100
  };
}
