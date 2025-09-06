import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface LivingEtherGridProps {
  isActive: boolean;
  onExit: () => void;
}

// Sacred geometry sigils
const SACRED_SIGILS = [
  { name: 'Flower of Life', complexity: 0.8, color: new THREE.Color(1, 0.8, 0.2) },
  { name: 'Torus', complexity: 0.6, color: new THREE.Color(0.2, 0.8, 1) },
  { name: 'Sri Yantra', complexity: 0.9, color: new THREE.Color(1, 0.2, 0.8) },
  { name: 'Merkaba', complexity: 0.7, color: new THREE.Color(0.8, 1, 0.2) },
  { name: 'Metatron Cube', complexity: 0.8, color: new THREE.Color(0.8, 0.2, 1) },
  { name: 'Vesica Piscis', complexity: 0.5, color: new THREE.Color(1, 0.6, 0.2) }
];

// Ether Grid Threads Component
const EtherGridThreads: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const threadsRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  // Generate infinite web of threads
  const threads = useMemo(() => {
    const threadCount = 200;
    const threads: Array<{
      start: THREE.Vector3;
      end: THREE.Vector3;
      speed: number;
      phase: number;
      intensity: number;
    }> = [];
    
    for (let i = 0; i < threadCount; i++) {
      // Create threads in 3D space
      const start = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 20
      );
      
      // End point with some connection logic
      const end = new THREE.Vector3(
        start.x + (Math.random() - 0.5) * 10,
        start.y + (Math.random() - 0.5) * 10,
        start.z + (Math.random() - 0.5) * 10
      );
      
      threads.push({
        start,
        end,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        intensity: 0.3 + Math.random() * 0.7
      });
    }
    
    return threads;
  }, []);
  
  // Thread material with flowing light
  const threadMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        viewport: { value: new THREE.Vector2(viewport.width, viewport.height) }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        uniform vec2 viewport;
        attribute float speed;
        attribute float phase;
        attribute float intensity;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vIntensity;
        
        void main() {
          vIntensity = intensity;
          
          // Flowing light packets along the thread
          float packet = sin(time * speed + phase) * 0.5 + 0.5;
          float packet2 = sin(time * speed * 1.3 + phase + 1.0) * 0.5 + 0.5;
          
          // Golden-blue gradient
          vec3 goldenColor = vec3(1.0, 0.8, 0.2);
          vec3 blueColor = vec3(0.2, 0.6, 1.0);
          vColor = mix(goldenColor, blueColor, packet);
          
          // Thread pulsing
          float pulse = 1.0 + sin(time * 2.0 + phase) * 0.1;
          vec3 newPosition = position * pulse;
          
          // Add flowing motion
          newPosition += normal * sin(time * speed + phase) * 0.05;
          
          vAlpha = packet * packet2 * intensity;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vIntensity;
        
        void main() {
          float glow = exp(-vAlpha * 2.0) * vIntensity;
          vec3 finalColor = vColor * (1.0 + glow * 2.0);
          gl_FragColor = vec4(finalColor, vAlpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, [viewport]);
  
  // Create thread geometry
  const threadGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(threads.length * 6); // 2 points per line
    const speeds = new Float32Array(threads.length);
    const phases = new Float32Array(threads.length);
    const intensities = new Float32Array(threads.length);
    
    threads.forEach((thread, i) => {
      // Start point
      positions[i * 6] = thread.start.x;
      positions[i * 6 + 1] = thread.start.y;
      positions[i * 6 + 2] = thread.start.z;
      
      // End point
      positions[i * 6 + 3] = thread.end.x;
      positions[i * 6 + 4] = thread.end.y;
      positions[i * 6 + 5] = thread.end.z;
      
      speeds[i] = thread.speed;
      phases[i] = thread.phase;
      intensities[i] = thread.intensity;
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
    geometry.setAttribute('intensity', new THREE.BufferAttribute(intensities, 1));
    
    return geometry;
  }, [threads]);
  
  useFrame(({ clock }) => {
    if (!isActive || !threadsRef.current) return;
    
    const time = clock.getElapsedTime();
    threadMaterial.uniforms.time.value = time;
    
    // Gentle rotation of the entire grid
    threadsRef.current.rotation.y = time * 0.02;
    threadsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });
  
  return (
    <group ref={threadsRef}>
      <lineSegments geometry={threadGeometry} material={threadMaterial} />
    </group>
  );
};

// Sigil Nodes Component
const SigilNodes: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const nodesRef = useRef<THREE.Group>(null);
  
  const nodes = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25,
        (Math.random() - 0.5) * 25
      ] as [number, number, number],
      sigil: SACRED_SIGILS[Math.floor(Math.random() * SACRED_SIGILS.length)],
      scale: 0.5 + Math.random() * 1.5,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      flareIntensity: 0.5 + Math.random() * 0.5
    }));
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !nodesRef.current) return;
    
    const time = clock.getElapsedTime();
    
    nodesRef.current.children.forEach((node, i) => {
      const nodeData = nodes[i];
      
      // Sigil pulsing
      const pulse = Math.sin(time * nodeData.speed + nodeData.phase) * 0.3 + 0.7;
      const scale = nodeData.scale * pulse;
      
      node.scale.set(scale, scale, scale);
      
      // Rotation
      node.rotation.y = time * 0.5 + nodeData.phase;
      node.rotation.x = Math.sin(time * 0.3 + nodeData.phase) * 0.2;
      
      // Flare intensity
      const flare = Math.sin(time * 2.0 + nodeData.phase) * 0.5 + 0.5;
      if (node.material) {
        (node.material as THREE.Material).opacity = nodeData.flareIntensity * flare;
      }
    });
  });
  
  return (
    <group ref={nodesRef}>
      {nodes.map((node, i) => (
        <group key={i} position={node.position}>
          {/* Sigil geometry based on type */}
          {node.sigil.name === 'Flower of Life' && (
            <mesh>
              <circleGeometry args={[1, 32]} />
              <meshBasicMaterial
                color={node.sigil.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          )}
          {node.sigil.name === 'Torus' && (
            <mesh>
              <torusGeometry args={[0.8, 0.3, 16, 32]} />
              <meshBasicMaterial
                color={node.sigil.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}
          {node.sigil.name === 'Sri Yantra' && (
            <mesh>
              <octahedronGeometry args={[1, 0]} />
              <meshBasicMaterial
                color={node.sigil.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                wireframe
              />
            </mesh>
          )}
          {node.sigil.name === 'Merkaba' && (
            <group>
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <tetrahedronGeometry args={[1, 0]} />
                <meshBasicMaterial
                  color={node.sigil.color}
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
              <mesh rotation={[0, 0, -Math.PI / 2]}>
                <tetrahedronGeometry args={[1, 0]} />
                <meshBasicMaterial
                  color={node.sigil.color}
                  transparent
                  opacity={0.8}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            </group>
          )}
          {node.sigil.name === 'Metatron Cube' && (
            <mesh>
              <boxGeometry args={[1.5, 1.5, 1.5]} />
              <meshBasicMaterial
                color={node.sigil.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                wireframe
              />
            </mesh>
          )}
          {node.sigil.name === 'Vesica Piscis' && (
            <mesh>
              <sphereGeometry args={[0.8, 16, 16]} />
              <meshBasicMaterial
                color={node.sigil.color}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

// Cosmic Heartbeat Waves Component
const CosmicHeartbeatWaves: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const wavesRef = useRef<THREE.Group>(null);
  
  const waveMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        heartbeat: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        uniform float heartbeat;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vWaveIntensity;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          // Cosmic heartbeat waves
          float wave1 = sin(time * 1.2 + length(position.xy) * 3.0) * 0.2;
          float wave2 = cos(time * 0.8 + position.x * 4.0) * 0.1;
          float wave3 = sin(time * 1.5 + position.y * 5.0) * 0.15;
          
          vWaveIntensity = (wave1 + wave2 + wave3) * heartbeat;
          
          vec3 newPosition = position;
          newPosition += normal * vWaveIntensity;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        uniform float heartbeat;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vWaveIntensity;
        
        void main() {
          // Cosmic energy colors
          vec3 energyColor1 = vec3(0.2, 0.8, 1.0); // Blue
          vec3 energyColor2 = vec3(1.0, 0.8, 0.2); // Gold
          
          // Mix colors based on wave intensity
          vec3 finalColor = mix(energyColor1, energyColor2, abs(vWaveIntensity) * 2.0);
          
          // Add cosmic sparkle
          float sparkle = sin(time * 4.0 + length(vPosition.xy) * 10.0) * 0.5 + 0.5;
          finalColor += sparkle * vec3(1.0, 1.0, 1.0) * 0.3;
          
          float alpha = abs(vWaveIntensity) * 0.6 * heartbeat;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !wavesRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Cosmic heartbeat rhythm (slower than human heartbeat)
    const heartbeat = Math.sin(time * 0.5) * 0.5 + 0.5;
    
    waveMaterial.uniforms.time.value = time;
    waveMaterial.uniforms.heartbeat.value = heartbeat;
    
    // Gentle rotation
    wavesRef.current.rotation.z = time * 0.01;
  });
  
  return (
    <group ref={wavesRef}>
      {/* Multiple wave layers */}
      {[1, 1.5, 2, 2.5, 3].map((scale, i) => (
        <mesh key={i} scale={[scale, scale, 1]}>
          <planeGeometry args={[20, 20, 64, 64]} />
          <primitive object={waveMaterial} />
        </mesh>
      ))}
    </group>
  );
};

// Sacred Geometry Morphing Component
const SacredGeometryMorphing: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const morphRef = useRef<THREE.Group>(null);
  const [currentGeometry, setCurrentGeometry] = useState(0);
  
  const geometries = useMemo(() => [
    // Flower of Life
    () => {
      const points: THREE.Vector3[] = [];
      const radius = 2;
      for (let i = 0; i < 19; i++) {
        const angle = (i / 19) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          0
        ));
      }
      return points;
    },
    // Torus
    () => {
      const points: THREE.Vector3[] = [];
      const majorRadius = 2;
      const minorRadius = 0.8;
      for (let i = 0; i < 32; i++) {
        const angle = (i / 32) * Math.PI * 2;
        points.push(new THREE.Vector3(
          Math.cos(angle) * majorRadius,
          Math.sin(angle) * minorRadius,
          Math.cos(angle * 2) * minorRadius
        ));
      }
      return points;
    },
    // Merkaba
    () => {
      const points: THREE.Vector3[] = [];
      const size = 2;
      // Tetrahedron vertices
      const vertices = [
        [0, size, 0],
        [size * 0.816, -size * 0.333, size * 0.471],
        [-size * 0.816, -size * 0.333, size * 0.471],
        [0, -size * 0.333, -size * 0.943]
      ];
      vertices.forEach(vertex => {
        points.push(new THREE.Vector3(...vertex));
        points.push(new THREE.Vector3(-vertex[0], -vertex[1], -vertex[2]));
      });
      return points;
    }
  ], []);
  
  useFrame(({ clock }) => {
    if (!isActive || !morphRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Change geometry every 10 seconds
    const newGeometry = Math.floor(time / 10) % geometries.length;
    if (newGeometry !== currentGeometry) {
      setCurrentGeometry(newGeometry);
    }
    
    // Gentle rotation
    morphRef.current.rotation.y = time * 0.1;
    morphRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
  });
  
  const currentPoints = geometries[currentGeometry]();
  
  return (
    <group ref={morphRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={currentPoints.length}
            array={new Float32Array(currentPoints.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color={new THREE.Color(1, 0.8, 0.2)}
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
      
      {/* Connecting lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={currentPoints.length * 2}
            array={new Float32Array(
              currentPoints.flatMap((point, i) => {
                const nextPoint = currentPoints[(i + 1) % currentPoints.length];
                return [point.x, point.y, point.z, nextPoint.x, nextPoint.y, nextPoint.z];
              })
            )}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color={new THREE.Color(0.2, 0.8, 1)}
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
};

// Main Living Ether Grid Component
export const LivingEtherGrid: React.FC<LivingEtherGridProps> = ({ 
  isActive, 
  onExit 
}) => {
  // Exit handlers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' || event.key === ' ') {
        onExit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);
  
  return (
    <div 
      className="fixed inset-0 bg-black"
      onClick={onExit}
      onTouchStart={onExit}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
            The Resonance Mesh
          </h1>
          <p className="text-xl md:text-2xl opacity-80 drop-shadow-lg">
            Living Ether Grid
          </p>
        </div>
      </div>
      
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
          dpr={[1, 2]}
          performance={{ min: 0.8 }}
        >
          <color args={['#000000']} />
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#FFD700" />
          
          <EtherGridThreads isActive={isActive} />
          <SigilNodes isActive={isActive} />
          <CosmicHeartbeatWaves isActive={isActive} />
          <SacredGeometryMorphing isActive={isActive} />
          
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.3}
              intensity={1.5}
            />
          </EffectComposer>
        </Canvas>
      </div>
      
      {/* Sacred Shifter Logo Overlay */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <img 
          src="/sacred-shifter-logo.png" 
          alt="Sacred Shifter" 
          className="h-16 w-auto opacity-80"
        />
      </div>
      
      {/* Exit hint */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm z-20">
        Click or press ESC to return
      </div>
    </div>
  );
};
