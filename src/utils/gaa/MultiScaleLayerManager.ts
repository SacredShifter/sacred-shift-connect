import { Vector3 } from 'three';
import { ToroidalHelixGeometry, ToroidalHelixPoint } from './ToroidalHelixGeometry';
import { GeometricNormalizer, NormalizedGeometry } from './GeometricNormalizer';

export interface ScaleLayer {
  id: string;
  name: string;
  weight: number;           // w_i ∈ [0,1]
  timeWarp: number;         // ω_i scaling factor
  breathModulation: number; // η_i breath coupling
  geometry: ToroidalHelixGeometry;
  active: boolean;
}

export interface LayerHierarchy {
  breath: ScaleLayer;       // Personal breath cycle
  body: ScaleLayer;         // Heartbeat, biorhythms  
  earth: ScaleLayer;        // Circadian, seasonal
  solar: ScaleLayer;        // Solar cycles, planets
  galactic: ScaleLayer;     // Cosmic background rhythms
}

export interface MultiScaleState {
  currentTime: number;
  breathPhase: number;      // B(t) ∈ [-1,1]
  layers: LayerHierarchy;
  totalWeight: number;
  ceiling: number;          // Scale ceiling for cosmic resilience
}

/**
 * Multi-scale layer manager for GAA hierarchical time coordination
 * Implements: du/dt = ω_i(1 + η_i B(t)) with weight constraints
 */
export class MultiScaleLayerManager {
  private state: MultiScaleState;
  private normalizer: GeometricNormalizer;
  
  constructor() {
    this.normalizer = new GeometricNormalizer();
    this.state = this.initializeDefaultState();
  }

  private initializeDefaultState(): MultiScaleState {
    return {
      currentTime: 0,
      breathPhase: 0,
      totalWeight: 1.0,
      ceiling: 1e12, // Observable universe scale ceiling
      layers: {
        breath: {
          id: 'breath',
          name: 'Breath Cycle',
          weight: 0.4,
          timeWarp: 1.0,
          breathModulation: 1.0,
          geometry: new ToroidalHelixGeometry({
            majorRadius: 1.0,
            minorRadius: 0.3,
            helixTurns: 2,
            timeScale: 1.0,
            phaseShift: 0,
            verticalShift: 0.5,
            rotationPhase: 0
          }),
          active: true
        },
        body: {
          id: 'body', 
          name: 'Biorhythms',
          weight: 0.25,
          timeWarp: 0.5,
          breathModulation: 0.7,
          geometry: new ToroidalHelixGeometry({
            majorRadius: 2.0,
            minorRadius: 0.5,
            helixTurns: 3,
            timeScale: 0.8,
            phaseShift: 0,
            verticalShift: 0.8,
            rotationPhase: 0
          }),
          active: true
        },
        earth: {
          id: 'earth',
          name: 'Earth Cycles', 
          weight: 0.2,
          timeWarp: 0.1,
          breathModulation: 0.3,
          geometry: new ToroidalHelixGeometry({
            majorRadius: 5.0,
            minorRadius: 1.0,
            helixTurns: 8,
            timeScale: 2.0,
            phaseShift: 0,
            verticalShift: 2.0,
            rotationPhase: 0
          }),
          active: true
        },
        solar: {
          id: 'solar',
          name: 'Solar System',
          weight: 0.1,
          timeWarp: 0.01,
          breathModulation: 0.1,
          geometry: new ToroidalHelixGeometry({
            majorRadius: 15.0,
            minorRadius: 3.0,
            helixTurns: 21,
            timeScale: 8.0,
            phaseShift: 0,
            verticalShift: 8.0,
            rotationPhase: 0
          }),
          active: false
        },
        galactic: {
          id: 'galactic',
          name: 'Galactic Rhythms',
          weight: 0.05,
          timeWarp: 0.001,
          breathModulation: 0.05,
          geometry: new ToroidalHelixGeometry({
            majorRadius: 50.0,
            minorRadius: 10.0,
            helixTurns: 89,
            timeScale: 35.0,
            phaseShift: 0,
            verticalShift: 35.0,
            rotationPhase: 0
          }),
          active: false
        }
      }
    };
  }

