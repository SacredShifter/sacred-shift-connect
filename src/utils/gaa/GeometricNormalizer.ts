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

export interface RawGeometry {
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

export class GeometricNormalizer {
  private readonly PHI = 1.618033988749;
  private readonly PI = Math.PI;
  private readonly SQRT2 = Math.sqrt(2);

  /**
   * Normalize geometry to standard coordinate space and sacred proportions
   */
  normalize(rawGeometry: RawGeometry): NormalizedGeometry {
    const { vertices, faces, normals } = rawGeometry;
    
    // Calculate actual center and bounds
    const bounds = this.calculateBounds(vertices);
    const actualCenter = this.calculateCenter(vertices);
    const maxDimension = Math.max(
      bounds.max[0] - bounds.min[0],
      bounds.max[1] - bounds.min[1],
      bounds.max[2] - bounds.min[2]
    );

    // Normalize vertices to unit cube centered at origin
    const normalizedVertices = vertices.map(vertex => [
      (vertex[0] - actualCenter[0]) / maxDimension,
      (vertex[1] - actualCenter[1]) / maxDimension,
      (vertex[2] - actualCenter[2]) / maxDimension
    ]);

    // Apply sacred geometry transformations
    const sacredVertices = this.applySacredGeometry(normalizedVertices);

    // Recalculate normals for sacred geometry
    const sacredNormals = this.calculateNormals(sacredVertices, faces);

    // Calculate sacred center and radius
    const sacredCenter = this.calculateCenter(sacredVertices);
    const sacredRadius = this.calculateRadius(sacredVertices, sacredCenter);

    return {
      vertices: sacredVertices,
      faces: faces,
      normals: sacredNormals,
      center: sacredCenter,
      radius: sacredRadius,
      sacredRatios: {
        phi: this.PHI,
        pi: this.PI,
        sqrt2: this.SQRT2
      }
    };
  }

  /**
   * Apply sacred geometry transformations to vertices
   */
  private applySacredGeometry(vertices: number[][]): number[][] {
    return vertices.map((vertex, index) => {
      const [x, y, z] = vertex;
      
      // Golden ratio scaling based on position
      const phiScale = 1 + (Math.sin(index * this.PHI) * 0.1);
      
      // Sacred spiral transformation
      const angle = index * (2 * this.PI / this.PHI);
      const spiralRadius = Math.sqrt(x * x + y * y);
      const spiralInfluence = 0.05 * spiralRadius;
      
      return [
        x * phiScale + spiralInfluence * Math.cos(angle),
        y * phiScale + spiralInfluence * Math.sin(angle),
        z * Math.pow(this.PHI, -0.1) + spiralInfluence * Math.sin(angle * this.PHI)
      ];
    });
  }

  /**
   * Calculate bounding box of vertices
   */
  private calculateBounds(vertices: number[][]): { min: number[], max: number[] } {
    if (vertices.length === 0) {
      return { min: [0, 0, 0], max: [0, 0, 0] };
    }

    const min = [...vertices[0]];
    const max = [...vertices[0]];

    vertices.forEach(vertex => {
      for (let i = 0; i < 3; i++) {
        min[i] = Math.min(min[i], vertex[i]);
        max[i] = Math.max(max[i], vertex[i]);
      }
    });

    return { min, max };
  }

  /**
   * Calculate geometric center of vertices
   */
  private calculateCenter(vertices: number[][]): number[] {
    if (vertices.length === 0) return [0, 0, 0];

    const sum = vertices.reduce(
      (acc, vertex) => [
        acc[0] + vertex[0],
        acc[1] + vertex[1],
        acc[2] + vertex[2]
      ],
      [0, 0, 0]
    );

    return [
      sum[0] / vertices.length,
      sum[1] / vertices.length,
      sum[2] / vertices.length
    ];
  }

  /**
   * Calculate radius (max distance from center)
   */
  private calculateRadius(vertices: number[][], center: number[]): number {
    if (vertices.length === 0) return 0;

    let maxRadius = 0;
    vertices.forEach(vertex => {
      const distance = Math.sqrt(
        (vertex[0] - center[0]) ** 2 +
        (vertex[1] - center[1]) ** 2 +
        (vertex[2] - center[2]) ** 2
      );
      maxRadius = Math.max(maxRadius, distance);
    });

    return maxRadius;
  }

  /**
   * Calculate face normals from vertices and faces
   */
  private calculateNormals(vertices: number[][], faces: number[][]): number[][] {
    const normals: number[][] = [];

    faces.forEach(face => {
      if (face.length >= 3) {
        const v1 = vertices[face[0]];
        const v2 = vertices[face[1]];
        const v3 = vertices[face[2]];

        if (v1 && v2 && v3) {
          // Calculate face normal using cross product
          const edge1 = [
            v2[0] - v1[0],
            v2[1] - v1[1],
            v2[2] - v1[2]
          ];
          const edge2 = [
            v3[0] - v1[0],
            v3[1] - v1[1],
            v3[2] - v1[2]
          ];

          const normal = this.crossProduct(edge1, edge2);
          const normalizedNormal = this.normalizeVector(normal);
          normals.push(normalizedNormal);
        }
      }
    });

    // If no face normals calculated, generate vertex normals
    if (normals.length === 0) {
      return vertices.map(() => [0, 0, 1]); // Default up normal
    }

    return normals;
  }

