import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Group } from 'three';
import { TaoModule } from '@/config/taoFlowConfig';

interface ChakraModuleData {
  id: string;
  name: string;
  color: string;
  frequency: string;
  modules: TaoModule[];
  isUnlocked: boolean;
}

interface BambooChimeProps {
  chakra: ChakraModuleData;
  position: [number, number, number];
  rotation: [number, number, number];
}

export const BambooChime: React.FC<BambooChimeProps> = ({
  chakra,
  position,
  rotation
}) => {
  const navigate = useNavigate();
  const groupRef = useRef<Group>(null);
  const chimeRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSwaying, setIsSwaying] = useState(false);

  // Ambient swaying animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Ambient swaying
    const ambientSway = Math.sin(time * 0.5) * 0.02;
    const ambientRotation = Math.sin(time * 0.3) * 0.05;
    
    // Interactive swaying when hovered or clicked
    const interactiveSway = (isHovered || isSwaying) ? Math.sin(time * 3) * 0.1 : 0;
    
    groupRef.current.rotation.z = ambientSway + interactiveSway;
    groupRef.current.rotation.x = ambientRotation;
    
    if (chimeRef.current) {
      chimeRef.current.rotation.y = Math.sin(time * 2) * 0.03;
    }
  });

  const handleClick = () => {
    // Always allow access - no restrictions!
    
    if (chakra.modules.length > 0) {
      const targetModule = chakra.modules[0];
      navigate(targetModule.path);
      
      // Trigger swaying animation
      setIsSwaying(true);
      setTimeout(() => setIsSwaying(false), 2000);
      
      // Emit chime event
      window.dispatchEvent(new CustomEvent('chakra-bell', {
        detail: { 
          chakraId: chakra.id,
          frequency: chakra.frequency,
          modulePath: targetModule.path,
          type: 'selection'
        }
      }));
    }
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    
    // Emit hover chime event
    window.dispatchEvent(new CustomEvent('chakra-bell', {
      detail: { 
        chakraId: chakra.id,
        frequency: chakra.frequency,
        modulePath: chakra.modules[0]?.path || chakra.name,
        type: 'hover'
      }
    }));
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  // Calculate color hue from chakra color
  const hue = chakra.color.includes('hsl') 
    ? parseInt(chakra.color.match(/\d+/)?.[0] || '0')
    : 280;

  return (
    <group 
      ref={groupRef}
      position={position}
      rotation={rotation}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* Bamboo hanging rod */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>

      {/* Hanging strings */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh key={`string-${i}`} position={[0, 0, (i - 2) * 0.2]}>
          <cylinderGeometry args={[0.002, 0.002, 0.8, 4]} />
          <meshBasicMaterial color="#654321" />
        </mesh>
      ))}

      {/* Chime tubes */}
      <group ref={chimeRef}>
        {Array.from({ length: 5 }, (_, i) => (
          <mesh key={`chime-${i}`} position={[0, -0.3, (i - 2) * 0.2]}>
            <cylinderGeometry args={[0.015, 0.015, 0.4 + i * 0.1, 8]} />
            <meshStandardMaterial 
              color={`hsl(${hue}, 70%, ${60 + i * 5}%)`}
              metalness={0.3}
              roughness={0.2}
              emissive={isHovered 
                ? `hsl(${hue}, 70%, 20%)`
                : 'black'
              }
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Central striker */}
      <mesh position={[0, -0.1, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#CD853F" 
          metalness={0.1}
          roughness={0.8}
        />
      </mesh>

      {/* Chakra label */}
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.2}
        color="hsl(var(--foreground))"
        anchorX="center"
        anchorY="middle"
      >
        {chakra.name}
      </Text>

      {/* Module count indicator */}
      {chakra.modules.length > 0 && (
        <Text
          position={[0, -2.1, 0]}
          fontSize={0.15}
          color="hsl(var(--muted-foreground))"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {chakra.modules.length} {chakra.modules.length === 1 ? 'module' : 'modules'}
        </Text>
      )}
      
      {/* Energy field for all chimes */}
      {isHovered && (
        <mesh>
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshBasicMaterial 
            color={chakra.color}
            transparent 
            opacity={0.05}
            wireframe
          />
        </mesh>
      )}
    </group>
  );
};