import { Vector3 } from 'three';

export interface NormalizationParams {
  scaleRange: { min: number; max: number };
  curvatureReference: number;
  torsionReference: number;
  adaptiveScaling: boolean;
}

export interface NormalizedGeometry {
  position: Vector3;
  scale: number;           // S_i ∈ [0,1]
  angles: {
    theta: number;         // Θ̂ ∈ [0,1] 
    phi: number;           // Φ̂ ∈ [0,1]
  };
  curvature: number;       // κ̂ ∈ [0,1]
  torsion: number;         // τ̂ ∈ [0,1]
}

/**
 * Scale-invariant geometric normalizer for GAA system
 * Implements cosmologically resilient normalization functions
 */
export class GeometricNormalizer {
  private params: NormalizationParams;
  
  constructor(params: Partial<NormalizationParams> = {}) {
    this.params = {
      scaleRange: { min: 1e-15, max: 1e15 },  // Planck to observable universe
      curvatureReference: 1.0,
      torsionReference: 1.0,
      adaptiveScaling: true,
      ...params
    };
  }

  /**
   * Scale-invariant normalization: S_i = (log L_i - log L_min) / (log L_max - log L_min)
   */
  normalizeScale(length: number): number {
    const { min, max } = this.params.scaleRange;
    const logLength = Math.log(Math.max(length, min));
    const logMin = Math.log(min);
    const logMax = Math.log(max);
    
    return Math.max(0, Math.min(1, (logLength - logMin) / (logMax - logMin)));
  }

  /**
   * Angle normalization: Θ̂ = Θ/(2π), Φ̂ = (Φ/π) + 0.5
   */
  normalizeAngles(theta: number, phi: number): { theta: number; phi: number } {
    // Normalize theta to [0,1] 
    const normalizedTheta = (theta % (2 * Math.PI)) / (2 * Math.PI);
    
    // Normalize phi to [0,1] with offset
    const normalizedPhi = ((phi % Math.PI) / Math.PI) + 0.5;
    
    return {
      theta: Math.max(0, Math.min(1, normalizedTheta)),
      phi: Math.max(0, Math.min(1, normalizedPhi % 1))
    };
  }

  /**
   * Soft curvature normalization: κ̂ = κ/(κ + κ_ref)
   */
  normalizeCurvature(curvature: number): number {
    const absKappa = Math.abs(curvature);
    const kRef = this.params.curvatureReference;
    
    return absKappa / (absKappa + kRef);
  }

  /**
   * Soft torsion normalization: τ̂ = 0.5 + arctan(τ/τ_ref)/π  
   */
  normalizeTorsion(torsion: number): number {
    const tauRef = this.params.torsionReference;
    
    return 0.5 + Math.atan(torsion / tauRef) / Math.PI;
  }

  /**
   * Complete geometric normalization
   */
  normalize(
    position: Vector3,
    length: number,
    curvature: number,
    torsion: number
  ): NormalizedGeometry {
    // Convert position to spherical coordinates
    const r = position.length();
    const theta = Math.atan2(position.y, position.x);
    const phi = Math.acos(Math.max(-1, Math.min(1, position.z / r)));

    return {
      position: position.clone(),
      scale: this.normalizeScale(length),
      angles: this.normalizeAngles(theta, phi),
      curvature: this.normalizeCurvature(curvature),
      torsion: this.normalizeTorsion(torsion)
    };
  }

  /**
   * Update normalization parameters dynamically
   */
  updateParams(newParams: Partial<NormalizationParams>): void {
    this.params = { ...this.params, ...newParams };
  }

  /**
   * Adaptive scaling based on current geometry distribution
   */
  adaptScale(geometries: NormalizedGeometry[]): void {
    if (!this.params.adaptiveScaling || geometries.length === 0) return;

    const scales = geometries.map(g => g.scale);
    const minScale = Math.min(...scales);
    const maxScale = Math.max(...scales);
    
    // Update reference values for better distribution
    if (maxScale > 0.95) {
      this.params.scaleRange.max *= 1.1;
    }
    if (minScale < 0.05) {
      this.params.scaleRange.min *= 0.9;
    }
  }
}