  /**
   * Calculate cross product of two 3D vectors
   */
  private crossProduct(a: number[], b: number[]): number[] {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  }

  /**
   * Normalize a 3D vector
   */
  private normalizeVector(vector: number[]): number[] {
    const magnitude = Math.sqrt(
      vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2
    );

    if (magnitude === 0) return [0, 0, 1]; // Default up vector

    return [
      vector[0] / magnitude,
      vector[1] / magnitude,
      vector[2] / magnitude
    ];
  }

  /**
   * Generate platonic solid vertices (for testing)
   */
  generatePlatonicSolid(type: 'tetrahedron' | 'cube' | 'octahedron' | 'dodecahedron' | 'icosahedron'): RawGeometry {
    switch (type) {
      case 'tetrahedron':
        return this.generateTetrahedron();
      case 'cube':
        return this.generateCube();
      case 'octahedron':
        return this.generateOctahedron();
      case 'dodecahedron':
        return this.generateDodecahedron();
      case 'icosahedron':
        return this.generateIcosahedron();
      default:
        return this.generateTetrahedron();
    }
  }

  private generateTetrahedron(): RawGeometry {
    const vertices = [
      [1, 1, 1],
      [1, -1, -1],
      [-1, 1, -1],
      [-1, -1, 1]
    ];

    const faces = [
      [0, 1, 2],
      [0, 2, 3],
      [0, 3, 1],
      [1, 3, 2]
    ];

    return {
      vertices,
      faces,
      normals: [],
      center: [0, 0, 0],
      radius: Math.sqrt(3),
      sacredRatios: { phi: this.PHI, pi: this.PI, sqrt2: this.SQRT2 }
    };
  }

  private generateCube(): RawGeometry {
    const vertices = [
      [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
      [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ];

    const faces = [
      [0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1],
      [2, 6, 7, 3], [0, 3, 7, 4], [1, 5, 6, 2]
    ];

    return {
      vertices,
      faces,
      normals: [],
      center: [0, 0, 0],
      radius: Math.sqrt(3),
      sacredRatios: { phi: this.PHI, pi: this.PI, sqrt2: this.SQRT2 }
    };
  }

  private generateOctahedron(): RawGeometry {
    const vertices = [
      [0, 0, 1], [0, 0, -1],
      [1, 0, 0], [-1, 0, 0],
      [0, 1, 0], [0, -1, 0]
    ];

    const faces = [
      [0, 2, 4], [0, 4, 3], [0, 3, 5], [0, 5, 2],
      [1, 4, 2], [1, 3, 4], [1, 5, 3], [1, 2, 5]
    ];

    return {
      vertices,
      faces,
      normals: [],
      center: [0, 0, 0],
      radius: 1,
      sacredRatios: { phi: this.PHI, pi: this.PI, sqrt2: this.SQRT2 }
    };
  }

  private generateDodecahedron(): RawGeometry {
    // Simplified dodecahedron (using golden ratio)
    const phi = this.PHI;
    const vertices = [
      [1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1],
      [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1],
      [0, phi, 1/phi], [0, phi, -1/phi], [0, -phi, 1/phi], [0, -phi, -1/phi],
      [1/phi, 0, phi], [-1/phi, 0, phi], [1/phi, 0, -phi], [-1/phi, 0, -phi],
      [phi, 1/phi, 0], [phi, -1/phi, 0], [-phi, 1/phi, 0], [-phi, -1/phi, 0]
    ];

    const faces = [
      [0, 8, 9, 1, 16], [0, 16, 17, 2, 12], [12, 2, 10, 6, 13],
      [13, 6, 19, 18, 4], [4, 18, 5, 9, 8]
    ];

    return {
      vertices,
      faces,
      normals: [],
      center: [0, 0, 0],
      radius: Math.sqrt(3),
      sacredRatios: { phi: this.PHI, pi: this.PI, sqrt2: this.SQRT2 }
    };
  }

  private generateIcosahedron(): RawGeometry {
    const phi = this.PHI;
    const vertices = [
      [0, 1, phi], [0, 1, -phi], [0, -1, phi], [0, -1, -phi],
      [1, phi, 0], [1, -phi, 0], [-1, phi, 0], [-1, -phi, 0],
      [phi, 0, 1], [phi, 0, -1], [-phi, 0, 1], [-phi, 0, -1]
    ];

    const faces = [
      [0, 2, 8], [0, 8, 4], [0, 4, 6], [0, 6, 10], [0, 10, 2],
      [3, 1, 9], [3, 9, 5], [3, 5, 7], [3, 7, 11], [3, 11, 1],
      [2, 5, 8], [8, 5, 9], [8, 9, 4], [4, 9, 1], [4, 1, 6],
      [6, 1, 11], [6, 11, 10], [10, 11, 7], [10, 7, 2], [2, 7, 5]
    ];

    return {
      vertices,
      faces,
      normals: [],
      center: [0, 0, 0],
      radius: Math.sqrt(phi + 2),
      sacredRatios: { phi: this.PHI, pi: this.PI, sqrt2: this.SQRT2 }
    };
  }
}