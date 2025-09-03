/**
 * Collective Receiver Grid - Blends state from all users in the collective session
 * Creates a unified field representation from distributed participant states
 */

import { PLLDriftCorrection, PLLState } from './PLLDriftCorrection';

export interface ParticipantGridState {
  userId: string;
  phase: number;
  frequency: number;
  amplitude: number;
  position: { x: number; y: number; z: number };
  resonance: number;
  polarity: number;
  coherence: number;
  biofeedback?: {
    heartRate: number;
    hrv: number;
    brainwaves: {
      alpha: number;
      beta: number;
      theta: number;
      delta: number;
      gamma: number;
    };
  };
  lastUpdate: number;
  latency: number;
  quality: number; // Connection quality 0-1
}

export interface CollectiveFieldState {
  globalPhase: number;
  globalCoherence: number;
  fieldStrength: number;
  resonancePattern: number[];
  dominantFrequency: number;
  polarityBalance: number;
  participants: ParticipantGridState[];
  centerOfMass: { x: number; y: number; z: number };
  fieldRadius: number;
  harmonicContent: number[];
  emergentPatterns: {
    phaseVortices: Array<{ center: { x: number; y: number }; strength: number; rotation: number }>;
    resonanceNodes: Array<{ position: { x: number; y: number; z: number }; intensity: number }>;
    polarityGradients: Array<{ start: { x: number; y: number }; end: { x: number; y: number }; strength: number }>;
  };
}

export class CollectiveReceiverGrid {
  private participants: Map<string, ParticipantGridState> = new Map();
  private pllCorrection: PLLDriftCorrection;
  private fieldState: CollectiveFieldState;
  private updateCallbacks: ((field: CollectiveFieldState) => void)[] = [];
  private cleanupInterval: NodeJS.Timeout;
  private maxParticipants = 64;
  private fieldUpdateRate = 20; // Hz

  constructor() {
    this.pllCorrection = new PLLDriftCorrection({
      targetFrequency: 1.0,
      loopGain: 0.15,
      dampingFactor: 0.8,
      integrationTime: 800,
      maxCorrection: Math.PI / 3
    });

    this.fieldState = this.createInitialFieldState();
    this.startFieldUpdates();
    this.startCleanup();

    console.log('🌐 Collective Receiver Grid initialized');
  }

  /**
   * Add or update participant in the grid
   */
  updateParticipant(participant: Partial<ParticipantGridState> & { userId: string }): void {
    const existing = this.participants.get(participant.userId);
    const now = performance.now();

    const updatedParticipant: ParticipantGridState = {
      userId: participant.userId,
      phase: participant.phase ?? existing?.phase ?? 0,
      frequency: participant.frequency ?? existing?.frequency ?? 1,
      amplitude: participant.amplitude ?? existing?.amplitude ?? 0.5,
      position: participant.position ?? existing?.position ?? this.generateInitialPosition(),
      resonance: participant.resonance ?? existing?.resonance ?? 0.5,
      polarity: participant.polarity ?? existing?.polarity ?? 0.5,
      coherence: participant.coherence ?? existing?.coherence ?? 0.5,
      biofeedback: participant.biofeedback ?? existing?.biofeedback,
      lastUpdate: now,
      latency: participant.latency ?? existing?.latency ?? 50,
      quality: this.calculateConnectionQuality(participant.userId, now)
    };

    this.participants.set(participant.userId, updatedParticipant);

    // Update PLL with new phase data
    if (participant.phase !== undefined) {
      this.pllCorrection.addReferencePhase(
        participant.userId,
        participant.phase,
        now,
        updatedParticipant.latency
      );
    }

    console.log(`🌐 Updated participant ${participant.userId} in grid (${this.participants.size} total)`);
  }

  /**
   * Remove participant from grid
   */
  removeParticipant(userId: string): void {
    if (this.participants.delete(userId)) {
      console.log(`🌐 Removed participant ${userId} from grid`);
      this.updateField();
    }
  }

  /**
   * Get current collective field state
   */
  getFieldState(): CollectiveFieldState {
    return { ...this.fieldState };
  }

  /**
   * Subscribe to field updates
   */
  onFieldUpdate(callback: (field: CollectiveFieldState) => void): void {
    this.updateCallbacks.push(callback);
  }

