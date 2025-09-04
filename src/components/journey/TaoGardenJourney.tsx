import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Text, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Vector3, Group, Mesh } from 'three';
import { useTaoFlow } from '@/providers/TaoFlowProvider';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Sparkles, ArrowLeft } from 'lucide-react';
import { taoFlowConfig } from '@/config/taoFlowConfig';

// Garden Bell Component
const GardenBell: React.FC<{
  position: [number, number, number];
  module: any;
  isCompleted: boolean;
  isActive: boolean;
  onRing: () => void;
}> = ({ position, module, isCompleted, isActive, onRing }) => {
  const bellRef = useRef<Group>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isRinging, setIsRinging] = useState(false);

  useFrame(({ clock }) => {
    if (!bellRef.current) return;
    
    const time = clock.getElapsedTime();
    
    // Gentle swaying
    bellRef.current.rotation.z = Math.sin(time * 0.5) * 0.05;
    
    // Ringing animation
    if (isRinging) {
      bellRef.current.rotation.z += Math.sin(time * 20) * 0.3;
    }
    
    // Active bell pulsing
    if (isActive && !isCompleted) {
      const scale = 1 + Math.sin(time * 2) * 0.1;
      bellRef.current.scale.setScalar(scale);
    }
  });

  const handleClick = () => {
    if (!isActive) return;
    
    setIsRinging(true);
    setTimeout(() => setIsRinging(false), 1000);
    
    // Play bell sound (frequency based)
    if (typeof AudioContext !== 'undefined') {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(module.frequency || 440, audioContext.currentTime);
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 2);
    }
    
    onRing();
  };

  const bellColor = isCompleted ? '#FFD700' : isActive ? '#87CEEB' : '#8B7355';
  const emissiveIntensity = isCompleted ? 0.3 : isActive ? 0.1 : 0;

  return (
    <group 
      ref={bellRef}
      position={position}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Bell Support */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Bell */}
      <mesh position={[0, 0.3, 0]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial 
          color={bellColor}
          metalness={0.7}
          roughness={0.2}
          emissive={bellColor}
          emissiveIntensity={emissiveIntensity}
        />
      </mesh>
      
      {/* Clapper */}
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#2F4F4F" />
      </mesh>
      
      {/* Module Label */}
      {isActive && (
        <Text
          position={[0, -0.3, 0]}
          fontSize={0.08}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {module.name}
        </Text>
      )}
      
      {/* Glow Effect */}
      {(isActive || isCompleted) && (
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshBasicMaterial
            color={bellColor}
            transparent
            opacity={0.1}
          />
        </mesh>
      )}
    </group>
  );
};

