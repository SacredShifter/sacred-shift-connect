export interface CollectiveMember {
  id: string;
  username: string;
  avatar?: string;
  consciousnessState: {
    brainwaveFrequency: number;
    emotionalResonance: number;
    spiritualAlignment: number;
    currentArchetype: string;
    energyFrequency: string;
    meditationDepth: number;
    focusLevel: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    timezone: string;
  };
  isOnline: boolean;
  lastSeen: Date;
  connectionStrength: number; // 0-100
  sharedIntentions: string[];
  resonanceSignature: string; // Unique frequency pattern
}

export interface CollectiveSession {
  id: string;
  name: string;
  description: string;
  type: 'meditation' | 'healing' | 'manifestation' | 'awakening' | 'transmission';
  hostId: string;
  participants: CollectiveMember[];
  maxParticipants: number;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  sharedIntention: string;
  targetFrequency: number; // Hz
  sacredGeometry: 'flower-of-life' | 'metatron-cube' | 'seed-of-life' | 'tree-of-life';
  collectiveResonance: {
    averageFrequency: number;
    coherenceLevel: number; // 0-100
    energyField: {
      intensity: number;
      radius: number; // in meters
      color: string;
    };
  };
  transmissionContent?: {
    type: 'audio' | 'visual' | 'text' | 'energy';
    data: string;
    duration: number;
  };
}

export interface ResonanceField {
  id: string;
  center: {
    latitude: number;
    longitude: number;
  };
  radius: number; // in meters
  intensity: number; // 0-100
  frequency: number; // Hz
  color: string;
  participants: string[]; // member IDs
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  intention: string;
  sacredGeometry: 'flower-of-life' | 'metatron-cube' | 'seed-of-life' | 'tree-of-life';
  collectiveCoherence: number; // 0-100
}

export interface GroupMeditation {
  id: string;
  name: string;
  description: string;
  hostId: string;
  participants: CollectiveMember[];
  startTime: Date;
  duration: number; // in minutes
  isActive: boolean;
  meditationType: 'guided' | 'silent' | 'mantra' | 'breathwork' | 'visualization';
  targetFrequency: number; // Hz
  sharedIntention: string;
  synchronization: {
    isSynchronized: boolean;
    syncMethod: 'breath' | 'heartbeat' | 'frequency' | 'visual';
    syncData: any;
  };
  collectiveMetrics: {
    averageHeartRate: number;
    averageHRV: number;
    coherenceLevel: number;
    energyFieldIntensity: number;
    participantsInSync: number;
  };
  transmissionContent?: {
    audioUrl?: string;
    visualPattern?: string;
    guidedScript?: string;
    binauralFrequencies?: number[];
  };
}

export interface ConsciousnessTransmission {
  id: string;
  senderId: string;
  receiverIds: string[];
  type: 'healing' | 'guidance' | 'protection' | 'awakening' | 'manifestation';
  content: {
    intention: string;
    frequency: number;
    duration: number;
    sacredGeometry: string;
    energySignature: string;
  };
  timestamp: Date;
  isReceived: boolean;
  resonanceMatch: number; // 0-100
  impact: {
    emotionalShift: number;
    spiritualAlignment: number;
    energyLevel: number;
  };
}

export interface CollectiveInsight {
  id: string;
  source: 'ai-companion' | 'collective-wisdom' | 'sacred-transmission' | 'user-generated';
  title: string;
  content: string;
  consciousnessLevel: 'seed' | 'bloom' | 'transcend';
  archetype: string;
  energyFrequency: string;
  sacredGeometry: string;
  resonanceScore: number;
  collectiveEndorsement: number; // 0-100
  timestamp: Date;
  tags: string[];
  relatedSessions: string[];
  wisdomLevel: 'personal' | 'collective' | 'universal' | 'cosmic';
}

export interface MeshNetworkNode {
  id: string;
  memberId: string;
  connectionType: 'direct' | 'relay' | 'hub';
  signalStrength: number; // 0-100
  latency: number; // in ms
  bandwidth: number; // in kbps
  isActive: boolean;
  lastHeartbeat: Date;
  connectedNodes: string[];
  dataTransmitted: number; // in bytes
  energyEfficiency: number; // 0-100
}

export interface CollectiveMetrics {
  totalMembers: number;
  activeMembers: number;
  averageCoherence: number;
  collectiveResonance: number;
  energyFieldIntensity: number;
  sharedIntentions: string[];
  topArchetypes: { archetype: string; count: number }[];
  globalResonanceFields: number;
  activeTransmissions: number;
  wisdomGenerated: number; // insights per day
  lastUpdated: Date;
}
