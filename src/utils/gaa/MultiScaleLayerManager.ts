import Delaunator from 'delaunator';
import { NormalizedGeometry } from './GeometricOscillator';
import { GeometricNormalizer } from './GeometricNormalizer';

export interface LayerHierarchy {
  atomic: LayerState;
  molecular: LayerState;
  cellular: LayerState;
  tissue: LayerState;
  organ: LayerState;
  organism: LayerState;
}

export interface LayerState {
  active: boolean;
  weight: number;
  frequency: number;
  phase: number;
  resonance: number;
}

export interface MultiScaleState {
  breathPhase: number;
  globalCoherence: number;
  energyDistribution: number[];
  layerSyncRatio: number;
  currentLayer: keyof LayerHierarchy;
}

const DEFAULT_BREATH_RATE_HZ = 0.1;

// Constants for layer generation, separated for clarity and maintainability
const LAYER_PARAMS = {
  // Biologically-inspired layer properties
  HIERARCHY_DEFAULTS: {
    atomic:    { active: true, weight: 0.10, frequency: 0.001, phase: 0,           resonance: 0.95 },
    molecular: { active: true, weight: 0.15, frequency: 0.01,  phase: Math.PI / 6, resonance: 0.80 },
    cellular:  { active: true, weight: 0.20, frequency: 0.1,   phase: Math.PI / 4, resonance: 0.70 },
    tissue:    { active: true, weight: 0.25, frequency: 1.0,   phase: Math.PI / 3, resonance: 0.60 },
    organ:     { active: true, weight: 0.20, frequency: 10.0,  phase: Math.PI / 2, resonance: 0.50 },
    organism:  { active: true, weight: 0.10, frequency: 100.0, phase: Math.PI,     resonance: 0.30 },
  },
  // Parameters for breath influence calculation
  BREATH_COUPLING: {
    BASE: 0.1,
    SCALE_FACTOR: 0.4,
    INFLUENCE_FACTOR: 0.3,
    MIN_WEIGHT: 0.01,
    MAX_WEIGHT: 1.0,
  },
  // Parameters for geometric pattern generation
  GEOMETRY: {
    atomic:    { amp: 0.3, freq1: 3, freq2: 2, z_factor: 0.5 },
    molecular: { amp: 0.2, freq: 4, z_factor: 0.3 },
    cellular:  { amp: 0.15, freq: 6, z_factor: 0.2 },
    tissue:    { amp: 0.1, freq: 8, y_factor: 0.8, z_factor: 0.4 },
    organ:     { amp: 0.25, freq: 1, z_factor: 0.6 },
    organism:  { amp: 0.4, freq: 0.5, sub_amp: 0.1, sub_freq: 5, z_factor: 0.8 },
  }
};

export class MultiScaleLayerManager {
  private layers: LayerHierarchy;
  private state: MultiScaleState;
  private geometricNormalizer: GeometricNormalizer;
  private breathRate: number = DEFAULT_BREATH_RATE_HZ;
  private startTime: number = performance.now();

  constructor() {
    this.geometricNormalizer = new GeometricNormalizer();
    
    // Initialize layer hierarchy with biologically-inspired parameters
    this.layers = JSON.parse(JSON.stringify(LAYER_PARAMS.HIERARCHY_DEFAULTS));

    // Initialize state
    const initialWeights = Object.values(this.layers).map(l => l.weight);
    this.state = {
      breathPhase: 0,
      globalCoherence: 0.5,
      energyDistribution: initialWeights,
      layerSyncRatio: 0.8,
      currentLayer: 'cellular'
    };
  }

