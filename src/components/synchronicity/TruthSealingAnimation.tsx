import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Sparkles } from 'lucide-react';

interface TruthSealingAnimationProps {
  isActive: boolean;
}

export const TruthSealingAnimation: React.FC<TruthSealingAnimationProps> = ({ isActive }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: 'spring',
              damping: 20,
              stiffness: 200,
              duration: 1.5
            }}
            className="relative"
          >
            {/* Central Seal */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 3,
                ease: 'linear',
                repeat: Infinity
              }}
              className="w-32 h-32 rounded-full border-4 border-primary bg-primary/10 flex items-center justify-center"
            >
              <Shield className="w-16 h-16 text-primary" />
            </motion.div>

            {/* Orbiting Sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute w-8 h-8 flex items-center justify-center"
                style={{
                  top: '50%',
                  left: '50%',
                  transformOrigin: `${Math.cos(i * Math.PI / 4) * 80}px ${Math.sin(i * Math.PI / 4) * 80}px`,
                  transform: `translate(-50%, -50%) rotate(${i * 45}deg)`
                }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.div>
            ))}

            {/* Pulsing Rings */}
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: [0.8, 1.5, 2],
                  opacity: [0.8, 0.4, 0]
                }}
                transition={{
                  duration: 2,
                  delay: ring * 0.4,
                  repeat: Infinity,
                  ease: 'easeOut'
                }}
                className="absolute inset-0 rounded-full border-2 border-primary"
                style={{
                  width: `${100 + ring * 20}%`,
                  height: `${100 + ring * 20}%`,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              />
            ))}
          </motion.div>

          {/* Truth Sealed Text */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-1/3 text-center"
          >
            <motion.h2
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              className="text-2xl font-bold text-primary mb-2"
            >
              Truth Sealed
            </motion.h2>
            <p className="text-muted-foreground">
              This synchronicity has been recorded in the akashic field
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};