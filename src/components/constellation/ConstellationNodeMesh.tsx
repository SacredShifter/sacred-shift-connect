import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Color, Vector3 } from 'three';
import { Text } from '@react-three/drei';
import { ConstellationNode, ModuleVisualMetaphor } from '@/config/sacredGeometry';
import { LotusNode } from './metaphors/LotusNode';
import { PoolNode } from './metaphors/PoolNode';
import { MandalaNode } from './metaphors/MandalaNode';
import { TreeNode } from './metaphors/TreeNode';
import { CrystalNode } from './metaphors/CrystalNode';
import { SpiralNode } from './metaphors/SpiralNode';
import { StarNode } from './metaphors/StarNode';
import { WebNode } from './metaphors/WebNode';
import { FlameNode } from './metaphors/FlameNode';
import { VoidNode } from './metaphors/VoidNode';

interface ConstellationNodeMeshProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onHover: (node: ConstellationNode | null) => void;
}

export const ConstellationNodeMesh: React.FC<ConstellationNodeMeshProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onHover
}) => {
  const groupRef = useRef<Group>(null);
  const { position, rotation, scale } = node.position;
  
  // Animation state
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Breathing animation for unlocked nodes
    if (node.isUnlocked) {
      const breathPhase = (Math.sin(time * 0.5 + position.x * 0.5) + 1) * 0.5;
      const breathScale = 1 + breathPhase * 0.1;
      groupRef.current.scale.setScalar(scale * breathScale);
    } else {
      // Subtle pulse for locked nodes
      const pulsePhase = (Math.sin(time * 0.2) + 1) * 0.5;
      groupRef.current.scale.setScalar(scale * (0.6 + pulsePhase * 0.1));
    }
    
    // Selection glow
    if (isSelected) {
      const glowPhase = Math.sin(time * 3) * 0.3 + 0.7;
      groupRef.current.scale.setScalar(scale * (1.2 + glowPhase * 0.2));
    }
    
    // Hover animation
    if (isHovered && node.isUnlocked) {
      groupRef.current.scale.setScalar(scale * 1.15);
    }
    
    // Orbital motion for energy
    if (node.energy > 0.5) {
      const orbitSpeed = node.energy * 0.1;
      const orbitRadius = 0.1;
      const orbitX = Math.sin(time * orbitSpeed) * orbitRadius;
      const orbitY = Math.cos(time * orbitSpeed * 0.7) * orbitRadius * 0.5;
      groupRef.current.position.set(
        position.x + orbitX,
        position.y + orbitY,
        position.z
      );
    } else {
      groupRef.current.position.copy(position);
    }
    
    // Rotation based on energy
    groupRef.current.rotation.y = rotation + time * node.energy * 0.2;
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
  });
  
  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick();
  };
  
  const handlePointerEnter = () => {
    onHover(node);
    document.body.style.cursor = node.isUnlocked ? 'pointer' : 'not-allowed';
  };
  
  const handlePointerLeave = () => {
    onHover(null);
    document.body.style.cursor = 'default';
  };
  
  // Render appropriate visual metaphor
  const renderMetaphor = () => {
    const props = {
      node,
      isSelected,
      isHovered,
      onClick: handleClick,
      onPointerEnter: handlePointerEnter,
      onPointerLeave: handlePointerLeave
    };
    
    switch (node.visualMetaphor) {
      case 'lotus':
        return <LotusNode {...props} />;
      case 'pool':
        return <PoolNode {...props} />;
      case 'mandala':
        return <MandalaNode {...props} />;
      case 'tree':
        return <TreeNode {...props} />;
      case 'crystal':
        return <CrystalNode {...props} />;
      case 'spiral':
        return <SpiralNode {...props} />;
      case 'star':
        return <StarNode {...props} />;
      case 'web':
        return <WebNode {...props} />;
      case 'flame':
        return <FlameNode {...props} />;
      case 'void':
        return <VoidNode {...props} />;
      default:
        return <MandalaNode {...props} />;
    }
  };
  
  return (
    <group ref={groupRef} position={position}>
      {renderMetaphor()}
      
      {/* Module label */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.2}
          color={node.isUnlocked ? "#a7f3d0" : "#64748b"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Medium.woff"
          maxWidth={3}
          textAlign="center"
        >
          {node.module.name}
        </Text>
      )}
      
      {/* Lock indicator for unavailable modules */}
      {!node.isUnlocked && (
        <mesh position={[0, 0, 0.2]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color="#475569" 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      )}
      
      {/* Energy particles for active nodes */}
      {node.isUnlocked && node.energy > 0.7 && (
        <points position={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attachObject={['attributes', 'position']}
              count={20}
              array={new Float32Array(Array.from({ length: 60 }, () => (Math.random() - 0.5) * 2))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#a855f7"
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};