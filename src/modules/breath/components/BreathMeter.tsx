import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface BreathMeterProps {
  phase: 'idle' | 'active_breathing' | 'rest_recover';
  currentBreathPhase: 'inhale' | 'exhale';
  cycleCount: number;
  intensity: number;
  isBreathing: boolean;
}

export function BreathMeter({ 
  phase, 
  currentBreathPhase, 
  cycleCount, 
  intensity, 
  isBreathing 
}: BreathMeterProps) {
  // Calculate pulse intensity and speed based on breathing state
  const pulseIntensity = intensity / 100;
  const isActive = phase === 'active_breathing' && isBreathing;
  
  // Color transitions based on intensity
  const getColors = () => {
    if (phase === 'rest_recover') {
      return {
        primary: 'rgb(34, 197, 94)', // green-500
        secondary: 'rgb(16, 185, 129)', // emerald-500
        glow: 'rgba(34, 197, 94, 0.3)',
      };
    }
    
    const coolToWarm = intensity / 100;
    const blue = Math.round(255 * (1 - coolToWarm));
    const red = Math.round(255 * coolToWarm);
    const green = Math.round(128 + (127 * (1 - coolToWarm * 0.5)));
    
    return {
      primary: `rgb(${red}, ${green}, ${blue})`,
      secondary: `rgb(${red * 0.8}, ${green * 0.8}, ${blue * 0.8})`,
      glow: `rgba(${red}, ${green}, ${blue}, ${pulseIntensity * 0.4})`,
    };
  };
  
  const colors = getColors();
  
  // Animation variants for the main pulse
  const pulseVariants = {
    inhale: {
      scale: 1 + (pulseIntensity * 0.4),
      opacity: 0.8 + (pulseIntensity * 0.2),
      filter: `blur(${2 - pulseIntensity}px)`,
      transition: {
        duration: isActive ? 1.5 - (pulseIntensity * 0.3) : 2,
        ease: [0.4, 0.0, 0.2, 1.0] as const
      }
    },
    exhale: {
      scale: 1 - (pulseIntensity * 0.2),
      opacity: 0.4 + (pulseIntensity * 0.3),
      filter: `blur(${1 + pulseIntensity}px)`,
      transition: {
        duration: isActive ? 1.5 - (pulseIntensity * 0.3) : 2,
        ease: [0.4, 0.0, 0.2, 1.0] as const
      }
    },
    idle: {
      scale: 1,
      opacity: 0.6,
      filter: 'blur(1px)',
      transition: {
        duration: 3,
        ease: [0.4, 0.0, 0.2, 1.0] as const,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    },
    rest: {
      scale: 1,
      opacity: 0.5,
      filter: 'blur(0px)',
      transition: {
        duration: 4,
        ease: [0.4, 0.0, 0.2, 1.0] as const,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };
  
  const getAnimationState = () => {
    if (phase === 'rest_recover') return 'rest';
    if (!isActive) return 'idle';
    return currentBreathPhase;
  };
  
  // Generate mandala paths (simplified fractal pattern)
  const generateMandalaPath = (radius: number, points: number = 8) => {
    const angleStep = (Math.PI * 2) / points;
    let path = '';
    
    for (let i = 0; i <= points; i++) {
      const angle = i * angleStep;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      if (i === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    }
    
    return path + ' Z';
  };
  
  return (
    <div className="relative mx-auto h-64 w-64 flex items-center justify-center">
      {/* Outer glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          filter: 'blur(8px)',
        }}
        animate={{
          scale: isActive ? [1, 1.2, 1] : 1,
          opacity: isActive ? [0.3, 0.6, 0.3] : 0.3,
        }}
        transition={{
          duration: isActive ? 3 : 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main breathing circle with mandala pattern */}
      <motion.div
        className="relative w-48 h-48 rounded-full border-2 flex items-center justify-center"
        style={{
          borderColor: colors.primary,
          background: `radial-gradient(circle, ${colors.secondary}20 0%, transparent 70%)`,
        }}
        variants={pulseVariants}
        animate={getAnimationState()}
      >
        {/* Mandala pattern overlay */}
        <svg 
          className="absolute inset-0 w-full h-full"
          viewBox="-100 -100 200 200"
          style={{ filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.3))' }}
        >
          {/* Outer ring */}
          <motion.path
            d={generateMandalaPath(80, 12)}
            fill="none"
            stroke={colors.primary}
            strokeWidth="1.5"
            opacity={0.6}
            animate={{
              rotate: isActive ? 360 : 0,
            }}
            transition={{
              duration: isActive ? 20 : 60,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Middle ring */}
          <motion.path
            d={generateMandalaPath(50, 8)}
            fill="none"
            stroke={colors.secondary}
            strokeWidth="1"
            opacity={0.7}
            animate={{
              rotate: isActive ? -360 : 0,
            }}
            transition={{
              duration: isActive ? 15 : 45,
              repeat: Infinity,
              ease: "linear"
            }}
          />
          
          {/* Inner ring */}
          <motion.path
            d={generateMandalaPath(25, 6)}
            fill={colors.glow}
            stroke={colors.primary}
            strokeWidth="0.5"
            opacity={0.8}
            animate={{
              rotate: isActive ? 360 : 0,
            }}
            transition={{
              duration: isActive ? 10 : 30,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </svg>
        
        {/* Center content */}
        <div className="relative z-10 text-center">
          <AnimatePresence mode="wait">
            {phase === 'active_breathing' ? (
              <motion.div
                key="breathing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div className="text-2xl font-bold text-foreground mb-1">
                  {cycleCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  {currentBreathPhase === 'inhale' ? 'Breathe In' : 'Breathe Out'}
                </div>
              </motion.div>
            ) : phase === 'rest_recover' ? (
              <motion.div
                key="rest"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div className="text-lg font-medium text-emerald-400 mb-1">
                  Rest
                </div>
                <div className="text-sm text-muted-foreground">
                  Integrate
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center"
              >
                <div className="text-lg font-medium text-muted-foreground">
                  Ready
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Phase indicator ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-52 h-52 rounded-full border"
          style={{
            borderColor: colors.primary,
            borderWidth: 2,
          }}
          animate={{
            borderColor: [colors.primary, colors.secondary, colors.primary],
          }}
          transition={{
            duration: isActive ? 4 : 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
    </div>
  );
}