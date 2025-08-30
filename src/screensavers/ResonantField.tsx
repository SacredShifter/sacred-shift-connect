import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSceneResize } from './useSceneResize';
import config from './config.json';

interface ResonantFieldProps {
  tagline?: string;
  safeRadiusScale?: number;
  onExit?: () => void;
}

interface ParticleSystemProps {
  safeRadius: number;
  particleCount: number;
  exposure: number;
  lumaCap: number;
}

// Device performance detection
const getDeviceTier = () => {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
  
  if (!gl) return 'low';
  
  const renderer = gl.getParameter(gl.RENDERER) as string;
  const vendor = gl.getParameter(gl.VENDOR) as string;
  
  // Simple heuristic based on GPU renderer string
  if (renderer.includes('Mali') || renderer.includes('Adreno') || renderer.includes('PowerVR')) {
    return 'mobile';
  }
  
  const memory = (navigator as any).deviceMemory || 4;
  return memory >= 8 ? 'high' : 'medium';
};

const ParticleSystem: React.FC<ParticleSystemProps> = ({ 
  safeRadius, 
  particleCount, 
  exposure, 
  lumaCap 
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport, size } = useThree();
  
  // Generate particle data
  const particleData = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const phases = new Float32Array(particleCount);
    const sizes = new Float32Array(particleCount);
    
    const brandColors = [
      [0.6, 0.2, 1.0], // Violet
      [1.0, 0.8, 0.2], // Gold  
      [0.2, 1.0, 0.8], // Aquamarine
      [0.8, 0.3, 0.9], // Purple
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Generate position outside safe area
      let x, y, z, distance;
      do {
        x = (Math.random() - 0.5) * 20;
        y = (Math.random() - 0.5) * 20;
        z = (Math.random() - 0.5) * 20;
        
        // Convert to NDC for safe area check
        const ndcX = x / 10;
        const ndcY = y / 10;
        distance = Math.sqrt(ndcX * ndcX + ndcY * ndcY);
      } while (distance < safeRadius);
      
      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;
      
      // Random brand color
      const colorIndex = Math.floor(Math.random() * brandColors.length);
      const baseColor = brandColors[colorIndex];
      
      colors[i3] = baseColor[0] + (Math.random() - 0.5) * 0.2;
      colors[i3 + 1] = baseColor[1] + (Math.random() - 0.5) * 0.2;
      colors[i3 + 2] = baseColor[2] + (Math.random() - 0.5) * 0.2;
      
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i] = 8 + Math.random() * 18; // 8-26px range
    }
    
    return { positions, colors, phases, sizes };
  }, [particleCount, safeRadius]);
  
  // Custom shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSafeRadius: { value: safeRadius },
        uCenter: { value: new THREE.Vector2(0, 0) },
        uLumaCap: { value: lumaCap },
        uExposure: { value: exposure },
        uBloomThreshold: { value: config.bloomThreshold },
        uResolution: { value: new THREE.Vector2(size.width, size.height) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSafeRadius;
        uniform vec2 uCenter;
        uniform vec2 uResolution;
        
        attribute float phase;
        attribute float size;
        
        varying vec3 vColor;
        varying float vAlpha;
        varying vec2 vNdc;
        
        void main() {
          vColor = color;
          
          // Animate position
          vec3 pos = position;
          pos.x += sin(uTime * 0.5 + phase) * 0.5;
          pos.y += cos(uTime * 0.7 + phase * 1.2) * 0.3;
          pos.z += sin(uTime * 0.3 + phase * 0.8) * 0.4;
          
          // Calculate NDC for safe area check
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vec4 projected = projectionMatrix * mvPosition;
          vNdc = projected.xy / projected.w;
          
          // Safe area masking with soft falloff
          float distanceFromCenter = length(vNdc);
          float falloffStart = uSafeRadius;
          float falloffEnd = uSafeRadius + 0.06;
          
          vAlpha = 1.0;
          if (distanceFromCenter < falloffEnd) {
            if (distanceFromCenter < falloffStart) {
              vAlpha = 0.0; // Fully hidden in safe area
            } else {
              // Soft falloff
              vAlpha = smoothstep(falloffStart, falloffEnd, distanceFromCenter);
            }
          }
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projected;
        }
      `,
      fragmentShader: `
        uniform float uLumaCap;
        uniform float uExposure;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          // Circular point sprite
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          // Fresnel-like rim effect
          float rim = 1.0 - r * 2.0;
          rim = pow(rim, 2.0);
          
          // Soft glow
          float glow = exp(-r * 3.0);
          
          vec3 finalColor = vColor * rim * uExposure;
          finalColor = min(finalColor, vec3(uLumaCap)); // Luminance clamp
          
          float alpha = glow * rim * vAlpha * 0.8;
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, [safeRadius, lumaCap, exposure, size]);
  
  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    
    material.uniforms.uTime.value = clock.getElapsedTime();
    material.uniforms.uResolution.value.set(size.width, size.height);
    
    // Gentle camera orbit (respects reduced motion)
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotion) {
      const time = clock.getElapsedTime();
      meshRef.current.rotation.y = Math.sin(time * 0.1) * 0.02;
      meshRef.current.rotation.x = Math.cos(time * 0.15) * 0.01;
    }
  });
  
  return (
    <points ref={meshRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particleCount}
          array={particleData.positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleCount}
          array={particleData.colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-phase"
          count={particleCount}
          array={particleData.phases}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-size"
          count={particleCount}
          array={particleData.sizes}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  );
};

