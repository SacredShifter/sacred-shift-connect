import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface CrystalNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const CrystalNode: React.FC<CrystalNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const crystalRef = useRef<Mesh>(null);
  
  const isActive = node.isUnlocked;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Crystal resonance vibration
    if (crystalRef.current) {
      crystalRef.current.rotation.y = time * 0.5;
      crystalRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      
      const resonancePhase = Math.sin(time * 2) * 0.02 + 1;
      crystalRef.current.scale.setScalar(isActive ? resonancePhase : 0.7);
    }
  });
  
  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Main crystal structure */}
      <mesh ref={crystalRef}>
        <octahedronGeometry args={[0.4, 2]} />
        <meshStandardMaterial 
          color={isActive ? "#06b6d4" : "#0f172a"}
          transparent
          opacity={isActive ? 0.8 : 0.3}
          emissive={isActive ? "#0891b2" : "#1e293b"}
          emissiveIntensity={isActive ? 0.4 : 0.1}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      
      {/* Crystal facets */}
      {Array.from({ length: 8 }, (_, index) => (
        <mesh
          key={index}
          position={[
            Math.cos((index / 8) * Math.PI * 2) * 0.2,
            Math.sin((index / 4) * Math.PI) * 0.3,
            Math.sin((index / 8) * Math.PI * 2) * 0.2
          ]}
          rotation={[
            (index / 8) * Math.PI * 2,
            (index / 8) * Math.PI,
            0
          ]}
        >
          <tetrahedronGeometry args={[0.08]} />
          <meshStandardMaterial 
            color={isActive ? "#0ea5e9" : "#334155"}
            transparent
            opacity={isActive ? 0.6 : 0.2}
            emissive="#0c4a6e"
            emissiveIntensity={isActive ? 0.2 : 0.05}
          />
        </mesh>
      ))}
      
      {/* Energy field resonance */}
      {isActive && (
        <>
          <mesh>
            <sphereGeometry args={[0.8, 16, 16]} />
            <meshBasicMaterial 
              color="#06b6d4" 
              transparent 
              opacity={0.05}
              wireframe
            />
          </mesh>
          
          {/* Harmonic frequency rings */}
          {Array.from({ length: 3 }, (_, index) => (
            <mesh
              key={`ring-${index}`}
              rotation={[Math.PI / 2, 0, index * Math.PI / 3]}
            >
              <ringGeometry args={[0.5 + index * 0.2, 0.6 + index * 0.2, 24]} />
              <meshBasicMaterial 
                color="#0ea5e9" 
                transparent 
                opacity={0.2}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};