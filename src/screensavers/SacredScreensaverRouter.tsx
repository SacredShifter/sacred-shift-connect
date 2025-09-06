import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ResonantField } from './ResonantField';
import { FractalPyramidConstellation } from './FractalPyramidConstellation';
import { ChimeGardenPortal } from './ChimeGardenPortal';
import { LivingEtherGrid } from './LivingEtherGrid';
import { GaiaResonanceChamber } from './GaiaResonanceChamber';

// All available screensaver types
export type ScreensaverType = 
  | 'resonant_field'
  | 'fractal_pyramid'
  | 'chime_garden'
  | 'ether_grid'
  | 'gaia_chamber';

interface SacredScreensaverRouterProps {
  isActive: boolean;
  onExit: () => void;
  tagline?: string;
  safeRadiusScale?: number;
}

// Screensaver configurations with metaphysical resonance
const SCREENSAVER_CONFIGS = {
  resonant_field: {
    name: 'Resonant Field',
    description: 'The foundational resonance field for awakening',
    component: ResonantField,
    duration: 120000, // 2 minutes
    weight: 0.3 // Higher weight for more frequent appearance
  },
  fractal_pyramid: {
    name: 'The Ascending Temple',
    description: 'Fractal Pyramid Constellation with Metatron\'s Cube',
    component: FractalPyramidConstellation,
    duration: 180000, // 3 minutes
    weight: 0.2
  },
  chime_garden: {
    name: 'The Sonic Grove',
    description: 'Chime Garden Portal with chakra-aligned frequencies',
    component: ChimeGardenPortal,
    duration: 240000, // 4 minutes (matches 24-minute cosmic day cycle)
    weight: 0.2
  },
  ether_grid: {
    name: 'The Resonance Mesh',
    description: 'Living Ether Grid with sacred geometry sigils',
    component: LivingEtherGrid,
    duration: 150000, // 2.5 minutes
    weight: 0.15
  },
  gaia_chamber: {
    name: 'The Planet\'s Breath',
    description: 'Gaia Resonance Chamber with Schumann frequencies',
    component: GaiaResonanceChamber,
    duration: 420000, // 7 minutes (matches activation cycle)
    weight: 0.15
  }
};

// Weighted random selection for screensaver types
const selectRandomScreensaver = (): ScreensaverType => {
  const types = Object.keys(SCREENSAVER_CONFIGS) as ScreensaverType[];
  const weights = types.map(type => SCREENSAVER_CONFIGS[type].weight);
  
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (let i = 0; i < types.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return types[i];
    }
  }
  
  return 'resonant_field'; // Fallback
};

// Screensaver transition component
const ScreensaverTransition: React.FC<{
  fromType: ScreensaverType;
  toType: ScreensaverType;
  onComplete: () => void;
}> = ({ fromType, toType, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000); // 2-second transition
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <motion.div
      className="fixed inset-0 bg-black flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center text-white">
        <motion.div
          className="text-6xl mb-4"
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
        <motion.h2
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {SCREENSAVER_CONFIGS[fromType].name}
        </motion.h2>
        <motion.div
          className="text-lg opacity-80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          →
        </motion.div>
        <motion.h2
          className="text-2xl font-bold mt-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          {SCREENSAVER_CONFIGS[toType].name}
        </motion.h2>
        <motion.p
          className="text-sm opacity-60 mt-4 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {SCREENSAVER_CONFIGS[toType].description}
        </motion.p>
      </div>
    </motion.div>
  );
};

// Main Sacred Screensaver Router Component
export const SacredScreensaverRouter: React.FC<SacredScreensaverRouterProps> = ({
  isActive,
  onExit,
  tagline = "The resonance field for awakening",
  safeRadiusScale = 0.25
}) => {
  const [currentType, setCurrentType] = useState<ScreensaverType>('resonant_field');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTo, setTransitionTo] = useState<ScreensaverType | null>(null);
  
  // Cycle through screensavers
  useEffect(() => {
    if (!isActive) return;
    
    const config = SCREENSAVER_CONFIGS[currentType];
    const timer = setTimeout(() => {
      const nextType = selectRandomScreensaver();
      if (nextType !== currentType) {
        setTransitionTo(nextType);
        setIsTransitioning(true);
      }
    }, config.duration);
    
    return () => clearTimeout(timer);
  }, [isActive, currentType]);
  
  // Handle transition completion
  const handleTransitionComplete = useCallback(() => {
    if (transitionTo) {
      setCurrentType(transitionTo);
      setTransitionTo(null);
      setIsTransitioning(false);
    }
  }, [transitionTo]);
  
  // Reset to default when screensaver becomes inactive
  useEffect(() => {
    if (!isActive) {
      setCurrentType('resonant_field');
      setIsTransitioning(false);
      setTransitionTo(null);
    }
  }, [isActive]);
  
  if (!isActive) {
    return null;
  }
  
  // Render transition
  if (isTransitioning && transitionTo) {
    return (
      <ScreensaverTransition
        fromType={currentType}
        toType={transitionTo}
        onComplete={handleTransitionComplete}
      />
    );
  }
  
  // Render current screensaver
  const config = SCREENSAVER_CONFIGS[currentType];
  const ScreensaverComponent = config.component;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentType}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
      >
        <ScreensaverComponent
          isActive={isActive}
          onExit={onExit}
          tagline={tagline}
          safeRadiusScale={safeRadiusScale}
        />
      </motion.div>
    </AnimatePresence>
  );
};

// Hook for manual screensaver control
export const useSacredScreensaver = () => {
  const [isActive, setIsActive] = useState(false);
  const [currentType, setCurrentType] = useState<ScreensaverType>('resonant_field');
  
  const activateScreensaver = useCallback((type?: ScreensaverType) => {
    if (type) {
      setCurrentType(type);
    } else {
      setCurrentType(selectRandomScreensaver());
    }
    setIsActive(true);
  }, []);
  
  const deactivateScreensaver = useCallback(() => {
    setIsActive(false);
  }, []);
  
  const cycleToNext = useCallback(() => {
    const nextType = selectRandomScreensaver();
    setCurrentType(nextType);
  }, []);
  
  return {
    isActive,
    currentType,
    activateScreensaver,
    deactivateScreensaver,
    cycleToNext,
    availableTypes: Object.keys(SCREENSAVER_CONFIGS) as ScreensaverType[],
    configs: SCREENSAVER_CONFIGS
  };
};
