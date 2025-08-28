import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface MeditationVisualization3DProps {
  type: MeditationType;
  isActive?: boolean;
}

// Breathing meditation - Expanding breathing orb
function BreathingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const breathingScale = Math.sin(time * 0.5) * 0.3 + 1;
      meshRef.current.scale.setScalar(breathingScale);
      const material = meshRef.current.material as THREE.MeshPhongMaterial;
      if (material && 'opacity' in material) {
        material.opacity = 0.7 + Math.sin(time * 0.5) * 0.2;
      }
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 32, 32]} position={[0, 0, 0]}>
      <meshPhongMaterial 
        color="#4ade80" 
        transparent 
        opacity={0.7}
        emissive="#22c55e"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

// Loving-kindness meditation - Pulsing heart energy
function LovingKindnessHeart() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.1;
      
      groupRef.current.children.forEach((child, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 2 + Math.sin(i) * 0.5;
        const speed = 0.3 + (i * 0.1);
        const pulsing = Math.sin(time * speed + i) * 0.5 + 1;
        
        child.scale.setScalar(pulsing);
        child.position.x = Math.cos(angle + time * 0.2) * radius;
        child.position.z = Math.sin(angle + time * 0.2) * radius;
        child.position.y = Math.sin(time * 0.5 + i) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 8 }, (_, i) => (
        <Icosahedron key={i} args={[0.3]} position={[2, 0, 0]}>
          <meshPhongMaterial 
            color="#f472b6" 
            transparent 
            opacity={0.8}
            emissive="#ec4899"
            emissiveIntensity={0.3}
          />
        </Icosahedron>
      ))}
    </group>
  );
}

// Chakra meditation - Seven spinning chakra wheels
function ChakraWheels() {
  const groupRef = useRef<THREE.Group>(null);
  const chakraColors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#6366f1', '#8b5cf6'];

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        child.rotation.z = time * (1 + i * 0.2);
        const float = Math.sin(time * 0.5 + i) * 0.1;
        child.position.y = -3 + i + float;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {chakraColors.map((color, i) => (
        <Torus key={i} args={[0.5, 0.1, 16, 32]} position={[0, -3 + i, 0]}>
          <meshPhongMaterial 
            color={color} 
            transparent 
            opacity={0.8}
            emissive={color}
            emissiveIntensity={0.4}
          />
        </Torus>
      ))}
    </group>
  );
}

// Mindfulness meditation - Floating geometric forms
function MindfulnessGeometry() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        child.rotation.x += 0.005;
        child.rotation.y += 0.007;
        const originalY = ((i % 4) - 2) * 1.5;
        child.position.y = originalY + Math.sin(time * 0.3 + i) * 0.2;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }, (_, i) => {
        const x = ((i % 4) - 1.5) * 2;
        const z = (Math.floor(i / 4) - 1) * 2;
        const y = ((i % 4) - 2) * 1.5;
        
        if (i % 3 === 0) {
          return (
            <Box key={i} args={[0.3, 0.3, 0.3]} position={[x, y, z]}>
              <meshPhongMaterial 
                color="#06b6d4" 
                transparent 
                opacity={0.6}
                emissive="#0891b2"
                emissiveIntensity={0.2}
              />
            </Box>
          );
        } else if (i % 3 === 1) {
          return (
            <Sphere key={i} args={[0.2, 16, 16]} position={[x, y, z]}>
              <meshPhongMaterial 
                color="#06b6d4" 
                transparent 
                opacity={0.6}
                emissive="#0891b2"
                emissiveIntensity={0.2}
              />
            </Sphere>
          );
        } else {
          return (
            <Icosahedron key={i} args={[0.2]} position={[x, y, z]}>
              <meshPhongMaterial 
                color="#06b6d4" 
                transparent 
                opacity={0.6}
                emissive="#0891b2"
                emissiveIntensity={0.2}
              />
            </Icosahedron>
          );
        }
      })}
    </group>
  );
}

// Body scan meditation - Flowing energy waves
function BodyScanWaves() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const positions = meshRef.current.geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const y = positions.getY(i);
        const wave = Math.sin(y * 2 + time * 2) * 0.2 + Math.sin(x * 3 + time * 1.5) * 0.1;
        positions.setZ(i, wave);
      }
      
      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]}>
      <planeGeometry args={[4, 6, 32, 32]} />
      <meshPhongMaterial 
        color="#a855f7" 
        transparent 
        opacity={0.7}
        emissive="#9333ea"
        emissiveIntensity={0.3}
        wireframe
      />
    </mesh>
  );
}

function MeditationScene({ type }: { type: MeditationType }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <pointLight position={[0, 0, 5]} intensity={0.5} color="#ffffff" />
      
      {type === 'breathing' && (
        <>
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
          <BreathingOrb />
        </>
      )}
      
      {type === 'loving-kindness' && (
        <>
          <Stars radius={100} depth={50} count={2000} factor={3} saturation={0.5} fade speed={0.3} />
          <LovingKindnessHeart />
        </>
      )}
      
      {type === 'chakra' && (
        <>
          <Stars radius={100} depth={50} count={4000} factor={5} saturation={0.8} fade speed={0.7} />
          <ChakraWheels />
        </>
      )}
      
      {type === 'mindfulness' && (
        <>
          <Stars radius={100} depth={50} count={1500} factor={2} saturation={0} fade speed={0.2} />
          <MindfulnessGeometry />
        </>
      )}
      
      {type === 'body-scan' && (
        <>
          <Stars radius={100} depth={50} count={2500} factor={3} saturation={0.3} fade speed={0.4} />
          <BodyScanWaves />
        </>
      )}
      
      <OrbitControls 
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        maxDistance={8}
        minDistance={2}
        autoRotate
        autoRotateSpeed={0.5}
      />
      <PerspectiveCamera makeDefault position={[0, 2, 4]} />
    </>
  );
}

export default function MeditationVisualization3D({ type, isActive = false }: MeditationVisualization3DProps) {
  if (!isActive) return null;

  return (
    <Canvas
      className="w-full h-full"
      shadows
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance"
      }}
      dpr={[1, 2]}
    >
      <MeditationScene type={type} />
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.3} luminanceSmoothing={0.9} height={300} />
      </EffectComposer>
    </Canvas>
  );
}