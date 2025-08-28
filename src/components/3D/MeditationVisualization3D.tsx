import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Stars, Sphere, Box, Torus, Icosahedron } from '@react-three/drei';
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
  const hearts = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * Math.PI * 2,
      radius: 2 + Math.random() * 1.5,
      speed: 0.3 + Math.random() * 0.4
    })), 
  []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.rotation.y = time * 0.1;
      
      groupRef.current.children.forEach((child, i) => {
        const heart = hearts[i];
        const pulsing = Math.sin(time * heart.speed + i) * 0.5 + 1;
        child.scale.setScalar(pulsing);
        child.position.x = Math.cos(heart.angle + time * 0.2) * heart.radius;
        child.position.z = Math.sin(heart.angle + time * 0.2) * heart.radius;
        child.position.y = Math.sin(time * 0.5 + i) * 0.5;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {hearts.map((heart) => (
        <Icosahedron key={heart.id} args={[0.3]} position={[heart.radius, 0, 0]}>
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
  const shapes = useMemo(() => 
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 6
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      type: i % 3
    })), 
  []);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.elapsedTime;
      groupRef.current.children.forEach((child, i) => {
        const shape = shapes[i];
        child.rotation.x += 0.005;
        child.rotation.y += 0.007;
        child.position.y = shape.position[1] + Math.sin(time * 0.3 + i) * 0.2;
      });
    }
  });

  const ShapeComponent = ({ type, position, rotation }: any) => {
    const Component = type === 0 ? Box : type === 1 ? Sphere : Icosahedron;
    const args = type === 0 ? [0.3, 0.3, 0.3] : type === 1 ? [0.2, 16, 16] : [0.2];
    
    return (
      <Component args={args as any} position={position} rotation={rotation}>
        <meshPhongMaterial 
          color="#06b6d4" 
          transparent 
          opacity={0.6}
          emissive="#0891b2"
          emissiveIntensity={0.2}
        />
      </Component>
    );
  };

  return (
    <group ref={groupRef}>
      {shapes.map((shape) => (
        <ShapeComponent 
          key={shape.id}
          type={shape.type}
          position={shape.position}
          rotation={shape.rotation}
        />
      ))}
    </group>
  );
}

// Body scan meditation - Flowing energy waves
function BodyScanWaves() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(4, 6, 32, 32);
    return geo;
  }, []);

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
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 4, 0, 0]}>
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
      
      {/* Environment based on meditation type */}
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
      <Environment preset="night" />
    </Canvas>
  );
}