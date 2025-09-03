import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface SpiralNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (event: any) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const SpiralNode: React.FC<SpiralNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const spiralRefs = useRef<(Mesh | null)[]>([]);
  
  const isActive = node.isUnlocked;
  const spiralCount = 24;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Golden spiral evolution
    spiralRefs.current.forEach((spiral, index) => {
      if (!spiral) return;
      
      const phi = 1.618033988749; // Golden ratio
      const angle = index * (Math.PI * 2 / phi) + time * 0.2;
      const radius = Math.sqrt(index) * 0.08;
      
      spiral.position.x = Math.cos(angle) * radius;
      spiral.position.y = Math.sin(angle) * radius;
      spiral.position.z = (index - spiralCount / 2) * 0.02;
      
      spiral.rotation.x = time * 0.1 + index * 0.1;
      spiral.rotation.y = angle;
      
      const evolutionPhase = isActive ? 
        Math.sin(time * 0.4 + index * 0.2) * 0.3 + 0.8 :
        Math.sin(time * 0.1 + index * 0.1) * 0.1 + 0.3;
      
      spiral.scale.setScalar(evolutionPhase);
    });
    
    // Overall spiral rotation
    groupRef.current.rotation.z = time * 0.05;
  });
  
  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Central wisdom core */}
      <mesh>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial 
          color={isActive ? "#f59e0b" : "#451a03"}
          emissive={isActive ? "#d97706" : "#1c1917"}
          emissiveIntensity={isActive ? 0.3 : 0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Golden spiral elements */}
      {Array.from({ length: spiralCount }, (_, index) => (
        <mesh
          key={index}
          ref={(el) => (spiralRefs.current[index] = el)}
        >
          <boxGeometry args={[0.03, 0.03, 0.03]} />
          <meshStandardMaterial 
            color={isActive ? "#fbbf24" : "#78350f"}
            transparent
            opacity={isActive ? 0.8 : 0.2}
            emissive="#f59e0b"
            emissiveIntensity={isActive ? 0.2 : 0.05}
          />
        </mesh>
      ))}
      
      {/* Evolution rings */}
      {Array.from({ length: 3 }, (_, index) => (
        <mesh
          key={`evolution-${index}`}
          rotation={[Math.PI / 2, 0, index * Math.PI / 4]}
        >
          <ringGeometry args={[0.3 + index * 0.2, 0.4 + index * 0.2, 16]} />
          <meshBasicMaterial 
            color="#f59e0b" 
            transparent 
            opacity={isActive ? 0.2 : 0.05}
            wireframe={index % 2 === 1}
          />
        </mesh>
      ))}
      
      {/* Knowledge emanation */}
      {isActive && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={30}
              array={new Float32Array(Array.from({ length: 90 }, () => (Math.random() - 0.5) * 2))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.02}
            color="#fbbf24"
            transparent
            opacity={0.6}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};