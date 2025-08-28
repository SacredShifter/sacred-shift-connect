import React, { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Eye, Layers, Route, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useConstellationData } from '@/hooks/useConstellationData';
import { ConstellationNode } from './ConstellationNode';
import { CodexEntryModal } from './CodexEntryModal';
import { useCodex } from '@/hooks/useCodex';

// Connection lines between related fragments
function ConnectionLines({ entries, selectedNode, highlightedConnections }: any) {
  const connections = React.useMemo(() => {
    const lines: JSX.Element[] = [];
    
    entries.forEach((entry: any, index: number) => {
      entry.connections.forEach((connIndex: number) => {
        if (connIndex > index) { // Avoid duplicate lines
          const targetEntry = entries[connIndex];
          if (!targetEntry) return;
          
          const points = [
            new THREE.Vector3(entry.position.x, entry.position.y, entry.position.z),
            new THREE.Vector3(targetEntry.position.x, targetEntry.position.y, targetEntry.position.z)
          ];
          
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          lines.push(
            <primitive 
              key={`${index}-${connIndex}`} 
              object={new THREE.Line(
                geometry, 
                new THREE.LineBasicMaterial({ 
                  color: "#6366f1", 
                  transparent: true, 
                  opacity: 0.1 
                })
              )} 
            />
          );
        }
      });
    });
    
    return lines;
  }, [entries]);

  return (
    <group>
      {connections}
    </group>
  );
}

// Fractal pyramid outline (visible on far zoom)
function PyramidOutline({ visible }: { visible: boolean }) {
  const outlineRef = useRef<THREE.Group>(null);
  
  useFrame(({ clock }) => {
    if (!outlineRef.current || !visible) return;
    
    const time = clock.getElapsedTime();
    outlineRef.current.rotation.y = time * 0.1;
    
    // Breathing effect
    const scale = 1 + Math.sin(time * 0.5) * 0.05;
    outlineRef.current.scale.setScalar(scale);
  });

  if (!visible) return null;

  const pyramidGeometry = React.useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const size = 15;
    const height = size * Math.sqrt(3) / 2;
    
    const vertices = new Float32Array([
      // Base triangle
      0, height * 2/3, 0,
      -size/2, -height/3, 0,
      size/2, -height/3, 0,
      0, height * 2/3, 0,
      
      // Inner triangles (Sierpinski pattern)
      0, height/3, 0,
      -size/4, 0, 0,
      size/4, 0, 0,
      0, height/3, 0
    ]);
    
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geometry;
  }, []);

  return (
    <group ref={outlineRef}>
      <primitive 
        object={new THREE.Line(
          pyramidGeometry,
          new THREE.LineBasicMaterial({ 
            color: "#f59e0b", 
            transparent: true, 
            opacity: 0.4 
          })
        )}
      />
    </group>
  );
}

