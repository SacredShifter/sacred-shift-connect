import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Eye, Layers, Route, ZoomIn, ZoomOut, RotateCcw, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FractalGeometry } from '@/utils/fractalMath';

// Collective Constellation Node Component
function CollectiveFractalNode({ entry, position, scale, onClick, isSelected }: any) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      if (isSelected) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(Date.now() * 0.003) * 0.1);
      } else {
        meshRef.current.scale.setScalar(scale);
      }
    }
  });

  const getNodeColor = (entryType: string) => {
    const colors = {
      'Sacred Teachings': '#8B5CF6',
      'Collective Dreams': '#06B6D4', 
      'Integration Patterns': '#10B981',
      'Emotional Resonance': '#F59E0B',
      'Consciousness Threads': '#EF4444',
      'Vision Prophecy': '#8B5CF6',
      'Ancient Memory': '#F97316'
    };
    return colors[entryType as keyof typeof colors] || '#8B5CF6';
  };

  return (
    <group position={[position.x, position.y, position.z]}>
      <mesh
        ref={meshRef}
        onClick={() => onClick(entry)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <tetrahedronGeometry args={[0.1 * scale]} />
        <meshPhongMaterial 
          color={getNodeColor(entry.entry_type)}
          transparent 
          opacity={hovered || isSelected ? 0.9 : 0.7}
          emissive={isSelected ? getNodeColor(entry.entry_type) : '#000000'}
          emissiveIntensity={isSelected ? 0.3 : 0}
        />
      </mesh>
      
      {/* Verification indicator for collective entries */}
      {entry.is_verified && (
        <mesh position={[0, 0.15, 0]}>
          <sphereGeometry args={[0.02]} />
          <meshBasicMaterial color="#FFD700" />
        </mesh>
      )}
      
      {(hovered || isSelected) && (
        <Text
          position={[0, 0.2, 0]}
          fontSize={0.05}
          color="#FFFFFF"
          anchorX="center"
          anchorY="middle"
        >
          {entry.title.substring(0, 30)}
        </Text>
      )}
    </group>
  );
}

// Main Collective Fractal Scene
function CollectiveFractalScene({ entries, onEntryClick, selectedEntryId }: any) {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
  const [selectedNode, setSelectedNode] = useState<string | null>(selectedEntryId);
  
  const sierpinskiEntries = React.useMemo(() => {
    const fractalGeometry = new FractalGeometry(4, 8);
    const positions = fractalGeometry.generateFractalPositions(entries.length);
    
    return entries.map((entry: any, index: number) => {
      const isAnchor = ['Sacred Teachings', 'Vision Prophecy', 'Ancient Memory'].includes(entry.entry_type);
      
      let position = positions[index] || { x: 0, y: 0, z: 0 };
      let scale = entry.resonance_rating ? 0.8 + (entry.resonance_rating / 10) * 0.8 : 1.0;
      
      if (isAnchor) {
        scale = 2.0;
      }
      
      return {
        ...entry,
        position,
        scale,
        isAnchor
      };
    });
  }, [entries]);

  const handleNodeClick = (entry: any) => {
    setSelectedNode(entry.id);
    onEntryClick(entry);
  };

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={0.5} />
      
      <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade />
      
      {/* Collective Pyramid Structure */}
      <group>
        <mesh>
          <octahedronGeometry args={[3]} />
          <meshBasicMaterial 
            color="#8B5CF6" 
            transparent 
            opacity={0.1} 
            wireframe
          />
        </mesh>
      </group>
      
      {/* Fractal Nodes */}
      {sierpinskiEntries.map((entry: any) => (
        <CollectiveFractalNode
          key={entry.id}
          entry={entry}
          position={entry.position}
          scale={entry.scale}
          onClick={handleNodeClick}
          isSelected={selectedNode === entry.id}
        />
      ))}
      
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={20}
      />
    </>
  );
}

interface CollectiveCodexConstellationProps {
  entries: any[];
  onEntryClick: (entry: any) => void;
  selectedEntryId?: string;
}

export function CollectiveCodexConstellation({ 
  entries, 
  onEntryClick, 
  selectedEntryId 
}: CollectiveCodexConstellationProps) {
  const [fragmentsMode, setFragmentsMode] = useState(false);
  const [pathMode, setPathMode] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleEntryClick = (entry: any) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
    onEntryClick(entry);
  };

  const resetView = () => {
    setFragmentsMode(false);
    setPathMode(false);
  };

  if (!entries.length) {
    return (
      <div className="h-[600px] flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Globe className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p>No collective records to display in fractal view</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Collective Fractal Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 left-4 z-20 flex gap-2"
      >
        <Button
          variant={fragmentsMode ? "default" : "outline"}
          size="sm"
          onClick={() => setFragmentsMode(!fragmentsMode)}
          className="backdrop-blur-sm bg-background/80"
        >
          <Layers className="h-4 w-4 mr-2" />
          Law of Fragments
        </Button>
        
        <Button
          variant={pathMode ? "default" : "outline"}
          size="sm"
          onClick={() => setPathMode(!pathMode)}
          className="backdrop-blur-sm bg-background/80"
        >
          <Route className="h-4 w-4 mr-2" />
          Collective Paths
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={resetView}
          className="backdrop-blur-sm bg-background/80"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset View
        </Button>
      </motion.div>

      {/* Collective Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="absolute top-4 right-4 z-20"
      >
        <Card className="bg-background/80 backdrop-blur-sm border-border/50">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <span>{entries.length} Collective Fragments</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* 3D Canvas */}
      <div className="h-[600px] w-full border rounded-lg overflow-hidden bg-gradient-to-b from-background/20 to-background/80">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 75 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <CollectiveFractalScene 
              entries={entries}
              onEntryClick={handleEntryClick}
              selectedEntryId={selectedEntryId}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Collective Entry Details Panel */}
      <AnimatePresence>
        {selectedEntry && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute right-4 top-20 w-80 max-h-[500px] z-30"
          >
            <Card className="bg-background/95 backdrop-blur border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  {selectedEntry.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{selectedEntry.entry_type}</Badge>
                  {selectedEntry.is_verified && (
                    <Badge variant="default">Verified</Badge>
                  )}
                </div>
                
                <ScrollArea className="h-32">
                  <p className="text-sm text-muted-foreground">
                    {selectedEntry.content?.substring(0, 200)}...
                  </p>
                </ScrollArea>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Resonance: {selectedEntry.resonance_rating}/10
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setSelectedEntry(null)}
                    variant="outline"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}