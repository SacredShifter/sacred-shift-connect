import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Heart, Sparkles, Brain, Moon, Sun, Waves, Eye, Infinity, Zap } from 'lucide-react';
import { useUnifiedBreathing } from '@/hooks/useUnifiedBreathing';
import { useFrequencyTool } from '@/hooks/useFrequencyTool';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface MeditationVisualsProps {
  type: MeditationType;
  isActive?: boolean;
}

// Sacred Geometry & Mathematical Patterns
const SacredGeometry = ({ isActive, type }: { isActive: boolean; type: string }) => {
  const time = useMotionValue(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      time.set(time.get() + 0.01);
    }, 16);
    return () => clearInterval(interval);
  }, [isActive, time]);

  // Flower of Life pattern
  const FlowerOfLife = () => (
    <motion.svg
      className="absolute inset-0 w-full h-full opacity-20"
      viewBox="0 0 400 400"
      animate={isActive ? { rotate: [0, 360] } : {}}
      transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
    >
      {Array.from({ length: 19 }).map((_, i) => {
        const angle = (i / 19) * Math.PI * 2;
        const radius = 60;
        const cx = 200 + Math.cos(angle) * radius;
        const cy = 200 + Math.sin(angle) * radius;
        
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r="40"
            fill="none"
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="1"
            animate={isActive ? {
              r: [35, 45, 35],
              opacity: [0.2, 0.6, 0.2]
            } : {}}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </motion.svg>
  );

  // Metatron's Cube
  const MetatronsCube = () => (
    <motion.svg
      className="absolute inset-0 w-full h-full opacity-15"
      viewBox="0 0 400 400"
      animate={isActive ? { rotate: [360, 0] } : {}}
      transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
    >
      {/* Complex geometric interconnections */}
      {Array.from({ length: 13 }).map((_, i) => {
        const positions = [
          [200, 200], [150, 150], [250, 150], [150, 250], [250, 250],
          [100, 200], [300, 200], [200, 100], [200, 300],
          [120, 120], [280, 120], [120, 280], [280, 280]
        ];
        const [x, y] = positions[i] || [200, 200];
        
        return (
          <g key={i}>
            <motion.circle
              cx={x}
              cy={y}
              r="8"
              fill="rgba(255, 255, 255, 0.4)"
              animate={isActive ? {
                r: [6, 12, 6],
                opacity: [0.3, 0.8, 0.3]
              } : {}}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
            {/* Connecting lines */}
            {positions.slice(i + 1).map((pos, j) => (
              <motion.line
                key={`${i}-${j}`}
                x1={x}
                y1={y}
                x2={pos[0]}
                y2={pos[1]}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="0.5"
                animate={isActive ? {
                  opacity: [0, 0.4, 0]
                } : {}}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  delay: (i + j) * 0.1
                }}
              />
            ))}
          </g>
        );
      })}
    </motion.svg>
  );

  return (
    <>
      <FlowerOfLife />
      <MetatronsCube />
    </>
  );
};

// Infinite Fractal Zoom Component
const FractalZoom = ({ isActive, intensity }: { isActive: boolean; intensity: number }) => {
  const scale = useMotionValue(1);
  const rotate = useMotionValue(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      scale.set(scale.get() * 1.001);
      rotate.set(rotate.get() + 0.1);
      if (scale.get() > 2) scale.set(0.5);
    }, 16);
    return () => clearInterval(interval);
  }, [isActive, scale, rotate]);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      style={{ scale, rotate }}
    >
      {Array.from({ length: 8 }).map((_, depth) => (
        <motion.div
          key={depth}
          className="absolute inset-0 border border-white/10 rounded-full"
          style={{
            width: `${100 + depth * 50}%`,
            height: `${100 + depth * 50}%`,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={isActive ? {
            scale: [1, 0.1, 1],
            opacity: [0, 0.5, 0],
            rotate: [0, 360]
          } : {}}
          transition={{
            duration: 20 + depth * 5,
            repeat: Infinity,
            delay: depth * 2,
            ease: "easeInOut"
          }}
        />
      ))}
    </motion.div>
  );
};

