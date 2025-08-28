import React from 'react';
import { motion } from 'framer-motion';
import { useBreathingTool } from '@/hooks/useBreathingTool';
import { Card, CardContent } from '@/components/ui/card';

interface BreathingVisualizerProps {
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  className?: string;
}

export const BreathingVisualizer = ({ 
  size = 'md', 
  showLabels = true,
  className = '' 
}: BreathingVisualizerProps) => {
  const { 
    isActive, 
    currentPhase, 
    currentPreset, 
    timeRemaining, 
    cycleCount,
    getPhaseLabel,
    getPhaseMessage 
  } = useBreathingTool();

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const getOrbScale = () => {
    if (!isActive) return 1;
    
    switch (currentPhase) {
      case 'inhale': return 1.4;
      case 'hold1': return 1.4;
      case 'exhale': return 0.6;
      case 'hold2': return 0.6;
      default: return 1;
    }
  };

  const getOrbOpacity = () => {
    if (!isActive) return 0.6;
    
    switch (currentPhase) {
      case 'inhale': return 0.9;
      case 'hold1': return 0.9;
      case 'exhale': return 0.4;
      case 'hold2': return 0.4;
      default: return 0.6;
    }
  };

  const getGradient = () => {
    switch (currentPhase) {
      case 'inhale': return 'from-emerald-400 via-teal-400 to-cyan-400';
      case 'hold1': return 'from-blue-400 via-indigo-400 to-purple-400';
      case 'exhale': return 'from-orange-400 via-red-400 to-pink-400';
      case 'hold2': return 'from-gray-400 via-gray-500 to-gray-600';
      default: return 'from-emerald-400 via-teal-400 to-cyan-400';
    }
  };

  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      {/* Main breathing orb */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: getOrbScale(),
            opacity: getOrbOpacity()
          }}
          transition={{
            duration: isActive ? currentPreset[currentPhase] : 2,
            ease: "easeInOut"
          }}
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            bg-gradient-to-br ${getGradient()}
            backdrop-blur-sm 
            border 
            border-white/20 
            shadow-2xl
            flex 
            items-center 
            justify-center
            relative
          `}
        >
          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full bg-white/20 blur-sm" />
          
          {/* Timer display */}
          {isActive && timeRemaining > 0 && (
            <div className="relative z-10 text-center">
              <div className="text-white font-bold text-sm">
                {Math.ceil(timeRemaining / 1000)}s
              </div>
            </div>
          )}
          
          {/* Cycle count when not in active phase */}
          {!isActive && cycleCount > 0 && (
            <div className="relative z-10 text-center">
              <div className="text-white font-bold text-xs">
                {cycleCount}
              </div>
              <div className="text-white/80 text-xs">
                cycles
              </div>
            </div>
          )}
        </motion.div>

        {/* Breathing rings */}
        {isActive && (
          <>
            {[1, 2, 3].map((ring) => (
              <motion.div
                key={ring}
                animate={{
                  scale: currentPhase === 'inhale' || currentPhase === 'hold1' ? 
                    1 + (ring * 0.2) : 0.8 + (ring * 0.1),
                  opacity: 0.3 - (ring * 0.1)
                }}
                transition={{
                  duration: currentPreset[currentPhase],
                  ease: "easeInOut",
                  delay: ring * 0.1
                }}
                className="absolute inset-0 rounded-full border border-white/30"
                style={{
                  width: `${100 + ring * 25}%`,
                  height: `${100 + ring * 25}%`,
                }}
              />
            ))}
          </>
        )}
      </div>

      {/* Phase labels */}
      {showLabels && (
        <div className="text-center space-y-1">
          {isActive ? (
            <>
              <div className="text-sm font-medium text-primary">
                {getPhaseLabel(currentPhase)}
              </div>
              <div className="text-xs text-muted-foreground italic">
                {getPhaseMessage(currentPhase)}
              </div>
            </>
          ) : (
            <div className="text-sm text-muted-foreground">
              {cycleCount > 0 ? `${cycleCount} cycles completed` : 'Ready to begin'}
            </div>
          )}
        </div>
      )}

      {/* Preset info */}
      {showLabels && (
        <div className="text-center">
          <div className="text-xs text-muted-foreground">
            {currentPreset.name} • {currentPreset.inhale}:{currentPreset.hold1}:{currentPreset.exhale}:{currentPreset.hold2}
          </div>
        </div>
      )}
    </div>
  );
};