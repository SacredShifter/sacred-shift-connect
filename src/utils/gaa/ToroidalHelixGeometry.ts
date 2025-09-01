import * as THREE from 'three';
import { Vector3 } from 'three';

export interface ToroidalHelixParams {
  majorRadius: number;     // R - distance from origin to center of tube
  minorRadius: number;     // r - radius of the tube
  helixTurns: number;      // n - number of complete turns around the torus
  timeScale: number;       // ω - temporal scaling factor
  phaseShift: number;      // α - phase shift
  verticalShift: number;   // β - vertical displacement
  rotationPhase: number;   // γ - rotational phase
}

export interface ToroidalHelixPoint {
  position: Vector3;
  parameter: number;       // t parameter [0, 2π]
  tangent: Vector3;       // T(t) - unit tangent vector
  normal: Vector3;        // N(t) - unit normal vector
  binormal: Vector3;      // B(t) - unit binormal vector
  curvature: number;      // κ(t) - curvature
  torsion: number;        // τ(t) - torsion
}

export class ToroidalHelixGeometry {
  private params: ToroidalHelixParams;
  
  constructor(params: Partial<ToroidalHelixParams> = {}) {
    this.params = {
      majorRadius: 2.0,
      minorRadius: 0.5,
      helixTurns: 3,
      timeScale: 1.0,
      phaseShift: 0.0,
      verticalShift: 0.0,
      rotationPhase: 0.0,
      ...params
    };
  }

  updateParams(newParams: Partial<ToroidalHelixParams>): void {
    this.params = { ...this.params, ...newParams };
  }

  /**
   * Parametric equations for toroidal helix position
   * x(t) = (R + r*cos(n*t + α))*cos(ω*t + γ)
   * y(t) = (R + r*cos(n*t + α))*sin(ω*t + γ)
   * z(t) = r*sin(n*t + α) + β
   */
  getPosition(t: number): Vector3 {
    const { majorRadius: R, minorRadius: r, helixTurns: n, timeScale: ω, 
            phaseShift: α, verticalShift: β, rotationPhase: γ } = this.params;
    
    const innerTerm = n * t + α;
    const outerTerm = ω * t + γ;
    const radialDistance = R + r * Math.cos(innerTerm);
    
    return new Vector3(
      radialDistance * Math.cos(outerTerm),
      radialDistance * Math.sin(outerTerm),
      r * Math.sin(innerTerm) + β
    );
  }

  /**
   * First derivative - velocity vector
   */
  getVelocity(t: number): Vector3 {
    const { majorRadius: R, minorRadius: r, helixTurns: n, timeScale: ω, 
            phaseShift: α, rotationPhase: γ } = this.params;
    
    const innerTerm = n * t + α;
    const outerTerm = ω * t + γ;
    const radialDistance = R + r * Math.cos(innerTerm);
    
    const dx = -r * n * Math.sin(innerTerm) * Math.cos(outerTerm) - radialDistance * ω * Math.sin(outerTerm);
    const dy = -r * n * Math.sin(innerTerm) * Math.sin(outerTerm) + radialDistance * ω * Math.cos(outerTerm);
    const dz = r * n * Math.cos(innerTerm);
    
    return new Vector3(dx, dy, dz);
  }

  /**
   * Second derivative - acceleration vector
   */
  getAcceleration(t: number): Vector3 {
    const { majorRadius: R, minorRadius: r, helixTurns: n, timeScale: ω, 
            phaseShift: α, rotationPhase: γ } = this.params;
    
    const innerTerm = n * t + α;
    const outerTerm = ω * t + γ;
    const radialDistance = R + r * Math.cos(innerTerm);
    
    const d2x = -r * n * n * Math.cos(innerTerm) * Math.cos(outerTerm) 
                + 2 * r * n * ω * Math.sin(innerTerm) * Math.sin(outerTerm)
                - radialDistance * ω * ω * Math.cos(outerTerm);
                
    const d2y = -r * n * n * Math.cos(innerTerm) * Math.sin(outerTerm) 
                - 2 * r * n * ω * Math.sin(innerTerm) * Math.cos(outerTerm)
                - radialDistance * ω * ω * Math.sin(outerTerm);
                
    const d2z = -r * n * n * Math.sin(innerTerm);
    
    return new Vector3(d2x, d2y, d2z);
  }

  /**
   * Generate an array of points along the helix
   */
  generatePoints(numPoints: number = 200): ToroidalHelixPoint[] {
    const points: ToroidalHelixPoint[] = [];
    const step = (2 * Math.PI) / numPoints;
    
    for (let i = 0; i < numPoints; i++) {
      const t = i * step;
      const position = this.getPosition(t);
      const velocity = this.getVelocity(t);
      const acceleration = this.getAcceleration(t);
      
      // Calculate Frenet-Serret frame
      const tangent = velocity.clone().normalize();
      const speed = velocity.length();
      const curvatureVector = acceleration.clone().sub(
        tangent.clone().multiplyScalar(acceleration.dot(tangent))
      );
      const curvature = curvatureVector.length() / (speed * speed);
      const normal = curvatureVector.clone().normalize();
      const binormal = tangent.clone().cross(normal);
      
      // Calculate torsion (simplified approximation)
      const torsion = this.calculateTorsion(t);
      
      points.push({
        position,
        parameter: t,
        tangent,
        normal,
        binormal,
        curvature,
        torsion
      });
    }
    
    return points;
  }

  /**
   * Calculate torsion using finite differences
   */
  private calculateTorsion(t: number): number {
    const dt = 0.001;
    const v1 = this.getVelocity(t - dt);
    const v2 = this.getVelocity(t + dt);
    const a1 = this.getAcceleration(t - dt);
    const a2 = this.getAcceleration(t + dt);
    
    const cross1 = v1.clone().cross(a1);
    const cross2 = v2.clone().cross(a2);
    const crossDiff = cross2.clone().sub(cross1);
    
    const vLength = this.getVelocity(t).length();
    return crossDiff.length() / (2 * dt * vLength * vLength);
  }

  /**
   * Create THREE.js BufferGeometry for rendering
   */
  createBufferGeometry(numPoints: number = 200): THREE.BufferGeometry {
    const points = this.generatePoints(numPoints);
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);
    
    points.forEach((point, i) => {
      const idx = i * 3;
      positions[idx] = point.position.x;
      positions[idx + 1] = point.position.y;
      positions[idx + 2] = point.position.z;
      
      // Color based on curvature
      const normalizedCurvature = Math.min(point.curvature / 2, 1);
      colors[idx] = normalizedCurvature;     // Red
      colors[idx + 1] = 1 - normalizedCurvature; // Green
      colors[idx + 2] = point.torsion / 2;  // Blue
    });
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    return geometry;
  }
}