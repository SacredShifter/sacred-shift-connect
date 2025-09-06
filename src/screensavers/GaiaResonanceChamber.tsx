import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';

interface GaiaResonanceChamberProps {
  isActive: boolean;
  onExit: () => void;
}

// Schumann resonance data (simulated)
const SCHUMANN_FREQUENCIES = [7.83, 14.3, 20.8, 27.3, 33.8, 39.9, 45.8, 51.7];

// Earth Component
const Earth: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const earthRef = useRef<THREE.Group>(null);
  const [auroraIntensity, setAuroraIntensity] = useState(0);
  
  // Earth geometry
  const earthGeometry = useMemo(() => {
    return new THREE.SphereGeometry(1.5, 64, 64);
  }, []);
  
  // Earth material with aurora belts
  const earthMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        auroraIntensity: { value: 0 },
        schumannResonance: { value: 7.83 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        uniform float auroraIntensity;
        uniform float schumannResonance;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          
          // Aurora belt displacement
          float auroraBelt = sin(vUv.y * 10.0 + time * 2.0) * auroraIntensity * 0.1;
          vec3 newPosition = position + normal * auroraBelt;
          
          // Schumann resonance pulsing
          float resonance = sin(time * schumannResonance * 0.1) * 0.05;
          newPosition += normal * resonance;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        uniform float auroraIntensity;
        uniform float schumannResonance;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          // Earth base colors
          vec3 oceanColor = vec3(0.1, 0.3, 0.8);
          vec3 landColor = vec3(0.2, 0.6, 0.2);
          vec3 cloudColor = vec3(0.9, 0.9, 0.9);
          
          // Mix ocean and land based on UV coordinates
          float landMask = sin(vUv.x * 20.0) * sin(vUv.y * 15.0) * 0.5 + 0.5;
          vec3 baseColor = mix(oceanColor, landColor, landMask);
          
          // Aurora belts
          float auroraBelt1 = sin(vUv.y * 8.0 + time * 1.5) * 0.5 + 0.5;
          float auroraBelt2 = sin(vUv.y * 12.0 - time * 2.0) * 0.5 + 0.5;
          
          vec3 auroraColor1 = vec3(0.0, 1.0, 0.5); // Green
          vec3 auroraColor2 = vec3(1.0, 0.0, 0.8); // Pink
          vec3 auroraColor3 = vec3(0.5, 0.0, 1.0); // Purple
          
          vec3 aurora = mix(
            mix(auroraColor1, auroraColor2, auroraBelt1),
            auroraColor3,
            auroraBelt2
          ) * auroraIntensity;
          
          // Schumann resonance glow
          float resonance = sin(time * schumannResonance * 0.1) * 0.5 + 0.5;
          vec3 resonanceGlow = vec3(0.2, 0.8, 1.0) * resonance * 0.3;
          
          // Final color
          vec3 finalColor = baseColor + aurora + resonanceGlow;
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !earthRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Simulate Schumann resonance data
    const schumannIndex = Math.floor(time) % SCHUMANN_FREQUENCIES.length;
    const schumannFreq = SCHUMANN_FREQUENCIES[schumannIndex];
    
    // Aurora intensity based on time
    const aurora = Math.sin(time * 0.5) * 0.5 + 0.5;
    setAuroraIntensity(aurora);
    
    // Update material uniforms
    earthMaterial.uniforms.time.value = time;
    earthMaterial.uniforms.auroraIntensity.value = aurora;
    earthMaterial.uniforms.schumannResonance.value = schumannFreq;
    
    // Rotate Earth
    earthRef.current.rotation.y = time * 0.1;
  });
  
  return (
    <group ref={earthRef}>
      <mesh geometry={earthGeometry} material={earthMaterial} />
    </group>
  );
};