  /**
   * Update breath phase and cascade through layers
   */
  updateBreathPhase(deltaTime: number): void {
    // Update breath phase
    this.state.breathPhase += deltaTime * this.breathRate * 2 * Math.PI;
    this.state.breathPhase %= (2 * Math.PI);

    // Calculate breath influence (sine wave for inhale/exhale)
    const breathInfluence = Math.sin(this.state.breathPhase);
    const C = LAYER_PARAMS.BREATH_COUPLING;
    
    // Update each layer phase based on breath and its natural frequency
    Object.keys(this.layers).forEach((layerId, index) => {
      const layer = this.layers[layerId as keyof LayerHierarchy];
      
      if (layer.active) {
        // Each layer oscillates at its natural frequency
        layer.phase += deltaTime * layer.frequency * 2 * Math.PI;
        layer.phase %= (2 * Math.PI);
        
        // Breath coupling - higher layers more coupled to breath
        const breathCoupling = C.BASE + (index / 6) * C.SCALE_FACTOR;
        layer.weight = layer.weight * (1 + breathInfluence * breathCoupling * C.INFLUENCE_FACTOR);
        
        // Ensure weight stays in bounds
        layer.weight = Math.max(C.MIN_WEIGHT, Math.min(C.MAX_WEIGHT, layer.weight));
      }
    });

    // Update global coherence based on layer synchronization
    this.updateGlobalCoherence();
  }

  /**
   * Generate composite geometry from active layers
   */
  generateCompositeGeometry(targetPoints: number = 8): NormalizedGeometry[] {
    const geometries: NormalizedGeometry[] = [];
    const activeLayerIds = Object.keys(this.layers).filter(
      id => this.layers[id as keyof LayerHierarchy].active
    );

    // Generate geometry for each active layer
    activeLayerIds.forEach((layerId, index) => {
      const layer = this.layers[layerId as keyof LayerHierarchy];
      const pointsForLayer = Math.ceil(targetPoints * layer.weight);
      
      if (pointsForLayer > 0) {
        const layerGeometry = this.generateLayerGeometry(
          layerId as keyof LayerHierarchy, 
          layer, 
          pointsForLayer,
          index
        );
        geometries.push(layerGeometry);
      }
    });

    return geometries;
  }

  /**
   * Generate geometry for specific layer
   */
  private generateLayerGeometry(
    layerId: keyof LayerHierarchy, 
    layer: LayerState, 
    pointCount: number,
    layerIndex: number
  ): NormalizedGeometry {
    const vertices: number[][] = [];
    const time = (performance.now() - this.startTime) / 1000;
    
    // Layer-specific geometric patterns
    for (let i = 0; i < pointCount; i++) {
      const t = (i / pointCount) * 2 * Math.PI;
      let vertex: number[];
      
      switch (layerId) {
        case 'atomic':
          // Quantum-like electron orbital patterns
          vertex = this.generateOrbitalPattern(t, layer.phase, 0.1);
          break;
          
        case 'molecular':
          // Molecular bond patterns
          vertex = this.generateMolecularPattern(t, layer.phase, 0.3);
          break;
          
        case 'cellular':
          // Cellular membrane oscillations
          vertex = this.generateCellularPattern(t, layer.phase, 0.5);
          break;
          
        case 'tissue':
          // Tissue fiber alignment patterns
          vertex = this.generateTissuePattern(t, layer.phase, 0.7);
          break;
          
        case 'organ':
          // Organ rhythm patterns (heart, lung, etc.)
          vertex = this.generateOrganPattern(t, layer.phase, 0.9);
          break;
          
        case 'organism':
          // Whole-body integration patterns
          vertex = this.generateOrganismPattern(t, layer.phase, 1.0);
          break;
          
        default:
          vertex = [Math.cos(t), Math.sin(t), 0];
      }
      
      vertices.push(vertex);
    }

    // Generate faces using Delaunay triangulation for correctness
    const faces: number[][] = [];
    if (vertices.length >= 3) {
      const delaunay = Delaunator.from(vertices.map(v => [v[0], v[1]]));
      for (let i = 0; i < delaunay.triangles.length; i += 3) {
        faces.push([delaunay.triangles[i], delaunay.triangles[i+1], delaunay.triangles[i+2]]);
      }
    }

    // Calculate normals
    const normals: number[][] = vertices.map(() => [0, 0, 1]);

    return this.geometricNormalizer.normalize({
      vertices,
      faces,
      normals,
      center: [0, 0, 0],
      radius: layer.weight,
      sacredRatios: {
        phi: 1.618033988749,
        pi: Math.PI,
        sqrt2: Math.sqrt(2)
      }
    });
  }

