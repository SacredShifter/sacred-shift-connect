import { Vector3 } from 'three';
import { NormalizedGeometry } from './GeometricNormalizer';

export interface OscillatorParams {
  baseFrequency: number;
  gainLevel: number;
  waveform: 'sine' | 'triangle' | 'sawtooth' | 'square';
  modulationDepth: number;
  spatialPanning: boolean;
}

export interface SpatialAudioState {
  position: Vector3;
  velocity: Vector3;
  pannerNode?: PannerNode;
  gainNode?: GainNode;
  oscillatorNode?: OscillatorNode;
}

/**
 * Geometric oscillator for GAA 3D audio synthesis
 * Maps normalized geometry to deterministic audio parameters
 */
export class GeometricOscillator {
  private audioContext: AudioContext;
  private masterGain: GainNode;
  private spatialNodes: Map<string, SpatialAudioState> = new Map();
  private params: OscillatorParams;

  constructor(audioContext: AudioContext, params: Partial<OscillatorParams> = {}) {
    this.audioContext = audioContext;
    this.params = {
      baseFrequency: 440,
      gainLevel: 0.3,
      waveform: 'sine',
      modulationDepth: 0.1,
      spatialPanning: true,
      ...params
    };

    this.masterGain = audioContext.createGain();
    this.masterGain.gain.setValueAtTime(this.params.gainLevel, audioContext.currentTime);
    this.masterGain.connect(audioContext.destination);
  }

  /**
   * Create oscillator from normalized geometry
   * Frequency mapping: f = f_base * 2^(scale * octaves + curvature_offset)
   */
  createGeometricOscillator(
    geometry: NormalizedGeometry,
    nodeId: string,
    octaveRange: number = 3
  ): SpatialAudioState {
    // Deterministic frequency mapping
    const frequency = this.params.baseFrequency * Math.pow(2, 
      geometry.scale * octaveRange + 
      geometry.curvature * 0.5 + 
      geometry.torsion * 0.25 - octaveRange/2
    );

    // Create audio nodes
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    // Configure oscillator
    oscillator.type = this.params.waveform;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    // Geometric gain modulation
    const geometricGain = (geometry.curvature * 0.6 + geometry.torsion * 0.4) * this.params.gainLevel;
    gainNode.gain.setValueAtTime(geometricGain, this.audioContext.currentTime);

    let pannerNode: PannerNode | undefined;
    
    if (this.params.spatialPanning) {
      pannerNode = this.audioContext.createPanner();
      pannerNode.panningModel = 'HRTF';
      pannerNode.distanceModel = 'inverse';
      pannerNode.refDistance = 1;
      pannerNode.maxDistance = 10000;
      pannerNode.rolloffFactor = 1;

      // Set 3D position from geometry
      pannerNode.positionX.setValueAtTime(geometry.position.x, this.audioContext.currentTime);
      pannerNode.positionY.setValueAtTime(geometry.position.y, this.audioContext.currentTime);
      pannerNode.positionZ.setValueAtTime(geometry.position.z, this.audioContext.currentTime);

      // Connect: oscillator → gain → panner → master
      oscillator.connect(gainNode);
      gainNode.connect(pannerNode);
      pannerNode.connect(this.masterGain);
    } else {
      // Connect: oscillator → gain → master  
      oscillator.connect(gainNode);
      gainNode.connect(this.masterGain);
    }

    const spatialState: SpatialAudioState = {
      position: geometry.position.clone(),
      velocity: new Vector3(),
      pannerNode,
      gainNode,
      oscillatorNode: oscillator
    };

    this.spatialNodes.set(nodeId, spatialState);
    
    // Start oscillator
    oscillator.start();

    return spatialState;
  }

