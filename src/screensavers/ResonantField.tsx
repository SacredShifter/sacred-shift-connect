import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { useSceneResize } from './useSceneResize';
import config from './config.json';

const SacredShifterLogo = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="logoGradient" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="hsl(280, 80%, 70%)" />
        <stop offset="100%" stopColor="hsl(320, 70%, 60%)" />
      </radialGradient>
      <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    
    <circle 
      cx="48" 
      cy="48" 
      r="44" 
      fill="none" 
      stroke="url(#logoGradient)" 
      strokeWidth="3"
      opacity="0.9"
      filter="url(#logoGlow)"
    />
    
    <g transform="translate(48,48)">
      <circle r="4" fill="url(#logoGradient)" />
      <circle r="12" fill="none" stroke="url(#logoGradient)" strokeWidth="2" opacity="0.7" />
      <circle r="20" fill="none" stroke="url(#logoGradient)" strokeWidth="1.5" opacity="0.5" />
      <circle r="28" fill="none" stroke="url(#logoGradient)" strokeWidth="1" opacity="0.4" />
      
      <polygon 
        points="0,-15 13,7.5 -13,7.5" 
        fill="none" 
        stroke="url(#logoGradient)" 
        strokeWidth="2" 
        opacity="0.8"
      />
      <polygon 
        points="0,15 -13,-7.5 13,-7.5" 
        fill="none" 
        stroke="url(#logoGradient)" 
        strokeWidth="2" 
        opacity="0.8"
      />
    </g>
    
    <circle 
      cx="48" 
      cy="48" 
      r="46" 
      fill="none" 
      stroke="url(#logoGradient)" 
      strokeWidth="1" 
      opacity="0.3"
    />
  </svg>
);

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
    
    let validParticles = 0;
    
    for (let i = 0; i < particleCount && validParticles < particleCount; i++) {
      // Generate position and check if it's outside safe area
      let x, y, z, distance;
      let attempts = 0;
      
      do {
        x = (Math.random() - 0.5) * 16;
        y = (Math.random() - 0.5) * 16;
        z = (Math.random() - 0.5) * 16;
        
        // Check distance from center in screen space
        distance = Math.sqrt(x * x + y * y) / 8; // Normalize to screen space
        attempts++;
      } while (distance < safeRadius && attempts < 50);
      
      // Only add particle if it's outside safe area
      if (distance >= safeRadius) {
        const i3 = validParticles * 3;
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        // Random brand color
        const colorIndex = Math.floor(Math.random() * brandColors.length);
        const baseColor = brandColors[colorIndex];
        
        colors[i3] = baseColor[0] + (Math.random() - 0.5) * 0.2;
        colors[i3 + 1] = baseColor[1] + (Math.random() - 0.5) * 0.2;
        colors[i3 + 2] = baseColor[2] + (Math.random() - 0.5) * 0.2;
        
        phases[validParticles] = Math.random() * Math.PI * 2;
        sizes[validParticles] = 12 + Math.random() * 8; // Smaller particles
        
        validParticles++;
      }
    }
    
    console.log(`Generated ${validParticles} particles outside safe radius ${safeRadius}`);
    
    return { 
      positions: positions.slice(0, validParticles * 3), 
      colors: colors.slice(0, validParticles * 3), 
      phases: phases.slice(0, validParticles), 
      sizes: sizes.slice(0, validParticles),
      count: validParticles
    };
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
  
  // Calculate safe area - MUCH LARGER with safety checks
  const safeRadius = useMemo(() => {
    if (!width || !height || width <= 0 || height <= 0) {
      console.warn('Invalid dimensions detected:', { width, height });
      return 0.4; // Fallback value
    }
    const calculated = Math.min(width, height) * 0.4;
    console.log('SafeRadius calculated:', calculated, 'from dimensions:', { width, height });
    return calculated;
  }, [width, height]);
  
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
        <Scene safeRadius={safeRadius} particleCount={Math.min(particleCount, 800)} />
      </Canvas>
      
      {/* Logo Overlay - MAXIMUM PROMINENCE */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center z-[99999]" 
           style={{ 
             background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 25%, transparent 40%)',
           }}>
        <div className="text-center px-6 relative">
          {/* MASSIVE Logo with extreme contrast */}
          <div className="mx-auto w-64 h-64 mb-12 relative">
            {/* Multiple shadow layers for maximum contrast */}
            <div className="absolute inset-0 rounded-full bg-black blur-3xl scale-150 opacity-80" />
            <div className="absolute inset-0 rounded-full bg-black blur-2xl scale-125 opacity-60" />
            <div className="absolute inset-0 rounded-full bg-black blur-xl scale-110 opacity-40" />
            
            {/* Bright white background for logo */}
            <div className="absolute inset-0 rounded-full bg-white/20 blur-lg" />
            
            {/* Logo with maximum brightness and contrast */}
            <SacredShifterLogo 
              className="relative z-20 w-full h-full" 
              style={{ 
                filter: 'brightness(2) contrast(2) drop-shadow(0 0 40px rgba(255,255,255,0.8)) drop-shadow(0 0 80px rgba(255,255,255,0.4))',
              }} 
            />
            
            {/* Animated glow ring */}
            <div className="absolute inset-0 rounded-full border-4 border-white/60 animate-pulse scale-105" 
                 style={{
                   boxShadow: '0 0 60px rgba(255,255,255,0.6), inset 0 0 60px rgba(255,255,255,0.2)'
                 }} />
          </div>
          
          {/* MASSIVE tagline with extreme contrast */}
          <div className="relative">
            {/* Multiple text shadow layers */}
            <div className="absolute inset-0 bg-black/70 blur-2xl rounded-2xl scale-110" />
            
            <h1 className="relative text-4xl md:text-6xl font-bold text-white max-w-[54ch] mx-auto leading-tight" 
               style={{ 
                 textShadow: `
                   0 0 30px rgba(0,0,0,1),
                   0 0 60px rgba(0,0,0,0.8),
                   0 0 90px rgba(0,0,0,0.6),
                   0 8px 16px rgba(0,0,0,1),
                   0 0 20px rgba(255,255,255,0.3)
                 `,
                 filter: 'brightness(1.5) contrast(1.5)'
               }}>
              {tagline}
            </h1>
          </div>
        </div>
      </div>
      
      {/* Subtle hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <p className="text-sm text-white/60">Touch or move to return</p>
      </div>
    </div>
  );
};