// Camera controller for smooth zoom transitions
function CameraController({ position, zoomLevel }: any) {
  const controlsRef = useRef<any>();
  
  useFrame(() => {
    if (!controlsRef.current) return;
    
    // Smooth camera movement
    const currentPos = controlsRef.current.object.position;
    currentPos.lerp(new THREE.Vector3(position.x, position.y, position.z), 0.05);
    
    // Adjust controls based on zoom level
    if (zoomLevel === 'far') {
      controlsRef.current.enableZoom = true;
      controlsRef.current.minDistance = 15;
      controlsRef.current.maxDistance = 35;
    } else if (zoomLevel === 'mid') {
      controlsRef.current.minDistance = 8;
      controlsRef.current.maxDistance = 20;
    } else {
      controlsRef.current.minDistance = 3;
      controlsRef.current.maxDistance = 12;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      autoRotate={zoomLevel === 'far'}
      autoRotateSpeed={0.5}
    />
  );
}

export function CodexConstellation() {
  const {
    constellationEntries,
    state,
    cameraPositions,
    loading,
    selectedEntry,
    setZoomLevel,
    selectNode,
    toggleLawOfFragments,
    togglePathMode,
    getRelatedEntries
  } = useConstellationData();
  
  const { entries, updateEntry, deleteEntry } = useCodex();
  const [hoveredEntry, setHoveredEntry] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleNodeClick = (entry: any) => {
    selectNode(entry.id);
    setIsModalOpen(true);
  };

  const handleNodeHover = (entry: any) => {
    setHoveredEntry(entry);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading constellation...</p>
        </div>
      </div>
    );
  }

  if (!constellationEntries.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="text-6xl mb-4">✨</div>
          <h3 className="text-lg font-semibold mb-2">No Fragments Yet</h3>
          <p className="text-muted-foreground">Create your first Codex entry to begin the constellation.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-black overflow-hidden">
      {/* Controls Panel */}
      <div className="absolute top-4 left-4 z-10 space-y-2">
        <Card className="bg-black/20 backdrop-blur border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">Constellation Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {/* Zoom Controls */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={state.zoomLevel === 'far' ? 'default' : 'ghost'}
                onClick={() => setZoomLevel('far')}
                className="text-xs"
              >
                <ZoomOut className="w-3 h-3 mr-1" />
                Far
              </Button>
              <Button
                size="sm"
                variant={state.zoomLevel === 'mid' ? 'default' : 'ghost'}
                onClick={() => setZoomLevel('mid')}
                className="text-xs"
              >
                <Eye className="w-3 h-3 mr-1" />
                Mid
              </Button>
              <Button
                size="sm"
                variant={state.zoomLevel === 'close' ? 'default' : 'ghost'}
                onClick={() => setZoomLevel('close')}
                className="text-xs"
              >
                <ZoomIn className="w-3 h-3 mr-1" />
                Close
              </Button>
            </div>
            
            {/* Mode Toggles */}
            <div className="flex gap-1">
              <Button
                size="sm"
                variant={state.showLawOfFragments ? 'default' : 'ghost'}
                onClick={toggleLawOfFragments}
                className="text-xs"
              >
                <Layers className="w-3 h-3 mr-1" />
                Fragments
              </Button>
              <Button
                size="sm"
                variant={state.showPathMode ? 'default' : 'ghost'}
                onClick={togglePathMode}
                className="text-xs"
              >
                <Route className="w-3 h-3 mr-1" />
                Path
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {/* Statistics */}
        <Card className="bg-black/20 backdrop-blur border-white/10">
          <CardContent className="p-3">
            <div className="text-xs text-white/80 space-y-1">
              <div>Fragments: {constellationEntries.length}</div>
              <div>Anchors: {constellationEntries.filter(e => e.isAnchor).length}</div>
              <div>Themes: {new Set(constellationEntries.map(e => e.theme)).size}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {(hoveredEntry || selectedEntry) && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="absolute top-4 right-4 z-10 w-80"
          >
            <Card className="bg-black/30 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  {hoveredEntry?.title || selectedEntry?.title}
                </CardTitle>
                <div className="flex gap-1">
                  <Badge variant="secondary" className="text-xs">
                    {hoveredEntry?.type || selectedEntry?.type}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {hoveredEntry?.theme || selectedEntry?.theme}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  <p className="text-xs text-white/80">
                    {(hoveredEntry?.content || selectedEntry?.content)?.slice(0, 200)}...
                  </p>
                </ScrollArea>
                
                {(hoveredEntry?.resonance_tags || selectedEntry?.resonance_tags)?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(hoveredEntry?.resonance_tags || selectedEntry?.resonance_tags)?.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-black/20 backdrop-blur border-white/10">
          <CardContent className="p-3">
            <div className="text-xs text-white/80 space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
                <span>Anchor Fragments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
                <span>Orbital Fragments</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-0.5 bg-indigo-400"></div>
                <span>Resonance Lines</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Three.js Constellation */}
      <Canvas
        camera={{ position: [0, 5, 25], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.8} color="#ffffff" />
          <pointLight position={[-10, -10, 5]} intensity={0.4} color="#6366f1" />
          
          {/* Stars background */}
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade />
          
          {/* Camera controls */}
          <CameraController 
            position={cameraPositions[state.zoomLevel]} 
            zoomLevel={state.zoomLevel}
          />
          
          {/* Pyramid outline (far zoom) */}
          <PyramidOutline visible={state.zoomLevel === 'far'} />
          
          {/* Connection lines */}
          <ConnectionLines 
            entries={constellationEntries}
            selectedNode={state.selectedNode}
            highlightedConnections={state.highlightedConnections}
          />
          
          {/* Constellation nodes */}
          {constellationEntries.map((entry) => (
            <ConstellationNode
              key={entry.id}
              entry={entry}
              isSelected={entry.id === state.selectedNode}
              isHighlighted={state.highlightedConnections.includes(
                constellationEntries.findIndex(e => e.id === entry.id)
              )}
              showLawOfFragments={state.showLawOfFragments}
              zoomLevel={state.zoomLevel}
              onClick={handleNodeClick}
              onHover={handleNodeHover}
            />
          ))}
          
          {/* Central pyramid text (far zoom) */}
          {state.zoomLevel === 'far' && (
            <Text
              position={[0, -8, 0]}
              fontSize={1}
              color="#f59e0b"
              anchorX="center"
              anchorY="middle"
            >
              Law of Fragments
            </Text>
          )}
        </Suspense>
      </Canvas>

      {/* Entry Modal */}
      {selectedEntry && (
        <CodexEntryModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            selectNode(null);
          }}
          onSubmit={(data) => {
            // Convert selectedEntry back to CodexEntry format for the modal
            const originalEntry = entries.find(e => e.id === selectedEntry.id);
            if (originalEntry) {
              updateEntry(selectedEntry.id, data);
            }
            setIsModalOpen(false);
            selectNode(null);
          }}
          initialData={{
            id: selectedEntry.id,
            user_id: '', // Will be filled by modal
            title: selectedEntry.title,
            content: selectedEntry.content,
            type: selectedEntry.type,
            resonance_tags: selectedEntry.resonance_tags,
            source_module: '', // Will be filled by modal
            is_private: false,
            created_at: '',
            updated_at: ''
          }}
        />
      )}
    </div>
  );
}