// Advanced Particle System
const QuantumParticleField = ({ isActive, type }: { isActive: boolean; type: string }) => {
  const particleCount = type === 'breathing' ? 200 : type === 'chakra' ? 300 : 150;
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: particleCount }).map((_, i) => {
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        const flowType = Math.floor(Math.random() * 3);
        
        let flowPath;
        switch (flowType) {
          case 0: // Spiral flow
            flowPath = {
              x: [startX, window.innerWidth / 2, startX],
              y: [startY, window.innerHeight / 2, startY]
            };
            break;
          case 1: // Figure-8 flow
            flowPath = {
              x: [startX, startX + 200, startX - 200, startX],
              y: [startY, startY - 100, startY + 100, startY]
            };
            break;
          default: // Organic flow
            flowPath = {
              x: [startX, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [startY, Math.random() * window.innerHeight, Math.random() * window.innerHeight]
            };
        }
        
        return (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: type === 'breathing' ? 'rgba(52, 211, 153, 0.6)' :
                         type === 'loving-kindness' ? 'rgba(236, 72, 153, 0.6)' :
                         type === 'chakra' ? 'rgba(139, 92, 246, 0.6)' :
                         type === 'mindfulness' ? 'rgba(103, 232, 249, 0.6)' :
                         'rgba(196, 181, 253, 0.6)'
            }}
            animate={isActive ? {
              ...flowPath,
              scale: [0.5, 2, 0.5],
              opacity: [0, 0.8, 0]
            } : {}}
            transition={{
              duration: 12 + Math.random() * 8,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
            initial={{
              x: startX,
              y: startY
            }}
          />
        );
      })}
    </div>
  );
};

