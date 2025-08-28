import React, { useState, useEffect, useRef } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { Canvas } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FrequencyVisuals } from './screensaver/FrequencyVisuals';
import { ParticleSystem } from './screensaver/ParticleSystem';
import { UIFragmentation } from './screensaver/UIFragmentation';

export type ScreensaverVisualType = 
  | "breath_orb" 
  | "heart_opening" 
  | "chakra_column" 
  | "galaxy_mind" 
  | "somatic_body" 
  | "energy_alignment";

export type ScreensaverPhase = "idle" | "fragmenting" | "frequency" | "reassembling";

interface SacredScreensaverProps {
  timeout?: number; // idle time in ms (default 120000 = 2 mins)
  visualType?: ScreensaverVisualType;
  enabled?: boolean;
  children: React.ReactNode;
}

export default function SacredScreensaver({ 
  timeout = 120000, 
  visualType = "breath_orb", 
  enabled = true,
  children 
}: SacredScreensaverProps) {
  const { user } = useAuth();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<ScreensaverPhase>("idle");
  const [particles, setParticles] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const sessionStartRef = useRef<Date>();

  // Idle detection
  const { getRemainingTime, getLastActiveTime } = useIdleTimer({
    timeout,
    onIdle: () => {
      if (enabled) {
        setIsActive(true);
        sessionStartRef.current = new Date();
      }
    },
    onActive: () => {
      if (isActive && phase === "frequency") {
        setPhase("reassembling");
      }
    },
    throttle: 500
  });

  // Phase lifecycle management
  useEffect(() => {
    if (!isActive || !enabled) return;

    const handlePhaseTransition = async () => {
      switch (phase) {
        case "idle":
          if (isActive) {
            setPhase("fragmenting");
          }
          break;
          
        case "fragmenting":
          // Start fragmentation animation
          setTimeout(() => {
            setPhase("frequency");
          }, 3000); // 3 second fragmentation
          break;
          
        case "frequency":
          // Log screensaver activation
          if (user) {
            await logScreensaverEvent("activated");
          }
          break;
          
        case "reassembling":
          // Start reassembly animation
          setTimeout(() => {
            setPhase("idle");
            setIsActive(false);
            if (user && sessionStartRef.current) {
              const duration = Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000);
              logScreensaverEvent("deactivated", duration);
            }
          }, 2000); // 2 second reassembly
          break;
      }
    };

    handlePhaseTransition();
  }, [isActive, phase, enabled, user]);

  // Supabase logging - TODO: Enable after screensaver_events table is approved
  const logScreensaverEvent = async (event_type: string, duration?: number) => {
    if (!user) return;
    
    try {
      // TODO: Re-enable after screensaver_events table migration is approved
      // await supabase.from("screensaver_events").insert({
      //   user_id: user.id,
      //   event_type,
      //   visual_type: visualType,
      //   duration,
      //   triggered_at: new Date().toISOString()
      // });
      console.log('Screensaver event:', { event_type, visual_type: visualType, duration });
    } catch (error) {
      console.error('Failed to log screensaver event:', error);
    }
  };

  // Handle manual exit
  const handleExit = () => {
    if (phase === "frequency") {
      setPhase("reassembling");
    }
  };

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div 
      ref={containerRef} 
      className="relative w-full h-full"
      style={{ touchAction: 'manipulation' }}
    >
      {/* Main UI Content */}
      <div 
        className={`transition-opacity duration-1000 ${
          phase === "frequency" ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {/* Screensaver Overlay */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black"
            onClick={handleExit}
            onTouchStart={handleExit}
            style={{ cursor: 'none' }}
          >
            {/* Fragmentation Layer */}
            {phase === "fragmenting" && (
              <UIFragmentation 
                containerRef={containerRef}
                onComplete={() => setPhase("frequency")}
              />
            )}

            {/* Particle System */}
            {(phase === "fragmenting" || phase === "frequency" || phase === "reassembling") && (
              <Canvas
                className="absolute inset-0"
                camera={{ position: [0, 0, 5], fov: 75 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
              >
                <ParticleSystem 
                  phase={phase}
                  particles={particles}
                  setParticles={setParticles}
                />
                
                {phase === "frequency" && (
                  <FrequencyVisuals 
                    type={visualType}
                    isActive={true}
                  />
                )}
              </Canvas>
            )}

            {/* Reassembly Layer */}
            {phase === "reassembling" && (
              <UIFragmentation 
                containerRef={containerRef}
                isReassembling={true}
                onComplete={() => {
                  setPhase("idle");
                  setIsActive(false);
                }}
              />
            )}

            {/* Exit hint (fades in after 10 seconds) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: phase === "frequency" ? 1 : 0 }}
              transition={{ delay: 10 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/30 text-sm font-light tracking-wider"
            >
              Touch or move to return
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}