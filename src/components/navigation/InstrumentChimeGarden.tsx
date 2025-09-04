import React, { useState, useMemo, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { InstrumentBell } from './InstrumentBell';
import { ParticleField } from './ParticleField';
import { EnhancedChakraData, ModuleBell } from '@/data/enhancedChakraData';
import { EnhancedChakraAudioSystem } from './EnhancedChakraAudioSystem';
import { ChakraDetailModal } from './ChakraDetailModal';

export type InstrumentMode = 'learning' | 'instrument' | 'navigation';

interface InstrumentChimeGardenProps {
  chakraModules: EnhancedChakraData[];
  mode: InstrumentMode;
  onModeChange: (mode: InstrumentMode) => void;
}

interface FlattenedBell extends ModuleBell {
  chakraId: string;
  chakraName: string;
  chakraColor: string;
  originalChakra: EnhancedChakraData;
}

export const InstrumentChimeGarden: React.FC<InstrumentChimeGardenProps> = ({ 
  chakraModules,
  mode,
  onModeChange
}) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedChakra, setSelectedChakra] = useState<EnhancedChakraData | null>(null);
  const [selectedBell, setSelectedBell] = useState<ModuleBell | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPath, setDragPath] = useState<string[]>([]);
  const [playingNotes, setPlayingNotes] = useState<Set<string>>(new Set());
  const lastPlayedRef = useRef<string | null>(null);
  
  // Flatten and sort all bells by frequency for instrument layout
  const sortedBells = useMemo(() => {
    const allBells: FlattenedBell[] = [];
    
    chakraModules.forEach(chakra => {
      chakra.bells.forEach(bell => {
        allBells.push({
          ...bell,
          chakraId: chakra.id,
          chakraName: chakra.name,
          chakraColor: chakra.color,
          originalChakra: chakra
        });
      });
    });
    
    return allBells.sort((a, b) => a.frequency - b.frequency);
  }, [chakraModules]);

  // Group bells by octave for visual organization
  const bellGroups = useMemo(() => {
    const groups: { [key: string]: FlattenedBell[] } = {};
    
    sortedBells.forEach(bell => {
      const octave = Math.floor(Math.log2(bell.frequency / 261.63)); // C4 = 261.63Hz
      const groupKey = `octave-${octave}`;
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(bell);
    });
    
    return groups;
  }, [sortedBells]);

  const handleBellClick = useCallback((bell: FlattenedBell) => {
    if (mode === 'navigation') {
      setSelectedChakra(bell.originalChakra);
      setSelectedBell(bell);
      setShowDetailModal(true);
      return;
    }

    // For learning mode, check if bell is unlocked
    if (mode === 'learning' && !bell.isUnlocked) return;

    // Play the bell sound
    window.dispatchEvent(new CustomEvent('chakra-bell', {
      detail: {
        chakraId: bell.chakraId,
        frequency: bell.frequency,
        type: 'selection',
        bellNote: bell.note,
        moduleName: bell.moduleName
      }
    }));

    // Add to playing notes for visual feedback
    setPlayingNotes(prev => new Set([...prev, bell.moduleId]));
    setTimeout(() => {
      setPlayingNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(bell.moduleId);
        return newSet;
      });
    }, 2000);
  }, [mode]);

  const handleBellHover = useCallback((bell: FlattenedBell, isEntering: boolean) => {
    if (!isEntering) return;
    
    // For learning mode, check if bell is unlocked for hover
    if (mode === 'learning' && !bell.isUnlocked) return;

    // Play hover preview
    window.dispatchEvent(new CustomEvent('chakra-bell', {
      detail: {
        chakraId: bell.chakraId,
        frequency: bell.frequency,
        type: 'hover',
        bellNote: bell.note,
        moduleName: bell.moduleName
      }
    }));
  }, [mode]);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setDragPath([]);
    lastPlayedRef.current = null;
  }, []);

  const handleDragOver = useCallback((bell: FlattenedBell) => {
    if (!isDragging) return;
    if (mode === 'learning' && !bell.isUnlocked) return;
    if (lastPlayedRef.current === bell.moduleId) return;

    // Add to drag path
    setDragPath(prev => [...prev, bell.moduleId]);
    lastPlayedRef.current = bell.moduleId;

    // Play bell as part of scale
    window.dispatchEvent(new CustomEvent('chakra-bell', {
      detail: {
        chakraId: bell.chakraId,
        frequency: bell.frequency,
        type: 'selection',
        bellNote: bell.note,
        moduleName: bell.moduleName
      }
    }));

    // Visual feedback
    setPlayingNotes(prev => new Set([...prev, bell.moduleId]));
  }, [isDragging, mode]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDragPath([]);
    lastPlayedRef.current = null;
    
    // Clear all playing notes after a delay
    setTimeout(() => {
      setPlayingNotes(new Set());
    }, 1000);
  }, []);

  // Calculate positions for harp-like layout
  const getBellPosition = useCallback((index: number, total: number): [number, number, number] => {
    const spread = 12; // Total width of the instrument
    const height = 8; // Total height range
    
    // Curved arrangement like a harp
    const x = (index / (total - 1)) * spread - spread / 2;
    const y = Math.sin((index / (total - 1)) * Math.PI * 0.3) * 2 + 
              (index / (total - 1)) * height - height / 2;
    const z = Math.cos((index / (total - 1)) * Math.PI * 0.2) * 1;
    
    return [x, y, z];
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Enhanced Zen Garden Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30"
      >
        {/* Layered zen patterns */}
        <div className="absolute inset-0 opacity-3">
          <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="zenRipples" patternUnits="userSpaceOnUse" width="120" height="120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4"/>
                <circle cx="60" cy="60" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
                <circle cx="60" cy="60" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
                <circle cx="60" cy="60" r="8" fill="currentColor" opacity="0.1"/>
              </pattern>
              <pattern id="bambooLines" patternUnits="userSpaceOnUse" width="200" height="200">
                <path d="M0,100 Q50,80 100,100 T200,100" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.1"/>
                <path d="M0,120 Q50,100 100,120 T200,120" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.05"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#zenRipples)" />
            <rect width="100%" height="100%" fill="url(#bambooLines)" />
          </svg>
        </div>
        
        {/* Flowing particles */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-primary/20 rounded-full"
              animate={{
                x: [0, window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 20
              }}
              style={{
                left: -4,
                top: Math.random() * window.innerHeight
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Mode Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="absolute top-20 left-6 right-6 z-20"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="bg-background/20 backdrop-blur-sm rounded-xl p-4 max-w-md">
            <h3 className="font-medium flex items-center mb-2">
              🎶 {mode === 'instrument' ? 'Instrument Mode' : mode === 'learning' ? 'Learning Mode' : 'Navigation Mode'}
            </h3>
            <p className="text-sm text-muted-foreground">
              {mode === 'instrument' && "All bells playable • Click or drag across bells to play melodies"}
              {mode === 'learning' && "Progress-gated • Only unlocked bells are playable"}
              {mode === 'navigation' && "Click bells to open module details and navigate"}
            </p>
          </div>
          
          {/* Scale Guide */}
          <div className="bg-background/20 backdrop-blur-sm rounded-xl p-3">
            <p className="text-xs text-muted-foreground mb-1">Frequency Range</p>
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-primary">{sortedBells[0]?.frequency}Hz</span>
              <div className="w-8 h-0.5 bg-gradient-to-r from-primary to-accent"></div>
              <span className="text-accent">{sortedBells[sortedBells.length - 1]?.frequency}Hz</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3D Instrument Canvas */}
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        style={{ position: 'absolute', inset: 0 }}
        onPointerUp={handleDragEnd}
      >
        <Environment preset="dawn" />
        <ambientLight intensity={0.4} />
        <pointLight position={[8, 5, 8]} intensity={0.8} />
        <pointLight position={[-8, -5, 8]} intensity={0.6} color="#9966CC" />
        <pointLight position={[0, 8, -5]} intensity={0.5} color="#FFD700" />
        
        {/* Enhanced Floating Particles */}
        <ParticleField count={150} radius={20} color="#ffffff" opacity={0.2} speed={0.1} />
        <ParticleField count={80} radius={25} color="#9966CC" opacity={0.3} speed={0.3} />
        <ParticleField count={60} radius={30} color="#FFD700" opacity={0.4} speed={0.5} />

        {/* Instrument Bells Layout */}
        {sortedBells.map((bell, index) => {
          const position = getBellPosition(index, sortedBells.length);
          const isPlaying = playingNotes.has(bell.moduleId);
          const isDragPath = dragPath.includes(bell.moduleId);
          const isAccessible = mode === 'instrument' || bell.isUnlocked;
          
          return (
            <InstrumentBell
              key={`${bell.chakraId}-${bell.moduleId}`}
              bell={bell}
              position={position}
              isPlaying={isPlaying}
              isDragPath={isDragPath}
              isAccessible={isAccessible}
              mode={mode}
              onClick={() => handleBellClick(bell)}
              onHover={(isEntering) => handleBellHover(bell, isEntering)}
              onDragStart={handleDragStart}
              onDragOver={() => handleDragOver(bell)}
            />
          );
        })}

        {/* Connecting Flow Lines */}
        {mode !== 'navigation' && (
          <group>
            {sortedBells.slice(0, -1).map((bell, index) => {
              const startPos = getBellPosition(index, sortedBells.length);
              const endPos = getBellPosition(index + 1, sortedBells.length);
              
              return (
                <line key={`connection-${index}`}>
                  <bufferGeometry>
                    <bufferAttribute
                      attach="attributes-position"
                      count={2}
                      array={new Float32Array([...startPos, ...endPos])}
                      itemSize={3}
                    />
                  </bufferGeometry>
                  <lineBasicMaterial 
                    color={sortedBells[index].chakraColor} 
                    transparent 
                    opacity={0.2} 
                  />
                </line>
              );
            })}
          </group>
        )}
        
        {/* Sacred Ground Platform */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -8, 0]}>
          <circleGeometry args={[20, 64]} />
          <meshStandardMaterial 
            color="hsl(var(--muted))" 
            transparent 
            opacity={0.1}
            roughness={0.9}
          />
        </mesh>
        
        <OrbitControls 
          enablePan={false}
          minDistance={10}
          maxDistance={25}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.4}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI - Math.PI / 8}
        />
      </Canvas>

      {/* Enhanced Audio System */}
      <EnhancedChakraAudioSystem 
        volume={0.5} 
        enableAmbient={true}
        enableNatureSounds={true}
      />

      {/* Progress & Note Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-6 right-6 z-20"
      >
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          {/* Currently Playing */}
          <div className="bg-background/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
            <p className="text-sm font-medium mb-2">🎵 Currently Playing</p>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {Array.from(playingNotes).map(noteId => {
                const bell = sortedBells.find(b => b.moduleId === noteId);
                return bell ? (
                  <div key={noteId} className="flex items-center space-x-2 text-xs">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: bell.chakraColor }}
                    />
                    <span className="text-foreground">{bell.note}</span>
                    <span className="text-muted-foreground">{bell.frequency}Hz</span>
                  </div>
                ) : null;
              })}
              {playingNotes.size === 0 && (
                <p className="text-xs text-muted-foreground">Hover or click bells to play</p>
              )}
            </div>
          </div>

          {/* Scale Information */}
          <div className="bg-background/20 backdrop-blur-sm rounded-xl p-4">
            <p className="text-sm font-medium mb-2">🎼 Instrument Scale</p>
            <div className="grid grid-cols-4 gap-1">
              {sortedBells.slice(0, 12).map(bell => (
                <div 
                  key={bell.moduleId}
                  className="text-xs text-center p-1 rounded"
                  style={{ 
                    backgroundColor: `${bell.chakraColor}20`,
                    color: bell.chakraColor 
                  }}
                >
                  {bell.note}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detail Modal for Navigation Mode */}
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