import { Vector3 } from 'three';

export interface FrenetFrame {
  tangent: Vector3;    // T(t) - unit tangent vector
  normal: Vector3;     // N(t) - unit normal vector  
  binormal: Vector3;   // B(t) - unit binormal vector
  curvature: number;   // κ(t) - curvature
  torsion: number;     // τ(t) - torsion
}

export class FrenetSerretCalculator {
  /**
   * Calculate Frenet-Serret frame from position derivatives
   */
  static calculateFrame(
    position: Vector3,
    velocity: Vector3,
    acceleration: Vector3
  ): FrenetFrame {
    // Unit tangent vector T = r'(t) / |r'(t)|
    const speed = velocity.length();
    const tangent = velocity.clone().normalize();
    
    // Curvature κ = |r'(t) × r''(t)| / |r'(t)|³
    const crossProduct = velocity.clone().cross(acceleration);
    const curvature = crossProduct.length() / (speed ** 3);
    
    // Principal normal vector N = (T' / |T'|)
    const curvatureVector = acceleration.clone().sub(
      tangent.clone().multiplyScalar(acceleration.dot(tangent))
    );
    const normal = curvatureVector.clone().normalize();
    
    // Binormal vector B = T × N
    const binormal = tangent.clone().cross(normal);
    
    // Torsion calculation (simplified)
    const torsion = this.calculateTorsion(velocity, acceleration, crossProduct);
    
    return {
      tangent,
      normal,
      binormal,
      curvature,
      torsion
    };
  }
  
  private static calculateTorsion(velocity: Vector3, acceleration: Vector3, crossProduct: Vector3): number {
    // τ = (r' × r'') · r''' / |r' × r''|²
    // Simplified approximation for real-time use
    return Math.abs(crossProduct.dot(acceleration)) / (crossProduct.lengthSq() + 0.001);
  }
}