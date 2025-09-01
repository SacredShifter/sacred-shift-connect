import * as Tone from 'tone';

export type AudioProfile = 'high-quality' | 'balanced' | 'low-latency';

const AUDIO_PROFILES = {
  'high-quality': {
    waveform: 'sawtooth' as const,
    filterRolloff: -24 as const,
    envelope: { attack: 0.2, decay: 0.3, sustain: 0.7, release: 0.8 },
    spatialPanning: true,
  },
  'balanced': {
    waveform: 'triangle' as const,
    filterRolloff: -12 as const,
    envelope: { attack: 0.1, decay: 0.2, sustain: 0.6, release: 0.5 },
    spatialPanning: true,
  },
  'low-latency': {
    waveform: 'sine' as const,
    filterRolloff: -12 as const,
    envelope: { attack: 0.05, decay: 0.1, sustain: 0.8, release: 0.2 },
    spatialPanning: false,
  },
};


export interface GeometricOscillatorConfig {
  baseFrequency: number;
  gainLevel: number;
  profile?: AudioProfile;
  modulationDepth: number;
}

export interface NormalizedGeometry {
  vertices: number[][];
  faces: number[][];
  normals: number[][];
  center: number[];
  radius: number;
  sacredRatios: {
    phi: number;
    pi: number;
    sqrt2: number;
  };
}

const MAX_OSCILLATORS = 32; // Default max oscillators

export class GeometricOscillator {
  private config: GeometricOscillatorConfig;
  private _dynamicMaxOscillators: number = MAX_OSCILLATORS;
  private _lastFrameTime: number = 0;
  private _frameTimeHistory: number[] = [];
  private _monitoringHandle: number | null = null;

  private oscillators: Map<string, {
    osc: Tone.Oscillator;
    filter: Tone.Filter;
    gain: Tone.Gain;
    panner: Tone.Panner3D;
    envelope: Tone.AmplitudeEnvelope;
  }> = new Map();
  private masterGain: Tone.Gain;
  private masterCompressor: Tone.Compressor;
  private masterAnalyser: Tone.Analyser;

  // Node pools for recycling
  private oscPool: Tone.Oscillator[] = [];
  private filterPool: Tone.Filter[] = [];
  private gainPool: Tone.Gain[] = [];
  private pannerPool: Tone.Panner3D[] = [];
  private envelopePool: Tone.AmplitudeEnvelope[] = [];

  constructor(audioContext: AudioContext, config: GeometricOscillatorConfig) {
    this.config = config;
    if (!this.config.profile) {
      this.config.profile = 'balanced';
    }
    
    console.log('🎛️ Setting up GAA master audio chain...');
    
    // Setup master audio chain - Tone.js handles the AudioContext internally
    this.masterGain = new Tone.Gain(config.gainLevel);
    this.masterCompressor = new Tone.Compressor({
      threshold: -24,
      ratio: 3,
      attack: 0.003,
      release: 0.1
    });
    this.masterAnalyser = new Tone.Analyser('waveform', 1024);
    
    this.masterGain.connect(this.masterCompressor);
    this.masterCompressor.connect(this.masterAnalyser);
    this.masterAnalyser.toDestination();
    
    console.log('✅ GAA master audio chain ready');

    // Pre-warm the node pools to avoid initial audio lag
    this.prewarmPools(5);
    this._startMonitoring();
  }

  public destroy(): void {
    this.stopAll();
    this.stopMonitoring();
  }

  private _startMonitoring(): void {
    if (typeof window === 'undefined' || this._monitoringHandle) return;
    console.log('📈 Starting performance monitoring...');
    this._lastFrameTime = performance.now();
    const monitorLoop = (time: number) => {
      this._updatePerformanceMetrics(time);
      this._monitoringHandle = requestAnimationFrame(monitorLoop);
    };
    this._monitoringHandle = requestAnimationFrame(monitorLoop);
  }

  public stopMonitoring(): void {
    if (this._monitoringHandle) {
      cancelAnimationFrame(this._monitoringHandle);
      this._monitoringHandle = null;
      console.log('📉 Stopped performance monitoring.');
    }
  }

  private _updatePerformanceMetrics(time: number): void {
    const delta = time - this._lastFrameTime;
    this._lastFrameTime = time;

    // Maintain a history of the last 20 frame times
    this._frameTimeHistory.push(delta);
    if (this._frameTimeHistory.length > 20) {
      this._frameTimeHistory.shift();
    }

    // Calculate average frame time
    const avgFrameTime = this._frameTimeHistory.reduce((a, b) => a + b, 0) / this._frameTimeHistory.length;

    // Dynamically adjust oscillator count based on performance
    if (avgFrameTime > 40) { // Critical load ( < 25 FPS)
      this._dynamicMaxOscillators = Math.max(8, this._dynamicMaxOscillators - 1);
      if (this.config.profile !== 'low-latency') {
        console.warn(`🐢 Performance critically low. Forcing "low-latency" audio profile.`);
        this.setProfile('low-latency');
      }
    } else if (avgFrameTime > 25) { // Strained ( < 40 FPS)
      this._dynamicMaxOscillators = Math.max(16, this._dynamicMaxOscillators - 1);
    } else { // Healthy
      this._dynamicMaxOscillators = Math.min(MAX_OSCILLATORS, this._dynamicMaxOscillators + 1);
    }
  }

