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

interface DebugScreensaverRouterProps {
  isActive: boolean;
  onExit: () => void;
  tagline?: string;
  safeRadiusScale?: number;
}

// Simplified screensaver configurations
const SCREENSAVER_CONFIGS = {
  resonant_field: {
    name: 'Resonant Field',
    component: ResonantField,
    weight: 0.2 // Lower weight for testing
  },
  fractal_pyramid: {
    name: 'Fractal Pyramid',
    component: FractalPyramidConstellation,
    weight: 0.2
  },
  chime_garden: {
    name: 'Chime Garden',
    component: ChimeGardenPortal,
    weight: 0.2
  },
  ether_grid: {
    name: 'Ether Grid',
    component: LivingEtherGrid,
    weight: 0.2
  },
  gaia_chamber: {
    name: 'Gaia Chamber',
    component: GaiaResonanceChamber,
    weight: 0.2
  }
};

// Simple random selection (no weights for debugging)
const selectRandomScreensaver = (): ScreensaverType => {
  const types: ScreensaverType[] = ['resonant_field', 'fractal_pyramid', 'chime_garden', 'ether_grid', 'gaia_chamber'];
  const randomIndex = Math.floor(Math.random() * types.length);
  console.log('🎲 Selected screensaver:', types[randomIndex]);
  return types[randomIndex];
};

// Main Debug Screensaver Router Component
export const DebugScreensaverRouter: React.FC<DebugScreensaverRouterProps> = ({
  isActive,
  onExit,
  tagline = "The resonance field for awakening",
  safeRadiusScale = 0.25
}) => {
  const [currentType, setCurrentType] = useState<ScreensaverType>('fractal_pyramid'); // Start with new screensaver
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Force a new screensaver selection every time
  useEffect(() => {
    if (isActive) {
      const newType = selectRandomScreensaver();
      setCurrentType(newType);
      setDebugInfo(`Current: ${SCREENSAVER_CONFIGS[newType].name}`);
      console.log('🔄 Screensaver activated:', newType);
    }
  }, [isActive]);

  if (!isActive) {
    return null;
  }

  // Render current screensaver
  const config = SCREENSAVER_CONFIGS[currentType];
  const ScreensaverComponent = config.component;

  console.log('🎨 Rendering screensaver:', currentType, 'Component:', ScreensaverComponent.name);

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Debug Info Overlay */}
      <div className="absolute top-4 left-4 z-50 bg-black/80 text-white p-4 rounded-lg">
        <h3 className="font-bold text-lg">Debug Info</h3>
        <p>Current Type: {currentType}</p>
        <p>Component: {config.name}</p>
        <p>Status: {isActive ? 'Active' : 'Inactive'}</p>
        <button 
          onClick={() => {
            const newType = selectRandomScreensaver();
            setCurrentType(newType);
            setDebugInfo(`Current: ${SCREENSAVER_CONFIGS[newType].name}`);
          }}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Force New Screensaver
        </button>
        <button 
          onClick={onExit}
          className="mt-2 ml-2 px-4 py-2 bg-red-500 text-white rounded"
        >
          Exit
        </button>
      </div>

      {/* Screensaver Component */}
      <ScreensaverComponent
        isActive={isActive}
        onExit={onExit}
        tagline={tagline}
        safeRadiusScale={safeRadiusScale}
      />
    </div>
  );
};
