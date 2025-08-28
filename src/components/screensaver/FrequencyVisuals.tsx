import React, { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { ScreensaverVisualType } from '../SacredScreensaver';
import { SacredMessage } from './SacredMessage';
import { useScreensaverMessages } from '@/hooks/useScreensaverMessages';
import { useCollectiveResonance } from '@/hooks/useCollectiveResonance';
import { FlowerOfLife, MerkabaField, TorusField } from './SacredGeometry';
import { EnhancedFrequencyWaves } from './EnhancedFrequencyWaves';
import { ResonanceMessaging } from './ResonanceMessaging';

// Custom shader materials for enhanced visuals
const createEnergyShaderMaterial = (color: THREE.Color, time: number = 0) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: time },
      color: { value: color },
      opacity: { value: 0.8 }
    },
    vertexShader: `
      uniform float time;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      vec3 noise3D(vec3 p) {
        return vec3(
          sin(p.x * 12.9898 + p.y * 78.233 + p.z * 45.543),
          sin(p.x * 32.233 + p.y * 43.142 + p.z * 23.123),
          sin(p.x * 67.456 + p.y * 29.876 + p.z * 31.456)
        );
      }
      
      void main() {
        vPosition = position;
        vNormal = normal;
        
        vec3 noiseOffset = noise3D(position + time * 0.5) * 0.1;
        vec3 newPosition = position + noiseOffset;
        
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
      }
    `,
    fragmentShader: `
      uniform float time;
      uniform vec3 color;
      uniform float opacity;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
        
        float glow = fresnel * (1.0 + sin(time * 2.0 + length(vPosition)) * 0.3);
        vec3 finalColor = color * glow;
        
        gl_FragColor = vec4(finalColor, opacity * glow);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide
  });
};

const createParticleShaderMaterial = (colors: THREE.Color[]) => {
  return new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      size: { value: 0.05 },
      colors: { value: colors }
    },
    vertexShader: `
      uniform float time;
      uniform float size;
      varying vec3 vColor;
      
      vec3 noise3D(vec3 p) {
        return vec3(
          sin(p.x * 12.9898 + p.y * 78.233 + time),
          sin(p.x * 32.233 + p.y * 43.142 + time),
          sin(p.x * 67.456 + p.y * 29.876 + time)
        );
      }
      
      void main() {
        vColor = color;
        
        vec3 noiseOffset = noise3D(position) * 0.2;
        vec3 newPosition = position + noiseOffset;
        
        vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
        gl_PointSize = size * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        float r = length(gl_PointCoord - vec2(0.5));
        if (r > 0.5) discard;
        
        float alpha = 1.0 - r * 2.0;
        gl_FragColor = vec4(vColor, alpha * 0.8);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  });
};

interface FrequencyVisualsProps {
  type: ScreensaverVisualType;
  isActive: boolean;
  showMessages?: boolean;
}

export function FrequencyVisuals({ type, isActive, showMessages = true }: FrequencyVisualsProps) {
  const { currentMessage, isVisible } = useScreensaverMessages({
    isActive: isActive && showMessages,
    rotationInterval: 75000, // 75 seconds between messages
    preventRepeats: 4
  });

  return (
    <>
      {/* 3D Visuals */}
      {(() => {
        switch (type) {
          case "breath_orb":
            return <EnhancedBreathOrb isActive={isActive} />;
          case "heart_opening":
            return <HeartOpening isActive={isActive} />;
          case "chakra_column":
            return <ChakraColumn isActive={isActive} />;
          case "galaxy_mind":
            return <GalaxyMind isActive={isActive} />;
          case "somatic_body":
            return <SomaticBody isActive={isActive} />;
          case "energy_alignment":
            return <EnergyAlignment isActive={isActive} />;
          default:
            return <EnhancedBreathOrb isActive={isActive} />;
        }
      })()}
      
      {/* Sacred Messages Overlay (rendered outside Canvas in parent) */}
      {showMessages && typeof window !== 'undefined' && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <SacredMessage 
            message={currentMessage}
            isVisible={isVisible}
          />
          <ResonanceMessaging 
            isActive={isActive}
            phase="frequency"
          />
        </div>
      )}
    </>
  );
}

