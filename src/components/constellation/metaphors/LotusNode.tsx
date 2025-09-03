import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface LotusNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const LotusNode: React.FC<LotusNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const petalRefs = useRef<(Mesh | null)[]>([]);
  
  const numPetals = 8;
  const isOpen = node.isUnlocked;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Lotus opening/closing animation
    const openingPhase = isOpen ? 1 : Math.sin(time * 0.3) * 0.1 + 0.1;
    
    petalRefs.current.forEach((petal, index) => {
      if (!petal) return;
      
      const angle = (index / numPetals) * Math.PI * 2;
      const petalOffset = time * 0.2 + index * 0.5;
      
      // Petal opening motion
      petal.rotation.x = -openingPhase * Math.PI * 0.3;
      petal.position.x = Math.cos(angle) * openingPhase * 0.5;
      petal.position.y = Math.sin(angle) * openingPhase * 0.5;
      petal.position.z = Math.sin(petalOffset) * 0.1;
      
      // Color transitions
      if (petal.material && 'color' in petal.material) {
        const material = petal.material as any;
        if (isOpen) {
          material.color.setHSL(0.8, 0.8, 0.7); // Bright cyan-blue
        } else {
          material.color.setHSL(0.8, 0.3, 0.4); // Dim blue
        }
      }
    });
    
    // Center glow
    groupRef.current.rotation.y = time * 0.1;
  });
  
  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Lotus center */}
      <mesh>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial 
          color={isOpen ? "#06b6d4" : "#334155"}
          emissive={isOpen ? "#064e3b" : "#0f172a"}
          emissiveIntensity={isOpen ? 0.3 : 0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Lotus petals */}
      {Array.from({ length: numPetals }, (_, index) => (
        <mesh
          key={index}
          ref={(el) => (petalRefs.current[index] = el)}
          position={[0, 0, 0]}
        >
          <coneGeometry args={[0.15, 0.6, 6]} />
          <meshStandardMaterial 
            color="#0891b2"
            transparent
            opacity={isOpen ? 0.8 : 0.3}
            emissive="#0c4a6e"
            emissiveIntensity={isOpen ? 0.2 : 0.05}
          />
        </mesh>
      ))}
      
      {/* Sacred geometry base */}
      <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.4, 0.8, 24]} />
        <meshBasicMaterial 
          color="#0891b2" 
          transparent 
          opacity={isOpen ? 0.2 : 0.05}
          wireframe
        />
      </mesh>
      
      {/* Energy field when selected */}
      {(isSelected || isHovered) && isOpen && (
        <mesh>
          <sphereGeometry args={[1.2, 16, 16]} />
          <meshBasicMaterial 
            color="#06b6d4" 
            transparent 
            opacity={0.1}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};