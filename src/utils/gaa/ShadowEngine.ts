/**
 * Shadow Engine - Dual-Channel Polarity DSP Processing
 * The core of the revolutionary GAA polarity system
 */

import * as Tone from 'tone';
import { 
  PolarityProtocol, 
  ShadowEngineState, 
  ChannelConfiguration, 
  DarkEnergyConfiguration,
  BiofeedbackMetrics 
} from '@/types/gaa-polarity';

export class ShadowEngine {
  private audioContext: AudioContext;
  private lightChannel: ShadowChannel;
  private darkChannel: ShadowChannel;
  private masterGain: GainNode;
  private crossPolarizer: BiquadFilterNode;
  private manifestationGate: DynamicsCompressorNode;
  
  private state: ShadowEngineState;
  private polarityProtocol: PolarityProtocol;
  private isActive: boolean = false;
  
  // DSP Analysis
  private lightAnalyzer: AnalyserNode;
  private darkAnalyzer: AnalyserNode;
  private spectralData: {
    light: Float32Array;
    dark: Float32Array;
    crossCorrelation: Float32Array;
  };

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.initializeState();
    this.setupDSPChain();
    this.initializeAnalysis();
  }

  private initializeState(): void {
    this.state = {
      isActive: false,
      currentPhase: 'light',
      polarityBalance: 0,
      shadowIntensity: 0,
      lightDominance: 0.5,
      darkDominance: 0.5,
      manifestationMode: 'balanced',
      breathCoherence: 0,
      heartVariability: 0,
      neuralEntrainment: 0
    };

    this.polarityProtocol = {
      lightChannel: this.createDefaultChannelConfig(),
      darkChannel: this.createDefaultChannelConfig(),
      polarityBalance: 0,
      manifestInDark: false,
      crossPolarizationEnabled: true,
      darkEnergyDrift: {
        driftRate: 0.001, // Hz/sec - subtle cosmic expansion
        expansionFactor: 1.0,
        voidResonance: false,
        quantumFluctuation: 0.1,
        darkMatterDensity: 0.85 // Cosmological constant
      }
    };
  }

  private createDefaultChannelConfig(): ChannelConfiguration {
    return {
      enabled: true,
      amplitude: 0.5,
      phase: 0,
      subharmonicDepth: 0.3,
      texturalComplexity: 0.5,
      resonanceMode: 'constructive'
    };
  }

  private setupDSPChain(): void {
    // Master output
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.setValueAtTime(0.7, this.audioContext.currentTime);

    // Cross-polarization filter (Creates phase relationships between channels)
    this.crossPolarizer = this.audioContext.createBiquadFilter();
    this.crossPolarizer.type = 'allpass';
    this.crossPolarizer.frequency.setValueAtTime(528, this.audioContext.currentTime); // Love frequency
    this.crossPolarizer.Q.setValueAtTime(1.414, this.audioContext.currentTime); // Critical damping

    // Manifestation gate (Controls emergence from dark phase)
    this.manifestationGate = this.audioContext.createDynamicsCompressor();
    this.manifestationGate.threshold.setValueAtTime(-24, this.audioContext.currentTime);
    this.manifestationGate.knee.setValueAtTime(30, this.audioContext.currentTime);
    this.manifestationGate.ratio.setValueAtTime(12, this.audioContext.currentTime);
    this.manifestationGate.attack.setValueAtTime(0.003, this.audioContext.currentTime);
    this.manifestationGate.release.setValueAtTime(0.25, this.audioContext.currentTime);

    // Initialize shadow channels
    this.lightChannel = new ShadowChannel(this.audioContext, 'light');
    this.darkChannel = new ShadowChannel(this.audioContext, 'dark');

    // Connect DSP chain
    this.lightChannel.output.connect(this.crossPolarizer);
    this.darkChannel.output.connect(this.manifestationGate);
    
    this.crossPolarizer.connect(this.masterGain);
    this.manifestationGate.connect(this.masterGain);
    
    this.masterGain.connect(this.audioContext.destination);
  }

  private initializeAnalysis(): void {
    // Spectral analysis for each channel
    this.lightAnalyzer = this.audioContext.createAnalyser();
    this.darkAnalyzer = this.audioContext.createAnalyser();
    
    this.lightAnalyzer.fftSize = 2048;
    this.darkAnalyzer.fftSize = 2048;
    this.lightAnalyzer.smoothingTimeConstant = 0.8;
    this.darkAnalyzer.smoothingTimeConstant = 0.8;

    // Connect analyzers
    this.lightChannel.output.connect(this.lightAnalyzer);
    this.darkChannel.output.connect(this.darkAnalyzer);

    // Initialize spectral data arrays
    const bufferLength = this.lightAnalyzer.frequencyBinCount;
    this.spectralData = {
      light: new Float32Array(bufferLength),
      dark: new Float32Array(bufferLength),
      crossCorrelation: new Float32Array(bufferLength)
    };
  }

  /**
   * Core polarity processing method
   * This is where the mathematical magic happens
   */
  public processPolarityFrame(geometry: any, biofeedback?: BiofeedbackMetrics): void {
    if (!this.isActive) return;

    const currentTime = this.audioContext.currentTime;
    
    // 1. Update polarity balance based on biofeedback
    if (biofeedback) {
      this.updatePolarityFromBiofeedback(biofeedback);
    }

    // 2. Calculate phase relationships
    const phaseRelationship = this.calculatePhaseRelationship();
    
    // 3. Generate complementary waveforms
    this.generateComplementaryWaveforms(geometry, phaseRelationship);
    
    // 4. Apply dark energy drift
    this.applyDarkEnergyDrift(currentTime);
    
    // 5. Process manifestation gating
    this.processManifestationGating();
    
    // 6. Update spectral analysis
    this.updateSpectralAnalysis();
    
    // 7. Update state
    this.updateEngineState();
  }

  private updatePolarityFromBiofeedback(biofeedback: BiofeedbackMetrics): void {
    const { heartRateVariability, brainwaveActivity, breathingPattern } = biofeedback;
    
    // HRV influences polarity balance (higher HRV = more balanced)
    const hrvBalance = Math.tanh(heartRateVariability.coherenceRatio - 0.5) * 0.3;
    
    // Brainwave activity affects light/dark preference
    const alphaTheta = (brainwaveActivity.alpha + brainwaveActivity.theta) / 2;
    const betaGamma = (brainwaveActivity.beta + brainwaveActivity.gamma) / 2;
    const brainwavePolarity = Math.tanh((alphaTheta - betaGamma) * 0.1);
    
    // Breath coherence affects shadow intensity
    const breathCoherence = breathingPattern.coherence;
    this.state.shadowIntensity = Math.max(0, 1 - breathCoherence);
    
    // Combined polarity calculation
    this.polarityProtocol.polarityBalance = Math.tanh(
      hrvBalance + brainwavePolarity * 0.5
    );
    
    // Update state
    this.state.breathCoherence = breathCoherence;
    this.state.heartVariability = heartRateVariability.coherenceRatio;
    this.state.neuralEntrainment = brainwaveActivity.coherence;
    
    // Determine manifestation mode
    if (this.polarityProtocol.polarityBalance > 0.3) {
      this.state.manifestationMode = 'light';
      this.state.lightDominance = Math.abs(this.polarityProtocol.polarityBalance);
    } else if (this.polarityProtocol.polarityBalance < -0.3) {
      this.state.manifestationMode = 'dark';
      this.state.darkDominance = Math.abs(this.polarityProtocol.polarityBalance);
    } else {
      this.state.manifestationMode = 'balanced';
    }
  }

  private calculatePhaseRelationship(): number {
    // Sacred geometry phase calculation using golden ratio
    const phi = (1 + Math.sqrt(5)) / 2;
    const time = this.audioContext.currentTime;
    
    // Base phase from polarity balance
    const basePhase = this.polarityProtocol.polarityBalance * Math.PI;
    
    // Temporal modulation using Fibonacci sequence timing
    const fibonacciPhase = Math.sin(time / phi) * (Math.PI / 4);
    
    // Dark energy influence (cosmological expansion effect)
    const darkEnergyPhase = this.polarityProtocol.darkEnergyDrift.expansionFactor * 
                           Math.sin(time * this.polarityProtocol.darkEnergyDrift.driftRate);
    
    return basePhase + fibonacciPhase + darkEnergyPhase;
  }

  private generateComplementaryWaveforms(geometry: any, phaseRelationship: number): void {
    const fundamentalFreq = this.calculateFundamentalFromGeometry(geometry);
    
    // Light channel - constructive harmonics
    const lightConfig = this.polarityProtocol.lightChannel;
    if (lightConfig.enabled) {
      this.lightChannel.generateWaveform({
        frequency: fundamentalFreq,
        amplitude: lightConfig.amplitude * this.state.lightDominance,
        phase: lightConfig.phase + phaseRelationship,
        harmonics: this.generateLightHarmonics(fundamentalFreq),
        texturalComplexity: lightConfig.texturalComplexity
      });
    }
    
    // Dark channel - subharmonic and phase-cancelled harmonics
    const darkConfig = this.polarityProtocol.darkChannel;
    if (darkConfig.enabled) {
      this.darkChannel.generateWaveform({
        frequency: fundamentalFreq / 2, // Subharmonic foundation
        amplitude: darkConfig.amplitude * this.state.darkDominance,
        phase: darkConfig.phase + phaseRelationship + Math.PI, // Phase opposition
        harmonics: this.generateDarkHarmonics(fundamentalFreq),
        texturalComplexity: darkConfig.texturalComplexity,
        subharmonicDepth: darkConfig.subharmonicDepth
      });
    }
  }

  private calculateFundamentalFromGeometry(geometry: any): number {
    // Sacred geometry frequency mapping
    if (!geometry) return 528; // Default to love frequency
    
    const volume = geometry.volume || 1;
    const surfaceArea = geometry.surfaceArea || 1;
    const symmetryOrder = geometry.symmetryOrder || 1;
    
    // Geometric resonance calculation
    const geometricRatio = Math.sqrt(surfaceArea / volume);
    const baseFreq = 256 * geometricRatio; // Base on sacred A (256 Hz)
    
    // Apply symmetry scaling
    return baseFreq * Math.pow(2, Math.log2(symmetryOrder) / 12);
  }

  private generateLightHarmonics(fundamental: number): number[] {
    // Constructive harmonic series based on sacred ratios
    const phi = (1 + Math.sqrt(5)) / 2;
    return [
      fundamental,
      fundamental * 2,     // Octave
      fundamental * 3,     // Perfect fifth
      fundamental * phi,   // Golden ratio
      fundamental * 5,     // Major third
      fundamental * Math.PI, // Pi ratio
    ];
  }

  private generateDarkHarmonics(fundamental: number): number[] {
    // Subharmonic series with phase cancellation potential
    return [
      fundamental / 2,     // Subharmonic foundation
      fundamental / 3,     // Subharmonic fifth
      fundamental / 4,     // Double subharmonic
      fundamental * 0.618, // Inverse golden ratio
      fundamental / Math.PI, // Inverse pi ratio
    ];
  }

  private applyDarkEnergyDrift(currentTime: number): void {
    const drift = this.polarityProtocol.darkEnergyDrift;
    
    // Simulate cosmological expansion
    const expansionRate = 1 + (drift.driftRate * currentTime);
    drift.expansionFactor = expansionRate;
    
    // Apply quantum fluctuation
    const fluctuation = (Math.random() - 0.5) * drift.quantumFluctuation;
    
    // Update dark channel frequency drift
    this.darkChannel.applyFrequencyDrift(expansionRate + fluctuation);
    
    // Void resonance effect
    if (drift.voidResonance) {
      this.darkChannel.applyVoidResonance(drift.darkMatterDensity);
    }
  }

  private processManifestationGating(): void {
    if (this.polarityProtocol.manifestInDark) {
      // When manifesting in dark, compress light channel and expand dark
      const compressionRatio = 1 - this.state.darkDominance;
      this.manifestationGate.ratio.setValueAtTime(
        8 + (compressionRatio * 12),
        this.audioContext.currentTime
      );
    } else {
      // Normal manifestation - balanced compression
      this.manifestationGate.ratio.setValueAtTime(6, this.audioContext.currentTime);
    }
  }

  private updateSpectralAnalysis(): void {
    // Get frequency data from both channels
    this.lightAnalyzer.getFloatFrequencyData(this.spectralData.light);
    this.darkAnalyzer.getFloatFrequencyData(this.spectralData.dark);
    
    // Calculate cross-correlation between channels
    for (let i = 0; i < this.spectralData.light.length; i++) {
      this.spectralData.crossCorrelation[i] = 
        this.spectralData.light[i] * this.spectralData.dark[i];
    }
    
    // Update polarity balance based on spectral relationship
    const lightEnergy = this.calculateSpectralEnergy(this.spectralData.light);
    const darkEnergy = this.calculateSpectralEnergy(this.spectralData.dark);
    
    this.state.polarityBalance = (lightEnergy - darkEnergy) / (lightEnergy + darkEnergy + 0.001);
  }

  private calculateSpectralEnergy(spectrum: Float32Array): number {
    let energy = 0;
    for (let i = 0; i < spectrum.length; i++) {
      energy += spectrum[i] * spectrum[i];
    }
    return Math.sqrt(energy / spectrum.length);
  }

  private updateEngineState(): void {
    // Determine current phase based on polarity and manifestation mode
    if (this.state.manifestationMode === 'dark' && this.state.shadowIntensity > 0.7) {
      this.state.currentPhase = 'dark';
    } else if (this.state.manifestationMode === 'light' && this.state.shadowIntensity < 0.3) {
      this.state.currentPhase = 'light';
    } else if (Math.abs(this.state.polarityBalance) < 0.1) {
      this.state.currentPhase = 'transition';
    } else {
      this.state.currentPhase = this.state.shadowIntensity > 0.9 ? 'void' : 'transition';
    }
    
    this.state.isActive = this.isActive;
  }

  // Public API Methods
  public start(): void {
    this.isActive = true;
    this.lightChannel.start();
    this.darkChannel.start();
  }

  public stop(): void {
    this.isActive = false;
    this.lightChannel.stop();
    this.darkChannel.stop();
  }

  public updatePolarityProtocol(protocol: Partial<PolarityProtocol>): void {
    this.polarityProtocol = { ...this.polarityProtocol, ...protocol };
  }

  public getState(): ShadowEngineState {
    return { ...this.state };
  }

  public getSpectralData(): typeof this.spectralData {
    return this.spectralData;
  }

  public setPolarityBalance(balance: number): void {
    this.polarityProtocol.polarityBalance = Math.max(-1, Math.min(1, balance));
  }

  public enableManifestInDark(enabled: boolean): void {
    this.polarityProtocol.manifestInDark = enabled;
  }

  public triggerShadowPhase(intensity: number = 0.8): void {
    this.state.shadowIntensity = intensity;
    this.state.currentPhase = 'dark';
    this.darkChannel.triggerShadowPhase(intensity);
  }

  public emergencyStop(): void {
    this.stop();
    this.masterGain.gain.exponentialRampToValueAtTime(
      0.001, 
      this.audioContext.currentTime + 0.1
    );
  }
}

