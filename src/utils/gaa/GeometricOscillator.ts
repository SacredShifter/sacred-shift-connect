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

export class GeometricOscillator {
  private audioContext: AudioContext;
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

  constructor(audioContext: AudioContext, config: GeometricOscillatorConfig) {
    this.audioContext = audioContext;
    this.config = config;
    
    // Setup master audio chain
    this.masterGain = new Tone.Gain(config.gainLevel);
    this.masterCompressor = new Tone.Compressor({
      threshold: -24,
      ratio: 3,
      attack: 0.003,
      release: 0.1
    });
    
    this.masterGain.connect(this.masterCompressor);
    this.masterCompressor.toDestination();
  }

  /**
   * Create a geometric oscillator based on normalized geometry
   */
  createGeometricOscillator(
    geometry: NormalizedGeometry, 
    id: string, 
    harmonics: number = 4
  ): void {
    if (this.oscillators.has(id)) {
      this.stopOscillator(id);
    }

    // Calculate frequency based on geometry
    const frequency = this.calculateGeometricFrequency(geometry);
    
    // Create oscillator with harmonic content
    const osc = new Tone.Oscillator({
      frequency: frequency,
      type: this.config.waveform
    });

    // Create filter based on geometric complexity
    const cutoff = this.calculateFilterFrequency(geometry);
    const filter = new Tone.Filter(cutoff, 'lowpass', -12);

    // Create gain envelope based on geometry
    const gain = new Tone.Gain(0);
    const envelope = new Tone.AmplitudeEnvelope({
      attack: 0.1,
      decay: 0.2,
      sustain: 0.8,
      release: 0.5
    });

    // Create 3D panner for spatial positioning
    const panner = new Tone.Panner3D({
      positionX: geometry.center[0] * 10,
      positionY: geometry.center[1] * 10,
      positionZ: geometry.center[2] * 10
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
  }

  /**
   * Update existing geometric oscillator
   */
  updateGeometricOscillator(
    id: string, 
    geometry: NormalizedGeometry, 
    harmonics: number = 4
  ): void {
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

    const { osc, filter, gain, panner, envelope } = components;
    
    // Graceful release
    envelope.triggerRelease();
    
    // Stop after release time
    setTimeout(() => {
      osc.stop();
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
      panner.disconnect();
      envelope.disconnect();
      
      this.oscillators.delete(id);
    }, 600); // Wait for release
  }

  /**
   * Stop all oscillators
   */
  stopAll(): void {
    Array.from(this.oscillators.keys()).forEach(id => {
      this.stopOscillator(id);
    });
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
}