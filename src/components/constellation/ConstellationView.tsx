import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Group, Vector3 } from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { useTaoFlowProgress } from '@/hooks/useTaoFlowProgress';
import { generateConstellation, ConstellationNode } from '@/config/sacredGeometry';
import { ConstellationNodeMesh } from './ConstellationNodeMesh';
import { EnergyFlows } from './EnergyFlows';
import { TeachingOverlay } from './TeachingOverlay';
import { SacredBackground } from './SacredBackground';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Grid3X3, Navigation } from 'lucide-react';
import { useNavigation } from '@/providers/NavigationProvider';

interface ConstellationViewProps {
  className?: string;
}

function ConstellationScene() {
  const groupRef = useRef<Group>(null);
  const { getAllUnlockedModules, currentStage } = useTaoFlowProgress();
  const [selectedNode, setSelectedNode] = useState<ConstellationNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<ConstellationNode | null>(null);
  const [cameraTarget, setCameraTarget] = useState(new Vector3(0, 0, 0));
  const navigate = useNavigate();
  
  const constellation = useMemo(() => {
    const unlockedModules = getAllUnlockedModules();
    const unlockedPaths = new Set(unlockedModules.map(m => m.path));
    return generateConstellation(unlockedModules, unlockedPaths, currentStage);
  }, [getAllUnlockedModules, currentStage]);
  
  // Animate constellation breathing
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      const breathPhase = (Math.sin(time * 0.3) + 1) * 0.5;
      
      // Gentle breathing scale
      groupRef.current.scale.setScalar(0.9 + breathPhase * 0.1);
      
      // Subtle rotation around cosmic center
      groupRef.current.rotation.y = time * 0.01;
    }
  });
  
  const handleNodeClick = (node: ConstellationNode) => {
    if (node.isUnlocked) {
      setSelectedNode(node);
      // Navigate after a brief moment to show selection
      setTimeout(() => {
        navigate(node.module.path);
      }, 300);
    }
  };
  
  const handleNodeHover = (node: ConstellationNode | null) => {
    setHoveredNode(node);
  };
  
  return (
    <>
      {/* Sacred background */}
      <SacredBackground />
      
      {/* Main constellation */}
      <group ref={groupRef}>
        {constellation.map((node) => (
          <ConstellationNodeMesh
            key={node.module.path}
            node={node}
            isSelected={selectedNode?.module.path === node.module.path}
            isHovered={hoveredNode?.module.path === node.module.path}
            onClick={() => handleNodeClick(node)}
            onHover={handleNodeHover}
          />
        ))}
        
        {/* Energy flows between connected nodes */}
        <EnergyFlows
          nodes={constellation}
          selectedNode={selectedNode}
          hoveredNode={hoveredNode}
        />
      </group>
      
      {/* Ambient lighting */}
      <ambientLight intensity={0.3} color="#a855f7" />
      <pointLight 
        position={[0, 10, 5]} 
        intensity={0.8} 
        color="#06b6d4" 
        distance={20}
        decay={2}
      />
      <pointLight 
        position={[-5, -5, 5]} 
        intensity={0.5} 
        color="#e879f9" 
        distance={15}
        decay={2}
      />
      
      {/* Camera controller */}
      <OrbitControls 
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
        target={cameraTarget}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
      
      {/* Perspective camera */}
      <PerspectiveCamera 
        makeDefault 
        position={[0, 5, 12]}
        fov={60}
      />
    </>
  );
}

export const ConstellationView: React.FC<ConstellationViewProps> = ({ className }) => {
  const [showTeaching, setShowTeaching] = useState<string | null>(null);
  const { toggleMode } = useNavigation();
  
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Canvas container */}
      <Canvas className="w-full h-full bg-gradient-to-b from-silence via-silence to-background">
        <ConstellationScene />
      </Canvas>
      
      {/* UI Overlay */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleMode}
          className="backdrop-blur-sm bg-background/10 border-primary/20 hover:bg-primary/10"
        >
          <Grid3X3 className="w-4 h-4 mr-2" />
          Explorer Mode
        </Button>
      </div>
      
      {/* Sacred Journey Info */}
      <div className="absolute bottom-4 left-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sacred-card backdrop-blur-lg bg-background/20"
        >
          <h3 className="font-sacred text-lg text-truth mb-2">Sacred Constellation</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your consciousness unfolds like a living temple. Each practice illuminates 
            new pathways in the sacred geometry of awakening.
          </p>
          <div className="mt-3 text-xs text-primary/60">
            Click nodes to enter • Hover to explore connections
          </div>
        </motion.div>
      </div>
      
      {/* Teaching Overlay */}
      <AnimatePresence>
        {showTeaching && (
          <TeachingOverlay
            message={showTeaching}
            onComplete={() => setShowTeaching(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};