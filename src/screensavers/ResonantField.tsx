import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { useSceneResize } from './useSceneResize';
import config from './config.json';
import sacredShifterLogo from '@/assets/sacred-shifter-logo.png';
import { useScreensaverMessages } from '@/hooks/useScreensaverMessages';

interface ResonantFieldProps {
  tagline?: string;
  safeRadiusScale?: number;
  onExit: () => void;
}

interface ParticleSystemProps {
  safeRadius: number;
  particleCount: number;
  exposure: number;
  lumaCap: number;
}

interface CosmicGridProps {
  safeRadius: number;
}

interface EthericBubblesProps {
  safeRadius: number;
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
  
  // Check device memory if available
  const deviceMemory = (navigator as any).deviceMemory;
  if (deviceMemory && deviceMemory < 4) {
    return 'low';
  }
  
  return 'high';
};

// Cosmic Grid Background
const CosmicGrid: React.FC<CosmicGridProps> = ({ safeRadius }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const gridMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSafeRadius: { value: safeRadius },
        uGridScale: { value: 2.0 },
        uOpacity: { value: 0.3 }
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        void main() {
          vUv = uv;
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uSafeRadius;
        uniform float uGridScale;
        uniform float uOpacity;
        
        varying vec2 vUv;
        varying vec3 vWorldPosition;
        
        float grid(vec2 st, float res) {
          vec2 grid = fract(st * res);
          return (step(res * 0.02, grid.x) * step(res * 0.02, grid.y));
        }
        
        void main() {
          vec2 st = vUv * uGridScale;
          
          // Animated grid
          st += sin(uTime * 0.1) * 0.1;
          
          // Create grid pattern
          float pattern = 1.0 - grid(st, 10.0);
          
          // Dracula purple/pink theme
          vec3 color1 = vec3(0.741, 0.576, 0.976); // #BD93F9 (Dracula purple)
          vec3 color2 = vec3(1.0, 0.471, 0.776);   // #FF79C6 (Dracula pink)
          
          vec3 finalColor = mix(color1, color2, sin(uTime * 0.2 + vUv.x * 2.0) * 0.5 + 0.5);
          
          // Distance fade from center
          float distFromCenter = length(vUv - 0.5) * 2.0;
          float safeFade = smoothstep(uSafeRadius - 0.1, uSafeRadius + 0.2, distFromCenter);
          
          gl_FragColor = vec4(finalColor * pattern, uOpacity * safeFade * pattern);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide
    });
  }, [safeRadius]);
  
  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = clock.getElapsedTime();
    }
  });
  
  return (
    <mesh ref={meshRef} position={[0, 0, -5]} material={gridMaterial}>
      <planeGeometry args={[50, 50]} />
    </mesh>
  );
};

// Etheric Bubble System
const EthericBubbles: React.FC<EthericBubblesProps> = ({ safeRadius }) => {
  const groupRef = useRef<THREE.Group>(null);
  const bubblesRef = useRef<THREE.Mesh[]>([]);
  
  const bubbleCount = 15;
  
  const bubbles = useMemo(() => {
    return Array.from({ length: bubbleCount }, (_, i) => {
      const angle = (i / bubbleCount) * Math.PI * 2;
      const radius = 8 + Math.random() * 10;
      const y = (Math.random() - 0.5) * 16;
      
      return {
        position: [
          Math.cos(angle) * radius,
          y,
          Math.sin(angle) * radius
        ] as [number, number, number],
        scale: 0.5 + Math.random() * 1.5,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2
      };
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      
      bubblesRef.current.forEach((bubble, i) => {
        if (bubble) {
          const bubbleData = bubbles[i];
          // Floating animation
          bubble.position.y += Math.sin(time * bubbleData.speed + bubbleData.phase) * 0.01;
          // Gentle rotation
          bubble.rotation.x = time * 0.1 + bubbleData.phase;
          bubble.rotation.y = time * 0.15 + bubbleData.phase;
          // Breathing scale
          const breathe = 1 + Math.sin(time * 0.8 + bubbleData.phase) * 0.1;
          bubble.scale.setScalar(bubbleData.scale * breathe);
        }
      });
    }
  });
  
  return (
    <group ref={groupRef}>
      {bubbles.map((bubble, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) bubblesRef.current[i] = el;
          }}
          position={bubble.position}
        >
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#50FA7B" // Dracula green
            transparent
            opacity={0.15}
            wireframe
          />
        </mesh>
      ))}
    </group>
  );
};

