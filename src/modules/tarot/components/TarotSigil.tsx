import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { TorusKnot, Icosahedron } from '@react-three/drei';
import * as THREE from 'three';

interface SigilShapeProps {
  sigilType: string;
}

const SigilShape = ({ sigilType }: SigilShapeProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  const renderShape = () => {
    switch (sigilType) {
      case 'toroidalSpiral':
        return <TorusKnot ref={meshRef} args={[0.7, 0.1, 100, 16]} />;
      case 'sourceRay':
        return <Icosahedron ref={meshRef} args={[1, 0]} />;
      // Add more cases for other sigils
      default:
        return <Icosahedron ref={meshRef} args={[1, 0]} />;
    }
  };

  return (
    <>
      {renderShape()}
      <meshPhysicalMaterial
        color="#FFD700"
        emissive="#B87333"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.1}
      />
    </>
  );
};

interface TarotSigilProps {
  sigilType: string;
}

export const TarotSigil = ({ sigilType }: TarotSigilProps) => {
  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <SigilShape sigilType={sigilType} />
      </Suspense>
    </Canvas>
  );
};