  /**
   * Generates a point cloud resembling quantum-like electron orbital patterns.
   * Uses Lissajous-like figures in 3D space to create complex, nested shapes.
   * @param t - The normalized position along the curve (0 to 2π).
   * @param phase - The current phase offset for this layer.
   * @param scale - The overall scale of the geometry.
   * @returns A 3D vertex coordinate.
   */
  private generateOrbitalPattern(t: number, phase: number, scale: number): number[] {
    const C = LAYER_PARAMS.GEOMETRY.atomic;
    const r = scale * (1 + C.amp * Math.sin(C.freq1 * t + phase));
    return [
      r * Math.cos(t) * Math.sin(C.freq2 * t + phase),
      r * Math.sin(t) * Math.sin(C.freq2 * t + phase),
      r * Math.cos(C.freq2 * t + phase) * C.z_factor
    ];
  }

  /**
   * Generates a point cloud resembling molecular bond patterns.
   * Creates a twisted, helix-like structure.
   * @param t - The normalized position along the curve (0 to 2π).
   * @param phase - The current phase offset for this layer.
   * @param scale - The overall scale of the geometry.
   * @returns A 3D vertex coordinate.
   */
  private generateMolecularPattern(t: number, phase: number, scale: number): number[] {
    const C = LAYER_PARAMS.GEOMETRY.molecular;
    const r = scale * (1 + C.amp * Math.cos(C.freq * t + phase));
    return [
      r * Math.cos(t + phase),
      r * Math.sin(t + phase) * Math.cos(phase),
      r * Math.sin(2 * t + phase) * C.z_factor
    ];
  }

  /**
   * Generates a point cloud resembling the oscillation of a cellular membrane.
   * Creates a wobbling, spherical shape.
   * @param t - The normalized position along the curve (0 to 2π).
   * @param phase - The current phase offset for this layer.
   * @param scale - The overall scale of the geometry.
   * @returns A 3D vertex coordinate.
   */
  private generateCellularPattern(t: number, phase: number, scale: number): number[] {
    const C = LAYER_PARAMS.GEOMETRY.cellular;
    const membrane = 1 + C.amp * Math.sin(C.freq * t + phase);
    const r = scale * membrane;
    return [
      r * Math.cos(t),
      r * Math.sin(t),
      scale * C.z_factor * Math.sin(3 * t + phase)
    ];
  }

  /**
   * Generates a point cloud resembling aligned tissue fibers.
   * Creates an elongated, slightly twisted shape.
   * @param t - The normalized position along the curve (0 to 2π).
   * @param phase - The current phase offset for this layer.
   * @param scale - The overall scale of the geometry.
   * @returns A 3D vertex coordinate.
   */
  private generateTissuePattern(t: number, phase: number, scale: number): number[] {
    const C = LAYER_PARAMS.GEOMETRY.tissue;
    const fiber = 1 + C.amp * Math.sin(C.freq * t + phase);
    const r = scale * fiber;
    return [
      r * Math.cos(t + phase * 0.5),
      r * Math.sin(t + phase * 0.5) * C.y_factor,
      scale * C.z_factor * Math.cos(2 * t + phase)
    ];
  }

  /**
   * Generates a point cloud resembling the rhythmic pulse of an organ.
   * Creates a complex, cardioid-like pulsating shape.
   * @param t - The normalized position along the curve (0 to 2π).
   * @param phase - The current phase offset for this layer.
   * @param scale - The overall scale of the geometry.
   * @returns A 3D vertex coordinate.
   */
  private generateOrganPattern(t: number, phase: number, scale: number): number[] {
    const C = LAYER_PARAMS.GEOMETRY.organ;
    const rhythm = 1 + C.amp * Math.sin(C.freq * t + phase);
    const r = scale * rhythm;
    return [
      r * Math.cos(t),
      r * Math.sin(t),
      scale * C.z_factor * Math.sin(t + phase) * Math.cos(2 * t)
    ];
  }

