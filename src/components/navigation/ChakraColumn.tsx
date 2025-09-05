import React, { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { EnhancedChakraData, ModuleBell } from '@/data/enhancedChakraData';
// Force rebuild - clear any cache issues with ResonanceRipple import
import { ResonanceRipple } from './ResonanceRipple';

interface ChakraColumnProps {
  chakra: EnhancedChakraData;
  position: [number, number, number];
  onBellClick: (chakra: EnhancedChakraData, bell: ModuleBell) => void;
  strikeRipples: Array<{ id: string; chakraId: string; position: [number, number, number] }>;
}

export const ChakraColumn: React.FC<ChakraColumnProps> = ({ 
  chakra, 
  position, 
  onBellClick,
  strikeRipples
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredBell, setHoveredBell] = useState<string | null>(null);
  const [bellTooltip, setBellTooltip] = useState<{ bell: ModuleBell; position: [number, number, number] } | null>(null);

  // Gentle swaying animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    const ambientSway = Math.sin(time * 0.3 + position[1] * 0.5) * 0.02;
    groupRef.current.rotation.z = ambientSway;
    
    // Individual bell movements
    const bells = groupRef.current.children.filter(child => child.userData.isBell);
    bells.forEach((bell, index) => {
      if (bell instanceof THREE.Group) {
        bell.rotation.y = Math.sin(time * 1.5 + index * 0.8) * 0.03;
        bell.position.y += Math.sin(time * 2 + index) * 0.005;
      }
    });
  });

  // Handle bell click with ripple effect
  const handleBellClick = useCallback((bell: ModuleBell, event: any) => {
    event.stopPropagation();
    
    if (!bell.isUnlocked) return;
    
    // Emit audio event
    window.dispatchEvent(new CustomEvent('chakra-bell', {
      detail: {
        chakraId: chakra.id,
        frequency: bell.frequency,
        modulePath: `/chakra/${chakra.id}/${bell.moduleId}`,
        type: 'selection',
        bellNote: bell.note,
        moduleName: bell.moduleName
      }
    }));

    onBellClick(chakra, bell);
  }, [chakra, onBellClick]);

  // Handle bell hover for simple tooltip
  const handleBellHover = useCallback((bell: ModuleBell, event: any, isEntering: boolean) => {
    if (isEntering) {
      setHoveredBell(bell.moduleId);
      setBellTooltip({
        bell,
        position: [event.point.x, event.point.y + 0.5, event.point.z]
      });
      
      // Emit hover audio
      window.dispatchEvent(new CustomEvent('chakra-bell', {
        detail: {
          chakraId: chakra.id,
          frequency: bell.frequency,
          type: 'hover',
          bellNote: bell.note,
          moduleName: bell.moduleName
        }
      }));
    } else {
      setHoveredBell(null);
      setBellTooltip(null);
    }
  }, [chakra]);

  return (
    <>
      {/* Strike Ripples */}
      {strikeRipples.map(ripple => (
        <ResonanceRipple
          key={ripple.id}
          position={ripple.position}
          color={chakra.color}
          targetY={position[1] + 3} // Ripple upward
        />
      ))}

      {/* Chakra Column Group */}
      <group ref={groupRef} position={position}>
        {/* Central Chakra Energy Sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial 
            color={chakra.color}
            transparent
            opacity={0.6}
            emissive={chakra.color}
            emissiveIntensity={0.3}
          />
        </mesh>

        {/* Individual Frequency Bells - Horizontally arranged */}
        {chakra.bells.map((bell, index) => {
          const spread = 3; // Horizontal spread
          const xOffset = (index - (chakra.bells.length - 1) / 2) * spread / Math.max(chakra.bells.length - 1, 1);
          const isHovered = hoveredBell === bell.moduleId;
          const bellHeight = 0.8 + (bell.frequency / 1000) * 0.4; // Height based on frequency
          
          return (
            <group 
              key={bell.moduleId} 
              position={[xOffset, 0, 0]}
              userData={{ isBell: true }}
            >
              {/* Bell Tube */}
              <mesh 
                position={[0, -bellHeight / 2, 0]}
                onClick={(e) => handleBellClick(bell, e)}
                onPointerEnter={(e) => handleBellHover(bell, e, true)}
                onPointerLeave={(e) => handleBellHover(bell, e, false)}
              >
                <cylinderGeometry args={[0.08, 0.08, bellHeight, 8]} />
                <meshStandardMaterial 
                  color={bell.isUnlocked ? (bell.isCompleted ? chakra.color : '#8B4513') : '#555'}
                  transparent
                  opacity={bell.isUnlocked ? (isHovered ? 1.0 : 0.8) : 0.4}
                  roughness={0.3}
                  metalness={bell.isCompleted ? 0.6 : 0.2}
                  emissive={bell.isCompleted ? chakra.color : '#000000'}
                  emissiveIntensity={bell.isCompleted ? 0.3 : 0}
                />
              </mesh>
              
              {/* Bell Cap */}
              <mesh position={[0, bellHeight / 2 + 0.05, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial 
                  color={bell.isUnlocked ? chakra.color : '#444'}
                  metalness={0.8}
                  roughness={0.2}
                  emissive={isHovered ? chakra.color : '#000000'}
                  emissiveIntensity={isHovered ? 0.2 : 0}
                />
              </mesh>
              
              {/* Hanging Cord */}
              <mesh position={[0, bellHeight / 2 + 0.4, 0]}>
                <cylinderGeometry args={[0.01, 0.01, 0.6, 4]} />
                <meshBasicMaterial color="#654321" />
              </mesh>

              {/* Frequency Label - Only visible when hovered */}
              {isHovered && (
                <Text
                  position={[0, -bellHeight / 2 - 0.3, 0]}
                  fontSize={0.12}
                  color={chakra.color}
                  anchorX="center"
                  anchorY="middle"
                >
                  {bell.frequency}Hz
                </Text>
              )}

              {/* Completed Bell Glow */}
              {bell.isCompleted && (
                <mesh position={[0, -bellHeight / 2, 0]}>
                  <cylinderGeometry args={[0.15, 0.15, bellHeight + 0.2, 8]} />
                  <meshBasicMaterial 
                    color={chakra.color}
                    transparent
                    opacity={0.1}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              )}
            </group>
          );
        })}

        {/* Support Frame */}
        <mesh position={[0, 1.2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.03, 0.03, Math.max(chakra.bells.length * 0.8, 2), 8]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>
      </group>

      {/* Simple Tooltip */}
      {bellTooltip && (
        <group position={bellTooltip.position}>
          <mesh>
            <planeGeometry args={[2, 0.8]} />
            <meshBasicMaterial 
              color="#000000" 
              transparent 
              opacity={0.8} 
            />
          </mesh>
          <Text
            position={[0, 0.1, 0.01]}
            fontSize={0.12}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
          >
            {bellTooltip.bell.moduleName}
          </Text>
          <Text
            position={[0, -0.1, 0.01]}
            fontSize={0.08}
            color={chakra.color}
            anchorX="center"
            anchorY="middle"
          >
            {bellTooltip.bell.note} - {bellTooltip.bell.frequency}Hz
          </Text>
        </group>
      )}
    </>
  );
};