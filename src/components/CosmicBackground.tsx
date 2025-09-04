import React from 'react';
import { motion } from 'framer-motion';

export const CosmicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-primary/5" />
      
      {/* Fractal grid overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <pattern id="fractal-grid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="hsl(var(--primary))" opacity="0.3" />
              <circle cx="0" cy="0" r="0.5" fill="hsl(var(--primary-glow))" opacity="0.2" />
              <circle cx="60" cy="0" r="0.5" fill="hsl(var(--primary-glow))" opacity="0.2" />
              <circle cx="0" cy="60" r="0.5" fill="hsl(var(--primary-glow))" opacity="0.2" />
              <circle cx="60" cy="60" r="0.5" fill="hsl(var(--primary-glow))" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fractal-grid)" />
        </svg>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, Math.random() * 10 - 5, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Sacred geometry overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5">
        <motion.svg
          width="800"
          height="800"
          viewBox="0 0 800 800"
          className="absolute"
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          {/* Flower of Life pattern */}
          <g transform="translate(400,400)">
            {Array.from({ length: 6 }).map((_, i) => (
              <circle
                key={i}
                cx={Math.cos((i * Math.PI) / 3) * 100}
                cy={Math.sin((i * Math.PI) / 3) * 100}
                r="100"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="1"
              />
            ))}
            <circle cx="0" cy="0" r="100" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
          </g>
        </motion.svg>
      </div>
    </div>
  );
};