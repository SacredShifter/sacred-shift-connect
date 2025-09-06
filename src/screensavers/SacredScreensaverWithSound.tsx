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

interface SacredScreensaverWithSoundProps {
  isActive: boolean;
  onExit: () => void;
  tagline?: string;
  safeRadiusScale?: number;
}

// Sacred frequency sounds for each screensaver
const SCREENSAVER_SOUNDS = {
  resonant_field: {
    frequency: 432, // Hz
    name: 'Resonant Field',
    description: '432Hz - The frequency of the universe'
  },
  fractal_pyramid: {
    frequency: 528, // Hz
    name: 'Ascending Temple',
    description: '528Hz - The love frequency'
  },
  chime_garden: {
    frequency: 639, // Hz
    name: 'Sonic Grove',
    description: '639Hz - Heart chakra resonance'
  },
  ether_grid: {
    frequency: 741, // Hz
    name: 'Resonance Mesh',
    description: '741Hz - Throat chakra expression'
  },
  gaia_chamber: {
    frequency: 7.83, // Hz - Schumann resonance
    name: 'Planet\'s Breath',
    description: '7.83Hz - Earth\'s heartbeat'
  }
};

// Audio context and oscillator management
class SacredAudioEngine {
  private audioContext: AudioContext | null = null;
  private oscillators: Map<string, OscillatorNode> = new Map();
  private gainNodes: Map<string, GainNode> = new Map();
  private isEnabled = true;

  constructor() {
    this.initializeAudioContext();
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.isEnabled = false;
    }
  }

  playFrequency(frequency: number, screensaverType: ScreensaverType) {
    if (!this.isEnabled || !this.audioContext) return;

    // Stop existing oscillator for this screensaver
    this.stopFrequency(screensaverType);

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = 'sine';

      // Gentle volume with fade in
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 1);

      oscillator.start();
      
      this.oscillators.set(screensaverType, oscillator);
      this.gainNodes.set(screensaverType, gainNode);
    } catch (error) {
      console.warn('Error playing frequency:', error);
    }
  }

  stopFrequency(screensaverType: ScreensaverType) {
    const oscillator = this.oscillators.get(screensaverType);
    const gainNode = this.gainNodes.get(screensaverType);

    if (oscillator && gainNode) {
      try {
        // Fade out before stopping
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext!.currentTime + 0.5);
        setTimeout(() => {
          oscillator.stop();
          oscillator.disconnect();
          gainNode.disconnect();
        }, 500);
      } catch (error) {
        console.warn('Error stopping frequency:', error);
      }
    }

    this.oscillators.delete(screensaverType);
    this.gainNodes.delete(screensaverType);
  }

  stopAll() {
    this.oscillators.forEach((_, type) => this.stopFrequency(type as ScreensaverType));
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (!enabled) {
      this.stopAll();
    }
  }
}

// Global audio engine instance
const audioEngine = new SacredAudioEngine();

// Screensaver configurations with metaphysical resonance
const SCREENSAVER_CONFIGS = {
  resonant_field: {
    name: 'Resonant Field',
    description: 'The foundational resonance field for awakening',
    component: ResonantField,
    duration: 120000, // 2 minutes
    weight: 0.3
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
    duration: 240000, // 4 minutes
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
    duration: 420000, // 7 minutes
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
      console.log('🎲 Selected screensaver:', types[i], 'Weight:', weights[i]);
      return types[i];
    }
  }
  
  console.log('🎲 Fallback to resonant_field');
  return 'resonant_field'; // Fallback
};

// Main Sacred Screensaver with Sound Component
export const SacredScreensaverWithSound: React.FC<SacredScreensaverWithSoundProps> = ({
  isActive,
  onExit,
  tagline = "The resonance field for awakening",
  safeRadiusScale = 0.25
}) => {
  const [currentType, setCurrentType] = useState<ScreensaverType>(() => selectRandomScreensaver());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionTo, setTransitionTo] = useState<ScreensaverType | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showControls, setShowControls] = useState(false);
  
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
  
  // Play sound for current screensaver
  useEffect(() => {
    if (isActive && soundEnabled) {
      const soundConfig = SCREENSAVER_SOUNDS[currentType];
      audioEngine.playFrequency(soundConfig.frequency, currentType);
    } else {
      audioEngine.stopAll();
    }
    
    return () => {
      audioEngine.stopAll();
    };
  }, [isActive, currentType, soundEnabled]);
  
  // Reset when screensaver becomes inactive
  useEffect(() => {
    if (!isActive) {
      setCurrentType(selectRandomScreensaver());
      setIsTransitioning(false);
      setTransitionTo(null);
      audioEngine.stopAll();
    }
  }, [isActive]);
  
  // Handle click to exit (only on screensaver area, not controls)
  const handleScreensaverClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest('[data-screensaver-controls]')) {
      onExit();
    }
  }, [onExit]);
  
  // Handle keyboard exit
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onExit();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);
  
  if (!isActive) {
    return null;
  }
  
  // Render transition
  if (isTransitioning && transitionTo) {
    return (
      <motion.div
        className="fixed inset-0 bg-black flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1 }}
        onClick={handleScreensaverClick}
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
            {SCREENSAVER_CONFIGS[currentType].name}
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
            {SCREENSAVER_CONFIGS[transitionTo].name}
          </motion.h2>
          <motion.p
            className="text-sm opacity-60 mt-4 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            {SCREENSAVER_CONFIGS[transitionTo].description}
          </motion.p>
        </div>
      </motion.div>
    );
  }
  
  // Render current screensaver
  const config = SCREENSAVER_CONFIGS[currentType];
  const ScreensaverComponent = config.component;
  const soundConfig = SCREENSAVER_SOUNDS[currentType];
  
  return (
    <div 
      className="fixed inset-0 bg-black z-50"
      onClick={handleScreensaverClick}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* Screensaver Component */}
      <ScreensaverComponent
        isActive={isActive}
        onExit={onExit}
        tagline={tagline}
        safeRadiusScale={safeRadiusScale}
      />
      
      {/* Floating Controls */}
      <motion.div
        data-screensaver-controls
        className="absolute top-4 right-4 z-50"
        initial={{ opacity: 0, y: -20 }}
        animate={{ 
          opacity: showControls ? 1 : 0.3,
          y: showControls ? 0 : -10
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 text-white">
          <h3 className="font-bold text-lg mb-2">{config.name}</h3>
          <p className="text-sm opacity-80 mb-3">{config.description}</p>
          
          {/* Sound Controls */}
          <div className="flex items-center space-x-3 mb-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1 rounded text-sm ${
                soundEnabled 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gray-500 hover:bg-gray-600'
              }`}
            >
              {soundEnabled ? '🔊 Sound On' : '🔇 Sound Off'}
            </button>
            <button
              onClick={() => {
                const newType = selectRandomScreensaver();
                setCurrentType(newType);
                console.log('🔄 Manual cycle to:', newType);
              }}
              className="px-3 py-1 rounded text-sm bg-blue-500 hover:bg-blue-600"
            >
              🔄 Next
            </button>
            <span className="text-xs opacity-60">
              {soundConfig.frequency}Hz
            </span>
          </div>
          
          {/* Frequency Info */}
          <div className="text-xs opacity-60">
            <p>{soundConfig.description}</p>
          </div>
          
          {/* Exit Hint */}
          <div className="mt-3 pt-3 border-t border-white/20">
            <p className="text-xs opacity-60">
              Click anywhere or press ESC to exit
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
