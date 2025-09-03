import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points } from 'three';

export const SacredBackground: React.FC = () => {
  const starsRef = useRef<Points>(null);
  
  const starPositions = new Float32Array(Array.from({ length: 300 }, () => (Math.random() - 0.5) * 50));

  useFrame(() => {
    if (starsRef.current) {
      starsRef.current.rotation.y += 0.0001;
    }
  });

  return (
    <>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={100}
            array={starPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#a855f7"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>
    </>
  );
};