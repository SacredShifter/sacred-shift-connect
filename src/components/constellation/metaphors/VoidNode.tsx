import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface VoidNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const VoidNode: React.FC<VoidNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const voidRef = useRef<Mesh>(null);
  const edgeRefs = useRef<(Mesh | null)[]>([]);
  
  const isActive = node.isUnlocked;
  const numEdges = 12;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Void breathing - subtle expansion/contraction
    if (voidRef.current) {
      const voidPhase = Math.sin(time * 0.2) * 0.1 + 1;
      voidRef.current.scale.setScalar(isActive ? voidPhase : 0.8);
    }
    
    // Event horizon shimmer
    edgeRefs.current.forEach((edge, index) => {
      if (!edge) return;
      
      const edgeTime = time + index * 0.3;
      const shimmerPhase = Math.sin(edgeTime * 0.8) * 0.2 + 0.3;
      
      edge.rotation.y = (index / numEdges) * Math.PI * 2 + time * 0.05;
      edge.rotation.x = Math.sin(edgeTime * 0.4) * 0.1;
      
      if (edge.material && 'opacity' in edge.material) {
        const material = edge.material as any;
        material.opacity = isActive ? shimmerPhase : shimmerPhase * 0.3;
      }
    });
    
    // Gentle rotation in silence
    groupRef.current.rotation.y = time * 0.02;
  });
  
  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Void center - absence of light */}
      <mesh ref={voidRef}>
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color="#0f0f0f"
          transparent
          opacity={isActive ? 0.9 : 0.6}
        />
      </mesh>
      
      {/* Event horizon rings */}
      {Array.from({ length: 3 }, (_, index) => (
        <mesh
          key={`horizon-${index}`}
          rotation={[Math.PI / 2, 0, index * Math.PI / 3]}
        >
          <ringGeometry args={[0.4 + index * 0.1, 0.45 + index * 0.1, 32]} />
          <meshBasicMaterial 
            color={isActive ? "#374151" : "#1f2937"}
            transparent 
            opacity={isActive ? 0.4 : 0.2}
          />
        </mesh>
      ))}
      
      {/* Void edge distortion */}
      {Array.from({ length: numEdges }, (_, index) => (
        <mesh
          key={index}
          ref={(el) => (edgeRefs.current[index] = el)}
          position={[
            Math.cos((index / numEdges) * Math.PI * 2) * 0.5,
            Math.sin((index / numEdges) * Math.PI * 2) * 0.5,
            Math.sin(index) * 0.1
          ]}
        >
          <boxGeometry args={[0.02, 0.02, 0.1]} />
          <meshBasicMaterial 
            color={isActive ? "#4b5563" : "#374151"}
            transparent
            opacity={0.3}
          />
        </mesh>
      ))}
      
      {/* Silence field */}
      <mesh>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshBasicMaterial 
          color="#1f2937" 
          transparent 
          opacity={isActive ? 0.02 : 0.005}
          wireframe
        />
      </mesh>
      
      {/* Return to source indicator */}
      {isActive && (
        <mesh>
          <torusGeometry args={[0.6, 0.02, 8, 16]} />
          <meshBasicMaterial 
            color="#6b7280" 
            transparent 
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};