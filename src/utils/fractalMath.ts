import * as THREE from 'three';

export interface FractalPoint {
  x: number;
  y: number;
  z: number;
  level: number;
  isAnchor?: boolean;
  clusterId?: string;
}

export interface SierpinskiTriangle {
  vertices: THREE.Vector3[];
  center: THREE.Vector3;
  level: number;
  size: number;
}

/**
 * Generate Sierpinski triangle fractal positions
 */
export class FractalGeometry {
  private maxLevels: number;
  private baseSize: number;
  private positions: FractalPoint[] = [];
  
  constructor(maxLevels: number = 6, baseSize: number = 10) {
    this.maxLevels = maxLevels;
    this.baseSize = baseSize;
  }

  /**
   * Generate the complete fractal structure
   */
  generateFractalPositions(entryCount: number): FractalPoint[] {
    this.positions = [];
    
    // Start with the main triangle vertices (anchor points)
    const baseTriangle = this.createBaseTriangle();
    this.addTrianglePositions(baseTriangle, 0);
    
    // Recursively subdivide until we have enough positions
    this.subdivideRecursively(baseTriangle, 0, entryCount);
    
    // If we still need more positions, create orbital clusters
    if (this.positions.length < entryCount) {
      this.generateOrbitalPositions(entryCount - this.positions.length);
    }
    
    return this.positions.slice(0, entryCount);
  }

  /**
   * Create the base equilateral triangle
   */
  private createBaseTriangle(): SierpinskiTriangle {
    const height = (Math.sqrt(3) / 2) * this.baseSize;
    
    return {
      vertices: [
        new THREE.Vector3(0, height * 2/3, 0),           // Top vertex
        new THREE.Vector3(-this.baseSize/2, -height/3, 0), // Bottom left
        new THREE.Vector3(this.baseSize/2, -height/3, 0)   // Bottom right
      ],
      center: new THREE.Vector3(0, 0, 0),
      level: 0,
      size: this.baseSize
    };
  }

