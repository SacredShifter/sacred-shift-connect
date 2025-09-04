import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { motion } from 'framer-motion';
import { BambooChime } from './BambooChime';
import { ChakraData } from '@/data/chakraData';
import { TaoModule } from '@/config/taoFlowConfig';

interface ChakraModuleData extends ChakraData {
  modules: TaoModule[];
  isUnlocked: boolean;
}

interface BambooChimeGardenProps {
  chakraModules: ChakraModuleData[];
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
            {/* Zen circles */}
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

      {/* 3D Bamboo Chimes */}
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Environment preset="dawn" />
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        {/* Bamboo Chimes arranged in a circle */}
        {chakraModules.map((chakra, index) => {
          const angle = (index / chakraModules.length) * Math.PI * 2;
          const radius = 4;
          const x = Math.cos(angle) * radius;
          const z = Math.sin(angle) * radius;
          const y = (index - chakraModules.length / 2) * 0.5; // Vertical spacing
          
          return (
            <BambooChime
              key={chakra.id}
              chakra={chakra}
              position={[x, y, z]}
              rotation={[0, angle + Math.PI, 0]}
            />
          );
        })}
        
        {/* Gentle ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial 
            color="hsl(var(--muted))" 
            transparent 
            opacity={0.1}
            roughness={1}
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

      {/* Garden Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-6 left-6 text-sm text-muted-foreground bg-background/20 backdrop-blur-sm rounded-xl p-4 max-w-xs"
      >
        <p className="mb-2 font-medium">🎋 Bamboo Chime Garden</p>
        <p>Click on the chimes to enter modules. Hover to hear their sacred frequencies resonate through the garden.</p>
      </motion.div>

      {/* Active Resonance Indicator */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute top-6 left-6 text-xs text-muted-foreground bg-background/20 backdrop-blur-sm rounded-xl p-3"
      >
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span>Sacred frequencies active</span>
        </div>
      </motion.div>
    </div>
  );
};