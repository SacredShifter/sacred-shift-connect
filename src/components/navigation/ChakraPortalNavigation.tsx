import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ToggleLeft, ToggleRight, ArrowLeft, Home } from 'lucide-react';
import { useTaoFlowProgress } from '@/hooks/useTaoFlowProgress';
import { ChakraPortal } from './ChakraPortal';
import { BambooChimeGarden } from './BambooChimeGarden';
import { ChakraAudioSystem } from './ChakraAudioSystem';
import { ProgressGuidance } from '@/components/navigation/ProgressGuidance';
import { enhancedChakraData } from '@/data/enhancedChakraData';
import { taoFlowConfig, TaoModule } from '@/config/taoFlowConfig';

interface ChakraPortalNavigationProps {
  className?: string;
}

// Mapping modules to chakras based on energetic alignment
const moduleToChakraMapping = {
  // Root Chakra (Security, Foundation, Grounding)
  root: ['/dashboard', '/profile', '/settings', '/privacy', '/support'],
  
  // Sacral Chakra (Creativity, Emotion, Flow)  
  sacral: ['/journal', '/messages', '/library'],
  
  // Solar Plexus Chakra (Power, Will, Action)
  solarPlexus: ['/gaa', '/learning-3d', '/labs'],
  
  // Heart Chakra (Love, Connection, Community)
  heart: ['/circles', '/grove', '/feed', '/collective'],
  
  // Throat Chakra (Communication, Truth, Expression)
  throat: ['/codex', '/breath', '/help', '/guidebook'],
  
  // Third Eye Chakra (Intuition, Wisdom, Vision) 
  thirdEye: ['/meditation', '/constellation', '/shift'],
  
  // Crown Chakra (Spirit, Unity, Connection to Source)
  crown: ['/journey-map', '/liberation', '/ai-admin', '/hardware/pulse-fi']
};

export const ChakraPortalNavigation: React.FC<ChakraPortalNavigationProps> = ({ 
  className 
}) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'portals' | 'garden'>('garden');
  const { getAllUnlockedModules, isModuleUnlocked } = useTaoFlowProgress();
  
  // Get all available modules - NO RESTRICTIONS
  const allModules = getAllUnlockedModules();
  
  // Organize modules by chakra - ALL CHAKRAS ARE ACCESSIBLE
  const chakraModules = useMemo(() => {
    return enhancedChakraData.map((chakra) => {
      const chakraId = chakra.id.replace('Chakra', '').toLowerCase();
      const modulePaths = moduleToChakraMapping[chakraId as keyof typeof moduleToChakraMapping] || [];
      
      // Show ALL modules for each chakra - find them in the config rather than just unlocked ones
      const availableModules = modulePaths
        .map(path => allModules.find(m => m.path === path))
        .filter((module): module is TaoModule => module !== undefined);

      // Update bell unlock status based on available modules
      const updatedBells = chakra.bells.map(bell => ({
        ...bell,
        isUnlocked: true, // For now, unlock all bells
        isCompleted: isModuleUnlocked(bell.moduleId)
      }));
        
      return {
        ...chakra,
        modules: availableModules,
        bells: updatedBells,
        isUnlocked: true, // ALL chakras are always accessible
        isRecommended: chakraId === 'root' || chakraId === 'heart' // Suggest starting points
      };
    }).reverse(); // Reverse to start with Crown at top
  }, [allModules, isModuleUnlocked]);

  return (
    <div className={`relative w-full h-full bg-background overflow-hidden ${className}`}>
      <ChakraAudioSystem />
      
      {/* Navigation Controls */}
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
        {/* Back Navigation */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/protected')}
            className="bg-background/20 backdrop-blur-sm border-primary/20 hover:border-primary/40 text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Explorer
          </Button>
        </motion.div>

        {/* View Toggle */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setViewMode(prev => prev === 'portals' ? 'garden' : 'portals')}
            className="bg-background/20 backdrop-blur-sm border-primary/20 hover:border-primary/40 text-foreground"
          >
            {viewMode === 'portals' ? (
              <>
                <ToggleRight className="w-4 h-4 mr-2" />
                Garden View
              </>
            ) : (
              <>
                <ToggleLeft className="w-4 h-4 mr-2" />
                Portal View
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Navigation Views */}
      <motion.div
        key={viewMode}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {viewMode === 'portals' ? (
          <div className="relative min-h-screen bg-gradient-to-b from-background via-background/95 to-background overflow-y-auto">
            <div className="flex flex-col items-center py-20 px-4 space-y-6">
              <div className="pt-6">
                <ProgressGuidance />
              </div>
              
              <div className="max-w-md w-full space-y-6 pb-20">
                {chakraModules.map((chakra, index) => (
                  <ChakraPortal
                    key={chakra.id}
                    chakra={{
                      id: chakra.id,
                      name: chakra.name,
                      sanskrit: chakra.sanskrit,
                      position: chakra.position,
                      color: chakra.color,
                      frequency: chakra.baseFrequency,
                      element: chakra.element,
                      description: chakra.description,
                      qualities: chakra.qualities,
                      affirmation: chakra.affirmation,
                      crystals: ['Amethyst', 'Clear Quartz'], // Default values for compatibility
                      oils: ['Lavender', 'Frankincense'], // Default values for compatibility  
                      meditation: 'Focus on this chakra energy center', // Default value for compatibility
                      modules: chakra.modules,
                      isUnlocked: chakra.isUnlocked,
                      isRecommended: chakra.isRecommended
                    }}
                    modules={chakra.modules}
                    isUnlocked={true}
                    isRecommended={chakra.isRecommended}
                    delay={index * 0.1}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <BambooChimeGarden chakraModules={chakraModules} />
        )}
      </motion.div>

      {/* Sacred Geometry Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <svg className="w-full h-full" viewBox="0 0 800 600">
          {/* Flower of Life pattern */}
          <g transform="translate(400,300)">
            {Array.from({ length: 6 }, (_, i) => (
              <circle
                key={i}
                cx={Math.cos((i * Math.PI) / 3) * 60}
                cy={Math.sin((i * Math.PI) / 3) * 60}
                r="60"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            ))}
            <circle cx="0" cy="0" r="60" fill="none" stroke="currentColor" strokeWidth="1" />
          </g>
        </svg>
      </div>
    </div>
  );
};