import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { EnhancedChakraData } from '@/data/enhancedChakraData';

interface ChakraProgressSpineProps {
  chakras: EnhancedChakraData[];
  completedChakras: string[];
  getYPosition: (chakraId: string) => number;
}

export const ChakraProgressSpine: React.FC<ChakraProgressSpineProps> = ({ 
  chakras, 
  completedChakras,
  getYPosition 
}) => {
  const spineRef = useRef<THREE.Group>(null);

  // Gentle pulsing animation for active spine
  useFrame(({ clock }) => {
    if (!spineRef.current) return;
    
    const time = clock.getElapsedTime();
    const pulse = Math.sin(time * 2) * 0.1 + 1;
    
    // Scale spine connections based on progress
    spineRef.current.children.forEach((child, index) => {
      if (child.userData.isConnection) {
        const chakraId = chakras[index]?.id;
        if (chakraId && completedChakras.includes(chakraId)) {
          child.scale.setScalar(pulse);
        }
      }
    });
  });

  return (
    <group ref={spineRef} position={[-4, 0, 0]}>
      {/* Central Spine Line */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 20, 8]} />
        <meshStandardMaterial 
          color="#9966CC" 
          transparent 
          opacity={0.3}
          emissive="#9966CC"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Chakra Connection Points */}
      {chakras.map((chakra, index) => {
        const yPos = getYPosition(chakra.id);
        const isCompleted = completedChakras.includes(chakra.id);
        const hasProgress = chakra.bells.some(bell => bell.isCompleted);
        
        return (
          <group key={chakra.id} position={[0, yPos, 0]}>
            {/* Connection Node */}
            <mesh userData={{ isConnection: true }}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial 
                color={hasProgress ? chakra.color : '#666666'}
                transparent
                opacity={hasProgress ? 0.9 : 0.4}
                emissive={hasProgress ? chakra.color : '#000000'}
                emissiveIntensity={hasProgress ? 0.4 : 0}
              />
            </mesh>

            {/* Progress Ring */}
            {hasProgress && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[0.25, 0.02, 8, 16]} />
                <meshStandardMaterial 
                  color={chakra.color}
                  transparent
                  opacity={0.6}
                  emissive={chakra.color}
                  emissiveIntensity={0.2}
                />
              </mesh>
            )}

            {/* Energy Flow Line to Next Chakra */}
            {index < chakras.length - 1 && hasProgress && (
              <group>
                {/* Flowing particles effect */}
                {Array.from({ length: 3 }, (_, particleIndex) => {
                  const nextYPos = getYPosition(chakras[index + 1].id);
                  const flowHeight = nextYPos - yPos;
                  const particleY = (particleIndex / 2) * flowHeight;
                  
                  return (
                    <mesh 
                      key={particleIndex}
                      position={[0, particleY, 0]}
                    >
                      <sphereGeometry args={[0.03, 4, 4]} />
                      <meshBasicMaterial 
                        color={chakra.color}
                        transparent
                        opacity={0.8}
                      />
                    </mesh>
                  );
                })}
              </group>
            )}
          </group>
        );
      })}

      {/* Crown Connection - Special cosmic effect */}
      {completedChakras.includes('crown') && (
        <group position={[0, getYPosition('crown') + 1, 0]}>
          <mesh>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshBasicMaterial 
              color="#9966CC"
              transparent
              opacity={0.1}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Ascending particles */}
          {Array.from({ length: 5 }, (_, i) => (
            <mesh key={i} position={[0, i * 0.3, 0]}>
              <sphereGeometry args={[0.02, 4, 4]} />
              <meshBasicMaterial 
                color="#FFD700"
                transparent
                opacity={1 - i * 0.2}
              />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};