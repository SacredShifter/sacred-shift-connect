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

export class MultiScaleLayerManager {
  private layers: LayerHierarchy;
  private state: MultiScaleState;
  private geometricNormalizer: GeometricNormalizer;
  private breathRate: number = 0.1; // Hz, very slow for deep states
  private startTime: number = performance.now();

  constructor() {
    this.geometricNormalizer = new GeometricNormalizer();
    
    // Initialize layer hierarchy with biologically-inspired parameters
    this.layers = {
      atomic: {
        active: true,
        weight: 0.1,
        frequency: 0.001, // Very fast, quantum-like
        phase: 0,
        resonance: 0.95
      },
      molecular: {
        active: true,
        weight: 0.15,
        frequency: 0.01,
        phase: Math.PI / 6,
        resonance: 0.8
      },
      cellular: {
        active: true,
        weight: 0.2,
        frequency: 0.1,
        phase: Math.PI / 4,
        resonance: 0.7
      },
      tissue: {
        active: true,
        weight: 0.25,
        frequency: 1.0,
        phase: Math.PI / 3,
        resonance: 0.6
      },
      organ: {
        active: true,
        weight: 0.2,
        frequency: 10.0,
        phase: Math.PI / 2,
        resonance: 0.5
      },
      organism: {
        active: true,
        weight: 0.1,
        frequency: 100.0, // Slowest, most integrated
        phase: Math.PI,
        resonance: 0.3
      }
    };

    // Initialize state
    this.state = {
      breathPhase: 0,
      globalCoherence: 0.5,
      energyDistribution: [0.1, 0.15, 0.2, 0.25, 0.2, 0.1],
      layerSyncRatio: 0.8,
      currentLayer: 'cellular' // Start at cellular level
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
    
    // Update each layer phase based on breath and its natural frequency
    Object.keys(this.layers).forEach((layerId, index) => {
      const layer = this.layers[layerId as keyof LayerHierarchy];
      
      if (layer.active) {
        // Each layer oscillates at its natural frequency
        layer.phase += deltaTime * layer.frequency * 2 * Math.PI;
        layer.phase %= (2 * Math.PI);
        
        // Breath coupling - higher layers more coupled to breath
        const breathCoupling = 0.1 + (index / 6) * 0.4;
        layer.weight = layer.weight * (1 + breathInfluence * breathCoupling * 0.3);
        
        // Ensure weight stays in bounds
        layer.weight = Math.max(0.01, Math.min(1.0, layer.weight));
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

    // Generate faces (simple triangulation for now)
    const faces: number[][] = [];
    for (let i = 0; i < vertices.length - 2; i++) {
      faces.push([0, i + 1, i + 2]);
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
   * Atomic orbital patterns (s, p, d orbitals)
   */
  private generateOrbitalPattern(t: number, phase: number, scale: number): number[] {
    const r = scale * (1 + 0.3 * Math.sin(3 * t + phase));
    return [
      r * Math.cos(t) * Math.sin(2 * t + phase),
      r * Math.sin(t) * Math.sin(2 * t + phase),
      r * Math.cos(2 * t + phase) * 0.5
    ];
  }

  /**
   * Molecular bond patterns
   */
  private generateMolecularPattern(t: number, phase: number, scale: number): number[] {
    const r = scale * (1 + 0.2 * Math.cos(4 * t + phase));
    return [
      r * Math.cos(t + phase),
      r * Math.sin(t + phase) * Math.cos(phase),
      r * Math.sin(2 * t + phase) * 0.3
    ];
  }

  /**
   * Cellular membrane oscillations
   */
  private generateCellularPattern(t: number, phase: number, scale: number): number[] {
    const membrane = 1 + 0.15 * Math.sin(6 * t + phase);
    const r = scale * membrane;
    return [
      r * Math.cos(t),
      r * Math.sin(t),
      scale * 0.2 * Math.sin(3 * t + phase)
    ];
  }

  /**
   * Tissue fiber patterns
   */
  private generateTissuePattern(t: number, phase: number, scale: number): number[] {
    const fiber = 1 + 0.1 * Math.sin(8 * t + phase);
    const r = scale * fiber;
    return [
      r * Math.cos(t + phase * 0.5),
      r * Math.sin(t + phase * 0.5) * 0.8,
      scale * 0.4 * Math.cos(2 * t + phase)
    ];
  }

  /**
   * Organ rhythm patterns
   */
  private generateOrganPattern(t: number, phase: number, scale: number): number[] {
    const rhythm = 1 + 0.25 * Math.sin(t + phase);
    const r = scale * rhythm;
    return [
      r * Math.cos(t),
      r * Math.sin(t),
      scale * 0.6 * Math.sin(t + phase) * Math.cos(2 * t)
    ];
  }

  /**
   * Organism integration patterns
   */
  private generateOrganismPattern(t: number, phase: number, scale: number): number[] {
    const integration = 1 + 0.4 * Math.sin(0.5 * t + phase);
    const r = scale * integration;
    return [
      r * Math.cos(t) * (1 + 0.1 * Math.sin(5 * t + phase)),
      r * Math.sin(t) * (1 + 0.1 * Math.cos(5 * t + phase)),
      scale * 0.8 * Math.sin(t + phase)
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