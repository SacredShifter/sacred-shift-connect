import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SacredGeometryCenterProps {
  coherenceLevel?: number;
  ceremonyPhase?: 'opening' | 'communion' | 'silence' | 'closing';
  participantCount?: number;
}

function AdaptiveMandala({ coherenceLevel = 0.5, ceremonyPhase = 'communion', participantCount = 1 }: SacredGeometryCenterProps) {
  const groupRef = useRef<THREE.Group>(null!);
  const innerRingRef = useRef<THREE.Group>(null!);
  const outerRingRef = useRef<THREE.Group>(null!);

  useFrame((state) => {
    if (!groupRef.current || !innerRingRef.current || !outerRingRef.current) return;

    const time = state.clock.getElapsedTime();
    
    // Breathing rhythm animation - inhale/exhale cycle
    const breathCycle = Math.sin(time * 0.3) * 0.5 + 0.5; // 0-1 breathing cycle
    const baseScale = 0.8 + (breathCycle * 0.4 * coherenceLevel);
    
    // Ceremony phase affects expansion
    let phaseMultiplier = 1;
    switch (ceremonyPhase) {
      case 'opening':
        phaseMultiplier = 0.6 + (Math.sin(time * 0.5) * 0.2);
        break;
      case 'communion':
        phaseMultiplier = 1 + (coherenceLevel * 0.5);
        break;
      case 'silence':
        phaseMultiplier = 0.3 + (breathCycle * 0.1);
        break;
      case 'closing':
        phaseMultiplier = 1.2 + (Math.sin(time * 0.2) * 0.3);
        break;
    }
    
    groupRef.current.scale.setScalar(baseScale * phaseMultiplier);
    
    // Rotation based on coherence and participant count
    innerRingRef.current.rotation.z = time * 0.1 * coherenceLevel;
    outerRingRef.current.rotation.z = -time * 0.05 * coherenceLevel;
    
    // Particle count varies with participants
    const particleIntensity = Math.min(participantCount / 8, 1);
    groupRef.current.children.forEach((child, index) => {
      if (child.type === 'Points' && 'material' in child) {
        const points = child as THREE.Points;
        (points.material as THREE.PointsMaterial).opacity = particleIntensity * coherenceLevel;
      }
    });
  });

  // Create sacred geometry points
  const createSacredPoints = () => {
    const points: THREE.Vector3[] = [];
    const goldenRatio = 1.618;
    
    // Sacred spiral based on golden ratio
    for (let i = 0; i < 144; i++) {
      const angle = i * goldenRatio * Math.PI * 2;
      const radius = Math.sqrt(i) * 0.1;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        (Math.sin(i * 0.1) * 0.2)
      ));
    }
    
    return points;
  };

  const sacredPoints = createSacredPoints();
  const geometry = new THREE.BufferGeometry().setFromPoints(sacredPoints);

  return (
    <group ref={groupRef}>
      {/* Inner ring - represents individual consciousness */}
      <group ref={innerRingRef}>
        <mesh>
          <torusGeometry args={[0.8, 0.02, 8, 24]} />
          <meshBasicMaterial 
            color="#a855f7" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      </group>
      
      {/* Outer ring - represents collective field */}
      <group ref={outerRingRef}>
        <mesh>
          <torusGeometry args={[1.4, 0.01, 12, 36]} />
          <meshBasicMaterial 
            color="#06b6d4" 
            transparent 
            opacity={0.4}
          />
        </mesh>
      </group>
      
      {/* Sacred spiral particles */}
      <points geometry={geometry}>
        <pointsMaterial
          size={0.02}
          color="#e879f9"
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Center mandala */}
      <mesh>
        <circleGeometry args={[0.3, 12]} />
        <meshBasicMaterial 
          color="#f0abfc" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

export const SacredGeometryCenter: React.FC<SacredGeometryCenterProps> = (props) => {
  return (
    <div className="w-32 h-32 mx-auto mb-6">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 60 }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.6} />
        <AdaptiveMandala {...props} />
      </Canvas>
    </div>
  );
};