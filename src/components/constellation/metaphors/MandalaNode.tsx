import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface MandalaNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const MandalaNode: React.FC<MandalaNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const centerRef = useRef<Mesh>(null);
  const ringRefs = useRef<(Mesh | null)[]>([]);
  
  const isActive = node.isUnlocked;
  const numRings = 4;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Center meditation sphere
    if (centerRef.current) {
      const breathPhase = Math.sin(time * 0.6) * 0.5 + 0.5;
      centerRef.current.scale.setScalar(isActive ? 1 + breathPhase * 0.2 : 0.6);
      
      if (centerRef.current.material && 'emissiveIntensity' in centerRef.current.material) {
        const material = centerRef.current.material as any;
        material.emissiveIntensity = isActive ? 0.2 + breathPhase * 0.1 : 0.05;
      }
    }
    
    // Concentric rings rotating
    ringRefs.current.forEach((ring, index) => {
      if (!ring) return;
      
      const ringSpeed = isActive ? (index + 1) * 0.1 : (index + 1) * 0.02;
      const direction = index % 2 === 0 ? 1 : -1;
      
      ring.rotation.z = time * ringSpeed * direction;
      
      // Expansion based on meditation depth
      const expansionPhase = Math.sin(time * 0.4 + index * 0.8) * 0.1 + 0.9;
      ring.scale.setScalar(isActive ? expansionPhase : 0.3);
      
      if (ring.material && 'opacity' in ring.material) {
        const material = ring.material as any;
        material.opacity = isActive ? 0.4 + Math.sin(time + index) * 0.1 : 0.1;
      }
    });
    
    // Overall mandala breathing
    groupRef.current.rotation.y = time * 0.05;
  });
  
  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Center meditation sphere */}
      <mesh ref={centerRef}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial 
          color={isActive ? "#a855f7" : "#4c1d95"}
          emissive={isActive ? "#581c87" : "#1e1b4b"}
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Concentric sacred rings */}
      {Array.from({ length: numRings }, (_, index) => (
        <mesh
          key={index}
          ref={(el) => (ringRefs.current[index] = el)}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.4 + index * 0.3, 0.5 + index * 0.3, 32]} />
          <meshBasicMaterial 
            color={isActive ? "#a855f7" : "#6b21a8"}
            transparent
            opacity={0.4}
            wireframe={index % 2 === 1}
          />
        </mesh>
      ))}
      
      {/* Sacred geometry petals */}
      {Array.from({ length: 8 }, (_, index) => (
        <mesh
          key={`petal-${index}`}
          position={[
            Math.cos((index / 8) * Math.PI * 2) * 0.6,
            Math.sin((index / 8) * Math.PI * 2) * 0.6,
            0
          ]}
          rotation={[0, 0, (index / 8) * Math.PI * 2]}
        >
          <coneGeometry args={[0.05, 0.2, 6]} />
          <meshStandardMaterial 
            color={isActive ? "#c084fc" : "#7c3aed"}
            transparent
            opacity={isActive ? 0.7 : 0.2}
            emissive="#581c87"
            emissiveIntensity={isActive ? 0.1 : 0.02}
          />
        </mesh>
      ))}
      
      {/* Lotus base pattern */}
      <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 32]} />
        <meshBasicMaterial 
          color="#a855f7" 
          transparent 
          opacity={isActive ? 0.05 : 0.01}
        />
      </mesh>
      
      {/* Energy field visualization */}
      {isActive && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={50}
              array={new Float32Array(Array.from({ length: 150 }, () => (Math.random() - 0.5) * 3))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.01}
            color="#e879f9"
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
      
      {/* Selection highlight */}
      {(isSelected || isHovered) && isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.0, 1.5, 32]} />
          <meshBasicMaterial 
            color="#a855f7" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
    </group>
  );
};