// Aurora Wave Effects
const AuroraWaves = ({ isActive, colors }: { isActive: boolean; colors: string[] }) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute inset-0"
          style={{
            background: `linear-gradient(${45 + i * 30}deg, ${colors[0]}22, ${colors[1]}11, ${colors[2]}22)`,
            filter: 'blur(20px)'
          }}
          animate={isActive ? {
            x: [-200, 200, -200],
            y: [-100, 100, -100],
            opacity: [0.3, 0.7, 0.3],
            scale: [1, 1.2, 1]
          } : {}}
          transition={{
            duration: 20 + i * 5,
            repeat: Infinity,
            delay: i * 3,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

// Holographic Overlays
const HolographicGrid = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Holographic grid lines */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <pattern id="holo-grid" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            <motion.path
              d="M 100 0 L 0 0 0 100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="0.5"
              animate={isActive ? {
                opacity: [0.1, 0.3, 0.1]
              } : {}}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#holo-grid)" />
      </svg>
      
      {/* Holographic scanlines */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"
        style={{ height: '4px' }}
        animate={isActive ? {
          y: [0, window.innerHeight, 0]
        } : {}}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
};

// Enhanced Breathing Meditation with all advanced features
function BreathingVisual({ isActive }: { isActive?: boolean }) {
  const breathingState = useUnifiedBreathing();
  const { selectedFrequency, isPlaying } = useFrequencyTool();
  const [sessionTime, setSessionTime] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  // Progressive complexity based on session time
  const complexityLevel = Math.min(Math.floor(sessionTime / 30), 5);
  const colors = ['#10b981', '#06b6d4', '#3b82f6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950">
      {/* Aurora background effects */}
      <AuroraWaves isActive={isActive || false} colors={colors} />
      
      {/* Quantum particle field */}
      <QuantumParticleField isActive={isActive || false} type="breathing" />
      
      {/* Sacred geometry overlays */}
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} type="breathing" />}
      
      {/* Fractal zoom effect */}
      {complexityLevel >= 2 && <FractalZoom isActive={isActive || false} intensity={complexityLevel} />}
      
      {/* Holographic grid */}
      {complexityLevel >= 3 && <HolographicGrid isActive={isActive || false} />}

      {/* Central Consciousness Portal */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer dimensional rings */}
        {Array.from({ length: 7 }).map((_, ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border"
            style={{
              width: `${200 + ring * 80}px`,
              height: `${200 + ring * 80}px`,
              borderColor: `rgba(52, 211, 153, ${0.4 - ring * 0.05})`,
              borderWidth: '1px',
              filter: 'blur(0.5px)'
            }}
            animate={isActive ? {
              scale: [0.9, 1.3, 0.9],
              opacity: [0.2, 0.6, 0.2],
              rotate: ring % 2 === 0 ? [0, 360] : [360, 0]
            } : {}}
            transition={{
              duration: 12 + ring * 2,
              repeat: Infinity,
              delay: ring * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Central Merkaba */}
        <motion.div
          className="relative w-60 h-60 rounded-full flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(52, 211, 153, 0.8), rgba(6, 182, 212, 0.6), rgba(59, 130, 246, 0.8), rgba(52, 211, 153, 0.8))',
            filter: 'blur(1px)'
          }}
          animate={isActive ? {
            scale: breathingState.isActive ? [0.8, 1.4, 0.8] : [1, 1.1, 1],
            rotate: [0, 360],
            boxShadow: [
              '0 0 60px rgba(52, 211, 153, 0.6)',
              '0 0 120px rgba(52, 211, 153, 0.9)',
              '0 0 60px rgba(52, 211, 153, 0.6)'
            ]
          } : {}}
          transition={{
            scale: { duration: breathingState.isActive ? 6 : 8, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Inner dimensional portal */}
          <motion.div
            className="w-40 h-40 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-sm"
            animate={isActive ? {
              rotate: [360, 0],
              borderColor: [
                'rgba(255, 255, 255, 0.3)',
                'rgba(52, 211, 153, 0.8)',
                'rgba(255, 255, 255, 0.3)'
              ]
            } : {}}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              borderColor: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.div
              className="text-white/90 flex items-center justify-center"
              animate={isActive ? {
                scale: [1, 1.2, 1],
                opacity: [0.8, 1, 0.8]
              } : {}}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Infinity className="w-16 h-16" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Orbiting consciousness nodes */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const orbitRadius = 180;
          
          return (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 shadow-lg"
              style={{
                filter: 'blur(0.5px)'
              }}
              animate={isActive ? {
                x: [
                  Math.cos(angle) * orbitRadius,
                  Math.cos(angle + Math.PI) * orbitRadius,
                  Math.cos(angle) * orbitRadius
                ],
                y: [
                  Math.sin(angle) * orbitRadius,
                  Math.sin(angle + Math.PI) * orbitRadius,
                  Math.sin(angle) * orbitRadius
                ],
                scale: [0.8, 1.5, 0.8],
                opacity: [0.6, 1, 0.6]
              } : {}}
              transition={{
                duration: 20,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Progressive wisdom text */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center px-8"
        animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <p className="text-xl font-light text-emerald-200 tracking-wide leading-relaxed">
          {complexityLevel === 0 && "Breathe into the infinite cosmos within"}
          {complexityLevel === 1 && "Feel the sacred geometry of existence"}
          {complexityLevel === 2 && "Witness the fractal nature of consciousness"}
          {complexityLevel === 3 && "You are the observer and the observed"}
          {complexityLevel >= 4 && "∞ Unity with the Source of all creation ∞"}
        </p>
        {isPlaying && (
          <motion.p 
            className="text-sm text-emerald-300/70 mt-2"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Resonating at {selectedFrequency.hz}Hz - {selectedFrequency.name}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}

// Heart Opening - Love Field Expansion
function LovingKindnessVisual({ isActive }: { isActive?: boolean }) {
  const [sessionTime, setSessionTime] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const complexityLevel = Math.min(Math.floor(sessionTime / 45), 4);
  const colors = ['#ec4899', '#f97316', '#8b5cf6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-rose-950 via-pink-900 to-purple-950">
      {/* Love Aurora Waves */}
      <AuroraWaves isActive={isActive || false} colors={colors} />
      
      {/* Heart Particle Field */}
      <div className="absolute inset-0">
        {Array.from({ length: 80 }).map((_, i) => {
          const pathType = i % 3;
          let animationProps;
          
          switch (pathType) {
            case 0: // Rising hearts
              animationProps = {
                y: [window.innerHeight + 100, -100],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                rotate: [0, 360],
                scale: [0.2, 1.5, 0.2],
                opacity: [0, 0.8, 0]
              };
              break;
            case 1: // Orbital hearts
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;
              const radius = 100 + Math.random() * 200;
              animationProps = {
                x: [centerX + radius, centerX - radius, centerX + radius],
                y: [centerY, centerY, centerY],
                scale: [0.5, 1.2, 0.5],
                opacity: [0.3, 0.9, 0.3]
              };
              break;
            default: // Spiral hearts
              animationProps = {
                x: [window.innerWidth / 2, window.innerWidth / 2 + 200, window.innerWidth / 2],
                y: [window.innerHeight / 2, window.innerHeight / 2 - 200, window.innerHeight / 2],
                rotate: [0, 720],
                scale: [0.3, 1.8, 0.3],
                opacity: [0, 1, 0]
              };
          }
          
          return (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              animate={isActive ? animationProps : {}}
              transition={{
                duration: 8 + Math.random() * 6,
                repeat: Infinity,
                delay: Math.random() * 10,
                ease: "easeInOut"
              }}
            >
              <Heart 
                className="text-pink-400/60 fill-current drop-shadow-lg" 
                size={8 + Math.random() * 16}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Sacred Geometry for Advanced Stages */}
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} type="loving-kindness" />}
      {complexityLevel >= 2 && <HolographicGrid isActive={isActive || false} />}

      {/* Central Love Vortex */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Expanding Love Rings */}
        {Array.from({ length: 8 }).map((_, ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full"
            style={{
              width: `${120 + ring * 60}px`,
              height: `${120 + ring * 60}px`,
              background: `radial-gradient(circle, rgba(236, 72, 153, ${0.4 - ring * 0.04}) 0%, transparent 80%)`,
              filter: 'blur(1px)'
            }}
            animate={isActive ? {
              scale: [0.7, 1.8, 0.7],
              opacity: [0.2, 0.7, 0.2],
              rotate: ring % 2 === 0 ? [0, 360] : [360, 0]
            } : {}}
            transition={{
              duration: 6 + ring * 0.8,
              repeat: Infinity,
              delay: ring * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Central Heart Portal */}
        <motion.div
          className="relative w-48 h-48 rounded-full flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(236, 72, 153, 0.9), rgba(249, 115, 22, 0.7), rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))',
            filter: 'blur(1px)'
          }}
          animate={isActive ? {
            scale: [0.9, 1.3, 0.9],
            rotate: [0, 360],
            boxShadow: [
              '0 0 80px rgba(236, 72, 153, 0.7)',
              '0 0 160px rgba(236, 72, 153, 1)',
              '0 0 80px rgba(236, 72, 153, 0.7)'
            ]
          } : {}}
          transition={{
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 40, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Inner Heart Chamber */}
          <motion.div
            className="w-28 h-28 rounded-full border-2 border-white/40 flex items-center justify-center backdrop-blur-sm"
            animate={isActive ? {
              rotate: [360, 0],
              borderColor: [
                'rgba(255, 255, 255, 0.4)',
                'rgba(236, 72, 153, 0.9)',
                'rgba(255, 255, 255, 0.4)'
              ]
            } : {}}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              borderColor: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.div
              animate={isActive ? {
                scale: [1, 1.3, 1],
                opacity: [0.9, 1, 0.9]
              } : {}}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-12 h-12 text-white/95 fill-current drop-shadow-2xl" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Orbiting Love Nodes */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const orbitRadius = 140 + (i % 3) * 30;
          
          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 shadow-lg"
              animate={isActive ? {
                x: [
                  Math.cos(angle) * orbitRadius,
                  Math.cos(angle + Math.PI) * orbitRadius,
                  Math.cos(angle) * orbitRadius
                ],
                y: [
                  Math.sin(angle) * orbitRadius,
                  Math.sin(angle + Math.PI) * orbitRadius,
                  Math.sin(angle) * orbitRadius
                ],
                scale: [0.6, 1.8, 0.6],
                opacity: [0.5, 1, 0.5]
              } : {}}
              transition={{
                duration: 15 + (i % 3) * 5,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Progressive Love Affirmations */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center px-8"
        animate={isActive ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <p className="text-xl font-light text-pink-200 tracking-wide leading-relaxed">
          {complexityLevel === 0 && "May I be filled with loving kindness"}
          {complexityLevel === 1 && "May my loved ones be happy and free"}
          {complexityLevel === 2 && "May all beings everywhere be at peace"}
          {complexityLevel >= 3 && "∞ Love is the bridge between hearts ∞"}
        </p>
      </motion.div>
    </div>
  );
}

// Energy Alignment - Chakra Vortex System
function ChakraVisual({ isActive }: { isActive?: boolean }) {
  const [sessionTime, setSessionTime] = useState(0);
  const [activeChakra, setActiveChakra] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setActiveChakra(prev => (prev + 1) % 7);
    }, 8000);
    return () => clearInterval(interval);
  }, [isActive]);

  const chakras = [
    { color: '#dc2626', name: 'Root', hz: 396, element: 'Earth', mantra: 'LAM' },
    { color: '#ea580c', name: 'Sacral', hz: 417, element: 'Water', mantra: 'VAM' },
    { color: '#facc15', name: 'Solar Plexus', hz: 528, element: 'Fire', mantra: 'RAM' },
    { color: '#22c55e', name: 'Heart', hz: 639, element: 'Air', mantra: 'YAM' },
    { color: '#3b82f6', name: 'Throat', hz: 741, element: 'Space', mantra: 'HAM' },
    { color: '#8b5cf6', name: 'Third Eye', hz: 852, element: 'Light', mantra: 'OM' },
    { color: '#a855f7', name: 'Crown', hz: 963, element: 'Thought', mantra: 'AH' }
  ];

  const complexityLevel = Math.min(Math.floor(sessionTime / 30), 5);
  const colors = chakras.map(c => c.color);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      {/* Energy Aurora */}
      <AuroraWaves isActive={isActive || false} colors={colors.slice(0, 3)} />
      
      {/* Quantum Energy Field */}
      <QuantumParticleField isActive={isActive || false} type="chakra" />
      
      {/* Sacred Geometry */}
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} type="chakra" />}
      {complexityLevel >= 3 && <HolographicGrid isActive={isActive || false} />}

      {/* Central Chakra Column */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex flex-col items-center space-y-12">
          {chakras.map((chakra, i) => {
            const isCurrentlyActive = i === activeChakra && isActive;
            
            return (
              <div key={i} className="relative">
                {/* Chakra Vortex */}
                <motion.div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(from 0deg, ${chakra.color}ff, ${chakra.color}88, ${chakra.color}ff)`,
                    filter: 'blur(0.5px)'
                  }}
                  animate={isActive ? {
                    rotate: [0, 360],
                    scale: isCurrentlyActive ? [1, 1.8, 1] : [0.8, 1.2, 0.8],
                    boxShadow: [
                      `0 0 30px ${chakra.color}66`,
                      `0 0 80px ${chakra.color}${isCurrentlyActive ? 'ff' : '99'}`,
                      `0 0 30px ${chakra.color}66`
                    ]
                  } : {}}
                  transition={{
                    rotate: { duration: 8 - i * 0.5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  {/* Inner Sacred Symbol */}
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-white/50 flex items-center justify-center backdrop-blur-sm"
                    animate={isActive ? {
                      rotate: [360, 0],
                      borderColor: isCurrentlyActive ? 
                        ['rgba(255, 255, 255, 0.8)', `${chakra.color}ff`, 'rgba(255, 255, 255, 0.8)'] :
                        ['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.6)', 'rgba(255, 255, 255, 0.3)']
                    } : {}}
                    transition={{
                      rotate: { duration: 6, repeat: Infinity, ease: "linear" },
                      borderColor: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                  >
                    <motion.span
                      className="text-white font-bold text-sm"
                      animate={isCurrentlyActive ? {
                        scale: [1, 1.3, 1],
                        opacity: [0.8, 1, 0.8]
                      } : {}}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      {chakra.mantra}
                    </motion.span>
                  </motion.div>
                </motion.div>

                {/* Energy Spirals */}
                {Array.from({ length: 8 }).map((_, spiral) => {
                  const spiralAngle = (spiral / 8) * Math.PI * 2;
                  const spiralRadius = 35 + spiral * 3;
                  
                  return (
                    <motion.div
                      key={spiral}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: chakra.color,
                        left: '50%',
                        top: '50%',
                        filter: 'blur(0.5px)'
                      }}
                      animate={isActive ? {
                        x: [
                          Math.cos(spiralAngle) * spiralRadius,
                          Math.cos(spiralAngle + Math.PI) * spiralRadius,
                          Math.cos(spiralAngle) * spiralRadius
                        ],
                        y: [
                          Math.sin(spiralAngle) * spiralRadius,
                          Math.sin(spiralAngle + Math.PI) * spiralRadius,
                          Math.sin(spiralAngle) * spiralRadius
                        ],
                        scale: [0.5, 1.5, 0.5],
                        opacity: isCurrentlyActive ? [0.6, 1, 0.6] : [0.3, 0.7, 0.3]
                      } : {}}
                      transition={{
                        duration: 6 + spiral * 0.3,
                        repeat: Infinity,
                        delay: spiral * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  );
                })}

                {/* Chakra Name Label */}
                <motion.div
                  className="absolute -right-20 top-1/2 transform -translate-y-1/2 text-right"
                  animate={isCurrentlyActive ? {
                    scale: [1, 1.1, 1],
                    opacity: [0.7, 1, 0.7]
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <p className="text-sm font-medium text-white/90">{chakra.name}</p>
                  <p className="text-xs text-white/60">{chakra.hz}Hz</p>
                </motion.div>
              </div>
            );
          })}

          {/* Central Sushumna Energy Channel */}
          <motion.div
            className="absolute inset-y-0 left-1/2 w-2 transform -translate-x-1/2"
            style={{
              background: 'linear-gradient(to bottom, #a855f7, #8b5cf6, #3b82f6, #22c55e, #facc15, #ea580c, #dc2626)',
              filter: 'blur(1px)'
            }}
            animate={isActive ? {
              opacity: [0.3, 0.9, 0.3],
              scaleY: [0.8, 1.2, 0.8],
              boxShadow: [
                '0 0 20px rgba(168, 85, 247, 0.5)',
                '0 0 60px rgba(168, 85, 247, 0.9)',
                '0 0 20px rgba(168, 85, 247, 0.5)'
              ]
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </div>

      {/* Progressive Chakra Wisdom */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center px-8"
        animate={isActive ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <p className="text-xl font-light text-violet-200 tracking-wide leading-relaxed">
          {complexityLevel === 0 && `Activating ${chakras[activeChakra]?.name} Chakra - ${chakras[activeChakra]?.element} Element`}
          {complexityLevel === 1 && `Feel the ${chakras[activeChakra]?.hz}Hz frequency awakening your energy center`}
          {complexityLevel === 2 && `${chakras[activeChakra]?.mantra} - The sound vibration of your ${chakras[activeChakra]?.name}`}
          {complexityLevel >= 3 && "∞ The seven flames unite in perfect harmony ∞"}
        </p>
      </motion.div>
    </div>
  );
}

// Consciousness Observation - Awareness Field
function MindfulnessVisual({ isActive }: { isActive?: boolean }) {
  const [sessionTime, setSessionTime] = useState(0);
  const [thoughtWaves, setThoughtWaves] = useState<Array<{id: number, x: number, y: number, intensity: number}>>([]);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
      
      // Generate random thought waves
      if (Math.random() < 0.3) {
        setThoughtWaves(prev => [...prev, {
          id: Date.now(),
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          intensity: Math.random()
        }].slice(-10));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const complexityLevel = Math.min(Math.floor(sessionTime / 40), 4);
  const colors = ['#67e8f9', '#3b82f6', '#8b5cf6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-950">
      {/* Consciousness Aurora */}
      <AuroraWaves isActive={isActive || false} colors={colors} />
      
      {/* Thought Particle Field */}
      <div className="absolute inset-0">
        {Array.from({ length: 60 }).map((_, i) => {
          const thoughtType = i % 4;
          let animationProps;
          
          switch (thoughtType) {
            case 0: // Rising thoughts
              animationProps = {
                y: [window.innerHeight + 50, -50],
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                opacity: [0, 0.7, 0],
                scale: [0.3, 1.2, 0.3]
              };
              break;
            case 1: // Floating thoughts
              animationProps = {
                x: [0, window.innerWidth, 0],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.5, 1.5, 0.5]
              };
              break;
            case 2: // Circular thoughts
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;
              const radius = 100 + Math.random() * 150;
              animationProps = {
                x: [centerX + radius, centerX - radius, centerX + radius],
                y: [centerY, centerY, centerY],
                opacity: [0.3, 0.9, 0.3],
                scale: [0.4, 1.8, 0.4]
              };
              break;
            default: // Dispersing thoughts
              animationProps = {
                x: [window.innerWidth / 2, Math.random() * window.innerWidth],
                y: [window.innerHeight / 2, Math.random() * window.innerHeight],
                opacity: [0.8, 0, 0.8],
                scale: [1, 3, 1]
              };
          }
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-cyan-400/40"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
              }}
              animate={isActive ? animationProps : {}}
              transition={{
                duration: 10 + Math.random() * 8,
                repeat: Infinity,
                delay: Math.random() * 12,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Sacred Geometry for Advanced Stages */}
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} type="mindfulness" />}
      {complexityLevel >= 2 && <FractalZoom isActive={isActive || false} intensity={complexityLevel} />}
      {complexityLevel >= 3 && <HolographicGrid isActive={isActive || false} />}

      {/* Central Awareness Portal */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Consciousness Rings */}
        {Array.from({ length: 6 }).map((_, ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border"
            style={{
              width: `${140 + ring * 70}px`,
              height: `${140 + ring * 70}px`,
              borderColor: `rgba(103, 232, 249, ${0.4 - ring * 0.05})`,
              borderWidth: '1px',
              filter: 'blur(0.5px)'
            }}
            animate={isActive ? {
              rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
              scale: [0.9, 1.2, 0.9],
              opacity: [0.2, 0.7, 0.2]
            } : {}}
            transition={{
              rotate: { duration: 15 + ring * 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}

        {/* Central Observer Point */}
        <motion.div
          className="relative w-40 h-40 rounded-full flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(103, 232, 249, 0.8), rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.8), rgba(103, 232, 249, 0.8))',
            filter: 'blur(1px)'
          }}
          animate={isActive ? {
            scale: [0.9, 1.2, 0.9],
            rotate: [0, 360],
            boxShadow: [
              '0 0 60px rgba(103, 232, 249, 0.6)',
              '0 0 120px rgba(103, 232, 249, 0.9)',
              '0 0 60px rgba(103, 232, 249, 0.6)'
            ]
          } : {}}
          transition={{
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 35, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Inner Witness */}
          <motion.div
            className="w-24 h-24 rounded-full border-2 border-white/40 flex items-center justify-center backdrop-blur-sm"
            animate={isActive ? {
              rotate: [360, 0],
              borderColor: [
                'rgba(255, 255, 255, 0.4)',
                'rgba(103, 232, 249, 0.9)',
                'rgba(255, 255, 255, 0.4)'
              ]
            } : {}}
            transition={{
              rotate: { duration: 20, repeat: Infinity, ease: "linear" },
              borderColor: { duration: 5, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <motion.div
              animate={isActive ? {
                scale: [1, 1.2, 1],
                opacity: [0.9, 1, 0.9]
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Eye className="w-10 h-10 text-white/95" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Thought Wave Ripples */}
        {thoughtWaves.map((wave) => (
          <motion.div
            key={wave.id}
            className="absolute rounded-full border border-cyan-400/30"
            style={{
              left: wave.x,
              top: wave.y
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{
              scale: [0, 4, 0],
              opacity: [0.8, 0.3, 0]
            }}
            transition={{
              duration: 3,
              ease: "easeOut"
            }}
            onAnimationComplete={() => {
              setThoughtWaves(prev => prev.filter(w => w.id !== wave.id));
            }}
          />
        ))}

        {/* Neural Network Connections */}
        {Array.from({ length: 20 }).map((_, i) => {
          const angle = (i / 20) * Math.PI * 2;
          const radius = 120 + (i % 3) * 40;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400"
              animate={isActive ? {
                x: [
                  Math.cos(angle) * radius,
                  Math.cos(angle + Math.PI) * radius,
                  Math.cos(angle) * radius
                ],
                y: [
                  Math.sin(angle) * radius,
                  Math.sin(angle + Math.PI) * radius,
                  Math.sin(angle) * radius
                ],
                scale: [0.5, 1.5, 0.5],
                opacity: [0.4, 1, 0.4]
              } : {}}
              transition={{
                duration: 12 + (i % 3) * 4,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Progressive Mindfulness Insights */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center px-8"
        animate={isActive ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <p className="text-xl font-light text-cyan-200 tracking-wide leading-relaxed">
          {complexityLevel === 0 && "Notice thoughts arising and passing away"}
          {complexityLevel === 1 && "You are the sky, thoughts are just clouds"}
          {complexityLevel === 2 && "Rest in the space between thoughts"}
          {complexityLevel >= 3 && "∞ The witness of all experience is your true nature ∞"}
        </p>
      </motion.div>
    </div>
  );
}

// Somatic Integration - Body Awareness Field
function BodyScanVisual({ isActive }: { isActive?: boolean }) {
  const [sessionTime, setSessionTime] = useState(0);
  const [currentBodyPart, setCurrentBodyPart] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
      setCurrentBodyPart(prev => (prev + 1) % 12);
    }, 6000);
    return () => clearInterval(interval);
  }, [isActive]);

  const bodyParts = [
    { name: 'Crown', y: 10, energy: '#a855f7' },
    { name: 'Forehead', y: 20, energy: '#8b5cf6' },
    { name: 'Throat', y: 35, energy: '#3b82f6' },
    { name: 'Heart', y: 50, energy: '#22c55e' },
    { name: 'Solar Plexus', y: 65, energy: '#facc15' },
    { name: 'Abdomen', y: 80, energy: '#ea580c' },
    { name: 'Pelvis', y: 95, energy: '#dc2626' },
    { name: 'Thighs', y: 110, energy: '#a855f7' },
    { name: 'Knees', y: 140, energy: '#8b5cf6' },
    { name: 'Calves', y: 160, energy: '#3b82f6' },
    { name: 'Feet', y: 180, energy: '#22c55e' },
    { name: 'Whole Body', y: 95, energy: '#ffffff' }
  ];

  const complexityLevel = Math.min(Math.floor(sessionTime / 35), 4);
  const colors = ['#c4b5fd', '#a78bfa', '#8b5cf6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      {/* Somatic Aurora */}
      <AuroraWaves isActive={isActive || false} colors={colors} />
      
      {/* Body Energy Field */}
      <QuantumParticleField isActive={isActive || false} type="body-scan" />
      
      {/* Sacred Geometry */}
      {complexityLevel >= 2 && <SacredGeometry isActive={isActive || false} type="body-scan" />}
      {complexityLevel >= 3 && <HolographicGrid isActive={isActive || false} />}

      {/* Central Body Portal */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Energetic Body Silhouette */}
        <div className="relative">
          {/* Auric Field */}
          <motion.div
            className="absolute rounded-full border border-violet-300/20"
            style={{
              width: '280px',
              height: '460px',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(2px)'
            }}
            animate={isActive ? {
              scale: [0.9, 1.2, 0.9],
              opacity: [0.2, 0.6, 0.2],
              rotate: [0, 360],
              boxShadow: [
                '0 0 40px rgba(196, 181, 253, 0.3)',
                '0 0 100px rgba(196, 181, 253, 0.7)',
                '0 0 40px rgba(196, 181, 253, 0.3)'
              ]
            } : {}}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Sacred Body Form */}
          <motion.div className="relative w-40 h-96 mx-auto">
            <svg
              viewBox="0 0 120 240"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Body outline with energy flow */}
              <motion.path
                d="M60 15 C55 15 50 20 50 30 C50 40 55 45 60 50 C65 45 70 40 70 30 C70 20 65 15 60 15 Z 
                   M60 50 C55 50 52 55 52 60 L52 140 C52 145 55 150 60 150 C65 150 68 145 68 140 L68 60 C68 55 65 50 60 50 Z 
                   M52 140 L45 160 L45 220 C45 225 50 230 55 230 C60 230 60 225 60 220 L60 160 L52 140 Z 
                   M68 140 L75 160 L75 220 C75 225 70 230 65 230 C60 230 60 225 60 220 L60 160 L68 140 Z 
                   M52 85 L35 95 L35 115 C35 120 40 125 45 125 C50 125 52 120 52 115 L52 85 Z 
                   M68 85 L85 95 L85 115 C85 120 80 125 75 125 C70 125 68 120 68 115 L68 85 Z"
                stroke="rgba(196, 181, 253, 0.6)"
                strokeWidth="2"
                fill="rgba(196, 181, 253, 0.1)"
                animate={isActive ? {
                  stroke: [
                    'rgba(196, 181, 253, 0.6)',
                    'rgba(139, 92, 246, 0.9)',
                    'rgba(196, 181, 253, 0.6)'
                  ]
                } : {}}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </svg>

            {/* Body Scanning Waves */}
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent"
                style={{
                  height: '8px',
                  bottom: `${i * 12}%`,
                  filter: 'blur(1px)'
                }}
                animate={isActive ? {
                  y: [-480, 0, -480],
                  opacity: [0, 0.9, 0],
                  scaleX: [0.3, 1.5, 0.3],
                  background: [
                    'linear-gradient(to right, transparent, rgba(196, 181, 253, 0.5), transparent)',
                    `linear-gradient(to right, transparent, ${bodyParts[currentBodyPart]?.energy || '#a855f7'}88, transparent)`,
                    'linear-gradient(to right, transparent, rgba(196, 181, 253, 0.5), transparent)'
                  ]
                } : {}}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  delay: i * 1.2,
                  ease: "easeInOut"
                }}
              />
            ))}

            {/* Energy Centers on Body */}
            {bodyParts.slice(0, -1).map((part, i) => {
              const isCurrentlyActive = i === currentBodyPart && isActive;
              
              return (
                <motion.circle
                  key={i}
                  cx="60"
                  cy={part.y}
                  r="4"
                  fill={part.energy}
                  opacity="0.7"
                  animate={isActive ? {
                    r: isCurrentlyActive ? [3, 8, 3] : [2, 5, 2],
                    opacity: isCurrentlyActive ? [0.7, 1, 0.7] : [0.4, 0.8, 0.4],
                    fill: [part.energy, '#ffffff', part.energy]
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </motion.div>

          {/* Current Body Part Indicator */}
          <motion.div
            className="absolute -right-32 top-1/2 transform -translate-y-1/2"
            animate={isActive ? {
              scale: [1, 1.1, 1],
              opacity: [0.8, 1, 0.8]
            } : {}}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="text-right">
              <p className="text-lg font-medium text-violet-200">
                {bodyParts[currentBodyPart]?.name}
              </p>
              <motion.div
                className="w-4 h-4 rounded-full mx-auto mt-2"
                style={{ backgroundColor: bodyParts[currentBodyPart]?.energy }}
                animate={isActive ? {
                  scale: [1, 1.5, 1],
                  boxShadow: [
                    `0 0 10px ${bodyParts[currentBodyPart]?.energy}66`,
                    `0 0 20px ${bodyParts[currentBodyPart]?.energy}ff`,
                    `0 0 10px ${bodyParts[currentBodyPart]?.energy}66`
                  ]
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Somatic Energy Spirals */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i / 12) * Math.PI * 2;
          const orbitRadius = 160 + (i % 4) * 25;
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-violet-400 to-purple-400"
              animate={isActive ? {
                x: [
                  Math.cos(angle) * orbitRadius,
                  Math.cos(angle + Math.PI) * orbitRadius,
                  Math.cos(angle) * orbitRadius
                ],
                y: [
                  Math.sin(angle) * orbitRadius,
                  Math.sin(angle + Math.PI) * orbitRadius,
                  Math.sin(angle) * orbitRadius
                ],
                scale: [0.5, 1.8, 0.5],
                opacity: [0.4, 1, 0.4]
              } : {}}
              transition={{
                duration: 18 + (i % 4) * 3,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut"
              }}
            />
          );
        })}
      </div>

      {/* Progressive Body Awareness Wisdom */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center px-8"
        animate={isActive ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <p className="text-xl font-light text-violet-200 tracking-wide leading-relaxed">
          {complexityLevel === 0 && `Bringing awareness to your ${bodyParts[currentBodyPart]?.name}`}
          {complexityLevel === 1 && "Feel the subtle sensations and energy flowing"}
          {complexityLevel === 2 && "Release tension, welcome gentle relaxation"}
          {complexityLevel >= 3 && "∞ Your body is a temple of consciousness ∞"}
        </p>
      </motion.div>
    </div>
  );
}

export default function MeditationVisuals({ type, isActive = false }: MeditationVisualsProps) {
  const visuals = {
    breathing: <BreathingVisual isActive={isActive} />,
    'loving-kindness': <LovingKindnessVisual isActive={isActive} />,
    chakra: <ChakraVisual isActive={isActive} />,
    mindfulness: <MindfulnessVisual isActive={isActive} />,
    'body-scan': <BodyScanVisual isActive={isActive} />
  };

  return (
    <div className="w-full h-full relative">
      <AnimatePresence mode="wait">
        {visuals[type]}
      </AnimatePresence>
    </div>
  );
}