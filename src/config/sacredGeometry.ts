/**
 * Sacred Constellation Geometry System
 * Positioning modules using sacred mathematical principles
 */

import { Vector3 } from 'three';
import { TaoModule, TaoStage } from './taoFlowConfig';

export interface SacredPosition {
  position: Vector3;
  rotation: number;
  scale: number;
  orbitRadius: number;
}

export interface ConstellationNode {
  module: TaoModule;
  position: SacredPosition;
  stage: TaoStage;
  visualMetaphor: ModuleVisualMetaphor;
  connections: string[];
  isUnlocked: boolean;
  isActive: boolean;
  energy: number; // 0-1 energy level for animations
}

export type ModuleVisualMetaphor = 
  | 'lotus' // Breath practices
  | 'pool' // Journal/reflection
  | 'mandala' // Meditation
  | 'tree' // Community/growth
  | 'crystal' // Technology/GAA
  | 'spiral' // Learning/evolution
  | 'star' // Guidance/help
  | 'web' // Connections/network
  | 'flame' // Transformation
  | 'void' // Return to silence

const GOLDEN_RATIO = 1.618033988749;
const PHI = GOLDEN_RATIO;

/**
 * Sacred geometry calculations for constellation positioning
 */
export class SacredGeometry {
  /**
   * Generate positions based on Flower of Life pattern
   */
  static flowerOfLifePositions(count: number, radius: number = 3): Vector3[] {
    const positions: Vector3[] = [];
    const angleStep = (Math.PI * 2) / 6; // Hexagonal base
    
    // Center position
    if (count > 0) positions.push(new Vector3(0, 0, 0));
    
    // First ring - 6 positions
    for (let i = 1; i <= Math.min(count - 1, 6); i++) {
      const angle = angleStep * (i - 1);
      positions.push(new Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        0
      ));
    }
    
    // Second ring - 12 positions
    if (count > 7) {
      const outerRadius = radius * Math.sqrt(3);
      for (let i = 8; i <= Math.min(count, 18); i++) {
        const angle = (Math.PI * 2 / 12) * (i - 8);
        positions.push(new Vector3(
          Math.cos(angle) * outerRadius,
          Math.sin(angle) * outerRadius,
          0
        ));
      }
    }
    
    return positions;
  }

  /**
   * Generate positions using golden spiral
   */
  static goldenSpiralPositions(count: number, scale: number = 2): Vector3[] {
    const positions: Vector3[] = [];
    
    for (let i = 0; i < count; i++) {
      const angle = i * (Math.PI * 2 / PHI);
      const radius = Math.sqrt(i) * scale * 0.5;
      const height = Math.sin(i * 0.1) * 0.5;
      
      positions.push(new Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        height
      ));
    }
    
    return positions;
  }

  /**
   * Generate positions for Tree of Life structure
   */
  static treeOfLifePositions(): Vector3[] {
    return [
      new Vector3(0, 3, 0),          // Kether (Crown)
      new Vector3(-1.5, 2, 0),       // Binah (Understanding)
      new Vector3(1.5, 2, 0),        // Chokmah (Wisdom)
      new Vector3(-1.5, 0.5, 0),     // Chesed (Mercy)
      new Vector3(1.5, 0.5, 0),      // Geburah (Strength)
      new Vector3(0, 1, 0),          // Tiferet (Beauty)
      new Vector3(-1.5, -1, 0),      // Netzach (Victory)
      new Vector3(1.5, -1, 0),       // Hod (Glory)
      new Vector3(0, -0.5, 0),       // Yesod (Foundation)
      new Vector3(0, -2.5, 0),       // Malkuth (Kingdom)
    ];
  }

  /**
   * Calculate connections between modules based on sacred geometry
   */
  static calculateConnections(nodes: ConstellationNode[]): Map<string, string[]> {
    const connections = new Map<string, string[]>();
    
    for (const node of nodes) {
      const nodeConnections: string[] = [];
      
      // Connect to predecessors and successors
      nodeConnections.push(...node.module.predecessors);
      nodeConnections.push(...node.module.successors);
      nodeConnections.push(...node.module.alternatives);
      
      // Add sacred geometry connections (nearby nodes)
      const nearbyNodes = nodes.filter(other => {
        if (other.module.path === node.module.path) return false;
        const distance = node.position.position.distanceTo(other.position.position);
        return distance < 2.5; // Sacred proximity threshold
      });
      
      nodeConnections.push(...nearbyNodes.map(n => n.module.path));
      
      connections.set(node.module.path, [...new Set(nodeConnections)]);
    }
    
    return connections;
  }
}

/**
 * Get visual metaphor for a module based on its purpose
 */
