import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { useSynchronicityAlerts } from '@/hooks/useSynchronicityAlerts';

interface GlowWrapperProps {
  children: ReactNode;
  elementId: string;
  className?: string;
}

export const GlowWrapper = ({ children, elementId, className = '' }: GlowWrapperProps) => {
  const { isElementGlowing, getGlowIntensity } = useSynchronicityAlerts();
  
  const isGlowing = isElementGlowing(elementId);
  const intensity = getGlowIntensity(elementId);

  if (!isGlowing) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ filter: 'brightness(1)' }}
      animate={{
        filter: [
          'brightness(1)',
          `brightness(${1 + intensity * 0.3})`,
          'brightness(1)'
        ],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, intensity * 0.4, 0],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          background: `radial-gradient(circle, 
            hsla(var(--primary), ${intensity * 0.3}) 0%, 
            hsla(var(--primary), ${intensity * 0.2}) 30%, 
            transparent 70%
          )`,
          filter: 'blur(8px)',
        }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, intensity * 0.6, 0] }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(45deg, transparent 30%, hsla(var(--primary), 0.2) 50%, transparent 70%)',
              'linear-gradient(45deg, transparent 40%, hsla(var(--primary), 0.3) 60%, transparent 80%)',
              'linear-gradient(45deg, transparent 30%, hsla(var(--primary), 0.2) 50%, transparent 70%)'
            ],
            transform: ['translateX(-100%)', 'translateX(100%)', 'translateX(-100%)'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </motion.div>

      {/* Pulse border */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-lg border-2"
        style={{
          borderColor: `hsla(var(--primary), ${intensity * 0.6})`,
        }}
        animate={{
          opacity: [0, intensity * 0.8, 0],
          borderColor: [
            `hsla(var(--primary), ${intensity * 0.4})`,
            `hsla(var(--primary), ${intensity * 0.8})`,
            `hsla(var(--primary), ${intensity * 0.4})`
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {children}
    </motion.div>
  );
};