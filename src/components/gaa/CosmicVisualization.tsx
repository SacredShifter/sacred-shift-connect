/**
 * Cosmic Visualization - Advanced 3D cosmic data integration
 * Renders firmament, shadow dome, and celestial mechanics
 */
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { Vector3, Mesh, Group } from 'three';
import { useIsMobile } from '@/hooks/use-mobile';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Telescope, Globe, Eye, Zap } from 'lucide-react';
import { CosmicStructure } from '@/utils/cosmic/CosmicDataStream';

interface CosmicVisualizationProps {
  cosmicData: CosmicStructure[];
  shadowEngineState: any;
  isActive: boolean;
  onStructureSelect?: (structure: CosmicStructure) => void;
}

// Firmament Dome Component
const FirmamentDome: React.FC<{ radius: number; opacity: number }> = ({ radius, opacity }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = opacity * 0.3;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 32, 16]} />
      <meshBasicMaterial 
        color="#4A90E2" 
        wireframe 
        transparent 
        opacity={opacity * 0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Shadow Dome Component  
const ShadowDome: React.FC<{ radius: number; intensity: number }> = ({ radius, intensity }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y -= 0.002;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = intensity * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius * 0.8, 16, 8]} />
      <meshBasicMaterial 
        color="#8B0000" 
        wireframe 
        transparent 
        opacity={intensity * 0.2}
        side={THREE.BackSide}
      />
    </mesh>
  );
};

// Cosmic Structure Point
const CosmicPoint: React.FC<{ 
  structure: CosmicStructure; 
  position: Vector3;
  isSelected: boolean;
  onClick: () => void;
}> = ({ structure, position, isSelected, onClick }) => {
  const meshRef = useRef<Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.scale.setScalar(
        isSelected ? 1.5 + Math.sin(time * 3) * 0.3 : 1
      );
    }
  });

  const getColorByType = (type: string) => {
    switch (type) {
      case 'galaxy': return '#E6E6FA';
      case 'quasar': return '#FFD700';
      case 'nebula': return '#FF69B4';
      case 'cluster': return '#00CED1';
      default: return '#FFFFFF';
    }
  };

  return (
    <mesh 
      ref={meshRef}
      position={position}
      onClick={onClick}
    >
      <sphereGeometry args={[0.05, 8, 6]} />
      <meshBasicMaterial 
        color={getColorByType(structure.type)}
        transparent
        opacity={isSelected ? 1 : 0.7}
      />
      {isSelected && (
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {structure.name}
        </Text>
      )}
    </mesh>
  );
};

// Main 3D Scene
const CosmicScene: React.FC<{
  cosmicData: CosmicStructure[];
  shadowEngineState: any;
  onStructureSelect?: (structure: CosmicStructure) => void;
}> = ({ cosmicData, shadowEngineState, onStructureSelect }) => {
  const [selectedStructure, setSelectedStructure] = useState<CosmicStructure | null>(null);
  const groupRef = useRef<Group>(null);
  const isMobile = useIsMobile();

  const handleStructureClick = (structure: CosmicStructure) => {
    setSelectedStructure(structure);
    onStructureSelect?.(structure);
  };

  // Convert cosmic coordinates to 3D positions
  const getStructurePosition = (structure: CosmicStructure): Vector3 => {
    const distance = Math.log((structure.coordinates.distance || 1000) + 1) * 2;
    const phi = (structure.coordinates?.rightAscension || 0) * Math.PI / 180;
    const theta = (structure.coordinates?.declination || 0) * Math.PI / 180;
    
    return new Vector3(
      distance * Math.cos(theta) * Math.cos(phi),
      distance * Math.sin(theta),
      distance * Math.cos(theta) * Math.sin(phi)
    );
  };

  return (
    <group ref={groupRef}>
      {/* Background stars */}
      <Stars radius={50} depth={50} count={isMobile ? 500 : 1000} factor={4} saturation={0} fade />
      
      {/* Firmament dome */}
      <FirmamentDome 
        radius={25} 
        opacity={shadowEngineState?.firmamentPhase || 0.5} 
      />
      
      {/* Shadow dome */}
      <ShadowDome 
        radius={25} 
        intensity={shadowEngineState?.shadowIntensity || 0.3} 
      />
      
      {/* Cosmic structures */}
      {cosmicData.map((structure, index) => (
        <CosmicPoint
          key={index}
          structure={structure}
          position={getStructurePosition(structure)}
          isSelected={selectedStructure?.name === structure.name}
          onClick={() => handleStructureClick(structure)}
        />
      ))}
      
      {/* Central origin point */}
      <mesh>
        <sphereGeometry args={[0.1, 16, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  );
};

export const CosmicVisualization: React.FC<CosmicVisualizationProps> = ({
  cosmicData,
  shadowEngineState,
  isActive,
  onStructureSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: isActive ? 1 : 0.5, scale: isActive ? 1 : 0.95 }}
      className="w-full h-full"
    >
      <Card className="h-full">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Telescope className="w-4 h-4 text-blue-400" />
            Cosmic Visualization
            <Badge variant="outline">
              {cosmicData.length} Structures
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-2">
          <div className="w-full h-96 rounded-lg overflow-hidden border border-border">
            <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
              <ambientLight intensity={0.3} />
              <pointLight position={[10, 10, 10]} intensity={0.5} />
              <CosmicScene 
                cosmicData={cosmicData}
                shadowEngineState={shadowEngineState}
                onStructureSelect={onStructureSelect}
              />
              <OrbitControls 
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                maxDistance={50}
                minDistance={5}
              />
            </Canvas>
          </div>
          
          {/* Control panel */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-blue-400" />
              <span>Firmament</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-red-400" />
              <span>Shadow Dome</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-yellow-400" />
              <span>Active Sync</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};