  private prewarmPools(size: number): void {
    console.log(`🔥 Pre-warming ${size} audio nodes...`);
    for (let i = 0; i < size; i++) {
      this.oscPool.push(new Tone.Oscillator());
      this.filterPool.push(new Tone.Filter());
      this.gainPool.push(new Tone.Gain());
      this.pannerPool.push(new Tone.Panner3D());
      this.envelopePool.push(new Tone.AmplitudeEnvelope());
    }
  }

  /**
   * Create a geometric oscillator based on normalized geometry
   */
  createGeometricOscillator(geometry: NormalizedGeometry, id: string): boolean {
    console.log(`🎼 Creating geometric oscillator: ${id} with profile: ${this.config.profile}`);
    
    if (this.oscillators.has(id)) {
      console.warn(`🔄 Oscillator with ID ${id} already exists. Stopping and replacing.`);
      this.stopOscillator(id);
    }

    // --- DYNAMIC PERFORMANCE GUARDRAIL ---
    if (this.oscillators.size >= this._dynamicMaxOscillators) {
      console.warn(`Dynamic oscillator limit reached (${this._dynamicMaxOscillators}). Cannot create new oscillator.`);
      return false;
    }

    try {
      const profile = AUDIO_PROFILES[this.config.profile];
      const frequency = this.calculateGeometricFrequency(geometry);
      console.log(`🎵 Calculated frequency for ${id}: ${frequency.toFixed(2)}Hz`);
      
      const osc = this.oscPool.pop() || new Tone.Oscillator();
      osc.set({ frequency, type: profile.waveform });

      const cutoff = this.calculateFilterFrequency(geometry);
      const filter = this.filterPool.pop() || new Tone.Filter();
      filter.set({ frequency: cutoff, type: 'lowpass', rolloff: profile.filterRolloff });

      const gain = this.gainPool.pop() || new Tone.Gain(0.5);

      const envelope = this.envelopePool.pop() || new Tone.AmplitudeEnvelope();
      envelope.set(profile.envelope);

      const panner = this.pannerPool.pop() || new Tone.Panner3D();
      if (profile.spatialPanning) {
        panner.set({
          positionX: geometry.center[0] * 5,
          positionY: geometry.center[1] * 5,
          positionZ: geometry.center[2] * 5
        });
      }

      // Connect audio chain
      osc.connect(filter);
      filter.connect(envelope);
      envelope.connect(gain);
      
      if (profile.spatialPanning) {
        gain.connect(panner);
        panner.connect(this.masterGain);
      } else {
        gain.connect(this.masterGain);
      }

      // Store oscillator components
      this.oscillators.set(id, { osc, filter, gain, panner, envelope });

      // Start oscillator
      osc.start();
      envelope.triggerAttack();
      
      console.log(`✅ Oscillator ${id} started successfully. Total: ${this.oscillators.size}`);
      return true;
    } catch (error) {
      console.error(`❌ Failed to create oscillator ${id}:`, error);
      // Clean up any partially created resources if an error occurred
      if (this.oscillators.has(id)) {
        this.stopOscillator(id);
      }
      return false;
    }
  }

  /**
   * Update existing geometric oscillator
   */
  updateGeometricOscillator(id: string, geometry: NormalizedGeometry): void {
    try {
      const components = this.oscillators.get(id);
      if (!components) return;

      const { osc, filter, panner } = components;
      const profile = AUDIO_PROFILES[this.config.profile];

      // Smoothly update frequency
      const newFreq = this.calculateGeometricFrequency(geometry);
      osc.frequency.rampTo(newFreq, 0.1);

      // Update filter based on geometry changes
      const newCutoff = this.calculateFilterFrequency(geometry);
      filter.frequency.rampTo(newCutoff, 0.1);

      // Update spatial position
      if (profile.spatialPanning) {
        panner.positionX.rampTo(geometry.center[0] * 10, 0.2);
        panner.positionY.rampTo(geometry.center[1] * 10, 0.2);
        panner.positionZ.rampTo(geometry.center[2] * 10, 0.2);
      }
    } catch (error) {
      console.error(`❌ Failed to update oscillator ${id}:`, error);
    }
  }

