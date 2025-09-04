import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { BambooChime } from './BambooChime';
import { ParticleField } from './ParticleField';
import { EnhancedChakraData } from '@/data/enhancedChakraData';
import { EnhancedChakraAudioSystem } from './EnhancedChakraAudioSystem';

interface BambooChimeGardenProps {
  chakraModules: EnhancedChakraData[];
}

export const BambooChimeGarden: React.FC<BambooChimeGardenProps> = ({ 
  chakraModules 
}) => {
  return (
    <div className="relative w-full h-full">
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

      {/* 3D Enhanced Bamboo Garden */}
      <Canvas
        camera={{ position: [0, 2, 10], fov: 50 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Environment preset="dawn" />
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={0.6} />
        <pointLight position={[-10, 5, -5]} intensity={0.4} color="#9966CC" />
        
        {/* Floating Particles */}
        <ParticleField count={150} radius={12} color="#ffffff" opacity={0.4} speed={0.3} />
        <ParticleField count={80} radius={8} color="#9966CC" opacity={0.6} speed={0.5} />
        <ParticleField count={30} radius={15} color="#FFD700" opacity={0.8} speed={1.2} />

        {/* Sacred Bamboo Chimes */}
        {chakraModules.map((chakra, index) => {
          const angle = (index / chakraModules.length) * Math.PI * 2;
          const radius = 5;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (index - chakraModules.length / 2) * 0.4;
          
          return (
            <BambooChime
              key={chakra.id}
              chakra={chakra}
              position={[x, y, z]}
              rotation={[0, angle + Math.PI, 0]}
            />
          );
        })}
        
        {/* Sacred Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.5, 0]}>
          <circleGeometry args={[25, 64]} />
          <meshStandardMaterial 
            color="hsl(var(--muted))" 
            transparent 
            opacity={0.05}
            roughness={0.8}
          />
        </mesh>
        
        <OrbitControls 
          enablePan={false}
          minDistance={6}
          maxDistance={12}
          enableDamping
          dampingFactor={0.05}
          rotateSpeed={0.5}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* Enhanced Audio System */}
      <EnhancedChakraAudioSystem 
        volume={0.4} 
        enableAmbient={true}
        enableNatureSounds={true}
      />

      {/* Chakra Labels Overlay */}
      {chakraModules.map((chakra, index) => {
        const angle = (index / chakraModules.length) * Math.PI * 2;
        const radius = 5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        // Convert 3D position to screen position (approximate)
        const screenX = 50 + (x / 10) * 30; // Rough conversion to percentage
        const screenY = 50 - (z / 10) * 30; // Rough conversion to percentage
        
        return (
          <motion.div
            key={`label-${chakra.id}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
            className="absolute text-center z-10 pointer-events-none"
            style={{
              left: `${screenX}%`,
              top: `${screenY}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-primary/20">
              <h3 className="text-sm font-medium text-foreground">{chakra.name}</h3>
              <p className="text-xs text-muted-foreground">{chakra.sanskrit}</p>
              <div className="text-xs text-primary space-y-1">
                {chakra.bells.map(bell => (
                  <div key={bell.moduleId} className={`${bell.isUnlocked ? 'text-primary' : 'text-muted-foreground'}`}>
                    {bell.moduleName} ({bell.note} - {bell.frequency}Hz)
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Enhanced Garden Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-6 text-sm text-muted-foreground bg-background/20 backdrop-blur-sm rounded-xl p-4 max-w-sm"
      >
        <p className="mb-2 font-medium flex items-center">
          🎋 Sacred Chime Garden
          <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-1 rounded">Enhanced</span>
        </p>
        <p className="mb-2">Each chakra contains multiple practice bells tuned to specific frequencies.</p>
        <p className="text-xs opacity-80">Click individual bells to practice modules and record reflections in your Sacred Journal.</p>
      </motion.div>
    </div>
  );
};