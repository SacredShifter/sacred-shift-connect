import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ChakraBellStrikeProps {
  position: [number, number, number];
  color: string;
  onComplete: () => void;
  intensity?: number;
}

export const ChakraBellStrike: React.FC<ChakraBellStrikeProps> = ({
  position,
  color,
  onComplete,
  intensity = 1
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const startTime = useRef<number>(Date.now());
  const duration = 2000; // 2 seconds

  useFrame(() => {
    if (!meshRef.current) return;

    const elapsed = Date.now() - startTime.current;
    const progress = elapsed / duration;

    if (progress >= 1) {
      onComplete();
      return;
    }

    // Expanding ring effect
    const scale = 1 + progress * 3;
    const opacity = (1 - progress) * intensity;

    meshRef.current.scale.setScalar(scale);
    
    if (meshRef.current.material instanceof THREE.MeshBasicMaterial) {
      meshRef.current.material.opacity = opacity;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[0.8, 0.1, 8, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={intensity}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};