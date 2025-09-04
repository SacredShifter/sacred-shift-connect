import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Text, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Leaf, Globe, Wind } from 'lucide-react';

// Breathing Earth Component
const BreathingEarth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Breathing animation - slow cycle
    const breathCycle = Math.sin(time * 0.3) * 0.5 + 0.5; // 0 to 1
    const scale = 0.9 + breathCycle * 0.2; // Scale between 0.9 and 1.1
    
    if (earthRef.current) {
      earthRef.current.scale.setScalar(scale);
      earthRef.current.rotation.y = time * 0.1;
    }
    
      if (atmosphereRef.current) {
        atmosphereRef.current.scale.setScalar(scale * 1.1);
        const material = atmosphereRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + breathCycle * 0.2;
      }

    // Update breath phase
    const newPhase = breathCycle > 0.5 ? 'inhale' : 'exhale';
    if (newPhase !== breathPhase) {
      setBreathPhase(newPhase);
    }
  });

  return (
    <>
      {/* Earth Core */}
      <Sphere ref={earthRef} args={[2, 64, 64]} position={[0, 0, 0]}>
        <meshStandardMaterial
          color="#4a90e2"
          roughness={0.7}
          metalness={0.3}
        />
      </Sphere>

      {/* Atmosphere */}
      <Sphere ref={atmosphereRef} args={[2.2, 32, 32]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#87ceeb"
          transparent
          opacity={0.4}
        />
      </Sphere>

      {/* Floating Elements */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Text
          position={[0, 3, 0]}
          fontSize={0.5}
          color="#2d5a3d"
          anchorX="center"
          anchorY="middle"
        >
          {breathPhase === 'inhale' ? 'Gaia Inhales' : 'Gaia Exhales'}
        </Text>
      </Float>

      {/* Orbiting Consciousness Points */}
      {Array.from({ length: 8 }, (_, i) => (
        <Float key={i} speed={1 + i * 0.2} rotationIntensity={0.3}>
          <Sphere
            args={[0.1, 16, 16]}
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 4,
              Math.sin((i / 4) * Math.PI) * 2,
              Math.sin((i / 8) * Math.PI * 2) * 4
            ]}
          >
            <meshBasicMaterial 
              color="#90EE90" 
              transparent 
              opacity={0.8}
            />
          </Sphere>
        </Float>
      ))}

      {/* Ambient lighting */}
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4a90e2" />
    </>
  );
};

interface ReconnectionWithLivingEarthProps {
  onBack?: () => void;
}

const ReconnectionWithLivingEarth: React.FC<ReconnectionWithLivingEarthProps> = ({ onBack }) => {
  const [currentPhase, setCurrentPhase] = useState<'observe' | 'connect' | 'integrate'>('observe');
  const [breathCount, setBreathCount] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setBreathCount(prev => {
        const newCount = prev + 1;
        
        // Progress through phases
        if (newCount === 5 && currentPhase === 'observe') {
          setCurrentPhase('connect');
        } else if (newCount === 10 && currentPhase === 'connect') {
          setCurrentPhase('integrate');
        }
        
        return newCount;
      });
    }, 4000); // 4 seconds per breath cycle

    return () => clearInterval(interval);
  }, [isActive, currentPhase]);

  const handleStart = () => {
    setIsActive(true);
    setBreathCount(0);
    setCurrentPhase('observe');
  };

  const handleReset = () => {
    setIsActive(false);
    setBreathCount(0);
    setCurrentPhase('observe');
  };

  const getPhaseMessage = () => {
    switch (currentPhase) {
      case 'observe':
        return "Observe Gaia's breathing rhythm. Feel the expansion and contraction of Earth's living systems.";
      case 'connect':
        return "Connect your breath with Gaia's breath. Inhale with Earth's expansion, exhale with her contraction.";
      case 'integrate':
        return "Integrate this connection. You are part of Earth's breathing body. Feel the unity.";
      default:
        return "";
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <div className="p-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Globe className="h-8 w-8 text-green-600" />
            Gaia Breathing System
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience the living breath of our planet. Connect with Earth's natural rhythms 
            and discover your place in the greater breathing body of Gaia.
          </p>
        </motion.div>
      </div>

      {/* 3D Visualization */}
      <div className="flex-1 relative">
        <Canvas
          camera={{ position: [0, 0, 8], fov: 75 }}
          style={{ background: 'linear-gradient(135deg, #87ceeb 0%, #4a90e2 100%)' }}
        >
          <BreathingEarth />
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            maxDistance={12}
            minDistance={6}
          />
        </Canvas>

        {/* Overlay Information */}
        <div className="absolute top-4 left-4 right-4">
          <Card className="bg-white/90 backdrop-blur-sm border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    currentPhase === 'observe' ? 'bg-blue-100 text-blue-600' :
                    currentPhase === 'connect' ? 'bg-green-100 text-green-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    {currentPhase === 'observe' ? <Wind className="h-5 w-5" /> :
                     currentPhase === 'connect' ? <Heart className="h-5 w-5" /> :
                     <Leaf className="h-5 w-5" />}
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">{currentPhase} Phase</h3>
                    <p className="text-sm text-muted-foreground">
                      Breath cycles: {breathCount}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!isActive ? (
                    <Button onClick={handleStart} className="bg-green-600 hover:bg-green-700">
                      Begin Journey
                    </Button>
                  ) : (
                    <Button onClick={handleReset} variant="outline">
                      Reset
                    </Button>
                  )}
                </div>
              </div>
              
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg"
                >
                  <p className="text-sm text-foreground leading-relaxed">
                    {getPhaseMessage()}
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress Indicator */}
        {isActive && (
          <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Phase Progress</span>
                  <span className="font-medium">
                    {currentPhase === 'observe' ? `${Math.min(breathCount, 5)}/5` :
                     currentPhase === 'connect' ? `${Math.min(breathCount - 5, 5)}/5` :
                     `${Math.min(breathCount - 10, 5)}/5`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        currentPhase === 'observe' ? (Math.min(breathCount, 5) / 5) * 100 :
                        currentPhase === 'connect' ? (Math.min(breathCount - 5, 5) / 5) * 100 :
                        (Math.min(breathCount - 10, 5) / 5) * 100
                      }%`
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 flex justify-between items-center">
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back to Modules
          </Button>
        )}
        
        <div className="text-center text-sm text-muted-foreground">
          <p>Experience Earth as a living, breathing consciousness</p>
        </div>
        
        <div /> {/* Spacer */}
      </div>
    </div>
  );
};

export default ReconnectionWithLivingEarth;