import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Brain, Moon, Sun, Waves } from 'lucide-react';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface MeditationVisualsProps {
  type: MeditationType;
  isActive?: boolean;
}

// Advanced Breathing meditation - Sophisticated breathing orb with particles
function BreathingVisual({ isActive }: { isActive?: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-900 via-teal-800 to-cyan-900 relative overflow-hidden">
      {/* Animated background particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/30 rounded-full"
            animate={{
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Central breathing mandala */}
      <div className="relative">
        {/* Outer breathing rings */}
        {[1, 2, 3, 4, 5].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-emerald-300/20"
            style={{
              width: `${120 + ring * 40}px`,
              height: `${120 + ring * 40}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={isActive ? {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.1, 0.4, 0.1],
              rotate: [0, 360]
            } : {}}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: ring * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Central orb */}
        <motion.div
          className="relative w-40 h-40 rounded-full bg-gradient-radial from-emerald-300/80 via-teal-400/60 to-cyan-500/40 shadow-2xl"
          animate={isActive ? {
            scale: [0.9, 1.3, 0.9],
            boxShadow: [
              '0 0 40px rgba(52, 211, 153, 0.4)',
              '0 0 80px rgba(52, 211, 153, 0.8)',
              '0 0 40px rgba(52, 211, 153, 0.4)'
            ]
          } : {}}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Inner patterns */}
          <div className="absolute inset-4 rounded-full bg-gradient-radial from-white/20 to-transparent">
            <motion.div
              className="w-full h-full rounded-full border-2 border-emerald-200/50"
              animate={isActive ? { rotate: [0, 360] } : {}}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Center breath symbol */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={isActive ? {
                scale: [0.8, 1.2, 0.8],
                opacity: [0.6, 1, 0.6]
              } : {}}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Waves className="w-12 h-12 text-white/80" />
            </motion.div>
          </div>
        </motion.div>

        {/* Floating meditation symbols */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-emerald-300/60 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: `${100 + Math.sin((i / 8) * Math.PI * 2) * 80}px ${Math.cos((i / 8) * Math.PI * 2) * 80}px`
            }}
            animate={isActive ? {
              rotate: [0, 360],
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3]
            } : {}}
            transition={{
              duration: 12,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="absolute bottom-8 text-center px-8">
        <motion.p 
          className="text-lg font-light text-emerald-200 tracking-wide"
          animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isActive ? "Breathe deeply, let peace flow through you" : "Focus on your natural breath"}
        </motion.p>
      </div>
    </div>
  );
}

// Loving-kindness meditation - Heart energy field
function LovingKindnessVisual({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-rose-900 via-pink-800 to-purple-900 relative overflow-hidden">
      {/* Background heart particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
              opacity: 0
            }}
            animate={isActive ? {
              y: -100,
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.2, 0.5]
            } : {}}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "easeOut"
            }}
          >
            <Heart className="w-4 h-4 text-pink-300/60 fill-current" />
          </motion.div>
        ))}
      </div>

      {/* Central heart mandala */}
      <div className="relative">
        {/* Pulsing love energy rings */}
        {[1, 2, 3].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full"
            style={{
              width: `${150 + ring * 60}px`,
              height: `${150 + ring * 60}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: `radial-gradient(circle, rgba(236, 72, 153, ${0.3 - ring * 0.08}) 0%, transparent 70%)`
            }}
            animate={isActive ? {
              scale: [0.8, 1.4, 0.8],
              opacity: [0.2, 0.6, 0.2]
            } : {}}
            transition={{
              duration: 4,
              repeat: Infinity,
              delay: ring * 0.8,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Central heart */}
        <motion.div
          className="relative w-32 h-32 flex items-center justify-center"
          animate={isActive ? {
            scale: [1, 1.2, 1],
          } : {}}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full rounded-full bg-gradient-radial from-pink-400/80 via-rose-500/60 to-purple-600/40 shadow-2xl flex items-center justify-center">
            <Heart className="w-16 h-16 text-white fill-current drop-shadow-lg" />
          </div>
        </motion.div>

        {/* Orbiting smaller hearts */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: `${120}px 0px`
            }}
            animate={isActive ? {
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8]
            } : {}}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 1.3,
              ease: "linear"
            }}
          >
            <Heart className="w-6 h-6 text-pink-300/80 fill-current" />
          </motion.div>
        ))}
      </div>
      
      <div className="absolute bottom-8 text-center px-8">
        <motion.p 
          className="text-lg font-light text-pink-200 tracking-wide"
          animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isActive ? "May all beings be happy, may all beings be at peace" : "Send love to yourself and all beings"}
        </motion.p>
      </div>
    </div>
  );
}