  /**
   * Update the collective field based on all participant states
   */
  private updateField(): void {
    const participants = Array.from(this.participants.values());
    const validParticipants = participants.filter(p => this.isParticipantValid(p));

    if (validParticipants.length === 0) {
      this.fieldState = this.createInitialFieldState();
      return;
    }

    // Calculate global phase using PLL correction
    const globalPhase = this.pllCorrection.getCorrectedPhase();

    // Calculate coherence as phase alignment measure
    const globalCoherence = this.calculateGlobalCoherence(validParticipants, globalPhase);

    // Calculate field strength based on participant count and coherence
    const fieldStrength = this.calculateFieldStrength(validParticipants, globalCoherence);

    // Calculate center of mass
    const centerOfMass = this.calculateCenterOfMass(validParticipants);

    // Calculate field radius
    const fieldRadius = this.calculateFieldRadius(validParticipants, centerOfMass);

    // Calculate dominant frequency
    const dominantFrequency = this.calculateDominantFrequency(validParticipants);

    // Calculate polarity balance
    const polarityBalance = this.calculatePolarityBalance(validParticipants);

    // Generate resonance pattern
    const resonancePattern = this.generateResonancePattern(validParticipants);

    // Generate harmonic content
    const harmonicContent = this.generateHarmonicContent(validParticipants);

    // Detect emergent patterns
    const emergentPatterns = this.detectEmergentPatterns(validParticipants);

    this.fieldState = {
      globalPhase,
      globalCoherence,
      fieldStrength,
      resonancePattern,
      dominantFrequency,
      polarityBalance,
      participants: validParticipants,
      centerOfMass,
      fieldRadius,
      harmonicContent,
      emergentPatterns
    };

    // Notify callbacks
    this.updateCallbacks.forEach(callback => {
      try {
        callback(this.fieldState);
      } catch (error) {
        console.error('Error in field update callback:', error);
      }
    });
  }

  /**
   * Calculate global coherence from participant phases
   */
  private calculateGlobalCoherence(participants: ParticipantGridState[], globalPhase: number): number {
    if (participants.length === 0) return 0;

    let sumCos = 0;
    let sumSin = 0;
    let totalWeight = 0;

    participants.forEach(p => {
      const weight = p.quality * p.coherence;
      sumCos += Math.cos(p.phase - globalPhase) * weight;
      sumSin += Math.sin(p.phase - globalPhase) * weight;
      totalWeight += weight;
    });

    if (totalWeight === 0) return 0;

    const meanCos = sumCos / totalWeight;
    const meanSin = sumSin / totalWeight;
    const R = Math.sqrt(meanCos * meanCos + meanSin * meanSin);

    return R;
  }

  /**
   * Calculate field strength based on coherence and participation
   */
  private calculateFieldStrength(participants: ParticipantGridState[], coherence: number): number {
    const participantCount = participants.length;
    const maxParticipants = this.maxParticipants;
    
    // Strength increases with coherence and participant count
    const countFactor = Math.sqrt(participantCount / maxParticipants);
    const coherenceFactor = coherence;
    
    // Average quality of connections
    const avgQuality = participants.reduce((sum, p) => sum + p.quality, 0) / participantCount;
    
    return countFactor * coherenceFactor * avgQuality;
  }

  /**
   * Calculate center of mass of all participants
   */
  private calculateCenterOfMass(participants: ParticipantGridState[]): { x: number; y: number; z: number } {
    if (participants.length === 0) return { x: 0, y: 0, z: 0 };

    let totalWeight = 0;
    let weightedSum = { x: 0, y: 0, z: 0 };

    participants.forEach(p => {
      const weight = p.amplitude * p.quality;
      weightedSum.x += p.position.x * weight;
      weightedSum.y += p.position.y * weight;
      weightedSum.z += p.position.z * weight;
      totalWeight += weight;
    });

    return {
      x: weightedSum.x / totalWeight,
      y: weightedSum.y / totalWeight,
      z: weightedSum.z / totalWeight
    };
  }

  /**
   * Calculate field radius encompassing all participants
   */
  private calculateFieldRadius(participants: ParticipantGridState[], center: { x: number; y: number; z: number }): number {
    if (participants.length === 0) return 1;

    let maxDistance = 0;
    participants.forEach(p => {
      const distance = Math.sqrt(
        Math.pow(p.position.x - center.x, 2) +
        Math.pow(p.position.y - center.y, 2) +
        Math.pow(p.position.z - center.z, 2)
      );
      maxDistance = Math.max(maxDistance, distance);
    });

    return Math.max(1, maxDistance * 1.2); // 20% padding
  }