// Crystalline Rings Component
const CrystallineRings: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const ringsRef = useRef<THREE.Group>(null);
  
  const rings = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => ({
      radius: 2.5 + i * 0.8,
      thickness: 0.1 + i * 0.02,
      tilt: (i * Math.PI) / 14,
      speed: 0.5 + i * 0.1,
      phase: i * Math.PI / 3,
      color: new THREE.Color().setHSL(0.6 + i * 0.05, 0.8, 0.6)
    }));
  }, []);
  
  // Ring material with rainbow prisms
  const ringMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vUv = uv;
          
          // Gentle rotation
          float rotation = time * 0.1;
          float cos_r = cos(rotation);
          float sin_r = sin(rotation);
          
          vec3 rotatedPos = vec3(
            position.x * cos_r - position.z * sin_r,
            position.y,
            position.x * sin_r + position.z * cos_r
          );
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(rotatedPos, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec2 vUv;
        
        void main() {
          // Rainbow prism effect
          float hue = (vUv.x + time * 0.1) % 1.0;
          vec3 rainbow = vec3(
            sin(hue * 6.28) * 0.5 + 0.5,
            sin(hue * 6.28 + 2.094) * 0.5 + 0.5,
            sin(hue * 6.28 + 4.188) * 0.5 + 0.5
          );
          
          // Afterglow trails
          float trail = sin(time * 2.0 + vUv.x * 10.0) * 0.3 + 0.7;
          vec3 finalColor = rainbow * trail;
          
          gl_FragColor = vec4(finalColor, 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !ringsRef.current) return;
    
    const time = clock.getElapsedTime();
    ringMaterial.uniforms.time.value = time;
    
    // Rotate rings at different speeds
    ringsRef.current.children.forEach((ring, i) => {
      const ringData = rings[i];
      ring.rotation.y = time * ringData.speed;
      ring.rotation.x = ringData.tilt + Math.sin(time * 0.3 + ringData.phase) * 0.1;
    });
  });
  
  return (
    <group ref={ringsRef}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[ring.tilt, 0, 0]}>
          <torusGeometry args={[ring.radius, ring.thickness, 16, 64]} />
          <primitive object={ringMaterial} />
        </mesh>
      ))}
    </group>
  );
};

// Chamber Activation Component
const ChamberActivation: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const activationRef = useRef<THREE.Group>(null);
  const [activationPhase, setActivationPhase] = useState(0);
  
  // Activation material
  const activationMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        activationPhase: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        uniform float activationPhase;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vActivation;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vActivation = activationPhase;
          
          // Activation pulse
          float pulse = sin(time * 4.0 + activationPhase * 3.14159) * 0.2;
          vec3 newPosition = position + normal * pulse;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        uniform float activationPhase;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vActivation;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
          
          // Activation colors
          vec3 activationColor = vec3(1.0, 0.8, 0.2); // Gold
          vec3 pulseColor = vec3(1.0, 0.2, 0.8); // Magenta
          
          // Mix colors based on activation phase
          vec3 finalColor = mix(activationColor, pulseColor, vActivation);
          
          // Resonant pulse effect
          float pulse = sin(time * 8.0 + vActivation * 6.28) * 0.5 + 0.5;
          finalColor *= pulse;
          
          float alpha = fresnel * vActivation * 0.8;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !activationRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // 7-minute activation cycle
    const cycleTime = 420; // 7 minutes in seconds
    const phase = (time % cycleTime) / cycleTime;
    setActivationPhase(phase);
    
    activationMaterial.uniforms.time.value = time;
    activationMaterial.uniforms.activationPhase.value = phase;
    
    // Rotate activation field
    activationRef.current.rotation.y = time * 0.2;
    activationRef.current.rotation.x = Math.sin(time * 0.1) * 0.2;
  });
  
  return (
    <group ref={activationRef}>
      {/* Activation field sphere */}
      <mesh scale={[4, 4, 4]}>
        <sphereGeometry args={[1, 32, 32]} />
        <primitive object={activationMaterial} />
      </mesh>
      
      {/* Resonant pulse rings */}
      {[1, 1.5, 2, 2.5, 3].map((scale, i) => (
        <mesh key={i} scale={[scale, scale, scale]}>
          <torusGeometry args={[1, 0.05, 16, 64]} />
          <primitive object={activationMaterial} />
        </mesh>
      ))}
    </group>
  );
};