  /**
   * Generates a point cloud resembling an integrated, whole organism.
   * Creates a large, slowly modulating toroidal field.
   * @param t - The normalized position along the curve (0 to 2π).
   * @param phase - The current phase offset for this layer.
   * @param scale - The overall scale of the geometry.
   * @returns A 3D vertex coordinate.
   */
  private generateOrganismPattern(t: number, phase: number, scale: number): number[] {
    const C = LAYER_PARAMS.GEOMETRY.organism;
    const integration = 1 + C.amp * Math.sin(C.freq * t + phase);
    const r = scale * integration;
    return [
      r * Math.cos(t) * (1 + C.sub_amp * Math.sin(C.sub_freq * t + phase)),
      r * Math.sin(t) * (1 + C.sub_amp * Math.cos(C.sub_freq * t + phase)),
      scale * C.z_factor * Math.sin(t + phase)
    ];
  }

  /**
   * Update global coherence based on layer synchronization
   */
  private updateGlobalCoherence(): void {
    let coherenceSum = 0;
    let activeCount = 0;

    // Calculate phase coherence between adjacent layers
    const layerIds = Object.keys(this.layers) as (keyof LayerHierarchy)[];
    for (let i = 0; i < layerIds.length - 1; i++) {
      const layer1 = this.layers[layerIds[i]];
      const layer2 = this.layers[layerIds[i + 1]];
      
      if (layer1.active && layer2.active) {
        const phaseDiff = Math.abs(layer1.phase - layer2.phase);
        const coherence = Math.cos(phaseDiff) * layer1.resonance * layer2.resonance;
        coherenceSum += coherence;
        activeCount++;
      }
    }

    this.state.globalCoherence = activeCount > 0 ? coherenceSum / activeCount : 0.5;
    
    // Update layer sync ratio
    this.state.layerSyncRatio = Math.max(0, Math.min(1, this.state.globalCoherence + 0.5));
  }

  /**
   * Toggle layer activation
   */
  toggleLayer(layerId: keyof LayerHierarchy): void {
    this.layers[layerId].active = !this.layers[layerId].active;
    
    // Rebalance energy distribution
    this.rebalanceEnergyDistribution();
  }

  /**
   * Rebalance energy distribution across active layers
   */
  private rebalanceEnergyDistribution(): void {
    const activeLayerIds = Object.keys(this.layers).filter(
      id => this.layers[id as keyof LayerHierarchy].active
    );
    
    const baseWeight = 1.0 / activeLayerIds.length;
    
    activeLayerIds.forEach((layerId, index) => {
      const layer = this.layers[layerId as keyof LayerHierarchy];
      // Maintain some variation while ensuring active layers get adequate weight
      layer.weight = baseWeight * (0.5 + Math.random() * 0.5);
    });

    // Update energy distribution array
    this.state.energyDistribution = Object.values(this.layers).map(layer => 
      layer.active ? layer.weight : 0
    );
  }

  /**
   * Set breath rate (affects all layer coupling)
   */
  setBreathRate(rateHz: number): void {
    this.breathRate = Math.max(0.01, Math.min(1.0, rateHz));
  }

  /**
   * Get current layer states
   */
  getState(): MultiScaleState & { layers: LayerHierarchy } {
    return {
      ...this.state,
      layers: { ...this.layers }
    };
  }

  /**
   * Reset all layers to default state
   */
  reset(): void {
    this.startTime = performance.now();
    this.state.breathPhase = 0;
    
    // Reset layer phases
    Object.values(this.layers).forEach(layer => {
      layer.phase = 0;
    });
  }
}