  /**
   * Updates the core audio parameters of a specific oscillator.
   * This is more direct than recalculating from geometry.
   */
  setParameters(id: string, params: { fHz?: number, amp?: number, fcHz?: number }): void {
    try {
      const components = this.oscillators.get(id);
      if (!components) return;

      const { osc, envelope, filter } = components;

      if (params.fHz) {
        osc.frequency.rampTo(params.fHz, 0.05);
      }
      if (params.amp) {
        // Direct gain control on the envelope is tricky. For now, we assume amp is handled by envelope.
        // A more advanced implementation might use a separate VCA.
      }
      if (params.fcHz) {
        filter.frequency.rampTo(params.fcHz, 0.05);
      }
    } catch (error) {
      console.error(`❌ Failed to set parameters for oscillator ${id}:`, error);
    }
  }

  /**
   * Calculate frequency based on geometric properties
   */
  private calculateGeometricFrequency(geometry: NormalizedGeometry): number {
    const { sacredRatios, radius, vertices } = geometry;
    
    // Base frequency from sacred ratios
    let freq = this.config.baseFrequency;
    
    // Modulate by golden ratio
    freq *= Math.pow(sacredRatios.phi, (radius - 0.5) * 2);
    
    // Modulate by vertex count (complexity)
    const complexity = vertices.length / 100; // Normalize vertex count
    freq *= 1 + complexity * 0.5;
    
    // Modulate by geometric center position
    const centerMagnitude = Math.sqrt(
      geometry.center[0] ** 2 + 
      geometry.center[1] ** 2 + 
      geometry.center[2] ** 2
    );
    freq *= 1 + centerMagnitude * 0.3;
    
    // Ensure frequency is in audible range
    return Math.max(20, Math.min(2000, freq));
  }

  /**
   * Calculate filter frequency based on geometric complexity
   */
  private calculateFilterFrequency(geometry: NormalizedGeometry): number {
    const baseFilter = 800;
    const complexity = geometry.vertices.length / 50;
    const radiusEffect = geometry.radius * 2;
    
    return Math.max(200, Math.min(8000, baseFilter * (1 + complexity + radiusEffect)));
  }

  /**
   * Stop specific oscillator
   */
  stopOscillator(id: string): void {
    const components = this.oscillators.get(id);
    if (!components) return;

    console.log(`🛑 Stopping oscillator: ${id}`);
    const { osc, filter, gain, panner, envelope } = components;
    
    try {
      // Graceful release
      envelope.triggerRelease();
      
      // After release, disconnect and return nodes to the pool
      setTimeout(() => {
        try {
          osc.disconnect();
          filter.disconnect();
          gain.disconnect();
          panner.disconnect();
          envelope.disconnect();

          this.oscPool.push(osc);
          this.filterPool.push(filter);
          this.gainPool.push(gain);
          this.pannerPool.push(panner);
          this.envelopePool.push(envelope);
          
          this.oscillators.delete(id);
          console.log(`✅ Oscillator ${id} stopped and recycled`);
        } catch (error) {
          console.error(`❌ Error recycling oscillator ${id}:`, error);
          // Still remove from active map even if cleanup fails
          this.oscillators.delete(id);
        }
      }, 900); // Wait for envelope release
    } catch (error) {
      console.error(`❌ Error stopping oscillator ${id}:`, error);
      this.oscillators.delete(id);
    }
  }

  /**
   * Stop all oscillators
   */
  stopAll(): void {
    console.log(`🛑 Stopping all ${this.oscillators.size} oscillators`);
    const oscillatorIds = Array.from(this.oscillators.keys());
    oscillatorIds.forEach(id => {
      this.stopOscillator(id);
    });
    console.log('✅ All oscillators stopped');
  }

  /**
   * Get active oscillator count
   */
  getActiveCount(): number {
    return this.oscillators.size;
  }

  /**
   * Switches the audio profile on the fly.
   * This stops all current oscillators and they will be recreated with the new profile settings on the next update.
   */
  setProfile(profile: AudioProfile): void {
    if (this.config.profile === profile) return;

    console.log(`🔄 Switching audio profile to: ${profile}`);
    this.config.profile = profile;

    // To ensure a clean switch, we stop all current oscillators.
    // They will be recreated with the new profile settings on the next
    // update or create call. This prevents mixed-profile states.
    this.stopAll();
  }

  /**
   * Update master gain
   */
  setMasterGain(gain: number): void {
    this.masterGain.gain.rampTo(Math.max(0, Math.min(1, gain)), 0.1);
  }

  /**
   * Get oscillator info for debugging
   */
  getOscillatorInfo(id: string) {
    const components = this.oscillators.get(id);
    if (!components) return null;

    return {
      frequency: components.osc.frequency.value,
      filterCutoff: components.filter.frequency.value,
      position: {
        x: components.panner.positionX.value,
        y: components.panner.positionY.value,
        z: components.panner.positionZ.value
      }
    };
  }

  /**
   * Get the master analyser node for monitoring
   */
  getAnalyserNode(): Tone.Analyser {
    return this.masterAnalyser;
  }
}