  /**
   * Calculate dominant frequency from all participants
   */
  private calculateDominantFrequency(participants: ParticipantGridState[]): number {
    if (participants.length === 0) return 1;

    let weightedSum = 0;
    let totalWeight = 0;

    participants.forEach(p => {
      const weight = p.amplitude * p.quality;
      weightedSum += p.frequency * weight;
      totalWeight += weight;
    });

    return weightedSum / totalWeight;
  }

  /**
   * Calculate overall polarity balance
   */
  private calculatePolarityBalance(participants: ParticipantGridState[]): number {
    if (participants.length === 0) return 0.5;

    let weightedSum = 0;
    let totalWeight = 0;

    participants.forEach(p => {
      const weight = p.quality;
      weightedSum += p.polarity * weight;
      totalWeight += weight;
    });

    return weightedSum / totalWeight;
  }

  /**
   * Generate resonance pattern array
   */
  private generateResonancePattern(participants: ParticipantGridState[]): number[] {
    const pattern = new Array(64).fill(0);
    
    participants.forEach((p, index) => {
      const freq = p.frequency;
      const amplitude = p.amplitude * p.quality;
      
      // Map frequency to pattern index
      const baseIndex = Math.floor((freq - 0.1) * 32) % 64;
      
      // Add harmonics
      for (let harmonic = 1; harmonic <= 4; harmonic++) {
        const harmonicIndex = (baseIndex + harmonic * 8) % 64;
        pattern[harmonicIndex] += amplitude / harmonic;
      }
    });

    return pattern;
  }

  /**
   * Generate harmonic content analysis
   */
  private generateHarmonicContent(participants: ParticipantGridState[]): number[] {
    const harmonics = new Array(16).fill(0);
    
    participants.forEach(p => {
      const fundamental = p.frequency;
      const amplitude = p.amplitude * p.quality;
      
      for (let h = 1; h <= 16; h++) {
        const harmonicFreq = fundamental * h;
        const harmonicAmplitude = amplitude / (h * h); // Natural harmonic rolloff
        harmonics[h - 1] += harmonicAmplitude;
      }
    });

    // Normalize
    const maxHarmonic = Math.max(...harmonics);
    return maxHarmonic > 0 ? harmonics.map(h => h / maxHarmonic) : harmonics;
  }

  /**
   * Detect emergent patterns in the field
   */
  private detectEmergentPatterns(participants: ParticipantGridState[]): CollectiveFieldState['emergentPatterns'] {
    const patterns: CollectiveFieldState['emergentPatterns'] = {
      phaseVortices: [],
      resonanceNodes: [],
      polarityGradients: []
    };

    // Detect phase vortices (areas where phase rotates around a center)
    patterns.phaseVortices = this.detectPhaseVortices(participants);
    
    // Detect resonance nodes (areas of high resonance)
    patterns.resonanceNodes = this.detectResonanceNodes(participants);
    
    // Detect polarity gradients (directional polarity changes)
    patterns.polarityGradients = this.detectPolarityGradients(participants);

    return patterns;
  }

  private detectPhaseVortices(participants: ParticipantGridState[]): Array<{ center: { x: number; y: number }; strength: number; rotation: number }> {
    // Simplified vortex detection - look for circular phase patterns
    const vortices: Array<{ center: { x: number; y: number }; strength: number; rotation: number }> = [];
    
    // Grid-based analysis for computational efficiency
    const gridSize = 8;
    for (let gx = 0; gx < gridSize; gx++) {
      for (let gy = 0; gy < gridSize; gy++) {
        const center = {
          x: (gx / gridSize - 0.5) * 10,
          y: (gy / gridSize - 0.5) * 10
        };
        
        const vorticity = this.calculateVorticity(participants, center);
        if (Math.abs(vorticity) > 0.3) {
          vortices.push({
            center,
            strength: Math.abs(vorticity),
            rotation: Math.sign(vorticity)
          });
        }
      }
    }
    
    return vortices.slice(0, 5); // Limit to top 5 vortices
  }

  private calculateVorticity(participants: ParticipantGridState[], center: { x: number; y: number }): number {
    let vorticity = 0;
    let count = 0;
    
    participants.forEach(p => {
      const dx = p.position.x - center.x;
      const dy = p.position.y - center.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 2 && distance > 0.1) {
        const expectedPhase = Math.atan2(dy, dx);
        const phaseDiff = ((p.phase - expectedPhase + Math.PI) % (2 * Math.PI)) - Math.PI;
        vorticity += phaseDiff / distance;
        count++;
      }
    });
    
