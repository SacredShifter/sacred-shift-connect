import * as Tone from 'tone';

export interface GeometricOscillatorConfig {
  baseFrequency: number;
  gainLevel: number;
  waveform: 'sine' | 'triangle' | 'square' | 'sawtooth';
  modulationDepth: number;
  spatialPanning: boolean;
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

const MAX_OSCILLATORS = 32; // Safety limit for Web Audio API performance

export class GeometricOscillator {
  private config: GeometricOscillatorConfig;
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
  createGeometricOscillator(
    geometry: NormalizedGeometry, 
    id: string, 
    harmonics: number = 4
  ): boolean {
    console.log(`🎼 Creating geometric oscillator: ${id}`);
    
    if (this.oscillators.has(id)) {
      console.warn(`🔄 Oscillator with ID ${id} already exists. Stopping and replacing.`);
      this.stopOscillator(id);
    }

    // --- PERFORMANCE GUARDRAIL ---
    if (this.oscillators.size >= MAX_OSCILLATORS) {
      console.error(`❌ Oscillator limit reached (${MAX_OSCILLATORS}). Cannot create new oscillator.`);
      return false;
    }

    try {
      // Calculate frequency based on geometry
      const frequency = this.calculateGeometricFrequency(geometry);
      console.log(`🎵 Calculated frequency for ${id}: ${frequency.toFixed(2)}Hz`);
      
      // Get nodes from pool or create new ones if pool is empty
      const osc = this.oscPool.pop() || new Tone.Oscillator();
      osc.set({ frequency, type: this.config.waveform });

      const cutoff = this.calculateFilterFrequency(geometry);
      const filter = this.filterPool.pop() || new Tone.Filter();
      filter.set({ frequency: cutoff, type: 'lowpass', rolloff: -12 });

      const gain = this.gainPool.pop() || new Tone.Gain(0.5);

      const envelope = this.envelopePool.pop() || new Tone.AmplitudeEnvelope();
      envelope.set({ attack: 0.2, decay: 0.3, sustain: 0.7, release: 0.8 });

      const panner = this.pannerPool.pop() || new Tone.Panner3D();
      panner.set({
        positionX: geometry.center[0] * 5,
        positionY: geometry.center[1] * 5,
        positionZ: geometry.center[2] * 5
      });

      // Connect audio chain
      osc.connect(filter);
      filter.connect(envelope);
      envelope.connect(gain);
      
      if (this.config.spatialPanning) {
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
  updateGeometricOscillator(
    id: string, 
    geometry: NormalizedGeometry, 
    harmonics: number = 4
  ): void {
    try {
      const components = this.oscillators.get(id);
      if (!components) return;

      const { osc, filter, panner } = components;

      // Smoothly update frequency
      const newFreq = this.calculateGeometricFrequency(geometry);
      osc.frequency.rampTo(newFreq, 0.1);

      // Update filter based on geometry changes
      const newCutoff = this.calculateFilterFrequency(geometry);
      filter.frequency.rampTo(newCutoff, 0.1);

      // Update spatial position
      if (this.config.spatialPanning) {
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