/**
 * Individual Shadow Channel - Handles light or dark polarity processing
 */
class ShadowChannel {
  public output: GainNode;
  private oscillators: OscillatorNode[] = [];
  private gainNodes: GainNode[] = [];
  private filters: BiquadFilterNode[] = [];
  private channelType: 'light' | 'dark';
  private audioContext: AudioContext;

  constructor(audioContext: AudioContext, type: 'light' | 'dark') {
    this.audioContext = audioContext;
    this.channelType = type;
    this.output = audioContext.createGain();
    this.output.gain.setValueAtTime(0.5, audioContext.currentTime);
  }

  public generateWaveform(params: {
    frequency: number;
    amplitude: number;
    phase: number;
    harmonics: number[];
    texturalComplexity: number;
    subharmonicDepth?: number;
  }): void {
    // Clear existing oscillators
    this.clearOscillators();

    params.harmonics.forEach((freq, index) => {
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();
      const filter = this.audioContext.createBiquadFilter();

      // Configure oscillator
      osc.type = this.channelType === 'light' ? 'sine' : 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.audioContext.currentTime);

      // Configure gain (harmonic amplitude decay)
      const harmonicGain = params.amplitude / Math.pow(index + 1, 0.7);
      gain.gain.setValueAtTime(harmonicGain, this.audioContext.currentTime);

      // Configure filter based on channel type
      if (this.channelType === 'light') {
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(freq * 0.5, this.audioContext.currentTime);
      } else {
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 2, this.audioContext.currentTime);
      }

      // Connect nodes
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.output);

