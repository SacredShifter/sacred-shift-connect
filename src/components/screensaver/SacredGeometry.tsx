import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Sacred Geometry Components
export function FlowerOfLife({ isActive, breathPhase }: { isActive: boolean; breathPhase: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const geometry = useMemo(() => {
    const points = [];
    const colors = [];
    const radius = 0.8;
    const circles = 19; // Traditional Flower of Life has 19 circles
    
    // Create the classic Flower of Life pattern
    const positions = [
      { x: 0, y: 0 }, // Center circle
      // First ring (6 circles)
      ...Array.from({ length: 6 }, (_, i) => ({
        x: Math.cos(i * Math.PI / 3) * radius,
        y: Math.sin(i * Math.PI / 3) * radius
      })),
      // Second ring (12 circles)
      ...Array.from({ length: 12 }, (_, i) => ({
        x: Math.cos(i * Math.PI / 6) * radius * 1.732, // sqrt(3) spacing
        y: Math.sin(i * Math.PI / 6) * radius * 1.732
      }))
    ];
    
    positions.forEach((pos, circleIndex) => {
      const pointsPerCircle = 60;
      for (let i = 0; i < pointsPerCircle; i++) {
        const angle = (i / pointsPerCircle) * Math.PI * 2;
        const x = pos.x + Math.cos(angle) * radius * 0.3;
        const y = pos.y + Math.sin(angle) * radius * 0.3;
        const z = Math.sin(angle * 3) * 0.1; // Slight 3D variation
        
        points.push(x, y, z);
        
        // Sacred color palette - gold, violet, aquamarine
        const colorPhase = (circleIndex / circles + i / pointsPerCircle) * Math.PI * 2;
        const r = 0.8 + Math.sin(colorPhase) * 0.2; // Gold component
        const g = 0.4 + Math.sin(colorPhase + Math.PI * 2/3) * 0.4; // Variable component
        const b = 0.6 + Math.sin(colorPhase + Math.PI * 4/3) * 0.4; // Blue/violet component
        
        colors.push(r, g, b);
      }
    });
    
    return {
      positions: new Float32Array(points),
      colors: new Float32Array(colors),
      count: points.length / 3
    };
  }, []);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        breathPhase: { value: 0 },
        opacity: { value: 0.6 }
      },
      vertexShader: `
        uniform float time;
        uniform float breathPhase;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          // Breathing morph effect
          vec3 morphed = position * (1.0 + breathPhase * 0.1);
          
          // Sacred geometry rotation
          float rotation = time * 0.1;
          float cos_r = cos(rotation);
          float sin_r = sin(rotation);
          
          vec3 rotated = vec3(
            morphed.x * cos_r - morphed.y * sin_r,
            morphed.x * sin_r + morphed.y * cos_r,
            morphed.z + sin(time * 0.5 + length(position.xy)) * 0.05
          );
          
          vAlpha = 0.8 + sin(time + length(position)) * 0.2;
          
          vec4 mvPosition = modelViewMatrix * vec4(rotated, 1.0);
          gl_PointSize = 2.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        uniform float opacity;
        
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          float glow = exp(-r * 4.0);
          vec3 finalColor = vColor * (1.0 + glow * 0.5);
          float alpha = glow * vAlpha * opacity;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    material.uniforms.time.value = time;
    material.uniforms.breathPhase.value = breathPhase;
    
    // Gentle rotation
    groupRef.current.rotation.z = time * 0.05;
  });
  
  return (
    <group ref={groupRef}>
      <points material={material}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometry.count}
            array={geometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geometry.count}
            array={geometry.colors}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </group>
  );
}

export function MerkabaField({ isActive, breathPhase }: { isActive: boolean; breathPhase: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const geometry = useMemo(() => {
    const vertices = [];
    const colors = [];
    
    // Merkaba (Star Tetrahedron) - two interlocking tetrahedra
    const size = 1.5;
    
    // Tetrahedron 1 (pointing up)
    const tet1 = [
      [0, size, 0],          // Top
      [-size, -size/3, size], // Back left
      [size, -size/3, size],  // Back right
      [0, -size/3, -size]     // Front
    ];
    
    // Tetrahedron 2 (pointing down)
    const tet2 = [
      [0, -size, 0],         // Bottom
      [-size, size/3, -size], // Front left
      [size, size/3, -size],  // Front right
      [0, size/3, size]       // Back
    ];
    
    // Create edges for both tetrahedra
    const createEdges = (tetrahedron: number[][], colorShift: number) => {
      const edges = [
        [0, 1], [0, 2], [0, 3], // From top/bottom vertex
        [1, 2], [1, 3], [2, 3]  // Between base vertices
      ];
      
      edges.forEach(([a, b]) => {
        const steps = 20;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const x = tetrahedron[a][0] * (1 - t) + tetrahedron[b][0] * t;
          const y = tetrahedron[a][1] * (1 - t) + tetrahedron[b][1] * t;
          const z = tetrahedron[a][2] * (1 - t) + tetrahedron[b][2] * t;
          
          vertices.push(x, y, z);
          
          // Sacred colors with phase shift
          const phase = colorShift + t * Math.PI * 2;
          colors.push(
            0.8 + Math.sin(phase) * 0.2,           // Gold
            0.3 + Math.sin(phase + Math.PI/2) * 0.3, // Variable
            0.9 + Math.sin(phase + Math.PI) * 0.1    // Violet/Aqua
          );
        }
      });
    };
    
    createEdges(tet1, 0);
    createEdges(tet2, Math.PI);
    
    return {
      positions: new Float32Array(vertices),
      colors: new Float32Array(colors),
      count: vertices.length / 3
    };
  }, []);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        breathPhase: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        uniform float breathPhase;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vIntensity;
        
        void main() {
          vColor = color;
          
          // Counter-rotating Merkaba effect
          float rotation1 = time * 0.2;
          float rotation2 = -time * 0.15;
          
          vec3 pos = position;
          
          // Apply breathing morph
          pos *= (1.0 + breathPhase * 0.15);
          
          // Determine which tetrahedron this vertex belongs to
          float tetrahedron = step(0.0, pos.y);
          float rotation = mix(rotation2, rotation1, tetrahedron);
          
          // Apply rotation
          float cos_r = cos(rotation);
          float sin_r = sin(rotation);
          pos = vec3(
            pos.x * cos_r - pos.z * sin_r,
            pos.y,
            pos.x * sin_r + pos.z * cos_r
          );
          
          vIntensity = 0.7 + sin(time * 2.0 + length(position)) * 0.3;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 3.0 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vIntensity;
        
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          float glow = exp(-r * 3.0);
          vec3 finalColor = vColor * vIntensity * (1.0 + glow);
          float alpha = glow * vIntensity * 0.8;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive) return;
    
    const time = clock.getElapsedTime();
    material.uniforms.time.value = time;
    material.uniforms.breathPhase.value = breathPhase;
  });
  
  return (
    <group ref={groupRef}>
      <points material={material}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometry.count}
            array={geometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geometry.count}
            array={geometry.colors}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </group>
  );
}

export function TorusField({ isActive, breathPhase }: { isActive: boolean; breathPhase: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  const geometry = useMemo(() => {
    const vertices = [];
    const colors = [];
    
    // Multiple torus rings at different scales and orientations
    const rings = [
      { radius: 2, tube: 0.1, rotation: [0, 0, 0] },
      { radius: 1.5, tube: 0.08, rotation: [Math.PI/2, 0, 0] },
      { radius: 1.8, tube: 0.06, rotation: [0, Math.PI/2, 0] },
      { radius: 1.2, tube: 0.05, rotation: [Math.PI/4, Math.PI/4, 0] }
    ];
    
    rings.forEach((ring, ringIndex) => {
      const segments = 100;
      const tubes = 20;
      
      for (let i = 0; i < segments; i++) {
        for (let j = 0; j < tubes; j++) {
          const u = (i / segments) * Math.PI * 2;
          const v = (j / tubes) * Math.PI * 2;
          
          const x = (ring.radius + ring.tube * Math.cos(v)) * Math.cos(u);
          const y = (ring.radius + ring.tube * Math.cos(v)) * Math.sin(u);
          const z = ring.tube * Math.sin(v);
          
          // Apply rotation
          const rotatedX = x * Math.cos(ring.rotation[2]) - y * Math.sin(ring.rotation[2]);
          const rotatedY = x * Math.sin(ring.rotation[2]) + y * Math.cos(ring.rotation[2]);
          const rotatedZ = z;
          
          vertices.push(rotatedX, rotatedY, rotatedZ);
          
          // Energy field colors
          const colorPhase = u + v + ringIndex * Math.PI / 2;
          colors.push(
            0.2 + Math.sin(colorPhase) * 0.3,           // Aquamarine base
            0.6 + Math.sin(colorPhase + Math.PI/2) * 0.4, // Variable
            0.9 + Math.sin(colorPhase + Math.PI) * 0.1    // Blue-violet
          );
        }
      }
    });
    
    return {
      positions: new Float32Array(vertices),
      colors: new Float32Array(colors),
      count: vertices.length / 3
    };
  }, []);
  
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        breathPhase: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        uniform float breathPhase;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vGlow;
        
        void main() {
          vColor = color;
          
          // Torus field breathing
          vec3 pos = position * (1.0 + breathPhase * 0.1);
          
          // Energy wave propagation
          float wave = sin(length(pos) * 3.0 - time * 2.0) * 0.05;
          pos += normalize(pos) * wave;
          
          vGlow = 0.6 + sin(time * 1.5 + length(pos)) * 0.4;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = 2.5 * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vGlow;
        
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          float glow = exp(-r * 3.0);
          vec3 finalColor = vColor * vGlow * (1.0 + glow * 0.8);
          float alpha = glow * vGlow * 0.7;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    material.uniforms.time.value = time;
    material.uniforms.breathPhase.value = breathPhase;
    
    // Slow rotation for energy field effect
    groupRef.current.rotation.x = time * 0.1;
    groupRef.current.rotation.y = time * 0.07;
    groupRef.current.rotation.z = time * 0.05;
  });
  
  return (
    <group ref={groupRef}>
      <points material={material}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometry.count}
            array={geometry.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geometry.count}
            array={geometry.colors}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
    </group>
  );
}