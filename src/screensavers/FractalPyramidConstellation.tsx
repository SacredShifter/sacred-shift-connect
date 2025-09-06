import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, LensFlare } from '@react-three/postprocessing';
import * as THREE from 'three';

interface FractalPyramidProps {
  isActive: boolean;
  onExit: () => void;
}

// Metatron's Cube constellation generator
const generateMetatronCube = (radius: number = 2) => {
  const points: THREE.Vector3[] = [];
  const lines: [number, number][] = [];
  
  // 13 circles of Metatron's Cube
  const circles = [
    { center: [0, 0, 0], radius: 0.1 },
    { center: [0, 0.5, 0], radius: 0.15 },
    { center: [0, -0.5, 0], radius: 0.15 },
    { center: [0.43, 0.25, 0], radius: 0.12 },
    { center: [-0.43, 0.25, 0], radius: 0.12 },
    { center: [0.43, -0.25, 0], radius: 0.12 },
    { center: [-0.43, -0.25, 0], radius: 0.12 },
    { center: [0.25, 0.75, 0], radius: 0.1 },
    { center: [-0.25, 0.75, 0], radius: 0.1 },
    { center: [0.25, -0.75, 0], radius: 0.1 },
    { center: [-0.25, -0.75, 0], radius: 0.1 },
    { center: [0.68, 0, 0], radius: 0.08 },
    { center: [-0.68, 0, 0], radius: 0.08 }
  ];
  
  circles.forEach((circle, i) => {
    const point = new THREE.Vector3(
      circle.center[0] * radius,
      circle.center[1] * radius,
      circle.center[2] * radius
    );
    points.push(point);
    
    // Connect to nearby circles
    circles.forEach((otherCircle, j) => {
      if (i !== j) {
        const distance = Math.sqrt(
          Math.pow(circle.center[0] - otherCircle.center[0], 2) +
          Math.pow(circle.center[1] - otherCircle.center[1], 2) +
          Math.pow(circle.center[2] - otherCircle.center[2], 2)
        );
        if (distance < 0.8) {
          lines.push([i, j]);
        }
      }
    });
  });
  
  return { points, lines };
};

// Sierpinski fractal generator
const generateSierpinskiFractal = (depth: number = 4) => {
  const points: THREE.Vector3[] = [];
  
  const addTriangle = (p1: THREE.Vector3, p2: THREE.Vector3, p3: THREE.Vector3, level: number) => {
    if (level === 0) {
      points.push(p1, p2, p3);
      return;
    }
    
    const mid1 = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
    const mid2 = new THREE.Vector3().addVectors(p2, p3).multiplyScalar(0.5);
    const mid3 = new THREE.Vector3().addVectors(p3, p1).multiplyScalar(0.5);
    
    addTriangle(p1, mid1, mid3, level - 1);
    addTriangle(mid1, p2, mid2, level - 1);
    addTriangle(mid3, mid2, p3, level - 1);
  };
  
  const baseTriangle = [
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(-0.866, -0.5, 0),
    new THREE.Vector3(0.866, -0.5, 0)
  ];
  
  addTriangle(baseTriangle[0], baseTriangle[1], baseTriangle[2], depth);
  return points;
};