const Scene: React.FC<{ safeRadius: number; particleCount: number }> = ({ 
  safeRadius, 
  particleCount 
}) => {
  const [exposure, setExposure] = useState(1.0);
  const [lumaCap] = useState(config.lumaCap);
  
  // Light governor - monitor and adjust exposure
  useFrame(() => {
    // Simplified luminance monitoring
    // In a real implementation, this would sample the render target
    const targetExposure = 1.0;
    setExposure(prev => {
      if (prev > targetExposure) {
        return prev * 0.96;
      } else if (prev < targetExposure * 0.8) {
        return prev * 1.01;
      }
      return prev;
    });
  });
  
  return (
    <>
      <color attach="background" args={['#0a0f1c']} />
      
      {/* Background gradient effect */}
      <ambientLight intensity={0.1} />
      
      <ParticleSystem 
        safeRadius={safeRadius}
        particleCount={particleCount}
        exposure={exposure}
        lumaCap={lumaCap}
      />
      
      <EffectComposer>
        <Bloom
          luminanceThreshold={config.bloomThreshold}
          intensity={0.6}
        />
      </EffectComposer>
    </>
  );
};

export const ResonantField: React.FC<ResonantFieldProps> = ({
  tagline = "The resonance field for awakening",
  safeRadiusScale = config.safeRadiusScale,
  onExit
}) => {
  const { width, height } = useSceneResize();
  const [showFallback, setShowFallback] = useState(false);
  
  // Calculate safe area
  const safeRadius = Math.min(width, height) * safeRadiusScale;
  
  // Device-responsive particle count
  const particleCount = useMemo(() => {
    const tier = getDeviceTier();
    switch (tier) {
      case 'high': return config.particleCountDesktop;
      case 'medium': return Math.floor(config.particleCountDesktop * 0.7);
      case 'mobile': 
      case 'low': 
      default: return config.particleCountMobile;
    }
  }, []);
  
  // Keyboard exit handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onExit?.();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);
  
  // WebGL fallback detection
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) {
      setShowFallback(true);
    }
  }, []);
  
  if (showFallback) {
    // Canvas2D fallback would go here
    return (
      <div className="fixed inset-0 bg-gradient-radial from-purple-900/20 via-teal-900/10 to-black">
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <div className="text-center px-6">
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary to-secondary animate-pulse" />
            <p className="mt-4 text-balance text-lg md:text-xl text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,.55)]">
              {tagline}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      className="fixed inset-0 cursor-pointer"
      onClick={onExit}
      onTouchStart={onExit}
    >
      {/* WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        performance={{ min: 0.8 }}
      >
        <Scene safeRadius={safeRadius / Math.min(width, height)} particleCount={particleCount} />
      </Canvas>
      
      {/* Logo Overlay */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="text-center px-6">
          {/* Logo placeholder - would use actual SVG */}
          <div className="mx-auto h-24 w-auto flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-2xl font-bold text-white">SS</span>
            </div>
          </div>
          <p className="mt-4 text-balance text-lg md:text-xl text-white/90 drop-shadow-[0_1px_8px_rgba(0,0,0,.55)] max-w-[54ch]">
            {tagline}
          </p>
        </div>
      </div>
      
      {/* Subtle hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-sm text-white/60">Touch or move to return</p>
      </div>
    </div>
  );
};