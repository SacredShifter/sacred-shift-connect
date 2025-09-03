import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface StarNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const StarNode: React.FC<StarNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const rayRefs = useRef<(Mesh | null)[]>([]);
  
  const isActive = node.isUnlocked;
  const numRays = 8;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Star core pulsing
    if (coreRef.current) {
      const pulsePhase = Math.sin(time * 1.5) * 0.3 + 1;
      coreRef.current.scale.setScalar(isActive ? pulsePhase : 0.5);
      
      if (coreRef.current.material && 'emissiveIntensity' in coreRef.current.material) {
        const material = coreRef.current.material as any;
        material.emissiveIntensity = isActive ? 0.5 + Math.sin(time * 2) * 0.2 : 0.1;
      }
    }
    
    // Star rays emanating
    rayRefs.current.forEach((ray, index) => {
      if (!ray) return;
      
      const rayTime = time + index * 0.3;
      const rayPhase = Math.sin(rayTime) * 0.5 + 0.5;
      
      ray.scale.y = isActive ? 0.5 + rayPhase * 0.8 : 0.2;
      ray.rotation.z = (index / numRays) * Math.PI * 2 + time * 0.1;
      
      if (ray.material && 'emissiveIntensity' in ray.material) {
        const material = ray.material as any;
        material.emissiveIntensity = isActive ? rayPhase * 0.3 : 0.05;
      }
    });
  });
  
  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Star core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial 
          color={isActive ? "#fbbf24" : "#451a03"}
          emissive={isActive ? "#f59e0b" : "#1c1917"}
          emissiveIntensity={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Star rays */}
      {Array.from({ length: numRays }, (_, index) => (
        <mesh
          key={index}
          ref={(el) => (rayRefs.current[index] = el)}
          position={[0, 0.4, 0]}
        >
          <coneGeometry args={[0.02, 0.8, 4]} />
          <meshStandardMaterial 
            color={isActive ? "#fbbf24" : "#78350f"}
            transparent
            opacity={isActive ? 0.8 : 0.3}
            emissive="#f59e0b"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      
      {/* Guidance aura */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshBasicMaterial 
          color="#fbbf24" 
          transparent 
          opacity={isActive ? 0.05 : 0.01}
        />
      </mesh>
      
      {/* Wisdom emanation pattern */}
      {isActive && (
        <>
          {Array.from({ length: 3 }, (_, index) => (
            <mesh
              key={`wisdom-${index}`}
              rotation={[0, 0, index * Math.PI / 3]}
            >
              <ringGeometry args={[0.4 + index * 0.2, 0.5 + index * 0.2, 24]} />
              <meshBasicMaterial 
                color="#fbbf24" 
                transparent 
                opacity={0.1}
              />
            </mesh>
          ))}
        </>
      )}
    </group>
  );
};