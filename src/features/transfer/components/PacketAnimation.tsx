// PacketAnimation Component
// Visualizes data/oxygen packets flowing through a medium (wind/mesh)

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface PacketAnimationProps {
  packetCount?: number;
  speed?: number;
  size?: "sm" | "md" | "lg";
  direction?: "left-to-right" | "right-to-left" | "circular";
  className?: string;
  color?: string;
}

export default function PacketAnimation({ 
  packetCount = 12,
  speed = 1,
  size = "md",
  direction = "left-to-right",
  className = "",
  color = "currentColor"
}: PacketAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-1 h-1";
      case "md":
        return "w-2 h-2";
      case "lg":
        return "w-3 h-3";
      default:
        return "w-2 h-2";
    }
  };

  const getAnimationVariants = () => {
    switch (direction) {
      case "left-to-right":
        return {
          initial: { x: -20, opacity: 0 },
          animate: { x: "100%", opacity: [0, 1, 0] },
          transition: { duration: 3 / speed, ease: "easeInOut" }
        };
      case "right-to-left":
        return {
          initial: { x: "100%", opacity: 0 },
          animate: { x: -20, opacity: [0, 1, 0] },
          transition: { duration: 3 / speed, ease: "easeInOut" }
        };
      case "circular":
        return {
          initial: { rotate: 0, scale: 0.8 },
          animate: { rotate: 360, scale: [0.8, 1.2, 0.8] },
          transition: { duration: 4 / speed, ease: "easeInOut" }
        };
      default:
        return {
          initial: { x: -20, opacity: 0 },
          animate: { x: "100%", opacity: [0, 1, 0] },
          transition: { duration: 3 / speed, ease: "easeInOut" }
        };
    }
  };

  const getContainerClasses = () => {
    switch (direction) {
      case "circular":
        return "relative w-16 h-16 rounded-full border border-current/20";
      default:
        return "relative h-16 overflow-hidden";
    }
  };

  const getPacketPosition = (index: number) => {
    if (direction === "circular") {
      const angle = (index / packetCount) * 360;
      const radius = 20;
      const x = 50 + radius * Math.cos((angle * Math.PI) / 180);
      const y = 50 + radius * Math.sin((angle * Math.PI) / 180);
      return { x, y };
    } else {
      const progress = (index / packetCount) * 100;
      return { x: `${progress}%`, y: "50%" };
    }
  };

  const variants = getAnimationVariants();

  return (
    <div className={`${getContainerClasses()} ${className}`}>
      {[...Array(packetCount)].map((_, i) => {
        const position = getPacketPosition(i);
        const delay = (i / packetCount) * 2;

        return (
          <motion.div
            key={i}
            className={`absolute ${getSizeClasses()} rounded-full`}
            style={{
              backgroundColor: color,
              left: direction === "circular" ? `${position.x}%` : position.x,
              top: direction === "circular" ? `${position.y}%` : position.y,
              transform: direction === "circular" ? "translate(-50%, -50%)" : "translateY(-50%)"
            }}
            initial={variants.initial}
            animate={isAnimating ? variants.animate : variants.initial}
            transition={{
              ...variants.transition,
              delay: delay,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        );
      })}

      {/* Flow indicator for non-circular directions */}
      {direction !== "circular" && (
        <motion.div
          className="absolute inset-y-0 left-0 right-0 border-t border-current/10"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Center dot for circular direction */}
      {direction === "circular" && (
        <motion.div
          className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-current/50"
          style={{ transform: "translate(-50%, -50%)" }}
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </div>
  );
}