      // Store references
      this.oscillators.push(osc);
      this.gainNodes.push(gain);
      this.filters.push(filter);

      // Start oscillator
      osc.start();
    });
  }

  public applyFrequencyDrift(driftFactor: number): void {
    this.oscillators.forEach((osc, index) => {
      const baseFreq = osc.frequency.value;
      osc.frequency.exponentialRampToValueAtTime(
        baseFreq * driftFactor,
        this.audioContext.currentTime + 0.1
      );
    });
  }

  public applyVoidResonance(darkMatterDensity: number): void {
    // Simulate dark matter gravitational effects on frequency
    const gravitationalRedshift = 1 - (darkMatterDensity * 0.1);
    this.applyFrequencyDrift(gravitationalRedshift);
  }

  public triggerShadowPhase(intensity: number): void {
    if (this.channelType === 'dark') {
      // Amplify dark channel during shadow phase
      this.output.gain.exponentialRampToValueAtTime(
        intensity,
        this.audioContext.currentTime + 0.2
      );
    } else {
      // Reduce light channel during shadow phase
      this.output.gain.exponentialRampToValueAtTime(
        1 - intensity,
        this.audioContext.currentTime + 0.2
      );
    }
  }

  public start(): void {
    this.output.gain.exponentialRampToValueAtTime(
      0.5,
      this.audioContext.currentTime + 0.1
    );
  }

  public stop(): void {
    this.output.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + 0.1
    );
    
    // Stop all oscillators after fade
    setTimeout(() => {
      this.clearOscillators();
    }, 200);
  }

  private clearOscillators(): void {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Oscillator might already be stopped
      }
    });
    
    this.gainNodes.forEach(gain => gain.disconnect());
    this.filters.forEach(filter => filter.disconnect());
    
    this.oscillators = [];
    this.gainNodes = [];
    this.filters = [];
  }
}