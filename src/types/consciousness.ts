/**
 * Sacred Shifter Consciousness Types
 * Defines the fundamental structures for consciousness evolution tracking
 */

export interface ConsciousnessState {
  // Core consciousness metrics
  brainwaveFrequency: number; // Hz (Delta: 0.5-4, Theta: 4-8, Alpha: 8-13, Beta: 13-30, Gamma: 30-100)
  emotionalResonance: number; // 0-100 (emotional coherence)
  spiritualAlignment: number; // 0-100 (connection to higher self)
  mentalClarity: number; // 0-100 (cognitive clarity)
  physicalVitality: number; // 0-100 (body energy)
  
  // Sacred timing
  lunarPhase: 'new' | 'waxing' | 'full' | 'waning';
  solarPosition: 'dawn' | 'morning' | 'afternoon' | 'dusk' | 'night';
  season: 'spring' | 'summer' | 'autumn' | 'winter';
  
  // Consciousness evolution
  awakeningLevel: 'seed' | 'sprout' | 'bloom' | 'transcend' | 'unified';
  archetype: 'warrior' | 'healer' | 'sage' | 'creator' | 'mystic' | 'guardian';
  energyFrequency: '432Hz' | '528Hz' | '852Hz' | '963Hz' | 'custom';
  
  // Sacred geometry resonance
  sacredGeometry: {
    primary: 'flower-of-life' | 'metatron-cube' | 'seed-of-life' | 'tree-of-life' | 'merkaba';
    secondary: string[];
    resonance: number; // 0-100
  };
  
  // Chakra alignment
  chakras: {
    root: number; // 0-100
    sacral: number;
    solar: number;
    heart: number;
    throat: number;
    thirdEye: number;
    crown: number;
  };
  
  // Timestamp and metadata
  timestamp: Date;
  sessionId: string;
  userId: string;
}

export interface ConsciousnessEvolution {
  currentLevel: string;
  progress: number; // 0-100
  milestones: ConsciousnessMilestone[];
  nextLevel: string;
  evolutionPath: string[];
}

export interface ConsciousnessMilestone {
  id: string;
  name: string;
  description: string;
  achievedAt: Date;
  consciousnessLevel: number;
  sacredGeometry: string;
  archetype: string;
}

export interface ResonanceField {
  center: Vector3D;
  radius: number;
  intensity: number;
  frequency: number;
  consciousnessLevel: number;
  sacredGeometry: string;
  participants: string[]; // User IDs
}

export interface Vector3D {
  x: number;
  y: number;
  z: number;
}

export interface SacredPattern {
  type: 'flower-of-life' | 'metatron-cube' | 'seed-of-life' | 'tree-of-life' | 'merkaba' | 'spiral' | 'mandala';
  vertices: Vector3D[];
  connections: [number, number][];
  resonance: number;
  consciousnessLevel: number;
  isActive: boolean;
}

export interface ConsciousnessNode {
  userId: string;
  consciousnessLevel: number;
  resonanceField: ResonanceField;
  sacredGeometry: SacredPattern;
  isActive: boolean;
  lastSeen: Date;
  archetype: string;
  energyFrequency: string;
}

export interface CollectiveConsciousness {
  totalParticipants: number;
  averageConsciousnessLevel: number;
  collectiveResonance: number;
  dominantArchetype: string;
  sacredGeometry: SacredPattern;
  energyField: ResonanceField;
  nodes: ConsciousnessNode[];
}

export interface ConsciousnessRecommendation {
  id: string;
  type: 'meditation' | 'content' | 'practice' | 'connection' | 'wisdom';
  title: string;
  description: string;
  consciousnessLevel: string;
  archetype: string;
  energyFrequency: string;
  sacredGeometry: string;
  resonanceScore: number; // 0-100
  estimatedImpact: number; // 0-100
  duration: number; // minutes
  prerequisites: string[];
  benefits: string[];
  timestamp: Date;
}

export interface SacredWisdom {
  id: string;
  source: 'ancient' | 'modern' | 'channeled' | 'scientific';
  tradition: 'taoist' | 'buddhist' | 'vedic' | 'hermetic' | 'gnostic' | 'quantum' | 'unified';
  wisdom: string;
  consciousnessLevel: string;
  archetype: string;
  sacredGeometry: string;
  resonanceScore: number;
  timestamp: Date;
}

export interface ConsciousnessSession {
  id: string;
  userId: string;
  type: 'meditation' | 'breathing' | 'sacred-geometry' | 'archetype-work' | 'collective';
  startTime: Date;
  endTime?: Date;
  consciousnessState: ConsciousnessState;
  evolution: ConsciousnessEvolution;
  sacredGeometry: SacredPattern;
  archetype: string;
  energyFrequency: string;
  resonanceScore: number;
  insights: string[];
  milestones: ConsciousnessMilestone[];
}

export interface BiofeedbackData {
  heartRate: number;
  heartRateVariability: number;
  brainwaveFrequencies: {
    delta: number;
    theta: number;
    alpha: number;
    beta: number;
    gamma: number;
  };
  skinConductance: number;
  temperature: number;
  timestamp: Date;
}

export interface ConsciousnessMetrics {
  daily: {
    averageConsciousnessLevel: number;
    totalPracticeTime: number;
    resonanceScore: number;
    archetypeAlignment: number;
  };
  weekly: {
    consciousnessEvolution: number;
    sacredGeometryProgress: number;
    archetypeDevelopment: number;
    collectiveParticipation: number;
  };
  monthly: {
    awakeningLevel: string;
    consciousnessMilestones: number;
    sacredWisdomAcquired: number;
    collectiveImpact: number;
  };
}
