import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { InstrumentMode } from './InstrumentChimeGarden';

interface FlattenedBell {
  moduleId: string;
  moduleName: string;
  frequency: number;
  note: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  chakraId: string;
  chakraName: string;
  chakraColor: string;
}

interface InstrumentBellProps {
  bell: FlattenedBell;
  position: [number, number, number];
  isPlaying: boolean;
  isDragPath: boolean;
  isAccessible: boolean;
  mode: InstrumentMode;
  onClick: () => void;
  onHover: (isEntering: boolean) => void;
  onDragStart: () => void;
  onDragOver: () => void;
}

export const InstrumentBell: React.FC<InstrumentBellProps> = ({
  bell,
  position,
  isPlaying,
  isDragPath,
  isAccessible,
  mode,
  onClick,
  onHover,
  onDragStart,
  onDragOver
}) => {
  const bellRef = useRef<THREE.Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showLabel, setShowLabel] = useState(false);

  // Calculate bell size based on frequency (lower = larger)
  const bellSize = 0.12 + (1000 - bell.frequency) / 10000;
  const bellHeight = 0.6 + (bell.frequency / 1000) * 0.8;

  // Enhanced animations
  useFrame(({ clock }) => {
    if (!bellRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Gentle ambient sway
    const baseSway = Math.sin(time * 0.5 + position[0] * 0.3) * 0.01;
    bellRef.current.rotation.z = baseSway;
    
    // Playing animation - more dramatic
    if (isPlaying) {
      const playingIntensity = Math.sin(time * 15) * 0.05;
      bellRef.current.rotation.x = playingIntensity;
      bellRef.current.scale.setScalar(1 + Math.sin(time * 10) * 0.1);
    } else {
      bellRef.current.scale.setScalar(1);
    }
    
    // Hover float effect
    if (isHovered || isDragPath) {
      bellRef.current.position.y += Math.sin(time * 4) * 0.02;
    }
  });

  const handlePointerEnter = (e: any) => {
    e.stopPropagation();
    setIsHovered(true);
    setShowLabel(true);
    onHover(true);
    onDragOver(); // Trigger drag over when hovering during drag
  };

  const handlePointerLeave = (e: any) => {
    e.stopPropagation();
    setIsHovered(false);
    setShowLabel(false);
    onHover(false);
  };

  const handleClick = (e: any) => {
    e.stopPropagation();
    onClick();
  };

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    onDragStart();
  };

  // Bell color logic
  const getBellColor = () => {
    if (!isAccessible) return '#444444';
    if (isPlaying || isDragPath) return bell.chakraColor;
    if (bell.isCompleted) return bell.chakraColor;
    if (mode === 'instrument') return bell.chakraColor;
    return isHovered ? bell.chakraColor : '#8B4513';
  };

  const getBellOpacity = () => {
    if (!isAccessible) return 0.3;
    if (isPlaying || isDragPath) return 1.0;
    if (isHovered) return 0.9;
    return 0.7;
  };

  const getBellEmissive = () => {
    if (!isAccessible) return '#000000';
    if (isPlaying || isDragPath) return bell.chakraColor;
    if (bell.isCompleted) return bell.chakraColor;
    return isHovered ? bell.chakraColor : '#000000';
  };

  const getEmissiveIntensity = () => {
    if (!isAccessible) return 0;
    if (isPlaying || isDragPath) return 0.6;
    if (bell.isCompleted) return 0.3;
    return isHovered ? 0.4 : 0;
  };

  return (
    <group ref={bellRef} position={position}>
      {/* Bell Body */}
      <mesh 
        position={[0, -bellHeight / 2, 0]}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
      >
        <cylinderGeometry args={[bellSize, bellSize * 0.8, bellHeight, 12]} />
        <meshStandardMaterial 
          color={getBellColor()}
          transparent
          opacity={getBellOpacity()}
          roughness={0.2}
          metalness={bell.isCompleted ? 0.8 : 0.4}
          emissive={getBellEmissive()}
          emissiveIntensity={getEmissiveIntensity()}
        />
      </mesh>
      
      {/* Bell Cap/Top */}
      <mesh position={[0, bellHeight / 2 + 0.05, 0]}>
        <sphereGeometry args={[bellSize * 0.8, 12, 12]} />
        <meshStandardMaterial 
          color={getBellColor()}
          metalness={0.9}
          roughness={0.1}
          emissive={getBellEmissive()}
          emissiveIntensity={getEmissiveIntensity() * 0.8}
        />
      </mesh>
      
      {/* Hanging Suspension */}
      <mesh position={[0, bellHeight / 2 + 0.3, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.4, 6]} />
        <meshBasicMaterial color="#654321" />
      </mesh>

      {/* Frequency/Note Label - Enhanced */}
      {(showLabel || isPlaying || isDragPath) && (
        <group position={[0, -bellHeight / 2 - 0.4, 0]}>
          {/* Note name */}
          <Text
            position={[0, 0.1, 0]}
            fontSize={0.15}
            color={bell.chakraColor}
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Bold.woff"
          >
            {bell.note}
          </Text>
          
          {/* Frequency */}
          <Text
            position={[0, -0.1, 0]}
            fontSize={0.08}
            color="#ffffff"
            anchorX="center"
            anchorY="middle"
            font="/fonts/Inter-Regular.woff"
          >
            {bell.frequency}Hz
          </Text>
          
          {/* Module name for navigation mode */}
          {mode === 'navigation' && (
            <Text
              position={[0, -0.25, 0]}
              fontSize={0.06}
              color={bell.chakraColor}
              anchorX="center"
              anchorY="middle"
              maxWidth={2}
              font="/fonts/Inter-Regular.woff"
            >
              {bell.moduleName}
            </Text>
          )}
        </group>
      )}

      {/* Playing Glow Effect */}
      {(isPlaying || isDragPath) && (
        <mesh position={[0, -bellHeight / 2, 0]}>
          <cylinderGeometry args={[bellSize * 1.5, bellSize * 1.2, bellHeight + 0.3, 12]} />
          <meshBasicMaterial 
            color={bell.chakraColor}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Completion Aura */}
      {bell.isCompleted && (
        <mesh position={[0, -bellHeight / 2, 0]}>
          <cylinderGeometry args={[bellSize * 1.3, bellSize * 1.1, bellHeight + 0.2, 12]} />
          <meshBasicMaterial 
            color={bell.chakraColor}
            transparent
            opacity={0.15}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Chakra Color Ring - Visual indicator */}
      <mesh position={[0, bellHeight / 2 + 0.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[bellSize * 0.6, bellSize * 0.8, 8]} />
        <meshBasicMaterial 
          color={bell.chakraColor}
          transparent
          opacity={isAccessible ? 0.4 : 0.1}
        />
      </mesh>
    </group>
  );
};