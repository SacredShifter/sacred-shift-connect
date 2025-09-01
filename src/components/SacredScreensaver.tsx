import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useIdleTimer } from 'react-idle-timer';
import { motion, AnimatePresence } from 'framer-motion';
import { ResonantField } from '@/screensavers/ResonantField';

interface SacredScreensaverProps {
  timeout?: number;
  enabled?: boolean;
  children: React.ReactNode;
}

export default function SacredScreensaver({ 
  timeout = 120000, 
  enabled = true, 
  children 
}: SacredScreensaverProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleExit = useCallback(() => {
    setIsActive(false);
    if (resumeRef.current) {
      resumeRef.current();
    }
  }, []);

  const resumeRef = useRef<(() => void) | null>(null);

  const { 
    getRemainingTime, 
    getLastActiveTime, 
    isIdle,
    reset,
    pause,
    resume
  } = useIdleTimer({
    timeout,
    onIdle: () => {
      if (enabled) {
        setIsActive(true);
      }
    },
    onActive: handleExit,
    onAction: handleExit,
    throttle: 500,
    crossTab: true
  });

  // Store resume function in ref to avoid dependency issues
  useEffect(() => {
    resumeRef.current = resume;
  }, [resume]);

  // Initialize after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Listen for force screensaver event
  useEffect(() => {
    const handleForceScreensaver = () => {
      if (enabled && isInitialized) {
        setIsActive(true);
      }
    };

    window.addEventListener('forceScreensaver', handleForceScreensaver);
    return () => window.removeEventListener('forceScreensaver', handleForceScreensaver);
  }, [enabled, isInitialized]);

  console.log('SacredScreensaver render:', { isActive, enabled, isInitialized });

  if (!enabled || !isInitialized) {
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
          isActive ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {children}
      </div>

      {/* Screensaver Overlay */}
      <AnimatePresence>
        {isActive && (
          <ResonantField 
            tagline="The resonance field for awakening"
            safeRadiusScale={0.25}
            onExit={handleExit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}