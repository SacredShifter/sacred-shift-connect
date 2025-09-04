import React, { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { EnhancedChakraData, ModuleBell } from '@/data/enhancedChakraData';
import { ChakraBellStrike } from './ChakraBellStrike';
import { ReflectionModal } from './ReflectionModal';

interface BambooChimeProps {
  chakra: EnhancedChakraData;
  position: [number, number, number];
  rotation: [number, number, number];
}

export const BambooChime: React.FC<BambooChimeProps> = ({ 
  chakra, 
  position, 
  rotation 
}) => {
  const navigate = useNavigate();
  const groupRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isSwaying, setIsSwaying] = useState(false);
  const [strikeEffects, setStrikeEffects] = useState<Array<{ id: string; position: [number, number, number]; color: string }>>([]);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [selectedBell, setSelectedBell] = useState<ModuleBell | null>(null);

  // Ambient and interactive swaying animation
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Gentle ambient swaying
    const ambientSway = Math.sin(time * 0.5 + position[0]) * 0.02;
    const ambientRotation = Math.sin(time * 0.3 + position[2]) * 0.03;
    
    // Enhanced swaying when hovered or active
    const interactiveSway = (isHovered || isSwaying) ? Math.sin(time * 4) * 0.08 : 0;
    
    groupRef.current.rotation.z = ambientSway + interactiveSway;
    groupRef.current.rotation.x = ambientRotation;
    
    // Individual bell movements
    const bells = groupRef.current.children.filter(child => child.userData.isBell);
    bells.forEach((bell, index) => {
      if (bell instanceof THREE.Group) {
        bell.rotation.y = Math.sin(time * 2 + index * 0.5) * 0.04;
        bell.position.y = Math.sin(time * 1.5 + index) * 0.02;
      }
    });
  });

  // Handle pointer enter for whole chime
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    
    // Play ambient chakra frequency on hover
    window.dispatchEvent(new CustomEvent('chakra-bell', {
      detail: {
        chakraId: chakra.id,
        frequency: parseFloat(chakra.baseFrequency.replace('Hz', '')),
        modulePath: `/chakra/${chakra.id}`,
        type: 'hover'
      }
    }));
  }, [chakra]);

  // Handle pointer leave
  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // Handle individual bell click
  const handleBellClick = useCallback((bell: ModuleBell, event: any) => {
    event.stopPropagation();
    
    if (!bell.isUnlocked) return;
    
    // Create strike effect
    const effectId = Math.random().toString(36).substr(2, 9);
    setStrikeEffects(prev => [...prev, {
      id: effectId,
      position: [position[0], position[1] + 1, position[2]],
      color: chakra.color
    }]);

    // Trigger swaying animation
    setIsSwaying(true);
    setTimeout(() => setIsSwaying(false), 2000);

    // Emit bell strike event
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

    // Show reflection modal
    setSelectedBell(bell);
    setShowReflectionModal(true);
  }, [chakra, position]);

  return (
    <>
      {/* Chakra Name Label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-10 pointer-events-none"
      >
        <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/20">
          <h3 className="text-sm font-medium text-foreground">{chakra.name}</h3>
          <p className="text-xs text-muted-foreground">{chakra.sanskrit}</p>
          <div className="text-xs text-primary">
            {chakra.bells.map(bell => (
              <div key={bell.moduleId} className={`${bell.isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                {bell.moduleName} ({bell.note} - {bell.frequency}Hz)
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Strike Effects */}
      {strikeEffects.map(effect => (
        <ChakraBellStrike
          key={effect.id}
          position={effect.position}
          color={effect.color}
          onComplete={() => setStrikeEffects(prev => prev.filter(e => e.id !== effect.id))}
        />
      ))}

      {/* 3D Bamboo Chime Group */}
      <group 
        ref={groupRef} 
        position={position} 
        rotation={rotation}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {/* Bamboo Suspension Frame */}
        <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.04, 0.04, 1.8, 8]} />
          <meshStandardMaterial color="#8B4513" roughness={0.8} />
        </mesh>

        {/* Hanging Cords */}
        {chakra.bells.map((_, index) => {
          const angle = (index / chakra.bells.length) * Math.PI * 2;
          const radius = 0.6;
          const xOffset = Math.cos(angle) * radius;
          const zOffset = Math.sin(angle) * radius;
          
          return (
            <mesh key={`cord-${index}`} position={[xOffset, 0.8, zOffset]}>
              <cylinderGeometry args={[0.005, 0.005, 1.4, 4]} />
              <meshBasicMaterial color="#654321" />
            </mesh>
          );
        })}

        {/* Individual Bell Chimes - each representing a module */}
        {chakra.bells.map((bell, index) => {
          const tubeHeight = 1.2 + (index * 0.2);
          const angle = (index / chakra.bells.length) * Math.PI * 2;
          const radius = 0.6;
          const xOffset = Math.cos(angle) * radius;
          const zOffset = Math.sin(angle) * radius;
          
          return (
            <group key={bell.moduleId} position={[xOffset, -tubeHeight / 2, zOffset]} userData={{ isBell: true }}>
              {/* Bell Tube */}
              <mesh 
                onClick={(e) => handleBellClick(bell, e)}
                onPointerEnter={(e) => {
                  e.stopPropagation();
                  // Emit hover event for this specific bell
                  window.dispatchEvent(new CustomEvent('chakra-bell', {
                    detail: {
                      chakraId: chakra.id,
                      frequency: bell.frequency,
                      modulePath: `/chakra/${chakra.id}/${bell.moduleId}`,
                      type: 'hover',
                      bellNote: bell.note,
                      moduleName: bell.moduleName
                    }
                  }));
                }}
              >
                <cylinderGeometry args={[0.06, 0.06, tubeHeight, 8]} />
                <meshStandardMaterial 
                  color={bell.isUnlocked ? (bell.isCompleted ? chakra.color : '#8B4513') : '#555'}
                  transparent
                  opacity={bell.isUnlocked ? 0.9 : 0.4}
                  roughness={0.3}
                  metalness={bell.isCompleted ? 0.3 : 0.1}
                  emissive={bell.isCompleted ? chakra.color : '#000000'}
                  emissiveIntensity={bell.isCompleted ? 0.2 : 0}
                />
              </mesh>
              
              {/* Bell Cap */}
              <mesh position={[0, tubeHeight / 2 + 0.05, 0]}>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshStandardMaterial 
                  color={bell.isUnlocked ? chakra.color : '#444'}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
              
              {/* Frequency Label */}
              <Text
                position={[0, tubeHeight / 2 + 0.3, 0]}
                fontSize={0.08}
                color={bell.isUnlocked ? chakra.color : '#666'}
                anchorX="center"
                anchorY="middle"
              >
                {bell.frequency}Hz
              </Text>
            </group>
          );
        })}

        {/* Central Chakra Symbol */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial 
            color={chakra.color}
            transparent
            opacity={isHovered ? 0.9 : 0.7}
            emissive={chakra.color}
            emissiveIntensity={isHovered ? 0.4 : 0.2}
          />
        </mesh>

        {/* Chakra Name */}
        <Text
          position={[0, 1.8, 0]}
          fontSize={0.15}
          color={chakra.color}
          anchorX="center"
          anchorY="middle"
        >
          {chakra.sanskrit}
        </Text>

        {/* Energy field when hovered */}
        {isHovered && (
          <mesh position={[0, 0, 0]}>
            <sphereGeometry args={[2.5, 16, 16]} />
            <meshBasicMaterial 
              color={chakra.color}
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {/* Reflection Modal */}
      {showReflectionModal && selectedBell && (
        <ReflectionModal
          isOpen={showReflectionModal}
          onClose={() => {
            setShowReflectionModal(false);
            setSelectedBell(null);
          }}
          chakra={chakra}
          bell={selectedBell}
        />
      )}
    </>
  );
};