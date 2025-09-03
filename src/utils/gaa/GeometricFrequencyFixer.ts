/**
 * Geometric Frequency Fixer - Fixes NaN frequency issues in GAA
 */

export interface GeometryData {
  vertices: number[];
  indices: number[];
  normals?: number[];
  uv?: number[];
}

export class GeometricFrequencyFixer {
  private static readonly MIN_FREQUENCY = 20; // Hz
  private static readonly MAX_FREQUENCY = 20000; // Hz
  private static readonly DEFAULT_FREQUENCY = 440; // Hz (A4)

  /**
   * Calculate geometric frequency with NaN prevention
   */
  static calculateGeometricFrequency(geometry: GeometryData): number {
    try {
      // Validate input geometry
      if (!this.isValidGeometry(geometry)) {
        console.warn('Invalid geometry data, using default frequency');
        return this.DEFAULT_FREQUENCY;
      }

      // Calculate frequency based on geometric properties
      const complexity = this.calculateComplexity(geometry);
      const symmetry = this.calculateSymmetry(geometry);
      const volume = this.calculateVolume(geometry);

      // Combine factors to generate frequency
      let frequency = this.DEFAULT_FREQUENCY;
      
      if (complexity > 0 && symmetry > 0 && volume > 0) {
        frequency = this.DEFAULT_FREQUENCY * 
          Math.pow(complexity, 0.3) * 
          Math.pow(symmetry, 0.2) * 
          Math.pow(volume, 0.1);
      }

      // Ensure frequency is within valid range
      return this.clampFrequency(frequency);
    } catch (error) {
      console.error('Error calculating geometric frequency:', error);
      return this.DEFAULT_FREQUENCY;
    }
  }

  /**
   * Validate geometry data
   */
  private static isValidGeometry(geometry: GeometryData): boolean {
    if (!geometry || !geometry.vertices || !geometry.indices) {
      return false;
    }

    if (!Array.isArray(geometry.vertices) || !Array.isArray(geometry.indices)) {
      return false;
    }

    if (geometry.vertices.length === 0 || geometry.indices.length === 0) {
      return false;
    }

    // Check for valid numbers
    return geometry.vertices.every(v => Number.isFinite(v)) &&
           geometry.indices.every(i => Number.isFinite(i));
  }

  /**
   * Calculate geometric complexity
   */
  private static calculateComplexity(geometry: GeometryData): number {
    const vertexCount = geometry.vertices.length / 3;
    const faceCount = geometry.indices.length / 3;
    
    if (vertexCount === 0 || faceCount === 0) return 1;
    
    // Complexity based on vertex-to-face ratio
    const complexity = Math.log(vertexCount + faceCount) / Math.log(10);
    return Math.max(0.1, Math.min(10, complexity));
  }

  /**
   * Calculate geometric symmetry
   */
  private static calculateSymmetry(geometry: GeometryData): number {
    const vertices = geometry.vertices;
    if (vertices.length < 9) return 1; // Need at least 3 vertices

    let symmetryScore = 0;
    const vertexCount = vertices.length / 3;

    // Check for mirror symmetry along major axes
    for (let axis = 0; axis < 3; axis++) {
      let pairs = 0;
      let matches = 0;

      for (let i = 0; i < vertexCount; i++) {
        const baseIndex = i * 3;
        const vertex = [
          vertices[baseIndex],
          vertices[baseIndex + 1],
          vertices[baseIndex + 2]
        ];

        // Look for mirrored vertex
        for (let j = i + 1; j < vertexCount; j++) {
          const compareIndex = j * 3;
          const compareVertex = [
            vertices[compareIndex],
            vertices[compareIndex + 1],
            vertices[compareIndex + 2]
          ];

          // Check if vertices are mirrored along current axis
          const mirrored = [...vertex];
          mirrored[axis] *= -1;

          const distance = Math.sqrt(
            Math.pow(mirrored[0] - compareVertex[0], 2) +
            Math.pow(mirrored[1] - compareVertex[1], 2) +
            Math.pow(mirrored[2] - compareVertex[2], 2)
          );

          pairs++;
          if (distance < 0.01) { // Tolerance for floating point
            matches++;
          }
        }
      }

      if (pairs > 0) {
        symmetryScore += matches / pairs;
      }
    }

    return Math.max(0.1, Math.min(3, symmetryScore + 0.5));
  }

  /**
   * Calculate approximate volume
   */
  private static calculateVolume(geometry: GeometryData): number {
    const vertices = geometry.vertices;
    const indices = geometry.indices;

    if (vertices.length < 9 || indices.length < 3) return 1;

    let volume = 0;

    // Calculate volume using divergence theorem approximation
    for (let i = 0; i < indices.length; i += 3) {
      const i1 = indices[i] * 3;
      const i2 = indices[i + 1] * 3;
      const i3 = indices[i + 2] * 3;

      if (i1 + 2 < vertices.length && i2 + 2 < vertices.length && i3 + 2 < vertices.length) {
        const v1 = [vertices[i1], vertices[i1 + 1], vertices[i1 + 2]];
        const v2 = [vertices[i2], vertices[i2 + 1], vertices[i2 + 2]];
        const v3 = [vertices[i3], vertices[i3 + 1], vertices[i3 + 2]];

        // Triangle volume contribution
        const cross = [
          (v2[1] - v1[1]) * (v3[2] - v1[2]) - (v2[2] - v1[2]) * (v3[1] - v1[1]),
          (v2[2] - v1[2]) * (v3[0] - v1[0]) - (v2[0] - v1[0]) * (v3[2] - v1[2]),
          (v2[0] - v1[0]) * (v3[1] - v1[1]) - (v2[1] - v1[1]) * (v3[0] - v1[0])
        ];

        volume += Math.abs(v1[0] * cross[0] + v1[1] * cross[1] + v1[2] * cross[2]) / 6;
      }
    }

    return Math.max(0.1, Math.min(100, Math.abs(volume) + 0.5));
  }

  /**
   * Clamp frequency to valid range
   */
  private static clampFrequency(frequency: number): number {
    if (!Number.isFinite(frequency) || isNaN(frequency)) {
      return this.DEFAULT_FREQUENCY;
    }

    return Math.max(this.MIN_FREQUENCY, Math.min(this.MAX_FREQUENCY, frequency));
  }

  /**
   * Smooth frequency transitions to prevent abrupt changes
   */
  static smoothFrequencyTransition(
    currentFrequency: number,
    targetFrequency: number,
    smoothingFactor: number = 0.1
  ): number {
    if (!Number.isFinite(currentFrequency)) currentFrequency = this.DEFAULT_FREQUENCY;
    if (!Number.isFinite(targetFrequency)) targetFrequency = this.DEFAULT_FREQUENCY;

    const smoothedFrequency = currentFrequency + 
      (targetFrequency - currentFrequency) * smoothingFactor;

    return this.clampFrequency(smoothedFrequency);
  }

  /**
   * Generate fallback frequency based on time
   */
  static generateTimeBasedFrequency(time: number): number {
    // Generate a stable, pleasant frequency based on time
    const base = this.DEFAULT_FREQUENCY;
    const modulation = Math.sin(time * 0.001) * 100; // Slow modulation
    return this.clampFrequency(base + modulation);
  }
}