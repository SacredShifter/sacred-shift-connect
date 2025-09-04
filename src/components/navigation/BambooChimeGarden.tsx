import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChakraColumn } from './ChakraColumn';
import { ChakraProgressSpine } from './ChakraProgressSpine';
import { ParticleField } from './ParticleField';
import { EnhancedChakraData, ModuleBell } from '@/data/enhancedChakraData';
import { EnhancedChakraAudioSystem } from './EnhancedChakraAudioSystem';
import { ChakraDetailModal } from './ChakraDetailModal';
import { InstrumentChimeGarden, InstrumentMode } from './InstrumentChimeGarden';
import { InstrumentModeToggle } from './InstrumentModeToggle';

interface BambooChimeGardenProps {
  chakraModules: EnhancedChakraData[];
}

type GardenView = 'traditional' | 'instrument';

export const BambooChimeGarden: React.FC<BambooChimeGardenProps> = ({ 
  chakraModules 
}) => {
  const navigate = useNavigate();
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedChakra, setSelectedChakra] = useState<EnhancedChakraData | null>(null);
  const [selectedBell, setSelectedBell] = useState<ModuleBell | null>(null);
  const [strikeRipples, setStrikeRipples] = useState<Array<{ id: string; chakraId: string; position: [number, number, number] }>>([]);
  const [gardenView, setGardenView] = useState<GardenView>('traditional');
  const [instrumentMode, setInstrumentMode] = useState<InstrumentMode>('navigation');

  // Mapping modules to chakras based on energetic alignment
  const moduleToChakraMapping: Record<string, string[]> = {
    root: ['/dashboard', '/profile', '/settings', '/privacy', '/support'],
    sacral: ['/journal', '/messages', '/library'],
    'solar-plexus': ['/gaa', '/learning-3d', '/labs'],
    heart: ['/circles', '/grove', '/feed', '/collective'],
    throat: ['/codex', '/breath', '/help', '/guidebook'],
    'third-eye': ['/meditation', '/constellation', '/shift'],
    crown: ['/journey-map', '/liberation', '/ai-admin', '/hardware/pulse-fi']
  };

  const handleBellClick = (chakra: EnhancedChakraData, bell: ModuleBell) => {
    // Show modal with details for bell interactions
    setSelectedChakra(chakra);
    setSelectedBell(bell);
    setShowDetailModal(true);
    
    // Create ripple effect
    const rippleId = Math.random().toString(36).substr(2, 9);
    setStrikeRipples(prev => [...prev, {
      id: rippleId,
      chakraId: chakra.id,
      position: [0, getChakraYPosition(chakra.id), 0]
    }]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setStrikeRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 2000);
  };

  // Calculate vertical positions for chakras (Root → Crown)
  const getChakraYPosition = (chakraId: string) => {
    const chakraOrder = ['root', 'sacral', 'solar-plexus', 'heart', 'throat', 'third-eye', 'crown'];
    const index = chakraOrder.indexOf(chakraId);
    return (index - 3) * 2.5; // Center heart chakra at 0, spread 2.5 units apart
  };

  // Get completed chakras for progress tracking
  const getCompletedChakras = () => {
    return chakraModules.filter(chakra => 
      chakra.bells.some(bell => bell.isCompleted)
    ).map(chakra => chakra.id);
  };
  // Toggle between traditional and instrument views
  if (gardenView === 'instrument') {
    return (
      <div className="relative w-full h-full">
        {/* Garden View Toggle */}
        <div className="absolute top-4 left-4 right-4 z-30 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-background/20 backdrop-blur-sm rounded-xl p-2 border border-primary/20"
          >
            <button
              onClick={() => setGardenView('traditional')}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              🎋 Traditional View
            </button>
          </motion.div>

          <InstrumentModeToggle
            currentMode={instrumentMode}
            onModeChange={setInstrumentMode}
          />
        </div>

        <InstrumentChimeGarden
          chakraModules={chakraModules}
          mode={instrumentMode}
          onModeChange={setInstrumentMode}
        />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {/* Garden View Toggle */}
      <div className="absolute top-4 left-4 z-30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-background/20 backdrop-blur-sm rounded-xl p-2 border border-primary/20"
        >
          <button
            onClick={() => setGardenView('instrument')}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            🎶 Instrument View
          </button>
        </motion.div>
      </div>

      {/* Chakra Headers - Fixed positioning above 3D canvas */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {chakraModules.map((chakra, index) => {
          const yPercent = 50 + (getChakraYPosition(chakra.id) / 10) * 30; // Convert 3D Y to screen %
          const isCompleted = chakra.bells.some(bell => bell.isCompleted);
          
          return (
            <motion.div
              key={`header-${chakra.id}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2, duration: 0.8 }}
              className="absolute left-8"
              style={{ top: `${yPercent}%`, transform: 'translateY(-50%)' }}
            >
              <div 
                className="flex items-center space-x-3 px-4 py-2 rounded-full bg-background/20 backdrop-blur-sm border"
                style={{ 
                  borderColor: chakra.color + '40',
                  boxShadow: isCompleted ? `0 0 20px ${chakra.color}40` : 'none'
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full animate-pulse"
                  style={{ 
                    backgroundColor: chakra.color,
                    boxShadow: `0 0 10px ${chakra.color}`
                  }}
                />
                <div>
                  <h3 className="text-sm font-medium text-foreground">{chakra.name}</h3>
                  <p className="text-xs text-muted-foreground">{chakra.sanskrit}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Zen Garden Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/20"
      >
        {/* Subtle patterns */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 1200 800">
            <defs>
              <pattern id="zenRipples" patternUnits="userSpaceOnUse" width="200" height="200">
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
                <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#zenRipples)" />
          </svg>
        </div>
      </motion.div>

      {/* 3D Vertical Chakra Garden */}
      <Canvas
        camera={{ position: [4, 0, 12], fov: 50 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Environment preset="dawn" />
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 5, 8]} intensity={0.8} />
        <pointLight position={[-5, 0, 5]} intensity={0.6} color="#9966CC" />
        <pointLight position={[0, 8, 0]} intensity={0.5} color="#FFD700" />
        
        {/* Floating Particles */}
        <ParticleField count={100} radius={15} color="#ffffff" opacity={0.3} speed={0.2} />
        <ParticleField count={60} radius={20} color="#9966CC" opacity={0.4} speed={0.4} />
        <ParticleField count={40} radius={25} color="#FFD700" opacity={0.6} speed={0.6} />

        {/* Chakra Progress Spine */}
        <ChakraProgressSpine 
          chakras={chakraModules}
          completedChakras={getCompletedChakras()}
          getYPosition={getChakraYPosition}
        />

        {/* Vertical Chakra Columns */}
        {chakraModules.map((chakra, index) => {
          const yPosition = getChakraYPosition(chakra.id);
          
          return (
            <ChakraColumn
              key={chakra.id}
              chakra={chakra}
              position={[0, yPosition, 0]}
              onBellClick={handleBellClick}
              strikeRipples={strikeRipples.filter(r => r.chakraId === chakra.id)}
            />
          );
        })}
        
        {/* Sacred Ground Platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
          <circleGeometry args={[30, 64]} />
          <meshStandardMaterial 
            color="hsl(var(--muted))" 
            transparent 
            opacity={0.08}
            roughness={0.9}
          />
        </mesh>
        
        <OrbitControls 
          enablePan={false}
          minDistance={8}
          maxDistance={20}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.3}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
        />
      </Canvas>

      {/* Enhanced Audio System */}
      <EnhancedChakraAudioSystem 
        volume={0.4} 
        enableAmbient={true}
        enableNatureSounds={true}
      />

      {/* Enhanced Garden Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-6 text-sm text-muted-foreground bg-background/20 backdrop-blur-sm rounded-xl p-4 max-w-sm"
      >
        <p className="mb-2 font-medium flex items-center">
          🎋 Vertical Chime Garden
          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded">Reorganized</span>
        </p>
        <p className="mb-2">Chakras align vertically from Root to Crown. Each bell represents one frequency.</p>
        <p className="text-xs opacity-80">Hover bells for frequency info, click to navigate to modules. Watch ripples flow upward as you progress.</p>
      </motion.div>

      {/* Progress Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
        className="absolute bottom-6 right-6 text-sm bg-background/20 backdrop-blur-sm rounded-xl p-4"
      >
        <p className="font-medium text-foreground mb-2">🌟 Progress</p>
        <div className="space-y-1">
          {chakraModules.map(chakra => {
            const completed = chakra.bells.filter(bell => bell.isCompleted).length;
            const total = chakra.bells.length;
            return (
              <div key={chakra.id} className="flex items-center space-x-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: completed > 0 ? chakra.color : '#555' }}
                />
                <span className="text-muted-foreground">{chakra.name}: {completed}/{total}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {showDetailModal && selectedChakra && selectedBell && (
          <ChakraDetailModal
            isOpen={showDetailModal}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedChakra(null);
              setSelectedBell(null);
            }}
            chakra={selectedChakra}
            bell={selectedBell}
          />
        )}
      </AnimatePresence>
    </div>
  );
};