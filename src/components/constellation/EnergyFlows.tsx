import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import type { ConstellationNode } from '@/config/sacredGeometry';

interface EnergyFlowsProps {
  nodes: ConstellationNode[];
  selectedNode: ConstellationNode | null;
  hoveredNode: ConstellationNode | null;
}

export const EnergyFlows: React.FC<EnergyFlowsProps> = ({
  nodes,
  selectedNode,
  hoveredNode
}) => {
  const groupRef = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    groupRef.current.rotation.y = time * 0.01;
  });

  return (
    <group ref={groupRef}>
      {/* Energy flow lines between connected nodes */}
      {nodes.map((node) => 
        node.connections.map((connectionPath) => {
          const targetNode = nodes.find(n => n.module.path === connectionPath);
          if (!targetNode || !node.isUnlocked || !targetNode.isUnlocked) return null;

          return (
            <line key={`${node.module.path}-${connectionPath}`}>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  count={2}
                  array={new Float32Array([
                    node.position.position.x, node.position.position.y, node.position.position.z,
                    targetNode.position.position.x, targetNode.position.position.y, targetNode.position.position.z
                  ])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial 
                color="#a855f7" 
                transparent 
                opacity={0.2}
              />
            </line>
          );
        })
      )}
    </group>
  );
};