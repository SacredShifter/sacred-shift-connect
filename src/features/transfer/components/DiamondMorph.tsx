// DiamondMorph Component
// Visualizes the living geometry transformation from circle to diamond with inner core

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface DiamondMorphProps {
  withInner?: boolean;
  fluid?: boolean;
  size?: number;
  className?: string;
  phase?: "circle" | "stretched" | "diamond" | "diamond+core";
  animate?: boolean;
}

export default function DiamondMorph({ 
  withInner = true, 
  fluid = true, 
  size = 128,
  className = "",
  phase = "diamond",
  animate = true
}: DiamondMorphProps) {
  const [currentPhase, setCurrentPhase] = useState(phase);

  useEffect(() => {
    if (animate && phase !== currentPhase) {
      const timer = setTimeout(() => setCurrentPhase(phase), 100);
      return () => clearTimeout(timer);
    }
  }, [phase, animate, currentPhase]);

  // Define points for different phases
  const getPoints = (phase: string) => {
    switch (phase) {
      case "circle":
        return "50,10 50,10 50,10 50,10"; // Degenerate circle
      case "stretched":
        return "50,15 75,50 50,85 25,50"; // Stretched diamond
      case "diamond":
        return "50,10 90,50 50,90 10,50"; // Full diamond
      case "diamond+core":
        return "50,10 90,50 50,90 10,50"; // Diamond with inner core
      default:
        return "50,10 90,50 50,90 10,50";
    }
  };

  const getInnerPoints = (phase: string) => {
    switch (phase) {
      case "circle":
        return "50,20 50,20 50,20 50,20"; // Degenerate inner
      case "stretched":
        return "50,25 65,50 50,75 35,50"; // Stretched inner
      case "diamond":
        return "50,20 80,50 50,80 20,50"; // Inner diamond
      case "diamond+core":
        return "50,20 80,50 50,80 20,50"; // Inner diamond with core
      default:
        return "50,20 80,50 50,80 20,50";
    }
  };

  const getScale = (phase: string) => {
    switch (phase) {
      case "circle":
        return 0.1;
      case "stretched":
        return 0.6;
      case "diamond":
        return 0.8;
      case "diamond+core":
        return 1.0;
      default:
        return 1.0;
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
        {/* Outer diamond */}
        <motion.polygon
          initial={{ points: getPoints("circle") }}
          animate={{ 
            points: getPoints(currentPhase),
            scale: getScale(currentPhase)
          }}
          transition={{ 
            duration: 1.5,
            ease: "easeInOut"
          }}
          points={getPoints(currentPhase)}
          className="fill-transparent stroke-current"
          strokeWidth={2}
          style={{ 
            filter: fluid ? "drop-shadow(0 0 4px currentColor)" : "none"
          }}
        />
        
        {/* Inner core */}
        {withInner && (currentPhase === "diamond" || currentPhase === "diamond+core") && (
          <motion.polygon
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: fluid ? [0.6, 0.7, 0.6] : 0.65,
              opacity: 0.85
            }}
            transition={{ 
              duration: fluid ? 4 : 0.5,
              repeat: fluid ? Infinity : 0,
              ease: "easeInOut"
            }}
            points={getInnerPoints(currentPhase)}
            className="fill-current"
            style={{ 
              filter: "drop-shadow(0 0 2px currentColor)"
            }}
          />
        )}

        {/* Core center dot for diamond+core phase */}
        {currentPhase === "diamond+core" && (
          <motion.circle
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: fluid ? [0.8, 1.2, 0.8] : 1,
              opacity: 0.9
            }}
            transition={{ 
              duration: fluid ? 3 : 0.5,
              repeat: fluid ? Infinity : 0,
              ease: "easeInOut"
            }}
            cx="50"
            cy="50"
            r="3"
            className="fill-current"
            style={{ 
              filter: "drop-shadow(0 0 3px currentColor)"
            }}
          />
        )}

        {/* Fluid motion overlay */}
        {fluid && (
          <motion.circle
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            cx="50"
            cy="50"
            r="45"
            className="fill-transparent stroke-current"
            strokeWidth={1}
            style={{ 
              filter: "blur(1px)"
            }}
          />
        )}
      </svg>
    </div>
  );
}
