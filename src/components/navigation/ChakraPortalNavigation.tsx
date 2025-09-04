import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ToggleLeft, ToggleRight } from 'lucide-react';
import { useTaoFlowProgress } from '@/hooks/useTaoFlowProgress';
import { ChakraPortal } from './ChakraPortal';
import { BambooChimeGarden } from './BambooChimeGarden';
import { ChakraAudioSystem } from './ChakraAudioSystem';
import { chakraData } from '@/data/chakraData';
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
  const [viewMode, setViewMode] = useState<'portals' | 'garden'>('portals');
  const { getAllUnlockedModules, isModuleUnlocked } = useTaoFlowProgress();
  
  // Get all unlocked modules
  const unlockedModules = getAllUnlockedModules();
  
  // Organize modules by chakra - show ALL chakras for full sacred journey
  const chakraModules = useMemo(() => {
    console.log('Total chakras in data:', chakraData.length);
    const organized = chakraData.map((chakra) => {
      const chakraId = chakra.id.replace('Chakra', '').toLowerCase();
      const modulePaths = moduleToChakraMapping[chakraId as keyof typeof moduleToChakraMapping] || [];
      
      const availableModules = modulePaths
        .map(path => unlockedModules.find(m => m.path === path))
        .filter((module): module is TaoModule => module !== undefined);
        
      const result = {
        ...chakra,
        modules: availableModules,
        isUnlocked: availableModules.length > 0
      };
      
      console.log(`Chakra ${chakra.name}:`, {
        id: chakra.id,
        chakraId,
        modulePaths,
        availableModules: availableModules.length,
        isUnlocked: result.isUnlocked
      });
      
      return result;
    });
    
    console.log('Final organized chakras:', organized.length);
    // Always show all 7 chakras in the sacred journey - Crown to Root order
    return organized.reverse(); // Reverse to start with Crown at top
  }, [unlockedModules]);

  return (
    <div className={`relative w-full h-full bg-background overflow-hidden ${className}`}>
      <ChakraAudioSystem />
      
      {/* View Toggle */}
      <motion.div 
        className="absolute top-4 right-4 z-20"
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
          <div className="flex flex-col items-center justify-center min-h-screen py-8 px-4">
            <div className="max-w-md w-full space-y-6">
              {chakraModules.map((chakra, index) => (
                <ChakraPortal
                  key={chakra.id}
                  chakra={chakra}
                  modules={chakra.modules}
                  isUnlocked={chakra.isUnlocked}
                  delay={index * 0.1}
                />
              ))}
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