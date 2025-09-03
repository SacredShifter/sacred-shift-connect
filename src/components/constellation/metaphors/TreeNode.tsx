import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface TreeNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (event: any) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const TreeNode: React.FC<TreeNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const trunkRef = useRef<Mesh>(null);
  const crownRef = useRef<Mesh>(null);
  
  const isActive = node.isUnlocked;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Tree swaying in cosmic wind
    if (trunkRef.current) {
      trunkRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      trunkRef.current.rotation.z = Math.cos(time * 0.2) * 0.05;
    }
    
    // Crown breathing and growing
    if (crownRef.current) {
      const growthPhase = isActive ? 
        Math.sin(time * 0.4) * 0.1 + 1.2 : 
        Math.sin(time * 0.2) * 0.05 + 0.6;
      
      crownRef.current.scale.setScalar(growthPhase);
      crownRef.current.rotation.y = time * 0.1;
    }
  });
  
  return (
    <group
      ref={groupRef}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    >
      {/* Tree trunk */}
      <mesh ref={trunkRef} position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.6, 8]} />
        <meshStandardMaterial 
          color={isActive ? "#92400e" : "#451a03"}
          roughness={0.8}
        />
      </mesh>
      
      {/* Tree crown */}
      <mesh ref={crownRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.4, 8, 8]} />
        <meshStandardMaterial 
          color={isActive ? "#16a34a" : "#15803d"}
          transparent
          opacity={isActive ? 0.8 : 0.3}
          emissive={isActive ? "#166534" : "#052e16"}
          emissiveIntensity={isActive ? 0.2 : 0.05}
        />
      </mesh>
      
      {/* Roots pattern */}
      <mesh position={[0, -0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.8, 16]} />
        <meshBasicMaterial 
          color="#92400e" 
          transparent 
          opacity={isActive ? 0.3 : 0.1}
          wireframe
        />
      </mesh>
      
      {/* Community connections (branches) */}
      {isActive && Array.from({ length: 6 }, (_, index) => (
        <mesh
          key={index}
          position={[
            Math.cos((index / 6) * Math.PI * 2) * 0.3,
            0.1 + Math.sin((index / 6) * Math.PI * 2) * 0.1,
            Math.sin((index / 6) * Math.PI * 2) * 0.3
          ]}
          rotation={[0, (index / 6) * Math.PI * 2, Math.PI / 4]}
        >
          <cylinderGeometry args={[0.02, 0.04, 0.3, 4]} />
          <meshStandardMaterial 
            color="#92400e"
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}
    </group>
  );
};