  /**
   * Add positions from triangle vertices and midpoints
   */
  private addTrianglePositions(triangle: SierpinskiTriangle, level: number) {
    // Add vertices as anchor points if level 0
    triangle.vertices.forEach((vertex, index) => {
      this.positions.push({
        x: vertex.x,
        y: vertex.y,
        z: vertex.z + level * 0.1, // Slight Z-offset for layering
        level,
        isAnchor: level === 0,
        clusterId: level === 0 ? `anchor_${index}` : undefined
      });
    });

    // Add center point
    this.positions.push({
      x: triangle.center.x,
      y: triangle.center.y,
      z: triangle.center.z + level * 0.1,
      level,
      isAnchor: false
    });

    // Add midpoints of edges
    for (let i = 0; i < 3; i++) {
      const v1 = triangle.vertices[i];
      const v2 = triangle.vertices[(i + 1) % 3];
      const midpoint = new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5);
      
      this.positions.push({
        x: midpoint.x,
        y: midpoint.y,
        z: midpoint.z + level * 0.1,
        level,
        isAnchor: false
      });
    }
  }

  /**
   * Recursive subdivision following Sierpinski triangle rules
   */
  private subdivideRecursively(triangle: SierpinskiTriangle, level: number, targetCount: number) {
    if (level >= this.maxLevels || this.positions.length >= targetCount) {
      return;
    }

    const subTriangles = this.createSubTriangles(triangle, level + 1);
    
    subTriangles.forEach(subTriangle => {
      this.addTrianglePositions(subTriangle, level + 1);
      
      if (this.positions.length < targetCount) {
        this.subdivideRecursively(subTriangle, level + 1, targetCount);
      }
    });
  }

  /**
   * Create three sub-triangles from a parent triangle (Sierpinski rule)
   */
  private createSubTriangles(parent: SierpinskiTriangle, level: number): SierpinskiTriangle[] {
    const v = parent.vertices;
    const newSize = parent.size / 2;
    
    // Calculate midpoints
    const mid01 = new THREE.Vector3().addVectors(v[0], v[1]).multiplyScalar(0.5);
    const mid12 = new THREE.Vector3().addVectors(v[1], v[2]).multiplyScalar(0.5);
    const mid20 = new THREE.Vector3().addVectors(v[2], v[0]).multiplyScalar(0.5);

    return [
      // Top triangle
      {
        vertices: [v[0], mid01, mid20],
        center: new THREE.Vector3().addVectors(v[0], mid01).add(mid20).multiplyScalar(1/3),
        level,
        size: newSize
      },
      // Bottom left triangle
      {
        vertices: [mid01, v[1], mid12],
        center: new THREE.Vector3().addVectors(mid01, v[1]).add(mid12).multiplyScalar(1/3),
        level,
        size: newSize
      },
      // Bottom right triangle
      {
        vertices: [mid20, mid12, v[2]],
        center: new THREE.Vector3().addVectors(mid20, mid12).add(v[2]).multiplyScalar(1/3),
        level,
        size: newSize
      }
    ];
  }

  /**
   * Generate orbital positions around anchors for remaining entries
   */
  private generateOrbitalPositions(count: number) {
    const anchors = this.positions.filter(p => p.isAnchor);
    
    for (let i = 0; i < count; i++) {
      const anchor = anchors[i % anchors.length];
      const angle = (i / count) * Math.PI * 2;
      const radius = 1 + (i % 3) * 0.5; // Varying orbital distances
      
      this.positions.push({
        x: anchor.x + Math.cos(angle) * radius,
        y: anchor.y + Math.sin(angle) * radius,
        z: anchor.z + 0.2 + (i % 3) * 0.1,
        level: this.maxLevels + 1,
        isAnchor: false,
        clusterId: anchor.clusterId
      });
    }
  }

  /**
   * Get positions for specific theme clusters
   */
  static getThemeClusterPositions(entries: any[], anchors: string[]): Map<string, FractalPoint[]> {
    const clusters = new Map<string, FractalPoint[]>();
    const fractal = new FractalGeometry();
    const positions = fractal.generateFractalPositions(entries.length);
    
    // Group entries by theme/anchor
    entries.forEach((entry, index) => {
      const theme = FractalGeometry.getEntryTheme(entry);
      if (!clusters.has(theme)) {
        clusters.set(theme, []);
      }
      
      if (index < positions.length) {
        clusters.get(theme)!.push(positions[index]);
      }
    });
    
    return clusters;
  }

  /**
   * Determine theme/anchor for an entry based on its content and tags
   */
  static getEntryTheme(entry: any): string {
    const tags = entry.resonance_tags || [];
    const title = entry.title.toLowerCase();
    const content = (entry.content || '').toLowerCase();
    
    // Check for specific anchor themes
    if (tags.some((tag: string) => tag.toLowerCase().includes('phoenix')) || 
        title.includes('phoenix') || content.includes('rebirth')) {
      return 'phoenix';
    }
    
    if (tags.some((tag: string) => tag.toLowerCase().includes('dragon')) || 
        title.includes('dragon') || content.includes('power')) {
      return 'dragon';
    }
    
    if (tags.some((tag: string) => tag.toLowerCase().includes('butterfly')) || 
        title.includes('butterfly') || content.includes('transformation')) {
      return 'butterfly';
    }
    
    if (tags.some((tag: string) => tag.toLowerCase().includes('pyramid')) || 
        title.includes('pyramid') || content.includes('sacred')) {
      return 'pyramid';
    }
    
    // Default cluster based on entry type
    return entry.type.toLowerCase();
  }

  /**
   * Calculate fractal zoom levels for camera positioning
   */
  static calculateZoomLevels(): { far: number; mid: number; close: number } {
    return {
      far: 25,  // See entire pyramid
      mid: 15,  // See major clusters
      close: 8  // See individual fragments
    };
  }

  /**
   * Generate connection lines between related entries
   */
  static generateConnections(entries: any[], positions: FractalPoint[]): Array<{from: number; to: number; strength: number}> {
    const connections: Array<{from: number; to: number; strength: number}> = [];
    
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const strength = this.calculateConnectionStrength(entries[i], entries[j]);
        
        if (strength > 0.3) { // Threshold for visible connections
          connections.push({ from: i, to: j, strength });
        }
      }
    }
    
    return connections;
  }

  /**
   * Calculate connection strength between two entries
   */
  private static calculateConnectionStrength(entry1: any, entry2: any): number {
    let strength = 0;
    
    // Check for shared tags
    const tags1 = entry1.resonance_tags || [];
    const tags2 = entry2.resonance_tags || [];
    const sharedTags = tags1.filter((tag: string) => tags2.includes(tag));
    strength += sharedTags.length * 0.2;
    
    // Check for same theme
    if (this.getEntryTheme(entry1) === this.getEntryTheme(entry2)) {
      strength += 0.3;
    }
    
    // Check for content similarity (simple keyword matching)
    const content1 = (entry1.content || '').toLowerCase();
    const content2 = (entry2.content || '').toLowerCase();
    const keywords = ['transformation', 'healing', 'shadow', 'light', 'wisdom', 'journey'];
    
    keywords.forEach(keyword => {
      if (content1.includes(keyword) && content2.includes(keyword)) {
        strength += 0.1;
      }
    });
    
    return Math.min(strength, 1.0);
  }
}