// Sacred Geometry Wings Component
const SacredGeometryWings: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const wingsRef = useRef<THREE.Group>(null);
  const [wingPhase, setWingPhase] = useState(0);
  
  // Wing geometries
  const wingGeometries = useMemo(() => {
    return [
      // Merkaba
      () => {
        const points: THREE.Vector3[] = [];
        const size = 2;
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
      },
      // Sri Yantra
      () => {
        const points: THREE.Vector3[] = [];
        const radius = 2;
        for (let i = 0; i < 9; i++) {
          const angle = (i / 9) * Math.PI * 2;
          const r = radius * (0.2 + (i % 3) * 0.3);
          points.push(new THREE.Vector3(
            Math.cos(angle) * r,
            Math.sin(angle) * r,
            0
          ));
        }
        return points;
      }
    ];
  }, []);
  
  const wingMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        wingPhase: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        uniform float wingPhase;
        varying vec3 vPosition;
        varying float vAlpha;
        
        void main() {
          vPosition = position;
          
          // Wing unfolding animation
          float unfold = sin(wingPhase * 3.14159) * 0.5 + 0.5;
          vec3 newPosition = position * unfold;
          
          // Gentle floating
          newPosition.y += sin(time * 0.5 + position.x * 0.5) * 0.1;
          
          vAlpha = unfold;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        uniform float wingPhase;
        varying vec3 vPosition;
        varying float vAlpha;
        
        void main() {
          // Sacred geometry colors
          vec3 color1 = vec3(1.0, 0.8, 0.2); // Gold
          vec3 color2 = vec3(0.8, 0.2, 1.0); // Purple
          vec3 color3 = vec3(0.2, 0.8, 1.0); // Blue
          
          // Mix colors based on position and time
          float mix1 = sin(vPosition.x * 2.0 + time) * 0.5 + 0.5;
          float mix2 = sin(vPosition.y * 2.0 + time * 1.5) * 0.5 + 0.5;
          
          vec3 finalColor = mix(
            mix(color1, color2, mix1),
            color3,
            mix2
          );
          
          gl_FragColor = vec4(finalColor, vAlpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  const [currentGeometryIndex, setCurrentGeometryIndex] = useState(0);
  
  useFrame(({ clock }) => {
    if (!isActive || !wingsRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Wing unfolding cycle (every 15 seconds)
    const cycle = (time % 15) / 15;
    setWingPhase(cycle);
    
    // Update geometry index every 15 seconds
    const newIndex = Math.floor(time / 15) % wingGeometries.length;
    if (newIndex !== currentGeometryIndex) {
      setCurrentGeometryIndex(newIndex);
    }
    
    wingMaterial.uniforms.time.value = time;
    wingMaterial.uniforms.wingPhase.value = cycle;
    
    // Rotate wings
    wingsRef.current.rotation.y = time * 0.1;
  });
  
  const currentGeometry = wingGeometries[currentGeometryIndex]();
  
  return (
    <group ref={wingsRef} position={[0, 0, -2]}>
      {/* Left wing */}
      <group rotation={[0, -Math.PI / 4, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={currentGeometry.length}
              array={new Float32Array(currentGeometry.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <primitive object={wingMaterial} />
        </points>
      </group>
      
      {/* Right wing */}
      <group rotation={[0, Math.PI / 4, 0]}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={currentGeometry.length}
              array={new Float32Array(currentGeometry.flatMap(p => [-p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <primitive object={wingMaterial} />
        </points>
      </group>
    </group>
  );
};

// Main Gaia Resonance Chamber Component
export const GaiaResonanceChamber: React.FC<GaiaResonanceChamberProps> = ({ 
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
            The Planet's Breath
          </h1>
          <p className="text-xl md:text-2xl opacity-80 drop-shadow-lg">
            Gaia Resonance Chamber
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
          <ambientLight intensity={0.2} />
          <pointLight position={[0, 0, 5]} intensity={0.8} color="#FFD700" />
          
          <Earth isActive={isActive} />
          <CrystallineRings isActive={isActive} />
          <ChamberActivation isActive={isActive} />
          <SacredGeometryWings isActive={isActive} />
          
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.2}
              intensity={2.0}
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
