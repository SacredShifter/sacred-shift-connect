import React, { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
import { Mesh, Group, Vector3 } from 'three';
import { ChakraData } from '@/data/chakraData';
import { TaoModule } from '@/config/taoFlowConfig';

interface ChakraModuleData extends ChakraData {
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
  const chimeRef = useRef<Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSwaying, setIsSwaying] = useState(false);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Gentle ambient sway
    const ambientSway = Math.sin(time * 0.5) * 0.02;
    groupRef.current.rotation.z = ambientSway;
    
    // Enhanced sway when hovered or recently interacted
    if (isSwaying || isHovered) {
      const swayIntensity = isHovered ? 0.2 : 0.1;
      const swayFreq = isHovered ? 3 : 1.5;
      groupRef.current.rotation.z += Math.sin(time * swayFreq) * swayIntensity;
    }
  });

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    
    if (!chakra.isUnlocked || chakra.modules.length === 0) return;
    
    // Navigate to first available module
    const targetModule = chakra.modules[0];
    navigate(targetModule.path);
    
    // Trigger swaying animation
    setIsSwaying(true);
    setTimeout(() => setIsSwaying(false), 2000);
    
    // Emit chime selection event
    window.dispatchEvent(new CustomEvent('chakra-bell', {
      detail: { 
        chakraId: chakra.id,
        frequency: chakra.frequency,
        modulePath: targetModule.path,
        type: 'selection'
      }
    }));
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    
    if (chakra.isUnlocked) {
      // Emit hover chime event
      window.dispatchEvent(new CustomEvent('chakra-bell', {
        detail: { 
          chakraId: chakra.id,
          frequency: chakra.frequency,
          modulePath: chakra.modules[0]?.path || chakra.name,
          type: 'hover'
        }
      }));
    }
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
  };

  return (
    <group 
      ref={groupRef} 
      position={position} 
      rotation={rotation}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Bamboo hanging rod */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.8, 8]} />
        <meshStandardMaterial 
          color="#8B7355" 
          roughness={0.8}
        />
      </mesh>
      
      {/* Hanging strings */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh 
          key={`string-${i}`}
          position={[
            (i - 2) * 0.15,
            1.2 - i * 0.2,
            0
          ]}
        >
          <cylinderGeometry args={[0.005, 0.005, 0.8 + i * 0.3, 6]} />
          <meshStandardMaterial 
            color="#F5F5DC" 
            transparent 
            opacity={0.7}
          />
        </mesh>
      ))}
      
      {/* Chime tubes */}
      {Array.from({ length: 5 }, (_, i) => {
        const tubeHeight = 0.8 + i * 0.3;
        const hue = chakra.color.match(/\d+/)?.[0] || '0';
        
        return (
          <mesh 
            key={`chime-${i}`}
            ref={i === 2 ? chimeRef : undefined}
            position={[
              (i - 2) * 0.15,
              0.8 - tubeHeight / 2,
              0
            ]}
          >
            <cylinderGeometry args={[0.02, 0.02, tubeHeight, 12]} />
            <meshStandardMaterial 
              color={chakra.isUnlocked 
                ? `hsl(${hue}, 70%, ${60 + i * 5}%)`
                : "#666666"
              }
              metalness={0.6}
              roughness={0.2}
              emissive={chakra.isUnlocked && isHovered 
                ? `hsl(${hue}, 70%, 20%)`
                : "#000000"
              }
              emissiveIntensity={isHovered ? 0.2 : 0}
            />
          </mesh>
        );
      })}
      
      {/* Central striker */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial 
          color="#CD853F"
          roughness={0.6}
        />
      </mesh>
      
      {/* Chakra label */}
      {chakra.isUnlocked && (
        <Text
          position={[0, -1.5, 0]}
          fontSize={0.2}
          color={chakra.isUnlocked ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))"}
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {chakra.name}
        </Text>
      )}
      
      {/* Module count indicator */}
      {chakra.isUnlocked && chakra.modules.length > 0 && (
        <Text
          position={[0, -1.8, 0]}
          fontSize={0.12}
          color="hsl(var(--muted-foreground))"
          anchorX="center"
          anchorY="middle"
          font="/fonts/Inter-Regular.woff"
        >
          {chakra.modules.length} {chakra.modules.length === 1 ? 'module' : 'modules'}
        </Text>
      )}
      
      {/* Energy field for unlocked chimes */}
      {chakra.isUnlocked && isHovered && (
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