    return count > 0 ? vorticity / count : 0;
  }

  private detectResonanceNodes(participants: ParticipantGridState[]): Array<{ position: { x: number; y: number; z: number }; intensity: number }> {
    const nodes: Array<{ position: { x: number; y: number; z: number }; intensity: number }> = [];
    
    // Find areas of high resonance
    participants.forEach(p => {
      if (p.resonance > 0.8) {
        nodes.push({
          position: p.position,
          intensity: p.resonance * p.quality
        });
      }
    });
    
    return nodes.slice(0, 8); // Limit to top 8 nodes
  }

  private detectPolarityGradients(participants: ParticipantGridState[]): Array<{ start: { x: number; y: number }; end: { x: number; y: number }; strength: number }> {
    const gradients: Array<{ start: { x: number; y: number }; end: { x: number; y: number }; strength: number }> = [];
    
    // Analyze polarity changes between participants
    for (let i = 0; i < participants.length; i++) {
      for (let j = i + 1; j < participants.length; j++) {
        const p1 = participants[i];
        const p2 = participants[j];
        
        const polarityDiff = Math.abs(p1.polarity - p2.polarity);
        const distance = Math.sqrt(
          Math.pow(p1.position.x - p2.position.x, 2) +
          Math.pow(p1.position.y - p2.position.y, 2)
        );
        
        if (polarityDiff > 0.3 && distance < 5) {
          gradients.push({
            start: { x: p1.position.x, y: p1.position.y },
            end: { x: p2.position.x, y: p2.position.y },
            strength: polarityDiff / distance
          });
        }
      }
    }
    
    return gradients.slice(0, 10); // Limit to top 10 gradients
  }

  private generateInitialPosition(): { x: number; y: number; z: number } {
    return {
      x: (Math.random() - 0.5) * 10,
      y: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 2
    };
  }

  private calculateConnectionQuality(userId: string, currentTime: number): number {
    const existing = this.participants.get(userId);
    if (!existing) return 1;

    const timeSinceLastUpdate = currentTime - existing.lastUpdate;
    const maxAge = 5000; // 5 seconds

    // Quality degrades over time
    const timeFactor = Math.max(0, 1 - timeSinceLastUpdate / maxAge);
    
    // Quality based on latency
    const latencyFactor = Math.max(0, 1 - existing.latency / 1000);
    
    return timeFactor * latencyFactor;
  }

  private isParticipantValid(participant: ParticipantGridState): boolean {
    const now = performance.now();
    const age = now - participant.lastUpdate;
    return age < 10000 && participant.quality > 0.1; // 10 seconds max age, min 10% quality
  }

  private createInitialFieldState(): CollectiveFieldState {
    return {
      globalPhase: 0,
      globalCoherence: 0,
      fieldStrength: 0,
      resonancePattern: new Array(64).fill(0),
      dominantFrequency: 1,
      polarityBalance: 0.5,
      participants: [],
      centerOfMass: { x: 0, y: 0, z: 0 },
      fieldRadius: 1,
      harmonicContent: new Array(16).fill(0),
      emergentPatterns: {
        phaseVortices: [],
        resonanceNodes: [],
        polarityGradients: []
      }
    };
  }

  private startFieldUpdates(): void {
    setInterval(() => {
      this.updateField();
    }, 1000 / this.fieldUpdateRate);
  }

  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5000);
  }

  private cleanup(): void {
    const now = performance.now();
    for (const [userId, participant] of this.participants) {
      if (!this.isParticipantValid(participant)) {
        this.participants.delete(userId);
        console.log(`🌐 Cleaned up stale participant: ${userId}`);
      }
    }
    
    // Cleanup PLL correction
    this.pllCorrection.cleanup();
  }

  /**
   * Get network statistics
   */
  getNetworkStats(): {
    participantCount: number;
    averageLatency: number;
    fieldStrength: number;
    coherence: number;
    pllStats: PLLState;
  } {
    const participants = Array.from(this.participants.values());
    const validParticipants = participants.filter(p => this.isParticipantValid(p));
    
    const averageLatency = validParticipants.length > 0 
      ? validParticipants.reduce((sum, p) => sum + p.latency, 0) / validParticipants.length
      : 0;

    return {
      participantCount: validParticipants.length,
      averageLatency,
      fieldStrength: this.fieldState.fieldStrength,
      coherence: this.fieldState.globalCoherence,
      pllStats: this.pllCorrection.getState()
    };
  }

  /**
   * Destroy the grid and cleanup resources
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.participants.clear();
    this.updateCallbacks = [];
    
    console.log('🌐 Collective Receiver Grid destroyed');
  }
}