// Animated Garden Elements
const GardenElements: React.FC<{ progress: number }> = ({ progress }) => {
  const groupRef = useRef<Group>(null);
  
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const time = clock.getElapsedTime();
    
    // Subtle rotation of the entire garden
    groupRef.current.rotation.y = time * 0.01;
  });

  return (
    <group ref={groupRef}>
      {/* Trees */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const radius = 4;
        return (
          <group key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            {/* Trunk */}
            <mesh position={[0, 1, 0]}>
              <cylinderGeometry args={[0.1, 0.15, 2, 8]} />
              <meshStandardMaterial color="#8B4513" />
            </mesh>
            {/* Leaves */}
            <mesh position={[0, 2.5, 0]}>
              <sphereGeometry args={[0.8, 8, 8]} />
              <meshStandardMaterial 
                color={progress > i / 8 ? '#90EE90' : '#228B22'}
                transparent
                opacity={progress > i / 8 ? 1 : 0.7}
              />
            </mesh>
          </group>
        );
      })}
      
      {/* Stone Path */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh key={i} position={[0, 0.01, i * 0.3 - 3]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.2, 8]} />
          <meshStandardMaterial 
            color="#696969"
            transparent
            opacity={progress > i / 20 ? 1 : 0.3}
          />
        </mesh>
      ))}
      
      {/* Flowers */}
      {Array.from({ length: 15 }, (_, i) => {
        const x = (Math.random() - 0.5) * 6;
        const z = (Math.random() - 0.5) * 6;
        const shouldBloom = progress > Math.random();
        
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Stem */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.01, 0.01, 0.2, 4]} />
              <meshStandardMaterial color="#228B22" />
            </mesh>
            {/* Flower */}
            {shouldBloom && (
              <mesh position={[0, 0.2, 0]}>
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial 
                  color={['#FF69B4', '#FFB6C1', '#FFA07A', '#98FB98'][i % 4]}
                  emissive={['#FF69B4', '#FFB6C1', '#FFA07A', '#98FB98'][i % 4]}
                  emissiveIntensity={0.2}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

// 3D Garden Scene
const GardenScene: React.FC<{
  modules: any[];
  completedModules: Set<string>;
  currentModule: string | null;
  onBellRing: (module: any) => void;
}> = ({ modules, completedModules, currentModule, onBellRing }) => {
  const progress = completedModules.size / modules.length;

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      
      {/* Garden Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <circleGeometry args={[8, 32]} />
        <meshStandardMaterial color="#90EE90" />
      </mesh>
      
      {/* Garden Elements */}
      <GardenElements progress={progress} />
      
      {/* Bells arranged in a spiral */}
      {modules.map((module, index) => {
        const angle = (index / modules.length) * Math.PI * 2 * 2; // Double spiral
        const radius = 1 + index * 0.2;
        const height = Math.sin(index * 0.5) * 0.5;
        
        const isCompleted = completedModules.has(module.path);
        const isActive = currentModule === module.path || 
                        (index === 0 && !currentModule) ||
                        (index > 0 && completedModules.has(modules[index - 1]?.path));
        
        return (
          <GardenBell
            key={module.path}
            position={[Math.cos(angle) * radius, height + 1, Math.sin(angle) * radius]}
            module={module}
            isCompleted={isCompleted}
            isActive={isActive}
            onRing={() => onBellRing(module)}
          />
        );
      })}
      
      {/* Environment */}
      <Environment preset="forest" />
    </>
  );
};

// Journey Reflection Modal
const JourneyReflectionModal: React.FC<{
  module: any;
  isOpen: boolean;
  onClose: () => void;
  onSaveReflection: (reflection: string) => void;
}> = ({ module, isOpen, onClose, onSaveReflection }) => {
  const [reflection, setReflection] = useState('');

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-card border border-border rounded-xl p-6 max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <Sparkles className="w-8 h-8 mx-auto mb-2 text-primary" />
          <h3 className="text-lg font-semibold">{module.name}</h3>
          <p className="text-sm text-muted-foreground">Bell has been rung! 🔔</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              What insights arose for you?
            </label>
            <textarea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="Share your reflections from this stage of the journey..."
              className="w-full p-3 border border-border rounded-lg bg-background min-h-[100px] resize-none"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1"
            >
              Continue Journey
            </Button>
            <Button 
              onClick={() => {
                onSaveReflection(reflection);
                onClose();
              }}
              className="flex-1"
              disabled={!reflection.trim()}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Save & Continue
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TaoGardenJourney: React.FC = () => {
  const navigate = useNavigate();
  const { getAllUnlockedModules, progress } = useTaoFlow();
  const [currentModule, setCurrentModule] = useState<string | null>(null);
  const [reflectionModule, setReflectionModule] = useState<any>(null);
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  // Get all available modules
  const allModules = getAllUnlockedModules().slice(0, 12); // First 12 for the garden

  const handleBellRing = (module: any) => {
    setCurrentModule(module.path);
    setReflectionModule(module);
    
    // Mark as completed
    setCompletedModules(prev => new Set([...prev, module.path]));
    
    // Navigate to module after reflection
    setTimeout(() => {
      navigate(module.path);
    }, 2000);
  };

  const handleSaveReflection = async (reflection: string) => {
    if (!reflectionModule || !reflection.trim()) return;
    
    try {
      // Save to Supabase using personal_codex_entries
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await supabase.from('personal_codex_entries').insert({
          user_id: user.id,
          title: `${reflectionModule.name} - Garden Bell Reflection`,
          content: reflection,
          entry_type: 'tao_journey',
          tags: [reflectionModule.path, progress.currentStage, 'garden_bell']
        });
      }
    } catch (error) {
      console.error('Failed to save reflection:', error);
    }
  };

  const completionPercentage = (completedModules.size / allModules.length) * 100;

  return (
    <div className="h-screen w-full relative overflow-hidden bg-gradient-to-b from-green-900/20 via-blue-900/20 to-purple-900/20">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Button variant="ghost" onClick={() => navigate('/')} className="text-white">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sacred Journey
        </Button>
        
        <Card className="bg-black/20 backdrop-blur-sm border-white/20 px-4 py-2">
          <div className="flex items-center gap-3 text-white">
            <span className="text-sm">Garden Progress</span>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {completedModules.size} / {allModules.length} bells
            </Badge>
          </div>
        </Card>
      </div>

      {/* 3D Garden */}
      <Canvas className="w-full h-full">
        <PerspectiveCamera makeDefault position={[0, 8, 8]} />
        <OrbitControls 
          enablePan={false} 
          maxDistance={15} 
          minDistance={5}
          maxPolarAngle={Math.PI / 2.2}
        />
        
        <GardenScene
          modules={allModules}
          completedModules={completedModules}
          currentModule={currentModule}
          onBellRing={handleBellRing}
        />
      </Canvas>

      {/* Ambient Sound Indicator */}
      <div className="absolute bottom-4 left-4 text-white/70 text-xs">
        🎵 Garden ambience • 🔔 Click bells to progress
      </div>

      {/* Journey Stats */}
      <div className="absolute bottom-4 right-4">
        <Card className="bg-black/20 backdrop-blur-sm border-white/20 p-3">
          <div className="text-white text-sm space-y-1">
            <div>Journey: {Math.round(completionPercentage)}% complete</div>
            <div>Stage: {progress.currentStage}</div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>{completedModules.size} insights captured</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Reflection Modal */}
      <JourneyReflectionModal
        module={reflectionModule}
        isOpen={!!reflectionModule}
        onClose={() => setReflectionModule(null)}
        onSaveReflection={handleSaveReflection}
      />
    </div>
  );
};