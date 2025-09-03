import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group } from 'three';
import { ConstellationNode } from '@/config/sacredGeometry';

interface WebNodeProps {
  node: ConstellationNode;
  isSelected: boolean;
  isHovered: boolean;
  onClick: (event: any) => void;
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

export const WebNode: React.FC<WebNodeProps> = ({
  node,
  isSelected,
  isHovered,
  onClick,
  onPointerEnter,
  onPointerLeave
}) => {
  const groupRef = useRef<Group>(null);
  const hubRef = useRef<Mesh>(null);
  const connectionRefs = useRef<(Mesh | null)[]>([]);
  
  const isActive = node.isUnlocked;
  const numConnections = 12;
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Central hub pulsing
    if (hubRef.current) {
      const networkPhase = Math.sin(time * 0.8) * 0.2 + 1;
      hubRef.current.scale.setScalar(isActive ? networkPhase : 0.6);
    }
    
    // Connection lines expanding and contracting
    connectionRefs.current.forEach((connection, index) => {
      if (!connection) return;
      
      const connectionTime = time + index * 0.2;
      const expansionPhase = Math.sin(connectionTime * 0.5) * 0.3 + 0.7;
      
      connection.scale.x = isActive ? expansionPhase : 0.3;
      connection.rotation.y = (index / numConnections) * Math.PI * 2 + time * 0.1;
      
      if (connection.material && 'opacity' in connection.material) {
        const material = connection.material as any;
        material.opacity = isActive ? expansionPhase * 0.6 : 0.1;
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
      {/* Central network hub */}
      <mesh ref={hubRef}>
        <icosahedronGeometry args={[0.25, 1]} />
        <meshStandardMaterial 
          color={isActive ? "#06b6d4" : "#1e293b"}
          emissive={isActive ? "#0891b2" : "#0f172a"}
          emissiveIntensity={isActive ? 0.4 : 0.1}
          transparent
          opacity={0.9}
          wireframe
        />
      </mesh>
      
      {/* Network connection lines */}
      {Array.from({ length: numConnections }, (_, index) => (
        <mesh
          key={index}
          ref={(el) => (connectionRefs.current[index] = el)}
          position={[0.5, 0, 0]}
          rotation={[0, (index / numConnections) * Math.PI * 2, 0]}
        >
          <cylinderGeometry args={[0.005, 0.005, 1, 4]} />
          <meshStandardMaterial 
            color={isActive ? "#0ea5e9" : "#475569"}
            transparent
            opacity={0.6}
            emissive="#0c4a6e"
            emissiveIntensity={isActive ? 0.2 : 0.05}
          />
        </mesh>
      ))}
      
      {/* Network nodes at connection endpoints */}
      {Array.from({ length: numConnections }, (_, index) => (
        <mesh
          key={`node-${index}`}
          position={[
            Math.cos((index / numConnections) * Math.PI * 2) * 0.8,
            Math.sin((index / numConnections) * Math.PI * 2) * 0.8,
            Math.sin(index) * 0.2
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial 
            color={isActive ? "#0ea5e9" : "#64748b"}
            transparent
            opacity={isActive ? 0.8 : 0.3}
            emissive="#0c4a6e"
            emissiveIntensity={isActive ? 0.3 : 0.05}
          />
        </mesh>
      ))}
      
      {/* Data flow visualization */}
      {isActive && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={40}
              array={new Float32Array(Array.from({ length: 120 }, () => (Math.random() - 0.5) * 2))}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.01}
            color="#06b6d4"
            transparent
            opacity={0.8}
            sizeAttenuation
          />
        </points>
      )}
    </group>
  );
};