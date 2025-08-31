import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BreathingAnimationProps {
  isActive: boolean;
  size?: number;
  color?: string;
}

export const BreathingAnimation: React.FC<BreathingAnimationProps> = ({
  isActive,
  size = 150,
  color = 'hsl(var(--primary))'
}) => {
  const [phase, setPhase] = useState<'inhale' | 'exhale'>('inhale');

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setPhase(prev => prev === 'inhale' ? 'exhale' : 'inhale');
    }, 4000); // 4 seconds per phase for gentle breathing

    return () => clearInterval(interval);
  }, [isActive]);

  const variants = {
    inhale: {
      scale: 1.2,
      opacity: 0.8,
      transition: {
        duration: 4,
        ease: "easeInOut" as const
      }
    },
    exhale: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 4,
        ease: "easeInOut" as const
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="relative flex items-center justify-center"
        style={{ width: size * 1.5, height: size * 1.5 }}
      >
        {/* Outer ring */}
        <motion.div
          className="absolute rounded-full border-2 border-primary/20"
          style={{ 
            width: size * 1.4, 
            height: size * 1.4,
          }}
          animate={{
            scale: isActive ? [1, 1.1, 1] : 1,
            opacity: isActive ? [0.3, 0.6, 0.3] : 0.3
          }}
          transition={{
            duration: 8,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Main breathing circle */}
        <motion.div
          className="rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-primary/40 backdrop-blur-sm"
          style={{ 
            width: size, 
            height: size,
            boxShadow: `0 0 ${size/3}px ${color}30`
          }}
          variants={variants}
          animate={isActive ? phase : 'exhale'}
        />

        {/* Inner glow */}
        <motion.div
          className="absolute rounded-full bg-primary/20"
          style={{ width: size * 0.6, height: size * 0.6 }}
          animate={{
            scale: isActive ? [0.8, 1, 0.8] : 0.8,
            opacity: isActive ? [0.4, 0.8, 0.4] : 0.4
          }}
          transition={{
            duration: 8,
            repeat: isActive ? Infinity : 0,
            ease: "easeInOut"
          }}
        />

        {/* Center dot */}
        <div 
          className="absolute rounded-full bg-primary/60"
          style={{ width: size * 0.1, height: size * 0.1 }}
        />
      </div>

      {/* Breathing instruction */}
      <motion.div
        className="text-center"
        animate={{
          opacity: isActive ? 1 : 0.6
        }}
      >
        <motion.p 
          className="text-lg font-medium text-foreground"
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isActive ? (phase === 'inhale' ? 'Breathe In...' : 'Breathe Out...') : 'Focus on your breath'}
        </motion.p>
      </motion.div>
    </div>
  );
};