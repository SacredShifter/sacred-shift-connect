import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Brain, Waves, Eye, Infinity } from 'lucide-react';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface MeditationVisualsProps {
  type: MeditationType;
  isActive?: boolean;
}

// Sacred Geometry Component
const SacredGeometry = ({ isActive }: { isActive: boolean }) => (
  <motion.svg
    className="absolute inset-0 w-full h-full opacity-10"
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
          r="30"
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          animate={isActive ? {
            r: [25, 35, 25],
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

// Aurora Wave Effects
const AuroraWaves = ({ isActive, colors }: { isActive: boolean; colors: string[] }) => (
  <div className="absolute inset-0 overflow-hidden">
    {Array.from({ length: 3 }).map((_, i) => (
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

// Quantum Particle Field
const QuantumParticleField = ({ isActive, particleColor }: { isActive: boolean; particleColor: string }) => (
  <div className="absolute inset-0 overflow-hidden">
    {Array.from({ length: 150 }).map((_, i) => {
      const startX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920);
      const startY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080);
      
      return (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{ backgroundColor: particleColor }}
          animate={isActive ? {
            x: [startX, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920), startX],
            y: [startY, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080), startY],
            scale: [0.5, 2, 0.5],
            opacity: [0, 0.8, 0]
          } : {}}
          transition={{
            duration: 12 + Math.random() * 8,
            repeat: Infinity,
            delay: Math.random() * 10,
            ease: "easeInOut"
          }}
          initial={{ x: startX, y: startY }}
        />
      );
    })}
  </div>
);

// Enhanced Breathing Meditation
function BreathingVisual({ isActive }: { isActive?: boolean }) {
  const [sessionTime, setSessionTime] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const complexityLevel = Math.min(Math.floor(sessionTime / 30), 3);
  const colors = ['#10b981', '#06b6d4', '#3b82f6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-emerald-950 via-teal-900 to-cyan-950">
      <AuroraWaves isActive={isActive || false} colors={colors} />
      <QuantumParticleField isActive={isActive || false} particleColor="rgba(52, 211, 153, 0.6)" />
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} />}

      {/* Central Consciousness Portal */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* Outer rings */}
        {Array.from({ length: 5 }).map((_, ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border"
            style={{
              width: `${200 + ring * 60}px`,
              height: `${200 + ring * 60}px`,
              borderColor: `rgba(52, 211, 153, ${0.4 - ring * 0.08})`,
              borderWidth: '1px'
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

        {/* Central Portal */}
        <motion.div
          className="relative w-48 h-48 rounded-full flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(52, 211, 153, 0.8), rgba(6, 182, 212, 0.6), rgba(59, 130, 246, 0.8), rgba(52, 211, 153, 0.8))',
            filter: 'blur(1px)'
          }}
          animate={isActive ? {
            scale: [0.8, 1.4, 0.8],
            rotate: [0, 360],
            boxShadow: [
              '0 0 60px rgba(52, 211, 153, 0.6)',
              '0 0 120px rgba(52, 211, 153, 0.9)',
              '0 0 60px rgba(52, 211, 153, 0.6)'
            ]
          } : {}}
          transition={{
            scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 30, repeat: Infinity, ease: "linear" },
            boxShadow: { duration: 4, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <motion.div
            className="w-32 h-32 rounded-full border-2 border-white/30 flex items-center justify-center backdrop-blur-sm"
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
              <Infinity className="w-12 h-12 text-white/90" />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Wisdom Text */}
      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center px-8"
        animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <p className="text-xl font-light text-emerald-200 tracking-wide leading-relaxed">
          {complexityLevel === 0 && "Breathe into the infinite cosmos within"}
          {complexityLevel === 1 && "Feel the sacred geometry of existence"}
          {complexityLevel === 2 && "Witness the fractal nature of consciousness"}
          {complexityLevel >= 3 && "∞ Unity with the Source of all creation ∞"}
        </p>
      </motion.div>
    </div>
  );
}

// Heart Opening Visual
function LovingKindnessVisual({ isActive }: { isActive?: boolean }) {
  const [sessionTime, setSessionTime] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const complexityLevel = Math.min(Math.floor(sessionTime / 45), 3);
  const colors = ['#ec4899', '#f97316', '#8b5cf6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-rose-950 via-pink-900 to-purple-950">
      <AuroraWaves isActive={isActive || false} colors={colors} />
      <QuantumParticleField isActive={isActive || false} particleColor="rgba(236, 72, 153, 0.6)" />
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} />}

      {/* Heart Particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 1080
            }}
            animate={isActive ? {
              y: -100,
              opacity: [0, 0.8, 0],
              scale: [0.2, 1.5, 0.2],
              rotate: [0, 360]
            } : {}}
            transition={{
              duration: 8 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
          >
            <Heart 
              className="text-pink-400/80 fill-current drop-shadow-lg w-4 h-4" 
            />
          </motion.div>
        ))}
      </div>

      {/* Central Love Portal */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 6 }).map((_, ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full"
            style={{
              width: `${120 + ring * 50}px`,
              height: `${120 + ring * 50}px`,
              background: `radial-gradient(circle, rgba(236, 72, 153, ${0.4 - ring * 0.06}) 0%, transparent 80%)`
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

        <motion.div
          className="relative w-40 h-40 rounded-full flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(236, 72, 153, 0.9), rgba(249, 115, 22, 0.7), rgba(139, 92, 246, 0.9), rgba(236, 72, 153, 0.9))'
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
            <Heart className="w-16 h-16 text-white/95 fill-current drop-shadow-2xl" />
          </motion.div>
        </motion.div>
      </div>

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

// Chakra Visual
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
    { color: '#dc2626', name: 'Root', mantra: 'LAM' },
    { color: '#ea580c', name: 'Sacral', mantra: 'VAM' },
    { color: '#facc15', name: 'Solar Plexus', mantra: 'RAM' },
    { color: '#22c55e', name: 'Heart', mantra: 'YAM' },
    { color: '#3b82f6', name: 'Throat', mantra: 'HAM' },
    { color: '#8b5cf6', name: 'Third Eye', mantra: 'OM' },
    { color: '#a855f7', name: 'Crown', mantra: 'AH' }
  ];

  const complexityLevel = Math.min(Math.floor(sessionTime / 30), 3);
  const colors = ['#a855f7', '#8b5cf6', '#3b82f6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      <AuroraWaves isActive={isActive || false} colors={colors} />
      <QuantumParticleField isActive={isActive || false} particleColor="rgba(139, 92, 246, 0.6)" />
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} />}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative flex flex-col items-center space-y-8">
          {chakras.map((chakra, i) => {
            const isCurrentlyActive = i === activeChakra && isActive;
            
            return (
              <div key={i} className="relative">
                <motion.div
                  className="relative w-20 h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: `conic-gradient(from 0deg, ${chakra.color}ff, ${chakra.color}88, ${chakra.color}ff)`
                  }}
                  animate={isActive ? {
                    rotate: [0, 360],
                    scale: isCurrentlyActive ? [1, 1.6, 1] : [0.8, 1.2, 0.8],
                    boxShadow: [
                      `0 0 30px ${chakra.color}66`,
                      `0 0 60px ${chakra.color}${isCurrentlyActive ? 'ff' : '99'}`,
                      `0 0 30px ${chakra.color}66`
                    ]
                  } : {}}
                  transition={{
                    rotate: { duration: 8 - i * 0.5, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                >
                  <motion.div
                    className="w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center backdrop-blur-sm"
                    animate={isActive ? {
                      rotate: [360, 0]
                    } : {}}
                    transition={{
                      rotate: { duration: 6, repeat: Infinity, ease: "linear" }
                    }}
                  >
                    <motion.span
                      className="text-white font-bold text-xs"
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

                <motion.div
                  className="absolute -right-16 top-1/2 transform -translate-y-1/2 text-right"
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
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center px-8"
        animate={isActive ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <p className="text-xl font-light text-violet-200 tracking-wide leading-relaxed">
          {complexityLevel === 0 && `Activating ${chakras[activeChakra]?.name} Chakra`}
          {complexityLevel === 1 && `${chakras[activeChakra]?.mantra} - Sacred vibration awakens`}
          {complexityLevel === 2 && "Feel the energy centers aligning"}
          {complexityLevel >= 3 && "∞ The seven flames unite in perfect harmony ∞"}
        </p>
      </motion.div>
    </div>
  );
}

// Mindfulness Visual
function MindfulnessVisual({ isActive }: { isActive?: boolean }) {
  const [sessionTime, setSessionTime] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const complexityLevel = Math.min(Math.floor(sessionTime / 40), 3);
  const colors = ['#67e8f9', '#3b82f6', '#8b5cf6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-slate-950 via-blue-900 to-cyan-950">
      <AuroraWaves isActive={isActive || false} colors={colors} />
      <QuantumParticleField isActive={isActive || false} particleColor="rgba(103, 232, 249, 0.6)" />
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} />}

      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 4 }).map((_, ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border"
            style={{
              width: `${140 + ring * 50}px`,
              height: `${140 + ring * 50}px`,
              borderColor: `rgba(103, 232, 249, ${0.4 - ring * 0.08})`,
              borderWidth: '1px'
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

        <motion.div
          className="relative w-32 h-32 rounded-full flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 0deg, rgba(103, 232, 249, 0.8), rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.8), rgba(103, 232, 249, 0.8))'
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
            <Eye className="w-12 h-12 text-white/95" />
          </motion.div>
        </motion.div>
      </div>

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

// Body Scan Visual
function BodyScanVisual({ isActive }: { isActive?: boolean }) {
  const [sessionTime, setSessionTime] = useState(0);
  
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive]);

  const complexityLevel = Math.min(Math.floor(sessionTime / 35), 3);
  const colors = ['#c4b5fd', '#a78bfa', '#8b5cf6'];

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-violet-950 via-purple-900 to-indigo-950">
      <AuroraWaves isActive={isActive || false} colors={colors} />
      <QuantumParticleField isActive={isActive || false} particleColor="rgba(196, 181, 253, 0.6)" />
      {complexityLevel >= 1 && <SacredGeometry isActive={isActive || false} />}

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Body outline */}
          <div className="relative w-32 h-80 mx-auto">
            <svg
              viewBox="0 0 100 200"
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M50 10 C45 10 40 15 40 25 C40 35 45 40 50 45 C55 40 60 35 60 25 C60 15 55 10 50 10 Z M50 45 C45 45 42 50 42 55 L42 120 C42 125 45 130 50 130 C55 130 58 125 58 120 L58 55 C58 50 55 45 50 45 Z M42 120 L35 140 L35 180 C35 185 40 190 45 190 C50 190 50 185 50 180 L50 140 L42 120 Z M58 120 L65 140 L65 180 C65 185 60 190 55 190 C50 190 50 185 50 180 L50 140 L58 120 Z M42 70 L25 80 L25 100 C25 105 30 110 35 110 C40 110 42 105 42 100 L42 70 Z M58 70 L75 80 L75 100 C75 105 70 110 65 110 C60 110 58 105 58 100 L58 70 Z"
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
              
              {/* Energy points */}
              {[
                { x: 50, y: 15 }, // Head
                { x: 50, y: 30 }, // Throat
                { x: 50, y: 50 }, // Heart
                { x: 50, y: 70 }, // Solar plexus
                { x: 50, y: 90 }, // Sacral
                { x: 50, y: 110 } // Root
              ].map((point, i) => (
                <motion.circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r="3"
                  fill="rgba(196, 181, 253, 0.8)"
                  animate={isActive ? {
                    r: [2, 6, 2],
                    opacity: [0.4, 1, 0.4]
                  } : {}}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </svg>

            {/* Scanning waves */}
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute left-0 right-0 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent"
                style={{
                  height: '8px',
                  bottom: `${i * 25}%`
                }}
                animate={isActive ? {
                  y: [-320, 0, -320],
                  opacity: [0, 0.9, 0],
                  scaleX: [0.3, 1.5, 0.3]
                } : {}}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  delay: i * 2,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center px-8"
        animate={isActive ? { opacity: [0.8, 1, 0.8] } : {}}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <p className="text-xl font-light text-violet-200 tracking-wide leading-relaxed">
          {complexityLevel === 0 && "Scan each part of your body with awareness"}
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