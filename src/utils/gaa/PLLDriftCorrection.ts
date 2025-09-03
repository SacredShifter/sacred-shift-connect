/**
 * Phase-Locked Loop (PLL) Drift Correction System
 * Maintains phase synchronization across multiple clients with network latency compensation
 */

export interface PLLConfig {
  targetFrequency: number;
  loopGain: number;
  dampingFactor: number;
  integrationTime: number;
  maxCorrection: number;
}

export interface PLLState {
  phase: number;
  frequency: number;
  error: number;
  integralError: number;
  lastUpdate: number;
  locked: boolean;
  confidence: number;
}

export class PLLDriftCorrection {
  private config: PLLConfig;
  private state: PLLState;
  private referencePhases: Map<string, { phase: number; timestamp: number; latency: number }> = new Map();
  private correctionHistory: number[] = [];
  private maxHistoryLength = 50;

  constructor(config: Partial<PLLConfig> = {}) {
    this.config = {
      targetFrequency: 1.0, // 1 Hz default
      loopGain: 0.1,
      dampingFactor: 0.7,
      integrationTime: 1000, // ms
      maxCorrection: Math.PI / 4, // 45 degrees max correction
      ...config
    };

    this.state = {
      phase: 0,
      frequency: this.config.targetFrequency,
      error: 0,
      integralError: 0,
      lastUpdate: performance.now(),
      locked: false,
      confidence: 0
    };

    console.log('🔒 PLL Drift Correction initialized', this.config);
  }

  /**
   * Update local phase with time progression
   */
  updateLocalPhase(timestamp: number = performance.now()): number {
    const dt = (timestamp - this.state.lastUpdate) / 1000; // Convert to seconds
    
    // Update phase with current frequency
    this.state.phase += 2 * Math.PI * this.state.frequency * dt;
    this.state.phase = this.normalizePhase(this.state.phase);
    
    this.state.lastUpdate = timestamp;
    return this.state.phase;
  }

  /**
   * Add reference phase from remote client
   */
  addReferencePhase(clientId: string, phase: number, timestamp: number, latency: number = 0): void {
    // Compensate for network latency
    const compensatedTimestamp = timestamp + latency / 2;
    
    this.referencePhases.set(clientId, {
      phase: this.normalizePhase(phase),
      timestamp: compensatedTimestamp,
      latency
    });

    // Trigger correction calculation
    this.calculateCorrection(performance.now());
  }

  /**
   * Calculate phase correction based on reference phases
   */
  private calculateCorrection(currentTime: number): void {
    if (this.referencePhases.size === 0) return;

    // Calculate weighted average of reference phases
    let totalWeight = 0;
    let weightedPhaseSum = 0;
    let confidenceSum = 0;

    for (const [clientId, ref] of this.referencePhases) {
      const age = currentTime - ref.timestamp;
      
      // Skip old references (older than 5 seconds)
      if (age > 5000) {
        this.referencePhases.delete(clientId);
        continue;
      }

      // Weight based on recency and latency
      const ageWeight = Math.exp(-age / 2000); // Exponential decay over 2 seconds
      const latencyWeight = Math.exp(-ref.latency / 100); // Lower weight for high latency
      const weight = ageWeight * latencyWeight;

      // Convert phase to complex representation for circular averaging
      const complexPhase = { 
        real: Math.cos(ref.phase) * weight, 
        imag: Math.sin(ref.phase) * weight 
      };

      weightedPhaseSum += Math.atan2(complexPhase.imag, complexPhase.real) * weight;
      totalWeight += weight;
      confidenceSum += weight;
    }

    if (totalWeight === 0) return;

    // Calculate average reference phase
    const avgReferencePhase = this.normalizePhase(weightedPhaseSum / totalWeight);
    
    // Calculate phase error
    const currentPhase = this.updateLocalPhase(currentTime);
    const phaseError = this.calculatePhaseError(avgReferencePhase, currentPhase);

    // Apply PLL correction
    this.applyPLLCorrection(phaseError, currentTime);

    // Update confidence based on consensus
    this.state.confidence = Math.min(1.0, confidenceSum / this.referencePhases.size);
    this.state.locked = this.state.confidence > 0.7 && Math.abs(phaseError) < Math.PI / 6;

    console.log(`🔒 PLL Update: phase=${currentPhase.toFixed(3)}, error=${phaseError.toFixed(3)}, conf=${this.state.confidence.toFixed(2)}, locked=${this.state.locked}`);
  }