// Chakra meditation - Energy vortex system
function ChakraVisual({ isActive }: { isActive?: boolean }) {
  const chakras = [
    { color: 'rgb(220, 38, 127)', name: 'Root', y: 6 },
    { color: 'rgb(251, 146, 60)', name: 'Sacral', y: 5 },
    { color: 'rgb(250, 204, 21)', name: 'Solar Plexus', y: 4 },
    { color: 'rgb(34, 197, 94)', name: 'Heart', y: 3 },
    { color: 'rgb(59, 130, 246)', name: 'Throat', y: 2 },
    { color: 'rgb(139, 92, 246)', name: 'Third Eye', y: 1 },
    { color: 'rgb(168, 85, 247)', name: 'Crown', y: 0 }
  ];

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 relative overflow-hidden">
      {/* Energy field background */}
      <div className="absolute inset-0">
        {Array.from({ length: 100 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-white/20 rounded-full"
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Central chakra column */}
      <div className="relative flex flex-col items-center space-y-8">
        {chakras.map((chakra, i) => (
          <div key={i} className="relative">
            {/* Chakra vortex */}
            <motion.div
              className="relative w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, ${chakra.color}aa 0%, ${chakra.color}44 50%, transparent 100%)`
              }}
              animate={isActive ? {
                rotate: [0, 360],
                scale: [0.9, 1.3, 0.9],
                boxShadow: [
                  `0 0 20px ${chakra.color}66`,
                  `0 0 40px ${chakra.color}99`,
                  `0 0 20px ${chakra.color}66`
                ]
              } : {}}
              transition={{
                duration: 4 + i * 0.2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear"
              }}
            >
              {/* Inner spinning ring */}
              <motion.div
                className="w-12 h-12 rounded-full border-2"
                style={{ borderColor: chakra.color }}
                animate={isActive ? { rotate: [360, 0] } : {}}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            </motion.div>

            {/* Energy spirals */}
            {Array.from({ length: 6 }).map((_, spiral) => (
              <motion.div
                key={spiral}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: chakra.color,
                  top: '50%',
                  left: '50%',
                  transformOrigin: `${30 + spiral * 5}px 0px`
                }}
                animate={isActive ? {
                  rotate: [0, 360],
                  opacity: [0.3, 0.8, 0.3]
                } : {}}
                transition={{
                  duration: 6 - spiral * 0.5,
                  repeat: Infinity,
                  delay: spiral * 0.2,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        ))}

        {/* Central energy beam */}
        <motion.div
          className="absolute inset-y-0 left-1/2 w-1 bg-gradient-to-b from-violet-300/20 via-indigo-300/40 to-purple-300/20 transform -translate-x-1/2"
          animate={isActive ? {
            opacity: [0.3, 0.8, 0.3],
            scaleY: [0.8, 1.2, 0.8]
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="absolute bottom-8 text-center px-8">
        <motion.p 
          className="text-lg font-light text-violet-200 tracking-wide"
          animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isActive ? "Feel the energy centers align and balance" : "Align and balance your energy centers"}
        </motion.p>
      </div>
    </div>
  );
}

// Mindfulness meditation - Consciousness web
function MindfulnessVisual({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 relative overflow-hidden">
      {/* Thought bubbles background */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-cyan-300/20 rounded-full"
            animate={{
              y: [window.innerHeight, -50],
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth
              ],
              opacity: [0, 0.6, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 6,
              ease: "linear"
            }}
            style={{
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Central awareness mandala */}
      <div className="relative">
        {/* Consciousness rings */}
        {[1, 2, 3, 4].map((ring) => (
          <motion.div
            key={ring}
            className="absolute rounded-full border border-cyan-300/30"
            style={{
              width: `${100 + ring * 50}px`,
              height: `${100 + ring * 50}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
            animate={isActive ? {
              rotate: ring % 2 === 0 ? [0, 360] : [360, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.9, 1.1, 0.9]
            } : {}}
            transition={{
              duration: 10 + ring * 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}

        {/* Central awareness point */}
        <motion.div
          className="relative w-24 h-24 rounded-full bg-gradient-radial from-cyan-300/60 via-blue-400/40 to-slate-500/20 flex items-center justify-center shadow-2xl"
          animate={isActive ? {
            scale: [1, 1.1, 1],
            boxShadow: [
              '0 0 30px rgba(103, 232, 249, 0.3)',
              '0 0 60px rgba(103, 232, 249, 0.6)',
              '0 0 30px rgba(103, 232, 249, 0.3)'
            ]
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Brain className="w-10 h-10 text-white/90" />
        </motion.div>

        {/* Floating thought nodes */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-cyan-300/40 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: `${80 + Math.cos((i / 12) * Math.PI * 2) * 60}px ${Math.sin((i / 12) * Math.PI * 2) * 60}px`
            }}
            animate={isActive ? {
              rotate: [0, 360],
              scale: [0.6, 1.2, 0.6],
              opacity: [0.3, 0.8, 0.3]
            } : {}}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Connection lines */}
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-cyan-300/20 origin-center"
            style={{
              width: '120px',
              height: '1px',
              top: '50%',
              left: '50%',
              transformOrigin: 'center',
              rotate: `${i * 30}deg`
            }}
            animate={isActive ? {
              opacity: [0.1, 0.4, 0.1],
              scaleX: [0.8, 1.2, 0.8]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      
      <div className="absolute bottom-8 text-center px-8">
        <motion.p 
          className="text-lg font-light text-cyan-200 tracking-wide"
          animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isActive ? "Simply observe, let thoughts come and go like clouds" : "Observe thoughts without judgment"}
        </motion.p>
      </div>
    </div>
  );
}

// Body scan meditation - Energy wave progression
function BodyScanVisual({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Flowing energy particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-violet-300/40 rounded-full"
            animate={{
              x: [-50, window.innerWidth + 50],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight
              ],
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 8,
              ease: "linear"
            }}
            style={{
              top: Math.random() * 100 + '%'
            }}
          />
        ))}
      </div>

      {/* Body silhouette with scanning waves */}
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
              stroke="rgba(196, 181, 253, 0.4)"
              strokeWidth="2"
              fill="rgba(196, 181, 253, 0.1)"
            />
          </svg>

          {/* Scanning waves moving up the body */}
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-0 right-0 h-8 bg-gradient-to-r from-transparent via-violet-400/40 to-transparent"
              style={{
                bottom: `${i * 20}%`,
                height: '12px'
              }}
              animate={isActive ? {
                y: [-400, 0, -400],
                opacity: [0, 0.8, 0],
                scaleX: [0.5, 1.2, 0.5]
              } : {}}
              transition={{
                duration: 8,
                repeat: Infinity,
                delay: i * 1.5,
                ease: "easeInOut"
              }}
            />
          ))}

          {/* Energy points on body */}
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
              fill="rgba(196, 181, 253, 0.6)"
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
        </div>

        {/* Surrounding energy field */}
        <motion.div
          className="absolute inset-0 rounded-full border border-violet-300/20"
          style={{
            width: '200px',
            height: '400px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          }}
          animate={isActive ? {
            scale: [0.9, 1.1, 0.9],
            opacity: [0.2, 0.5, 0.2],
            rotate: [0, 360]
          } : {}}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>
      
      <div className="absolute bottom-8 text-center px-8">
        <motion.p 
          className="text-lg font-light text-violet-200 tracking-wide"
          animate={isActive ? { opacity: [0.7, 1, 0.7] } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {isActive ? "Feel the gentle waves of relaxation flowing through your body" : "Scan and relax each part of your body"}
        </motion.p>
      </div>
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