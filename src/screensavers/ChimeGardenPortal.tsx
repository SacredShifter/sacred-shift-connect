import React, { useRef, useMemo, useEffect, useState, useCallback } from 'react';
import { useFrame, useThree, Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion } from 'framer-motion';

interface ChimeGardenProps {
  isActive: boolean;
  onExit: () => void;
}

// Chakra-aligned frequencies and colors
const CHAKRA_FREQUENCIES = {
  root: { freq: 256, color: new THREE.Color(1, 0, 0) },      // Red
  sacral: { freq: 288, color: new THREE.Color(1, 0.5, 0) },  // Orange
  solar: { freq: 320, color: new THREE.Color(1, 1, 0) },     // Yellow
  heart: { freq: 341.3, color: new THREE.Color(0, 1, 0) },   // Green (639Hz / 1.87)
  throat: { freq: 384, color: new THREE.Color(0, 0.7, 1) },  // Blue (741Hz / 1.93)
  thirdEye: { freq: 426.7, color: new THREE.Color(0.3, 0, 0.8) }, // Indigo
  crown: { freq: 480, color: new THREE.Color(0.5, 0, 1) }    // Violet
};

// Bamboo Chime Component
const BambooChime: React.FC<{ 
  position: [number, number, number]; 
  chakra: keyof typeof CHAKRA_FREQUENCIES;
  isActive: boolean;
  timeOffset: number;
  onHover?: (chakra: keyof typeof CHAKRA_FREQUENCIES, frequency: number) => void;
  onHoverEnd?: () => void;
}> = ({ position, chakra, isActive, timeOffset, onHover, onHoverEnd }) => {
  const chimeRef = useRef<THREE.Group>(null);
  const chimeData = CHAKRA_FREQUENCIES[chakra];
  const [isHovered, setIsHovered] = useState(false);
  const [hoverIntensity, setHoverIntensity] = useState(0);
  
  // Chime geometry
  const chimeGeometry = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(0.05, 0.08, 1.5, 8);
    return geometry;
  }, []);
  
  // Chime material with resonance
  const chimeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        frequency: { value: chimeData.freq },
        color: { value: chimeData.color },
        resonance: { value: 0 },
        hoverIntensity: { value: 0 },
        isHovered: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        uniform float time;
        uniform float frequency;
        uniform float resonance;
        uniform float hoverIntensity;
        uniform float isHovered;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vResonance;
        varying float vHoverIntensity;
        
        void main() {
          vPosition = position;
          vNormal = normal;
          vResonance = resonance;
          vHoverIntensity = hoverIntensity;
          
          // Chime swinging motion
          float swing = sin(time * 2.0 + frequency * 0.01) * 0.3;
          float swingX = sin(time * 1.5 + frequency * 0.008) * 0.2;
          
          vec3 newPosition = position;
          newPosition.x += swingX;
          newPosition.z += swing;
          
          // Resonance vibration
          float vibration = sin(time * frequency * 0.1) * resonance * 0.1;
          
          // Hover effect - enhanced vibration and gentle lift
          float hoverLift = isHovered * 0.2;
          float hoverVibration = sin(time * frequency * 0.5) * hoverIntensity * 0.3;
          
          newPosition += normal * (vibration + hoverVibration);
          newPosition.y += hoverLift;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        uniform vec3 color;
        uniform float resonance;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vResonance;
        varying float vHoverIntensity;
        
        void main() {
          vec3 viewDirection = normalize(cameraPosition - vPosition);
          float fresnel = pow(1.0 - dot(viewDirection, vNormal), 2.0);
          
          // Resonance glow
          float glow = 1.0 + vResonance * 2.0;
          
          // Hover glow effect
          float hoverGlow = 1.0 + vHoverIntensity * 3.0;
          float hoverPulse = sin(time * 8.0) * vHoverIntensity * 0.5 + 1.0;
          
          vec3 finalColor = color * glow * hoverGlow * hoverPulse;
          
          // Add subtle bamboo texture
          float bamboo = sin(vPosition.y * 20.0) * 0.1 + 0.9;
          finalColor *= bamboo;
          
          // Enhanced alpha for hover
          float alpha = fresnel * 0.8 * (1.0 + vResonance) * (1.0 + vHoverIntensity * 0.5);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
  }, [chimeData]);
  
  // Hover interaction
  const handlePointerEnter = useCallback(() => {
    setIsHovered(true);
    if (onHover) {
      onHover(chakra, chimeData.freq);
    }
  }, [chakra, chimeData.freq, onHover]);

  const handlePointerLeave = useCallback(() => {
    setIsHovered(false);
    if (onHoverEnd) {
      onHoverEnd();
    }
  }, [onHoverEnd]);

  useFrame(({ clock }) => {
    if (!isActive || !chimeRef.current) return;
    
    const time = clock.getElapsedTime() + timeOffset;
    
    // Calculate resonance based on frequency
    const resonance = Math.sin(time * chimeData.freq * 0.01) * 0.5 + 0.5;
    
    // Hover intensity animation
    const targetHoverIntensity = isHovered ? 1.0 : 0.0;
    setHoverIntensity(prev => prev + (targetHoverIntensity - prev) * 0.1);
    
    // Update material uniforms
    chimeMaterial.uniforms.time.value = time;
    chimeMaterial.uniforms.resonance.value = resonance;
    chimeMaterial.uniforms.hoverIntensity.value = hoverIntensity;
    chimeMaterial.uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    
    // Enhanced swaying when hovered
    const swayMultiplier = isHovered ? 2.0 : 1.0;
    chimeRef.current.rotation.z = Math.sin(time * 0.8) * 0.1 * swayMultiplier;
    chimeRef.current.rotation.x = Math.sin(time * 0.6) * 0.05 * swayMultiplier;
  });
  
  return (
    <group ref={chimeRef} position={position}>
      <mesh 
        geometry={chimeGeometry} 
        material={chimeMaterial}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerOver={handlePointerEnter}
        onPointerOut={handlePointerLeave}
      />
      
      {/* Chime string */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.002, 0.002, 0.3]} />
        <meshBasicMaterial color={0x8B4513} />
      </mesh>
      
      {/* Hover indicator ring */}
      {isHovered && (
        <mesh position={[0, -0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 16]} />
          <meshBasicMaterial 
            color={chimeData.color} 
            transparent 
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
};

// Resonance Ripples Component
const ResonanceRipples: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const ripplesRef = useRef<THREE.Group>(null);
  
  const ripples = useMemo(() => {
    return Array.from({ length: 15 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 20,
        -1,
        (Math.random() - 0.5) * 20
      ] as [number, number, number],
      scale: 0.5 + Math.random() * 2,
      speed: 0.5 + Math.random() * 1.5,
      phase: Math.random() * Math.PI * 2,
      chakra: Object.keys(CHAKRA_FREQUENCIES)[Math.floor(Math.random() * 7)] as keyof typeof CHAKRA_FREQUENCIES
    }));
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !ripplesRef.current) return;
    
    const time = clock.getElapsedTime();
    
    ripplesRef.current.children.forEach((ripple, i) => {
      const rippleData = ripples[i];
      const chakraData = CHAKRA_FREQUENCIES[rippleData.chakra];
      
      // Ripple expansion
      const expansion = (time * rippleData.speed + rippleData.phase) % 4;
      const scale = expansion * rippleData.scale;
      
      ripple.scale.set(scale, 1, scale);
      
      // Fade out
      const opacity = 1 - (expansion / 4);
      if (ripple instanceof THREE.Mesh && ripple.material) {
        (ripple.material as THREE.Material).opacity = opacity;
      }
    });
  });
  
  return (
    <group ref={ripplesRef}>
      {ripples.map((ripple, i) => (
        <mesh key={i} position={ripple.position}>
          <ringGeometry args={[0.1, 0.2, 32]} />
          <meshBasicMaterial
            color={CHAKRA_FREQUENCIES[ripple.chakra].color}
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
};

// Fractal Lotus Blossoms Component
const FractalLotusBlossoms: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const lotusesRef = useRef<THREE.Group>(null);
  
  const lotuses = useMemo(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 25,
        -0.9,
        (Math.random() - 0.5) * 25
      ] as [number, number, number],
      scale: 0.3 + Math.random() * 0.7,
      speed: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      petals: 6 + Math.floor(Math.random() * 6)
    }));
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !lotusesRef.current) return;
    
    const time = clock.getElapsedTime();
    
    lotusesRef.current.children.forEach((lotus, i) => {
      const lotusData = lotuses[i];
      
      // Lotus blooming animation
      const bloom = Math.sin(time * lotusData.speed + lotusData.phase) * 0.5 + 0.5;
      const scale = lotusData.scale * (0.3 + bloom * 0.7);
      
      lotus.scale.set(scale, scale, scale);
      
      // Gentle rotation
      lotus.rotation.y = time * 0.2 + lotusData.phase;
      
      // Fade in/out
      const opacity = bloom * 0.8;
      if (lotus instanceof THREE.Mesh && lotus.material) {
        (lotus.material as THREE.Material).opacity = opacity;
      }
    });
  });
  
  return (
    <group ref={lotusesRef}>
      {lotuses.map((lotus, i) => (
        <group key={i} position={lotus.position}>
          {/* Lotus petals */}
          {Array.from({ length: lotus.petals }, (_, j) => (
            <mesh 
              key={j}
              rotation={[0, (j / lotus.petals) * Math.PI * 2, 0]}
              position={[0, 0, 0]}
            >
              <planeGeometry args={[0.3, 0.6]} />
              <meshBasicMaterial
                color={new THREE.Color().setHSL(0.8 + Math.random() * 0.2, 0.8, 0.6)}
                transparent
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

// Sacred Geometry Fireflies Component
const SacredGeometryFireflies: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const firefliesRef = useRef<THREE.Group>(null);
  
  const fireflies = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 30
      ] as [number, number, number],
      speed: 0.2 + Math.random() * 0.8,
      phase: Math.random() * Math.PI * 2,
      type: Math.floor(Math.random() * 3) // 0: tetrahedron, 1: fibonacci spiral, 2: torus
    }));
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !firefliesRef.current) return;
    
    const time = clock.getElapsedTime();
    
    firefliesRef.current.children.forEach((firefly, i) => {
      const fireflyData = fireflies[i];
      
      // Floating animation
      firefly.position.y += Math.sin(time * fireflyData.speed + fireflyData.phase) * 0.01;
      firefly.rotation.x = time * 0.5 + fireflyData.phase;
      firefly.rotation.y = time * 0.3 + fireflyData.phase;
      
      // Twinkling
      const twinkle = Math.sin(time * 3.0 + fireflyData.phase) * 0.3 + 0.7;
      firefly.scale.setScalar(twinkle);
      
      if (firefly instanceof THREE.Mesh && firefly.material) {
        (firefly.material as THREE.Material).opacity = twinkle * 0.8;
      }
    });
  });
  
  return (
    <group ref={firefliesRef}>
      {fireflies.map((firefly, i) => (
        <group key={i} position={firefly.position}>
          {firefly.type === 0 && (
            <mesh>
              <tetrahedronGeometry args={[0.1, 0]} />
              <meshBasicMaterial
                color={new THREE.Color().setHSL(0.6, 1, 0.7)}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}
          {firefly.type === 1 && (
            <mesh>
              <torusGeometry args={[0.05, 0.02, 8, 16]} />
              <meshBasicMaterial
                color={new THREE.Color().setHSL(0.8, 1, 0.7)}
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
              />
            </mesh>
          )}
          {firefly.type === 2 && (
            <mesh>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshBasicMaterial
                color={new THREE.Color().setHSL(0.9, 1, 0.7)}
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

// Cosmic Day Cycle Background
const CosmicDayCycle: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const backgroundRef = useRef<THREE.Mesh>(null);
  
  const backgroundMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        precision mediump float;
        varying vec2 vUv;
        
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision mediump float;
        uniform float time;
        varying vec2 vUv;
        
        void main() {
          // 24-minute cosmic day cycle
          float dayCycle = (time / 1440.0) % 1.0; // 1440 seconds = 24 minutes
          
          vec3 dawnColor = vec3(1.0, 0.5, 0.3);    // Dawn
          vec3 noonColor = vec3(1.0, 0.9, 0.4);    // Golden noon
          vec3 nightColor = vec3(0.1, 0.0, 0.3);   // Indigo night
          vec3 dreamColor = vec3(0.2, 0.1, 0.5);   // Starlit dream
          
          vec3 finalColor;
          if (dayCycle < 0.25) {
            // Dawn to noon
            float t = dayCycle / 0.25;
            finalColor = mix(dawnColor, noonColor, t);
          } else if (dayCycle < 0.5) {
            // Noon to night
            float t = (dayCycle - 0.25) / 0.25;
            finalColor = mix(noonColor, nightColor, t);
          } else if (dayCycle < 0.75) {
            // Night to dream
            float t = (dayCycle - 0.5) / 0.25;
            finalColor = mix(nightColor, dreamColor, t);
          } else {
            // Dream to dawn
            float t = (dayCycle - 0.75) / 0.25;
            finalColor = mix(dreamColor, dawnColor, t);
          }
          
          // Add stars in night/dream phases
          if (dayCycle > 0.4) {
            float stars = step(0.95, fract(vUv.x * 50.0)) * step(0.95, fract(vUv.y * 50.0));
            finalColor += stars * vec3(1.0, 1.0, 1.0) * 0.5;
          }
          
          gl_FragColor = vec4(finalColor, 1.0);
        }
      `,
      side: THREE.DoubleSide
    });
  }, []);
  
  useFrame(({ clock }) => {
    if (!isActive || !backgroundRef.current) return;
    
    const time = clock.getElapsedTime();
    backgroundMaterial.uniforms.time.value = time;
  });
  
  return (
    <mesh ref={backgroundRef} material={backgroundMaterial}>
      <planeGeometry args={[50, 50]} />
    </mesh>
  );
};

// Main Chime Garden Portal Component
export const ChimeGardenPortal: React.FC<ChimeGardenProps> = ({ 
  isActive, 
  onExit 
}) => {
  const [hoveredChime, setHoveredChime] = useState<keyof typeof CHAKRA_FREQUENCIES | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [oscillator, setOscillator] = useState<OscillatorNode | null>(null);
  
  const chimePositions = useMemo(() => {
    const positions: Array<[number, number, number]> = [];
    const chakras = Object.keys(CHAKRA_FREQUENCIES) as Array<keyof typeof CHAKRA_FREQUENCIES>;
    
    // Arrange chimes in a circle
    chakras.forEach((chakra, i) => {
      const angle = (i / chakras.length) * Math.PI * 2;
      const radius = 3;
      positions.push([
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      ]);
    });
    
    return positions;
  }, []);

  // Initialize audio context
  useEffect(() => {
    if (isActive && !audioContext) {
      try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }
  }, [isActive, audioContext]);

  // Handle chime hover with audio
  const handleChimeHover = useCallback((chakra: keyof typeof CHAKRA_FREQUENCIES, frequency: number) => {
    setHoveredChime(chakra);
    
    if (audioContext && audioContext.state === 'running') {
      // Stop previous oscillator
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
      
      // Create new oscillator for this chime
      const osc = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      osc.frequency.setValueAtTime(frequency, audioContext.currentTime);
      osc.type = 'sine';
      
      // Gentle volume with fade in
      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.3);
      
      osc.start();
      setOscillator(osc);
    }
  }, [audioContext, oscillator]);

  const handleChimeHoverEnd = useCallback(() => {
    setHoveredChime(null);
    
    if (oscillator) {
      // Fade out
      const gainNode = oscillator.context.createGain();
      oscillator.disconnect();
      oscillator.connect(gainNode);
      gainNode.connect(oscillator.context.destination);
      
      gainNode.gain.setValueAtTime(0.15, oscillator.context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, oscillator.context.currentTime + 0.5);
      
      setTimeout(() => {
        oscillator.stop();
        oscillator.disconnect();
        setOscillator(null);
      }, 500);
    }
  }, [oscillator]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (oscillator) {
        oscillator.stop();
        oscillator.disconnect();
      }
    };
  }, [oscillator]);
  
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
            The Sonic Grove
          </h1>
          <p className="text-xl md:text-2xl opacity-80 drop-shadow-lg mb-4">
            Chime Garden Portal
          </p>
          {hoveredChime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-sm rounded-lg p-4 max-w-md mx-auto"
            >
              <h3 className="text-lg font-bold text-white mb-2">
                {CHAKRA_FREQUENCIES[hoveredChime].freq}Hz - {hoveredChime.charAt(0).toUpperCase() + hoveredChime.slice(1)} Chakra
              </h3>
              <p className="text-sm text-white/80">
                Hover over different chimes to experience their sacred frequencies
              </p>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* 3D Scene */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 2, 8], fov: 60 }}
          dpr={[1, 2]}
          performance={{ min: 0.8 }}
        >
          <color args={['#000000']} />
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 5, 5]} intensity={0.8} color="#FFD700" />
          
          <CosmicDayCycle isActive={isActive} />
          <ResonanceRipples isActive={isActive} />
          <FractalLotusBlossoms isActive={isActive} />
          <SacredGeometryFireflies isActive={isActive} />
          
          {/* Bamboo Chimes */}
          {chimePositions.map((position, i) => {
            const chakras = Object.keys(CHAKRA_FREQUENCIES) as Array<keyof typeof CHAKRA_FREQUENCIES>;
            const chakra = chakras[i % chakras.length];
            return (
              <BambooChime
                key={i}
                position={position}
                chakra={chakra}
                isActive={isActive}
                timeOffset={i * 0.5}
                onHover={handleChimeHover}
                onHoverEnd={handleChimeHoverEnd}
              />
            );
          })}
          
          <EffectComposer>
            <Bloom
              luminanceThreshold={0.3}
              intensity={1.0}
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