export const getModuleVisualMetaphor = (module: TaoModule): ModuleVisualMetaphor => {
  const path = module.path.toLowerCase();
  
  if (path.includes('breath')) return 'lotus';
  if (path.includes('journal')) return 'pool';
  if (path.includes('meditation')) return 'mandala';
  if (path.includes('grove') || path.includes('circles')) return 'tree';
  if (path.includes('gaa') || path.includes('3d')) return 'crystal';
  if (path.includes('learning') || path.includes('codex')) return 'spiral';
  if (path.includes('help') || path.includes('guide')) return 'star';
  if (path.includes('constellation') || path.includes('feed')) return 'web';
  if (path.includes('liberation') || path.includes('shift')) return 'flame';
  if (path.includes('silence') || path.includes('admin')) return 'void';
  
  return 'mandala'; // Default
};

/**
 * Calculate stage-based positioning for constellation layout
 */
export const getStageLayout = (stage: TaoStage, moduleCount: number): SacredPosition[] => {
  const positions: SacredPosition[] = [];
  
  switch (stage) {
    case 'wuWei':
      // Center cluster for foundation modules
      const centerPositions = SacredGeometry.flowerOfLifePositions(moduleCount, 1.5);
      return centerPositions.map((pos, index) => ({
        position: pos,
        rotation: (index * (Math.PI * 2)) / moduleCount,
        scale: 0.8 + (index * 0.1),
        orbitRadius: 1.5
      }));
      
    case 'yinYang':
      // Dual spiral pattern
      const spiralPositions = SacredGeometry.goldenSpiralPositions(moduleCount, 1.8);
      return spiralPositions.map((pos, index) => ({
        position: new Vector3(pos.x, pos.y, pos.z + 0.5),
        rotation: index * (Math.PI / PHI),
        scale: 1.0,
        orbitRadius: 2.2
      }));
      
    case 'advancedCeremony':
      // Sacred geometry expansion
      const expandedPositions = SacredGeometry.flowerOfLifePositions(moduleCount, 3.2);
      return expandedPositions.map((pos, index) => ({
        position: new Vector3(pos.x, pos.y, pos.z + 1.0),
        rotation: (index * Math.PI * 2) / GOLDEN_RATIO,
        scale: 1.2,
        orbitRadius: 3.5
      }));
      
    case 'returnToSilence':
      // Tree of Life structure
      const treePositions = SacredGeometry.treeOfLifePositions();
      return treePositions.slice(0, moduleCount).map((pos, index) => ({
        position: new Vector3(pos.x * 1.5, pos.y * 1.2, pos.z + 1.5),
        rotation: (index * Math.PI) / 4,
        scale: 1.4,
        orbitRadius: 4.0
      }));
      
    default:
      return [];
  }
};

/**
 * Generate constellation from Tao modules with sacred positioning
 */
export const generateConstellation = (
  modules: TaoModule[],
  unlockedPaths: Set<string>,
  currentStage: TaoStage
): ConstellationNode[] => {
  const nodes: ConstellationNode[] = [];
  
  // Group modules by stage
  const modulesByStage = new Map<TaoStage, TaoModule[]>();
  
  // We need to infer stage from module characteristics since it's not directly stored
  modules.forEach(module => {
    let stage: TaoStage = 'wuWei';
    
    // Basic heuristic for stage classification
    if (module.reveal === 'mastery') stage = 'returnToSilence';
    else if (module.reveal === 'ceremony' || module.reveal === 'wisdom') stage = 'advancedCeremony';
    else if (module.education === 'low' && module.fadeEducation) stage = 'yinYang';
    
    if (!modulesByStage.has(stage)) modulesByStage.set(stage, []);
    modulesByStage.get(stage)!.push(module);
  });
  
  // Generate positions for each stage
  let globalOffset = new Vector3(0, 0, 0);
  
  for (const [stage, stageModules] of modulesByStage.entries()) {
    const stageLayout = getStageLayout(stage, stageModules.length);
    
    stageModules.forEach((module, index) => {
      const position = stageLayout[index] || stageLayout[0];
      
      const node: ConstellationNode = {
        module,
        position: {
          ...position,
          position: position.position.clone().add(globalOffset)
        },
        stage,
        visualMetaphor: getModuleVisualMetaphor(module),
        connections: [],
        isUnlocked: unlockedPaths.has(module.path),
        isActive: false,
        energy: unlockedPaths.has(module.path) ? 0.8 : 0.2
      };
      
      nodes.push(node);
    });
    
    // Offset for next stage
    globalOffset.y -= 6;
  }
  
  // Calculate connections
  const connections = SacredGeometry.calculateConnections(nodes);
  nodes.forEach(node => {
    node.connections = connections.get(node.module.path) || [];
  });
  
  return nodes;
};