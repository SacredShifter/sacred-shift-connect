import React from 'react';
import { motion } from 'framer-motion';
import type { SacredMessage } from '@/data/sacredMessages';

interface SacredMessageProps {
  message: SacredMessage | null;
  isVisible: boolean;
  className?: string;
}

export function SacredMessage({ message, isVisible, className = '' }: SacredMessageProps) {
  if (!message) return null;

  // Style based on message category
  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'truth_anchors':
        return 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]';
      case 'integration_reminders':
        return 'text-blue-200 drop-shadow-[0_0_8px_rgba(147,197,253,0.7)]';
      case 'collective_seeds':
        return 'text-purple-200 drop-shadow-[0_0_8px_rgba(196,181,253,0.7)]';
      case 'sacred_shifter_identity':
        return 'text-yellow-200 drop-shadow-[0_0_8px_rgba(254,240,138,0.8)]';
      default:
        return 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]';
    }
  };

  const getBreathingAnimation = (category: string) => {
    // Truth anchors and integration reminders sync with breathing
    if (category === 'truth_anchors' || category === 'integration_reminders') {
      return {
        opacity: [0.7, 1, 0.7],
        scale: [1, 1.02, 1]
      };
    }
    
    return { opacity: isVisible ? 1 : 0 };
  };

  const getBreathingTransition = (category: string) => {
    if (category === 'truth_anchors' || category === 'integration_reminders') {
      return {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut" as const
      };
    }
    
    return { duration: 0.8, ease: "easeInOut" as const };
  };

  return (
    <motion.div
      className={`fixed inset-0 flex items-center justify-center pointer-events-none z-10 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ 
        ...getBreathingAnimation(message.category)
      }}
      transition={{
        ...getBreathingTransition(message.category)
      }}
    >
      <motion.div
        className={`
          text-center px-8 py-4 max-w-2xl mx-auto
          font-light tracking-wider leading-relaxed
          text-lg sm:text-xl md:text-2xl
          ${getCategoryStyle(message.category)}
        `}
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ 
          duration: 0.8, 
          delay: 0.2, 
          ease: "easeOut" 
        }}
      >
        <div className="relative">
          {/* Subtle background glow */}
          <div 
            className="absolute inset-0 bg-gradient-radial from-current/10 to-transparent blur-xl"
            aria-hidden="true"
          />
          
          {/* Message text */}
          <p className="relative z-10 italic">
            "{message.text}"
          </p>
          
          {/* Category indicator (subtle) */}
          <motion.div
            className="mt-4 text-xs opacity-40 tracking-widest uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 0.4 : 0 }}
            transition={{ delay: 1.5, duration: 0.5 }}
          >
            {message.category === 'collective_seeds' && '— Anonymous Shifter'}
            {message.category === 'sacred_shifter_identity' && '— Sacred Technology'}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Subtle particles around text for sacred_shifter_identity */}
      {message.category === 'sacred_shifter_identity' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 1, duration: 1 }}
        >
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-200 rounded-full opacity-60"
              style={{
                left: `${20 + i * 10}%`,
                top: `${30 + (i % 3) * 20}%`
              }}
              animate={{
                y: [-5, 5, -5],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2 + i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}