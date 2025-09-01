import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCollectiveResonance } from '@/hooks/useCollectiveResonance';

interface ResonanceMessagingProps {
  isActive: boolean;
  phase: 'frequency' | 'other';
}

export function ResonanceMessaging({ isActive, phase }: ResonanceMessagingProps) {
  const { fieldData, getDominantFrequency } = useCollectiveResonance();
  
  if (!isActive || phase !== 'frequency' || !fieldData) return null;
  
  const { tag, strength } = getDominantFrequency();
  const topTags = fieldData.topTags.slice(0, 3);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Dominant Resonance Display */}
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <motion.div
          className="text-center"
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.02, 1]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="text-3xl font-light tracking-[0.2em] text-white/90 drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] mb-2">
            {tag.toUpperCase()}
          </div>
          <div className="text-sm text-white/60 tracking-widest">
            — Collective Resonance —
          </div>
        </motion.div>
      </motion.div>
      
      {/* Floating Tag Whispers */}
      <AnimatePresence>
        {topTags.map((tagData, index) => (
          <FloatingTag
            key={tagData.tag}
            tag={tagData.tag}
            strength={tagData.resonance_strength}
            delay={index * 3 + 5} // Stagger appearance
            position={getTagPosition(index)}
          />
        ))}
      </AnimatePresence>
      
      {/* Collective Field Stats (Subtle) */}
      <motion.div
        className="absolute bottom-20 right-10 text-white/30 text-xs font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 10, duration: 2 }}
      >
        <div>Field Coherence: {Math.round(fieldData.averageResonance * 10)}%</div>
        <div>Active Shifters: {fieldData.totalEntries}</div>
      </motion.div>
    </div>
  );
}

interface FloatingTagProps {
  tag: string;
  strength: number;
  delay: number;
  position: { x: string; y: string };
}

function FloatingTag({ tag, strength, delay, position }: FloatingTagProps) {
  return (
    <motion.div
      className="absolute text-white/70 text-lg font-light tracking-wider"
      style={{ left: position.x, top: position.y }}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ 
        opacity: [0, 0.8, 0],
        y: [20, 0, -20],
        scale: [0.8, 1, 0.8]
      }}
      transition={{
        duration: 8,
        delay,
        ease: "easeInOut",
        repeat: Infinity,
        repeatDelay: 15 // 15 second pause between cycles
      }}
    >
      <div className="relative">
        {/* Glow effect */}
        <div 
          className="absolute inset-0 blur-md opacity-40"
          style={{
            background: `radial-gradient(circle, rgba(255,255,255,${strength/10}) 0%, transparent 70%)`
          }}
        />
        
        {/* Tag text */}
        <span className="relative drop-shadow-lg">
          {tag}
        </span>
        
        {/* Subtle dots indicating strength */}
        <div className="flex justify-center mt-1 space-x-1">
          {[...Array(Math.min(5, Math.ceil(strength/2)))].map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-1 bg-white/40 rounded-full"
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Position tags around the screen avoiding the center orb
function getTagPosition(index: number): { x: string; y: string } {
  const positions = [
    { x: '20%', y: '25%' },   // Top left
    { x: '80%', y: '30%' },   // Top right
    { x: '15%', y: '70%' },   // Bottom left
    { x: '85%', y: '65%' },   // Bottom right
    { x: '50%', y: '15%' },   // Top center
  ];
  
  return positions[index] || { x: '50%', y: '50%' };
}