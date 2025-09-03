import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import type { ConstellationNode } from '@/config/sacredGeometry';

interface PoolNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const PoolNode: React.FC<PoolNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const waterRef = useRef<Mesh>(null);
  const glyphRefs = useRef<(Mesh | null)[]>([]);
  
  const isActive = node.isUnlocked;
  const numGlyphs = 6;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Water surface animation
    if (waterRef.current) {
      waterRef.current.rotation.z = time * 0.05;
      waterRef.current.position.y = Math.sin(time * 0.8) * 0.02;
      
      if (waterRef.current.material && 'emissiveIntensity' in waterRef.current.material) {
        const material = waterRef.current.material as any;
        material.emissiveIntensity = 0.1 + Math.sin(time * 0.5) * 0.05;
      }
    }
    
    // Glyphs appearing from depths
    glyphRefs.current.forEach((glyph, index) => {
      if (!glyph) return;
      
      const glyphTime = time + index * 1.2;
      const emergencePhase = isActive ? 
        Math.sin(glyphTime * 0.3) * 0.5 + 0.5 : 
        Math.sin(glyphTime * 0.1) * 0.1;
      
      const angle = (index / numGlyphs) * Math.PI * 2 + time * 0.1;
      glyph.position.x = Math.cos(angle) * 0.4;
      glyph.position.z = Math.sin(angle) * 0.4;
      glyph.position.y = -0.3 + emergencePhase * 0.6;
      
      glyph.rotation.x = time * 0.2 + index;
      glyph.rotation.y = angle + time * 0.3;
      
      if (glyph.material && 'opacity' in glyph.material) {
        const material = glyph.material as any;
        material.opacity = isActive ? emergencePhase * 0.8 : emergencePhase * 0.2;
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
      {/* Pool base */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.4, 16]} />
        <meshStandardMaterial 
          color="#1e293b"
          roughness={0.2}
          metalness={0.3}
        />
      </mesh>
      
      {/* Water surface */}
      <mesh ref={waterRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.7, 32]} />
        <meshStandardMaterial 
          color={isActive ? "#0ea5e9" : "#475569"}
          transparent
          opacity={0.7}
          emissive={isActive ? "#0369a1" : "#1e293b"}
          emissiveIntensity={0.1}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>
      
      {/* Reflection ripples */}
      <mesh position={[0, 0.01, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.2, 0.7, 16]} />
        <meshBasicMaterial 
          color="#0ea5e9" 
          transparent 
          opacity={isActive ? 0.1 : 0.02}
          wireframe
        />
      </mesh>
      
      {/* Sacred glyphs emerging from water */}
      {Array.from({ length: numGlyphs }, (_, index) => (
        <mesh
          key={index}
          ref={(el) => (glyphRefs.current[index] = el)}
        >
          <octahedronGeometry args={[0.08, 1]} />
          <meshStandardMaterial 
            color="#a7f3d0"
            transparent
            opacity={0.6}
            emissive="#065f46"
            emissiveIntensity={isActive ? 0.3 : 0.05}
          />
        </mesh>
      ))}
      
      {/* Pool edge details */}
      <mesh position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.7, 0.8, 24]} />
        <meshStandardMaterial 
          color="#334155"
          roughness={0.8}
        />
      </mesh>
      
      {/* Depth indicator */}
      {isActive && (
        <mesh position={[0, -0.3, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color="#0ea5e9" 
            transparent 
            opacity={0.3}
          />
        </mesh>
      )}
      
      {/* Selection aura */}
      {(isSelected || isHovered) && isActive && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 1.2, 32]} />
          <meshBasicMaterial 
            color="#0ea5e9" 
            transparent 
            opacity={0.2}
          />
        </mesh>
      )}
    </group>
  );
};