// Golden Fractal Pyramid Component
const GoldenFractalPyramid: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const pyramidRef = useRef<THREE.Group>(null);
  const [breathPhase, setBreathPhase] = useState(0);
  const [fragmentPhase, setFragmentPhase] = useState(0);
  
  // Fractal pyramid geometry
  const pyramidGeometry = useMemo(() => {
    const geometry = new THREE.ConeGeometry(1.5, 2.5, 8, 1, true);
    
    // Add fractal detail to vertices
    const positions = geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Add fractal noise
      const noise = Math.sin(x * 10) * Math.cos(y * 10) * Math.sin(z * 10) * 0.1;
      positions[i] += noise;
      positions[i + 1] += noise;
      positions[i + 2] += noise;
    }
    
    geometry.computeVertexNormals();
    return geometry;
  }, []);
  
  // Golden pyramid material with inner fire
  const pyramidMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        breathPhase: { value: 0 },
        fragmentPhase: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        uniform float breathPhase;
        uniform float fragmentPhase;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        // Fractal displacement
        vec3 fractalDisplacement(vec3 pos, float time) {
          float scale = 1.0;
          vec3 displacement = vec3(0.0);
          
          for (int i = 0; i < 4; i++) {
            displacement += vec3(
              sin(pos.x * scale + time),
              sin(pos.y * scale + time * 0.7),
              sin(pos.z * scale + time * 0.5)
            ) * (1.0 / scale);
            scale *= 2.0;
          }
          
          return displacement * 0.1;
        }
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          
          // Apply fractal displacement
          vec3 displaced = position + fractalDisplacement(position, time);
          
          // Breath cycle expansion
          float breathScale = 1.0 + breathPhase * 0.3;
          displaced *= breathScale;
          
          // Fragment breaking effect
          float fragmentBreak = sin(fragmentPhase * 3.14159) * 0.2;
          displaced += normal * fragmentBreak;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        uniform float breathPhase;
        uniform float fragmentPhase;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
          
          // Golden color with inner fire
          vec3 goldenBase = vec3(1.0, 0.8, 0.2);
          vec3 innerFire = vec3(1.0, 0.4, 0.1);
          
          // Breath pulse
          float pulse = 0.7 + breathPhase * 0.3;
          
          // Inner fire intensity
          float fireIntensity = sin(time * 3.0 + length(vPosition) * 5.0) * 0.5 + 0.5;
          
          // Mix golden base with inner fire
          vec3 finalColor = mix(goldenBase, innerFire, fireIntensity * 0.6) * pulse;
          
          // Add lattice wireframe effect
          float lattice = step(0.95, fract(vUv.x * 8.0)) + step(0.95, fract(vUv.y * 8.0));
          finalColor += lattice * vec3(1.0, 1.0, 0.8) * 0.3;
          
          float alpha = fresnel * 0.8 * pulse;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !pyramidRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // 432Hz breath cycle (4.32 seconds)
    const breathCycle = Math.sin(time * (432 / 60) * Math.PI) * 0.5 + 0.5;
    setBreathPhase(breathCycle);
    
    // Fragment breaking cycle (every 8 seconds)
    const fragmentCycle = (time % 8) / 8;
    setFragmentPhase(fragmentCycle);
    
    // Update material uniforms
    pyramidMaterial.uniforms.time.value = time;
    pyramidMaterial.uniforms.breathPhase.value = breathCycle;
    pyramidMaterial.uniforms.fragmentPhase.value = fragmentCycle;
    
    // Rotate pyramid
    pyramidRef.current.rotation.y = time * 0.1;
    pyramidRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
  });
  
  return (
    <group ref={pyramidRef}>
      <mesh geometry={pyramidGeometry} material={pyramidMaterial}>
        <wireframeGeometry args={[pyramidGeometry]} />
      </mesh>
    </group>
  );
};

// Constellation Stars Component
const ConstellationStars: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const starsRef = useRef<THREE.Points>(null);
  const { points, lines } = useMemo(() => generateMetatronCube(3), []);
  
  const starGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(points.length * 3);
    const colors = new Float32Array(points.length * 3);
    const sizes = new Float32Array(points.length);
    
    points.forEach((point, i) => {
      positions[i * 3] = point.x;
      positions[i * 3 + 1] = point.y;
      positions[i * 3 + 2] = point.z;
      
      // Golden star colors
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 0.2 + Math.random() * 0.3;
      
      sizes[i] = 0.1 + Math.random() * 0.2;
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, [points]);
  
  const starMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        attribute float size;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          // Twinkling effect
          float twinkle = sin(time * 2.0 + position.x * 10.0) * 0.3 + 0.7;
          vAlpha = twinkle;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z) * twinkle;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        precision mediump float;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          float glow = exp(-r * 4.0);
          vec3 finalColor = vColor * (1.0 + glow * 2.0);
          float alpha = glow * vAlpha * 0.9;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !starsRef.current) return;
    
    const time = clock.getElapsedTime();
    starMaterial.uniforms.time.value = time;
    
    // Gentle rotation
    starsRef.current.rotation.y = time * 0.05;
  });
  
  return (
    <points ref={starsRef} geometry={starGeometry} material={starMaterial} />
  );
};