// Fractal Particle System
const FractalParticleSystem: React.FC<ParticleSystemProps> = ({ 
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
    
    // Dracula color palette
    const draculaColors = [
      [0.741, 0.576, 0.976], // Purple #BD93F9
      [1.0, 0.471, 0.776],   // Pink #FF79C6  
      [0.314, 0.980, 0.482], // Green #50FA7B
      [1.0, 0.733, 0.157],   // Yellow #F1FA8C
      [0.518, 0.886, 1.0],   // Cyan #8BE9FD
    ];
    
    let validParticles = 0;
    
    for (let i = 0; i < particleCount; i++) {
      let x, y, z, distance;
      let attempts = 0;
      
      do {
        // Create fractal distribution
        const r = Math.pow(Math.random(), 0.5) * 20;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        x = r * Math.sin(phi) * Math.cos(theta);
        y = r * Math.sin(phi) * Math.sin(theta);
        z = r * Math.cos(phi);
        
        // Add fractal noise
        x += (Math.random() - 0.5) * 4;
        y += (Math.random() - 0.5) * 4;
        z += (Math.random() - 0.5) * 4;
        
        distance = Math.sqrt(x * x + y * y) / 8;
        attempts++;
      } while (distance < safeRadius && attempts < 50);
      
      if (distance >= safeRadius || validParticles < 10) {
        const i3 = validParticles * 3;
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        // Dracula color selection
        const colorIndex = Math.floor(Math.random() * draculaColors.length);
        const baseColor = draculaColors[colorIndex];
        
        colors[i3] = baseColor[0];
        colors[i3 + 1] = baseColor[1];
        colors[i3 + 2] = baseColor[2];
        
        phases[validParticles] = Math.random() * Math.PI * 2;
        sizes[validParticles] = 8 + Math.random() * 12;
        
        validParticles++;
      }
    }
    
    return { 
      positions: new Float32Array(positions.buffer.slice(0, validParticles * 3 * 4)), 
      colors: new Float32Array(colors.buffer.slice(0, validParticles * 3 * 4)), 
      phases: new Float32Array(phases.buffer.slice(0, validParticles * 4)), 
      sizes: new Float32Array(sizes.buffer.slice(0, validParticles * 4)),
      count: validParticles
    };
  }, [particleCount, safeRadius]);
  
  // Fractal shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uExposure: { value: exposure },
        uLumaCap: { value: lumaCap }
      },
      vertexShader: `
        attribute float phase;
        attribute float size;
        
        uniform float uTime;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Fractal motion
          pos.x += sin(uTime * 0.5 + phase) * 2.0;
          pos.y += cos(uTime * 0.3 + phase * 1.5) * 1.5;
          pos.z += sin(uTime * 0.7 + phase * 0.8) * 1.0;
          
          // Etheric floating
          pos += sin(uTime * 0.2 + phase) * 0.5;
          
          vAlpha = 0.6 + sin(uTime * 2.0 + phase) * 0.3;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uExposure;
        uniform float uLumaCap;
        
        varying vec3 vColor;
        varying float vAlpha;
        
        void main() {
          float r = length(gl_PointCoord - vec2(0.5));
          if (r > 0.5) discard;
          
          float alpha = (1.0 - r * 2.0) * vAlpha;
          
          vec3 finalColor = vColor * uExposure;
          finalColor = min(finalColor, vec3(uLumaCap));
          
          gl_FragColor = vec4(finalColor, alpha * 0.8);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });
  }, [exposure, lumaCap]);
  
  useFrame(({ clock }) => {
    if (meshRef.current && material) {
      material.uniforms.uTime.value = clock.getElapsedTime();
      material.uniforms.uExposure.value = exposure;
    }
  });
  
  return (
    <points 
      ref={meshRef} 
      material={material}
      geometry={useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(particleData.colors, 3));
        geo.setAttribute('phase', new THREE.BufferAttribute(particleData.phases, 1));
        geo.setAttribute('size', new THREE.BufferAttribute(particleData.sizes, 1));
        return geo;
      }, [particleData.positions, particleData.colors, particleData.phases, particleData.sizes])}
    />
  );
};

// Main Scene Component
const Scene: React.FC<{ safeRadius: number; particleCount: number }> = ({ 
  safeRadius, 
  particleCount 
}) => {
  const [exposure, setExposure] = useState(1.0);
  const [lumaCap] = useState(config.lumaCap);
  
  // Light governor
  useFrame(() => {
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
      <color args={['#282A36']} /> {/* Dracula background */}      
      <ambientLight intensity={0.1} />
      
      <CosmicGrid safeRadius={safeRadius} />
      <EthericBubbles safeRadius={safeRadius} />
      <FractalParticleSystem 
        safeRadius={safeRadius}
        particleCount={particleCount}
        exposure={exposure}
        lumaCap={lumaCap}
      />
      
      <EffectComposer>
        <Bloom
          luminanceThreshold={config.bloomThreshold}
          intensity={0.8}
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
  
  // Sacred rotating messages
  const { currentMessage, isVisible } = useScreensaverMessages({
    isActive: true,
    rotationInterval: 12000, // 12 seconds between messages
    preventRepeats: 4
  });
  
  // Calculate safe area with generous padding
  const safeRadius = useMemo(() => {
    const minDimension = Math.min(width, height);
    const calculatedRadius = (minDimension * safeRadiusScale) / Math.min(width, height);
    return Math.max(0.15, Math.min(0.4, calculatedRadius));
  }, [width, height, safeRadiusScale]);
  
  // Dynamic particle count based on device performance
  const particleCount = useMemo(() => {
    const deviceTier = getDeviceTier();
    const baseCount = {
      'low': 150,
      'mobile': 300,
      'high': 600
    }[deviceTier];
    
    // Adjust based on screen size
    const screenMultiplier = Math.max(0.5, Math.min(2.0, (width * height) / (1920 * 1080)));
    return Math.floor(baseCount * screenMultiplier);
  }, [width, height]);
  
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
  
  // WebGL fallback detection
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;
    if (!gl) {
      setShowFallback(true);
    }
  }, []);
  
  if (showFallback) {
    return (
      <motion.div 
        className="fixed inset-0"
        style={{ background: 'linear-gradient(135deg, #282A36 0%, #44475A 50%, #282A36 100%)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.0 }}
      >
        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <motion.div 
            className="text-center px-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 animate-pulse mb-8" />
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
              {tagline}
            </h1>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div 
      className="fixed inset-0 cursor-pointer"
      onClick={onExit}
      onTouchStart={onExit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2 }}
    >
      {/* WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        dpr={[1, 2]}
        performance={{ min: 0.8 }}
      >
        <Scene safeRadius={safeRadius} particleCount={particleCount} />
      </Canvas>
      
      {/* SACRED SHIFTER LOGO - CLEAN AND SIMPLE */}
      <div 
        className="pointer-events-none fixed inset-0 z-[999999]" 
        style={{ 
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 70%, rgba(0,0,0,0.9) 100%)',
          backdropFilter: 'blur(1px)'
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            className="text-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1.0 }}
          >
            {/* CLEAN LOGO - NO SPINNING */}
            <motion.div 
              className="mx-auto mb-12"
              style={{ width: '300px', height: '300px' }}
              animate={{ 
                scale: [0.98, 1.02, 0.98]
              }}
              transition={{ 
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <div 
                className="w-full h-full bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl flex items-center justify-center border border-white/20"
                style={{
                  boxShadow: `
                    0 0 60px rgba(255, 255, 255, 0.3),
                    0 0 120px rgba(189, 147, 249, 0.2),
                    inset 0 0 60px rgba(255, 255, 255, 0.1)
                  `
                }}
              >
                <img 
                  src={sacredShifterLogo}
                  alt="Sacred Shifter Logo"
                  className="w-4/5 h-4/5 object-contain"
                  style={{ 
                    filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.5))'
                  }}
                />
              </div>
            </motion.div>
            
            {/* CLEAN TAGLINE + ROTATING MESSAGES */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1.0 }}
              className="space-y-6"
            >
              {/* Static Tagline */}
              <p 
                className="text-2xl md:text-3xl text-white/90 font-codex italic"
                style={{
                  textShadow: `
                    0 0 20px rgba(0, 0, 0, 1),
                    0 4px 16px rgba(0, 0, 0, 1),
                    0 0 20px rgba(255, 255, 255, 0.3)
                  `
                }}
              >
                {tagline}
              </p>

              {/* Rotating Sacred Messages */}
              <div className="min-h-[80px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {currentMessage && isVisible && (
                    <motion.div
                      key={currentMessage.id}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      transition={{ 
                        duration: 0.6,
                        ease: "easeInOut"
                      }}
                      className="text-center max-w-2xl"
                    >
                      <p 
                        className="text-lg md:text-xl text-white/80 font-codex leading-relaxed"
                        style={{
                          textShadow: `
                            0 0 15px rgba(0, 0, 0, 1),
                            0 2px 8px rgba(0, 0, 0, 1),
                            0 0 25px rgba(189, 147, 249, 0.4)
                          `
                        }}
                      >
                        {currentMessage.text}
                      </p>
                      
                      {/* Subtle category indicator */}
                      <div className="mt-3 opacity-60">
                        <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white/50 to-transparent mx-auto" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Subtle hint */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
      >
        <p className="text-sm text-white/60 text-center">Touch or press ESC to return</p>
      </motion.div>
    </motion.div>
  );
};