import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Brain, Moon, Sun } from 'lucide-react';

type MeditationType = 'breathing' | 'loving-kindness' | 'chakra' | 'mindfulness' | 'body-scan';

interface MeditationVisualsProps {
  type: MeditationType;
  isActive?: boolean;
}

// Breathing meditation - Pulsing circle
function BreathingVisual({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/30">
      <motion.div
        className="relative"
        animate={isActive ? {
          scale: [1, 1.3, 1],
          opacity: [0.7, 1, 0.7]
        } : {}}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 shadow-lg shadow-green-500/50">
          <div className="w-full h-full rounded-full bg-gradient-to-r from-green-300/60 to-emerald-400/60 flex items-center justify-center">
            <span className="text-white font-medium text-lg">🌬️</span>
          </div>
        </div>
        
        {/* Breathing rings */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-green-400/40"
            animate={isActive ? {
              scale: [1, 2, 3],
              opacity: [0.8, 0.4, 0]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeOut"
            }}
          />
        ))}
      </motion.div>
      
      <div className="absolute bottom-8 text-center">
        <p className="text-sm font-medium text-green-700 dark:text-green-300">
          Focus on your natural breath
        </p>
      </div>
    </div>
  );
}

// Loving-kindness meditation - Hearts floating
function LovingKindnessVisual({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-pink-50 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/30 relative overflow-hidden">
      <motion.div
        className="w-32 h-32 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 shadow-lg shadow-pink-500/50 flex items-center justify-center"
        animate={isActive ? {
          scale: [1, 1.1, 1],
        } : {}}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Heart className="w-12 h-12 text-white fill-current" />
      </motion.div>
      
      {/* Floating hearts */}
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{ 
            x: Math.random() * 300,
            y: 400,
            opacity: 0 
          }}
          animate={isActive ? {
            y: -100,
            opacity: [0, 1, 0],
            x: Math.random() * 300
          } : {}}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut"
          }}
        >
          <Heart className="w-6 h-6 text-pink-400 fill-current" />
        </motion.div>
      ))}
      
      <div className="absolute bottom-8 text-center">
        <p className="text-sm font-medium text-pink-700 dark:text-pink-300">
          Send love to yourself and all beings
        </p>
      </div>
    </div>
  );
}

// Chakra meditation - Spinning colored circles
function ChakraVisual({ isActive }: { isActive?: boolean }) {
  const chakraColors = [
    'from-red-400 to-red-600',
    'from-orange-400 to-orange-600', 
    'from-yellow-400 to-yellow-600',
    'from-green-400 to-green-600',
    'from-blue-400 to-blue-600',
    'from-indigo-400 to-indigo-600',
    'from-purple-400 to-purple-600'
  ];

  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-purple-50 to-indigo-100 dark:from-purple-900/20 dark:to-indigo-900/30">
      <div className="flex flex-col items-center space-y-2">
        {chakraColors.map((color, i) => (
          <motion.div
            key={i}
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} shadow-lg`}
            animate={isActive ? {
              rotate: [0, 360],
              scale: [0.8, 1.2, 0.8]
            } : {}}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <div className="absolute bottom-8 text-center">
        <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
          Align and balance your energy centers
        </p>
      </div>
    </div>
  );
}

// Mindfulness meditation - Geometric patterns
function MindfulnessVisual({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/30">
      <div className="relative">
        <motion.div
          className="w-32 h-32 rounded-lg bg-gradient-to-r from-blue-400 to-cyan-500 shadow-lg shadow-blue-500/50 flex items-center justify-center"
          animate={isActive ? {
            rotate: [0, 180, 360],
          } : {}}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Brain className="w-12 h-12 text-white" />
        </motion.div>
        
        {/* Orbiting elements */}
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-blue-300 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              transformOrigin: `${60 * i}px 0px`
            }}
            animate={isActive ? {
              rotate: [0, 360]
            } : {}}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <div className="absolute bottom-8 text-center">
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
          Observe thoughts without judgment
        </p>
      </div>
    </div>
  );
}

// Body scan meditation - Wave pattern
function BodyScanVisual({ isActive }: { isActive?: boolean }) {
  return (
    <div className="flex items-center justify-center h-full bg-gradient-to-br from-violet-50 to-purple-100 dark:from-violet-900/20 dark:to-purple-900/30 relative">
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-r from-violet-400 to-purple-500 shadow-lg shadow-violet-500/50 flex items-center justify-center"
          animate={isActive ? {
            scale: [1, 1.05, 1],
          } : {}}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>
        
        {/* Scanning waves */}
        <div className="flex space-x-1">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <motion.div
              key={i}
              className="w-2 bg-violet-400 rounded-full"
              animate={isActive ? {
                height: [4, 32, 4],
                opacity: [0.3, 1, 0.3]
              } : { height: 4 }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-8 text-center">
        <p className="text-sm font-medium text-violet-700 dark:text-violet-300">
          Scan and relax each part of your body
        </p>
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
      {visuals[type]}
    </div>
  );
}