  /**
   * Update oscillator parameters from geometry
   */
  updateGeometricOscillator(
    nodeId: string, 
    geometry: NormalizedGeometry,
    octaveRange: number = 3
  ): void {
    const spatialState = this.spatialNodes.get(nodeId);
    if (!spatialState || !spatialState.oscillatorNode || !spatialState.gainNode) return;

    const now = this.audioContext.currentTime;

    // Update frequency
    const frequency = this.params.baseFrequency * Math.pow(2, 
      geometry.scale * octaveRange + 
      geometry.curvature * 0.5 + 
      geometry.torsion * 0.25 - octaveRange/2
    );
    
    spatialState.oscillatorNode.frequency.linearRampToValueAtTime(frequency, now + 0.1);

    // Update gain
    const geometricGain = (geometry.curvature * 0.6 + geometry.torsion * 0.4) * this.params.gainLevel;
    spatialState.gainNode.gain.linearRampToValueAtTime(geometricGain, now + 0.1);

    // Update 3D position
    if (spatialState.pannerNode && this.params.spatialPanning) {
      spatialState.pannerNode.positionX.linearRampToValueAtTime(geometry.position.x, now + 0.1);
      spatialState.pannerNode.positionY.linearRampToValueAtTime(geometry.position.y, now + 0.1);
      spatialState.pannerNode.positionZ.linearRampToValueAtTime(geometry.position.z, now + 0.1);
    }

    spatialState.position.copy(geometry.position);
  }

  /**
   * Create musical scale mapping
   * Maps normalized values to pentatonic/chromatic scales
   */
  createMusicalMapping(
    geometries: NormalizedGeometry[],
    scale: 'pentatonic' | 'chromatic' | 'dorian' = 'pentatonic'
  ): number[] {
    const scaleIntervals = {
      pentatonic: [0, 2, 4, 7, 9], // Major pentatonic intervals
      chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      dorian: [0, 2, 3, 5, 7, 9, 10]
    };

    const intervals = scaleIntervals[scale];
    
    return geometries.map(geometry => {
      // Map scale to musical intervals
      const scaleIndex = Math.floor(geometry.scale * intervals.length);
      const semitone = intervals[scaleIndex % intervals.length];
      
      // Add octave from curvature
      const octave = Math.floor(geometry.curvature * 4) * 12;
      
      return this.params.baseFrequency * Math.pow(2, (semitone + octave) / 12);
    });
  }

  /**
   * Stop and cleanup oscillator
   */
  stopOscillator(nodeId: string): void {
    const spatialState = this.spatialNodes.get(nodeId);
    if (!spatialState || !spatialState.oscillatorNode) return;

    spatialState.oscillatorNode.stop();
    spatialState.oscillatorNode.disconnect();
    
    if (spatialState.gainNode) spatialState.gainNode.disconnect();
    if (spatialState.pannerNode) spatialState.pannerNode.disconnect();
    
    this.spatialNodes.delete(nodeId);
  }

  /**
   * Stop all oscillators
   */
  stopAll(): void {
    this.spatialNodes.forEach((_, nodeId) => {
      this.stopOscillator(nodeId);
    });
  }

  /**
   * Update master parameters
   */
  updateParams(newParams: Partial<OscillatorParams>): void {
    this.params = { ...this.params, ...newParams };
    this.masterGain.gain.setValueAtTime(this.params.gainLevel, this.audioContext.currentTime);
  }

  /**
   * Set listener position for 3D audio
   */
  setListenerPosition(position: Vector3, forward: Vector3, up: Vector3): void {
    if (this.audioContext.listener.positionX) {
      this.audioContext.listener.positionX.setValueAtTime(position.x, this.audioContext.currentTime);
      this.audioContext.listener.positionY.setValueAtTime(position.y, this.audioContext.currentTime);
      this.audioContext.listener.positionZ.setValueAtTime(position.z, this.audioContext.currentTime);
      
      this.audioContext.listener.forwardX.setValueAtTime(forward.x, this.audioContext.currentTime);
      this.audioContext.listener.forwardY.setValueAtTime(forward.y, this.audioContext.currentTime);
      this.audioContext.listener.forwardZ.setValueAtTime(forward.z, this.audioContext.currentTime);
      
      this.audioContext.listener.upX.setValueAtTime(up.x, this.audioContext.currentTime);
      this.audioContext.listener.upY.setValueAtTime(up.y, this.audioContext.currentTime);
      this.audioContext.listener.upZ.setValueAtTime(up.z, this.audioContext.currentTime);
    }
  }
}