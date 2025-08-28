import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { ScreensaverVisualType } from '../SacredScreensaver';
import { SacredMessage } from './SacredMessage';
import { useScreensaverMessages } from '@/hooks/useScreensaverMessages';

interface FrequencyVisualsProps {
  type: ScreensaverVisualType;
  isActive: boolean;
  showMessages?: boolean;
}

export function FrequencyVisuals({ type, isActive, showMessages = true }: FrequencyVisualsProps) {
  const { currentMessage, isVisible } = useScreensaverMessages({
    isActive: isActive && showMessages,
    rotationInterval: 75000, // 75 seconds between messages
    preventRepeats: 4
  });

  return (
    <>
      {/* 3D Visuals */}
      {(() => {
        switch (type) {
          case "breath_orb":
            return <BreathOrb isActive={isActive} />;
          case "heart_opening":
            return <HeartOpening isActive={isActive} />;
          case "chakra_column":
            return <ChakraColumn isActive={isActive} />;
          case "galaxy_mind":
            return <GalaxyMind isActive={isActive} />;
          case "somatic_body":
            return <SomaticBody isActive={isActive} />;
          case "energy_alignment":
            return <EnergyAlignment isActive={isActive} />;
          default:
            return <BreathOrb isActive={isActive} />;
        }
      })()}
      
      {/* Sacred Messages Overlay (rendered outside Canvas in parent) */}
      {showMessages && typeof window !== 'undefined' && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <SacredMessage 
            message={currentMessage}
            isVisible={isVisible}
          />
        </div>
      )}
    </>
  );
}

// Breath Orb Visual
function BreathOrb({ isActive }: { isActive: boolean }) {
  const orbRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(1000 * 3);
    const colors = new Float32Array(1000 * 3);
    
    for (let i = 0; i < 1000; i++) {
      // Spherical distribution
      const radius = Math.random() * 3 + 1;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // Sacred colors: gold, purple, blue
      const colorType = i % 3;
      if (colorType === 0) {
        colors[i * 3] = 1; colors[i * 3 + 1] = 0.8; colors[i * 3 + 2] = 0.2; // Gold
      } else if (colorType === 1) {
        colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.2; colors[i * 3 + 2] = 1; // Purple
      } else {
        colors[i * 3] = 0.2; colors[i * 3 + 1] = 0.6; colors[i * 3 + 2] = 1; // Blue
      }
    }
    
    return { positions, colors };
  }, []);

  useFrame(({ clock }) => {
    if (!isActive) return;
    
    const time = clock.getElapsedTime();
    
    // Breathing animation
    if (orbRef.current) {
      const breathScale = 1 + Math.sin(time * 0.5) * 0.3; // Slow breath
      orbRef.current.scale.setScalar(breathScale);
      orbRef.current.rotation.y = time * 0.1;
    }
    
    // Particle movement
    if (particlesRef.current) {
      const positions = particlesRef.current.geometry.attributes.position.array as Float32Array;
      
      for (let i = 0; i < positions.length; i += 3) {
        const originalRadius = Math.sqrt(
          positions[i] * positions[i] + 
          positions[i + 1] * positions[i + 1] + 
          positions[i + 2] * positions[i + 2]
        );
        
        const pulse = Math.sin(time * 2 + originalRadius) * 0.1;
        const scale = 1 + pulse;
        
        positions[i] *= scale / (scale - pulse);
        positions[i + 1] *= scale / (scale - pulse);
        positions[i + 2] *= scale / (scale - pulse);
      }
      
      particlesRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Central Orb */}
      <mesh ref={orbRef}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#4F46E5" 
          transparent 
          opacity={0.3} 
          wireframe 
        />
      </mesh>
      
      {/* Surrounding Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Heart Opening Visual
function HeartOpening({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const heartPoints = useMemo(() => {
    const points = [];
    
    for (let i = 0; i < 500; i++) {
      const t = (i / 500) * Math.PI * 2;
      const x = 16 * Math.sin(t) ** 3;
      const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
      
      points.push(x * 0.05, y * 0.05, (Math.random() - 0.5) * 0.5);
    }
    
    return new Float32Array(points);
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {/* Heart-shaped particle formation */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={heartPoints.length / 3}
            array={heartPoints}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#FF69B4"
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Chakra Column Visual
function ChakraColumn({ isActive }: { isActive: boolean }) {
  const chakraColors = [
    '#FF0000', // Root - Red
    '#FF8C00', // Sacral - Orange  
    '#FFD700', // Solar Plexus - Yellow
    '#00FF00', // Heart - Green
    '#00BFFF', // Throat - Blue
    '#4B0082', // Third Eye - Indigo
    '#8A2BE2'  // Crown - Violet
  ];
  
  return (
    <group>
      {chakraColors.map((color, index) => (
        <ChakraOrb 
          key={index}
          position={[0, (index - 3) * 1.5, 0]}
          color={color}
          isActive={isActive}
          delay={index * 0.2}
        />
      ))}
    </group>
  );
}

function ChakraOrb({ position, color, isActive, delay }: {
  position: [number, number, number];
  color: string;
  isActive: boolean;
  delay: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  
  useFrame(({ clock }) => {
    if (!isActive || !ref.current) return;
    
    const time = clock.getElapsedTime() + delay;
    ref.current.rotation.y = time;
    ref.current.scale.setScalar(1 + Math.sin(time * 2) * 0.2);
  });
  
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[0.3, 0.1, 8, 16]} />
      <meshBasicMaterial 
        color={color} 
        transparent 
        opacity={0.7}
      />
    </mesh>
  );
}

// Galaxy Mind Visual
function GalaxyMind({ isActive }: { isActive: boolean }) {
  const spiralRef = useRef<THREE.Points>(null);
  
  const spiral = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    const colors = new Float32Array(2000 * 3);
    
    for (let i = 0; i < 2000; i++) {
      const t = i / 2000;
      const angle = t * Math.PI * 8;
      const radius = t * 4;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      // Gradient from purple to gold
      colors[i * 3] = 0.5 + t * 0.5; // Red
      colors[i * 3 + 1] = 0.2 + t * 0.6; // Green  
      colors[i * 3 + 2] = 1 - t * 0.8; // Blue
    }
    
    return { positions, colors };
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !spiralRef.current) return;
    
    spiralRef.current.rotation.y = clock.getElapsedTime() * 0.1;
  });
  
  return (
    <points ref={spiralRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={spiral.positions.length / 3}
          array={spiral.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={spiral.colors.length / 3}
          array={spiral.colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        vertexColors
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Somatic Body Visual
function SomaticBody({ isActive }: { isActive: boolean }) {
  return (
    <group>
      {/* Human silhouette outline */}
      <mesh>
        <cylinderGeometry args={[0.3, 0.5, 3, 8]} />
        <meshBasicMaterial 
          color="#00FFD4" 
          transparent 
          opacity={0.3} 
          wireframe 
        />
      </mesh>
    </group>
  );
}

// Energy Alignment Visual  
function EnergyAlignment({ isActive }: { isActive: boolean }) {
  const arcRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!isActive || !arcRef.current) return;
    
    const time = clock.getElapsedTime();
    arcRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
  });
  
  return (
    <group ref={arcRef}>
      {/* Rainbow energy arc */}
      <mesh>
        <torusGeometry args={[3, 0.1, 4, 50, Math.PI]} />
        <meshBasicMaterial 
          color="#FF00FF"
          transparent 
          opacity={0.8}
        />
      </mesh>
    </group>
  );
}