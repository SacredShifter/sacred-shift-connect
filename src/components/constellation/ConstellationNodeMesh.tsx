import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { Text } from '@react-three/drei';
import type { ConstellationNode } from '@/config/sacredGeometry';

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
  
  const handleClick = () => {
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

  // Get color based on visual metaphor
  const getNodeColor = () => {
    switch (node.visualMetaphor) {
      case 'lotus': return node.isUnlocked ? "#06b6d4" : "#334155"; // Breath - cyan
      case 'pool': return node.isUnlocked ? "#0ea5e9" : "#475569"; // Journal - blue  
      case 'mandala': return node.isUnlocked ? "#a855f7" : "#4c1d95"; // Meditation - purple
      case 'tree': return node.isUnlocked ? "#16a34a" : "#15803d"; // Community - green
      case 'crystal': return node.isUnlocked ? "#06b6d4" : "#0f172a"; // Technology - cyan
      case 'spiral': return node.isUnlocked ? "#f59e0b" : "#451a03"; // Learning - amber
      case 'star': return node.isUnlocked ? "#fbbf24" : "#451a03"; // Guidance - yellow
      case 'web': return node.isUnlocked ? "#06b6d4" : "#1e293b"; // Network - cyan
      case 'flame': return node.isUnlocked ? "#dc2626" : "#7f1d1d"; // Transformation - red
      case 'void': return node.isUnlocked ? "#4b5563" : "#1f2937"; // Silence - gray
      default: return node.isUnlocked ? "#a855f7" : "#4c1d95";
    }
  };

  const getNodeGeometry = () => {
    switch (node.visualMetaphor) {
      case 'crystal':
        return <octahedronGeometry args={[0.3, 1]} />;
      case 'tree':
        return <sphereGeometry args={[0.25, 8, 8]} />;
      case 'star':
        return <coneGeometry args={[0.3, 0.6, 5]} />;
      case 'web':
        return <icosahedronGeometry args={[0.3, 1]} />;
      default:
        return <sphereGeometry args={[0.3, 16, 16]} />;
    }
  };

  return (
    <group ref={groupRef} position={position}>
      {/* Main node */}
      <mesh
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {getNodeGeometry()}
        <meshStandardMaterial 
          color={getNodeColor()}
          emissive={getNodeColor()}
          emissiveIntensity={node.isUnlocked ? 0.2 : 0.05}
          transparent
          opacity={node.isUnlocked ? 0.8 : 0.4}
          wireframe={node.visualMetaphor === 'web'}
        />
      </mesh>
      
      {/* Module label */}
      {(isHovered || isSelected) && (
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.12}
          color={node.isUnlocked ? "#a7f3d0" : "#64748b"}
          anchorX="center"
          anchorY="middle"
          maxWidth={3}
          textAlign="center"
        >
          {node.module.name}
        </Text>
      )}
      
      {/* Lock indicator for unavailable modules */}
      {!node.isUnlocked && (
        <mesh position={[0, 0, 0.4]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial 
            color="#475569" 
            transparent 
            opacity={0.6} 
          />
        </mesh>
      )}
      
      {/* Energy particles for active nodes */}
      {node.isUnlocked && node.energy > 0.7 && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={15}
              array={new Float32Array(Array.from({ length: 45 }, () => (Math.random() - 0.5) * 1.5))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color={getNodeColor()}
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};