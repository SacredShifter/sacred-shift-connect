import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface FlameNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: () => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const FlameNode: React.FC<FlameNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const flameRefs = useRef<(Mesh | null)[]>([]);
  
  const isActive = node.isUnlocked;
  const numFlames = 6;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Flame core intensity
    if (coreRef.current) {
      const intensityPhase = Math.sin(time * 3) * 0.4 + 1;
      coreRef.current.scale.setScalar(isActive ? intensityPhase : 0.4);
      
      if (coreRef.current.material && 'emissiveIntensity' in coreRef.current.material) {
        const material = coreRef.current.material as any;
        material.emissiveIntensity = isActive ? 0.8 + Math.sin(time * 4) * 0.2 : 0.2;
      }
    }
    
    // Flame tendrils dancing
    flameRefs.current.forEach((flame, index) => {
      if (!flame) return;
      
      const flameTime = time + index * 0.4;
      const dancePhase = Math.sin(flameTime * 2) * 0.3;
      
      flame.scale.y = isActive ? 0.8 + Math.sin(flameTime * 1.5) * 0.4 : 0.3;
      flame.rotation.z = dancePhase;
      flame.position.x = Math.sin(flameTime) * 0.1;
      
      const height = 0.3 + (index / numFlames) * 0.4;
      flame.position.y = height + Math.sin(flameTime * 2) * 0.1;
    });
  });
  
  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Flame base/core */}
      <mesh ref={coreRef} position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial 
          color={isActive ? "#dc2626" : "#7f1d1d"}
          emissive={isActive ? "#ef4444" : "#450a0a"}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      
      {/* Flame tendrils */}
      {Array.from({ length: numFlames }, (_, index) => (
        <mesh
          key={index}
          ref={(el) => (flameRefs.current[index] = el)}
          position={[
            Math.sin((index / numFlames) * Math.PI * 2) * 0.08,
            0.1 + index * 0.08,
            Math.cos((index / numFlames) * Math.PI * 2) * 0.08
          ]}
        >
          <coneGeometry args={[0.06 + index * 0.01, 0.2 + index * 0.05, 6]} />
          <meshStandardMaterial 
            color={index < 2 ? "#fbbf24" : index < 4 ? "#f97316" : "#dc2626"}
            transparent
            opacity={isActive ? 0.8 - index * 0.1 : 0.3}
            emissive={index < 2 ? "#f59e0b" : index < 4 ? "#ea580c" : "#ef4444"}
            emissiveIntensity={isActive ? 0.6 - index * 0.08 : 0.1}
          />
        </mesh>
      ))}
      
      {/* Heat shimmer effect */}
      {isActive && (
        <>
          <mesh>
            <sphereGeometry args={[0.8, 8, 8]} />
            <meshBasicMaterial 
              color="#fbbf24" 
              transparent 
              opacity={0.02}
            />
          </mesh>
          
          {/* Transformation particles */}
          <points>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={25}
                array={new Float32Array(Array.from({ length: 75 }, () => (Math.random() - 0.5) * 1.5))}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.015}
              color="#f97316"
              transparent
              opacity={0.7}
              sizeAttenuation
            />
          </points>
        </>
      )}
    </group>
  );
};