// Constellation Lines Component
const ConstellationLines: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const linesRef = useRef<THREE.LineSegments>(null);
  const { points, lines } = useMemo(() => generateMetatronCube(3), []);
  
  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(lines.length * 2 * 3);
    
    lines.forEach((line, i) => {
      const start = points[line[0]];
      const end = points[line[1]];
      
      positions[i * 6] = start.x;
      positions[i * 6 + 1] = start.y;
      positions[i * 6 + 2] = start.z;
      positions[i * 6 + 3] = end.x;
      positions[i * 6 + 4] = end.y;
      positions[i * 6 + 5] = end.z;
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [points, lines]);
  
  const lineMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        varying float vAlpha;
        
        void main() {
          vAlpha = sin(time * 2.0 + position.x * 5.0) * 0.3 + 0.7;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        varying float vAlpha;
        
        void main() {
          vec3 goldenColor = vec3(1.0, 0.8, 0.3);
          gl_FragColor = vec4(goldenColor, vAlpha * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !linesRef.current) return;
    
    const time = clock.getElapsedTime();
    lineMaterial.uniforms.time.value = time;
  });
  
  return (
    <lineSegments ref={linesRef} geometry={lineGeometry} material={lineMaterial} />
  );
};

// Floating Fragments Component
const FloatingFragments: React.FC<{ isActive: boolean; fragmentPhase: number }> = ({ 
  isActive, 
  fragmentPhase 
}) => {
  const fragmentsRef = useRef<THREE.Group>(null);
  
  const fragments = useMemo(() => {
    return Array.from({ length: 20 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8
      ] as [number, number, number],
      scale: 0.1 + Math.random() * 0.3,
      speed: 0.5 + Math.random() * 1.0,
      phase: Math.random() * Math.PI * 2
    }));
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !fragmentsRef.current) return;
    
    const time = clock.getElapsedTime();
    
    fragmentsRef.current.children.forEach((fragment, i) => {
      const fragmentData = fragments[i];
      
      // Fragment floating animation
      fragment.position.y += Math.sin(time * fragmentData.speed + fragmentData.phase) * 0.01;
      fragment.rotation.x = time * 0.5 + fragmentData.phase;
      fragment.rotation.y = time * 0.3 + fragmentData.phase;
      
      // Snap back effect during fragment phase
      if (fragmentPhase > 0.5) {
        const snapBack = Math.sin((fragmentPhase - 0.5) * Math.PI * 2) * 0.5;
        fragment.position.x *= (1 - snapBack);
        fragment.position.z *= (1 - snapBack);
      }
    });
  });
  
  return (
    <group ref={fragmentsRef}>
      {fragments.map((fragment, i) => (
        <mesh key={i} position={fragment.position} scale={[fragment.scale, fragment.scale, fragment.scale]}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial
            color={new THREE.Color(1, 0.8, 0.2)}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main Fractal Pyramid Constellation Component
export const FractalPyramidConstellation: React.FC<FractalPyramidProps> = ({ 
  isActive, 
  onExit 
}) => {
  const [fragmentPhase, setFragmentPhase] = useState(0);
  
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
  
  // Update fragment phase for floating fragments
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setFragmentPhase(prev => (prev + 0.1) % 1);
    }, 100);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  return (
    <div 
      className="fixed inset-0 bg-black"
      onClick={onExit}
      onTouchStart={onExit}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
            The Ascending Temple
          </h1>
          <p className="text-xl md:text-2xl opacity-80 drop-shadow-lg">
            Fractal Pyramid Constellation
          </p>
        </div>
      </div>
      
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 2]}
          performance={{ min: 0.8 }}
        >
          <color args={['#000000']} />
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 5]} intensity={0.5} color="#FFD700" />
          
          <GoldenFractalPyramid isActive={isActive} />
          <ConstellationStars isActive={isActive} />
          <ConstellationLines isActive={isActive} />
          <FloatingFragments isActive={isActive} fragmentPhase={fragmentPhase} />
          
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.5}
              intensity={1.2}
            />
            <LensFlare
              position={[0, 0, 5]}
              intensity={0.8}
              color="#FFD700"
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
