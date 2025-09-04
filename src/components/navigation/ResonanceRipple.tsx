import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ResonanceRippleProps {
  position: [number, number, number];
  color: string;
  targetY: number;
}

export const ResonanceRipple: React.FC<ResonanceRippleProps> = ({ position, color, targetY }) => {
  const rippleRef = useRef<THREE.Group>(null);
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (!rippleRef.current) return;

    const elapsed = (Date.now() - startTime.current) / 1000;
    const progress = Math.min(elapsed / 2, 1); // 2 second animation

    // Move upward
    const currentY = position[1] + (targetY - position[1]) * progress;
    rippleRef.current.position.y = currentY;

    // Expand and fade
    const scale = 1 + progress * 2;
    const opacity = 1 - progress;
    
    rippleRef.current.scale.setScalar(scale);
    
    // Update material opacity
    rippleRef.current.children.forEach(child => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshBasicMaterial) {
        child.material.opacity = opacity * 0.6;
      }
    });
  });

  return (
    <group ref={rippleRef} position={[position[0], position[1], position[2]]}>
      {/* Expanding Ring Effect */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.5, 0.05, 8, 16]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Inner Pulse */}
      <mesh>
        <sphereGeometry args={[0.3, 8, 8]} />
        <meshBasicMaterial 
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};