  /**
   * Apply PLL correction algorithm
   */
  private applyPLLCorrection(phaseError: number, timestamp: number): void {
    const dt = (timestamp - this.state.lastUpdate) / 1000;
    
    // Proportional term
    const proportional = this.config.loopGain * phaseError;
    
    // Integral term (accumulated error over time)
    this.state.integralError += phaseError * dt;
    const integral = (this.config.loopGain / this.config.integrationTime) * this.state.integralError;
    
    // Derivative term (rate of change of error)
    const derivative = this.config.dampingFactor * (phaseError - this.state.error) / dt;
    
    // PID correction
    let correction = proportional + integral + derivative;
    
    // Clamp correction to maximum allowed
    correction = Math.max(-this.config.maxCorrection, Math.min(this.config.maxCorrection, correction));
    
    // Apply correction to phase and frequency
    this.state.phase += correction;
    this.state.phase = this.normalizePhase(this.state.phase);
    
    // Frequency adjustment based on error trend
    const avgRecentCorrection = this.getAverageRecentCorrection();
    this.state.frequency = this.config.targetFrequency + avgRecentCorrection * 0.1;
    
    // Store correction for trending
    this.correctionHistory.push(correction);
    if (this.correctionHistory.length > this.maxHistoryLength) {
      this.correctionHistory.shift();
    }
    
    this.state.error = phaseError;
  }

  /**
   * Calculate phase error with circular arithmetic
   */
  private calculatePhaseError(reference: number, current: number): number {
    let error = reference - current;
    
    // Normalize to [-π, π]
    while (error > Math.PI) error -= 2 * Math.PI;
    while (error < -Math.PI) error += 2 * Math.PI;
    
    return error;
  }

  /**
   * Normalize phase to [0, 2π]
   */
  private normalizePhase(phase: number): number {
    let normalized = phase % (2 * Math.PI);
    if (normalized < 0) normalized += 2 * Math.PI;
    return normalized;
  }

  /**
   * Get average of recent corrections for frequency adjustment
   */
  private getAverageRecentCorrection(): number {
    if (this.correctionHistory.length === 0) return 0;
    
    const recentCorrections = this.correctionHistory.slice(-10); // Last 10 corrections
    return recentCorrections.reduce((sum, c) => sum + c, 0) / recentCorrections.length;
  }

  /**
   * Get current PLL state
   */
  getState(): PLLState {
    return { ...this.state };
  }

  /**
   * Get corrected phase at specific timestamp
   */
  getCorrectedPhase(timestamp: number = performance.now()): number {
    return this.updateLocalPhase(timestamp);
  }

  /**
   * Reset PLL state
   */
  reset(): void {
    this.state = {
      phase: 0,
      frequency: this.config.targetFrequency,
      error: 0,
      integralError: 0,
      lastUpdate: performance.now(),
      locked: false,
      confidence: 0
    };
    
    this.referencePhases.clear();
    this.correctionHistory = [];
    
    console.log('🔒 PLL Reset');
  }

  /**
   * Get network statistics
   */
  getNetworkStats(): {
    connectedClients: number;
    averageLatency: number;
    maxLatency: number;
    confidence: number;
  } {
    const latencies = Array.from(this.referencePhases.values()).map(ref => ref.latency);
    
    return {
      connectedClients: this.referencePhases.size,
      averageLatency: latencies.length > 0 ? latencies.reduce((sum, l) => sum + l, 0) / latencies.length : 0,
      maxLatency: latencies.length > 0 ? Math.max(...latencies) : 0,
      confidence: this.state.confidence
    };
  }

  /**
   * Set target frequency
   */
  setTargetFrequency(frequency: number): void {
    this.config.targetFrequency = frequency;
    console.log(`🔒 PLL Target frequency set to ${frequency} Hz`);
  }

  /**
   * Cleanup old reference phases
   */
  cleanup(): void {
    const currentTime = performance.now();
    for (const [clientId, ref] of this.referencePhases) {
      if (currentTime - ref.timestamp > 10000) { // 10 seconds
        this.referencePhases.delete(clientId);
      }
    }
  }
}