  /**
   * Update breath phase: B(t) = sin(2πt/T_breath)
   */
  updateBreathPhase(deltaTime: number): void {
    const breathPeriod = 4.0; // 4-second breath cycle
    this.state.breathPhase = Math.sin(2 * Math.PI * this.state.currentTime / breathPeriod);
    this.state.currentTime += deltaTime;
  }

  /**
   * Calculate time evolution: du/dt = ω_i(1 + η_i B(t))
   */
  getLayerTimeRate(layerId: keyof LayerHierarchy): number {
    const layer = this.state.layers[layerId];
    if (!layer.active) return 0;
    
    return layer.timeWarp * (1 + layer.breathModulation * this.state.breathPhase);
  }

  /**
   * Generate composite geometry points from active layers
   */
  generateCompositeGeometry(numPoints: number = 200): NormalizedGeometry[] {
    const compositePoints: NormalizedGeometry[] = [];
    
    // Ensure weight constraint: ∑w_i ≤ 1
    this.normalizeWeights();
    
    for (let i = 0; i < numPoints; i++) {
      const t = (i / numPoints) * 2 * Math.PI;
      let compositePosition = new Vector3();
      let compositeCurvature = 0;
      let compositeTorsion = 0;
      
      // Weight-sum contributions from active layers
      Object.values(this.state.layers).forEach(layer => {
        if (!layer.active) return;
        
        const layerTime = t * this.getLayerTimeRate(layer.id as keyof LayerHierarchy);
        const point = layer.geometry.generatePoints(1)[0];
        
        if (point) {
          // Scale by layer weight
          const weightedPos = layer.geometry.getPosition(layerTime).multiplyScalar(layer.weight);
          compositePosition.add(weightedPos);
          
          compositeCurvature += point.curvature * layer.weight;
          compositeTorsion += point.torsion * layer.weight;
        }
      });
      
      // Apply scale ceiling for cosmic resilience
      const length = Math.min(compositePosition.length(), this.state.ceiling);
      
      // Normalize the composite geometry
      const normalized = this.normalizer.normalize(
        compositePosition,
        length,
        compositeCurvature,
        compositeTorsion
      );
      
      compositePoints.push(normalized);
    }
    
    return compositePoints;
  }

  /**
   * Ensure weight constraint: ∑w_i ≤ 1
   */
  private normalizeWeights(): void {
    const activeWeights = Object.values(this.state.layers)
      .filter(layer => layer.active)
      .reduce((sum, layer) => sum + layer.weight, 0);
      
    if (activeWeights > 1.0) {
      const scale = 1.0 / activeWeights;
      Object.values(this.state.layers).forEach(layer => {
        if (layer.active) {
          layer.weight *= scale;
        }
      });
    }
    
    this.state.totalWeight = Math.min(activeWeights, 1.0);
  }

  /**
   * Update layer properties
   */
  updateLayer(layerId: keyof LayerHierarchy, updates: Partial<ScaleLayer>): void {
    const layer = this.state.layers[layerId];
    Object.assign(layer, updates);
    this.normalizeWeights();
  }

  /**
   * Toggle layer active state
   */
  toggleLayer(layerId: keyof LayerHierarchy): void {
    this.state.layers[layerId].active = !this.state.layers[layerId].active;
    this.normalizeWeights();
  }

  /**
   * Set scale ceiling for cosmic resilience
   */
  setScaleCeiling(ceiling: number): void {
    this.state.ceiling = Math.max(1e-15, ceiling);
  }

  /**
   * Get current state snapshot
   */
  getState(): MultiScaleState {
    return { ...this.state };
  }

  /**
   * Get active layers
   */
  getActiveLayers(): ScaleLayer[] {
    return Object.values(this.state.layers).filter(layer => layer.active);
  }
}