// Enhanced Breath Orb with Sacred Geometry and Collective Resonance
function EnhancedBreathOrb({ isActive }: { isActive: boolean }) {
  const orbRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [geometryType, setGeometryType] = useState<'flower' | 'merkaba' | 'torus'>('flower');
  
  // Collective resonance integration
  const { getDominantFrequency } = useCollectiveResonance();
  const { color: dominantColor, strength: resonanceStrength } = getDominantFrequency();
  
  // Breathing cycle state
  const breathPhase = useRef(0);
  
  useFrame(({ clock }) => {
    if (!isActive) return;
    
    const time = clock.getElapsedTime();
    
    // Slow breath cycle (4 seconds inhale, 4 seconds exhale)
    breathPhase.current = Math.sin(time * Math.PI / 4) * 0.5 + 0.5;
    
    // Update orb based on collective resonance
    if (orbRef.current) {
      const breathScale = 1 + breathPhase.current * 0.3;
      const resonanceScale = 1 + (resonanceStrength / 10) * 0.2;
      orbRef.current.scale.setScalar(breathScale * resonanceScale);
      
      // Gentle rotation
      orbRef.current.rotation.y = time * 0.05;
      orbRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
    }
    
    // Cycle through sacred geometry every 30 seconds
    const geometryCycle = Math.floor(time / 30) % 3;
    const newGeometry = ['flower', 'merkaba', 'torus'][geometryCycle] as 'flower' | 'merkaba' | 'torus';
    if (newGeometry !== geometryType) {
      setGeometryType(newGeometry);
    }
  });
  
  // Enhanced orb material with resonance reactivity
  const orbMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        breathPhase: { value: 0 },
        dominantColor: { value: new THREE.Color(...dominantColor) },
        resonanceStrength: { value: resonanceStrength }
      },
      vertexShader: `
        uniform float time;
        uniform float breathPhase;
        uniform float resonanceStrength;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        // Subtle energy displacement
        vec3 energyDisplacement(vec3 pos, float time, float breath) {
          float noise = sin(pos.x * 4.0 + time) * sin(pos.y * 3.0 + time * 0.7) * sin(pos.z * 5.0 + time * 0.5);
          return pos + normalize(pos) * noise * 0.03 * (1.0 + breath * 0.5);
        }
        
        void main() {
          vPosition = position;
          vNormal = normal;
          
          // Apply energy displacement
          vec3 displaced = energyDisplacement(position, time, breathPhase);
          
          vec4 worldPosition = modelMatrix * vec4(displaced, 1.0);
          vWorldPosition = worldPosition.xyz;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float breathPhase;
        uniform vec3 dominantColor;
        uniform float resonanceStrength;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
          
          // Breathing pulse
          float pulse = 0.7 + breathPhase * 0.3;
          
          // Resonance intensity
          float resonanceGlow = 1.0 + (resonanceStrength / 10.0) * 0.5;
          
          // Color mixing with dominant resonance
          vec3 baseColor = vec3(0.4, 0.6, 1.0); // Default blue
          vec3 finalColor = mix(baseColor, dominantColor, 0.6) * fresnel * pulse * resonanceGlow;
          
          float alpha = fresnel * 0.4 * pulse;
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, [dominantColor, resonanceStrength]);
  
  useFrame(({ clock }) => {
    if (!isActive) return;
    
    const time = clock.getElapsedTime();
    orbMaterial.uniforms.time.value = time;
    orbMaterial.uniforms.breathPhase.value = breathPhase.current;
    orbMaterial.uniforms.dominantColor.value.setRGB(...dominantColor);
    orbMaterial.uniforms.resonanceStrength.value = resonanceStrength;
  });

  return (
    <group ref={groupRef}>
      {/* Central Resonance Orb */}
      <mesh ref={orbRef} material={orbMaterial}>
        <icosahedronGeometry args={[1.2, 3]} />
      </mesh>
      
      {/* Sacred Geometry Layer */}
      {geometryType === 'flower' && (
        <FlowerOfLife isActive={isActive} breathPhase={breathPhase.current} />
      )}
      {geometryType === 'merkaba' && (
        <MerkabaField isActive={isActive} breathPhase={breathPhase.current} />
      )}
      {geometryType === 'torus' && (
        <TorusField isActive={isActive} breathPhase={breathPhase.current} />
      )}
      
      {/* Enhanced Frequency Waves */}
      <EnhancedFrequencyWaves 
        isActive={isActive}
        breathPhase={breathPhase.current}
        dominantColor={dominantColor}
        resonanceStrength={resonanceStrength}
      />
      
      {/* Enhanced Logo Display */}
      <EnhancedLogoOverlay isActive={isActive} />
    </group>
  );
}

// Enhanced Logo Overlay with Better Visibility
function EnhancedLogoOverlay({ isActive }: { isActive: boolean }) {
  const logoRef = useRef<THREE.Mesh>(null);
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);

  // Load logo texture with better error handling
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      'https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png',
      (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        setLogoTexture(texture);
      },
      undefined,
      (error) => {
        console.warn('Logo texture failed to load:', error);
      }
    );
  }, []);

  // Enhanced logo material with better visibility and glow
  const logoMaterial = useMemo(() => {
    if (!logoTexture) return null;
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        logoTexture: { value: logoTexture },
        opacity: { value: 0.9 }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.z += sin(time * 0.5) * 0.02;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D logoTexture;
        uniform float opacity;
        varying vec2 vUv;
        
        void main() {
          vec4 logoColor = texture2D(logoTexture, vUv);
          float glow = 1.0 + sin(time * 1.5) * 0.3;
          vec3 finalColor = max(logoColor.rgb * glow, vec3(0.3));
          gl_FragColor = vec4(finalColor, logoColor.a * opacity * glow);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending
    });
  }, [logoTexture]);

  useFrame(({ clock }) => {
    if (!isActive || !logoMaterial || !logoRef.current) return;
    const time = clock.getElapsedTime();
    logoMaterial.uniforms.time.value = time;
    logoRef.current.rotation.z = Math.sin(time * 0.3) * 0.02;
    logoRef.current.position.y = Math.sin(time * 0.4) * 0.1;
  });

  if (!logoMaterial) return null;

  return (
    <mesh ref={logoRef} material={logoMaterial} position={[0, -2.5, 2]} scale={[1, 1, 1]}>
      <planeGeometry args={[1.5, 0.4]} />
    </mesh>
  );
}

// Enhanced Heart Opening Visual with Radiant Heart Shader
function HeartOpening({ isActive }: { isActive: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  const { heartPoints, heartColors, heartMaterial } = useMemo(() => {
    const particleCount = 3000;
    const points = [];
    const colors = [];
    
    // Create multiple heart layers for depth
    for (let layer = 0; layer < 3; layer++) {
      const scale = 0.8 + layer * 0.4;
      const particlesPerLayer = particleCount / 3;
      
      for (let i = 0; i < particlesPerLayer; i++) {
        const t = (i / particlesPerLayer) * Math.PI * 2;
        // Parametric heart equation
        const x = 16 * Math.sin(t) ** 3;
        const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        
        // Add some organic variation
        const noise = (Math.random() - 0.5) * 2;
        points.push(
          x * 0.04 * scale + noise * 0.1, 
          y * 0.04 * scale + noise * 0.1, 
          layer * 0.3 + noise * 0.2
        );
        
        // Golden-pink gradient with warmth
        const intensity = 0.7 + Math.random() * 0.3;
        colors.push(
          1.0 * intensity,      // Red
          0.4 + layer * 0.2,   // Green - gets more golden in outer layers  
          0.6 + layer * 0.1    // Blue - warm pink
        );
      }
    }
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        heartbeat: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        uniform float heartbeat;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          // Pulsing heart effect
          float pulse = sin(time * 3.0) * 0.3 + 0.7;
          float beat = heartbeat * 0.4;
          
          vec3 newPosition = position * (1.0 + pulse * 0.2 + beat);
          
          // Ripple effect from center
          float dist = length(position.xy);
          float ripple = sin(dist * 8.0 - time * 4.0) * 0.05;
          newPosition.z += ripple;
          
          vAlpha = 1.0 - smoothstep(0.0, 2.0, dist);
          
          vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
          gl_PointSize = 8.0 * (300.0 / -mvPosition.z) * (1.0 + pulse);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          float glow = exp(-r * 3.0);
          vec3 finalColor = vColor * (1.0 + glow);
          float alpha = glow * vAlpha * 0.9;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    return { 
      heartPoints: new Float32Array(points), 
      heartColors: new Float32Array(colors),
      heartMaterial: material 
    };
  }, []);
  
  // Heart glow shader material
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(1.0, 0.3, 0.6) }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPosition;
        
        void main() {
          vNormal = normal;
          vPosition = position;
          
          float pulse = sin(time * 2.5) * 0.1;
          vec3 newPosition = position * (1.0 + pulse);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vNormal;
        
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0, 0, 1)), 2.0);
          float pulse = sin(time * 2.5) * 0.3 + 0.7;
          
          vec3 finalColor = color * fresnel * pulse;
          gl_FragColor = vec4(finalColor, fresnel * 0.4);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !groupRef.current) return;
    
    const time = clock.getElapsedTime();
    const heartbeat = Math.sin(time * 1.2) * 0.5 + 0.5; // Heartbeat rhythm
    
    groupRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    
    // Update materials
    if (heartMaterial) {
      heartMaterial.uniforms.time.value = time;
      heartMaterial.uniforms.heartbeat.value = heartbeat;
    }
    
    if (glowMaterial) {
      glowMaterial.uniforms.time.value = time;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Enhanced Heart Particles */}
      <points material={heartMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={heartPoints.length / 3}
            array={heartPoints}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={heartColors.length / 3}
            array={heartColors}
            itemSize={3}
          />
        </bufferGeometry>
      </points>
      
      {/* Heart Energy Aura */}
      <mesh ref={glowRef} material={glowMaterial} scale={[2, 2, 0.5]}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </group>
  );
}

// Enhanced Chakra Column with Radiant Energy Cores
function ChakraColumn({ isActive }: { isActive: boolean }) {
  const chakraColors = [
    new THREE.Color(1.0, 0.0, 0.0), // Root - Red
    new THREE.Color(1.0, 0.5, 0.0), // Sacral - Orange  
    new THREE.Color(1.0, 1.0, 0.0), // Solar Plexus - Yellow
    new THREE.Color(0.0, 1.0, 0.0), // Heart - Green
    new THREE.Color(0.0, 0.7, 1.0), // Throat - Blue
    new THREE.Color(0.3, 0.0, 0.8), // Third Eye - Indigo
    new THREE.Color(0.5, 0.0, 1.0)  // Crown - Violet
  ];
  
  return (
    <group>
      {/* Central Energy Column */}
      <mesh>
        <cylinderGeometry args={[0.05, 0.05, 10, 8]} />
        <meshBasicMaterial 
          color={new THREE.Color(1, 1, 1)}
          transparent 
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Enhanced Chakra Orbs */}
      {chakraColors.map((color, index) => (
        <EnhancedChakraOrb 
          key={index}
          position={[0, (index - 3) * 1.5, 0]}
          color={color}
          isActive={isActive}
          delay={index * 0.3}
          chakraIndex={index}
        />
      ))}
    </group>
  );
}

function EnhancedChakraOrb({ position, color, isActive, delay, chakraIndex }: {
  position: [number, number, number];
  color: THREE.Color;
  isActive: boolean;
  delay: number;
  chakraIndex: number;
}) {
  const orbRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  
  // Enhanced chakra orb material
  const orbMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: color },
        chakraIndex: { value: chakraIndex }
      },
      vertexShader: `
        uniform float time;
        uniform float chakraIndex;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          
          float spin = time * (1.0 + chakraIndex * 0.3);
          float pulse = sin(spin * 2.0) * 0.1;
          vec3 newPosition = position * (1.0 + pulse);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        uniform float chakraIndex;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
          
          float energy = fresnel * (1.0 + sin(time * 3.0 + chakraIndex) * 0.4);
          vec3 finalColor = color * energy * 2.0;
          
          gl_FragColor = vec4(finalColor, fresnel * 0.7);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, [color, chakraIndex]);
  
  // Particle system for each chakra
  const particles = useMemo(() => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = 0.8 + Math.random() * 0.4;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    return { positions, colors };
  }, [color]);
  
  useFrame(({ clock }) => {
    if (!isActive || !orbRef.current) return;
    
    const time = clock.getElapsedTime() + delay;
    
    orbRef.current.rotation.y = time * (0.5 + chakraIndex * 0.1);
    orbRef.current.scale.setScalar(1 + Math.sin(time * 2) * 0.15);
    
    if (orbMaterial) {
      orbMaterial.uniforms.time.value = time;
    }
    
    // Rotate particles
    if (particlesRef.current) {
      particlesRef.current.rotation.y = -time * 0.3;
    }
  });
  
  return (
    <group position={position}>
      {/* Enhanced Chakra Orb */}
      <mesh ref={orbRef} material={orbMaterial}>
        <torusGeometry args={[0.4, 0.15, 16, 32]} />
      </mesh>
      
      {/* Chakra Particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particles.positions.length / 3}
            array={particles.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particles.colors.length / 3}
            array={particles.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

// Enhanced Galaxy Mind Visual with Spiral Shader
function GalaxyMind({ isActive }: { isActive: boolean }) {
  const spiralRef = useRef<THREE.Points>(null);
  const nebulaRef = useRef<THREE.Mesh>(null);
  
  const { spiralPositions, spiralColors, spiralSizes, spiralMaterial } = useMemo(() => {
    const particleCount = 12000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const angle = t * Math.PI * 16; // More spiral turns
      const radius = t * 5;
      
      // Create multiple spiral arms
      const armOffset = (i % 3) * (Math.PI * 2 / 3);
      const finalAngle = angle + armOffset;
      
      positions[i * 3] = Math.cos(finalAngle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.8 + Math.sin(t * Math.PI * 4) * 0.3;
      positions[i * 3 + 2] = Math.sin(finalAngle) * radius;
      
      // Cosmic color gradient: purple center to gold outer
      const intensity = 0.8 + Math.random() * 0.2;
      colors[i * 3] = (0.3 + t * 0.7) * intensity;     // Red
      colors[i * 3 + 1] = (0.1 + t * 0.8) * intensity; // Green  
      colors[i * 3 + 2] = (1.0 - t * 0.6) * intensity; // Blue
      
      sizes[i] = 0.02 + t * 0.04;
    }
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          // Spiral rotation and cosmic drift
          float rotation = time * 0.2;
          float cos_r = cos(rotation);
          float sin_r = sin(rotation);
          
          vec3 rotatedPos = vec3(
            position.x * cos_r - position.z * sin_r,
            position.y + sin(time * 0.5 + length(position.xz) * 0.1) * 0.1,
            position.x * sin_r + position.z * cos_r
          );
          
          float distanceFromCenter = length(position.xz);
          vAlpha = 1.0 - smoothstep(0.0, 5.0, distanceFromCenter);
          
          vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
          gl_PointSize = size * (600.0 / -mvPosition.z) * vAlpha;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          float glow = exp(-r * 5.0);
          vec3 finalColor = vColor * (1.0 + glow * 0.8);
          float alpha = glow * vAlpha * 0.9;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
    
    return { 
      spiralPositions: positions,
      spiralColors: colors,
      spiralSizes: sizes,
      spiralMaterial: material 
    };
  }, []);
  
  // Nebula background material
  const nebulaMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        float noise(vec2 p) {
          return sin(p.x * 12.9898 + p.y * 78.233) * 43758.5453;
        }
        
        void main() {
          vec2 uv = vUv * 3.0;
          float n1 = sin(noise(uv + time * 0.1)) * 0.5 + 0.5;
          float n2 = sin(noise(uv * 2.0 - time * 0.15)) * 0.5 + 0.5;
          
          vec3 nebulaColor = vec3(0.2 + n1 * 0.3, 0.1 + n2 * 0.2, 0.6 + n1 * 0.4);
          float alpha = (n1 * n2) * 0.3;
          
          gl_FragColor = vec4(nebulaColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive) return;
    
    const time = clock.getElapsedTime();
    
    if (spiralMaterial) {
      spiralMaterial.uniforms.time.value = time;
    }
    
    if (nebulaMaterial) {
      nebulaMaterial.uniforms.time.value = time;
    }
    
    // Slow cosmic drift
    if (nebulaRef.current) {
      nebulaRef.current.rotation.z = time * 0.02;
    }
  });
  
  return (
    <group>
      {/* Cosmic Nebula Background */}
      <mesh ref={nebulaRef} material={nebulaMaterial} scale={[8, 8, 1]}>
        <planeGeometry args={[1, 1, 32, 32]} />
      </mesh>
      
      {/* Enhanced Spiral Galaxy */}
      <points ref={spiralRef} material={spiralMaterial}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={spiralPositions.length / 3}
            array={spiralPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={spiralColors.length / 3}
            array={spiralColors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={spiralSizes.length}
            array={spiralSizes}
            itemSize={1}
          />
        </bufferGeometry>
      </points>
    </group>
  );
}

// Enhanced Somatic Body Visual with Human Energy Field
function SomaticBody({ isActive }: { isActive: boolean }) {
  const bodyRef = useRef<THREE.Group>(null);
  const auraRef = useRef<THREE.Mesh>(null);
  
  // Human silhouette shader material
  const bodyMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          
          // Subtle breathing animation
          float breath = sin(time * 0.6) * 0.02;
          vec3 newPosition = position * (1.0 + breath);
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
          
          // Cyan energy with pulse
          vec3 bodyColor = vec3(0.0, 1.0, 0.8);
          float pulse = sin(time * 2.0 + vPosition.y * 3.0) * 0.3 + 0.7;
          
          vec3 finalColor = bodyColor * fresnel * pulse;
          gl_FragColor = vec4(finalColor, fresnel * 0.6);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  // Energy aura material
  const auraMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          float auraExpansion = sin(time * 0.8) * 0.3 + 1.0;
          vec3 newPosition = position * auraExpansion;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          float dist = length(vUv - vec2(0.5));
          float aura = 1.0 - smoothstep(0.2, 0.8, dist);
          
          // Rainbow energy field
          vec3 auraColor = vec3(
            sin(time * 2.0 + vPosition.y * 2.0) * 0.5 + 0.5,
            sin(time * 2.0 + vPosition.y * 2.0 + 2.094) * 0.5 + 0.5,
            sin(time * 2.0 + vPosition.y * 2.0 + 4.188) * 0.5 + 0.5
          );
          
          gl_FragColor = vec4(auraColor, aura * 0.3);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive) return;
    
    const time = clock.getElapsedTime();
    
    if (bodyMaterial) {
      bodyMaterial.uniforms.time.value = time;
    }
    
    if (auraMaterial) {
      auraMaterial.uniforms.time.value = time;
    }
    
    // Gentle swaying
    if (bodyRef.current) {
      bodyRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
  });
  
  return (
    <group ref={bodyRef}>
      {/* Human Energy Aura */}
      <mesh ref={auraRef} material={auraMaterial} scale={[1.5, 1.5, 1]} position={[0, 0, -0.1]}>
        <cylinderGeometry args={[0.8, 1.0, 3.5, 32]} />
      </mesh>
      
      {/* Enhanced Human Silhouette */}
      <mesh material={bodyMaterial}>
        <cylinderGeometry args={[0.3, 0.5, 3, 16]} />
      </mesh>
      
      {/* Chakra Points */}
      {[
        [0, 1.2, 0.1],   // Crown
        [0, 0.8, 0.1],   // Third Eye
        [0, 0.4, 0.1],   // Throat
        [0, 0, 0.1],     // Heart
        [0, -0.4, 0.1],  // Solar Plexus
        [0, -0.8, 0.1],  // Sacral
        [0, -1.2, 0.1]   // Root
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial 
            color={new THREE.Color().setHSL(i / 7, 1, 0.5)} 
            transparent 
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// Enhanced Energy Waves Component
function EnergyWaves({ isActive }: { isActive: boolean }) {
  const wavesRef = useRef<THREE.Group>(null);
  
  // Energy wave shader material
  const wavesMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        waveSpeed: { value: 2.0 },
        energy: { value: 1.0 }
      },
      vertexShader: `
        uniform float time;
        uniform float waveSpeed;
        uniform float energy;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vWaveIntensity;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          // Multiple wave frequencies for complex energy patterns
          float wave1 = sin(time * waveSpeed + length(position.xy) * 8.0) * 0.1;
          float wave2 = cos(time * waveSpeed * 1.3 + position.x * 12.0) * 0.05;
          float wave3 = sin(time * waveSpeed * 0.7 + position.y * 15.0) * 0.03;
          
          vWaveIntensity = (wave1 + wave2 + wave3) * energy;
          
          vec3 newPosition = position;
          newPosition += normal * vWaveIntensity;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        varying float vWaveIntensity;
        
        void main() {
          // Electric energy colors
          vec3 energyColor1 = vec3(0.2, 0.8, 1.0); // Cyan
          vec3 energyColor2 = vec3(1.0, 0.4, 0.8); // Magenta
          vec3 energyColor3 = vec3(0.8, 1.0, 0.2); // Electric green
          
          // Create electric arcs and plasma-like effects
          float electric = abs(vWaveIntensity) * 20.0;
          float plasma = sin(time * 4.0 + length(vPosition.xy) * 10.0) * 0.5 + 0.5;
          
          // Mix colors based on wave intensity and position
          vec3 finalColor = mix(
            mix(energyColor1, energyColor2, plasma),
            energyColor3,
            electric
          );
          
          float alpha = (electric + 0.2) * (0.8 - length(vUv - vec2(0.5)) * 1.5);
          alpha = max(0.0, alpha);
          
          gl_FragColor = vec4(finalColor * (1.0 + electric), alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive) return;
    
    const time = clock.getElapsedTime();
    
    if (wavesMaterial) {
      wavesMaterial.uniforms.time.value = time;
      wavesMaterial.uniforms.energy.value = 1.0 + Math.sin(time * 1.5) * 0.5;
    }
    
    if (wavesRef.current) {
      wavesRef.current.rotation.z = time * 0.1;
    }
  });
  
  return (
    <group ref={wavesRef}>
      {/* Multiple Energy Wave Layers */}
      {[
        { radius: 1.8, thickness: 0.08, speed: 1.0, rotation: 0 },
        { radius: 2.5, thickness: 0.06, speed: -0.7, rotation: Math.PI / 4 },
        { radius: 3.2, thickness: 0.04, speed: 1.3, rotation: Math.PI / 2 },
        { radius: 4.0, thickness: 0.03, speed: -0.9, rotation: Math.PI / 3 },
        { radius: 4.8, thickness: 0.02, speed: 1.1, rotation: Math.PI / 6 }
      ].map((wave, i) => (
        <mesh 
          key={i} 
          material={wavesMaterial}
          rotation={[Math.PI / 2, 0, wave.rotation]}
        >
          <torusGeometry args={[wave.radius, wave.thickness, 16, 128]} />
        </mesh>
      ))}
      
      {/* Vertical Energy Rings */}
      {[
        { radius: 2.0, height: 0.1, offset: 0 },
        { radius: 3.0, height: 0.08, offset: Math.PI / 3 },
        { radius: 4.0, height: 0.06, offset: Math.PI / 2 }
      ].map((ring, i) => (
        <mesh 
          key={`vertical-${i}`}
          material={wavesMaterial}
          rotation={[0, 0, ring.offset]}
        >
          <torusGeometry args={[ring.radius, ring.height, 8, 64]} />
        </mesh>
      ))}
      
      {/* Intersecting Energy Discs */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((angle, i) => (
        <mesh 
          key={`disc-${i}`}
          material={wavesMaterial}
          rotation={[angle, 0, 0]}
          scale={[1 - i * 0.1, 1 - i * 0.1, 1]}
        >
          <ringGeometry args={[2.5, 3.5, 32]} />
        </mesh>
      ))}
    </group>
  );
}

// Logo Overlay Component
function LogoOverlay({ isActive }: { isActive: boolean }) {
  const logoRef = useRef<THREE.Mesh>(null);
  const [logoTexture, setLogoTexture] = useState<THREE.Texture | null>(null);
  
  // Load logo texture
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      'https://mikltjgbvxrxndtszorb.supabase.co/storage/v1/object/public/sacred-assets/uploads/Logo-MainSacredShifter-removebg-preview%20(1).png',
      (texture) => {
        texture.format = THREE.RGBAFormat;
        setLogoTexture(texture);
      },
      undefined,
      (error) => {
        console.warn('Logo texture failed to load:', error);
      }
    );
  }, []);
  
  // Logo material with glow effect
  const logoMaterial = useMemo(() => {
    if (!logoTexture) return null;
    
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        logoTexture: { value: logoTexture },
        opacity: { value: 0.8 }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // Gentle floating animation
          vec3 newPosition = position;
          newPosition.y += sin(time * 0.8) * 0.1;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform sampler2D logoTexture;
        uniform float opacity;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec4 logoColor = texture2D(logoTexture, vUv);
          
          // Add subtle glow effect
          float glow = sin(time * 2.0) * 0.1 + 0.9;
          vec3 finalColor = logoColor.rgb * glow;
          
          // Respect original alpha channel for transparency
          float alpha = logoColor.a * opacity * glow;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      side: THREE.DoubleSide
    });
  }, [logoTexture]);
  
  useFrame(({ clock }) => {
    if (!isActive || !logoMaterial) return;
    
    const time = clock.getElapsedTime();
    logoMaterial.uniforms.time.value = time;
    
    if (logoRef.current) {
      // Gentle rotation
      logoRef.current.rotation.z = Math.sin(time * 0.3) * 0.05;
    }
  });
  
  if (!logoMaterial) return null;
  
  return (
    <mesh 
      ref={logoRef}
      material={logoMaterial}
      position={[0, -6, 2]}
      scale={[1.5, 1.5, 1]}
    >
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
}
function EnergyAlignment({ isActive }: { isActive: boolean }) {
  const arcRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Mesh>(null);
  
  // Rainbow arc material
  const arcMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          vPosition = position;
          vUv = uv;
          
          // Wave distortion along the arc
          float wave = sin(vUv.x * 10.0 + time * 3.0) * 0.1;
          vec3 newPosition = position + normal * wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vPosition;
        varying vec2 vUv;
        
        void main() {
          // Rainbow gradient based on arc position
          float progress = vUv.x;
          vec3 rainbow = vec3(
            sin(progress * 6.28 + time) * 0.5 + 0.5,
            sin(progress * 6.28 + time + 2.094) * 0.5 + 0.5,
            sin(progress * 6.28 + time + 4.188) * 0.5 + 0.5
          );
          
          // Pulse effect
          float pulse = sin(time * 4.0 + progress * 8.0) * 0.3 + 0.7;
          vec3 finalColor = rainbow * pulse * 2.0;
          
          gl_FragColor = vec4(finalColor, 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
  }, []);
  
  // Resonance wave material
  const waveMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          vUv = uv;
          
          // Multiple wave frequencies
          float wave1 = sin(uv.x * 15.0 + time * 2.0) * 0.1;
          float wave2 = sin(uv.x * 8.0 - time * 1.5) * 0.05;
          vWave = wave1 + wave2;
          
          vec3 newPosition = position;
          newPosition.y += vWave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying float vWave;
        
        void main() {
          // Spectral colors following the wave
          vec3 spectrumColor = vec3(
            sin(vUv.x * 6.28 + time * 2.0) * 0.5 + 0.5,
            sin(vUv.x * 6.28 + time * 2.0 + 2.094) * 0.5 + 0.5,
            sin(vUv.x * 6.28 + time * 2.0 + 4.188) * 0.5 + 0.5
          );
          
          float intensity = abs(vWave) * 10.0 + 0.3;
          gl_FragColor = vec4(spectrumColor * intensity, intensity);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      wireframe: true
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive) return;
    
    const time = clock.getElapsedTime();
    
    if (arcRef.current) {
      arcRef.current.rotation.z = Math.sin(time * 0.5) * 0.2;
      arcRef.current.rotation.y = time * 0.1;
    }
    
    if (arcMaterial) {
      arcMaterial.uniforms.time.value = time;
    }
    
    if (waveMaterial) {
      waveMaterial.uniforms.time.value = time;
    }
  });
  
  return (
    <group ref={arcRef}>
      {/* Enhanced Rainbow Energy Arc */}
      <mesh material={arcMaterial}>
        <torusGeometry args={[3, 0.15, 16, 64, Math.PI]} />
      </mesh>
      
      {/* Secondary Arc Layer */}
      <mesh material={arcMaterial} scale={[1.1, 1.1, 1]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[3, 0.08, 16, 64, Math.PI]} />
      </mesh>
      
      {/* Resonance Wave Plane */}
      <mesh ref={waveRef} material={waveMaterial} rotation={[Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[8, 2, 64, 16]} />
      </mesh>
      
      {/* Energy Particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            Math.cos(i / 20 * Math.PI) * 3,
            Math.sin(i / 20 * Math.PI) * 3 + Math.sin(Date.now() * 0.001 + i) * 0.2,
            0
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial 
            color={new THREE.Color().setHSL((i / 20 + Date.now() * 0.0005) % 1, 1, 0.6)} 
            transparent 
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}